from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from contextlib import asynccontextmanager
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.messages import HumanMessage, SystemMessage, trim_messages, AIMessage
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg_pool import AsyncConnectionPool
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.graph import START, MessagesState, StateGraph
from pc_vs import VectorStoreManager
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
from constants import PERSONALITIES
from rich.console import Console

load_dotenv()

# Constants and configuration
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
DB_URI = os.getenv("DB_URI")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup your resources here
    global postgres_pool, memory, langgraph_agent
    
    postgres_pool = AsyncConnectionPool(
        conninfo=DB_URI,
        max_size=20,
        kwargs={"autocommit": True, "prepare_threshold": 0}
    )
    async with postgres_pool.connection() as conn:
        memory = AsyncPostgresSaver(conn=conn)
        # langgraph_agent = create_react_agent(
        #     model=nemo_nvidia_llm,
        #     tools=[tavily],
        #     checkpointer=memory
        # )
        # # Add the function to the workflow
        workflow.add_node("model", call_model)
        workflow.add_edge(START, "model")
        langgraph_agent = workflow.compile(checkpointer=memory)
        yield
    
    # await memory.setup()
    await postgres_pool.close()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rich = Console()
tavily = TavilySearchResults(max_results=3)

# Setup workflow for LangChain
workflow = StateGraph(state_schema=MessagesState)

nemo_nvidia_llm = ChatNVIDIA(model="meta/llama-3.1-70b-instruct", api_key=NVIDIA_API_KEY).bind_tools([tavily])
pinecone_vs = VectorStoreManager()

async def call_model(state: MessagesState, config):
    trimmed_state = trim_messages(state['messages'], strategy="last", token_counter=len, 
                                  max_tokens=21, start_on="human", end_on=("human"), include_system=False)  # Gets context of last 21 messages
    user_input = trimmed_state[-1].content

    retrieved_docs = pinecone_vs.retrieve_from_vector_store(user_input, 1)
    retrieved_context = "\n".join([res.page_content for res in retrieved_docs])   

    personalityId = config["configurable"].get("personalityId")
    if personalityId == "custom_coach":
        background = config["configurable"].get("background")
        personalities = config["configurable"].get("personalities")
        gender = config["configurable"].get("gender")
        name = config["configurable"].get("name", "Coach")
    else:
        personality_data = PERSONALITIES.get(personalityId, PERSONALITIES["female_coach"])
        background = personality_data.get("Background", "")
        personalities = personality_data.get("Short Description", "")
        name = personality_data.get("Name", "")
        gender = personality_data.get("Gender", "")

    system_prompt = (
        f"You are {name} ({gender}).\nThis is your background: {background}\n"
        f"Use this as contextual information:\n{retrieved_context}\n"
        f"These are your personalities: {personalities}\n"
        "When communicating with the user, remember to stay in character."
    )

    messages = [SystemMessage(content=system_prompt)] + trimmed_state

    try:    
        response = await nemo_nvidia_llm.ainvoke(messages)
        return {"messages": response}
    except Exception as e:
        raise Exception(f"stream failed: {e}")

async def process_chunks(chunk):
    if "agent" in chunk:
        for message in chunk["agent"]["messages"]:
            if "tool_calls" in message.additional_kwargs:
                tool_calls = message.additional_kwargs["tool_calls"]
                for tool_call in tool_calls:
                    tool_name = tool_call["function"]["name"]
                    tool_arguments = eval(tool_call["function"]["arguments"])
                    tool_query = tool_arguments["query"]
                    rich.print(
                        f"\nThe agent is calling the tool [on deep_sky_blue1]{tool_name}[/on deep_sky_blue1] with the query [on deep_sky_blue1]{tool_query}[/on deep_sky_blue1]. Please wait for the agent's answer[deep_sky_blue1]...",
                        style="deep_sky_blue1",
                    )
            else:
                agent_answer = message.content
                rich.print(f"\nAgent:\n{agent_answer}", style="black on white")

@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_input = data.get("message", "")
    userid = data.get("userid", "")
    personality = data.get("personality", "bubbly_coach")
    
    if not user_input:
        return JSONResponse(content={"error": "Message is required"}, status_code=400)
    if not userid:
        return JSONResponse(content={"error": "No userid passed"}, status_code=400)

    try:
        # Stream the model response back to the client
        async def message_stream():
            config = {"configurable": {"thread_id": userid, "personality": personality}}
            
            messages = {"messages": [HumanMessage(content=user_input)]}
            
            try:
                # stream_mode should be how chunks are outputted (values = state, messages is pure content)
                async for msg, metadata in langgraph_agent.astream(messages, config=config, stream_mode="messages"):
                    yield msg.content
                
            except Exception as e:
                yield f"Error: {str(e)}"

        return StreamingResponse(message_stream(), media_type="text/plain")

    except Exception as e:
        return JSONResponse(content={"error": f"Internal server error: {str(e)}"}, status_code=500)
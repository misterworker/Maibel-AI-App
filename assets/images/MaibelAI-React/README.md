Run Dockerfile locally ->
1. cd scripts
2. docker run --env-file .env -p 8000:8000 ethandockerworker/fastapi-project:1.0.0
3. Set botApi.tsx link to http://localhost:8000/chat
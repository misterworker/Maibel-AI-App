# Use the official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /scripts

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "validation_bot:app", "--host", "0.0.0.0", "--port", "8000"]

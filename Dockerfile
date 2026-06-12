# Use a lightweight python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files (both python server files and static web files)
COPY database.py models.py schemas.py main.py ./
COPY index.html styles.css db.js app.js ./

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Command to run the unified FastAPI application serving both API and static files
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

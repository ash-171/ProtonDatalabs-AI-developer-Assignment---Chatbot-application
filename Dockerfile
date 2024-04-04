# Use official Node.js image as base for frontend
FROM node:14 AS frontend

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source code
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend ./

# Install dependencies
RUN npm install

# Build frontend
RUN npm run build

# Use official Python image as base for backend
FROM python:3.10 AS backend

# Set working directory for backend
WORKDIR /app/backend

# Copy backend source code
COPY backend/requirements.txt ./
COPY backend ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Copy built frontend to backend static files directory
COPY --from=frontend /app/frontend/build /app/backend/static

# Start the backend server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

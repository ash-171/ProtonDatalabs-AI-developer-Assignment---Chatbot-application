# Stage 1: Build frontend
FROM node:14 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build backend
FROM python:3.10 AS backend
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./

# Stage 3: Final image
FROM python:3.10 AS final
WORKDIR /app

# Copy built frontend to backend static files directory
COPY --from=frontend /app/frontend/build /app/backend/static

# Copy backend code
COPY --from=backend /app/backend /app/backend

# Expose port 8000
EXPOSE 8000

# Start the backend server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# FieldSense Backend API

This is the backend API for the FieldSense application, built with Flask and PostgreSQL.

## Features

- RESTful API for managing leads and meetings
- PostgreSQL database integration with SQLAlchemy
- CORS support for frontend integration
- Environment variable configuration
- Comprehensive error handling and validation

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL database (local or cloud-based like Neon)

### Installation

1. Clone the repository and navigate to the backend directory:
   ```
   cd fieldsense/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Update the `.env` file with your PostgreSQL connection string
   - Default configuration uses Neon PostgreSQL

### PostgreSQL Setup

1. Local PostgreSQL:
   - Install PostgreSQL on your local machine
   - Create a new database
   - Update the `DATABASE_URL` variable in your `.env` file with your connection string
   - Example: `DATABASE_URL=postgresql://username:password@localhost:5432/fieldsense`

2. Neon PostgreSQL (cloud-based):
   - The application is already configured to use Neon PostgreSQL
   - The connection string is in the `.env` file
   - You can create your own Neon database at https://neon.tech
   - Update the `DATABASE_URL` with your own connection string if needed

3. Data Migration (Optional):
   - If you have existing JSON data, use the `/api/import-data` endpoint to migrate it
   - This will import data from the local JSON files into PostgreSQL

### Running the Server

1. Start the Flask server:
   ```
   python app.py
   ```

2. The API will be available at `http://localhost:5000`

## API Documentation

### Leads Endpoints

- **GET /api/leads** - Get all leads
- **GET /api/leads/:id** - Get a lead by ID
- **POST /api/leads** - Create a new lead
- **PUT /api/leads/:id** - Update a lead
- **DELETE /api/leads/:id** - Delete a lead

### Meetings Endpoints

- **GET /api/meetings** - Get all meetings
- **GET /api/meetings/:id** - Get a meeting by ID
- **POST /api/meetings** - Create a new meeting
- **PUT /api/meetings/:id** - Update a meeting
- **DELETE /api/meetings/:id** - Delete a meeting

### Data Migration Endpoint

- **POST /api/import-data** - Import data from JSON files to PostgreSQL

### Health Check

- **GET /health** - Check API health status

## Data Structure

### Lead Object

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "leadName": "John Doe",
  "leadSource": "Website",
  "contactPhone": "1234567890",
  "contactEmail": "john@example.com",
  "companyName": "ABC Corp",
  "leadStatus": "active",
  "assignedSalesRep": "Jane Smith",
  "lastContactDate": "2023-03-15",
  "nextFollowUpDate": "2023-03-22",
  "createdAt": "2023-03-10T10:30:00",
  "updatedAt": "2023-03-10T14:45:00"
}
```

### Meeting Object

```json
{
  "id": "a47fc13b-58cc-4372-a567-0e02b2c3d123",
  "meetingTitle": "Project Discussion",
  "meetingDate": "2023-04-01",
  "meetingTime": "14:30",
  "participants": "John, Jane, Bob",
  "location": "Office Conference Room",
  "travelMode": "Car",
  "expenses": "Transportation",
  "meetingAgenda": "Discuss project timeline",
  "createdAt": "2023-03-15T09:30:00",
  "updatedAt": "2023-03-15T11:45:00"
}
```

## Deployment

### Deploying to a Cloud Platform

1. **Heroku**:
   - Create a `Procfile` with: `web: gunicorn app:app`
   - Add `gunicorn` to requirements.txt
   - Set environment variables in Heroku dashboard
   - Set the `DATABASE_URL` to your Neon PostgreSQL connection string

2. **Railway**:
   - Connect your GitHub repository
   - Set environment variables in Railway dashboard
   - Specify the start command: `python app.py`

3. **Render**:
   - Create a new Web Service
   - Set the build command: `pip install -r requirements.txt`
   - Set the start command: `gunicorn app:app`
   - Add environment variables

### Neon PostgreSQL Setup for Deployment

1. Sign up for a Neon account at https://neon.tech
2. Create a new project
3. Set up a database and user
4. Get your connection string from the connection details page
5. Add it to your deployment environment variables
6. Format: `postgresql://username:password@ep-xxxxx-xxxxx-pooler.region.aws.neon.tech/dbname?sslmode=require`

## Troubleshooting

### Common Issues

1. **ModuleNotFoundError: No module named 'flask'**
   - Make sure you have activated the virtual environment
   - Run `pip install -r requirements.txt` to install dependencies

2. **PostgreSQL Connection Errors**
   - Check your PostgreSQL connection string in the `.env` file
   - Ensure you have the correct username, password, and database name
   - For Neon: Make sure your IP is allowed in the access control settings

3. **Address already in use**
   - Change the port in the `.env` file
   - Kill the process using the port: `lsof -i :5000` (Linux/macOS) or `netstat -ano | findstr 5000` (Windows)

## License

This project is licensed under the MIT License. 
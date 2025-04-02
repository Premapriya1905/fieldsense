# FieldSense - Sales Lead & Meeting Management System

FieldSense is a comprehensive web application designed to help sales teams manage their leads and field meetings efficiently. The application provides an intuitive interface for tracking leads, scheduling meetings, and managing sales activities.

Walk Through Video - " https://drive.google.com/file/d/1MdEscv-yTjmCUs7B4HCtmZtg70Xkw3MA/view?usp=sharing "

## Features

- **Lead Management**: Create, view, update, and delete sales leads
- **Meeting Management**: Schedule and track meetings with potential clients
- **Dashboard**: Get an overview of your sales activities
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Sorting Functionality**: Sort leads and meetings by different attributes

## Tech Stack

### Frontend
- **Library**: React
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **API**: RESTful API
- **Authentication**: Token-based authentication (JWT)

## Installation

### Prerequisites
- Node.js (v16+)
- Python (3.8+)
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd fieldsense/backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/fieldsense
   SECRET_KEY=your_secret_key
   ```

5. Run the application:
   ```
   python app.py
   ```

   The backend will start on http://localhost:5000

> **Note:** A deployed version of the backend is available at https://fieldsense-yk97.onrender.com

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd fieldsense/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_API_URL=https://fieldsense.onrender.com
   ```

   > For local development with a local backend, use:
   > ```
   > VITE_API_URL=http://localhost:5000
   > ```

4. Start the development server:
   ```
   npm run dev
   ```

   The frontend will start on http://localhost:5173 (or another available port)

## API Endpoints

### Leads API
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get a specific lead
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Meetings API
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get a specific meeting
- `POST /api/meetings` - Create a new meeting
- `PUT /api/meetings/:id` - Update a meeting
- `DELETE /api/meetings/:id` - Delete a meeting

## Project Structure

```
fieldsense/
├── backend/               # Flask backend
│   ├── app.py             # Main application file
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Node dependencies
│   └── .env               # Environment variables
└── README.md              # Project documentation
```

## License

This project is licensed under the MIT License. 

## Production Deployment

For deploying the FieldSense application in a production environment, you'll need to use a WSGI server instead of Flask's built-in development server.

### Backend Deployment with Gunicorn

1. Install Gunicorn (already included in requirements.txt):
   ```
   pip install gunicorn
   ```

2. Run the application using Gunicorn:
   ```
   cd fieldsense/backend
   gunicorn wsgi:app
   ```

3. For configuring with Nginx, add a server block to your Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Deploying on Heroku

1. Make sure you have a Procfile in your project root (already provided):
   ```
   web: gunicorn wsgi:app
   ```

2. Create a Heroku app:
   ```
   heroku create fieldsense-app
   ```

3. Set environment variables:
   ```
   heroku config:set DATABASE_URL=your_postgres_url
   heroku config:set SECRET_KEY=your_secret_key
   ```

4. Deploy the application:
   ```
   git push heroku main
   ```

### Frontend Deployment

1. Build the production version of the frontend:
   ```
   cd fieldsense/frontend
   npm run build
   ```

2. The built files will be in the `dist` directory, which can be served using a static file server like Nginx, Apache, or Netlify.

3. For Netlify or Vercel deployment, simply connect your Git repository and set the build command to `npm run build` and the publish directory to `dist`. 

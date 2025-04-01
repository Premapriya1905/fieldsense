from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, DateTime, MetaData, Table, select, insert, update, delete

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL')

# Create SQLAlchemy engine and metadata
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Define tables
leads = Table(
    'leads',
    metadata,
    Column('id', String, primary_key=True),
    Column('leadName', String, nullable=False),
    Column('leadSource', String, nullable=False),
    Column('contactPhone', String, nullable=False),
    Column('contactEmail', String, nullable=False),
    Column('companyName', String, nullable=False),
    Column('leadStatus', String, nullable=False),
    Column('assignedSalesRep', String, nullable=False),
    Column('lastContactDate', String),
    Column('nextFollowUpDate', String),
    Column('createdAt', DateTime),
    Column('updatedAt', DateTime),
)

meetings = Table(
    'meetings',
    metadata,
    Column('id', String, primary_key=True),
    Column('meetingTitle', String, nullable=False),
    Column('meetingDate', String, nullable=False),
    Column('meetingTime', String, nullable=False),
    Column('participants', String, nullable=False),
    Column('location', String, nullable=False),
    Column('travelMode', String),
    Column('expenses', String),
    Column('meetingAgenda', String),
    Column('latitude', String),
    Column('longitude', String),
    Column('createdAt', DateTime),
    Column('updatedAt', DateTime),
)

# Create tables if they don't exist
metadata.create_all(engine)

# Helper functions
def generate_id():
    """Generate a unique ID"""
    return str(uuid.uuid4())

def validate_lead(lead):
    """Validate lead data"""
    required_fields = ['leadName', 'leadSource', 'contactPhone', 'contactEmail', 
                      'companyName', 'leadStatus', 'assignedSalesRep']
    
    for field in required_fields:
        if field not in lead or not lead[field]:
            return False, f"Field '{field}' is required"
    
    return True, ""

def validate_meeting(meeting):
    """Validate meeting data"""
    required_fields = ['meetingTitle', 'meetingDate', 'meetingTime', 
                      'participants', 'location']
    
    for field in required_fields:
        if field not in meeting or not meeting[field]:
            return False, f"Field '{field}' is required"
    
    return True, ""

def dict_to_model(data):
    """Filter dictionary to include only valid table columns"""
    # Remove any keys that aren't column names
    if 'id' not in data:
        data['id'] = generate_id()
    return data

def row_to_dict(row):
    """Convert SQLAlchemy row to dictionary"""
    if row is None:
        return None
    return dict(row)

# Lead API Routes
@app.route('/api/leads', methods=['GET'])
def get_leads():
    """Get all leads"""
    try:
        with engine.connect() as connection:
            query = select(leads)
            result = connection.execute(query)
            leads_list = []
            for row in result:
                lead_dict = {}
                for column in leads.columns.keys():
                    if hasattr(row, column):
                        value = getattr(row, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            lead_dict[column] = value.isoformat()
                        else:
                            lead_dict[column] = value
                    elif column in row._mapping:
                        value = row._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            lead_dict[column] = value.isoformat()
                        else:
                            lead_dict[column] = value
                leads_list.append(lead_dict)
            
            return jsonify(leads_list)
    except Exception as e:
        app.logger.error(f"Error getting leads: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/leads/<lead_id>', methods=['GET'])
def get_lead_by_id(lead_id):
    """Get a lead by ID"""
    try:
        with engine.connect() as connection:
            query = select(leads).where(leads.c.id == lead_id)
            result = connection.execute(query)
            lead = result.fetchone()
            
            if lead:
                lead_dict = {}
                for column in leads.columns.keys():
                    if hasattr(lead, column):
                        value = getattr(lead, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            lead_dict[column] = value.isoformat()
                        else:
                            lead_dict[column] = value
                    elif column in lead._mapping:
                        value = lead._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            lead_dict[column] = value.isoformat()
                        else:
                            lead_dict[column] = value
                
                return jsonify(lead_dict)
            else:
                return jsonify({"error": "Lead not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting lead {lead_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/leads', methods=['POST'])
def create_lead():
    """Create a new lead"""
    try:
        app.logger.info("Received lead creation request")
        lead = request.json
        app.logger.info(f"Received lead data: {lead}")
        
        # Validate lead data
        is_valid, error_msg = validate_lead(lead)
        if not is_valid:
            app.logger.error(f"Lead validation failed: {error_msg}")
            return jsonify({"error": error_msg}), 400
        
        # Add metadata
        lead['id'] = generate_id()
        lead['createdAt'] = datetime.now()
        app.logger.info(f"Lead ID assigned: {lead['id']}")
        
        # Insert into database
        with engine.connect() as connection:
            # Create a copy of the lead data with only the columns defined in the table
            lead_data = {}
            for column in leads.columns.keys():
                if column in lead:
                    # Ensure dates are properly formatted
                    if isinstance(lead[column], datetime):
                        lead_data[column] = lead[column]
                    else:
                        lead_data[column] = lead.get(column)
            
            app.logger.info(f"Filtered lead data for database: {lead_data}")
            
            # Insert the filtered data
            app.logger.info("Executing database insert")
            query = insert(leads).values(**lead_data)
            connection.execute(query)
            connection.commit()
            app.logger.info("Database insert committed")
            
            # Retrieve the inserted lead
            app.logger.info("Retrieving created lead")
            select_query = select(leads).where(leads.c.id == lead['id'])
            result = connection.execute(select_query)
            created_lead = result.fetchone()
            
            if created_lead:
                app.logger.info("Converting lead to dictionary")
                # Convert the SQLAlchemy row to a dictionary
                created_lead_dict = {}
                for column in leads.columns.keys():
                    if hasattr(created_lead, column):
                        value = getattr(created_lead, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            created_lead_dict[column] = value.isoformat()
                        else:
                            created_lead_dict[column] = value
                    elif column in created_lead._mapping:
                        value = created_lead._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            created_lead_dict[column] = value.isoformat()
                        else:
                            created_lead_dict[column] = value
                
                app.logger.info("Lead created successfully")
                return jsonify(created_lead_dict), 201
            else:
                app.logger.error("Failed to retrieve created lead")
                return jsonify({"error": "Failed to retrieve created lead"}), 500
    except Exception as e:
        app.logger.error(f"Error creating lead: {str(e)}")
        app.logger.exception("Detailed exception information:")
        return jsonify({"error": str(e)}), 500

@app.route('/api/leads/<lead_id>', methods=['PUT'])
def update_lead(lead_id):
    """Update an existing lead"""
    try:
        updated_lead = request.json
        
        # Validate lead data
        is_valid, error_msg = validate_lead(updated_lead)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Add updatedAt timestamp
        updated_lead['updatedAt'] = datetime.now()
        
        # Update in database
        with engine.connect() as connection:
            # Check if lead exists
            check_query = select(leads).where(leads.c.id == lead_id)
            check_result = connection.execute(check_query)
            if not check_result.fetchone():
                return jsonify({"error": "Lead not found"}), 404
            
            # Create a copy of the lead data with only the columns defined in the table
            lead_data = {}
            for column in leads.columns.keys():
                if column in updated_lead:
                    # Ensure dates are properly formatted
                    if isinstance(updated_lead[column], datetime):
                        lead_data[column] = updated_lead[column]
                    else:
                        lead_data[column] = updated_lead.get(column)
            
            # Update lead
            query = update(leads).where(leads.c.id == lead_id).values(**lead_data)
            connection.execute(query)
            connection.commit()
            
            # Retrieve the updated lead
            select_query = select(leads).where(leads.c.id == lead_id)
            result = connection.execute(select_query)
            updated_lead_result = result.fetchone()
            
            if updated_lead_result:
                # Convert the SQLAlchemy row to a dictionary
                updated_lead_dict = {}
                for column in leads.columns.keys():
                    if hasattr(updated_lead_result, column):
                        value = getattr(updated_lead_result, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            updated_lead_dict[column] = value.isoformat()
                        else:
                            updated_lead_dict[column] = value
                    elif column in updated_lead_result._mapping:
                        value = updated_lead_result._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            updated_lead_dict[column] = value.isoformat()
                        else:
                            updated_lead_dict[column] = value
                
                return jsonify(updated_lead_dict)
            else:
                return jsonify({"error": "Failed to retrieve updated lead"}), 500
    except Exception as e:
        app.logger.error(f"Error updating lead {lead_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/leads/<lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    """Delete a lead"""
    try:
        with engine.connect() as connection:
            # Check if lead exists
            check_query = select(leads).where(leads.c.id == lead_id)
            check_result = connection.execute(check_query)
            if not check_result.fetchone():
                return jsonify({"error": "Lead not found"}), 404
            
            # Delete lead
            query = delete(leads).where(leads.c.id == lead_id)
            connection.execute(query)
            connection.commit()
            
            return jsonify({"message": "Lead deleted successfully"})
    except Exception as e:
        app.logger.error(f"Error deleting lead {lead_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Meeting API Routes
@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    """Get all meetings"""
    try:
        with engine.connect() as connection:
            query = select(meetings)
            result = connection.execute(query)
            meetings_list = []
            for row in result:
                meeting_dict = {}
                for column in meetings.columns.keys():
                    if hasattr(row, column):
                        value = getattr(row, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            meeting_dict[column] = value.isoformat()
                        else:
                            meeting_dict[column] = value
                    elif column in row._mapping:
                        value = row._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            meeting_dict[column] = value.isoformat()
                        else:
                            meeting_dict[column] = value
                meetings_list.append(meeting_dict)
            
            return jsonify(meetings_list)
    except Exception as e:
        app.logger.error(f"Error getting meetings: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/meetings/<meeting_id>', methods=['GET'])
def get_meeting_by_id(meeting_id):
    """Get a meeting by ID"""
    try:
        with engine.connect() as connection:
            query = select(meetings).where(meetings.c.id == meeting_id)
            result = connection.execute(query)
            meeting = result.fetchone()
            
            if meeting:
                meeting_dict = {}
                for column in meetings.columns.keys():
                    if hasattr(meeting, column):
                        value = getattr(meeting, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            meeting_dict[column] = value.isoformat()
                        else:
                            meeting_dict[column] = value
                    elif column in meeting._mapping:
                        value = meeting._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            meeting_dict[column] = value.isoformat()
                        else:
                            meeting_dict[column] = value
                
                return jsonify(meeting_dict)
            else:
                return jsonify({"error": "Meeting not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting meeting {meeting_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/meetings', methods=['POST'])
def create_meeting():
    """Create a new meeting"""
    try:
        meeting = request.json
        
        # Validate meeting data
        is_valid, error_msg = validate_meeting(meeting)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Add metadata
        meeting['id'] = generate_id()
        meeting['createdAt'] = datetime.now()
        
        # Insert into database
        with engine.connect() as connection:
            # Create a copy of the meeting data with only the columns defined in the table
            meeting_data = {}
            for column in meetings.columns.keys():
                if column in meeting:
                    # Ensure dates are properly formatted
                    if isinstance(meeting[column], datetime):
                        meeting_data[column] = meeting[column]
                    else:
                        meeting_data[column] = meeting.get(column)
            
            # Insert the filtered data
            query = insert(meetings).values(**meeting_data)
            connection.execute(query)
            connection.commit()
            
            # Retrieve the inserted meeting
            select_query = select(meetings).where(meetings.c.id == meeting['id'])
            result = connection.execute(select_query)
            created_meeting = result.fetchone()
            
            if created_meeting:
                # Convert the SQLAlchemy row to a dictionary
                created_meeting_dict = {}
                for column in meetings.columns.keys():
                    if hasattr(created_meeting, column):
                        value = getattr(created_meeting, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            created_meeting_dict[column] = value.isoformat()
                        else:
                            created_meeting_dict[column] = value
                    elif column in created_meeting._mapping:
                        value = created_meeting._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            created_meeting_dict[column] = value.isoformat()
                        else:
                            created_meeting_dict[column] = value
                
                return jsonify(created_meeting_dict), 201
            else:
                return jsonify({"error": "Failed to retrieve created meeting"}), 500
    except Exception as e:
        app.logger.error(f"Error creating meeting: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/meetings/<meeting_id>', methods=['PUT'])
def update_meeting(meeting_id):
    """Update an existing meeting"""
    try:
        updated_meeting = request.json
        
        # Validate meeting data
        is_valid, error_msg = validate_meeting(updated_meeting)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Add updatedAt timestamp
        updated_meeting['updatedAt'] = datetime.now()
        
        # Update in database
        with engine.connect() as connection:
            # Check if meeting exists
            check_query = select(meetings).where(meetings.c.id == meeting_id)
            check_result = connection.execute(check_query)
            if not check_result.fetchone():
                return jsonify({"error": "Meeting not found"}), 404
            
            # Create a copy of the meeting data with only the columns defined in the table
            meeting_data = {}
            for column in meetings.columns.keys():
                if column in updated_meeting:
                    # Ensure dates are properly formatted
                    if isinstance(updated_meeting[column], datetime):
                        meeting_data[column] = updated_meeting[column]
                    else:
                        meeting_data[column] = updated_meeting.get(column)
            
            # Update meeting
            query = update(meetings).where(meetings.c.id == meeting_id).values(**meeting_data)
            connection.execute(query)
            connection.commit()
            
            # Retrieve the updated meeting
            select_query = select(meetings).where(meetings.c.id == meeting_id)
            result = connection.execute(select_query)
            updated_meeting_result = result.fetchone()
            
            if updated_meeting_result:
                # Convert the SQLAlchemy row to a dictionary
                updated_meeting_dict = {}
                for column in meetings.columns.keys():
                    if hasattr(updated_meeting_result, column):
                        value = getattr(updated_meeting_result, column)
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            updated_meeting_dict[column] = value.isoformat()
                        else:
                            updated_meeting_dict[column] = value
                    elif column in updated_meeting_result._mapping:
                        value = updated_meeting_result._mapping[column]
                        # Convert datetime objects to ISO format strings
                        if isinstance(value, datetime):
                            updated_meeting_dict[column] = value.isoformat()
                        else:
                            updated_meeting_dict[column] = value
                
                return jsonify(updated_meeting_dict)
            else:
                return jsonify({"error": "Failed to retrieve updated meeting"}), 500
    except Exception as e:
        app.logger.error(f"Error updating meeting {meeting_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/meetings/<meeting_id>', methods=['DELETE'])
def delete_meeting(meeting_id):
    """Delete a meeting"""
    try:
        with engine.connect() as connection:
            # Check if meeting exists
            check_query = select(meetings).where(meetings.c.id == meeting_id)
            check_result = connection.execute(check_query)
            if not check_result.fetchone():
                return jsonify({"error": "Meeting not found"}), 404
            
            # Delete meeting
            query = delete(meetings).where(meetings.c.id == meeting_id)
            connection.execute(query)
            connection.commit()
            
            return jsonify({"message": "Meeting deleted successfully"})
    except Exception as e:
        app.logger.error(f"Error deleting meeting {meeting_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Import data from JSON to PostgreSQL (used for initial migration)
@app.route('/api/import-data', methods=['POST'])
def import_data():
    """Import data from JSON files to PostgreSQL"""
    try:
        import json
        import os
        
        # Check if data directory exists
        DATA_DIR = os.getenv('DATA_DIR', 'data')
        LEADS_FILE = os.path.join(DATA_DIR, 'leads.json')
        MEETINGS_FILE = os.path.join(DATA_DIR, 'meetings.json')
        
        result = {"leads": 0, "meetings": 0}
        
        # Import leads
        if os.path.exists(LEADS_FILE):
            with open(LEADS_FILE, 'r') as f:
                leads_data = json.load(f)
                if leads_data:
                    with engine.connect() as connection:
                        for lead in leads_data:
                            # Make sure ID exists
                            if 'id' not in lead:
                                lead['id'] = generate_id()
                            # Add timestamps if not present
                            if 'createdAt' not in lead:
                                lead['createdAt'] = datetime.now()
                            
                            # Create a copy of the lead data with only the columns defined in the table
                            lead_data = {}
                            for column in leads.columns.keys():
                                if column in lead:
                                    # Ensure dates are properly formatted
                                    if isinstance(lead[column], datetime):
                                        lead_data[column] = lead[column]
                                    else:
                                        lead_data[column] = lead.get(column)
                            
                            query = insert(leads).values(**lead_data)
                            connection.execute(query)
                        
                        connection.commit()
                        result["leads"] = len(leads_data)
        
        # Import meetings
        if os.path.exists(MEETINGS_FILE):
            with open(MEETINGS_FILE, 'r') as f:
                meetings_data = json.load(f)
                if meetings_data:
                    with engine.connect() as connection:
                        for meeting in meetings_data:
                            # Make sure ID exists
                            if 'id' not in meeting:
                                meeting['id'] = generate_id()
                            # Add timestamps if not present
                            if 'createdAt' not in meeting:
                                meeting['createdAt'] = datetime.now()
                            
                            # Create a copy of the meeting data with only the columns defined in the table
                            meeting_data = {}
                            for column in meetings.columns.keys():
                                if column in meeting:
                                    # Ensure dates are properly formatted
                                    if isinstance(meeting[column], datetime):
                                        meeting_data[column] = meeting[column]
                                    else:
                                        meeting_data[column] = meeting.get(column)
                            
                            query = insert(meetings).values(**meeting_data)
                            connection.execute(query)
                        
                        connection.commit()
                        result["meetings"] = len(meetings_data)
        
        return jsonify({"message": "Data imported successfully", "counts": result})
    except Exception as e:
        app.logger.error(f"Error importing data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Server health check
@app.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "database": "PostgreSQL"
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    app.run(debug=debug, port=port) 
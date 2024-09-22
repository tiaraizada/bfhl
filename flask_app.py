from flask import Flask, request, jsonify
import base64
import os

app = Flask(__name__)

# Helper function to process data
def extract_data(data):
    numbers = [item for item in data if item.isdigit()]
    alphabets = [item for item in data if item.isalpha()]
    highest_lowercase = sorted([ch for ch in alphabets if ch.islower()])[-1:] if alphabets else []
    return numbers, alphabets, highest_lowercase

# Helper function to validate and handle the file
def validate_file(file_b64):
    if not file_b64:
        return False, None, None
    try:
        file_data = base64.b64decode(file_b64)
        file_size_kb = len(file_data) / 1024
        # Here, you can check the MIME type if necessary
        mime_type = "application/octet-stream"  # Placeholder, use a library to detect MIME
        return True, mime_type, round(file_size_kb, 2)
    except Exception:
        return False, None, None

# POST method - Main processing route
@app.route('/bfhl', methods=['POST'])
def post_bfhl():
    req_data = request.get_json()
    data = req_data.get('data', [])
    file_b64 = req_data.get('file_b64', None)

    # Process data
    numbers, alphabets, highest_lowercase = extract_data(data)

    # Process file
    file_valid, file_mime_type, file_size_kb = validate_file(file_b64)

    # Prepare response
    response = {
        "is_success": True,
        "user_id": "your_name_ddmmyyyy",  # Format this as per your name and birthdate
        "email": "your_email@example.com",
        "roll_number": "ABCD123",
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highest_lowercase,
        "file_valid": file_valid,
        "file_mime_type": file_mime_type,
        "file_size_kb": file_size_kb
    }

    return jsonify(response)

# GET method - Returns operation code
@app.route('/bfhl', methods=['GET'])
def get_bfhl():
    return jsonify({"operation_code": 1}), 200

@app.route('/')
def home():
    return "Hello, Flask is running!"

if __name__ == '__main__':
    app.run(debug=True)

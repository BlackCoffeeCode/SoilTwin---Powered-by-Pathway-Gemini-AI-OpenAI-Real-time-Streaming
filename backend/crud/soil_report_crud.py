from ..database import db
from bson import ObjectId
from datetime import datetime

def create_soil_report(user_id, filename, s3_url, uploaded_at):
    collection = db["soil_reports"]
    report = {
        "user_id": ObjectId(user_id) if isinstance(user_id, str) else user_id,
        "filename": filename,
        "s3_url": s3_url,
        "uploaded_at": uploaded_at,
        "status": "pending"
    }
    return collection.insert_one(report)

def get_reports_by_user(user_id):
    collection = db["soil_reports"]
    cursor = collection.find({"user_id": ObjectId(user_id)}).sort("uploaded_at", -1)
    return list(cursor)

def get_report_by_id(report_id):
    collection = db["soil_reports"]
    return collection.find_one({"_id": ObjectId(report_id)})

def update_report_status(report_id, status):
    collection = db["soil_reports"]
    return collection.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": {"status": status}}
    )

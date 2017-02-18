from pymongo import MongoClient
import os

def get_db():
    client = MongoClient(os.environ['MONGODB_URI'])
    db = client.get_default_database()
    return db

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter, Or

cred = credentials.Certificate("Your Credential certificate")
firebase_admin.initialize_app(cred)

db = firestore.client()


def get_daily_track(uid,date):
    try:
        doc_ref = db.collection("daily_track")
        query=doc_ref.where(filter=FieldFilter('Calories',"==","24-08-2024"))
        docs=query.stream()
        for doc in docs:
            data=doc.to_dict()
            print("Document data",data)
    except Exception as e:
        print("erroe")



def delete_document(collection_name,document_id):
    try:
        doc_ref = db.collection(collection_name).document(document_id)
        doc_ref.delete()
    except Exception as e:
        print("error")
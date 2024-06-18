import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.transforms import DELETE_FIELD
import datetime

# Initialize Firebase Admin SDK
cred = credentials.Certificate("Your Credential certificate")
firebase_admin.initialize_app(cred)

db = firestore.client()


def user_info_store(uid, user_name, user_email, weight, height, age, gender, activity, sleep_start, sleep_end,
                    diet_type, region, bmi, bmr, daily_calories):
    user_doc_ref = db.collection("user_info").document(uid)
    user_doc_ref.set({
        'username': user_name,
        'email': user_email,
        'weight': weight,
        'height': height,
        'age': age,
        'gender': gender,
        'activity': activity,
        'sleep_start': sleep_start,
        'sleep_end': sleep_end,
        'diet_type': diet_type,
        'region': region,
        'BMI': bmi,
        'BMR': bmr,
        'needed_calories': daily_calories,
    })


def create_user(mail, psw):
    try:
        user = auth.create_user(
            email=mail,
            password=psw
        )
        print('Successfully created user: {0}'.format(user.uid))
        return user.uid
    except auth.EmailAlreadyExistsError as e:
        print('Error creating user: {0}'.format(e))


def get_user_details(user_id):
    doc_ref = db.collection("user_info").document(user_id)
    print(doc_ref)
    doc = doc_ref.get()
    print(doc)
    if doc.exists:
        return doc.to_dict()
    else:
        print("Document not found")


def store_daily_meal_plan(uid, meal_plan):
    adjusted_data = {}

    try:
        for meal_key, meal in meal_plan.items():
            # Split the comma-separated ingredients string into a list
            ingredients = [ingredient.strip() for ingredient in meal["Ingredients"].split(',')]
            # Split the instructions string into a list of instructions
            instructions = [instruction.strip() for instruction in meal["Instructions"]]
            adjusted_data[meal_key] = {
                "MealType": meal_key,
                "Time": meal["Time"],
                "FoodName": meal["Food Name"],
                "Calories": meal["Calories"],
                "Macros": meal["Macros"],
                "Ingredients": ingredients,
                "Instructions": instructions
            }

        today = datetime.date.today().strftime("%d-%m-%Y")
        user_doc_ref = db.collection("meal_plan").document(uid)
        user_doc_ref.set({today: adjusted_data})
        print("Daily meal plan stored successfully!")

    except Exception as e:
        print("Error:", e)
        print("Failed to process the meal plan.")


def get_meal_plan(uid):
    meal_type = []
    time = []
    food_name = []
    calories = []
    proteins = []
    fats = []
    carbs = []
    ingredients = []
    instructions = []
    try:
        today = datetime.date.today().strftime("%d-%m-%Y")
        doc_ref = db.collection("meal_plan").document(uid)
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            print(data)
            if today in data:
                meal_plan = data[today]
                # Iterate over meal plan items and append them dynamically
                for meal_type_key, meal_details in meal_plan.items():
                    meal_type.append(meal_details["MealType"])
                    time.append(meal_details.get("Time", ""))
                    food_name.append(meal_details["FoodName"])
                    calories.append(meal_details["Calories"])
                    macros = meal_details.get("Macros", {})
                    proteins.append(macros.get("Protein", ""))
                    fats.append(macros.get("Fat", ""))
                    carbs.append(macros.get("Carbs", ""))
                    ingredients.append(", ".join(meal_details.get("Ingredients", [])))
                    instructions.append("\n".join(meal_details.get("Instructions", [])))
            else:
                print("No meal plan available for today.")
        else:
            print("Document not found for UID:", uid)
    except Exception as e:
        print("Error:", e)
    return meal_type, time, food_name, calories, proteins, fats, carbs, ingredients, instructions


def user_daily_track(uid, date, meal_data):
    # Construct the document reference
    doc_ref = db.collection("daily_track").document(uid)

    # Check if the document already exists
    doc = doc_ref.get()
    if doc.exists:
        # Get the existing data
        existing_data = doc.to_dict()
        if date in existing_data:
            # Date data already exists, append the meal data
            existing_meal_data = existing_data[date]
            if isinstance(existing_meal_data, dict):
                # Append the meal data under the date
                existing_meal_data.update(meal_data)
                doc_ref.update({date: existing_meal_data})
                print(f"Appended meal data to existing document for user {uid} on {date}")
            else:
                print(f"Unexpected data structure for date {date} in document for user {uid}")
        else:
            # Add the meal data for the new date
            doc_ref.update({date: meal_data})
            print(f"Appended new date with meal data for user {uid} on {date}")
    else:
        # Create a new document with the meal data for the current date
        doc_ref.set({date: meal_data})
        print(f"Created new document with meal data for user {uid} on {date}")




def get_user_daily_track(uid):
    try:
        date = datetime.date.today().strftime("%d-%m-%Y")
        # Construct the document reference
        doc_ref = db.collection("daily_track").document(uid)

        # Check if the document exists
        doc = doc_ref.get()

        if doc.exists:
            # Get the existing data
            existing_data = doc.to_dict()

            if date in existing_data:
                # Return the meal data for the current date
                meal_data = existing_data[date]
                return meal_data
            else:
                print("No meal data available for the current date.")
        else:
            print("Document not found for UID:", uid)
    except Exception as e:
        print("Error:", e)
        return None


def delete_meal_from_meal_plan(uid, meal_key):
    try:
        # Get the meal plan document reference
        meal_plan_ref = db.collection("meal_plan").document(uid)

        # Update the meal plan document to delete the specified meal
        meal_plan_ref.update({
            meal_key: DELETE_FIELD
        })

        print("Meal deleted from the meal plan.")
    except Exception as e:
        print("Error:", e)







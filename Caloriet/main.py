from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from authentication import (create_user, user_info_store, store_daily_meal_plan, get_meal_plan, user_daily_track,
                            get_user_daily_track, get_user_details, delete_meal_from_meal_plan)
from meal_recommend_ai import meal_plan
from datetime import datetime

app = Flask(__name__)


#


@app.route("/")
def landing_page():
    return render_template("/landing_page.html", heading="", message="")


@app.route("/recipe")
def recipe_page():
    uid = request.args.get("uid")
    return render_template("/recipe_recommend.html", uid=uid)


@app.route("/login")
def login_page():
    return render_template("/sign_in_log_in_form.html")


@app.route("/report")
def report_page():
    return render_template("/report.html")


@app.route("/mealplan")
def meal_plan_page():
    uid = request.args.get("uid")  # Retrieve UID from URL query parameter
    # Use UID in your Python code
    meal = get_meal_plan(uid)
    # Unpack the meal data
    meal_type, time, food_name, calories, proteins, fats, carbs, ingredients, instructions = meal

    # Define custom sorting order for meal types
    custom_order = {'Breakfast': 1, 'Mid-Morning Snack': 2, 'Lunch': 3, 'Evening Snack': 4, 'Dinner': 5}

    # Sort the meal data based on custom sorting order
    meal_data = sorted(zip(meal_type, time, food_name, calories, proteins, fats, carbs, ingredients, instructions),
                       key=lambda x: custom_order.get(x[0], float('inf')))

    return render_template("/recommendation_meal.html",
                           uid=uid, meal_data=meal_data)


@app.route('/update_meal', methods=['POST'])
def update_meal():
    data = request.json
    uid = data['uid']
    date = data['date']
    meal_data = data['mealData']
    print(meal_data)

    # Convert meal_data from list to dictionary
    meal_dict = {
        meal_data[0]: {
            'MealType': meal_data[0],
            'Time': meal_data[1],
            'FoodName': meal_data[2],
            'Calories': meal_data[3],
            'Macros': {
                'Protein': meal_data[4],
                'Fat': meal_data[5],
                'Carbs': meal_data[6]
            },
            'Ingredients': meal_data[7],
            'Instructions': meal_data[8]
        }
    }

    # Call user_daily_track function to store the data in Firebase
    user_daily_track(uid, date, meal_dict)
    delete_meal_from_meal_plan(uid, meal_data[0])

    # Return a JSON response indicating success
    return jsonify({'message': 'Meal data added successfully'}), 200


# @app.route("/diettrack")
# def diet_track_page():
#     uid = request.args.get("uid")
#     data = get_user_details(uid)
#     age = data["age"]
#     name = data["username"]
#     weight = data["weight"]
#     height = data["height"]
#     data = get_user_daily_track(uid)
#     # data = data[0]
#     # mealtype = data['MealType']
#     # foodname = data['FoodName']
#     # calories = data['Calories']
#     return render_template("/diet_track.html", uid=uid, name=name.capitalize(), age=age,
#                            height=height, weight=weight,data=data)

@app.route("/diettrack")
def diet_track_page():
    uid = request.args.get("uid")
    data = get_user_details(uid)
    age = data["age"]
    name = data["username"]
    weight = data["weight"]
    height = data["height"]
    # Retrieve meal data for the user
    meal_data = get_user_daily_track(uid)
    print(meal_data)
    return render_template("/diet_track.html", uid=uid, name=name.capitalize(), age=age,
                           height=height, weight=weight, meal_data=meal_data)


@app.route("/bmr")
def bmr_page():
    return render_template("/bmr.html")


@app.route('/submit', methods=['POST'])
def submit_health_condition():
    health_condition = request.form.get('healthCondition')
    print(health_condition)
    if health_condition == 'yes':
        return render_template("/landing_page.html", heading="Apologize for the inconvenience",
                               message="Sorry this website currently serves for healthy people only!")
    else:
        user_name = request.form.get('username')
        user_email = request.form.get('email')
        user_password = request.form.get('password')
        uid = create_user(mail=user_email, psw=user_password)
        session['user_name'] = user_name
        session['user_email'] = user_email
        session['uid'] = uid

        return render_template("/bmr.html")


def calculate_bmi(weight, height):
    # BMI formula: weight (kg) / (height (m))^2
    return weight / ((height / 100) ** 2)


def calculate_bmr(weight, height, age, gender):
    # BMR formulas based on gender
    if gender == 'male':
        # BMR formula for males: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) + 5
        return 10 * weight + 6.25 * height - 5 * age + 5
    elif gender == 'female':
        # BMR formula for females: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) - 161
        return 10 * weight + 6.25 * height - 5 * age - 161


def calculate_daily_calories(bmr, activity_level):
    # Activity level multipliers
    activity_multipliers = {
        '1.2': 1.2,  # Little to no exercise
        '1.375': 1.375,  # Light exercise (1-3 days per week)
        '1.55': 1.55,  # Moderate exercise (3-5 days per week)
        '1.725': 1.725,  # Heavy exercise (6-7 days per week)
        '2': 2  # Very heavy exercise (twice per day, extra heavy workouts)
    }
    # Calculate daily calories needed
    return bmr * activity_multipliers.get(activity_level)


@app.route('/userinfo', methods=['POST'])
def user_info():
    user_name = session.get('user_name')
    user_email = session.get('user_email')
    uid = session.get('uid')

    weight = float(request.form['weight'])
    height = float(request.form['height'])
    age = int(request.form['age'])
    gender = request.form['gender']
    activity = request.form['activity']
    wakeup = request.form['wakeup']
    sleeptime = request.form['sleeptime']
    diet_type = request.form['dietType']
    region = request.form['region']

    bmi = calculate_bmi(weight, height)
    bmr = calculate_bmr(weight, height, age, gender)
    daily_calories = calculate_daily_calories(bmr, activity)

    meal = meal_plan(wake_up=wakeup, sleep_time=sleeptime, diet_type=diet_type, calories_needed=daily_calories,
                     region=region)
    store_daily_meal_plan(uid, meal)
    user_info_store(uid=uid, user_name=user_name, weight=weight, height=height, age=age, gender=gender,
                    activity=activity, sleep_start=wakeup, sleep_end=sleeptime, region=region,
                    diet_type=diet_type, user_email=user_email, bmi=bmi, bmr=bmr, daily_calories=daily_calories)

    return redirect(url_for('meal_plan_page', uid=uid))


if __name__ == "__main__":
    app.run(port=8000, debug=True)

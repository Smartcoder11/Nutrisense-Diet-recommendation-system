function calculateBMI() {
    var weight = parseFloat(document.getElementById('weight').value);
    var height = parseFloat(document.getElementById('height').value);
    var bmi = weight / ((height / 100) * (height / 100));
    var bmiResult = document.getElementById('bmiResult');
    bmiResult.style.display = 'block';
    var bmiMessage;
    
    if (bmi < 18.5) {
        bmiMessage = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiMessage = 'Healthy Weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
        bmiMessage = 'Overweight';
    } else {
        bmiMessage = 'Obese';
    }
    
    bmiResult.innerHTML = '<h3>BMI Result:</h3><p>' + bmi.toFixed(2) + ' - ' + bmiMessage + '</p>';
}


function calculateBMR() {
    var age = parseInt(document.getElementById('age').value);
    var gender = document.getElementById('gender').value;
    var weight = parseFloat(document.getElementById('weight').value);
    var height = parseFloat(document.getElementById('height').value);
    
    var bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    var bmrResult = document.getElementById('bmrResult');
    bmrResult.style.display = 'block';
    bmrResult.innerHTML = '<h3>BMR Result:</h3><p>' + bmr.toFixed(2) + ' calories</p>';
}

function calculateCalories() {
    var activityElement = document.getElementById('activity');
    var caloriesResult = document.getElementById('caloriesResult');
    var sleepScheduleDiv = document.getElementById('sleepSchedule');

    // Check if all required elements exist
    if (!activityElement || !caloriesResult || !sleepScheduleDiv) {
        console.error("One or more required elements not found.");
        return;
    }
    
    var activity = parseFloat(activityElement.value);
    var age = parseInt(document.getElementById('age').value);
    var gender = document.getElementById('gender').value;
    var weight = parseFloat(document.getElementById('weight').value);
    var height = parseFloat(document.getElementById('height').value);

    var bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    var calories = bmr * activity;
    caloriesResult.style.display = 'block';
    caloriesResult.innerHTML = '<h3>Calories Result:</h3><p>' + calories.toFixed(2) + ' calories</p>';

    // Show the sleep schedule div
    sleepScheduleDiv.style.display = 'block';
}




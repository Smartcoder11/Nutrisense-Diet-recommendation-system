const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const dietTypeSelect = document.getElementById('dietTypeSelect');

const fetchRecipes = async (query, dietType) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        // Check if the query is empty after trimming
        if (!query.trim()) {
            recipeContainer.innerHTML = `<h2>Please enter ingredients to search for.</h2>`;
            return;
        }
        const userIngredients = query.split(',').map(ingredient => ingredient.trim().toLowerCase());
        
        const response = await fetch(`https://script.google.com/macros/s/AKfycbxoo3JXtNqPtRz98CqZBgnr0b0dXnwy-UJ0YGzy9Eadlkotf0Dr0LXu-chrYVlu9IN2/exec`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.data) {
            throw new Error('No data found in the response');
        }

        const matchingRecipes = data.data.filter(recipe => {
            // Handle missing Ingredients gracefully
            const recipeIngredients = recipe.Ingredients ? recipe.Ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase()) : [];
             // Check for empty ingredients array
            if (recipeIngredients.length === 0 && userIngredients.length > 0) {
                return false; // If user has specified ingredients but recipe has none, it's not a match
            }
             // Check if userIngredients array is empty
            if (userIngredients.length === 0) {
                return false; // If user hasn't specified any ingredients, no matches are possible
            }
            const isMatchingIngredients = userIngredients.every(ingredient => recipeIngredients.includes(ingredient));

            if (!isMatchingIngredients) return false;

            if (dietType === 'all') {
                return true;
            } else if (dietType === 'Non-Vegetarian') {
                return recipe.DietType.toLowerCase() === 'Non-Vegetarian';
            } else if (dietType === 'Vegetarian') {
                return recipe.DietType.toLowerCase() === 'Vegetarian';
            } else if (dietType === 'Vegan') {
                return recipe.DietType.toLowerCase() === 'Vegan';
            }
            return false;
        });

        if (matchingRecipes.length > 0) {
            recipeContainer.innerHTML = "";
            matchingRecipes.forEach(data => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${data.Image}">
                    <h3>${data.FoodName}</h3>
                    <p>Calories: ${data.Calories}KCal</p>
                    <p>${data.DietType}</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', () => {
                    openRecipePopup(data);
                });

                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found for the provided ingredients and diet type.</h2>";
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes. Please check the console for more details.</h2>";
    }
}

// Define a variable to store the selected recipe
let selectedRecipe = null;

const openRecipePopup = (data) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${data.FoodName}</h2>
        <div>
            <h3 style="display: inline-block;">Diet Type:</h3>
            <p class="recipeDietType" style="display: inline-block;">${data.DietType}</p>
        </div>
        <div>
            <h3 style="display: inline-block;">Calories:</h3>
            <p class="recipeCal" style="display: inline-block;">${data.Calories}KCal</p>
        </div>
        <div>
            <h3 style="display: inline-block;">Fats:</h3>
            <p class="recipeFats" style="display: inline-block;">${data.Fats}g</p>
        </div>
        <div>
            <h3 style="display: inline-block;">Carbohydrates:</h3>
            <p class="recipeCarbs" style="display: inline-block;">${data.Carbs}g</p>
        </div>
        <div>
            <h3 style="display: inline-block;">Proteins:</h3>
            <p class="recipeProteins" style="display: inline-block;">${data.Proteins}g</p>
        </div>
        <h3>Ingredients:</h3>
        <p class="recipeIngredients">${data.Ingredients}</p>
        <h3>Instructions:</h3>
        <p class="recipeInstructions">${data.Recipe}</p>
        <button class="selectRecipeBtn">Select Recipe</button>
    `;
    recipeDetailsContent.parentElement.style.display = "block";

    const selectRecipeBtn = document.querySelector('.selectRecipeBtn');
    selectRecipeBtn.addEventListener('click', () => {
        // Store the selected recipe
        selectedRecipe = data;
        console.log("Recipe selected:", selectedRecipe.FoodName);
        // Close the recipe popup if needed
        recipeDetailsContent.parentElement.style.display = "none";
    });
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    const selectedDietType = dietTypeSelect.value;
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the ingredients in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput, selectedDietType);
});

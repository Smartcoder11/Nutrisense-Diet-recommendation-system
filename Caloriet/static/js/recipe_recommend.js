const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const dietTypeSelect = document.getElementById('dietTypeSelect');

const fetchRecipes = async (query, dietType) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const userIngredients = query.split(',').map(ingredient => ingredient.trim().toLowerCase());
        const data = await fetch(`https://script.google.com/macros/s/AKfycbyQjZrIOw5-Wuu4nH7CzaZ-adRGligen3XijH3KBF9LzZOGqGQ4UdqPxx_k5COwKCmlZg/exec`);
        const response = await data.json();

        const matchingRecipes = response.data.filter(recipe => {
            const recipeIngredients = recipe.Ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase());
            const isMatchingIngredients = userIngredients.every(ingredient => recipeIngredients.includes(ingredient));
            
            if (dietType === 'all') {
                return isMatchingIngredients;
            } else if (dietType === 'non-vegetarian') {
                console.log("Recipe Diet Type:", recipe.DietType);
                return isMatchingIngredients && recipe.DietType.toLowerCase().includes('non-vegetarian');
            } else if (dietType === 'vegetarian') {
                console.log("Recipe Diet Type:", recipe.DietType);
                return isMatchingIngredients && (recipe.DietType.toLowerCase().includes('vegetarian') && !recipe.DietType.toLowerCase().includes('non-vegetarian'));
            } else if (dietType === 'vegan') {
                console.log("Recipe Diet Type:", recipe.DietType);
                return isMatchingIngredients && recipe.DietType.toLowerCase().includes('vegan');
            }
        });

        if (matchingRecipes.length > 0) {
            recipeContainer.innerHTML = "";
            matchingRecipes.forEach(data => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML =`
                    <img src="${data.Image}">
                    <h3>${data.FoodName}</h3>
                    <p>Calories:${data.Calories}KCal<p>
                    <p>${data.DietType}</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click',()=>{
                    openRecipePopup(data);
                });

                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found for the provided ingredients and diet type.</h2>";
        }
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
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

recipeCloseBtn.addEventListener('click', ()=>{
    recipeDetailsContent.parentElement.style.display ="none";
});

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    const selectedDietType = dietTypeSelect.value;
    if(!searchInput){
        recipeContainer.innerHTML = `<h2>Type the ingredients in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput, selectedDietType);
});
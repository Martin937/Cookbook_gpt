import { saveRecipeToDB } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("recipe-form");
	const cancelButton = document.getElementById("cancel-recipe");

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const title = document.getElementById("recipe-title").value.trim();
		const description = document.getElementById("recipe-description").value.trim();
		const ingredients = document.getElementById("recipe-ingredients").value.trim().split("\n");
		const steps = document.getElementById("recipe-steps").value.trim().split("\n");
		const imageInput = document.getElementById("recipe-image");
		let imagePreview = "";

		// Получаем выбранный тип блюда
		const dishTypeInput = document.querySelector("input[name='dishType']:checked");
		const dishType = dishTypeInput ? dishTypeInput.value : "regular";

		// Получаем выбранные приемы пищи (множественный выбор)
		const mealTypeInputs = document.querySelectorAll("input[name='mealType']:checked");
		const mealTypes = Array.from(mealTypeInputs).map(input => input.value);

		// Логируем полученные значения
		console.log("Выбранный тип блюда:", dishType);
		console.log("Выбранные приемы пищи:", mealTypes);

		if (imageInput.files.length > 0) {
			const file = imageInput.files[0];
			const reader = new FileReader();
			reader.onload = async function (e) {
				imagePreview = e.target.result;
				await saveRecipe({ title, description, ingredients, steps, imagePreview, dishType, mealTypes });
			};
			reader.readAsDataURL(file);
		} else {
			await saveRecipe({ title, description, ingredients, steps, imagePreview, dishType, mealTypes });
		}
	});

	async function saveRecipe(recipe) {
		if (!recipe.title || !recipe.description || !recipe.ingredients.length || !recipe.steps.length) {
			alert("Пожалуйста, заполните все поля!");
			return;
		}

		// Логируем перед сохранением рецепта
		console.log("Сохраняем рецепт в базу данных:", recipe);

		recipe.id = Date.now();
		await saveRecipeToDB(recipe);
		alert("Рецепт добавлен!");
		window.location.href = "index.html";
	}

	cancelButton.addEventListener("click", () => {
		window.location.href = "index.html";
	});
});



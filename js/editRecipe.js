import { getRecipeById, saveRecipeToDB } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const recipeId = urlParams.get("id");

	if (!recipeId) {
		alert("Ошибка: рецепт не найден!");
		window.location.href = "index.html";
		return;
	}

	const recipe = await getRecipeById(recipeId);
	if (!recipe) {
		alert("Ошибка: рецепт не найден!");
		window.location.href = "index.html";
		return;
	}

	// Устанавливаем значения в поля формы
	document.getElementById("edit-recipe-title").value = recipe.title;
	document.getElementById("edit-recipe-description").value = recipe.description;
	document.getElementById("edit-recipe-ingredients").value = recipe.ingredients.join("\n");
	document.getElementById("edit-recipe-steps").value = recipe.steps.join("\n");

	// Устанавливаем выбранные чекбоксы для "Прием пищи"
	document.querySelectorAll('input[name="edit-mealType"]').forEach((checkbox) => {
		checkbox.checked = recipe.mealTypes.includes(checkbox.value);
	});

	// Устанавливаем выбранное значение радиокнопки "Тип блюда"
	const dishTypeRadio = document.querySelector(`input[name="edit-dishType"][value="${recipe.dishType}"]`);
	if (dishTypeRadio) {
		dishTypeRadio.checked = true;
	}

	// Работа с изображением
	const imagePreview = document.createElement("img");
	imagePreview.src = recipe.imagePreview || "assets/img/default.jpg";
	imagePreview.style.width = "150px";
	document.getElementById("edit-recipe-form").insertBefore(imagePreview, document.getElementById("edit-recipe-image"));

	const imageInput = document.getElementById("edit-recipe-image");
	imageInput.addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	});

	// Обработчик сохранения рецепта
	document.getElementById("edit-recipe-form").addEventListener("submit", async (event) => {
		event.preventDefault();

		const updatedRecipe = {
			...recipe,
			title: document.getElementById("edit-recipe-title").value.trim(),
			description: document.getElementById("edit-recipe-description").value.trim(),
			ingredients: document.getElementById("edit-recipe-ingredients").value.trim().split("\n"),
			steps: document.getElementById("edit-recipe-steps").value.trim().split("\n"),
			imagePreview: imagePreview.src,
			mealTypes: Array.from(document.querySelectorAll('input[name="edit-mealType"]:checked'))
				.map((checkbox) => checkbox.value),  // ✅ mealTypes теперь соответствует базе
			dishType: document.querySelector('input[name="edit-dishType"]:checked')?.value || "regular",
		};

		await saveRecipeToDB(updatedRecipe);
		alert("Рецепт обновлен!");
		window.location.href = "recipe.html?id=" + recipeId;
	});

	// Обработчик кнопки "Отмена"
	document.getElementById("cancel-edit").addEventListener("click", () => {
		window.location.href = "recipe.html?id=" + recipeId;
	});
});




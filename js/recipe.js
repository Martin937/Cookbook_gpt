import { getRecipeById } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const recipeId = urlParams.get("id");

	if (!recipeId) {
		alert("Рецепт не найден");
		window.location.href = "index.html";
		return;
	}

	const recipe = await getRecipeById(recipeId);

	if (!recipe) {
		alert("Рецепт не найден");
		window.location.href = "index.html";
		return;
	}

	console.log("Загруженный рецепт:", recipe);
	console.log("Путь к изображению:", recipe.imagePreview);

	const recipeImage = document.getElementById("recipe-image");
	recipeImage.style.display = "none"; // Скрываем, пока не загрузится

	if (recipe.imagePreview) {
		const img = new Image();
		img.src = recipe.imagePreview;
		img.onload = () => {
			recipeImage.src = recipe.imagePreview;
			adjustImageSize(recipeImage);
			recipeImage.style.display = "block"; // Показываем после загрузки
		};
		img.onerror = () => setDefaultImage(recipeImage);
	} else {
		setDefaultImage(recipeImage);
	}


	// Устанавливаем данные рецепта
	document.getElementById("recipe-title").textContent = recipe.title;
	document.getElementById("recipe-description").textContent = recipe.description;

	// Отображение типа блюда
	document.getElementById("recipe-dish-type").textContent =
		recipe.dishType === "diet" ? "Диетическое" : "Обычное";

	// Отображение приемов пищи с переводом на русский
	const mealTypeTranslation = {
		breakfast: "Завтрак",
		lunch: "Обед",
		dinner: "Ужин",
		dessert: "Десерт"
	};

	document.getElementById("recipe-meal-type").textContent =
		recipe.mealTypes && recipe.mealTypes.length > 0
			? recipe.mealTypes.map(type => mealTypeTranslation[type] || type).join(", ")
			: "—";

	const ingredientsList = document.getElementById("recipe-ingredients");
	ingredientsList.innerHTML = "";
	recipe.ingredients.forEach((ingredient) => {
		const li = document.createElement("li");
		li.textContent = ingredient;
		ingredientsList.appendChild(li);
	});

	const stepsList = document.getElementById("recipe-steps");
	stepsList.innerHTML = "";
	recipe.steps.forEach((step) => {
		const li = document.createElement("li");
		li.textContent = step;
		stepsList.appendChild(li);
	});

	document.getElementById("edit-recipe").addEventListener("click", () => {
		window.location.href = `editRecipe.html?id=${recipeId}`;
	});

	document.getElementById("download-pdf").addEventListener("click", () => {
		import("./pdfExport.js").then((module) => {
			module.exportRecipeToPDF();
		});
	});

	document.getElementById("share-recipe").addEventListener("click", () => {
		import("./webShare.js").then((module) => {
			module.shareRecipe(recipe);
		});
	});

	document.getElementById("back-home").addEventListener("click", () => {
		window.location.href = "index.html";
	});
});

// Функция для обработки размера изображения
function adjustImageSize(image) {
	const headerHeight = document.querySelector("header").offsetHeight;
	const maxImageHeight = (window.innerHeight - headerHeight) / 1.5;

	console.log("Header height:", headerHeight);
	console.log("Max image height:", maxImageHeight);

	if (image.height > maxImageHeight) {
		image.style.height = `${maxImageHeight}px`;
		image.style.width = "auto"; // Сохраняем пропорции
	}
}

// Функция установки дефолтного изображения
function setDefaultImage(image) {
	image.src = "assets/img/default.jpg";
	image.onload = () => adjustImageSize(image); // Применяем изменение размера
	image.style.display = "block";
}

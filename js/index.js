import { getAllRecipes, deleteRecipe } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	const recipeList = document.querySelector("#recipe-list .container");
	const searchInput = document.getElementById("search-input");
	const mealTypeFilter = document.getElementById("meal-type-filter");
	const dishTypeFilter = document.getElementById("dish-type-filter");
	const sortFilter = document.getElementById("sort-filter");

	let recipes = await getAllRecipes(); // Загружаем все рецепты

	// Функция для отображения рецептов с учетом фильтрации и сортировки
	function renderRecipes() {
		let filteredRecipes = [...recipes];

		// Фильтрация по приему пищи
		const selectedMealType = mealTypeFilter.value;
		if (selectedMealType) {
			filteredRecipes = filteredRecipes.filter(recipe => recipe.mealTypes.includes(selectedMealType));
		}

		// Фильтрация по типу блюда
		const selectedDishType = dishTypeFilter.value;
		if (selectedDishType) {
			filteredRecipes = filteredRecipes.filter(recipe => recipe.dishType === selectedDishType);
		}

		// Поиск по названию
		const searchQuery = searchInput.value.toLowerCase();
		if (searchQuery) {
			filteredRecipes = filteredRecipes.filter(recipe => recipe.title.toLowerCase().includes(searchQuery));
		}

		// Сортировка
		const selectedSort = sortFilter.value;
		if (selectedSort === "a-z") {
			filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
		} else if (selectedSort === "z-a") {
			filteredRecipes.sort((a, b) => b.title.localeCompare(a.title));
		} else if (selectedSort === "newest") {
			filteredRecipes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
		} else if (selectedSort === "oldest") {
			filteredRecipes.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
		}

		// Очищаем список и рендерим заново
		recipeList.innerHTML = "";
		if (filteredRecipes.length === 0) {
			recipeList.innerHTML = "<p>Нет рецептов, соответствующих фильтрам.</p>";
			return;
		}

		filteredRecipes.forEach((recipe) => {
			const recipeItem = document.createElement("div");
			recipeItem.classList.add("recipe-card");

			// Контейнер изображения
			const imageContainer = document.createElement("div");
			imageContainer.classList.add("recipe-image-container");
			const image = document.createElement("img");
			image.src = recipe.imagePreview || 'assets/img/default.jpg';
			image.alt = "Фото рецепта";
			imageContainer.appendChild(image);

			// Контейнер информации
			const infoContainer = document.createElement("div");
			infoContainer.classList.add("recipe-info-container");
			infoContainer.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>${recipe.description}</p>
								<div class="recipe-dish-icon">${getDishTypeIcon(recipe.dishType)}</div>
                <div class="recipe-buttons">
                    <button class="open-recipe" data-id="${recipe.id}">📖 Открыть</button>
                    <button class="delete-recipe" data-id="${recipe.id}">🗑 Удалить</button>
                </div>
            `;

			// Устанавливаем высоту контейнера информации
			image.onload = () => {
				let imageHeight = image.height;
				if (imageHeight > window.innerHeight * 0.3) {
					imageHeight = window.innerHeight * 0.3;
				}
				image.style.height = `${imageHeight}px`;
				infoContainer.style.height = `${imageHeight}px`;
			};

			recipeItem.appendChild(imageContainer);
			recipeItem.appendChild(infoContainer);
			recipeList.appendChild(recipeItem);
		});

		// Обработчики для кнопок "Открыть" и "Удалить"
		document.querySelectorAll(".open-recipe").forEach((button) => {
			button.addEventListener("click", (event) => {
				const id = event.target.getAttribute("data-id");
				window.location.href = `recipe.html?id=${id}`;
			});
		});

		document.querySelectorAll(".delete-recipe").forEach((button) => {
			button.addEventListener("click", async (event) => {
				const id = event.target.getAttribute("data-id");
				if (confirm("Вы уверены, что хотите удалить этот рецепт?")) {
					await deleteRecipe(id);
					recipes = await getAllRecipes(); // Обновляем список после удаления
					renderRecipes(); // Перерисовываем рецепты
				}
			});
		});
	}

	// Функция для получения иконки типа блюда с подсказкой
	function getDishTypeIcon(dishType) {
		const icon = dishType === "diet" ? "🍏" : "🍔";
		const tooltip = dishType === "diet" ? "Диетическое блюдо" : "Обычное блюдо";
		return `<span class="recipe-dish-icon" title="${tooltip}">${icon}</span>`;
	}


	// Вызов рендера при загрузке
	renderRecipes();

	// Добавляем обработчики событий
	searchInput.addEventListener("input", renderRecipes);
	mealTypeFilter.addEventListener("change", renderRecipes);
	dishTypeFilter.addEventListener("change", renderRecipes);
	sortFilter.addEventListener("change", renderRecipes);
});

// Регистрируем Service Worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js")
		.then(() => console.log("✅ Service Worker зарегистрирован!"))
		.catch((error) => console.log("❌ Ошибка при регистрации SW:", error));
}

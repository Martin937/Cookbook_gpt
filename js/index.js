document.addEventListener('DOMContentLoaded', async () => {
	const recipeList = document.getElementById('recipeList');

	try {
		const response = await fetch('https://t97833oh.beget.tech/cookbook/api/getRecipes.php');
		const recipes = await response.json();

		recipeList.innerHTML = '';

		recipes.forEach((recipe) => {
			const card = document.createElement('div');
			card.classList.add('recipe-card');

			card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <div class="tags">
          <span>${recipe.meal_type}</span>
          <span>${recipe.dish_type}</span>
          <span>${recipe.is_diet ? '🍏 Диетическое' : '🍔 Обычное'}</span>
        </div>
      `;

			recipeList.appendChild(card);
		});

	} catch (err) {
		console.error('Ошибка при получении рецептов:', err);
		recipeList.innerHTML = '<p>Не удалось загрузить рецепты</p>';
	}
});


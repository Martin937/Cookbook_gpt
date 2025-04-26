document.getElementById('addRecipeForm').addEventListener('submit', async (e) => {
	e.preventDefault();

	const recipe = {
		name: document.getElementById('recipeName').value,
		image: document.getElementById('recipeImage').value,
		description: document.getElementById('recipeDescription').value,
		meal_type: document.querySelector('input[name="mealType"]:checked')?.value || '',
		dish_type: document.querySelector('input[name="dishType"]:checked')?.value || '',
		is_diet: document.getElementById('isDiet').checked
	};

	try {
		const response = await fetch('https://t97833oh.beget.tech/cookbook/api/addRecipe.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(recipe)
		});

		const result = await response.json();

		if (result.status === 'success') {
			alert('Рецепт успешно добавлен!');
			document.getElementById('addRecipeForm').reset();
		} else {
			alert('Ошибка при добавлении рецепта: ' + result.message);
		}

	} catch (err) {
		console.error('Ошибка при запросе:', err);
		alert('Произошла ошибка при отправке рецепта.');
	}
});





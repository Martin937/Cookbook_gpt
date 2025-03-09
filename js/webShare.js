export const shareRecipe = (recipe) => {
	if (navigator.share) {
		navigator
			.share({
				title: recipe.title,
				text: `Попробуйте приготовить: ${recipe.title}`,
				url: window.location.href,
			})
			.then(() => console.log("Рецепт успешно отправлен"))
			.catch((error) => console.log("Ошибка при отправке рецепта:", error));
	} else {
		alert("Ваш браузер не поддерживает Web Share API.");
	}
};

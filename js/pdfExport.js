/**
 * Экспортирует текущий рецепт в PDF.
 */
// export function exportRecipeToPDF() {
// 	const element = document.querySelector("main"); // Контейнер рецепта

// 	html2pdf()
// 		.from(element)
// 		.set({
// 			margin: 10,
// 			filename: "Рецепт.pdf",
// 			image: { type: "jpeg", quality: 0.98 },
// 			html2canvas: { scale: 2, useCORS: true },
// 			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// 		})
// 		.save();
// }



// export function exportRecipeToPDF() {
// 	const mainElement = document.querySelector("main"); // Контейнер рецепта
// 	const buttons = document.querySelector(".actions"); // Блок с кнопками
// 	const headerTitle = document.getElementById("recipe-title"); // Заголовок из <header>

// 	// Клонируем заголовок и добавляем его внутрь main перед экспортом
// 	const tempTitle = headerTitle.cloneNode(true);
// 	tempTitle.style.textAlign = "center"; // Центрируем
// 	mainElement.insertBefore(tempTitle, mainElement.firstChild);

// 	// Временно скрываем кнопки
// 	if (buttons) buttons.classList.add("no-print");

// 	html2pdf()
// 		.from(mainElement)
// 		.set({
// 			margin: 10,
// 			filename: "Рецепт.pdf",
// 			image: { type: "jpeg", quality: 0.98 },
// 			html2canvas: { scale: 2, useCORS: true },
// 			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// 		})
// 		.save()
// 		.then(() => {
// 			// После сохранения возвращаем все как было
// 			mainElement.removeChild(tempTitle); // Удаляем временный заголовок
// 			if (buttons) buttons.classList.remove("no-print");
// 		});
// }


export function exportRecipeToPDF() {
	const mainElement = document.querySelector("main"); // Контейнер рецепта
	const buttons = document.querySelector(".actions"); // Блок с кнопками
	const headerTitle = document.getElementById("recipe-title"); // Заголовок из <header>

	// Клонируем заголовок и добавляем его внутрь main перед экспортом
	const tempTitle = headerTitle.cloneNode(true);
	tempTitle.style.textAlign = "left"; // Центрируем текст
	tempTitle.style.width = "100%"; // Делаем заголовок на всю ширину
	tempTitle.style.marginBottom = "10px"; // Добавляем отступ вниз
	tempTitle.style.fontSize = "20px"; // Увеличиваем размер шрифта
	tempTitle.style.fontWeight = "bold"; // Делаем жирным

	mainElement.insertBefore(tempTitle, mainElement.firstChild); // Вставляем заголовок перед остальным контентом

	// Временно скрываем кнопки
	if (buttons) buttons.classList.add("no-print");

	html2pdf()
		.from(mainElement)
		.set({
			margin: 10,
			filename: "Рецепт.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
		})
		.save()
		.then(() => {
			// После сохранения возвращаем все как было
			mainElement.removeChild(tempTitle); // Удаляем временный заголовок
			if (buttons) buttons.classList.remove("no-print");
		});
}

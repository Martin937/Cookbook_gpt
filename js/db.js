const DB_NAME = "recipeDB";
const STORE_NAME = "recipes";
const DB_VERSION = 1;

export function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};

		request.onsuccess = (event) => resolve(event.target.result);
		request.onerror = (event) => reject(event.target.error);
	});
}

export async function saveRecipeToDB(recipe) {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	// Проверяем, существует ли уже этот рецепт
	const existingRecipe = await store.get(recipe.id);

	if (existingRecipe) {
		// Если рецепт уже есть, обновляем его (но не меняем дату добавления)
		recipe.dateAdded = existingRecipe.dateAdded || new Date().toISOString();
		await store.put(recipe);
	} else {
		// Если рецепт новый, добавляем дату добавления
		recipe.dateAdded = new Date().toISOString();
		await store.add(recipe);
	}

	await tx.done;
}

export async function getRecipeById(id) {
	const db = await openDB();
	const transaction = db.transaction(STORE_NAME, "readonly");
	const store = transaction.objectStore(STORE_NAME);
	return new Promise((resolve, reject) => {
		const request = store.get(Number(id));
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function deleteRecipe(id) {
	if (!confirm("Вы уверены, что хотите удалить этот рецепт?")) return;
	const db = await openDB();
	const transaction = db.transaction(STORE_NAME, "readwrite");
	const store = transaction.objectStore(STORE_NAME);
	store.delete(Number(id));
	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = (event) => reject(event.target.error);
	});
}

export const getAllRecipes = async () => {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise((resolve) => {
		const request = store.getAll();
		request.onsuccess = async () => {
			let recipes = request.result;
			let updatesNeeded = false;

			// Проверяем и добавляем дату для старых рецептов
			for (let recipe of recipes) {
				if (!recipe.dateAdded) {
					recipe.dateAdded = new Date().toISOString(); // Записываем текущую дату
					store.put(recipe); // Обновляем в базе
					updatesNeeded = true;
				}
			}

			// Дожидаемся завершения транзакции, если были изменения
			if (updatesNeeded) {
				await tx.done;
			}

			resolve(recipes);
		};
	});
};

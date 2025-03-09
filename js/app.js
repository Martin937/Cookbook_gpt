export function openPage(url) {
	window.location.href = url;
}

export function confirmAction(message) {
	return confirm(message);
}

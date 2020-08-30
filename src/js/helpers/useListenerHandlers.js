/**
 * Устанавливает один обработчик события type,
 * возвращает функцию которая добавляет в массив handlers переданный handle.
 * @param  {String} type
 * @param  {Object} context
 * @return {Function}
 */
const useListenerHandlers = (type, context = document) => {
	let handlers = [];

	context.addEventListener(type, event => {
		if (handlers.length === 0) return;

		handlers.forEach(handle => handle(event));
	});

	return handle => {
		if (typeof handle == 'function') {
			handlers = [...handlers, handle];
		}
	}
}

const loadEventListener = () => useListenerHandlers('load', window);
const scrollEventListener = () => useListenerHandlers('scroll');
const contentLoadEventListener = () => useListenerHandlers('DOMContentLoaded');
const inputEventListener = () => useListenerHandlers('input');
const focusEventListener = () => useListenerHandlers('focusin');
const blurEventListener = () => useListenerHandlers('focusout');

const loadListener = loadEventListener();
const scrollListener = scrollEventListener();
const contentLoadListener = contentLoadEventListener();
const inputListener = inputEventListener();
const focusListener = focusEventListener();
const blurListener = blurEventListener();

export {
	loadListener,
	scrollListener,
	contentLoadListener,
	inputListener, 
	focusListener, 
	blurListener
};

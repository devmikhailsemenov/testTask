/**
 * Возвращает функцию, которая определяет соответствует ли ширина экрана переданному media
 * @param  {String} media     - медиазапрос
 * @param  {String} watchType - тип определения соответствия (например: только при загрузке или только при событии resize)
 * @return {Function}
 * @example
 *
 * const mobileMedia = useMediaQuery('max-width: 480px', ALL);
 *
 * mobileMedia(matches => {
 * 		if (matches === true) {
 * 			console.log('Меньше 480px')
 * 		} else {
 * 			console.log('Больше 480px')
 * 		}
 * })
 */
const useMediaQuery = (media, watchType = 'ALL') => {

	if (!media) {
		throw Error('useMediaQuery: параметр media не определен')
	}

	const breakpoint = window.matchMedia(media);

	const watchBreakpoint = handler => {
		if (typeof handler === 'function') {
			handler(breakpoint.matches);
		}
	}

	switch (watchType) {
		case 'RESIZE-ONLY':
			return handler => breakpoint.addListener(watchBreakpoint.bind(null, handler));
		case 'LOAD-ONLY':
			return handler => watchBreakpoint(handler);
		default:
			return handler => {
				breakpoint.addListener(watchBreakpoint.bind(null, handler));
				watchBreakpoint(handler);
			}
	}
}

export { useMediaQuery };

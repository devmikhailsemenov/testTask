/**
 * Объект helper содержит вспомогательные методы.
 * @type {Object}
 */
export const helper = {

	// Вспомогательная функции анимации requestAnimationFrame
	animate: options => {
		let startTime = performance.now();
		let requestID;

		requestAnimationFrame(function animate(currentTime) {
		    // timeFraction изменяется от 0 до 1
		    let timeFraction = (currentTime - startTime) / options.duration;

		    if (timeFraction > 1) timeFraction = 1;
		    if (timeFraction < 0) timeFraction = 0;

		    // вычисление текущего состояния анимации
		    let progress = options.timing(timeFraction);

		    options.draw(progress); // отрисовать её

		    if (timeFraction < 1) {
		    	requestID = requestAnimationFrame(animate);
		    }
		});
	},

	// Функция вычисления координат элемента
	getCoordsElem: elem => {
		const elemCoords = elem.getBoundingClientRect();

		return {
			top: elemCoords.top,
			left: elemCoords.left
		}
	},

	// Функция проверки скрыт элемент или нет
	isHidden: elem => {
		return !elem.offsetWidth && !elem.offsetHeight;
	},

	// Функция, которая находит индекс по свойству объекта(элемента массива)
	getAccordanceElem: (array, getAccordance) => {
		const indexActiveElem = array.indexOf(
			array.filter(el => getAccordance(el))[0]
		);

		return indexActiveElem;
	},

	generateID: () => {
		let i = 0;

		return (prefix = 'generate') => {
			i = i + 1;

			let t = `${prefix}-${i}`;

			return t;
		}
	}
}

 import { helper } from '@helpers/helper.js';

/**
 * Класс, методы которого позволяют плавно скрывать/показывать элементы.
 */
class Smoothly {
	constructor (options) {
		this.resolveChangeElem = true;

		this.transitionBlock = this.transitionBlock.bind(this);
		this.transitionNone = this.transitionNone.bind(this);
		this.transitionEnd = this.transitionEnd.bind(this);
	}
	
	/**
	 * Плавно показывает передаваемый elem (пример: эффект fadeIn)
	 * @param  {Object}   elem      - DOM-элемент
	 * @param  {String}   nameClass - наименование CSS класса для анимации
	 * @param  {Function} callback  - вызвается после того, как наступило событие transitionEnd у elem
	 */
	transitionBlock(elem, nameClass, callback) {
		elem.classList.add(nameClass);
		elem.clientWidth;
		elem.classList.remove('box-hidden');

		this.transitionEnd(elem, nameClass, callback);
	}
	
	/**
	 * Плавно скрывает передаваемый elem (пример: эффект fadeOut)
	 * @param  {Object}   elem      - DOM-элемент
	 * @param  {String}   nameClass - наименование CSS класса для анимации
	 * @param  {Function} callback  - вызвается после того, как наступило событие transitionEnd у elem
	 */
	transitionNone(elem, nameClass, callback) {
		if (helper.isHidden(elem) === true) return;

		elem.classList.add(nameClass);
		elem.classList.add('box-hidden');

		this.transitionEnd(elem, nameClass, callback);
	}
	
	/**
	 * @param  {Object}   box      - DOM-элемент
	 * @param  {String}   nameClass - наименование CSS класса для анимации
	 * @param  {Function} callback  - вызвается после того, как наступило событие transitionEnd у elem
	 */
	transitionEnd(box, nameClass, callback) {
		const completeAnim = (elem, resolve) => resolve();

		const elemAnimate = () => {
			return new Promise((resolve, reject)=> {
	 			box.addEventListener('transitionend', (e)=> {
	 				if (e.target !== e.currentTarget) return false;
	 				completeAnim(e.currentTarget, resolve);
	 			});
			});
		}

		elemAnimate().then((e) => {
			box.removeEventListener('transitionend', completeAnim);
			if (nameClass !== null) box.classList.remove(nameClass);
			if (callback !== void 0) callback();
		});
	}
	
	/**
	 * Плавно расскрывает передаваемый elem (пример: эффект slideDown)
	 * @param  {Object}   elem      - DOM-элемент
	 * @param  {Function} callback  - вызвается после того, как наступило событие transitionEnd у elem
	 */
	slideIn(elem, callback) {
		if (!elem.classList.contains('slide-in') && !elem.classList.contains('slide-out')) {
			elem.style.display = 'block';
			const currentHeight = elem.clientHeight + 'px';
			elem.style.display = '';
			elem.style.height = currentHeight;
		}

		elem.clientWidth;
		this.transitionBlock(elem, 'slide-in', ()=> {
			if (typeof callback === 'function') {
				callback();
			}

			elem.style = '';
		});
	}
	
	/**
	 * Плавно сворачивает передаваемый elem (пример: эффект slideUp)
	 * @param  {Object}   elem      - DOM-элемент
	 * @param  {Function} callback  - вызвается после того, как наступило событие transitionEnd у elem
	 */
	slideOut(elem, callback) {

		if (!elem.classList.contains('slide-in') && !elem.classList.contains('slide-out')) {
			elem.style.height = elem.clientHeight + 'px';
		}

		elem.clientWidth;
		this.transitionNone(elem, 'slide-out', ()=> {
			if (typeof callback === 'function') {
				callback();
			}

			elem.style = '';
		});
	}
	
	/**
	 * В зависимости от передаваемого type (плавно или нет) скрывает один элемент и показывает другой.
	 * @param  {Object} options.current          - DOM элемент, который нужно скрыть.
	 * @param  {Object} options.next             - DOM элемент, который нужно показать.
	 * @param  {Object} options.nameClasses      - объект с наименованиями CSS-классов(enter и leave).
	 * @param  {String} options.type             - тип анимации.
	 * @param  {Function} options.afterHideCurrent - вызывается после того, как options.current скрывается
	 * @param  {Function} options.afterShowNext - вызывается после того, как options.next показывается
	 */
	nextElem({
		current,
		next,
		nameClasses,
		type,
		afterHideCurrent,
		afterShowNext
	}) {
		if (current.parentElement !== next.parentElement) {
			current.parentElement.appendChild(next);
		}

		current.classList.remove('active');
		next.classList.add('active');

		// По типу выбираем способ смены элементов
		switch (type) {
			// Элементы меняются плавно, следующий элемент появляется после того, как исчезнет текущий
			case 'next-delay':
				this.transitionNone(current, nameClasses.leave, ()=> {
					if (typeof afterHideCurrent === 'function') {
						afterHideCurrent()
					}

					this.transitionBlock(next, nameClasses.enter, () => {
						if (typeof afterShowNext === 'function') {
							afterShowNext()
						}
					});
				});
				break;

			// Анимируется только следующий элемент, текущий просто скрывается
			case 'next-smoothly':
				current.classList.add('box-hidden');
				if (current.classList.contains(nameClasses.enter)) {
					current.classList.remove(nameClasses.enter);
				}

				if (typeof afterHideCurrent === 'function') {
					afterHideCurrent()
				}

				this.transitionBlock(next, nameClasses.enter, () => {
					if (typeof afterShowNext === 'function') {
						afterShowNext()
					}
				});
				break;
			// Обычные табы
			default:
				current.classList.add('box-hidden');
				next.classList.remove('box-hidden');
				break;
		}
	}
}

export const smoothly = new Smoothly();
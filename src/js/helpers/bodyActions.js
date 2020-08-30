import { helper } from '@helpers/helper.js';

/**
 * Класс, методы которого позволяют устанавливать body различные поведения (фиксировать, анимировать и т.п.).
 */
class BodyActions {
	constructor(options) {
		this.selectorBodyHidden = options.selectorBodyHidden ? options.selectorBodyHidden : false;
		this.bodyHiddenElems = null;
		this.scrollBar = null;
		this.currentScroll = null;
		this.resolveHidden = false;
	}
	
	/**
	 * Фиксирует body
	 */
	hidden() {
		if (this.resolveHidden) return;

		this.scrollBar = this.scrollBarWidth();
		this.currentScroll = window.pageYOffset;

		document.body.classList.add('body_hidden');
		document.body.style.paddingRight = this.scrollBar + 'px';
		document.body.style.top = -this.currentScroll + 'px';

		if (this.selectorBodyHidden) {
			this.bodyHiddenElems = document.querySelectorAll(`.${this.selectorBodyHidden}`);

			if (this.bodyHiddenElems.length === 0) return;

			for (let i = 0; i < this.bodyHiddenElems.length; i++) {
				this.bodyHiddenElems[i].style.width = `calc(100% - ${this.scrollBar}px)`;
			}
		}

		this.resolveHidden = true;

		this.setBodyHiddenEvent(this.scrollBar, this.currentScroll, this.resolveHidden);
	}
	
	/**
	 * Возвращает body дефолтное поведение(скролл)
	 */
	scroll() {
		document.body.style.paddingRight = '';
		document.body.classList.remove('body_hidden');
		document.body.style.top = '';
		window.scrollTo(0, this.currentScroll);

		if (this.bodyHiddenElems) {
			for (let i = 0; i < this.bodyHiddenElems.length; i++) {
				this.bodyHiddenElems[i].style.width = '';
			}
		}

		this.resolveHidden = false;

		this.setBodyScrollEvent(this.scrollBar, this.currentScroll, this.resolveHidden);
	}
	
	/**
	 * Генерирует событие setBodyHidden
	 * @param {Number} scrollBarWidth - ширина скроллбара
	 * @param {Number} currentScroll - текущая величина прокрутки документа
	 * @param {Boolean} resolve - если true, то body зафиксирован, иначе body скроллится
	 */
	setBodyHiddenEvent(scrollBarWidth, currentScroll, resolve) {
		document.body.dispatchEvent(
			new CustomEvent('setBodyHidden', {
				detail: { scrollBarWidth, currentScroll, resolve }
			}), { bubbles: true }
		);
	}
	
	/**
	 * Генерирует событие setBodyScroll
	 * @param {Number} scrollBarWidth - ширина скроллбара
	 * @param {Number} currentScroll - текущая величина прокрутки документа
	 * @param {Boolean} resolve - если true, то body зафиксирован, иначе body скроллится
	 */
	setBodyScrollEvent(scrollBarWidth, currentScroll, resolve) {
		document.body.dispatchEvent(
			new CustomEvent('setBodyScroll', {
				detail: { scrollBarWidth, currentScroll, resolve }
			}), { bubbles: true }
		);
	}
	
	/**
	 * Анимация body от точки from до точки to
	 * @param {Object} data
	 */
	animate(data) {
		const animateOptions = {
			duration: data.duration,
			timing: timeFraction => {
				return 1 - Math.pow(1 - timeFraction, 2);
			},
			draw: progress => {
				let result = (data.to - data.from) * progress + data.from;
				scrollTo(0, result);
			}
		}

		helper.animate(animateOptions);
	}
	
	/**
	 * scrollBarWidth возвращает ширину скроллбара
	 * @return {Number} - ширина скроллбара
	 */
	scrollBarWidth() {
		return window.innerWidth - document.documentElement.clientWidth;
	}
}

export const bodyActions = new BodyActions({ selectorBodyHidden: 'body-hidden-elem' })
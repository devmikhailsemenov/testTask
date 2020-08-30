import { smoothly } from '@helpers/smoothly.js';
import { helper } from '@helpers/helper.js';
import { bodyActions } from '@helpers/bodyActions.js';
import { useMediaQuery } from '@helpers/useMediaQuery.js';

/**
 * Модальные окна
 */
class Modal {
	constructor (options) {
		this.overlay = options.selectors.overlay;
		this.arrayModal = [];

		this.init();
	}

	/**
	 * Открывает передаваемое modal
	 * @param  {Object} modal - DOM-элемент
	 */
	show(modal) {
		const getIdProp = el => el.id === modal.id

		const showModal = () => {
			const overlay = this.createOverlay(this.overlay);
			const popupAppend = this.appendPopup(modal, overlay.overlayContent);

			this.beforeShowModal(modal);

			const modalObj = {
				elem: popupAppend.parent.closest('.overlay'),
				id: modal.id,
				modals: [
					{
						elem: modal,
						defaultParent: popupAppend.defaultParentModal,
						active: true,
						classes: modal.className
					}
				]
			}

			if (this.arrayModal.length === 0) {
				bodyActions.hidden('body-hidden-elem');
			}

			this.arrayModal.push(modalObj);

			if (helper.isHidden(modal)) {
				smoothly.transitionBlock(modal, 'popup_enter-to', () => this.afterShowModal(modal));
			}
		}

		if (this.arrayModal.findIndex(el => getIdProp(el)) === -1) {
			showModal();
		}
	}

	/**
	 * Закрывает передаваемое modal
	 * @param  {Object} modal - DOM-элемент
	 */
	hide(modal) {
		const indexModal = this.arrayModal.findIndex(el => el.id === modal.id);

		if (indexModal === -1) return;

		const lastIndexModal = indexModal;
		const overlayBg = this.arrayModal[lastIndexModal].elem.querySelector('.overlay-bg');

		const removeModals = () => {
			for (let i = 0; i < this.arrayModal[lastIndexModal].modals.length; i++) {
				const modalItem = this.arrayModal[lastIndexModal].modals[i];

				this.appendPopup(modalItem.elem, modalItem.defaultParent);
				modalItem.elem.className = modalItem.classes;
			}

			this.arrayModal.splice(lastIndexModal, 1);
		}

		const hideCallback = () => {
			if (this.arrayModal[lastIndexModal] !== undefined) {
				this.removeOverlay(this.arrayModal[lastIndexModal].elem);
				removeModals();
			}

			if (this.arrayModal.length === 0) {
				bodyActions.scroll();
			}

			this.afterHideModal(modal);
		}

		this.beforeHideModal(modal);

		smoothly.transitionNone(modal, 'popup_leave-to');
		smoothly.transitionNone(overlayBg, 'smoothly-show', hideCallback);
	}

	/**
	 * showModalEvents - действия при которых модальное окно открывается по умолчанию.
	 * У кнопки/ссылки, которая отвечает за открытие модального окна обязательно должен быть аттрибут
	 * data-modal со значением ID модального окна.
	 */
	showModalEvents() {
		document.addEventListener('click', event => {
			const { target } = event;

			if (!target.hasAttribute('data-modal')) return false;

			event.preventDefault();
			target.blur();

			const btnAttr = target.getAttribute('data-modal');

			this.modalActive = document.querySelector(`#${btnAttr}`);

			if (!this.modalActive) return;

			this.show(this.modalActive);
		});
	}

	/**
	 * closeModalEvents - действия при которых модальное окно закрывается по умолчанию.
	 */
	closeModalEvents() {
		const elems = {
			startElem: null,
			endElem: null
		}

		const startEvent = event => elems.startElem = event.target;
		const endEvent = event => elems.endElem = event.target;

		document.addEventListener('mousedown', startEvent);
		document.addEventListener('touchstart', startEvent);
		document.addEventListener('mouseup', endEvent);
		document.addEventListener('touchend', endEvent);

		document.addEventListener('click', event => {
			const { target } = event;

			if (!target.classList.contains('overlay__content')) return false;

			if (elems.startElem === elems.endElem && elems.endElem.classList.contains('overlay__content')) {
				this.hide(this.getActiveModal().elem);
			}
		});

		document.addEventListener('click', event => {
			const { target } = event;

			const popupClose = target.closest('.popup-close');

			if (!popupClose) return;

			this.hide(this.getActiveModal().elem);
		});

		document.addEventListener('keydown', event => {
			const { key } = event;

			if (this.arrayModal.length === 0) return false;

			if (key == 'Escape') {
				this.hide(this.getActiveModal().elem);
			}
		});
	}

	/**
	 * Создает overlay
	 * @param  {String} nameClassElem - наименование класса для overlay
	 * @return {Object}               - { overlay, overlayBg, overlayContent }
	 */
	createOverlay(nameClassElem) {
		const overlay = document.createElement('div');
		const overlayBg = document.createElement('span');
		const overlayContent = document.createElement('div');

		overlay.className = `overlay ${nameClassElem}`;
		overlayBg.className = `overlay-bg box-hidden`;
		overlayContent.className = `overlay__content`;

		overlay.setAttribute('tabindex', '-1');
		overlay.append(overlayBg);
		overlay.append(overlayContent);

		document.body.append(overlay);

		smoothly.transitionBlock(overlayBg, 'smoothly-show');

		return { overlay, overlayBg, overlayContent };
	}

	/**
	 * Удаляет переданный overlay
	 * @param  {Object} overlay - DOM-элемент
	 */
	removeOverlay(overlay) {
		document.body.removeChild(overlay);
	}

	/**
	 * Добавляет передаваемый modal в передаваемый parent.
	 * @param  {Object} modal  - DOM-элемент
	 * @param  {Object} parent - DOM-элемент
	 * @return {Object}        - { parent, defaultParentModal }
	 */
	appendPopup(modal, parent = document.body) {
		const defaultParentModal = modal.parentNode;

		if (parent) {
			parent.append(modal);
		} 

		return { parent, defaultParentModal };
	}

	/**
	 * Возвращает активное модально окно(которое открыто в overlay)
	 * @return {Object}
	 */
	getActiveModal() {
		const modals = this.arrayModal[this.arrayModal.length - 1].modals;

		return modals[modals.findIndex(el => el.active === true)];
	}

	/**
	 * Метод, который в зависимости от разрешения "media" делает переданный "modal" модальным окном.
	 * @param  {String} media    - медиазапрос
	 * @param  {String} selector - селектор
	 * @param  {Object} settings - настройки
	 */
	mediaQueryPopup(media, selector, settings) {
		if (typeof media !== 'string') {
			throw Error('mediaQueryPopup: параметр media не является строкой');

			return;
		}

		const popups = document.querySelectorAll(selector);

		if (popups.length === 0) return;

		const setPopupAttrs = popup => {
			if (typeof settings === 'object') {
				if (typeof settings.setPopup === 'function') {
					settings.setPopup(popup);
				}
			}

			popup.classList.add('popup');
		}

		const removePopupAttrs = popup => {
			if (typeof settings === 'object') {
				if (typeof settings.removePopup === 'function') {
					settings.removePopup(popup);
				}
			}

			popup.classList.remove('popup');
		}

		const useMedia = useMediaQuery(media, matches => {

			for (let i = 0; i < popups.length; i++) {
				const popup = popups[i];

				if (matches === true) {
					setPopupAttrs(popup);
				} else {
					removePopupAttrs(popup);
				}
			}

		});
	}

	/**
	 * Заменяет одно модальное окно другим.
	 * @param  {Object} options
	 */
	nextModal(options) {
		const modalObjActive = this.arrayModal[this.arrayModal.length - 1];
		const modals = modalObjActive.modals;

		const getElemPropIndex = modals.findIndex(el => el.elem === options.next);

		if (getElemPropIndex === -1) {
			modals.push({
				elem: options.next,
				active: false,
				classes: options.next.className
			})
		}

		this.getActiveModal().active = false;
		modals[modals.findIndex(el => el.elem === options.next)].active = true;
		modalObjActive.id = options.next.id;

		smoothly.nextElem({
			...options,
			afterHideCurrent: () => this.afterHideModal(options.current),
			afterShowNext: () => this.afterShowModal(options.next)
		});
	}
	
	/**
	 * Генерирует событие afterShow для передаваемого modal.
	 * @param  {Object} modal - DOM-элемент
	 */
	afterShowModal(modal) {
		modal.dispatchEvent(new CustomEvent('afterShow'), { bubbles: true });
	}

	/**
	 * Генерирует событие afterHide для передаваемого modal.
	 * @param  {Object} modal - DOM-элемент
	 */
	afterHideModal(modal) {
		modal.dispatchEvent(new CustomEvent('afterHide'), { bubbles: true });
	}

	/**
	 * Генерирует событие beforeShow для передаваемого modal.
	 * @param  {Object} modal - DOM-элемент
	 */
	beforeShowModal(modal) {
		modal.dispatchEvent(new CustomEvent('beforeShow'), { bubbles: true });
	}

	/**
	 * Генерирует событие beforeHide для передаваемого modal.
	 * @param  {Object} modal - DOM-элемент
	 */
	beforeHideModal(modal) {
		modal.dispatchEvent(new CustomEvent('beforeHide'), { bubbles: true });
	}
	
	init() {
		this.showModalEvents();
		this.closeModalEvents();
	}
}

export const modal = new Modal({
	selectors: {
		overlay: 'overlay-modal'
	}
});

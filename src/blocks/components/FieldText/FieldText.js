import { inputListener, focusListener, blurListener } from '@helpers/useListenerHandlers.js';
import IMask from 'imask';

/**
 * Состояния и валидация текстовых полей.
 */
class FieldText {
	constructor() {
		this.parentClass = 'field-wrap';
		this.inputClass = 'field-wrap__input';
		this.activeClass = 'field-wrap--active';
		this.errorClass = 'field-wrap--error';
		this.successClass = 'field-wrap--success';
		this.completedBlur = 'field-wrap--completed-blur';

		this.focusActions = this.focusActions.bind(this);
		this.blurActions = this.blurActions.bind(this);
		this.inputActions = this.inputActions.bind(this);

		this.init();
	}
	
	removeClasses(target) {
		const fieldWrap = target.closest(`.${this.parentClass}`);

		if (!fieldWrap) return;

		if (fieldWrap.classList.contains(this.errorClass)) {
			fieldWrap.classList.remove(this.errorClass);
		}

		if (fieldWrap.classList.contains(this.successClass)) {
			fieldWrap.classList.remove(this.successClass);
		}
	}

	focusActions(event) {
		const { target, type } = event;

		if (!target) return;

		if (!target.classList.contains(this.inputClass)) return;

		const fieldWrap = target.closest(`.${this.parentClass}`);

		fieldWrap.classList.add(this.activeClass);
	}

	blurActions(event) {
		const { target, type } = event;

		if (!target) return;

		if (!target.classList.contains(this.inputClass)) return;

		const fieldWrap = target.closest(`.${this.parentClass}`);

		if (target.value !== '') {
			fieldWrap.classList.add(this.completedBlur);
		} else {
			fieldWrap.classList.remove(this.activeClass);
			fieldWrap.classList.remove(this.completedBlur);
		}
	}

	inputActions(event) {
		const { target, type } = event;

		if (!target) return;

		if (!target.classList.contains(this.inputClass)) return;

		this.removeClasses(target);

		if (target.getAttribute('name') === 'name') {
			this.formattingName(event);
		}

		this.setAutoHeightTextarea(target);
	}

	resultValidate(input, text, result) {
		const fieldWrap = input.closest('.field-wrap');
		const label = fieldWrap.querySelector('.field-wrap__text-error');

		if (result === false) {
			fieldWrap.classList.add('field-wrap--error');

			if (text) label.textContent = text;

		} else {
			fieldWrap.classList.remove('field-wrap--error');
			fieldWrap.classList.add('field-wrap--success');

			if (text) label.textContent = text;
		}
	}

	validateEmail(input) {
		const emailReg = /^([0-9a-zа-я.-_]+)@([0-9a-zа-я.-]+)\.([a-zа-я]{2,})$/iu;
		const emailTest = emailReg.test(input.value);
		const errorText = 'укажите адрес в формате hello@yandex.ru';

		if (emailTest === false) {
			if (input.value.length === 0) {
				this.resultValidate(input, 'введите email', false);
			} else {
				this.resultValidate(input, errorText, false);
			}

			return emailTest;
		} else {
			this.resultValidate(input, 'email введен правильно!', true);

			return true;
		}
	}

	validatePhone(input) {
		if (input.value.length < 16) {
			let errorText;

			if (input.value.length === 0) {
				errorText = 'введите телефон';
			} else {
				errorText = 'неверный формат телефона';
			}

			this.resultValidate(input, errorText, false);

			return false;
		} else {
			this.resultValidate(input, 'телефон введен правильно!', true);

			return true;
		}

	}

	validateName(input) {
		let errorText = 'введите имя';

		if (input.value.length === 0) {
			this.resultValidate(input, errorText, false);

			return false;
		} else {
			this.resultValidate(input, 'имя введено правильно!', true);

			return true;
		}
	}

	formattingName(event) {
		const { target } = event;

		const valueArr = target.value.replace(/[^A-zА-я ]/g, '').split(' ');

		for (let i = 0; i < valueArr.length; i++) {
			valueArr[i] = valueArr[i].charAt(0).toUpperCase() + valueArr[i].slice(1).toLowerCase();
		}

		target.value = valueArr.join(' ');
	}

	formattingPhone() {
		const phoneField = document.querySelectorAll('[name="phone"]');
		const maskOptions = {
			mask: '+{7}(000)000-00-00'
		}

		for (let i = 0; i < phoneField.length; i++) {
			const mask = IMask(phoneField[i], maskOptions);
		}
	}

	setAutoHeightTextarea(target) {
		if (target.tagName !== 'TEXTAREA') return;

		target.style.height = 1 + 'px';
		target.style.height = target.scrollHeight + 'px';
	}

	clear(target) {
		const fieldWrap = target.closest('.field-wrap');
		const label = fieldWrap.querySelector('.field-wrap__label span');

		const classes = fieldWrap.className.split(' ');
		const stateClasses = [this.activeClass, this.errorClass, this.successClass, this.completedBlur];
		const defaultClasses = classes.filter(className => !stateClasses.includes(className));

		fieldWrap.className = defaultClasses.join(' ');
		target.value = '';
		label.textContent = label.dataset.defaultLabel;
		this.setAutoHeightTextarea(target);
	}

	init() {
		this.formattingPhone();
		
		focusListener(this.focusActions);
		blurListener(this.blurActions);
		inputListener(this.inputActions);
	}
}

const fieldText = new FieldText();

export { fieldText };
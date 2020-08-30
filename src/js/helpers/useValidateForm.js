import { fieldText } from '@components/FieldText/FieldText';
import { blurListener } from '@helpers/useListenerHandlers.js';

/**
 * Возвращает true/false в зависимости от условия валидации. Если true, то переданный field валидный, иначе нет.
 * @param  {Object} options.field     - DOM элемент
 * @param  {Function} options.patternFn - функция которая возвращает true/false в зависимости от условия валидации
 * @return {Boolean}
 */
const validateInput = ({ field, patternFn }) => {

	if (typeof patternFn === 'function' && field) {
		return patternFn(field);
	} else {
		const nameAttr = field.getAttribute('name');

		switch (nameAttr) {

			case 'name':
				return fieldText.validateName(field);

				break;
			case 'phone':
				return fieldText.validatePhone(field);

				break;
			case 'email':
				return fieldText.validateEmail(field);

				break;

			default:
				if (field.value === '') {

					if (field.dataset.error) {
						fieldText.resultValidate(field, field.dataset.error, false);
					} else {
						fieldText.resultValidate(field, 'заполните поле', false);
					}

					return false;
				} else {

					if (field.dataset.success) {
						fieldText.resultValidate(field, field.dataset.success, true);
					} else {
						fieldText.resultValidate(field, 'поле заполнено верно', true);
					}

					return true;
				}

				break;
		}

	}
}

/**
 * Возвращает функцию, которая возвращает false, 
 * если хотя бы один элемент массива requiredInputsArray имеет свойство error со значением true
 * @param  {Object} requiredInputsArray - массив
 * @return {Function}
 * @example
 *
 * const validateForm = useValidateForm([{ input, error: true }]);
 *
 * if (validateForm() === false) форма не отправляется.
 */
const useValidateForm = requiredInputsArray => {

	if (!Array.isArray(requiredInputsArray)) {
		throw new Error('useValidateForm: Параметр "requiredInputsArray" не является массивом');
	}

	let requiredArray = [...requiredInputsArray];
	
	const validate = validateObj => {
		let copyValidate = { ...validateObj };

		const validateInputHandle = validateInput({ 
			field: copyValidate.field, 
			patternFn: copyValidate.patternFn 
		});

		if (validateInputHandle === false) {
			copyValidate = { ...copyValidate, error: true };
		} else {
			copyValidate = { ...copyValidate, error: false };
		}

		return copyValidate;
	}

	blurListener(event => {
		const { target } = event;

		let requiredConfigIndex = requiredArray.findIndex(elem => target === elem.field);

		if (requiredConfigIndex < 0) return;

		requiredArray.splice(
			requiredConfigIndex, 
			1, 
			validate(requiredArray[requiredConfigIndex])
		);
	});

	return () => {
		const validArr = requiredArray.map(elem => validate(elem));
		const filterError = validArr.filter(elem => elem.error === true);

		if (filterError.length > 0) return false;
	}
}

export { useValidateForm }
import Swiper from 'swiper';
import { useValidateForm } from '@helpers/useValidateForm';
import { useAlertModal } from '@helpers/useAlertModal';
import { helper } from '@helpers/helper';
import { bodyActions } from '@helpers/bodyActions';
import { fieldText } from '@components/FieldText/FieldText';
import { modal } from '@components/Modal/Modal';

const mainScreenFormActions = () => {
	const form = document.querySelector('.main-screen__form');

	if (!form) return;

	const fields = form.querySelectorAll('.field-wrap__input');

	const fieldsRequired = [...fields].filter(field => field.classList.contains('field-wrap__input--req'));
	const validateArr = [...fieldsRequired].map(field => ({ field, error: true }));

	const validatemainForm = useValidateForm(validateArr);

	const successSubmitForm = target => {
		target.reset();

		const successModal = useAlertModal({
			classes: 'popup-success',
			title: 'Спасибо',
			description: `
				Теперь Вы узнаете о запуске сайта первым!
			`
		});

		modal.show(successModal);

		fields.forEach(field => fieldText.clear(field));
	}

	const mainFormSubmit = event => {
		const { target } = event;

		event.preventDefault();

		if (validatemainForm() === false) return;

		const formData = new FormData(target);

		successSubmitForm(target);
	}

	form.addEventListener('submit', mainFormSubmit);
}

const mainScreenSlider = () => {
	return new Swiper('.main-screen__slider', {
		simulateTouch: false,
		spaceBetween: 0,
		slidesPerView: 1,
		effect: 'fade',
		speed: 1000,
		autoplay: {
			delay: 2000,
		}
	});
}

const animateToSection = () => {
	const animate = event => {
		if (!event.target.classList.contains('main-screen__btn-to-bottom')) return;

		event.preventDefault();

		const { getCoordsElem } = helper;

		const id = event.target.getAttribute('href');
		const targetSection = document.querySelector(id);
		const position = getCoordsElem(targetSection).top + window.pageYOffset;

		bodyActions.animate({
			from: window.pageYOffset,
			to: position,
			duration: 900
		});
	}

	document.addEventListener('click', animate);
}

const animateContentByLoad = () => {
	const mainScreen = document.querySelector('.main-screen');

	if(!mainScreen) return;

	mainScreen.classList.add('main-screen--active');
}

export { 
	mainScreenFormActions, 
	mainScreenSlider,
	animateToSection,
	animateContentByLoad
};
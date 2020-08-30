import { useValidateForm } from '@helpers/useValidateForm';
import { useAlertModal } from '@helpers/useAlertModal';
import { modal } from '@components/Modal/Modal';
import { fieldText } from '@components/FieldText/FieldText';

const mainFormActions = () => {
	const mainForm = document.querySelectorAll('.main-form');

	if (mainForm.length === 0) return;

	mainForm.forEach(form => {

		const filesInput = form.querySelector('.files-block__input');
		const fields = form.querySelectorAll('.field-wrap__input');

		const fieldsRequired = [...fields].filter(field => field.classList.contains('field-wrap__input--req'));
		const validateArr = [...fieldsRequired].map(field => ({ field, error: true }));

		const validatemainForm = useValidateForm(validateArr);

		const successSubmitForm = target => {
			target.reset();

			const successModal = useAlertModal({
				title: 'Спасибо',
				description: `
					&lt;--мы всё получили, <br>
					свяжемся с вами в ближайшее время. <br>
					Работаем <strong>ПН-ПТ с 10:00 до 19:00</strong>--&gt;
				`,
				btn: 'хорошо'
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
	});
}

export { mainFormActions };

/**
 * Генерирует шаблон модального окна и открывает его.
 * @param  {String} options.id          - id модального окна
 * @param  {String} options.title       - текст заголовока
 * @param  {String} options.description - текст описания
 * @param  {String} options.btn         - текст кнопки
 * @param  {String} options.classes     - наименования классов
 * @return {Object} popup               - созданное модальное окно(DOM-элемент)
 */
const useAlertModal = ({ id = 'alert-modal', title, description, btn, classes }) => {
	const popup = document.createElement('div');

	popup.id = id;
	popup.className = classes ? classes + ' popup box-hidden shadow-block' : 'popup box-hidden shadow-block';
	popup.insertAdjacentHTML('beforeend', `
		<span class='popup__close-btn popup-close'>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M9.1568 8L16 14.8432L14.8424 16L8 9.1568L1.1568 16L0 14.8432L6.8424 8L0 1.1568L1.1568 0L8 6.8432L14.8424 0L16 1.1568L9.1568 8Z" fill="#A0A1A7"/>
			</svg>
		</span>
		${ title ? `<h2 class='popup__title'>${ title }</h2>` : '' }
		${ description ? `<p class='popup__description'>${ description }</p>` : '' }
		${ btn ?
			`<div class='popup__btn-wrap'>
				<button class='btn btn--blue popup-close'>${ btn }</div>
			</div>`
			: ''
		}
	`);

	document.body.append(popup);

	popup.addEventListener('afterHide', event => popup.remove());

	return popup;
}

export { useAlertModal };

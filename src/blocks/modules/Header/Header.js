import { bodyActions } from '@helpers/bodyActions';
import { useMediaQuery } from '@helpers/useMediaQuery';

/**
 * Добавление/удаление активного класса у header
 */

const header = document.querySelector('.header');

const toggleActiveClassHeader = () => {
	if (!header) return;

	if (window.pageYOffset > 0) {
		header.classList.add('header--active');
	} else {
		header.classList.remove('header--active');
	}

}

export { toggleActiveClassHeader };
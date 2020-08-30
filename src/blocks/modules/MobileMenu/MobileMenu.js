import { modal } from '@components/Modal/Modal';
import { helper } from '@helpers/helper.js';
import { useMediaQuery } from '@helpers/useMediaQuery.js';

const { isHidden } = helper;

const mobileMenuActions = () => {
	const mobileMenu = document.querySelector('.mobile-menu-popup');

	if (!mobileMenu) return;

	const menuItemsAnimate = () => {
		const menuItems = [...mobileMenu.querySelectorAll('.navbar__item')];

		if (menuItems.length === 0) return;

		const toggleActionsItems = (arr, handle) => {
			for(let i = 0; i < arr.length; i++) {
				const elem = arr[i];

				if (typeof handle === 'function') {
					handle(elem, i);
				}
			}
		}

		const setTransitionDelayPropery = toggleActionsItems(menuItems, (elem, index) => {
			const coefficient = index === 0 ? 0 : index;
				
			elem.style.transitionDelay = `${ 100 * coefficient }ms`;
		});

		const setActiveClass = mobileMenu.addEventListener('afterShow', () => {
			toggleActionsItems(menuItems, elem => elem.classList.add('active'));
		});

		const removeActiveClass = mobileMenu.addEventListener('afterHide', () => {
			toggleActionsItems(menuItems, elem => elem.classList.remove('active'));
		});
	}

	const hideMobileMenuByDesktop = () => {
		const desktopMediaQuery = useMediaQuery('(min-width: 992px)', 'ALL');

		desktopMediaQuery(matches => {
			if (matches) {
				if (!isHidden(mobileMenu)) {
					modal.hide(mobileMenu);
				}
			}
		});
	}

	menuItemsAnimate();
	hideMobileMenuByDesktop();
}

export { mobileMenuActions };
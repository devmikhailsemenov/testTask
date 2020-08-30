import '@helpers/detectBadBrowser';
import { bodyActions } from '@helpers/bodyActions.js';
import { mainFormActions } from '@components/MainForm/MainForm';
import { preloaderAction } from '@components/Preloader/Preloader.js';
import { toggleActiveClassHeader } from '@modules/Header/Header';
import { mobileMenuActions } from '@modules/MobileMenu/MobileMenu';
import { mainScreenFormActions, mainScreenSlider, animateToSection, animateContentByLoad } from '@modules/MainScreen/MainScreen';

document.addEventListener('DOMContentLoaded', () => {
	const bodyHiddenInit = bodyActions.hidden();
	const mobileMenuActionsInit = mobileMenuActions();
	const mainScreenSliderInit = mainScreenSlider();
	const mainScreenFormActionsInit = mainScreenFormActions();
	const animateToSectionInit = animateToSection();

	window.addEventListener('load', () => {

		const preloaderClose = () => {
			const preloader = document.querySelector('.preloader-page');

			const preloaderCallback = () => {
				bodyActions.scroll();
				animateContentByLoad();
			};

			preloaderAction(preloader, 'smoothly-show', preloaderCallback);
		}

		preloaderClose();

	});

	document.addEventListener('scroll', event => {
		toggleActiveClassHeader();
	});
});
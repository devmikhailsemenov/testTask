/**
 * Определяет IE и перенаправляет пользователя на страницу bad-browser.html
 * @return {Boolean} - false
 */
const detectBadBrowser = () => {
	const ua = window.navigator.userAgent;

	if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
		window.location.replace('/bad-browser.html');

		return false;
	}
}

export const badBrowser = detectBadBrowser();

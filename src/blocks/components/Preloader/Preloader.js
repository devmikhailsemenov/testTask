import { smoothly } from '@helpers/smoothly';

const { transitionNone } = smoothly;

const preloaderAction = (preloader, nameClass, preloaderCallback) => {
	setTimeout(() => transitionNone(preloader, nameClass, preloaderCallback), 1500)
}

export { preloaderAction }
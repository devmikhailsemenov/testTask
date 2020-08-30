/**
 * Возвращает функцию, которая возвращает предыдущее значение переменной value
 * @param initialValue - начальное значение переменной
 * @return {Function}
 */
const usePreviousValue = initialValue => {
	let previousValue = initialValue || null;

	return value => {
		const prev = previousValue;

		previousValue = value;

		return prev;
	}
}

export { usePreviousValue };
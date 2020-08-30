/**
 * В зависимости от величины передаваемого bytes возвращает соотв. единицу измерения с подписью.
 * @param  {Number} bytes - байты 
 * @return {String}
 * @example
 * 
 * useBytesToSize(1024);
 * // => '1Кб'
 */
const useBytesToSize = bytes => {

	const sizes = ['б', 'Кб', 'Мб'];

	if (bytes == 0) return 'n/a';

	const index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

	if (index == 0) return bytes + ' ' + sizes[index];

	return (bytes / Math.pow(1024, index)).toFixed(1) + ' ' + sizes[index];

}

export { useBytesToSize };

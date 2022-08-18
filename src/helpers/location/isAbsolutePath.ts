/**
 * Determine if path is an absolute url
 *
 * @param {string} path
 * @returns {boolean}
 */
 const isAbsolutePath = (path: string): boolean => path && path.substring(0, 4) === 'http' || false;

 export default isAbsolutePath;
 
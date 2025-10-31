// src/utils/dsa.js

/**
 * Sorts an array of objects by a specific key.
 * @param {Array<Object>} array - The array to sort.
 * @param {string} key - The object key to sort by.
 * @returns {Array<Object>} A new, sorted array.
 */
export const sortByKey = (array, key) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};
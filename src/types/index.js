/**
 * Shared JSDoc type definitions.
 * This is a plain JavaScript project — types are documented here as JSDoc
 * typedefs so editors can provide autocomplete and inline hints.
 * Nothing is exported at runtime; this file only carries documentation.
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {number} rating
 * @property {number} stock
 * @property {string} brand
 * @property {string} category
 * @property {string} thumbnail
 * @property {string[]} images
 * @property {number} [discountPercentage]
 */

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} name
 */

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {'success' | 'error' | 'info' | 'warning'} type
 * @property {string} message
 */

/**
 * @typedef {Object} Pagination
 * @property {number} currentPage
 * @property {number} pageSize
 * @property {number} total
 * @property {number} totalPages
 */

// No runtime exports — this file is only for JSDoc reference.
export {};
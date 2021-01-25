// @flow
const {v4} = require('uuid');

/**
 * generate an return an unique id using the uuid package
 * @returns string
 */
export const idFromUuid = (): string => v4();

import { nanoid } from 'nanoid';

export const addUUID = (id: string) => `${id}#${nanoid()}`;

export const clearUUID = (id: string) => id.replace(/(#[^#]*?)$/, '');

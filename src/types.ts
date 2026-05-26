export type TypeOfValues<T> = T[keyof T];

export interface Factory<T, U> {
	create(typeName: T): U;
}

export interface Command {
	execute(): void;
}

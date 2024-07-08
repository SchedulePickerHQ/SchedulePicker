export interface Factory<T, U> {
  create(typeName: T): U;
}

export interface Command {
  execute(): void;
}

export interface Factory<T, U> {
    create(typeName: T): U;
}

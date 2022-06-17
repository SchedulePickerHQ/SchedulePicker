export interface Insertion {
    insertTextAtCaret(windowObj: Window, target: HTMLElement | null, text: string): void;
}

export abstract class AbstractInsertion implements Insertion {
    abstract insertTextAtCaret(windowObj: Window, target: HTMLElement | null, text: string): void;
}

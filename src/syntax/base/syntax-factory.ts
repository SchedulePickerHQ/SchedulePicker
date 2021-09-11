import { Factory } from '../../utils/factory';
import { HtmlSyntax } from '../html-syntax';
import { MarkdownSyntax } from '../markdown-syntax';
import { Syntax } from './abstract-syntax';

export class SyntaxFactory implements Factory<'html' | 'markdown', Syntax> {
    create(syntax: 'html' | 'markdown'): Syntax {
        switch (syntax) {
            case 'html':
                return new HtmlSyntax();
            case 'markdown':
                return new MarkdownSyntax();
            default:
                throw new Error('Syntax is not implemented.');
        }
    }
}

export const getEventMenuColorCode = (eventMenu: string): string => {
    switch (eventMenu) {
        case '終日':
            return '#9acd32';
        default:
            // Throw new Error(`Not implement color of "${eventMenu}"`);
            return '#898989';
    }
};

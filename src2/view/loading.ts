export const LOADING_STATUS = {
    SHOW: 'SHOW',
    HIDE: 'HIDE',
} as const;

export type LoadingStatus = TypeOfValues<typeof LOADING_STATUS>;

export const showLoading = (shown: boolean) => {
    const cursor = shown ? 'progress' : 'auto';
    document.body.style.cursor = cursor;
};

export const LOADING_STATUS = {
    SHOW: 'Show',
    HIDE: 'Hide',
} as const;

export type LoadingStatus = TypeOfValues<typeof LOADING_STATUS>;

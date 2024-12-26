export const getAppUrl = (path: string): string => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    return `${appUrl}${path}`;
}
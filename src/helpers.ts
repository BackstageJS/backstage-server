export const sanitizeName = (appOrKey: string): string => appOrKey.replace(/\W/g, '-')

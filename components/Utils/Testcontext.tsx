import { createContext, useContext } from 'react';

export enum Themes {
    Dark = 'Dark',
    Light = 'Light',
}

export type ThemeContextType = {
    theme: Themes;
    setTheme: (Themes: Themes) => void;
}

export const ThemeContexts = createContext<ThemeContextType>({ theme: Themes.Dark, setTheme: theme => console.warn('no theme provider')});
export const useTheme = () => useContext(ThemeContexts); 
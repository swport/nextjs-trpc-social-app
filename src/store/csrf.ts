import { atom, useAtom } from 'jotai';

export const csrfTokenAtom = atom<string | null>(null);

export const useCsrfTokenAtom = () => {
    return useAtom(csrfTokenAtom);
};
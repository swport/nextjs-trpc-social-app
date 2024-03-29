import { atom } from "jotai";

type NOTIF_TYPES = "ERROR" | "SUCCESS" | "INFO";

type TStoreType = {
	show: boolean;
	content: string;
	title?: string;
	link?: string;
	link_text?: string;
	type?: NOTIF_TYPES;
};

const initialState: TStoreType = {
	show: false,
	content: "",
};

export const notifAtom = atom(initialState);

export const closeNotifAtom = atom(null, (_get, set) => {
	return set(notifAtom, { ..._get(notifAtom), show: false });
});

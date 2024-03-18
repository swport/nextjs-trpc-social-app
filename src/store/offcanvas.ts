import { atom } from "jotai";

type OFFC_VIEWS = "COMMENTS" | "";

type TStoreType = {
	show: boolean;
	title?: string;
	view?: OFFC_VIEWS;
} & Record<string, any>;

export const offCInitialState: TStoreType = {
	show: false,
	title: "",
	view: "",
};

export const offcAtom = atom(offCInitialState);

export const closeOffcAtom = atom(null, (_get, set) => {
	return set(offcAtom, offCInitialState);
});

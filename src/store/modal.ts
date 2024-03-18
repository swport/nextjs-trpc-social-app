import { atom } from "jotai";

type MODAL_VIEWS = "OTP_LOGIN" | "ABOUT_APP" | "ADD_POST" | "ADD_COMMENT" | "";

type TStoreType = {
	show: boolean;
	title: string;
	view?: MODAL_VIEWS;
} & Record<string, any>;

export const modalInitialState: TStoreType = {
	show: false,
	title: "",
	view: "ABOUT_APP",
};

export const modalAtom = atom(modalInitialState);

export const closeModalAtom = atom(null, (_get, set) => {
	return set(modalAtom, modalInitialState);
});

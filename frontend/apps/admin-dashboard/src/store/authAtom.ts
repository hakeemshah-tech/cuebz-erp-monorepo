import { atom } from "jotai";
import { User } from "@/types/userTypes";

// Atom to store the current user globally
export const currentUserAtom = atom<User | null>(null);

// Atom to track authentication loading state
export const authLoadingAtom = atom<boolean>(false);

// Atom to check if the user is authenticated
export const isAuthenticatedAtom = atom((get) => !!get(currentUserAtom));

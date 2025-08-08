import type { Storage } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const isServer = typeof window === 'undefined';

const noopStorage: Storage = {
    getItem: async () => {},
    setItem: async () => {},
    removeItem: async () => {}
};

export default isServer ? noopStorage : createWebStorage('local');

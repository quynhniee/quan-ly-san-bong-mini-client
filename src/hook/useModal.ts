import { createStore, useStore } from "../libs/external-store";

interface IModal {
  active: boolean;
  type?: string;
  page?: any;
  count?: number;
  remain?: number;
  displayName?: string;
  maxPageCount?: number;
  title?: string;
  content?: any;
  primaryText?: string;
  secondaryText?: string;
  data?: any;
}

interface IModals {
  [key: string]: IModal;
}

const modalStore = createStore<IModals>({});

export const useModal = (): {
  state: IModals;
  openModal: Function;
  closeModal: Function;
} => {
  const state = useStore(modalStore, (state) => state);

  const openModal = (key: string, data: IModal): void => {
    if (key) {
      modalStore.setState((prev) => ({
        ...prev,
        [key]: {
          ...data,
          active: true,
        },
      }));
    }
  };

  const closeModal = (key: string = ""): void => {
    if (key) {
      modalStore.setState((prev) => ({
        ...prev,
        [key]: {
          active: false,
        },
      }));
    }
  };

  return {
    state,
    openModal,
    closeModal,
  };
};

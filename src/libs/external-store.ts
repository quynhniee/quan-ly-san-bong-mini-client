import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * @author ThanhLM
 */

type State = {};

type Selector<T> = (state: T) => any;

type Listener = () => void;

type Store<T> = {
  getState: () => T;
  setState: (fn: (state: T) => T) => void;
  subscribe: (listener: Listener) => () => void;
  resetState: () => void;
};

export const createStore = <T extends State>(initialState: T): Store<T> => {
  let state = initialState;
  const getState = () => state;
  const listeners = new Set<Listener>();
  const setState = (fn: (state: T) => T) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };
  const resetState = () => {
    state = initialState;
  };
  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe, resetState };
};

export const useStore = <T extends State>(
  store: Store<T>,
  selector: Selector<T>
) => {
  const externalStore = useSyncExternalStore(
    store.subscribe,
    () => JSON.stringify(selector(store.getState())),
    () => JSON.stringify(selector(store.getState()))
  );

  const [state, setState] = useState<any>(JSON.parse(externalStore || ""));

  useEffect(() => {
    setState(JSON.parse(externalStore || ""));
  }, [externalStore]);

  return state;
};

declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, (newState: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P>(render: (props: P, ref: any) => any): any;
  export function memo<P>(Component: any, propsAreEqual?: (prev: P, next: P) => boolean): any;
  export function Fragment({ children }: { children: ReactNode }): any;
  export type ReactNode = string | number | boolean | null | undefined | ReactElement | ReactNode[];
  export type ReactElement = any;
  export type FC<P = {}> = (props: P) => ReactElement | null;
  export type CSSProperties = Record<string, string | number>;
  export type SyntheticEvent = any;
  export type MouseEvent = any;
  export type ChangeEvent = any;
  export type FormEvent = any;
  export type ReactEventHandler = (event: any) => void;
  export type MouseEventHandler = (event: any) => void;
  export type ChangeEventHandler = (event: any) => void;
  export type FormEventHandler = (event: any) => void;
  export type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null;
  export type RefObject<T> = { readonly current: T | null };
  export function createRef<T>(): RefObject<T>;
  export function useCallback<F extends Function>(callback: F, deps: any[]): F;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useImperativeHandle<T>(ref: Ref<T>, create: () => T, deps?: any[]): void;
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;
  export function useReducer<R extends React.Reducer<any, any>>(reducer: R, initialState: any, initializer?: (initialState: any) => any): [any, React.Dispatch<React.ReducerAction<R>>];
  export type Reducer<S, A> = (state: S, action: A) => S;
  export type Dispatch<A> = (action: A) => void;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export function useId(): string;
  export function useTransition(): [boolean, (callback: () => void) => void];
  export function useDeferredValue<T>(value: T): T;
  export function useSyncExternalStore<S>(subscribe: (callback: () => void) => () => void, getSnapshot: () => S, getServerSnapshot?: () => S): S;
  export function useInsertionEffect(effect: () => void | (() => void), deps?: any[]): void;
}

declare module 'react/jsx-runtime' {
  import { ReactElement, FC } from 'react';
  export type JSXElementConstructor = FC<any> | keyof JSX.IntrinsicElements;
  export interface IntrinsicElements {
    [elemName: string]: any;
  }
  export type Element = ReactElement;
  export type ElementClass = any;
  export type ElementAttributesProperty = { props: any };
  export type ElementChildrenAttribute = { children: any };
  export type JSX = {
    Element: ReactElement;
    IntrinsicElements: IntrinsicElements;
    ElementClass: ElementClass;
    ElementAttributesProperty: ElementAttributesProperty;
    ElementChildrenAttribute: ElementChildrenAttribute;
  };
  export function jsx(type: JSXElementConstructor, props: any, key?: string): ReactElement;
  export function jsxs(type: JSXElementConstructor, props: any, key?: string): ReactElement;
  export function jsxDEV(type: JSXElementConstructor, props: any, key?: string): ReactElement;
}

declare module 'react-dom' {
  export function render(element: any, container: Element): any;
  export function createRoot(container: Element): { render: (element: any) => void };
  export function hydrateRoot(container: Element, element: any): any;
  export function unmountComponentAtNode(container: Element): boolean;
  export function findDOMNode(component: any): Element | null;
  export function createPortal(children: any, container: Element): any;
  export function flushSync(callback: () => void): void;
}

declare module 'motion/react' {
  import { FC, ReactNode } from 'react';
  export interface MotionProps extends Record<string, any> {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    children?: ReactNode;
    className?: string;
    style?: any;
  }
  export function motion<T extends keyof JSX.IntrinsicElements>(Component: T): FC<MotionProps & JSX.IntrinsicElements[T]>;
  export const AnimatePresence: FC<{ children: ReactNode; initial?: boolean; custom?: any; exitBeforeEnter?: boolean }>;
  export const motion: {
    div: FC<MotionProps & JSX.IntrinsicElements['div']>;
    span: FC<MotionProps & JSX.IntrinsicElements['span']>;
    section: FC<MotionProps & JSX.IntrinsicElements['section']>;
    button: FC<MotionProps & JSX.IntrinsicElements['button']>;
    [key: string]: FC<any>;
  };
}
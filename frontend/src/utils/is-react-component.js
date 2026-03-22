/**
 * Checks if a given value is a React function component.
 */
export const isFunctionComponent = (component) => {
    return typeof component === "function";
};

/**
 * Checks if a given value is a React class component.
 */
export const isClassComponent = (component) => {
    return (
        typeof component === "function" &&
        component.prototype &&
        (!!component.prototype.isReactComponent || !!component.prototype.render)
    );
};

/**
 * Checks if a given value is a React forwardRef component.
 */
export const isForwardRefComponent = (component) => {
    return (
        typeof component === "object" &&
        component !== null &&
        component.$$typeof?.toString() === "Symbol(react.forward_ref)"
    );
};

/**
 * Checks if a given value is any valid React component.
 */
export const isReactComponent = (component) => {
    return isFunctionComponent(component) || isForwardRefComponent(component) || isClassComponent(component);
};

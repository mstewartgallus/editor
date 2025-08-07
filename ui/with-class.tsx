import type {
    ElementType,
    ComponentType
} from "react";
import { createElement } from "react";
import { componentName } from "./component-name";

interface Props {
    className?: string;
}

const withClassImpl: <P extends Props,>(
    Component: ElementType<P>,
    className: string
) => ComponentType<P> = <P extends Props,>(
    Component: ElementType<P>,
    className: string
) => (props: P) => {
    const clazzes = [className];
    const clazz = props.className;
    if (clazz) {
        clazzes.push(clazz);
    }
    const theClass = clazzes.join(' ');
    return createElement(Component, { ...props, className: theClass });
};

export const withClass = <P extends Props,>(
    Component: ElementType<P>,
    className: string
) => {
    const Classy = withClassImpl(Component, className);
    const name = componentName(Component);
    Classy.displayName = `.${className}(${name})`;
    return Classy;
};

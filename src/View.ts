import hyperhtml from 'hyperhtml/esm';
import forIn from 'lodash/forIn';
import channel from './ViewChannel';

interface IViewOpts {
    [key: string]: any;
}

interface IBindings {
    [key: string]: (self: View, event: Event) => void;
}

class View {
    public template?: (templateOpt?: any) => any;

    public el: Element = window.document.createElement('div');

    public props: any = {};

    public bindings: IBindings = {};

    private rendered: boolean = false;

    private children: { [key: string]: () => View } = {};

    constructor(props?: IViewOpts) {
        if (props) {
            this.props = props || {};
        }
    }

    public render(): void {
        if (typeof this.template === 'function') {
            hyperhtml(this.el).apply(null, this.template(this.props));

            if (this.el.childElementCount > 1) {
                const componentName = this.constructor.name;
                throw { message: `[${componentName}]: cannot have more than one child node in template` };
            }

            forIn(this.children, (childInitor, childName) => this.renderChildren(childInitor, childName));
        } else {
            const componentName = this.constructor.name;
            throw { message: `[${componentName}]: template is not setup properly.` };
        }
        if (!this.rendered) {
            forIn(this.bindings, (listener, selector) => channel.registerFromBindings(listener, selector));
        }
        this.rendered = this.rendered || true;
    }

    public updateProps(opt: any): void {
        forIn(opt, (value, prop) => this.props[prop] = value);
        this.render();
    }

    public hhtml(strings: TemplateStringsArray, ...vars: any[]) {
        const variablesInTmpl = vars.map((variable, index) => {
            const isVarViewComponent = variable instanceof Array && variable[0].prototype instanceof View;

            if (isVarViewComponent) {
                const [CustomView, props] = variable;
                const instanceName = `${this.constructor.name}-${CustomView.name}-${index}`;
                this.children[instanceName] = () => new CustomView(props);

                return hyperhtml`<div data-id="${instanceName}"></div>`;
            } else {
                return variable || '';
            }
        });

        return [strings].concat(variablesInTmpl);
    }

    public renderChildren(childInitor: () => View, childName: string) {
        const placeHolder = this.el.querySelector(`div[data-id="${childName}"]`);

        if (placeHolder && placeHolder.parentNode) {
            const parentNode = placeHolder.parentNode;
            const viewInstance = childInitor();
            parentNode.replaceChild(viewInstance.el.children[0], placeHolder);
        }
    }
}

export default View;

export function renderDOM(rootSelector, [CustomView, props]: any[]) {
    const element = window.document.querySelector(rootSelector);

    if (element) {
        const view = new CustomView(props);
        element.innerHTML = '';
        element.appendChild(view.el.children[0]);
    }
}

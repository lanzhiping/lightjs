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

    public bindings: IBindings = {}; // binding names are global, need to refactor it.

    private children: { [key: string]: View } = {};

    private rendered: boolean = false;

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
        return [strings].concat(vars.map(this.mapExpression));
    }

    private mapExpression = (variable, index) => {
        const isVarViewComponent = variable instanceof Array && variable[0].prototype instanceof View;

        return isVarViewComponent
            ? this.renderChild(variable, index)
            : (variable === undefined ? '' : variable);
    }

    private renderChild(variable, index) {
        const [CustomView, props] = variable;
        const instanceName = `${CustomView.name}-${index}`;
        if (!this.children[instanceName]) {
            const viewInstance = new CustomView(props);
            this.children[instanceName] = viewInstance.el.children[0];
        }

        return this.children[instanceName];
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

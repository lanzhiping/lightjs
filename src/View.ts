import assignWith from 'lodash/assignWith';

interface IViewOpts {
    [key: string]: any;
}

interface IBinding {
    [key: string]: (self: View, event: Event) => void;
}

class View {
    public template: string | ((templateOpt?: any) => string) = '';

    public el: Element = window.document.createElement('div');

    public props: any = {};

    public binding: IBinding = {};

    private eles: { [key: string]: Element } = {};

    private rendered: boolean = false;

    private children: {
        [key: string]: () => View;
    } = {};

    constructor(props?: IViewOpts) {
        if (props) {
            this.props = props || {};
        }
        if (this.template) {
            this.render();
        }
    }

    public render(): void {
        if (this.rendered) {
            const newEle = window.document.createElement('div');

            if (typeof this.template === 'string') {
                newEle.innerHTML = this.template;
            }
            if (typeof this.template === 'function') {
                newEle.innerHTML = this.template(this.props);
            }

            this.patchAttributes(newEle);
        } else {
            if (typeof this.template === 'string') {
                this.el.innerHTML = this.template;
            }
            if (typeof this.template === 'function') {
                this.el.innerHTML = this.template(this.props);
            }
            if (this.el.childElementCount > 1) {
                throw { message: 'cannot have more than one child node in template' };
            }

            this.createBindings();

            if (Object.keys(this.children)) {
                this.renderChildren();
            }
        }
        this.rendered = this.rendered || true;
    }

    public updateProps(opt: any): void {
        Object
            .keys(this.props)
            .forEach((key) => this.props[key] = opt[key]);
        this.render();
    }

    public createBindings() {
        Object.keys(this.binding)
            .map((key) => key.split(':'))
            .forEach(([ele, eventType]) => {
                const callback = this.binding[`${ele}:${eventType}`];
                const element = this.el.querySelector(ele.replace('@', '')) as Element;

                if (!ele || !eventType || !callback) {
                    throw { message: `event setup error: ${ele} ${eventType}d` };
                }

                if (element) {
                    const listener = (event) => callback(this, event);
                    element.addEventListener(eventType, listener);
                    (element as any).distoryEvent = () => element.removeEventListener(eventType, listener);
                    this.eles[ele] = element;
                }
            });
    }

    public tmpl(strings: TemplateStringsArray, ...vars: any[]) {
        return strings.reduce(
            (final: string, current: string, index: number) => {
                const variable = vars[index];

                if (variable instanceof Array && variable[0].prototype instanceof View) {
                    const [CustomView, props] = variable;
                    const instanceName = CustomView.name + index;
                    this.children[instanceName] = () => new CustomView(props);

                    return final + current + `<div data-id="${instanceName}"></div>`;
                } else {
                    return final + current + (variable || '');
                }
            },
            ''
        );
    }

    public renderChildren() {
        Object.keys(this.children)
            .forEach((childName) => {
                const placeHolder = this.el.querySelector(`div[data-id="${childName}"]`);

                if (placeHolder && placeHolder.parentNode) {
                    const parentNode = placeHolder.parentNode;
                    const viewInstance = this.children[childName]();
                    parentNode.replaceChild(viewInstance.el.children[0], placeHolder);
                } else {
                    return;
                }
            });
    }

    public patchAttributes(newEle): void {
        const mergeByTypes = (originValue, newValue) => {
            if (typeof originValue === 'function') {
                return originValue;
            }
            if (originValue instanceof Array) {
                return newValue;
            }
            if (typeof originValue === 'object') {
                return mergeByTypes(originValue, newValue);
            }

            return newValue;
        };

        // todo: dom patching
        assignWith(this.el, newEle, mergeByTypes);

    }
}

export default View;

export function renderDOM(rootSelector, [CustomView, props]: any[]) {
    const element = window.document.querySelector(rootSelector);

    if (element) {
        const view = new CustomView(props);
        element.innerHTML = '';
        element.appendChild(view.el);
    }
}

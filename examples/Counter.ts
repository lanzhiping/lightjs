import View from '../src/View';
import hyperhtml from 'hyperhtml';

class Counter extends View {
    public bindings = {
        'click:p.counter': () => {
            const count = this.props.count + 1;
            this.updateProps({ ...this.props, count });
        }
    };

    public props = { count: 0 };

    constructor() {
        super();
        this.render();
    }

    public template = (props) => this.hhtml`
        <p class="counter">
            Clicked times: ${props.count || '0'}
            ${ props.count % 2
                ? hyperhtml`(sigular)`
                : hyperhtml`(odd)`
            }
        </p>
    `
}

export default Counter;

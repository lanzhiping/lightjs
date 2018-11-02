import View from '../src/View';
import hyperhtml from 'hyperhtml';

class OtherView extends View {
    public bindings = {
        'click:div.counter': () => {
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
        <div class="counter">
            Counter: ${props.count}
            ${props.count % 2 ? hyperhtml`<p>sigular</p>` : hyperhtml`<p>odd</p>`}
        </div>
    `
}

export default OtherView;

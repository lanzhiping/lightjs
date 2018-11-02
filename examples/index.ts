import './index.css';
import View, { renderDOM } from '../src/View';
import OtherView from './OtherView';

class MyView extends View {
    public bindings = {
        'input:input.greeting-input': (event) => {
            const inputName = event.target.value;
            this.updateProps({
                ...this.props,
                greetingName: inputName
            });
        },
        'click:div.greeting': (event) => {
            const count = Number(event.target.dataset.count) + 1;
            this.updateProps({
                ...this.props,
                count
            });
        }
    };

    constructor(props) {
        super(props);
        this.render();
    }

    public template = (props) => this.hhtml`
        <div class="greeting">
            <p>Hello ${props.greetingName || 'world'}!</p>
            <input class="greeting-input" value="${props.greetingName}"/>
            ${[OtherView]}
        </div>
    `
}

function startApp() {
    renderDOM('#app', [MyView, { greetingName: '123' }]);
}

if ((module as any).hot) {
    startApp();
    (module as any).hot.accept();
}

import './index.css';
import View, { renderDOM } from '../src/View';
import Counter from './Counter';

class MyView extends View {
    public bindings = {
        'input:input.greeting-input': (event) => {
            const inputName = event.target.value;
            this.updateProps({
                ...this.props,
                greetingName: inputName
            });
        }
    };

    constructor(props) {
        super(props);
        this.render();
    }

    public template = (props) => this.hhtml`
        <div class="lightjs">
            <div class="lightjs_greeting">
                <div>
                    Please input a name:
                    <input class="greeting-input" value="${props.greetingName}"/>
                </div>
                <p>Hello ${props.greetingName || 'world'}!</p>
            </div>
            <div class="lightjs_counter">
                ${[Counter]}
            </div>
        </div>
    `
}

function startApp() {
    renderDOM('#app', [MyView, { greetingName: 'world' }]);
}

if ((module as any).hot) {
    startApp();
    (module as any).hot.accept();
}

import './index.css';
import View, { renderDOM } from '../src/View';

class MyView extends View {
    public binding = {
        '@input.greeting-input:change'(self: View, event) {
            console.log('----event', event);
            const inputName = event.target.name;
            self.updateProps({ ...self.props, greetingName: inputName });
        }
    };

    constructor(props?) {
        super(props);
        this.render();
    }

    public template = (props) => this.tmpl`
        <div>
            <div class="greeting">
                <p>Hello ${props.greetingName}!</p>
                <input class="greeting-input" />
            </div>
        </div>
    `
}

function startApp() {
    renderDOM('#app', [MyView, { greetingName: 'world' }]);
}
startApp();

if ((module as any).hot) {
    startApp();
    (module as any).hot.accept();
}

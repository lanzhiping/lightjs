# LightJs

## Description
LightJs is created for fun, and for very small projects.

LightJs doesn't have two-way bindings, VDOM. However it let a team to have a View class pattern to follow.

## Size
production build size: *31KB*

## Example

```javascript
    class MyView extends View {
        binding = {
            'change:input.greeting-input'(self, event) {
                const inputName = event.target.name;
                self.updateProps({ ...self.props, greetingName: inputName });
            }
        }

        constructor(props) {
            super(props);
            this.render();
        }

        template = (props) => this.hhtml`
            <div>
                <div class="greeting">
                    <p>Hello ${props.greetingName}!</p>
                    <input class="greeting-input" />
                </div>
                ${[ChildView, props.childProps]}
            </div>
        `
    }
```


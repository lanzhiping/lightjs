// import View from './View';
// import * as assert from 'assert';
// import * as util from 'util';
// /* tslint:disable:max-classes-per-file */

// describe('View.ts', () => {
//     it('View should be a constructor', () => {
//         assert.ok(util.isFunction(View));
//     });

//     describe('View.template', () => {
//         it('View template can be a string', () => {
//             const template = '<div>hello world.</div>';
//             class MyView extends View {
//                 public template = template;

//                 constructor(props?) {
//                     super(props);
//                     this.render();
//                 }
//             }

//             const view = new MyView();
//             assert.equal(view.el.innerHTML, template);
//         });

//         it('View template can be a function return a string', () => {
//             const name = 'John';
//             class MyView extends View {
//                 constructor(props?) {
//                     super(props);
//                     this.render();
//                 }

//                 public template = (option: any) => `<div>hi ${option.name}.</div>`;
//             }
//             const view = new MyView({ name });

//             assert.equal(view.el.innerHTML, '<div>hi John.</div>');
//         });
//     });

//     describe('View class extension', () => {
//         it('extend View class', () => {
//             class BlockView extends View {
//                 public template = '<div></div>';

//                 constructor() {
//                     super();
//                     this.render();
//                 }
//             }
//             const blockView = new BlockView();

//             assert.ok(util.isFunction(blockView.render));
//             assert.ok(util.isString(blockView.template));
//             assert.ok(blockView.template === '<div></div>');
//         });

//         it('extend View template', () => {
//             const template = '<p>hello world.</p>';
//             class BlockView extends View {
//                 public template = template;
//             }
//             const blockView = new BlockView();

//             assert.ok(util.isString(blockView.template));
//             assert.ok(blockView.template === template);
//         });

//         it('extend View template, and rendering with props', () => {
//             const template = (templateProps) => `<p>hello ${templateProps.name}.</p>`;
//             const props = { name: 'Jhon' };

//             class BlockView extends View {
//                 public template = template;

//                 constructor(opts) {
//                     super(opts);
//                     this.render();
//                 }
//             }
//             const blockView = new BlockView(props);

//             assert.ok(util.isFunction(blockView.template));
//             assert.ok(blockView.el.innerHTML === template(props));
//         });
//     });

//     describe('View render', () => {
//         it('re-render with props', () => {
//             class MyView extends View {
//                 constructor(props) {
//                     super(props);
//                     this.render();
//                 }

//                 public template = (props) => `<div>hello ${props.name}</div>`;
//             }
//             const view = new MyView({ name: 'Jhon' });

//             assert.equal(view.el.innerHTML, '<div>hello Jhon</div>');
//             view.updateProps({ ...view.props, name: 'Marry' });
//             assert.equal(view.el.innerHTML, '<div>hello Marry</div>');
//         });

//         it('be able to render with new props', () => {
//             class MyView extends View {
//                 constructor(props) {
//                     super(props);
//                     this.render();
//                 }

//                 public template = (props) => `
//                     <div>
//                         <input />
//                         <div>hello ${props.name}</div>
//                     </div>
//                 `
//             }

//             const view = new MyView({ name: 'John' });
//             view.updateProps({ name: 'Marry' });

//             const noOldGreeting = !view.el.innerHTML.includes('<div>hello Jhon</div>');
//             const hasNewGreeting = view.el.innerHTML.includes('<div>hello Marry</div>');
//             assert.ok(noOldGreeting);
//             assert.ok(hasNewGreeting);
//         });

//         it('be able to bind events', () => {
//             class MyView extends View {
//                 public binding = {
//                     '@input:change': (self, event) => {
//                         const newValue = (event.target as any).value;
//                         self.updateProps({ name: newValue });
//                     }
//                 };

//                 constructor(props) {
//                     super(props);
//                     this.render();
//                 }

//                 public template = (props) => `
//                     <div>
//                         <input />
//                         <div>hello ${props.name}</div>
//                     </div>
//                 `
//             }

//             const view = new MyView({ name: 'Jhon' });
//             (view as any).eles['@input'].trigger('change', { target: { value: 'Marry' }});

//             const noOldGreeting = !view.el.innerHTML.includes('<div>hello Jhon</div>');
//             const hasNewGreeting = view.el.innerHTML.includes('<div>hello Marry</div>');
//             assert.ok(noOldGreeting);
//             assert.ok(hasNewGreeting);
//         });

//         it('able to render other views in template', () => {
//             class MyView extends View {
//                 public template = '<div>my view</div>';

//                 constructor() {
//                     super();
//                     this.render();
//                 }
//             }
//             class OtherView extends View {
//                 constructor() {
//                     super();
//                     this.render();
//                 }

//                 public template = () => this.tmpl`<div>${[MyView]}</div>`;
//             }

//             const otherView = new OtherView();
//             const myViewInitializer = (otherView as any).children.MyView0;
//             assert.ok(util.isFunction(myViewInitializer));
//         });
//     });
// });

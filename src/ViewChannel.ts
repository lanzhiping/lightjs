
interface IChannel {
    events: {[type: string]: Array<(event: Event) => void> };
    subscribe: (type: string, listener: (event: Event) => void) => void;
    eventDispatcher: (event: Event) => void;
    registerFromBindings: (listener: (event: Event) => void, selector: string) => void;
}

const channel: IChannel = {
    events: {},

    eventDispatcher(this: IChannel, event: Event) {
        const eventType = event.type;
        const listeners = this.events[eventType];
        const { localName, className } = event.target as any;
        const eventId = `${localName}.${className.replace(' ', '.')}`;
        const dispatchById = (listener) => listener._eventId === eventId && listener(event);
        listeners.forEach(dispatchById);
    },

    subscribe(type, listener) {
        if (typeof listener !== 'function') {
            throw { message: '[event]: event handler is not a function.' };
        }

        const listeners = this.events[type];
        if (listeners) {
            listeners.push(listener);
        } else {
            this.events[type] = [listener];
            window.document.body.addEventListener(type, (event) => this.eventDispatcher(event));
        }
    },

    registerFromBindings(this: IChannel, listener: any, selector) {
        const [eventType, eventId] = selector.split(':');
        listener._eventId = eventId;
        this.subscribe(eventType, listener);
    }
};

export default channel;

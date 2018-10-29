import * as path from 'path';
import * as fs from 'fs';
import * as Mocha from 'mocha';
import { utils } from 'mocha';

const allFiles = ['components', 'pureComponents', 'src'].reduce(
    (total, dir) => {
        const dirPath = path.resolve(__dirname, dir);
        const srcFiles = utils.lookupFiles(dirPath, ['ts', 'scss'], true);
        const testFiles = utils.lookupFiles(dirPath, ['test.ts'], true);
        total.src = total.src.concat(srcFiles);
        total.test = total.test.concat(testFiles);

        return total;
    },
    { src: [] as string[], test: [] as string[] }
);

const createElement = (ele) => {
    return {
        ele,
        listeners: {},
        addEventListener(type, listener) {
            this.listeners[type] = listener;
        },
        trigger(type, event) {
            this.listeners[type](event);
        },
        querySelector(selector) {
            return createElement(selector);
        }
    };
};

const returnClassesName = (moduleObj, filePath) => {
    const contentStr = fs.readFileSync(filePath).toString('utf-8');
    const keys: string[] = [];
    const reg = /(\n\n|\s)\.[^ ]+/g;
    let matched = reg.exec(contentStr);
    while (matched !== null) {
        keys.push(matched[0].replace(/^(\n\n|\s)\./, ''));
        matched = reg.exec(contentStr);
    }
    Object.assign(moduleObj.exports, keys.reduce((map, key) => ({ ...map, [key]: key }), {}));

    return moduleObj;
};

const helper = {
    mockWindow: () => {
        (global as any).window = {
            document: {
                createElement,
                querySelector: createElement,
            }
        };
    },
    handleSCSS: () => {
        require.extensions['.scss'] = returnClassesName;
    },
    register: () => {
        helper.mockWindow();
        helper.handleSCSS();
    },
    reset: () => {
        delete (global as any).window;
        delete require.extensions['.scss'];
        allFiles.src.forEach((file) => delete require.cache[file]);
    }
};

const loadAndRunTests = () => {
    helper.register();

    const mochaIns = new Mocha({ fullStackTrace: true, globals: ['window'] });
    mochaIns.suite.afterAll('after all tests', () => helper.reset());
    allFiles.test.forEach((testFile: string) => mochaIns.addFile(testFile));
    mochaIns.run();
};

if (process.argv.includes('--watch')) {
    (Mocha.utils as any).watch(allFiles.src, () => {
        try {
            loadAndRunTests();
        } catch (error) {
            /* tslint:disable:no-console */
            console.log('Having issue of running mocha tests');
            console.log(error);
            /* tslint:enable:no-console */
        }
    });
} else {
    loadAndRunTests();
}

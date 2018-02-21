import test from 'ava';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    t.context.Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/current-module/node_modules/want-js-plugin.some': {
                        return ['some.config.js', 'some1.config.js', 'index.js'];
                    } case '/user/soft/current-module/node_modules/want-js-plugin.empty': {
                        return ['index.js', 'node_modules'];
                    } case '/user/soft/current-module/node_modules/want-js-plugin.startrek': {
                        return ['index.js', 'some.config.js'];
                    } case '/user/soft/current-module/node_modules': {
                        return ['ava', 'bunker', 'want-js-plugin.startrek', 'want-js-plugin.some', 'want-js-plugin.empty'];
                    } case '/user/soft/current-module': {
                        return ['some.config.js', 'index.js', 'test.js', 'node_modules'];
                    } case '/user/soft': {
                        return ['current-module', 'node_modules'];
                    } case '/user/soft/node_modules': {
                        return ['wantjs', 'want-js', 'ava'];
                    } case '/user/node_modules': {
                        return ['wantjs', 'want-js', 'ava', 'want-js-plugin.startrek'];
                    } case '/user/node_modules/want-js-plugin.startrek': {
                        return ['some.config.js', 'node_modules'];
                    } case '/user': {
                        return ['some.config.js', 'some1.config.js', 'index.js', 'node_modules'];
                    } default: {
                        return [];
                    }
                }
            }
        },
        '/user/soft/current-module/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 1,
            a: {
                a: 1,
                v: 1
            }
        },
        '/user/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 2,
            some: 2
        },
        '/user/soft/current-module/node_modules/want-js-plugin.some/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 3,
            some: 3,
            a: {
                t: 3
            }
        },
        '/user/soft/current-module/node_modules/want-js-plugin.startrek/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 4,
            a: {
                t: 4,
                s: 4
            }
        },
        '/user/node_modules/want-js-plugin.startrek/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 5,
            a: {
                t: 5,
                v: 5
            }
        }
    });
});

test('Check usual work of lookupNPM', t => {
    const lookuper = new t.context.Lookuper('some.config.js');
    const actual = lookuper
        .lookupNPM('/user/soft/current-module', 'want-js-plugin.')
        .resultConfig;
    const expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        data: 4,
        a: { t: 4, s: 4, v: 5 },
        some: 3
    };
    t.deepEqual(actual, expected);
});

test('Check work lookupNPM and lookup together', t => {
    const lookuper = new t.context.Lookuper('some.config.js');
    const actual = lookuper
        .lookup('/user/soft/current-module')
        .lookupNPM('/user/soft/current-module', 'want-js-plugin.')
        .resultConfig;
    const expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        data: 1,
        a: { a: 1, t: 4, s: 4, v: 1 },
        some: 2
    };
    t.deepEqual(actual, expected);
});

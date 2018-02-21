import test from 'ava';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    t.context.Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/current-module': {
                        return ['some.config.js', 'index.js', 'test.js'];
                    } case '/user/soft': {
                        return [];
                    } case '/user': {
                        return ['some.config.js'];
                    } default: {
                        return [];
                    }
                }
            },
            readFileSync: data => {
                switch (data) {
                    case '/user/soft/current-module/some.config.js': {
                        return `{
                            "data": 1
                        }`;
                    } case '/user/some.config.js': {
                        return `{
                            "data": 2
                        }`;
                    } default: {
                        return '{}';
                    }
                }
            }
        },
        '/user/soft/current-module/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 1
        },
        '/user/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            data: 2
        }
    });
});

test('Check default work', t => {
    const lookuper = new t.context.Lookuper('some.config.js');
    const actual = lookuper
        .lookup('/user/soft/current-module')
        .resultConfig;
    const expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        data: 1
    };
    t.deepEqual(actual, expected);
});

test('Check work with json', t => {
    const lookuper = new t.context.Lookuper('some.config.js', true, 'json');
    const actual = lookuper
        .lookup('/user/soft/current-module')
        .resultConfig;
    const expected = {
        data: 1
    };
    t.deepEqual(actual, expected);
});

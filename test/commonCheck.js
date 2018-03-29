import test from 'ava';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    t.context.Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/current-module': {
                        return ['some.config.js', 'index.js', 'test.js', 'some.config.json'];
                    } case '/user/soft/': {
                        return [];
                    } case '/user': {
                        return ['some.config.js', 'some.config.json'];
                    } default: {
                        return [];
                    }
                }
            },
            readFileSync: data => {
                switch (data) {
                    case '/user/some.config.json': {
                        return `{
                            "data": 1
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
    const lookuper = new t.context.Lookuper('some.config.json', true);
    const actual = lookuper
        .lookup('/user/soft/current-module')
        .resultConfig;
    const expected = {
        data: 1
    };
    t.deepEqual(actual, expected);
});

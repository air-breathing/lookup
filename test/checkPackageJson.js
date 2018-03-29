import test from 'ava';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    t.context.Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/current-module': {
                        return ['package.json'];
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
                    case '/user/soft/current-module/package.json': {
                        return `{
                            "configData": {
                                "data": 1
                            }
                        }`;
                    } default: {
                        return '{}';
                    }
                }
            }
        }
    });
});

test('Check lookup in package.json', t => {
    const lookuper = new t.context.Lookuper('some.config.js');
    const actual = lookuper
        .lookupPackage('/user/soft/current-module', 'configData')
        .resultConfig;
    const expected = {
        data: 1
    };
    t.deepEqual(actual, expected);
});

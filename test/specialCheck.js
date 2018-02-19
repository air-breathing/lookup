
import test from 'ava';
import proxyquire from 'proxyquire';
import 'mock-fs';

test('Check work with js without mixing', t => {
    const Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/common/current-module': {
                        return ['some.config.js', 'index.js', 'test.js'];
                    } case '/user/soft/common/': {
                        return ['current-module', 'some.config.js'];
                    } case '/user': {
                        return ['soft'];
                    } case '/': {
                        return ['some.config.js', 'user', 'doc', 'dom'];
                    } default: {
                        return [];
                    }
                }
            }
        },
        '/user/soft/common/current-module/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            commonData: 1

        },
        '/user/soft/common/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true
        },
        '/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            commonData: 2,
            special: 'original'
        }
    });

    let lookuper = new Lookuper('some.config.js', false);
    let actual = lookuper.lookup('/user/soft/common/current-module');
    let expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        commonData: 1
    };
    t.deepEqual(actual, expected, 'Error with false');

    lookuper = new Lookuper('some.config.js', true);

    actual = lookuper.lookup('/user/soft/common/current-module');
    expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        commonData: 1,
        special: 'original'
    };
    t.deepEqual(actual, expected, 'Error with true');
});

test('Check work with js for deep search in object', t => {
    const Lookuper = proxyquire('../index.js', {
        fs: {
            readdirSync: path => {
                switch (path) {
                    case '/user/soft/common/current-module': {
                        return ['some.config.js', 'index.js', 'test.js'];
                    } case '/user/soft/common/': {
                        return ['current-module', 'some.config.js'];
                    } case '/user': {
                        return ['soft'];
                    } case '/': {
                        return ['some.config.js', 'user', 'doc', 'dom'];
                    } default: {
                        return [];
                    }
                }
            }
        },
        '/user/soft/common/current-module/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            commonData: 1,
            deep: {
                a: 1,
                b: 1
            }

        },
        '/user/soft/common/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true
        },
        '/some.config.js': {
            '@runtimeGlobal': true,
            '@noCallThru': true,
            commonData: 2,
            special: 'original',
            deep: {
                a: 3,
                c: 1
            }
        }
    });

    let lookuper = new Lookuper('some.config.js', false);
    let actual = lookuper.lookup('/user/soft/common/current-module');
    let expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        commonData: 1,
        deep: {
            a: 1,
            b: 1
        }
    };
    t.deepEqual(actual, expected, 'Error with false');

    lookuper = new Lookuper('some.config.js', true);

    actual = lookuper.lookup('/user/soft/common/current-module');
    expected = {
        '@runtimeGlobal': true,
        '@noCallThru': true,
        commonData: 1,
        special: 'original',
        deep: {
            a: 1,
            b: 1,
            c: 1
        }
    };
    t.deepEqual(actual, expected, 'Error with true');
});

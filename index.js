
const fs = require('fs');
const path = require('path');
const os = require('os');
const defaultsDeep = require('lodash.defaultsdeep');
const parsingTypes = {
    JSON: 'json',
    JS: 'js'
};

class Lookuper {
    constructor(configName, isMixedConfigs = true, fileType = parsingTypes.JS) {
        // TODO: сделать не только строку, но и массив, нужно ли?
        this.configName = configName;
        this.isMixedConfigs = isMixedConfigs;
        this.fileType = parsingTypes[fileType.toUpperCase()];
        this.resultConfig = {};
        this.shouldExit = false;
    }

    lookup(dir) {
        return this._lookup(dir);
    }

    _lookup(dir) {
        let files;
        try {
            files = fs.readdirSync(dir);
        } catch (e) {
            console.warn(`Error readign directory ${dir}, skipped: `, e.message);
            return this.resultConfig;
        }
        if (files.includes(this.configName)) {
            this._mixConfig(path.join(dir, this.configName));
        }

        if (dir === os.homedir() || dir === '/' || this.shouldExit) {
            return this.resultConfig;
        }

        return this._lookup(path.resolve(dir, '../'));
    }

    _mixConfig(confPath) {
        let conf;
        try {
            if (this.fileType === parsingTypes.JSON) {
                conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
            } else if (this.fileType === parsingTypes.JS) {
                conf = require(confPath);
            }
        } catch (e) {
            console.warn(`Error loading config from ${confPath}, skipped: `, e.message);
            return;
        }
        defaultsDeep(this.resultConfig, conf);
        if (!this.isMixedConfigs) {
            this.shouldExit = true;
        }
    }
}

module.exports = Lookuper;

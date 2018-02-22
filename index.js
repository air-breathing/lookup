const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
const defaultsDeep = require('lodash.defaultsdeep');
const parsingTypes = {
    JSON: 'json',
    JS: 'js'
};

const moduleDir = 'node_modules';

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
        this._lookup(dir);
        return this;
    }

    /* Поиск по node_modules */
    lookupNPM(dir, prefix) {
        this._setPrefix(prefix);
        this._searchPlugins(dir);
        return this;
    }

    async lookupGlobalModules(prefix) {
        this._setPrefix(prefix);
        const pathToGlobalModules = await Lookuper._getPathToGlobalModules();
        this._searchPluginsInCurrentNodeModules(pathToGlobalModules);
        return this;
    }

    _setPrefix(prefix) {
        if (!prefix) {
            throw new Error('Prefix is not an arguments');
        }
        this.prefix = prefix;
    }

    static async _getPathToGlobalModules() {
        const { stdout } = await exec('npm config get prefix');
        return `${(stdout || '').trim()}/lib/node_modules`;
    }

    _lookup(dir) {
        const files = Lookuper._readDir(dir);

        if (files.includes(this.configName)) {
            this._mixConfig(path.join(dir, this.configName));
        }

        if (dir === os.homedir() || dir === '/' || this.shouldExit) {
            return;
        }

        return this._lookup(path.resolve(dir, '../'));
    }

    _searchPluginsInCurrentNodeModules(moduleDirPath) {
        const files = Lookuper._readDir(moduleDirPath);
        files
            .filter(fileName => {
                return fileName.startsWith(this.prefix);
            })
            .filter(fileName => {
                const currentPluginPath = path.resolve(moduleDirPath, `./${fileName}`);
                const pluginFiles = Lookuper._readDir(currentPluginPath);
                return pluginFiles.includes(this.configName);
            })
            .forEach(fileName => {
                this._mixConfig(path.join(moduleDirPath, `./${fileName}/${this.configName}`));
            });
    }

    _searchPlugins(dir) {
        let files = Lookuper._readDir(dir);
        if (files.includes(moduleDir)) {
            let moduleDirPath = path.resolve(dir, `./${moduleDir}`);
            this._searchPluginsInCurrentNodeModules(moduleDirPath);
        }

        if (dir === os.homedir() || dir === '/' || this.shouldExit) {
            return;
        }

        return this._searchPlugins(path.resolve(dir, '../'));
    }

    static _readDir(dir) {
        let files = [];
        try {
            files = fs.readdirSync(dir);
        } catch (e) {
            console.warn(`Error reading directory ${dir}, skipped: `, e.message);
        }
        return files;
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

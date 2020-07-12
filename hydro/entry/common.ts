/* eslint-disable no-await-in-loop */
/* eslint-disable no-eval */
import os from 'os';
import fs from 'fs';
import yaml from 'js-yaml';

export const builtinLib = [
    'jwt', 'download', 'i18n', 'mail', 'markdown',
    'md5', 'misc', 'paginate', 'hash.hydro', 'rank',
    'template', 'validator', 'nav', 'sysinfo', 'testdata.convert.ini',
    'readConfig', 'logger', 'useragent',
];

export const builtinModel = [
    'builtin', 'document', 'domain', 'blacklist', 'opcount',
    'setting', 'token', 'user', 'problem', 'record',
    'contest', 'message', 'solution', 'training', 'file',
    'discussion', 'system',
];

export const builtinHandler = [
    'home', 'problem', 'record', 'judge', 'user',
    'contest', 'training', 'discussion', 'manage', 'import',
    'misc', 'homework', 'domain', 'wiki',
];

export const builtinScript = [
    'install', 'rating', 'recalcRating', 'register', 'problemStat',
    'blacklist', 'setSuperadmin', 'deleteUser',
];

export async function handler(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/handler.js`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                console.log(`Handler init: ${i}`);
                console.time(`Handler init: ${i}`);
                eval('require')(p);
                console.timeEnd(`Handler init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Handler Load Fail: ${i}`);
            }
        }
    }
}

export async function locale(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/locale.json`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                global.Hydro.lib.i18n(eval('require')(p));
                console.log(`Locale init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Locale Load Fail: ${i}`);
            }
        }
    }
}

export async function setting(pending, fail, modelSetting, modelSystem = null) {
    const map = {
        system: modelSetting.SystemSetting,
        account: modelSetting.AccountSetting,
        preference: modelSetting.PreferenceSetting,
    };
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/setting.yaml`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                const cfg: any = yaml.safeLoad(fs.readFileSync(p).toString());
                for (const key in cfg) {
                    if (cfg[key].default && modelSystem) {
                        const current = await modelSystem.get(`${i}.${key}`);
                        if (!current) await modelSystem.set(`${i}.${key}`, cfg[key].default);
                    }
                    map[cfg[key].category || 'system'](
                        modelSetting.Setting(
                            i, `${i}.${key}`, cfg[key].range, cfg[key].default,
                            cfg[key].type || 'text', cfg[key].name || key, cfg[key].desc || '',
                        ),
                    );
                }
            } catch (e) {
                console.error(`Config Load Fail: ${i}`);
            }
        }
    }
}

export async function template(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/template.json`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                Object.assign(global.Hydro.template, eval('require')(p));
                console.log(`Template init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Template Load Fail: ${i}`);
            }
        }
    }
}

export async function model(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/model.js`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                console.log(`Model init: ${i}`);
                console.time(`Model init: ${i}`);
                eval('require')(p);
                console.timeEnd(`Model init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Model Load Fail: ${i}`);
            }
        }
    }
}

export async function lib(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/lib.js`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                console.log(`Lib init: ${i}`);
                console.time(`Lib init: ${i}`);
                eval('require')(p);
                console.timeEnd(`Lib init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Lib Load Fail: ${i}`);
                console.error(e);
            }
        }
    }
}

export async function service(pending, fail) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/service.js`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                console.log(`Service init: ${i}`);
                console.time(`Service init: ${i}`);
                eval('require')(p);
                console.timeEnd(`Service init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Service Load Fail: ${i}`);
                console.error(e);
            }
        }
    }
}

export async function script(pending, fail, active) {
    for (const i of pending) {
        const p = `${os.tmpdir()}/hydro/tmp/${i}/script.js`;
        if (fs.existsSync(p) && !fail.includes(i)) {
            try {
                console.time(`Script init: ${i}`);
                eval('require')(p);
                console.timeEnd(`Script init: ${i}`);
            } catch (e) {
                fail.push(i);
                console.error(`Script Load Fail: ${i}`);
                console.error(e);
            }
        }
        active.push(i);
    }
}
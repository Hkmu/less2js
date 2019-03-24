const fs = require('fs');
const path = require('path');
const stripComments = require('strip-json-comments');
const camelcase = require('camelcase');

const importReg = /[@$].+\s+['"].+['"]/g;
const varReg = /[@$].+:.+/g;

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function parseFile(file) {
  const dir = path.dirname(file);
  return readFile(file).then(data => {
    const pure = stripComments(data);
    const matchedImports = pure.match(importReg);
    const matchedVars = pure.match(varReg);
    const result = {};

    if (matchedVars) {
      matchedVars.forEach(item => {
        let [key, val] = item.split(':');
        key = key.replace(/\s/g, '');
        val = val.replace(/[\s;]/g, '');
        result[key] = val;
      });
    }

    if (matchedImports && matchedImports.length) {
      const parser = matchedImports.map(item => {
        // item is like '@import (keyword) \'./base.less\''
        // http://lesscss.org/features/#import-atrules-feature
        const filePath = item.replace(/(@import\s+|['"\\]+|\s|\(.*\))/ig, '');
        const absPath = path.resolve(dir, filePath);
        return parseFile(absPath);
      });
      return Promise.all(parser).then(res => {
        Object.assign(result, ...res);
        return result;
      });
    }

    return result;
  });
}

/**
 * Parse variable which reference another
 *
 * eg.
 * =============
 *
 * // source
 * @width: 100px;
 * @card-width: @width;
 *
 * // result
 * @width: 100px;
 * @card-width: 100px;
 *
 * @params {Object} obj
 * @params {String} key
 */
function getRealVal(obj, k) {
  const v = obj[k];
  if (/@.+/.test(v)) {
    return getRealVal(obj, v);
  }
  return v;
}

/**
 * Read variables from less file and export them as JavaScript vars.
 * @param {String} file - less file
 * @param {Object} options
 * @param {Bool} options.stripPrefix - Remove the `@` prefix from returned object keys
 * @param {Bool} options.camelCase - Convert dash/dot/underscore/space separated keys to camelCase
 */
module.exports = (file, options = {}) => {
  const { stripPrefix = false, camelCase = false } = options;
  return parseFile(file).then(data => {
    if (!data) {
      return null;
    }

    const keys = Object.keys(data);
    const map = {};
    keys.forEach(k => {
      map[k] = getRealVal(data, k);
    });

    const result = {};
    keys.forEach(k => {
      const v = map[k];
      let key = k;
      if (stripPrefix) key = k.replace(/[@$]/, '');
      if (camelCase) key = camelcase(k);
      result[key] = v;
    });

    return result;
  }).catch(err => {
    if (err) {
      console.error(err.toString());
    }
  });
};

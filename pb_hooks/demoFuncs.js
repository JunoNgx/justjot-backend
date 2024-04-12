/// <reference path="../pb_data/types.d.ts" />

const he = require(`${__hooks}/libs/he.js`);

const types = require(`${__hooks}/types.js`);
const consts = require(`${__hooks}/consts.js`);
const utils = require(`${__hooks}/utils.js`);

const demoFuncs = {
    resetDemoData() {
        console.log("reset demo data");
    },
};

module.exports = demoFuncs;
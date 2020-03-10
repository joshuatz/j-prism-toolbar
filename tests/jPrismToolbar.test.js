// @ts-check
/// <reference types="jest" />
const fs = require('fs');
const testHelpers = require('./helpers/test-helpers');

// @ts-ignore
require('../jPrismToolbar.js');

/**
 * @typedef {object} TestElements
 * @property {HTMLElement} alpha
 * @property {HTMLElement} bravo
 */

describe('Tests jPrismToolbar', () => {
    let testHtml = fs.readFileSync(__dirname + '/fixtures/test-fixture.html').toString();
    const PrismConstructor = window['PrismToolbar'];
    /** @type {TestElements} */
    let testElements = {
        alpha: null,
        bravo: null
    };
    let testInsts = {
        alpha: {},
        bravo: {}
    };

    const grabTestElements = () => {
        testElements = {
            alpha: document.getElementById('alpha'),
            bravo: document.getElementById('bravo')
        };
    };

    const grabTestInstances = initRes => {
        testInsts = {
            alpha: testHelpers.getInstById(initRes.domInstances, 'alpha'),
            bravo: testHelpers.getInstById(initRes.domInstances, 'bravo')
        };
    };

    // Before each test, reset DOM
    beforeEach(() => {
        document.body.innerHTML = testHtml;
        grabTestElements();
    });

    describe('Tests setup and initialization', () => {
        test('Inits specific instances', () => {
            new PrismConstructor({
                selector: '#alpha'
            }).init();
            grabTestElements();
            expect(testHelpers.checkElemInit(testElements.alpha)).toBe(true);
            expect(testHelpers.checkElemInit(testElements.bravo)).toBe(false);
        });

        test('Runs automatic initialization on all elements', () => {
            new PrismConstructor().autoInit();
            grabTestElements();
            const totalInitCount = document.querySelectorAll(testHelpers.toolbarWrapperSelector).length;
            expect(totalInitCount).toEqual(2);
        });

        test('Respects settings through HTML attributes', () => {
            const initRes = new PrismConstructor().autoInit();
            grabTestElements();
            grabTestInstances(initRes);
            // lineWrap is off by default
            expect(initRes.settings.lineWrap).toEqual(false);
            // alpha does not override, bravo does with attrib
            expect(testInsts.alpha.config.lineWrap).toEqual(false);
            expect(testInsts.bravo.config.lineWrap).toEqual(true);
        });
    });

    describe('Tests interactivity', () => {
        let initRes;
        beforeEach(() => {
            initRes = new PrismConstructor().autoInit();
            grabTestElements();
            grabTestInstances(initRes);
        });

        test('Lets users collapse via button', () => {
            expect(testInsts.alpha.collapsed).toEqual(false);
            testInsts.alpha.toolbarElem.querySelector('.prismTbTgCollap').click();
            expect(testInsts.alpha.collapsed).toEqual(true);
        });

        test('Lets users maximize code viewer', () => {
            console.log(testInsts);
            expect(testInsts.alpha.isMaximized).toEqual(false);
            testInsts.alpha.toolbarElem.querySelector('.jMaximizeButton').click();
            expect(testInsts.alpha.isMaximized).toEqual(true);
        });
    });
});

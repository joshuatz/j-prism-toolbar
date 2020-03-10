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
            expect(testInsts.alpha.isMaximized).toEqual(false);
            testInsts.alpha.toolbarElem.querySelector('.jMaximizeButton').click();
            expect(testInsts.alpha.isMaximized).toEqual(true);
        });

        // SKIP: Can't use getSelection() in JSDOM
        test.skip('Preps text for copying to clipboard', () => {
            expect(window.getSelection().toString()).toEqual('');
            testInsts.alpha.toolbarElem.querySelector('.jCopyButton').click();
            const selectedText = window
                .getSelection()
                .toString()
                .trim();
            expect(selectedText).toEqual(`console.log('Test');`);
        });
    });

    describe('Tests API', () => {
        let initRes;
        beforeEach(() => {
            initRes = new PrismConstructor().autoInit();
            grabTestElements();
            grabTestInstances(initRes);
        });

        test('Is able to receive info on instantiation', () => {
            expect(typeof initRes === 'object').toBe(true);
            expect(initRes.targetElementsArr.length).toEqual(2);
        });

        test('Can set content via method', () => {
            expect(testInsts.alpha.codeElem.textContent.trim()).toEqual(`console.log('Test');`);
            const dummyCodeText = 'abc123';
            initRes.setInnerContent(testInsts.alpha, dummyCodeText);
            expect(testInsts.alpha.codeElem.textContent.trim()).toEqual(dummyCodeText);
        });

        // @TODO - this works, but really should be either mocked or replayed
        test('Can load remote content', () => {
            expect.assertions(1);
            const loaderPromise = new Promise(resolve => {
                initRes.loadRemoteCode(
                    testInsts.alpha,
                    'https://raw.githubusercontent.com/joshuatz/j-prism-toolbar/master/LICENSE',
                    loadResult => {
                        resolve(loadResult);
                    }
                );
            });
            return loaderPromise.then(loadResult => {
                expect(loadResult.request.status).toEqual(200);
            });
        });
    });
});

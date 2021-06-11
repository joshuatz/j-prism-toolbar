// @ts-check
/// <reference types="jest" />
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as testHelpers from './helpers';

import '../src/jPrismToolbar.web';

// Shim prism
window['Prism'] = {
    highlightElement: () => {},
};

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {object} TestElements
 * @property {HTMLElement} alpha
 * @property {HTMLElement} bravo
 * @property {HTMLElement} charlie
 * @property {HTMLElement} delta
 * @property {HTMLElement} echo
 */

describe('Tests jPrismToolbar', () => {
    let testHtml = fs.readFileSync(__dirname + '/fixtures/test-fixture.html').toString();
    const PrismConstructor = window['PrismToolbar'];
    /** @type {TestElements} */
    let testElements = {
        alpha: null,
        bravo: null,
        charlie: null,
        delta: null,
        echo: null,
    };
    let testInsts = {
        alpha: {},
        bravo: {},
        charlie: {},
        delta: {},
        echo: {},
    };

    const grabTestElements = () => {
        testElements = {
            alpha: document.getElementById('alpha'),
            bravo: document.getElementById('bravo'),
            charlie: document.getElementById('charlie'),
            delta: document.getElementById('delta'),
            echo: document.getElementById('echo'),
        };
    };

    const grabTestInstances = (initRes) => {
        testInsts = {
            alpha: testHelpers.getInstById(initRes.domInstances, 'alpha'),
            bravo: testHelpers.getInstById(initRes.domInstances, 'bravo'),
            charlie: testHelpers.getInstById(initRes.domInstances, 'charlie'),
            delta: testHelpers.getInstById(initRes.domInstances, 'delta'),
            echo: testHelpers.getInstById(initRes.domInstances, 'echo'),
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
                selector: '#alpha',
            }).init();
            grabTestElements();
            expect(testHelpers.checkElemInit(testElements.alpha)).toBe(true);
            expect(testHelpers.checkElemInit(testElements.bravo)).toBe(false);
        });

        test('Inits via selector passed as only arg', () => {
            new PrismConstructor('#alpha').init();
            grabTestElements();
            expect(testHelpers.checkElemInit(testElements.alpha)).toBe(true);
            expect(testHelpers.checkElemInit(testElements.bravo)).toBe(false);
        });

        test('Runs automatic initialization on all (suitable) elements', () => {
            // Remember: autoInit() targets certain selector
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

        test('It auto-fixes bad setups', () => {
            const initRes = new PrismConstructor({
                autoFix: true,
            }).autoInitAll();
            grabTestElements();
            grabTestInstances(initRes);
            // Check that auto-fix applied
            expect(testElements.echo.querySelector('code').classList.contains('language-js')).toEqual(true);
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
            return new Promise((resolver) => {
                expect(testInsts.alpha.collapsed).toEqual(false);
                testInsts.alpha.toolbarElem.querySelector('.prismTbTgCollap').click();
                expect(testInsts.alpha.collapsed).toEqual(true);
                setTimeout(resolver, 200);
            }).then(() => {
                expect(testInsts.alpha.collapsed).toEqual(true);
                testInsts.alpha.toolbarElem.querySelector('.prismTbTgCollap').click();
                expect(testInsts.alpha.collapsed).toEqual(false);
            });
        });

        test('Lets users maximize code viewer', () => {
            expect(testInsts.alpha.isMaximized).toEqual(false);
            testInsts.alpha.toolbarElem.querySelector('.jMaximizeButton').click();
            expect(testInsts.alpha.isMaximized).toEqual(true);
            // Make sure clicking outside maximize area closes
            const backdrops = document.querySelectorAll('.jCodeWrapper');
            // @ts-ignore
            backdrops[backdrops.length - 1].click();
            expect(testInsts.alpha.isMaximized).toEqual(false);
        });

        // SKIP: Can't use getSelection() in JSDOM
        test.skip('Preps text for copying to clipboard', () => {
            expect(window.getSelection().toString()).toEqual('');
            testInsts.alpha.toolbarElem.querySelector('.jCopyButton').click();
            const selectedText = window.getSelection().toString().trim();
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

        test('Can show message via method', () => {
            /** @type {HTMLElement} */
            const messageElem = testInsts.bravo.toolbarElem.querySelector('.jMessage');
            return new Promise((resolver) => {
                expect(messageElem.classList.contains('jHidden')).toEqual(true);
                initRes.showMessage(testInsts.bravo, 'test', 10);
                expect(messageElem.classList.contains('jHidden')).toEqual(false);
                setTimeout(resolver, 20);
            }).then(() => {
                expect(messageElem.classList.contains('jHidden')).toEqual(true);
            });
        });

        // @TODO - this works, but really should be either mocked or replayed
        test('Can load remote content', () => {
            expect.assertions(1);
            const loaderPromise = new Promise((resolve) => {
                initRes.loadRemoteCode(
                    testInsts.alpha,
                    'https://raw.githubusercontent.com/joshuatz/j-prism-toolbar/main/LICENSE',
                    (loadResult) => {
                        resolve(loadResult);
                    }
                );
            });
            return loaderPromise.then((loadResult) => {
                expect(loadResult.request.status).toEqual(200);
            });
        });
    });
});

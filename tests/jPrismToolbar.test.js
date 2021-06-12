// @ts-check
/// <reference types="jest" />
/// <reference path="test-globals.d.ts" />
import fse from 'fs-extra';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as testHelpers from './helpers';
import fetchMock from 'jest-fetch-mock';

import '../src/jPrismToolbar.web';

/**
 * @typedef {import('../src').PrismToolbar} PrismToolbar
 * @typedef {import('../src').ToolbarInstance} Instance
 */

// Shim prism
window['Prism'] = {
    highlightElement: () => {},
};

// Mock fetch
fetchMock.enableMocks();

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

/**
 * @typedef {object} TestInsts
 * @property {Instance} alpha
 * @property {Instance} bravo
 * @property {Instance} charlie
 * @property {Instance} delta
 * @property {Instance} echo
 */

describe('Tests jPrismToolbar', () => {
    let testHtml = fse.readFileSync(__dirname + '/fixtures/test-fixture.html').toString();
    const PrismConstructor = window['PrismToolbar'];
    /** @type {TestElements} */
    let testElements = {
        alpha: null,
        bravo: null,
        charlie: null,
        delta: null,
        echo: null,
    };
    /** @type {TestInsts} */
    let testInsts;

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

        test('Respects settings through HTML attributes', async () => {
            const initRes = await new PrismConstructor().autoInit();
            grabTestElements();
            grabTestInstances(initRes);
            // lineWrap is off by default
            expect(initRes.settings.lineWrap).toEqual(false);
            // alpha does not override, bravo does with attrib
            expect(testInsts.alpha.config.lineWrap).toEqual(false);
            expect(testInsts.bravo.config.lineWrap).toEqual(true);
        });

        test('It auto-fixes bad setups', async () => {
            const initRes = await new PrismConstructor({
                autoFix: true,
            }).autoInitAll();
            grabTestElements();
            grabTestInstances(initRes);
            // Check that auto-fix applied
            expect(testElements.echo.querySelector('code').classList.contains('language-js')).toEqual(true);
        });
    });

    describe('Tests interactivity', () => {
        /** @type {PrismToolbar} */
        let initRes;
        beforeEach(async () => {
            initRes = await new PrismConstructor().autoInit();
            grabTestElements();
            grabTestInstances(initRes);
        });

        test('Lets users collapse via button', () => {
            return new Promise((resolver) => {
                expect(testInsts.alpha.collapsed).toEqual(false);
                // @ts-ignore
                testInsts.alpha.toolbarElem.querySelector('.prismTbTgCollap').click();
                expect(testInsts.alpha.collapsed).toEqual(true);
                setTimeout(resolver, 200);
            }).then(() => {
                expect(testInsts.alpha.collapsed).toEqual(true);
                // @ts-ignore
                testInsts.alpha.toolbarElem.querySelector('.prismTbTgCollap').click();
                expect(testInsts.alpha.collapsed).toEqual(false);
            });
        });

        test('Lets users maximize code viewer', () => {
            expect(testInsts.alpha.isMaximized).toEqual(false);
            // @ts-ignore
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
            // @ts-ignore
            testInsts.alpha.toolbarElem.querySelector('.jCopyButton').click();
            const selectedText = window.getSelection().toString().trim();
            expect(selectedText).toEqual(`console.log('Test');`);
        });
    });

    describe('Tests API', () => {
        /** @type {PrismToolbar} */
        let initRes;
        beforeEach(async () => {
            initRes = await new PrismConstructor().autoInit();
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

        test('Can load remote content - raw code', async () => {
            const remoteSrc = 'https://raw.githubusercontent.com/joshuatz/j-prism-toolbar/main/LICENSE';
            const remoteStr = 'Permission is hereby';
            expect.assertions(1);

            // Mocked payload
            fetchMock.mockResponseOnce(
                `MIT License\n\nCopyright (c) 2021 Joshua Tzucker\n\nPermission is hereby granted, `
            );

            await initRes.loadRemoteCode(testInsts.alpha, remoteSrc);
            // Check actual loaded content
            expect(testInsts.alpha.codeElem.textContent.includes(remoteStr)).toBe(true);
        });

        test('Can load remote content - Github Gist', async () => {
            const gistLink = 'https://gist.github.com/joshuatz/9e951b0e2856273c7a912bb21a21d70a';
            expect.assertions(3);

            // Mocked payload
            const gistMockPayload = (await fse.readFile(__dirname + '/fixtures/gist-response.json')).toString();
            const gistMockObj = JSON.parse(gistMockPayload);
            fetchMock.mockResponseOnce(gistMockPayload);
            /** @type {import('../src/types').GhGistFile[]} */
            const files = Object.values(gistMockObj.files);

            // Create a test container
            const testBed = document.createElement('div');
            testBed.insertAdjacentHTML('afterbegin', `<pre><code data-jptremote="${gistLink}"></code></pre>`);
            document.body.appendChild(testBed);

            // Init injected test bed
            const isolatedController = new window.PrismToolbar({
                targetElements: testBed.querySelector('pre'),
            });
            await isolatedController.init();
            expect(isolatedController.domInstances.length).toBe(2);
            expect(isolatedController.domInstances[0].codeElem.textContent.trim()).toBe(files[0].content.trim());
            expect(isolatedController.domInstances[1].codeElem.textContent.trim()).toBe(files[1].content.trim());
        });
    });
});

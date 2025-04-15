import React, { FC, useContext } from "react"
import { render } from "@testing-library/react"
import MathJaxContext, { MathJaxBaseContext } from "./MathJaxContext"
jest.mock("react", () => jest.requireActual("react"));

const math = "\\frac{10}{5}"
let originalConsoleError: (data: any[]) => void

const Wrapped: FC<{ version: 2 | 3 }> = ({ version }) => {
    const mjPromise = useContext(MathJaxBaseContext)
    if(mjPromise && mjPromise.version !== version) throw Error("Wrong version")
    return <></>
}

beforeEach(() => {
    originalConsoleError = console.error
    console.error = jest.fn()
})

afterEach(() => {
    console.error = originalConsoleError
})

/**
 * These tests are very verbose and contains a lot of extra code just so that we may use isolatedModules
 * which resets all imports that are done inside the callback to particular instances so that the state that
 * is persisted in MathJaxContext is reset. This causes problems with React which cannot be imported multiple
 * times in the same file. All in all:
 *     * Need to use isolateModules to reset state in MathJaxContext
 *     * require() needs to be used instead of dynamic import() for isolateModules to work as intended
 *     * Since React is also imported in these files, we need to make sure that even though the modules are
 *       different in every test, they use the same React, e.g. the jest.mock at the top is needed
 *     * Because the callback to isolateModules is run asynchronously, we need to wrap it in a Promise, otherwise
 *       the tests might complain about not handling errors in the callback to isolateModules
 *     * When in a Promise, expect() works a bit differently and in some cases, work-arounds have been
 *       done to avoid bizarre errors where the test just hangs due to using expect()
 *     * Luckily, we may still ALSO import MathJaxContext and MathJax at the top so that tests that DON'T need
 *       to reset the state in MathJaxContext can be made simpler. This was earlier a limitation but possible
 *       from jest 27 apparently.
 *     * Might also look in to jest.resetModules() for this use case (even though I couldn't get it to work).
 *
 */
it("only fetches MathJax once despite nested contexts", () => {
    new Promise<void>((res, rej) => {
        jest.isolateModules(async () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJaxContext } = require("./MathJaxContext")
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJax } = require("../MathJax")
            const addFn = jest.fn()
            const originalGetElementsByTagName = document.getElementsByTagName
            document.getElementsByTagName = (_tagName: string) => [{ appendChild: addFn }] as any
            render(
                <MathJaxContext version={3}>
                    <MathJaxContext version={3}>
                        <MathJaxContext version={3}>
                            <MathJax>{`\\$${math}$`}</MathJax>
                        </MathJaxContext>
                    </MathJaxContext>
                </MathJaxContext>
            )
            try {
                expect(addFn).toHaveBeenCalledTimes(1)
                res()
            }
            catch(e) {
                rej(e)
            }
            finally {
                document.getElementsByTagName = originalGetElementsByTagName
            }
        })
    })
}, 15000)

it("only fetches MathJax once despite mounting and unmounting several times", () => {
    return new Promise<void>((res, rej) => {
        jest.isolateModules(async () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJaxContext } = require("./MathJaxContext")
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJax } = require("../MathJax")
            const addFn = jest.fn()
            const originalGetElementsByTagName = document.getElementsByTagName
            document.getElementsByTagName = (_tagName: string) => [{ appendChild: addFn }] as any
            const renderedFirst = render(
                <MathJaxContext version={3}>
                    <MathJax>{`\\$${math}$`}</MathJax>
                </MathJaxContext>
            )
            renderedFirst.unmount()
            render(
                <MathJaxContext version={3}>
                    <MathJax>{`\\$${math}$`}</MathJax>
                </MathJaxContext>
            )
            try {
                expect(addFn).toHaveBeenCalledTimes(1)
                res()
            }
            catch(e) {
                rej(e)
            }
            finally {
                document.getElementsByTagName = originalGetElementsByTagName
            }
        })
    })
}, 15000)

it("mounting with one version, unmounting and then mounting with a different version throws", () => {
    return new Promise<void>((res, rej) => {
        jest.isolateModules(async () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJaxContext } = require("./MathJaxContext")
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: MathJax } = require("../MathJax")
            const addFn = jest.fn()
            const originalGetElementsByTagName = document.getElementsByTagName
            document.getElementsByTagName = (_tagName: string) => [{ appendChild: addFn }] as any
            const renderedFirst = render(
                <MathJaxContext version={3}>
                    <MathJax>{`\\$${math}$`}</MathJax>
                </MathJaxContext>
            )
            renderedFirst.unmount()
            try {
                render(
                    <MathJaxContext version={2}>
                        <MathJax>{`\\$${math}$`}</MathJax>
                    </MathJaxContext>
                )
                rej("Expected Error but test passed")
            }
            catch(e: any) {
                if(e?.toString().includes("Cannot use MathJax versions 2 and 3 simultaneously"))
                    res()
                else
                    rej(e)
            }
            finally {
                document.getElementsByTagName = originalGetElementsByTagName
            }
        })
    })
}, 15000)

it("first context determines version if contexts are nested", async () => {
    const rendered = () =>
        render(
            <MathJaxContext version={3}>
                <MathJaxContext version={2}>
                    <MathJaxContext version={2} />
                </MathJaxContext>
            </MathJaxContext>
        )
    expect(rendered).toThrow(/^Cannot nest MathJaxContexts with different versions/)
}, 15000)

it("contexts with different versions are not allowed", async () => {
    const rendered = () =>
        render(
            <>
                <MathJaxContext version={2}>
                    <Wrapped version={2} />
                </MathJaxContext>
                <MathJaxContext version={3}>
                    <Wrapped version={3} />
                </MathJaxContext>
            </>
        )
    expect(rendered).toThrow(/^Cannot use MathJax versions 2 and 3 simultaneously/)
}, 15000)

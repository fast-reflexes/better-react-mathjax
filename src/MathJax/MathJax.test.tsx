import React, { ReactElement } from "react"
import { render } from "@testing-library/react"
import { MathJaxBaseContext } from "../MathJaxContext"
import MathJax from "./MathJax"
import { OptionList } from "mathjax-full/js/util/Options"

let originalConsoleError: (data: any[]) => void
const math = "\\frac{10}{5}"

beforeEach(() => {
    originalConsoleError = console.error
    console.error = jest.fn()
})

afterEach(() => {
    console.error = originalConsoleError
})

const getComponent = (
    version: 2 | 3 | 4,
    renderMode?: "pre" | "post",
    text?: string,
    typeSettingOptions?: { fn: "tex2chtml"; options?: OptionList },
    content?: ReactElement
) => (
    <MathJaxBaseContext.Provider
        value={
            version === 2
                ? { version: 2, promise: Promise.resolve({ Hub: { Queue: jest.fn() } } as any) }
                : version === 3
                ? { version: 3, promise: Promise.resolve({ startup: { promise: Promise.resolve() } } as any) }
                : { version: 4, promise: Promise.resolve({ startup: { promise: Promise.resolve() } } as any) }
        }
    >
        <MathJax renderMode={renderMode} text={text} typesettingOptions={typeSettingOptions}>
            {content}
        </MathJax>
    </MathJaxBaseContext.Provider>
)

it("throws when renderMode = pre set with version 2", async () => {
    const componentGetter = () => render(getComponent(2, "pre", math, { fn: "tex2chtml" }))
    expect(componentGetter).toThrow("version 2")
}, 15000)

it("throws when renderMode = pre set with no text prop (version 3)", async () => {
    const componentGetter = () => render(getComponent(3, "pre", undefined, { fn: "tex2chtml" }))
    expect(componentGetter).toThrow("text")
}, 15000)

it("throws when renderMode = pre set with no text prop (version 4)", async () => {
    const componentGetter = () => render(getComponent(4, "pre", undefined, { fn: "tex2chtml" }))
    expect(componentGetter).toThrow("text")
}, 15000)

it("throws when renderMode = pre set with no typesettingOptions prop (version 3)", async () => {
    const componentGetter = () => render(getComponent(3, "pre", math))
    expect(componentGetter).toThrow("typesettingOptions")
}, 15000)

it("throws when renderMode = pre set with no typesettingOptions prop (version 4)", async () => {
    const componentGetter = () => render(getComponent(4, "pre", math))
    expect(componentGetter).toThrow("typesettingOptions")
}, 15000)

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

it.each([3, 4] as const)(
    "does not typeset when unmounted before MathJax has loaded (version %i, renderMode = post)",
    async (version) => {
        let resolveMathJax: (mathJax: any) => void = () => undefined
        const typesetClear = jest.fn()
        const typesetPromise = jest.fn(() => Promise.resolve())
        const { unmount } = render(
            <MathJaxBaseContext.Provider
                value={{ version, promise: new Promise((resolve) => (resolveMathJax = resolve)) } as any}
            >
                <MathJax>{math}</MathJax>
            </MathJaxBaseContext.Provider>
        )
        unmount()
        resolveMathJax({ startup: { promise: Promise.resolve() }, typesetClear, typesetPromise } as any)
        await flushPromises()
        expect(typesetClear).not.toHaveBeenCalled()
        expect(typesetPromise).not.toHaveBeenCalled()
    },
    15000
)

it("does not typeset when unmounted before MathJax has loaded (version 2)", async () => {
    let resolveMathJax: (mathJax: any) => void = () => undefined
    const queue = jest.fn()
    const { unmount } = render(
        <MathJaxBaseContext.Provider
            value={{ version: 2, promise: new Promise((resolve) => (resolveMathJax = resolve)) }}
        >
            <MathJax>{math}</MathJax>
        </MathJaxBaseContext.Provider>
    )
    unmount()
    resolveMathJax({ Hub: { Queue: queue } } as any)
    await flushPromises()
    expect(queue).not.toHaveBeenCalled()
}, 15000)

it("typesets normally when still mounted when MathJax has loaded (version 3, renderMode = post)", async () => {
    const typesetClear = jest.fn()
    const typesetPromise = jest.fn(() => Promise.resolve())
    render(
        <MathJaxBaseContext.Provider
            value={{
                version: 3,
                promise: Promise.resolve({
                    startup: { promise: Promise.resolve() },
                    typesetClear,
                    typesetPromise
                } as any)
            }}
        >
            <MathJax>{math}</MathJax>
        </MathJaxBaseContext.Provider>
    )
    await flushPromises()
    expect(typesetClear).toHaveBeenCalledTimes(1)
    expect(typesetPromise).toHaveBeenCalledTimes(1)
}, 15000)

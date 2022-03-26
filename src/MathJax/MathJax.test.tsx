// @ts-ignore
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
    version: 2 | 3,
    renderMode?: "pre" | "post",
    text?: string,
    typeSettingOptions?: { fn: "tex2chtml"; options?: OptionList },
    content?: ReactElement
) => (
    <MathJaxBaseContext.Provider
        value={
            version === 2
                ? { version: 2, promise: Promise.resolve({ Hub: { Queue: jest.fn() } } as any) }
                : { version: 3, promise: Promise.resolve({ startup: { promise: Promise.resolve() } } as any) }
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

it("throws when renderMode = pre set with no text prop", async () => {
    const componentGetter = () => render(getComponent(3, "pre", undefined, { fn: "tex2chtml" }))
    expect(componentGetter).toThrow("text")
}, 15000)

it("throws when renderMode = pre set with no typesettingOptions prop", async () => {
    const componentGetter = () => render(getComponent(3, "pre", math))
    expect(componentGetter).toThrow("typesettingOptions")
}, 15000)

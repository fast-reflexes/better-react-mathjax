"use client";

import React, { createContext, FC, ReactNode, useContext, useRef } from "react"
import type { MathJax2Config, MathJax2Object } from "../MathJax2"
import type { MathJax3Config, MathJax3Object, OptionList as MathJax3OptionList } from "../MathJax3"
import type { MathJax4Config, MathJax4Object, OptionList as MathJax4OptionList } from "../MathJax4"

export type TypesettingFunction = "tex2chtml"
    | "tex2chtmlPromise"
    | "tex2svg"
    | "tex2svgPromise"
    | "tex2mml"
    | "tex2mmlPromise"
    | "mathml2chtml"
    | "mathml2chtmlPromise"
    | "mathml2svg"
    | "mathml2svgPromise"
    | "mathml2mml"
    | "mathml2mmlPromise"
    | "asciimath2chtml"
    | "asciimath2chtmlPromise"
    | "asciimath2svg"
    | "asciimath2svgPromise"
    | "asciimath2mml"
    | "asciimath2mmlPromise"

export interface MathJaxOverrideableProps {
    hideUntilTypeset?: "first" | "every"
    typesettingOptions?: {
        fn: TypesettingFunction
        options?: Omit<MathJax3OptionList | MathJax4OptionList, "display">
    }
    renderMode?: "pre" | "post"
}

export type MathJaxSubscriberProps = ({
    version: 2; promise: Promise<MathJax2Object>
} | {
    version: 3; promise: Promise<MathJax3Object>
} | {
    version: 4; promise: Promise<MathJax4Object>
}) & MathJaxOverrideableProps

export const MathJaxBaseContext = createContext<MathJaxSubscriberProps | undefined>(undefined)

interface MathJaxContextStaticProps extends MathJaxOverrideableProps {
    src?: string
    asyncLoad?: boolean
    onLoad?: () => void
    onError?: (error: any) => void
    children?: ReactNode
}

export type MathJaxContextProps = ({
    config?: MathJax2Config
    version: 2
    onStartup?: (mathJax: MathJax2Object) => void
} | {
    config?: MathJax3Config
    version?: 3
    onStartup?: (mathJax: MathJax3Object) => void
} | {
    config?: MathJax4Config
    version?: 4
    onStartup?: (mathJax: MathJax4Object) => void
}) & MathJaxContextStaticProps

/* below is not the same URL as presented on https://www.mathjax.org/#gettingstarted because that config is not
even listed in the docs. The below config is the same config as the default CDN sends for the non-existing TeX-AMS-MML_CHTML
parameter */
const DEFAULT_V2_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
const DEFAULT_V3_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js"
const DEFAULT_V4_SRC = "https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js"
let v2Promise: Promise<MathJax2Object>
let v3Promise: Promise<MathJax3Object>
let v4Promise: Promise<MathJax4Object>

const MathJaxContext: FC<MathJaxContextProps> = ({
    config,
    version = 4,
    src = version === 2 ? DEFAULT_V2_SRC : (version === 3 ? DEFAULT_V3_SRC : DEFAULT_V4_SRC),
    onStartup,
    onLoad,
    asyncLoad = false,
    onError,
    typesettingOptions,
    renderMode = "post",
    hideUntilTypeset,
    children
}) => {
    const previousContext = useContext(MathJaxBaseContext)
    if(typeof previousContext?.version !== "undefined" && previousContext?.version !== version)
        throw Error(
            "Cannot nest MathJaxContexts with different versions. MathJaxContexts should not be nested at all but if " +
            "they are, they cannot have different versions. Stick with one version of MathJax in your app and avoid " +
            "using more than one MathJaxContext."
        )
    if(
        (version === 2 && (typeof v3Promise !== "undefined" || typeof v4Promise !== "undefined"))
        || (version === 3 && (typeof v2Promise !== "undefined" || typeof v4Promise !== "undefined"))
        || (version === 4 && (typeof v2Promise !== "undefined" || typeof v3Promise !== "undefined"))
    )
        throw Error(
            "Cannot use two MathJax versions simultaneously in the same app due to how MathJax is set up in the " +
            "browser; either you have multiple MathJaxContexts with different versions or you have mounted and " +
            "unmounted MathJaxContexts with different versions. Please stick with one version of MathJax in your app. " +
            "File an issue in the project Github page if you need this feature."
        )
    const mjContext = useRef(previousContext)
    const initVersion = useRef<2 | 3 | 4 | null>(previousContext?.version || null)
    if(initVersion.current === null) initVersion.current = version
    else if(initVersion.current !== version)
        throw Error(
            "Cannot change version of MathJax in a MathJaxContext after it has mounted. Reload the page with a " +
            "new version when this must happen."
        )

    const usedSrc = src || (version === 2 ? DEFAULT_V2_SRC : (version === 3 ? DEFAULT_V3_SRC : DEFAULT_V4_SRC))

    function scriptInjector<T>(res: (mathJax: T) => void, rej: (error: any) => void) {
        if(config) (window as any).MathJax = config
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = usedSrc
        script.async = asyncLoad

        script.addEventListener("load", () => {
            const mathJax = (window as any).MathJax
            if(onStartup) onStartup(mathJax)
            res(mathJax)
            if(onLoad) onLoad()
        })
        script.addEventListener("error", (e) => rej(e))

        document.getElementsByTagName("head")[0].appendChild(script)
    }

    if(typeof mjContext.current === "undefined") {
        const baseContext = {
            typesettingOptions,
            renderMode,
            hideUntilTypeset
        }
        if(version === 2) {
            if(typeof v2Promise === "undefined") {
                if(typeof window !== "undefined") {
                    v2Promise = new Promise<MathJax2Object>(scriptInjector)
                    v2Promise.catch((e) => {
                        if(onError) onError(e)
                        else throw Error(`Failed to download MathJax version 2 from '${usedSrc}' due to: ${JSON.stringify(e)}`)
                    })
                } else {
                    // for server side rendering
                    v2Promise = Promise.reject()
                    v2Promise.catch((_) => undefined)
                }
            }
        } else if(version === 3) {
            if(typeof v3Promise === "undefined") {
                if(typeof window !== "undefined") {
                    v3Promise = new Promise<MathJax3Object>(scriptInjector)
                    v3Promise.catch((e) => {
                        if(onError) onError(e)
                        else throw Error(`Failed to download MathJax version 3 from '${usedSrc}' due to: ${e}`)
                    })
                } else {
                    // for server side rendering
                    v3Promise = Promise.reject()
                    v3Promise.catch((_) => undefined)
                }
            }
        } else {
            if(typeof v4Promise === "undefined") {
                if(typeof window !== "undefined") {
                    v4Promise = new Promise<MathJax4Object>(scriptInjector)
                    v4Promise.catch((e) => {
                        if(onError) onError(e)
                        else throw Error(`Failed to download MathJax version 4 from '${usedSrc}' due to: ${e}`)
                    })
                } else {
                    // for server side rendering
                    v4Promise = Promise.reject()
                    v4Promise.catch((_) => undefined)
                }
            }
        }
        mjContext.current = {
            ...baseContext,
            ...(version === 2
                ? { version: 2, promise: v2Promise }
                : (version === 3 ? { version: 3, promise: v3Promise } : { version: 4, promise: v4Promise })
            )
        }
    }

    return <MathJaxBaseContext.Provider value={mjContext.current}>{children}</MathJaxBaseContext.Provider>
}

export default MathJaxContext

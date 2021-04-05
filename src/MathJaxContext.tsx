import React, { createContext, FC, useContext, useRef } from "react"

export type TypesettingFunction =
    | "tex2chtml"
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
        options?: object // TODO add proper type
    }
    renderMode?: "pre" | "post"
}

export type MathJaxSubscriberProps = (
    | { version: 2; promise: Promise<any> } // TODO add proper type
    | { version: 3; promise: Promise<any> } // TODO add proper type
) &
    MathJaxOverrideableProps

export const MathJaxBaseContext = createContext<MathJaxSubscriberProps | undefined>(undefined)

interface MathJaxContextStaticProps extends MathJaxOverrideableProps {
    src?: string
    onLoad?: () => void
    onError?: (error: any) => void
}

export type MathJaxContextProps = (
    | {
          config?: object // TODO add proper type
          version: 2
          onStartup?: (mathJax: any) => void // TODO add proper type
      }
    | {
          config?: object // TODO add proper type
          version?: 3
          onStartup?: (mathJax: any) => void // TODO add proper type
      }
) &
    MathJaxContextStaticProps

const DEFAULT_V2_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
const DEFAULT_V3_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/tex-mml-chtml.min.js"
let v2Promise: Promise<any> // TODO add proper type
let v3Promise: Promise<any> // TODO add proper type

const MathJaxContext: FC<MathJaxContextProps> = ({
    config,
    version = 3,
    src = version === 2 ? DEFAULT_V2_SRC : DEFAULT_V3_SRC,
    onStartup,
    onLoad,
    onError,
    typesettingOptions,
    renderMode = "post",
    hideUntilTypeset,
    children
}) => {
    const previousContext = useContext(MathJaxBaseContext)
    if (previousContext?.version !== undefined && previousContext?.version !== version)
        throw Error(
            "Cannot nest MathJaxContexts with different versions. MathJaxContexts should not be nested at all but if they are, they inherit several properties. If you need different versions, then use multiple, non-nested, MathJaxContexts in your app."
        )
    const mjContext = useRef(previousContext)
    const initVersion = useRef<2 | 3 | null>(previousContext?.version || null)
    if (initVersion.current === null) initVersion.current = version
    else if (initVersion.current !== version)
        throw Error(
            "Cannot change version of MathJax in a MathJaxContext after component has mounted. Either reload the page with a new setting when this should happen or use multiple, non-nested, MathJaxContexts in your app."
        )

    const usedSrc = src || (version === 2 ? DEFAULT_V2_SRC : DEFAULT_V3_SRC)

    function scriptInjector<T>(res: (mathJax: T) => void, rej: (error: any) => void) {
        if (config) (window as any).MathJax = config
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = src || (version === 2 ? DEFAULT_V2_SRC : DEFAULT_V3_SRC)
        script.async = false

        script.addEventListener("load", () => {
            const mathJax = (window as any).MathJax
            if (onStartup) onStartup(mathJax)
            res(mathJax)
            if (onLoad) onLoad()
        })
        script.addEventListener("error", (e) => rej(e))

        document.getElementsByTagName("head")[0].appendChild(script)
    }

    if (mjContext.current === undefined) {
        const baseContext = {
            typesettingOptions,
            renderMode,
            hideUntilTypeset
        }
        if (version === 2) {
            if (v2Promise === undefined) {
                if (typeof window !== "undefined") {
                    v2Promise = new Promise<any>(scriptInjector) // TODO add proper type
                    v2Promise.catch((e) => {
                        if (onError) onError(e)
                        else throw Error(`Failed to download MathJax version 2 from '${usedSrc}' due to: ${e}`)
                    })
                } else {
                    // for server side rendering
                    v2Promise = Promise.reject()
                    v2Promise.catch((_) => undefined)
                }
            }
        } else {
            if (v3Promise === undefined) {
                if (typeof window !== "undefined") {
                    v3Promise = new Promise<any>(scriptInjector) // TODO add proper type
                    v3Promise.catch((e) => {
                        if (onError) onError(e)
                        else throw Error(`Failed to download MathJax version 3 from '${usedSrc}' due to: ${e}`)
                    })
                } else {
                    // for server side rendering
                    v3Promise = Promise.reject()
                    v3Promise.catch((_) => undefined)
                }
            }
        }
        mjContext.current = {
            ...baseContext,
            ...(version === 2 ? { version: 2, promise: v2Promise } : { version: 3, promise: v3Promise })
        }
    }

    return <MathJaxBaseContext.Provider value={mjContext.current}>{children}</MathJaxBaseContext.Provider>
}

export default MathJaxContext

import React, { createContext, FC, useContext, useRef } from "react"

export interface MathJaxOverrideableProps {
    hideUntilTypeset?: "first" | "every" | null
    typesettingOptions?: {
        fn:
            | "tex2chtml"
            | "tex2chtmlPromise"
            | "tex2svg"
            | "tex2svgPromise"
            | "tex2mml"
            | "tex2mmlPromise"
            | "mml2chtml"
            | "mml2chtmlPromise"
            | "mml2svg"
            | "mml2svgPromise"
            | "mml2mml"
            | "mml2mmlPromise"
            | "ascii2chtml"
            | "ascii2chtmlPromise"
            | "ascii2svg"
            | "ascii2svgPromise"
            | "ascii2mml"
            | "ascii2mmlPromise"
        options?: object
    }
    renderMode?: "pre" | "post"
}

interface MathJaxSubscriberProps extends MathJaxOverrideableProps {
    version: 2 | 3
    promise: Promise<any>
}

export const MathJaxBaseContext = createContext<MathJaxSubscriberProps | undefined>(undefined)

interface MathJaxContextProps extends MathJaxOverrideableProps {
    config?: any
    version?: 2 | 3
    src?: string
    onStartup?: (mathJax: any) => void
    onLoad?: () => void
    onError?: (error: any) => void
}

const DEFAULT_V2_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
const DEFAULT_V3_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/tex-mml-chtml.min.js"

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
    const ctxPromise = useContext(MathJaxBaseContext)
    const mjPromise = useRef(ctxPromise)

    if (mjPromise.current === undefined) {
        mjPromise.current = {
            version,
            typesettingOptions: typesettingOptions,
            renderMode,
            hideUntilTypeset,
            promise:
                typeof window !== "undefined"
                    ? new Promise<Promise<any>>((res, rej) => {
                          if (config) (window as any).MathJax = config
                          const script = document.createElement("script")
                          script.type = "text/javascript"
                          script.src = src || (version === 2 ? DEFAULT_V2_SRC : DEFAULT_V3_SRC)
                          script.async = false

                          // if ((window as any).opera)
                          //    script.innerHTML = config
                          // else
                          //    script.text = config

                          script.addEventListener("load", () => {
                              const mathJax = (window as any).MathJax
                              if (onStartup) onStartup(mathJax)
                              res(mathJax)
                              // setMjPromise((window as any).MathJax.startup.promise)
                              // (window as any).MathJax.Hub.Queue(["Typeset",(window as any).MathJax.Hub]);
                              if (onLoad) onLoad()
                          })
                          script.addEventListener("error", (e) => {
                              if (onError) onError(e)
                              rej(e)
                          })

                          document.getElementsByTagName("head")[0].appendChild(script)
                      })
                    : Promise.resolve()
        }
    }

    return <MathJaxBaseContext.Provider value={mjPromise.current}>{children}</MathJaxBaseContext.Provider>
}

export default MathJaxContext

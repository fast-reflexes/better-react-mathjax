import React, { createContext, FC, useContext, useRef } from "react"

export type TypeSettingFunction =
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
    | "asciimath2chtml"
    | "asciimath2chtmlPromise"
    | "asciimath2svg"
    | "asciimath2svgPromise"
    | "asciimath2mml"
    | "asciimath2mmlPromise"

export interface MathJaxOverrideableProps {
    hideUntilTypeset?: "first" | "every" | null
    typesettingOptions?: {
        fn: TypeSettingFunction
        options?: object
    }
    renderMode?: "pre" | "post"
}

type MathJaxSubscriberProps = (
    | {
          version: 2
          promise: Promise<any> // TODO: replace any with type for MathJax object in version 2
      }
    | {
          version: 3
          promise: Promise<any> // TODO: replace any with type for MathJax object in version 3
      }
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
          // TODO replace occurrences with type for MathJax respective versions
          config?: object
          version: 2
          onStartup?: (mathJax: any) => void
      }
    | {
          config?: object
          version?: 3
          onStartup?: (mathJax: any) => void
      }
) &
    MathJaxContextStaticProps

const DEFAULT_V2_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
const DEFAULT_V3_SRC = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/tex-mml-chtml.min.js"
let promise: Promise<any>

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
        if (promise === undefined)
            promise =
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
                              if (onLoad) onLoad()
                          })
                          script.addEventListener("error", (e) => {
                              if (onError) onError(e)
                              rej(e)
                          })

                          document.getElementsByTagName("head")[0].appendChild(script)
                      })
                    : Promise.resolve()
        mjPromise.current = {
            version,
            typesettingOptions,
            renderMode,
            hideUntilTypeset,
            promise
        }
    }

    return <MathJaxBaseContext.Provider value={mjPromise.current}>{children}</MathJaxBaseContext.Provider>
}

export default MathJaxContext

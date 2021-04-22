// Type definitions for MathJax 2.7.9
// Project: https://github.com/mathjax/MathJax
// Definitions by: Roland Zwaga <https://github.com/rolandzwaga>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Refactored and updated by: Elias Lousseief <https://github.com/fast-reflexes>

/* to take care of use of Function in the original types which is advised against by lint rules,
typing it to a function type that matches almost any function */
type GeneralFunction = (...args: any[]) => void

export interface MathJax2Object {
    Hub: Hub
    Ajax: Ajax
    Message: Message
    HTML: HTML
    Callback: Callback
    Localization: Localization
    InputJax: InputJax
    OutputJax: OutputJax
}

export interface Callback {
    (arg: GeneralFunction | GeneralFunction[] | any[] | any | string): CallbackObject
    Delay(time: number, callback: any): CallbackObject
    Queue(...args: any[]): Queue
    Signal(name: string): Signal
    ExecuteHooks(hooks: any[], data: any[], reset: boolean): CallbackObject
    Hooks(reset: boolean): Hooks
}

export interface Hooks {
    Add(hook: any, priority: number): CallbackObject
    Remove(hook: CallbackObject): void
    Execute(): CallbackObject
}

export interface Queue {
    pending: number
    running: number
    queue: any[]
    Push(specs: any[]): CallbackObject
    Process(): void
    Suspend(): void
    Resume(): void
    wait(callback: GeneralFunction): GeneralFunction
    call(): void
}

export interface Signal {
    name: string
    posted: any[]
    listeners: CallbackObject[]
    Post(message: string, callback?: CallbackObject): CallbackObject
    Clear(callback?: CallbackObject): CallbackObject
    Interest(callback: CallbackObject, ignorePast?: boolean): CallbackObject
    NoInterest(callback: CallbackObject): void
    MessageHook(message: string, callback: CallbackObject): CallbackObject
    ExecuteHook(message: string): void
}

export interface CallbackObject {
    hook: number
    data: any[]
    object: any
    called: boolean
    autoReset: boolean
    reset(): void
}

export interface Hub {
    config?: MathJax2Config
    processSectionDelay?: number
    processUpdateTime?: number
    processUpdateDelay?: number
    signal?: Signal
    queue?: any
    Browser?: BrowserInfo
    inputJax?: any
    outputJax?: any
    Register?: Register
    Config(config: MathJax2Config): void
    Configured(): void
    Queue(callBack: any): any
    Typeset(element: any, callBack: any): any
    PreProcess(element: any, callBack: any): any
    Process(element: any, callBack: any): any
    Update(element: any, callBack: any): any
    Reprocess(element: any, callBack: any): any
    Rerender(element: any, callBack: any): any
    getAllJax(element: any): any[]
    getJaxByType(type: string, element: any): void
    getJaxByInputType(type: string, element: any): void
    getJaxFor(element: any): any
    isJax(element: any): number
    setRenderer(renderer: string, type: string): void
    Insert(dst: any, src: any): any
    formatError(script: any, error: any): void
}

export interface Register {
    PreProcessor(callBack: any): void
    MessageHook(type: string, callBack: any): void
    StartupHook(type: string, callBack: any): void
    LoadHook(file: string, callBack: GeneralFunction): void
}

export interface BrowserInfo {
    version: string
    isMac?: boolean
    isPC?: boolean
    isMobile?: boolean
    isFirefox?: boolean
    isSafari?: boolean
    isChrome?: boolean
    isOpera?: boolean
    isMSIE?: boolean
    isKonqueror?: boolean
    versionAtLeast(version: string): void
    Select(choices: any): void
}

export interface Ajax {
    timeout?: number
    STATUS: STATUS
    loaded: any
    loading: boolean
    loadHooks: any
    Require(file: string, callBack: any): any
    Load(file: string, callBack: any): any
    loadComplete(file: string): void
    loadTimeout(file: string): void
    loadError(file: string): void
    LoadHook(file: string, callBack: any): any
    Preloading(...args: any[]): void
    Styles(styles: any, callback: any): any
    fileURL(file: string): string
}

export interface STATUS {
    OK: string
    ERROR: string
}

export interface Message {
    Set(message: string, n: number, delay: number): number
    Clear(n: number, delay: number): void
    Remove(): void
    File(file: string): number
    filterText(text: string, n: number): string
    Log(): string
}

export interface HTML {
    Cookie?: Cookie
    Element(type: string, attributes: any, contents: any): any
    addElement(parent: any, type: string, attributes: any, content: any): any
    TextNode(text: string): any
    addText(parent: any, text: string): any
    setScript(script: string, text: string): void
    getScript(script: string): string
}

export interface Cookie {
    prefix?: string
    expires?: number
    Set(name: string, data: any): void
    Get(name: string, obj?: any): any
}

export interface MenuSettings {
    zoom?: "None" | "Hover" | "Click" | "Double-Click"
    CTRL?: boolean
    ALT?: boolean
    CMD?: boolean
    Shift?: boolean
    zscale?: string
    context?: "MathJax" | "Browser"
    texHints?: boolean
    mpContext?: boolean
    mpMouse?: boolean
    inTabOrder?: boolean
    semantics?: boolean
    readonly renderer?: "HTML-CSS" | "CommonHTML" | "PreviewHTML" | "NativeMML" | "SVG" | "PlainSource"
}

export interface ErrorSettings {
    message?: string[]
    style?: any
}

export interface MathJax2Config {
    MathZoom?: MathZoom
    MathMenu?: MathMenu
    MathEvents?: MathEvents
    FontWarnings?: FontWarnings
    Safe?: Safe
    MatchWebFonts?: MatchWebFonts
    SVG?: SVGOutputProcessor
    MMLorHTML?: MMLorHTMLConfiguration
    NativeMML?: NativeMMLOutputProcessor
    "HTML-CSS"?: HTMLCSSOutputProcessor
    CommonHTML?: CommonHTMLOutputProcessor
    AsciiMath?: AsciiMathInputProcessor
    MathML?: MathMLInputProcessor
    TeX?: TeXInputProcessor
    jsMath2jax?: JSMath2jaxPreprocessor
    asciimath2jax?: Asciimath2jaxPreprocessor
    mml2jax?: MML2jaxPreprocessor
    tex2jax?: TEX2jaxPreprocessor
    jax?: string[]
    extensions?: string[]
    config?: string[]
    styleSheets?: string[]
    styles?: any
    preJax?: any
    postJax?: any
    preRemoveClass?: string
    showProcessingMessages?: boolean
    messageStyle?: string
    displayAlign?: string
    displayIndent?: string
    delayStartupUntil?: string
    skipStartupTypeset?: boolean
    elements?: string[]
    positionToHash?: boolean
    showMathMenu?: boolean
    showMathMenuMSIE?: boolean
    menuSettings?: MenuSettings
    errorSettings?: ErrorSettings
    "v1.0-compatible"?: boolean
}

export interface MathZoom {
    styles: any
}

export interface MathMenu {
    delay?: number
    helpURL?: string
    showRenderer?: boolean
    showFontMenu?: boolean
    showLocale?: boolean
    showMathPlayer?: boolean
    showContext?: boolean
    semanticsAnnotations?: any
    windowSettings?: any
    styles?: any
}

export interface MathEvents {
    hover?: number
    styles?: any
}

export interface FontWarnings {
    messageStyle?: any
    Message?: HTMLMessages
    HTML?: HTMLSnippets
    removeAfter?: number
    fadeoutSteps?: number
    fadeoutTime?: number
}

export interface HTMLMessages {
    webFont?: any[]
    imageFonts?: any[]
    noFonts?: any[]
}

export interface HTMLSnippets {
    closeBox?: string
    webfonts?: string
    fonts?: string
    STIXfonts?: string
    TeXfonts?: string
}

export interface Safe {
    allow?: SafeAllow
    sizeMin?: number
    sizeMax?: number
    safeProtocols?: SafeProtocols
    safeStyles?: SafeStyles
    safeRequire?: SafeRequire
}

export interface SafeAllow {
    URLs?: string
    classes?: string
    cssIDs?: string
    styles?: string
    require?: string
    fontsize?: string
}

export interface SafeProtocols {
    http?: boolean
    https?: boolean
    file?: boolean
    javascript?: boolean
}

export interface SafeStyles {
    color?: boolean
    backgroundColor?: boolean
    border?: boolean
    cursor?: boolean
    margin?: boolean
    padding?: boolean
    textShadow?: boolean
    fontFamily?: boolean
    fontSize?: boolean
    fontStyle?: boolean
    fontWeight?: boolean
    opacity?: boolean
    outline?: boolean
}

export interface SafeRequire {
    action?: boolean
    amscd?: boolean
    amsmath?: boolean
    amssymbols?: boolean
    autobold?: boolean
    "autoload-all"?: boolean
    bbox?: boolean
    begingroup?: boolean
    boldsymbol?: boolean
    cancel?: boolean
    color?: boolean
    enclose?: boolean
    extpfeil?: boolean
    HTML?: boolean
    mathchoice?: boolean
    mhchem?: boolean
    newcommand?: boolean
    noErrors?: boolean
    noUndefined?: boolean
    unicode?: boolean
    verb?: boolean
}

export interface MatchWebFonts {
    matchFor?: MatchFor
    fontCheckDelay?: number
    fontCheckTimeout?: number
}

export interface MatchFor {
    "HTML-CSS"?: boolean
    NativeMML?: boolean
    SVG?: boolean
}

export interface SVGOutputProcessor {
    scale?: number
    minScaleAdjust?: number
    font?: string
    blacker?: number
    undefinedFamily?: string
    mtextFontInherit?: boolean
    addMMLclasses?: boolean
    useFontCache?: boolean
    useGlobalCache?: boolean
    EqnChunk?: number
    EqnChunkFactor?: number
    EqnChunkDelay?: number
    matchFontHeight?: boolean
    linebreaks?: LineBreaks
    styles?: any
    tooltip?: ToolTip
}

export interface LineBreaks {
    automatic?: boolean
    width?: string
}

export interface ToolTip {
    delayPost: number
    delayClear: number
    offsetX: number
    offsetY: number
}

export interface MMLorHTMLConfiguration {
    prefer?: BrowserPreference
}

export interface BrowserPreference {
    MSIE?: string
    Firefox?: string
    Safari?: string
    Chrome?: string
    Opera?: string
    other?: string
}

export interface NativeMMLOutputProcessor {
    scale?: number
    minScaleAdjust?: number
    matchFontHeight?: boolean
    styles?: any
}

export interface HTMLCSSOutputProcessor {
    scale?: number
    minScaleAdjust?: number
    availableFonts?: string[]
    preferredFont?: string
    webFont?: string
    imageFont?: string
    undefinedFamily?: string[]
    mtextFontInherit?: boolean
    EqnChunk?: number
    EqnChunkFactor?: number
    EqnChunkDelay?: number
    matchFontHeight?: boolean
    linebreaks?: LineBreaks
    styles?: any
    showMathMenu?: boolean
    tooltip?: ToolTip
}

export interface CommonHTMLOutputProcessor {
    scale?: number
    minScaleAdjust?: number
    mtextFontInherit?: boolean
    linebreaks?: LineBreaks
}

export interface AsciiMathInputProcessor {
    displaystyle?: boolean
    decimal?: string
}

export interface MathMLInputProcessor {
    useMathMLspacing?: boolean
}

export interface TeXInputProcessor {
    TagSide?: string
    TagIndent?: string
    MultLineWidth?: string
    equationNumbers?: EquationNumbers
    Macros?: any
    MAXMACROS?: number
    MAXBUFFER?: number
    extensions?: string[]
}

export interface EquationNumbers {
    autoNumber?: string
    formatNumber?: (n: number) => string
    formatTag?: (n: number) => string
    formatID?: () => string
    formatURL?: (id: string) => string
    useLabelIds?: boolean
}

export interface JSMath2jaxPreprocessor {
    preview: any
}

export interface Asciimath2jaxPreprocessor {
    delimiters?: any
    preview?: any
    skipTags?: string[]
    ignoreClass?: string
    processClass?: string
}

export interface MML2jaxPreprocessor {
    preview?: any
}

export interface TEX2jaxPreprocessor {
    inlineMath?: any
    displayMath?: any
    balanceBraces?: boolean
    processEscapes?: boolean
    processEnvironments?: boolean
    preview?: any
    skipTags?: string[]
    ignoreClass?: string
    processClass?: string
}

export interface Localization {
    locale: string
    directory: string
    strings: any
    _(id: number, message: string, ...args: any[]): void
    setLocale(locale: string): void
    addTranslation(locale: string, domain: string, def: any): void
    setCSS(div: any): any
    fontFamily(): string
    fontDirection(): string
    plural(value: any): number
    number(value: number): string
    loadDomain(domain: string, callback?: CallbackObject): CallbackObject
    Try(spec: any): void
}

export interface InputJax {
    id: string
    version: string
    directory: string
    elementJax: string
    Process(script: any, state: any): any
    Translate(script: any, state: any): ElementJax
    Register(mimetype: string): void
    needsUpdate(element: any): boolean
}

export interface OutputJax {
    id: string
    version: string
    directory: string
    fontDir: string
    imageDir: string
    preProcess(state: any): void
    preTranslate(state: any): void
    Translate(script: any, state: any): ElementJax
    postTranslate(state: any): void
    Register(mimetype: string): void
    Remove(jax: any): void
    getJaxFromMath(math: any): ElementJax
    Zoom(jax: any, span: any, math: any, Mw: number, Mh: number): ZoomStruct
}

export interface ZoomStruct {
    Y: number
    mW: number
    mH: number
    zW: number
    zH: number
}

export interface ElementJax {
    id: string
    version: string
    directory: string
    inputJax: string
    outputJax: string
    inputID: string
    originalText: string
    mimeType: string
    Text(text: string, callback?: any): CallbackObject
    Rerender(callback: any): CallbackObject
    Reprocess(callback: any): CallbackObject
    Remove(): void
    SourceElement(): any
    needsUpdate(): boolean
}

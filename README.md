
# React component for MathJax #

Up-to-date component for using MathJax in React. Allows the use of both version 2 and 3 of MathJax and focuses on making
the dynamic use of MathJax in React a pleasant experience.

## A simple MathJax component for React ##

For MathJax to work with React, `better-react-mathjax` requires you to wrap the outermost component containing math
in a `MathJaxContext` component. Then simply use `MathJax` for the actual MathJax content. The `MathJaxContext` is responsible 
for downloading MathJax and providing it to all wrapped `MathJax` components that typeset math. Use `MathJax` components
to wrap small and pure stateless parts / components of your app. 

### Features ###

* Supports both MathJax version 2 and 3
* Supports local copy of MathJax or content supplied via CDN
* Either put your math into the DOM with React first and let MathJax typeset afterwards (v. 2 and 3), or typeset with MathJax 
  first and add it to the DOM afterwards (v. 3 only).
* Hide your components before they are typeset to make dynamic use of MathJax a pleasant experience.

### Examples ###

    <MathJaxContext version={2}>
        <div>
            <MathJax>
                <span>
                    { "\frac{25x}{10} = 2^10$$" }
                </span>
            </MathJax>
        </div>
    </MathJaxContext>

# API #

## `MathJaxContext` component ##

---

### `config: object` (optional) ###
MathJax configuration object. Make sure it corresponds to the version used. By default, it is the default
MathJax configuration.

### `src: string` (optional) ###
Local or remote url to fetch MathJax from, if not provided default url to CDN's will be used.

### `version: 2 | 3` (optional) ### 
Version of MathJax to use. If not provided, version 3 will be used. If set, make sure that
any configuration and url to MathJax uses the same version.
  
### `hideUntilTypeset: "first" | "every"` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component.

### `renderMode: "pre" | "post"` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component.

### `conversionOptions: { fn: ConversionFunction, options: object}` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component.

### `onStartUp((mathJax: any) => void)` (optional) ###
Callback to be called when MathJax has loaded successfully but before the MathJax object has been made available
to wrapped `MathJax` components. The MathJax object is handed as an argument to this callback which is a good place
to do any further configuration which cannot be done with a configuration object.

### `onLoad(() => void)` (optional) ###
Callback to be called when MathJax has loaded successfully and after the MathJax object has been made
available to the wrapped `MathJax` components. This marks the last step of the startup phase in the
`MathJaxContext` when MathJax is loaded.

### `onError((error: any) => void)` (optional) ###
Callback to deal with errors in the startup phase when MathJax is loaded.


## `MathJax` component ##

---

### `inline: boolean` (optional) ###
Whether the wrapped content should be an inline or block element. When `renderMode` is `post`, this refers to the outermost
component that this `MathJax` component wraps. If `renderMode` is `pre`, it corresponds to the mode of the
actual typeset math.

### `onInitTypeset(() => void)` (optional) ###
Callback for when the content has been typeset for the first time. May be used for hiding content until it is in a representative
state.

### `text: string` (optional) ###
Required and used when `renderMode` is set to `pre`. Should be the math string to convert without any delimiters. Requires
`conversionOptions` to be set. If `renderMode` is `post`, this property is ignored.

### `hideUntilTypeset: "first" | "every"` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component.

### `renderMode: "pre" | "post"` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component.

### `conversionOptions: { fn: ConversionFunction, options: object}` (optional) ###
Default to be used in wrapped `MathJax` components if the corresponding property is not set there.
See the corresponding property in the `MathJax` component. The `ConversionFunction` should on of the following
strings: `tex2chtml`, `tex2chtmlPromise`, `tex2svg`, `tex2svgPromise`, `tex2mml`, `tex2mmlPromise`, `mml2chtml`
, `mml2chtmlPromise`, `mml2svg`, `mml2svgPromise`, `mml2mml`, `mml2mmlPromise` , `ascii2chtml`, `ascii2chtmlPromise`
, `ascii2svg`, `ascii2svgPromise`, `ascii2mml`  or `ascii2mmlPromise` as described
### !!! Still in beta testing, please check back in a few days !!! ###

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).


# A simple React component for MathJax #

Up-to-date component for using MathJax in React. Focuses on being versatile and making the use of MathJax in 
React a pleasant experience with several methods to deal with flashes of untypeset content, both with respect to initial
rendering as well as dynamic updates. Simple to use but with many configuration options, for example, supports both
MathJax versions 2 and 3 and allows the user to host their own version of MathJax.

## Basic workflow ##

`better-react-mathjax` introduces two React components - `MathJaxContext` and `MathJax`. For MathJax to work with React, 
wrap the outermost component containing math in a `MathJaxContext` component. Then simply use `MathJax` components at 
different levels for the actual MathJax content. In the typical case, the content can be everything from a subtree of 
the DOM to a portion of text in a long paragraph. The `MathJaxContext` is responsible for downloading MathJax and 
providing it to all wrapped `MathJax` components that typeset math.

### Features ###

* Supports both MathJax version 2 and 3
* Supports local copy of MathJax or copy supplied via CDN
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

The following three properties can be set on **both** the `MathJaxContext` and `MathJax` components. When set on a 
`MathJaxContext` component, they apply to all wrapped `MathJax` components except those on which the property in 
question is set on the individual `MathJax` component, which then takes precedence.

---

### `hideUntilTypeset: "first" | "every" | undefined` ###
**Default**: `undefined` (no content is hidden at any time)

* `first`: The `MathJax` component (and its children) are hidden until after it has been typeset the first time after 
  which the component remains visible throughout its lifetime. The purpose of this is to hide unpleasant flashes of 
  untypeset content. An alternative way to take care of this is to use the `onInitTypeset` callback to manually control
  the visibility of a component or group of components.
  

* `every`: The same behaviour as when this property is set to `first`, but in addition, the `MathJax` component (and 
  its children) are now hidden and made visible every time it is typeset. With `renderMode` set to `pre` this happens
  when the `text`prop changes and with `renderMode` set to `post`, this happens every time the component renders. The purpose
  of this is to hide flashes of untypeset content when dynamic content is updated. On some occasions, this setting
  might result in "blinking" components which is not always better than flashes of untypeset content.

### `renderMode: "pre" | "post" | undefined` ###
**Default**: `post`

* `post`: All `children` content (any content allowed) is added to the DOM by React first and then MathJax processes the 
  wrapped content. This implies that MathJax cannot know if the content has changed or not and so typesetting takes 
  place on every render. Since the math is already in the DOM, this mode might give rise to flashes of untypeset content. 
  To counter this use `hideUntilTypeSet` property or, in the case of initial typesetting, the `onInitTypeset` callback. 
  Another way to battle this problem is to set `renderMode` to `pre`. 
  

* `pre`: Math is passed via the `text` property (only strings), which must be set with math without delimiters, and 
  processed by MathJax *before* it is inserted into the DOM. Also requires `typesettingOptions` to be set with the name 
  of the function to use for the typesetting as well as an optional configuration object with details. Because of this, 
  MathJax only typesets when the `text` property changes but since MathJax cannot look at the context of the math, no 
  automatic adaptation to surrounding content can be done and all such parameters have to be specified in the optional 
  `options` object of the `typesettingOptions` property. **Note**: The `pre` value can only be used with MathJax version 3.

### `typesettingOptions: { fn: TypesettingFunction, options: object | undefined} | undefined` ###
**Default**: `undefined` (no conversion function is available which throws an error when `renderMode` is `pre`)

* `fn`: The name of the MathJax function to use for typesetting. This is *only* used, and *must* be specified, when 
  `renderMode` is set to `pre` and should be one of the following strings: `tex2chtml`, `tex2chtmlPromise`, `tex2svg`, 
  `tex2svgPromise`, `tex2mml`, `tex2mmlPromise`, `mml2chtml`, `mml2chtmlPromise`, `mml2svg`, `mml2svgPromise`, 
  `mml2mml`, `mml2mmlPromise` , `ascii2chtml`, `ascii2chtmlPromise`, `ascii2svg`, `ascii2svgPromise`, `ascii2mml` or 
  `ascii2mmlPromise`. The value is the name of a function that MathJax generates based on the input configuration,
  as given to wrapping `MathJaxContext`, as per [the docs](http://docs.mathjax.org/en/latest/web/typeset.html#converting-a-math-string-to-other-formats).
  For example, for the `tex2chtml` function to be available, the configuration given to the `MathJaxContext` component 
  must contain a Tex input processor and an HTML output processor.
  

* `options`: An object with additional parameters to steer the typesetting when `renderMode` is set to `pre`. Since this 
  typesetting is done outside of the context in which the resulting math will be inserted, MathJax cannot adapt the output 
  to the surrounding content, which is why this has to be done manually by the typesetting function. More information 
  about this object can be found in the [the docs](http://docs.mathjax.org/en/latest/web/typeset.html#converting-a-math-string-to-other-formats).

## `MathJaxContext` component ##

---

### `config: object | undefined` ###
**Default**: `undefined` (MathJax default configuration used)

MathJax configuration object. Make sure it corresponds to the version used. More information can be found in 
[the docs](http://docs.mathjax.org/en/latest/web/configuration.html).

### `src: string | undefined` ###
**Default**: `undefined` (default CDN `https://cdnjs.cloudflare.com` is used)

Local or remote url to fetch MathJax from. More information about hosting your own copy of MathJax can be found
[here](http://docs.mathjax.org/en/latest/web/hosting.html).

### `version: 2 | 3 | undefined` ###
**Default**: `3`

Version of MathJax to use. If set, make sure that any configuration and url to MathJax uses the same version. If `src`
is not specified, setting `src`to 2 currently makes use of version 2.7.9 and setting it to `3` uses 3.1.2.

### `onStartUp((mathJax: any) => void) | undefined` ###
**Default**: `undefined`

Callback to be called when MathJax has loaded successfully but before the MathJax object has been made available
to wrapped `MathJax` components. The MathJax object is handed as an argument to this callback which is a good place
to do any further configuration which cannot be done with a configuration object.

### `onLoad(() => void) | undefined` ###
**Default**: `undefined`

Callback to be called when MathJax has loaded successfully and after the MathJax object has been made available to the 
wrapped `MathJax` components. This marks the last step of the startup phase in the `MathJaxContext` component when 
MathJax is loaded.

### `onError((error: any) => void) | undefined` ###
**Default**: `undefined`

Callback to handle with errors in the startup phase when MathJax is loaded.


## `MathJax` component ##

---

### `inline: boolean | undefined` ###
**Default**: `false`

Whether the wrapped content should be an inline or block element. When `renderMode` is `post`, this refers to the outermost
wrapping component that this `MathJax` component wraps (the user might still have inline math in children blocks). If 
`renderMode` is `pre`, it corresponds to the mode of the actual typeset math.

### `onInitTypeset(() => void) | undefined` ###
**Default**: `undefined`

Callback for when the content has been typeset for the first time. May, as an example, be used for hiding content in an 
organized way across different elements until all are in a representative state.

### `text: string | undefined` ###
**Default**: `undefined`

Required and only used when `renderMode` is set to `pre`. Should be the math string to convert without any delimiters. 
Requires `typesettingOptions` to be set. If `renderMode` is `post`, this property is ignored.

# General Considerations #

* Use `renderMode` set to `post` as often as possible since it enables MathJax to adapt the typesetting to the surroundings;
something you have to do manually with `renderMode` set to `pre` since MathJax doesn't have access to the surrounding context with it.
* If you do not achieve the effect you want, play around with what content you wrap in `MathJax` components and where in the
hierarchy they are kept.
* Use `hideUntilTypeset` set to `first` or the `onInitTypeset` callback to hide content initially until typesetting is done.
This is usually enough and dynamic updates shouldn't be a problem in most scenarios.

# Tips and Tricks #
* Currently, version 3 gives rise to flickering in both Chrome and Safari on dynamic updates. This does not seem to be related
  to the actual typesetting but how the CSS is injected into the browser. With version 2, seemless typesetting is still
  possible in these browsers.
* In version 2, disabled `fast-preview` and `processSectionDelay` for a smooth experience. This is done by including
  `"fast-preview": { disabled: true}` in the MathJax config object given to the `MathJaxContext` and adding 
  `mathJax => mathJax.Hub.processSectionDelay = 0` as the `onStartup` callback to the same.
## License

This project is licensed under the terms of the
[MIT license](/LICENSE).

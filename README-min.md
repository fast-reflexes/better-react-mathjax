
# A simple React component for MathJax #

#### Note: The full documentation is available at https://github.com/fast-reflexes/better-react-mathjax ####

Up-to-date component for using MathJax in latest React (using functional components and hooks API). Focuses on being versatile and making the use of MathJax in
React a pleasant experience without flashes of non-typeset content, both with respect to initial rendering as
well as dynamic updates. Simple to use but with many configuration options.

## Features

* Supports both MathJax version 2 and 3.
* Supports local copy of MathJax or copy supplied via CDN.
* Small imprint on production bundle with dependencies only for types (image shows a size of 6.18 KB and 2.3 KB gzipped in a NextJS project analyzed with their bundle analyzer).

<br/>
<p align="center" width="100%">
  <img align="center" src="https://github.com/fast-reflexes/better-react-mathjax/blob/master/images/bundle_imprint.png" width="75%">
</p>
<br/>

* Built in a modular fashion on top of MathJax with direct access to MathJax via the MathJax configuration.
* Use MathJax functionality either through the `MathJax` component or by yourself through the `MathJaxBaseContext`.
* Either put your math into the DOM with React first and let MathJax typeset afterwards (v. 2 and 3), or typeset with MathJax
  first and add it to the DOM afterwards (v. 3 only).
* Hide your components before they are typeset to avoid flashes of non-typeset content and make the use of MathJax a
  pleasant experience.
* Complete - no other dependencies related to MathJax are needed to enable the use of MathJax in your React app.

## Basic workflow

### Installation

Add this library manually as a dependency to `package.json`...
```
dependencies: {
    "better-react-mathjax": "^2.0.3"
}
```
... and then run `npm install` **or** let `npm` or `yarn` do it for you, depending on which package manager you have
chosen to use:
```shell
# npm
npm install better-react-mathjax

# yarn
yarn add better-react-mathjax
```

### Usage

`better-react-mathjax` introduces two React components - `MathJaxContext` and `MathJax`. For MathJax to work with React:

1. Wrap your entire app in a `MathJaxContext` component (***only use one in your app***).
```js
const App = () => {

   return (
       <MathJaxContext>
           <!-- APP CONTENT -->
       </MathJaxContext>
   )
}
```
2. Then simply use `MathJax` components at different levels for the actual math. 
```js
const Component = () => {

   return (
       <div>
           <MathJax>{ /* math content */ }</MathJax>
           <h3>This is a header</h3>
           <MathJax>
               <div>
                   <h4>This is a subheader</h4>
                   <span>{ /* math content */ }</span>
                   <h4>This is a second subheader</h4>
                   <span>{ /* math content */ }</span>
                   ...
               </div>
           </MathJax>
           <p>
               This is text which involves math <MathJax>{ /* math content */ }</MathJax> inside the paragraph.
           </p>
       </div>
   )
}
```
In the typical case, the content of a `MathJax` component can be everything from a subtree of the DOM to a portion of 
text in a long paragraph. If you have a lot of math, try to wrap as much as possible in the same `MathJax` component.
The `MathJaxContext` is responsible for downloading MathJax and providing it to all wrapped `MathJax` components that 
typeset math. By default, `MathJaxContext` imports MathJax from a CDN which allows for use of Latex, AsciiMath and MathML 
with [MathJax version 2](https://docs.mathjax.org/en/v2.7-latest/config-files.html#the-tex-mml-am-chtml-configuration-file) and 
Latex and MathML with the default [MathJax version 3](https://docs.mathjax.org/en/latest/web/components/combined.html#tex-mml-chtml) with 
HTML output for both. If you need something else or want to host your own copy of MathJax, read more about the `src`
attribute of the `MathJaxContext` below.

## Examples

The first 3 are basic examples with zero configuration standard setup using MathJax version 3 with default MathJax config
and no extra options. Note that sandboxes tend to be slower than use in a real environment.

### Example 1: Basic example with Latex ####

Standard setup using MathJax version 3 with default MathJax config and no extra options.
```js
export default function App() {

    return (
        <MathJaxContext>
              <h2>Basic MathJax example with Latex</h2>
              <MathJax>{"\\(\\frac{10}{4x} \\approx 2^{12}\\)"}</MathJax>
        </MathJaxContext>
    );
    
}
```
Sandbox: https://codesandbox.io/s/better-react-mathjax-basic-example-latex-bj8gd

### Example 2: Basic example with AsciiMath ####

Using AsciiMath with the default version 3 import requires adding an extra loader (see the [MathJax documentation](http://docs.mathjax.org/en/latest/input/asciimath.html) 
for further information). AsciiMath uses the same display mode on the entire page, which is display math by default. 
It can be changed to inline math by adding `asciimath: { displaystyle: false }` to the input config.
```js
export default function App() {
    const config = {
        loader: { load: ["input/asciimath"] }
    };
    
    return (
        <MathJaxContext config={config}>
            <h2>Basic MathJax example with AsciiMath</h2>
            <MathJax>{"`frac(10)(4x) approx 2^(12)`"}</MathJax>
        </MathJaxContext>
    );
}
```

Sandbox: https://codesandbox.io/s/better-react-mathjax-basic-example-asciimath-ddy4r

### Example 3: Basic example with MathML ####

MathML is supported natively by a few but far from all browsers. It might be problematic to use with Typescript (no types for
MathML included in this package).
```js
export default function App() {
    return (
        <MathJaxContext>
            <h2>Basic MathJax example with MathML</h2>
            <MathJax>
                <math>
                    <mrow>
                        <mrow>
                            <mfrac>
                                <mn>10</mn>
                                <mi>4x</mi>
                            </mfrac>
                        </mrow>
                        <mo>&asymp;</mo>
                        <mrow>
                            <msup>
                                <mn>2</mn>
                                <mn>12</mn>
                            </msup>
                        </mrow>
                    </mrow>
                </math>
            </MathJax>
        </MathJaxContext>
    );
}
```
Sandbox: https://codesandbox.io/s/better-react-mathjax-basic-example-mathml-20vv6

### Example 4: Elaborate example with Latex ###
Sandbox: https://codesandbox.io/s/better-react-mathjax-example-latex-3vsr5

### Example 5: Elaborate example with AsciiMath ###
Sandbox: https://codesandbox.io/s/better-react-mathjax-example-asciimath-p0uf1

### Example 6: Elaborate example with MathML ###

Make sure to study the comments in this file as MathML processing is a little bit different from Latex and AsciiMath.

Sandbox link: https://codesandbox.io/s/better-react-mathjax-example-mathml-nprxz

### Example 7: Elaborate example with optimal settings for dynamic updates with Latex ###

This example shows a configuration that in some particular cases has proven to result in a very smooth experience with
no flashes of non-typeset content. **It is by no means recommended as a first attempt and can be tried if you 
experience problems with flashes of non-typeset content, long waiting times or other undesired behaviour**. Especially for
those using MathJax version 2, some of the configuration options can be used as an inspiration.

Sandbox link: https://codesandbox.io/s/better-react-mathjax-example-latex-optimal-8nn9n

# TypeScript types #
This project has both its own types and MathJax types included in the package. For MathJax version 2, a refactored and updated
version of [`@types/mathjax`](https://www.npmjs.com/package/@types/mathjax) is used whereas for MathJax version 3, this package
depends on the types from [`mathjax-full`](https://www.npmjs.com/package/mathjax-full). Nonetheless, none of the logic from
these are used in this project so after building production code and tree-shaking, these dependencies will not affect the
size of the final bundle. If you would prefer a separate `@types` package for this project, please make a suggestion about this in an issue on the
project Github page. Note also that issues with the MathJax 2 types can be addressed and updated within this project whereas
the types from `mathjax-full` are used unaltered.

# API #

The following three properties can be set on **both** the `MathJaxContext` and `MathJax` components. When set on a
`MathJaxContext` component, they apply to all wrapped `MathJax` components except those on which the property in
question is set on the individual `MathJax` component, which then takes precedence.

**Note**: `MathJax3Object` and `MathJax3Config` are aliases for `MathJaxObject` and `MathJaxConfig`
as exported by `mathjax-full`.

---

### `hideUntilTypeset: "first" | "every" | undefined` ###

Controls whether the content of the `MathJax` component should be hidden until after typesetting is finished.

**Default**: `undefined` (no content is hidden at any time)

### `renderMode: "pre" | "post" | undefined` ###

Controls how typesetting by MathJax is done in the DOM. Typically, using the setting of `post` works well but in rare cases
it might be desirable to use `pre` for performance reasons or to handle very special cases of flashes of non-typeset content.

**Default**: `post`

### `typesettingOptions: { fn: TypesettingFunction, options: OptionList | undefined } | undefined` ###

Used to control typesetting when `renderMode` is set to `pre`. Controls which typesetting function to use and an optional
object with typesetting details.

**Default**: `undefined` (no conversion function is supplied which throws an error when `renderMode` is `pre`)

## `MathJaxContext` component ##

---
### `config: MathJax2Config | MathJax3Config | undefined` ###

Controls MathJax and is passed to MathJax as its config.

**Default**: `undefined` (default MathJax configuration is used)

MathJax configuration object. Make sure it corresponds to the version used. More information can be found in
[the docs](http://docs.mathjax.org/en/latest/web/configuration.html).

### `src: string | undefined` ###

The location of MathJax.

**Default**: `undefined` (default CDN `https://cdnjs.cloudflare.com` is used)

Local or remote url to fetch MathJax from. More information about hosting your own copy of MathJax can be found
[in the MathJax documentation](http://docs.mathjax.org/en/latest/web/hosting.html) and more in particular on
[the `better-react-mathjax` Github page](https://github.com/fast-reflexes/better-react-mathjax/issues/1#issuecomment-873537018).

A source url may contain both some specific file and some query parameters corresponding to a configuration which, in turn, governs
which additional assets MathJax fetches. The default sources used when this property is omitted are the same as those 
listed in the [MathJax instruction](https://www.mathjax.org/#gettingstarted) (however from a different CDN).

### `version: 2 | 3 | undefined` ###

MathJax version to use. Must be synced with any `config` passed.

**Default**: `3`

Version of MathJax to use. If set, make sure that any configuration and url to MathJax uses the same version. If `src`
is not specified, setting `version`to `2` currently makes use of version 2.7.9 and setting it to `3` uses 3.2.0.

### `onStartUp: (mathJax: MathJax2Object | MathJax3Object) => void) | undefined` ###

Callback to be called when MathJax has loaded successfully but before the MathJax object has been made available
to wrapped `MathJax` components. The MathJax object is handed as an argument to this callback which is a good place
to do any further configuration which cannot be done through the `config` object.

**Default**: `undefined`

### `onLoad: () => void | undefined` ###

Callback to be called when MathJax has loaded successfully and after the MathJax object has been made available to the
wrapped `MathJax` components.

**Default**: `undefined`

### `asyncLoad: boolean | undefined` ###

Value to use for the `async` property of the MathJax `script` tag.

**Default**: `false`

### `onError: (error: any) => void | undefined` ###

Callback to handle errors in the startup phase when MathJax is loaded.

**Default**: `undefined`

## `MathJax` component ##

---
### `inline: boolean | undefined` ###

Whether the wrapped content should be in an inline or block element.

**Note**: Currently only MathML and Latex can switch between inline mode and math mode in the same document. This means that
AsciiMath will use the document default for content, no matter the setting of this property. The property will still affect
the wrapper nonetheless.

**Default**: `false`

### `onInitTypeset: () => void) | undefined` ###

Callback for when the content has been typeset for the first time.

**Default**: `undefined`

### `onTypeset: () => void) | undefined` ###

Callback for when the content has been typeset (not only initially).

**Default**: `undefined`

### `text: string | undefined` ###

*Required* and *only* used when `renderMode` is set to `pre`. Should be the math string to convert without any delimiters.
Requires `typesettingOptions` to be set and version to be `3`. If `renderMode` is `post`, this property is ignored.

**Default**: `undefined`

### `dynamic: boolean | undefined` ###

Indicates whether the content of the `MathJax` component may change after initial rendering.

**Default**: `false`

***

***Any additional props will be spread to the root element of the `MathJax` component which is a `span` with `display`
set to `inline` when the `inline` property is set to `true`, otherwise `block`. The `display` can be overridden via
`style` prop if needed (then the `inline` property does not affect the wrapper). A ref is not possible to set
as this functionality is used by the `MathJax` component itself.***

## Custom use of MathJax directly ##
You can use the underlying MathJax object directly (not through the `MathJax` component) if you want as well. The
following snippet illustrates how to use `MathJaxBaseContext` to accomplish this.
```js
// undefined or MathJaxSubscriberProps with properties version, hideUntilTypeset, renderMode, typesettingOptions and promise
const mjContext = useContext(MathJaxBaseContext)
if(mjContext)
  mjContext.promise.then(mathJaxObject => { /* do work with the MathJax object here */ })
```
This requires only a `MathJaxContext`, supplying the `MathJaxBaseContext`, to be in the hierarchy. The object passed from the `promise` property is the MathJax
object for the version in use.

Sandbox example: https://codesandbox.io/s/better-react-mathjax-custom-example-latex-e5kym

## MathJax documentation ##

* Version 3: https://docs.mathjax.org/en/latest/
* Version 2: https://docs.mathjax.org/en/v2.7-latest/

## Github ##

Read full documentation, file problems or contribute on Github: https://github.com/fast-reflexes/better-react-mathjax

## License

This project is licensed under the terms of the
[MIT license](https://github.com/fast-reflexes/better-react-mathjax/blob/master/LICENSE).


# A simple React component for MathJax #

Up-to-date component for using MathJax in latest React (using functional components and hooks API). Focuses on being versatile and making the use of MathJax in
React a pleasant experience without flashes of non-typeset content, both with respect to initial rendering as
well as dynamic updates. Simple to use but with many configuration options.

## Features

* Supports both MathJax version 2 and 3.
* Supports local copy of MathJax or copy supplied via CDN.
* Small imprint on production bundle with dependencies only for types (image shows a size of 7.32 KB and 2.37 KB gzipped in a NextJS project analyzed with their bundle analyzer).

<br/>
<p align="center" width="100%">
  <img align="center" src="https://github.com/fast-reflexes/better-react-mathjax/blob/2.0.0-next/images/bundle_imprint.png" width="75%">
</p>
<br/>

* Built in a modular fashion on top of MathJax with direct access to MathJax via the MathJax configuration.
* Use MathJax functionality either through the `MathJax` component or by yourself through the `MathJaxBaseContext`.
* Either put your math into the DOM with React first and let MathJax typeset afterwards (v. 2 and 3), or typeset with MathJax
  first and add it to the DOM afterwards (v. 3 only).
* Hide your components before they are typeset to avoid flashes of non-typeset content and make the use of MathJax a
  pleasant experience.

## Basic workflow

### Installation

Add this library manually as a dependency to `package.json`...

    dependencies: {
        "better-react-mathjax": "^2.0.0"
    }

... and then run `npm install` **or** let `npm` or `yarn` do it for you, depending on which package manager you have
chosen to use:

    # npm
    npm install better-react-mathjax

    # yarn
    yarn add better-react-mathjax

### Usage

`better-react-mathjax` introduces two React components - `MathJaxContext` and `MathJax`. For MathJax to work with React:

1. Wrap your entire app in a `MathJaxContext` component (***only use one in your app***).

       const App = () => {

           return (
               <MathJaxContext>
                   <!-- APP CONTENT -->
               </MathJaxContext>
           )
       }

2. Then simply use `MathJax` components at different levels for the actual math. 

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

In the typical case, the content of a `MathJax` component can be everything from a subtree of the DOM to a portion of 
text in a long paragraph. If you have a lot of math, try to wrap as much as possible in the same `MathJax` component.
The `MathJaxContext` is responsible for downloading MathJax and providing it to all wrapped `MathJax` components that 
typeset math. By default, `MathJaxContext` imports MathJax from a CDN which allows for use of Latex, AsciiMath and MathML 
with [MathJax version 2](https://docs.mathjax.org/en/v2.7-latest/config-files.html#the-tex-mml-am-chtml-configuration-file) and 
Latex and MathML with the default [MathJax version 3](https://docs.mathjax.org/en/latest/web/components/combined.html#tex-mml-chtml) with 
HTML output for both. If you need something else or want to host your own copy of MathJax, read more about the `src`
attribute of the `MathJaxContext` below.

## Display math and inline math

Both Latex, AsciiMath and MathML have the notion of display math and inline math where display math uses a style and 
font where the math is allowed to take up more space

<br/>
<p align="center" width="100%">
  <img align="center" src="https://github.com/fast-reflexes/better-react-mathjax/blob/2.0.0-next/images/display.png" width="100%">
</p>
<br/>

Inline math should be used when math is typeset in the middle of text, which then puts some restrictions on space and 
style

<br/>
<p align="center" width="100%">
  <img align="center" src="https://github.com/fast-reflexes/better-react-mathjax/blob/2.0.0-next/images/inline.png" width="25%">
</p>
<br/>

These styles can be set on individual instances of math in Latex and MathML by the use of different pre-configured 
delimiters, but in AsciiMath, all the math in an app has to use the same style which is set in the configuration 
(display math by default). On top of this, the `MathJax` component has a property `inline` which controls whether the 
wrapper element added by the `MathJax` component uses an `inline` or `block` display. Since a `MathJax` component can 
contain a lot of other things than just a single portion of math, it is important to understand that the `inline` prop 
is NOT synonymous with inline math since the former controls an element which may contain a lot of things whereas the 
latter always controls the typesetting of a specific string of math. Therefore, always use configuration and delimiters 
to control whether to use display math or inline math and use the `inline` prop to coordinate with the previous setting 
and control the appearance of the `MathJax` component itself. Study the elaborate examples below for more 
insights.

Exceptions to the above rule is when the `MathJax` component prop `renderMode` has the value `pre` in which case one 
`MathJax` component becomes synonymous with a single piece of math (given as the `text` prop) in which case the `inline` 
property controls the math mode of the output. The impact of the `inline` prop on the wrapper element will be ignored 
if a style that overrides `display` is added to a `MathJax` component.

## Examples

The first 3 are basic examples with zero configuration standard setup using MathJax version 3 with default MathJax config
and no extra options. Note that sandboxes tend to be slower than use in a real environment.

### Example 1: Basic example with Latex ####

Standard setup using MathJax version 3 with default MathJax config and no extra options.

    export default function App() {
    
        return (
            <MathJaxContext>
                  <h2>Basic MathJax example with Latex</h2>
                  <MathJax>{"\\(\\frac{10}{4x} \\approx 2^{12}\\)"}</MathJax>
            </MathJaxContext>
        );

Sandbox: https://codesandbox.io/s/better-react-mathjax-basic-example-latex-bj8gd

### Example 2: Basic example with AsciiMath ####

Using AsciiMath with the default version 3 import requires adding an extra loader (see the [MathJax documentation](http://docs.mathjax.org/en/latest/input/asciimath.html) 
for further information). AsciiMath uses the same display mode on the entire page, which is display math by default. 
It can be changed to inline math by adding `asciimath: { displaystyle: false }` to the input config.

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

Sandbox: https://codesandbox.io/s/better-react-mathjax-basic-example-asciimath-ddy4r

### Example 3: Basic example with MathML ####

MathML is supported natively by a few but far from all browsers. It might be problematic to use with Typescript (no types for
MathML included in this package).

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

# Under the hood #

The `MathJaxContext` component downloads MathJax and provides it to all users of the `MathJaxBaseContext`, which includes
`MathJax` components. A `MathJax` component typesets its content only once initially, if the `dynamic` flag
is not set, in which case the content is typeset every time a change might have occurred. To avoid showing the
user flashes of non-typeset content, the `MathJax` component does its work in a [layout effect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect), 
which runs "before the browser has a chance to paint". Nevertheless, since typesetting operations are asynchronous, both 
because the MathJax library needs to be downloaded but also because MathJax *should* typeset asynchronously to not block 
the UI if it has a lot to typeset, the typesetting taking place before the browser paints the updates cannot be guaranteed.
In most situations however, it should.

# TypeScript types #
This project has both its own types and MathJax types included in the package. For MathJax version 2, a refactored and updated
version of [`@types/mathjax`](https://www.npmjs.com/package/@types/mathjax) is used whereas for MathJax version 3, this package
depends on the types from [`mathjax-full`](https://www.npmjs.com/package/mathjax-full). Nonetheless, none of the logic from
these are used in this project so after building production code and tree-shaking, these dependencies will not affect the
size of the final bundle. If you would prefer a separate `@types` package for this project, please make a suggestion about this in an issue on the
project Github page. Note also that issues with the MathJax 2 types can be addressed and updated within this project whereas
the types from `mathjax-full` are used unaltered.

The MathJax types are not always helpful and the user should pay attention even if the compiler does not
complain. First of all, several of the types from `mathjax-full` contain catch-all properties of the form
`[s: string]: any` which effectively allows any props to be passed in. Hence, adding a MathJax 2 configuration to a `MathJaxContext`
using MathJax version 3 will not result in a compile error but instead be accepted even though most of the props won't
have the desired effect in MathJax 3. 

Also, due to [how TypeScript handles excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks),
if a configuration is given in a variable (as opposed to in a literal) where any property matches a property of the required type, 
the remaining props will be silently ignored. Since MathJax versions share a few configuration properties, it is therefore
also possible that a MathJax 3 configuration may be given to a `MathJaxContext` using MathJax 2 without compiler errors. This
can however be avoided by always using literals in which case excess properties are handled differently.

# API #

The following three properties can be set on **both** the `MathJaxContext` and `MathJax` components. When set on a
`MathJaxContext` component, they apply to all wrapped `MathJax` components except those on which the property in
question is set on the individual `MathJax` component, which then takes precedence.

**Note**: `MathJax3Object` and `MathJax3Config` are aliases for `MathJaxObject` and `MathJaxConfig`
as exported by `mathjax-full`.

---

### `hideUntilTypeset: "first" | "every" | undefined` ###

Controls whether the content of the `MathJax` component should be hidden until after typesetting is finished. The most useful
setting here is `first` since the longest delay in typesetting is likely to occur on page load when MathJax hasn't loaded
yet. Nonetheless, with a large amount of math on a page, MathJax might not be able to typeset fast enough in which case
non-typeset content might be shown to the user; in this case the setting of `every` might be handy.

**Default**: `undefined` (no content is hidden at any time)

* `first`: The `MathJax` component is hidden until its content has been typeset the first time after which the component 
  remains visible throughout its lifetime.


* `every`: The same behaviour as when this property is set to `first`, but in addition, the `MathJax` component is now 
  hidden and made visible every time it is typeset. With `renderMode` set to `pre` this has no effect and is treated as
  `first`. When `renderMode` is set to `post`, the component is typeset anew on every render. When MathJax is able to 
  typeset fast enough (which is most often the case), the updates will be seamless and the hiding will be invisible to 
  the human eye. When this is not the case this setting might result in "blinking" content as an alternative to flashes 
  of non-typeset content.

### `renderMode: "pre" | "post" | undefined` ###

Controls how typesetting by MathJax is done in the DOM. Typically, using the setting of `post` works well but in rare cases
it might be desirable to use `pre` for performance reasons or to handle very special cases of flashes of non-typeset content.

**Default**: `post`

* `post`: All `children` of the `MathJax` component are added to the DOM by React first and then MathJax processes the 
  wrapped content (in the DOM). This implies that MathJax cannot know if the content has changed or not between renderings
  and so typesetting takes place on every render. This mode **might** give rise to flashes of non-typeset content since the content 
  could enter the DOM before MathJax has typeset it (if MathJax doesn't typeset fast enough). In this 
  `renderMode` MathJax can inspect the context in the DOM and adapt its output to it in different ways (for example in terms of font size).
  

* `pre`: Math is passed via the `text` property (only strings), which must be set with math without delimiters, and 
  is processed by MathJax *before* it is inserted into the DOM. This mode also requires `typesettingOptions` to be set with 
  the name of the function to use for the typesetting as well as an optional configuration object with typesetting details. 
  In this `renderMode`, MathJax only typesets when the `text` property changes. Since MathJax cannot look at the context 
  (in the DOM) of the math, limited automatic adaptation to surrounding content can be accomplished and fine-tuning might have to 
  be done via the optional `options` object of the `typesettingOptions` property. **Note**: The `pre` value can only be 
  used with MathJax version 3.

### `typesettingOptions: { fn: TypesettingFunction, options: OptionList | undefined } | undefined` ###

Used to control typesetting when `renderMode` is set to `pre`. Controls which typesetting function to use and an optional
object with typesetting details.

**Default**: `undefined` (no conversion function is supplied which throws an error when `renderMode` is `pre`)

* `fn`: The name of the MathJax function to use for typesetting. This is *only* used, and *must* be specified, when 
  `renderMode` is set to `pre` and should be one of the following strings: `tex2chtml`, `tex2chtmlPromise`, `tex2svg`, 
  `tex2svgPromise`, `tex2mml`, `tex2mmlPromise`, `mathml2chtml`, `mathml2chtmlPromise`, `mathml2svg`, `mathml2svgPromise`, 
  `mathml2mml`, `mathml2mmlPromise` , `asciimath2chtml`, `asciimath2chtmlPromise`, `asciimath2svg`, `asciimath2svgPromise`, `asciimath2mml` or 
  `asciimath2mmlPromise`. The value is the name of a function that MathJax generates based on the input configuration,
  as given to the wrapping `MathJaxContext`, as per [the docs](http://docs.mathjax.org/en/latest/web/typeset.html#converting-a-math-string-to-other-formats).
  For example, for the `tex2chtml` function to be available, the configuration given to the `MathJaxContext` component 
  must (explicitly or by use of default) contain a Latex input processor and an HTML output processor.
  

* `options`: An object with additional parameters to control the typesetting when `renderMode` is set to `pre`. Since this 
  typesetting is done outside of the DOM context in which the resulting math will be inserted, MathJax cannot adapt the output 
  to the surrounding content, which is why this can be done manually by the typesetting function. More information 
  about this object can be found in the [the docs](http://docs.mathjax.org/en/latest/web/typeset.html#converting-a-math-string-to-other-formats).

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
listed in the [MathJax instruction](https://www.mathjax.org/#gettingstarted) (however from a different CDN). This means
that for version 2, the fetched resource (`MathJax.js?config=TeX-MML-AM_CHTML`) includes support for Latex, MML
and AsciiMath with HTML output by default, and for version 3, the fetched resource (`tex-mml-chtml.js`) supports
MML and Latex with HTML output. These correspond to some typical and broad use of MathJax in the browser. If you have a 
use case where you, using standalone MathJax, would have to use a different source url, then you have to manually supply 
such a url (local or remote) here. This, in analogy to how you would modify the script import to adjust to your needs in 
a plain HTML environment with direct use of MathJax. Read more about different configurations 
[here](https://docs.mathjax.org/en/latest/web/components/combined.html) (for MathJax 3) and 
[here](https://docs.mathjax.org/en/v2.7-latest/config-files.html#common-configurations) (for MathJax 2).

### `version: 2 | 3 | undefined` ###

MathJax version to use. Must be synced with any `config` passed.

**Default**: `3`

Version of MathJax to use. If set, make sure that any configuration and url to MathJax uses the same version. If `src`
is not specified, setting `version`to `2` currently makes use of version 2.7.9 and setting it to `3` uses 3.2.0.

### `onStartUp((mathJax: MathJax2Object | MathJax3Object) => void) | undefined` ###

Callback to be called when MathJax has loaded successfully but before the MathJax object has been made available
to wrapped `MathJax` components. The MathJax object is handed as an argument to this callback which is a good place
to do any further configuration which cannot be done through the `config` object.

**Default**: `undefined`

### `onLoad(() => void) | undefined` ###

Callback to be called when MathJax has loaded successfully and after the MathJax object has been made available to the
wrapped `MathJax` components. This marks the last step of the startup phase in the `MathJaxContext` component when
MathJax is loaded. Can be used to sync page loading state along with `onInitTypeset` callbacks on `MathJax` components.

**Default**: `undefined`

### `onError((error: any) => void) | undefined` ###

Callback to handle errors in the startup phase when MathJax is loaded.

**Default**: `undefined`

## `MathJax` component ##

---
### `inline: boolean | undefined` ###

Whether the wrapped content should be in an inline or block element. When `renderMode` is `post`, this refers to the 
wrapper component that this `MathJax` component uses (the user might still have both display and inline math inside). 
If `renderMode` is set to `pre` this property applies to *both* the wrapper component and the content which will be typeset 
as inline math if this property is set to `true` and as display math otherwise.

**Note**: Currently only MathML and Latex can switch between inline mode and math mode in the same document. This means that
AsciiMath will use the document default for content, no matter the setting of this property. The property will still affect
the wrapper nonetheless.

**Default**: `false`

### `onInitTypeset(() => void) | undefined` ###

Callback for when the content has been typeset for the first time. Can typically be used for hiding content or showing
a loading spinner in a coordinated way across different elements until all are in a representative state.

**Default**: `undefined`

### `onTypeset(() => void) | undefined` ###

Callback for when the content has been typeset (not only initially). Can typically be used for hiding content  or showing
a loading spinner in a coordinated way across different elements until all are in a representative state. Only used when 
the `dynamic` flag is set. Similarly to `onInitTypeset`, this callback also fires on initial typesetting. If the `dynamic`
is not set, this callback is effectively reduced to having the same effect as `onInitTypeset`. When the `dynamic` flag is
set, this callback runs after every typesetting, which takes place on every render if `renderMode` is set to `post`, and 
when the `text` prop changes when `renderMode` is set to `pre`.

**Default**: `undefined`

### `text: string | undefined` ###

*Required* and *only* used when `renderMode` is set to `pre`. Should be the math string to convert without any delimiters.
Requires `typesettingOptions` to be set and version to be `3`. If `renderMode` is `post`, this property is ignored.

**Default**: `undefined`

### `dynamic: boolean | undefined` ###

Indicates whether the content of the `MathJax` component may change after initial rendering. When set to `true`,
typesetting should be done repeatedly (every render with `renderMode` set to `post` and whenever the
`text` property changes with `renderMode` set to `pre`). With this property set to `false`, only initial typesetting will
take place and any changes of the content will not get typeset.

**Default**: `false`

***

***Any additional props will be spread to the root element of the `MathJax` component which is a `span` with `display`
set to `inline` when the `inline` property is set to `true`, otherwise `block`. The `display` can be overriden via
`style` or `className` props if needed (then the `inline` property does not affect the wrapper). A ref is not possible to set
as this functionality is used by the `MathJax` component itself.***

## Custom use of MathJax directly ##
You can use the underlying MathJax object directly (not through the `MathJax` component) if you want as well. The
following snippet illustrates how to use `MathJaxBaseContext` to accomplish this.

    // undefined or MathJaxSubscriberProps with properties version, hideUntilTypeset, renderMode, typesettingOptions and promise
    const mjContext = useContext(MathJaxBaseContext)
    if(mjContext)
      mjContext.promise.then(mathJaxObject => { // do work with the MathJax object here })

This requires only a `MathJaxContext`, supplying the `MathJaxBaseContext`, to be in the hierarchy. The object passed from the `promise` property is the MathJax
object for the version in use.

Sandbox example: https://codesandbox.io/s/better-react-mathjax-custom-example-latex-e5kym

## Fighting flashes of non-typeset content ##
Using MathJax, as is, is as seen from the basic examples above fairly simple, but the real challenge is to use it in a way
so that the user doesn't see flashes of non-typeset content. Apart from making MathJax available to React in a simple and 
straightforward way, this is what this library focuses on.

### Static content ###
Static content does not have the `dynamic` property set to `true` and is typeset once only when the component mounts. If the
component remounts, the procedure repeats. Before the content is typeset, the user may see the raw content which might be 
a negative experience. There are several ways to solve this:
* Set `hideUntilTypeSet` to `first` on individual `MathJax` components or on the `MathJaxContext`.
* Coordinate hiding with `onInitTypeset` to show bigger blocks or the entire page once all `MathJax` components
have finished the initial typesetting. Coordinate with `MathJaxContext` via the `onStartUp` or `onLoad` callback.
  
### Dynamic content ###
Dynamic content might be harder to work with since it, per definition, updates several times during the time a `MathJax` 
component is mounted. With this goal, the `dynamic` property should be set to `true` which implies that typesetting will
be attempted repeatedly (after every render if `renderMode` is set to `post` and when the `text` property changes
if `renderMode` is set to `pre`). If not handled correctly, updates might look bad to the user if the content is
visible before typesetting. As indicated above in the "Under the hood" section, this should usually not happen since MathJax 
typesets the content in a layout effect. However, MathJax typesets content asynchronously and there might be occasions 
where the typesetting takes place after the browsers has already updated. This might happen if you have a lot of math on 
a page for example. Apart from the general considerations below, there are a few strategies to try in order to solve 
this problem. 

**Note**: these measures should only be taken to battle flashes of non-typeset content where
proven necessary. 

* Set `hideUntilTypeset` to `every`. This might result in a short blink instead but may be a preferable option in some cases
than to show content that is not typeset. Try to put your `MathJax` components outside of parents that often rerender to
  avoid unnecessary rerenderings (and accompanying blinking).
* Set `renderMode` to `pre`. With this mode, the `MathJax` component typesets the math content **before** inserting it into
the DOM which should remove any flashes of non-typeset content in some scenarios, however not in all as indicated below. One 
downside with this setting is that MathJax cannot access the context of the math and so it cannot adapt generated content
to it; manual fine-tuning might be necessary even though this is not always the case.
  
### General considerations regarding flashes of non-typeset content ###

* Currently, MathJax version 3 might give rise to subtle flickering in both Chrome and Safari on dynamic updates. 
  This is not connected to this package and does not seem to be related to the actual typesetting but how the CSS is 
  injected into and applied by the browser. Alas, flickering may in some cases be visible despite described methods. 
  In this case, the remedy is to use version 2, where seamless typesetting is still possible in all attempted browsers.
  Note that this kind of flickering is not a flash of non-typeset content but merely some styling adjustment that is done
  after typesetting.
* The best cross-browser experience for normal use cases at this time is achieved with version 2, with disabled 
  `fast-preview` and `processSectionDelay` set to `0` for a smooth experience. This is done by including 
  `"fast-preview": { disabled: true }` in the MathJax config object given to the `MathJaxContext` and adding 
  `mathJax => mathJax.Hub.processSectionDelay = 0` as the `onStartup` callback to the same. Coordinate initial typesetting 
  with `hideUntilTypeset` set to `first`  and / or `onInitTypeset` callbacks. Feel free to check out Example 7
  above where this is shown, but remember, don't use it if you dont need to.

## General Considerations (don't skip) ##

* **Don't** nest `MathJax` components since this will result in the same math content being typeset multiple times by
  different `MathJax` components. This is unnecessary work.

* React has an [unresolved issue](https://github.com/facebook/react/issues/20891) with DOM nodes with mixed literal and 
  expression content, such as `<div> This is literal and { "this is in an expression" }</div>`, when used together with 
  DOM manipulation via refs. For this reason, when the `dynamic` property is set to `true`, always make sure that the 
  expression containing math is not mixed with literal content. The following list summarizes this:
  
  * **Don't**: `<p>An example is the equation ${num}x^4 = 100$</p>` (expression with math not in separate element nor expression)
  * **Don't**: `<p>An example is the equation { "$${num}x^4 = 100$" }</p>` (expression with math not in separate element)
  * **Don't**: `<p>An example is the equation <span>${num}x^4 = 100$</span></p>` (expression with math not in separate expression - mixed inside `span`)
  * **Don't**: `<p>An example is the equation <span> { "$${num}x^4 = 100$" }</span></p>` (expression with math not in separate element - note the space in the beginning of the `span`)  
  * **Do**: `<p>{ "An example is the equation $${num}x^4 = 100$" }</p>` (expression with math in separate element and expression)
  * **Do**: `<p>An example is the equation <span>{ "$${num}x^4 = 100$" }</span></p>` (expression with math in separate element and expression)
    
  For static content, this does not matter since it is the interplay between how React handles updates to this content and
  the manipulation of the same via refs that causes problems.
  
* **Don't** wrap any content that may rerender on its own. State changes must come from outside the wrapping `MathJax` 
  component; if only its children rerender but not the parent `MathJax` component, math will not be typeset anew. 
  If you have this situation, simply wrap smaller portions of math content in `MathJax` components instead until the state 
  lies outside all `MathJax` components.
  
* In most scenarios, `renderMode` should be set to `post`. Use `pre` when you use dynamic updates and it is 
  crucial that MathJax doesn't typeset all content after every render due to performance reasons, or if you have some 
  other very particular use case when using `post` is causing you problems.

* If you do not achieve the effect you want, play around with what content you wrap in `MathJax` components and where in the
  hierarchy they are kept. You can always replace a larger (more complex) content wrapped in a `MathJax` component with 
  one or several smaller parts of it wrapped in several `MathJax` components.
  
* Remember that MathJax does initial typesetting on the whole document both in version 2 and 3. This can be turned off 
  but with it, a document can be typeset with only a `MathJaxContext` component. This, however, is not the intended use
  of this library and removes many of the additional options.
  
* React doesn't translate all HTML5 entities which can cause problems with MathJax. 
  There are often multiple entities for the same symbol and if your chosen entity gives you problems in MathML, 
  try another one.
  
* The documented API above is only the additional functionality offered in the layer provided by this library. Most 
  other options and behaviours are properties of the MathJax library itself and thus configurable with the `config` 
  object. 
  
## Questions and answers

* **Q:** Is it fine to use multiple `MathJaxContext` components in my app?
  
  **A:** The `MathJaxContext` is stateful and will only download MathJax once, no matter if you use multiple instances
  or unmount and then remount it. Nonetheless, it is more clear from a coding perspective to use a single `MathJaxContext` 
  in your app which is not unmounted during the lifetime of a visit to the application. Therefore, it is recommended to
  wrap your entire app in a `MathJaxContext` and then not use it anywhere else.
* **Q:** I have a lot of math and it takes forever for the math to be typeset, what can I do?

  **A:** This library queues every `MathJax` component as a sequential typesetting update in MathJax. MathJax can typeset the 
  entire page in no time, but when some of the overhead of typesetting is multiplied many times over, MathJax becomes 
  slower. To solve this, consider using fewer `MathJax` components and replace many uses of `MathJax` component with a
  single `MathJax` component wrapping a larger portion of a DOM sub-tree. Then the overhead from typesetting many times  
  over will be less and the typesetting will be faster and smoother. The division of math into different `MathJax` 
  components is ultimately a function of app structure, what parts are updated when, where React state lies and whether
  math content is dynamic or not, but with a lot of math on a page, it is often the case that we may group expressions. 
  Also remember as a general guideline that loading / showing too much content at the same time in an app is bad from
  many perspectives and perhaps considering dividing your app into smaller portions which are not all shown at the 
  same time might be a good idea.
* **Q:** I have only static non-dynamic math, do I have to use `MathJax` components?
  
  **A:** If you haven't configured MathJax to NOT perform typesetting of the whole page on initial load, it will do so and 
  given that all of your math are present on the page at this time, it will be typeset properly. However, depending on
  you app, even if subsequent updates of parts of the page done by React will not insert new math, the old math might
  be rewritten to the page in which case it would need to be typeset again. You can always experiment with only using
  a `MathJaxContext` and rely on initial typesetting to do all the work you need but in general, it is recommended and
  more failsafe to rely on `MathJax` components. 

## Last but not least ... ##
MathJax was not written for use in React and React was not written with MathJax in mind so we have to massage them into
getting along and working in tandem!

## Compatibility ##

Tested with:

* MacOS Catalina 10.15.7:
  *  Firefox 86.0.1 (64-bit)
  *  Chrome 89.0.4389.90 (64-bit)
  *  Safari 14.0.3
  
* Android 9:
  *  Firefox 87.0.0-rc.1
  *  Chrome 89.0.4389.105
  *  Duck Duck Go 5.78.1
  *  Opera 62.3.3146.57763
  *  Edge 46.02.4.5152
  *  Samsung Internet 13.2.3.2
  
* iOS:
  *  Chrome 87.4280.77
  *  Safari 14.4.1
  
* Windows
  *  Firefox 87.0.(64-bit)
  *  Chrome 89.0.4389.90 (64-bit)
  *  Opera 75.0.3969.93
  *  Edge 89.0.774.63 (64-bit)
  

## Wish list ##
(Empty at the moment... Yay!)

Docs
* Clarify how to use the MathJaxContext (should exist ONE and it should not rerender)
* clarify how to deal with very many mathjax components (all in one instead of separate)
  https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
* Fixa exemplet med asciimath där fel delimiters används ( i början av exemplet) och där det funkar ändå...?
* What was the problem when pushing a new version? There was something with Git or was it resolved?
* Ta bort prettier
* Kolla om man kan ladda MathJax2 och 3 parallellt om inte, ta bort informationen i felmeddelande om att det gå samt skriv i docs
* Skriva om varför egentligen `MathJax`-komponenten behövs
Future
* Make package esm modules and release both cjs and mjs, not really needed since tree-shaking is not needed here
* Investigate custom adaptor:
  On the one hand, I suspect creating a custom MathJax adaptor (cf. https://github.com/mathjax/MathJax-src/tree/master/ts/adaptors) 
  that can write to react's virtual dom might help in many situations. (MathJax's litedom adaptor is probably fairly close already.)
* Perhaps in the future change so that a hook is used instead of MathJaxContext, this is problematic because 
  then there is no obvious place where we should add the config.


* fix bad example in ascii elaborate example (includes wrong delimiters but works anyways)
## MathJax documentation ##
* Version 3: https://docs.mathjax.org/en/latest/

* Version 2: https://docs.mathjax.org/en/v2.7-latest/

## Github ##

File problems or contribute on Github: https://github.com/fast-reflexes/better-react-mathjax

## Changelog ##
* v. 1.0.0
  * Initial Release
* v. 1.0.1
  * Removed types imported from `@types/mathjax` and `mathjax-full` due to several reasons. Custom type declarations will be supplied instead.
* v. 1.0.2
  * Readded types with custom types for MathJax2 based on `@types/mathjax` and types from `mathjax-full` for MathJax3.
* v. 1.0.3
  * Fixed missing license. 
  * Corrected function signature on `MathJax` component.
  * Updated default MathJax 3 version provided by CDN to using v. 3.2.0. 
  * Updated MathJax 3 types used to v. 3.2.0. 
  * Added content to API documentation on property `src`. 
  * Added installation instructions.
  * Added information about AsciiMath display mode.
  * Corrected typo in API documentation on `version` property.
* v. 2.0.0
  * **Breaking change**: can no longer use  MathJax versions 2 and 3 side by side in different (non-nested) 
    `MathJaxContext`s. It's unclear whether this worked as intended before as well and even though this change is
    breaking, it should not affect many users, if any. Docs have been updated and `MathJaxContext` now throws errors
    if it has been initialized with one version and another `MathJaxContext` (later or simultaneous) has a different
    value on the `version` prop.
  * Added support for hot reload by always setting `dynamic` to `true` when `dynamic` is not explicitly set to `false`
    and process.env.NODE_ENV` is not `production`.
  * Honoring possible style settings of `style.visibility` in `MathJax` component when visibility is not controlled
    by the component itself.
  * Corrected sandbox example with AsciiMath where Latex default delimiter was erroneously used.
  * Improved documentation with clarifications:
    * The entire app should be wrapped in the only `MathJaxContext` that should exist in a project.
    * How to deal with the situation when you have a lot of math on your page.
    * The features available with the default imports from CDN.
  * Added Q & A section to documentation.

## Migration guides

* v1 to v2: 
  * Remove all simultaneous use of MathJax version 2 and 3 in the same app and use only one version of MathJax
    per loaded page. This means that even if you unmount the `MathJaxContext` and then remount it, it must have the
    same version both times. If you load a new page context (e.g. not just change page in a SPA (single-page application))
    the version can be determined anew. If you need to use both versions side by side, file an issue on the project  
    Github page.
* 
## License

This project is licensed under the terms of the
[MIT license](https://github.com/fast-reflexes/better-react-mathjax/blob/master/LICENSE).

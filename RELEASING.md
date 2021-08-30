

<!-- prettier-ignore-start -->

## Create a branch with the exact same name as the version you're releasing and set it to follow the origin ##

`git checkout -b <VERSION>`
`git push -u origin <VERSION>` (creates a new origin branch)

## To make a new build ##

`npm run build`

## To distribute locally ##

* Go to `./build` folder
* Run `npm pack`
* Run `npm install <PATH TO RESULTING TAR>` when used

## To make a new version ##

`npm run release <VERSION on form MAJOR.MINOR.PATCH(-beta)?>`

## To release a new version ##

`npm run upload`

## To remove an existing release

`npm unpublish <PACKAGE>@<VERSION>`

<!-- prettier-ignore-end -->

## Useful links ##

* Good primer on MathML: https://math-it.org/Publikationen/MathML.html
* On HTML math entities: https://www.freeformatter.com/html-entities.html#math-symbols bra mathml

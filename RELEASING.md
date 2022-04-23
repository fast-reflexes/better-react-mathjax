
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

## Create a new version as a series of instructions

1. Do work in the main branch
2. Set package version
3. Run npm scripts `lint`, `test` and `build` to make sure that you have arrived to a code state which is functional 
   correct and with everything in order. Here is also a good place to test the new package by exporting it with 
   `npm package` and install it in some other test app.
4. When you are done, run `npm run release <VERSION on form MAJOR.MINOR.PATCH(-beta)?>`. This will update versions in 
   relevant files to update the version and also create a commit and push the project to Github along with a version 
   tag.
5. Final release the new version on npm repository by running `npm run upload`
6. You're done
## Useful links ##

* Good primer on MathML: https://math-it.org/Publikationen/MathML.html
* On HTML math entities: https://www.freeformatter.com/html-entities.html#math-symbols bra mathml

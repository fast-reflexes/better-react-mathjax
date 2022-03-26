const { promises } = require('fs')

const getContent = component => (
    `{
    "sideEffects": false,
    "module": "../esm/` + component + `/index.js",
    "typings": "./index.d.ts"
}`
)

const addPackageJson = async (dir) => {
    console.log("Writing package.json to build/" + dir)
    await promises.writeFile("build/" + dir + "/package.json", getContent(dir))
}

const processDirectories = async () =>
    (await promises.readdir("build", { withFileTypes: true }))
        .filter(dir => dir.isDirectory())
        .map(async dir => {
            if(dir.name !== "esm")
                await addPackageJson(dir.name)
        })

processDirectories()
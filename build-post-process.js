// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promises} = require("fs")

const getContent = dirParts => {
    const doubleDots = dirParts.map(_ => "..").join("/")
    const esmDir = doubleDots + "/esm/"
    const targetDir = esmDir + dirParts.join("/")
    return (
        `{
    "sideEffects": false,
    "module": "` + targetDir + `/index.js",
    "typings": "./index.d.ts"
}`
    )
}

const addPackageJson = async (dirParts) => {
    const dir = dirParts.join("/")
    console.log("Writing package.json to " + dir)
    await promises.writeFile(dir + "/package.json", getContent(dirParts.slice(1)))
}

const processDirectories = async (dirParts) =>
    (await promises.readdir(dirParts.join("/"), { withFileTypes: true }))
        .filter(dir => dir.isDirectory())
        .map(async dir => {
            if(dir.name !== "esm") {
                const nextDir = [...dirParts, dir.name]
                await addPackageJson(nextDir)
                await processDirectories(nextDir)
            }
        })

processDirectories(["build"])

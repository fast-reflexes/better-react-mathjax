const enclose = (inp: string, encloser: string) => `${encloser}${inp}${encloser}`

export const toLatex = (inp: string) => enclose(inp, "$")
export const toLatexBlock = (inp: string) => enclose(inp, "$$")

import ts from "typescript"
import { ProgramOptions } from "./options"
import { removeOneExt, extractTsScriptPart } from "./util"

export function createCompilerHost(options: ts.CompilerOptions, programOptions: ProgramOptions): ts.CompilerHost {
    const defaultHost = ts.createCompilerHost(options)
    if (programOptions.enableVueSupport) {
        return {
            ...defaultHost,
            fileExists,
            readFile,
            getSourceFile, // must override this, the default one locks on to the default readFile
        }
    }
    return defaultHost

    function fileExists(fileName: string): boolean {
        if (fileName.endsWith(".vue.ts")) {
            const vueName = removeOneExt(fileName)
            return ts.sys.fileExists(vueName)
        }
        return ts.sys.fileExists(fileName)
    }

    function readFile(fileName: string): string {
        if (fileName.endsWith(".vue.ts")) {
            const vueName = removeOneExt(fileName)
            let contents = ts.sys.readFile(vueName)
            contents = extractTsScriptPart(contents, ts.sys.newLine)

            return contents
        }
        return ts.sys.readFile(fileName)
    }

    function getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) {
        let text: string
        try {
            text = readFile(fileName)
        } catch (e) {
            console.log("catch: " + e)
            if (onError && e instanceof Error) {
                onError(e.message)
            }
            text = ""
        }
        return text !== undefined ? ts.createSourceFile(fileName, text, languageVersion) : undefined
    }
}
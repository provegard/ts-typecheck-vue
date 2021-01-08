import ts from "typescript"
import { ProgramOptions } from "./options"
import { removeOneExt } from "./util"

function tweakFileName(d: ts.Diagnostic): ts.Diagnostic {
    if (d.file && d.file.fileName.endsWith(".vue.ts")) {
        d.file.fileName = removeOneExt(d.file.fileName)
    }
    return d
}

export function createDiagnosticsReporter(host: ts.FormatDiagnosticsHost, options: ProgramOptions): (diag: ts.Diagnostic[]) => string {
    const formatter = options.pretty
        ? ts.formatDiagnosticsWithColorAndContext
        : ts.formatDiagnostics

    return (diagnostics) => {
        const withTweakedFileName = diagnostics.map(tweakFileName)
        return formatter(withTweakedFileName, host)
    }
}
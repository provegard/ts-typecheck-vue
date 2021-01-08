import { expect } from "chai"
import ts from "typescript"
import { createCompilerHost } from "../../src/compiler-host"
import { ProgramOptions } from "../../src/options"
import { createDiagnosticsReporter } from "../../src/reporter"

describe("reporters", () => {
    describe("diagonstics reporter", () => {
        it("formats a diagnostic without pretty", () => {
            const options: ProgramOptions = {
                pretty: false,
                tsconfigPath: "tsconfig.json",
            }
            const host = createCompilerHost({}, options)
            const diag = createDiag(host, "test/unit/example.ts")
            const reporter = createDiagnosticsReporter(host, options)
            const result = reporter([diag])

            expect(result).to.include("test/unit/example.ts(1,1): error TS1000: Not good")
        })

        it("formats a diagnostic with pretty", () => {
            const options: ProgramOptions = {
                pretty: true,
                tsconfigPath: "tsconfig.json",
            }
            const host = createCompilerHost({}, options)
            const diag = createDiag(host, "test/unit/example.ts")
            const reporter = createDiagnosticsReporter(host, options)
            const result = reporter([diag])

            expect(result).to.include("\u001b[96mtest/unit/example.ts")
        })

        it("rewrites .vue.ts to .vue", () => {
            const options: ProgramOptions = {
                pretty: false,
                tsconfigPath: "tsconfig.json",
                enableVueSupport: true,
            }
            const host = createCompilerHost({}, options)
            const diag = createDiag(host, "test/unit/example-sfc.vue.ts")
            const reporter = createDiagnosticsReporter(host, options)
            const result = reporter([diag])

            expect(result).to.include("test/unit/example-sfc.vue(1,1): error TS1000: Not good")
        })
    })
})

function createDiag(host: ts.CompilerHost, path: string): ts.Diagnostic {
    return {
        category: ts.DiagnosticCategory.Error,
        file: getSourceFile(host, path),
        code: 1000,
        start: 0,
        length: 6,
        messageText: "Not good",
    }
}

function getSourceFile(host: ts.CompilerHost, path: string): ts.SourceFile {
    return host.getSourceFile(path, ts.ScriptTarget.ES2015)
}
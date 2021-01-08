import { expect } from "chai"
import ts from "typescript"
import { createCompilerHost } from "../../src/compiler-host"
import { ProgramOptions } from "../../src/options"

describe("compiler host", () => {
    it("returns a default host if Vue support is disabled", () => {
        const options: ProgramOptions = {
            enableVueSupport: false,
        }
        const compilerOptions: ts.CompilerOptions = {}
        const host = createCompilerHost(compilerOptions, options)

        expect(host.fileExists("test/unit/example-sfc.vue.ts")).to.be.false
    })

    describe("when Vue support is enabled", () => {
        let host: ts.CompilerHost
        beforeEach(() => {
            const options: ProgramOptions = {
                enableVueSupport: true,
            }
            const compilerOptions: ts.CompilerOptions = {}
            host = createCompilerHost(compilerOptions, options)
        })

        it("finds a Vue file when TypeScript asks for it using .vue.ts extension", () => {
            expect(host.fileExists("test/unit/example-sfc.vue.ts")).to.be.true
        })

        it("finds a regular TS file as well", () => {
            expect(host.fileExists("test/unit/example.ts")).to.be.true
        })

        it("extract TS contents from a Vue file", () => {
            const contents = host.readFile("test/unit/example-sfc.vue.ts")
            expect(contents).to.include("export default class Foo")
        })

        it("doesn't include non-TS contents in a Vue file", () => {
            const contents = host.readFile("test/unit/example-sfc.vue.ts")
            expect(contents).not.to.include("<p>")
        })

        it("reads contents from a regular file", () => {
            const contents = host.readFile("test/unit/example.ts")
            expect(contents).to.include("export const foo")
        })

        it("can get a source file from a Vue file", () => {
            const sf = host.getSourceFile("test/unit/example-sfc.vue.ts", ts.ScriptTarget.ES2015)
            expect(sf.text).to.include("class Foo")
        })
    })
})
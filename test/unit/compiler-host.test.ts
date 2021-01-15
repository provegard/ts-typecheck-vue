import ts from "typescript"
import "jest-extended"
import { createCompilerHost } from "../../src/compiler-host"
import { ProgramOptions } from "../../src/options"

describe("compiler host", () => {
    test("returns a default host if Vue support is disabled", () => {
        const options: ProgramOptions = {
            enableVueSupport: false,
            tsconfigPath: "foo",
        }
        const compilerOptions: ts.CompilerOptions = {}
        const host = createCompilerHost(compilerOptions, options)

        expect(host.fileExists("test/unit/example-sfc.vue.ts")).toBe(false)
    })

    describe("when Vue support is enabled", () => {
        let host: ts.CompilerHost
        beforeEach(() => {
            const options: ProgramOptions = {
                enableVueSupport: true,
                tsconfigPath: "foo",
            }
            const compilerOptions: ts.CompilerOptions = {}
            host = createCompilerHost(compilerOptions, options)
        })

        test("finds a Vue file when TypeScript asks for it using .vue.ts extension", () => {
            expect(host.fileExists("test/unit/example-sfc.vue.ts")).toBe(true)
        })

        test("finds a regular TS file as well", () => {
            expect(host.fileExists("test/unit/example.ts")).toBe(true)
        })

        test("extract TS contents from a Vue file", () => {
            const contents = host.readFile("test/unit/example-sfc.vue.ts")
            expect(contents).toInclude("export default class Foo")
        })

        test("doesn't include non-TS contents in a Vue file", () => {
            const contents = host.readFile("test/unit/example-sfc.vue.ts")
            expect(contents).not.toInclude("<p>")
        })

        test("reads contents from a regular file", () => {
            const contents = host.readFile("test/unit/example.ts")
            expect(contents).toInclude("export const foo")
        })

        test("can get a source file from a Vue file", () => {
            const sf = host.getSourceFile("test/unit/example-sfc.vue.ts", ts.ScriptTarget.ES2015)
            expect(sf.text).toInclude("class Foo")
        })
    })
})
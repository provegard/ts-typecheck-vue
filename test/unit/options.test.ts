import "jest-extended"
import { createOptions } from "../../src/options"

describe("options", () => {
    describe("createOptions", () => {
        test("enables Vue support by default", () => {
            const opts = createOptions({ tsconfigPath: "foo" })
            expect(opts.enableVueSupport).toBe(true)
        })

        test("keeps enableVueSupport=false", () => {
            const opts = createOptions({ tsconfigPath: "foo", enableVueSupport: false })
            expect(opts.enableVueSupport).toBe(false)
        })

        test("sets a default value for pretty", () => {
            const opts = createOptions({ tsconfigPath: "foo" })
            expect(opts.pretty).toBeBoolean()
        })

        test("keeps pretty=false", () => {
            const opts = createOptions({ tsconfigPath: "foo", pretty: false })
            expect(opts.pretty).toBe(false)
        })

        test("keeps tsconfigPath", () => {
            const opts = createOptions({ tsconfigPath: "foo" })
            expect(opts.tsconfigPath).toBe("foo")
        })
    })
})
import { expect } from "chai"
import { createOptions } from "../../src/options"

describe("options", () => {
    describe("createOptions", () => {
        it("enables Vue support by default", () => {
            const opts = createOptions({})
            expect(opts.enableVueSupport).to.be.true
        })

        it("keeps enableVueSupport=false", () => {
            const opts = createOptions({ enableVueSupport: false })
            expect(opts.enableVueSupport).to.be.false
        })

        it("sets a default value for pretty", () => {
            const opts = createOptions({})
            expect(opts.pretty).to.be.a("Boolean")
        })

        it("keeps pretty=false", () => {
            const opts = createOptions({ pretty: false })
            expect(opts.pretty).to.be.false
        })

        it("keeps tsconfigPath", () => {
            const opts = createOptions({ tsconfigPath: "foo" })
            expect(opts.tsconfigPath).to.equal("foo")
        })
    })
})
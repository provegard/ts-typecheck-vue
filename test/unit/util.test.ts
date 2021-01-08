import "mocha"
import { expect } from "chai"
import { EOL } from "os"

import { extractTsScriptPart, parseAttrs, removeOneExt, trimQuotes } from "../../src/util"

describe("utils", () => {
    describe("removeOneExt", () => {
        it("removes an extension", () => {
            const actual = removeOneExt("foo.log")
            expect(actual).to.equal("foo")
        })
        
        it("ignores a file name without extension", () => {
            const actual = removeOneExt("foo")
            expect(actual).to.equal("foo")
        })

        it("only removes _one_ extension", () => {
            const actual = removeOneExt("foo.bar.baz")
            expect(actual).to.equal("foo.bar")
        })
    })

    describe("extractTsScriptPart", () => {
        it("extracts TS code and leaves the remainder blank", () => {

            const input = `<template>
</template>
<script lang="ts">
export default class Foo {}
</script>
<style>
</style>`

            const expected = `


export default class Foo {}


`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).to.equal(expected)
        })

        it("supports single-quotes for lang='ts'", () => {

            const input = `<script lang='ts'>
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).to.equal(expected)
        })

        it("supports no quotes for lang=ts", () => {

            const input = `<script lang=ts>
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).to.equal(expected)
        })

        it("ignores additional script attributes", () => {

            const input = `<script setup lang="ts">
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).to.equal(expected)
        })

        it("extracts multiple TS script blocks", () => {

            const input = `<template>
</template>

<script setup lang="ts">
const x = 0
</script>

<script lang="ts">
export default class Foo {}
</script>

<style>
</style>`

            const expected = `



const x = 0



export default class Foo {}



`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).to.equal(expected)
        })

    })

    describe("trimQuotes", () => {
        it("trims regular quotes", () => {
            expect(trimQuotes('"foo"')).to.equal("foo")
        })

        it("trims single quotes", () => {
            expect(trimQuotes("'foo'")).to.equal("foo")
        })
    })

    describe("parseAttrs", () => {
        it("parses key=value", () => {
            expect(parseAttrs("key=value")).to.eql({
                key: "value",
            })
        })

        it("parses key only", () => {
            expect(parseAttrs("key")).to.eql({
                key: "",
            })
        })

        it("parses quoted attribute", () => {
            expect(parseAttrs('key="value"')).to.eql({
                key: "value",
            })
        })
    })
})
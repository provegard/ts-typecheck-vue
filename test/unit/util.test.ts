import { EOL } from "os"

import { extractTsScriptPart, parseAttrs, removeOneExt, trimQuotes } from "../../src/util"

describe("utils", () => {
    describe("removeOneExt", () => {
        test("removes an extension", () => {
            const actual = removeOneExt("foo.log")
            expect(actual).toBe("foo")
        })
        
        test("ignores a file name without extension", () => {
            const actual = removeOneExt("foo")
            expect(actual).toBe("foo")
        })

        test("only removes _one_ extension", () => {
            const actual = removeOneExt("foo.bar.baz")
            expect(actual).toBe("foo.bar")
        })
    })

    describe("extractTsScriptPart", () => {
        test("extracts TS code and leaves the remainder blank", () => {

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
            expect(actual).toBe(expected)
        })

        test("supports single-quotes for lang='ts'", () => {

            const input = `<script lang='ts'>
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).toBe(expected)
        })

        test("supports no quotes for lang=ts", () => {

            const input = `<script lang=ts>
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).toBe(expected)
        })

        test("ignores additional script attributes", () => {

            const input = `<script setup lang="ts">
export default class Foo {}
</script>`

            const expected = `
export default class Foo {}
`

            const actual = extractTsScriptPart(input, EOL)
            expect(actual).toBe(expected)
        })

        test("extracts multiple TS script blocks", () => {

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
            expect(actual).toBe(expected)
        })

    })

    describe("trimQuotes", () => {
        test("trims regular quotes", () => {
            expect(trimQuotes('"foo"')).toBe("foo")
        })

        test("trims single quotes", () => {
            expect(trimQuotes("'foo'")).toBe("foo")
        })
    })

    describe("parseAttrs", () => {
        test("parses key=value", () => {
            expect(parseAttrs("key=value")).toEqual({
                key: "value",
            })
        })

        test("parses key only", () => {
            expect(parseAttrs("key")).toEqual({
                key: "",
            })
        })

        test("parses quoted attribute", () => {
            expect(parseAttrs('key="value"')).toEqual({
                key: "value",
            })
        })
    })
})
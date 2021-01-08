// Removes the last extension of the file name. If there are multiple extensions, only the last one is removed.
export function removeOneExt(fileName: string): string {
    const p = fileName.lastIndexOf(".")
    return p >= 0 ? fileName.substr(0, p) : fileName
}

const ScriptStartLineRegExp = /^<script([^>]*)>$/

// Checks if a source line is a script start tag with language "ts"
function isScriptStartLine(line: string): { result: boolean, attrs: string } {
    const m = line.toLowerCase().trim().match(ScriptStartLineRegExp)
    return {
        result: Boolean(m),
        attrs: m?.[1] ?? "",
    }
}

// Checks if a source line is a script end tag
function isScriptEndLine(line: string): boolean {
    return line.toLowerCase().trim() === "</script>"
}

const QuoteRegExp = /["'](.*)["']/
export function trimQuotes(s: string): string {
    const m = s.match(QuoteRegExp)
    return Boolean(m)
        ? m[1]
        : s
}

export function parseAttrs(attrs: string): Record<string, string> {
    return attrs
        .split(/\s+/)
        .reduce((acc, attr) => {
            const [key, value] = attr.split("=")
            acc[key] = trimQuotes(value ?? "")
            return acc
        }, {})
}

function isTsScript(attrs: string) {
    const parsed = parseAttrs(attrs)
    return parsed["lang"] === "ts"
}

// Extracts the code between <script lang="ts"> and </script>.
// This function assumes that there's no code on the script tag lines themselves.
export function extractTsScriptPart(contents: string, newLine: string): string {
    const lines = contents.split(newLine)
    const emitted = []
    let inTsPart = false
    for (const line of lines) {
        let emit = ""
        if (inTsPart) {
            if (isScriptEndLine(line)) {
                inTsPart = false
            } else {
                emit = line
            }
        } else {
            const { result, attrs } = isScriptStartLine(line)
            if (result && isTsScript(attrs)) {
                inTsPart = true
            }
            // no emit here - assumes there's no content after the <script> tag on the same line
        }
        emitted.push(emit)
    }
    return emitted.join(newLine)
}
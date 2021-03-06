import ts from "typescript"

export interface ProgramOptions {
    tsconfigPath: string
    enableVueSupport?: boolean
    pretty?: boolean
}

function defaultIsPretty(sys: ts.System): boolean {
    return Boolean(sys.writeOutputIsTTY) && Boolean(sys.writeOutputIsTTY())
}

export function createOptions(inputOptions: ProgramOptions): ProgramOptions {
    return {
        enableVueSupport: true,
        pretty: defaultIsPretty(ts.sys),
        ...inputOptions,
    }
}
import * as process from "process"
import { readFile } from "fs/promises"
import { Reader } from "./Reader"
import { ExitInterface } from "./exitInterface"

const G_PATH_IN: string = process.env.PATH_IN!
const G_PATH_OUT: string = process.env.PATH_OUT!


class Parser {
    private exitData: ExitInterface[] = []

    constructor(
        private path_in: string,
        private path_out: string,
    ) {
        this.start()
            .catch((err: string) => console.error(err))
            .finally(() => console.log("===> Parse finally"))
    }

    async start() {
        const L_data: string = await readFile(this.path_in, "utf8")
        const L_lines: string[] = Reader.splitIntoLines(L_data)

        this.exitData = Reader.itemsSubBlock(L_lines, this.exitData)
        this.exitData = Reader.weightSubBlock(L_lines, this.exitData)
        this.exitData = Reader.locationSubBlock(L_lines, this.exitData)
        this.exitData = Reader.contactSubBlock(L_lines, this.exitData)
        this.exitData = Reader.docSubBlock(L_lines, this.exitData)

        console.log(this.exitData)
    }
}

const parser = new Parser(G_PATH_IN, G_PATH_OUT)
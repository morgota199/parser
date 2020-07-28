import * as process from "process"
import * as fs from "fs"
import { Parser as json2csv } from "json2csv"
import { writeFile as write, utils } from "xlsx"
import { Reader } from "./Reader"
import { ExitInterface } from "./exitInterface"
import "colors"

const G_PATH_IN: string = process.argv[2]
const G_PATH_OUT: string = process.argv[3]


class Parser {
    private exitData: ExitInterface[] = []

    constructor(
        private path_in: string,
        private path_out: string,
    ) {
        console.log("===> Parse start".green,
            "\n===> Input file on path: ".yellow, this.path_in,
            "\n===> Output file on path: ".yellow, this.path_out)
        this.start()
            .catch((err: string) => console.error(err.red))
    }

    async start() {
        const L_data: string = await fs.promises.readFile(this.path_in, "utf8")
        const L_lines: string[] = Reader.splitIntoLines(L_data)

        this.exitData = Reader.itemsSubBlock(L_lines, this.exitData)
        this.exitData = Reader.weightSubBlock(L_lines, this.exitData)
        this.exitData = Reader.locationSubBlock(L_lines, this.exitData)
        this.exitData = Reader.contactSubBlock(L_lines, this.exitData)
        this.exitData = Reader.docSubBlock(L_lines, this.exitData)

        await this.selectorFilesTypes()
    }

    async selectorFilesTypes() {
        if(this.path_out.indexOf(".csv") !== -1)
            return  this.makeCsv(this.exitData)

        if(this.path_out.indexOf(".xls") !== -1)
            return this.makeXls(this.exitData)

        return console.error("===> ERROR: Incorrect file extension".red)
    }

    async makeCsv (data: ExitInterface[]) {
        const L_parse = new json2csv()
        const L_csv = L_parse.parse(data)

        await fs.promises.writeFile(this.path_out, L_csv)

        return console.log("===> Parse finally on file".green, this.path_out)
    }

    async makeXls (data: ExitInterface[]) {
        const L_xls = utils.book_new()
        const L_data = utils.json_to_sheet(data)

        utils.book_append_sheet(L_xls, L_data)

        await write(L_xls, this.path_out)

        return console.log("===> Parse finally success full".green)
    }
}

const parser = new Parser(G_PATH_IN, G_PATH_OUT)
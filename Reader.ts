import { ExitInterface } from "./exitInterface"

export class Reader {
    static splitIntoLines(text: string) {
        return text.split("\n")
    }

    static itemsSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id: number = 1

        for(const line in allLines){
            if(allLines[line].indexOf("ITEM") !== -1) {
                exitData.push({
                    _id: L_id,
                    item: +Reader.parameterFromTag(allLines[+line - 1]),
                    item_num: +Reader.parameterFromTag(allLines[+line + 1]),
                    city: "",
                    republic: "",
                    index: 0,
                    doc: "",
                    weight: 0,
                    contact: ""
                })
                L_id += 1
            }
        }

        return exitData
    }

    static weightSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const line in allLines) {
            if(allLines[line].indexOf("KG") !== -1)
                exitData[+L_id - 1].weight = +Reader.parameterFromTag(allLines[+line - 1])

            if(allLines[line].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static locationSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const line in allLines) {
            if(allLines[line].indexOf("KG") !== -1) {
                exitData[+L_id - 1].index = +Reader.parameterFromTag(allLines[+line - 3])
                exitData[+L_id - 1].republic = (
                    Reader.parameterFromTag(allLines[+line - 5]) +
                    " " + Reader.parameterFromTag(allLines[+line - 4])
                )
                exitData[+L_id - 1].city = Reader.parameterFromTag(allLines[+line - 6])
            }

            if(allLines[line].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static contactSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const line in allLines) {
            if(allLines[line].indexOf("KG") !== -1) {
                exitData[+L_id - 1].contact = (
                    Reader.parameterFromTag(allLines[+line + 2]) +
                    " " + Reader.parameterFromTag(allLines[+line + 3]) +
                    " " + Reader.parameterFromTag(allLines[+line + 4])
                )
            }

            if(allLines[line].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static docSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const line in allLines) {
            if(allLines[line].indexOf("KG") !== -1) {
                exitData[+L_id - 1].doc = Reader.parameterFromTag(allLines[+line - 2])
            }

            if(allLines[line].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static parameterFromTag(line: string): string {
        if(!line && line !== "CONTACT:") return ""

        return line.split(">", 2)[1]
            .split("</", 2)[0]
    }

    static findById(id: number, exitData: ExitInterface[]) {
        return exitData.filter(block => block._id === id)[0]
    }
}
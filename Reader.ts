import { ExitInterface } from "./exitInterface"

export class Reader {
    static splitIntoLines(text: string) {
        return text.split("\n")
    }

    static itemsSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id: number = 1

        for(const L_lineIndex in allLines){
            if(allLines[L_lineIndex].indexOf("ITEM") !== -1) {
                exitData.push({
                    _id: L_id,
                    item: +Reader.parameterFromTag(allLines[+L_lineIndex - 1]),
                    item_num: +Reader.parameterFromTag(allLines[+L_lineIndex + 1]),
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

        for(const L_lineIndex in allLines) {
            if(allLines[L_lineIndex].indexOf("KG") !== -1)
                exitData[+L_id - 1].weight = +Reader.parameterFromTag(allLines[+L_lineIndex - 1])

            if(allLines[L_lineIndex].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static locationSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const L_lineIndex in allLines) {
            if(allLines[L_lineIndex].indexOf("KG") !== -1) {
                exitData[+L_id - 1].index = +Reader.parameterFromTag(allLines[+L_lineIndex - 3])
                exitData[+L_id - 1].republic = (
                    Reader.parameterFromTag(allLines[+L_lineIndex - 5]) +
                    " " + Reader.parameterFromTag(allLines[+L_lineIndex - 4])
                )
                exitData[+L_id - 1].city = Reader.parameterFromTag(allLines[+L_lineIndex - 6])
            }

            if(allLines[L_lineIndex].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static contactSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const L_lineIndex in allLines) {
            if(allLines[L_lineIndex].indexOf("KG") !== -1) {
                exitData[+L_id - 1].contact = (
                    Reader.parameterFromTag(allLines[+L_lineIndex + 2]) +
                    " " + Reader.parameterFromTag(allLines[+L_lineIndex + 3]) +
                    " " + Reader.parameterFromTag(allLines[+L_lineIndex + 4])
                )
            }

            if(allLines[L_lineIndex].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static docSubBlock(allLines: string[], exitData: ExitInterface[]) {
        let L_id = 0

        for(const L_lineIndex in allLines) {
            if(allLines[L_lineIndex].indexOf("KG") !== -1) {
                exitData[+L_id - 1].doc = Reader.parameterFromTag(allLines[+L_lineIndex - 2])
            }

            if(allLines[L_lineIndex].indexOf("ITEM") !== -1)
                L_id += 1
        }

        return exitData
    }

    static parameterFromTag(line: string): string {
        if(!line && line !== "CONTACT:")
            return ""

        return line.split(">", 2)[1]
            .split("</", 2)[0]
    }
}
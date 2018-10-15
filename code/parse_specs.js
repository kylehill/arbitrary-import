const parse = require("csv-parse/lib/sync")

module.exports = (files, callback) => {
    const specs = files.reduce((mem, file) => {
        mem[file.format] = parse(file.content.join("\n"), { columns: true })
        return mem
    }, {})

    callback(null, specs)
}

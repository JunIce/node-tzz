export function idArray2String(ids) {
    let id_array = []
    for(let info of ids) {
        id_array.push(info.id)
    }
    return id_array.join(',')
}
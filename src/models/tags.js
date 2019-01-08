import DB from './db'

export default class Tag extends DB {
    constructor() {
        super()
    }

    //list
    getRecommendTags() {
        this.connection.then(async con => {
            let sql = `select id,title,titleurl,titlepic from ${this.prefix}ecms_photo order by id desc limit ${pageSize}, ${page*pageSize}`
            let res = await con.query(sql)
            console.log(res)
        })
    }
}
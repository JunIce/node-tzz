import DB from './db'

export default class Photo extends DB {
    constructor() {
        super()
    }

    //list
    getList(page=1,pageSize=20) {
        this.connection.then(async con => {
            let sql = `select id,title,titleurl,titlepic from ${this.prefix}ecms_photo order by id desc limit ${pageSize}, ${page*pageSize}`
            let res = await con.query(sql)
            console.log(res)
        })
    }
}
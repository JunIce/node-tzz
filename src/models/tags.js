import DB from './db'

export default class Tag extends DB {
    constructor() {
        super()
    }
    //recommend-tags
    async getRecommendTags() {
        let sql = `select tagid,tagname from ${this.prefix}enewstags where isgood > 0 order by myorder asc`
        return await this.query(sql)
    }

    // taginfo
    async getTagDetail(tagid) {
        let sql = `select tagname,tagid from ${this.prefix}enewstags where tagid = ${tagid} limit 1`
        return await this.query(sql)
    }

    // get list by tagid
    async tagsList(tagid, page=1, pageSize=30) {
        let sql = `select id from ${this.prefix}enewstagsdata where tagid = ${tagid} order by newstime desc limit ${pageSize},${pageSize*page}`
        return await this.query(sql)
    }

}
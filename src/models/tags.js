import DB from './db'

export default class Tag extends DB {
    constructor() {
        super()
    }

    /**
     * 获取推荐标签
     */
    async getRecommendTags() {
        let sql = `select tagid,tagname from ${this.prefix}enewstags where isgood > 0 order by myorder asc`
        return await this.query(sql)
    }

    /**
     * 
     * @param {int} tagid 
     */
    async getTagDetail(tagid) {
        let sql = `select tagname,tagid from ${this.prefix}enewstags where tagid = ${tagid} limit 1`
        return await this.query(sql)
    }

    /**
     * 
     * @param {int} tagid 
     * @param {int} page 
     * @param {int} pageSize 
     */
    async tagsList(tagid, page=1, pageSize=24) {
        let sql = `select id from ${this.prefix}enewstagsdata where tagid = ${tagid} order by newstime desc limit ${pageSize*page}, ${pageSize}`
        console.log(sql)
        return await this.query(sql)
    }

    /**
     * 
     * @param {int} photo_id 
     */
    async getTagsByPhotoId(photo_id) {
        let sql =   `select
                        tagid, tagname 
                    from 
                        ${this.prefix}enewstags
                    where tagid in (
                        select tagid from ${this.prefix}enewstagsdata where id = ${photo_id}
                    ) order by tagid desc`
        return await this.query(sql)
    }
}
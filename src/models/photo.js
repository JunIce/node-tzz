import DB from './db'
import User from './user'

export default class Photo extends DB {
    constructor() {
        super()
    }

    /**
     * 
     * @param {int} page 
     * @param {int} pageSize 
     */
    async getList(page=1,pageSize=20) {
        let sql = `select id,title,titleurl,titlepic from ${this.prefix}ecms_photo order by id desc limit ${pageSize}, ${page*pageSize}`;
        return await this.query(sql);
    }

    /**
     * get photo lists by id string
     * @param {string} idString  1,2,3,4
     */
    async getListByIdString(idString) {
        let sql = `select id,title,titleurl,titlepic from ${this.prefix}ecms_photo where id in (${idString}) order by id desc`;
        return await this.query(sql);
    }

    /**
     * 
     * @param {int} id 
     */
    async getInfoDetail(id) {
        let sql = `select id,userid,title,newstime,favanum,titlepic,photoimg from ${this.prefix}ecms_photo where id = ${id} limit 1`;
        let info = await this.query(sql);
        let user = new User;
        let userInfo = await user.getUserInfo(info[0].userid);
        return {
            info: info[0],
            user: userInfo[0]
        }
    }
}
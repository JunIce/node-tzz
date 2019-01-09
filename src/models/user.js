import DB from './db'

export default class User extends DB {
    constructor() {
        super()
    }

    /**
   *
   * @param {int} userid
   */
    async getUserInfo(userid) {
        let sql = `select a.userid,a.username,b.userpic,a.email,a.userfen from ${
            this.prefix
        }enewsmember as a left join ${
            this.prefix
        }enewsmemberadd as b on a.userid = b.userid where a.userid = ${userid} limit 1`
        return await this.query(sql)
    }
}

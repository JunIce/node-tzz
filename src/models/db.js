import mysql from 'mysql'
import Promise from 'bluebird'
import DbConf from '../config/db.conf'

export default class Db {
    constructor() {
        this.connection = this.getInstance()
        this.prefix = DbConf.tablePrefix
    }

    getInstance() {
        return mysql.createConnection(DbConf)
    }

    /**
   *
   * @param {string} sql
   */
    query(sql) {
        let self = this
        return new Promise((resolve, reject) => {
            self.connection.query(sql, function(err, data) {
                if (err) {
                    reject(err)
                }
                // let args = Array.prototype.slice.call(arguments, 1)
                resolve.call(self, data)
            })
        })
    }
}

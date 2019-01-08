import mysql from 'promise-mysql'
import DbConf from '../config/db.conf'

export default class Db {
    constructor() {
        this.connection = this.getInstance();
        this.prefix = DbConf.tablePrefix;
    }

    async getInstance() {
        return await mysql.createConnection(DbConf)
    }
}
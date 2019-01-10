import Photo from '../models/photo'
import Tag from '../models/tags'
import {idArray2String} from '../util/lib'
let p = new Photo
let t = new Tag

// 前台接口
let ApiController = {
    homeList: async (ctx) => {
        let { type, num , tid} = ctx.request.body
        let data
        let page = parseInt(num) + 1
        if(type == 'index') {
            data = await p.getList(page)
        }else if(type == 'tags') {
            let ids = await t.tagsList(tid, page)
            data = await p.getListByIdString(idArray2String(ids))
        }
        ctx.body = { 
            data: data,
            status: 1,
            message: 'success'
        }
    }
}

export default ApiController
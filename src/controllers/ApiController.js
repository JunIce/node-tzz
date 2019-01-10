import Photo from '../models/photo'
import Tags from '../models/tags'

let p = new Photo
let t = new Tags

let ApiController = {
    homeList: async (ctx) => {
        console.log(ctx.request.body)
        console.log(ctx.request.body)
    }
}

export default ApiController
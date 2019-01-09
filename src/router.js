import Router from 'koa-router'
import Site from './controllers/SiteController'

let route = new Router()
route
    .get('/', Site.index)
    .get('/label/:tagid', Site.tagList)
    .get('/posts/photo/:photo_id', Site.infoDetail)

export default route

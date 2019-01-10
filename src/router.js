import Router from 'koa-router'
import api from './api'
import Site from './controllers/SiteController'

let route = new Router()
route
    .get('/', Site.index)
    .get('/label/:tagid', Site.tagList)
    .get('/posts/photo/:photo_id', Site.infoDetail)
    .use('/api', api.routes())
export default route

import Router from 'koa-router'
import Api from './controllers/ApiController'

let route = new Router()
route
    .post('/list/', Api.homeList)

export default route

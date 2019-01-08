import Router from 'koa-router'
import Site from './controllers/SiteController'

let route = new Router()
route
    .get('/', async (ctx, nxt) => {
        await ctx.render('index', Site.index())
    })

export default route

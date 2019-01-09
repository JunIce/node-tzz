import Koa from 'koa'
import koaStatic from 'koa-static'
import logger from 'koa-logger'
import path from 'path'
import render from 'koa-ejs'
import router from './router'
const app = new Koa
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
})
app.use(koaStatic(path.join(__dirname, '../static')))
app.use(logger())
app.use(router.routes())

app.listen(3000, function(){
    console.log('listening at 3000')
})
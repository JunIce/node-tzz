import Koa from 'koa'
import koaStatic from 'koa-static'
import logger from 'koa-logger'
import path from 'path'
import render from 'koa-ejs'
import bodyParser from 'koa-bodyparser'
import router from './router'
const app = new Koa
let __dirname = path.resolve(path.dirname(''))
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
})

app.use(bodyParser())
app.use(koaStatic(path.join(__dirname, 'web')))
app.use(logger())
app.use(router.routes())

app.listen(3000, function(){
    console.log('listening at 3000')
})
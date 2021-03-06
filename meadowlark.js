const express = require('express')
const handlebars = require('express3-handlebars').create({ defaultLayout: 'main' })
const fortune = require('./lib/fortune')
const config = require('./config')

const app = express()

// 设置handlebars视图引擎
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || config.PORT || 3000)

// 禁用Express的X-Powered-By头信息
app.disable('x-powered-by')

// 在Express中，路由和中间件的添加顺序至关重要

app.use(function(req, res, next){
    // res.locals 对象是要传给视图的上下文的一部分
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
    res.locals.URL_PREFIX = config.URL_PREFIX
    next()
})

// static中间件可以将一个或多个目录指派为包含静态资源的目录
// 其中的资源不经过任何特殊处理直接发送到客户端
// 可以在其中放图片、CSS文件、客户端JavaScript文件之类的资源
app.use(config.URL_PREFIX + '/static', express.static(__dirname + '/public'))

// app.VERB在路由匹配时
// 默认忽略了大小写或反斜杠
// 并且在进行匹配时也不考虑查询字符串
// 还支持通配符
app.get(config.URL_PREFIX + '/', function(req, res){
    res.render('home')
})

app.get(config.URL_PREFIX + '/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: config.URL_PREFIX + '/static/qa/tests-about.js'
    })
})

app.get(config.URL_PREFIX + '/tours/hood-river', function (req, res) {
    res.render('tours/hood-river')
})

app.get(config.URL_PREFIX + '/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast')
})

app.get(config.URL_PREFIX + '/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate')
})

// 演示：获取请求报头
app.get(config.URL_PREFIX + '/headers', function (req, res){
    res.json(req.headers)
})

// app.use是Express添加中间件的一种方法
// Express能根据回调函数中参数的个数区分404和500处理器

// 404 catch-all 处理器（中间件）
app.use(function(req, res){
    res.status(404)
    res.render('404')
})

// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
    console.log(err.stack)
    res.status(500)
    res.render('500')
})

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate')
})

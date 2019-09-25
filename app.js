const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:第一个middleware是记录URL以及页面执行时间
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// static file support:第二个middleware处理静态文件
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:第三个middleware解析POST请求
app.use(bodyParser());

// 性能问题主要出现在从文件读取模板内容这一步。这是一个IO操作，在Node.js环境中，单线程的JavaScript最不能忍受的就是同步IO，但Nunjucks默认就使用同步IO读取模板文件。

// 好消息是Nunjucks会缓存已读取的文件内容，也就是说，模板文件最多读取一次，就会放在内存中，后面的请求是不会再次读取文件的，只要我们指定了noCache: false这个参数。

// 在开发环境下，可以关闭cache，这样每次重新加载模板，便于实时修改模板。在生产环境下，一定要打开cache，这样就不会有性能问题。
// add nunjucks as view:第四个middleware负责给ctx加上render()来使用Nunjucks
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// add controller:最后一个middleware处理URL路由
// 让它自动扫描controllers目录，找到所有js文件，导入，然后注册每个URL
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');

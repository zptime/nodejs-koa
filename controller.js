const fs = require('fs');

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"POST xxx":
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    // 先导入fs模块，然后用readdirSync列出文件
    // 这里可以用sync是因为启动时只运行一次，不存在性能问题:
    var files = fs.readdirSync(__dirname + '/' + dir);
    // 过滤出.js文件:
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    // 处理每个js文件:
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
         // 导入js文件:
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    }

    // fs.readdirSync(__dirname + '/' + dir).filter((f) => {
    //     return f.endsWith('.js');
    // }).forEach((f) => {
    //     console.log(`process controller: ${f}...`);
    //     let mapping = require(__dirname + '/' + dir + '/' + f);
    //     addMapping(router, mapping);
    // });
}

/**
 * koa-router改造后
 */
module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        // 注意require('koa-router')返回的是函数:
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};

/**
 * koa-router改造前
    // 注意require('koa-router')返回的是函数:
    const router = require('koa-router')();
    // add url-route：
    router.get('/hello/:name', async (ctx, next) => {
        var name = ctx.params.name;
        ctx.response.body = `<h1>Hello, ${name}!</h1>`;
    });

    router.get('/', async (ctx, next) => {
        ctx.response.body = '<h1>Index</h1>';
    });

    // add router middleware:
    app.use(router.routes());
 */

const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            // 创建一个文件系统加载器，从views目录读取模板
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

/**
 * 改造后：
    这个middleware的作用是给ctx对象绑定一个render(view, model)的方法，这样，后面的Controller就可以调用这个方法来渲染模板了。
 */
function templating(path, opts) {
     // 创建Nunjucks的env对象:
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        // 给ctx绑定render函数:
        ctx.render = function (view, model) {
            // 把render后的内容赋值给response.body:
            // model || {}确保了即使传入undefined，model也会变为默认值{}
            // Object.assign()会把除第一个参数外的其他参数的所有属性复制到第一个参数中。
            // ctx.state || {}，这个目的是为了能把一些公共的变量放入ctx.state并传给View。
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
             // 设置Content-Type:
            ctx.response.type = 'text/html';
        };
        // 继续处理请求:
        await next();
    };
}

/**
 * 改造前：
    // 变量env就表示Nunjucks模板引擎对象，它有一个render(view, model)方法，正好传入view和model两个参数，并返回字符串。
    var env = createEnv('views', {
        watch: true,
        filters: {
            hex: function (n) {
                return '0x' + n.toString(16);
            }
        }
    });

    // 使用：
    var s = env.render('hello.html', { name: '小明' });
    console.log(s);
 */

module.exports = templating;

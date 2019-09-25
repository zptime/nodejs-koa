### nodejs + koa + nunjucks 搭建基本框架

> 基础模板来自nodejs-study/hello-koa

* .vscode/launch.json用于调试
* controller.js：自动扫描controllers目录，找到所有js文件，导入，然后注册每个URL。默认是处理controllers文件夹中的js文件
* views文件夹：HTML模板文件，使用模板引擎`Nunjucks`
* static-files.js：处理静态文件的middleware。所有静态资源文件全部放入/static目录，目的就是能统一处理静态文件。在koa中，需要编写一个middleware，处理以/static/开头的URL。
* templatings.js：集成Nunjucks实际上也是编写一个middleware，这个middleware的作用是给ctx对象绑定一个render(view, model)的方法，这样，后面的Controller就可以调用这个方法来渲染模板了。
* Koa 可被视为 node.js 的 http 模块的抽象，其中 Express 是 node.js 的应用程序框架。Express 通过附加的属性和方法增加了 node 的 req 和 res 对象，并且包含许多其他 “框架” 功能，如路由和模板，而 Koa 则没有。

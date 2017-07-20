var Koa = require('koa');
var app = new Koa();
var serve = require('koa-static');
var route = require('koa-route');
var modelService = require('./src/model');
var parse = require('co-body');

app.use(serve(__dirname + '/public'));

app.use(route.get('/pages', async function (ctx) {
  try{
    var params = ctx.query;
    var page = params.page || 1;
    var webpages = await modelService.getPages(page);
    var total = await modelService.getPageCount();
    ctx.body = {
      total,
      data: webpages,
      perpage: 20
    }
  }catch(err) {
    console.log(err);
    ctx.body = {
      msg: '服务器错误'
    };
  }
}));

/**
 * ctx.body:{
 *  content: '  频道_基金  ',
 *  _id: 1
 * }
 */
app.use(route.post('/pages', async function(ctx) {
  try {
    var data = await parse.json(ctx);
    if(data.content !== '') await modelService.updatePage(data);
    else await modelService.deletePage(data);
    ctx.body = {
      msg: data.content?'修改成功':'删除成功'
    };
  } catch(err) {
    console.log(err);
  }
}));

app.listen(3000);
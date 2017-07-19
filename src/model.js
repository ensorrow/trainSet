var monk = require('monk');
var url = 'localhost:27017/tagAna';
var db = monk(url);
var pages = db.get('webpages');
var perpage = 20;

module.exports = {
  getPages(page) {// 分页取，一次取20条
    return pages.find({}, {limit: perpage, skip: (page-1)*perpage});
  },
  getPageCount() {
    return pages.count({});
  },
  updatePage(data) {
    data._id = parseInt(data._id);
    try{
      pages.find({_id: data._id})
        .then(function(resultArr) {
          result = resultArr[0];
          result.tag = data.content+result.tag.split(data.content)[1];
          result.tag = result.tag.slice(1);// 去掉空格
          result.changed = true;
          return pages.update({_id: data._id}, result);
        });
    } catch(err) {
      throw new Error(err);
    }
  },
  deletePage(data) {
    data._id = parseInt(data._id);    
    try{
      return pages.findOneAndUpdate({_id: data._id}, { $set: {duplicated: true, changed: true} });
    } catch(err) {
      throw new Error(err);
    }
  }
}
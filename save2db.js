var monk = require('monk');
var url = 'localhost:27017/tagAna';
var db = monk(url);
var pages = db.get('webpages');

var lineReader = require('line-reader');

var count = 0;
var item = {};
lineReader.eachLine('./xinhuanet_tag', function(line, last) {
  count++;
  if(count>20000) return false;
  try {
    if(new RegExp(/,\s\w+\s,/).test(line)) {
      item.tag = line;
    }else{
      item.content = line;
    }
    if(count%2===0){
      item._id = count/2;
      console.log('第'+count/2+'条数据存入数据库...');
      pages.insert(item, {castIds: false});
    }
  } catch(e) {
    console.log('exit accidently '+e);
  }

  if (last) {
    console.log('总行数：'+count);
    // db.close();
    return false; // stop reading
  }
});
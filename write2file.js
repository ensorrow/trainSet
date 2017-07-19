var fs = require('fs');
var monk = require('monk');
var url = 'localhost:27017/tagAna';
var db = monk(url);
var pages = db.get('webpages');

fs.open('./newfile', 'a', function(err, fd){
  if(err) throw(err);
  pages.find({})
    .then(function(result) {
      var bufferPosition = 0;
      var count = 0;
      try {
        result.forEach(function(item) {
          count++;
          if(count>500) throw BreakException;
          var writeBuffer = new Buffer(`${item.tag}\n${item.content}\n`);
          var bufferLength = writeBuffer.length;
          let tmp = count;
          fs.write(fd,writeBuffer,bufferPosition,bufferLength,null,function(err, written) {
            if(err) throw(err);
            console.log(`第${tmp}条数据写入，写入${written}字节`);
          });
        });
      }catch(err) {
        console.log(err);
      }
    });
});
var fs = require("fs");
var Thaidict = {
  dictThai2Eng : [],
  dictEng2Thai : [],
  init : function(callback) {
    var wfsync = 0;
    var self = this;
    if(self.dictThai2Eng.length>0&&self.dictEng2Thai.length>0){
      callback();
    }else if(callback){
      function wfcallback(){
        wfsync++;
        if(wfsync==2){
          callback();
        }
      }
      fs.readFile(__dirname+"/../data/thai2eng.json",'utf8',function(err,data){
        if(err){
          throw err;
        }else{
          self.dictThai2Eng = JSON.parse(data);
          wfcallback();
        }
      });
      fs.readFile(__dirname+"/../data/eng2thai.json",'utf8',function(err,data){
        if(err){
          throw err;
        }else{
          self.dictEng2Thai = JSON.parse(data);
          wfcallback();
        }
      });
    }else{
      this.dictThai2Eng = JSON.parse(fs.readFileSync(__dirname+"/../data/thai2eng.json", {encoding: "UTF-8"}));
      this.dictEng2Thai = JSON.parse(fs.readFileSync(__dirname+"/../data/eng2thai.json", {encoding: "UTF-8"}));
    }
  },
  search : function(val,callback){
    if(this.dictThai2Eng.length==0&&this.dictEng2Thai.length==0){
      throw "You must call thaidict.init() first";
    }
    var self = this;
    var doSearch = function(value){
      var isThai = new RegExp("[ก-๙]");
      var output = [];
      if(isThai.test(value)){
        value = value.replace(new RegExp('\\*', 'g'),'.*');
        value = value.replace(new RegExp('#', 'g'),'(.)');
        var isWant = new RegExp("^"+value+"$");
        for(var i=0;i<self.dictThai2Eng.length;i++){
            if(isWant.test(self.dictThai2Eng[i].search)){
              output.push(self.dictThai2Eng[i]);
          }
        }
      }else{
        value = value.replace(new RegExp('\\*', 'g'),'.*');
        value = value.replace(new RegExp('#', 'g'),'(.)');
        var isWant = new RegExp("^"+value+"$",'i');
        for(var i=0;i<self.dictEng2Thai.length;i++){
            if(isWant.test(self.dictEng2Thai[i].search)){
              output.push(self.dictEng2Thai[i]);
          }
        }
      }
      return output;
    }
    if(callback){
      setTimeout(function(){
        callback(doSearch(val));
      },0);
    }else{
      return doSearch(val);
    }
  }
};
module.exports = Thaidict;

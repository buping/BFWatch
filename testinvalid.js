var bfstatus = require('./BFStatus.js');

var t1={};
t1.id = 12;
t1.scan = [];
t1.scan.push('10001');
bfstatus.RealtimeScan('shengbanghangzhou',2,JSON.stringify(t1));

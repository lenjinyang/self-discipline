// 解码 openapp.reg 中的 hex(1) 值，验证生成是否正确
const fs = require('fs');
const c = fs.readFileSync(__dirname + '/../openapp.reg', 'utf8');
const m = c.match(/hex\(1\):([\s\S]*?)(\r?\n|$)/);
if (!m) { console.log('未找到 hex(1)'); process.exit(1); }
const hexStr = m[1].replace(/[\\\s]/g, ''); // 去掉续行反斜杠、\r\n、空格
const bytes = Buffer.from(hexStr.split(',').filter(s => s.length).map(h => parseInt(h, 16)));
const str = bytes.toString('utf16le');
console.log('解码出的命令值:');
console.log(str.replace(/\0/g, ''));

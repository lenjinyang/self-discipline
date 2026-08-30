// 生成 openapp.reg（hex(1) 格式写命令值，免疫分号/引号/反斜杠转义问题）
const PS = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
const cmd = '"' + PS + '" -NoProfile -WindowStyle Hidden -Command '
  + '"& {param($u) $u=[uri]::UnescapeDataString($u); '
  + "$p=$u -replace '^openapp://',''; "
  + 'if($p){ Start-Process $p }}" "%1"';
// .reg 的 hex(1) = 字符串的 UTF-16LE 字节（含结尾 \0），每行最多 20 个字节
function hex1(str) {
  const bytes = Buffer.from(str + '\0', 'utf16le');
  const lines = [];
  for (let i = 0; i < bytes.length; i += 20) {
    const chunk = [...bytes.slice(i, i + 20)].map(b => b.toString(16).padStart(2, '0')).join(',');
    lines.push((i ? '  ' : '') + chunk);
  }
  return lines.join(',\\\r\n  ');
}
const reg = [
  'Windows Registry Editor Version 5.00',
  '',
  '[HKEY_CURRENT_USER\\Software\\Classes\\openapp]',
  '@="URL:openapp Protocol"',
  '"URL Protocol"=""',
  '',
  '[HKEY_CURRENT_USER\\Software\\Classes\\openapp\\shell\\open\\command]',
  '@=hex(1):' + hex1(cmd),
  '',
].join('\r\n');
require('fs').writeFileSync(__dirname + '/../openapp.reg', reg);
console.log('命令值已用 hex(1) 格式编码');

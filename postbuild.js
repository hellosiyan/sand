const fs = require('fs')
const archiver = require('archiver')

fs.unlinkSync('./dist/script.js')
fs.unlinkSync('./dist/style.css')

let output = fs.createWriteStream('./dist/build.zip')
let archive = archiver('zip', {
  zlib: { level: 9 } // set compression to best
})

output.on('close', function() {
  let usedBytes = archive.pointer();
  let totalBytes = 13312;

  console.log(usedBytes + '/' + totalBytes + ' total bytes (' + (Math.ceil(usedBytes / totalBytes * 1000000) / 10000) + '%)');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err)
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.append(
  fs.createReadStream('./dist/index.html'), {
    name: 'index.html'
  })

archive.finalize()

const fs = require('fs');
// import { homedir } from 'os'
var path = require('path');
const homeDir = require('os').homedir();


window.saveBlob = async (blob, filename, saveFolder) => {
  
  const arrayBuffer = await blob.arrayBuffer();
  // console.log(desktopDir);
  const buffer = Buffer.from(arrayBuffer);
  const desktopDirPg = path.join(homeDir,`/Desktop/KumThai`);
  
  const desktopDirName = path.join(homeDir,`/Desktop/KumThai/${saveFolder}`);
  const desktopDir = path.join(desktopDirName,`/${filename}.mp3`);
  if (!fs.existsSync(desktopDirPg)){
    fs.mkdirSync(desktopDirPg);
  }
  if (!fs.existsSync(desktopDirName)){
    fs.mkdirSync(desktopDirName);
  }
  fs.writeFile(desktopDir, buffer, (err, res) =>{
    if (err) {
      console.error(err)
      return
    }
    console.log('save complete')
  })
}
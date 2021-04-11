const fs = require('fs');
// import { homedir } from 'os'
var path = require('path');
const homeDir = require('os').homedir();


window.saveBlob = async (blob, filename, studentName) => {
  var datetime = new Date();
  const arrayBuffer = await blob.arrayBuffer();
  // console.log(desktopDir);
  const buffer = Buffer.from(arrayBuffer);
  const desktopDirPg = path.join(homeDir,`/Desktop/KumThai`);
  
  let date = ("0" + datetime.getDate()).slice(-2);
  // current month
  let month = ("0" + (datetime.getMonth() + 1)).slice(-2);
  // current year
  let year = datetime.getFullYear();
  // current hours
  let hours = datetime.getHours();
  // current minutes
  let minutes = datetime.getMinutes();
  // current seconds
  let seconds = datetime.getSeconds();


  console.log(year + "-" + month + "-" + date);
  const desktopDirName = path.join(homeDir,`/Desktop/KumThai/${studentName}-${year}-${month}-${date}-${hours}-${minutes}-${seconds}`);
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
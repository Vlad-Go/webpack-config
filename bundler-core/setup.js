const fs = require('fs');
const {pathes, fileStructure} = require('../main-config');
const {p} = require('./helper');

fileStructure.forEach((files)=>{
  const {fullpath, dirs} = p(files.html.path);
  const pathToHTML = pathes.src + fullpath;

  if (dirs.length) {
    fs.mkdir(
        `${pathes.src}\\${dirs.join('\\')}`,
        {recursive: true},
        ()=>{}
    );
  };
  if (!fs.existsSync(pathToHTML)) {
    fs.writeFile(pathToHTML, '', ()=>{});
  }

  let pathToJS;
  files.js.forEach((jsFile)=>{
    const {fullpath, dirs} = p(jsFile.path);
    pathToJS =pathes.src + fullpath;
    if (dirs.length) {
      fs.mkdirSync(
          `${pathes.src}\\${dirs.join('\\')}`,
          {recursive: true},
          ()=>{}
      );
    };
    if (!fs.existsSync(pathToJS)) {
      fs.writeFile(pathToJS, '', ()=>{});
    }
  });

  let pathToCSS;
  files.css.forEach((cssFile)=>{
    const {fullpath, dirs} = p(cssFile.path);
    pathToCSS =pathes.src + fullpath;
    if (dirs.length) {
      fs.mkdirSync(
          `${pathes.src}\\${dirs.join('\\')}`,
          {recursive: true},
          ()=>{}
      );
    };
    if (!fs.existsSync(pathToCSS)) {
      fs.writeFile(pathToCSS, '', ()=>{});
    }
  });
});

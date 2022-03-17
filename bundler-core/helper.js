module.exports = {
  p(path) {
    const temp = path.split('/').slice(1, path.split('/').length);
    return {
      fullpath: path.replaceAll('/', '\\').replace('.', ''),
      filename: temp[temp.length-1].split('.')[0],
      file: temp[temp.length-1],
      dirs: temp.slice(0, temp.length-1),
    };
  },
};

import * as fs from 'node:fs'
import * as path from 'node:path'

// rm -rf *
export function postOrderDirectoryTraverse(
  dir: string,
  dirCallback: (fullpath: string) => void,
  fileCallback: (fullpath: string) => void
) {
  for (const filename of fs.readdirSync(dir)) {
    const fullpath = path.resolve(dir, filename)
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback)
      dirCallback(fullpath)
      continue
    }
    fileCallback(fullpath)
  }
}

// project dir is empty
export function canSkipEmptying(dir: string) {
  // if the path no exists .
  if (!fs.existsSync(dir)) {
    return true
  }

  // Reads the contents of the directory .
  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

// rm -rf *
export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    // rm dir
    (dir: fs.PathLike): void => fs.rmdirSync(dir),
    // linux unlink , delete file
    (file: fs.PathLike) => fs.unlinkSync(file)
  )
}

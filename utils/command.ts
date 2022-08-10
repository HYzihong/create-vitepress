export default function getCommand(packageManager: 'yarn' | 'npm' | 'pnpm', scriptName: string) {
  // install
  // yarn
  // pnpm i
  // npm i
  if (scriptName === 'install') {
    return packageManager === 'yarn' ? 'yarn' : `${packageManager} install`
  }
  // run
  // npm xxx
  // yarn xxx
  // pnpm xxx
  return packageManager === 'npm' ? `npm run ${scriptName}` : `${packageManager} ${scriptName}`
}

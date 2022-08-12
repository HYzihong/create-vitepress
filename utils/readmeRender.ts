import getCommand from './command'

function readmeRender(
  projectName: string | undefined,
  packageManager: 'yarn' | 'npm' | 'pnpm'
): string {
  let readme = `
  # ${projectName}

  This template should help get you started developing with VitePress.

  `
  // description

  // shell
  let install = getCommand(packageManager, 'install')
  // theme
  return readme
}

export default readmeRender

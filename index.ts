#!/usr/bin/env node

// library
import * as fs from 'node:fs'
import * as path from 'node:path'
import minimist from 'minimist'
import { green, bold } from 'kolorist'
// utils
import banner from './utils/banner'
import { emptyDir } from './utils/empty'
import getCommand from './utils/command'
import cliPrompts from './utils/prompts'
import { renderTemplate } from './utils/templateRender'
import readmeRender from './utils/readmeRender'

async function init() {
  console.log(`\n${banner}\n`)

  const cwd = process.cwd()

  console.log(cwd)

  // possible options:
  // --base
  // --doc
  // --blog
  // --base
  const argv = minimist(process.argv.slice(2), {
    alias: {
      // config use ts
      typescript: ['ts']
    },
    // all arguments are treated as booleans
    boolean: true
  })

  console.log(argv)

  // Passing in the project name
  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'my-docs' : targetDir

  // force over write file
  const forceOverwrite = argv.force

  //
  const isFeatureFlagsUsed = typeof (argv.blog ?? argv.docs ?? argv.base ?? argv.ts) === 'boolean'

  // prompts results
  let result: {
    typescript?: boolean
    projectName?: string
    shouldOverwrite?: boolean
    needsTypeScript?: boolean
    type?: string
    email?: string
    description?: string
    author?: string
    repo?: string
  } = {}

  try {
    result = await cliPrompts(isFeatureFlagsUsed, targetDir, forceOverwrite, defaultProjectName)
  } catch (cancelled: any) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const { type, projectName, description, author, email, repo, shouldOverwrite, needsTypeScript } =
    result
  console.log(result)

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    // rm -rf dir
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    // mkdir dir
    fs.mkdirSync(root)
  }

  // package.json base
  const pkg = {
    name: projectName,
    version: '0.0.1',
    description: description,
    authors: {
      name: author,
      email
    },
    repository: repo
  }

  // write base package.json
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  // template root dir
  const templateRoot = path.resolve(__dirname, 'template')

  // render  package by template dir
  const render = function render(templateName: string) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root)
  }

  // render base template
  render('base')

  // base
  /*
    ├─ docs
    │  ├─ .vitepress
    │  │  └─ config.js
    │  └─ index.md
    └─ package.json
    └─ .gitignore
    └─ LICENSSE
  */

  // blog
  /*
    ├─ post
    │  ├─ .vitepress
    │  │  └─ config.js
    │  └─ index.md
    └─ package.json
    └─ .gitignore
    └─ LICENSSE
  */

  /*
    template
    - base
      - .vitepress
        - config.js
      - package.json
  */

  // render template code
  switch (type) {
    case 'docs':
      render('code/docs')
      break
    case 'blog':
      render('code/blog')
      break
    case 'theme-template':
      render('code/themeTemplate')
      break
    default:
      break
  }

  // - use typescript
  if (needsTypeScript) {
    // TODO file .js ->ts
    // render ts template
  }

  // use package manager
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  // render README.md
  let readmeMd = readmeRender(projectName, packageManager)

  console.log(`\nDone. Now run:\n`)

  if (root !== cwd) {
    console.log(`  ${bold(green(`cd ${path.relative(cwd, root)}`))}`)
  }

  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log()

  console.log(`  ${bold(green(getCommand(packageManager, 'dcos:dev')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dcos:builds')))}`)
  console.log()
}

init().catch((err) => {
  console.log(err)
})

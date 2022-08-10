#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, bold } from 'kolorist'
import banner from './utils/banner'
import { canSkipEmptying, emptyDir } from './utils/empty'
import getCommand from './utils/command'

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

  const isFeatureFlagsUsed = typeof (argv.blog ?? argv.docs ?? argv.base ?? argv.ts) === 'boolean'

  // Prompts:
  // 1. type <=select
  // 2. name
  // 3. description
  // 4. email
  // 5. your name =>author
  // 6. repo url
  try {
    result = await prompts(
      [
        {
          type: () => (isFeatureFlagsUsed ? null : 'select'),
          name: 'projectType',
          message: 'Select the boilerplate type :',
          choices: [
            {
              title: 'docs',
              value: 'docs',
              description: 'Create a documentation project with VitePress.'
            },
            { title: 'blog', value: 'blog', description: 'Create a blog with VitePress.' }
          ],
          initial: 0
        },
        {
          name: 'shouldOverwrite',
          type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          }
        },
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          name: 'description',
          type: 'text',
          message: `What's the description of your project?`,
          initial: ''
        },
        {
          name: 'email',
          type: 'text',
          message: `What's your email?`,
          initial: ''
        },
        {
          name: 'author',
          type: 'text',
          message: `What's your name?`,
          initial: ''
        },
        {
          name: 'repo',
          type: 'text',
          message: `What's the repo of your project?`,
          initial: ''
        },
        {
          name: 'needsTypeScript',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add TypeScript?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const { projectName, description, author, email, repo, shouldOverwrite, needsTypeScript } = result
  console.log(result)

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    // rm -rf dir
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    // mkdir dir
    fs.mkdirSync(root)
  }

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

  const pkg = { name: projectName, version: '0.0.1' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  const templateRoot = path.resolve(__dirname, 'template')

  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  ${bold(green(`cd ${path.relative(cwd, root)}`))}`)
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dcos:dev')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dcos:builds')))}`)
  console.log()
}

init().catch((err) => {
  console.log(err)
})

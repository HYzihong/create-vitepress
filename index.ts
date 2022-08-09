#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, bold } from 'kolorist'
import banner from './utils/banner'

// 1. type <=select
// 2. name
// 3. description
// 4. email
// 5. your name =>author
// 6. repo url
async function init() {
  console.log(`\n${banner}\n`)

  const cwd = process.cwd()

  console.log(cwd)

  // possible options:
  // --base
  // --doc
  // --blog
  const argv = minimist(process.argv.slice(2), {
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
    projectName?: string
    type?: string
    email?: string
    description?: string
    author?: string
    repo?: string
  } = {}

  const isFeatureFlagsUsed = typeof (argv.blog ?? argv.docs ?? argv.base) === 'boolean'

  // Prompts:
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

  // const { projectName, description, author, email, repo } = result
  // console.log(result);

  const root = path.join(cwd, targetDir)
}

init().catch((err) => {
  console.log(err)
})

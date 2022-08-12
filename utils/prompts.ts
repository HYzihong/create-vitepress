import { red } from 'kolorist'
import prompts from 'prompts'
import { canSkipEmptying } from './empty'

async function cliPrompts(
  isFeatureFlagsUsed: boolean,
  targetDir: string,
  forceOverwrite: boolean,
  defaultProjectName: string
): Promise<{
  typescript?: boolean
  projectName?: string
  shouldOverwrite?: boolean
  needsTypeScript?: boolean
  type?: string
  email?: string
  description?: string
  author?: string
  repo?: string
}> {
  // Prompts:
  // 1. type <=select
  // 2. name
  // 3. description
  // 4. email
  // 5. your name =>author
  // 6. repo url

  // let result = {}
  // try {
  // result = await prompts(
  return await prompts(
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
  // } catch (cancelled: any) {
  //   console.log(cancelled.message)
  //   process.exit(1)
  // }
  // return result
}

export default cliPrompts

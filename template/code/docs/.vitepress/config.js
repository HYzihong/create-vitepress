/**
 * @type {import('vitepress').UserConfig}
 */

const pkg = require('../../package.json')

module.exports = {
  // Ref https://vitepress.vuejs.org/config/app-configs.html

  // Ref https://vitepress.vuejs.org/config/app-configs.html#title
  title: 'Vuepress Docs Boilerplate',
  // Ref https://vitepress.vuejs.org/config/app-configs.html#base
  // base: '/'
  // Ref https://vitepress.vuejs.org/config/app-configs.html#description
  description: pkg.description,
  // Ref https://vitepress.vuejs.org/config/app-configs.html#head
  // head: [],
  // Ref https://vitepress.vuejs.org/config/app-configs.html#lang
  // lang:'en-US',
  // Ref https://vitepress.vuejs.org/config/app-configs.html#lastupdated
  // lastUpdated:false,
  // Ref https://vitepress.vuejs.org/config/app-configs.html#markdown
  // markdown:{},
  // Ref https://vitepress.vuejs.org/config/app-configs.html#outdir
  // outDir: './.vitepress/dist',
  // Ref https://vitepress.vuejs.org/config/app-configs.html#ignoredeadlinks
  // ignoreDeadLinks:false,
  // Ref https://vitepress.vuejs.org/config/app-configs.html#appearance
  // appearance: true,

  themeConfig: {
    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://vitepress.vuejs.org/config/theme-configs.html
     *
     */
    nav: [
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: 'Config',
        link: '/config/'
      },
      {
        text: 'VItePress',
        link: 'https://vitepress.vuejs.org'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: ['', 'using-vue']
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: pkg.repository }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022 VitePress'
    }
  }
}

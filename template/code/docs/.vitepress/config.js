/**
 * @type {import('vitepress').UserConfig}
 */

const pkg = require('../../package.json')

module.exports = {
  /**
   * Ref https://vitepress.vuejs.org/config/app-configs.html
   *
   */
  title: 'Vuepress Docs Boilerplate',
  // base: '/'
  description: pkg.description,
  // head: [],
  // lang:'en-US',
  // lastUpdated:false,
  // markdown:{},
  // outDir: './.vitepress/dist',
  // ignoreDeadLinks:false,
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

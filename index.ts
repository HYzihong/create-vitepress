#!/usr/bin/env node

import banner from './utils/banner'

async function init() {
  console.log(`\n${banner}\n`)
}

init().catch((err) => {
  console.log(err)
})

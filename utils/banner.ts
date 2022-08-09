const gradient = require('gradient-string')

const banner = gradient([
  { color: '#42d392', pos: 0 },
  { color: '#42d392', pos: 0.1 },
  { color: '#647eff', pos: 1 }
]).multiline('VitePress')
export default banner

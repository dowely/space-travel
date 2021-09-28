import '../styles/styles.css'

function importSprites(r) {
  r.keys().forEach(r)
}

importSprites(require.context('../ilustrations', true, /\.svg$/))

if(module.hot) {
  module.hot.accept()
}
import '../styles/styles.css'
import myTemplate from './templates/testimonials.hbs'
import MobileMenu from './modules/MobileMenu'
import LinkedNavigation from './modules/LinkedNavigation'
import CountingNumbers from './modules/CountingNumbers'
import LineThrough from './modules/LineThrough'

function importSprites(r) {
  r.keys().forEach(r)
}

importSprites(require.context('../ilustrations', true, /\.svg$/))
importSprites(require.context('../icons', true, /\.svg$/))

if(module.hot) {
  module.hot.accept()
}

let req = new XMLHttpRequest()
req.addEventListener("load", () => {
  let res = JSON.parse(req.responseText)
  createTestimonialsHTML(res)
})
req.open("GET", "/assets/data/testimonials.json", true)
req.send()

function createTestimonialsHTML(testimonials) {
  let ul = document.querySelector(".testimonials__list ul")
  ul.innerHTML = myTemplate(testimonials)
}

let mobileMenu = new MobileMenu()
let linkedNavigation = new LinkedNavigation()
let countingNumbers = new CountingNumbers()
let lineThrough = new LineThrough()

window.lineThrough = lineThrough
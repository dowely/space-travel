import 'core-js/stable'
import 'regenerator-runtime/runtime'
import '../styles/styles.css'
import myTemplate from './templates/testimonials.hbs'
import MobileMenu from './modules/MobileMenu'
import LinkedNavigation from './modules/LinkedNavigation'
import CountingNumbers from './modules/CountingNumbers'
import LineThrough from './modules/LineThrough'
import TestimonialSlider from './modules/TestimonialSlider'
import ee from 'event-emitter'

function importSprites(r) {
  r.keys().forEach(r)
}

importSprites(require.context('../ilustrations', true, /\.svg$/))
importSprites(require.context('../icons', true, /\.svg$/))

if(module.hot) {
  module.hot.accept()
}


function loadTestimonials() {

  return new Promise((resolve, reject) => {

    let req = new XMLHttpRequest()

    req.addEventListener("load", () => {

      let res = JSON.parse(req.responseText)
      createTestimonialsHTML(res)
      resolve()
    })
    req.addEventListener("error", () => {
      reject(new Error('Ooops!'))
    })
    req.open("GET", "assets/data/testimonials.json", true)
    req.send()
  })
}

function createTestimonialsHTML(testimonials) {
  let ul = document.querySelector(".testimonials__list ul")
  ul.innerHTML = myTemplate(testimonials)
}

loadTestimonials()
  .then(() => new TestimonialSlider())
  .catch((err) => console.log(err.message))

let mobileMenu = new MobileMenu()
let linkedNavigation = new LinkedNavigation()
let countingNumbers = new CountingNumbers()
let lineThrough = new LineThrough()

let galaxyModal

const modalButtons = document.querySelectorAll('.btn')

modalButtons.forEach(btn => btn.addEventListener('click', e => {
  
  e.preventDefault()

  if(typeof galaxyModal === 'undefined') {

    (async () => {

      const {default: GalaxyModal} = await import(/* webpackChunkName: "GalaxyModal" */ './modules/GalaxyModal')

      ee(GalaxyModal.prototype)

      galaxyModal = new GalaxyModal()

      galaxyModal.once('htmlReady', galaxyModal.openModal)

    })()

  } else if(galaxyModal.isReady) {
    galaxyModal.openModal()
  }
}))
import throttle from 'lodash/throttle'

class LinkedNavigation {
  constructor() {
    this.sections = document.querySelectorAll('page-section--linked')
    this.sectionsInView
    this.events()
  }

  events() {
    addEventListener('scroll', throttle(this.inViewMarker.bind(this), 200))
  }

  inViewMarker() {
    
  }
}

export default LinkedNavigation
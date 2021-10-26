import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class LinkedNavigation {
  constructor() {
    this.sections = document.querySelectorAll('.page-section--linked')
    this.links = document.querySelectorAll('.primary-nav a')

    this.prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    this.viewportHeight = window.innerHeight

    this.currentSection = this.markSectionInitially()

    this.events()
  }

  events() {
    addEventListener('scroll', throttle(this.runOnScroll.bind(this), 200))
    addEventListener('resize', debounce(this.updateViewportHeight.bind(this), 350))
  }

  runOnScroll() {
    let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop

    if(currentScrollPos > this.prevScrollPos) {

      if(this.offSections('down')) {
        this.updateLinks('deactivateAll')
        this.currentSection = 'veryBottom'
      }

      this.sectionInView('next', (sec) => {
        if(currentScrollPos + this.viewportHeight > sec.offsetTop) {
          this.calcThreshold('topEdge', sec, sec => {
            this.updateLinks(sec)
            this.currentSection = sec
          })
        }
        
      })

    } else {

      if(this.offSections('up')) {
        this.updateLinks('deactivateAll')
        this.currentSection = 'veryTop'
      }

      this.sectionInView('prev', (sec) => {
        if(this.currentSection == 'veryBottom' || this.currentSection.getBoundingClientRect().top > 0) {
          this.calcThreshold('bottomEdge', sec, sec => {
            this.updateLinks(sec)
            this.currentSection = sec
          })
        }
      })
    }

    this.prevScrollPos = currentScrollPos
  }

  markSectionInitially() {

    let sectionsScrolled = Array.from(this.sections).filter(el => {

      let topEdgeOffset = el.getBoundingClientRect().top

      if(topEdgeOffset < 0 || topEdgeOffset / this.viewportHeight * 100 < 30) return true
    })

    return sectionsScrolled[sectionsScrolled.length - 1] || 'veryTop'
  }

  updateViewportHeight() {
    this.viewportHeight = window.innerHeight
  }

  offSections(direction) {
    if(this.currentSection != 'veryTop' && this.currentSection != 'veryBottom') {

      let section
      let topEdgeOffset

      switch(direction) {

        case 'down':

          section = this.sections[this.sections.length - 1]
          topEdgeOffset = section.getBoundingClientRect().top

          if(topEdgeOffset < 0) {

            let percentInView = (section.offsetHeight + topEdgeOffset) / this.viewportHeight * 100

            if(percentInView < 30) return true
          }
          break

        case 'up':

          section = this.sections[0]
          topEdgeOffset = section.getBoundingClientRect().top

          if(topEdgeOffset >= 0) {

            let percentInView = topEdgeOffset / this.viewportHeight * 100

            if(percentInView > 70) return true
          }
          break

        default:
          console.log('This should not happen')
      }
    }
    return false
  }

  sectionInView(flank, calcSection) {

    let section
    let sign

    switch(flank) {

      case 'next':

        sign = 1

        if(this.currentSection == 'veryTop') {
          calcSection(this.sections[0])
          return
        }
        else if(this.currentSection == 'veryBottom' || this.currentSection.isSameNode(this.sections[this.sections.length - 1])) {
          return 
        }

        break

      case 'prev':

        sign = -1

        if(this.currentSection == 'veryBottom') {
          calcSection(this.sections[this.sections.length - 1])
          return
        } 
        else if(this.currentSection == 'veryTop' || this.currentSection.isSameNode(this.sections[0])) {
          return
        }
        
        break

      default:
        console.log('How did that happen???')
    }

    this.sections.forEach((el, index, array) => {
      if(el.isSameNode(this.currentSection)) {
        section = array[index + sign]
      }
    })

    calcSection(section)
  }

  calcThreshold(edge, section, changeLinks) {
    
    if(edge == 'topEdge' && section.getBoundingClientRect().top / this.viewportHeight * 100 < 25) {
      
      changeLinks(section)

    } else if(edge == 'bottomEdge' && section !== this.sections[this.sections.length -1] && this.currentSection.getBoundingClientRect().top / this.viewportHeight * 100 > 50) {
      
      changeLinks(section)

    } else if(edge == 'bottomEdge' && section === this.sections[this.sections.length -1] && (section.offsetHeight + section.getBoundingClientRect().top) / this.viewportHeight * 100 > 50) {
    
      changeLinks(section)

    } else {
      return
    }
  }

  updateLinks(sec) {
    this.links.forEach(link => {
      link.classList.remove('is-active-link')
    })
    if(typeof sec !='string') {
      let matchingLink = sec.getAttribute('data-matching-link')
      document.querySelector(matchingLink).classList.add('is-active-link')
    }
  }
}

export default LinkedNavigation
import debounce from 'lodash/debounce'

class TestimonialSlider {
  constructor() {
    
    // List items
    this.testimonials = document.querySelectorAll('.testimonial') 
    //Unordered list
    this.ul = document.querySelector('.testimonials__list ul')

    this.swipeHandlerBound = this.swipeHandler.bind(this)
    this.clickHandlerBound = this.clickHandler.bind(this)

    this.index = this.setModel()

    this.touchMoveHandler
    this.mouseMoveHandler = () => {}

    this.isAnimating = false
    this.swiped = false // set to true between swipe event and new single touchstart

    this.prevBrowserWidth = innerWidth

    this.modelEvents()
    this.touchEvents()
    this.mouseEvents()
  }

  modelEvents() {

    addEventListener('resize', debounce(() => {
      
      if(innerWidth !== this.prevBrowserWidth) {

        this.setModel()

        this.prevBrowserWidth = innerWidth
      }

    }, 200))

    addEventListener('resize', debounce(() => {

      if(innerWidth !== this.prevBrowserWidth) this.resetModel()

    }, 199, {leading: true, trailing: false}))
  }

  setModel() {

    if(this.readLayout() === 'block') {

      this.fixUlHeight()

      this.registerSwipeHandler()

      return this.readIndex()
      
    } else {

      this.registerClickHandlers()

      return this.readIndex()
    }
  }

  resetModel() {

    this.revertStyles()

    this.unhookEventHandlers()
  }

  fixUlHeight() {

    let ulHeight = this.tallestLiHeight()

    this.ul.style.height = `${ulHeight}px`
  }

  revertStyles() {
    
    this.ul.style = undefined

    this.testimonials.forEach(li => {
      li.style = undefined
    })
  }

  mouseEvents() {

    this.ul.addEventListener('mousedown', mDown => {

      mDown.preventDefault()

      this.mouseMoveHandler = function(mMove) {

        let xDown = mDown.pageX
        let xMove = mMove.pageX

        if(xMove - xDown > 100) {

          let ev = new Event('swipe')
          ev.direction = 'right'

          this.ul.dispatchEvent(ev)

          this.mouseMoveHandler = () => {}

        } else if(xMove - xDown < -100) {
          
          let ev = new Event('swipe')
          ev.direction = 'left'
          
          this.ul.dispatchEvent(ev)

          this.mouseMoveHandler = () => {}
        }
      }
    })

    this.ul.addEventListener('mousemove', mMove => {

      this.mouseMoveHandler(mMove)
    })

    this.ul.addEventListener('mouseup', () => {

      this.mouseMoveHandler = () => {}
    })
  }

  touchEvents() {

    this.ul.addEventListener('touchstart', eDown => {

      if(eDown.touches.length > 1) return

      this.swiped = false

      this.touchMoveHandler = function(eMove) {

        let xDown = eDown.touches[0].screenX
        let xMove = eMove.touches[0].screenX

        if(this.swiped) return

        else if(xMove - xDown > 60) {

          this.swiped = true

          let ev = new Event('swipe')
          ev.direction = 'right'

          this.ul.dispatchEvent(ev)

        } else if (xMove - xDown < -60) {

          this.swiped = true
          
          let ev = new Event('swipe')
          ev.direction = 'left'
          
          this.ul.dispatchEvent(ev)
        }
      }
    }, {passive: true})

    this.ul.addEventListener('touchmove', eMove => {

      this.touchMoveHandler(eMove)

    }, {passive: true})
  }

  registerSwipeHandler() {

    this.ul.addEventListener('swipe', this.swipeHandlerBound)
  }

  registerClickHandlers() {

    this.testimonials.forEach(li => {

      li.addEventListener('click', this.clickHandlerBound)
    })
  }

  unhookEventHandlers() {

    this.ul.removeEventListener('swipe', this.swipeHandlerBound)

    this.testimonials.forEach(li => {

      li.removeEventListener('click', this.clickHandlerBound)
    })
  }

  swipeHandler(swipe) {

    if(!this.isAnimating) {

      if(swipe.direction === 'right') this.next('right')
      if(swipe.direction === 'left') this.next('left')
    }
  }

  clickHandler(event) {

    let index
    let containingLi = event.target 

    while(containingLi.tagName !== 'LI') {
      containingLi = containingLi.parentElement
    }

    this.testimonials.forEach((li, i) => {

      if(containingLi === li) index = i
    })

    this.jumpTo(index)
  }

  async next(direction) {

    this.isAnimating = true
    let nextIndex

    let currentLi = {
      outter: this.testimonials[this.index],
      intro:  this.testimonials[this.index].children[0],
      story:  this.testimonials[this.index].children[1]
    }

    if (direction === 'right') {

      nextIndex = (this.index === this.testimonials.length - 1) ? 0 : this.index + 1

      let nextLi = {
        outter: this.testimonials[nextIndex],
        intro:  this.testimonials[nextIndex].children[0],
        story:  this.testimonials[nextIndex].children[1]
      }

      this.addAnimationStyles(currentLi, nextLi, direction)

      await this.runAnimations(currentLi, nextLi, direction).catch(err => console.log(err))

    } else if (direction === 'left') {

      nextIndex = (this.index === 0) ? this.testimonials.length - 1 : this.index - 1

      let nextLi = {
        outter: this.testimonials[nextIndex],
        intro:  this.testimonials[nextIndex].children[0],
        story:  this.testimonials[nextIndex].children[1]
      }

      this.addAnimationStyles(currentLi, nextLi, direction)

      await this.runAnimations(currentLi, nextLi, direction).catch(err => console.log(err))

    }

    this.index = nextIndex

    this.updateActiveClass()

    this.removeAnimationStyles()

    this.isAnimating = false

  }

  addAnimationStyles(current, next, direction) {

    current.intro.style.cssText = `
      transition: opacity .4s ease-out;
    `
    current.story.style.cssText = `
      transition: transform .6s ease-out;
    `
    next.outter.style.cssText = `
    display: list-item;
    position: absolute;
    top: 0;
    `
    next.intro.style.cssText = `
    opacity: 0;
    transition: opacity .4s ease-out .4s;
    `
    next.story.style.cssText = `
    transform: translateX(${(direction === 'right') ? -110 : 110}%);
    transition: transform .6s ease-out;
    `
  }

  runAnimations(current, next, direction) {

    return new Promise((resolve, reject) => {

      let animatedElements = [
        current.intro,
        current.story,
        next.intro,
        next.story
      ]

      let animations = []

      animatedElements.forEach((el) => {

        let animation = new Promise((res, rej) => {

          el.ontransitionend = () => res()
          el.ontransitioncancel = () => rej('transition canceled')

        })

        animations.push(animation)
      })

      Promise.allSettled(animations)
        .then(() => resolve())
        .catch(err => reject(err))

      setTimeout(() => {

        current.intro.style.opacity = 0
        current.story.style.transform = `
          translateX(${(direction === 'right') ? 110 : -110}%)
        `
        next.intro.style.opacity = 1
        next.story.style.transform = 'translateX(0)'

      }, 20)

    })
  }

  removeAnimationStyles() {

    this.testimonials.forEach(li => {

      li.style = undefined
      li.children[0].style = undefined
      li.children[1].style = undefined
    })
  }

  updateActiveClass() {

    this.testimonials.forEach((li, i) => {

      li.classList.remove('active')
      if(i === this.index) li.classList.add('active')
    })
  }

  jumpTo(pos) {

    this.index = pos

    this.updateActiveClass()
  }

  tallestLiHeight() {

    let tallestLiHeight = 0

    this.testimonials.forEach(li => {

      li.style.display = "list-item"

      let liHeight = li.offsetHeight
      
      if(liHeight > tallestLiHeight) tallestLiHeight = liHeight

      li.style = undefined
    })

    return tallestLiHeight
  }

  readLayout() {
    return getComputedStyle(this.ul).getPropertyValue('display')
  }

  readIndex() {

    let activeLi

    this.testimonials.forEach((li, key) => {

      if(li.classList.contains('active')) activeLi = key
    })

    return activeLi
  }
}

export default TestimonialSlider
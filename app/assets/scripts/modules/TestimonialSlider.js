import debounce from 'lodash/debounce'

class TestimonialSlider {
  constructor() {
    
    // List items
    this.testimonials = document.querySelectorAll('.testimonial') 
    //Unordered list
    this.ul = document.querySelector('.testimonials__list ul')

    this.swipeHandlerBound = this.swipeHandler.bind(this)

    this.index = this.setModel()

    this.touchMoveHandler

    this.isAnimating = false
    this.swiped = false // set to true between swipe event and new single touchstart

    this.prevBrowserWidth = innerWidth

    this.modelEvents()
    this.touchEvents()
  }

  modelEvents() {

    addEventListener('resize', debounce(() => {
      
      this.setModel()

      this.prevBrowserWidth = innerWidth

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

      this.registerClickHandler()

      return this.readIndex()
    }
  }

  resetModel() {
    alert('model reset')
    if(this.readLayout() === 'block') {

      this.revertStyles() //revert the styling to its static state
    }
    this.unhookEventHandlers()
  }

  fixUlHeight() {

    let ulHeight = this.tallestLiHeight()

    this.ul.style.height = `${ulHeight}px`

    console.log('ul element is now fixed height of: ', ulHeight)
  }

  revertStyles() {
    
    this.ul.style = undefined

    this.testimonials.forEach(li => {
      li.style = undefined
    })

    console.log('Styles are now in their original state')
  }

  touchEvents() {

    this.ul.addEventListener('touchstart', eDown => {

      if(eDown.touches.length > 1) return

      this.swiped = false

      this.touchMoveHandler = function(eMove) {

        let xDown = eDown.touches[0].screenX
        let xMove = eMove.touches[0].screenX

        if(this.swiped) return

        else if(xMove - xDown > 100) {

          this.swiped = true

          let ev = new Event('swipe')
          ev.direction = 'right'

          this.ul.dispatchEvent(ev)

        } else if (xMove - xDown < -100) {

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

    console.log('You can now swipe away')
  }

  registerClickHandler() {
    console.log('You can now click stuff')
  }

  unhookEventHandlers() {

    this.ul.removeEventListener('swipe', this.swipeHandlerBound)

    console.log('Event handlers are temporarly removed')
  }

  swipeHandler(swipe) {

    if(!this.isAnimating) {

      if(swipe.direction === 'right') this.next('right')
      if(swipe.direction === 'left') this.next('left')
    }

  }

  clickHandler() {
    console.log('you clicked')
  }

  async next(direction) {
    console.log('animating ', direction)

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

    console.log('animations ended')

    this.index = nextIndex

    this.updateActiveClass()

    this.removeAnimationStyles()

    this.isAnimating = false

  }

  addAnimationStyles(current, next, direction) {

    current.intro.style.cssText = `
      transition: opacity .5s ease-out;
    `
    current.story.style.cssText = `
      transition: transform 1s ease-out;
    `
    next.outter.style.cssText = `
    display: list-item;
    position: absolute;
    top: 0;
    `
    next.intro.style.cssText = `
    opacity: 0;
    transition: opacity .5s ease-out .5s;
    `
    next.story.style.cssText = `
    transform: translateX(${(direction === 'right') ? -110 : 110}%);
    transition: transform 1s ease-out;
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
          el.ontransitioncancel = () => {
            //alert('bar')
            rej('transition canceled')
          }

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

  jumpTo() {

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

    console.log('Curent list item is: ', activeLi)

    return activeLi
  }
}

export default TestimonialSlider

//calculate the height of the tallest lis
//set the ul height to that value
//set li's position to absolute -> top 0 left 0
//register event listener for swipe or click (depending on the model) with handler
//the swipe handler should determine the direction of the swipe and call prev or next func if the swiper ! isAnimating
//these funcs should overlay prev or next li (based on the current index) with styles prepared for animation and then trigger the the animation
//during the animation set slider state to isAnimating = true to prevent the imediate swipe event from triggering the handler
//after animation set the isAnimating to false and reassign the .active class to new li and update this.index
//the click handler calls jumpTo(index) func which reassigns .active class to clicked li and updates to index}
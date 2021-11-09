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

    this.modelEvents()
    this.touchEvents()
  }

  modelEvents() {

    addEventListener('resize', debounce(() => {
      
      this.setModel()

    }, 200))

    addEventListener('resize', debounce(() => {

      this.resetModel()

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

    if(this.readLayout() === 'block') {

      this.revertStyles() //revert the styling to its static state
    }
    this.unhookEventHandlers()
  }

  fixUlHeight() {

    let ulHeight = this.tallestLiHeight()

    this.ul.style.height = `${ulHeight}px`

    /*let liStylesText = `
      position: absolute;
      top: 0;
      left: 0;
    `
    

    this.testimonials.forEach(li => {
      li.style.cssText = liStylesText
    })
    */

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

        else if(xMove - xDown > 50) {

          this.swiped = true

          let ev = new Event('swipe')
          ev.direction = 'right'

          this.ul.dispatchEvent(ev)

        } else if (xMove - xDown < -50) {

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

      if(swipe.direction === 'right') this.next()
      if(swipe.direction === 'left') this.prev()
    }

  }

  clickHandler() {
    console.log('you clicked')
  }

  async next() {
    console.log('animating next')
    this.isAnimating = true

    let nextLi = this.testimonials[this.index + 1]
    let nextLiIntro = nextLi.children[0]
    let nextLiStory = nextLi.children[1]

    nextLi.style.cssText = `
      display: list-item;
      position: absolute;
      top: 0;
    `
    nextLiIntro.style.cssText = `
      opacity: 0;
      transition: opacity 1s ease-out;
    `
    nextLiStory.style.cssText = `
      transform: translateX(-100%);
      transition: transform 1s ease-out;
    `
    await new Promise((resolve, reject) => {

     // nextLiStory
    })

    setTimeout(() => nextLiStory.style.transform = 'translateX(0)', 20)

  }

  prev() {
    console.log('you prev: ')
  }

  goTo() {

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
//the click handler calls goTo(index) func which reassigns .active class to clicked li and updates to index}
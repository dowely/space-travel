import debounce from 'lodash/debounce'

class TestimonialSlider {
  constructor() {
    
    // List items
    this.testimonials = document.querySelectorAll('.testimonial') 
    //Unordered list
    this.ul = document.querySelector('.testimonials__list ul')

    this.index

    //this.isBusy = false/true

    this.setUpMobileView()
    this.events()
  }

  events() {

    addEventListener('resize', debounce(() => {
      
      this.setUpMobileView()

    }, 200))
  }

  readLayout() {
    return getComputedStyle(this.ul).getPropertyValue('display')
  }

  setUpMobileView() {

    if(this.readLayout() === 'block') {
    
      this.testimonials.forEach(item => {

        item.style.display = "list-item"
        console.log(item.offsetHeight)
        item.style = undefined
      })
    }
  }

  setUlHeight() {}
}

export default TestimonialSlider
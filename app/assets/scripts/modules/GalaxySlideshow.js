class GalaxySlideshow {
  constructor(images) {
    this.imgDivs = images // HTML collection of img divs
    this.display = images[0].parentElement

    this.startX // for mouse/touch gestures
    this.index = 0

    this.events()
    this.start()
  }

  events() {
    
    this.display.addEventListener('mousedown', startMouseEvent => {
      startMouseEvent.preventDefault()
      this.startX = startMouseEvent.clientX
    })

    this.display.addEventListener('mouseup', endMouseEvent => {
      if(endMouseEvent.clientX > this.startX) this.next()
      else if(endMouseEvent.clientX < this.startX) this.prev()
    })

    this.display.addEventListener('touchstart', startTouchEvent => {
      startTouchEvent.preventDefault()
      if(startTouchEvent.touches.length === 1) {
        this.startX = startTouchEvent.touches[0].screenX
      }
    })

    addEventListener('touchend', endTouchEvent => {
      endTouchEvent.preventDefault()
      if(endTouchEvent.touches.length === 0) {
        let xDiff = endTouchEvent.changedTouches[0].screenX - this.startX
        if(Math.abs(xDiff) > 35 && xDiff > 0) this.next()
        else if(Math.abs(xDiff) > 35) this.prev()
      }
    })
  }

  next() {

    if(this.index === this.imgDivs.length -1) this.index = 0
    else this.index++

    this.showImg()
  }

  prev() {

    if(this.index === 0) this.index = this.imgDivs.length - 1
    else this.index--

    this.showImg()
  }

  showImg() {

    this.hideImages()

    this.imgDivs[this.index].style.opacity = 1
    this.imgDivs[this.index].style.visibility = 'visible'
  }

  hideImages() {

    this.imgDivs.forEach(container => {
      container.style.opacity = 0
      container.style.visibility = 'hidden'
    })
  }

  start() {

    this.imgDivs[0].style.opacity = 1
    this.imgDivs[0].style.visibility = 'visible'
  }
}

export default GalaxySlideshow
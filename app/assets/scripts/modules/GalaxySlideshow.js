class GalaxySlideshow {
  constructor(images) {
    this.imgDivs = images // HTML collection of img divs
    this.display = images[0].parentElement

    this.bulletNav = document.querySelector('.galaxy-modal__nav-bullets')
    this.bullets = document.querySelectorAll('.galaxy-modal__bullet')
    this.nextBtn = document.querySelector('.galaxy-modal__nav-arrow--right')
    this.prevBtn = document.querySelector('.galaxy-modal__nav-arrow--left')

    this.numNav = document.querySelector('.galaxy-modal__index')
    this.position = document.querySelector('.galaxy-modal__index span:first-child')
    this.total = document.querySelector('.galaxy-modal__index span:last-child')

    this.startX // for mouse/touch gestures
    this.index = 0
    this.frozen = true

    this.events()
    this.start()
  }

  events() {
    
    this.display.addEventListener('mousedown', startMouseEvent => {
      startMouseEvent.preventDefault() // eliminate drag
      this.startX = startMouseEvent.clientX
    })

    this.display.addEventListener('mouseup', endMouseEvent => {
      if(endMouseEvent.clientX > this.startX) this.next()
      else if(endMouseEvent.clientX < this.startX) this.prev()
    })

    this.display.addEventListener('touchstart', startTouchEvent => {
      //startTouchEvent.preventDefault()
      if(startTouchEvent.touches.length === 1) {
        this.startX = startTouchEvent.touches[0].screenX
      }
    }, {passive: true})

    this.display.addEventListener('touchend', endTouchEvent => {
      endTouchEvent.preventDefault()
      if(endTouchEvent.touches.length === 0) {
        let xDiff = endTouchEvent.changedTouches[0].screenX - this.startX
        if(Math.abs(xDiff) > 35 && xDiff > 0) this.next()
        else if(Math.abs(xDiff) > 35) this.prev()
      }
    })

    this.nextBtn.addEventListener('click', e => {
      this.next()
    })

    this.prevBtn.addEventListener('click', e => {
      this.prev()
    })

    this.bullets.forEach((bullet, index) => {

      bullet.addEventListener('click', () => {
        this.index = index
        this.showImg()
        this.updateBullets()
        this.updateIndexDisplay()
      })
    })
  }

  next() {

    if(!this.frozen) {

      if(this.index === this.imgDivs.length -1) this.index = 0
      else this.index++

      this.showImg()
      this.updateBullets()
      this.updateIndexDisplay()
    }
  }

  prev() {

    if(!this.frozen) {

      if(this.index === 0) this.index = this.imgDivs.length - 1
      else this.index--

      this.showImg()
      this.updateBullets()
      this.updateIndexDisplay()
    }
  }

  showImg() {

    this.hideImages()

    this.imgDivs[this.index].style.opacity = 1
    this.imgDivs[this.index].style.visibility = 'visible'
  }

  updateBullets() {

    this.bullets.forEach(bullet => {
      bullet.classList.remove('galaxy-modal__bullet--active')
    })

    this.bullets[this.index].classList.add('galaxy-modal__bullet--active')

    this.bulletNav.style.bottom = '-80px'
  }

  updateIndexDisplay() {
    this.position.textContent = this.index + 1
    this.total.textContent = this.imgDivs.length
  }

  hideImages() {

    this.imgDivs.forEach(container => {
      container.style.opacity = 0
      container.style.visibility = 'hidden'
    })
  }

  hideNumNav() {

    this.numNav.style.opacity = 0
  }

  hideBulletNav() {
    this.bulletNav.style.bottom = 0
  }

  start() {

    this.index = 0

    this.imgDivs[this.index].style.opacity = 1
    this.imgDivs[this.index].style.visibility = 'visible'

    this.bullets[this.index].classList.add('galaxy-modal__bullet--active')

    this.updateIndexDisplay()
    this.updateBullets()
    this.numNav.style.opacity = 1;

    this.frozen = false
  }
}

export default GalaxySlideshow
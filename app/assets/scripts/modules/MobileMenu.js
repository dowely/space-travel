import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class MobileMenu {
  constructor() {
    this.menuIcon = document.querySelector(".site-header__menu-icon")
    this.menuContent = document.querySelector('.site-header__menu-content')
    this.siteHeader = document.querySelector('.site-header')
    this.rubberTitle = document.querySelector('.ultimate-trip__title')
    this.bouncingBtn = document.querySelector('.site-header__btn-container')
    this.links = document.querySelectorAll('.primary-nav a')
    this.prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    this.headerCollapseTimer
    this.headerRetractTimer
    this.events()
    this.showSiteHeaderInitially()
  }

  events() {
    this.menuIcon.addEventListener('click', () => this.toggleMenu())
    window.addEventListener('scroll', throttle(this.toggleSiteHeader, 200).bind(this))
    window.addEventListener('scroll', debounce(() => this.hideSiteHeaderOnScrollPause("foo"), 3000))
    window.addEventListener('scroll', debounce(this.dockSiteHeader, 100).bind(this))
    this.links.forEach(link => link.addEventListener('click', () => this.toggleMenu()))
  }

  toggleSiteHeader() {
    let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    if(currentScrollPos > this.prevScrollPos && this.siteHeader.isVisible && currentScrollPos > 50 && !this.menuContent.isVisible) {
      setTimeout(() => {
        this.siteHeader.classList.remove('site-header--is-visible')
        this.siteHeader.isVisible = false
      }, 200)
    } else if(currentScrollPos <= this.prevScrollPos && !this.siteHeader.isVisible) {
      setTimeout(() => {
        this.siteHeader.classList.add('site-header--is-visible')
        this.siteHeader.isVisible = true
      }, 200)
    } else if (currentScrollPos !== 0 && this.siteHeader.isDocked) {
      this.siteHeader.classList.remove('site-header--is-docked')
      this.rubberTitle.classList.remove('animate__animated', 'animate__rubberBand')
      this.siteHeader.isDocked = false
    } else if (currentScrollPos <= this.prevScrollPos && this.headerCollapseTimer) {
      clearTimeout(this.headerCollapseTimer)
      this.headerCollapseTimer = 0
    }
    
    this.prevScrollPos = currentScrollPos
  }

  toggleMenu() {

    if(this.menuContent.isVisible) {

      this.bouncingBtn.classList.remove('animate__bounceInUp')
      this.bouncingBtn.classList.add('animate__bounceOutDown')
      this.siteHeader.classList.add('site-header--is-retracting')
      this.menuIcon.classList.remove('site-header__menu-icon--close-x')

      this.headerRetractTimer = setTimeout(() => {
        this.siteHeader.classList.remove('site-header--is-expanded')
        this.menuContent.classList.remove('site-header__menu-content--is-visible')
        this.bouncingBtn.classList.remove('animate__bounceOutDown')
        this.siteHeader.classList.remove('site-header--is-retracting')

        document.documentElement.classList.remove('noScroll')

        this.menuContent.isVisible = false

      }, 1400) //time for animation

      this.headerCollapseTimer = setTimeout(this.hideSiteHeaderOnScrollPause.bind(this), 4400)

    } else if (this.siteHeader.isVisible) {

      this.bouncingBtn.classList.remove('animate__bounceOutDown')
      this.bouncingBtn.classList.add('animate__bounceInUp')

      clearTimeout(this.headerRetractTimer)

      this.siteHeader.classList.add('site-header--is-expanded')
      this.menuContent.classList.add('site-header__menu-content--is-visible')
      this.menuIcon.classList.add('site-header__menu-icon--close-x')

      document.documentElement.classList.add('noScroll')

      this.menuContent.isVisible = true
    }

  }

  showSiteHeaderInitially() {
    this.siteHeader.classList.add('site-header--is-visible')
    this.siteHeader.isVisible = true
  }

  hideSiteHeaderOnScrollPause(x) {
    console.log(x)
    if(this.siteHeader.isVisible && window.scrollY > 50 && !this.menuContent.isVisible) {
      this.siteHeader.classList.remove('site-header--is-visible')
      this.siteHeader.isVisible = false
    }
  }

  //additionally rubber effect on hero title
  dockSiteHeader() {
    if (window.scrollY == 0) {
      this.siteHeader.classList.add('site-header--is-docked')
      this.rubberTitle.classList.add('animate__animated', 'animate__rubberBand')
      this.siteHeader.isDocked = true
    }
  }
}

export default MobileMenu
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class MobileMenu {
  constructor() {
    this.menuIcon = document.querySelector(".site-header__menu-icon")
    this.menuContent = document.querySelector('.site-header__menu-content')
    this.siteHeader = document.querySelector('.site-header')
    this.rubberTitle = document.querySelector('.ultimate-trip__title')
    this.prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    this.headerCollapseTimer
    this.events()
    this.showSiteHeaderInitially()
  }

  events() {
    this.menuIcon.addEventListener('click', () => this.toggleMenu())
    window.addEventListener('scroll', throttle(this.toggleSiteHeader, 200).bind(this))
    window.addEventListener('scroll', debounce(() => this.hideSiteHeaderOnScrollPause(), 3000))
    window.addEventListener('scroll', debounce(this.dockSiteHeader, 100).bind(this))
  }

  toggleSiteHeader() {
    let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    if(currentScrollPos > this.prevScrollPos && this.siteHeader.isVisible && currentScrollPos > 50) {
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
    this.menuContent.classList.toggle('site-header__menu-content--is-expanded')
    this.menuContent.isExpanded = (this.menuContent.isExpanded) ? false : true
    if (!this.menuContent.isExpanded) {
      this.headerCollapseTimer = setTimeout(this.hideSiteHeaderOnScrollPause.bind(this), 3000)
      document.documentElement.style.overflowY = 'visible'
    } else {
      document.documentElement.style.overflowY = 'hidden'
    }
  }

  showSiteHeaderInitially() {
    this.siteHeader.classList.add('site-header--is-visible')
    this.siteHeader.isVisible = true
  }

  hideSiteHeaderOnScrollPause() {
    if(this.siteHeader.isVisible && window.scrollY > 50 && !this.menuContent.isExpanded) {
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
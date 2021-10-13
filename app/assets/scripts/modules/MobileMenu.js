import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class MobileMenu {
  constructor() {
    this.menuIcon = document.querySelector(".site-header__menu-icon")
    this.menuContent = document.querySelector('.site-header__menu-content')
    this.siteHeader = document.querySelector('.site-header')
    this.prevScrollPos = window.scrollY;
    this.events()
    this.showSiteHeaderInitially()
  }

  events() {
    this.menuIcon.addEventListener('click', () => this.toggleMenu())
    window.addEventListener('scroll', throttle(this.toggleSiteHeader, 200).bind(this))
    window.addEventListener('scroll', debounce(() => this.hideSiteHeaderOnScrollPause(), 3000))
  }

  toggleSiteHeader() {
    let currentScrollPos = window.scrollY

    if(currentScrollPos > this.prevScrollPos && this.siteHeader.isVisible) {
      this.siteHeader.classList.remove('site-header--is-visible')
      this.siteHeader.isVisible = false
    } else if(currentScrollPos < this.prevScrollPos && !this.siteHeader.isVisible) {
      this.siteHeader.classList.add('site-header--is-visible')
      this.siteHeader.isVisible = true
    }

    this.prevScrollPos = currentScrollPos
  }

  toggleMenu() {
    this.menuContent.classList.toggle('site-header__menu-content--is-visible')
  }

  showSiteHeaderInitially() {
    this.siteHeader.classList.add('site-header--is-visible')
    this.siteHeader.isVisible = true
  }

  hideSiteHeaderOnScrollPause() {
    if(this.siteHeader.isVisible && window.scrollY !== 0) {
      this.siteHeader.classList.remove('site-header--is-visible')
      this.siteHeader.isVisible = false
    }
  }
}

export default MobileMenu
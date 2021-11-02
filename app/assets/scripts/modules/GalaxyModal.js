class GalaxyModal {
  constructor() {
    this.modalHook = document.querySelector('#GalaxyModal')
    this.siteHeader = document.querySelector('.site-header')
    this.fetchHTML()
      .then((html) => this.injectHTML(html))
      .then(() => this.init())
  }

  async fetchHTML() {
    let response = await fetch('/assets/data/GalaxyModal.html')
    let data = await response.text()
    return data
  }

  injectHTML(data) {
    this.modalHook.insertAdjacentHTML('afterbegin', data)
  }

  init() {
    this.modal = document.querySelector('.galaxy-modal')
    this.close = document.querySelector('.galaxy-modal__close')

    setTimeout(() => {
      this.emit('htmlReady')
      this.isReady = true
    }, 20)

    this.close.addEventListener('click', () => this.closeModal())

    document.addEventListener('keyup', e => {
      if(e.code == "Escape") this.closeModal()
    })
  }

  openModal() {
    this.modal.classList.add('galaxy-modal--is-visible')
    document.documentElement.classList.add('noScroll')
  }

  closeModal() {
    this.modal.classList.remove('galaxy-modal--is-visible')
    
    if(!this.siteHeader.classList.contains('site-header--is-expanded')) {
      document.documentElement.classList.remove('noScroll')
    }
  }
}

export default GalaxyModal
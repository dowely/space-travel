import imgTemplate from '../templates/galaxies.hbs'
import navBullets from '../templates/galaxyBullets.hbs'
import GalaxySlideshow from './GalaxySlideshow'

class GalaxyModal {
  constructor() {
    this.modalHook = document.querySelector('#GalaxyModal')
    this.siteHeader = document.querySelector('.site-header')

    this.modalPrepared = this.fetchHTML()
      .then((html) => this.injectHTML(html))
      .then(() => this.init())
      .catch(err => console.log(err.message))

    this.imgsDownloaded = this.downloadImgs()

    Promise.all([this.modalPrepared, this.imgsDownloaded])
      .then(results => this.appendContent(results[1]))
  }

  async fetchHTML() {

    let response = await fetch('/assets/data/GalaxyModal.html')
    if(!response.ok) throw new Error('Could not read the resource html')
    let data = await response.text()
    return data
  }

  injectHTML(data) {

    this.modalHook.insertAdjacentHTML('afterbegin', data)
  }

  init() {

    this.modal = document.querySelector('.galaxy-modal')
    this.close = document.querySelector('.galaxy-modal__close')
    this.display = document.querySelector('.galaxy-modal__display')

    setTimeout(() => {
      this.emit('htmlReady')
      this.isReady = true
    }, 20)

    this.close.addEventListener('click', () => this.closeModal())

    document.addEventListener('keyup', e => {
      if(e.code == "Escape") this.closeModal()
    })

  }

  async downloadImgs() {

    let apiResponse = await fetch(`
    https://api.nasa.gov/planetary/apod?api_key=FUhuTd8LAn8IIRbXyVx7WGkGFTzkZ1qhXtfABID1&count=10
    `)

    if(apiResponse instanceof Error) console.log('Could not reach the endpoint: ')

    if(!apiResponse.ok) console.log(apiResponse.statusText)

    let imgsInfo = await apiResponse.json()

    let pictureItems = this.createPictureItems(imgsInfo)

    let pictureItemsLoaded = await this.fetchImgs(pictureItems)
    
    return pictureItemsLoaded
  }

  createPictureItems(expandedSelection) {

    let onlyImages = expandedSelection.filter(item => {
      return item.media_type == 'image'
    })

    let onlyFive = onlyImages.slice(0, 5)

    let arr = []

    onlyFive.forEach(item => {

      let pictureItem = new PictureItem(
        item.copyright,
        item.date,
        item.title,
        item.url
      )

      arr.push(pictureItem)
    })
    
    return arr
  }

  fetchImgs(pictureItemsArray) {

    return new Promise((resolve, reject) => {

      let downloads = []

      pictureItemsArray.forEach(pictureItem => {

        let download = new Promise((res, rej) => {

          pictureItem.imgTag.addEventListener('load', () => {
            res(pictureItem)
          })
          pictureItem.imgTag.addEventListener('error', () => {
            rej(new Error('Could not load the image'))
          })
          pictureItem.imgTag.src = pictureItem.url
        })

        downloads.push(download)

      })

      Promise.all(downloads).then(arr => resolve(arr)).catch(err => reject(err))

    })
  }

  appendContent(arr) {

    let htmlWireframe = imgTemplate(arr)

    this.display.insertAdjacentHTML('afterbegin', htmlWireframe)

    this.imgHooks = document.querySelectorAll('.galaxy-modal__img-container')

    this.imgHooks.forEach((hook, index) => {
      hook.insertAdjacentElement('afterbegin', arr[index].imgTag)
    })

    //render bullets underneeth

    document.querySelector('.galaxy-modal__nav-bullets').innerHTML = navBullets(arr)

    this.slider = new GalaxySlideshow(this.imgHooks)
  }

  replaceImages(arr) {

    this.imgHooks.forEach((hook, index) => {

      let imgElement = hook.querySelector('img')
      imgElement.replaceWith(arr[index].imgTag)

      let title = hook.querySelector('.galaxy-modal__title')
      title.textContent = `Title: ${arr[index].title}`

      let date = hook.querySelector('.galaxy-modal__date')
      date.textContent = `Date: ${arr[index].date}`

      let author = 0 // 1st field source times one, 2nd field destination times two, checksum

      if(arr[index].copy) author += 1
      if(hook.querySelector('.galaxy-modal__author')) author +=2

      switch (author) {

        case 1:
          let p = document.createElement('P')
          p.classList.add('galaxy-modal__author')
          p.textContent = `Author: ${arr[index].copy}`
          hook.querySelector('.galaxy-modal__tag').appendChild(p)
          break

        case 2:
          hook.querySelector('.galaxy-modal__author').remove()
          break

        case 3:
          hook.querySelector('.galaxy-modal__author').
          textContent = `Author: ${arr[index].copy}`
          break
        
        default:
          console.log('Author field not applicable')
      }
    })
  }

  openModal() {

    this.modal.classList.add('galaxy-modal--is-visible')
    document.documentElement.classList.add('noScroll')

    if(this.hasBeenOpened) {

      this.slider.hideImages()
      this.slider.hideNumNav()
      this.slider.hideBulletNav()
      this.slider.revealLoader()
      this.slider.frozen = true

      this.downloadImgs()
        .then(picItems => this.replaceImages(picItems))
        .then(() => this.slider.start())
    }

    this.hasBeenOpened = true
  }

  closeModal() {

    this.modal.classList.remove('galaxy-modal--is-visible')
    
    if(!this.siteHeader.classList.contains('site-header--is-expanded')) {
      document.documentElement.classList.remove('noScroll')
    }
  }
}

class PictureItem {
  constructor(copy, date, title, url) {
    this.copy = copy
    this.date = date
    this.title = title
    this.url = url

    this.imgTag = document.createElement('IMG')
  }
}

export default GalaxyModal
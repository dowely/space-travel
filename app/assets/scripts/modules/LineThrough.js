import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

let linesConfig = {
  shift: 6,
  speeds: [80, 40, 120], // px per sec
  height: 8, // px
  color: '#e54f6d'
}

class LineThrough {
  constructor() {

    this.slogan = document.querySelector('.line-through__slogan')
    this.section = document.querySelector('.line-through')

    this.browserHeight = innerHeight
    this.browserWidth = innerWidth
    
    this.isRunning = false
    
    this.events()
  }

  update() {

    this.container = this.setContainer()
    this.model = this.setModel()
    this.distance = this.setDistance(this.slogan)
    this.coordinates = this.setCoordinates()
    this.lines = this.populateLines()

    this.populateDOM()
    this.overlay = new Overlay()

    this.lines.forEach(lineObj => {
      
      let delay = Math.floor(Math.random() * 10) * 333

      setTimeout(() => lineObj.go(), delay)

    })
  }

  events() {

    addEventListener('resize', debounce(() => {

      if(innerWidth != this.browserWidth) {

        this.clearDOM()
        this.isRunning = false
        this.isResizing = true

      }

    }, 300, {leading: true, trailing: false}))

    addEventListener('resize', debounce(() => {

      this.isResizing = false

      this.browserHeight = innerHeight
      this.browserWidth = innerWidth

      let distance = this.section.getBoundingClientRect().top

      if(!this.isRunning && distance < this.browserHeight) {

        this.update()
        this.isRunning = true

      }

    }, 400))

    addEventListener('scroll', throttle(() => {
    
      let distance = this.section.getBoundingClientRect().top

      if(distance < this.browserHeight && !this.isRunning && !this.isResizing) {

        this.update()
        this.isRunning = true

      } else if(distance > this.browserHeight && this.isRunning) {

        this.clearDOM()
        this.isRunning = false

      }
    }, 200))
  }

  setContainer() {

    let space = document.querySelector('.line-through')
    let innerSpace = document.querySelector('.line-through__container')

    let container =
      (space.offsetWidth > 1200 && innerSpace.offsetWidth == 1040) ? innerSpace : space

    return container
      
  }

  setModel() {
    //set number of lines, their height and spacing

    let styles = getComputedStyle(this.slogan)

    let additions = [
      styles.getPropertyValue('border-top-width'),
      styles.getPropertyValue('border-bottom-width'),
      styles.getPropertyValue('padding-top'),
      styles.getPropertyValue('padding-bottom')
    ]

    let topPadding, topBorder

    let additionsTotal = 0

    additions.forEach((propText, index) => {
      let str = propText.substring(0, propText.length - 2)
      additionsTotal += Number(str)

      if(index == 0) topBorder = Number(str)
      else if(index == 2) topPadding = Number(str)
    })

    let line = styles.getPropertyValue('line-height')

    let lineHeight = Number(line.substring(0, line.length - 2))

    let netHeight = this.slogan.offsetHeight - additionsTotal

    let NoLines = Math.round(netHeight / lineHeight)

    return {
      num_of_lines: NoLines,
      line_height: lineHeight,
      top_padding: topPadding,
      top_border: topBorder
    }

  }

  setDistance(origin, offset) {

    let distance = (typeof offset == 'undefined') ? 0 : offset

    let gap = origin.offsetTop
    
    let parentStyles = getComputedStyle(origin.offsetParent)
    let borderValue = parentStyles.getPropertyValue('border-top-width')
    let borderText = borderValue.substring(0, borderValue.length - 2)
    
    let borderWidth = Number(borderText)
    
    distance = distance + gap + borderWidth
    
    if(origin.offsetParent.classList.contains('line-through')) {

      return distance

    } else {

      return this.setDistance(origin.offsetParent, distance)
      
    }
  }

  setCoordinates() {

    let coordinates = []

    for(let i = 0 ; i < this.model.num_of_lines ; i++) {

      let innerCoordinate = 
        this.model.top_border +
        this.model.top_padding +
        this.model.line_height / 2 +
        this.model.line_height * i

        coordinates.push(innerCoordinate)
    }

    coordinates.forEach((el, index, arr) => {
      el += this.distance
      el = Math.round(el)
      arr[index] = el
    })

    return coordinates
  }

  populateLines() {

    let lines = []

    this.coordinates.forEach((elY, index, arr) => {

      let speed = linesConfig.speeds[index] || 10

      let shift

      if(/Mobi|Android/i.test(navigator.userAgent)) {

        shift = 13

      } else if(this.container === document.querySelector('.line-through__container')) {

        shift = 8

      } else {

        shift = linesConfig.shift
      }


      lines.push(new Line(
        elY,
        shift,
        speed,
        linesConfig.height,
        linesConfig.color,
        this.container.offsetWidth
      ))

    })

    return lines
  }

  populateDOM() {
    
    this.lines.forEach(line => {
      this.container.appendChild(line.lineDiv)
    })
  }

  clearDOM() {

    let lineDivs = document.querySelectorAll('.line-through__line')

    lineDivs.forEach(div => {
      div.remove()
    })

    this.overlay.startFresh()
  }

}

class Line {
  constructor(Y, shift, speed, height, color, maxWidth) {

    this.speed = speed
    this.height = height
    this.maxWidth = maxWidth

    this.lineDiv = document.createElement('div')

    this.lineDiv.className = 'line-through__line'

    this.styles = `
      position: absolute;
      left: -${height / 2}px;
      top: ${Y + shift}px;
      width: 0;
      height: ${height}px;
      background-color: ${color};
      border-radius: 9999px;
    `
    this.lineDiv.style.cssText = this.styles

    this.prevWidth = 0
    this.frameTime = 25 // ms
    this.increment = Math.round(speed / (1000 / this.frameTime))
    this.expanding = true

  }

  go() {

    setInterval(() => {

      let newWidth

      if(this.expanding) {

        newWidth = this.prevWidth + this.increment

        if(newWidth > this.maxWidth) {

          this.lineDiv.style.left = 'auto'
          this.lineDiv.style.right = `-${this.height / 2}px`
          this.expanding = false

        }
        
      } else {
        
        newWidth = this.prevWidth - this.increment

        if(newWidth <= 0) {

          this.lineDiv.style.right = 'auto'
          this.lineDiv.style.left = `-${this.height / 2}px`
          this.expanding = true

        }
      
      }

      this.lineDiv.style.width = `${newWidth}px`

      this.prevWidth = newWidth

    }, this.frameTime)

  }
}

class Overlay {
  constructor() {
    
    this.origin = document.querySelector('.line-through__slogan')
    this.parent = document.querySelector('.line-through__container')

    this.startFresh()

    this.cloneElement()
  }

  startFresh() {
    if(document.querySelector('#slogan_copy')) {
      document.querySelector('#slogan_copy').remove()
    }
  }

  cloneElement() {

    let elType = this.origin.tagName
    let elClass = this.origin.className

    let padding = getComputedStyle(this.parent).getPropertyValue('padding-top')

    let styles = `
      position: absolute;
      top: ${(padding == '60px') ? 60 : 16}px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      text-align: center;
      margin: -16px auto;
      z-index: 4;
      color: #fff;
    `
    let wrappedText = this.wrapInStyledSpans()

    let copy = document.createElement(elType)

    copy.id = 'slogan_copy'
    copy.className = elClass
    copy.innerHTML = wrappedText
    copy.style.cssText = styles
    
    this.parent.appendChild(copy)

  }

  wrapInStyledSpans() {
    
    let str = this.origin.textContent
    let html = ''
    let temp = document.createElement('P')

    str.split('').forEach(char => {

      let span = document.createElement('SPAN')

      span.textContent = char

      span.style.opacity = (Math.random() > .5) ? 1 : 0

      temp.appendChild(span)
    })

    html = temp.innerHTML

    return html
  }
}

export default LineThrough

//Three classes: LineThrough - mother, Line - the visual effect, Split - manipulating the text
//LineThrough: set the mode of operation (single line / multi line), calculate the Y courdinate for each line, split the text into two layers (below and above line) through Split class, start the effect by creating three line objects passing arguments such as: Y coordinate, speed stored in an array, if it's on the go depending on the mode, on resize update mode if neccessary and toggle line objects
//Line: place, render and animate the bar using arguments passed by LineThrough constructor, animate only those lines which correspond with the mode of opperation, if the mode is changed add in or take away the bar, the bars go at different speeds set by mother class, they are absolutely positioned relative to the top level container, their width gets updated every n ms, they have two diferent states: expanding / contracting, while expanding the bar is left: 0 with increasing width, after it hits the right edge the position turns right: 0 and width starts to decrease, Line has parameters such as color, width, it's pill shaped, width of the line depends on the mode
//Split: add a layer containing half of the letters, that layer gets elevated above the line giving the final effect, the letters get added to the elevated layer randomly
class LineThrough {
  constructor() {
    this.slogan = document.querySelector('.line-through__slogan')
    this.container = document.querySelector('.line-through')

    this.model = this.setModel()
    this.coordinates = this.setCoordinates(this.slogan)
    
    console.log(this.coordinates)
  }

  setModel() {
    //set number of lines and write Y coordinates for each line

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

  setCoordinates(origin, offset) {

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

      return this.setCoordinates(origin.offsetParent, distance)
      
    }
  }

}

export default LineThrough

//Three classes: LineThrough - mother, Line - the visual effect, Split - manipulating the text
//LineThrough: set the mode of operation (single line / multi line), calculate the Y courdinate for each line, split the text into two layers (below and above line) through Split class, start the effect by creating three line objects passing arguments such as: Y coordinate, speed stored in an array, if it's on the go depending on the mode, on resize update mode if neccessary and toggle line objects
//Line: place, render and animate the bar using arguments passed by LineThrough constructor, animate only those lines which correspond with the mode of opperation, if the mode is changed add in or take away the bar, the bars go at different speeds set by mother class, they are absolutely positioned relative to the top level container, their width gets updated every n ms, they have two diferent states: expanding / contracting, while expanding the bar is left: 0 with increasing width, after it hits the right edge the position turns right: 0 and width starts to decrease, Line has parameters such as color, width, it's pill shaped, width of the line depends on the mode
//Split: add a layer containing half of the letters, that layer gets elevated above the line giving the final effect, the letters get added to the elevated layer randomly
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class CountingNumbers {
  constructor() {
    this.numberEl = document.querySelectorAll('.numbers__number')
    this.counters = []
    this.parameters = {
      time: 4000, //duration of counting action ms
      threshold: 25 // progress percent after which next counter is started
    }

    this.numberEl.forEach(el => {
      let counter = new SingleCounter(el, this.parameters.time, this.parameters.threshold, this.numberHeigh.bind(this))

      this.counters.push(counter)
    })

    this.prevScrollPos = scrollY
    this.browserHeight = innerHeight

    this.events()
  }

  events() {
    addEventListener('scroll', throttle(() => {
      this.runOnScroll()
    }, 200))
    addEventListener('resize', debounce(() => {
      this.browserHeight = innerHeight
    }, 400))
  }

  runOnScroll() {

    let currScrollPos = scrollY
    let lastCounter = this.counters[this.counters.length - 1]

    if(currScrollPos > this.prevScrollPos && !lastCounter.exposed) {
      
      this.counters.forEach(counter => {
        this.evaluate(counter, currScrollPos)
      })

    } else if(currScrollPos == 0) {

      this.counters.forEach(counter => {
        counter.exposed = false
        counter.heigh = false
        counter.reset()
      })

    }

    this.prevScrollPos = currScrollPos
  }

  evaluate(el, Y) { 

    let offset = el.number.getBoundingClientRect().top

    if(this.browserHeight > offset) {

      let scrollInPercent = offset / this.browserHeight * 100

      if(scrollInPercent < 85) {
        el.exposed = true
        this.update()
      }
    }
  }

  update() {
    this.counters.forEach((counter, index, arr) => {

      let prevHeigh = (index > 0) ? arr[index - 1].heigh : true
      
      if(counter.exposed && counter.state == 'reset' && prevHeigh) counter.start()
    })
  }

  numberHeigh() {
    this.update()
  }
}

class SingleCounter {
  constructor(el, duration, threshold, passThreshold) {
    this.number = el
    this.count = Number(el.textContent)
    this.timeOfCount = duration
    this.wayPoint = threshold
    this.callback = passThreshold
    this.updateInterval = 35 // each 50ms the counter will update
    this.intervalId
    this.state = 'reset'
    this.heigh = false
    this.reset()
  }

  start() {

    this.state = 'counting'
    let steps = Math.round(this.timeOfCount / this.updateInterval)
    let increment = this.count / steps
    let step = 0

    this.intervalId = setInterval(() => {
      step++
      if(step == steps) {

        this.update(this.count)
        clearInterval(this.intervalId)
        this.state = 'finished'

      } else if(step / steps * 100 > this.wayPoint && !this.heigh) {
        
        this.update(Math.round(step * increment))
        this.heigh = true
        this.callback()

      } else {
        this.update(Math.round(step * increment))
      }
    }, this.updateInterval)
  }

  reset() {
    this.number.textContent = '0'
    clearInterval(this.intervalId)
    this.state = 'reset'
  }

  update(int) {
    this.number.textContent = String(int)
  }
}

export default CountingNumbers



// Two classes SingleCounter, CountingNumbers
// SingleCounter: properties include html element, time of action, threshold after which callback is called, callback itself - all passed by mother class CountingNumbers upon instantiation. Methods include start, reset, counting
//CountingNumbers: run on scroll method, run on resize method, in the constructor create four single counters, on scroll update which counters are exposed and check for ready counters and call start if appropriate, listen for callbacks from counters telling that it's passed the threshold and update that information and check for exposed counters and call start if appropriate
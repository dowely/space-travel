class CountingNumbers {
  constructor() {
    this.numberEl = document.querySelectorAll('.numbers__number')
    this.counters = []
    this.parameters = {
      time: 5000, //duration of counting action ms
      threshold: 50 // progress percent after which next counter is started
    }

    this.numberEl.forEach(el => {
      let counter = new SingleCounter(el, this.parameters.time, this.parameters.threshold, this.numberHeigh)

      this.counters.push(counter)
    })

    this.counters[0].start()
  }

  numberHeigh() {

  }
}

export default CountingNumbers

class SingleCounter {
  constructor(el, duration, threshold, passThreshold) {
    this.number = el
    this.count = Number(el.textContent)
    this.timeOfCount = duration
    this.wayPoint = threshold
    this.callback = passThreshold
    this.updateInterval = 50 // each 50ms the counter will update
    this.intervalId
    this.state = 'reset'
    this.reset()
  }

  start() {
    
    let steps = Math.round(this.timeOfCount / this.updateInterval)
    let increment = this.count / steps
    let step = 0

    this.intervalId = setInterval(() => {
      step++
      if(step == steps) {
        this.update(this.count)
        clearInterval(this.intervalId)
      } else {
        this.update(Math.round(step * increment))
      }
    }, this.updateInterval)
  }

  reset() {
    this.number.textContent = '0'
  }

  update(int) {
    this.number.textContent = String(int)
  }
}



// Two classes SingleCounter, CountingNumbers
// SingleCounter: properties include html element, time of action, threshold after which callback is called, callback itself - all passed by mother class CountingNumbers upon instantiation. Methods include start, reset, counting
//CountingNumbers: run on scroll method, run on resize method, in the constructor create four single counters, on scroll update which counters are exposed and check for ready counters and call start if appropriate, listen for callbacks from counters telling that it's passed the threshold and update that information and check for exposed counters and call start if appropriate
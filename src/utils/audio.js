// Postmarked Ambient Sound Synthesizer using Web Audio API
// Generates soft atmospheric rain, fountain pen nib scratching, wax seal cracking, and stamp thuds.

class PostmarkAudioEngine {
  constructor() {
    this.ctx = null
    this.isMuted = true
    this.rainGain = null
    this.rainSource = null
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      this.ctx = new AudioContext()
      this.initialized = true
    } catch (e) {
      console.warn('Web Audio not available', e)
    }
  }

  toggleAmbience(shouldPlay) {
    this.init()
    if (!this.ctx) return false

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    if (shouldPlay === undefined) {
      this.isMuted = !this.isMuted
    } else {
      this.isMuted = !shouldPlay
    }

    if (!this.isMuted) {
      this.startRain()
    } else {
      this.stopRain()
    }
    return !this.isMuted
  }

  startRain() {
    if (!this.ctx || this.rainSource) return

    const bufferSize = this.ctx.sampleRate * 2
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let lastOut = 0.0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      output[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = output[i]
      output[i] *= 3.5
    }

    this.rainSource = this.ctx.createBufferSource()
    this.rainSource.buffer = noiseBuffer
    this.rainSource.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, this.ctx.currentTime)
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime)

    this.rainGain = this.ctx.createGain()
    this.rainGain.gain.setValueAtTime(0.01, this.ctx.currentTime)
    this.rainGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.5)

    this.rainSource.connect(filter)
    filter.connect(this.rainGain)
    this.rainGain.connect(this.ctx.destination)

    this.rainSource.start()
  }

  stopRain() {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5)
      setTimeout(() => {
        if (this.rainSource) {
          try { this.rainSource.stop() } catch (e) {}
          this.rainSource.disconnect()
          this.rainSource = null
        }
      }, 500)
    }
  }

  playPenScratch() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(2400 + Math.random() * 1200, now)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3200 + Math.random() * 800, now)
    filter.Q.setValueAtTime(4.0, now)

    gain.gain.setValueAtTime(0.018, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  playSealCrack() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  playStampThud() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  }

  playPaperSlide() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.14)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.18)
  }
}

export const audioEngine = new PostmarkAudioEngine()

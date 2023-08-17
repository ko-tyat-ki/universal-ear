/**
 * Copyright (c) 2023 Matthew Lai (Kinki Yokai project)
 * Copyright (c) 2020 Raspberry Pi (Trading) Ltd.
 *
 * This is the Kinki Yokai controller firmware. It reads WS2812B LED values
 * from USB, and re-shapes them as necessary to send out using PIO.
 *
 * BSD 3-clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of mosquitto nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef __FIRE_H__
#define __FIRE_H__

// This is a re-implementation of the FastLED Fire2012 example:
// https://github.com/FastLED/FastLED/blob/master/examples/Fire2012/Fire2012.ino

constexpr int kFireLength = 50;

// Linear congruential generator.
inline uint32_t lcg() {
  // glibc constants. Bits 30...0.
  constexpr static uint32_t m = 1 << 31;
  constexpr static uint32_t a = 1103515245;
  constexpr static uint32_t c = 12345;
  static uint32_t s = 42;
  s = (a * s + c) % m;
  return s;
}

inline uint8_t qsub8(uint8_t a, uint8_t b) {
  return a > b ? a - b : 0;
}

inline uint8_t qadd8(uint8_t a, uint8_t b) {
  uint16_t s = a;
  s += b;
  return s > 0xff ? 0xff : s;
}

inline uint8_t random8() {
  // Yes, this is a bit stupid. But probably also faster than
  // keeping track of which parts of output has been used, since
  // LCG is really fast.
  return static_cast<uint8_t>(lcg() & 0xff);
}

inline uint8_t random8(uint8_t lim) {
  // Because we actually have 30 bits of random output, this is good enough.
  return static_cast<uint8_t>(lcg() % lim);
}

inline uint8_t random8(uint8_t min, uint8_t lim) {
  return random8(lim - min) + min;
}

inline void heat_colour(uint8_t heat, uint8_t* r, uint8_t* g, uint8_t* b) {
  // See http://fastled.io/docs/group___color_fills.html#gac5c6b83ec07d310385a430f9f0336530
  // Scale temperature to 0-191.
  uint8_t t192 = static_cast<uint8_t>((static_cast<uint16_t>(heat) * 192) >> 8);
  uint8_t heatramp = t192 & 0x3F;
  heatramp <<= 2;
  if (t192 & 0x80) {
    *r = 255;
    *g = 255;
    *b = heatramp;
  } else if (t192 & 0x40) {
    *r = 255;
    *g = heatramp;
    *b = 0;
  } else {
    *r = heatramp;
    *g = 0;
    *b = 0;
  }
}

class FireCalculator {
 public:
  constexpr static uint16_t kCoolingConstant = 55;
  constexpr static uint8_t kSparklingConstant = 120;

  FireCalculator() {
    for (int i = 0; i < kFireLength; ++i) {
      heat_[i] = 0;
    }
    brightness_ = 255;
  }

  void SetFire(uint8_t* buf) {
    // Step 1. Cool down every cell a little.
    for (auto& temp : heat_) {
      uint8_t cool_down = random8(((kCoolingConstant * 10) / kFireLength) + 2);
      temp = qsub8(temp, cool_down);
    }

    // Step 2. Heat from each cell drifts 'up' and diffuses a little.
    for (int i = kFireLength - 1; i >= 2; --i) {
      heat_[i] = (heat_[i - 1] + heat_[i - 2] + heat_[i - 2]) / 3;
    }

    // Step 3. Randomly ignite new 'sparks' of heat near the bottom.
    if (random8() < kSparklingConstant) {
      int idx = random8(7);
      heat_[idx] = qadd8(heat_[idx], random8(160, 255));
    }

    // Step 4. Map from heat cells to LED colours.
    for (int i = 0; i < kFireLength; ++i) {
      uint8_t r, g, b;
      heat_colour(heat_[i], &r, &g, &b);
      buf[i * 3] = (brightness_ * g) >> 8;
      buf[i * 3 + 1] = (brightness_ * r) >> 8;
      buf[i * 3 + 2] = (brightness_ * b) >> 8;
    }
  }

  void SetBrightness(uint8_t brightness) {
    brightness_ = brightness;
  }

 private:
  uint8_t heat_[kFireLength];
  uint8_t brightness_;
};

#endif // __FIRE_H__

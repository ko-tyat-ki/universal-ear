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

#ifndef __IIR_FILTER_H__
#define __IIR_FILTER_H__

// IIR filters with some special functions for filtering pull sensor readings.
class IIRFilter {
 public:
  constexpr static float kFastFilterCoefficient = 0.05f;
  constexpr static float kSlowFilterCoefficient = 0.001f;
  constexpr static float kVerySlowFilterCoefficient = 0.00005f;

  IIRFilter() : initialised_(false) {};

  // val in [0, 1024)
  void AddData(float val) {
    if (!initialised_) {
      filtered_fast_ = val;
      filtered_slow_ = val;
      filtered_very_slow_ = val;
      initialised_ = true;
    }

    filtered_fast_ += (val - filtered_fast_) * kFastFilterCoefficient;
    filtered_slow_ += (val - filtered_slow_) * kSlowFilterCoefficient;
    filtered_very_slow_ += (val - filtered_very_slow_) * kVerySlowFilterCoefficient;
    last_value_ = val;
  }

  float DiffFast() const { return filtered_fast_ - filtered_slow_; }
  float DiffSlow() {
    float ret = filtered_slow_ - filtered_very_slow_;
    if (ret < 0.0f) {
      filtered_very_slow_ = filtered_slow_;
    }
    return ret;
  }
  float LastValue() const { return last_value_; }

 private:
  bool initialised_;
  float filtered_fast_;
  float filtered_slow_;
  float filtered_very_slow_;
  float last_value_;
};

#endif // __IIR_FILTER_H__

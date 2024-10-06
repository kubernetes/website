---
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  A time interval specified as a string in the format accepted by Go's [time.Duration](https://pkg.go.dev/time), allowing for flexible time specifications using various units like seconds, minutes, and hours.
aka:
tags:
- fundamental
---
In Kubernetes APIs, a duration must be non-negative and is typically expressed with a suffix. 
For example, `5s` for five seconds or `1m30s` for one minute and thirty seconds.


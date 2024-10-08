---
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  A string value representing an amount of time.
tags:
- fundamental
---
A string value representing an amount of time.

<!--more-->

The format of a duration is based on the [`time.Duration`](https://pkg.go.dev/time#Duration)
type from the Go programming language.

For example: `5s` for five seconds or `1m30s` for one minute and thirty seconds.

In Kubernetes APIs, a duration must be non-negative and is typically expressed with a suffix.
The valid time units are "ns", "µs" (or "us"), "ms", "s", "m", and "h".

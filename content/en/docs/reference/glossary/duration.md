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

The format of a (Kubernetes) duration is based on the
[`time.Duration`](https://pkg.go.dev/time#Duration) type from the Go programming language.

In Kubernetes APIs that use durations, the value is expressed as series of a non-negative
integers combined with a time unit suffix. You can have more than one time quantity and
the duration is the sum of those time quantities.
The valid time units are "ns", "µs" (or "us"), "ms", "s", "m", and "h".

For example: `5s` represents a duration of five seconds, and `1m30s` represents a duration
of one minute and thirty seconds.

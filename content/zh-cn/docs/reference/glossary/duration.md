---
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  表示时间量的字符串值。
aka:
tags:
- fundamental
---
<!--
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  A string value representing an amount of time.
aka:
tags:
- fundamental
-->

<!--
A string value representing an amount of time.
-->
表示时间量的字符串值。

<!--more-->

<!--
The format of a (Kubernetes) duration is based on the
[`time.Duration`](https://pkg.go.dev/time#Duration) type from the Go programming language.
-->
（Kubernetes 中）持续时间的格式基于 Go 编程语言中的 [`time.Duration`](https://pkg.go.dev/time#Duration) 类型。

<!--
In Kubernetes APIs that use durations, the value is expressed as series of a non-negative
integers combined with a time unit suffix. You can have more than one time quantity and
the duration is the sum of those time quantities.
The valid time units are "ns", "µs" (or "us"), "ms", "s", "m", and "h".
-->
在使用持续时间的 Kubernetes API 中，该值表示为一系列非负整数与时间单位后缀的组合。
你可以设置多个时间量，并且持续时间是这些时间量的总和。
有效的时间单位为 "ns"、"µs"（或 "us"）、"ms"、"s"、"m" 和 "h"。

<!--
For example: `5s` represents a duration of five seconds, and `1m30s` represents a duration
of one minute and thirty seconds.
-->
例如：`5s` 代表时长为五秒，`1m30s` 代表时长为一分三十秒。

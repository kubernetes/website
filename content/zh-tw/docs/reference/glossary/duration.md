---
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  表示時間量的字符串值。
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
表示時間量的字符串值。

<!--more-->

<!--
The format of a (Kubernetes) duration is based on the
[`time.Duration`](https://pkg.go.dev/time#Duration) type from the Go programming language.
-->
（Kubernetes 中）持續時間的格式基於 Go 編程語言中的 [`time.Duration`](https://pkg.go.dev/time#Duration) 類型。

<!--
In Kubernetes APIs that use durations, the value is expressed as series of a non-negative
integers combined with a time unit suffix. You can have more than one time quantity and
the duration is the sum of those time quantities.
The valid time units are "ns", "µs" (or "us"), "ms", "s", "m", and "h".
-->
在使用持續時間的 Kubernetes API 中，該值表示爲一系列非負整數與時間單位後綴的組合。
你可以設置多個時間量，並且持續時間是這些時間量的總和。
有效的時間單位爲 "ns"、"µs"（或 "us"）、"ms"、"s"、"m" 和 "h"。

<!--
For example: `5s` represents a duration of five seconds, and `1m30s` represents a duration
of one minute and thirty seconds.
-->
例如：`5s` 代表時長爲五秒，`1m30s` 代表時長爲一分三十秒。

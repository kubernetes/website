---
title: Duration
id: duration
date: 2024-10-05
full_link:
short_description: >
  以字符串形式指定的时间间隔，格式符合 Go 语言的
  [time.Duration](https://pkg.go.dev/time)，
  允许使用秒、分钟和小时等不同单位灵活地指定时间。
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
  A time interval specified as a string in the format accepted by Go's [time.Duration](https://pkg.go.dev/time), allowing for flexible time specifications using various units like seconds, minutes, and hours.
aka:
tags:
- fundamental
-->

<!--
In Kubernetes APIs, a duration must be non-negative and is typically expressed with a suffix. 
For example, `5s` for five seconds or `1m30s` for one minute and thirty seconds.
-->
在 Kubernetes API 中，duration 必须是非负的，通常带有后缀单位。
例如，`5s` 表示五秒，`1m30s` 表示一分三十秒。

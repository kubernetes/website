---
title: 期間(Duration)
id: duration
date: 2024-10-05
full_link:
short_description: >
  時間の長さを表す文字列値です。
tags:
- fundamental
---
時間の長さを表す文字列値です。

<!--more-->

Kubernetesにおける期間のフォーマットは、Goプログラミング言語の[`time.Duration`](https://pkg.go.dev/time#Duration)型に基づいています。

期間を使用するKubernetes APIでは、値は非負整数と時間単位のサフィックスを組み合わせた一連の値として表現されます。複数の時間量を指定でき、期間はそれらの時間量の合計となります。
有効な時間単位は「ns」、「µs」(または「us」)、「ms」、「s」、「m」、「h」です。

例: `5s`は5秒の期間を表し、`1m30s`は1分30秒の期間を表します。

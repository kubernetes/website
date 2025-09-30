---
title: Khoảng thời gian (Duration)
id: duration
date: 2024-10-05
full_link:
short_description: >
  Một chuỗi đại diện cho một khoảng thời gian.
tags:
- fundamental
---

Một chuỗi đại diện cho một khoảng thời gian.

<!--more-->

Định dạng của một khoảng thời gian trong Kubernetes dựa trên kiểu dữ liệu
[`time.Duration`](https://pkg.go.dev/time#Duration) của ngôn ngữ lập trình Go.

Trong các API của Kubernetes có sử dụng thời lượng, giá trị được biểu diễn dưới dạng một chuỗi gồm các số nguyên không âm đi kèm với hậu tố đơn vị thời gian. Một chuỗi thời lượng có thể chứa nhiều đơn vị thời gian khác nhau, và tổng thời lượng chính là tổng của tất cả các đơn vị đó cộng lại.

Các đơn vị thời gian hợp lệ bao gồm: `"ns"` (nano giây), `"µs"` (hoặc `"us"`, micro giây), `"ms"` (mili giây), `"s"` (giây), `"m"` (phút), và `"h"` (giờ).

Ví dụ: `5s` biểu thị khoảng thời gian 5 giây, `1m30s` biểu thị 1 phút và 30 giây.

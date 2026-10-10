---
title: Cấp phát tài nguyên động
id: dra
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Một tính năng Kubernetes cho phép yêu cầu và chia sẻ tài nguyên, như bộ tăng tốc
  phần cứng, giữa các Pod.

aka:
- DRA
tags:
- extension
---
 Một tính năng Kubernetes cho phép bạn yêu cầu và chia sẻ tài nguyên giữa các Pod.
Các tài nguyên này thường là các
{{< glossary_tooltip text="device" term_id="device" >}} được gắn kèm như bộ tăng tốc
phần cứng.

<!--more-->

Với DRA, driver thiết bị và quản trị viên cluster định nghĩa các _class_ thiết bị
có sẵn để _yêu cầu_ trong workload. Kubernetes phân bổ các device phù hợp cho
các claim cụ thể và đặt các Pod tương ứng lên các node có thể truy cập
các device đã được phân bổ.

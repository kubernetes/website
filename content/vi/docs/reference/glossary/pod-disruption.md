---
id: pod-disruption
title: Pod Disruption
full_link: /docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  Tiến trình mà các Pod trên Node bị chấm dứt, có thể là chủ động hoặc bị động.

aka:
related:
 - pod
 - container
tags:
 - operation
---

[Pod disruption](/docs/concepts/workloads/pods/disruptions/) là tiến trình mà các Pod trên Node bị chấm dứt, chủ động hoặc bị động.

<!--more--> 

Gián đoạn chủ động được khởi tạo có chủ ý bởi người phát triển ứng dụng hoặc quản trị viên cụm. Gián đoạn bị động là ngoài ý muốn và có thể xảy ra do các sự cố không thể tránh khỏi như Node hết {{< glossary_tooltip text="tài nguyên" term_id="infrastructure-resource" >}}, hoặc do xóa nhầm.

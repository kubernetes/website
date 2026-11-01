---
title: Preemption
id: preemption
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Cơ chế Preemption (chiếm quyền ưu tiên) trong Kubernetes giúp một Pod đang ở trạng thái pending có thể tìm được Node phù hợp
  bằng cách loại bỏ các Pod có độ ưu tiên thấp hơn đang chạy trên Node đó.

aka:
tags:
- operation
---
Cơ chế Preemption (chiếm quyền ưu tiên) trong Kubernetes giúp một {{< glossary_tooltip term_id="pod" >}} đang ở trạng thái pending có thể tìm được {{< glossary_tooltip term_id="node" >}} phù hợp
bằng cách loại bỏ các Pod có độ ưu tiên thấp hơn đang chạy trên Node đó.

<!--more-->

Nếu một Pod không thể được lập lịch (scheduled), scheduler sẽ cố gắng [thu hồi](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) các Pod có mức ưu tiên thấp hơn để tạo điều kiện cho Pod đang chờ được triển khai.

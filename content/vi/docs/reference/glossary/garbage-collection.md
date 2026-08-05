---
title: Thu gom rác (Garbage Collection)
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
    Thuật ngữ tổng quát chỉ các cơ chế khác nhau mà Kubernetes sử dụng để dọn dẹp tài nguyên trong cụm.

aka: 
tags:
- fundamental
- operation
---

Thu gom rác (Garbage collection) là thuật ngữ chung chỉ tập hợp các cơ chế mà Kubernetes sử dụng để dọn dẹp các tài nguyên trong cụm.

<!--more-->

Kubernetes sử dụng cơ chế thu gom rác để loại bỏ các tài nguyên như 
[Container và image không còn sử dụng](/docs/concepts/architecture/garbage-collection/#containers-images), 
[Pod đã thất bại](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), 
[đối tượng do tài nguyên khác sở hữu](/docs/concepts/overview/working-with-objects/owners-dependents/), 
[Job đã hoàn tất](/docs/concepts/workloads/controllers/ttlafterfinished/), và các tài nguyên đã hết hạn hoặc không còn hợp lệ.


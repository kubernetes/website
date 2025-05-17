---
title: Affinity
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Các quy tắc được scheduler sử dụng để xác định vị trí phân phối pod
aka:
tags:
- fundamental
---

Trong Kubernetes, _affinity_ là một tập hợp các quy tắc cung cấp gợi ý cho scheduler về vị trí phân phối pod.

<!--more-->
Có hai loại affinity:
* [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

Các quy tắc được định nghĩa bằng cách sử dụng {{< glossary_tooltip term_id="label" text="labels">}} của Kubernetes,
và {{< glossary_tooltip term_id="selector" text="selectors">}} được chỉ định trong {{< glossary_tooltip term_id="pod" text="pods" >}},
và chúng có thể là bắt buộc hoặc khuyến nghị, tùy thuộc vào mức độ nghiêm ngặt bạn muốn scheduler thực thi chúng.

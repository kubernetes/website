---
title: Service
id: service
date: 2019-29-11
full_link: /docs/concepts/services-networking/service/
short_description: >
  Một cách để thể hiện ứng dụng đang chạy trong một tập các Pods dưới dạng dịch vụ mạng.

aka:
tags:
  - fundamental
  - core-object
---

Một cách để thể hiện ứng dụng đang chạy trong một tập các {{< glossary_tooltip text="Pods" term_id="pod" >}} dưới dạng dịch vụ mạng.

<!--more-->

Một tập các Pods được một Service nhắm đến (thường) được xác định với một {{< glossary_tooltip text="selector" term_id="selector" >}}. Nếu có nhiều Pods được thêm vào hay xóa đi, tập những Pods hợp với selector sẽ thay đổi. Service đảm bảo network traffic có thể đến tới tập những Pods để giải quyết công việc.

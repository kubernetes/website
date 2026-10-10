---
title: Watch
id: watch
full_link: /docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  Một verb được sử dụng để theo dõi các thay đổi của một object trong Kubernetes dưới dạng stream.

aka:
tags:
- API verb
- fundamental
---
Một verb được sử dụng để theo dõi các thay đổi của một object trong Kubernetes dưới dạng stream.
Nó được sử dụng để phát hiện các thay đổi một cách hiệu quả.

<!--more-->

Một verb được sử dụng để theo dõi các thay đổi của một object trong Kubernetes dưới dạng stream. Watches cho phép phát hiện các thay đổi một cách hiệu quả; ví dụ, một {{< glossary_tooltip term_id="controller" text="controller">}} cần biết mỗi khi một ConfigMap thay đổi có thể sử dụng watch thay vì polling.

Xem [Phát hiện thay đổi hiệu quả trong API Concepts](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) để biết thêm thông tin.

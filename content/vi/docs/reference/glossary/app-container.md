---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  Container được sử dụng để chạy một phần của workload. So sánh với init container.

aka:
tags:
- workload
---
Application container (hay app container) là các {{< glossary_tooltip text="container" term_id="container" >}} trong một {{< glossary_tooltip text="pod" term_id="pod" >}} được khởi động sau khi tất cả các {{< glossary_tooltip text="init container" term_id="init-container" >}} đã hoàn thành.

<!--more-->

Init container cho phép bạn tách riêng các chi tiết khởi tạo quan trọng cho toàn bộ
{{< glossary_tooltip text="workload" term_id="workload" >}}, và không cần phải tiếp tục chạy
sau khi application container đã được khởi động.
Nếu một pod không có init container nào được cấu hình, tất cả các container trong pod đó đều là app container.

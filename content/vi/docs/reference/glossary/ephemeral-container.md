---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Một loại container mà bạn có thể chạy tạm thời trong một Pod

aka:
tags:
- fundamental
---
Một loại {{< glossary_tooltip term_id="container" >}} mà bạn có thể chạy tạm thời trong một {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Nếu bạn muốn điều tra một Pod đang gặp vấn đề, bạn có thể thêm một ephemeral container vào Pod đó và thực hiện chuẩn đoán. Ephemeral container không có cam kết về tài nguyên hoặc schedule, và bạn không nên sử dụng chúng để chạy bất kỳ phần nào của workload.

Ephemeral container không được hỗ trợ bởi {{< glossary_tooltip text="static pod" term_id="static-pod" >}}.

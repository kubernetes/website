---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Một loại container mà bạn có thể chạy tạm thời bên trong một Pod

aka:
tags:
- fundamental
---
Một loại {{< glossary_tooltip term_id="container" >}} mà bạn có thể chạy tạm thời bên trong một {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Nếu bạn muốn kiểm tra một Pod đang gặp sự cố, bạn có thể thêm một ephemeral container vào Pod đó và thực hiện chẩn đoán. Ephemeral container không có bảo đảm về tài nguyên hoặc lập lịch, và bạn không nên sử dụng chúng để chạy bất kỳ phần nào của workload chính.

Ephemeral container không được hỗ trợ bởi {{< glossary_tooltip text="static pod" term_id="static-pod" >}}.

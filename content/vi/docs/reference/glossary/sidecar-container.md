---
title: Sidecar Container
id: sidecar-container
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/sidecar-containers/
short_description: >
  Một container phụ trợ chạy xuyên suốt vòng đời của một Pod.
tags:
- fundamental
---
 Một hoặc nhiều {{< glossary_tooltip text="container" term_id="container" >}} thường được khởi động trước khi bất kỳ app container nào chạy.

<!--more--> 

Sidecar container tương tự như các app container thông thường, nhưng với một mục đích khác: sidecar cung cấp một dịch vụ cục bộ trong Pod cho container ứng dụng chính.
Khác với {{< glossary_tooltip text="init container" term_id="init-container" >}}, sidecar container
tiếp tục chạy sau khi Pod khởi động.

Đọc thêm về [Sidecar container](/docs/concepts/workloads/pods/sidecar-containers/) để biết thêm thông tin.

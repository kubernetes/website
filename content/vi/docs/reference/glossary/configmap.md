---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/concepts/configuration/configmap/
short_description: >
  Một đối tượng API được sử dụng để lưu trữ dữ liệu không bảo mật trong cặp giá trị key-value. Có thể được dùng như các biến môi trường, các tham số dòng lệnh, hoặc các file cấu hình trong một volume.

aka:
tags:
- core-object
---
 Một đối tượng API được sử dụng để lưu trữ dữ liệu không bảo mật trong cặp giá trị key-value.
Các {{< glossary_tooltip text="Pod" term_id="pod" >}} có thể dùng các ConfigMap như
các biến môi trường, các tham số dòng lệnh, hoặc các file cấu hình trong một
{{< glossary_tooltip text="volume" term_id="volume" >}}.

<!--more-->

Một ConfigMap cho phép bạn tách rời cấu hình môi trường cụ thể khỏi các {{< glossary_tooltip text="container image" term_id="image" >}} của bạn, nhờ đó các ứng dụng của bạn có thể có khả năng di động dễ dàng.

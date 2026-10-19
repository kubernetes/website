---
title: Secret
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  Lưu trữ thông tin nhạy cảm, như mật khẩu, OAuth token và SSH key.

aka:
tags:
- core-object
- security
---
 Lưu trữ thông tin nhạy cảm, như mật khẩu, OAuth token và SSH key.

<!--more-->

Secrets cho phép bạn kiểm soát tốt hơn cách thông tin nhạy cảm được sử dụng và giảm nguy cơ tiết lộ vô tình. Các giá trị Secret được mã hóa dưới dạng chuỗi base64 và được lưu trữ không mã hóa theo mặc định, nhưng có thể được cấu hình để
[mã hóa khi lưu trữ](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).

Một {{< glossary_tooltip text="Pod" term_id="pod" >}} có thể tham chiếu Secret theo nhiều cách khác nhau, chẳng hạn như trong volume mount hoặc như biến môi trường.
Secrets được thiết kế cho dữ liệu bí mật và
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) được thiết kế cho dữ liệu không bí mật.

---
title: ServiceAccount
id: service-account
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Cung cấp danh tính cho các tiến trình chạy trong một Pod.

aka:
tags:
- fundamental
- core-object
---
Cung cấp danh tính cho các tiến trình chạy trong một {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Khi các tiến trình bên trong Pod truy cập cluster, chúng được API server xác thực với tư cách một service account cụ thể, ví dụ `default`. Khi bạn tạo một Pod mà không chỉ định service account, Pod đó sẽ tự động được gán service account mặc định trong cùng {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.

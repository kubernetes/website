---
title: Operator pattern
id: operator-pattern
full_link: /docs/concepts/extend-kubernetes/operator/
short_description: >
  Một controller chuyên biệt dùng để quản lý custom resource

aka:
tags:
- architecture
---
[Operator pattern](/docs/concepts/extend-kubernetes/operator/) là một thiết kế hệ thống
liên kết một {{< glossary_tooltip term_id="controller" >}} với một hoặc nhiều custom
resource.

<!--more-->

Bạn có thể mở rộng Kubernetes bằng cách thêm các controller vào cluster, ngoài các controller
tích hợp sẵn đi kèm với Kubernetes.

Nếu một ứng dụng đang chạy hoạt động như một controller và có quyền truy cập API để thực hiện
các tác vụ đối với một custom resource được định nghĩa trong control plane, đó là một ví dụ
về Operator pattern.

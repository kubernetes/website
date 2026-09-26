---
title: Spec
id: spec
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  Trường trong Kubernetes manifests định nghĩa trạng thái mong muốn hoặc cấu hình.

aka:
tags:
- fundamental
- architecture
---
Định nghĩa cách mỗi object, như Pods hoặc Services, nên được cấu hình và trạng thái mong muốn của nó.

<!--more-->
Hầu hết mọi Kubernetes object đều bao gồm hai trường object lồng nhau quản lý cấu hình của object: object spec và object status. Đối với các object có spec, bạn phải thiết lập trường này khi tạo object, cung cấp mô tả về các đặc tính bạn muốn {{< glossary_tooltip text="resource" term_id="api-resource" >}} có: trạng thái mong muốn của nó.

Nó thay đổi tùy theo các object khác nhau như Pods, StatefulSets, và Services, chi tiết các thiết lập như containers, volumes, replicas, ports, và các thông số kỹ thuật khác riêng biệt cho từng loại object. Trường này đóng gói trạng thái mà Kubernetes nên duy trì cho object được định nghĩa.

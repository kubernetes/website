---
title: Event
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Các Event là các đối tượng Kubernetes mô tả một vài thay đổi về trạng thái trong hệ thống.
aka:
tags:
- core-object
- fundamental
---
Event là một đối tượng Kubernetes mô tả sự thay đổi trạng thái/các sự kiện đáng chú ý trong hệ thống.

<!--more-->
Các event có thời gian tồn tại hạn chế và các yếu tố kích hoạt cũng như thông báo có thể tiến triển theo thời gian.
Các thành phần sử dụng event không nên dựa vào thời gian của event với lý do nhất định như thể nó luôn phản ánh yếu tố kích hoạt cố định,
hoặc sự tồn tại liên tục của các event với lý do đó.


Các event chỉ nên được coi là dữ liệu bổ sung mang tính thông tin, theo nguyên tắc best-effort.

Trong Kubernetes, [kiểm toán](/docs/tasks/debug/debug-cluster/audit/) tạo ra một loại bản ghi
Event khác (nhóm API `audit.k8s.io`).

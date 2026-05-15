---
title: Trục xuất khởi tạo bởi API
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Trục xuất khởi tạo bởi API là quá trình sử dụng Eviction API để tạo
  đối tượng Eviction, kích hoạt việc kết thúc pod một cách êm ái.
aka:
tags:
- operation
---
Trục xuất khởi tạo bởi API là quá trình sử dụng [Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
để tạo đối tượng `Eviction`, kích hoạt việc kết thúc pod một cách mượt mà.

<!--more-->

Bạn có thể yêu cầu trục xuất bằng cách gọi trực tiếp Eviction API
qua client của kube-apiserver, ví dụ như lệnh `kubectl drain`.
Khi đối tượng `Eviction` được tạo ra, API server sẽ kết thúc Pod.

Trục xuất khởi tạo bởi API tuân theo các cấu hình [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
và [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) đã thiết lập.

Trục xuất khởi tạo bởi API khác với [trục xuất do áp lực node](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

* Tham khảo [Trục xuất khởi tạo bởi API](/docs/concepts/scheduling-eviction/api-eviction/) để biết thêm chi tiết.

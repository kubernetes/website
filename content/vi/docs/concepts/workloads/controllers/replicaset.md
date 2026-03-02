---
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
feature:
  title: Tự phục hồi
  anchor: How a ReplicaSet works
  description: >
    Khởi động lại các container bị lỗi, thay thế và lên lịch lại các container khi các node chết,
    tắt các container không phản hồi kiểm tra (health check) do người dùng định nghĩa,
    và không cho người dùng truy cập cho đến khi chúng sẵn sàng phục vụ.
content_type: concept
description: >-
  Mục đích của ReplicaSet là duy trì một tập hợp ổn định các Pod bản sao đang chạy tại bất kỳ thời điểm nào.
  Thông thường, bạn định nghĩa một Deployment và để Deployment đó quản lý các ReplicaSet tự động.
---

<!-- overview -->

Trang này đang được dịch. Vui lòng xem [phiên bản tiếng Anh](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) để biết thông tin mới nhất.

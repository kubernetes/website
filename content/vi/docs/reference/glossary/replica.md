---
title: Replica
id: replica
date: 2023-06-11
full_link: 
short_description: >
  Replicas là các bản sao của các pod, giúp đảm bảo tính sẵn sàng, 
  khả năng mở rộng và chịu lỗi bằng cách duy trì nhiều phiên bản giống nhau.
aka: 
tags:
- fundamental
- workload
---
Các bản sao của một {{< glossary_tooltip text="Pod" term_id="pod" >}} hoặc một tập các pod.
Các bản sao này giúp đảm bảo tính sẵn sàng cao, khả năng mở rộng và chịu lỗi bằng cách
duy trì nhiều phiên bản giống nhau của một pod.

<!--more-->
Replicas thường được sử dụng trong Kubernetes để đạt được trạng thái mong muốn và độ tin cậy của ứng dụng.
Chúng cho phép mở rộng khối lượng công việc và phân bố tải đến các node khác nhau trong cụm.

Khi khai báo số lượng bản sao trong một Deployment hoặc ReplicaSet, Kubernetes sẽ đảm bảo
duy trì đúng số lượng bản sao của ứng dụng đang chạy, tự động thay đổi số lượng khi cần thiết.

Quản lý replica cho phép cân bằng tải hiệu quả, hỗ trợ cập nhật cuốn chiếu (rolling update)
và cơ chế tự phục hồi.

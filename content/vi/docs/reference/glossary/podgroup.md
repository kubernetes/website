---
title: PodGroup
id: podgroup
full_link: /docs/concepts/workloads/podgroup-api/
short_description: >
  PodGroup đại diện cho một tập hợp các Pod có chung chính sách và ràng buộc lập lịch.

aka:
tags:
- core-object
- workload
---
PodGroup là một đối tượng runtime đại diện cho một nhóm Pod được lập lịch
cùng nhau như một đơn vị duy nhất. Trong khi
[Workload API](/docs/concepts/workloads/workload-api/) định nghĩa các mẫu chính sách
lập lịch, PodGroup là đối tượng tương ứng ở thời điểm chạy, mang cả chính sách lẫn
trạng thái lập lịch của một phiên bản (instance) cụ thể của nhóm đó.

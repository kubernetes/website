---
title: DeviceClass
id: deviceclass
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  Một danh mục device trong cluster. Người dùng có thể yêu cầu
  các device cụ thể trong một DeviceClass.
tags:
- extension
---
 Một danh mục {{< glossary_tooltip text="device" term_id="device" >}} trong
 cluster có thể được sử dụng với cấp phát tài nguyên động (DRA).

<!--more-->

Quản trị viên hoặc chủ sở hữu device sử dụng DeviceClass để định nghĩa một tập hợp
device có thể được yêu cầu và sử dụng trong workload. Các device được yêu cầu bằng cách tạo
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
để lọc các tham số device cụ thể trong một DeviceClass.

Để biết thêm thông tin, xem
[Cấp phát tài nguyên động](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)

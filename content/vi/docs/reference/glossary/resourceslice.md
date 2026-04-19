---
title: ResourceSlice
id: resourceslice
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  Đại diện cho một hoặc nhiều tài nguyên hạ tầng, như device, trong một pool
  các tài nguyên tương tự.

tags:
- workload
---
 Đại diện cho một hoặc nhiều tài nguyên hạ tầng, ví dụ như
{{< glossary_tooltip text="device" term_id="device" >}}, được gắn vào
các node. Driver tạo và quản lý ResourceSlice trong cluster. ResourceSlice
được sử dụng cho
[cấp phát tài nguyên động (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!--more-->

Khi một {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} được
tạo, Kubernetes sử dụng ResourceSlice để tìm các node có quyền truy cập vào
tài nguyên có thể đáp ứng yêu cầu. Kubernetes phân bổ tài nguyên cho
ResourceClaim và lập lịch cho Pod trên node có thể truy cập các tài nguyên đó.

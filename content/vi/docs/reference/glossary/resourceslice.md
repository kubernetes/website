---
title: ResourceSlice
id: resourceslice
full_link: /docs/reference/kubernetes-api/resource/resource-slice-v1/
short_description: >
  Đại diện cho một hoặc nhiều tài nguyên hạ tầng, như device, trong một nhóm (pool)
  các tài nguyên tương tự.

tags:
- workload
---
 Đại diện cho một hoặc nhiều tài nguyên hạ tầng, chẳng hạn như các
{{< glossary_tooltip text="device" term_id="device" >}}, được gắn vào các
node. Driver tạo và quản lý các ResourceSlice trong cluster. ResourceSlice
được sử dụng cho
[cấp phát tài nguyên động (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/).

<!--more-->

Khi một {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} được
tạo, Kubernetes sử dụng các ResourceSlice để tìm các node có quyền truy cập vào
những tài nguyên có thể đáp ứng claim đó. Kubernetes phân bổ tài nguyên cho
ResourceClaim và lập lịch Pod lên một node có thể truy cập các tài nguyên đó.

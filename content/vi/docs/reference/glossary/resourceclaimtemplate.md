---
title: ResourceClaimTemplate
id: resourceclaimtemplate
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Định nghĩa một template để Kubernetes tạo ResourceClaim. Dùng để cung cấp
  quyền truy cập riêng cho từng Pod vào các tài nguyên tương tự, riêng biệt.

tags:
- workload
---
 Định nghĩa một template mà Kubernetes sử dụng để tạo
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}. 
ResourceClaimTemplate được sử dụng trong
[cấp phát tài nguyên động (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
để cung cấp _quyền truy cập riêng cho từng Pod vào các tài nguyên tương tự, riêng biệt_.

<!--more-->

Khi một ResourceClaimTemplate được tham chiếu trong đặc tả workload,
Kubernetes tự động tạo các đối tượng ResourceClaim dựa trên template.
Mỗi ResourceClaim được gắn với một Pod cụ thể. Khi Pod kết thúc,
Kubernetes xóa ResourceClaim tương ứng. 

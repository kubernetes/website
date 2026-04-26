---
title: ResourceClaim
id: resourceclaim
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Mô tả các tài nguyên mà workload cần, ví dụ như device. ResourceClaim
  có thể yêu cầu device từ các DeviceClass.

tags:
- workload
---
 Mô tả các tài nguyên mà workload cần, ví dụ như
{{< glossary_tooltip text="device" term_id="device" >}}. ResourceClaim được
sử dụng trong
[cấp phát tài nguyên động (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
để cung cấp cho Pod quyền truy cập vào một tài nguyên cụ thể.

<!--more-->

ResourceClaim có thể được tạo bởi người vận hành workload hoặc được Kubernetes tạo tự động
dựa trên một
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}.

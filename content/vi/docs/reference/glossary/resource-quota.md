---
title: ResourceQuota
id: resource-quota
date: 2018-04-12
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  Áp đặt các ràng buộc để giới hạn lượng tài nguyên tiêu thụ trong mỗi namespace.

aka: 
tags:
- fundamental
- operation
- architecture
---
Đối tượng đặt ra các ràng buộc về lượng tài nguyên tiêu thụ trong mỗi {{< glossary_tooltip term_id="namespace" >}}.

<!--more-->

ResourceQuota có thể giới hạn số lượng {{< glossary_tooltip text="tài nguyên" term_id="api-resource" >}}
có thể được tạo ra trong một namespace theo từng loại, hoặc có thể giới hạn 
tổng lượng {{< glossary_tooltip text="tài nguyên hạ tầng" term_id="infrastructure-resource" >}} 
mà namespace (và các đối tượng bên trong nó) được phép sử dụng.

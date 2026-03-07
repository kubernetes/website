---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  Cung cấp các ràng buộc để giới hạn mức tiêu thụ tài nguyên cho mỗi Container hoặc Pod trong một namespace.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
Ràng buộc mức tiêu thụ tài nguyên cho mỗi {{< glossary_tooltip text="container" term_id="container" >}} hoặc {{< glossary_tooltip text="Pod" term_id="pod" >}},
được chỉ định cho một {{< glossary_tooltip text="namespace" term_id="namespace" >}} cụ thể.

<!--more--> 

Một [LimitRange](/docs/concepts/policy/limit-range/) có thể giới hạn số lượng {{< glossary_tooltip text="API resources" term_id="api-resource" >}}
có thể được tạo (cho một loại tài nguyên cụ thể),
hoặc lượng {{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
có thể được yêu cầu/tiêu thụ bởi các container hoặc Pod riêng lẻ trong một namespace.

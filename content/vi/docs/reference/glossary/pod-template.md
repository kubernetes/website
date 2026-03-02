---
title: PodTemplate
id: pod-template
short_description: >
  Một bản mẫu (template) dùng để tạo ra các Pod.

aka: 
  - pod template
tags:
- core-object

---
Một đối tượng API định nghĩa bản mẫu để tạo các {{< glossary_tooltip text="Pod" term_id="pod" >}}.
PodTemplate API cũng được nhúng trong các đặc tả API quản lý workload, chẳng hạn như
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} hay
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}.

<!--more--> 

Các bản mẫu này cho phép định nghĩa các metadata chung (ví dụ: các label, hay mẫu đặt tên cho Pod mới)
cũng như chỉ định trạng thái mong muốn của Pod.
Các controller [quản lý workload](/docs/concepts/workloads/controllers/) sử dụng các bản mẫu PodTemplate
(được nhúng trong các đối tượng khác như Deployment hay StatefulSet)
để định nghĩa và quản lý một hoặc nhiều {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Khi có nhiều Pod được tạo ra dựa trên một bản mẫu, chúng được gọi là {{< glossary_tooltip term_id="replica" text="replicas" >}}.
Mặc dù có thể tạo trực tiếp một đối tượng PodTemplate, trên thực tế hiếm khi cần phải làm như vậy.

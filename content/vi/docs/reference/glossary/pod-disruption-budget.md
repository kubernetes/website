---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
  Đối tượng giới hạn số lượng Pod trong ứng dụng có nhiều bản sao bị ngừng hoạt động đồng thời do các gián đoạn chủ động.

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

[Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) cho phép người quản lý ứng dụng tạo ra một đối tượng cho ứng dụng có nhiều bản sao, đảm bảo duy trì một số lượng hoặc tỷ lệ {{< glossary_tooltip text="Pods" term_id="pod" >}} nhất định (dựa trên nhãn được gán) sẽ không bị chủ động loại bỏ tại bất kỳ thời điểm nào.

<!--more--> 

Các gián đoạn bị động không thể được ngăn chặn bởi PDBs; tuy nhiên chúng vẫn được tính vào giới hạn cho phép (budget).

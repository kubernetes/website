---
title: Tự động điều chỉnh Pod theo chiều ngang (Horizontal Pod Autoscaler)
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  Một tài nguyên API tự động điều chỉnh số lượng bản sao (replica) của pod dựa vào mức sử dụng CPU mục tiêu hoặc các chỉ số tùy chỉnh.

aka:
- HPA
tags:
- operation
---

Một tài nguyên API tự động điều chỉnh số lượng replica của {{< glossary_tooltip term_id="pod" >}} dựa vào mức sử dụng CPU mong muốn hoặc các ngưỡng chỉ số tùy chỉnh.

<!--more--> 

HPA thường dùng với {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}, {{< glossary_tooltip text="Deployments" term_id="deployment" >}}, hoặc {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. HPA không áp dụng cho các đối tượng không thể thay đổi số bản sao, ví dụ {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
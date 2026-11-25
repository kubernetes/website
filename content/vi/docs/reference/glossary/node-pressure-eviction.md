---
title: Trục xuất do áp lực Node
id: node-pressure-eviction
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  Trục xuất do áp lực node là quá trình mà kubelet chủ động dừng
  các pod để thu hồi tài nguyên trên node.
aka:
- kubelet eviction
tags:
- operation
---
Trục xuất do áp lực node là quá trình mà {{<glossary_tooltip term_id="kubelet" text="kubelet">}} chủ động kết thúc
các pod để thu hồi {{< glossary_tooltip text="tài nguyên" term_id="infrastructure-resource" >}}
trên node.

<!--more-->

Kubelet giám sát các tài nguyên như CPU, bộ nhớ, dung lượng đĩa và inode hệ thống tệp
trên các node của cluster. Khi một hoặc nhiều tài nguyên đạt đến
mức tiêu thụ nhất định, kubelet có thể chủ động dừng một hoặc nhiều pod
trên node để thu hồi tài nguyên và ngăn chặn tình trạng cạn kiệt.

Trục xuất do áp lực node không giống với [trục xuất qua API](/docs/concepts/scheduling-eviction/api-eviction/).

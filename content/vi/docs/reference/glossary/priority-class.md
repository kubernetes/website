---
title: PriorityClass
id: priority-class
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  A mapping from a class name to the scheduling priority that a Pod should have.
  Một ánh xạ từ tên lớp đến độ ưu tiên khi lập lịch mà một Pod nên có.

aka:
tags:
- core-object
---
Một PriorityClass là một lớp được đặt tên dùng để xác định mức độ ưu tiên khi lập lịch cho các Pod thuộc lớp đó. 

<!--more-->

Một [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
là một đối tượng không thuộc namespace (non-namespaced) ánh xạ một tên lớp với một số nguyên biểu thị mức độ ưu tiên, được sử dụng cho Pod.
Tên của PriorityClass được khai báo trong trường `metadata.name`, và giá trị ưu tiên được khai báo trong trường `value`.
Giá trị ưu tiên có thể nằm trong khoảng từ -2147483648 đến 1000000000 (bao gồm cả 2 số đầu và cuối). Giá trị càng cao thể hiện độ ưu tiên càng lớn.

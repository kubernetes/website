---
title: Mirror Pod
id: mirror-pod
date: 2019-08-06
short_description: >
  Một object trong API server theo dõi một static pod trên kubelet.

aka: 
tags:
- fundamental
---
 Một {{< glossary_tooltip text="pod" term_id="pod" >}} object mà {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} sử dụng để đại diện cho một {{< glossary_tooltip text="static pod" term_id="static-pod" >}}

<!--more--> 

Khi kubelet tìm thấy một static pod trong cấu hình của nó, nó tự động cố gắng tạo một Pod object trên Kubernetes API server cho nó. Điều này có nghĩa là pod sẽ hiển thị trên API server, nhưng không thể được điều khiển từ đó.

(Ví dụ, việc xóa một mirror pod sẽ không dừng kubelet daemon chạy nó).

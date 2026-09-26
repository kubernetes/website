---
title: Condition
id: condition
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  Condition biểu thị trạng thái hiện tại của một tài nguyên Kubernetes, cung cấp thông tin về việc các khía cạnh nhất định của tài nguyên đó có đúng hay không.

aka:
tags:
- fundamental
---
Condition là một trường trong trạng thái (status) của tài nguyên Kubernetes, mô tả trạng thái hiện tại của tài nguyên đó.

<!--more-->

Condition cung cấp một cách chuẩn hóa để các thành phần Kubernetes giao tiếp về trạng thái của tài nguyên. Mỗi condition có một `type`, một `status` (True, False, hoặc Unknown), và các trường tùy chọn như `reason` và `message` để cung cấp thêm chi tiết. Ví dụ, một Pod có thể có các condition như `Ready`, `ContainersReady`, hoặc `PodScheduled`.

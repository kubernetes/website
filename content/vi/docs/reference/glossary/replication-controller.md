---
title: ReplicationController
id: replication-controller
full_link: 
short_description: >
  A (deprecated) API object that manages a replicated application.
  Một đối tượng API (đã bị ngừng sử dụng) dùng để quản lý một ứng dụng được nhân bản. 

aka: 
tags:
- workload
- core-object
---

ReplicationController là một {{< glossary_tooltip text="đối tượng" term_id="object" >}} quản lý workload dùng để quản lý một ứng dụng được nhân bản,
đảm bảo rằng luôn có một số lượng {{< glossary_tooltip text="Pod" term_id="pod" >}} xác định đang chạy.

<!--more-->

Control plane sẽ đảm bảo số lượng Pod được định nghĩa từ trước luôn được duy trì,
ngay cả khi một số Pod bị lỗi, khi một số Pod bị xoá thủ công, hoặc khi có quá nhiều Pod được tạo ngoài ý muốn.

{{< note >}}
ReplicationController hiện đã bị ngừng sử dụng. Thay vào đó hãy sử dụng 
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} với chức năng tương tự.
{{< /note >}}

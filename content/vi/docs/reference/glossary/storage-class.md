---
title: Storage Class
id: storageclass
full_link: /docs/concepts/storage/storage-classes
short_description: >
  Một StorageClass cung cấp cách cho administrators mô tả các loại storage khác nhau có sẵn.

aka:
tags:
- core-object
- storage
---
Một StorageClass cung cấp cách cho administrators mô tả các loại storage khác nhau có sẵn.

<!--more-->

StorageClasses có thể ánh xạ tới các mức quality-of-service, chính sách backup, hoặc các chính sách tùy ý được xác định bởi cluster administrators. Mỗi StorageClass chứa các trường `provisioner`, `parameters`, và `reclaimPolicy`, được sử dụng khi một {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}} thuộc về class cần được cấp phát động. Người dùng có thể yêu cầu một class cụ thể bằng cách sử dụng tên của StorageClass object.

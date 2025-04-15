---
title: Storage Class
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  StorageClass cung cấp cách để quản trị viên mô tả các loại lưu trữ khác nhau có sẵn trong hệ thống.

aka: 
tags:
- core-object
- storage
---
 StorageClass cung cấp cách để quản trị viên mô tả các loại lưu trữ khác nhau có sẵn trong hệ thống.

<!--more--> 

StorageClass có thể được ánh xạ tới các cấp độ chất lượng dịch vụ, chính sách sao lưu, hoặc các chính sách tùy chỉnh được xác định bởi quản trị viên cluster. Mỗi StorageClass chứa các trường `provisioner`, `parameters` và `reclaimPolicy`, được sử dụng khi cần cấp phát động một {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}} thuộc về class đó. Người dùng có thể yêu cầu một class cụ thể bằng cách sử dụng tên của đối tượng StorageClass.

---
title: Persistent Volume
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Đối tượng API đại diện cho một phần lưu trữ trong cụm.

aka: 
tags:
- core-object
- storage
---
Một đối tượng API đại diện cho một phần lưu trữ trong cụm. Biểu diễn như một {{< glossary_tooltip text="tài nguyên" term_id="infrastructure-resource" >}} lưu trữ chung, có thể tích hợp thêm, và có khả năng tồn tại lâu hơn vòng đời của bất kỳ {{< glossary_tooltip text="Pod" term_id="pod" >}} riêng lẻ nào.

<!--more--> 

PersistentVolumes (PVs) cung cấp một API trừu tượng hóa, tách biệt chi tiết về cách lưu trữ được triển khai với cách nó được sử dụng.
PVs được sử dụng trực tiếp trong các kịch bản mà lưu trữ có thể được tạo trước (static provisioning).
Đối với các trường hợp lưu trữ theo yêu cầu (dynamic provisioning), thay vào đó sẽ sử dụng PersistentVolumeClaims (PVCs).


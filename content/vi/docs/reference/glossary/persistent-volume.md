---
title: Persistent Volume
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Một đối tượng API đại diện cho một phần lưu trữ trong cluster. Được cung cấp như một tài nguyên chung có thể kết nối được và tồn tại độc lập với vòng đời của bất kỳ Pod riêng lẻ nào.

aka: 
tags:
- core-object
- storage
---
 Một đối tượng API đại diện cho một phần lưu trữ trong cluster. Được cung cấp như một tài nguyên chung có thể kết nối được và tồn tại độc lập với vòng đời của bất kỳ {{< glossary_tooltip text="Pod" term_id="pod" >}} riêng lẻ nào.

<!--more--> 

PersistentVolumes (PVs) cung cấp một API trừu tượng hóa chi tiết về cách lưu trữ được cung cấp và cách nó được sử dụng. PVs được sử dụng trực tiếp trong các tình huống mà lưu trữ có thể được tạo trước (cấp phát tĩnh). Đối với các tình huống yêu cầu lưu trữ theo nhu cầu (cấp phát động), PersistentVolumeClaims (PVCs) được sử dụng thay thế.

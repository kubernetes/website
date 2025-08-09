---
title: Cấp phát volume động
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  Cho phép người dùng yêu cầu hệ thống tự động tạo các Volume lưu trũ.

aka: 
tags:
- storage
---
 Cho phép người dùng yêu cầu hệ thống tự động tạo các {{< glossary_tooltip text="Volumes" term_id="volume" >}} lưu trữ.

<!--more--> 

Cấp phát tự động loại bỏ yêu cầu quản trị viên cần cấp phát sẵn dung lượng lưu trữ. Thay vào đó, hệ thống tự động cấp phát dung lượng lưu trữ theo yêu cầu của người dùng. Cấp phát volume tự đọng được dựa trên một đối tượng API, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, tham chiếu đến một {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} mà sẽ cấp phát một {{< glossary_tooltip text="Volume" term_id="volume" >}} và tập hợp các tham số cần truyền cho Volume Plugin.
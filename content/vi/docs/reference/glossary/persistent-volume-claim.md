---
title: Persistent Volume Claim
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Yêu cầu (Claim) tài nguyên lưu trữ được định nghĩa trong PersistentVolume để có thể gắn (mount) như một volume trong container.

aka: 
tags:
- core-object
- storage
---
Yêu cầu {{< glossary_tooltip text="tài nguyên" term_id="infrastructure-resource" >}} lưu trữ được định nghĩa trong
{{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, để có thể được gắn (mount) thành
một volume trong {{< glossary_tooltip text="container" term_id="container" >}}.

<!--more--> 

Xác định dung lượng lưu trữ, cách thức truy cập (chỉ đọc, đọc-ghi và/hoặc độc quyền) và cách nó được thu hồi (giữ lại, phục hồi hoặc xóa đi). Chi tiết về lưu trữ được mô tả trong PersistentVolume.

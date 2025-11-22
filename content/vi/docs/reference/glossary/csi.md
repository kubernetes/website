---
title: Giao thức lưu trữ cho container (Container Storage Interface - CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    Container Storage Interface (CSI) định nghĩa một giao thức chuẩn để expose các hệ thống lưu trữ cho containers.


aka: 
tags:
- storage 
---
 Container Storage Interface (CSI) định nghĩa một giao thức chuẩn để expose các hệ thống lưu trữ cho containers.

<!--more--> 

CSI cho phép các nhà cung cấp tạo ra các plugin lưu trữ tùy chỉnh cho Kubernetes mà không cần thêm chúng vào repository Kubernetes (out-of-tree plugins). Để sử dụng CSI driver từ một nhà cung cấp lưu trữ, trước tiên bạn phải [triển khai nó lên cluster của mình](https://kubernetes-csi.github.io/docs/deploying.html). Sau đó bạn sẽ có thể tạo một {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} sử dụng CSI driver đó.

* [CSI trong tài liệu Kubernetes](/docs/concepts/storage/volumes/#csi)
* [Danh sách các CSI driver có sẵn](https://kubernetes-csi.github.io/docs/drivers.html)

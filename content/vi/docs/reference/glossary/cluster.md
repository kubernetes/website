---
title: Cluster
id: cluster
date: 2020-02-26
full_link: 
short_description: >
   Một tập các worker machine, được gọi là node, dùng để chạy các các ứng dụng được đóng gói (containerized application). Mỗi cụm (cluster) có ít nhất một worker node.

aka: 
tags:
- fundamental
- operation
---
Một tập các worker machine, được gọi là node, dùng để chạy các containerized application. Mỗi cụm (cluster) có ít nhất một worker node.

<!--more-->
Các worker node chứa các pod (là những thành phần của ứng dụng). Control Plane quản lý các worker node và pod trong cluster.
Trong môi trường sản phẩm (production environment), Control Plane thường chạy trên nhiều máy tính và một cluster thường chạy trên nhiều node, cung cấp khả năng chịu lỗi (fault-tolerance) và tính sẵn sàng cao (high availability).
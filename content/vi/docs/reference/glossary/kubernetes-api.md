---
title: Kubernetes API
id: kubernetes-api
date: 2018-04-12
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  Ứng dụng cung cấp các chức năng của Kubernetes thông qua giao diện RESTful và lưu trữ trạng thái của cluster.

aka: 
tags:
- fundamental
- architecture
---
 Ứng dụng cung cấp các chức năng của Kubernetes thông qua giao diện RESTful và lưu trữ trạng thái của cluster.

<!--more--> 

Các tài nguyên Kubernetes và "bản ghi ý định" đều được lưu trữ dưới dạng các API object, và được sửa đổi thông qua các lệnh gọi RESTful đến API. API cho phép quản lý cấu hình bằng cách khai báo. Người dùng có thể tương tác trực tiếp với Kubernetes API, hoặc thông qua các công cụ như `kubectl`. Kubernetes API có tính linh hoạt và cũng có thể được mở rộng để hỗ trợ các tài nguyên tùy chỉnh.


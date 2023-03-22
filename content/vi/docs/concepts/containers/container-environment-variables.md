---
reviewers:
- huynguyennovem
title: Các biến môi trường của Container
content_type: concept
weight: 20
---

<!-- overview -->

Trang này mô tả các tài nguyên có sẵn cho các Containers trong môi trường Container. 




<!-- body -->

## Môi trường container

Môi trường Container trong Kubernetes cung cấp một số tài nguyên quan trọng cho Container:

* Một hệ thống tệp tin (filesystem), là sự kết hợp của một [image](/docs/concepts/containers/images/) và một hoặc nhiều [volumes](/docs/concepts/storage/volumes/).
* Thông tin về chính container đó.
* Thông tin về các đối tượng (object) khác trong cluster.

### Thông tin container

*Hostname* của một Container là tên của Pod mà Container đang chạy trong đó.
Có thể lấy thông tin qua lệnh `hostname` hoặc lệnh gọi hàm
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
trong libc.

Tên của Pod và namespace có thể lấy ở các biến môi trường thông qua
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Các biến môi trường do người dùng định nghĩa từ định nghĩa của Pod cũng có trong thông tin của Container,
như là mọi biến môi trường khác được xác định tĩnh trong Docker image.

### Thông tin cluster

Một danh sách tất cả các services đang chạy khi một Container được tạo đều có trong Container dưới dạng các biến môi trường.
Các biến môi trường này đều khớp với cú pháp của các Docker links.

Đối với một service có tên là *foo* ánh xạ với Container có tên là *bar*,
các biến sau được xác định:

```shell
FOO_SERVICE_HOST=<host mà service đang chạy>
FOO_SERVICE_PORT=<port mà service đang chạy>
```

Các services có địa chỉ IP và có sẵn cho Container thông qua DNS 
nếu [DNS addon](http://releases.k8s.io/master/cluster/addons/dns/) được enable. 



## {{% heading "whatsnext" %}}


* Tìm hiểu thêm về [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Trải nhiệm thực tế
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).



---
title: Downward API
id: downward-api
date: 2022-03-21
short_description: >
  Một cơ chế để cung cấp các trường giá trị của Pod và container cho đoạn mã đang chạy bên trong container.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
Cơ chế của Kubernetesdùng để cung cấp các trường giá trị của Pod và container cho mã đang chạy bên trong container.
<!--more-->
Đôi khi, việc một container biết thông tin về chính nó là điều hữu ích, mà không cần
sửa đổi mã nguồn của container theo cách ràng buộc trực tiếp với Kubernetes.

Downward API của Kubernetes cho phép các container truy cập thông tin của bản thân chúng
hoặc context của chúng trong một cụm Kubernetes. Các ứng dụng chạy trong có thể truy cập
các thông tin này mà không cần hoạt động như một client của Kubernetes API.

Có hai cách để cung cấp các trường của Pod và container cho một container đang chạy:

- sử dụng [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- sử dụng [a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Tóm lại, có hai cách cung cấp các trường của Pod và container được gọi là _downward API_.
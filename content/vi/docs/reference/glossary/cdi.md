---
title: Container Device Interface (CDI)
id: cdi
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Một đặc tả của CNCF mô tả cấu hình thiết bị mà các container runtime
  áp dụng khi tạo container.

aka:
tags:
- extension
---
Container Device Interface (CDI) là một đặc tả về cách cấu hình
các device bên trong container. Kubernetes sử dụng CDI cùng với device plugin và
cấp phát tài nguyên động (Dynamic Resource Allocation) để workload nhận được các
thiết lập device từ runtime, chẳng hạn như bind mount hoặc biến môi trường.

<!--more-->

* [Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* Kho lưu trữ đặc tả [Container Device Interface](https://github.com/cncf-tags/container-device-interface)

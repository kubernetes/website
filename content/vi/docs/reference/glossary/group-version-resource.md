---
title: Group Version Resource
id: gvr
date: 2023-07-24
short_description: >
  Nhóm API, phiên bản API và tên của một Kubernetes API. 

aka: ["GVR"]
tags:
- architecture
---
Phương thức đại diện cho tài nguyên API Kubernetes duy nhất.

<!--more-->

Group Version Resources (GVRs) xác định nhóm API, phiên bản API và tài nguyên (tên của loại đối tượng như xuất hiện trong URI) liên quan đến việc truy cập một đối tượng cụ thể trong Kubernetes.
GVRs cho phép bạn định nghĩa và phân biệt các đối tượng Kubernetes khác nhau, cũng như chỉ định cách truy cập các đối tượng một cách ổn định ngay cả khi API thay đổi.
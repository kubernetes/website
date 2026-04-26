---
title: CIDR
id: cidr
full_link: 
short_description: >
  CIDR là ký pháp dùng để mô tả các khối địa chỉ IP và được sử dụng rộng rãi trong các cấu hình mạng khác nhau.

aka:
tags:
- networking
---
CIDR (Classless Inter-Domain Routing) là ký pháp dùng để mô tả các khối địa chỉ IP và được sử dụng rộng rãi trong các cấu hình mạng khác nhau.

<!--more-->

Trong ngữ cảnh của Kubernetes, mỗi {{< glossary_tooltip text="Node" term_id="node" >}} được gán một dải địa chỉ IP thông qua địa chỉ bắt đầu và subnet mask sử dụng CIDR. Điều này cho phép các Node gán cho mỗi {{< glossary_tooltip text="Pod" term_id="pod" >}} một địa chỉ IP duy nhất. Mặc dù ban đầu là khái niệm dành cho IPv4, CIDR cũng đã được mở rộng để hỗ trợ IPv6. 

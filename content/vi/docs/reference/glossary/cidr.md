---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDR là một dải dùng để mô tả các khối địa chỉ IP và được sử dụng rộng rãi trong nhiều cấu hình mạng khác nhau.

aka:
tags:
- networking
---
CIDR (Classless Inter-Domain Routing) là một dải dùng để mô tả các khối địa chỉ IP và được sử dụng rộng rãi trong nhiều cấu hình mạng khác nhau.

<!--more-->

Trong bối cảnh của Kubernetes, mỗi {{< glossary_tooltip text="Node" term_id="node" >}} được gán một dải địa chỉ IP thông qua địa chỉ đầu tiên và mặt nạ mạng con sử dụng CIDR. Điều này cho phép các node gán cho mỗi {{< glossary_tooltip text="Pod" term_id="pod" >}} một địa chỉ IP duy nhất. Mặc dù ban đầu là một khái niệm cho IPv4, CIDR cũng đã mở rộng để bao gồm cả IPv6.
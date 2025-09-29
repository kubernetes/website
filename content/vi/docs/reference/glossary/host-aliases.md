---
title: Khai báo hosts tùy chỉnh cho Pod (HostAliases)
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases là danh sách ánh xạ giữa địa chỉ IP và tên máy (hostname) sẽ được chèn vào tệp hosts của Pod.

aka:
tags:
- operation
---

HostAliases là danh sách ánh xạ giữa địa chỉ IP và tên máy (hostname) sẽ được chèn vào tệp hosts của {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) là một danh sách tùy chọn gồm các cặp hostname và địa chỉ IP; nếu bạn cấu hình, các mục này sẽ được chèn vào tệp hosts của Pod. Tính năng này chỉ dùng được với các Pod không bật hostNetwork (tức là Pod không dùng chung mạng của Node).
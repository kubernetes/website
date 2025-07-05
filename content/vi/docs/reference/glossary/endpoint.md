---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link:
short_description: >
  Một endpoint của một Service là một trong các Pod (hoặc máy chủ bên ngoài) triển khai Service.

aka:
tags:
- networking
---
 Một endpoint của một {{< glossary_tooltip text="Service" term_id="service" >}} là một trong các {{< glossary_tooltip text="Pod" term_id="pod" >}} (hoặc máy chủ bên ngoài) triển khai Service.

<!--more-->
Đối với các Service có {{< glossary_tooltip text="selector" term_id="selector" >}},
EndpointSlice controller sẽ tự động tạo một hoặc nhiều {{<
glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} cung cấp địa chỉ IP của các Pod endpoint đã chọn.

EndpointSlice cũng có thể được tạo thủ công để chỉ định các endpoint cho
Service không có selector.

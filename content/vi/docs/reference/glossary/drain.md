---
title: Drain
id: drain
date: 2024-12-27
full_link:
short_description: >
  Thực hiện việc loại bỏ các Pod khỏi một Node một cách an toàn để chuẩn bị cho việc bảo trì hoặc gỡ bỏ.
tags:
- fundamental
- operation
---
Quy trình của việc loại bỏ {{< glossary_tooltip text="Pods" term_id="pod" >}} từ một {{< glossary_tooltip text="Node" term_id="node" >}} để chuẩn bị cho việc bảo trì hoặc loại bỏ Node đó từ một {{< glossary_tooltip text="cluster" term_id="cluster" >}}.

<!--more-->

Câu lệnh `kubectl drain` được dùng để đánh dấu một {{< glossary_tooltip text="Node" term_id="node" >}} sẽ tạm dựng dịch vụ.
Khi được thao tác, câu lệnh loại bỏ toàn bộ {{< glossary_tooltip text="Pods" term_id="pod" >}} từ {{< glossary_tooltip text="Node" term_id="node" >}}.
Nếu yêu cầu loại bỏ tạm thời bị từ chối, `kubectl drain` thực hiện lại đến khi toàn bộ {{< glossary_tooltip text="Pods" term_id="pod" >}} được xóa hoặc hết thời gian chờ được cấu hình sẵn.
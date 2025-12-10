---
title: Tài nguyên (hạ tầng)
id: infrastructure-resource
date: 2025-02-09
short_description: >
  Một lượng hạ tầng được định nghĩa sẵn để tiêu thụ (CPU, bộ nhớ, v.v.).

aka:
tags:
- architecture
---
Các khả năng được cung cấp cho một hoặc nhiều {{< glossary_tooltip text="nodes" term_id="node" >}} (CPU, bộ nhớ, GPU, v.v.), và được phân bổ để
{{< glossary_tooltip text="Pod" term_id="pod" >}} chạy trên các nút đó có thể sử dụng.

Kubernetes cũng sử dụng thuật ngữ _tài nguyên (resource)_ để mô tả một {{< glossary_tooltip text="tài nguyên API" term_id="api-resource" >}}.

<!--more-->
Máy tính cung cấp các tài nguyên phần cứng cơ bản: năng lực xử lý, bộ nhớ lưu trữ, mạng, v.v.  
Các tài nguyên này có dung lượng hữu hạn, được đo bằng đơn vị tương ứng (số lượng CPU, số byte bộ nhớ, v.v.).  
Kubernetes trừu tượng hóa các [tài nguyên](/docs/concepts/configuration/manage-resources-containers/) phổ biến để phân bổ cho workload và sử dụng các cơ chế của hệ điều hành (ví dụ: {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} trong Linux) nhằm quản lý mức độ tiêu thụ của {{< glossary_tooltip text="workload" term_id="workload" >}}.

Bạn cũng có thể sử dụng [phân bổ tài nguyên động](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) để
tự động quản lý các yêu cầu phân bổ tài nguyên phức tạp.

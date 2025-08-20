---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Phần mở rộng phần mềm cho phép Pod truy cập các thiết bị cần khởi tạo hoặc thiết lập đặc thù từ nhà cung cấp
aka:
tags:
- fundamental
- extension
---
Device plugin chạy trên các worker
{{< glossary_tooltip term_id="node" text="Node">}} và cung cấp cho
{{< glossary_tooltip term_id="pod" text="Pod">}} khả năng truy cập vào các tài nguyên,
chẳng hạn như phần cứng cục bộ, mà yêu cầu các bước khởi tạo hoặc thiết lập đặc thù từ nhà cung cấp.

<!--more-->

Device plugin quảng bá các tài nguyên đến
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, để các Pod chạy workload
có thể truy cập các tính năng phần cứng liên quan đến Node nơi Pod đó đang chạy.
Bạn có thể triển khai device plugin dưới dạng {{< glossary_tooltip term_id="daemonset" >}},
hoặc cài đặt phần mềm device plugin trực tiếp trên mỗi Node đích.

Xem thêm
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
để biết thêm thông tin.

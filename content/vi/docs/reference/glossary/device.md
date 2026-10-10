---
title: Device
id: device
short_description: >
  Bất kỳ tài nguyên nào được gắn trực tiếp hoặc gián tiếp vào các node trong cluster,
  như GPU hoặc bo mạch.

tags:
- extension
- fundamental
---
 Một hoặc nhiều
{{< glossary_tooltip text="tài nguyên hạ tầng" term_id="infrastructure-resource" >}}
được gắn trực tiếp hoặc gián tiếp vào các
{{< glossary_tooltip text="node" term_id="node" >}} của bạn.

<!--more-->

Device có thể là các sản phẩm thương mại như GPU, hoặc phần cứng tùy chỉnh như
[bo mạch ASIC](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit).
Các device được gắn thường yêu cầu driver để cho phép các
{{< glossary_tooltip text="Pod" term_id="pod" >}} của Kubernetes truy cập vào device.

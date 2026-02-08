---
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps không chỉ hỗ trợ khởi tạo, hủy bỏ, nâng cấp và duy trì các cụm (cluster) Kubernetes chuẩn vận hành (production-grade) với độ sẵn sàng cao, mà còn tự động cấp phát các hạ tầng cloud cần thiết.

aka: 
tags:
- tool
- operation
---

`kOps` không chỉ giúp bạn khởi tạo, hủy bỏ, nâng cấp và duy trì các cụm Kubernetes độ sẵn sàng cao (High Availability), chuẩn vận hành thực tế (production-grade), mà công cụ này còn tự động cấp phát các hạ tầng điện toán đám mây (cloud infrastructure) tương ứng.

<!--more--> 

{{< note >}}
Hiện tại, AWS (Amazon Web Services) đã được hỗ trợ chính thức. Các nền tảng DigitalOcean, GCE và OpenStack đang trong giai đoạn hỗ trợ Beta, và Azure đang trong giai đoạn Alpha.
{{< /note >}}

`kOps` là một hệ thống cấp phát hạ tầng tự động:

* Cài đặt tự động hoàn toàn
* Định danh dựa trên DNS
* Khả năng tự phục hồi (Self-healing): Mọi thành phần đều vận hành trong các Nhóm tự động giãn nở (Auto-Scaling Groups)
* Hỗ trợ đa dạng hệ điều hành (Amazon Linux, Debian, Flatcar, RHEL, Rocky và Ubuntu)
* Hỗ trợ độ sẵn sàng cao (High-Availability)
* Có thể trực tiếp cấp phát hạ tầng hoặc xuất ra các tệp khai báo (manifests) cho Terraform

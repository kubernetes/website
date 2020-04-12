---
title: Vòng điều khiển (Controller)
id: controller
date: 2020-01-09
full_link: /docs/concepts/architecture/controller/
short_description: >
  Vòng điều khiển lặp lại theo dõi trạng thái chung của cluster thông qua apiserver và tự động thay đổi để hệ thống từ trạng thái hiện tại đạt tới trạng thái mong muốn.

aka:
tags:
  - architecture
  - fundamental
---

Trong hệ thống Kubernetes, các bộ controllers là các vòng lặp điều khiển theo dõi trạng thái của mỗi {{< glossary_tooltip term_id="cluster" text="cluster">}}, sau đó chúng sẽ tạo hoặc yêu cầu sự thay đổi cần thiết.
Mỗi controller cố thực hiện việc thay đổi để giúp hệ thống chuyển từ trạng thái hiện tại sang trạng thái mong muốn.

<!--more-->

Vòng điều khiển lặp lại theo dõi trạng thái chung của cluster thông qua Kubernetes API server (một thần phần của {{< glossary_tooltip term_id="control-plane" >}}).

Một vài controllers chạy bên trong control plan, cung cấp các vòng lặp điều khiển vận hành nhân gốc của các hoạt động trong hệ thống Kubernetes. Ví dụ: với deployment controller, daemonset controller, namespace controller, và persistent volume controller (và một vài controller còn lại) đều chạy bên trong kube-controller-manager.
---
title: Cài đặt Kubernetes với các công cụ triển khai
weight: 30
no_list: true
---

Có nhiều phương pháp và công cụ cho việc cài đặt cụm Kubernetes production của bạn.
Ví dụ:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): Một dự án con Kubernetes tập trung vào
  việc cung cấp API và công cụ khai báo để đơn giản hóa việc cung cấp, nâng cấp và 
  vận hành nhiều cụm Kubernetes.

- [kops](https://kops.sigs.k8s.io/): Một công cụ cung cấp cụm tự động.
  Đối với các hướng dẫn, thực hành tốt nhất, tùy chọn cấu hình và thông tin về
  tiếp cận với cộng đồng, vui lòng kiểm tra
  [`kOps` website](https://kops.sigs.k8s.io/) để biết chi tiết.

- [kubespray](https://kubespray.io/):
  Một sự phối hợp của [Ansible](https://docs.ansible.com/) playbooks,
  [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  các công cụ cung cấp, và kiến ​​thức chuyên môn cho các tác vụ quản lý cấu hình 
  Hệ điều hành/cụm Kubernetes chung. Bạn có thể tiếp cận tới cộng đồng trên kênh Slack
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).

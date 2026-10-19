---
title: "Cài đặt các công cụ"
description: Thiết lập các công cụ Kubernetes trên máy tính của bạn.
weight: 10
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: Cài đặt kubectl
---

## kubectl

<!-- overview -->
Công cụ dòng lệnh Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), cho phép
bạn chạy các câu lệnh tương tác tới các cụm Kubernetes.
Bạn có thể sử dụng kubectl để triển khai các ứng dụng, kiểm tra và quản lý các tài nguyên của cụm,
và xem log. Để biết thêm thông tin bao gồm một danh sách đầy đủ các lệnh của kubectl, xem
[tài liệu tham khảo `kubectl`](/docs/reference/kubectl/).

kubectl có thể cài đặt trên nhiều nền tảng Linux, macOS và Windows.
Chọn hệ điều hành ưa thích của bạn bên dưới.

- [Cài đặt kubectl trên Linux](/docs/tasks/tools/install-kubectl-linux)
- [Cài đặt kubectl trên macOS](/docs/tasks/tools/install-kubectl-macos)
- [Cài đặt kubectl trên Windows](/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/) cho phép bạn chạy Kubernetes trên
máy tính cục bộ của bạn. Công cụ này yêu cầu bạn phải có hoặc
[Docker](https://www.docker.com/) hoăc [Podman](https://podman.io/) được cài đặt sẵn.

Trang [Bắt đầu nhanh](https://kind.sigs.k8s.io/docs/user/quick-start/) của kind
cho bạn biết cần phải làm những gì để bắt đầu và chạy với kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Xem Hướng dẫn Bắt đầu nhanh của kind">Xem Hướng dẫn Bắt đầu nhanh của kind</a>

## minikube

Giống `kind`, [`minikube`](https://minikube.sigs.k8s.io/) là một công cụ cho phép bạn chạy Kubernetes
cục bộ. `minikube` chạy một cụm Kubernetes cục bộ tất-cả-trong-một hoặc nhiều-node trên máy tính cá nhân (bao gồm Windows, macOS và Linux) vì vậy bạn có thể thử
Kubernetes, hoặc cho công việc phát triển hàng ngày.

Bạn có thể theo dõi hướng dẫn chính thức
[Bắt đầu!](https://minikube.sigs.k8s.io/docs/start/) nếu bạn tập trung vào
việc cài đặt công cụ.

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Xem Hướng dẫn Bắt đầu! của minikube">Xem Hướng dẫn Bắt đầu! của minikube</a>

Một khi bạn có `minikube` đang chạy, bạn có thể dùng nó để
[chạy một ứng dụng mẫu](/docs/tutorials/hello-minikube/).

## kubeadm

Bạn có thể dùng công cụ {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} để tạo và quản lý các cụm Kubernetes.
Nó thực hiện các hành động cần thiết để có được sự khả thi tối thiểu, đảm bảo cụm khởi động và chạy theo một cách thân thiện với người dùng.

[Cài đặt kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) hướng dẫn bạn cách để cài đặt kubeadm.
Một khi được cài đặt, bạn có thể dùng nó để [tạo một cụm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Xem Hướng dẫn Cài đặt kubeadm">Xem Hướng dẫn Cài đặt kubeadm</a>

---
reviewers:
- sig-cluster-lifecycle
title: Các tùy chọn cho kiến trúc có tính Sẵn sàng cao
content_type: concept
weight: 50
---

<!-- overview -->

Trang này giải thích hai lựa chọn cho việc cấu hình kiến trúc cho các cụm Kubernetes có tính sẵn sàng cao (HA) của bạn.

Bạn có thể thiết lập một cụm HA:

- Với các control plane node xếp chồng, nơi các etcd node được đặt cùng vị trí với các control plane node
- Với các etcd node bên ngoài, nơi etcd chạy trên từng node riêng biệt so với các control plane node

Bạn nên cân nhắc kỹ lưỡng những ưu điểm và nhược điểm của từng kiến trúc trước khi thiết lập một cụm HA.

{{< note >}}
kubeadm khởi tạo cụm etcd một cách tĩnh. Đọc
[Hướng dẫn Phân cụm](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static) etcd
để biết thêm chi tiết.
{{< /note >}}

<!-- body -->

## Kiến trúc etcd xếp chồng {#stacked-etcd-topology}

Một cụm HA xếp chồng là một [kiến trúc](https://en.wikipedia.org/wiki/Network_topology) nơi cụm lưu trữ
dữ liệu phân tán được cung cấp bởi etcd được xếp chồng lên đầu cụm được hình thành bởi các node được quản lý bởi
kubeadm chạy các thành phần control plane.

Mỗi control plane node chạy một instance `kube-apiserver`, `kube-scheduler`, và `kube-controller-manager`.
`kube-apiserver` được expose tới các worker node bằng một bộ cân bằng tải.

Mỗi control plane node tạo một etcd member cục bộ và etcd member này chỉ giao tiếp với
`kube-apiserver` của node đó. Tương tự áp dụng cho các instance `kube-controller-manager`
và `kube-scheduler` cục bộ.

Cấu trúc liên kết này kết hợp các control plane và các etcd member trên cùng một node. Điều này đơn giản hơn việc thiết lập một cụm
với các etcd node bên ngoài, và đơn giản hơn để quản lý replication.

Tuy nhiên, một cụm xếp chồng có nguy cơ lỗi hàng loạt. Nếu một node bị lỗi, cả một etcd member và một instance control
plane bị lỗi, và khả năng dự phòng bị ảnh hưởng. Bạn có thể giảm thiểu rủi ro này bằng cách bổ sung thêm control plane node.

Do đó, bạn nên chạy tối thiểu ba node control plane xếp chồng cho cụm HA.

Đây là kiến trúc mặc định trong kubeadm. Một etcd member cục bộ được tạo tự động
trên control plane node khi sử dụng `kubeadm init` và `kubeadm join --control-plane`.

![Kiến trúc etcd xếp chồng](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Kiến trúc etcd bên ngoài {#external-etcd-topology}

Một cụm HA với etcd bên ngoài là một [kiến trúc](https://en.wikipedia.org/wiki/Network_topology)
nơi cụm lưu trữ dữ liệu phân tán được cung cấp bởi etcd nằm ngoài cụm được hình thành bởi
các node chạy các thành phần control plane.

Giống như kiến trúc etcd xếp chồng, mỗi control plane node trong một kiến trúc etcd bên ngoài chạy
một instance `kube-apiserver`, `kube-scheduler`, và `kube-controller-manager`.
Và `kube-apiserver` được expose tới các worker node bằng một bộ cân bằng tải. Tuy nhiên,
các etcd member chạy trên từng host riêng biệt, và từng etcd host giao tiếp với
`kube-apiserver` của từng control plane node.

Kiến trúc này tách rời control plane và etcd member. Vì thế nó cung cấp một thiết lập HA trong đó
việc mất một control plane instance hoặc một etcd member có ít tác động hơn và không ảnh hưởng tới
khả năng dự phòng của cụm như kiến trúc HA xếp chồng.

Tuy nhiên, kiến trúc này yêu cầu gấp đôi số lượng host so với kiến trúc HA xếp chồng.
Yêu cầu tối thiểu ba host cho các control plane node và ba host cho các etcd node
cho một cụm HA với kiến trúc này.

![Kiến trúc etcd bên ngoài](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Thiết lập một cụm có tính sẵn sàng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)

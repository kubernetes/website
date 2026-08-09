---
title: Hỗ trợ Dual-stack với kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Cụm Kubernetes của bạn bao gồm mạng [dual-stack](/docs/concepts/services-networking/dual-stack/),
có nghĩa là mạng của cụm cho phép bạn sử dụng một trong hai họ địa chỉ.
Trong một cụm, control plane có thể gán cả địa chỉ IPv4 và địa chỉ IPv6 cho một
{{< glossary_tooltip text="Pod" term_id="pod" >}} hoặc một {{< glossary_tooltip text="Service" term_id="service" >}}.

<!-- body -->

## {{% heading "Trước khi bắt đầu" %}}

Bạn cần cài đặt công cụ {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}},
theo các bước trong [Cài đặt kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Đối với mỗi máy chủ bạn muốn dùng làm {{< glossary_tooltip text="node" term_id="node" >}},
hãy đảm bảo nó cho phép chuyển tiếp IPv6.

### Bật chuyển tiếp gói tin IPv6 {#prerequisite-ipv6-forwarding}

Để kiểm tra xem chuyển tiếp gói tin IPv6 đã được bật chưa:

```bash
sysctl net.ipv6.conf.all.forwarding
```
Nếu đầu ra là `net.ipv6.conf.all.forwarding = 1` thì nó đã được bật.
Nếu không, nó vẫn chưa được bật.

Để bật chuyển tiếp gói tin IPv6 theo cách thủ công:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Bạn cần có một dải địa chỉ IPv4 và một dải địa chỉ IPv6 để sử dụng. Các nhà vận hành cụm thường
sử dụng các dải địa chỉ riêng tư cho IPv4. Đối với IPv6, một nhà vận hành cụm thường chọn một khối
địa chỉ unicast toàn cầu trong `2000::/3`, sử dụng một dải địa chỉ đã được cấp cho họ.
Bạn không cần định tuyến các dải địa chỉ IP của cụm ra internet công cộng.

Kích thước của các dải địa chỉ IP được cấp phát nên phù hợp với số lượng Pod và
Service mà bạn dự định chạy.

{{< note >}}
Nếu bạn đang nâng cấp một cụm hiện có bằng lệnh `kubeadm upgrade`,
`kubeadm` không hỗ trợ việc sửa đổi dải địa chỉ IP của Pod
(“cluster CIDR”) cũng như dải địa chỉ Service của cụm (“Service CIDR”).
{{< /note >}}

### Tạo cụm dual-stack

Để tạo một cụm dual-stack bằng `kubeadm init`, bạn có thể truyền các tham số dòng lệnh
tương tự như ví dụ sau:

```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Để rõ ràng hơn, đây là một ví dụ về [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm
`kubeadm-config.yaml` cho node control plane dual-stack chính.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

`advertiseAddress` trong InitConfiguration chỉ định địa chỉ IP mà API Server
sẽ quảng bá rằng nó đang lắng nghe. Giá trị của `advertiseAddress` tương ứng với
tham số `--apiserver-advertise-address` của `kubeadm init`.

Chạy kubeadm để khởi tạo node control plane dual-stack:

```shell
kubeadm init --config=kubeadm-config.yaml
```

Các tham số của kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
được thiết lập với giá trị mặc định. Xem [cấu hình dual-stack IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Tham số `--apiserver-advertise-address` không hỗ trợ dual-stack.
{{< /note >}}

### Thêm một node vào cụm dual-stack

Trước khi thêm một node, hãy đảm bảo rằng node đó có giao diện mạng có thể định tuyến IPv6 và cho phép chuyển tiếp IPv6.

Dưới đây là một ví dụ về [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm
`kubeadm-config.yaml` để thêm một worker node vào cụm.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Ngoài ra, đây là một ví dụ về [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm
`kubeadm-config.yaml` để thêm một node control plane khác vào cụm.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` trong JoinConfiguration.controlPlane chỉ định địa chỉ IP mà
API Server sẽ quảng bá rằng nó đang lắng nghe. Giá trị của `advertiseAddress` tương ứng với
tham số `--apiserver-advertise-address` của `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Tạo cụm single-stack

{{< note >}}
Hỗ trợ dual-stack không có nghĩa là bạn cần phải sử dụng địa chỉ dual-stack.
Bạn có thể triển khai một cụm single-stack với tính năng mạng dual-stack được bật.
{{< /note >}}

Để rõ ràng hơn, đây là một ví dụ về [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) kubeadm
`kubeadm-config.yaml` cho node control plane single-stack.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "Tiếp theo" %}}

* [Xác thực mạng dual-stack IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* Đọc về [mạng cụm dual-stack](/docs/concepts/services-networking/dual-stack/)
* Tìm hiểu thêm về [định dạng cấu hình kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
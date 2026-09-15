---
title: Các Container Runtime
content_type: concept
weight: 20
---

{{% dockershim-removal %}}

Bạn cần cài đặt một
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
vào mỗi node trong cluster để chạy Pod trên đó. Trang này mô tả những gì liên quan và các bước liên quan để thiết lập node.

Kubernetes {{< skew currentVersion >}} yêu cầu bạn sử dụng một runtime nào đó
đáp ứng với {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Xêm [Các CRI phiên bản](#cri-versions) để biết thêm thông tin.

Trang này mô tả một cách sử dụng container runtime phổ biến với Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Kubernetes trước v1.24 tích hợp trực tiếp với Docker Engine bằng một thành phần gọi là _dockershim_. Tích hợp đó không còn là một phần của Kubernetes nữa (Xúa này được [thông báo](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) ở v1.20 release). Xem [Kiểm tra xem xúa của Dockershim có ảnh hưởng đến bạn không](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).

Nếu bạn đang chạy một phiên bản Kubernetes khác với v{{< skew currentVersion >}}, hãy xem tài liệu của phiên bản đó.
{{< /note >}}

## Điều kiện tiên quyết của Cài đặt và cấu hình {#install-and-configure-prerequisites}

### Cấu hình mạng lưới

Trông khi tình hình mặc định, Linux kernel không cho phép các gói mạng IPv4 được chuyển đi giữa các giao diện. Hầu hết các tính năng mạng Kubernetes sẽ thay đổi cài đặt này (nếu cần thiết), nhưng một số có thể mong đợi rằng người quản trị sẽ làm cho nó. (Một số có thể cũng mong đợi các tham số sysctl khác được thiết lập, các module kernel được tải, v.v; hãy xem tài liệu cho từng tính năng mạng cụ thể của bạn.)

### Bật chuyển tiếp gói mạng IPv4 {#prerequisite-ipv4-forwarding-optional}

Để bật chuyển tiếp gói mạng IPv4:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Kiểm tra rằng `net.ipv4.ip_forward` đã được thiết lập thành 1 bằng cách:

```bash
sysctl net.ipv4.ip_forward
```

## cgroup drivers

Linux sử dụng các control groups để giới hạn các tài nguyên được cấp phát cho các quy trình.

Cả {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} và container runtime xuống nó cần giao tiếp với control groups để áp dụng [quản lý tài nguyên cho pods và containers](/docs/concepts/configuration/manage-resources-containers/)
và thiết lập tài nguyên như cpu/memory requests và limits. Để giao tiếp với control groups, kubelet và container runtime cần sử dụng một *cgroup drivers*.
Điều quan trọng là kubelet và container runtime phải sử dụng cùng một cgroup driver và cấu hình.

Tổng cộng có hai cgroup drivers có sẵn:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfs driver {#cgroupfs-cgroup-driver}

`cgroupfs` driver là [cgroup driver mặc định trong kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
Khi sử dụng `cgroupfs` driver, kubelet và container runtime giao tiếp trực tiếp với cgroup filesystem để cấu hình cgroups.

Khi [systemd](https://www.freedesktop.org/wiki/Software/systemd/) là hệ thống khởi tạo, `cgroupfs` driver không được khuyến nghị vì systemd mong đợi một cgroup manager duy nhất trên hệ thống. Bổ sung nữa, nếu bạn sử dụng [cgroup v2](/docs/concepts/architecture/cgroups), hãy sử dụng `systemd` cgroup driver thay vì `cgroupfs`.

### systemd cgroup driver {#systemd-cgroup-driver}

Khi [systemd](https://www.freedesktop.org/wiki/Software/systemd/) được chọn làm hệ thống khởi tạo cho một phân phối Linux, quy trình khởi tạo sẽ tạo và tiêu thụ một control group gốc (`cgroup`) và trở thành cgroup manager.

Sự tích hợp của systemd và cgroups rất chặt chẽ. Mỗi cái systemd unit sẽ được cấp cho một cgroup. Vì vậy, nếu bạn sử dụng `systemd` làm hệ thống khởi tạo với `cgroupfs` driver, hệ thống sẽ có hai cgroup managers khác nhau.

Hai cgroup managers sẽ dẫn đến hai cái nhìn khác nhau về các tài nguyên có sẵn và đang được sử dụng trong hệ thống. Trong một số trường hợp, các node được cấu hình sử dụng `cgroupfs` cho kubelet và container runtime, nhưng sử dụng `systemd` cho các quy trình còn lại sẽ trở nên không ổn định trong trường hợp nặng tài nguyên.

Cách để giảm thiểu tình hình không ổn định là sử dụng `systemd` làm cgroup driver cho kubelet và container runtime khi systemd được chọn làm hệ thống khởi tạo.

Để thiết lập `systemd` làm cgroup driver, chỉnh sửa cấu hình [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
của `cgroupDriver` và đặt nó thành `systemd`. Ví dụ:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
Từ v1.22 trở đi, khi tạo một cluster với kubeadm, nếu bạn không thiết lập `cgroupDriver` trong `KubeletConfiguration`, kubeadm sẽ mặc định nó thành `systemd`.
{{< /note >}}

Nếu bạn cấu hình `systemd` làm cgroup driver cho kubelet, bạn cũng phải cấu hình `systemd` làm cgroup driver cho container runtime. Hãy xem tài liệu của container runtime để biết hướng dẫn. Ví dụ:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

Kubernetes được bật `KubeletCgroupDriverFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) và một container runtime dùng được `RuntimeConfig` CRI RPC, kubelet sẽ tự động phát hiện được cgroup driver phù hợp từ runtime, và bỏ qua cài đặt `cgroupDriver` trong kubelet cấu hình.

Tuy nhiên, các phiên bản cũ hơn của container runtimes (đạc biệt là containerd 1.y và dưới) không dùng dược `RuntimeConfig` CRI RPC, và có thể không phản hồi chính xác đến yêu cầu này. Do đó kubelet sẽ sử dụng tham số `--cgroup-driver` của riêng nó.

Trong Kubernetes 1.36, hành vi này sẽ bị loại bỏ, và các containerd phiên bản cũ sẽ bị lỗi với các kubelet mới hơn.

{{< caution >}}
Thay đổi cgroup driver của một Node đã tham gia một cluster là một hoạt động quan trọng. Nếu kubelet đã tạo các Pod bằng cách sử dụng các khái niệm của một cgroup driver, thay đổi container runtime sang một cgroup driver khác có thể dẫn đến lỗi khi cố gắng tạo lại sandbox của Pod cho các Pod đó. Khởi động lại kubelet không giải quyết được các lỗi này.

Nếu bạn có một hệ thống tự động, thay thế node bằng một node mới bằng cấu hình đã cập nhật, hoặc cài đặt lại node bằng cách sử dụng hệ thống tự động.
{{< /caution >}}

## Chuyển sang cgroup driver `systemd` trong các cluster được quản lý bởi kubeadm

Nếu bạn muốn chuyển sang cgroup driver `systemd` trong các cluster được quản lý bởi kubeadm, hãy theo [cấu hình một cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Các CRI phiên bản #{cri-versions}

Container runtime của bạn phải tương thích với ít nhất v1alpha2 của container runtime interface.

Kubernetes [bắt đầu từ v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_chỉ tác dụng_ với CRI API phiên bản v1. Nhưng nếu một container runtime không tác dụng với CRI API phiên bản v1, kubelet sẽ sử dụng (đã bị loại bỏ) CRI API phiên bản v1alpha2 thay vì đó.

## Container runtimes

{{% thirdparty-content %}}

### containerd

Phần này mô tả các bước cần thiết để sử dụng containerd làm CRI runtime.

Để cài đặt containerd trên hệ thống của bạn, hãy theo các hướng dẫn trên [bắt đầu với containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md). Trở lại bước này khi bạn đã tạo một file cấu hình `config.toml` hợp lệ.

{{< tabs name="Tìm file config.toml của bạn" >}}
{{% tab name="Linux" %}}
Tìm được file này ở đường dẫn `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Tìm được file này ở đường dẫn `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

Trên Linux, CRI socket mặc định của containerd là `/run/containerd/containerd.sock`.
Trên Windows, CRI endpoint mặc định là `npipe://./pipe/containerd-containerd`.

#### Configuring the `systemd` cgroup driver {#containerd-systemd}

Để sử dụng `systemd` cgroup driver trong `/etc/containerd/config.toml` với `runc`, thiết lập cấu hình do phiên bản của bạn.

Containerd phiên bản 1.x:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Containerd phiên bản 2.x:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

`systemd` cgroup driver là khuyến nghị nếu bạn sử dụng [cgroup v2](/docs/concepts/architecture/cgroups)

{{< note >}}
Nếu bạn cài đặt containerd tử một package (ví sự, RPM hoạc `.deb`), bạn có thể phát hiện rằng plugin CRI tích hợp đã bị tắt mặc định.

Bạn cần phải có hỗ trợ CRI để sử dụng containerd với Kubernetes. Hãy đảm bảo rằng `cri` không nằm trong danh sách `disabled_plugins` trong `/etc/containerd/config.toml`; nếu bạn đã thay đổi file này, hãy khởi động lại `containerd`.

Nếu bạn gặp container lặp tuần hoàn sau cài đặt cluster ban đầu hoặc sau khi cài đặt CNI, hãy cân nhắc việc thiết lập lại cấu hình containerd`containerd config default > /etc/containerd/config.toml` as specified in
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
{{< /note >}}

Nếu bạn áp dụng thay đổi này, hãy đảm bảo khởi động lại containerd:

```shell
sudo systemctl restart containerd
```

Khi sử dụng kubeadm, xin cấu hình [cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

Trong Kubernetes v1.28, bạn có thể bật tính năng alpha tự động phát hiện cgroup driver như một tính năng. Xem thêm chi tiết tại [systemd cgroup driver](#systemd-cgroup-driver).

#### Thay đổi image sandbox (pause) {#override-pause-image-containerd}

Trong [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md), bạn có thể thay đổi image sandbox bằng cách thiết lập cấu hình sau:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Bạn có thể cần khởi động lại `containerd` khi bạn đã cập nhật file config: `systemctl restart containerd`.

### CRI-O

Phần này bao gồm các bước cần thiết để cài đặt CRI-O làm container runtime.

Để cài đặt CRI-O, hãy theo [CRI-O Install Instructions](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### cgroup driver

CRI-O sử dụng systemd cgroup driver mặc định, điều này hầu hết có hiệu quả. Để chuyển sang cgroup driver `cgroupfs`, chỉnh sửa `/etc/crio/crio.conf` hoặc đặt một drop-in configuration trong `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, ví dụ:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Lưu ý cấu hình `conmon_cgroup` phải được thiết lập thành `pod`. Điều này thường cần thiết để đảm bảo cgroup driver của kubelet (thường được thực hiện bằng kubeadm) và CRI-O được đồng bộ.

Trong Kubernetes v1.28, bạn có thể bật tính năng alpha tự động phát hiện cgroup driver như một tính năng. Xem thêm chi tiết tại [systemd cgroup driver](#systemd-cgroup-driver).

CRI socket của CRI-O mặc định là `/var/run/crio/crio.sock`.

#### Thay đổi image sandbox (pause) {#override-pause-image-cri-o}

Bạn có thể thiết lập cấu hình sau trong [CRI-O config](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Thay đổi của cấu hình này hỗ trợ tải lại cấu hình tự đọng bằng `systemctl reload crio` hoạc gửi `SIGHUP` đến quá trình `crio`.

### Docker Engine {#docker}

{{< note >}}
Hướng dẫn này giả định rằng bạn sử dụng [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) adapter để tích hợp Docker Engine với Kubernetes.
{{< /note >}}

1. Cài đặt Docker trong mỗi node, theo hướng dẫn tại [Install Docker Engine](https://docs.docker.com/engine/install/#server).

2. Cài đặt [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), theo hướng dẫn trong phần cài đặt của tài liệu.

CRI socket của `cri-dockerd` mặc định là `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) là một container runtime trên thị trường, trước đây được biết đến là Docker Enterprise Edition.

Bạn có thể sử dụng Mirantis Container Runtime với Kubernetes bằng cấu hình nguồn mở [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), được bao gồm trong MCR.

Để biết thêm thông tin về cách cài đặt Mirantis Container Runtime,
hãy xem [MCR Deployment Guide](https://docs.mirantis.com/mcr/25.0/install.html).

Kiểm tra systemd unit tên là `cri-docker.socket` để tìm ra đường dẫn đến CRI socket.

#### Thay đổi image sandbox (pause) {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` chấp nhận một tham số `--pod-infra-container-image` dòng lệnh để
xác nhận dụng image nào làm Pod infrastructure container ("pause image").

## {{% heading "whatsnext" %}}

Ngoài một container runtime, cluster của bạn cần một [network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model) hoạt động.
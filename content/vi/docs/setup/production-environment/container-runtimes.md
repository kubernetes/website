---
reviewers:
- vincepri
- bart0sh
title: Các container runtime
content_type: concept
weight: 20
---

<!-- overview -->

{{% dockershim-removal %}}

Bạn cần cài đặt một
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
vào mỗi node trong cụm để các Pod có thể chạy trên đó. Trang này phác thảo
những gì liên quan và mô tả các tác vụ liên quan để thiết lập node.

Kubernetes {{< skew currentVersion >}} yêu cầu bạn sử dụng một runtime tuân thủ
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Xem [Hỗ trợ phiên bản CRI](#cri-versions) để biết thêm thông tin.

Trang này cung cấp tổng quan về cách sử dụng một số container runtime phổ biến với Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Các bản phát hành Kubernetes trước v1.24 bao gồm tích hợp trực tiếp với Docker Engine,
sử dụng một thành phần có tên _dockershim_. Tích hợp trực tiếp đặc biệt đó không còn
là một phần của Kubernetes (việc loại bỏ này đã được
[công bố](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
trong bản phát hành v1.20).
Bạn có thể đọc
[Kiểm tra xem việc loại bỏ Dockershim có ảnh hưởng đến bạn không](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
để hiểu việc loại bỏ này có thể ảnh hưởng đến bạn như thế nào. Để tìm hiểu về việc di chuyển từ việc sử dụng dockershim, hãy xem
[Di chuyển từ dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Nếu bạn đang chạy một phiên bản Kubernetes khác với v{{< skew currentVersion >}},
hãy kiểm tra tài liệu cho phiên bản đó.
{{< /note >}}

<!-- body -->
## Cài đặt và cấu hình các điều kiện tiên quyết

### Cấu hình mạng

Theo mặc định, nhân Linux không cho phép định tuyến các gói IPv4
giữa các interface. Hầu hết các bản triển khai mạng cụm Kubernetes
sẽ thay đổi cài đặt này (nếu cần), nhưng một số có thể mong đợi
quản trị viên tự làm điều đó. (Một số cũng có thể mong đợi các tham số sysctl khác
được đặt, các mô-đun kernel được nạp, v.v.; hãy tham khảo tài liệu cho việc triển khai mạng cụ thể của bạn.)

### Bật chuyển tiếp gói IPv4 {#prerequisite-ipv4-forwarding-optional}

Để bật chuyển tiếp gói IPv4 theo cách thủ công:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Xác minh rằng `net.ipv4.ip_forward` được đặt thành 1 bằng lệnh:

```bash
sysctl net.ipv4.ip_forward
```

## Các cgroup driver

Trên Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
được sử dụng để giới hạn tài nguyên được cấp phát cho các tiến trình.

Cả {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} và
container runtime bên dưới cần giao tiếp với control groups để thực thi
[quản lý tài nguyên cho Pod và container](/docs/concepts/configuration/manage-resources-containers/)
và đặt các tài nguyên như yêu cầu và giới hạn cpu/memory. Để giao tiếp với control groups,
kubelet và container runtime cần sử dụng một *cgroup driver*.
Điều quan trọng là kubelet và container runtime phải sử dụng cùng một
cgroup driver và được cấu hình giống nhau.

Có hai cgroup driver khả dụng:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfs driver {#cgroupfs-cgroup-driver}

`cgroupfs` driver là [cgroup driver mặc định trong kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
Khi sử dụng `cgroupfs` driver, kubelet và container runtime giao tiếp trực tiếp với
hệ thống tệp cgroup để cấu hình cgroup.

`cgroupfs` driver **không** được khuyến nghị khi
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) là
hệ thống init vì systemd mong đợi một trình quản lý cgroup duy nhất trên
hệ thống. Ngoài ra, nếu bạn sử dụng [cgroup v2](/docs/concepts/architecture/cgroups), hãy sử dụng `systemd`
cgroup driver thay vì `cgroupfs`.

### systemd cgroup driver {#systemd-cgroup-driver}

Khi [systemd](https://www.freedesktop.org/wiki/Software/systemd/) được chọn làm hệ thống init
cho một bản phân phối Linux, tiến trình init sẽ tạo và sử dụng một control group
gốc (`cgroup`) và đóng vai trò là trình quản lý cgroup.

systemd có sự tích hợp chặt chẽ với cgroups và cấp phát một cgroup cho mỗi đơn vị
systemd. Do đó, nếu bạn sử dụng `systemd` làm hệ thống init với `cgroupfs`
driver, hệ thống sẽ có hai trình quản lý cgroup khác nhau.

Hai trình quản lý cgroup dẫn đến hai góc nhìn về tài nguyên khả dụng và đang được sử dụng
trong hệ thống. Trong một số trường hợp, các node được cấu hình sử dụng `cgroupfs` cho
kubelet và container runtime, nhưng sử dụng `systemd` cho phần còn lại của các tiến trình có thể trở nên
không ổn định dưới áp lực tài nguyên.

Cách để giảm thiểu sự không ổn định này là sử dụng `systemd` làm cgroup driver cho
kubelet và container runtime khi systemd là hệ thống init được chọn.

Để đặt `systemd` làm cgroup driver, hãy chỉnh sửa
tùy chọn `cgroupDriver` trong
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
và đặt nó thành `systemd`. Ví dụ:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
Bắt đầu từ v1.22 trở lên, khi tạo cụm bằng kubeadm, nếu người dùng không đặt
trường `cgroupDriver` trong `KubeletConfiguration`, kubeadm sẽ đặt mặc định là `systemd`.
{{< /note >}}

Nếu bạn cấu hình `systemd` làm cgroup driver cho kubelet, bạn cũng phải
cấu hình `systemd` làm cgroup driver cho container runtime. Tham khảo
tài liệu của container runtime để biết hướng dẫn. Ví dụ:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

Trong Kubernetes {{< skew currentVersion >}}, với [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`KubeletCgroupDriverFromCRI` được bật và một container runtime hỗ trợ CRI RPC `RuntimeConfig`,
kubelet tự động phát hiện cgroup driver phù hợp từ runtime,
và bỏ qua cài đặt `cgroupDriver` trong cấu hình kubelet.

Tuy nhiên, các phiên bản cũ hơn của container runtime (cụ thể là
containerd 1.y trở xuống) không hỗ trợ CRI RPC `RuntimeConfig`,
và có thể không phản hồi chính xác truy vấn này, do đó Kubelet sẽ quay lại
sử dụng giá trị trong cờ `--cgroup-driver` của chính nó.

Trong Kubernetes 1.38, hành vi dự phòng này sẽ bị loại bỏ, và các phiên bản cũ hơn
của containerd sẽ gặp lỗi với các kubelet mới hơn.

{{< caution >}}
Thay đổi cgroup driver của một Node đã tham gia cụm là một thao tác nhạy cảm.
Nếu kubelet đã tạo Pod bằng ngữ nghĩa của một cgroup driver, việc thay đổi
container runtime sang một cgroup driver khác có thể gây ra lỗi khi cố gắng tạo lại Pod sandbox
cho các Pod hiện có đó. Khởi động lại kubelet có thể không giải quyết được các lỗi như vậy.

Nếu bạn có giải pháp tự động hóa (automation) khả thi, hãy thay node đó bằng một node khác sử dụng cấu hình
đã cập nhật, hoặc cài đặt lại nó bằng cách tự động hóa.
{{< /caution >}}

### Di chuyển sang `systemd` driver trong các cụm do kubeadm quản lý

Nếu bạn muốn di chuyển sang `systemd` cgroup driver trong các cụm kubeadm hiện có,
hãy làm theo hướng dẫn [cấu hình cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Hỗ trợ phiên bản CRI {#cri-versions}

Container runtime của bạn phải hỗ trợ phiên bản 1 của container runtime interface.

Kubernetes [bắt đầu từ v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_chỉ hoạt động_ với phiên bản 1 của CRI API. Nếu một container runtime không hỗ trợ API v1,
kubelet sẽ không đăng ký như một node.

## Container runtimes

{{% thirdparty-content %}}

### containerd

Phần này phác thảo các bước cần thiết để sử dụng containerd làm CRI runtime.

Để cài đặt containerd trên hệ thống của bạn, hãy làm theo hướng dẫn
[bắt đầu với containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Quay lại bước này sau khi bạn đã tạo một tệp cấu hình `config.toml` hợp lệ.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
Bạn có thể tìm thấy tệp này tại đường dẫn `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Bạn có thể tìm thấy tệp này tại đường dẫn `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

Trên Linux, CRI socket mặc định cho containerd là `/run/containerd/containerd.sock`.
Trên Windows, CRI endpoint mặc định là `npipe://./pipe/containerd-containerd`.

#### Cấu hình `systemd` cgroup driver {#containerd-systemd}

Để sử dụng `systemd` cgroup driver trong `/etc/containerd/config.toml` với `runc`,
hãy đặt cấu hình sau dựa trên phiên bản Containerd của bạn

Các phiên bản Containerd 1.x:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Các phiên bản Containerd 2.x:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

`systemd` cgroup driver được khuyến nghị nếu bạn sử dụng [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Nếu bạn cài đặt containerd từ một gói (ví dụ RPM hoặc `.deb`), bạn có thể thấy rằng
plugin tích hợp CRI bị vô hiệu hóa theo mặc định.

Bạn cần bật hỗ trợ CRI để sử dụng containerd với Kubernetes. Đảm bảo rằng `cri`
không nằm trong danh sách `disabled_plugins` trong `/etc/containerd/config.toml`;
nếu bạn đã thay đổi tệp đó, hãy khởi động lại `containerd`.

Nếu bạn gặp phải vòng lặp crash của container sau khi cài đặt cụm ban đầu hoặc sau khi
cài đặt CNI, cấu hình containerd đi kèm với gói có thể chứa
các tham số cấu hình không tương thích. Cân nhắc đặt lại cấu hình containerd
bằng lệnh `containerd config default > /etc/containerd/config.toml` như được mô tả trong
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
và sau đó đặt các tham số cấu hình đã nêu ở trên cho phù hợp.
{{< /note >}}

Nếu bạn áp dụng thay đổi này, hãy đảm bảo khởi động lại containerd:

```shell
sudo systemctl restart containerd
```

Khi sử dụng kubeadm, hãy cấu hình thủ công
[cgroup driver cho kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

Trong Kubernetes v1.28, bạn có thể bật tính năng tự động phát hiện
cgroup driver như một tính năng alpha. Xem [systemd cgroup driver](#systemd-cgroup-driver)
để biết thêm chi tiết.

#### Ghi đè sandbox (pause) image {#override-pause-image-containerd}

Trong [cấu hình containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) của bạn, bạn có thể ghi đè
sandbox image bằng cách đặt cấu hình sau:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Bạn có thể cần khởi động lại `containerd` sau khi cập nhật tệp cấu hình: `systemctl restart containerd`.

### CRI-O

Phần này chứa các bước cần thiết để cài đặt CRI-O làm container runtime.

Để cài đặt CRI-O, hãy làm theo [Hướng dẫn cài đặt CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### cgroup driver

CRI-O mặc định sử dụng systemd cgroup driver, điều này có thể hoạt động tốt
cho bạn. Để chuyển sang `cgroupfs` cgroup driver, hãy chỉnh sửa
`/etc/crio/crio.conf` hoặc đặt một cấu hình drop-in trong
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, ví dụ:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Bạn cũng nên lưu ý `conmon_cgroup` đã thay đổi, giá trị này phải được đặt thành `pod`
khi sử dụng CRI-O với `cgroupfs`. Thông thường cần giữ
cấu hình cgroup driver của kubelet (thường thực hiện qua kubeadm) và CRI-O
đồng bộ với nhau.

Trong Kubernetes v1.28, bạn có thể bật tính năng tự động phát hiện
cgroup driver như một tính năng alpha. Xem [systemd cgroup driver](#systemd-cgroup-driver)
để biết thêm chi tiết.

Đối với CRI-O, CRI socket mặc định là `/var/run/crio/crio.sock`.

#### Ghi đè sandbox (pause) image {#override-pause-image-cri-o}

Trong [cấu hình CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md), bạn có thể đặt giá trị
cấu hình sau:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Tùy chọn cấu hình này hỗ trợ tải lại cấu hình trực tiếp để áp dụng thay đổi: `systemctl reload crio` hoặc gửi
`SIGHUP` tới tiến trình `crio`.

### Docker Engine {#docker}

{{< note >}}
Các hướng dẫn này giả định rằng bạn đang sử dụng adapter
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) để tích hợp
Docker Engine với Kubernetes.
{{< /note >}}

1. Trên mỗi node của bạn, cài đặt Docker cho bản phân phối Linux của bạn theo
  [Cài đặt Docker Engine](https://docs.docker.com/engine/install/#server).

2. Cài đặt [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), làm theo hướng dẫn trong phần cài đặt của tài liệu.

Đối với `cri-dockerd`, CRI socket mặc định là `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) là một
container runtime thương mại, trước đây được gọi là Docker Enterprise Edition.

Bạn có thể sử dụng Mirantis Container Runtime với Kubernetes bằng thành phần mã nguồn mở
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/), đi kèm với MCR.

Để tìm hiểu thêm về cách cài đặt Mirantis Container Runtime,
hãy truy cập [Hướng dẫn triển khai MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Kiểm tra systemd unit có tên `cri-docker.socket` để biết đường dẫn tới CRI
socket.

#### Ghi đè sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

Adapter `cri-dockerd` chấp nhận một tham số dòng lệnh để chỉ định image container nào được sử dụng làm
container hạ tầng Pod (“pause image”). Tham số dòng lệnh cần sử dụng là `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

Ngoài container runtime, cụm của bạn sẽ cần một
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model) hoạt động.
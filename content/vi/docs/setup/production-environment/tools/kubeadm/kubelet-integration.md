---
reviewers:
- sig-cluster-lifecycle
title: Cấu hình từng kubelet trong cụm của bạn bằng kubeadm
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Vòng đời của công cụ dòng lệnh kubeadm được tách rời khỏi
[kubelet](/docs/reference/command-line-tools-reference/kubelet), một daemon chạy trên mỗi Node
trong cụm Kubernetes. Công cụ dòng lệnh kubeadm được người dùng thực thi khi Kubernetes được
khởi tạo hoặc nâng cấp, trong khi kubelet luôn chạy trong nền.

Vì kubelet là một daemon, nó cần được quản lý bởi một hệ thống init hoặc trình quản lý dịch vụ
nào đó. Khi kubelet được cài đặt bằng DEB hoặc RPM, systemd sẽ được cấu hình để quản lý kubelet.
Bạn có thể dùng một trình quản lý dịch vụ khác, nhưng cần phải cấu hình thủ công.

Một số chi tiết cấu hình kubelet cần phải giống nhau trên tất cả các kubelet tham gia vào cụm, trong khi
một số khía cạnh cấu hình khác cần được đặt riêng cho từng kubelet để phù hợp với các đặc điểm khác nhau
của một máy nhất định (như hệ điều hành, bộ lưu trữ và mạng). Bạn có thể quản lý cấu hình kubelet
của mình theo cách thủ công, nhưng kubeadm hiện cung cấp một kiểu API `KubeletConfiguration` để
[quản lý cấu hình kubelet của bạn một cách tập trung](#configure-kubelets-using-kubeadm).

<!-- body -->

## Các mẫu cấu hình kubelet

Các phần dưới đây mô tả các mẫu cấu hình kubelet được đơn giản hóa khi sử dụng kubeadm,
thay vì phải tự quản lý cấu hình kubelet cho từng Node.

### Truyền cấu hình cấp cụm đến từng kubelet

Bạn có thể cung cấp cho kubelet các giá trị mặc định được sử dụng bởi lệnh `kubeadm init` và `kubeadm join`.
Các ví dụ điển hình bao gồm việc sử dụng một container runtime khác hoặc đặt subnet mặc định được các dịch vụ sử dụng.

Nếu bạn muốn các dịch vụ của mình sử dụng subnet `10.96.0.0/12` làm giá trị mặc định, bạn có thể truyền
tham số `--service-cidr` cho kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Các địa chỉ IP ảo cho dịch vụ lúc này sẽ được cấp phát từ subnet này. Bạn cũng cần đặt địa chỉ DNS mà
kubelet sử dụng, thông qua cờ `--cluster-dns`. Cài đặt này cần phải giống nhau trên mọi kubelet
thuộc mọi manager và Node trong cụm. Kubelet cung cấp một đối tượng API có cấu trúc, được phiên bản hóa
có thể cấu hình hầu hết các tham số trong kubelet và đẩy cấu hình này ra từng kubelet đang chạy
trong cụm. Đối tượng này được gọi là
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
`KubeletConfiguration` cho phép người dùng chỉ định các cờ như địa chỉ IP DNS của cụm được biểu diễn
dưới dạng một danh sách các giá trị tương ứng với một khóa viết theo kiểu camelCased, như ví dụ sau:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Để biết thêm chi tiết về `KubeletConfiguration`, hãy xem [phần này](#configure-kubelets-using-kubeadm).

### Cung cấp chi tiết cấu hình cụ thể cho từng máy

Một số máy chủ yêu cầu cấu hình kubelet cụ thể do sự khác biệt về phần cứng, hệ điều hành, mạng
hoặc các tham số riêng của máy chủ. Danh sách dưới đây đưa ra một vài ví dụ.

- Đường dẫn đến tệp phân giải DNS, được chỉ định bởi cờ cấu hình kubelet `--resolv-conf`,
  có thể khác nhau giữa các hệ điều hành, hoặc tùy thuộc vào việc bạn có sử dụng
  `systemd-resolved` hay không. Nếu đường dẫn này sai, việc phân giải DNS sẽ thất bại trên Node có
  kubelet được cấu hình không chính xác.

- Đối tượng API Node `.metadata.name` mặc định được đặt theo hostname của máy,
  trừ khi bạn sử dụng một nhà cung cấp đám mây. Bạn có thể dùng cờ `--hostname-override` để ghi đè
  hành vi mặc định nếu bạn cần chỉ định một tên Node khác với hostname của máy.

- Hiện tại, kubelet không thể tự động phát hiện cgroup driver mà container runtime sử dụng,
  nhưng giá trị của `--cgroup-driver` phải khớp với cgroup driver mà container runtime đang dùng để đảm bảo
  kubelet hoạt động ổn định.

- Để chỉ định container runtime, bạn phải đặt endpoint của nó bằng cờ
`--container-runtime-endpoint=<path>`.

Cách được khuyến nghị để áp dụng các cấu hình riêng cho từng máy như vậy là sử dụng
[các bản vá `KubeletConfiguration`](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Cấu hình kubelet bằng kubeadm

Có thể cấu hình kubelet mà kubeadm sẽ khởi động nếu bạn truyền một đối tượng
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
tùy chỉnh cùng với một tệp cấu hình như sau: `kubeadm ... --config some-config-file.yaml`.

Bằng cách gọi `kubeadm config print init-defaults --component-configs KubeletConfiguration`, bạn có thể
xem tất cả các giá trị mặc định cho cấu trúc này.

Bạn cũng có thể áp dụng các bản vá riêng cho từng máy lên `KubeletConfiguration` cơ sở.
Hãy xem [Tùy chỉnh kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
để biết thêm chi tiết.

### Quy trình khi sử dụng `kubeadm init`

Khi bạn gọi `kubeadm init`, cấu hình kubelet được ghi xuống đĩa
tại `/var/lib/kubelet/config.yaml` và cũng được tải lên một ConfigMap `kubelet-config`
trong namespace `kube-system` của cụm.
Ngoài ra, công cụ kubeadm phát hiện socket CRI trên Node và ghi thông tin chi tiết của nó
(bao gồm cả đường dẫn socket) vào một cấu hình cục bộ, `/var/lib/kubelet/instance-config.yaml`.
Một tệp cấu hình kubelet cũng được ghi vào `/etc/kubernetes/kubelet.conf`
với cấu hình cơ sở chung cho toàn cụm của tất cả các kubelet trong cụm. Tệp cấu hình này
trỏ đến các chứng chỉ máy khách cho phép kubelet giao tiếp với API server. Điều này
đáp ứng nhu cầu
[truyền cấu hình cấp cụm đến từng kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Để giải quyết mẫu thứ hai về
[cung cấp chi tiết cấu hình cụ thể cho từng máy](#providing-instance-specific-configuration-details),
kubeadm ghi một tệp môi trường vào `/var/lib/kubelet/kubeadm-flags.env`, chứa một danh sách các
cờ cần truyền cho kubelet khi nó khởi động. Các cờ được hiển thị trong tệp như sau:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Ngoài các cờ được sử dụng khi khởi động kubelet, tệp này còn chứa các tham số động
như cgroup driver.

Sau khi ghi hai tệp này xuống đĩa, kubeadm sẽ cố chạy hai lệnh sau, nếu bạn đang sử dụng systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Nếu việc tải lại và khởi động lại thành công, quy trình `kubeadm init` thông thường sẽ tiếp tục.

### Quy trình khi sử dụng `kubeadm join`

Khi bạn chạy `kubeadm join`, kubeadm sử dụng thông tin xác thực Bootstrap Token để thực hiện
TLS bootstrap, quá trình này lấy thông tin xác thực cần thiết để tải ConfigMap
`kubelet-config` và ghi nó vào `/var/lib/kubelet/config.yaml`.
Ngoài ra, công cụ kubeadm phát hiện socket CRI trên Node và ghi thông tin chi tiết của nó
(bao gồm cả đường dẫn socket) vào một cấu hình cục bộ, `/var/lib/kubelet/instance-config.yaml`.
Tệp môi trường động được tạo ra theo cách hoàn toàn giống như `kubeadm init`.

Tiếp theo, `kubeadm` chạy hai lệnh sau để nạp cấu hình mới vào kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Sau khi kubelet nạp cấu hình mới, kubeadm ghi tệp KubeConfig
`/etc/kubernetes/bootstrap-kubelet.conf`, chứa chứng chỉ CA và Bootstrap
Token. Các thông tin này được kubelet sử dụng để thực hiện TLS Bootstrap và lấy một
thông tin xác thực duy nhất, được lưu tại `/etc/kubernetes/kubelet.conf`.

Khi tệp `/etc/kubernetes/kubelet.conf` được ghi, kubelet đã hoàn tất việc thực hiện TLS Bootstrap.
Kubeadm xóa tệp `/etc/kubernetes/bootstrap-kubelet.conf` sau khi hoàn tất TLS Bootstrap.

## Tệp drop-in của kubelet cho systemd

`kubeadm` được phân phối kèm cấu hình hướng dẫn cách systemd vận hành kubelet.
Lưu ý rằng lệnh CLI kubeadm không bao giờ tác động đến tệp drop-in này.

Tệp cấu hình này do [gói kubeadm](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) cài đặt được ghi vào `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` và được systemd sử dụng.
Nó bổ sung cho
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service) cơ bản.

Nếu bạn muốn ghi đè sâu hơn nữa, bạn có thể tạo một thư mục `/etc/systemd/system/kubelet.service.d/`
(không phải `/usr/lib/systemd/system/kubelet.service.d/`) và đặt các tùy chỉnh của riêng bạn vào một tệp trong đó.
Ví dụ: bạn có thể thêm một tệp cục bộ mới `/etc/systemd/system/kubelet.service.d/local-overrides.conf`
để ghi đè các cài đặt unit do `kubeadm` cấu hình.

Dưới đây là nội dung bạn thường thấy trong `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
Nội dung bên dưới chỉ là một ví dụ. Nếu bạn không muốn sử dụng trình quản lý gói,
hãy làm theo hướng dẫn trong phần ([Không dùng trình quản lý gói](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)).
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Tệp này chỉ định các vị trí mặc định cho tất cả các tệp do kubeadm quản lý cho kubelet.

- Tệp KubeConfig dùng cho TLS Bootstrap là `/etc/kubernetes/bootstrap-kubelet.conf`,
  nhưng nó chỉ được sử dụng nếu `/etc/kubernetes/kubelet.conf` chưa tồn tại.
- Tệp KubeConfig chứa danh tính kubelet duy nhất là `/etc/kubernetes/kubelet.conf`.
- Tệp chứa ComponentConfig của kubelet là `/var/lib/kubelet/config.yaml`.
- Tệp môi trường động chứa `KUBELET_KUBEADM_ARGS` được lấy từ `/var/lib/kubelet/kubeadm-flags.env`.
- Tệp có thể chứa các cờ ghi đè do người dùng chỉ định với `KUBELET_EXTRA_ARGS` được lấy từ
  `/etc/default/kubelet` (đối với DEB) hoặc `/etc/sysconfig/kubelet` (đối với RPM). `KUBELET_EXTRA_ARGS`
  nằm ở cuối chuỗi cờ và có quyền ưu tiên cao nhất trong trường hợp có xung đột cài đặt.

## Các tệp nhị phân Kubernetes và nội dung gói

Các gói DEB và RPM được phân phối cùng với các bản phát hành Kubernetes là:

| Tên gói | Mô tả |
|--------------|-------------|
| `kubeadm`    | Cài đặt công cụ CLI `/usr/bin/kubeadm` và [tệp drop-in cho kubelet](#the-kubelet-drop-in-file-for-systemd). |
| `kubelet`    | Cài đặt tệp nhị phân `/usr/bin/kubelet`. |
| `kubectl`    | Cài đặt tệp nhị phân `/usr/bin/kubectl`. |
| `cri-tools` | Cài đặt tệp nhị phân `/usr/bin/crictl` từ [kho git cri-tools](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Cài đặt các tệp nhị phân `/opt/cni/bin` từ [kho git plugins](https://github.com/containernetworking/plugins). |
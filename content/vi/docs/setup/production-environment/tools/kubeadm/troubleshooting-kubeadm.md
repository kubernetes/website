---
title: Khắc phục sự cố kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

Cũng giống như bất kỳ chương trình nào, bạn có thể gặp phải lỗi khi cài đặt hoặc chạy kubeadm.
Trang này liệt kê một số tình huống lỗi phổ biến và cung cấp các bước giúp bạn hiểu và khắc phục vấn đề.

Nếu vấn đề của bạn không được liệt kê bên dưới, vui lòng làm theo các bước sau:

- Nếu bạn nghĩ vấn đề của mình là lỗi của kubeadm:
  - Truy cập [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) và tìm kiếm các issue hiện có.
  - Nếu chưa có issue nào, vui lòng [mở một issue mới](https://github.com/kubernetes/kubeadm/issues/new) và làm theo mẫu issue.

- Nếu bạn không chắc chắn về cách kubeadm hoạt động, bạn có thể hỏi trên [Slack](https://slack.k8s.io/) trong kênh `#kubeadm`,
  hoặc đặt câu hỏi trên [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Vui lòng bao gồm
  các thẻ liên quan như `#kubernetes` và `#kubeadm` để mọi người có thể giúp đỡ bạn.

<!-- body -->

## Không thể tham gia (join) một Node v1.18 vào cụm v1.17 do thiếu RBAC

Trong v1.18, kubeadm đã thêm cơ chế ngăn chặn việc tham gia (join) một Node vào cụm nếu một Node có cùng tên đã tồn tại.
Điều này yêu cầu bổ sung RBAC cho người dùng bootstrap-token để có thể GET một đối tượng Node.

Tuy nhiên, điều này gây ra sự cố khiến `kubeadm join` từ v1.18 không thể tham gia vào cụm được tạo bởi kubeadm v1.17.

Để giải quyết vấn đề này, bạn có hai lựa chọn:

Hãy thực thi `kubeadm init phase bootstrap-token` trên một control-plane node sử dụng kubeadm v1.18.
Lưu ý rằng điều này cũng kích hoạt tất cả các quyền còn lại của bootstrap-token.

hoặc

Áp dụng RBAC sau theo cách thủ công bằng `kubectl apply -f ...`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## Không tìm thấy `ebtables` hoặc một số tệp thực thi tương tự trong quá trình cài đặt

Nếu bạn thấy các cảnh báo sau khi chạy `kubeadm init`:

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Thì có thể node của bạn đang thiếu `ebtables`, `ethtool` hoặc một tệp thực thi tương tự.
Bạn có thể cài đặt chúng bằng các lệnh sau:

- Đối với người dùng Ubuntu/Debian, chạy `apt install ebtables ethtool`.
- Đối với người dùng CentOS/Fedora, chạy `yum install ebtables ethtool`.

## kubeadm bị chặn khi chờ control plane trong quá trình cài đặt

Nếu bạn nhận thấy `kubeadm init` bị treo sau khi in ra dòng sau:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Điều này có thể do một số vấn đề. Phổ biến nhất là:

- Vấn đề kết nối mạng. Kiểm tra máy của bạn có kết nối mạng đầy đủ trước khi tiếp tục.
- Trình điều khiển cgroup của container runtime khác với trình điều khiển cgroup của kubelet. Để hiểu cách cấu hình đúng, hãy xem [Cấu hình trình điều khiển cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- Các container control plane đang crashlooping hoặc bị treo. Bạn có thể kiểm tra bằng cách chạy `docker ps` và xem xét từng container bằng `docker logs`. Đối với các container runtime khác, hãy xem [Gỡ lỗi các node Kubernetes bằng crictl](/docs/tasks/debug/debug-cluster/crictl/).

## kubeadm bị chặn khi xóa các container được quản lý

Điều này có thể xảy ra nếu container runtime dừng lại và không xóa bất kỳ container nào do Kubernetes quản lý:

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

Một giải pháp khả thi là khởi động lại container runtime và sau đó chạy lại `kubeadm reset`.
Bạn cũng có thể sử dụng `crictl` để gỡ lỗi trạng thái của container runtime. Xem
[Gỡ lỗi các node Kubernetes bằng crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Các Pod ở trạng thái `RunContainerError`, `CrashLoopBackOff` hoặc `Error`

Ngay sau khi chạy `kubeadm init`, không được có pod nào ở các trạng thái này.

- Nếu có pod ở một trong các trạng thái này _ngay sau khi_ `kubeadm init`, vui lòng mở một
  issue trong repo kubeadm. `coredns` (hoặc `kube-dns`) sẽ ở trạng thái `Pending`
  cho đến khi bạn triển khai network add-on.
- Nếu bạn thấy các Pod ở trạng thái `RunContainerError`, `CrashLoopBackOff` hoặc `Error`
  sau khi triển khai network add-on và `coredns` (hoặc `kube-dns`) không có thay đổi gì,
  rất có thể network add-on bạn cài đặt đã bị lỗi theo cách nào đó.
  Bạn có thể cần cấp thêm quyền RBAC cho nó hoặc sử dụng phiên bản mới hơn. Vui lòng tạo
  một issue trong trình theo dõi issue của nhà cung cấp Pod Network và để vấn đề được phân loại (triaged) ở đó.

## `coredns` bị kẹt ở trạng thái `Pending`

Đây là điều **bình thường** và nằm trong thiết kế. kubeadm không phụ thuộc vào nhà cung cấp mạng (network provider-agnostic), vì vậy quản trị viên nên [cài đặt network add-on cho pod](/docs/concepts/cluster-administration/addons/) mà mình lựa chọn. Bạn phải cài đặt Pod Network trước khi CoreDNS có thể được triển khai đầy đủ. Do đó, trạng thái `Pending` xuất hiện trước khi mạng được thiết lập.

## Các service `HostPort` không hoạt động

Chức năng `HostPort` và `HostIP` có sẵn hay không tùy thuộc vào nhà cung cấp Pod Network của bạn. Vui lòng liên hệ với tác giả của Pod Network add-on để tìm hiểu xem chức năng `HostPort` và `HostIP` có khả dụng không.

Các nhà cung cấp CNI Calico, Canal và Flannel đã được xác minh là hỗ trợ HostPort.

Để biết thêm thông tin, hãy xem
[tài liệu portmap của CNI](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Nếu nhà cung cấp mạng của bạn không hỗ trợ plugin CNI portmap, bạn có thể cần sử dụng
[tính năng NodePort của service](/docs/concepts/services-networking/service/#type-nodeport)
hoặc sử dụng `HostNetwork=true`.

## Không thể truy cập các Pod qua Service IP của chúng

- Nhiều network add-on chưa bật [chế độ hairpin](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  cho phép pod truy cập chính nó qua Service IP. Đây là một vấn đề liên quan đến
  [CNI](https://github.com/containernetworking/cni/issues/476). Vui lòng liên hệ với nhà cung cấp
  network add-on để biết trạng thái hỗ trợ chế độ hairpin mới nhất của họ.

- Nếu bạn đang sử dụng VirtualBox (trực tiếp hoặc qua Vagrant), bạn cần
  đảm bảo rằng `hostname -i` trả về một địa chỉ IP có thể định tuyến (routable). Theo mặc định,
  giao diện đầu tiên được kết nối với một mạng host-only không thể định tuyến. Một cách giải quyết
  là sửa `/etc/hosts`, xem [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) này làm ví dụ.

## Lỗi chứng chỉ TLS

Lỗi sau đây cho thấy có thể có sự không khớp chứng chỉ.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Xác minh rằng tệp `$HOME/.kube/config` chứa một chứng chỉ hợp lệ và
  tạo lại chứng chỉ nếu cần. Các chứng chỉ trong tệp kubeconfig
  được mã hóa base64. Lệnh `base64 --decode` có thể được sử dụng để giải mã chứng chỉ
  và `openssl x509 -text -noout` có thể được sử dụng để xem thông tin chứng chỉ.

- Hủy đặt biến môi trường `KUBECONFIG` bằng cách:

  ```sh
  unset KUBECONFIG
  ```

  Hoặc đặt nó thành vị trí `KUBECONFIG` mặc định:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Một cách giải quyết khác là ghi đè `kubeconfig` hiện có cho người dùng "admin":

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Quá trình luân chuyển chứng chỉ client của Kubelet không thành công {#kubelet-client-cert}

Theo mặc định, kubeadm cấu hình kubelet với tính năng tự động luân chuyển chứng chỉ client bằng cách sử dụng symlink `/var/lib/kubelet/pki/kubelet-client-current.pem` được chỉ định trong `/etc/kubernetes/kubelet.conf`.
Nếu quá trình luân chuyển này thất bại, bạn có thể thấy các lỗi như `x509: certificate has expired or is not yet valid`
trong nhật ký kube-apiserver. Để khắc phục vấn đề, bạn phải thực hiện các bước sau:

1. Sao lưu và xóa `/etc/kubernetes/kubelet.conf` và `/var/lib/kubelet/pki/kubelet-client*` khỏi node bị lỗi.
1. Từ một control plane node đang hoạt động trong cụm có `/etc/kubernetes/pki/ca.key`, thực thi
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   `$NODE` phải được đặt thành tên của node bị lỗi hiện có trong cụm.
   Sửa tệp `kubelet.conf` tạo ra theo cách thủ công để điều chỉnh tên cụm và endpoint của máy chủ,
   hoặc truyền `kubeconfig user --config` (xem [Tạo tệp kubeconfig cho người dùng bổ sung](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). Nếu cụm của bạn không có
   `ca.key`, bạn phải ký các chứng chỉ nhúng trong `kubelet.conf` từ bên ngoài.
1. Sao chép tệp `kubelet.conf` này đến `/etc/kubernetes/kubelet.conf` trên node bị lỗi.
1. Khởi động lại kubelet (`systemctl restart kubelet`) trên node bị lỗi và chờ
   `/var/lib/kubelet/pki/kubelet-client-current.pem` được tạo lại.
1. Chỉnh sửa thủ công `kubelet.conf` để trỏ đến các chứng chỉ client kubelet đã luân chuyển, bằng cách thay thế
   `client-certificate-data` và `client-key-data` bằng:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. Khởi động lại kubelet.
1. Đảm bảo node chuyển sang trạng thái `Ready`.

## NIC mặc định khi sử dụng flannel làm pod network trong Vagrant

Lỗi sau đây có thể chỉ ra rằng có điều gì đó không đúng trong pod network:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Nếu bạn đang sử dụng flannel làm pod network trong Vagrant, bạn sẽ phải
  chỉ định tên giao diện mặc định cho flannel.

  Vagrant thường gán hai giao diện cho tất cả VM. Giao diện đầu tiên, mà tất cả các host
  được gán địa chỉ IP `10.0.2.15`, dùng cho lưu lượng bên ngoài được NAT.

  Điều này có thể dẫn đến vấn đề với flannel, vì flannel mặc định sử dụng giao diện đầu tiên trên một host.
  Điều này khiến tất cả các host nghĩ rằng chúng có cùng một địa chỉ IP công khai. Để ngăn chặn điều này,
  hãy truyền cờ `--iface eth1` cho flannel để chọn giao diện thứ hai.

## Sử dụng IP không công khai (non-public) cho container

Trong một số tình huống, các lệnh `kubectl logs` và `kubectl run` có thể trả về
các lỗi sau trên một cụm vẫn hoạt động bình thường:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Điều này có thể do Kubernetes sử dụng một IP không thể giao tiếp với các IP khác trên
  cùng một subnet, có thể do chính sách của nhà cung cấp máy.
- DigitalOcean gán một IP công khai cho `eth0` cũng như một IP riêng để sử dụng nội bộ
  làm anchor IP cho tính năng floating IP của họ, nhưng `kubelet` sẽ chọn IP riêng làm
  `InternalIP` của node thay vì IP công khai.

  Sử dụng `ip addr show` để kiểm tra tình huống này thay vì `ifconfig` vì `ifconfig` sẽ
  không hiển thị địa chỉ IP alias gây ra vấn đề. Ngoài ra, một API endpoint dành riêng cho
  DigitalOcean cho phép truy vấn anchor IP từ droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Giải pháp là báo cho `kubelet` biết IP cần sử dụng thông qua `--node-ip`.
  Khi sử dụng DigitalOcean, đó có thể là IP công khai (gán cho `eth0`) hoặc
  IP riêng (gán cho `eth1`) nếu bạn muốn sử dụng mạng riêng tùy chọn. Phần `kubeletExtraArgs` của
  [cấu trúc `NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions) trong kubeadm
  có thể được sử dụng cho việc này.

  Sau đó khởi động lại `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Các pod `coredns` ở trạng thái `CrashLoopBackOff` hoặc `Error`

Nếu bạn có các node đang chạy SELinux với phiên bản Docker cũ, bạn có thể gặp phải tình huống
trong đó các pod `coredns` không khởi động. Để giải quyết, bạn có thể thử một trong các tùy chọn sau:

- Nâng cấp lên [phiên bản Docker mới hơn](/docs/setup/production-environment/container-runtimes/#docker).

- [Tắt SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Sửa deployment `coredns` để đặt `allowPrivilegeEscalation` thành `true`:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

Một nguyên nhân khác khiến CoreDNS bị `CrashLoopBackOff` là khi một Pod CoreDNS được triển khai trong Kubernetes phát hiện ra một vòng lặp (loop).
[Có một số cách giải quyết](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
để tránh việc Kubernetes cố gắng khởi động lại Pod CoreDNS mỗi khi CoreDNS phát hiện ra vòng lặp và thoát.

{{< warning >}}
Tắt SELinux hoặc đặt `allowPrivilegeEscalation` thành `true` có thể làm ảnh hưởng đến tính bảo mật của cụm bạn.
{{< /warning >}}

## Các pod etcd liên tục khởi động lại

Nếu bạn gặp phải lỗi sau:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

Vấn đề này xuất hiện nếu bạn chạy CentOS 7 với Docker 1.13.1.84.
Phiên bản Docker này có thể ngăn kubelet thực thi vào container etcd.

Để giải quyết vấn đề, hãy chọn một trong các tùy chọn sau:

- Quay lại phiên bản Docker cũ hơn, chẳng hạn 1.13.1-75

  ```
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Cài đặt một trong các phiên bản mới hơn được khuyến nghị, chẳng hạn 18.06:

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## Không thể truyền danh sách giá trị phân tách bằng dấu phẩy cho các đối số trong cờ `--component-extra-args`

Các cờ của `kubeadm init` như `--component-extra-args` cho phép bạn truyền các đối số tùy chỉnh cho một thành phần control-plane như kube-apiserver. Tuy nhiên, cơ chế này bị giới hạn do kiểu dữ liệu cơ bản được sử dụng để phân tích cú pháp các giá trị (`mapStringString`).

Nếu bạn quyết định truyền một đối số hỗ trợ nhiều giá trị phân tách bằng dấu phẩy như
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`, cờ này sẽ thất bại với lỗi
`flag: malformed pair, expect string=string`. Điều này xảy ra vì danh sách đối số cho
`--apiserver-extra-args` mong đợi các cặp `key=value` và trong trường hợp này `NamespacesExists` bị coi
là một key thiếu value.

Một cách khác, bạn có thể thử tách các cặp `key=value` như sau:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
nhưng điều này sẽ khiến key `enable-admission-plugins` chỉ có giá trị `NamespaceExists`.

Một giải pháp đã biết là sử dụng [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) của kubeadm.

## kube-proxy được lên lịch (scheduled) trước khi node được cloud-controller-manager khởi tạo

Trong các tình huống cloud provider, kube-proxy có thể được lên lịch trên các worker node mới trước khi
cloud-controller-manager khởi tạo địa chỉ node. Điều này khiến kube-proxy không thể lấy được
địa chỉ IP của node một cách chính xác và gây ra các tác động dây chuyền đến chức năng proxy quản lý
các bộ cân bằng tải (load balancer).

Lỗi sau có thể được thấy trong các Pod kube-proxy:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Một giải pháp đã biết là vá (patch) DaemonSet kube-proxy để cho phép lên lịch nó trên các control-plane
node bất kể trạng thái của chúng, đồng thời giữ nó không chạy trên các node khác cho đến khi các điều kiện bảo vệ ban đầu
của chúng giảm bớt:

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

Issue theo dõi cho vấn đề này nằm ở [đây](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` được gắn (mount) ở chế độ chỉ đọc trên các node {#usr-mounted-read-only}

Trên các bản phân phối Linux như Fedora CoreOS hoặc Flatcar Container Linux, thư mục `/usr` được gắn (mount) dưới dạng hệ thống tệp chỉ đọc.
Để hỗ trợ [flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
các thành phần Kubernetes như kubelet và kube-controller-manager sử dụng đường dẫn mặc định
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, nhưng thư mục flex-volume _phải có thể ghi_
thì tính năng này mới hoạt động.

{{< note >}}
FlexVolume đã bị loại bỏ (deprecated) trong bản phát hành Kubernetes v1.23.
{{< /note >}}

Để giải quyết vấn đề này, bạn có thể cấu hình thư mục flex-volume bằng [tệp cấu hình](/docs/reference/config-api/kubeadm-config.v1beta4/) của kubeadm.

Trên control-plane Node chính (được tạo bằng `kubeadm init`), truyền tệp sau bằng `--config`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Trên các Node tham gia (join):

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Ngoài ra, bạn có thể sửa `/etc/fstab` để làm cho mount `/usr` có thể ghi, nhưng xin
lưu ý rằng điều này là sửa đổi một nguyên tắc thiết kế của bản phân phối Linux.

## `kubeadm upgrade plan` in ra thông báo lỗi `context deadline exceeded`

Thông báo lỗi này được hiển thị khi nâng cấp một cụm Kubernetes bằng `kubeadm` trong
trường hợp đang chạy etcd bên ngoài (external etcd). Đây không phải là một lỗi nghiêm trọng và xảy ra vì
các phiên bản kubeadm cũ hơn thực hiện kiểm tra phiên bản trên cụm etcd bên ngoài.
Bạn có thể tiếp tục với `kubeadm upgrade apply ...`.

Vấn đề này đã được sửa từ phiên bản 1.19.

## `kubeadm reset` gỡ mount `/var/lib/kubelet`

Nếu `/var/lib/kubelet` đang được mount, việc thực hiện `kubeadm reset` sẽ gỡ mount nó.

Để giải quyết vấn đề, hãy mount lại thư mục `/var/lib/kubelet` sau khi thực hiện thao tác `kubeadm reset`.

Đây là một hồi quy (regression) được giới thiệu trong kubeadm 1.15. Vấn đề đã được sửa trong 1.20.

## Không thể sử dụng metrics-server một cách an toàn trong cụm kubeadm

Trong một cụm kubeadm, [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
có thể được sử dụng không an toàn bằng cách truyền `--kubelet-insecure-tls` cho nó. Điều này không được khuyến nghị cho các cụm production.

Nếu bạn muốn sử dụng TLS giữa metrics-server và kubelet thì có một vấn đề,
vì kubeadm triển khai một chứng chỉ phục vụ (serving certificate) tự ký cho kubelet. Điều này có thể gây ra các lỗi sau
ở phía metrics-server:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

Xem [Kích hoạt chứng chỉ phục vụ kubelet đã ký](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
để hiểu cách cấu hình các kubelet trong cụm kubeadm nhằm có các chứng chỉ phục vụ được ký đúng cách.

Cũng xem [Cách chạy metrics-server một cách an toàn](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## Nâng cấp thất bại do hash của etcd không thay đổi

Chỉ áp dụng cho việc nâng cấp một control plane node bằng binary kubeadm v1.28.3 trở lên,
trong đó node hiện đang được quản lý bởi các phiên bản kubeadm v1.28.0, v1.28.1 hoặc v1.28.2.

Dưới đây là thông báo lỗi bạn có thể gặp:

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

Nguyên nhân của sự thất bại này là các phiên bản bị ảnh hưởng tạo ra một tệp manifest etcd với
các giá trị mặc định không mong muốn trong PodSpec. Điều này dẫn đến sự khác biệt khi so sánh manifest,
và kubeadm sẽ mong đợi một sự thay đổi trong hash của Pod, nhưng kubelet sẽ không bao giờ cập nhật hash.

Có hai cách để giải quyết vấn đề này nếu bạn gặp phải trong cụm của mình:

- Có thể bỏ qua việc nâng cấp etcd giữa các phiên bản bị ảnh hưởng và v1.28.3 (hoặc mới hơn) bằng cách sử dụng:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Điều này không được khuyến nghị trong trường hợp một phiên bản etcd mới được giới thiệu bởi một bản vá v1.28 sau đó.

- Trước khi nâng cấp, hãy vá (patch) manifest cho etcd static pod để loại bỏ các thuộc tính mặc định có vấn đề:

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

Thông tin thêm có thể được tìm thấy trong
[issue theo dõi](https://github.com/kubernetes/kubeadm/issues/2927) cho lỗi này.
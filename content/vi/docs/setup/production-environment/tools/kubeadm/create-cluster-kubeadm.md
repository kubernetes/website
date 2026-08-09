---
reviewers:
- sig-cluster-lifecycle
title: Tạo một cluster với kubeadm
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Với `kubeadm`, bạn có thể tạo một cluster Kubernetes tối thiểu khả thi tuân thủ các phương pháp hay nhất.
Thực tế, bạn có thể dùng `kubeadm` để thiết lập một cluster vượt qua
[các bài kiểm tra tuân thủ Kubernetes](/blog/2017/10/software-conformance-certification/).
`kubeadm` cũng hỗ trợ các chức năng khác trong vòng đời cluster, chẳng hạn như
[bootstrap token](/docs/reference/access-authn-authz/bootstrap-tokens/) và nâng cấp cluster.

Công cụ `kubeadm` phù hợp nếu bạn cần:

- Một cách đơn giản để bạn dùng thử Kubernetes, có thể là lần đầu tiên.
- Một cách để những người dùng hiện tại tự động hóa việc thiết lập cluster và kiểm thử ứng dụng của họ.
- Một khối xây dựng (building block) trong các công cụ hệ sinh thái và/hoặc trình cài đặt khác có phạm vi
  lớn hơn.

Bạn có thể cài đặt và sử dụng `kubeadm` trên nhiều loại máy khác nhau: máy tính xách tay, một tập
máy chủ đám mây, Raspberry Pi, v.v. Dù triển khai lên đám mây hay tại chỗ (on-premises),
bạn có thể tích hợp `kubeadm` vào các hệ thống provisioning như Ansible hoặc Terraform.

## {{% heading "prerequisites" %}}

Để làm theo hướng dẫn này, bạn cần:

- Một hoặc nhiều máy chạy hệ điều hành Linux tương thích deb/rpm; ví dụ: Ubuntu hoặc CentOS.
- Tối thiểu 2 GiB RAM cho mỗi máy – ít hơn mức này sẽ không còn nhiều chỗ cho ứng dụng của bạn.
- Ít nhất 2 CPU trên máy bạn dùng làm node control-plane.
- Kết nối mạng đầy đủ giữa tất cả các máy trong cluster. Bạn có thể dùng mạng công cộng hoặc mạng riêng.

Bạn cũng cần sử dụng phiên bản `kubeadm` có thể triển khai phiên bản Kubernetes mà bạn muốn dùng
trong cluster mới của mình.

[Chính sách hỗ trợ phiên bản và độ lệch phiên bản của Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions)
áp dụng cho cả `kubeadm` lẫn toàn bộ Kubernetes.
Hãy kiểm tra chính sách đó để biết những phiên bản Kubernetes và `kubeadm` nào được hỗ trợ.
Trang này được viết cho Kubernetes {{< param "version" >}}.

Trạng thái tính năng tổng thể của công cụ `kubeadm` là General Availability (GA). Một số tính năng con vẫn
đang được phát triển tích cực. Cách triển khai việc tạo cluster có thể thay đổi đôi chút khi công cụ phát triển,
nhưng nhìn chung cách triển khai sẽ khá ổn định.

{{< note >}}
Mọi lệnh trong `kubeadm alpha`, theo định nghĩa, được hỗ trợ ở mức alpha.
{{< /note >}}

<!-- steps -->

## Mục tiêu

* Cài đặt một cluster Kubernetes với một node control-plane duy nhất
* Cài đặt một mạng Pod trong cluster để các Pod của bạn có thể giao tiếp với nhau

## Hướng dẫn

### Chuẩn bị các host

#### Cài đặt thành phần

Cài đặt một {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}
và kubeadm trên tất cả các host. Để biết hướng dẫn chi tiết và các điều kiện tiên quyết khác, hãy xem
[Cài đặt kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Nếu bạn đã cài đặt kubeadm, hãy xem hai bước đầu tiên của tài liệu
[Nâng cấp node Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)
để biết cách nâng cấp kubeadm.

Khi nâng cấp, kubelet khởi động lại vài giây một lần vì nó chờ trong vòng lặp crashloop để
kubeadm bảo nó phải làm gì. Vòng lặp crashloop này là điều được dự kiến và hoàn toàn bình thường.
Sau khi bạn khởi tạo control-plane, kubelet sẽ chạy bình thường.
{{< /note >}}

#### Thiết lập mạng

Tương tự như các thành phần Kubernetes khác, kubeadm cố gắng tìm một IP khả dụng trên
các giao diện mạng liên kết với cổng mặc định (default gateway) của một host. IP đó sau đó
được dùng cho việc quảng bá và/hoặc lắng nghe của một thành phần.

Để biết IP này trên một host Linux là gì, bạn có thể dùng:

```shell
ip route show # Look for a line starting with "default via"
```

{{< note >}}
Nếu host có hai hoặc nhiều cổng mặc định, một thành phần Kubernetes sẽ cố dùng
cổng đầu tiên nó gặp có địa chỉ unicast toàn cầu phù hợp.
Khi đưa ra lựa chọn này, thứ tự chính xác của các cổng có thể khác nhau giữa các hệ điều hành
và phiên bản kernel khác nhau.
{{< /note >}}

Các thành phần Kubernetes không chấp nhận một giao diện mạng tùy chỉnh như một tùy chọn,
do đó địa chỉ IP tùy chỉnh phải được truyền như một cờ cho tất cả các instance thành phần
cần cấu hình tùy chỉnh đó.

{{< note >}}
Nếu host không có cổng mặc định và không có địa chỉ IP tùy chỉnh nào được truyền
cho một thành phần Kubernetes, thành phần đó có thể thoát ra và báo lỗi.
{{< /note >}}

Để cấu hình địa chỉ quảng bá của API server cho các node control-plane được tạo bằng cả
`init` và `join`, có thể dùng cờ `--apiserver-advertise-address`.
Lý tưởng nhất là tùy chọn này nên được đặt trong [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)
dưới dạng `InitConfiguration.localAPIEndpoint` và `JoinConfiguration.controlPlane.localAPIEndpoint`.

Đối với kubelet trên tất cả các node, tùy chọn `--node-ip` có thể được truyền trong
`.nodeRegistration.kubeletExtraArgs` bên trong tệp cấu hình kubeadm
(`InitConfiguration` hoặc `JoinConfiguration`).

Đối với dual-stack, hãy xem
[Hỗ trợ dual-stack với kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

Các địa chỉ IP bạn gán cho các thành phần control plane sẽ trở thành một phần trong trường subject alternative name
của chứng chỉ X.509 của chúng. Việc thay đổi các địa chỉ IP này sẽ yêu cầu ký chứng chỉ mới và khởi động lại
các thành phần bị ảnh hưởng để sự thay đổi trong các tệp chứng chỉ được phản ánh. Xem
[Gia hạn chứng chỉ thủ công](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
để biết thêm chi tiết về chủ đề này.

{{< warning >}}
Dự án Kubernetes khuyến nghị không nên dùng cách tiếp cận này (cấu hình tất cả các instance thành phần
với địa chỉ IP tùy chỉnh). Thay vào đó, những người duy trì Kubernetes khuyến nghị thiết lập mạng host
sao cho IP của cổng mặc định là IP mà các thành phần Kubernetes tự động phát hiện và sử dụng.
Trên các node Linux, bạn có thể dùng các lệnh như `ip route` để cấu hình mạng; hệ điều hành của bạn
cũng có thể cung cấp các công cụ quản lý mạng cấp cao hơn. Nếu cổng mặc định của node là một địa chỉ IP công cộng,
bạn nên cấu hình lọc gói tin hoặc các biện pháp bảo mật khác để bảo vệ các node và cluster của bạn.
{{< /warning >}}

### Chuẩn bị các container image cần thiết

Bước này là tùy chọn và chỉ áp dụng khi bạn muốn `kubeadm init` và `kubeadm join`
không tải xuống các container image mặc định được lưu trữ tại `registry.k8s.io`.

Kubeadm có các lệnh giúp bạn tải trước (pre-pull) các image cần thiết
khi tạo cluster mà không có kết nối internet trên các node của nó.
Xem [Chạy kubeadm không cần kết nối internet](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
để biết thêm chi tiết.

Kubeadm cho phép bạn sử dụng một kho lưu trữ image tùy chỉnh cho các image cần thiết.
Xem [Sử dụng image tùy chỉnh](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
để biết thêm chi tiết.

### Khởi tạo node control-plane của bạn

Node control-plane là máy nơi các thành phần control plane chạy, bao gồm
{{< glossary_tooltip term_id="etcd" >}} (cơ sở dữ liệu của cluster) và
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(công cụ dòng lệnh {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} giao tiếp với nó).

1. (Khuyến nghị) Nếu bạn có kế hoạch nâng cấp cluster `kubeadm` một node control-plane này
   lên [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/),
   bạn nên chỉ định `--control-plane-endpoint` để đặt endpoint dùng chung cho tất cả các node control-plane.
   Endpoint như vậy có thể là tên DNS hoặc địa chỉ IP của một load-balancer.
1. Chọn một Pod network add-on và kiểm tra xem nó có yêu cầu đối số nào phải truyền cho `kubeadm init` hay không.
   Tùy thuộc vào nhà cung cấp bên thứ ba bạn chọn, bạn có thể cần đặt `--pod-network-cidr` thành
   giá trị cụ thể của nhà cung cấp. Xem [Cài đặt Pod network add-on](#pod-network).
1. (Tùy chọn) `kubeadm` cố gắng phát hiện container runtime bằng cách sử dụng danh sách các endpoint đã biết.
   Để sử dụng một container runtime khác hoặc nếu có nhiều hơn một runtime được cài đặt
   trên node được cấp phát, hãy chỉ định đối số `--cri-socket` cho `kubeadm`. Xem
   [Cài đặt runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Để khởi tạo node control-plane, hãy chạy:

```bash
kubeadm init <args>
```

### Lưu ý về apiserver-advertise-address và ControlPlaneEndpoint

Trong khi `--apiserver-advertise-address` có thể được dùng để đặt địa chỉ quảng bá cho API server
của một node control-plane cụ thể, `--control-plane-endpoint` có thể được dùng để đặt endpoint dùng chung
cho tất cả các node control-plane.

`--control-plane-endpoint` chấp nhận cả địa chỉ IP lẫn tên DNS có thể ánh xạ tới địa chỉ IP.
Vui lòng liên hệ với quản trị viên mạng của bạn để đánh giá các giải pháp khả thi liên quan đến việc ánh xạ này.

Dưới đây là một ví dụ về ánh xạ:

```
192.168.0.102 cluster-endpoint
```

Trong đó `192.168.0.102` là địa chỉ IP của node này và `cluster-endpoint` là tên DNS tùy chỉnh ánh xạ tới IP này.
Điều này cho phép bạn truyền `--control-plane-endpoint=cluster-endpoint` cho `kubeadm init` và truyền cùng tên DNS đó cho
`kubeadm join`. Sau này, bạn có thể sửa `cluster-endpoint` để trỏ tới địa chỉ của load-balancer trong
kịch bản high availability.

Kubeadm không hỗ trợ chuyển một cluster một control plane được tạo mà không có `--control-plane-endpoint`
thành cluster có tính sẵn sàng cao.

### Thông tin thêm

Để biết thêm thông tin về các đối số của `kubeadm init`, hãy xem [hướng dẫn tham chiếu kubeadm](/docs/reference/setup-tools/kubeadm/).

Để cấu hình `kubeadm init` với tệp cấu hình, hãy xem
[Sử dụng kubeadm init với tệp cấu hình](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Để tùy chỉnh các thành phần control plane, bao gồm việc gán IPv6 tùy chọn cho liveness probe
của các thành phần control plane và etcd server, hãy cung cấp các đối số bổ sung cho từng thành phần như được mô tả trong
[đối số tùy chỉnh](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Để cấu hình lại một cluster đã được tạo, hãy xem
[Cấu hình lại cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Để chạy lại `kubeadm init`, trước tiên bạn phải [gỡ bỏ cluster](#tear-down).

Nếu bạn thêm một node có kiến trúc khác vào cluster, hãy đảm bảo rằng các DaemonSet bạn triển khai
có hỗ trợ container image cho kiến trúc này.

`kubeadm init` trước tiên chạy một loạt các bước kiểm tra sơ bộ (prechecks) để đảm bảo máy
đã sẵn sàng chạy Kubernetes. Các bước kiểm tra này đưa ra cảnh báo và thoát khi gặp lỗi. Sau đó, `kubeadm init`
tải xuống và cài đặt các thành phần control plane của cluster. Quá trình này có thể mất vài phút.
Sau khi hoàn tất, bạn sẽ thấy:

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Để kubectl hoạt động cho người dùng không phải root của bạn, hãy chạy các lệnh sau, cũng là
một phần trong đầu ra của `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Ngoài ra, nếu bạn là người dùng `root`, bạn có thể chạy:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Tệp kubeconfig `admin.conf` mà `kubeadm init` tạo ra chứa chứng chỉ với
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Nhóm `kubeadm:cluster-admins`
được gắn với ClusterRole `cluster-admin` tích hợp sẵn.
Không chia sẻ tệp `admin.conf` cho bất kỳ ai.

`kubeadm init` tạo ra một tệp kubeconfig khác là `super-admin.conf` chứa chứng chỉ với
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` là một nhóm siêu người dùng break-glass bỏ qua lớp ủy quyền (ví dụ RBAC).
Không chia sẻ tệp `super-admin.conf` cho bất kỳ ai. Bạn nên di chuyển tệp này đến một vị trí an toàn.

Xem
[Tạo tệp kubeconfig cho người dùng bổ sung](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
để biết cách dùng `kubeadm kubeconfig user` tạo tệp kubeconfig cho người dùng bổ sung.
{{< /warning >}}

Hãy ghi lại lệnh `kubeadm join` mà `kubeadm init` xuất ra. Bạn cần
lệnh này để [tham gia các node vào cluster của bạn](#join-nodes).

Token được sử dụng để xác thực lẫn nhau giữa node control-plane và các node tham gia.
Token được đưa vào ở đây là bí mật. Hãy giữ nó an toàn, vì bất kỳ ai có
token này đều có thể thêm các node đã xác thực vào cluster của bạn. Các token này có thể được liệt kê,
tạo và xóa bằng lệnh `kubeadm token`. Xem
[hướng dẫn tham chiếu kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Cài đặt Pod network add-on {#pod-network}

{{< caution >}}
Phần này chứa thông tin quan trọng về thiết lập mạng và thứ tự triển khai.
Hãy đọc kỹ toàn bộ lời khuyên này trước khi tiếp tục.

**Bạn phải triển khai một Pod network add-on dựa trên
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) để các Pod của bạn có thể giao tiếp với nhau.
Cluster DNS (CoreDNS) sẽ không khởi động trước khi mạng được cài đặt.**

- Hãy lưu ý rằng mạng Pod của bạn không được trùng lặp với bất kỳ mạng host nào:
  bạn sẽ rất có thể gặp sự cố nếu có bất kỳ sự trùng lặp nào.
  (Nếu bạn phát hiện xung đột giữa mạng Pod ưa thích của plugin mạng và một số mạng host,
  bạn nên chọn một khối CIDR phù hợp để dùng thay thế, sau đó dùng khối đó trong `kubeadm init` với
  `--pod-network-cidr` và thay thế nó trong YAML của plugin mạng).

- Theo mặc định, `kubeadm` thiết lập cluster của bạn để sử dụng và thực thi
  [RBAC](/docs/reference/access-authn-authz/rbac/) (kiểm soát truy cập dựa trên vai trò).
  Hãy đảm bảo rằng plugin mạng Pod của bạn hỗ trợ RBAC, và mọi manifest bạn dùng để triển khai nó cũng vậy.

- Nếu bạn muốn sử dụng IPv6 – dù là dual-stack hay chỉ single-stack IPv6 –
  cho cluster của mình, hãy đảm bảo rằng plugin mạng Pod của bạn hỗ trợ IPv6.
  Hỗ trợ IPv6 đã được thêm vào CNI trong [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm nên là công cụ không phụ thuộc CNI (CNI agnostic) và việc xác thực các nhà cung cấp CNI nằm
ngoài phạm vi kiểm thử e2e hiện tại của chúng tôi.
Nếu bạn tìm thấy sự cố liên quan đến plugin CNI, bạn nên ghi một ticket trong trình theo dõi sự cố tương ứng
của plugin đó thay vì trình theo dõi sự cố kubeadm hoặc kubernetes.
{{< /note >}}

Một số dự án bên ngoài cung cấp mạng Pod Kubernetes bằng CNI, một số trong đó cũng
hỗ trợ [Network Policy](/docs/concepts/services-networking/network-policies/).

Xem danh sách các add-on triển khai
[mô hình mạng Kubernetes](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

Vui lòng tham khảo trang [Cài đặt các Addon](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
để có danh sách không đầy đủ các add-on mạng được Kubernetes hỗ trợ.
Bạn có thể cài đặt một Pod network add-on bằng lệnh sau trên node control-plane hoặc một node
có thông tin xác thực kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Chỉ một số plugin CNI hỗ trợ Windows. Thông tin chi tiết và hướng dẫn thiết lập có thể được tìm thấy
trong [Thêm node worker Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

Bạn chỉ có thể cài đặt một mạng Pod cho mỗi cluster.

Sau khi mạng Pod đã được cài đặt, bạn có thể xác nhận nó đang hoạt động bằng cách kiểm tra
Pod CoreDNS ở trạng thái `Running` trong đầu ra của `kubectl get pods --all-namespaces`.
Và khi Pod CoreDNS đã hoạt động, bạn có thể tiếp tục bằng cách tham gia các node của mình.

Nếu mạng của bạn không hoạt động hoặc CoreDNS không ở trạng thái `Running`, hãy xem
[hướng dẫn xử lý sự cố](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
cho `kubeadm`.

### Nhãn node được quản lý

Theo mặc định, kubeadm bật admission controller [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
để hạn chế những nhãn nào có thể được kubelet tự áp dụng khi đăng ký node.
Tài liệu admission controller mô tả những nhãn nào được phép sử dụng với tùy chọn `--node-labels` của kubelet.

{{< caution >}}
Do admission controller `NodeRestriction`, bạn **không thể** dùng cờ `--node-labels` của kubelet
để áp dụng các nhãn bị hạn chế (chẳng hạn như `node-role.kubernetes.io/*`) trong quá trình khởi tạo.

Nếu bạn cố gắng thêm các nhãn bị hạn chế bằng cờ kubelet này, node sẽ không thể đăng ký
với API server.
{{< /caution >}}

Để áp dụng các nhãn này theo cách thủ công, bạn phải dùng `kubectl label` sau khi node đã tham gia cluster.
Hãy đảm bảo bạn sử dụng một kubeconfig có đặc quyền, chẳng hạn như `/etc/kubernetes/admin.conf` do kubeadm quản lý.

### Cô lập node control-plane

Theo mặc định, cluster của bạn sẽ không lên lịch Pod trên các node control-plane vì lý do bảo mật.
Nếu bạn muốn có thể lên lịch Pod trên các node control-plane,
ví dụ cho một cluster Kubernetes trên một máy duy nhất, hãy chạy:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Đầu ra sẽ trông giống như sau:

```
node "test-01" untainted
...
```

Lệnh này sẽ xóa taint `node-role.kubernetes.io/control-plane:NoSchedule` khỏi mọi node có taint này,
bao gồm cả các node control-plane, nghĩa là scheduler sau đó có thể lên lịch Pod ở mọi nơi.

Ngoài ra, bạn có thể thực hiện lệnh sau để xóa nhãn
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)
khỏi node control-plane, nhãn này loại node đó khỏi danh sách máy chủ backend:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Thêm nhiều node control-plane hơn

Xem [Tạo cluster có tính sẵn sàng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
để biết các bước tạo cluster kubeadm high availability bằng cách thêm nhiều node control-plane hơn.

### Thêm node worker {#join-nodes}

Các node worker là nơi workloads của bạn chạy.

Các trang sau đây hướng dẫn cách thêm node worker Linux và Windows vào cluster bằng lệnh
`kubeadm join`:

* [Thêm node worker Linux](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Thêm node worker Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Tùy chọn) Điều khiển cluster của bạn từ các máy khác ngoài node control-plane

Để một kubectl trên một máy tính khác (ví dụ: máy tính xách tay) có thể giao tiếp với cluster của bạn, bạn cần sao chép tệp kubeconfig quản trị từ node control-plane
đến máy trạm của mình như sau:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
Ví dụ trên giả định quyền truy cập SSH được bật cho root. Nếu không phải vậy,
bạn có thể sao chép tệp `admin.conf` để một người dùng khác có thể truy cập
và dùng `scp` bằng chính người dùng đó.

Tệp `admin.conf` cấp cho người dùng đặc quyền _superuser_ trên cluster.
Tệp này nên được sử dụng một cách hạn chế. Đối với người dùng thông thường, bạn nên
tạo một thông tin xác thực duy nhất để cấp quyền. Bạn có thể thực hiện
việc này bằng lệnh `kubeadm kubeconfig user --client-name <CN>`.
Lệnh đó sẽ in một tệp KubeConfig ra STDOUT, bạn nên lưu vào một tệp và phân phối cho người dùng của mình.
Sau đó, cấp quyền bằng cách sử dụng `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Tùy chọn) Dùng proxy API Server tới localhost

Nếu bạn muốn kết nối tới API Server từ bên ngoài cluster, bạn có thể dùng
`kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Bây giờ bạn có thể truy cập API Server cục bộ tại `http://localhost:8001/api/v1`

## Dọn dẹp {#tear-down}

Nếu bạn đã sử dụng các máy chủ dùng một lần cho cluster để kiểm thử, bạn có thể
tắt chúng và không cần dọn dẹp thêm. Bạn có thể dùng
`kubectl config delete-cluster` để xóa các tham chiếu cục bộ tới cluster.

Tuy nhiên, nếu bạn muốn hủy cấp phát cluster một cách sạch sẽ hơn, bạn nên
trước tiên [drain node](/docs/reference/generated/kubectl/kubectl-commands#drain)
và đảm bảo node trống, sau đó hủy cấu hình node.

### Xóa node

Khi giao tiếp với node control-plane bằng thông tin xác thực thích hợp, hãy chạy:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Trước khi xóa node, hãy đặt lại trạng thái được cài đặt bởi `kubeadm`:

```bash
kubeadm reset
```

Quá trình reset không đặt lại hoặc dọn dẹp các quy tắc iptables hoặc bảng IPVS.
Nếu bạn muốn đặt lại iptables, bạn phải thực hiện thủ công:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Nếu bạn muốn đặt lại các bảng IPVS, bạn phải chạy lệnh sau:

```bash
ipvsadm -C
```

Bây giờ hãy xóa node:

```bash
kubectl delete node <node name>
```

Nếu bạn muốn bắt đầu lại, hãy chạy `kubeadm init` hoặc `kubeadm join` với
các đối số thích hợp.

### Dọn dẹp control plane

Bạn có thể dùng `kubeadm reset` trên host control-plane để kích hoạt việc dọn dẹp best-effort.

Xem tài liệu tham khảo [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
để biết thêm thông tin về lệnh con này và các tùy chọn của nó.

## Chính sách độ lệch phiên bản {#version-skew-policy}

Mặc dù kubeadm cho phép độ lệch phiên bản đối với một số thành phần mà nó quản lý, bạn nên
khớp phiên bản kubeadm với phiên bản của các thành phần control plane, kube-proxy và kubelet.

### Độ lệch phiên bản của kubeadm so với phiên bản Kubernetes

kubeadm có thể được sử dụng với các thành phần Kubernetes có cùng phiên bản với kubeadm
hoặc cũ hơn một phiên bản. Phiên bản Kubernetes có thể được chỉ định cho kubeadm bằng cách sử dụng
cờ `--kubernetes-version` của `kubeadm init` hoặc trường
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
khi dùng `--config`. Tùy chọn này sẽ kiểm soát các phiên bản
của kube-apiserver, kube-controller-manager, kube-scheduler và kube-proxy.

Ví dụ:

* kubeadm đang ở phiên bản {{< skew currentVersion >}}
* `kubernetesVersion` phải ở phiên bản {{< skew currentVersion >}} hoặc {{< skew currentVersionAddMinor -1 >}}

### Độ lệch phiên bản của kubeadm so với kubelet

Tương tự như phiên bản Kubernetes, kubeadm có thể được sử dụng với phiên bản kubelet
cùng phiên bản với kubeadm hoặc cũ hơn ba phiên bản.

Ví dụ:

* kubeadm đang ở phiên bản {{< skew currentVersion >}}
* kubelet trên host phải ở phiên bản {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} hoặc {{< skew currentVersionAddMinor -3 >}}

### Độ lệch phiên bản của kubeadm với chính kubeadm

Có một số giới hạn nhất định về cách các lệnh kubeadm có thể hoạt động trên các node hiện có hoặc toàn bộ cluster
do kubeadm quản lý.

Khi các node mới tham gia vào cluster, tệp nhị phân kubeadm dùng cho `kubeadm join` phải khớp
với phiên bản kubeadm gần nhất được dùng để tạo cluster bằng `kubeadm init` hoặc nâng cấp
chính node đó bằng `kubeadm upgrade`. Các quy tắc tương tự áp dụng cho các lệnh kubeadm còn lại,
ngoại trừ `kubeadm upgrade`.

Ví dụ cho `kubeadm join`:

* Phiên bản kubeadm {{< skew currentVersion >}} được dùng để tạo cluster bằng `kubeadm init`
* Các node tham gia phải sử dụng tệp nhị phân kubeadm ở phiên bản {{< skew currentVersion >}}

Các node đang được nâng cấp phải sử dụng phiên bản kubeadm có cùng phiên bản MINOR
hoặc mới hơn một phiên bản MINOR so với phiên bản kubeadm được dùng để quản lý node.

Ví dụ cho `kubeadm upgrade`:

* Phiên bản kubeadm {{< skew currentVersionAddMinor -1 >}} được dùng để tạo hoặc nâng cấp node
* Phiên bản kubeadm dùng để nâng cấp node phải ở phiên bản {{< skew currentVersionAddMinor -1 >}}
  hoặc {{< skew currentVersion >}}

Để tìm hiểu thêm về độ lệch phiên bản giữa các thành phần Kubernetes khác nhau, hãy xem
[Chính sách Độ lệch Phiên bản](/releases/version-skew-policy/).

## Các giới hạn {#limitations}

### Khả năng chống chịu của cluster {#resilience}

Cluster được tạo ở đây có một node control-plane duy nhất, với một cơ sở dữ liệu etcd duy nhất
chạy trên đó. Điều này có nghĩa là nếu node control-plane gặp sự cố, cluster của bạn có thể mất
dữ liệu và có thể cần được tạo lại từ đầu.

Các biện pháp khắc phục:

* Thường xuyên [sao lưu etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). Thư mục
  dữ liệu etcd do kubeadm cấu hình nằm tại `/var/lib/etcd` trên node control-plane.

* Sử dụng nhiều node control-plane. Bạn có thể đọc
  [Các tùy chọn cho cấu trúc liên kết Highly Available](/docs/setup/production-environment/tools/kubeadm/ha-topology/) để chọn một cấu trúc liên kết
  cluster cung cấp [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Tính tương thích nền tảng {#multi-platform}

Các gói và tệp nhị phân deb/rpm của kubeadm được xây dựng cho amd64, arm (32-bit), arm64, ppc64le và s390x
theo [đề xuất đa nền tảng](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Các container image đa nền tảng cho control plane và addon cũng được hỗ trợ kể từ v1.12.

Chỉ một số nhà cung cấp mạng cung cấp giải pháp cho tất cả các nền tảng. Vui lòng tham khảo danh sách
các nhà cung cấp mạng ở trên hoặc tài liệu của từng nhà cung cấp để xác định xem nhà cung cấp đó
có hỗ trợ nền tảng bạn chọn hay không.

## Xử lý sự cố {#troubleshooting}

Nếu bạn đang gặp khó khăn với kubeadm, vui lòng tham khảo
[tài liệu xử lý sự cố](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) của chúng tôi.

<!-- discussion -->

## {{% heading "whatsnext" %}}

* Xác minh rằng cluster của bạn đang chạy đúng cách bằng [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />Xem [Nâng cấp cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  để biết chi tiết về việc nâng cấp cluster của bạn bằng `kubeadm`.
* Tìm hiểu về cách sử dụng `kubeadm` nâng cao trong [tài liệu tham khảo kubeadm](/docs/reference/setup-tools/kubeadm/)
* Tìm hiểu thêm về [khái niệm](/docs/concepts/) Kubernetes và [`kubectl`](/docs/reference/kubectl/).
* Xem trang [Mạng cluster](/docs/concepts/cluster-administration/networking/) để có danh sách lớn hơn
  về Pod network add-on.
* <a id="other-addons" />Xem [danh sách add-on](/docs/concepts/cluster-administration/addons/) để
  khám phá các add-on khác, bao gồm các công cụ ghi log, giám sát, network policy, trực quan hóa &amp;
  kiểm soát cluster Kubernetes của bạn.
* Cấu hình cách cluster của bạn xử lý log cho các sự kiện cluster và từ các ứng dụng chạy trong Pod.
  Xem [Kiến trúc ghi log](/docs/concepts/cluster-administration/logging/) để có
  tổng quan về những gì liên quan.

### Phản hồi {#feedback}

* Nếu gặp lỗi, hãy truy cập [trình theo dõi sự cố kubeadm trên GitHub](https://github.com/kubernetes/kubeadm/issues)
* Để được hỗ trợ, hãy truy cập kênh Slack
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* Kênh Slack phát triển chung của SIG Cluster Lifecycle:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* [Thông tin SIG](https://github.com/kubernetes/community/tree/main/sig-cluster-lifecycle#readme) của SIG Cluster Lifecycle
* Danh sách gửi thư của SIG Cluster Lifecycle:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
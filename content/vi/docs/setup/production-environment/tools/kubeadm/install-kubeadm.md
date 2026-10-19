---
title: Cài đặt kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Cài đặt công cụ thiết lập kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Trang này hướng dẫn cách cài đặt hộp công cụ `kubeadm`.
Để biết thông tin về cách tạo một cụm với Kubeadm sau khi bạn đã thực hiện quy trình cài đặt này,
xem trang [Tạo một cụm với kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* Một máy chủ Linux tương thích. Dự án Kubernetes cung cấp những hướng dẫn chung cho các bản phân phối Linux
  dựa trên Debian và Red Hat, và những bản phân phối không có trình quản lý gói.
* 2 GB RAM hoặc nhiều hơn cho mỗi máy (nếu ít hơn sẽ không đủ tài nguyên cho các ứng dụng của bạn).
* 2 CPU hoặc nhiều hơn cho các máy control plane.
* Kết nối toàn mạng giữa tất cả các máy trong cụm (mạng public hoặc private đều được).
* Mọi máy phải có hostname, địa chỉ MAC, và product_uuid duy nhất. Xem [tại đây](#verify-mac-address) để biết thêm chi tiết.
* Một số cổng được mở trên máy của bạn. Xem [tại đây](#check-required-ports) để biết thêm chi tiết.

{{< note >}}
Việc cài đặt `kubeadm` có thể được thực hiện thông qua các tệp nhị phân sử dụng liên kết động và giả sử hệ thống của bạn cung cấp `glibc`.
Giả định này hợp lý trên nhiều bản phân phối Linux (bao gồm Debian, Ubuntu, Fedora, CentOS, v.v...)
nhưng không phải luôn đúng đối với các bản phân phối nhẹ và tùy biến bởi mặc định chúng không có sẵn `glibc`, ví dụ Alpine Linux.
Kỳ vọng là bản phân phối hoặc bao gồm `glibc` hoặc có một
[lớp tương thích](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
cung cấp các đặc trưng mong muốn.
{{< /note >}}

<!-- steps -->

## Kiểm tra phiên bản OS

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* Dự án kubeadm hỗ trợ LTS kernel. Xem [Danh sách LTS kernel](https://www.kernel.org/category/releases.html).
* Bạn có thể biết được phiên bản kernel bằng câu lệnh `uname -r`

Để biết thêm thông tin, xem [Các yêu cầu về Linux Kernel](/docs/reference/node/kernel-version-requirements/).

{{% /tab %}}

{{% tab name="Windows" %}}

* Dự án kubeadm hỗ trợ các phiên bản kernel hiện tại. Xem danh sách kernel hiện tại [Thông tin phát hành Windows Server](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* Bạn có thể biết được phiên bản kernel (hay gọi là phiên bản OS) bằng câu lệnh `systeminfo`

Để biết thêm thông tin, xem [Sự tương thích của các phiên bản Windows OS](/docs/concepts/windows/intro/#windows-os-version-support).

{{% /tab %}}
{{< /tabs >}}

Một cụm Kubernetes được tạo bởi kubeadm phụ thuộc vào phần mềm mà chúng sử dụng các chức năng kernel.
Phần mềm này bao gồm, nhưng không giới hạn ở
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}},
{{< glossary_tooltip term_id="kubelet" text="kubelet">}}, và một plugin {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}.

Để giúp bạn tránh những lỗi không mong muốn khi sử dụng một phiên bản kernel không được hỗ trợ, kubeadm chạy kiểm tra pre-flight
`SystemVerification`. Quá trình kiểm tra này sẽ lỗi nếu phiên bản kernel không được hỗ trợ.

Bạn có thể chọn bỏ qua kiểm tra, nếu bạn biết rằng kernel của bạn
cung cấp các chức năng cần thiết, kể cả kubeadm không hỗ trợ phiên bản đó.

## Xác nhận địa chỉ MAC và product_uuid là duy nhất cho từng node {#verify-mac-address}

* Bạn có thể biết được địa chỉ MAC của network interfaces bằng câu lệnh `ip link` hoặc `ifconfig -a`
* product_uuid có thể kiểm tra bằng câu lệnh `sudo cat /sys/class/dmi/id/product_uuid`

Rất có thể các thiết bị phần cứng sẽ có các địa chỉ duy nhất, mặc dù một vài máy ảo có thể có
các giá trị giống hệt nhau. Kubernetes sử dụng những giá trị đó để định danh duy nhất cho các node trong cụm.
Nếu các giá trị đó không là duy nhất cho từng node, quá trình cái đặt
có thể [thất bại](https://github.com/kubernetes/kubeadm/issues/31).

## Kiểm tra network adapter

Nếu bạn có nhiều hơn một network adapter, và các thành phần Kubernetes của bạn không thể truy cập trên route
mặc định, chúng tôi khuyên bạn nên bổ sung (các) IP route để các địa chỉ cụm Kubernetes đi qua adpater thích hợp.

## Kiểm tra các cổng cần thiết {#check-required-ports}

Những [cổng cần thiết](/docs/reference/networking/ports-and-protocols/)
cần phải được mở để các thành phần Kubernetes giao tiếp với nhau.
Bạn có thể sử dụng công cụ như [netcat](https://netcat.sourceforge.net) để kiểm tra cổng có được mở hay không. Ví dụ:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Pod network plugin mà bạn sử dụng cũng có thể yêu cầu mở một số cổng nhất định.
Vì điều này khác nhau đối với từng pod network plugin, vui lòng xem
tài liệu của các plugin về (các) cổng cần thiết.

## Cấu hình swap {#swap-configuration}

Mặc định kubelet sẽ không thể khởi động nếu bộ nhớ swap được phát hiện trên một node.
Điều này có nghĩa rằng swap nên hoặc là tắt đi hoặc là được chấp nhận bởi kubelet.

* Để chấp nhận swap, thêm `failSwapOn: false` vào cấu hình kubelet hoặc thông qua tham số dòng lệnh.
  Lưu ý: thậm chí nếu `failSwapOn: false` được thêm, workload mặc định cũng không có quyền truy cập swap.
  Điều này có thể được thay đổi bằng cách đặt `swapBehavior`, một lần nữa trong file cấu hình kubelet. Để sử dụng swap,
  đặt một `swapBehavior` khác với giá trị mặc định `NoSwap`.
  Xem [Quản lý bộ nhớ swap](/docs/concepts/architecture/nodes/#swap-memory) để biết thêm chi tiết.
* Để tắt swap, `sudo swapoff -a` có thể được sử dụng để tắt tạm thời.
  Để làm cho thay đổi này duy trì mỗi khi tái khởi động, đảm bảo rằng swap được tắt trong
  các file cấu hình như `/etc/fstab`, `systemd.swap`, phụ thuộc vào việc nó được cấu hình như thế nào trên hệ thống của bạn.


## Cài đặt một container runtime {#installing-runtime}

Để chạy các container trong các Pod, Kubernetes sử dụng một
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.

Mặc định, Kubernetes sử dụng
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
để giao tiếp với container runtime mà bạn chọn.

Nếu bạn không chỉ định một runtime, kubeadm tự động phát hiện một container runtime
đã cài đặt bằng cách quét qua một danh sách những endpoint đã biết.

Nếu có nhiều hoặc không có container runtime nào được phát hiện, kubeadm sẽ ném ra một lỗi
và sẽ yêu cầu bạn chỉ định một thứ bạn muốn sử dụng.

Xem [container runtimes](/docs/setup/production-environment/container-runtimes/)
để biết thêm thông tin.

{{< note >}}
Docker Engine không triển khai [CRI](/docs/concepts/architecture/cri/),
một thứ bắt buộc của container runtime để hoạt động với Kubernetes.
Vì lí do đó, một dịch vụ bổ sung [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
phải được cài đặt. cri-dockerd là một dự án dựa trên sự hỗ trợ legacy built-in của
Docker Engine mà đã bị [loại bỏ](/dockershim) khỏi kubelet trong phiên bản 1.24.
{{< /note >}}

Những bản bên dưới bao gồm những endpoint đã biết của những hệ điều hành được hỗ trợ:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux container runtimes" >}}
| Runtime                            | Đường dẫn tới Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows container runtimes" >}}
| Runtime                            | Đường dẫn tới Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Cài đặt kubeadm, kubelet và kubectl

Bạn sẽ cài đặt các package này trên toàn bộ máy chủ của bạn:

* `kubeadm`: lệnh khởi tạo cụm.

* `kubelet`: thành phần chạy trên toàn bộ các máy trong cụm của bạn
  và làm những việc như khởi chạy pod và container.

* `kubectl`: tiện ích dòng lệnh để giao tiếp với cụm.

kubeadm **sẽ không** cài đặt hoặc quản lý `kubelet` và `kubectl` cho bạn, vì vậy bạn sẽ
cần phải đảm bảo rằng phiên bản của chúng giống với Kubernetes control plane bạn muốn
kubeadm cài cho bạn. Nếu bạn không làm vậu, rủi ro về sự chênh lệch phiên bản có thể xảy ra và
dẫn tới những hành vi lỗi, không mong muốn. Tuy nhiên, chênh lệch _một_ phiên bản minor giữa
kubelet và control plane được chấp nhận, nhưng phiên bản kubelet không bao giờ vượt quá phiên bản API
server. Ví dụ, kubelet đang chạy 1.7.0 có thể tương thích hoàn toàn với API server phiên bản 1.8.0,
nhưng không có chiều ngược lại.

Để biết cách cài đặt `kubectl`, xem [Cài đặt và thiết lập kubectl](/docs/tasks/tools/).

{{< warning >}}
Những hướng dẫn này loại trừ tất cả các package của Kubernetes khỏi mọi sự nâng cấp hệ thống.
Bởi vì kubeadm và Kubernetes yêu cầu
[đặc biệt chú ý khi nâng cấp](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Để biết thêm thông tin về chênh lệch phiên bản, xem:

* [Chính sách về phiên bản và chênh lệch phiên bản](/docs/setup/release/version-skew-policy/) của Kubernetes
* [Chính sách sai lệch phiên bản](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy) cụ thể cho kubeadm

{{% legacy-repos-deprecation %}}

{{< note >}}
Có một kho lưu trữ package chuyên dụng cho từng phiên bản minor của Kubernetes. Nếu bạn muốn cài đặt
một phiên bản minor khác v{{< skew currentVersion >}}, vui lòng xem hướng dẫn cài đặt cho
phiên bản minior bạn mong muốn.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Các bản phân phối dựa trên Debian" %}}

Hướng dẫn này dành cho Kubernetes v{{< skew currentVersion >}}.

1. Cập nhật `apt` package index và cài đặt các package cần thiết để sử dụng kho lưu trữ `apt` của Kubernetes:

   ```shell
   sudo apt-get update
   # apt-transport-https có thể là một package giả; nếu vậy, bạn có thể bỏ qua package này
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Tải xuống khóa ký công khai cho các kho lưu trữ package của Kubernetes.
   Toàn bộ các kho lưu trữ sử dụng chung khóa ký do vậy bạn có thể không cần quan tâm tới phiên bản trong URL:

   ```shell
   # Nếu thư mục `/etc/apt/keyrings` không tồn tại, nó nên được tạo trước lệnh curl, đọc chú thích bên dưới.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
Trong những bản phát hành cũ hơn Debian 12 và Ubuntu 22.04, thư mục `/etc/apt/keyrings` mặc định không
tồn tại, và nó nên được tạo trước lệnh curl.
{{< /note >}}

3. Thêm kho lưu trữ `apt` Kubernetes thích hợp. Vui lòng chú ý rằng kho lưu trữ này chỉ chứa những package
   cho Kubernetes {{< skew currentVersion >}}; đối với các phiên bản Kubernetes minor khác, bạn cần phải
   thay đổi phiên bản Kubernetes minor trong URL để trùng với phiên bản minor bạn mong muốn
   (bạn cũng nên kiểm tra lại rằng bạn đang đọc tài liệu cho phiên bản Kubernetes
   mà bạn dự định cài đặt).

   ```shell
   # Điều này sẽ ghi đè bất kỳ những cấu hình nào đang có trong /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Cập nhật `apt` package index, cài đặt kubelet, kubeadm và kubectl, và ghim lại phiên bản của chúng:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Tùy chọn) Bật dịch vụ kubelet trước khi chạy kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Các bản phân phối dựa trên Red Hat" %}}

1. Đặt SELinux thành chế độ `permissive`:

   Những hướng dẫn này dành cho Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Đặt SELinux trong chế độ permissive (vô hiệu hóa nó một cách hiệu quả)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- Đặt SELinux trong chế độ permissive bằng cách chạy `setenforce 0` và `sed ...`
  vô hiệu hóa nó một cách hiệu quả. Điều này là bắt buộc để cho phép các container truy cập vào hệ thống file
  của máy chủ; ví dụ, một vài network plugin của cụm yêu cầu điều này. Bạn phải
  làm điều này cho đến khi sự hỗ trợ SELinux được cải thiện trong kubelet.
- Bạn có thể để SELinux bật nếu bạn biết cách cấu hình nó nhưng điều đó có thể yêu cầu
  các thiết lập không được hỗ trợ bởi kubeadm.
{{< /caution >}}

2. Thêm kho lưu trữ `yum` của Kubernetes. Tham số `exclude` trong
   định nghĩa kho lưu trữ đảm bảo rằng các package liên quan tới Kubernetes
   không được nâng cấp bởi việc chạy `yum update` vì có một quy trình đặc biệt cần
   tuân theo để nâng cấp Kubernetes. Vui lòng chú ý rằng kho lưu trữ này
   chỉ có các package cho Kubernetes {{< skew currentVersion >}}; đối với
   những phiên bản Kubernetes minor khác, bạn cần phải
   thay đổi phiên bản Kubernetes minor trong URL để trùng với phiên bản minor bạn mong muốn
   (bạn cũng nên kiểm tra lại rằng bạn đang đọc tài liệu cho phiên bản Kubernetes
   mà bạn dự định cài đặt).

   ```shell
   # Điều này sẽ ghi đè bất kỳ những cấu hình nào đang có trong /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. Cài đặt kubelet, kubeadm và kubectl:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (Tùy chọn) Bật dịch vụ kubelet trước khi chạy kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Không dùng trình quản lý package" %}}
Cài đặt CNI plugin (yêu cầu đối với hầu hết pod network):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Tạo thư mục để tải xuống file lệnh:

{{< note >}}
Biến `DOWNLOAD_DIR` phải được đặt tới một thư mục có thể ghi.
Nếu bạn đang chạy Flatcar Container Linux, đặt `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Tùy chọn cài đặt crictl (yêu cầu khi tương tác với Container Runtime Interface (CRI), không bắt buộc cho kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Cài đặt `kubeadm`, `kubelet` và thêm systemd service cho `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Vui lòng tham khảo ghi chú trong phần [Trước khi bạn bắt đầu](#before-you-begin) cho các bản phân phối Linux
mà mặc định không có `glibc`.
{{< /note >}}

Cài đặt `kubectl` bằng cách làm theo các hướng dẫn trên [trang Cài đặt các công cụ](/docs/tasks/tools/#kubectl).

Một cách tùy chọn, bật dịch vụ kubelet trước khi chạy kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Bản phân phối Linux Flatcar Container gắn thư mục `/usr` thành một hệ thống file chỉ đọc.
Xem [hướng dẫn Khắc phục sự cố Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
để biết cách thiết lập một thư mục có thể ghi.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Bây giờ kubelet khởi động sau mỗi vài giây, vì nó đợi trong vòng lặp crashloop chờ
kubeadm bảo nó phải làm gì.

## Cấu hình cgroup driver

Cả container runtime và kubelet có một thuộc tính gọi là
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), cái mà quan trọng
cho việc quản lý các cgroup trên các máy Linux.

{{< warning >}}
Làm cho khớp các cgroup driver của container runtime và kubelet là bắt buộc hoặc nếu không thì tiến trình kubelet sẽ lỗi.

Xem [Cấu hình cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) để biết thêm chi tiết.
{{< /warning >}}

## Khắc phục sự cố

Nếu bạn đang gặp các khó khăn với kubeadm, vui lòng tham khảo
[tài liệu khắc phục sự cố](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) của chúng tôi.

## {{% heading "whatsnext" %}}

* [Sử dụng kubeadm để Tạo một cụm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

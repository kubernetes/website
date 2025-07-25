---
reviewers:
- sig-cluster-lifecycle
title: Tạo các cụm có tính Sẵn sàng cao với kubeadm
content_type: task
weight: 60
---

<!-- overview -->

Trang này giải thích hai cách tiếp cận khác nhau để thiết lập một cụm Kubernetes sẵn sàng cao
sử dụng kubeadm:

- Với các control plane node xếp chồng. Cách tiếp cận này yêu cầu ít cơ sở hạ tầng. Các etcd member
  và control plane node nằm cùng vị trí.
- Với một cụm etcd bên ngoài. Cách tiếp cận này yêu cầu nhiều cơ sở hạ tầng hơn. Các
  control plane node và etcd member được tách biệt.

Trước khi tiến hành, bạn nên cân nhắc kỹ lưỡng cách tiếp cận nào đáp ứng tốt nhất nhu cầu của các ứng dụng
và môi trường của bạn. [Các tùy chọn cho kiến trúc có tính Sẵn sàng cao](/docs/setup/production-environment/tools/kubeadm/ha-topology/)
chỉ ra các ưu điểm và nhược điểm của từng cách đó.

Nếu bạn gặp phải các vấn đề khi thiết lập cụm HA, vui lòng phản ánh chúng
trong [trình theo dõi vấn đề](https://github.com/kubernetes/kubeadm/issues/new) kubeadm.

Xem thêm [tài liệu nâng cấp](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).

{{< caution >}}
Trang này không giải quyết việc chạy cụm của bạn trên một nhà cung cấp cloud. Trong một
môi trường cloud, không có cách tiếp cận nào được đề cập ở đây hoạt động với các đối tượng
Service loại LoadBalancer, hoặc với PersistentVolumes động.
{{< /caution >}}

## {{% heading "prerequisites" %}}

Những điều kiện tiên quyết dựa trên kiến trúc bạn chọn cho
control plane của cụm:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="etcd xếp chồng" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->

Bạn cần:

- Ba hoặc nhiều hơn các máy đáp ứng [các yêu cầu tối thiểu của kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) cho
  các control plane node. Có một số lượng lẻ các control plane node có thể giúp
  cho việc chọn leader trong trường hợp máy hoặc zone gặp lỗi.
  - bao gồm một {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, đã được thiết lập và hoạt động.
- Ba hoặc nhiều hơn các máy đáp ứng [các yêu cầu tối thiểu
  của kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) cho các worker node.
  - bao gồm một container runtime, đã được thiết lập và hoạt động.
- Kết nối toàn mạng giữa các máy trong cụm (mạng public hoặc
  private).
- Đặc quyền superuser trên tất cả các máy sử dụng `sudo`.
  - Bạn có thể sử dụng một công cụ khác; hướng dẫn này sử dụng `sudo` trong các ví dụ.
- Quyền truy cập SSH từ một thiết bị tới toàn bộ các node trong hệ thống.
- `kubeadm` và `kubelet` đã được cài đặt trên toàn bộ các máy.

_Xem thêm [Kiến trúc etcd xếp chồng](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology)._

{{% /tab %}}
{{% tab name="etcd bên ngoài" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
Bạn cần:

- Ba hoặc nhiều hơn các máy đáp ứng [các yêu cầu tối thiểu của kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) cho
  các control plane node. Có một số lượng lẻ các control plane node có thể giúp
  cho việc chọn leader trong trường hợp máy hoặc zone gặp lỗi.
  - bao gồm một {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, đã được thiết lập và hoạt động.
- Ba hoặc nhiều hơn các máy đáp ứng [các yêu cầu tối thiểu
  của kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) cho các worker node.
  - bao gồm một container runtime, đã được thiết lập và hoạt động.
- Kết nối toàn mạng giữa các máy trong cụm (mạng public hoặc
  private).
- Đặc quyền superuser trên tất cả các máy sử dụng `sudo`.
  - Bạn có thể sử dụng một công cụ khác; hướng dẫn này sử dụng `sudo` trong các ví dụ.
- Quyền truy cập SSH từ một thiết bị tới toàn bộ các node trong hệ thống.
- `kubeadm` và `kubelet` đã được cài đặt trên toàn bộ các máy.

<!-- end of shared prerequisites -->

Và bạn cũng cần:

- Ba hoặc nhiều các máy bổ sung, chúng sẽ trở thành các etcd member của cụm.
  Yêu cầu một số lượng lẻ các member trong cụm etcd để đạt được
  ngưỡng bầu cử tối ưu.
  - Những máy này cũng cần được cài đặt `kubeadm` và `kubelet`.
  - Những máy này cũng yêu cầu một container runtime đã được thiết lập và hoạt động.

_Xem thêm [Kiến trúc etcd bên ngoài](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology)._
{{% /tab %}}
{{< /tabs >}}

### Container image

Từng host cần có quyền read và fetch các image từ Kubernetes container image registry,
`registry.k8s.io`. Nếu bạn muốn triển khai một cụm HA trong đó các host không có
quyền pull image, điều này khả thi. Bạn cần phải đảm bảo rằng các container image cần thiết
có sẵn trên các host liên quan bằng một vài phương pháp khác.

### Giao diện dòng lệnh {#kubectl}

Để quản lý Kubernetes một khi cụm của bạn được thiết lập, bạn nên
[cài đặt kubectl](/docs/tasks/tools/#kubectl) trên PC của bạn. Cài đặt
công cụ `kubectl` trên từng control plane node cũng hữu ích, vì nó có thể
giúp trong việc xử lý sự cố.

<!-- steps -->

## Những bước đầu tiên cho cả hai phương pháp

### Tạo bộ cân bằng tải cho kube-apiserver

{{< note >}}
Có nhiều kiểu cấu hình cho các bộ cân bằng tải. Ví dụ dưới đây là một lựa chọn.
Những yêu cầu đối với cụm của bạn có thể cần một cấu hình khác.
{{< /note >}}

1. Tạo một bộ cân bằng tải kube-apiserver với tên được phân giải tới DNS.

   - Trong một môi trường cloud bạn nên đặt các control plane node của bạn phía sau một
     bộ cân bằng tải chuyển tiếp TCP. Bộ cân bằng tải này phân bổ lưu lượng tới toàn bộ
     các control plane node khỏe mạnh trong danh sách target của nó. Kiểm tra sức khỏe
     cho một apiserver là một kiểm tra TCP trên port mà kube-apiserver lắng nghe
     (giá trị mặc định `:6443`).

   - Không nên sử dụng một địa chỉ IP một cách trực tiếp trong môi trường cloud.

   - Bộ cân bằng tải phải có khả năng giao tiếp với toàn bộ control plane node
     trên port của apiserver. Nó cũng phải cho phép lưu lượng truy cập đến trên port
     được nó lắng nghe.

   - Đảm bảo rằng địa chỉ của bộ cân bằng tải luôn khớp với
     địa chỉ `ControlPlaneEndpoint` của kubeadm.

   - Đọc hướng dẫn [Các tùy chọn cho Cân bằng tải Phần mềm](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing)
     để biết thêm thông tin chi tiết.

1. Thêm control plane node đầu tiên vào bộ cân bằng tải, và kiểm tra
   kết nối:

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Một lỗi từ chối kết nối có thể xảy ra bởi vì API server vẫn chưa
   chạy. Tuy nhiên, timeout có nghĩa là bộ cân bằng tải không thể giao tiếp
   với control plane node. Nếu một timeout xảy ra, cấu hình lại bộ
   cân bằng tải để có thể giao tiếp với control plane node.

1. Thêm các control plane node còn lại vào target group của bộ cân bằng tải.

## Các control plane và etcd node xếp chồng

### Các bước cho control plane node đầu tiên

1. Khởi tạo control plane:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Bạn có thể sử dụng cờ `--kubernetes-version` để chỉ định phiên bản Kubernetes mong muốn.
     Khuyến nghị rằng các phiên bản của kubeadm, kubelet, kubectl và Kubernetes khớp với nhau.
   - Cờ `--control-plane-endpoint` nên được đặt thành địa chỉ hoặc DNS và port của bộ cân bằng tải.

   - Cờ `--upload-certs` được sử dụng để upload các chứng chỉ mà sẽ được chia sẻ
     tới toàn bộ control-plane instance trong cụm. Nếu thay vào đó, bạn muốn copy các chứng chỉ tới toàn bộ
     control-plane node một cách thủ công hoặc sử dụng các công cụ tự động, vui lòng bỏ qua cờ này và xem
     phần [Phân bổ chứng chỉ thủ công](#manual-certs) bên dưới.

   {{< note >}}
   Trong `kubeadm init`, các cờ `--config` và `--certificate-key` không thể kết hợp, vì nếu bạn muốn
   sử dụng [cấu hình kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
   bạn phải thêm trường `certificateKey` trong các vị trí cấu hình thích hợp
   (dưới `InitConfiguration` và `JoinConfiguration: controlPlane`).
   {{< /note >}}

   {{< note >}}
   Một vài CNI network plugin yêu cầu cấu hình bổ sung, ví dụ chỉ định pod IP CIDR, trong khi những cái khác thì không.
   Xem [tài liệu CNI network](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
   Để thêm một pod CIDR sử dụng cờ `--pod-network-cidr`, hoặc nếu bạn đang sử dụng file cấu hình kubeadm
   đặt trường `podSubnet` bên dưới đối tượng `networking` của `ClusterConfiguration`.
   {{< /note >}}

   Output sẽ trông giống như dưới đây:

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Copy output này ra một file text. Bạn sẽ cần nó sau này để join các node control plane và worker vào
     cụm.
   - Khi cờ `--upload-certs` được sử dụng cùng `kubeadm init`, các chứng chỉ của control plane chính
     được mã hóa và upload trong `kubeadm-certs` Secret.
   - Để upload lại các chứng chỉ và tạo ra một khóa giải mã mới, sử dụng lệnh sau đây trên một
     control plane
     node mà đã join vào cụm:

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - Bạn cũng có thể chỉ định một `--certificate-key` tùy chỉnh trong lúc `init` mà sau này có thể được sử dụng để `join`.
     Để tạo ra một khóa như vậy bạn có thể sử dụng lệnh sau đây:

     ```sh
     kubeadm certs certificate-key
     ```

   Khóa của chứng chỉ là một chuỗi mã hóa hex, đó là một khóa AES có kích thước 32 byte.

   {{< note >}}
  `kubeadm-certs` Secret và khóa giải mã sẽ hết hạn sau hai giờ.
   {{< /note >}}

   {{< caution >}}
   Như đã nêu trong output của câu lệnh, khóa chứng chỉ cung cấp quyền truy cập tới dữ liệu nhạy cảm của cụm, hãy giữ nó bí mật!
   {{< /caution >}}

1. Áp dụng CNI plugin mà bạn chọn:
   [Theo dõi các hướng dẫn](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
   để cài đặt nhà cung cấp CNI. Chắc chắn rằng cấu hình tương ứng với Pod CIDR đã được chỉ định trong
   file cấu hình kubeadm (nếu có).

   {{< note >}}
   Bạn phải chọn một network plugin phù hợp với trường hợp sử dụng của bạn và triển khai nó trước khi bạn chuyển sang bước tiếp theo.
   Nếu bạn không làm điều đó, bạn sẽ không thể khởi chạy cụm của bạn đúng cách.
   {{< /note >}}

1. Nhập câu lệnh sau và xem các pod của các thành phần control plane bắt đầu chạy:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Các bước cho các control plane node còn lại

Đối với từng control plane node bổ sung bạn nên:

1. Thực thi lệnh join bạn nhận được bởi `kubeadm init` output trước đây trên node đầu tiên.
   Nó sẽ trông giống như này:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - Cờ `--control-plane` báo cho `kubeadm join` tạo một control plane mới.
   - Cờ `--certificate-key ...` sẽ download các chứng chỉ cho control plane
     từ `kubeadm-certs` Secret trong cụm và được giải mã bằng khóa được cung cấp.

Bạn có thể join nhiều control-plane node đồng thời.

## Các etcd node bên ngoài

Thiết lập một cụm với các etcd node bên ngoài giống như các thủ tục được sử dụng cho etcd xếp chồng
với ngoại lệ là bạn phải thiết lập etcd trước, và bạn sẽ thêm thông tin etcd
trong file cấu hình kubeadm.

### Khởi tạo cụm etcd

1. Theo dõi những [hướng dẫn](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) này để khởi tạo cụm etcd.

1. Thiết lập SSH như mô tả [tại đây](#manual-certs).

1. Copy các file sau đây từ bất kỳ etcd node nào trong cụm tới control plane node đầu tiên:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Thay giá trị của `CONTROL_PLANE` bằng `user@host` của control-plane node đầu tiên.

### Thiết lập control plane node đầu tiên

1. Tạo một file với tên `kubeadm-config.yaml` cùng với những nội dung sau đây:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # thay đổi cái này (xem bên dưới)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # thay ETCD_0_IP thích hợp
         - https://ETCD_1_IP:2379 # thay ETCD_1_IP thích hợp
         - https://ETCD_2_IP:2379 # thay ETCD_2_IP thích hợp
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   Sự khác nhau giữa etcd xếp chồng và etcd bên ngoài là thiết lập etcd bên ngoài yêu cầu
   một file cấu hình với các etcd endpoint bên dưới đối tượng `external` của `etcd`.
   Trong trường hợp của kiến trúc etcd xếp chồng, nó được quản lý tự động.
   {{< /note >}}

   - Thay các biến sau đây trong mẫu cấu hình bằng các giá trị thích hợp cho cụm của bạn:

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

Những bước sau đây tương tự với thiết lập etcd xếp chồng:

1. Chạy `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` trên node này.

1. Viết output của các lệnh join được trả về vào một file text để sử dụng sau này.

1. Áp dụng CNI plugin mà bạn chọn.

   {{< note >}}
   Bạn phải chọn một network plugin phù hợp với trường hợp sử dụng của bạn và triển khai nó trước khi bạn chuyển sang bước tiếp theo.
   Nếu bạn không làm điều đó, bạn sẽ không thể khởi chạy cụm của bạn đúng cách.
   {{< /note >}}

### Các bước cho các control plane node còn lại

Các bước giống với thiết lập etcd xếp chồng:

- Đảm bảo rằng control plane node đầu tiên được khởi tạo hoàn tất.
- Join từng control plane node với lệnh join bạn lưu trong một file text. Bạn nên
  join các control plane node lần lượt.
- Đừng quên rằng khóa giải mã từ `--certificate-key` mặc định sẽ hết hạn sau hai giờ.

## Những task phổ biến sau khi khởi tạo control plane

### Cài đặt các worker

Các worker node có thể được join vào cụm với lệnh bạn lưu trước đó từ
output của lệnh `kubeadm init`:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Phân bổ chứng chỉ thủ công {#manual-certs}

Nếu bạn chọn không sử dụng `kubeadm init` với cờ `--upload-certs` điều đó có nghĩa là
bạn sẽ phải copy thủ công các chứng chỉ từ control plane node chính tới
các control plane node sắp join.

Có nhiều cách để làm điều đó. Cách dưới đây sử dụng `ssh` và `scp`:

SSH là cần thiết nếu bạn muốn điều khiển toàn bộ các node từ một máy đơn.

1. Cho phép ssh-agent trên thiết bị chính của bạn có quyền truy cập tới toàn bộ các node khác trong
   hệ thống:

   ```shell
   eval $(ssh-agent)
   ```

1. Thêm định danh SSH vào phiên:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. SSH giữa các node để kiểm tra kết nối hoạt động tốt.

   - Khi bạn SSH tới bất kỳ node nào, thêm cờ `-A`. Cờ này cho phép node mà bạn
     đăng nhập qua SSH có quyền truy cập tới SSH agent trên PC của bạn. Cân nhắc các phương pháp
     thay thế nếu bạn không hoàn toàn tin tưởng vào bảo mật của phiên người dùng của bạn trên node.

     ```shell
     ssh -A 10.0.0.7
     ```

   - Khi bạn sử dụng sudo trên bất kỳ node nào, đảm bảo duy trì môi trường để SSH
     chuyển tiếp các hoạt động:

     ```shell
     sudo -E -s
     ```

1. Sau khi cấu hình SSH trên toàn bộ các node bạn nên chạy tập lệnh sau đây trên
   control plane node đầu tiên sau khi chạy `kubeadm init`. Tập lệnh này sẽ copy các chứng chỉ từ
   control plane node đầu tiên tới các control plane node khác:

   Trong ví dụ dưới đây, thay `CONTROL_PLANE_IPS` với các địa chỉ IP của
   các control plane node khác.

   ```sh
   USER=ubuntu # có thể tùy chỉnh
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Bỏ qua dòng tiếp theo nếu bạn đang sử dụng etcd bên ngoài
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   Chỉ copy các chứng chỉ trong danh sách trên. kubeadm sẽ phụ trách việc sinh ra các chứng chỉ còn lại
   cùng với các SAN cần thiết cho các control-plane instance sắp join. Nếu bạn copy toàn bộ các chứng chỉ do nhầm lẫn,
   quá trình tạo các node bổ sung có thể thất bại do thiếu các SAN cần thiết.
   {{< /caution >}}

1. Sau đó trên từng control plane node sắp join bạn phải chạy tập lệnh sau đây trước khi chạy `kubeadm join`.
   Tập lệnh này sẽ di chuyển các chứng chỉ đã được copy trước đây từ thư mục home tới `/etc/kubernetes/pki`:

   ```sh
   USER=ubuntu # có thể tùy chỉnh
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Bỏ qua dòng tiếp theo nếu bạn đang sử dụng etcd bên ngoài
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```

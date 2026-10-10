---
title: Leases
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

Trong các hệ thống phân tán, Kubernetes sử dụng cơ chế  _leases_ (giữ quyền tạm thời) để khóa tài nguyên dùng chung và điều phối hoạt động giữa các thành phần trong cụm. Trong Kubernetes, lease được biểu diễn bằng các đối tượng [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) thuộc API group `coordination.k8s.io` {{< glossary_tooltip text="API Group" term_id="api-group" >}}, Những đối tượng này đóng vai trò quan trọng trong hệ thống, ví dụ như theo dõi trạng thái node (heartbeat) và cơ chế bầu chọn leader giữa các thành phần nội bộ.

<!-- body -->

## Node heartbeats {#node-heart-beats}

Kubernetes sử dụng Lease API để truyền tín hiệu heartbeat từ kubelet về Kubernetes API server. Với mỗi đối tượng `Node`, sẽ có một đối tượng `Lease` tương ứng (có cùng tên) nằm trong namespace `kube-node-lease`. Ở tầng bên dưới, mỗi lần kubelet gửi heartbeat thực chất là một lệnh **update** lên đối tượng `Lease`, cập nhật trường `spec.renewTime`. Control plane của Kubernetes sẽ dựa vào dấu thời gian trong trường này để xác định `node` đó còn hoạt động hay không.

Xem [Node Lease objects](/docs/concepts/architecture/nodes/#node-heartbeats) để biết thêm chi tiết.

## Leader election

Kubernetes cũng sử dụng Lease để đảm bảo rằng chỉ một phiên bản duy nhất của một thành phần có thể hoạt động tại một thời điểm.
Cơ chế này được áp dụng cho các thành phần của control plane như `kube-controller-manager` và `kube-scheduler` trong các cấu hình HA (High Availability) — nơi chỉ một phiên bản của thành phần đó được phép hoạt động chính, còn các phiên bản còn lại sẽ ở chế độ chờ.

Đọc thêm tại [coordinated leader election](/docs/concepts/cluster-administration/coordinated-leader-election) để tìm hiểu cách Kubernetes sử dụng Lease API để chọn phiên bản nào sẽ đóng vai trò leader.

## API server identity

{{< feature-state feature_gate_name="APIServerIdentity" >}}

Từ phiên bản Kubernetes v1.26, mỗi `kube-apiserver` sẽ sử dụng Lease API để công bố danh tính của mình với phần còn lại của hệ thống.Mặc dù việc này chưa mang lại lợi ích trực tiếp, nhưng nó cung cấp một cơ chế để các thành phần khác có thể phát hiện được có bao nhiêu phiên bản `kube-apiserver` đang hoạt động trong control plane. Việc tồn tại các Lease của kube-apiserver giúp chuẩn bị cho các tính năng trong tương lai, nơi các kube-apiserver có thể cần phối hợp hoạt động với nhau.

Bạn có thể kiểm tra các Lease này trong namespace kube-system, với tên theo dạng `apiserver-<sha256-hash>`. Hoặc sử dụng label để lọc `apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
``` 
```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```
Chuỗi SHA256 hash được sử dụng trong tên của đối tượng Lease được tính dựa trên hostname của hệ điều hành mà kube-apiserver nhìn thấy. Do đó, mỗi kube-apiserver cần được cấu hình với một hostname duy nhất trong cụm Kubernetes để tránh xung đột.
Khi có một instance mới của kube-apiserver được khởi động và sử dụng cùng hostname với một instance trước đó, nó sẽ tiếp quản Lease đã có sẵn bằng cách ghi đè holder identity, thay vì tạo một Lease mới.Bạn có thể kiểm tra hostname mà kube-apiserver đang sử dụng bằng cách tra nhãn `kubernetes.io/hostname` trên node hoặc pod tương ứng:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```
Các Lease đã hết hạn từ những kube-apiserver không còn tồn tại sẽ được thu gom tự động (garbage collect) bởi các kube-apiserver mới sau 1 giờ.

Bạn có thể tắt cơ chế Lease định danh của API server bằng cách vô hiệu hóa feature gate APIServerIdentity.
Xem thêm tại [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

## Workloads {#custom-workload}

Bạn có thể tự định nghĩa và sử dụng Lease cho chính workload của mình.
Ví dụ: bạn có thể chạy một {{< glossary_tooltip term_id="controller" text="controller" >}} tùy chỉnh, trong đó một bản sao chính (primary hoặc leader) sẽ thực hiện các thao tác mà các bản sao còn lại không thực hiện.
Bạn định nghĩa một đối tượng Lease để các bản sao của controller có thể chọn hoặc bầu chọn ra leader, sử dụng Kubernetes API để phối hợp hoạt động.
Nếu bạn sử dụng Lease, cách thực hiện tốt là đặt tên Lease sao cho dễ liên kết với sản phẩm hoặc thành phần sử dụng nó.
Ví dụ: nếu bạn có một thành phần tên là Example Foo, thì nên đặt Lease là `example-foo`.

Nếu người vận hành cluster hoặc người dùng cuối có thể triển khai nhiều phiên bản của cùng một thành phần, hãy chọn một tiền tố tên riêng biệt và áp dụng một cơ chế (chẳng hạn như hash của tên Deployment) để tránh trùng tên Lease.

Bạn cũng có thể sử dụng một cách tiếp cận khác, miễn là đạt được mục tiêu chung:
các phần mềm khác nhau không gây xung đột với nhau khi sử dụng Lease.


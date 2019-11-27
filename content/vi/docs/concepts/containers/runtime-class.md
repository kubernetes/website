---
reviewers:
- huynguyennovem
title: Runtime Class
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

Trang này mô tả tài nguyên RuntimeClass và cơ chế lựa chọn runtime.

{{< warning >}}
RuntimeClass bao gồm các thay đổi trong phiên bản nâng cấp beta ở v1.14. Nếu bạn đang sử dụng
RuntimeClass trước phiên phản v1.14, xem [Nâng cấp RuntimeClass từ bản Alpha lên
Beta](#upgrading-runtimeclass-from-alpha-to-beta).
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

## Runtime Class

RuntimeClass là một tính năng để lựa chọn cấu hình container runtime. Cấu hình container
runtime được dùng để chạy các containers trong Pod.

## Motivation

Bạn có thể thiết lập một RuntimeClass khác nhau giữa các Pod khác nhau để cung cấp sự cân bằng
giữa hiệu năng và bảo mật. Ví dụ: nếu một phần workload của bạn cần được đảm bảo
an toàn thông tin ở mức cao, bạn có thể chọn lên lịch cho các Pod đó để
chúng chạy trong một container runtime sử dụng phần cứng được ảo hóa. Sau đó, bạn sẽ
hưởng lợi từ sự cô lập thêm của runtime thay thế, với một số chi phí bổ sung.

Bạn cũng có thể dùng RuntimeClass để chạy các Pod khác nhau với cùng một container runtime
nhưng với các cài đặt khác nhau.

### Cài đặt

Đảm bảo rằng feature gate của RuntimeClass được kích hoạt (theo mặc định). Xem [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/) để được giải thích về việc kích hoạt 
feature gates. `RuntimeClass` feature gate phải được kích hoạt trên apiservers _và_ kubelet.

1. Cấu hình triển khai CRI trên các node (phụ thuộc vào runtime)
2. Tạo các tài nguyên RuntimeClass tương ứng

#### 1. Cấu hình triển khai CRI trên các nodes

Các cấu hình có sẵn thông qua RuntimeClass là phụ thuộc vào việc triển khai Container Runtime Interface. 
Xem tài liệu ([bên dưới](#cri-configuration)) để biết cách cấu hình triển khai CRI.

{{< note >}}
RuntimeClass giả định rằng cấu hình node là đồng nhất trên toàn cluster theo mặc định (có nghĩa
là tất cả các node được cấu hình theo cùng một cách liên quan đến container runtimes). Để hỗ trợ
các cấu hình node không đồng nhất, hãy xem [Scheduling](#scheduling) dưới đây.
{{< /note >}}

Các cấu hình đều có một `handler` tương ứng, được tham chiếu bởi RuntimeClass. `Handler`
phải là một nhãn DNS 1123 hợp lệ (alpha-numeric + `-` characters).

#### 2. Tạo tài nguyên RuntimeClass tương ứng

Mỗi thiết lập cấu hình trong bước 1 nên có một tên `handler` liên quan, xác định
cấu hình. Đối với mỗi handler, tạo một đối tượng RuntimeClass tương ứng.

Tài nguyên RuntimeClass hiện chỉ có 2 trường quan trọng: tên RuntimeClass (`metadata.name`) 
và handler (`handler`). Định nghĩa một RuntimeClass:

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClass được định nghĩa trong node.k8s.io API group
kind: RuntimeClass
metadata:
  name: myclass  # The name the RuntimeClass will be referenced by
  # RuntimeClass is a non-namespaced resource
handler: myconfiguration  # The name of the corresponding CRI configuration
```

{{< note >}}
Bạn nên hạn chế thao tác ghi (write) RuntimeClass (tạo/cập nhật/patch/xóa) cho
cluster administrator. Đây là thiết lập mặc định. Xem [Tổng quan về 
phân quyền](/docs/reference/access-authn-authz/authorization/) để biết thêm chi tiết.
{{< /note >}}

### Cách sử dụng

Một khi RuntimeClasses được cấu hình cho cluster, việc sử dụng chúng rất đơn giản. Xác định một
`runtimeClassName` trong Pod spec. Ví dụ:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Cấu hình này sẽ giúp Kubelet sử dụng RuntimeClass được đặt tên chạy trong pod. Nếu RuntimeClass 
có tên không tồn tại, hoặc CRI không thể chạy handler tương ứng, pod sẽ vào giai đoạn ([phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)) `Failed`. 
Tìm kiếm một [sự kiện](/docs/tasks/debug-application-cluster/debug-application-introspection/) tương ứng cho một thông báo lỗi. 

Nếu không có `runtimeClassName` nào được xác định, RuntimeHandler mặc định sẽ được sử dụng, tương đương
với việc tính năng RuntimeClass bị tắt.

### Cấu hình CRI

Để biết thêm chi tiết về cách thiết lập CRI runtimes, xem [CRI installation](/docs/setup/production-environment/container-runtimes/).

#### dockershim

CRI của dockershim tích hợp trong Kubernetes CRI không hỗ trợ runtime handlers.

#### [containerd](https://containerd.io/)

Runtime handlers được cấu hình thông qua cấu hình containerd tại
`/etc/containerd/config.toml`. Handlers hợp lệ được cấu hình trong phần runtimes:

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

Xem tài liệu cấu hình của containerd để biết thêm chi tiết:
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

Runtime handlers được cấu hình thông qua cấu hình cri-o tại `/etc/crio/crio.conf`. Handlers hợp lệ
được cấu hình trong [crio.runtime table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Xem tài liệu cấu hình của cri-o để biết thêm chi tiết:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go

### Scheduling

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Ở phiên bản Kubernetes v1.16, RuntimeClass hỗ trợ cho các cluster không đồng nhất (heterogenous) thông
qua trường `scheduling`. Thông qua việc sử dụng các trường này, bạn có thể đảm bảo rằng các pod chạy
với RuntimeClass này được lên lịch tới các node hỗ trợ nó. Để hỗ trợ việc lập lịch, bạn phải enable
RuntimeClass [admission controller][] (mặc định, phiên bản 1.16).

Để đảm bảo các pods nằm trên các nodes hỗ trợ RuntimeClass xác định, tập các nodes đó phải có
nhãn chung sau đó được chọn bới trường `runtimeclass.scheduling.nodeSelector`. nodeSelector của RuntimeClass
được hợp nhất với nodeSelector của pod trong khi pod được schedule đến node. Nếu có xung đột, pod sẽ bị từ
chối.

Nếu các node được hỗ trợ bị vô hiệu hóa để ngăn các RuntimeClass khác của pod chạy trên node, bạn
có thể thêm `tolerations` cho RuntimeClass. Như với `nodeSelector`, các tolerations được hợp nhất
với tolerations của pod khi được schedule đến node, có hiệu quả khi kết hợp một tập các node
được dung sai bởi mỗi node.

Để tìm hiểu thêm về cách cấu hình node selector và tolerations, xem [Chỉ định Pods cho các
Nodes](/docs/concepts/configuration/assign-pod-node/).

[admission controller]: /docs/reference/access-authn-authz/admission-controllers/

### Pod Overhead

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Ở phiên bản Kubernetes v1.16, RuntimeClass hỗ trợ việc xác định overhead liên quan đến việc
chạy một pod, như một phần của tính năng [`PodOverhead`](/docs/concepts/configuration/pod-overhead/).
Để sử dụng `PodOverhead`, bạn phải bật PodOverhead [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
(nó được tắt theo mặc định).


Pod overhead được xác định trong RuntimeClass thông qua trường `Overhead`. Thông qua việc sử dụng các trường này,
bạn có thể chỉ định overhead của việc chạy pod sử dụng RuntimeClass và đảm bảo các overhead được tính trong Kubernetes.

### Nâng cấp RuntimeClass từ bản Alpha lên Beta

Tính năng của phiên bản Beta của RuntimeClass bao gồm những thay đổi sau:

- Nhóm API `node.k8s.io` và tài nguyên `runtimeclasses.node.k8s.io` đã được chuyển sang
  built-in API từ một CustomResourceDefinition.
- `spec` đã được inlined trong định nghĩa RuntimeClass (i.e. không còn
  RuntimeClassSpec nữa).
- Trường `runtimeHandler` được đổi tên thành `handler`.
- Trường `handler` hiện được yêu cầu trong tất cả các phiên bản API. Điều này có nghĩa là trường `runtimeHandler` trong
  bản API Alpha cũng được yêu cầu.
- Trường `handler` phải có một nhãn DNS hợp lệ ([RFC 1123](https://tools.ietf.org/html/rfc1123)),
  nghĩa là nó không còn chứa ký tự `.` (trong tất cả các phiên bản). handlers hợp lệ khớp với
  cách diễn tả sau: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.

**Hành động cần thiết:** Các hành động sau được yêu cầu để nâng cấp từ phiên bản Alpha của
tính năng RuntimeClass lên phiên bản beta:

- Các tài nguyên RuntimeClass phải được tạo lại *sau khi* nâng cấp lên phiên bản v1.14, và
  `runtimeclasses.node.k8s.io` CRD nên được xóa thủ công:
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- Alpha RuntimeClasses với một `runtimeHandler` trống hoặc không xác định hoặc sử dụng ký tự `.` 
  trong handler không còn hợp lệ, và phải chuyển tới một cấu hình handler hợp lệ (xem
  ở trên).

### Đọc thêm

- [Thiết kế RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [Thiết kế RuntimeClass Scheduling](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)
- Đọc về khái niệm [Pod Overhead](/docs/concepts/configuration/pod-overhead/)
- [Thiết kế tính năng PodOverhead](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}

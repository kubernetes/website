---
title: Runtime Class
content_type: concept
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Trang này mô tả tài nguyên RuntimeClass và cơ chế lựa chọn runtime.

RuntimeClass là một tính năng dùng để chọn cấu hình container runtime. Cấu hình container runtime
được dùng để chạy các container của một Pod.

<!-- body -->

## Động lực {#motivation}

Bạn có thể đặt RuntimeClass khác nhau cho các Pod khác nhau để cân bằng giữa
hiệu năng và bảo mật. Ví dụ, nếu một phần workload của bạn cần mức đảm bảo
an toàn thông tin cao, bạn có thể chọn lập lịch các Pod đó sao cho
chúng chạy trên một container runtime sử dụng ảo hóa phần cứng. Khi đó bạn sẽ
có thêm khả năng cô lập từ runtime thay thế này, đổi lại là phát sinh thêm một số
chi phí phụ trội (overhead).

Bạn cũng có thể dùng RuntimeClass để chạy các Pod khác nhau với cùng một container runtime
nhưng với các thiết lập khác nhau.

## Thiết lập {#setup}

1. Cấu hình bản triển khai CRI trên các node (tùy thuộc vào runtime)
2. Tạo các tài nguyên RuntimeClass tương ứng

### 1. Cấu hình bản triển khai CRI trên các node {#1-configure-the-cri-implementation-on-nodes}

Các cấu hình có thể dùng thông qua RuntimeClass phụ thuộc vào bản triển khai Container Runtime Interface (CRI).
Xem tài liệu tương ứng ([bên dưới](#cri-configuration)) của bản triển khai CRI mà bạn dùng
để biết cách cấu hình.

{{< note >}}
Theo mặc định, RuntimeClass giả định rằng cấu hình node là đồng nhất trên toàn cluster (nghĩa là
tất cả các node đều được cấu hình giống nhau về container runtime). Để hỗ trợ
cấu hình node không đồng nhất, xem phần [Lập lịch](#scheduling) bên dưới.
{{< /note >}}

Mỗi cấu hình có một tên `handler` tương ứng, được RuntimeClass tham chiếu tới. Handler
phải là một [tên DNS label](/docs/concepts/overview/working-with-objects/names/#dns-label-names) hợp lệ.

### 2. Tạo các tài nguyên RuntimeClass tương ứng {#2-create-the-corresponding-runtimeclass-resources}

Mỗi cấu hình được thiết lập ở bước 1 cần có một tên `handler` đi kèm để định danh
cấu hình đó. Với mỗi handler, hãy tạo một đối tượng RuntimeClass tương ứng.

Tài nguyên RuntimeClass hiện chỉ có 2 trường quan trọng: tên của RuntimeClass
(`metadata.name`) và handler (`handler`). Định nghĩa đối tượng trông như sau:

```yaml
# RuntimeClass được định nghĩa trong API group node.k8s.io
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # Tên dùng để tham chiếu tới RuntimeClass.
  # RuntimeClass là tài nguyên không thuộc namespace nào.
  name: myclass 
# Tên của cấu hình CRI tương ứng
handler: myconfiguration 
```

Tên của một đối tượng RuntimeClass phải là một
[tên DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) hợp lệ.

{{< note >}}
Bạn nên giới hạn các thao tác ghi đối với RuntimeClass (create/update/patch/delete) chỉ cho
quản trị viên cluster. Thông thường đây là thiết lập mặc định. Xem
[Tổng quan về phân quyền](/docs/reference/access-authn-authz/authorization/) để biết thêm chi tiết.
{{< /note >}}

## Cách sử dụng {#usage}

Sau khi các RuntimeClass đã được cấu hình cho cluster, bạn có thể chỉ định
`runtimeClassName` trong đặc tả của Pod để sử dụng. Ví dụ:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Điều này sẽ yêu cầu kubelet dùng RuntimeClass được chỉ định để chạy pod này. Nếu
RuntimeClass được chỉ định không tồn tại, hoặc CRI không thể chạy handler tương ứng, pod sẽ chuyển sang
[pha (phase)](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) kết thúc `Failed`. Hãy tìm
[sự kiện (event)](/docs/tasks/debug/debug-application/debug-running-pod/) tương ứng để xem
thông báo lỗi.

Nếu không chỉ định `runtimeClassName`, RuntimeHandler mặc định sẽ được sử dụng, tương đương
với hành vi khi tính năng RuntimeClass bị tắt.

### Cấu hình CRI {#cri-configuration}

Để biết thêm chi tiết về cách thiết lập các CRI runtime, xem [Cài đặt CRI](/docs/setup/production-environment/container-runtimes/).

#### {{< glossary_tooltip term_id="containerd" >}}

Các runtime handler được cấu hình thông qua file cấu hình của containerd tại
`/etc/containerd/config.toml`. Các handler hợp lệ được cấu hình trong phần runtimes:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

Xem [tài liệu cấu hình](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) của containerd
để biết thêm chi tiết:

#### {{< glossary_tooltip term_id="cri-o" >}}

Các runtime handler được cấu hình thông qua file cấu hình của CRI-O tại `/etc/crio/crio.conf`. Các
handler hợp lệ được cấu hình trong
[bảng crio.runtime](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Xem [tài liệu cấu hình](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) của CRI-O để biết thêm chi tiết.

## Lập lịch {#scheduling}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Bằng cách chỉ định trường `scheduling` cho một RuntimeClass, bạn có thể đặt các ràng buộc để
đảm bảo rằng các Pod chạy với RuntimeClass này được lập lịch lên những node hỗ trợ nó.
Nếu không đặt `scheduling`, Kubernetes giả định rằng tất cả các node đều hỗ trợ RuntimeClass này.

Để đảm bảo các pod được đặt lên những node hỗ trợ một RuntimeClass cụ thể, nhóm node đó cần có một
label chung để trường `runtimeclass.scheduling.nodeSelector` chọn ra. nodeSelector
của RuntimeClass được hợp nhất với nodeSelector của pod trong bước admission, tức là lấy
phần giao giữa các tập node mà mỗi bên chọn. Nếu có xung đột, pod sẽ bị
từ chối.

Nếu các node được hỗ trợ đã bị gắn taint để ngăn pod của RuntimeClass khác chạy trên node đó, bạn
có thể thêm `tolerations` vào RuntimeClass. Tương tự như `nodeSelector`, các toleration được hợp nhất
với toleration của pod trong bước admission, tức là lấy phần hợp giữa các tập node
mà mỗi bên chấp nhận (tolerate).

Để tìm hiểu thêm về cách cấu hình node selector và toleration, xem
[Gán Pod cho Node](/docs/concepts/scheduling-eviction/assign-pod-node/).

### Chi phí phụ trội của Pod (Pod Overhead) {#pod-overhead}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Bạn có thể chỉ định các tài nguyên _overhead_ gắn với việc chạy một Pod. Việc khai báo overhead cho phép
cluster (bao gồm cả scheduler) tính đến phần này khi đưa ra quyết định về Pod và tài nguyên.

Pod overhead được định nghĩa trong RuntimeClass thông qua trường `overhead`. Bằng cách sử dụng trường này,
bạn có thể chỉ định overhead khi chạy các pod sử dụng RuntimeClass này và đảm bảo các overhead này
được Kubernetes tính đến.

## {{% heading "whatsnext" %}}

- [Thiết kế RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [Thiết kế lập lịch RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- {{< api-reference page="node/runtime-class-v1" text="Tài liệu tham khảo API RuntimeClass" >}}
- Đọc về khái niệm [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
- [Thiết kế tính năng PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)

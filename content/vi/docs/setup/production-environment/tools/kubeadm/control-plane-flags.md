---
reviewers:
- sig-cluster-lifecycle
title: Tùy chỉnh các thành phần bằng API kubeadm
content_type: concept
weight: 40
---

<!-- overview -->

Trang này trình bày cách tùy chỉnh các thành phần mà kubeadm triển khai. Đối với các thành phần control plane, bạn có thể sử dụng cờ (flags) trong cấu trúc `ClusterConfiguration` hoặc các patch theo từng node. Đối với kubelet và kube-proxy, bạn có thể sử dụng `KubeletConfiguration` và `KubeProxyConfiguration` tương ứng.

Tất cả các tùy chọn này đều có thể thực hiện thông qua API cấu hình kubeadm. Để biết thêm chi tiết về từng trường trong cấu hình, bạn có thể xem [trang tham chiếu API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
Để cấu hình lại một cluster đã được tạo, hãy xem [Cấu hình lại một cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Tùy chỉnh control plane bằng cờ trong `ClusterConfiguration`

Đối tượng `ClusterConfiguration` của kubeadm cho phép người dùng ghi đè các cờ mặc định được truyền cho các thành phần control plane như APIServer, ControllerManager, Scheduler và Etcd. Các thành phần này được định nghĩa bằng các cấu trúc sau:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Các cấu trúc này chứa một trường chung `extraArgs`, bao gồm các cặp `name` / `value`. Để ghi đè một cờ cho thành phần control plane:

1.  Thêm `extraArgs` thích hợp vào cấu hình của bạn.
2.  Thêm các cờ vào trường `extraArgs`.
3.  Chạy `kubeadm init` với `--config <YOUR CONFIG YAML>`.

{{< note >}}
Bạn có thể tạo một đối tượng `ClusterConfiguration` với các giá trị mặc định bằng cách chạy `kubeadm config print init-defaults` và lưu đầu ra vào một tệp bạn chọn.
{{< /note >}}

{{< note >}}
Đối tượng `ClusterConfiguration` hiện mang tính toàn cục trong các cluster kubeadm. Điều này có nghĩa là bất kỳ cờ nào bạn thêm vào sẽ được áp dụng cho tất cả các instance của cùng một thành phần trên các node khác nhau. Để áp dụng cấu hình riêng cho từng thành phần trên các node khác nhau, bạn có thể sử dụng [patches](#patches).
{{< /note >}}

{{< note >}}
Các cờ trùng lặp (keys), hoặc truyền cùng một cờ `--foo` nhiều lần, hiện không được hỗ trợ. Để giải quyết vấn đề này, bạn phải sử dụng [patches](#patches).
{{< /note >}}

### Cờ APIServer

Để biết chi tiết, hãy xem [tài liệu tham khảo cho kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Ví dụ sử dụng:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### Cờ ControllerManager

Để biết chi tiết, hãy xem [tài liệu tham khảo cho kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Ví dụ sử dụng:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### Cờ Scheduler

Để biết chi tiết, hãy xem [tài liệu tham khảo cho kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Ví dụ sử dụng:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Cờ Etcd

Để biết chi tiết, hãy xem [tài liệu máy chủ etcd](https://etcd.io/docs/).

Ví dụ sử dụng:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Tùy chỉnh bằng patches {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm cho phép bạn truyền một thư mục chứa các tệp patch cho `InitConfiguration`, `JoinConfiguration` và `UpgradeConfiguration` trên từng node. Các patch này có thể được sử dụng như bước tùy chỉnh cuối cùng trước khi cấu hình thành phần được ghi vào đĩa.

Bạn có thể truyền tệp này cho `kubeadm init` với `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Đối với `kubeadm init`, bạn có thể truyền một tệp chứa cả `ClusterConfiguration` và `InitConfiguration` được phân tách bằng `---`.
{{< /note >}}

Bạn có thể truyền tệp này cho `kubeadm join` với `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Nếu bạn đang sử dụng `kubeadm upgrade apply` và `kubeadm upgrade node` để nâng cấp các node kubeadm của mình, bạn phải cung cấp lại các patch tương tự để tùy chỉnh được giữ nguyên sau khi nâng cấp.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

Thư mục phải chứa các tệp có tên `target[suffix][+patchtype].extension`. Ví dụ: `kube-apiserver0+merge.yaml` hoặc chỉ `etcd.json`.

- `target` có thể là một trong các giá trị `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`, `kubeletconfiguration` và `corednsdeployment`.
- `suffix` là một chuỗi tùy chọn có thể được sử dụng để xác định patch nào được áp dụng trước theo thứ tự chữ-số.
- `patchtype` có thể là một trong các giá trị `strategic`, `merge` hoặc `json` và các giá trị này phải khớp với các định dạng patch [được hỗ trợ bởi kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch). `patchtype` mặc định là `strategic`.
- `extension` phải là `json` hoặc `yaml`.

## Tùy chỉnh kubelet {#kubelet}

Để tùy chỉnh kubelet, bạn có thể thêm một [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) bên cạnh `ClusterConfiguration` hoặc `InitConfiguration`, được phân tách bằng `---` trong cùng một tệp cấu hình. Sau đó, tệp này có thể được truyền cho `kubeadm init` và kubeadm sẽ áp dụng cùng một `KubeletConfiguration` cơ sở cho tất cả các node trong cluster.

Để áp dụng cấu hình riêng cho từng instance chồng lên `KubeletConfiguration` cơ sở, bạn có thể sử dụng [target patch `kubeletconfiguration`](#patches).

Ngoài ra, bạn có thể sử dụng các cờ kubelet để ghi đè bằng cách truyền chúng vào trường `nodeRegistration.kubeletExtraArgs` được hỗ trợ bởi cả `InitConfiguration` và `JoinConfiguration`. Một số cờ kubelet đã không còn được dùng (deprecated), vì vậy hãy kiểm tra trạng thái của chúng trong [tài liệu tham khảo kubelet](/docs/reference/command-line-tools-reference/kubelet) trước khi sử dụng.

Để biết thêm chi tiết, hãy xem [Cấu hình từng kubelet trong cluster của bạn bằng kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

## Tùy chỉnh kube-proxy

Để tùy chỉnh kube-proxy, bạn có thể truyền một `KubeProxyConfiguration` bên cạnh `ClusterConfiguration` hoặc `InitConfiguration` cho `kubeadm init`, được phân tách bằng `---`.

Để biết thêm chi tiết, bạn có thể xem [trang tham chiếu API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm triển khai kube-proxy dưới dạng một {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, điều này có nghĩa là `KubeProxyConfiguration` sẽ được áp dụng cho tất cả các instance của kube-proxy trong cluster.
{{< /note >}}

## Tùy chỉnh CoreDNS

kubeadm cho phép bạn tùy chỉnh Deployment CoreDNS bằng các patch áp dụng cho [target patch `corednsdeployment`](#patches).

Các patch cho các đối tượng API khác liên quan đến CoreDNS như `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} hiện không được hỗ trợ. Bạn phải tự patch các đối tượng này bằng kubectl và tạo lại các {{< glossary_tooltip text="Pods" term_id="pod" >}} CoreDNS sau đó.

Hoặc, bạn có thể vô hiệu hóa việc triển khai CoreDNS của kubeadm bằng cách đưa tùy chọn sau vào `ClusterConfiguration` của bạn:

```yaml
dns:
  disabled: true
```

Ngoài ra, bằng cách thực thi lệnh sau:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

bạn có thể lấy tệp manifest mà kubeadm sẽ tạo cho CoreDNS trong môi trường của bạn.
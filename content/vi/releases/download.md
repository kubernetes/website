---
title: Tải xuống Kubernetes
type: docs
---

Kubernetes cung cấp các tệp nhị phân cho từng thành phần cũng như một bộ các công cụ chuẩn để khởi động hoặc tương tác với một cụm. Các thành phần như
máy chủ API (`kube-apiserver`) có khả năng chạy trong container image (tương tự một ứng dụng trên Kubernetes) bên trong một
cụm. Các thành phần như vậy được đóng gói dưới dạng container image như một phần của
quy trình phát hành chính thức. Tất cả các tệp nhị phân cũng như container image được phát hành tương thích cho nhiều hệ điều hành cũng như phần cứng.

### kubectl

<!-- overview -->

Công cụ command-line của Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), cho phép bạn tương tác với cụm Kubernetes.

Có thể sử dụng kubectl để triển khai ứng dụng, quan sát, quản lý tài nguyên của cụm, hay xem log. Chi tiết thêm về kubectl, tham khảo the
[tài liệu về `kubectl`](/docs/reference/kubectl/).

kubectl có thể được cài đặt trên nhiều hệ điều hành khác nhau, Linux, macOS hay Windows. Bạn có thể tìm thấy hướng dẫn cài đặt cụ thể tương ứng ở dưới

- [Cài đặt kubectl cho Linux](/docs/tasks/tools/install-kubectl-linux)
- [Cài đặt kubectl cho macOS](/docs/tasks/tools/install-kubectl-macos)
- [Cài đặt kubectl cho Windows](/docs/tasks/tools/install-kubectl-windows)

## Container images

Tất cả các container image của Kubernetes đều được tải lên `registry.k8s.io`.

| Container Image                                                           | Supported Architectures           |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Container image architectures

Tất cả các container image đều có sẵn cho các kiến trúc (hardware architecture). Bạn có thể kéo chính xác container image tương ứng với kiến trúc của máy bằng cách thêm vào phần đuôi tên container image. Ví dụ `registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Container image signatures

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Tất cả các container image của Kubernetes được ký (sign) sử dụng chữ ký [sigstore](https://sigstore.dev)

{{< note >}}
Chữ ký sigstore cho các container image hiện tại không ăn khớp giữa các vị trí địa lý.
Tìm hiểu thêm về vấn đề này tại 
[GitHub issue](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

Kubernetes công khai danh sách các container images đã được ký xác nhận theo [SPDX 2.3](https://spdx.dev/specifications/). Bạn có thể lấy thông tin về danh sách bằng cách:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Để kiểm tra các container image được ký xác nhận, làm theo hướng dẫn ở 
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-artifacts).

Nếu bạn kéo về một container image cho một kiến trúc phần cứng chỉ định, container image cho kiến trúc đơn (single-architecture) được ký cùng cách với danh sách manifest cho kiến trúc đa (multi-architecture).

## Binaries

{{< release-binaries >}}

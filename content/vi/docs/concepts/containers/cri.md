---
title: Container Runtime Interface (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

CRI là một giao diện plugin cho phép kubelet sử dụng nhiều loại
container runtime khác nhau mà không cần biên dịch lại các thành phần của cluster.

Bạn cần có một
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} hoạt động được trên
mỗi Node trong cluster, để
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} có thể khởi chạy
các {{< glossary_tooltip text="Pod" term_id="pod" >}} cùng các container của chúng.

{{< glossary_definition prepend="Container Runtime Interface (CRI) là" term_id="cri" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet đóng vai trò client khi kết nối tới container runtime thông qua gRPC.
Các endpoint của runtime service và image service phải có sẵn trong container
runtime; bạn có thể cấu hình riêng các endpoint này trong kubelet bằng
[cờ dòng lệnh](/docs/reference/command-line-tools-reference/kubelet/)
`--container-runtime-endpoint`.

Với Kubernetes v1.26 trở lên, kubelet yêu cầu container runtime phải
hỗ trợ CRI API `v1`. Nếu một container runtime không hỗ trợ API `v1`,
kubelet sẽ không đăng ký node.

## Nâng cấp {#upgrading}

Khi nâng cấp phiên bản Kubernetes trên một node, kubelet sẽ khởi động lại. Nếu
container runtime không hỗ trợ CRI API `v1`, kubelet sẽ không thể đăng ký
và sẽ báo lỗi. Nếu cần kết nối lại (re-dial) gRPC vì container
runtime đã được nâng cấp, runtime phải hỗ trợ CRI API `v1` thì
kết nối mới thành công. Có thể bạn sẽ cần khởi động lại kubelet sau khi
container runtime đã được cấu hình đúng.

## Truyền danh sách theo luồng (list streaming) {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

Các RPC liệt kê tiêu chuẩn của CRI (`ListContainers`, `ListPodSandbox`, `ListImages`) trả về
toàn bộ kết quả trong một phản hồi unary duy nhất. Trên các node có số lượng container lớn
(ví dụ, nhiều hơn khoảng 10,000 container, tính cả container đang chạy lẫn đã dừng), các
phản hồi này có thể vượt quá giới hạn kích thước thông điệp mặc định 16 MiB của gRPC, khiến kubelet
gặp lỗi khi đối chiếu (reconcile) trạng thái với container runtime.

Khi bật feature gate `CRIListStreaming`, kubelet sử dụng các RPC streaming phía
server (chẳng hạn `StreamContainers`, `StreamPodSandboxes`,
`StreamImages`), cho phép container runtime chia kết quả ra
nhiều thông điệp phản hồi, nhờ đó vượt qua giới hạn kích thước của mỗi thông điệp. Điều này
đặc biệt hữu ích cho:

- Các môi trường mà container được tạo và hủy liên tục (các hệ thống CI/CD)
- Các workload xử lý theo lô (batch) quy mô lớn

Nếu container runtime không hỗ trợ các RPC streaming, kubelet
sẽ tự động quay về dùng các RPC unary tiêu chuẩn để đảm bảo tương thích
ngược.

## {{% heading "whatsnext" %}}

- Tìm hiểu thêm về [định nghĩa giao thức](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto) của CRI

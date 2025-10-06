---
reviewers:
- jpbetz
title: Proxy Đa Phiên Bản (Mixed Version Proxy)
content_type: concept
weight: 220
---

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

Kubernetes {{< skew currentVersion >}} giới thiệu một tính năng alpha cho phép
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
proxy các yêu cầu tài nguyên đến các API server _ngang hàng_ khác. Tính năng này đặc biệt hữu ích khi trong một cụm có nhiều API server đang chạy các phiên bản Kubernetes khác nhau (ví dụ: trong quá trình nâng cấp cụm kéo dài sang phiên bản mới).

Điều này giúp quản trị viên của cluster cấu hình các cluster có độ sẵn sàng cao (high availability) có thể được nâng cấp một cách an toàn hơn, bằng cách chuyển hướng các yêu cầu tài nguyên (trong thời gian nâng cấp) đến đúng kube-api server. Cơ chế proxy này giúp người dùng tránh gặp lỗi 404 (Not Found) không mong muốn do quá trình nâng cấp gây ra.

Cơ chế này được gọi là _Proxy Đa Phiên Bản_.

## Bật tính năng Proxy Đa Phiên Bản

Đảm bảo rằng cờ [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `UnknownVersionInteroperabilityProxy` đã được bật khi khởi động
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}:

```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# các tham số dòng lệnh bắt buộc cho tính năng này
--peer-ca-file=<đường dẫn đến CA cert của kube-apiserver>
--proxy-client-cert-file=<đường dẫn đến chứng chỉ proxy của aggregator>,
--proxy-client-key-file=<đường dẫn đến khóa proxy của aggregator>,
--requestheader-client-ca-file=<đường dẫn đến CA cert của aggregator>,
# requestheader-allowed-names có thể để trống để chấp nhận mọi Common Name
--requestheader-allowed-names=<các Common Name hợp lệ để xác minh chứng chỉ proxy client>,

# các cờ tuỳ chọn cho tính năng này
--peer-advertise-ip=<Địa chỉ IP của kube-apiserver này để peer sử dụng khi proxy> --peer-advertise-port=<Cổng mà kube-apiserver này mở để peer sử dụng khi proxy>

# …và các cờ khác như thường lệ
```

## Kết nối và xác thực giữa các API server {#transport-and-authn}

* API server _nguồn_ tái sử dụng các [cờ xác thực client cho API server hiện có](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication) là `--proxy-client-cert-file` và `--proxy-client-key-file` để trình bày danh tính của nó, danh tính này sẽ được kube-apiserver đích (destination kube-apiserver) xác minh. API server đích sẽ xác thực kết nối từ phía đối tác dựa trên cấu hình được chỉ định thông qua tham số dòng lệnh `--requestheader-client-ca-file`.

* Để xác thực chứng chỉ _phục vụ_ (serving cert) của API server _đích_, bạn cần cấu hình một gói chứng chỉ CA bằng cách cung cấp tham số dòng lệnh `--peer-ca-file` cho API server _nguồn_.

## Cấu hình kết nối tới peer API server

Để khai báo địa chỉ mạng của một API server mà các peer sẽ sử dụng để proxy yêu cầu, sử dụng các tham số `--peer-advertise-ip` và `--peer-advertise-port`, hoặc khai báo trong tệp cấu hình của API server.

Nếu không khai báo các cờ này, kube-apiserver sẽ mặc định sử dụng giá trị từ `--advertise-address` hoặc `--bind-address`. Nếu các tham số này cũng không được cấu hình, địa chỉ giao diện mạng mặc định của máy chủ sẽ được dùng.

## Cơ chế proxy giữa các phiên bản khác nhau

Khi proxy đa phiên bản được bật, [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) sẽ tải một bộ lọc đặc biệt với các hành vi sau:

* Khi một API server nhận được yêu cầu tài nguyên mà nó không thể xử lý (do chưa hỗ trợ API đó hoặc API bị tắt), nó sẽ tìm cách proxy yêu cầu đến một API server _ngang hàng_ có thể xử lý yêu cầu đó.

 Việc này được thực hiện bằng cách xác định các nhóm / phiên bản / tài nguyên API mà server hiện tại không nhận biết, rồi chuyển tiếp yêu cầu tới một peer có thể xử lý được.

* Nếu API server peer gặp lỗi khi phản hồi, API server _nguồn_ sẽ trả về lỗi 503 ("Service Unavailable").

## Cách hoạt động bên trong

Khi một API server nhận yêu cầu tài nguyên, nó kiểm tra xem API server nào có thể xử lý yêu cầu đó. Việc kiểm tra này dựa trên API [`StorageVersion`](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io) nội bộ.

* Nếu tài nguyên đã được API server nhận biết (ví dụ: `GET /api/v1/pods/some-pod`), yêu cầu sẽ được xử lý tại chỗ.

* Nếu không có đối tượng `StorageVersion` nào tương ứng với tài nguyên yêu cầu (ví dụ: `GET /my-api/v1/my-resource`) nhưng `APIService` tương ứng được cấu hình để proxy đến một API server mở rộng, thì yêu cầu sẽ được xử lý theo [luồng proxy mở rộng](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).

* Nếu có một đối tượng `StorageVersion` hợp lệ cho tài nguyên được yêu cầu (ví dụ: `GET /batch/v1/jobs`) và API server đang cố xử lý yêu cầu đó (gọi là _handling API server_) đã tắt nhóm API `batch`, thì _handling API server_ sẽ truy xuất danh sách các API server ngang hàng (peer API servers) có phục vụ nhóm API / phiên bản / tài nguyên tương ứng (trong trường hợp này là `api/batch/v1`) dựa trên thông tin từ đối tượng `StorageVersion` đã truy xuất. Sau đó, handling API server sẽ chuyển tiếp (proxy) yêu cầu đến một trong những kube-apiserver ngang hàng phù hợp, vốn có khả năng xử lý tài nguyên được yêu cầu.

  * Nếu không có peer nào khả dụng cho nhóm / phiên bản / tài nguyên đó, API server sẽ trả lại lỗi 404 ("Not Found").

  * Nếu có peer phù hợp nhưng không phản hồi (do lỗi mạng, hoặc thông tin về peer chưa được đăng ký đúng lúc), thì API server sẽ trả về lỗi 503 ("Service Unavailable").
  

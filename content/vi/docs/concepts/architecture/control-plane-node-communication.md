---
reviewers:
- dchen1107
- liggitt
title: Giao tiếp giữa các Nodes và Control Plane
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

Tài liệu này liệt kê các kênh giao tiếp giữa {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} và {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}} trong Kubernetes.
Mục đích là giúp người dùng tùy chỉnh cấu hình cài đặt để tăng cường bảo mật mạng,
cho phép cụm (cluster) có thể vận hành trong một mạng không đáng tin cậy (hoặc sử dụng toàn bộ địa chỉ IP công khai trên các nền tảng clound).

<!-- body -->

## Kết nối từ Node đến Control Plane

Kubernetes sử dụng mô hình API kiểu “hub-and-spoke” (trung tâm và vệ tinh), tức là tất cả các yêu cầu sử dụng API từ các node (hoặc từ các pod đang chạy trên node đó) đều được gửi đến API server – đây là “trung tâm” trong mô hình.
Các thành phần khác trong control plane không được thiết kế để cung cấp dịch vụ từ xa, nên toàn bộ việc tương tác với cụm đều phải thông qua API server. API server được cấu hình để lắng nghe các kết nối từ xa thông qua cổng HTTPS bảo mật (thường là cổng 443). Khi có một client (như kubelet trên node hoặc một pod trong cụm) gửi yêu cầu,
API server sẽ kiểm tra danh tính bằng cách sử dụng một hoặc nhiều phương thức [authentication](/docs/reference/access-authn-authz/authentication/) (xác thực). Bạn cũng nên bật thêm một hoặc nhiều cơ chế [authorization](/docs/reference/access-authn-authz/authorization/) (phân quyền), để giới hạn quyền truy cập sau khi đã xác thực. Điều này đặc biệt quan trọng nếu cụm Kubernetes của bạn cho phép [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests) (yêu cầu không xác định danh tính) hoặc nếu các [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) (token của tài khoản dịch vụ) đang được sử dụng để truy cập API.

Các node cần được cấu hình sẵn khóa {{< glossary_tooltip text="certificate" term_id="certificate" >}} công khai của cụm,
để chúng có thể kết nối an toàn đến API server cùng với thông tin xác thực client hợp lệ.
Một cách làm hiệu quả là cấp cho kubelet thông tin xác thực dưới dạng chứng chỉ client (client certificate).
Xem thêm [kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) để biết cách tự động cấp phát chứng chỉ client cho kubelet.

Các {{< glossary_tooltip text="Pods" term_id="pod" >}} muốn kết nối đến API server có thể thực hiện điều đó một cách an toàn bằng cách sử dụng Service Account. Khi một Pod được khởi tạo, Kubernetes sẽ tự động chèn vào Pod một chứng chỉ công khai (root certificate) của cụm và một Bearer Token hợp lệ để sử dụng làm thông tin xác thực. Kubernetes cung cấp sẵn một Service nội bộ tên là kubernetes trong namespace default, có một IP ảo dùng làm điểm truy cập mặc định đến API server. Khi một Pod gửi yêu cầu đến service này, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} sẽ chuyển tiếp yêu cầu đến endpoint HTTPS của API server thật sự.

Các thành phần bên trong control plane cũng sử dụng kết nối HTTPS bảo mật này để giao tiếp với API server.

Vì vậy, trong cấu hình mặc định, các kết nối từ Node và từ các Pod đang chạy trên Node đến control plane
đều được bảo mật sẵn, và có thể hoạt động an toàn ngay cả trên các mạng không đáng tin cậy hoặc mạng công cộng.

## Control plane đến node

Từ control plane (API server) đến node, có hai đường giao tiếp chính.
Đường kết nối từ API server đến tiến trình {{< glossary_tooltip text="kubelet" term_id="kubelet" >}},
vốn chạy trên mỗi node trong cụm.
Đường kết nối từ API server đến bất kỳ node, pod hoặc service nào thông qua chức năng proxy của API server.

### API server đến kubelet

Các kết nối từ API server đến kubelet được sử dụng cho các mục đích sau:
* Lấy log từ các pod.
* Kết nối trực tiếp vào tiến trình chính của pod đang chạy (thường thông qua lệnh kubectl attach) để theo dõi hoặc tương tác.
* Cung cấp chức năng port-forward của kubelet.

Các kết nối này kết thúc tại endpoint HTTPS của kubelet. Mặc định, API server không xác minh chứng chỉ (serving certificate) của kubelet, điều này khiến kết nối có thể bị tấn công man-in-the-middle và **không an toàn** nếu chạy trên mạng không đáng tin cậy hoặc mạng công cộng.

Để bật xác minh kết nối này, bạn cần sử dụng cờ `--kubelet-certificate-authority`
để cung cấp cho API server một gói chứng chỉ (root certificate bundle) dùng để xác minh chứng chỉ của kubelet.

Nếu không thể làm được điều đó, bạn nên sử dụng kết nối [SSH tunneling](#ssh-tunnels) giữa API server và kubelet
để tránh phải kết nối trực tiếp qua mạng không tin cậy hoặc mạng công cộng.

Cuối cùng, bạn nên bật [xác thực và/hoặc phân quyền kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)
để bảo vệ API của kubelet một cách an toàn hơn.

### Từ API server đến nodes, pods và services

Các kết nối từ API server đến node, pod hoặc service mặc định sử dụng giao thức HTTP thuần
(vì vậy không được xác thực và cũng không được mã hóa). Bạn có thể ép sử dụng kết nối HTTPS bằng cách thêm tiền tố  `https:` trước tên node, pod hoặc service trong URL của API. Tuy nhiên, dù sử dụng HTTPS thì API server sẽ không xác minh chứng chỉ mà endpoint HTTPS cung cấp và cũng không gửi thông tin xác thực (client credentials). Điều đó có nghĩa kết nối sẽ được mã hóa, nhưng không đảm bảo tính toàn vẹn (integrity). Vì vậy, các kết nối này **hiện tại không an toàn** nếu chạy qua mạng không đáng tin cậy hoặc mạng công cộng.

### Kết nối SSH tunnels

Kubernetes có hỗ trợ [SSH tunnels](https://www.ssh.com/academy/ssh/tunneling) để bảo vệ đường truyền giữa control plane và các node. Ở cấu hình này, API server sẽ thiết lập một tunnel SSH đến từng node trong cụm (kết nối đến dịch vụ SSH đang lắng nghe trên cổng 22), và chuyển toàn bộ lưu lượng (hướng đến kubelet, node, pod hoặc service) thông qua tunnel đó.
Tunnel này đảm bảo rằng lưu lượng sẽ không bị lộ ra ngoài mạng nội bộ nơi các node đang chạy.

{{< note >}}
Tính năng SSH tunnel hiện đang bị deprecated (không còn được khuyến khích sử dụng), vì vậy bạn không nên dùng trừ khi bạn thật sự hiểu rõ những gì đang làm. [Konnectivity service](#konnectivity-service) là phương án thay thế hiện đại cho kênh giao tiếp này.
{{< /note >}}

### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}
Là một phương án thay thế cho SSH tunnel, Konnectivity service cung cấp một proxy ở tầng TCP
cho các kết nối giữa control plane và các node trong cụm.
Konnectivity service bao gồm hai thành phần, Konnectivity server chạy trong mạng của control plane, Konnectivity agents chạy trong mạng của các node Các Konnectivity agent sẽ chủ động thiết lập kết nối đến Konnectivity server, và duy trì các kết nối mạng này. Sau khi bật Konnectivity service, toàn bộ lưu lượng từ control plane đến các node sẽ đi qua các kết nối do dịch vụ này quản lý.

Làm theo hướng dẫn tại [Konnectivity service task](/docs/tasks/extend-kubernetes/setup-konnectivity/) để thiết lập Konnectivity service cho cụm của bạn.

## {{% heading "whatsnext" %}}

* Tìm hiểu về [Kubernetes control plane components](/docs/concepts/architecture/#control-plane-components)
* Tìm hiểu thêm về [Hubs and Spoke model](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Học cách [Secure a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* Tìm hiểu thêm về [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* [Set up Konnectivity service](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Use Port Forwarding to Access Applications in a Cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Tìm hiểu cách [Fetch logs for Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [use kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
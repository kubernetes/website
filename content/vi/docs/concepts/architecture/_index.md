---
title: "Kiến Trúc Cluster"
weight: 30
description: >
  Các khái niệm về kiến trúc của Kubernetes.
---

Một cụm Kubernetes bao gồm một bảng điều khiển trung tâm (control plane) và một nhóm các máy chạy các ứng dụng đã được container hóa, gọi là node. Mỗi cụm Kubernetes cần ít nhất một node như vậy để chạy Pod.

Các máy công nhân (worker node) chạy Pod, chính là các thành phần của ứng dụng. Bảng điều khiển trung tâm quản lý các máy này cũng như Pod trong cụm. Để đảm bảo khả năng chịu lỗi và tính khả dụng cao, bảng điều khiển trung tâm thường được chạy trên nhiều máy đồng thời, và cụm cũng được chạy với nhiều node.

Tài liệu này phác thảo các thành phần khác nhau mà bạn cần có để có một cụm Kubernetes hoàn chỉnh và hoạt động.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy." caption="Hình 1. Các thành phần của cụm Kubernetes." class="diagram-large" >}}

{{< details summary="Chi tiết về kiến trúc" >}}
Hình 1 mô tả kiến trúc cơ bản của một cụm Kubernetes. Các thành phần thực tế có thể có sự thay đổi tùy thuộc vào cài đặt và yêu cầu của cụm.

Trong sơ đồ, mỗi node chạy một [`kube-proxy`](#kube-proxy). Bạn cần một thành phần network proxy ở mỗi node để đảm bảo {{< glossary_tooltip text="Service" term_id="service">}} API và các tính năng liên quan hoạt động trong mạng của cụm. Tuy nhiên, một số network plugin cung cấp proxy của bên thứ ba. Khi bạn sử dụng loại plugin đó, node trong cụm không cần thiết phải chạy `kube-proxy`.
{{< /details >}}

# Bảng điều khiển trung tâm (Control plane) {#control-plane-components}

Các thành phần của bảng điều khiển trung tâm có vai trò đưa ra các quyết định tổng thể trong cụm (ví dụ: lập lịch và phân phối), cũng như phát hiện và phản hồi các sự kiện xảy ra trong cụm (ví dụ: khởi tạo một {{< glossary_tooltip text="pod" term_id="pod">}} khi phát hiện trường `{{< glossary_tooltip text="replicas" term_id="replica" >}}` của Deployment không đúng).

Các thành phần của bảng điều khiển trung tâm có thể chạy trên bất cứ máy nào trong cụm. Tuy nhiên, để đơn giản, các script cài đặt thường khởi tạo và chạy tất cả các thành phần của bảng điều khiển trên cùng một máy, và các containers ứng dụng sẽ không được chạy trên máy đó.

Xem thêm [Tạo một cụm khả dụng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) về hướng dẫn cách cài đặt bảng điều khiển trung tâm chạy đồng thời trên nhiều máy.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Có rất nhiều controller khác nhau, một số có thể kể đến như:

- Node controller: Chịu trách nhiệm theo dõi và phản hồi khi có node gặp sự cố.
- Job controller: Theo dõi Job object, đồng thời tạo Pod để chạy các task và đảm bảo task hoàn thành.
- EndpointSlice controller: Điền thông tin vào các đối tượng EndpointSlice (để cung cấp liên kết giữa Service và Pod).
- ServiceAccount controller: Tạo ServiceAccount mặc định cho namespace mới.

và còn nhiều controller khác nữa.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

Cloud controller manager chỉ chạy các controller cụ thể dành cho nhà cung cấp dịch vụ cloud bạn đang sử dụng. Nếu bạn chạy Kubernetes trên phần cứng của bạn, hoặc trong môi trường thử nghiệm trên PC của bạn, cụm sẽ không chứa bất kỳ cloud controller manager nào.

Tương tự như kube-controller-manager, cloud-controller-manager kết hợp nhiều vòng lặp điều khiển, độc lập về mặt logic, được tổng hợp lại thành một tập nhị phân, và bạn có thể chạy như một tiến trình đơn. Bạn có thể mở rộng theo chiều ngang (chạy thêm một tiến trình khác tương tự) để tăng hiệu suất hoặc giúp tăng chịu lỗi hệ thống.

Một số controller sau có thể có sự phụ thuộc vào nhà cung cấp cloud:

- Node controller: Để kiểm tra nhà cung cấp cloud, xác định xem một nút đã bị xóa trong trên cloud sau khi nó ngừng phản hồi hay chưa.
- Route controller: Để thiết lập các route mạng trong cơ sở hạ tầng cloud.
- Service controller: Để khởi tạo, cập nhật và xóa load balancer tương ứng của nhà cung cấp cloud.

---

## Các thành phần trên máy node {#node-components}

Các thành phần trên node chạy trong tất cả các node của cụm, quản lý các pod đang chạy, và cung cấp môi trường runtime của Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (optional) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}

Nếu bạn sử dụng [network plugin](#network-plugin) có hỗ trợ triển khai chuyển tiếp gói tin cho Service, đồng thời có cung cấp các tính năng tương tự kube-proxy, bạn sẽ không cần cài đặt kube-proxy trên các node trong cụm.

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons sử dụng Kubernetes resource như ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, vv) để triển khai các chức năng của cụm. Vì đó là các chức năng ở cấp độ toàn cụm, các namespace resource được sử dụng bởi chúng sẽ thuộc về `kube-system` namespace.

Danh sách một số các addon được liệt kê dưới đây; nếu bạn muốn xem danh sách đầy đủ, có thể tìm kiếm thêm tại [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Khác với hầu hết các addon là phần mở rộng không bắt buộc, mọi cụm Kubernetes đều nên có [cluster DNS](/docs/concepts/services-networking/dns-pod-service/). Rất nhiều ví dụ hoạt động phụ thuộc vào nó.

Cluster DNS là một DNS server, bổ sung thêm cho các DNS server khác hoạt động trong môi trường của bạn. Nó chủ yếu phụ vụ các bản ghi DNS cho Kubernetes service.

Các container khởi tạo bởi Kubernetes mặc định thêm DNS server này vào danh sách DNS của chúng.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) là một UI trên nên web của cụm Kubernetes. Nó cho phép người dùng quản lý và khắc phục sự cố của bản thân cụm, cũng như những ứng dụng chạy trên cụm đó.

### Container resource monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) ghi lại các thông số của container dưới dạng time-series trong một database tập trung, đồng thời cung cấp một UI để duyệt những dữ liệu đó.

### Cluster-level Logging

Cơ chế [cluster-level logging](/docs/concepts/cluster-administration/logging/) chịu trách nhiệm lưu trữ log của container ở một kho lưu trữ log tập trung, đồng thời cung cấp tính năng tìm kiếm/duyệt các dữ liệu đó.

### Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins) là những phần mềm triển khai Container Network Interface (CNI). Chúng chịu trách nhiệm phân bổ địa chỉ IP cho pod và đảm bảo kết nối giữa các pod trong cụm.

## Các biến thể trong kiến trúc {#architecture-veriations}

Trong khi các thành phần chính của Kubernetes là cố định, cách chúng được triển khai và quản lý có thể có sự khác biệt. Hiểu về những biến thể đó rất quan trọng để thiết kế và duy trì các cụm Kubernetes đáp ứng các nhu cầu vận hành cụ thể.

### Control plane deployment options

Các thành phần của bảng điều khiển trung tâm có thể được triển khai bằng một số cách:

Triển khai truyền thống: Các thành phần chạy trực tiếp trên các máy tính hoặc VM cụ thể được chỉ định, thường được quản lý bởi systemd.

Static Pod: Các thành phần được triển khai như là các static Pod, được quản lý bởi kubelet trên các node cụ thể. Đây là cách làm của công cụ như kubeadm.

Self-hosted: Bảng điều khiển trung tâm chạy như là Pod trong chính cụm Kubernetes, được quản lý bởi Deployment và StatefulSet hoặc các resource khác của Kubernetes.

Managed Kubernetes service: Các nhà cung cấp cloud sẽ trừu tượng hóa bảng điều khiển trung tâm, thay mặt người dùng quản lý nó như một phần của dịch vụ mà họ cung cấp.

### Cân nhắc về vị trí phân phối Workload {#Workload-placement-considerations}

Việc phân phối workload, bao gồm cả các thành phần của bảng điều khiển trung tâm phụ thuộc nhiều yếu tố bao gồm kích thước cụm, yêu cầu về hiệu suất và chính sách hoạt động:

- Trên cụm có kích thước nhỏ hoặc môi trường phát triển, các thành phần của bảng điều khiển trung tâm và workload của người dùng có thể chạy trên cùng node.
- Trên môi trường production, các node cụ thể được chỉ định riêng cho các thành phần của bảng điều khiển trung tâm, tách biệt khỏi workload của người dùng.
- Một số tổ chức chạy các addon quan trọng hoặc công cụ theo dõi trên node chạy các thành phần của bảng điều khiển trung tâm.

### Cluster management tools

Các công cụ như kubeadm, kops, hay Kubespray cung cấp các cách tiếp cận khác nhau để triển khai và quản lý cụm, mỗi cách có phương pháp bố trí và quản lý thành phần riêng.

Tính linh hoạt của kiến ​​trúc Kubernetes cho phép các tổ chức tùy chỉnh cụm của mình theo nhu cầu cụ thể, cân bằng các yếu tố như độ phức tạp của hoạt động, hiệu suất và chi phí quản lý.

### Tùy chỉnh và khả năng mở rộng {#customization-and-extensibility}

Kiến trúc Kubernetes cho phép nhiều tùy chỉnh:

- Custom scheduler có thể được triển khai cùng với scheduler mặc định của Kubernetes hoặc thay thế hoàn toàn nó.
- API server có thể được mở rộng với CustomResourceDefinitions và API Aggregation.
- Các nhà cung cấp Cloud có thể tích hợp sâu với Kubernetes thông qua cloud-controller-manager.

Tính linh hoạt của kiến trúc Kubernetes cho phép các tổ chức điều chỉnh cụm của họ cho các mục đích cụ thể, cân bằng giữa nhiều yếu tố như độ phức tạp vận hành, hiệu suất, và chi phí quản lý.

## {{% heading "whatsnext" %}}

Tìm hiểu thêm về:

- [Nodes](/docs/concepts/architecture/nodes/) và
  [cách giao tiếp](/docs/concepts/architecture/control-plane-node-communication/)
  với bảng điều khiển trung tâm.
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) - scheduler mặc định của Kubernetes.
- [Tài liệu về Etcd](https://etcd.io/docs/).
- Một số [container runtime](/docs/setup/production-environment/container-runtimes/) của Kubernetes.
- Tích hợp với các nhà cung cấp Cloud thông qua [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) command.

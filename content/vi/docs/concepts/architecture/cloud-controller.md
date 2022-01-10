---
title: Các khái niệm nền tảng của Cloud Controller Manager
content_type: concept
weight: 40
---

<!-- overview -->

Khái niệm Cloud Controller Manager (CCM) (để tránh nhầm lẫn với bản binary build cùng tên) được định nghĩa riêng biệt để cho phép các bên cung cấp dịch vụ cloud và thành phần chính của Kubernetes phát triển độc lập với nhau. CCM chạy đồng thời với những thành phần khác thuộc máy chủ của một cluster như Controller Manager của Kubernetes, API server, và Scheduler. Nó cũng có thể đóng vai trò như một addon cho Kubernetes.

Cloud Controller Manager này được thiết kế dựa trên cơ chế plugin nhằm cho phép các bên Cloud Provider có thể tích hợp với Kubernetes một cách dễ dàng thông qua các plugin này. Đã có những bản kế hoạch được thiết kế sẵn nhằm mục đích hỗ trợ những cloud provider thay đổi từ mô hình cũ sang mô hình mới đi chung với CCM.

Tài liệu này thảo luận về những khái niệm đằng sau một CCM và đưa ra những chi tiết về chức năng liên quan của nó.

Dưới đây là kiến trúc của một Kubernetes cluster khi không đi cùng với Cloud Controller Manager:

![Kiến trúc CCM Kube trước đây](/images/docs/pre-ccm-arch.png)



<!-- body -->

## Thiết kế

Trong sơ đồ trên, Kubernetes và nhà cung cấp dịch vụ cloud được tích hợp thông qua một số thành phần sau:

- Kubelet
- Kubernetes Controller Manager
- Kubernetes API server

CCM hợp nhất tất cả các logic phụ thuộc trên một nền tàng Cloud từ 3 thành phần trên để tạo thành một điểm tích hợp duy nhất với hệ thống Cloud. Sơ đồ kiến trúc khi đi kèm với CCM sẽ trở thành:

![Kiến trúc CCM Kube hiện tại](/images/docs/post-ccm-arch.png)

## Các thành phần của CCM

Cloud Controller Manager phân nhỏ một số chức năng của Kubernetes controller manager (KCM) và chạy nó như một tiến trình tách biệt. Cụ thể hơn, nó phân nhỏ những controller trong Kubernetes Controller Manager phụ thuộc vào Cloud. Kubernetes Controller Manager sẽ có những controller nhỏ hơn:

- Node controller
- Volume controller
- Route controller
- Service controller

Tại phiên bản 1.9, CCM thực hiện chạy những controller sau từ trong danh sách trên:

- Node controller
- Route controller
- Service controller

{{< note >}}
Volume controller được bỏ ra khỏi Cloud Controller Manager. Do độ phức tạp lớn ảnh hướng và sẽ tốn nhiều thời gian cũng như nhân lực không đáp ứng đủ cho việc tách hẳn tầng logic liên quan tới Volume từ những bên cung cấp dịch vụ, và quyết định cuối cùng là sẽ không triển khai quản lý Volume như một phần của CCM.
{{< /note >}}

Kết hoạch ban đầu của dự án là hỗ trợ Volume sử dụng Cloud Controller Manager để áp dụng những Flex Volume linh hoạt nhằm dễ dàng tích hợp bổ sung thêm. Tuy nhiên, một giải pháp khác cũng đang được lên kế hoạch để thay thế Flex Volume được biết là CSI.

Sau khi xem xét về khía cạnh này, chúng tôi quyết định sẽ có một khoảng thời gian nghỉ trước khi CSI trở nên sẵn sàng cho việc sử dụng.

## Chức năng của Cloud Controller Manager

CCM thừa hưởng những tính năng của nó từ các thành phần trong Kubernetes phụ thuộc vào các Cloud Provider. Phần kế tiếp sẽ giới thiệu những thành phần này.

### 1. Kubernetes Conntroller Manager

Phần lớn các tính năng của CCM bắt nguồn từ Kubernetes controller manager. Như đã đề cập ở phần trước, CCM bao gồm:

- Node controller
- Route controller
- Service controller

#### Node controller

Node controller có vai trò khởi tạo một Node bằng cách thu thập thông tin về những Node đang chạy trong cluster từ các cloud provider.

Node controller sẽ thực hiện những chức năng sau:

1. Khởi tạo một Node với các nhãn region/zone.
2. Khởi tạo một Node với những thông tin được cung cấp từ cloud, ví dụ như loại máy và kích cỡ.
3. Thu thập địa chỉ mạng của Node và hostname.
4. Trong trường hợp một Node không có tín hiệu phản hồi, Node controller sẽ kiểm tra xem Node này có thực sự xóa khỏi hệ thống cloud hay chưa. Nếu Node đó không còn tồn tại trên cloud, controller sẽ xóa Node đó khỏi Kubernetes cluster.

#### Route controller

Route controller đóng vai trò cấu hình định tuyến trong nằm trong hệ thống cloud để các container trên các Node khác nhau trong Kubernetes cluster có thể giao tiếp với nhau. Route controller hiện chỉ đáp ứng được cho các Google Compute Engine cluster.

#### Service controller

Service controller lắng nghe các sự kiện tạo mới, cập nhật và xoá bỏ một service. Dựa trên trạng thái hiện tại của các vụ trên Kubernetes, nó cấu hình các dịch vụ cân bằng tải trên cloud (như ELB của AWS, Google Load Balancer, hay Oracle Cloud Infrastructure LB) nhằm phản ánh trạng thái của các Service trên Kubernetes. Ngoài ra, nó đảm bảo những service backends cho các dịch vụ cần bằng tải trên cloud được cập nhật

### 2. Kubelet

Node controller bao gồm một số tính năng phụ thuộc vào tầng cloud của Kubelet. Trước khi có CCM, Kubelet đảm nhận vai trò khởi tạo một Node với thông tin chi tiết từ cloud như địa chỉ IP, region hay instance type. Với CCM, vai trò này được CCM đảm nhận thay cho Kubelet.

Với mô hình mới này, Kubelet sẽ khởi tạo một Node nhưng không đi kèm với những thông tin từ cloud. Tuy nhiên, nó sẽ thêm vào một dấu {{< glossary_tooltip term_id="taint" text="Taint" >}} để đánh dấu Node sẽ không được lập lịch cho tới khi CCM khởi tạo xong Node này với những thông tin cụ thể cung cấp từ Cloud, sau đó nó sẽ xóa những dấu chờ này.

## Cơ chế Plugin

CCM sử dụng interface trong ngôn ngữ Go cho phép triển khai trên bất kì hệ thống cloud nào cũng có thể plugged in. Cụ thể hơn, nó sử dụng CloudProvider Interface được định nghĩa ở [đây](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

Cách triển khai của bốn controller được nêu ở trên, và một số được thực hiện như giao diện chung cho các bên cung cấp dịch vụ cloud, sẽ ở trong lõi (core) của Kubernetes. Việc triển khai dành riêng cho từng cloud provider sẽ được xây dựng bên ngoài lõi (core) và triển khai các giao diện được xác định bên trong lõi.

Để biết thêm chỉ tiết, xem [Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Phân quyền

Phần này sẽ phân nhỏ quyền truy cập cần có cho các API object cung cấp bởi CCM để thực hiện những hành động của nó.

### Node controller

Node controller chỉ hoạt động với các Node. Nó yêu cầu đầy đủ quyền truy cập bao gồm get, list, create, update, patch, watch, và delete một Node.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Route controller lắng nghe sự kiện tạo ra các Node và cấu hình các Route tương ứng. Nó yêu cầu có quyền truy cập get tới các đối Node.

v1/Node:

- Get

### Service controller

Service controller lắng nghe các sự kiện khởi tạo, cập nhật và xóa bỏ một Service và cấu hình những endpoint phù hợp.

Để truy cập các Service, nó cần quyền list, và watch. Để cập nhật Service, nó sẽ cần patch và update.

Để thiết lập các endpoint cho các Service, nó cần quyền create, list, get, watch, và update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Các vấn đề khác

Việc triển khai lõi của CCM yêu cầu cần có quyền tạo mới sự kiện và đảm bảo quyền thực thi một số hành động, nó cần có quyền tạo các Service Accounts

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

Với RBAC ClusterRole, CCM cần có ClusterRole tối thiểu:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
  - apiGroups:
      - ""
    resources:
      - events
    verbs:
      - create
      - patch
      - update
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - "*"
  - apiGroups:
      - ""
    resources:
      - nodes/status
    verbs:
      - patch
  - apiGroups:
      - ""
    resources:
      - services
    verbs:
      - list
      - patch
      - update
      - watch
  - apiGroups:
      - ""
    resources:
      - serviceaccounts
    verbs:
      - create
  - apiGroups:
      - ""
    resources:
      - persistentvolumes
    verbs:
      - get
      - list
      - update
      - watch
  - apiGroups:
      - ""
    resources:
      - endpoints
    verbs:
      - create
      - get
      - list
      - watch
      - update
```

## Các nhà cung cấp đã triển khai

Sau đây là danh sách các nhà cung cấp dịch vụ cloud đã triển khai CCM:

- [AWS](https://github.com/kubernetes/cloud-provider-aws)
- [Azure](https://github.com/kubernetes/cloud-provider-azure)
- [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
- [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
- [GCP](https://github.com/kubernetes/cloud-provider-gcp)
- [Linode](https://github.com/linode/linode-cloud-controller-manager)
- [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
- [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
- [TencentCloud](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager)

## Quản lý Cluster

Hướng dẫn chi tiết cho việc cấu hình và chạy CCM được cung cấp tại [đây](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).



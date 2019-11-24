---
title: Các khác niệm nền tảng của Cloud Controller Manager
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Khái niệm Cloud Controller Manager (để tránh nhầm lẫn với bản binary build cùng tên) được định nghĩa để cho phép các bên cung cấp dịch vụ cloud và bộ core của Kubernetes được phát triển độc lập. Bộ CCM chạy đồng thời với những thành phần khác thuộc máy chủ của một cụm như Controller Manager của Kubernetes, API server, và scheduler. Nó cũng có thể đóng vai trò như một addon cho Kubernetes.

Cloud Controller Manager này được thiết kế dựa trên cơ chế plugin nhằm cho phép các bên Cloud Provider có thể tích hợp với Kubernetes một cách dễ dàng thông qua các plugin này. Đã có những bản kế hoạch được thiết kế sẵn nhằm mục đích hỗ trợ những cloud provider thay đổi từ mô hình cũ sang mô hình mới đi chung với CCM.

Tài liệu này thảo luận về những khái niệm đằng sau một bộ CCM và đưa ra những chi tiết về chức năng liên quan của nó.

Dưới đây là kiến trúc của một cụm Kubernetes khi không đi cùng với Cloud Controller Manager:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}

{{% capture body %}}

## Thiết kế

Trong sơ đồ trên, Kubernetes và nhà cung cấp dịch vụ cloud được tích hợp thông qua một số thành phần sau:

- Kubelet
- Kubernetes Controller Manager
- Kubernetes API server

Bộ CCM hợp nhất tất cả các logic phụ thuộc trên một nền tàng Cloud từ 3 thành phần trên để tạo thành một điểm tích hợp duy nhất với hệ thống cloud này. Sơ đồ kiến trúc khi đi kèm với bộ CCM sẽ trở thành:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Các thành phần của một bộ CCM

Cloud Controller Manager phân nhỏ một số chức năng của Kubernetes và chạy nó độc lập như một quy trình tách biệt. Cụ thể hơn, nó phân nhỏ những bộ controller trong Kubernetes Controller Manager phụ thuộc vào Cloud. Kubernetes Controller Manager sẽ có những bộ controller nhỏ hơn:

- Node controller
- Volume controller
- Route controller
- Service controller

Tại phiên bản 1.9, bộ CCM thực hiện chạy những bộ controller sau từ trong danh sách trên:

- Node controller
- Route controller
- Service controller

{{< note >}}
Volume controller được bỏ ra khỏi bộ Cloud Controller Manager. Do độ phức tạp lớn ảnh hướng và sẽ tốn nhiều thời gian cũng như nhân lực không đáp ứng đủ cho việc tách hẳn tầng logic liên quan tới Volume từ những bên cung cấp dịch vụ, và quyết định cuối cùng là sẽ không triển khai bộ quản lý Volume như một phần của bộ CCM
{{< /note >}}

Kết hoạch ban đầu của dự án là hỗ trợ Volume sử dụng bộ Cloud Controller Manager để áp dụng những Volume linh hoạt nhằm dễ dàng tích hợp bổ sung thêm. Tuy nhiên, một giải pháp khác cũng đang được lên kế hoạch để thay thế Volume linh hoạt được biết là CSI.

Sau khi xem xét về khía cạnh này, chúng tôi quyết định sẽ có một khoảng thời gian nghỉ trước khi CSI trở nên sẵn sàng cho việc sử dụng.

## Chức năng của bộ Cloud Controller Manager

Bộ CCM thừa hưởng những tính năng của nó từ các thành phần trong Kubernetes phụ thuộc vào các Cloud Provider. Phần kế tiếp sẽ giới thiệu những thành phần này.

### 1. Kubernetes Conntroller Manager

Phần lớn các tính năng của bộ CCM bắt nguồn từ Kubernetes controller manager. Như đã đề cập ở phần trước, bộ CCM bao gồm:

- Node controller
- Route controller
- Service controller

#### Node controller

Node controller có vai trò khởi tạo một Node bằng cách thu thập thông tin về những Node đang chạy trong cụm từ các cloud provider.

Node controller sẽ thực hiện những chức năng sau:

1. Khởi tạo một Node với những nhãn dựa trên phân vùng của cloud.
2. Khởi tạo một Node với những thông tin được cung cấp từ cloud, ví dụ như loại máy và kích cỡ.
3. Thu thập địa chỉ mạng của Node và tên của máy chủ
4. Trong trường hợp một Node không có tín hiệu phản hồi, Node controller sẽ kiểm tra xem Node này có thực sự xóa khỏi hệ thống cloud hay chưa. Nếu Node đó không còn tồn tại trên cloud, bộ controller sẽ xóa đối tượng Node đó khỏi cụm Kubernetes.

#### Route controller

Route controller đóng vai trò cấu hình Route nằm trong hệ thống cloud để các container trên các Node khác nhau trong cụm Kubernetes có thể giao tiếp với nhau. Bộ Route controller hiện chỉ đáp ứng được cho các cụm Google Kubernetes Engine.

#### Service controller

Service controller lắng nghe các sự kiện như một Service được tạo, cập nhật và xóa bỏ. Dựa trên trạng thái hiện tại của các vụ trên Kubernetes, nó cấu hình các bộ tải trọng trên cloud (như ELB của AWS, Google Load Balancer, hay Oracle Cloud Infrastructure LB) nhằm phản ánh trạng thái của các Service trên Kubernetes. Mặt khác, nó đám bảo những dịch vụ phụ trợ cho những dịch vụ cân bằng tải trên cloud được cập nhật mới nhất.

### 2. Kubelet

Node controller bao gồm một số tính nằng phụ thuộc vào tầng cloud của Kubelet. Trước khi có bộ CCM, Kubelet đảm nhận vai trò khởi tạo một Node với thông tin chi tiết từ cloud như địa chỉ IP, phân vùng hay loại máy chủ. Với bộ CCM, vai trò này được bộ CCM đảm nhận thay cho Kubelet.

Với mô hình mới này, Kubelet sẽ khởi tạo một Node nhưng không đi kèm với những thông tin từ cloud. Tuy nhiên, nó sẽ thêm vào một dấu chờ đánh dấu Node sẽ không được sắp xếp công việc (taint) cho tới khi bộ CCM khởi tạo xong Node này với những thông tin cụ thể cung cấp từ Cloud, sau đó nó sẽ xóa những dấu chờ này.

## Cơ chế Plugin

Bộ CCM sử dụng interface trong ngôn ngữ Go để đáp ứng việc triển khai trên bất kì hệ thống cloud nào cũng có thể cắm vào sử dụng. Cụ thể hơn, nó sử dụng CloudProvider Interface được định ở [đây](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

Cách triển khai của bốn thành phần trên được tô đậm ở đường dẫn trên, và một số được thực hiện như giao diện chung cho các bên cung cấp dịch vụ cloud, sẽ nằm trong chính nhân gốc của Kubernetes. Cách thực hiện cụ thể cho từng nhà cung cấp dịch vụ sẽ được xây dựng ngoài nhân gốc và triển khai các giao diện xác định trước trong core.

Để biết thêm chỉ tiết, bạn có thể xem về [Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Phân quyền

Phần này sẽ phân nhỏ quyền hạn cần có cho các API object cung cấp bởi bộ CCM để thực hiện những hành động cần thiết.

### Node controller

Node controller chỉ hoạt động với các đối tượng Node. Nó yêu cầu đầy đủ quyền truy cập bao gồm get, list, create, update, patch, watch, và delete một đối tượng Node.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Route controller lắng nghe sự kiện tạo ra các Node và cấu hình các Route tương ứng. Nó yêu cầu có quyền truy cập get tới các đối tượng Node.

v1/Node:

- Get

### Service controller

Service controller lắng nghe các sự kiện khởi tạo, cập nhật và xóa bỏ một đối tượng Service và cấu hình những điểm kết phù hợp.

Để truy cập các đối tượng Service, nó cần quyền list, và watch. Để cập nhật Service, nó sẽ cần patch và update.

Để thiết lập các điểm kết cho các Service, nó cần quyền create, list, get, watch, và update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Các vấn đề khác

Việc thực hiện nhân gốc của bộ CCM yêu cầu cần có quuyền khởi tạo sự kiện và đảm bảo quyền thực thi một số hành động, nó cần có quyền tạo các Service Accounts

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

Với RBAC dựa trên vai trò, bộ CCM cần có ClusterRole tối thiểu:

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

## Cách triển khai của các nhà cung cấp

Sau đây là danh sách các nhà cung cấp dịch vụ cloud đã triển khai bộ CCM:

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

Hướng dẫn chi tiết cho việc cấu hình và chạy bộ CCM được cung cấp tại [đây](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}

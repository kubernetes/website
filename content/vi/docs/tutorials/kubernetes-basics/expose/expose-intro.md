---
title: Sử dụng Service để công khai ứng dụng
weight: 10
---

## {{% heading "objectives" %}}

* Tìm hiểu về Service trong Kubernetes
* Hiểu mối quan hệ giữa labels và selectors với Service
* Công khai một ứng dụng ra bên ngoài Kubernetes cluster

## Tổng quan về Service trong Kubernetes

[Pods](/docs/concepts/workloads/pods/) trong Kubernetes có tính tạm thời. Pods có một
[vòng đời](/docs/concepts/workloads/pods/pod-lifecycle/) nhất định. Khi một worker node ngừng hoạt động,
các Pod đang chạy trên Node đó cũng bị mất. Một [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
có thể tự động điều chỉnh cluster về trạng thái mong muốn bằng cách tạo
các Pod mới để giữ cho ứng dụng tiếp tục hoạt động. Ví dụ khác, hãy xem xét một backend xử lý container image với 3 bản sao. Những bản sao này có thể thay thế lẫn nhau; hệ thống frontend không cần quan tâm đến các bản sao backend hoặc việc một Pod bị mất và được tạo lại. Tuy nhiên, mỗi Pod trong Kubernetes cluster đều có một địa chỉ IP duy nhất, kể cả các Pod trên cùng một Node, vì vậy cần có cơ chế tự động điều phối các thay đổi giữa các Pod để ứng dụng có thể tiếp tục hoạt động.

{{% alert %}}
_Service trong Kubernetes là một lớp trừu tượng định nghĩa một tập hợp logic các Pod và cho phép công khai lưu lượng truy cập, cân bằng tải và service discovery cho những Pod đó._
{{% /alert %}}

[Service](/docs/concepts/services-networking/service/) trong Kubernetes là một lớp trừu tượng định nghĩa một tập hợp logic các Pod và chính sách truy cập cho chúng. Service cho phép các Pod phụ thuộc nhau có thể kết nối lỏng lẻo. Service được định nghĩa bằng YAML hoặc JSON, giống như tất cả các manifest đối tượng Kubernetes khác. Tập hợp các Pod mà Service nhắm đến thường được xác định bằng một _label selector_ (xem phần dưới để hiểu tại sao đôi khi bạn có thể muốn một Service mà không cần `selector` trong đặc tả).

Mặc dù mỗi Pod có một địa chỉ IP duy nhất, những IP này không được công khai ra bên ngoài cluster nếu không có Service. Service cho phép ứng dụng của bạn nhận lưu lượng truy cập từ bên ngoài. Service có thể được công khai theo nhiều cách khác nhau bằng cách chỉ định `type` trong phần `spec` của Service:

* _ClusterIP_ (mặc định) - Công khai Service trên một IP nội bộ trong cluster. Kiểu này chỉ cho phép Service có thể truy cập được từ bên trong cluster.

* _NodePort_ - Công khai Service trên cùng một port của mỗi Node được chọn trong cluster sử dụng NAT. Cho phép Service có thể truy cập được từ bên ngoài cluster thông qua `<NodeIP>:<NodePort>`. Là tập mở rộng của ClusterIP.

* _LoadBalancer_ - Tạo một bộ cân bằng tải bên ngoài trong cloud hiện tại (nếu được hỗ trợ) và gán một IP cố định bên ngoài cho Service. Là tập mở rộng của NodePort.

* _ExternalName_ - Ánh xạ Service với nội dung của trường `externalName` (ví dụ: `foo.bar.example.com`), bằng cách trả về một bản ghi `CNAME` với giá trị tương ứng. Không thiết lập bất kỳ proxy nào. Kiểu này yêu cầu phiên bản v1.7 trở lên của `kube-dns` hoặc CoreDNS phiên bản 0.0.8 trở lên.

Thông tin chi tiết hơn về các kiểu Service khác nhau có thể được tìm thấy trong hướng dẫn [Sử dụng Source IP](/docs/tutorials/services/source-ip/). Đồng thời xem thêm [Kết nối ứng dụng với Services](/docs/tutorials/services/connect-applications-service/).

Ngoài ra, lưu ý rằng có một số trường hợp sử dụng Service mà không cần định nghĩa `selector` trong đặc tả. Service được tạo không có `selector` sẽ không tạo đối tượng Endpoints tương ứng. Điều này cho phép người dùng tự ánh xạ Service đến các endpoints cụ thể. Một trường hợp khác là khi bạn chỉ sử dụng `type: ExternalName`.

## Service và Labels

Service định tuyến lưu lượng qua một tập hợp các Pod. Service là lớp trừu tượng cho phép các Pod có thể được tạo và xóa trong Kubernetes mà không ảnh hưởng đến ứng dụng. Việc service discovery và định tuyến giữa các Pod phụ thuộc nhau (như các thành phần frontend và backend trong một ứng dụng) được xử lý bởi Kubernetes Services.

Service khớp với một tập hợp các Pod sử dụng [labels và selectors](/docs/concepts/overview/working-with-objects/labels), một cơ chế nhóm cho phép thao tác logic trên các đối tượng trong Kubernetes. Labels là các cặp key/value được gắn vào đối tượng và có thể được sử dụng theo nhiều cách:

* Chỉ định đối tượng cho môi trường development, test và production
* Gắn thẻ phiên bản
* Phân loại đối tượng bằng tags

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Labels có thể được gắn vào đối tượng khi tạo hoặc sau đó và có thể được sửa đổi bất cứ lúc nào. Bây giờ hãy công khai ứng dụng của chúng ta bằng Service và áp dụng một số labels.

### Bước 1: Tạo một Service mới

Đầu tiên, hãy kiểm tra xem ứng dụng của chúng ta có đang chạy không. Chúng ta sẽ sử dụng lệnh `kubectl get` để xem các Pod hiện có:

```shell
kubectl get pods
```

Nếu không có Pod nào đang chạy, điều đó có nghĩa là các đối tượng từ bài hướng dẫn trước đã được dọn dẹp. Trong trường hợp này, hãy quay lại và tạo lại deployment từ bài hướng dẫn [Sử dụng kubectl để tạo Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app). Vui lòng đợi vài giây và liệt kê lại các Pod. Bạn có thể tiếp tục khi thấy một Pod đang chạy.

Tiếp theo, hãy liệt kê các Service hiện có trong cluster:

```shell
kubectl get services
```

Bây giờ chúng ta có một Service đang chạy tên là kubernetes-bootcamp. Service này đã nhận được một cluster-IP duy nhất, một port nội bộ và một external-IP (IP của Node).

Để tìm hiểu port nào được mở ra bên ngoài (cho Service kiểu `NodePort`), chúng ta sẽ chạy lệnh con `describe service`:

```shell
kubectl describe services/kubernetes-bootcamp
```

Tạo một biến môi trường `NODE_PORT` với giá trị là Node port được gán:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Bây giờ chúng ta có thể kiểm tra xem ứng dụng đã được công khai ra ngoài cluster chưa bằng cách sử dụng `curl`, địa chỉ IP của Node và port được công khai ra bên ngoài:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

{{< note >}}
Nếu bạn đang chạy minikube với Docker Desktop làm container driver, bạn cần một minikube tunnel. Điều này là do các container trong Docker Desktop bị cô lập với máy host của bạn.

Trong một cửa sổ terminal riêng biệt, thực thi:

```shell
minikube service kubernetes-bootcamp --url
```

Kết quả sẽ như sau:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Sau đó sử dụng URL được cung cấp để truy cập ứng dụng:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

Và chúng ta nhận được phản hồi từ server. Service đã được công khai.

### Bước 2: Sử dụng labels

Deployment đã tự động tạo một label cho Pod của chúng ta. Với lệnh con `describe deployment`, bạn có thể thấy tên (khóa) của label đó:

```shell
kubectl describe deployment
```

Hãy sử dụng label này để truy vấn danh sách Pod của chúng ta. Chúng ta sẽ sử dụng lệnh `kubectl get pods` với tham số `-l`, theo sau là giá trị của label:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

Bạn có thể làm tương tự để liệt kê các Service hiện có:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Lấy tên của Pod và lưu vào biến môi trường POD_NAME:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

Để áp dụng một label mới, chúng ta sử dụng lệnh con label theo sau bởi loại đối tượng, tên đối tượng và label mới:

```shell
kubectl label pods "$POD_NAME" version=v1
```

Điều này sẽ áp dụng một label mới cho Pod của chúng ta (chúng ta đã gắn phiên bản ứng dụng vào Pod), và chúng ta có thể kiểm tra nó bằng lệnh `describe pod`:

```shell
kubectl describe pods "$POD_NAME"
```

Chúng ta thấy rằng label đã được gắn vào Pod của chúng ta. Và bây giờ chúng ta có thể truy vấn danh sách pod sử dụng label mới:

```shell
kubectl get pods -l version=v1
```

Và chúng ta thấy Pod đó.

### Bước 3: Xóa một service

Để xóa Service, bạn có thể sử dụng lệnh con `delete service`. Labels cũng có thể được sử dụng ở đây:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Xác nhận rằng Service đã bị xóa:

```shell
kubectl get services
```

Điều này xác nhận rằng Service của chúng ta đã được gỡ bỏ. Để xác nhận rằng route không còn được công khai nữa, bạn có thể thử `curl` tới IP và port đã được công khai trước đó:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Điều này chứng minh rằng ứng dụng không còn có thể truy cập được từ bên ngoài cluster nữa.
Bạn có thể xác nhận rằng ứng dụng vẫn đang chạy bằng cách `curl` từ bên trong pod:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Chúng ta thấy rằng ứng dụng vẫn đang hoạt động. Điều này là do Deployment đang quản lý ứng dụng. Để tắt ứng dụng, bạn cần xóa cả Deployment.

## {{% heading "whatsnext" %}}

* Hướng dẫn [Chạy nhiều instance của ứng dụng](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* Tìm hiểu thêm về [Service](/docs/concepts/services-networking/service/).

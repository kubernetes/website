---
title: Chạy nhiều instance của ứng dụng
weight: 10
---

## {{% heading "objectives" %}}

* Mở rộng quy mô một ứng dụng hiện có bằng cách thủ công sử dụng kubectl.

## Mở rộng quy mô ứng dụng

{{% alert %}}
_Bạn có thể tạo một Deployment với nhiều instance ngay từ đầu bằng cách sử dụng tham số --replicas
cho lệnh kubectl create deployment._
{{% /alert %}}

Trước đó chúng ta đã tạo một [Deployment](/docs/concepts/workloads/controllers/deployment/),
và sau đó công khai nó thông qua một [Service](/docs/concepts/services-networking/service/).
Deployment đã tạo chỉ một Pod để chạy ứng dụng của chúng ta. Khi lưu lượng truy cập tăng lên,
chúng ta sẽ cần mở rộng quy mô ứng dụng để đáp ứng nhu cầu của người dùng.

Nếu bạn chưa thực hiện các phần trước đó, hãy bắt đầu từ
[Sử dụng minikube để tạo một cluster](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Mở rộng quy mô_ được thực hiện bằng cách thay đổi số lượng bản sao (replicas) trong một Deployment.

{{< note >}}
Nếu bạn đang thực hiện phần này sau
[phần trước](/docs/tutorials/kubernetes-basics/expose/expose-intro/), thì có thể
bạn đã xóa service đã tạo, hoặc đã tạo một Service có `type: NodePort`.
Trong phần này, chúng ta giả định rằng một service với `type: LoadBalancer` đã được tạo
cho Deployment kubernetes-bootcamp.

Nếu bạn _chưa_ xóa Service được tạo trong
[phần trước](/docs/tutorials/kubernetes-basics/expose/expose-intro),
trước tiên hãy xóa Service đó và sau đó chạy lệnh sau để tạo một Service mới
với `type` được đặt thành `LoadBalancer`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /note >}}

## Tổng quan về mở rộng quy mô

<!-- animation -->
<div class="col-md-8">
  <div id="myCarousel" class="carousel" data-ride="carousel" data-interval="3000">
    <div class="carousel-inner" role="listbox">
      <div class="item carousel-item active">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg">
      </div>
    </div>
  </div>
</div>

{{% alert %}}
_Mở rộng quy mô được thực hiện bằng cách thay đổi số lượng bản sao trong một Deployment._
{{% /alert %}}

Mở rộng quy mô một Deployment sẽ đảm bảo các Pod mới được tạo và lên lịch cho các Node
có tài nguyên khả dụng. Việc mở rộng sẽ tăng số lượng Pod lên trạng thái mong muốn mới.
Kubernetes cũng hỗ trợ [tự động mở rộng quy mô](/docs/tasks/run-application/horizontal-pod-autoscale/)
của Pod, nhưng điều này nằm ngoài phạm vi của hướng dẫn này. Việc thu nhỏ quy mô xuống 0 cũng
là có thể, và điều này sẽ kết thúc tất cả các Pod của Deployment được chỉ định.

Việc chạy nhiều instance của một ứng dụng sẽ cần một cách để phân phối
lưu lượng truy cập đến tất cả chúng. Service có một bộ cân bằng tải tích hợp sẽ phân phối
lưu lượng mạng đến tất cả các Pod của một Deployment được công khai. Service sẽ liên tục giám sát
các Pod đang chạy thông qua endpoints, để đảm bảo lưu lượng chỉ được gửi đến các Pod khả dụng.

Khi bạn có nhiều instance của một ứng dụng đang chạy, bạn có thể
thực hiện cập nhật liên tục mà không có thời gian chết. Chúng ta sẽ tìm hiểu về điều này trong phần tiếp theo của
hướng dẫn. Bây giờ, hãy chuyển đến terminal và mở rộng quy mô ứng dụng của chúng ta.

### Mở rộng quy mô một Deployment

Để liệt kê các Deployment của bạn, sử dụng lệnh con `get deployments`:

```shell
kubectl get deployments
```

Kết quả đầu ra sẽ tương tự như:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

Chúng ta nên có 1 Pod. Nếu không, hãy chạy lại lệnh. Kết quả này cho thấy:

* _NAME_ liệt kê tên của các Deployment trong cluster.
* _READY_ hiển thị tỷ lệ HIỆN TẠI/MONG MUỐN của các bản sao
* _UP-TO-DATE_ hiển thị số lượng bản sao đã được cập nhật để đạt trạng thái mong muốn.
* _AVAILABLE_ hiển thị số lượng bản sao của ứng dụng đang khả dụng cho người dùng.
* _AGE_ hiển thị thời gian ứng dụng đã chạy.

Để xem ReplicaSet được tạo bởi Deployment, hãy chạy:

```shell
kubectl get rs
```

Lưu ý rằng tên của ReplicaSet luôn được định dạng theo mẫu
<nobr>[TÊN-DEPLOYMENT]-[CHUỖI-NGẪU-NHIÊN]</nobr>.
Chuỗi ngẫu nhiên được tạo ra và sử dụng pod-template-hash làm seed.

Hai cột quan trọng của kết quả đầu ra này là:

* _DESIRED_ hiển thị số lượng bản sao mong muốn của ứng dụng, được
xác định khi bạn tạo Deployment. Đây là trạng thái mong muốn.
* _CURRENT_ hiển thị số lượng bản sao đang chạy hiện tại.

Tiếp theo, hãy mở rộng quy mô Deployment lên 4 bản sao. Chúng ta sẽ sử dụng lệnh `kubectl scale`,
theo sau là loại Deployment, tên và số lượng instance mong muốn:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Để liệt kê lại các Deployment, sử dụng `get deployments`:

```shell
kubectl get deployments
```

Thay đổi đã được áp dụng, và chúng ta có 4 instance của ứng dụng khả dụng. Tiếp theo,
hãy kiểm tra xem số lượng Pod đã thay đổi chưa:

```shell
kubectl get pods -o wide
```

Bây giờ có 4 Pod, mỗi Pod có một địa chỉ IP khác nhau. Thay đổi đã được ghi lại trong
nhật ký sự kiện của Deployment. Để kiểm tra điều đó, sử dụng lệnh con `describe`:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Bạn cũng có thể thấy trong kết quả của lệnh này rằng hiện có 4 bản sao.

### Cân bằng tải

Hãy kiểm tra xem Service có đang cân bằng tải lưu lượng không. Để tìm IP và Port được công khai,
chúng ta có thể sử dụng `describe service` như đã học trong phần trước:

```shell
kubectl describe services/kubernetes-bootcamp
```

Tạo một biến môi trường NODE_PORT với giá trị là Node port:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Tiếp theo, chúng ta sẽ thực hiện `curl` đến địa chỉ IP và port được công khai. Thực thi lệnh nhiều lần:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Mỗi yêu cầu sẽ được chuyển đến một Pod khác nhau. Điều này chứng minh rằng cân bằng tải đang hoạt động.

Kết quả đầu ra sẽ tương tự như:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
Nếu bạn đang chạy minikube với Docker Desktop làm container driver, bạn cần một minikube tunnel.
Điều này là do các container trong Docker Desktop bị cô lập với máy host của bạn.

Trong một cửa sổ terminal riêng biệt, thực thi:

```shell
minikube service kubernetes-bootcamp --url
```

Kết quả đầu ra sẽ như sau:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Sau đó sử dụng URL được cung cấp để truy cập ứng dụng:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

### Thu nhỏ quy mô

Để thu nhỏ quy mô Deployment xuống 2 bản sao, chạy lại lệnh con `scale`:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Liệt kê các Deployment để kiểm tra xem thay đổi đã được áp dụng chưa bằng lệnh con `get deployments`:

```shell
kubectl get deployments
```

Số lượng bản sao đã giảm xuống 2. Liệt kê số lượng Pod bằng `get pods`:

```shell
kubectl get pods -o wide
```

Điều này xác nhận rằng 2 Pod đã bị kết thúc.

## {{% heading "whatsnext" %}}

* Hướng dẫn
[Thực hiện Rolling Update](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Tìm hiểu thêm về [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Tìm hiểu thêm về [Tự động mở rộng quy mô](/docs/concepts/workloads/autoscaling/).

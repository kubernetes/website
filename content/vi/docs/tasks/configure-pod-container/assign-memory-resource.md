---
title: Cấp phát tài nguyên bộ nhớ cho Containers và Pods
content_type: task
weight: 10
---

<!-- overview -->

Trang này hướng dẫn cách cấp phát bộ nhớ _request_ (tối thiểu) và bộ nhớ _limit_ (tối đa) cho một Container. Một Container được đảm bảo có đủ bộ nhớ như nó yêu cầu, nhưng không được phép sử dụng nhiều bộ nhớ hơn giới hạn của nó.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Mỗi Node trong Cluster của bạn phải có ít nhất 300 MiB bộ nhớ.

Một số bước trong trang này yêu cầu bạn chạy dịch vụ [metrics-server](https://github.com/kubernetes-sigs/metrics-server) trong Cluster. Nếu bạn đã có metrics-server đang chạy, bạn có thể bỏ qua các bước này.

Nếu bạn đang chạy Minikube, hãy chạy lệnh sau để bật metrics-server:

```shell
minikube addons enable metrics-server
```

Để kiểm tra xem metrics-server có đang chạy hay không, hoặc hệ thống giám sát tài nguyên khác (`metrics.k8s.io`), hãy chạy lệnh sau:

```shell
kubectl get apiservices
```

Nếu hệ thống giám sát tài nguyên có sẵn, kết quả sẽ chứa `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```



<!-- steps -->

## Tạo namespace

Tạo một namespace để các tài nguyên mà bạn tạo trong bài này được tách biệt khỏi phần còn lại của cluster.

```shell
kubectl create namespace mem-example
```

## Cài đặt bộ nhớ tối thiểu và bộ nhớ tối đa

Để cài đặt bộ nhớ tối thiểu cho một Container, bạn cần thêm trường `resources:requests` vào phần khai báo trong tệp cấu hình Container. Với bộ nhớ tối đa, bạn hãy thêm `resources:limits`.

Trong phần thực hành này, bạn sẽ tạo một Pod có một Container. Container này có bộ nhớ tối thiểu là 100 MiB và bộ nhớ tối đa là 200 MiB. Đây là file cấu hình cho Pod:

{{% code_sample file="pods/resource/memory-request-limit.yaml" %}}

Phần `args` trong tệp cấu hình cung cấp các tham số cho Container khi nó khởi tạo.
Các tham số `"--vm-bytes", "150M"` yêu cầu Container cấp phát 150 MiB bộ nhớ.

Tạo Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Kiểm tra Pod đang chạy:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Xem thông tin chi tiết về Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

Kết quả cho thấy Container trong Pod có bộ nhớ tối thiểu là 100 MiB
và bộ nhớ tối đa là 200 MiB.

```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

Chạy lệnh `kubectl top` để xem các thông số của Pod:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

Kết quả cho thấy Pod đang sử dụng khoảng 162,900,000 bytes bộ nhớ,
tương đương khoảng 150MiB. Mức này cao hơn 100MiB tối thiểu nhưng vẫn nằm trong giới hạn 200MiB.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Xóa Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Vượt quá bộ nhớ tối đa của Container

Một Container có thể sử dụng nhiều bộ nhớ hơn mức tối thiểu nếu Node còn bộ nhớ trống. Tuy nhiên, Container không được phép sử dụng bộ nhớ hơn mức tối đa của nó. Nếu Container cấp phát nhiều bộ nhớ hơn mức tối đa, Container đó sẽ có khả năng bị dừng hoạt động. Nếu Container tiếp tục sử dụng bộ nhớ vượt quá giới hạn, nó sẽ được dừng hoàn toàn. Nếu Container đó có thể khởi động lại, kubelet sẽ khởi động lại nó, lỗi quá bộ nhớ được xử lý giống như đối với các lỗi runtime khác.

Trong phần thực hành này, bạn sẽ tạo một Pod cố gắng cấp phát bộ nhớ nhiều hơn giới hạn của nó.
Đây là tệp cấu hình cho một Pod có một Container với bộ nhớ tối thiểu là 50 MiB và bộ nhớ tối đa là 100 MiB:

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" %}}

Trong phần `args` của tệp cấu hình, bạn có thể thấy Container sẽ cố gắng cấp phát 250 MiB bộ nhớ, vượt xa giới hạn 100 MiB.

Tạo Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Xem thông tin chi tiết Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Tại thời điểm này, Container có thể đang chạy hoặc đã được dừng hoạt động. Lặp lại lệnh trước đó cho đến khi Container dừng hoạt động:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Xem chi tiết hơn về trạng thái của Container:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

Kết quả cho thấy Container đã dừng hoạt động vì hết bộ nhớ (OOM - Out Of Memory):

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

Container trong phần thực hành này có thể được khởi động lại, vì vậy kubelet sẽ khởi động lại nó. Lặp lại lệnh này vài lần để thấy Container liên tục bị dừng hoạt động và khởi động lại:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Kết quả cho thấy Container bị dừng hoạt động, khởi động lại, bị dừng hoạt động lần nữa, khởi động lại lần nữa, và cứ tiếp tục như vậy:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Xem thông tin chi tiết về lịch sử của Pod:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

Kết quả cho thấy Container liên tục khởi động và thất bại:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Xem thông tin chi tiết về các Node trong Cluster:

```
kubectl describe nodes
```

Kết quả cho thấy việc Container bị dừng hoạt động do tình trạng hết bộ nhớ:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Xóa Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Cài đặt bộ nhớ tối thiểu vượt quá khả năng của Nodes

Bộ nhớ tối thiểu và tối đa được gắn với các Container, nhưng cũng có thể hiểu rằng một Pod có tổng bộ nhớ tối thiểu và tối đa riêng. Bộ nhớ tối thiểu cho Pod là tổng các bộ nhớ tối thiểu của tất cả các Container trong Pod. Tương tự, bộ nhớ tối đa cho Pod là tổng của các bộ nhớ tối đa của tất cả các Container trong Pod.

Khi lập lịch (scheduling) Pod, Kubernetes dựa vào bộ nhớ tối thiểu. Một Pod chỉ được chạy trên Node nếu Node có đủ bộ nhớ trống để đáp ứng bộ nhớ tối thiểu của Pod.

Trong phần thực hành này, bạn sẽ tạo một Pod có bộ nhớ tối thiểu lớn đến mức vượt quá khả năng của bất kỳ Node nào trong cluster của bạn. Đây là tệp cấu hình cho một Pod có một Container với 1000 GiB bộ nhớ tối thiểu, có khả năng vượt quá khả năng của bất kỳ Node nào trong cluster của bạn.

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" %}}

Khởi tạo Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Xem trạng thái của Pod:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

Kết quả cho thấy trạng thái của Pod là PENDING. Nghĩa là, Pod không được lập lịch để chạy trên bất kỳ Node nào, và nó sẽ tiếp tục ở trạng thái PENDING vô thời hạn:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Xem thông tin chi tiết về Pod, bao gồm cả sự kiện:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

Kết quả cho thấy Container không thể được lập lịch do không đủ bộ nhớ trên các Nodes:

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Đơn vị đo bộ nhớ

Tài nguyên bộ nhớ được đo bằng byte. Bạn có thể biểu thị bộ nhớ dưới dạng số nguyên thông thường hoặc số thập phân cố định với một trong các hậu tố sau: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
Ví dụ, các giá trị sau đây biểu thị xấp xỉ cùng một giá trị:

```
128974848, 129e6, 129M, 123Mi
```

Xoá Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Nếu bạn không cài đặt bộ nhớ tối đa

Nếu bạn không cài đặt bộ nhớ tối đa cho một Container, một trong các tình huống sau sẽ xảy ra:

- Container không có giới hạn tối đa về lượng bộ nhớ mà nó sử dụng. Container có thể sử dụng tất cả bộ nhớ có sẵn trên Node nơi nó đang chạy, điều này có thể kích hoạt OOM Killer. Hơn nữa, trong trường hợp OOM Kill, một container không có giới hạn tài nguyên sẽ có khả năng bị dừng hoạt động cao hơn.

* Container đang chạy trong một namespace có bộ nhớ tối đa mặc định, và Container tự động được gán giới hạn mặc định đó. Cluster administrators có thể sử dụng [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core) để chỉ định giá trị mặc định cho bộ nhớ tối đa.

## Lý do cần có bộ nhớ tối thiểu và bộ nhớ tối đa

Bằng cách cấu hình bộ nhớ tối thiểu và tối đa cho các Container chạy trong cluster của bạn, bạn có thể sử dụng hiệu quả tài nguyên bộ nhớ có sẵn trên các Node của cluster. Với việc giữ bộ nhớ tối thiểu của Pod ở mức thấp, Pod dễ được triển khai hơn. Bằng cách có bộ nhớ tối đa lớn hơn bộ nhớ tối thiểu, bạn đạt được hai điều:

- Pod có thể có các đợt hoạt động cao điểm sử dụng bộ nhớ đang có sẵn.
- Lượng bộ nhớ mà Pod có thể sử dụng trong đợt cao điểm được giới hạn ở một mức hợp lý.

## Xóa các thành phần đã tạo

Xóa namespace của bạn. Thao tác này sẽ xóa tất cả các Pod bạn đã tạo cho phần này:

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}

### Dành cho nhà phát triển ứng dụng

- [Cấp phát tài nguyên CPU cho Containers và Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

- [Cấp phát tài nguyên CPU và bộ nhớ ở cấp độ Pod](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

- [Cấu hình chất lượng dịch vụ (QoS) cho Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Dành cho quản trị viên cluster

- [Thiết lập bộ nhớ mặc định tối thiểu và tối đa cho một Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

- [Thiết lập CPU mặc định tối thiểu và tối đa cho một Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

- [Thiết lập giới hạn bộ nhớ tối thiểu và tối đa cho Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

- [Thiết lập giới hạn CPU tối thiểu và tối đa cho Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

- [Thiết lập giới hạn tài nguyên CPU và bộ nhớ cho Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

- [Thiết lập giới hạn số lượng Pod trong Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

- [Thiết lập giới hạn cho các đối tượng API](/docs/tasks/administer-cluster/quota-api-object/)

- [Thay đổi kích thước CPU và bộ nhớ được cấp cho Containers](/docs/tasks/configure-pod-container/resize-container-resources/)

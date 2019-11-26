---
reviewers:
- huynguyennovem
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.1" state="beta" >}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}

## Thuật ngữ

Để cho rõ ràng, hướng dẫn này định nghĩa những thuật ngữ sau:

Node
: Một node worker trong Kubernetes, một phần của cluster.

Cluster
: Một tập hợp các Node chạy những ứng dụng được đóng gói (containerized applications) được quản lý bởi Kubernetes. Trong ví dụ này và trong hầu hết các deployment phổ biến của Kubernetes, các node trong cluster không là một phần của Internet.

Edge router
: Một router thực thi firewall policy cho cluster. Đây có thể là một gateway được quản lý bởi một cloud provider hoặc một phần cứng vật lý.

Cluster network
: Một tập các links, logic hoặc vật lý, giúp giao tiếp dễ dàng trong một cluster theo [mô hình mạng](/docs/concepts/cluster-administration/networking/) Kubernetes. 

Service
: Một Kubernetes {{< glossary_tooltip term_id="service" >}} xác định một tập các Pods sử dụng {{< glossary_tooltip text="label" term_id="label" >}} selectors. Trừ khi được đề cập theo một cách khác, Services được coi như là có các virtual IPs mà chỉ có thể định tuyến trong cluster network.

## Ingress là gì?

Ingress exposes các HTTP và HTTPS routes từ bên ngoài cluster vào
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} bên trong cluster.
Việc định tuyến các traffic được kiểm soát bởi các rule được xác định trong Ingress resource.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

Một Ingress có thể được cấu hình để cung cấp cho các Service các URL có thể truy cập từ bên ngoài, lưu lượng cân bằng tải, terminate SSL / TLS, và cung cấp dịch vụ lưu trữ ảo dựa theo tên (name based virtual hosting). Một [Ingress controller](/docs/concepts/services-networking/ingress-controllers) chịu trách nhiệm hoàn thành Ingress, thường là với một bộ cân bằng tải, mặc dù nó cũng có thể cấu hình edge router hoặc các frontends bổ sung để giúp xử lý lưu lượng.

Một Ingress không expose các ports hoặc các giao thức một cách tùy ý. Việc expose các service khác với HTTP và HTTPS tới internet thường
sử dụng loại service: [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) hoặc
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Các điều kiện

Bạn phải có một [ingress controller](/docs/concepts/services-networking/ingress-controllers) để đáp ứng một Ingress. Việc chỉ tạo một Ingress resource sẽ không có hiệu quả.

Bạn có thể cần triển khai một Ingress controller như [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). Bạn có thể chọn từ một số
[Ingress controllers](/docs/concepts/services-networking/ingress-controllers).

Lý tưởng nhất, tất cả các Ingress controllers nên phù hợp với các specs tham chiếu. Trong thực tế, các Ingress
controllers khác nhau sẽ hoạt động khác nhau đôi chút.

{{< note >}}
Hãy chắc chắn rằng bạn xem lại tài liệu về Ingress controller của bạn để hiểu được sự thận trọng khi chọn nó.
{{< /note >}}

## Ingress Resource

Một ví dụ Ingress resource đơn giản:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

 Cũng như các resources khác của Kubernetes, một Ingress cần các trường `apiVersion`, `kind`, và `metadata`.
 Để biết thêm về cách làm việc với các file cấu hình, xem [triển khai ứng dụng](/docs/tasks/run-application/run-stateless-application-deployment/), [cấu hình containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [quản lý resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress thường xuyên sử dụng các annotation để cấu hình một số tùy chọn phụ thuộc vào Ingress controller, một ví dụ
 là [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 Các [Ingress controller](/docs/concepts/services-networking/ingress-controllers) khác nhau hỗ trợ các annotation khác nhau. Xem lại tài liệu cho
 sự lựa chọn Ingress controller của bạn để biết annotations nào được hỗ trợ.

Ingress [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
có tất cả thông tin cần thiết để cấu hình một bộ cân bằng tải (load balancer) hoặc proxy server. Quan trọng nhất, nó
chứa một danh sách các rules phù hợp với tất cả các incoming requests. Ingress resource chỉ hỗ trợ các rule
cho việc điều hướng HTTP traffic.

### Ingress rules

Mỗi một HTTP rule chứa những thông tin sau:

* Một host tùy chọn. Trong ví dụ này, không có host nào được chỉ định, vì vậy rule áp dụng cho tất cả các
  HTTP traffic gửi đến thông qua địa chỉ IP được chỉ định. Nếu một host được cung cấp (ví dụ,
  foo.bar.com), các rules chỉ áp dụng cho host đó.
* Một danh sách các path (ví dụ, `/testpath`), mỗi trong số đó có một backend được xác định với `serviceName`
  và `servicePort`. Cả host và path phải khớp với nội dung của một incoming request trước khi
  bộ cân bằng tải điều hướng lưu lượng (traffic) đến Service được tham chiếu.
* Một backend là sự kết hợp giữa Service và port names như được mô tả trong
  [Service doc](/docs/concepts/services-networking/service/). HTTP (và HTTPS) requests đến
  Ingress khớp với host và path của rule được gửi đến backend đã được liệt kê.

Một backend mặc định thường được cấu hình trong một Ingress controller để phục vụ mọi request không
khớp với một path trong spec.

### Backend mặc định

Một Ingress không có rules sẽ gửi tất cả traffic đến một backend mặc định duy nhất. Backend
mặc định thường là một tùy chọn cấu hình của [Ingress controller](/docs/concepts/services-networking/ingress-controllers) và nó không được chỉ định trong Ingress resources.

Nếu không có host hoặc path nào khớp với HTTP request trong các đối tượng Ingress, lưu lượng (traffic)
được định tuyến đến backend mặc định.

## Các loại Ingress

### Single Service Ingress

Hiện có các khái niệm Kubernetes cho phép bạn expose một single service
(xem [lựa chọn thay thế](#alternatives)). Bạn cũng có thể làm điều này với một Ingress bằng cách chỉ định một
*backend mặc định* không có rule. 

{{< codenew file="service/networking/ingress.yaml" >}}

Nếu bạn tạo một Ingress dùng lệnh `kubectl apply -f` bạn có thể xem trạng thái của Ingress vừa tạo:

```shell
kubectl get ingress test-ingress
```

```
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

`107.178.254.228` là địa chỉ IP được cấp phát bởi Ingress controller cho Ingress này.

{{< note >}}
Ingress controllers và load balancers có thể mất một hoặc hai phút để cấp phát địa chỉ IP.
Cho đến thời điểm đó, bạn thấy địa chỉ IP ở trạng thái `<pending>`.
{{< /note >}}

### Fanout đơn giản

Một cấu hình fanout định tuyến các traffic từ một địa chỉ IP duy nhất đến nhiều hơn một Service,
dựa trên HTTP URI được yêu cầu. Một Ingress cho phép bạn giữ số lượng cân bằng tải ở mức tối thiểu. 
Ví dụ, một thiết lập như:

```none
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

sẽ yêu cầu một Ingress:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

Khi bạn tạo một Ingress với lệnh `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Ingress controller cung cấp bộ cân bằng tải dành riêng cho Ingress,
miễn là tồn tại các Service (`service1`, `service2`).
Khi đã thực hiện xong, bạn có thể thấy địa chỉ của bộ cân bằng tải tại trường Address.

{{< note >}}
Tùy thuộc vào [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
bạn đang sử dụng, bạn có thể cần tạo một default-http-backend
[Service](/docs/concepts/services-networking/service/).
{{< /note >}}

### Name based virtual hosting

Name-based virtual host hỗ trợ định tuyến HTTP traffic đến nhiều hostname tại cùng một địa chỉ IP.

```none
foo.bar.com --|                 |-> foo.bar.com service1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com service2:80
```

Ingress sau đây cho biết bộ cân bằng tải dự phòng để định tuyến requests dựa trên 
[Host header](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

Nếu bạn tạo một Ingress resource mà không có host nào được xác định trong các rules, thì mọi
lưu lượng truy cập web đến địa chỉ IP của Ingress controller có thể được khớp mà không cần một 
name based virtual host.

Ví dụ, Ingress resource dưới đây sẽ định tuyến traffic được yêu cầu cho
`first.bar.com` đến `service1`, `second.foo.com` đến `service2`, và bất kì traffic nào
đến địa chỉ IP mà không có hostname được xác định trong yêu cầu (nghĩa là, không có một request
header) đến `service3`.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS

Bạn có thể bảo mật một Ingress bằng cách chỉ định một {{< glossary_tooltip term_id="secret" >}}
có chứa một TLS private key (khóa bảo mật) và certificate. Hiện tại, Ingress chỉ hỗ trợ một cổng
TLS duy nhất, 443 và giả sử rằng TLS chấm dứt. Nếu phần cấu hình TLS trong Ingress xác định các host
khác nhau, chúng sẽ được ghép trên trên cùng một cổng (port) theo hostname được chỉ định thông qua
tiện ích mở rộng SNI TLS (Ingress controller hỗ trợ SNI). TLS secret phải chứa khóa (key) có tên
`tls.crt` và `tls.key` có chứa certificate và private key để sử dụng cho TLS. Ví dụ:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Tham khảo secret này trong một Ingress làm cho Ingress controller
bảo mật channel từ client đến bộ cân bằng tải dùng TLS. Bạn cần phải đảm bảo
rằng TLS secret mà bạn tạo xuất phát từ một certificate chứa mọt Common Name (CN)
còn được biết đến như là một Fully Qualified Domain Name (FQDN) cho `sslexample.foo.com`.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< note >}}
Có một khoảng cách giữa tính năng TLS được hỗ trợ bởi các Ingress controller khác nhau.
Xem thêm ở tài liệu 
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), hoặc bất kì nền tảng Ingress
controller cụ thể nào khác để hiểu được cách TLS hoạt động trong môi trường của bạn.
{{< /note >}}

### Cân bằng tải

Một Ingress controller được khởi động với một số chính sách thiết lập (policy settings) cân bằng tải
mà nó áp dụng cho tất cả các Ingress, chẳng hạn như thuật toán cân bằng tải, backend
weight scheme và các cài đặt khác. Các khái niệm cân bằng tải nâng cao hơn
(ví dụ: persistent sessions, dynamic weights) chưa được expose qua Ingress. Thay vào đó,
bạn có thể nhận các tính năng này thông qua bộ cân bằng tải được dùng cho một Service.

Cũng đáng lưu ý rằng, mặc dù việc kiểm tra sự ổn định của hệ thống không trực tiếp qua
Ingress, vẫn tồn tại một số khái niệm trong Kubernetes như [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
sẵn sàng cho phép bạn đạt được cùng một kết quả cuối cùng. Vui lòng xem lại tài liệu của controller ([nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)) để xem cách chúng kiểm tra sự ổn định
của hệ thống (health check).

## Cập nhật một Ingress

Để cập nhật một Ingress hiện có để thêm một host mới, bạn có thể cập nhật nó bằng cách chỉnh sửa resource:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Một trình soạn thảo sẽ được pop-up với cấu hình hiện có ở định dạng YAML.
Chỉnh sửa nó để thêm vào một Host mới:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
        path: /foo
..
```

Sau khi bạn lưu các thay đổi của mình, kubectl cập nhật resource trong máy chủ API, Ingress controller cấu hình lại bộ cân bằng tải.

Kiểm chứng lại:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Bạn có thể đạt được một kết quả tương tự bằng lệnh `kubectl replace -f` trên tệp YAML đã sửa đổi.

## Failing across availability zones

Kỹ thuật phân tán lưu lượng trên các miền lỗi khác nhau giữa các cloud providers.
Vui lòng xem tài liệu [Ingress controller](/docs/concepts/services-networking/ingress-controllers) để biết chi tiết. Bạn cũng có thể tham khảo tài liệu [federation documentation](https://github.com/kubernetes-sigs/federation-v2)
để biết chi tiết về việc triển khai Ingress trong một liên cluster (federated cluster).

## Future Work

Track [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)
for more details on the evolution of Ingress and related resources. You may also track the
[Ingress repository](https://github.com/kubernetes/ingress/tree/master) for more details on the
evolution of various Ingress controllers.

## Alternatives

Bạn có thể expose một Service theo nhiều cách mà không liên quan trực tiếp đến Ingress resource:

* Dùng [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Dùng [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)

{{% /capture %}}

{{% capture whatsnext %}}
* Xem [ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Cài đặt Ingress trên Minikube với NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}

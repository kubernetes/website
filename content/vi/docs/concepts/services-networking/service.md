---
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: Service discovery và cân bằng tải
  description: >
    Không cần sửa đổi ứng dụng của bạn để dùng một cơ chế service discovery xa lạ. Kubernetes cung cấp cho các Pod địa chỉ IP riêng và một tên DNS duy nhất cho một tập Pod, đồng thời có thể cân bằng tải giữa chúng.
description: >-
  Cung cấp một ứng dụng đang chạy trong cluster của bạn qua một endpoint duy nhất hướng ra bên ngoài,
  ngay cả khi workload được chia thành nhiều backend.
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="Trong Kubernetes, Service là" >}}

Một mục tiêu chính của Service trong Kubernetes là bạn không cần sửa đổi ứng dụng hiện có
để dùng một cơ chế service discovery xa lạ.
Bạn có thể chạy code trong các Pod, dù đó là code được thiết kế cho thế giới cloud-native hay
một ứng dụng cũ mà bạn đã container hóa. Bạn dùng Service để cung cấp tập Pod đó
trên mạng, nhờ vậy các client có thể tương tác với nó.

Nếu bạn dùng một {{< glossary_tooltip term_id="deployment" >}} để chạy ứng dụng,
Deployment đó có thể tạo và hủy các Pod một cách linh hoạt. Từ thời điểm này sang thời điểm khác,
bạn không biết có bao nhiêu Pod trong số đó đang hoạt động và khỏe mạnh; thậm chí bạn có thể không biết
tên của các Pod khỏe mạnh đó.
Các {{< glossary_tooltip term_id="pod" text="Pod" >}} trong Kubernetes được tạo và hủy
để khớp với trạng thái mong muốn của cluster. Pod là tài nguyên tạm thời (bạn không nên
kỳ vọng rằng một Pod riêng lẻ là đáng tin cậy và bền vững).

Mỗi Pod có địa chỉ IP riêng (Kubernetes yêu cầu các plugin mạng đảm bảo điều này).
Với một Deployment nhất định trong cluster, tập Pod đang chạy tại một thời điểm
có thể khác với tập Pod chạy ứng dụng đó ngay sau đó.

Điều này dẫn đến một vấn đề: nếu một tập Pod (gọi là "backend") cung cấp
chức năng cho các Pod khác (gọi là "frontend") bên trong cluster,
làm thế nào để các frontend tìm ra và theo dõi được địa chỉ IP cần kết nối tới,
để frontend có thể sử dụng phần backend của workload?

Đó là lúc _Service_ xuất hiện.

<!-- body -->

## Service trong Kubernetes {#services-in-kubernetes}

Service API, một phần của Kubernetes, là một lớp trừu tượng giúp bạn cung cấp các nhóm
Pod qua mạng. Mỗi đối tượng Service định nghĩa một tập logic các endpoint (thường
các endpoint này là Pod) cùng với một chính sách về cách cho phép truy cập các pod đó.

Ví dụ, hãy xem xét một backend xử lý hình ảnh stateless đang chạy với
3 bản sao. Các bản sao đó có thể thay thế cho nhau&mdash;frontend không quan tâm chúng dùng
backend nào. Mặc dù các Pod thực tế tạo nên tập backend có thể thay đổi, các
client frontend không cần biết điều đó, cũng không cần tự theo dõi
tập backend.

Lớp trừu tượng Service cho phép sự tách rời (decoupling) này.

Canary deployment là một trường hợp sử dụng phổ biến của Service. Để tìm hiểu những gì cần làm, hãy làm theo hướng dẫn [Triển khai một bản phát hành bằng Canary Deployment](/docs/tutorials/stateless-application/canary-deployment/).

Tập Pod mà một Service nhắm tới thường được xác định
bởi một {{< glossary_tooltip text="selector" term_id="selector" >}} mà bạn
định nghĩa.
Để tìm hiểu các cách khác để định nghĩa endpoint cho Service,
xem [Service _không có_ selector](#services-without-selectors).

Nếu workload của bạn giao tiếp qua HTTP, bạn có thể chọn dùng một
[Ingress](/docs/concepts/services-networking/ingress/) để kiểm soát cách lưu lượng web
đến được workload đó.
Ingress không phải là một loại Service, nhưng nó đóng vai trò điểm vào cho
cluster của bạn. Ingress cho phép bạn gom các quy tắc định tuyến vào một tài nguyên duy nhất, để
bạn có thể cung cấp nhiều thành phần của workload, chạy riêng biệt trong
cluster, phía sau một listener duy nhất.

API [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) dành cho Kubernetes
cung cấp thêm các khả năng ngoài Ingress và Service. Bạn có thể thêm Gateway vào cluster -
đây là một họ các API mở rộng, được triển khai bằng
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} -
rồi dùng chúng để cấu hình quyền truy cập tới các dịch vụ mạng đang chạy trong cluster.

### Service discovery theo kiểu cloud-native {#cloud-native-service-discovery}

Nếu ứng dụng của bạn có thể dùng Kubernetes API cho service discovery,
bạn có thể truy vấn {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
để lấy các EndpointSlice tương ứng. Kubernetes cập nhật các EndpointSlice của một Service
mỗi khi tập Pod trong Service đó thay đổi.

Với các ứng dụng không phải native, Kubernetes cung cấp các cách để đặt một cổng mạng hoặc bộ cân bằng tải (load
balancer) giữa ứng dụng của bạn và các Pod backend.

Dù bằng cách nào, workload của bạn đều có thể dùng các cơ chế [service discovery](#discovering-services)
này để tìm đích mà nó muốn kết nối tới.

## Định nghĩa một Service {#defining-a-service}

Service là một {{< glossary_tooltip text="đối tượng" term_id="object" >}}
(giống như Pod hay ConfigMap là đối tượng). Bạn có thể tạo,
xem hoặc sửa đổi định nghĩa Service bằng Kubernetes API. Thông thường
bạn dùng một công cụ như `kubectl` để thực hiện các lệnh gọi API đó thay bạn.

Ví dụ, giả sử bạn có một tập Pod, mỗi Pod lắng nghe trên cổng TCP 9376
và được gắn label `app.kubernetes.io/name=MyApp`. Bạn có thể định nghĩa một Service để
công bố listener TCP đó:

{{% code_sample file="service/simple-service.yaml" %}}

Áp dụng manifest này sẽ tạo một Service mới tên là "my-service" với
[loại Service](#publishing-services-service-types) mặc định là ClusterIP. Service này
nhắm tới cổng TCP 9376 trên bất kỳ Pod nào có label `app.kubernetes.io/name: MyApp`.

Kubernetes gán cho Service này một địa chỉ IP (_cluster IP_),
mà cơ chế địa chỉ IP ảo sử dụng. Để biết thêm chi tiết về cơ chế đó,
hãy đọc [IP ảo và Service Proxy](/docs/reference/networking/virtual-ips/).

Controller của Service đó liên tục quét tìm các Pod
khớp với selector của nó, rồi thực hiện mọi cập nhật cần thiết cho tập
EndpointSlice của Service.

Tên của một đối tượng Service phải là một
[tên label RFC 1123](/docs/concepts/overview/working-with-objects/names#rfc-1123-label-names) hợp lệ.


{{< note >}}
Một Service có thể ánh xạ _bất kỳ_ `port` đến nào tới một `targetPort`. Theo mặc định và
để thuận tiện, `targetPort` được đặt cùng giá trị với trường
`port`.
{{< /note >}}

### Định nghĩa cổng {#field-spec-ports}

Định nghĩa cổng trong Pod có tên, và bạn có thể tham chiếu các tên này trong
thuộc tính `targetPort` của một Service. Ví dụ, ta có thể gắn `targetPort`
của Service với cổng của Pod theo cách sau:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc

---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
```

Cách này vẫn hoạt động ngay cả khi Service có một tập Pod hỗn hợp dùng cùng một
tên đã cấu hình, với cùng một giao thức mạng nhưng ở các số cổng
khác nhau. Điều này mang lại nhiều sự linh hoạt khi triển khai và phát triển
các Service của bạn. Ví dụ, bạn có thể thay đổi số cổng mà các Pod cung cấp
trong phiên bản tiếp theo của phần mềm backend mà không làm gián đoạn client.

Giao thức mặc định của Service là
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp); bạn cũng có thể
dùng bất kỳ [giao thức được hỗ trợ](/docs/reference/networking/service-protocols/) nào khác.

Vì nhiều Service cần cung cấp nhiều hơn một cổng, Kubernetes hỗ trợ
[nhiều định nghĩa cổng](#multi-port-services) cho một Service.
Mỗi định nghĩa cổng có thể có cùng `protocol`, hoặc khác nhau.

### Service không có selector {#services-without-selectors}

Service thường trừu tượng hóa việc truy cập tới các Pod Kubernetes nhờ selector,
nhưng khi được dùng cùng một tập đối tượng
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
tương ứng và không có selector, Service có thể trừu tượng hóa các loại backend khác,
kể cả những backend chạy bên ngoài cluster.

Ví dụ:

* Bạn muốn có một cluster cơ sở dữ liệu bên ngoài trong môi trường production, nhưng trong
  môi trường test bạn dùng các cơ sở dữ liệu của riêng mình.
* Bạn muốn trỏ Service của mình tới một Service trong một
  {{< glossary_tooltip term_id="namespace" >}} khác hoặc trên một cluster khác.
* Bạn đang chuyển (migrate) một workload sang Kubernetes. Trong lúc đánh giá cách tiếp cận,
  bạn chỉ chạy một phần backend trong Kubernetes.

Trong bất kỳ trường hợp nào ở trên, bạn đều có thể định nghĩa một Service _mà không_ chỉ định
selector để khớp với Pod. Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

Vì Service này không có selector, các đối tượng EndpointSlice
tương ứng sẽ không được tạo tự động. Bạn có thể ánh xạ Service
tới địa chỉ mạng và cổng nơi nó đang chạy bằng cách thêm thủ công một đối tượng
EndpointSlice. Ví dụ:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # theo quy ước, dùng tên của Service
                     # làm tiền tố cho tên của EndpointSlice
  labels:
    # Bạn nên đặt label "kubernetes.io/service-name".
    # Đặt giá trị của nó khớp với tên của Service
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # nên khớp với tên của cổng Service đã định nghĩa ở trên
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### EndpointSlice tùy chỉnh {#custom-endpointslices}

Khi bạn tạo một đối tượng [EndpointSlice](#endpointslices) cho một Service, bạn có thể
dùng bất kỳ tên nào cho EndpointSlice đó. Mỗi EndpointSlice trong một namespace phải có
tên duy nhất. Bạn liên kết một EndpointSlice với một Service bằng cách đặt
{{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/service-name`
trên EndpointSlice đó.

{{< note >}}
IP của endpoint _không được_ là: loopback (127.0.0.0/8 với IPv4, ::1/128 với IPv6), hoặc
link-local (169.254.0.0/16 và 224.0.0.0/24 với IPv4, fe80::/64 với IPv6).

Địa chỉ IP của endpoint không thể là cluster IP của các Service Kubernetes khác,
vì {{< glossary_tooltip term_id="kube-proxy" >}} không hỗ trợ IP ảo
làm đích đến.
{{< /note >}}

Với một EndpointSlice do chính bạn tạo, hoặc được tạo trong code của bạn,
bạn cũng nên chọn một giá trị cho label
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by).
Nếu bạn tự viết code controller để quản lý EndpointSlice, hãy cân nhắc dùng một
giá trị tương tự như `"my-domain.example/name-of-controller"`. Nếu bạn dùng một công cụ
bên thứ ba, hãy dùng tên của công cụ đó viết thường toàn bộ, và thay khoảng trắng cùng các dấu
câu khác bằng dấu gạch ngang (`-`).
Nếu mọi người trực tiếp dùng một công cụ như `kubectl` để quản lý EndpointSlice,
hãy dùng một tên mô tả việc quản lý thủ công này, chẳng hạn `"staff"` hoặc
`"cluster-admins"`. Bạn nên
tránh dùng giá trị dành riêng `"controller"`, vì giá trị này xác định các EndpointSlice
do chính control plane của Kubernetes quản lý.

#### Truy cập một Service không có selector {#service-no-selector-access}

Việc truy cập một Service không có selector hoạt động giống như khi nó có selector.
Trong [ví dụ](#services-without-selectors) về Service không có selector,
lưu lượng được định tuyến tới một trong hai endpoint được định nghĩa trong
manifest EndpointSlice: một kết nối TCP tới 10.1.2.3 hoặc 10.4.5.6, trên cổng 9376.

{{< note >}}
Kubernetes API server không cho phép proxy tới các endpoint không được ánh xạ tới
pod. Các thao tác như `kubectl port-forward service/<service-name> forwardedPort:servicePort` khi service không có
selector sẽ thất bại do ràng buộc này. Điều này ngăn Kubernetes API server
bị dùng làm proxy tới các endpoint mà bên gọi có thể không có quyền truy cập.
{{< /note >}}

Service `ExternalName` là một trường hợp đặc biệt của Service, không có
selector và dùng tên DNS thay thế. Để biết thêm thông tin, xem
phần [ExternalName](#externalname).

### EndpointSlice {#endpointslices}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSlice](/docs/concepts/services-networking/endpoint-slices/) là các đối tượng
đại diện cho một tập con (một _slice_) của các endpoint mạng đứng sau một Service.

Cluster Kubernetes của bạn theo dõi số lượng endpoint mà mỗi EndpointSlice đại diện.
Nếu một Service có nhiều endpoint đến mức chạm tới một ngưỡng, thì
Kubernetes sẽ thêm một EndpointSlice trống khác và lưu thông tin endpoint mới
vào đó.
Theo mặc định, Kubernetes tạo một EndpointSlice mới khi tất cả các EndpointSlice hiện có
đều chứa ít nhất 100 endpoint. Kubernetes không tạo EndpointSlice mới
cho đến khi cần thêm một endpoint nữa.

Xem [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/) để biết thêm
thông tin về API này.

### Endpoints (không còn được hỗ trợ) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

EndpointSlice API là bước phát triển tiếp theo của API
[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
cũ hơn. Endpoints API không còn được hỗ trợ này có một số vấn đề so với
EndpointSlice:

  - Nó không hỗ trợ cluster dual-stack.
  - Nó không chứa thông tin cần thiết để hỗ trợ các tính năng mới hơn, chẳng hạn như
    [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution).
  - Nó sẽ cắt bớt danh sách endpoint nếu danh sách quá dài để chứa trong một đối tượng duy nhất.

Vì vậy, tất cả client được khuyến nghị dùng
EndpointSlice API thay vì Endpoints.

#### Endpoint vượt quá sức chứa {#over-capacity-endpoints}

Kubernetes giới hạn số lượng endpoint có thể chứa trong một đối tượng Endpoints
duy nhất. Khi một Service có hơn 1000 endpoint phía sau, Kubernetes
cắt bớt dữ liệu trong đối tượng Endpoints. Vì một Service có thể được liên kết
với nhiều hơn một EndpointSlice, giới hạn 1000 endpoint phía sau chỉ
ảnh hưởng đến Endpoints API cũ (legacy).

Trong trường hợp đó, Kubernetes chọn tối đa 1000 endpoint backend khả dĩ để lưu
vào đối tượng Endpoints, và đặt một
{{< glossary_tooltip text="chú thích (annotation)" term_id="annotation" >}} trên Endpoints:
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
Control plane cũng gỡ bỏ chú thích đó nếu số lượng Pod backend giảm xuống dưới 1000.

Lưu lượng vẫn được gửi tới các backend, nhưng mọi cơ chế cân bằng tải dựa vào
Endpoints API cũ chỉ gửi lưu lượng tới tối đa 1000 endpoint trong số các endpoint phía sau hiện có.

Cũng vì giới hạn API đó, bạn không thể cập nhật thủ công một Endpoints để có hơn 1000 endpoint.

### Giao thức ứng dụng {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Trường `appProtocol` cung cấp một cách để chỉ định giao thức ứng dụng cho
từng cổng của Service. Trường này được dùng làm gợi ý để các bản triển khai (implementation) cung cấp
hành vi phong phú hơn cho các giao thức mà chúng hiểu.
Giá trị của trường này được phản ánh sang các đối tượng
Endpoints và EndpointSlice tương ứng.

Trường này tuân theo cú pháp label chuẩn của Kubernetes. Giá trị hợp lệ là một trong các loại sau:

* [Tên dịch vụ chuẩn của IANA](https://www.iana.org/assignments/service-names).

* Tên có tiền tố do bản triển khai định nghĩa, chẳng hạn `mycompany.com/my-custom-protocol`.

* Tên có tiền tố do Kubernetes định nghĩa:

| Giao thức | Mô tả |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 qua kết nối không mã hóa (cleartext) như mô tả trong [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) |
| `kubernetes.io/ws`  | WebSocket qua kết nối không mã hóa như mô tả trong [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
| `kubernetes.io/wss` | WebSocket qua TLS như mô tả trong [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |

### Service nhiều cổng {#multi-port-services}

Với một số Service, bạn cần cung cấp nhiều hơn một cổng.
Kubernetes cho phép bạn cấu hình nhiều định nghĩa cổng trên một đối tượng Service.
Khi dùng nhiều cổng cho một Service, bạn phải đặt tên cho tất cả các cổng
để chúng không bị nhầm lẫn.
Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
Cũng như {{< glossary_tooltip term_id="name" text="tên">}} trong Kubernetes nói chung, tên cổng
chỉ được chứa ký tự chữ và số viết thường và `-`. Tên cổng cũng
phải bắt đầu và kết thúc bằng một ký tự chữ hoặc số.

Ví dụ, các tên `123-abc` và `web` là hợp lệ, nhưng `123_abc` và `-web` thì không.
{{< /note >}}

## Loại Service {#publishing-services-service-types}

Với một số phần của ứng dụng (ví dụ, frontend), bạn có thể muốn cung cấp
Service trên một địa chỉ IP bên ngoài, có thể truy cập được từ bên ngoài
cluster.

Các loại Service trong Kubernetes cho phép bạn chỉ định loại Service mà bạn muốn.

Các giá trị `type` hiện có và hành vi của chúng là:

[`ClusterIP`](#type-clusterip)
: Cung cấp Service trên một IP nội bộ của cluster. Chọn giá trị này
  khiến Service chỉ có thể truy cập được từ bên trong cluster. Đây là
  giá trị mặc định nếu bạn không chỉ định rõ `type` cho Service.
  Bạn có thể cung cấp Service ra internet công cộng bằng một
  [Ingress](/docs/concepts/services-networking/ingress/) hoặc một
  [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Cung cấp Service trên IP của mỗi Node tại một cổng tĩnh (`NodePort`).
  Để node port sẵn sàng, Kubernetes thiết lập một địa chỉ cluster IP,
  giống như khi bạn yêu cầu một Service có `type: ClusterIP`.

[`LoadBalancer`](#loadbalancer)
: Cung cấp Service ra bên ngoài bằng một bộ cân bằng tải bên ngoài. Kubernetes
  không trực tiếp cung cấp thành phần cân bằng tải; bạn phải tự cung cấp, hoặc
  tích hợp cluster Kubernetes của bạn với một nhà cung cấp dịch vụ đám mây (cloud provider).

[`ExternalName`](#externalname)
: Ánh xạ Service tới nội dung của trường `externalName` (ví dụ,
  tới hostname `api.foo.bar.example`). Việc ánh xạ này cấu hình máy chủ DNS của cluster
  trả về một bản ghi `CNAME` với giá trị hostname bên ngoài đó.
  Không có bất kỳ hình thức proxy nào được thiết lập.

Trường `type` trong Service API được thiết kế theo dạng chức năng lồng nhau - mỗi cấp
bổ sung thêm vào cấp trước. Tuy nhiên có một ngoại lệ đối với thiết kế lồng nhau này. Bạn có thể
định nghĩa một Service `LoadBalancer` bằng cách
[tắt việc cấp phát `NodePort` cho bộ cân bằng tải](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation).

### `type: ClusterIP` {#type-clusterip}

Loại Service mặc định này gán một địa chỉ IP từ một nhóm (pool) địa chỉ IP mà
cluster của bạn đã dành riêng cho mục đích đó.

Một số loại Service khác được xây dựng dựa trên loại `ClusterIP` làm
nền tảng.

Nếu bạn định nghĩa một Service có `.spec.clusterIP` được đặt thành `"None"` thì
Kubernetes sẽ không gán địa chỉ IP. Xem [headless Service](#headless-services)
để biết thêm thông tin.

#### Tự chọn địa chỉ IP {#choosing-your-own-ip-address}

Bạn có thể chỉ định địa chỉ cluster IP của riêng mình như một phần của yêu cầu tạo
`Service`. Để làm điều này, hãy đặt trường `.spec.clusterIP`. Ví dụ, khi bạn
đã có sẵn một bản ghi DNS muốn tái sử dụng, hoặc có các hệ thống cũ (legacy)
được cấu hình cho một địa chỉ IP cụ thể và khó cấu hình lại.

Địa chỉ IP bạn chọn phải là một địa chỉ IPv4 hoặc IPv6 hợp lệ nằm trong
dải CIDR `service-cluster-ip-range` được cấu hình cho API server.
Nếu bạn cố tạo một Service với giá trị địa chỉ `clusterIP` không hợp lệ, API
server sẽ trả về mã trạng thái HTTP 422 để báo rằng có vấn đề.

Đọc [tránh xung đột](/docs/reference/networking/virtual-ips/#avoiding-collisions)
để tìm hiểu cách Kubernetes giúp giảm rủi ro và tác động khi hai Service khác nhau
cùng cố dùng một địa chỉ IP.

### `type: NodePort` {#type-nodeport}

Nếu bạn đặt trường `type` thành `NodePort`, control plane của Kubernetes
cấp phát một cổng từ dải được chỉ định bởi cờ `--service-node-port-range` (mặc định: 30000-32767).
Mỗi node proxy cổng đó (cùng một số cổng trên mọi Node) vào Service của bạn.
Service của bạn báo cáo cổng đã được cấp phát trong trường `.spec.ports[*].nodePort`.

Dùng NodePort cho bạn sự tự do trong việc thiết lập giải pháp cân bằng tải của riêng mình,
cấu hình các môi trường mà Kubernetes chưa hỗ trợ đầy đủ, hoặc thậm chí
cung cấp trực tiếp địa chỉ IP của một hay nhiều node.

Với một Service node port, Kubernetes cấp phát thêm một cổng (TCP, UDP hoặc
SCTP, khớp với giao thức của Service). Mọi node trong cluster tự cấu hình
để lắng nghe trên cổng được gán đó và chuyển tiếp lưu lượng tới một trong các endpoint
sẵn sàng (ready) liên kết với Service đó. Bạn có thể kết nối tới Service `type: NodePort`
từ bên ngoài cluster bằng cách kết nối tới bất kỳ node nào với giao thức phù hợp
(ví dụ: TCP) và cổng phù hợp (cổng đã được gán cho Service đó).

#### Tự chọn cổng {#nodeport-custom-port}

Nếu bạn muốn một số cổng cụ thể, bạn có thể chỉ định giá trị trong trường `nodePort`.
Control plane sẽ cấp phát cổng đó cho bạn hoặc báo rằng
giao dịch API đã thất bại.
Điều này có nghĩa là bạn cần tự xử lý các xung đột cổng có thể xảy ra.
Bạn cũng phải dùng một số cổng hợp lệ, nằm trong dải được cấu hình
cho NodePort.

Dưới đây là một manifest mẫu cho Service có `type: NodePort` chỉ định
một giá trị NodePort (trong ví dụ này là 30007):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # Theo mặc định và để thuận tiện, `targetPort` được đặt cùng
      # giá trị với trường `port`.
      targetPort: 80
      # Trường tùy chọn
      # Theo mặc định và để thuận tiện, control plane của Kubernetes
      # sẽ cấp phát một cổng từ một dải (mặc định: 30000-32767)
      nodePort: 30007
```

#### Dành riêng dải NodePort để tránh xung đột {#avoid-nodeport-collisions}

Chính sách gán cổng cho các Service NodePort áp dụng cho cả trường hợp gán tự động và
gán thủ công. Khi người dùng muốn tạo một Service NodePort
dùng một cổng cụ thể, cổng đích có thể xung đột với một cổng khác đã được gán.

Để tránh vấn đề này, dải cổng cho các Service NodePort được chia thành hai băng (band).
Việc gán cổng động mặc định dùng băng trên, và có thể dùng băng dưới khi
băng trên đã hết. Khi đó người dùng có thể cấp phát từ băng dưới với rủi ro xung đột cổng thấp hơn.

Khi dùng dải NodePort mặc định 30000-32767, các băng được phân chia như sau:

- Băng tĩnh: 30000-30085
- Băng động: 30086-32767

Xem [Tránh xung đột khi gán cổng cho Service NodePort](/blog/2023/05/11/nodeport-dynamic-and-static-allocation/)
để biết thêm chi tiết về cách tính các băng tĩnh và động.

#### Cấu hình địa chỉ IP cho Service `type: NodePort` {#service-nodeport-custom-listen-address}

Khi dùng kube-proxy ở [chế độ
`iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables), theo mặc định các Service NodePort
khả dụng trên tất cả IP của node. Khi dùng [chế độ
`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables), theo mặc định chúng chỉ
khả dụng trên IP chính của node (hoặc các IP chính dual-stack).

Bạn có thể thay đổi tập IP của node mà các Service NodePort khả dụng bằng
cờ `--nodeport-addresses` của kube-proxy, hoặc trường `nodePortAddresses` tương đương
trong [file cấu hình kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/).
Cờ này chấp nhận một danh sách các khối IP phân tách bằng dấu phẩy (ví dụ `10.0.0.0/8`, `192.0.2.0/25`) hoặc một
hay nhiều từ khóa sau:

- `primary` - địa chỉ IPv4 và/hoặc IPv6 chính của node, theo đối tượng Node.
  (Đây là giá trị mặc định cho chế độ `nftables`.)
- `localhost` - các địa chỉ loopback của node (`127.0.0.0/8`, `::1/128`).
- `all` - tất cả địa chỉ. (Đây là giá trị mặc định cho chế độ `iptables` và `ipvs`.)

Ví dụ, nếu bạn khởi động kube-proxy với cờ `--nodeport-addresses=192.168.0.0/24`,
thì kube-proxy sẽ cố tìm một địa chỉ IP cục bộ thuộc subnet đó trên mỗi node, và chỉ phục vụ
các Service NodePort qua IP đó.

#### Service `type: NodePort` qua localhost {#localhost-nodeports}

Các cơ chế mà service proxy dùng để triển khai Service NodePort không phải lúc nào cũng
hỗ trợ cung cấp Service NodePort trên localhost. Với kube-proxy:

  - Khi dùng chế độ `iptables`, với giá trị `--nodeport-addresses` có bao gồm
    `127.0.0.1`, các Service NodePort sẽ khả dụng trên `127.0.0.1`. Tuy nhiên, điều này
    yêu cầu bật một sysctl của kernel (`route_localnet`) có thể gây ra tác dụng phụ
    thiếu an toàn trong một số cluster. Có thể tắt NodePort localhost của IPTables bằng cách truyền
    `--iptables-localhost-nodeports false` cho kube-proxy, hoặc bằng cách đặt
    `--nodeport-addresses` thành một dải không bao gồm `127.0.0.1`.

  - Khi dùng chế độ `ipvs`, hoặc chế độ `iptables` trong cluster IPv6 single-stack, Service
    NodePort không khả dụng trên localhost.

{{< feature-state feature_gate_name="KubeProxyNFTablesLocalhostNodePorts" >}}

  - Khi dùng chế độ `nftables`, Service NodePort sẽ khả dụng trên localhost khi
    feature gate `KubeProxyNFTablesLocalhostNodePorts` được bật, và
    `--nodeport-addresses` được đặt thành một giá trị có bao gồm rõ ràng `localhost`.
    (Chỉ đặt thành `all` sẽ _không_ bật Service NodePort trên localhost.) Điều này
    được triển khai bằng cách chuyển hướng các kết nối NodePort localhost qua một proxy userspace,
    nên không hiệu quả bằng việc proxy service thông thường.

Các plugin mạng bên thứ ba có bản triển khai service proxy riêng có thể hỗ trợ hoặc
không hỗ trợ NodePort trên localhost; hãy tham khảo tài liệu của các plugin đó.

### `type: LoadBalancer` {#loadbalancer}

Trên các nhà cung cấp dịch vụ đám mây hỗ trợ bộ cân bằng tải bên ngoài, việc đặt trường `type`
thành `LoadBalancer` sẽ cấp phát một bộ cân bằng tải cho Service của bạn.
Việc tạo bộ cân bằng tải thực tế diễn ra bất đồng bộ, và
thông tin về bộ cân bằng tải được cấp phát sẽ được công bố trong trường
`.status.loadBalancer` của Service.
Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

Lưu lượng từ bộ cân bằng tải bên ngoài được chuyển tới các Pod backend. Nhà cung cấp
dịch vụ đám mây quyết định cách cân bằng tải.

Để triển khai một Service `type: LoadBalancer`, Kubernetes thường bắt đầu
bằng cách thực hiện các thay đổi tương đương với việc bạn yêu cầu một Service
`type: NodePort`. Sau đó, thành phần cloud-controller-manager cấu hình bộ cân bằng tải
bên ngoài để chuyển tiếp lưu lượng tới node port đã được gán đó.

Bạn có thể cấu hình một Service có cân bằng tải để
[bỏ qua](#load-balancer-nodeport-allocation) việc gán node port, với điều kiện
bản triển khai của nhà cung cấp dịch vụ đám mây hỗ trợ điều này.

Một số nhà cung cấp dịch vụ đám mây cho phép bạn chỉ định `loadBalancerIP`. Trong những trường hợp đó, bộ cân bằng tải được tạo
với `loadBalancerIP` do người dùng chỉ định. Nếu trường `loadBalancerIP` không được chỉ định,
bộ cân bằng tải sẽ được thiết lập với một địa chỉ IP tạm thời. Nếu bạn chỉ định `loadBalancerIP`
nhưng nhà cung cấp dịch vụ đám mây của bạn không hỗ trợ tính năng này, trường `loadbalancerIP` mà bạn
đặt sẽ bị bỏ qua.


{{< note >}}
Trường `.spec.loadBalancerIP` của Service đã không còn được hỗ trợ từ Kubernetes v1.24.

Trường này được đặc tả chưa đầy đủ và ý nghĩa của nó khác nhau giữa các bản triển khai.
Nó cũng không thể hỗ trợ mạng dual-stack. Trường này có thể bị loại bỏ trong một phiên bản API tương lai.

Nếu bạn đang tích hợp với một nhà cung cấp hỗ trợ chỉ định (các) địa chỉ IP của bộ cân bằng tải
cho Service thông qua một chú thích (riêng của nhà cung cấp), bạn nên chuyển sang cách đó.

Nếu bạn đang viết code tích hợp bộ cân bằng tải với Kubernetes, hãy tránh dùng trường này.
Bạn có thể tích hợp với [Gateway](https://gateway-api.sigs.k8s.io/) thay vì Service, hoặc bạn
có thể tự định nghĩa các chú thích (riêng của nhà cung cấp) trên Service để chỉ định thông tin tương đương.
{{< /note >}}

#### Ảnh hưởng của tình trạng hoạt động (liveness) của node tới lưu lượng bộ cân bằng tải {#node-liveness-impact-on-load-balancer-traffic}

Kiểm tra sức khỏe (health check) của bộ cân bằng tải đóng vai trò then chốt đối với các ứng dụng hiện đại. Chúng được dùng để
xác định máy chủ nào (máy ảo, hoặc địa chỉ IP) mà bộ cân bằng tải nên
điều phối lưu lượng tới. Kubernetes API không định nghĩa cách triển khai kiểm tra sức khỏe
cho các bộ cân bằng tải do Kubernetes quản lý, thay vào đó các nhà cung cấp dịch vụ đám mây
(và những người viết code tích hợp) sẽ quyết định hành vi. Kiểm tra sức khỏe
của bộ cân bằng tải được sử dụng rộng rãi trong bối cảnh hỗ trợ trường
`externalTrafficPolicy` của Service.

#### Bộ cân bằng tải với nhiều loại giao thức {#load-balancers-with-mixed-protocol-types}

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

Theo mặc định, với các Service loại LoadBalancer, khi có nhiều hơn một cổng được định nghĩa, tất cả
các cổng phải có cùng giao thức, và giao thức đó phải được
nhà cung cấp dịch vụ đám mây hỗ trợ.

Feature gate `MixedProtocolLBService` (được bật mặc định cho kube-apiserver kể từ v1.24) cho phép dùng
các giao thức khác nhau cho các Service loại LoadBalancer khi có nhiều hơn một cổng được định nghĩa.

{{< note >}}
Tập giao thức có thể dùng cho các Service có cân bằng tải do nhà cung cấp
dịch vụ đám mây của bạn định nghĩa; họ có thể áp đặt các hạn chế ngoài những gì Kubernetes API quy định.
{{< /note >}}

#### Tắt cấp phát NodePort cho bộ cân bằng tải {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Bạn có thể tùy chọn tắt việc cấp phát node port cho Service `type: LoadBalancer` bằng cách đặt
trường `spec.allocateLoadBalancerNodePorts` thành `false`. Chỉ nên dùng cách này cho các bản triển khai bộ cân bằng tải
định tuyến lưu lượng trực tiếp tới pod thay vì dùng node port. Theo mặc định, `spec.allocateLoadBalancerNodePorts`
là `true` và các Service loại LoadBalancer sẽ tiếp tục cấp phát node port. Nếu `spec.allocateLoadBalancerNodePorts`
được đặt thành `false` trên một Service hiện có đã được cấp phát node port, các node port đó sẽ **không** được tự động thu hồi.
Bạn phải xóa rõ ràng mục `nodePorts` trong từng cổng của Service để thu hồi các node port đó.

#### Chỉ định class cho bản triển khai bộ cân bằng tải {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Với một Service có `type` được đặt thành `LoadBalancer`, trường `.spec.loadBalancerClass`
cho phép bạn dùng một bản triển khai bộ cân bằng tải khác với mặc định của nhà cung cấp dịch vụ đám mây.

Theo mặc định, `.spec.loadBalancerClass` không được đặt và Service loại `LoadBalancer`
sẽ dùng bản triển khai bộ cân bằng tải mặc định của nhà cung cấp dịch vụ đám mây nếu
cluster được cấu hình với một nhà cung cấp dịch vụ đám mây thông qua cờ
`--cloud-provider` của thành phần.

Nếu bạn chỉ định `.spec.loadBalancerClass`, hệ thống giả định rằng có một bản triển khai bộ cân bằng tải
khớp với class đã chỉ định đang theo dõi các Service.
Mọi bản triển khai bộ cân bằng tải mặc định (ví dụ, bản do
nhà cung cấp dịch vụ đám mây cung cấp) sẽ bỏ qua các Service có đặt trường này.
`spec.loadBalancerClass` chỉ có thể được đặt trên Service loại `LoadBalancer`.
Một khi đã đặt, giá trị này không thể thay đổi.
Giá trị của `spec.loadBalancerClass` phải là một định danh dạng label,
với tiền tố tùy chọn như "`internal-vip`" hoặc "`example.com/internal-vip`".
Các tên không có tiền tố được dành riêng cho người dùng cuối.

#### Chế độ địa chỉ IP của bộ cân bằng tải {#load-balancer-ip-mode}

Với một Service `type: LoadBalancer`, controller có thể đặt `.status.loadBalancer.ingress.ipMode`.
`.status.loadBalancer.ingress.ipMode` chỉ định cách IP của bộ cân bằng tải hoạt động.
Trường này chỉ có thể được chỉ định khi trường `.status.loadBalancer.ingress.ip` cũng được chỉ định.

Có hai giá trị khả dĩ cho `.status.loadBalancer.ingress.ipMode`: "VIP" và "Proxy".
Giá trị mặc định là "VIP", nghĩa là lưu lượng được chuyển tới node
với đích được đặt là IP và cổng của bộ cân bằng tải.
Có hai trường hợp khi đặt giá trị này thành "Proxy", tùy thuộc vào cách bộ cân bằng tải
của nhà cung cấp dịch vụ đám mây chuyển lưu lượng:

- Nếu lưu lượng được chuyển tới node rồi được DNAT tới pod, đích sẽ được đặt là IP và node port của node;
- Nếu lưu lượng được chuyển trực tiếp tới pod, đích sẽ được đặt là IP và cổng của pod.

Các bản triển khai Service có thể dùng thông tin này để điều chỉnh việc định tuyến lưu lượng.

#### Bộ cân bằng tải nội bộ {#internal-load-balancer}

Trong một môi trường hỗn hợp, đôi khi cần định tuyến lưu lượng từ các Service bên trong cùng một
khối địa chỉ mạng (ảo).

Trong môi trường DNS split-horizon, bạn sẽ cần hai Service để có thể định tuyến cả lưu lượng bên ngoài
lẫn bên trong tới các endpoint của mình.

Để thiết lập một bộ cân bằng tải nội bộ, hãy thêm một trong các chú thích sau vào Service
tùy theo nhà cung cấp dịch vụ đám mây mà bạn đang dùng:

{{< tabs name="service_tabs" >}}
{{% tab name="Mặc định" %}}
Chọn một trong các tab.
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

Service loại ExternalName ánh xạ một Service tới một tên DNS, chứ không phải tới một selector thông thường như
`my-service` hay `cassandra`. Bạn chỉ định các Service này bằng tham số `spec.externalName`.

Ví dụ, định nghĩa Service sau ánh xạ
Service `my-service` trong namespace `prod` tới `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
Service `type: ExternalName` chấp nhận một chuỗi địa chỉ IPv4,
nhưng xử lý chuỗi đó như một tên DNS gồm các chữ số,
chứ không phải như một địa chỉ IP (tuy nhiên internet không cho phép những tên như vậy trong DNS).
Các Service có tên bên ngoài trông giống địa chỉ
IPv4 sẽ không được các máy chủ DNS phân giải.

Nếu bạn muốn ánh xạ trực tiếp một Service tới một địa chỉ IP cụ thể, hãy cân nhắc dùng
[headless Service](#headless-services).
{{< /note >}}

Khi tra cứu host `my-service.prod.svc.cluster.local`, DNS Service của cluster
trả về một bản ghi `CNAME` với giá trị `my.database.example.com`. Việc truy cập
`my-service` hoạt động giống như các Service khác nhưng có điểm khác biệt
quan trọng là việc chuyển hướng diễn ra ở mức DNS thay vì qua proxy hay
chuyển tiếp. Nếu sau này bạn quyết định chuyển cơ sở dữ liệu vào trong cluster, bạn
có thể khởi chạy các Pod của nó, thêm các selector hoặc endpoint phù hợp, và thay đổi
`type` của Service.

{{< caution >}}
Bạn có thể gặp khó khăn khi dùng ExternalName với một số giao thức phổ biến, bao gồm HTTP và HTTPS.
Nếu bạn dùng ExternalName thì hostname mà các client bên trong cluster sử dụng sẽ khác với
tên mà ExternalName tham chiếu tới.

Với các giao thức sử dụng hostname, sự khác biệt này có thể dẫn đến lỗi hoặc phản hồi không mong muốn.
Các yêu cầu HTTP sẽ có header `Host:` mà máy chủ gốc không nhận ra;
các máy chủ TLS sẽ không thể cung cấp chứng chỉ khớp với hostname mà client đã kết nối tới.
{{< /caution >}}

## Headless Service {#headless-services}

Đôi khi bạn không cần cân bằng tải và một IP Service duy nhất. Trong
trường hợp này, bạn có thể tạo cái gọi là _headless Service_, bằng cách chỉ định rõ
`"None"` cho địa chỉ cluster IP (`.spec.clusterIP`).

Bạn có thể dùng headless Service để giao tiếp với các cơ chế service discovery khác
mà không bị ràng buộc vào cách triển khai của Kubernetes.

Với headless Service, cluster IP không được cấp phát, kube-proxy không xử lý
các Service này, và nền tảng không thực hiện cân bằng tải hay proxy cho chúng.

Headless Service cho phép client kết nối trực tiếp tới bất kỳ Pod nào mà nó muốn. Các headless Service không
cấu hình route và chuyển tiếp gói tin bằng
[địa chỉ IP ảo và proxy](/docs/reference/networking/virtual-ips/); thay vào đó, headless Service báo cáo
địa chỉ IP endpoint của từng pod thông qua các bản ghi DNS nội bộ, được phục vụ qua
[dịch vụ DNS](/docs/concepts/services-networking/dns-pod-service/) của cluster.
Để định nghĩa một headless Service, bạn tạo một Service với `.spec.type` được đặt thành ClusterIP (cũng là giá trị mặc định của `type`),
và đặt thêm `.spec.clusterIP` thành None.

Giá trị chuỗi None là một trường hợp đặc biệt và không giống với việc để trống trường `.spec.clusterIP`.

Cách DNS được cấu hình tự động phụ thuộc vào việc Service có định nghĩa selector hay không:

### Có selector {#with-selectors}

Với các headless Service có định nghĩa selector, endpoints controller tạo
các EndpointSlice trong Kubernetes API, và sửa đổi cấu hình DNS để trả về
các bản ghi A hoặc AAAA (địa chỉ IPv4 hoặc IPv6) trỏ trực tiếp tới các Pod đứng sau Service.

### Không có selector {#without-selectors}

Với các headless Service không định nghĩa selector, control plane
không tạo các đối tượng EndpointSlice. Tuy nhiên, hệ thống DNS sẽ tìm và cấu hình
một trong hai:

* Bản ghi DNS CNAME cho các Service [`type: ExternalName`](#externalname).
* Bản ghi DNS A / AAAA cho tất cả địa chỉ IP của các endpoint sẵn sàng của Service,
  với mọi loại Service ngoài `ExternalName`.
  * Với endpoint IPv4, hệ thống DNS tạo bản ghi A.
  * Với endpoint IPv6, hệ thống DNS tạo bản ghi AAAA.

Khi bạn định nghĩa một headless Service không có selector, `port` phải
khớp với `targetPort`.

## Tìm kiếm Service {#discovering-services}

Với các client chạy bên trong cluster, Kubernetes hỗ trợ hai cách chính để
tìm một Service: biến môi trường và DNS.

### Biến môi trường {#environment-variables}

Khi một Pod chạy trên một Node, kubelet thêm một tập biến môi trường
cho mỗi Service đang hoạt động. Nó thêm các biến `{SVCNAME}_SERVICE_HOST` và `{SVCNAME}_SERVICE_PORT`,
trong đó tên Service được viết hoa và dấu gạch ngang được chuyển thành dấu gạch dưới.


Ví dụ, Service `redis-primary` cung cấp cổng TCP 6379 và đã được
cấp phát địa chỉ cluster IP 10.0.0.11 sẽ tạo ra các biến môi trường
sau:

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Khi bạn có một Pod cần truy cập một Service, và bạn đang dùng
phương pháp biến môi trường để công bố cổng và cluster IP cho các Pod
client, bạn phải tạo Service *trước* khi các Pod client được tạo ra.
Nếu không, các biến môi trường của những Pod client đó sẽ không được điền giá trị.

Nếu bạn chỉ dùng DNS để tìm cluster IP của một Service, bạn không cần
lo lắng về vấn đề thứ tự này.
{{< /note >}}

Kubernetes cũng hỗ trợ và cung cấp các biến tương thích với tính năng
"_[legacy container links](https://docs.docker.com/network/links/)_" của Docker Engine.
Bạn có thể đọc [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
để xem cách tính năng này được triển khai trong Kubernetes.

### DNS

Bạn có thể (và gần như luôn luôn nên) thiết lập một dịch vụ DNS cho cluster Kubernetes
bằng một [add-on](/docs/concepts/cluster-administration/addons/).

Một máy chủ DNS nhận biết cluster (cluster-aware), chẳng hạn CoreDNS, theo dõi Kubernetes API để phát hiện
các Service mới và tạo một tập bản ghi DNS cho mỗi Service. Nếu DNS đã được bật
trên toàn bộ cluster thì tất cả các Pod sẽ tự động phân giải được
Service theo tên DNS của chúng.

Ví dụ, nếu bạn có một Service tên là `my-service` trong namespace
Kubernetes `my-ns`, control plane và DNS Service cùng phối hợp
tạo một bản ghi DNS cho `my-service.my-ns`. Các Pod trong namespace `my-ns`
sẽ có thể tìm thấy service bằng cách tra cứu tên `my-service`
(`my-service.my-ns` cũng hoạt động).

Các Pod trong namespace khác phải dùng tên đầy đủ `my-service.my-ns`. Những tên này
sẽ được phân giải thành cluster IP được gán cho Service.

Kubernetes cũng hỗ trợ bản ghi DNS SRV (Service) cho các cổng có tên. Nếu
Service `my-service.my-ns` có một cổng tên là `http` với giao thức được đặt thành
`TCP`, bạn có thể thực hiện truy vấn DNS SRV cho `_http._tcp.my-service.my-ns` để tìm
số cổng của `http`, cũng như địa chỉ IP.

Máy chủ DNS của Kubernetes là cách duy nhất để truy cập các Service `ExternalName`.
Bạn có thể tìm thêm thông tin về việc phân giải `ExternalName` trong
[DNS cho Service và Pod](/docs/concepts/services-networking/dns-pod-service/).

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## Cơ chế địa chỉ IP ảo {#virtual-ip-addressing-mechanism}

Trang [IP ảo và Service Proxy](/docs/reference/networking/virtual-ips/) giải thích
cơ chế mà Kubernetes dùng để cung cấp một Service qua một địa chỉ IP ảo.

### Chính sách lưu lượng {#traffic-policies}

Bạn có thể đặt các trường `.spec.internalTrafficPolicy` và `.spec.externalTrafficPolicy`
để kiểm soát cách Kubernetes định tuyến lưu lượng tới các backend khỏe mạnh (“ready”).

Xem [Chính sách lưu lượng](/docs/reference/networking/virtual-ips/#traffic-policies) để biết thêm chi tiết.

### Kiểm soát phân phối lưu lượng {#traffic-distribution}

Trường `.spec.trafficDistribution` cung cấp một cách khác để tác động tới việc định tuyến
lưu lượng trong một Service Kubernetes. Trong khi chính sách lưu lượng tập trung vào các đảm bảo
ngữ nghĩa chặt chẽ, phân phối lưu lượng cho phép bạn thể hiện các _ưu tiên_
(chẳng hạn định tuyến tới các endpoint gần hơn về mặt topo mạng). Điều này có thể giúp tối ưu
hiệu năng, chi phí, hoặc độ tin cậy. Trong Kubernetes {{< skew currentVersion >}},
các giá trị sau được hỗ trợ:

`PreferSameZone`
: Thể hiện ưu tiên định tuyến lưu lượng tới các endpoint nằm trong cùng
  zone với client.

`PreferSameNode`
: Thể hiện ưu tiên định tuyến lưu lượng tới các endpoint nằm trên cùng
  node với client.

`PreferClose` (không còn được hỗ trợ)
: Đây là một alias cũ của `PreferSameZone`, có ngữ nghĩa
  kém rõ ràng hơn.

Nếu trường này không được đặt, bản triển khai sẽ áp dụng chiến lược định tuyến mặc định của nó.

Xem [Phân phối
lưu lượng](/docs/reference/networking/virtual-ips/#traffic-distribution) để biết
thêm chi tiết.

### Duy trì phiên (session stickiness) {#session-stickiness}

Nếu bạn muốn đảm bảo rằng các kết nối từ một client cụ thể luôn được chuyển tới
cùng một Pod, bạn có thể cấu hình session affinity dựa trên địa chỉ IP
của client. Đọc [session affinity](/docs/reference/networking/virtual-ips/#session-affinity)
để tìm hiểu thêm.

## IP bên ngoài (External IP) {#external-ips}

{{< feature-state for_k8s_version="v1.36" state="deprecated" >}}

Tất cả người dùng nên bắt đầu chuyển dần khỏi `externalIPs`.
Thay vào đó, hãy cân nhắc dùng một controller bộ cân bằng tải bên ngoài hoặc một bản triển khai
Gateway API.

Nếu có các IP bên ngoài định tuyến tới một hoặc nhiều node của cluster, các Service Kubernetes
có thể được cung cấp trên các `externalIPs` đó. Khi lưu lượng mạng đi vào cluster với
IP bên ngoài (là IP đích) và cổng khớp với Service đó, các quy tắc và route
mà Kubernetes đã cấu hình sẽ đảm bảo lưu lượng được định tuyến tới một trong các endpoint
của Service đó.

Khi định nghĩa một Service, bạn có thể chỉ định `externalIPs` cho bất kỳ
[loại Service](#publishing-services-service-types) nào.
Trong ví dụ dưới đây, client có thể truy cập Service tên `"my-service"` qua TCP,
tại `"198.51.100.32:80"` (được tính từ `.spec.externalIPs[]` và `.spec.ports[].port`).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
Kubernetes không quản lý việc cấp phát `externalIPs`; đây là trách nhiệm
của quản trị viên cluster.
{{< /note >}}

## Đối tượng API {#api-object}

Service là một tài nguyên cấp cao nhất trong Kubernetes REST API. Bạn có thể tìm thêm chi tiết
về [đối tượng Service API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## {{% heading "whatsnext" %}}

Tìm hiểu thêm về Service và vai trò của chúng trong Kubernetes:

* Làm theo hướng dẫn
  [Kết nối ứng dụng với Service](/docs/tutorials/services/connect-applications-service/).
* Đọc về [Ingress](/docs/concepts/services-networking/ingress/), thành phần
  cung cấp các route HTTP và HTTPS từ bên ngoài cluster tới các Service bên trong
  cluster của bạn.
* Đọc về [Gateway](/docs/concepts/services-networking/gateway/), một phần mở rộng của
  Kubernetes mang lại nhiều sự linh hoạt hơn Ingress.

Để hiểu thêm bối cảnh, hãy đọc các tài liệu sau:

* [IP ảo và Service Proxy](/docs/reference/networking/virtual-ips/)
* [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
* [Tài liệu tham khảo Service API](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [Tài liệu tham khảo EndpointSlice API](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Tài liệu tham khảo Endpoint API (cũ)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)

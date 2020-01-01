---
reviewers:
- ngtuna
title: Service
feature:
  title: Service discovery và load balancing
  description: >
    Bạn không cần phải sửa đổi ứng dụng của mình để sử dụng một cơ chế service discovery kém thân thiện. Kubernetes cho phép các Pods sở hữu địa chỉ IP của chúng và chỉ một tên DNS cho một tập các Pods, và có thể cân bằng tải giữa chúng.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< glossary_definition term_id="service" length="short" >}}

Với Kubernetes bạn không cần phải sửa đổi ứng dụng của mình để sử dụng một cơ chế service discovery kém thân thiện.
Kubernetes cho phép các Pods sở hữu địa chỉ IP của chúng và chỉ một tên DNS cho một tập các Pods, và có thể cân bằng tải giữa chúng.

{{% /capture %}}

{{% capture body %}}

## Motivation

Kubernetes {{< glossary_tooltip term_id="pod" text="Pods" >}} thì tạm thời.
Chúng sinh ra và khi chúng mất đi, chúng không được phục hồi.
Nếu bạn sử dụng {{< glossary_tooltip term_id="deployment" >}} để chạy ứng dụng của bạn, nó có thể tạo và hủy Pods một cách linh hoạt.

Mỗi Pod sở hữu địa chỉ IP của riêng mình, tuy nhiên trong một Deployment, các Pods chạy ở thời điểm này có thể khác với tập các Pods chạy ứng dụng đó một lát sau.

Điều này dẫn đến một vấn đề: nếu một số nhóm Pod (gọi chúng là “backends”) cung cấp chức năng cho các Pod khác (gọi chúng là “frontends”) trong cụm của bạn, làm thế nào để các frontends tìm ra và theo dõi địa chỉ IP nào để kết nối tới, để frontend có thể sử dụng phần tính toán của backend.

Enter _Services_.

## Service resources {#service-resource}

Trong Kubernetes, một Service là một sự trừu tượng hóa mà định nghĩa một tập các Pods có quan hệ logic và chính sách để truy cập chúng (đôi khi được gọi là micro-service). Tập hợp các Pods mục tiêu bởi một Service thường được xác định bởi một {{< glossary_tooltip text="selector" term_id="selector" >}} (xem [below](#services-without-selectors) để biết tại sao bạn có thể muốn một Service mà _không có_ một selector).

Ví dụ, xét một backend stateless để xử lý hình ảnh mà chạy với 3 bản sao. Những bản sao này có thể thay thế được, và frontend không quan tâm đến việc sử dụng backend nào. Trong khi những Pod mà tạo nên backend có thể thay đổi, thì frontend client không cần phải biết điều đó, cũng như không cần phải tự theo dõi tập hợp các Pod tạo nên backend.

Sự trừu tượng hóa của Service cho phép tách rời điều này.

### Cloud-native service discovery

Nếu bạn có thể sử dụng Kubernetes APIs cho service discovery trong ứng dụng của bạn, bạn có thể truy cập {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} để có các Endpoints, mà sẽ được cập nhật bất cứ khi nào các Pod trong Service thay đổi.

Đối với các ứng dụng không hỗ trợ, Kubernetes có cách để đặt một cổng mạng hoặc cân bằng tải giữa ứng dụng của bạn và các Pod backend.

## Định nghĩa một Service

Một Service trong Kubernetes là một đối tượng REST, tương tự như một Pod. Như tất cả các REST object khác, bạn có thể gửi yêu cầu `POST` một định nghĩa Service tới API server để tạo mới.

Ví dụ, giả sử bạn có một tập hợp Pod mà đang lắng nghe TCP port 9376 và có label `app=MyApp`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Đặc tả này tạo một đối tượng Service mới có tên “my-service”, target đến TCP port 9376 trên bất kì Pod nào có label `app=MyApp`.

Kubernetes gán cho Service này một địa chỉ IP (hay "cluster IP"), được sử dụng bởi Service proxies (xem [Virtual IPs và service proxies](#virtual-ips-and-service-proxies) bên dưới).


Bộ điều khiển cho Service selector liên tục quét các Pod phù hợp với selector của nó, và sau đó POST bất kì cập nhật nào tới một đối tượng Endpoint cũng có tên là “my-service”.

{{< note >}}
Một Service có thể ánh xạ _bất kỳ_ `port` đầu vào nào tới một `targetPort`. Mặc định và để cho thuận tiện, trường `targetPort` có cùng giá trị với trường `port`.
{{< /note >}}

Định nghĩa Port trong Pod có tên, và bạn có thể tham chiếu tên này trong trường `targetPort` của một Service. Điều này hoạt động ngay cả khi một hỗn hợp các Pod trong Service sử dụng một tên được cấu hình duy nhất, với cùng giao thức mạng qua các port khác nhau. 
Điều này cũng cấp rất nhiều tính linh hoạt để triển khai và phát triển Service của bạn.
Ví dụ, bạn có thể thay đổi port mà Pod sử dụng trong phiên bản tiếp theo của backend, mà không làm hỏng các client.

Giao thức mặc định của Service là TCP, bạn cũng có thể sử dụng bất kì [giao thức được hỗ trợ khác](#protocol-support).


Bởi vì nhiều Service cần sử dụng nhiều hơn một port, Kubernetes hỗ trợ định nghĩa nhiều port trên một đối tượng Service.
Mỗi định nghĩa port có thể sử dụng cùng `giao thức`, hoặc khác nhau.

### Services không có selectors

Service thường trừu tượng hóa truy cập tới Kubernetes Pods nhất, những chúng cũng có thể trừu tượng hóa các loại backend khác.
Ví dụ:

  * Bạn muốn có một cơ sở dữ liệu bên ngoài trên mỗi trường production, nhưng ở môi trường test bạn sử dụng cơ sở dữ liệu của mình.
  * Bạn muốn trỏ Service của bạn tới một Service ở {{< glossary_tooltip term_id="namespace" >}} khác hoặc ở một cụm khác.
  * Bạn muốn di chuyển ứng dụng lên Kubernetes. Trong khi đánh giá cách tiếp cận này, bạn chỉ chạy một phần của backend trên Kubernetes.

Trong bất kì trường hợp này bạn có thể định nghĩa một Service _mà không có_ một Pod selector.\
Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Bởi vì Service này không có selector, đối tượng Endpoint tương ứng *không* được tạo tự động. Bạn có thể ánh xạ bằng tay Service tới địa chỉ và port cần sử dụng, bằng việc thêm một đối tượng Endpoint bằng tay:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```

{{< note >}}
Địa chỉ IP của Endpoint _không được phép_ là loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), hoặc link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6).


Địa chỉ IP của Endpoint không thể là cluster IP của Service Kubernetes khác, 
bởi vì {{< glossary_tooltip term_id="kube-proxy" >}} không hỗ trợ IP ảo làm đích.
{{< /note >}}

Kết nối tới Service mà không có selector cũng giống như khi có selector.
Ở ví dụ trên, traffic được định tuyến tới một endpoint định nghĩa trong 
YAML `192.0.2.42:9376` (TCP).

Một ExternalName Service là một trường hợp đặc biệt của Service mà không có selector và sử dụng DNS thay thế.
Để biết thêm thông tin, hãy xem phần [ExternalName](#externalname) phía sau trong tài liệu này.

### Endpoint Slices
{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Endpoint Slices là một API resource mà có thể cung cấp một sự thay thế có thể mở rộng hơn đối với Endpoint.
Mặc dù về mặt khái niệm chúng khá giống với Endpoint, Endpoint Slice cho phép phân phối endpoint mạng trên nhiều tài nguyên.
Mặc định một Endpoint Slice được coi là đầy đủ khi nó đạt tới 100 endpoint, khi đó các Endpoint Slice sẽ được tạo để lưu trữ bất kỳ endpoint nào được thêm.

Endpoint Slice cung cấp thêm các thuộc tính và chức năng bổ sung được mô tả chi tiết trong [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).

## Virtual IPs và service proxies

Mọi node trong cụm Kubernetes chạy một `kube-proxy`. 
`kube-proxy` chịu trách nhiệm cho việc triển khai một dạng IP ảo cho `Services` ngoại trừ [`ExternalName`](#externalname).

### Tại sao không sử dụng round-robin DNS?

Một câu hỏi xuất hiện mọi nơi là tại sao Kubernetes dựa vào proxy để chuyển tiếp lưu lượng truy cấp đến backend.
Còn những cách tiếp cận khác thì sao? Ví dụ: có thể cấu hình bản ghi DNS mà có nhiều giá trị A (hoặc AAAA for IPv6), và dựa trên phân giải tên round-robin?

Có một vài lý do để sử dụng proxy cho Service:

 * Có một lịch sử dài thực hiện DNS không tuân thủ record TTLs, và caching kết quả truy vấn sau khi chúng hết hạn.
 * Một số ứng dụng chỉ truy vấn DNS một lần và lưu trữ kết quả vô thời hạn.
 * Ngay cả khi ứng dụng và thư viện thực hiện phân giải đúng cách, TTL thấp hoặc bằng không có thể gây ra tải cao cho DNS mà sau đó trở nên khó quản lý.

### Chế độ user space proxy {#proxy-mode-userspace}

Trong chế độ này, kube-proxy theo dõi Kubernetes master để thêm và gỡ bỏ đối tượng Service và Endpoint. Mỗi Service sẽ mở một port (chọn ngẫu nhiên) trên local node. Bất kỳ kết nối nào tới "proxy port" này được chuyển tiếp đến một trong các Pod backend của Service (được báo cáo qua Endpoint). kube-proxy lấy cấu hình `SessionAffinity` của Service để tính toán khi quyết định backend Pod nào được sử dụng.

Cuối cùng, user-space proxy cài đặt iptables rules mà tiếp nhận lưu lượng tới `clusterIP` (ảo) và `port` của Service. Những rule này chuyển hướng traffic tới proxy port để chuyển hướng tới backend Pod.

Mặc định, kube-proxy ở chế độ userspace chọn một backend thông qua giải thuật round-robin.

![Biểu đồ tổng quan Service ở chế độ userspace proxy](/images/docs/services-userspace-overview.svg)

### Chế độ `iptables` proxy {#proxy-mode-iptables}

Trong chế độ này, kube-proxy theo dõi Kubernetes control plane để thêm và gỡ bỏ đối tượng Service và Endpoint. Với mỗi Service, nó cài đặt những iptables rule, tiếp nhận lưu lượng tới Service's `clusterIP` và `port`, và chuyển hướng lưu lượng đó tới một trong các backend của Service. Với mỗi Endpoint, nó cài đặt những iptables rule để chọn backend Pod.

Mặc định, kube-proxy trong chế độ iptables chọn một backend ngẫu nhiên.

Sử dụng iptables để xử lý lưu lượng có chi phí hệ thống thấp hơn, bởi vì lưu lượng được xử lý bởi Linux netfilter mà không cần chuyển qua lại giữa userspace và kernel space. Cách tiếp cận này có vẻ đáng tin cậy hơn.

Nếu kube-proxy đạng chạy ở chế độ iptables và Pod đầu tiên nó chọn không phản hồi, kết nối sẽ thất bại. Điều này khác với chế độ userspace: trong trường hợp đó, kube-proxy sẽ phát hiện kết nối tới Pod đầu tiên đã thất bại và sẽ tự động thử lại với một Pod backend khác.

Bạn có thể sử dụng [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) của Pod để xác mình rằng các Pod backend đang hoạt động tốt, nhờ vậy kube-proxy trong chế độ iptables chỉ thấy các backend được kiểm tra là khỏe mạnh. Thực hiện điều này có nghĩa rằng bạn sẽ tránh việc gửi lưu tượng qua kube-proxy tới một Pod được biết là đã hỏng.

![Biểu đồ tổng quan Service ở chế độ iptables proxy](/images/docs/services-iptables-overview.svg)

### Chế độ IPVS proxy{#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Trong chế độ `ipvs`, kube-proxy theo dõi các Service và Endpoint của Kubernetes, gọi interface `netlink` để tạo các rule IPVS tương ứng và đồng bộ hóa rule IPVS với Service và Endpoint của Kubernetes định kỳ. Vòng lặp điều khiển này đảm bảo rằng trạng thái IPVS khớp với trạng thái mong muốn.
Khi kết nối tới một Serivce, IPVS chuyển hướng lưu lượng tới một trong các Pod backend.

Chế độ IPVS proxy dựa trên chức năng netfilter hook tương tự chế độ iptables, nhưng sử dụng hash tables làm cấu trức dữ liệu bên dưới và làm việc ở kernel space.
Điều này có nghĩa rằng kube-proxy trong chế độ IPVS chuyển hướng lưu lượng với một độ trễ thấp hơn kube-proxy trong chế độ iptables, có hiệu năng tốt hơn khi đồng bộ các quy tắc proxy. So sánh với các chế độ proxy khác, chế dộ IPVS cũng hỗ trợ thông lượng mạng cao hơn.

IPVS cung cấp nhiều tùy chọn cân bằng lưu lượng tới các Pod backend; bao gồm:

- `rr`: round-robin
- `lc`: least connection (số lượng kết nối mở ít nhất)
- `dh`: destination hashing
- `sh`: source hashing
- `sed`: shortest expected delay
- `nq`: never queue

{{< note >}}
Để chạy kube-proxy ở chế độ IPVS, bạn phải có sẵn IPVS Linux trên node trước khi khởi chạy kube-proxy.

Khi kube-proxy khởi chạy trong chế độ IPVS, nó sẽ xác minh liệu kernel module IPVS có khả dụng hay không. Nếu kernel module IPVS không được phát hiện, kube-proxy sẽ quay trở lại chạy trong chế độ iptables proxy.
{{< /note >}}

![Sơ đồ tổng quan Service ở chế độ IPVS proxy](/images/docs/services-ipvs-overview.svg)

Trong mô hình proxy này, lưu lượng ràng buộc cho IP:Port của Service được truyền đến cùng một backend phù hợp mà client không biết bất cứ điều gì về Kubernetes, Service, hay Pod.

Nếu bạn muốn chắc chắn mỗi lần kết nối từ một client cụ thể đến cùng một Pod, bạn có thể sử dụng mối quan hệ phiên dựa trên địa chỉ IP của client bằng việc thiết lập `service.spec.sessionAffinity` tới "ClientIP" (mặc định là "None").

Bạn cũng có thể cài đặt số session stiky tối đa bằng việc thiết lập 
`service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` thích hợp.
(giá trị mặc định là 10800, lên tới 3 giờ).

## Multi-Port Services

Đối với một số Service, bạn cần đưa ra nhiều hơn một port.
Kubernetes cho phép bạn cấu hình nhiều định nghĩa port trên một đối tượng Service.
Khi sử dụng nhiều port cho một Service, bạn phải cung cấp tên cho tất cả các port để chúng không bị nhập nhằng.
Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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
Như {{< glossary_tooltip term_id="name" text="names">}} trong Kubernetes nói chung, tên của port chỉ giứa ký tự chữ thường, số và `-`. Tên port cũng phải bắt đầu và kết thúc bằng một ký tự chữ hoặc số.

Ví dụ, tên `123-abc` và `web` là hợp lệ, nhưng `123_abc` và `-web` thì không.
{{< /note >}}

## Chọn địa chỉ IP của bạn

Bạn có thể chỉ định địa chỉ cluster IP như một phần của yêu cầu tạo Service. Để làm điều này, thiết lập trường `.spec.clusterIP`. Ví dụ, nếu bạn đã có một lối vào DNS hiện có mà bạn muốn sử dụng lại, hoặc các hệ thống cũ được cấu hình cho một địa chỉ IP cụ thể và khó cấu hình lại.

Địa chỉ IP mà bạn chọn phải là một địa chỉ IPv4 hoặc IPv6 hợp lệ trong phạm vi CIDR `service-cluster-ip-range` được cấu hình cho API server. Nếu bạn cố gắng tạo một Service có địa chỉ clusterIP không hợp lệ, API server sẽ trả về mã trạng thái 422 HTTP để biểu thị có vấn đề.

## Discovering services

Kubernetes hỗ trợ 2 chế độ chính để tìm một Service - biến môi trường và DNS.

### Environment variables

Khi một Pod được chạy trên một Node, kubelet sẽ thêm một tập hợp các biến môi trường cho mỗi Service đang hoạt động. Nó hỗ trợ cả biến [Docker links compatible](https://docs.docker.com/userguide/dockerlinks/) (xem
[makeLinkVariables](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L49))
và đơn giản hơn là các biến `{SVCNAME}_SERVICE_HOST` và `{SVCNAME}_SERVICE_PORT`, trong đó tên Service viết in và dấu gạch ngang được chuyển thành dấu gạch dưới.

Ví dụ, Service `"redis-master"` đưa ra port TCP 6379 và được cấp địa chỉ cluster IP 10.0.0.11, tạo ra các biến môi trường sau:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Khi bạn có một Pod cần truy cập tới Service, và bạn đang sử dụng phương pháp biến môi trường để đưa ra port và cluster IP tới các Pod client, bạn phải tạo Service *trước* các Pod client hiện có. Mặt khác, các Pod client sẽ không có biến môi trường.

Nếu bạn chỉ sử dụng DNS để tìm cluster IP của một Service, bạn không cần lo lắng về thứ tự này.
{{< /note >}}

### DNS

Bạn có thể (và hầu như luôn luôn) thiết lập dịch vụ DNS cho cụm Kubernetes bằng [add-on](/docs/concepts/cluster-administration/addons/).

Một server DNS, như CoreDNS, theo dõi Kubernetes API các Servie mới và tạo một tập hợp bản ghi DNS cho từng Service. Nếu DNS đã được kích hoạt trên cụm của bạn thì tất cả các Pod có thể tự động phân giải Service bằng tên DNS của chúng.

Ví dụ, nếu bạn có một Service có tên `"my-service"` trong Namespace Kubernetes `"my-ns"`, control plane và dịch vụ DNS sẽ hoạt động cùng nhau tạo một bản ghi DNS cho `"my-service.my-ns"`. Pod trong Namespace `"my-ns"` có thể tìm thấy nó bằng cách đơn giản dò tên `my-service` (`"my-service.my-ns"` cũng hoạt động).

Pod trong Namespace khác phải sử dụng tên `my-service.my-ns`. Những tên này sẽ được phân giải thành cluster IP được gán cho Service.

Kubernetes cũng hỗ trợ bản ghi DNS SRV cho port được đặt tên. Nếu Service `"my-service.my-ns"` có port tên `"http"` với giao thức được thiết lập là `TCP`, bạn có thể truy vấn DNS SRV là `_http._tcp.my-service.my-ns` để tìm kiếm giá trị port của `"http"`, cũng như địa chỉ IP.

Sử dụng server DNS Kubernetes là cách duy nhất để truy cập Service `ExternalName`.
Bạn có thể tìm thêm thông tin về phân giải `ExternalName` trong [DNS Pods and Services](/docs/concepts/services-networking/dns-pod-service/).

## Headless Services

Thỉnh thoảng bạn không cần cần bằng tải và một IP Service duy nhất. Trong trường hợp này, bạn cần tạo cái gọi là “headless” Service, bằng cách chỉ định rõ `"None"` cho cluster IP (`.spec.clusterIP`).

Bạn có thể sử dụng một headless Service để giao tiếp với cơ chế service discovery khác, mà không bị ràng buộc với việc hiện thực của Kubernetes.

Đối với headless `Services`, cluster IP không được cấp, kube-proxy không xử lý các Service này và không có cần bằng tải hay proxy được thực hiện bởi nền tảng cho chúng. Các DNS được cấu hình tự động phụ thuộc liệu Service có các selector được định nghĩa hay không:

### Có selector

Đối với các headless Service mà định nghĩa selector, bộ điều khiển endpoint sẽ tạo các bản ghi `Endpoints` trong API, và sửa đối cấu hình DNS để trả về các bản ghi (địa chỉ) mà trỏ trực tiếp vào `Pods` đứng sau `Service`.

### Không có selectors

Đối với các headless Service mà không định nghĩa selector, bộ điều khiển endpoint sẽ không tạo bản ghi `Endpoints`. Tuy nhiên hệ thống DNS sẽ tìm kiếm và cấu hình hoặc:

  * Bản ghi CNAME cho Service [`ExternalName`](#externalname)-type.
  * Một bản ghi cho bất kỳ `Endpoints` mà chia sẻ tên nào với Service cho tất cả các loại khác.

## Publishing Services (ServiceTypes) {#publishing-services-service-types}

Đối với một số phần trong ứng dụng của bạn (ví dụ, frontends) bạn có thể muốn đưa một Service lên một địa chỉ IP ngoài, nằm ngoài cụm của bạn.

Kubernetes `ServiceTypes` cho phép bạn chỉ ra loại Service nào bạn muốn. Mặc định là `ClusterIP`

Giá trị `Type` và hành vi của chúng là:

   * `ClusterIP`: Để lộ Service với một cluster-internal IP. Chọn giá trị này sẽ khiến Service chỉ có thể truy cập từ trong cụm. Đây là `ServiceType` mặc định.
   * [`NodePort`](#nodeport): Đệ lộ Service với IP của mỗi Node với một port cố định (`NodePort`). Một Service `ClusterIP`, thứ để Service `NodePort` định tuyến, sẽ tự động được tạo. Bạn có thể liên lạc với Service `NodePort` từ ngoài cụm, bằng  `<NodeIP>:<NodePort>`.
   * [`LoadBalancer`](#loadbalancer): Đệ lộ Service ra bên ngoài bằng cách sử dụng bộ cân bằng tải của nhà cung cấp dịch vụ đám mây. Service `NodePort` và `ClusterIP`, để định tuyến cho cần bằng tải bên ngoài, sẽ được tạo tự động.
   * [`ExternalName`](#externalname): Ánh xạ Service tới nội dung của trường `externalName` (ví dụ `foo.bar.example.com`), bằng việc trả về bản ghi `CNAME` với giá trị của nó. Không có proxy của bất kỳ loại nào được thiết lập.

     {{< note >}}
     Bạn cần CoreDNS version 1.7 hoặc cao hơn để sử dụng loại `ExternalName`.
     {{< /note >}}

Bạn cũng có thể sử dụng [Ingress](/docs/concepts/services-networking/ingress/) để đưa ra Service của mình. Ingress không phải là một loại Service, nhưng chúng hành động như điểm đầu vào cụm. Nó cho phép bạn hợp nhất các quy tắc định tuyến thành một tài nguyên duy nhất vì nó có thể đưa ra nhiều service dưới cùng một địa chỉ IP.

### Loại NodePort {#nodeport}

Nếu bạn thiết lập trường `type` là `NodePort`, Kubernetes control plane sẽ phân bổ một cổng từ phạm vi được chỉ định bởi cờ `--service-node-port-range` (mặc định: 30000-32767).
Mỗi Node sẽ truyền lưu lượng từ port (cùng một giá trị port trên mọi Node) tới Service của bạn.
Service của bạn thể hiện port đã phân bổ trong trường `.spec.ports[*].nodePort` của nó.


Nếu bạn muốn chỉ định (các) IP cụ thể để proxy, bạn có thể thiết lập cờ `--nodeport-addresses` trong kube-proxy thành (các) khối IP cụ thể; điều này được hỗ trợ từ Kubernetes v1.10.
Cờ này lấy danh sách các khối IP được phân cách bởi dấu phẩy (ví dụ 10.0.0.0/8, 192.0.2.0/25) để chỉ ra giải địa chỉ IP mà kube-proxy nên coi là cục bộ cho node này.

Ví dụ, nếu bạn khởi chạy kube-proxy với cờ `--nodeport-addresses=127.0.0.0/8`, kube-proxy chỉ chọn interface loopback cho Service NodePort. Mặc định `--nodeport-addresses` là một danh sách trống. Điều này có nghĩa là kube-proxy sẽ lấy tất cả các interface cõ sẵn cho NodePort. Điều đó cũng tương thích với các bản phát hành Kubernetes trước đó.

Nếu bạn muốn chỉ ra cổng cụ thể, bạn có thể chi ra giá trị trong trường `nodePort`.
Control plane sẽ hoặc phân bổ cho bạn cổng đó hoặc thông báo rằng yêu cầu API không thành công.
Điều này có nghĩa là bạn cần quan về việc xung đột port có thể xảy ra.
Bạn cũng phải sử dụng một giá trị port hợp lệ, trong phạm vi được cấu hình để NodePort sử dụng.

Sử dụng một NodePort cho phép bạn tự do thiết lập giải pháp cân bằng tải của riêng mình, để cấu hình môi trường mà không hỗ trợ đầy đủ bởi Kubernetes, hoặc thậm chí chỉ đưa ra một hoặc nhiều IP của node một cách trực tiếp.

Chú ý rằng Service này thì đưa ra dưới dạng `<NodeIP>:spec.ports[*].nodePort` và `.spec.clusterIP:spec.ports[*].port`.
(Nếu cờ `--nodeport-addresses` trong kube-proxy được thiết lập, <NodeIP> sẽ được thay bằng một hoặc nhiều NodeIP).

### Loại LoadBalancer {#loadbalancer}

Trên các nhà cung cấp dịch vụ đám mây hỗ trợ cân bằng tải, thiết lập trường `type` là `LoadBalancer` sẽ cung cấp một cân bằng tải cho Service của bạn. Việc tạo bộ cân bằng tải thực tế xảy ra không đồng bộ, và thông tin về cân bằng tải dược cung cấp được hiển thị trong trường `.status.loadBalancer`.
Ví dụ:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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

Lưu lượng từ cân bằng tải bên ngoài sẽ được chuyển hướng tới các Pod đằng sau. Nhà cung cấp dịch vụ đám mây quyết định cách nó được cân bằng tải.


Một vài nhà cung cấp dịch vụ đám mây cho phép bạn chỉ ra `loadBalancerIP`. Trong trường hợp này, cân bằng tải được tạo với `loadBalancerIP` do người dùng chỉ ra. Nếu `loadBalancerIP` không được chỉ ra, cân bằng tải sẽ thiết lập với một địa chỉ IP tạm thời. Nếu bạn chỉ ra `loadBalancerIP` nhưng nhà cung cấp dịch vụ đám mây không hỗ trợ tính năng này, trường `loadBalancerIP` bạn thiết lập sẽ được bỏ qua.

{{< note >}}
Nếu bạn đang sử dụng SCTP, xem thêm [caveat](#caveat-sctp-loadbalancer-service-type) bên dưới về loại Service `LoadBalancer`.
{{< /note >}}

{{< note >}}

Trên **Azure**, nếu bạn muốn sử dụng một public `loadBalancerIP` do bạn chỉ ra, trước tiên bạn cần tạo tài nguyên địa chỉ IP public tĩnh. Tài nguyên địa chỉ IP public này phải nằm trong cùng nhóm tài nguyên của các tài nguyên được tạo tự động cho cụm.
Ví dụ, `MC_myResourceGroup_myAKSCluster_eastus`.

Chỉ định địa chỉ IP được gán cho loadBalancerIP. Đảm bảo rằng bạn phải cập nhật securityGroupName trong tệp cấu hình nhà cung cấp dịch vụ đám mây. Thông tin về vấn đề quyền `CreatingLoadBalancerFailed` xử lý sự cố xem, [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](https://docs.microsoft.com/en-us/azure/aks/static-ip) hoặc [CreatingLoadBalancerFailed on AKS cluster with advanced networking](https://github.com/Azure/AKS/issues/357).

{{< /note >}}

#### Internal load balancer
Trong môi trường hỗn hợp đôi khi cần định tuyến lưu lượng từ Service bên trong cùng khối địa chỉ mạng (ảo).

Trong môi trường DNS chia đôi bạn sẽ cần hai Service để có thể định tuyến cả lưu lượng bên ngoài và bên trong tới endpoint của mình.

Bạn có thể đạt được điều này bằng việc thêm một annotation vào Service. Annotation để thêm phụ thuộc vào nhà cung cấp dịch vụ đám mây bạn đang sử dụng.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Chọn một trong các tab.
{{% /tab %}}
{{% tab name="GCP" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```
{{% /tab %}}
{{% tab name="AWS" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="Azure" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="OpenStack" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```
{{% /tab %}}
{{% tab name="Baidu Cloud" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```
{{% /tab %}}
{{< /tabs >}}


#### Hỗ trợ TLS trên AWS {#ssl-support-on-aws}

Đối với TLS / SSL một phần trên các cụm chạy trên AWS, bạn có thể thêm 3 annotation vào service `LoadBalancer`:

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

Đầu tiên chỉ ra ARN của chứng chỉ để sử dụng. Nó có thể là một chứng chỉ từ nhà phát hành thứ ba được tải lên IAM hoặc được tạo trong AWS Certificate Manager.

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

Annotaion thứ hai chỉ ra giao thực mà Pod nói chuyện. Đối với HTTPS và SSL, ELB cần Pod để xác thực chính nó qua kết nối được mã hóa, sử dụng chứng chỉ.

HTTP và HTTPS sẽ chọn proxy layer 7: ELB hoàn thành kết nối với người dùng, phân tích header và thêm vào header `X-Forwarded-For` với địa chỉ IP của người dùng (Pod chỉ thấy địa chỉ IP của ELB ở đầu kia của kết nối) khi chuyển tiếp yêu cầu.

TCP và SSL sẽ chọn proxy layer 4: ELB chuyển tiếp traffic mà không chỉnh sửa header.

Trong môi trường sử dụng hỗn hợp nơi một số port được bảo mật và một số khác không được mã hóa, bạn có thể sử dụng annotaion sau:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

Trong ví dụ trên, nếu Service chưa ba cổng `80`, `443`, và `8443`, thì `443` và `8443` sẽ sử dụng chứng chỉ SSL, nhưng 80 sẽ chỉ được proxy với HTTP.

Từ Kubernetes v1.9 trở đi, bạn có thể sử dụng [predefined AWS SSL policies](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) với lắng nghe HTTPS hoặc SSL cho Service của mình. Để xem những chính sách nào có sẵn để sử dụng, bạn có thể sử dụng công cụ command line `aws`.

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

Bạn có thể chỉ ra một chính sách bất kì bằng cách sử dụng annotation
"`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`"; ví dụ:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### Hỗ trợ giao thức PROXY trên AWS

Để bật [giao thức PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
hỗ trợ cho cụm chạy trên AWS, bạn có thể sử dụng service annotation sau:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Kể từ phiên bản 1.3.0, việc sử dụng annotation này áp dụng cho tất cả các port được proxy bởi ELB và không thể được cấu hình theo cách khác.

#### Logs truy cập ELB trên AWS

Có một vài annotation để quản lý việc log truy cập cho dịch vụ ELB trên AWS.

Annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled` kiểm soát liệu log truy cập có được bật hay không.

Annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval` kiểm soát khoảng thời gian theo phút để publish log truy cập. Bạn có thể chỉ ra một khoảng thời gian là 5 hoặc 60 phút.

Annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name` kiểm soát tên của Amazon S3 bucket lưu trữ log truy cập.

Annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix` chỉ ra phân cấp logic bạn đã tạo cho Amazon S3 bucket của mình.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # Specifies whether access logs are enabled for the load balancer
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # The interval for publishing the access logs. You can specify an interval of either 5 or 60 (minutes).
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # The name of the Amazon S3 bucket where the access logs are stored
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod`
```

#### Connection Draining trên AWS

Connection draining cho Classic ELBs có thể được quản lý với annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` được đặt là 
`"true"`. Annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` cũng có thể được sử dụng để đặt thời gian tối đa, theo giây, giữ cho các kết nối hiện có mở trước khi hủy đăng ký các instance.


```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### Annotation ELB khác

Có các annotation khác để quản lý Classic Elastic Load Balancers được mô tả bên dưới.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
        # Thời gian, theo giây, mà kết nối được cho phép idle (không có dữ liệu được gửi qua kết nối) tước khi nó bị đóng bởi cân bằng tải

        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        # Chỉ ra liệu cân bằng tải cross-zone được bật hay không

        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
        # Một danh sách phân tách bằng dấu phẩy các ket-value mà sẽ được ghi lại như thẻ bổ sung trong ELB.

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
        # Số lượng health check thành công liên tục được yêu cầu để một backend được coi là khỏe mạnh.
        # Mặc định là 2, phải giữa 2 và 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
        # Số lượng health check thất bại được yêu cầu để một backend được coi là không khỏe mạnh.
        # Mặc định là 6, phải giữa 2 và 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
        # Khoảng thời gian xấp xỉ, theo giây, giữa các lần health check của một instance
        # Mặc định là 10, phải giữa 5 và 300

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
        # Thời gian, theo giây, mà trong đó không có phản hồi nghĩa là health check thất bại.
        # Giá trị này phải ít hơn giá trị service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
        # Mặc định là 5, phải giữa 2 và 60

        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
        # Một danh sách các security group để thêm vào ELB
```

#### Network Load Balancer support trên AWS {#aws-nlb-support}

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

Để sử Network Load Balancer trên AWS, sử dụng annotation `service.beta.kubernetes.io/aws-load-balancer-type` với giá trị là `nlb`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{< note >}}
NLB chỉ làm hoạt động với các loại instance nhất định; xem [AWS documentation](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets) về Elastic Load Balancing để biết danh sách các loại instance hỗ trợ.
{{< /note >}}

Không như Classic Elastic Load Balancers, Network Load Balancers (NLBs) chuyển tiếp địa chỉ IP của client qua tới node. Nếu `.spec.externalTrafficPolicy` của một Service được đặt là `Cluster`, địa chỉ IP của client sẽ không được truyền đến các Pod đầu cuối.

Bằng việc thiết lập `.spec.externalTrafficPolicy` là `Local`, địa chỉ IP của client sẽ được truyền đến các Pod đầu cuối, nhưng có thể dẫn đến phân phối lưu lượng không đồng đều. Node mà không có bất kì Pod nào cho một Service LoadBalancer cụ thể sẽ thất bại trong việc health check của NLB Target Group với `.spec.healthCheckNodePort` tự động được gán và không nhận bất kỳ traffic.

Để đạt được traffic đồng đều, hãy sử dụng DaemonSet, hoặc chỉ định một [pod anti-affinity](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) để không đặt trên cùng một node.

Bạn cũng có thể sử dụng NLP Service với  [internal load balancer](/docs/concepts/services-networking/service#internal-load-balancer) annotation.

Để traffic client đến các instance phía sau một NLB, security groups của Node được sửa đổi với các quy tắc IP sau:

| Rule | Protocol | Port(s) | IpRange(s) | Mô tả IpRange |
|------|----------|---------|------------|---------------------|
| Health Check | TCP | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | VPC CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| Client Traffic | TCP | NodePort(s) | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTU Discovery | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

Để giới hạn IP client có thể truy cập Network Load Balancer, chỉ định `loadBalancerSourceRanges`.

```yaml
spec:
  loadBalancerSourceRanges:
    - "143.231.0.0/16"
```

{{< note >}}
Nếu `.spec.loadBalancerSourceRanges` không được thiết lập, Kubernetes cho phép traffic từ `0.0.0.0/0` tới Node Security Group(s). Nếu node có địa chỉ IP public, hãy lưu ý rằng traffic không phải của NLP cũng có thể tới tất cả các instance trong security group đã sửa đổi đó.
{{< /note >}}

### Loại ExternalName {#externalname}

Service loại ExternalName ánh xạ một Service tới một DNS name, không phải tới một selector thông thường như `my-service` or `cassandra`. Bạn sẽ chỉ định những Service này với tham số `spec.externalName`.
Services of type ExternalName map a Service to a DNS name, not to a typical selector such as
`my-service` or `cassandra`. You specify these Services with the `spec.externalName` parameter.

Định nghĩa Service này, ví dụ, ánh xạ Service `my-service` trong namespace `prod` tới `my.database.example.com`:

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
ExternalName chấp nhận một chuỗi địa chỉ IPv4, nhưng như một DNS name bao gồn các con số, không phải một địa chỉ IP. ExternalNames giống với địa chỉ IPv4 mà không được phân giải bởi CoreDNS hoặc ingress-nginx bởi vì ExternalName được dùng để chỉ ra một canonical DNS name. Để hardcode một địa chỉ IP, xem xét sử dụng [headless Services](#headless-services).
{{< /note >}}

Khi tra cứu `my-service.prod.svc.cluster.local`, cluster DNS Service trả về một bản ghi `CNAME` với giá trị `my.database.example.com`. Truy cập `my-service` hoạt động theo cách tương tự Service khác nhưng với sự khác biệt quan trọng là việc chuyển hướng xảy ra ở cấp DNS thay vì thông qua proxy hoặc forward. Nếu sau này bạn quyết định chuyển cơ sở dữ liệu của mình vào cụm, bạn có thể khởi động Pod của nó, thêm các selector và endpoint thích hợp, và thay đổi `type` Service.

{{< warning >}}
Bạn có thể gặp khó khăn khi sử dụng ExternalName cho một số giao thức phổ biến, bao hồm HTTP và HTTPS. Nếu bạn sử dụng ExternalName thì hostname được sử dụng bởi client bên trong cụm của bạn sẽ khác với tên mà ExternalName tham chiếu.

Đối với các giao thức sử dụng hostname, sự khác biệt này có thể dẫn đến lỗi hoặc phản hồi không mong muốn. HTTP request sẽ có một header `Host:` mà server gốc không nhận ra; server TLS sẽ không thể cung cấp chứng chỉ khớp với hostname mà client kết nối tới.
{{< /warning >}}

{{< note >}}
Phần này được nợ với [Kubernetes Tips - Part1](https://akomljen.com/kubernetes-tips-part-1/) blog từ [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### External IPs

Nếu có các external IP mà định tuyến tới một hoặc nhiều node của cluster, Kubernetes Service có thể đưa ra với `externalIPs`. Traffic vào cluster với external IP (dưới dạng IP đích), qua Service port, sẽ được chuyển đến một trong các endpoint của Service. `externalIPs` không được quản lý bởi Kubernetes và là trách nhiệm của cluster administrator.

Trong spec Service, `externalIPs` có thể được chỉ định cùng với bất kỳ `ServiceTypes`.
Trong ví dụ dưới,  `my-service` có thể được truy cập bởi client bằng `80.11.12.10:80` (`externalIP:port`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
  externalIPs:
    - 80.11.12.10
```

## Nhược điểm

Sử dụng userspace proxy cho VIPs, làm việc ở quy mô nhỏ và trung bình, nhưng sẽ không thể mở rộng rộng thành các cluster rất lớn với hàng ngàn Service. Các [Đề xuất thiết kế ban đầu cho portals](http://issue.k8s.io/1107) có thêm chi tiết về vấn đề này.

Sử dụng dụng userspace proxy che khuất địa chỉ IP nguồn của gói đang truy cập Service. Điều này làm cho một vài loại network filter (firewall) trở nên không thể. Chế độ proxy iptables không che khuất các IP nguồn trong cluster, nhưng nó vẫn tác động đến các client đi qua một cân bằng tải hoặc node-port.

Trường `Type` được thiết kế như chức năng lồng nhau - mỗi cấp thêm vào trước đó. Điều này không bắt buộc đối với tất cả các nhà cung cấp đám mây (ví dụ Google Compute Engine không cần khai báo một `NodePort` để làm `LoadBalancer` hoạt động, nhưng AWS thì có) nhưng API hiện tại yêu cầu điều đó.

## Triển khai Virtual IP {#the-gory-details-of-virtual-ips}

Thông tin vừa rồi đủ cho nhiều người chỉ muốn sử dụng Service. Tuy nhiên, có rất nhiều điều đang diễn ra đằng sau mà có thể đáng để hiểu.

### Tránh xung đột

Một trong các triết lý chính của Kubernetes là bạn không nên tiếp xúc với các tình huống mà có thể khiến hành động của bạn thất bại mà không phải lỗi do bạn. Đối với thiết kế Service, điều này có nghĩa không bắt bạn chọn giá trị cổng của mình nếu lựa chọn đó có thể xung đột với lựa chọn của người khác. Đó là một thất bại cô lập.

Để cho phép bạn chọn giá trị port cho Service của mình, chúng tổi phải đảm bảo rằng không hai Service nào có thể xung đột. Kubernetes thực hiện điều đó bằng cách phân bổ mỗi Service một địa chỉ IP cho chính nó.

Để đảm bảo mỗi Service nhận một địa chỉ IP duy nhất, một bộ cấp phát nội bộ cập nhật bảng map cấp phát toàn cục trong {{< glossary_tooltip term_id="etcd" >}} trước khi tạo từng Service. Các đối tượng map phải tồn tại trong sổ đăng ký Service, nếu không việc tạo sẽ thất bại với thông báo cho biết địa chỉ IP không thể được phân bổ.

Trong control plane, một bộ điều khiển nền chịu trách nhiệm cho việc tạo bảng map đó (cần thiết để hỗ trợ chuyển từ các phiên bản cũ hơn của Kubernetes sử dụng in-memory locking). Kubernetes cũng sử dụng bộ điều khiển để kiểm tra việc gán không hợp lệ (ví dụ do sự can thiệp của quản trị viên) và để dọn sạch các địa chỉ IP được phân bổ trong còn được sử dụng bởi bất kỳ Service nào.

### Địa chỉ IP Service {#ips-and-vips}

Không như địa chỉ IP của Pod, cái mà thực sử được định tuyến đến một đích cố định, Service IP không thực được trả lời bởi một host duy nhất. Thay vào đó, kube-proxy sử dụng iptables (xử lý gói trong Linux) để xác định địa chỉ IP _virtual_ được chuyển hướng trong suốt khi cần. Khi client kết nối tới VIP, traffic của họ sẽ tự động chuyển đến endpoint thích hợp. Các biến môi trường và DNS cho Service thực sự được xác định theo địa chỉ ảo (và port) của Service.

kube-proxy hỗ trợ ba chế độ proxy gồm userspace, iptables và IPVS, với mỗi chế độ có cách hoạt động khá khác nhau.

#### Userspace

Ví dụ, xem xét một ứng dụng xử lý ảnh mô tả ở trên. Khi Service được tạo, Kubernetes master gán một địa chỉ IP ảo, ví dụ 10.0.0.1. Giá sử Service port là 1234, Service được quan sát bởi tất các kube-proxy trong cluster. Khi một proxy thấy một Service mới, nó sẽ mở một port ngẫu nhiên mới, thiết lập một chuyển hướng bằng iptables từ địa chỉ IP ảo tới port mới này, và bắt đầu chấp nhận các kết nối trên đó.

Khi một client kết nối tới địa chỉ IP ảo của Service, iptables rule sẽ khởi động và chuyển hướng các gói tin đến cổng riêng của proxy. Service proxy chọn một backend, và bắt đầu chuyển traffic từ client tới backend.

Điều này có nghĩa là chủ sở hữu Service có thể chọn bất kỳ cổng nào họ muốn mà không có nguy cơ xung đột. Client có thể kết nối đơn giản tới một IP và port, mà không cần biết Pod nào họ thực sự kết nối.

#### iptables

Một lần nữa, hãy xem xét ứng dụng xử lý ảnh mô tả ở trên. Khi Service được tạo, Kubernetes control plane gán một địa chỉ IP ảo, ví dụ 10.0.0.1. Giả  sử Service port là 1234, Service được quản sát bởi tất cả các kube-proxy trong cluster. Khi mootj proxy thấy một Service mới, nó sẽ cài đặt một loạt các quy tắt iptables chuyển hướng từ địa chỉ IP ảo sang các quy tắc của mỗi Service. các quy tắc của mỗi Service liên kết với các quy tắc mỗi Endpoint để chuyển hướng trafic (sử dụng NAT đích) tới backend.

Khi một client kết nối tới địa chỉ IP ảo của Service, các iptables rule sẽ khởi động. Một backend được chọn (hoặc dựa trên session affinity hoặc ngẫu nhiên) và các gói tin được chuyển đến backend. Không như userspace proxy, gói tin không bao giờ được sao chép vào userspace, kube-proxy không phải chạy để địa chỉ IP ảo hoạt động, và Node có traffic đến từ địa chỉ IP client không bị sửa đổi.

Luồng cơ bản này cũng thực hiện khi traffic đến thông qua node-port hoặc thông qua một load-balancer, mặc dù trong những trường hợp đó IP client đã bị thay đổi.

#### IPVS

Hoạt động của iptables chậm lại đáng kể trong cụm quy mô lớn, ví dụ 10.000 Service. IPVS được thiết kế để cân bằng tải và dựa trên các bảng băm trong kernel. Vì vậy, bạn có thể đạt được sự thống nhất về hiệu suất với số lượng lớn Service từ kube-proxy dựa trên IPVS. Trong khi đó, kube-proxy dựa trên IPVS có các thuật toán cân bằng tải tinh vi hơn (least conns, locality, weighted, persistence).

## API Object

Service là tài nguyên cấp cao nhất trong API REST của Kubernetes. Bạn có thể tìm thêm chi tiết về đối tượng API tại: [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Các giao thức được hỗ trợ {#protocol-support}

### TCP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Bạn có thể sử dụng TCP cho bất kỳ loại Dịch vụ nào và đó là giao thức mạng mặc định.

### UDP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Bạn có thể sử dụng UDP cho hầu hết các Dịch vụ. Đối với Service type=LoadBalancer, hỗ trợ UDP phụ thuộc vào nhà cung cấp đám mây.

### HTTP

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Nếu nhà cung cấp đám mây của bạn hỗ trợ nó, bạn có thể sử dụng Dịch vụ ở chế độ LoadBalancer để thiết lập reverse proxy HTTP/HTTPS bên ngoài, được chuyển tiếp đến Endpoints của Dịch vụ.

{{< note >}}
Bạn cũng có thể sử dụng {{< glossary_tooltip term_id="ingress" >}} thay thế cho Service để expose HTTP/HTTPS Services.
{{< /note >}}

### Giao thức PROXY

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Nếu nhà cung cấp đám mây của bạn hỗ trợ (ví dụ, [AWS](/docs/concepts/cluster-administration/cloud-providers/#aws)),
bạn có thể sử dụng Dịch vụ ở chế độ LoadBalancer để định cấu hình bộ cân bằng tải bên ngoài Kubernetes, điều đó sẽ chuyển tiếp các kết nối có tiền tố với
[giao thức PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

Bộ cân bằng tải sẽ gửi một loạt các octet ban đầu mô tả kết nối đến, tương tự như ví dụ này

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
theo sau là dữ liệu từ client.

### SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}
Kubernetes hỗ trợ SCTP như một giá trị `protocol` trong các định nghĩa Service, Endpoint, NetworkPolicy và Pod dưới dạng một tính năng alpha. Để kích hoạt tính năng này, quản trị viên cluster cần kích hoạt `SCTPSupport` trên apiserver, ví dụ, `--feature-gates=SCTPSupport=true,…`.

Khi được bật, bạn có thể đặt trường `protocol` của Service, Endpoint, NetworkPolicy hoặc Pod thành `SCTP`. Kubernetes thiết lập mạng phù hợp theo các hiệp hội SCTP, giống như kết nối TCP.

#### Cảnh báo {#caveat-sctp-overview}

##### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

{{< warning >}}
Sự hỗ trợ của các hiệp hội SCTP đa dạng đòi hỏi plugin CNI có thể hỗ trợ việc gán nhiều interfaces và địa chỉ IP cho một Pod.

NAT cho các hiệp hội SCTP đa dạng đòi hỏi logic đặc biệt trong các kernel module tương ứng.
{{< /warning >}}

##### Service với type=LoadBalancer {#caveat-sctp-loadbalancer-service-type}

{{< warning >}}
Bạn chỉ có thể tạo Servicevới `type` LoadBalancer cộng với `protocol` SCTP nếu hiện thực bộ cân bằng tải của nhà cung cấp đám mây hỗ trợ SCTP làm giao thức. Nếu không, yêu cầu tạo dịch vụ bị từ chối. Tập hợp các nhà cung cấp cân bằng tải đám mây hiện tại (Azure, AWS, CloudStack, GCE, OpenStack) đều thiếu hỗ trợ cho SCTP.
{{< /warning >}}

##### Windows {#caveat-sctp-windows-os}

{{< warning >}}
SCTP không hỗ trợ các node Windows.
{{< /warning >}}

##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
Kube-proxy không hỗ trợ quản lý SCTP khi nó ở chế dộ userspace.
{{< /warning >}}

## Công việc trong tương lai

Trong tương lai, chính sách proxy cho Dịch vụ có thể trở nên đa sắc thái hơn so với cân bằng vòng tròn đơn giản, ví dụ như master-elected hoặc được sharded. Chúng tôi cũng hình dung rằng một số Service sẽ có bộ cân bằng tải thực tế, trong trường hợp đó, địa chỉ IP ảo sẽ chỉ vận chuyển các gói ở đó.

Dự án Kubernetes dự định cải thiện hỗ trợ cho Service L7 (HTTP).

Dự án Kubernetes dự định sẽ có các chế độ ingress linh hoạt hơn cho các Service bao gồm các chế độ ClusterIP, NodePort và LoadBalancer hiện tại và hơn thế nữa.


{{% /capture %}}

{{% capture whatsnext %}}

* Đọc [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
* Đọc về [Ingress](/docs/concepts/services-networking/ingress/)
* Đọc về [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/)

{{% /capture %}}

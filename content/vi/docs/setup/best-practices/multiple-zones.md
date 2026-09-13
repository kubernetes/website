---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Chạy trong nhiều zone
weight: 20
content_type: concept
---

<!-- overview -->

Trang này mô tả cách chạy Kubernetes trên nhiều zone.

<!-- body -->

## Bối cảnh

Kubernetes được thiết kế sao cho một cluster Kubernetes duy nhất có thể chạy
trên nhiều failure zone, thường là khi các zone này nằm trong một nhóm logic
được gọi là _region_. Các nhà cung cấp cloud lớn định nghĩa region là một tập
hợp các failure zone (còn được gọi là _availability zone_) cung cấp một bộ
tính năng nhất quán: trong một region, mỗi zone cung cấp cùng các API và
service như nhau.

Các kiến trúc cloud điển hình hướng tới việc giảm thiểu khả năng xảy ra sự cố
ở một zone cũng làm ảnh hưởng đến các service ở zone khác.

## Hành vi của control plane

Tất cả các [thành phần control plane](/docs/concepts/architecture/#control-plane-components)
đều hỗ trợ chạy như một pool các tài nguyên có thể thay thế cho nhau, được
nhân bản theo từng thành phần.

Khi bạn triển khai control plane của cluster, hãy đặt các bản sao của các
thành phần control plane trên nhiều failure zone. Nếu tính sẵn sàng là mối
quan tâm quan trọng, hãy chọn ít nhất ba failure zone và nhân bản từng thành
phần control plane riêng lẻ (API server, scheduler, etcd, cluster controller
manager) trên ít nhất ba failure zone. Nếu bạn đang chạy một cloud controller
manager thì bạn cũng nên nhân bản nó trên tất cả các failure zone mà bạn đã chọn.

{{< note >}}
Kubernetes không cung cấp khả năng chịu lỗi liên zone (cross-zone resilience)
cho các endpoint của API server. Bạn có thể sử dụng nhiều kỹ thuật khác nhau
để cải thiện tính sẵn sàng cho API server của cluster, bao gồm DNS round-robin,
bản ghi SRV, hoặc một giải pháp cân bằng tải của bên thứ ba có kiểm tra tình
trạng (health checking).
{{< /note >}}

## Hành vi của Node

Kubernetes tự động phân tán các Pod cho các workload resource (chẳng hạn như
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}
hoặc {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
trên các node khác nhau trong một cluster. Việc phân tán này giúp
giảm tác động của các sự cố.

Khi các node khởi động, kubelet trên mỗi node tự động thêm
{{< glossary_tooltip text="label" term_id="label" >}} vào đối tượng Node
đại diện cho kubelet cụ thể đó trong Kubernetes API.
Các label này có thể bao gồm
[thông tin zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

Nếu cluster của bạn trải rộng trên nhiều zone hoặc region, bạn có thể dùng các
node label kết hợp với
[ràng buộc phân tán topology của Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
để kiểm soát cách các Pod được phân tán trên cluster của bạn giữa các fault
domain: region, zone, và thậm chí cả các node cụ thể.
Những gợi ý này cho phép
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} đặt
các Pod để có tính sẵn sàng dự kiến tốt hơn, giảm rủi ro một lỗi có tương quan
ảnh hưởng đến toàn bộ workload của bạn.

Ví dụ, bạn có thể đặt một ràng buộc để đảm bảo rằng
3 bản sao của một StatefulSet đều chạy ở các zone khác nhau,
bất cứ khi nào điều đó khả thi. Bạn có thể định nghĩa điều này một cách khai
báo (declaratively) mà không cần chỉ rõ những availability zone nào đang được
dùng cho từng workload.

### Phân phối các node trên các zone

Phần lõi của Kubernetes không tạo node thay cho bạn; bạn cần tự làm việc đó,
hoặc dùng một công cụ như [Cluster API](https://cluster-api.sigs.k8s.io/) để
quản lý các node thay cho bạn.

Sử dụng các công cụ như Cluster API, bạn có thể định nghĩa các tập hợp máy
chạy như các worker node cho cluster của bạn trên nhiều failure domain, cùng
các quy tắc để tự động khôi phục cluster trong trường hợp toàn bộ zone bị gián
đoạn dịch vụ.

## Gán zone thủ công cho Pod

Bạn có thể áp dụng [các ràng buộc node selector](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
cho các Pod mà bạn tạo, cũng như cho các Pod template trong các workload
resource như Deployment, StatefulSet, hoặc Job.

## Truy cập storage cho các zone

Khi các persistent volume được tạo, Kubernetes tự động thêm các zone label
vào bất kỳ PersistentVolume nào được liên kết với một zone cụ thể.
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} sau đó đảm bảo,
thông qua predicate `NoVolumeZoneConflict` của nó, rằng các pod có claim một
PersistentVolume nhất định chỉ được đặt vào cùng zone với volume đó.

Xin lưu ý rằng phương thức thêm zone label có thể phụ thuộc vào nhà cung cấp
cloud của bạn và storage provisioner mà bạn đang sử dụng. Hãy luôn tham khảo
tài liệu cụ thể cho môi trường của bạn để đảm bảo cấu hình đúng.

Bạn có thể chỉ định một {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
cho các PersistentVolumeClaim để chỉ rõ các failure domain (zone) mà
storage trong class đó có thể sử dụng.
Để tìm hiểu về cách cấu hình một StorageClass nhận biết được các failure domain
hoặc zone, xem [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Mạng

Bản thân Kubernetes không bao gồm networking nhận biết zone. Bạn có thể dùng một
[network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
để cấu hình networking cho cluster, và giải pháp mạng đó có thể có những yếu tố
đặc thù theo zone. Ví dụ, nếu nhà cung cấp cloud của bạn hỗ trợ Service với
`type=LoadBalancer`, load balancer có thể chỉ gửi traffic đến các Pod chạy trong
cùng zone với phần tử load balancer đang xử lý một kết nối nhất định.
Hãy kiểm tra tài liệu của nhà cung cấp cloud để biết chi tiết.

Đối với các triển khai tùy chỉnh hoặc tại chỗ (on-premises), những cân nhắc
tương tự cũng được áp dụng.
Hành vi của {{< glossary_tooltip text="Service" term_id="service" >}} và
{{< glossary_tooltip text="Ingress" term_id="ingress" >}}, bao gồm việc xử lý
các failure zone khác nhau, thực sự thay đổi tùy thuộc vào cách cluster của bạn
được thiết lập cụ thể.

## Khôi phục sau sự cố

Khi bạn thiết lập cluster, bạn cũng có thể cần xem xét liệu và bằng cách nào
thiết lập của bạn có thể khôi phục service nếu tất cả các failure zone trong
một region ngừng hoạt động cùng lúc. Ví dụ, bạn có đang phụ thuộc vào việc có
ít nhất một node có thể chạy Pod trong một zone hay không?  
Hãy đảm bảo rằng bất kỳ công việc sửa chữa nào quan trọng với cluster đều không
phụ thuộc vào việc có ít nhất một node khỏe mạnh trong cluster của bạn. Ví dụ:
nếu tất cả các node đều không khỏe mạnh, bạn có thể cần chạy một Job sửa chữa
với một {{< glossary_tooltip text="toleration" term_id="toleration" >}} đặc biệt
để việc sửa chữa có thể hoàn tất đủ để đưa ít nhất một node vào hoạt động.

Kubernetes không đưa ra câu trả lời cho thách thức này; tuy nhiên, đây là điều
đáng để cân nhắc.

## {{% heading "whatsnext" %}}

Để tìm hiểu cách scheduler đặt các Pod trong một cluster, tuân theo các ràng
buộc đã cấu hình, hãy truy cập [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).
---
title: Vận hành Kubernetes trên nhiều vùng
weight: 20
content_type: concept
---

<!-- overview -->

Trang này mô tả cách vận hành Kubernetes trên nhiều vùng khác nhau.

<!-- body -->

## Tổng quan

Kubernetes được thiết kế để một cluster Kubernetes duy nhất có thể hoạt động trên nhiều vùng sự cố (failure zone), thường là khi các vùng này nằm trong một nhóm logic được gọi là _region_. Các nhà cung cấp đám mây lớn định nghĩa một region là một tập hợp các vùng sự cố (còn được gọi là _availability zone_) cung cấp một tập hợp tính năng nhất quán: trong một region, mỗi zone cung cấp cùng một API và dịch vụ.

Kiến trúc đám mây thông thường nhằm giảm thiểu khả năng sự cố ở một zone ảnh hưởng đến dịch vụ ở zone khác.

## Cách hoạt động của control plane

Tất cả [các thành phần control plane](/docs/concepts/architecture/#control-plane-components) đều hỗ trợ chạy như một nhóm tài nguyên có thể thay thế lẫn nhau, được nhân bản cho mỗi thành phần.

Khi triển khai control plane của cluster, hãy đặt các bản sao của các thành phần control plane trên nhiều vùng sự cố khác nhau. Nếu tính sẵn sàng là một yếu tố quan trọng, hãy chọn ít nhất ba vùng sự cố và nhân bản mỗi thành phần control plane riêng lẻ (API server, scheduler, etcd, cluster controller manager) trên ít nhất ba vùng sự cố. Nếu bạn đang chạy cloud controller manager, bạn cũng nên nhân bản nó trên tất cả các vùng sự cố mà bạn đã chọn.

{{< note >}}
Kubernetes không cung cấp khả năng phục hồi xuyên vùng cho các điểm truy cập API server. Bạn có thể sử dụng nhiều kỹ thuật khác nhau để cải thiện tính sẵn sàng cho API server của cluster, bao gồm DNS round-robin, bản ghi SRV, hoặc giải pháp cân bằng tải của bên thứ ba với tính năng kiểm tra sức khỏe.
{{< /note >}}

## Cách hoạt động của node

Kubernetes tự động phân tán các Pod cho các tài nguyên workload (như {{< glossary_tooltip text="Deployment" term_id="deployment" >}} hoặc {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}) trên các node khác nhau trong cluster. Việc phân tán này giúp giảm tác động của các sự cố.

Khi các node khởi động, kubelet trên mỗi node tự động thêm {{< glossary_tooltip text="labels" term_id="label" >}} vào đối tượng Node đại diện cho kubelet cụ thể đó trong Kubernetes API. Các nhãn này có thể bao gồm [thông tin về zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

Nếu cluster của bạn trải rộng trên nhiều zone hoặc region, bạn có thể sử dụng nhãn node kết hợp với [ràng buộc phân tán topology của Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/) để kiểm soát cách các Pod được phân tán trong cluster giữa các miền chịu lỗi: region, zone, và thậm chí là các node cụ thể. Những gợi ý này cho phép {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} đặt Pod để có tính sẵn sàng tốt hơn, giảm nguy cơ sự cố liên quan ảnh hưởng đến toàn bộ workload của bạn.

Ví dụ, bạn có thể thiết lập một ràng buộc để đảm bảo rằng 3 bản sao của một StatefulSet đều chạy ở các zone khác nhau, bất cứ khi nào điều đó khả thi. Bạn có thể định nghĩa điều này một cách khai báo mà không cần xác định rõ ràng zone nào đang được sử dụng cho mỗi workload.

### Phân phối node trên các zone

Phần core của Kubernetes không tự tạo node cho bạn; bạn cần tự làm điều đó, hoặc sử dụng công cụ như [Cluster API](https://cluster-api.sigs.k8s.io/) để quản lý node thay mặt bạn.

Sử dụng các công cụ như Cluster API, bạn có thể định nghĩa các tập hợp máy để chạy như các node worker cho cluster của bạn trên nhiều miền chịu lỗi khác nhau, và các quy tắc để tự động phục hồi cluster trong trường hợp gián đoạn dịch vụ toàn zone.

## Gán zone thủ công cho Pod

Bạn có thể áp dụng [ràng buộc node selector](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) cho các Pod mà bạn tạo, cũng như cho các template Pod trong các tài nguyên workload như Deployment, StatefulSet, hoặc Job.

## Truy cập lưu trữ cho các zone

Khi persistent volume được tạo, Kubernetes tự động thêm nhãn zone vào bất kỳ PersistentVolume nào được liên kết với một zone cụ thể. {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}} sau đó đảm bảo, thông qua predicate `NoVolumeZoneConflict`, rằng các pod yêu cầu một PersistentVolume cụ thể chỉ được đặt vào cùng zone với volume đó.

Lưu ý rằng phương thức thêm nhãn zone có thể phụ thuộc vào nhà cung cấp đám mây và provisioner lưu trữ mà bạn đang sử dụng. Luôn tham khảo tài liệu cụ thể cho môi trường của bạn để đảm bảo cấu hình chính xác.

Bạn có thể chỉ định một {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} cho PersistentVolumeClaim xác định các miền chịu lỗi (zone) mà lưu trữ trong lớp đó có thể sử dụng. Để tìm hiểu về cách cấu hình StorageClass nhận biết về miền chịu lỗi hoặc zone, xem [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Mạng

Tự bản thân Kubernetes không bao gồm mạng nhận biết zone. Bạn có thể sử dụng [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) để cấu hình mạng cluster, và giải pháp mạng đó có thể có các yếu tố đặc thù cho từng zone. Ví dụ, nếu nhà cung cấp đám mây của bạn hỗ trợ Service với `type=LoadBalancer`, bộ cân bằng tải có thể chỉ gửi lưu lượng đến các Pod chạy trong cùng zone với phần tử cân bằng tải xử lý kết nối cụ thể. Kiểm tra tài liệu của nhà cung cấp đám mây để biết chi tiết.

Những cân nhắc tương tự cũng áp dụng cho các triển khai tùy chỉnh hoặc on-premises. Cách hoạt động của {{< glossary_tooltip text="Service" term_id="service" >}} và {{< glossary_tooltip text="Ingress" term_id="ingress" >}}, bao gồm cả cách xử lý khi có sự cố ở các vùng khác nhau, sẽ phụ thuộc vào cách bạn thiết lập cluster.

## Khôi phục sau sự cố

Khi thiết lập cluster, bạn cũng cần cân nhắc liệu hệ thống của mình có khả năng và phương án khôi phục dịch vụ khi tất cả các vùng trong một region cùng ngừng hoạt động hay không. Ví dụ: liệu bạn có phụ thuộc vào việc phải có ít nhất một node có khả năng chạy Pod trong một vùng không?

Hãy đảm bảo rằng các công việc sửa chữa quan trọng của cluster không phụ thuộc vào việc phải có ít nhất một node hoạt động bình thường trong cluster. Ví dụ: khi tất cả các node đều không hoạt động bình thường, bạn có thể cần chạy một Job sửa chữa với một {{< glossary_tooltip text="toleration" term_id="toleration" >}} đặc biệt để đảm bảo việc sửa chữa có thể hoàn thành và đưa ít nhất một node trở lại hoạt động.

Kubernetes không cung cấp sẵn giải pháp cho thách thức này, tuy nhiên đây là điều bạn nên cân nhắc.

## {{% heading "whatsnext" %}}

Để tìm hiểu cách scheduler đặt Pod trong cluster, tuân thủ các ràng buộc đã cấu hình, hãy truy cập [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).

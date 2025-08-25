---
title: Thu gom rác (Garbage Collection)
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}} Thu gom rác cho phép dọn dẹp các tài nguyên sau:

* [Pod đã kết thúc vòng đời](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [Job đã hoàn thành](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [Đối tượng không có tham chiếu chủ sở hữu (owner reference)](#owners-dependents)
* [Container và image không còn sử dụng](/docs/concepts/architecture/nodes/#garbage-collection-of-unused-containers-and-images)
* [PersistentVolume được cấp phát động có chính sách thu hồi (reclaim policy) là Delete](/docs/concepts/storage/persistent-volumes/#delete)
* [CertificateSigningRequests (CSRs) lỗi thời hoặc đã hết hạn](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* {{<glossary_tooltip text="Node" term_id="node">}} bị xóa trong các trường hợp sau:
  * Trên cloud khi cluster sử dụng [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
  * On-premises khi cluster dùng addon tương tự cloud controller manager
* [Đối tượng Node Lease](/docs/concepts/architecture/nodes/#heartbeats)

## Quan hệ chủ sở hữu và phụ thuộc {#owners-dependents}

Nhiều đối tượng trong Kubernetes liên kết với nhau thông qua [*owner references*](/docs/concepts/overview/working-with-objects/owners-dependents/). Owner reference thông báo cho control plane biết đối tượng nào phụ thuộc vào đối tượng nào. Kubernetes sử dụng các liên kết này để control plane và các client API khác có thể dọn dẹp tài nguyên liên quan trước khi xóa đối tượng chính. Trong hầu hết trường hợp, Kubernetes quản lý các liên kết này tự động.

Mối quan hệ sở hữu khác với cơ chế [labels và selectors](/docs/concepts/overview/working-with-objects/labels/) mà một số tài nguyên cũng sử dụng. Ví dụ, một {{<glossary_tooltip text="Service" term_id="service">}} tạo ra các `EndpointSlice` sẽ sử dụng *label* để giúp control plane xác định đâu là `EndpointSlice` liên quan. Bên cạnh label, mỗi `EndpointSlice` do Service quản lý cũng có owner reference. Owner reference giúp các thành phần khác trong Kubernetes tránh can thiệp vào đối tượng mà chúng không kiểm soát.

{{< note >}}
Tham chiếu chủ sở hữu vượt namespace bị cấm theo thiết kế.

Đối tượng phụ thuộc có namespace có thể chỉ định chủ sở hữu ở phạm vi cluster hoặc trong cùng namespace. Chủ sở hữu ở cấp namespace **phải** nằm cùng namespace với đối tượng phụ thuộc. Nếu không, owner reference sẽ bị coi là không tồn tại và đối tượng phụ thuộc sẽ bị xóa khi xác minh không còn owner nào.

Đối tượng phụ thuộc ở cấp cluster chỉ được phép tham chiếu đến chủ sở hữu cũng ở cấp cluster.

Từ phiên bản v1.20+, nếu một đối tượng phụ thuộc ở cấp cluster chỉ định một chủ sở hữu thuộc loại (kind) có namespace, thì owner reference đó sẽ bị coi là không thể giải quyết và đối tượng sẽ không được thu gom rác.

Cũng từ phiên bản v1.20+, nếu trình thu gom rác (garbage collector) phát hiện một ownerReference không hợp lệ giữa các namespace, hoặc một đối tượng cấp cluster có `ownerReference` tham chiếu đến một loại tài nguyên có phạm vi namespace, sự kiện cảnh báo sẽ được ghi lại với lý do là `OwnerRefInvalidNamespace` và `involvedObject` là đối tượng không hợp lệ.

Bạn có thể kiểm tra sự kiện này bằng lệnh:
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
{{< /note >}}

## Xóa theo chuỗi phụ thuộc (cascading deletion) {#cascading-deletion}

Kubernetes sẽ kiểm tra và xóa các đối tượng không còn owner reference, chẳng hạn như các Pod còn sót lại khi bạn xóa một ReplicaSet. Khi xóa một đối tượng, bạn có thể điều khiển việc Kubernetes có tự động xóa các đối tượng phụ thuộc của nó hay không – quá trình này gọi là *cascading deletion*. Có hai loại:

* Xóa theo chuỗi phía trước (*foreground cascading deletion*)
* Xóa theo chuỗi phía sau (*background cascading deletion*)

Ngoài ra, bạn có thể điều chỉnh việc xóa các tài nguyên có owner reference thông qua {{<glossary_tooltip text="finalizer" term_id="finalizer">}}.

### Xóa theo chuỗi phía trước {#foreground-deletion}

Trong chế độ này, đối tượng chính (chủ sở hữu) được đánh dấu là *đang bị xóa* (deletion in progress). Khi đó:

* Kubernetes API server gán thời gian xóa vào trường `metadata.deletionTimestamp` của đối tượng theo thời điểm đối tượng được đánh dấu để xóa.
* API server của Kubernetes cũng gán trường `metadata.finalizers` với giá trị `foregroundDeletion`.
* Đối tượng vẫn tồn tại trong API cho đến khi hoàn tất quá trình xóa.

Sau khi đối tượng chủ sở hữu chuyển sang trạng thái *đang trong tiến trình xóa*, controller sẽ xóa các đối tượng phụ thuộc mà nó biết đến. Sau khi đã xóa tất cả các đối tượng phụ thuộc mà nó biết, controller sẽ xóa đối tượng chủ sở hữu. Lúc này, đối tượng đó không còn hiển thị trong API của Kubernetes nữa.

Trong chế độ này, chỉ các đối tượng phụ thuộc có `ownerReference.blockOwnerDeletion=true` và nằm trong bộ nhớ đệm của garbage collector mới có thể ngăn cản việc xóa chủ sở hữu. Các đối tượng không thể liệt kê hoặc theo dõi (listed/watched) được, hoặc được tạo đồng thời khi đang xóa, có thể không nằm trong bộ nhớ đệm đó.

Xem thêm: [Sử dụng foreground cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)

### Xóa theo chuỗi phía sau {#background-deletion}

Ở chế độ này, API server xóa đối tượng chủ ngay lập tức, và garbage collector sẽ xử lý phần còn lại ở chế độ nền. Nếu có finalizer, nó sẽ đảm bảo không có đối tượng nào bị xóa trước khi quá trình dọn dẹp hoàn tất.

Kubernetes mặc định sử dụng chế độ này, trừ khi bạn chọn dùng foreground deletion hoặc muốn giữ lại đối tượng phụ thuộc (orphan).

Xem thêm: [Sử dụng background cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)

### Đối tượng phụ thuộc mồ côi (Orphaned dependents)

Khi một đối tượng chủ bị xóa, nếu phụ thuộc của nó không bị xóa cùng, chúng trở thành đối tượng *mồ côi*. Theo mặc định, Kubernetes sẽ xóa các đối tượng phụ thuộc. Để thay đổi hành vi này, xem: [Xóa đối tượng chủ và giữ lại phụ thuộc](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)

## Thu gom container và image không sử dụng {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}} thực hiện thu gom Image không sử dụng mỗi 5 phút và Container không sử dụng mỗi 1 phút. Không nên dùng công cụ dọn dẹp ngoài, vì có thể làm gián đoạn logic của kubelet và xóa các container lẽ ra phải tồn tại.

Để cấu hình các tùy chọn cho việc thu gom rác các container và image không sử dụng, hãy tinh chỉnh kubelet bằng cách sử dụng một [tệp cấu hình kubelet](/docs/tasks/administer-cluster/kubelet-config-file/) và thay đổi các tham số liên quan đến thu gom rác thông qua loại tài nguyên [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

### Vòng đời của container image

Kubernetes quản lý vòng đời của tất cả các image thông qua trình quản lý image (image manager), vốn là một phần của kubelet, phối hợp với {{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}. Kubelet sẽ xem xét các giới hạn sử dụng đĩa sau đây khi đưa ra quyết định thu gom rác:"

* `HighThresholdPercent` – Ngưỡng phần trăm dung lượng đĩa cao
* `LowThresholdPercent` – Ngưỡng phần trăm dung lượng đĩa thấp

Việc sử dụng đĩa vượt quá giá trị `HighThresholdPercent` đã cấu hình sẽ kích hoạt quá trình thu gom rác, trong đó kubelet sẽ xóa các image theo thứ tự dựa trên lần sử dụng gần nhất của chúng, bắt đầu từ image cũ nhất. Kubelet sẽ tiếp tục xóa cho đến khi mức sử dụng đĩa giảm xuống dưới giá trị `LowThresholdPercent`.

#### Thu gom rác cho các image container không sử dụng {#image-maximum-age-gc}

{{< feature-state feature_gate_name="ImageMaximumGCAge" >}}

Là một tính năng beta, bạn có thể chỉ định khoảng thời gian tối đa mà một image cục bộ có thể không được sử dụng, bất kể mức sử dụng ổ đĩa. Đây là một thiết lập của kubelet mà bạn cần cấu hình riêng cho từng node.
Để cấu hình, bạn cần đặt giá trị cho trường `imageMaximumGCAge` trong tệp cấu hình kubelet.

Giá trị này được chỉ định dưới dạng {{< glossary_tooltip text="duration" term_id="duration" >}} (khoảng thời gian) theo chuẩn của Kubernetes.
Xem [duration](/docs/reference/glossary/?all=true#term-duration) trong phần chú giải thuật ngữ
để biết thêm chi tiết.

Ví dụ, bạn có thể đặt trường cấu hình này thành `12h45m`, nghĩa là 12 giờ 45 phút.

{{< note >}}
Tính năng này không theo dõi việc sử dụng image qua các lần khởi động lại của kubelet. Nếu kubelet được khởi động lại, thời gian theo dõi tuổi thọ của image sẽ bị đặt lại, khiến kubelet phải chờ toàn bộ khoảng thời gian `imageMaximumGCAge` trước khi xóa các image dựa trên tuổi của chúng.
{{< /note >}}

### Thu gom container {#container-image-garbage-collection}

Kubelet thực hiện thu gom rác các container không sử dụng dựa trên các biến sau, mà bạn có thể tùy chỉnh:

* `MinAge`: độ tuổi tối thiểu mà kubelet có thể bắt đầu thu gom một container. Có thể vô hiệu hóa bằng cách đặt giá trị là `0`.
* `MaxPerPodContainer`: số lượng tối đa container “đã chết” mà mỗi Pod có thể giữ lại. Vô hiệu hóa bằng cách đặt giá trị nhỏ hơn `0`.
* `MaxContainers`: tổng số container “đã chết” tối đa mà toàn bộ cluster có thể giữ lại. Vô hiệu hóa bằng cách đặt giá trị nhỏ hơn `0`.

Ngoài ra, kubelet cũng sẽ thu gom các container không xác định hoặc đã bị xóa, thường bắt đầu từ container cũ nhất.

`MaxPerPodContainer` và `MaxContainers` có thể xung đột với nhau trong trường hợp việc giữ lại số lượng container tối đa trên mỗi Pod (theo `MaxPerPodContainer`) vượt quá tổng số container “chết” toàn cluster (`MaxContainers`). Trong tình huống như vậy, kubelet sẽ tự động điều chỉnh `MaxPerPodContainer` để giải quyết xung đột. Trong kịch bản tệ nhất, kubelet có thể giảm `MaxPerPodContainer` xuống còn 1 và xóa các container cũ nhất.
Ngoài ra, các container thuộc về Pod đã bị xóa cũng sẽ bị xóa nếu chúng lớn tuổi hơn `MinAge`.

{{<note>}}
Kubelet chỉ thu gom các container do chính nó quản lý.
{{</note>}}

## Cấu hình thu gom rác {#configuring-gc}

Bạn có thể tinh chỉnh việc thu gom rác tài nguyên bằng cách cấu hình các tùy chọn cụ thể cho các controller quản lý những tài nguyên đó. Các trang sau đây sẽ hướng dẫn bạn cách cấu hình việc thu gom rác:

* [Cấu hình cascading deletion cho các đối tượng Kubernetes](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [Cấu hình dọn dẹp các Job đã hoàn thành](/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

* Tìm hiểu thêm về [quan hệ sở hữu của đối tượng Kubernetes](/docs/concepts/overview/working-with-objects/owners-dependents/)
* Tìm hiểu thêm về [finalizer trong Kubernetes](/docs/concepts/overview/working-with-objects/finalizers/)
* Tìm hiểu về [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) để tự động xóa các Job đã kết thúc

---
title: Bộ điều khiển
content_type: concept
weight: 30
---

<!-- overview -->

Trong robotics và tự động hóa, một _vòng điều khiển_ là
một vòng lặp không kết thúc để điều chỉnh trạng thái của hệ thống.

Đây là một ví dụ về vòng điều khiển: bộ điều nhiệt trong phòng.

Khi bạn đặt nhiệt độ, đó là việc bạn thông báo cho bộ điều nhiệt
về *trạng thái mong muốn* của bạn. Nhiệt độ thực tế của phòng là
*trạng thái hiện tại*. Bộ điều nhiệt hoạt động để đưa trạng thái hiện tại
gần hơn với trạng thái mong muốn, bằng cách bật hoặc tắt thiết bị.

{{< glossary_definition term_id="controller" length="short">}}




<!-- body -->

## Mẫu Controller

Một controller theo dõi ít nhất một loại tài nguyên Kubernetes.
Những {{< glossary_tooltip text="đối tượng" term_id="object" >}}
này có trường spec đại diện cho trạng thái mong muốn. (Các)
controller cho tài nguyên đó chịu trách nhiệm làm cho trạng thái hiện
tại đến gần hơn với trạng thái mong muốn đó.

Controller có thể tự thực hiện hành động; phổ biến hơn, trong Kubernetes,
một controller sẽ gửi thông điệp tới
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} có
tác dụng phụ hữu ích. Bạn sẽ thấy các ví dụ về điều này dưới đây.

{{< comment >}}
Một số controller tích hợp sẵn, chẳng hạn như namespace controller, hoạt động trên các đối tượng
không có spec. Để đơn giản, trang này bỏ qua việc giải thích
chi tiết đó.
{{< /comment >}}

### Điều khiển thông qua API server

{{< glossary_tooltip term_id="job" >}} controller là một ví dụ về
controller tích hợp sẵn của Kubernetes. Các controller tích hợp sẵn quản lý trạng thái bằng
cách tương tác với cluster API server.

Job là một tài nguyên Kubernetes chạy một
{{< glossary_tooltip term_id="pod" >}}, hoặc có thể là nhiều Pod, để thực hiện
một tác vụ và sau đó dừng lại.

(Một khi được [lên lịch](/docs/concepts/scheduling-eviction/), các đối tượng Pod trở thành một phần của
trạng thái mong muốn cho một kubelet).

Khi Job controller thấy một tác vụ mới, nó đảm bảo rằng, ở đâu đó
trong cluster của bạn, các kubelet trên một tập hợp các Node đang chạy đúng
số lượng Pod để hoàn thành công việc.
Job controller không tự chạy bất kỳ Pod hoặc container nào.
Thay vào đó, Job controller yêu cầu API server tạo hoặc xóa
Pod.
Các thành phần khác trong
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
hành động dựa trên thông tin mới (có Pod mới cần lên lịch và chạy),
và cuối cùng công việc được hoàn thành.

Sau khi bạn tạo một Job mới, trạng thái mong muốn là Job đó được hoàn thành.
Job controller làm cho trạng thái hiện tại của Job đó gần hơn với
trạng thái mong muốn của bạn: tạo các Pod thực hiện công việc bạn muốn cho Job đó, để
Job gần hoàn thành hơn.

Các controller cũng cập nhật các đối tượng cấu hình chúng.
Ví dụ: một khi công việc hoàn thành cho một Job, Job controller
cập nhật đối tượng Job đó để đánh dấu nó `Finished`.

(Điều này hơi giống như cách một số bộ điều nhiệt tắt đèn để
chỉ ra rằng phòng của bạn hiện đã ở nhiệt độ bạn đặt).

### Điều khiển trực tiếp

Trái ngược với Job, một số controller cần thực hiện thay đổi đối với
những thứ bên ngoài cluster của bạn.

Ví dụ, nếu bạn sử dụng vòng điều khiển để đảm bảo có
đủ {{< glossary_tooltip text="Node" term_id="node" >}}
trong cluster của bạn, thì controller đó cần thứ gì đó bên ngoài
cluster hiện tại để thiết lập các Node mới khi cần.

Các controller tương tác với trạng thái bên ngoài tìm trạng thái mong muốn từ
API server, sau đó liên lạc trực tiếp với hệ thống bên ngoài để đưa
trạng thái hiện tại phù hợp hơn.

(Thực tế có một [controller](https://github.com/kubernetes/autoscaler/)
mở rộng theo chiều ngang các node trong cluster của bạn.)

Điểm quan trọng ở đây là controller thực hiện một số thay đổi để mang lại
trạng thái mong muốn của bạn, và sau đó báo cáo trạng thái hiện tại trở lại API server của cluster.
Các vòng điều khiển khác có thể quan sát dữ liệu được báo cáo đó và thực hiện hành động riêng của chúng.

Trong ví dụ bộ điều nhiệt, nếu phòng rất lạnh thì một controller khác
cũng có thể bật máy sưởi chống đóng băng. Với các cluster Kubernetes, control
plane gián tiếp hoạt động với các công cụ quản lý địa chỉ IP, dịch vụ lưu trữ,
API nhà cung cấp đám mây và các dịch vụ khác bằng cách
[mở rộng Kubernetes](/docs/concepts/extend-kubernetes/) để thực hiện điều đó.

## Trạng thái mong muốn so với trạng thái hiện tại {#desired-vs-current}

Kubernetes có cái nhìn cloud-native về các hệ thống, và có thể xử lý
sự thay đổi liên tục.

Cluster của bạn có thể thay đổi bất kỳ lúc nào khi công việc diễn ra và
các vòng điều khiển tự động khắc phục lỗi. Điều này có nghĩa là,
có thể, cluster của bạn không bao giờ đạt đến trạng thái ổn định.

Miễn là các controller cho cluster của bạn đang chạy và có thể thực hiện
các thay đổi hữu ích, không quan trọng liệu trạng thái tổng thể có ổn định hay không.

## Thiết kế

Như một nguyên tắc thiết kế, Kubernetes sử dụng rất nhiều controller mà mỗi cái quản lý
một khía cạnh cụ thể của trạng thái cluster. Phổ biến nhất, một vòng điều khiển cụ thể
(controller) sử dụng một loại tài nguyên làm trạng thái mong muốn, và có một
loại tài nguyên khác mà nó quản lý để làm cho trạng thái mong muốn đó xảy ra. Ví dụ,
một controller cho Job theo dõi các đối tượng Job (để khám phá công việc mới) và các đối tượng Pod
(để chạy Job, và sau đó để xem khi nào công việc hoàn thành). Trong trường hợp này
thứ gì đó khác tạo ra Job, trong khi Job controller tạo Pod.

Có các controller đơn giản thay vì một tập hợp nguyên khối các vòng điều khiển
được liên kết với nhau là hữu ích. Các controller có thể thất bại, vì vậy Kubernetes được thiết kế để
cho phép điều đó.

{{< note >}}
Có thể có nhiều controller tạo hoặc cập nhật cùng loại đối tượng.
Đằng sau hậu trường, các controller Kubernetes đảm bảo rằng chúng chỉ chú ý
đến các tài nguyên được liên kết với tài nguyên điều khiển của chúng.

Ví dụ, bạn có thể có Deployment và Job; cả hai đều tạo Pod.
Job controller không xóa các Pod mà Deployment của bạn tạo ra,
bởi vì có thông tin ({{< glossary_tooltip term_id="label" text="label" >}})
mà các controller có thể sử dụng để phân biệt những Pod đó.
{{< /note >}}

## Các cách chạy controller {#running-controllers}

Kubernetes đi kèm với một tập hợp các controller tích hợp sẵn chạy bên trong
{{< glossary_tooltip term_id="kube-controller-manager" >}}. Những
controller tích hợp sẵn này cung cấp các hành vi cốt lõi quan trọng.

Deployment controller và Job controller là các ví dụ về controller
đi kèm như một phần của chính Kubernetes ("controller tích hợp sẵn").
Kubernetes cho phép bạn chạy một control plane có khả năng phục hồi, vì vậy nếu bất kỳ controller tích hợp sẵn nào
bị lỗi, một phần khác của control plane sẽ tiếp quản công việc.

Bạn có thể tìm thấy các controller chạy bên ngoài control plane, để mở rộng Kubernetes.
Hoặc, nếu bạn muốn, bạn có thể viết một controller mới của riêng mình.
Bạn có thể chạy controller của riêng bạn như một tập hợp Pod,
hoặc bên ngoài Kubernetes. Cái nào phù hợp nhất sẽ phụ thuộc vào những gì controller cụ thể đó
làm.

## {{% heading "whatsnext" %}}

* Đọc về [Kubernetes control plane](/docs/concepts/architecture/#control-plane-components)
* Khám phá một số [đối tượng Kubernetes cơ bản](/docs/concepts/overview/working-with-objects/)
* Tìm hiểu thêm về [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* Nếu bạn muốn viết controller của riêng mình, xem
  [Mẫu mở rộng Kubernetes](/docs/concepts/extend-kubernetes/#extension-patterns)
  và repository [sample-controller](https://github.com/kubernetes/sample-controller).
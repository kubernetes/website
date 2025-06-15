---
title: Những lưu ý cho cluster lớn
weight: 10
---

Một cluster là một tập hợp các {{< glossary_tooltip text="node" term_id="node" >}} (máy vật lý hoặc máy ảo) chạy các agent Kubernetes, được quản lý bởi {{< glossary_tooltip text="control plane" term_id="control-plane" >}}. Kubernetes {{< param "version" >}} hỗ trợ các cluster có tối đa 5.000 node. Cụ thể hơn, Kubernetes được thiết kế để đáp ứng *tất cả* các tiêu chí sau:

* Không quá 110 pod trên mỗi node
* Không quá 5.000 node
* Không quá 150.000 pod tổng cộng
* Không quá 300.000 container tổng cộng

Bạn có thể mở rộng cluster bằng cách thêm hoặc xóa các node. Cách thực hiện điều này phụ thuộc vào phương thức triển khai cluster của bạn.

## Hạn mức tài nguyên của nhà cung cấp đám mây {#quota-issues}

Để tránh gặp phải vấn đề về hạn mức tài nguyên của nhà cung cấp đám mây khi tạo cluster với nhiều node, bạn nên cân nhắc:

* Yêu cầu tăng hạn mức cho các tài nguyên đám mây như:
    * Số lượng máy ảo
    * CPU
    * Ổ đĩa lưu trữ
    * Địa chỉ IP đang sử dụng
    * Bộ quy tắc lọc gói tin
    * Số lượng bộ cân bằng tải
    * Mạng con
    * Luồng log
* Triển khai các node mới theo từng đợt, với thời gian nghỉ giữa các đợt, vì một số nhà cung cấp đám mây giới hạn tốc độ tạo máy ảo mới.

## Các thành phần control plane

Đối với cluster lớn, bạn cần một control plane với đủ tài nguyên tính toán và các tài nguyên khác.

Thông thường, bạn nên chạy một hoặc hai instance control plane cho mỗi vùng sự cố (failure zone), mở rộng theo chiều dọc trước, sau đó mở rộng theo chiều ngang khi việc mở rộng theo chiều dọc không còn hiệu quả.

Bạn nên chạy ít nhất một instance cho mỗi vùng sự cố để đảm bảo khả năng chịu lỗi. Các node Kubernetes không tự động điều hướng lưu lượng đến các điểm cuối control-plane trong cùng vùng sự cố; tuy nhiên, nhà cung cấp đám mây của bạn có thể có cơ chế riêng để thực hiện điều này.

Ví dụ, khi sử dụng dịch vụ cân bằng tải do nhà cung cấp đám mây quản lý, bạn cấu hình dịch vụ này để điều hướng lưu lượng phát sinh từ kubelet và Pod trong vùng sự cố _A_, và chỉ chuyển lưu lượng đó đến các máy chủ control plane cũng nằm trong vùng _A_. Nếu một máy chủ control-plane hoặc một điểm truy cập trong vùng sự cố _A_ ngừng hoạt động, điều này đồng nghĩa với việc toàn bộ lưu lượng control-plane của các node trong vùng _A_ sẽ phải đi xuyên vùng. Việc vận hành nhiều máy chủ control plane trong mỗi vùng sẽ giúp giảm khả năng xảy ra tình huống này.

### Lưu trữ etcd

Để cải thiện hiệu năng của các cluster lớn, bạn có thể lưu trữ các đối tượng Event trong một instance etcd riêng biệt và chuyên dụng.

Khi tạo cluster, bạn có thể thực hiện các bước sau (sử dụng công cụ tùy chỉnh):

* Khởi động và cấu hình thêm một instance etcd
* Cấu hình {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} để sử dụng instance này cho việc lưu trữ các event

Xem [Vận hành các cluster etcd cho Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) và [Thiết lập cluster etcd Highly Available với kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) để biết chi tiết về cách cấu hình và quản lý etcd cho cluster lớn.

## Tài nguyên cho addon

[Giới hạn tài nguyên](/docs/concepts/configuration/manage-resources-containers/) của Kubernetes giúp giảm thiểu tác động của rò rỉ bộ nhớ và các cách mà pod và container có thể ảnh hưởng đến các thành phần khác. Các giới hạn tài nguyên này áp dụng cho tài nguyên {{< glossary_tooltip text="addon" term_id="addons" >}} giống như chúng áp dụng cho các workload ứng dụng.

Ví dụ, bạn có thể đặt giới hạn CPU và bộ nhớ cho thành phần ghi log:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Giới hạn mặc định của các addon thường dựa trên dữ liệu thu thập từ kinh nghiệm chạy mỗi addon trên các cluster Kubernetes nhỏ hoặc trung bình. Khi chạy trên các cluster lớn, các addon thường tiêu thụ nhiều tài nguyên hơn so với giới hạn mặc định của chúng. Nếu một cluster lớn được triển khai mà không điều chỉnh các giá trị này, (các) addon có thể liên tục bị kill vì chúng liên tục chạm đến giới hạn bộ nhớ. Ngoài ra, addon có thể chạy nhưng với hiệu suất kém do bị giới hạn thời gian sử dụng CPU.

Để tránh gặp phải vấn đề về tài nguyên của addon trong cluster, khi tạo cluster với nhiều node, hãy cân nhắc những điều sau:

* Một số addon mở rộng theo chiều dọc - chỉ có một bản sao của addon cho toàn bộ cluster hoặc phục vụ cho một vùng sự cố. Đối với các addon này, hãy tăng yêu cầu và giới hạn khi bạn mở rộng cluster.
* Nhiều addon mở rộng theo chiều ngang - bạn thêm năng lực bằng cách chạy nhiều pod hơn - nhưng với một cluster rất lớn, bạn cũng có thể cần tăng nhẹ giới hạn CPU hoặc bộ nhớ. [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) có thể chạy ở chế độ _recommender_ để đề xuất các con số phù hợp cho yêu cầu và giới hạn.
* Một số addon chạy một bản sao trên mỗi node, được kiểm soát bởi {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}: ví dụ, một trình tổng hợp log cấp node. Tương tự như trường hợp với các addon mở rộng theo chiều ngang, bạn cũng có thể cần tăng nhẹ giới hạn CPU hoặc bộ nhớ.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` là một tài nguyên tùy chỉnh mà bạn có thể triển khai vào cluster để giúp quản lý yêu cầu và giới hạn tài nguyên cho pod.  
Tìm hiểu thêm về [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) và cách bạn có thể sử dụng nó để mở rộng các thành phần của cluster, bao gồm cả các addon quan trọng.

* Đọc về [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)

* [Addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme) giúp bạn tự động điều chỉnh kích thước các addon khi quy mô cluster thay đổi.

---
reviewers:
- davidopp
- lavalamp
title: Những lưu ý cho các cluster lớn
weight: 10
---

Một cluster là một tập hợp các {{< glossary_tooltip text="nodes" term_id="node" >}} (máy
vật lý hoặc máy ảo) đang chạy các agent của Kubernetes, được quản lý bởi
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} hỗ trợ các cluster lên tới 5.000 node. Cụ thể hơn,
Kubernetes được thiết kế để đáp ứng các cấu hình thỏa mãn *tất cả* các tiêu chí sau:

* Không quá 110 pod trên mỗi node
* Không quá 5.000 node
* Tổng số pod không quá 150.000
* Tổng số container không quá 300.000

Bạn có thể mở rộng cluster của mình bằng cách thêm hoặc bớt node. Cách bạn thực hiện
điều này phụ thuộc vào cách cluster của bạn được triển khai.

## Hạn ngạch tài nguyên của nhà cung cấp cloud {#quota-issues}

Để tránh gặp các vấn đề về hạn ngạch của nhà cung cấp cloud, khi tạo một cluster có nhiều node,
hãy cân nhắc:
* Yêu cầu tăng hạn ngạch cho các tài nguyên cloud như:
    * Instance máy tính
    * CPU
    * Volume lưu trữ
    * Địa chỉ IP đang được sử dụng
    * Các tập luật lọc gói tin
    * Số lượng load balancer
    * Các subnet mạng
    * Các luồng log
* Kiểm soát các hành động mở rộng cluster để khởi tạo node mới theo từng đợt, có
  khoảng nghỉ giữa các đợt, vì một số nhà cung cấp cloud giới hạn tốc độ tạo instance mới.

## Các thành phần control plane

Đối với một cluster lớn, bạn cần một control plane có đủ tài nguyên tính toán và các
tài nguyên khác.

Thông thường, bạn sẽ chạy một hoặc hai instance control plane cho mỗi vùng lỗi,
trước tiên mở rộng các instance đó theo chiều dọc, rồi sau khi đạt đến điểm lợi ích
giảm dần của việc mở rộng (theo chiều dọc) thì mới mở rộng theo chiều ngang.

Bạn nên chạy ít nhất một instance cho mỗi vùng lỗi để đảm bảo khả năng chịu lỗi. Các
node của Kubernetes không tự động điều hướng lưu lượng tới các endpoint của control plane
nằm trong cùng vùng lỗi; tuy nhiên, nhà cung cấp cloud của bạn có thể có các cơ chế
riêng để làm điều này.

Ví dụ, khi dùng một load balancer được quản lý, bạn cấu hình load balancer để gửi lưu lượng
bắt nguồn từ kubelet và các Pod trong vùng lỗi _A_, và chỉ chuyển lưu lượng đó
tới các host control plane cũng nằm trong vùng _A_. Nếu một host control-plane hoặc
endpoint duy nhất trong vùng lỗi _A_ ngừng hoạt động, điều đó có nghĩa là toàn bộ lưu lượng
control-plane cho các node trong vùng _A_ sẽ được gửi xuyên giữa các vùng. Việc chạy nhiều
host control plane trong mỗi vùng sẽ làm cho tình huống đó ít có khả năng xảy ra hơn.

### Lưu trữ etcd

Để cải thiện hiệu năng của các cluster lớn, bạn có thể lưu trữ các đối tượng Event trong một
instance etcd riêng biệt, chuyên dụng.

Khi tạo một cluster, bạn có thể (dùng công cụ tùy chỉnh):

* khởi động và cấu hình thêm một instance etcd
* cấu hình {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} để dùng nó cho việc lưu trữ các event

Xem [Vận hành các cluster etcd cho Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) và
[Thiết lập cluster etcd có tính sẵn sàng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
để biết chi tiết về cách cấu hình và quản lý etcd cho một cluster lớn.

## Tài nguyên cho addon

[Giới hạn tài nguyên](/docs/concepts/configuration/manage-resources-containers/) của Kubernetes
giúp giảm thiểu tác động của việc rò rỉ bộ nhớ và những cách khác mà các pod và container có thể
ảnh hưởng tới các thành phần khác. Các giới hạn tài nguyên này áp dụng cho
tài nguyên {{< glossary_tooltip text="addon" term_id="addons" >}} giống như chúng áp dụng cho các workload ứng dụng.

Ví dụ, bạn có thể đặt giới hạn CPU và bộ nhớ cho một thành phần ghi log:

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

Các giới hạn mặc định của addon thường dựa trên dữ liệu thu thập được từ kinh nghiệm chạy
mỗi addon trên các cluster Kubernetes nhỏ hoặc trung bình. Khi chạy trên các
cluster lớn, các addon thường tiêu thụ một số tài nguyên vượt quá giới hạn mặc định của chúng.
Nếu một cluster lớn được triển khai mà không điều chỉnh các giá trị này, (các) addon
có thể liên tục bị dừng vì chúng cứ chạm tới giới hạn bộ nhớ.
Một cách khác, addon có thể vẫn chạy nhưng với hiệu năng kém do bị hạn chế
về lát cắt thời gian CPU.

Để tránh gặp các vấn đề về tài nguyên của addon trong cluster, khi tạo một cluster có
nhiều node, hãy cân nhắc những điều sau:

* Một số addon mở rộng theo chiều dọc - chỉ có một replica của addon cho cả cluster
  hoặc phục vụ toàn bộ một vùng lỗi. Với những addon này, hãy tăng request và limit
  khi bạn mở rộng cluster.
* Nhiều addon mở rộng theo chiều ngang - bạn tăng năng lực bằng cách chạy nhiều pod hơn - nhưng với
  một cluster rất lớn, bạn cũng có thể cần tăng nhẹ giới hạn CPU hoặc bộ nhớ.
  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) có thể chạy ở chế độ _recommender_ để cung cấp các
  con số gợi ý cho request và limit.
* Một số addon chạy một bản sao trên mỗi node, được điều khiển bởi một {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: ví dụ, một bộ tổng hợp log ở cấp node. Tương tự như
  trường hợp các addon mở rộng theo chiều ngang, bạn cũng có thể cần tăng nhẹ giới hạn
  CPU hoặc bộ nhớ.

## Ưu tiên các thành phần thiết yếu của cluster

Để đảm bảo các thành phần thiết yếu của cluster (như CoreDNS, metrics-server và các add-on quan trọng khác) được lập lịch trước các workload khác và không bị preempt bởi các pod có độ ưu tiên thấp hơn, hãy chạy chúng với một [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/) hệ thống, chẳng hạn như `system-cluster-critical` hoặc `system-node-critical`.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` là một custom resource mà bạn có thể triển khai vào cluster của mình
để giúp bạn quản lý resource request và limit cho các pod.  
Tìm hiểu thêm về [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 
và cách bạn có thể dùng nó để mở rộng các thành phần của cluster,
bao gồm cả các addon thiết yếu của cluster.

* Đọc về [Tự động mở rộng Node](/docs/concepts/cluster-administration/node-autoscaling/)

* [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
giúp bạn tự động điều chỉnh kích thước các addon khi quy mô cluster của bạn thay đổi.
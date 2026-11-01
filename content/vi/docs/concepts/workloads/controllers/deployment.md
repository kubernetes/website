---
title: Deployments
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: Tự động rollout và rollback
  description: >
    Kubernetes triển khai dần dần các thay đổi đối với ứng dụng hoặc cấu hình của ứng dụng, đồng thời theo dõi tình trạng hoạt động của ứng dụng để đảm bảo không dừng tất cả các instance cùng một lúc. Nếu có sự cố xảy ra, Kubernetes sẽ rollback thay đổi cho bạn. Hãy tận dụng hệ sinh thái các giải pháp triển khai đang ngày càng phát triển.
description: >-
  Deployment quản lý một tập hợp các Pod để chạy một workload ứng dụng, thường là các ứng dụng không duy trì trạng thái.
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

_Deployment_ cung cấp khả năng cập nhật dạng khai báo (declarative) cho các {{< glossary_tooltip text="Pod" term_id="pod" >}} và
{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.

Bạn mô tả _trạng thái mong muốn_ (desired state) trong một Deployment, và {{< glossary_tooltip term_id="controller" >}} của Deployment sẽ thay đổi trạng thái thực tế sang trạng thái mong muốn với tốc độ được kiểm soát. Bạn có thể định nghĩa các Deployment để tạo ReplicaSet mới, hoặc để xóa các Deployment hiện có và tiếp nhận toàn bộ tài nguyên của chúng bằng các Deployment mới.

{{< note >}}
Không quản lý trực tiếp các ReplicaSet thuộc sở hữu của một Deployment. Hãy cân nhắc mở một issue trong repository chính của Kubernetes nếu trường hợp sử dụng của bạn không được đề cập bên dưới.
{{< /note >}}

<!-- body -->

## Trường hợp sử dụng {#use-case}

Sau đây là các trường hợp sử dụng điển hình của Deployment:

* [Tạo một Deployment để rollout một ReplicaSet](#creating-a-deployment). ReplicaSet sẽ tạo các Pod ở chế độ nền. Kiểm tra trạng thái của rollout để xem nó có thành công hay không.
* [Khai báo trạng thái mới của các Pod](#updating-a-deployment) bằng cách cập nhật PodTemplateSpec của Deployment. Một ReplicaSet mới được tạo ra, và Deployment dần dần scale up ReplicaSet mới đồng thời scale down ReplicaSet cũ, đảm bảo các Pod được thay thế với tốc độ được kiểm soát. Mỗi ReplicaSet mới sẽ cập nhật revision của Deployment.
* [Rollback về một revision trước đó của Deployment](#rolling-back-a-deployment) nếu trạng thái hiện tại của Deployment không ổn định. Mỗi lần rollback sẽ cập nhật revision của Deployment.
* [Scale up Deployment để đáp ứng tải lớn hơn](#scaling-a-deployment).
* [Tạm dừng rollout của một Deployment](#pausing-and-resuming-a-deployment) để áp dụng nhiều bản sửa lỗi cho PodTemplateSpec của nó, rồi tiếp tục để bắt đầu một rollout mới.
* [Sử dụng trạng thái của Deployment](#deployment-status) như một dấu hiệu cho biết rollout đã bị kẹt.
* [Dọn dẹp các ReplicaSet cũ](#clean-up-policy) mà bạn không còn cần đến.

## Tạo một Deployment {#creating-a-deployment}

Dưới đây là một ví dụ về Deployment. Nó tạo một ReplicaSet để khởi chạy ba Pod `nginx`:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

Trong ví dụ này:

* Một Deployment tên là `nginx-deployment` được tạo, được chỉ định bởi trường
  `.metadata.name`. Tên này sẽ trở thành cơ sở để đặt tên cho các ReplicaSet
  và Pod được tạo sau đó. Xem [Viết spec cho Deployment](#writing-a-deployment-spec)
  để biết thêm chi tiết.
* Deployment tạo một ReplicaSet, ReplicaSet này tạo ba Pod replica, được chỉ định bởi trường `.spec.replicas`.
* Trường `.spec.selector` định nghĩa cách ReplicaSet được tạo ra tìm các Pod mà nó cần quản lý.
  Trong trường hợp này, bạn chọn một label được định nghĩa trong Pod template (`app: nginx`).
  Tuy nhiên, có thể sử dụng các quy tắc lựa chọn phức tạp hơn,
  miễn là bản thân Pod template thỏa mãn quy tắc đó.

  {{< note >}}
  Trường `.spec.selector.matchLabels` là một map gồm các cặp {key,value}.
  Một cặp {key,value} trong map `matchLabels` tương đương với một phần tử của `matchExpressions`,
  có trường `key` là "key", `operator` là "In", và mảng `values` chỉ chứa "value".
  Tất cả các yêu cầu, từ cả `matchLabels` và `matchExpressions`, đều phải được thỏa mãn thì mới khớp.
  {{< /note >}}

* Trường `.spec.template` chứa các trường con sau:
  * Các Pod được gắn label `app: nginx` thông qua trường `.metadata.labels`.
  * Đặc tả của Pod template, hay trường `.spec`, chỉ ra rằng
    các Pod chạy một container, `nginx`, container này chạy image `nginx` trên
    [Docker Hub](https://hub.docker.com/) ở phiên bản 1.14.2.
  * Tạo một container và đặt tên là `nginx` thông qua trường `.spec.containers[0].name`.

Trước khi bắt đầu, hãy đảm bảo cluster Kubernetes của bạn đang hoạt động.
Làm theo các bước dưới đây để tạo Deployment ở trên:

1. Tạo Deployment bằng cách chạy lệnh sau:

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. Chạy `kubectl get deployments` để kiểm tra xem Deployment đã được tạo hay chưa.

   Nếu Deployment vẫn đang được tạo, kết quả sẽ tương tự như sau:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```
   Khi bạn kiểm tra các Deployment trong cluster, các trường sau được hiển thị:
   * `NAME` liệt kê tên của các Deployment trong namespace.
   * `READY` hiển thị số replica của ứng dụng đang sẵn sàng phục vụ người dùng. Giá trị có dạng ready/desired.
   * `UP-TO-DATE` hiển thị số replica đã được cập nhật để đạt trạng thái mong muốn.
   * `AVAILABLE` hiển thị số replica của ứng dụng đang khả dụng cho người dùng.
   * `AGE` hiển thị khoảng thời gian ứng dụng đã chạy.

   Lưu ý rằng số replica mong muốn là 3, theo trường `.spec.replicas`.

3. Để xem trạng thái rollout của Deployment, chạy `kubectl rollout status deployment/nginx-deployment`.

   Kết quả tương tự như sau:
   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. Chạy lại `kubectl get deployments` sau vài giây.
   Kết quả tương tự như sau:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```
   Lưu ý rằng Deployment đã tạo cả ba replica, và tất cả các replica đều đã được cập nhật (chứa Pod template mới nhất) và khả dụng.

5. Để xem ReplicaSet (`rs`) được tạo bởi Deployment, chạy `kubectl get rs`. Kết quả tương tự như sau:
   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```
   Kết quả của ReplicaSet hiển thị các trường sau:

   * `NAME` liệt kê tên của các ReplicaSet trong namespace.
   * `DESIRED` hiển thị số _replica_ mong muốn của ứng dụng, được bạn định nghĩa khi tạo Deployment. Đây là _trạng thái mong muốn_.
   * `CURRENT` hiển thị số replica đang chạy.
   * `READY` hiển thị số replica của ứng dụng đang sẵn sàng phục vụ người dùng.
   * `AGE` hiển thị khoảng thời gian ứng dụng đã chạy.

   Lưu ý rằng tên của ReplicaSet luôn có định dạng
   `[DEPLOYMENT-NAME]-[HASH]`. Tên này sẽ trở thành cơ sở để đặt tên cho các Pod
   được tạo ra.

   Chuỗi `HASH` giống với label `pod-template-hash` trên ReplicaSet.

6. Để xem các label được tự động sinh ra cho mỗi Pod, chạy `kubectl get pods --show-labels`.
   Kết quả tương tự như sau:
   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```
   ReplicaSet được tạo đảm bảo rằng luôn có ba Pod `nginx`.

{{< note >}}
Bạn phải chỉ định một selector và label của Pod template phù hợp trong Deployment
(trong trường hợp này là `app: nginx`).

Không để label hoặc selector trùng lặp với các controller khác (bao gồm các Deployment và StatefulSet khác). Kubernetes không ngăn bạn làm điều đó, và nếu nhiều controller có selector trùng lặp, các controller đó có thể xung đột và hoạt động không như mong đợi.
{{< /note >}}

### Label pod-template-hash {#pod-template-hash-label}

{{< caution >}}
Không được thay đổi label này.
{{< /caution >}}

Label `pod-template-hash` được Deployment controller thêm vào mỗi ReplicaSet mà một Deployment tạo ra hoặc tiếp nhận (adopt).

Label này đảm bảo rằng các ReplicaSet con của một Deployment không bị trùng lặp. Nó được sinh ra bằng cách băm `PodTemplate` của ReplicaSet và sử dụng giá trị băm thu được làm giá trị label, được thêm vào selector của ReplicaSet, label của Pod template,
và vào mọi Pod hiện có mà ReplicaSet có thể đang quản lý.

## Cập nhật một Deployment {#updating-a-deployment}

{{< note >}}
Rollout của một Deployment được kích hoạt khi và chỉ khi Pod template của Deployment (tức là `.spec.template`)
bị thay đổi, ví dụ khi label hoặc image container của template được cập nhật. Các cập nhật khác, chẳng hạn như scale Deployment, sẽ không kích hoạt rollout.
{{< /note >}}

Làm theo các bước dưới đây để cập nhật Deployment của bạn:

1. Hãy cập nhật các Pod nginx để sử dụng image `nginx:1.16.1` thay cho image `nginx:1.14.2`.

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   hoặc sử dụng lệnh sau:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```
   trong đó `deployment/nginx-deployment` chỉ định Deployment,
   `nginx` chỉ định container sẽ được cập nhật và
   `nginx:1.16.1` chỉ định image mới cùng tag của nó.


   Kết quả tương tự như sau:

   ```
   deployment.apps/nginx-deployment image updated
   ```

   Ngoài ra, bạn có thể `edit` Deployment và thay đổi `.spec.template.spec.containers[0].image` từ `nginx:1.14.2` thành `nginx:1.16.1`:

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   Kết quả tương tự như sau:

   ```
   deployment.apps/nginx-deployment edited
   ```

2. Để xem trạng thái rollout, chạy:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   Kết quả tương tự như sau:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   hoặc

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

Xem thêm chi tiết về Deployment đã được cập nhật:

* Sau khi rollout thành công, bạn có thể xem Deployment bằng cách chạy `kubectl get deployments`.
  Kết quả tương tự như sau:

  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* Chạy `kubectl get rs` để thấy rằng Deployment đã cập nhật các Pod bằng cách tạo một ReplicaSet mới và scale nó
lên 3 replica, đồng thời scale ReplicaSet cũ xuống 0 replica.

  ```shell
  kubectl get rs
  ```

  Kết quả tương tự như sau:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* Lúc này, chạy `get pods` sẽ chỉ hiển thị các Pod mới:

  ```shell
  kubectl get pods
  ```

  Kết quả tương tự như sau:
  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  Lần tiếp theo khi muốn cập nhật các Pod này, bạn chỉ cần cập nhật lại Pod template của Deployment.

  Deployment đảm bảo rằng chỉ một số lượng nhất định Pod bị ngừng hoạt động trong khi chúng đang được cập nhật. Theo mặc định,
  nó đảm bảo rằng ít nhất 75% số Pod mong muốn đang chạy (tối đa 25% không khả dụng - max unavailable).

  Deployment cũng đảm bảo rằng chỉ một số lượng nhất định Pod được tạo vượt quá số Pod mong muốn.
  Theo mặc định, nó đảm bảo rằng tối đa 125% số Pod mong muốn đang chạy (vượt tối đa 25% - max surge).

  Ví dụ, nếu quan sát kỹ Deployment ở trên, bạn sẽ thấy nó tạo một Pod mới trước,
  sau đó xóa một Pod cũ, rồi tạo thêm một Pod mới khác. Nó không dừng các Pod cũ cho đến khi có đủ số lượng
  Pod mới đã chạy, và không tạo Pod mới cho đến khi đủ số lượng Pod cũ đã bị dừng.
  Nó đảm bảo rằng ít nhất 3 Pod khả dụng và tổng cộng tối đa 4 Pod khả dụng. Với
  một Deployment có 4 replica, số lượng Pod sẽ nằm trong khoảng từ 3 đến 5.

* Lấy thông tin chi tiết về Deployment của bạn:
  ```shell
  kubectl describe deployments
  ```
  Kết quả tương tự như sau:
  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```
  Ở đây bạn thấy rằng khi tạo Deployment lần đầu, nó đã tạo một ReplicaSet (nginx-deployment-2035384211)
  và scale trực tiếp lên 3 replica. Khi bạn cập nhật Deployment, nó tạo một ReplicaSet mới
  (nginx-deployment-1564180365), scale lên 1 và chờ Pod đó chạy. Sau đó nó scale ReplicaSet cũ xuống
  2 và scale ReplicaSet mới lên 2, sao cho luôn có ít nhất 3 Pod khả dụng và tối đa 4 Pod được tạo tại mọi thời điểm.
  Sau đó nó tiếp tục scale up ReplicaSet mới và scale down ReplicaSet cũ, với cùng chiến lược rolling update.
  Cuối cùng, bạn sẽ có 3 replica khả dụng trong ReplicaSet mới, và ReplicaSet cũ được scale xuống 0.

{{< note >}}
Kubernetes không tính các Pod đang dừng khi tính số lượng `availableReplicas`, giá trị này phải nằm trong khoảng
`replicas - maxUnavailable` đến `replicas + maxSurge`. Do đó, bạn có thể thấy có nhiều Pod hơn
dự kiến trong quá trình rollout, và tổng tài nguyên mà Deployment tiêu thụ lớn hơn `replicas + maxSurge`
cho đến khi `terminationGracePeriodSeconds` của các Pod đang dừng hết hạn.
{{< /note >}}

### Rollover (hay còn gọi là nhiều cập nhật diễn ra đồng thời) {#rollover-aka-multiple-updates-in-flight}

Mỗi khi Deployment controller phát hiện một Deployment mới, một ReplicaSet sẽ được tạo để khởi chạy
các Pod mong muốn. Nếu Deployment được cập nhật, ReplicaSet hiện có đang kiểm soát các Pod có label
khớp với `.spec.selector` nhưng có template không khớp với `.spec.template` sẽ bị scale down. Cuối cùng, ReplicaSet
mới được scale lên `.spec.replicas` và tất cả các ReplicaSet cũ được scale xuống 0.

Nếu bạn cập nhật một Deployment trong khi một rollout đang diễn ra, Deployment sẽ tạo một ReplicaSet mới
theo bản cập nhật và bắt đầu scale up ReplicaSet đó, đồng thời rollover ReplicaSet mà nó đang scale up trước đó
-- nó sẽ thêm ReplicaSet đó vào danh sách các ReplicaSet cũ và bắt đầu scale down nó.

Ví dụ, giả sử bạn tạo một Deployment để tạo 5 replica của `nginx:1.14.2`,
nhưng sau đó cập nhật Deployment để tạo 5 replica của `nginx:1.16.1`, khi mới chỉ có 3
replica của `nginx:1.14.2` được tạo. Trong trường hợp đó, Deployment ngay lập tức bắt đầu
dừng 3 Pod `nginx:1.14.2` mà nó đã tạo, và bắt đầu tạo các Pod
`nginx:1.16.1`. Nó không đợi 5 replica của `nginx:1.14.2` được tạo xong
rồi mới chuyển hướng.

### Cập nhật label selector {#label-selector-updates}

Nhìn chung, việc cập nhật label selector không được khuyến khích, và bạn nên lên kế hoạch cho các selector từ trước.
Label selector của một Deployment là **bất biến** sau khi được tạo;
không thể cập nhật nó bằng `kubectl patch`, `kubectl edit`, `kubectl apply`, hay các công cụ như `helm upgrade`.

Nếu buộc phải thay đổi selector, bạn cần xóa Deployment rồi tạo lại.
Theo mặc định, việc xóa Deployment cũng xóa các Pod đang chạy của nó, gây ra downtime; hãy dùng
`--cascade=orphan` nếu bạn cần các Pod đó tiếp tục chạy trong khi tạo lại Deployment
(xem các hệ quả bên dưới).
Hãy hết sức thận trọng và đảm bảo bạn hiểu rõ các hệ quả sau:

* **Thêm:** Khi bạn tạo một Deployment mới với selector hẹp hơn, Deployment mới **bắt buộc** phải có Pod template phù hợp.
  Nếu bạn có một manifest sẵn có và sửa manifest đó để thu hẹp selector, bạn cần sửa metadata của Pod template bên trong Deployment đó, thêm các
  label mới
  cho khớp, nếu không API server sẽ trả về lỗi xác thực (validation error). Đây là một thay đổi _không chồng lấn_ (non-overlapping):
  Deployment mới sẽ không "thấy" các Pod cũ (vốn không có label mới), khiến ReplicaSet
  cũ bị **mồ côi** (orphaned) và một ReplicaSet hoàn toàn mới được tạo ra.
* **Thay đổi giá trị:** Thay đổi giá trị hiện có của một key trong selector (ví dụ, từ `v1` thành `v2`)
  dẫn đến hành vi giống như khi thêm (ReplicaSet cũ bị mồ côi và được tạo lại).
* **Xóa:** Xóa một key hiện có khỏi selector của Deployment không yêu cầu bất kỳ thay đổi nào
  đối với label của Pod template. Đây là một thay đổi _chồng lấn_ (overlapping): selector mới, rộng hơn sẽ
  khớp với các Pod cũ. Các ReplicaSet hiện có không bị mồ côi, và không có ReplicaSet mới nào được tạo,
  nhưng lưu ý rằng label đã xóa vẫn tồn tại trong các Pod và ReplicaSet hiện có.
  Bạn có thể dọn dẹp điều đó bằng cách kích hoạt một rollout cho Deployment.

## Rollback một Deployment {#rolling-back-a-deployment}

Đôi khi, bạn có thể muốn rollback một Deployment; ví dụ, khi Deployment không ổn định, chẳng hạn như bị crash liên tục (crash looping).
Theo mặc định, toàn bộ lịch sử rollout của Deployment được lưu giữ trong hệ thống để bạn có thể rollback bất cứ lúc nào
(bạn có thể thay đổi điều này bằng cách sửa giới hạn lịch sử revision - revision history limit).

{{< note >}}
Revision của một Deployment được tạo khi rollout của Deployment được kích hoạt. Điều này có nghĩa là
revision mới được tạo khi và chỉ khi Pod template (`.spec.template`) của Deployment bị thay đổi,
ví dụ khi bạn cập nhật label hoặc image container của template. Các cập nhật khác, chẳng hạn như scale Deployment,
không tạo ra revision mới của Deployment, nhờ đó bạn có thể thực hiện đồng thời việc scale thủ công hoặc tự động.
Điều này có nghĩa là khi bạn rollback về một revision trước đó, chỉ phần Pod template của Deployment
được rollback.
{{< /note >}}

* Giả sử bạn gõ nhầm khi cập nhật Deployment, đặt tên image là `nginx:1.161` thay vì `nginx:1.16.1`:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* Rollout bị kẹt. Bạn có thể xác minh điều này bằng cách kiểm tra trạng thái rollout:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  Kết quả tương tự như sau:
  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* Nhấn Ctrl-C để dừng theo dõi trạng thái rollout ở trên. Để biết thêm thông tin về các rollout bị kẹt,
[đọc thêm tại đây](#deployment-status).

* Bạn thấy rằng số replica cũ (cộng số replica từ
  `nginx-deployment-1564180365` và `nginx-deployment-2035384211`) là 3, và số
  replica mới (từ `nginx-deployment-3066724191`) là 1.

  ```shell
  kubectl get rs
  ```

  Kết quả tương tự như sau:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* Xem các Pod đã được tạo, bạn sẽ thấy 1 Pod được tạo bởi ReplicaSet mới bị kẹt trong vòng lặp kéo image (image pull loop).

  ```shell
  kubectl get pods
  ```

  Kết quả tương tự như sau:
  ```
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  Deployment controller tự động dừng rollout lỗi và ngừng scale up ReplicaSet mới. Điều này phụ thuộc vào các tham số rollingUpdate (cụ thể là `maxUnavailable`) mà bạn đã chỉ định. Theo mặc định, Kubernetes đặt giá trị này là 25%.
  {{< /note >}}

* Lấy mô tả của Deployment:
  ```shell
  kubectl describe deployment
  ```

  Kết quả tương tự như sau:
  ```
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.161
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  Để khắc phục điều này, bạn cần rollback về một revision ổn định trước đó của Deployment.

### Kiểm tra lịch sử rollout của một Deployment {#checking-rollout-history-of-a-deployment}

Làm theo các bước dưới đây để kiểm tra lịch sử rollout:

1. Đầu tiên, kiểm tra các revision của Deployment này:
   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```
   Kết quả tương tự như sau:
   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           <none>
   2           <none>
   3           <none>
   ```

   `CHANGE-CAUSE` được sao chép từ annotation `kubernetes.io/change-cause` của Deployment sang các revision của nó khi chúng được tạo. Bạn có thể chỉ định thông điệp `CHANGE-CAUSE` bằng cách:

   * Gắn annotation cho Deployment bằng `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`
   * Sửa manifest của tài nguyên một cách thủ công.
   * Sử dụng công cụ tự động đặt annotation.

   {{< note >}}
   Trong các phiên bản Kubernetes cũ hơn, bạn có thể dùng cờ `--record` với các lệnh kubectl để tự động điền trường `CHANGE-CAUSE`. Cờ này không còn được hỗ trợ (deprecated) và sẽ bị loại bỏ trong một bản phát hành tương lai.
   {{< /note >}}

2. Để xem chi tiết của từng revision, chạy:
   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   Kết quả tương tự như sau:
   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

### Rollback về revision trước đó {#rolling-back-to-a-previous-revision}
Làm theo các bước dưới đây để rollback Deployment từ phiên bản hiện tại về phiên bản trước đó, tức là phiên bản 2.

1. Giả sử bây giờ bạn quyết định hoàn tác rollout hiện tại và rollback về revision trước đó:
   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   Kết quả tương tự như sau:
   ```
   deployment.apps/nginx-deployment rolled back
   ```
   Ngoài ra, bạn có thể rollback về một revision cụ thể bằng cách chỉ định nó với `--to-revision`:

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   Kết quả tương tự như sau:
   ```
   deployment.apps/nginx-deployment rolled back
   ```

   Để biết thêm chi tiết về các lệnh liên quan đến rollout, đọc [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

   Deployment giờ đã được rollback về một revision ổn định trước đó. Như bạn thấy, một sự kiện `DeploymentRollback`
   cho việc rollback về revision 2 được tạo ra từ Deployment controller.

2. Để kiểm tra xem việc rollback đã thành công và Deployment đang chạy như mong đợi hay chưa, chạy:
   ```shell
   kubectl get deployment nginx-deployment
   ```

   Kết quả tương tự như sau:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```
3. Lấy mô tả của Deployment:
   ```shell
   kubectl describe deployment nginx-deployment
   ```
   Kết quả tương tự như sau:
   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----                   -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

## Scale một Deployment {#scaling-a-deployment}

Bạn có thể scale một Deployment bằng lệnh sau:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```
Kết quả tương tự như sau:
```
deployment.apps/nginx-deployment scaled
```

Giả sử [horizontal Pod autoscaling](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) đã được bật
trong cluster của bạn, bạn có thể thiết lập một autoscaler cho Deployment và chọn số lượng Pod tối thiểu và tối đa
mà bạn muốn chạy dựa trên mức sử dụng CPU của các Pod hiện có.

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80%
```
Kết quả tương tự như sau:
```
deployment.apps/nginx-deployment scaled
```

### Scale theo tỷ lệ {#proportional-scaling}

Các Deployment kiểu RollingUpdate hỗ trợ chạy nhiều phiên bản của một ứng dụng cùng một lúc. Khi bạn
hoặc một autoscaler scale một Deployment RollingUpdate đang ở giữa quá trình rollout (đang diễn ra
hoặc đang tạm dừng), Deployment controller sẽ phân bổ cân đối các replica bổ sung vào các ReplicaSet
đang hoạt động (các ReplicaSet có Pod) để giảm thiểu rủi ro. Điều này được gọi là *scale theo tỷ lệ* (proportional scaling).

Ví dụ, bạn đang chạy một Deployment với 10 replica, [maxSurge](#max-surge)=3, và [maxUnavailable](#max-unavailable)=2.

* Đảm bảo rằng 10 replica trong Deployment của bạn đang chạy.
  ```shell
  kubectl get deploy
  ```
  Kết quả tương tự như sau:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* Bạn cập nhật sang một image mới mà không thể phân giải được từ bên trong cluster.
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* Việc cập nhật image khởi động một rollout mới với ReplicaSet nginx-deployment-1989198191, nhưng rollout này bị chặn do
yêu cầu `maxUnavailable` mà bạn đã đề cập ở trên. Kiểm tra trạng thái rollout:
  ```shell
  kubectl get rs
  ```
  Kết quả tương tự như sau:
  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* Sau đó, một yêu cầu scale mới cho Deployment xuất hiện. Autoscaler tăng số replica của Deployment
lên 15. Deployment controller cần quyết định nơi để thêm 5 replica mới này. Nếu bạn không sử dụng
scale theo tỷ lệ, cả 5 replica sẽ được thêm vào ReplicaSet mới. Với scale theo tỷ lệ, bạn
phân bổ các replica bổ sung cho tất cả các ReplicaSet. Phần lớn hơn được chia cho các ReplicaSet có
nhiều replica nhất và phần nhỏ hơn được chia cho các ReplicaSet có ít replica hơn. Phần dư sẽ được thêm vào
ReplicaSet có nhiều replica nhất. Các ReplicaSet có 0 replica sẽ không được scale up.

Trong ví dụ trên, 3 replica được thêm vào ReplicaSet cũ và 2 replica được thêm vào
ReplicaSet mới. Quá trình rollout cuối cùng sẽ chuyển tất cả các replica sang ReplicaSet mới, với giả định
các replica mới hoạt động bình thường (healthy). Để xác nhận điều này, chạy:

```shell
kubectl get deploy
```

Kết quả tương tự như sau:
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
Trạng thái rollout xác nhận cách các replica được thêm vào mỗi ReplicaSet.
```shell
kubectl get rs
```

Kết quả tương tự như sau:
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Tạm dừng và tiếp tục rollout của một Deployment {#pausing-and-resuming-a-deployment}

Khi bạn cập nhật một Deployment, hoặc dự định cập nhật, bạn có thể tạm dừng các rollout
của Deployment đó trước khi kích hoạt một hoặc nhiều cập nhật. Khi
bạn đã sẵn sàng áp dụng các thay đổi đó, bạn tiếp tục các rollout cho
Deployment. Cách làm này cho phép bạn
áp dụng nhiều bản sửa lỗi trong khoảng thời gian giữa lúc tạm dừng và tiếp tục mà không kích hoạt các rollout không cần thiết.

* Ví dụ, với một Deployment vừa được tạo:

  Lấy thông tin chi tiết của Deployment:
  ```shell
  kubectl get deploy
  ```
  Kết quả tương tự như sau:
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  Lấy trạng thái rollout:
  ```shell
  kubectl get rs
  ```
  Kết quả tương tự như sau:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* Tạm dừng bằng cách chạy lệnh sau:
  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment paused
  ```

* Sau đó cập nhật image của Deployment:
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* Lưu ý rằng không có rollout mới nào được bắt đầu:
  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  Kết quả tương tự như sau:
  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```
* Lấy trạng thái rollout để xác minh rằng ReplicaSet hiện có không thay đổi:
  ```shell
  kubectl get rs
  ```

  Kết quả tương tự như sau:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* Bạn có thể thực hiện bao nhiêu cập nhật tùy thích, ví dụ, cập nhật các tài nguyên sẽ được sử dụng:
  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  Trạng thái ban đầu của Deployment trước khi tạm dừng rollout vẫn tiếp tục hoạt động, nhưng các cập nhật mới cho
  Deployment sẽ không có tác dụng chừng nào rollout của Deployment còn đang bị tạm dừng.

* Cuối cùng, tiếp tục rollout của Deployment và quan sát một ReplicaSet mới được tạo ra với tất cả các cập nhật mới:
  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  Kết quả tương tự như sau:
  ```
  deployment.apps/nginx-deployment resumed
  ```
* Theo dõi ({{< glossary_tooltip text="watch" term_id="watch" >}}) trạng thái của rollout cho đến khi hoàn tất.
  ```shell
  kubectl get rs --watch
  ```

  Kết quả tương tự như sau:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```
* Lấy trạng thái của rollout mới nhất:
  ```shell
  kubectl get rs
  ```

  Kết quả tương tự như sau:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```
{{< note >}}
Bạn không thể rollback một Deployment đang bị tạm dừng cho đến khi bạn tiếp tục (resume) nó.
{{< /note >}}

## Trạng thái của Deployment {#deployment-status}

Một Deployment trải qua nhiều trạng thái khác nhau trong vòng đời của nó. Nó có thể đang [tiến triển](#progressing-deployment) trong khi
rollout một ReplicaSet mới, có thể [hoàn tất](#complete-deployment), hoặc có thể [không tiến triển được](#failed-deployment).

### Deployment đang tiến triển {#progressing-deployment}

Kubernetes đánh dấu một Deployment là _đang tiến triển_ (progressing) khi một trong các tác vụ sau được thực hiện:

* Deployment tạo một ReplicaSet mới.
* Deployment đang scale up ReplicaSet mới nhất của nó.
* Deployment đang scale down (các) ReplicaSet cũ hơn của nó.
* Các Pod mới trở nên ready hoặc available (ready trong ít nhất [MinReadySeconds](#min-ready-seconds)).

Khi rollout chuyển sang trạng thái “progressing”, Deployment controller thêm một condition với các
thuộc tính sau vào `.status.conditions` của Deployment:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

Bạn có thể theo dõi tiến trình của một Deployment bằng cách sử dụng `kubectl rollout status`.

### Deployment hoàn tất {#complete-deployment}

Kubernetes đánh dấu một Deployment là _hoàn tất_ (complete) khi nó có các đặc điểm sau:

* Tất cả các replica liên kết với Deployment đã được cập nhật lên phiên bản mới nhất mà bạn chỉ định, nghĩa là mọi
cập nhật bạn yêu cầu đều đã được hoàn thành.
* Tất cả các replica liên kết với Deployment đều sẵn sàng (available).
* Không có replica cũ nào của Deployment đang chạy.

Khi rollout chuyển sang trạng thái “complete”, Deployment controller đặt một condition với các
thuộc tính sau vào `.status.conditions` của Deployment:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

Condition `Progressing` này sẽ giữ giá trị trạng thái `"True"` cho đến khi một rollout mới
được khởi tạo. Condition này vẫn giữ nguyên ngay cả khi tính khả dụng của các replica thay đổi (điều
này thay vào đó sẽ ảnh hưởng đến condition `Available`).

Bạn có thể kiểm tra xem một Deployment đã hoàn tất hay chưa bằng cách sử dụng `kubectl rollout status`. Nếu rollout hoàn tất
thành công, `kubectl rollout status` trả về exit code bằng 0.

```shell
kubectl rollout status deployment/nginx-deployment
```
Kết quả tương tự như sau:
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```
và exit status của `kubectl rollout` là 0 (thành công):
```shell
echo $?
```
```
0
```

### Deployment thất bại {#failed-deployment}

Deployment của bạn có thể bị kẹt khi cố gắng triển khai ReplicaSet mới nhất mà không bao giờ hoàn tất. Điều này có thể xảy ra
do một số yếu tố sau:

* Không đủ quota
* Readiness probe thất bại
* Lỗi khi kéo image (image pull)
* Không đủ quyền
* Limit range
* Cấu hình runtime của ứng dụng bị sai

Một cách để phát hiện tình trạng này là chỉ định một tham số thời hạn (deadline) trong spec của Deployment:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` biểu thị
số giây mà Deployment controller chờ trước khi báo hiệu (trong trạng thái của Deployment) rằng
tiến trình của Deployment đã bị đình trệ.

Lệnh `kubectl` sau đây thiết lập spec với `progressDeadlineSeconds` để khiến controller báo cáo
việc rollout của Deployment không có tiến triển sau 10 phút:

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
Kết quả tương tự như sau:
```
deployment.apps/nginx-deployment patched
```
Khi vượt quá thời hạn, Deployment controller sẽ thêm một DeploymentCondition với các
thuộc tính sau vào `.status.conditions` của Deployment:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

Condition này cũng có thể thất bại sớm và khi đó được đặt giá trị trạng thái `"False"` vì các lý do như `ReplicaSetCreateError`.
Ngoài ra, thời hạn sẽ không còn được tính đến khi rollout của Deployment đã hoàn tất.

Xem [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) để biết thêm thông tin về các status condition.

{{< note >}}
Kubernetes không thực hiện bất kỳ hành động nào đối với một Deployment bị đình trệ ngoài việc báo cáo một status condition với
`reason: ProgressDeadlineExceeded`. Các orchestrator cấp cao hơn có thể tận dụng điều này và hành động tương ứng, ví dụ
như rollback Deployment về phiên bản trước đó.
{{< /note >}}

{{< note >}}
Nếu bạn tạm dừng rollout của một Deployment, Kubernetes không kiểm tra tiến trình so với thời hạn bạn đã chỉ định.
Bạn có thể an toàn tạm dừng rollout của một Deployment giữa chừng rồi tiếp tục mà không kích hoạt
condition vượt quá thời hạn.
{{< /note >}}

Bạn có thể gặp phải các lỗi tạm thời với Deployment, do bạn đặt timeout quá thấp hoặc
do bất kỳ loại lỗi nào khác có thể được coi là tạm thời. Ví dụ, giả sử bạn
không đủ quota. Nếu bạn describe Deployment, bạn sẽ thấy phần sau:

```shell
kubectl describe deployment nginx-deployment
```
Kết quả tương tự như sau:
```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

Nếu bạn chạy `kubectl get deployment nginx-deployment -o yaml`, trạng thái của Deployment tương tự như sau:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

Cuối cùng, khi vượt quá thời hạn tiến trình của Deployment, Kubernetes sẽ cập nhật trạng thái và
lý do (reason) của condition Progressing:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Bạn có thể giải quyết vấn đề thiếu quota bằng cách scale down Deployment, scale down các
controller khác mà bạn đang chạy, hoặc tăng quota trong namespace của bạn. Nếu bạn đáp ứng các điều kiện
về quota và sau đó Deployment controller hoàn tất rollout của Deployment, bạn sẽ thấy
trạng thái của Deployment được cập nhật với một condition thành công (`status: "True"` và `reason: NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`type: Available` với `status: "True"` nghĩa là Deployment của bạn đạt mức khả dụng tối thiểu (minimum availability). Mức khả dụng tối thiểu được quyết định
bởi các tham số được chỉ định trong chiến lược triển khai (deployment strategy). `type: Progressing` với `status: "True"` nghĩa là Deployment của bạn
hoặc đang ở giữa quá trình rollout và đang tiến triển, hoặc đã hoàn tất tiến trình thành công và số lượng replica mới tối thiểu
cần thiết đã sẵn sàng (xem Reason của condition để biết chi tiết - trong trường hợp của chúng ta,
`reason: NewReplicaSetAvailable` nghĩa là Deployment đã hoàn tất).

Bạn có thể kiểm tra xem một Deployment có bị thất bại trong việc tiến triển hay không bằng cách sử dụng `kubectl rollout status`. `kubectl rollout status`
trả về exit code khác 0 nếu Deployment đã vượt quá thời hạn tiến trình.

```shell
kubectl rollout status deployment/nginx-deployment
```
Kết quả tương tự như sau:
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
và exit status của `kubectl rollout` là 1 (cho biết có lỗi):
```shell
echo $?
```
```
1
```

### Thao tác trên một Deployment thất bại {#operating-on-a-failed-deployment}

Tất cả các thao tác áp dụng cho một Deployment hoàn tất cũng áp dụng cho một Deployment thất bại. Bạn có thể scale up/down, rollback
về một revision trước đó, hoặc thậm chí tạm dừng nó nếu bạn cần áp dụng nhiều điều chỉnh cho Pod template của Deployment.

## Chính sách dọn dẹp {#clean-up-policy}

Bạn có thể đặt trường `.spec.revisionHistoryLimit` trong một Deployment để chỉ định số lượng ReplicaSet cũ của
Deployment này mà bạn muốn giữ lại. Phần còn lại sẽ được thu gom rác (garbage-collected) ở chế độ nền. Theo mặc định,
giá trị này là 10.

{{< note >}}
Việc đặt tường minh trường này bằng 0 sẽ dẫn đến việc dọn sạch toàn bộ lịch sử của Deployment,
do đó Deployment đó sẽ không thể rollback.
{{< /note >}}

Việc dọn dẹp chỉ bắt đầu **sau khi** Deployment đạt
[trạng thái hoàn tất](/docs/concepts/workloads/controllers/deployment/#complete-deployment).
Nếu bạn đặt `.spec.revisionHistoryLimit` bằng 0, mọi rollout vẫn kích hoạt việc tạo một
ReplicaSet mới trước khi Kubernetes xóa ReplicaSet cũ.

Ngay cả khi giới hạn lịch sử revision khác 0, bạn vẫn có thể có nhiều ReplicaSet hơn giới hạn
mà bạn cấu hình. Ví dụ, nếu các Pod bị crash liên tục (crash looping) và có nhiều sự kiện rolling update
được kích hoạt theo thời gian, bạn có thể có nhiều ReplicaSet hơn
`.spec.revisionHistoryLimit` vì Deployment không bao giờ đạt trạng thái hoàn tất.

## Canary deployment {#canary-deployments}

Nếu bạn muốn rollout các bản phát hành (release) cho một nhóm nhỏ người dùng hoặc máy chủ bằng Deployment, bạn
có thể tạo nhiều Deployment, mỗi Deployment tương ứng với một bản phát hành, theo mô hình canary được mô tả trong
[quản lý tài nguyên](/docs/concepts/workloads/management/#canary-deployments).

Để tìm hiểu chi tiết, hãy làm theo hướng dẫn [Triển khai một bản phát hành bằng Canary Deployment](/docs/tutorials/stateless-application/canary-deployment/).

## Viết spec cho Deployment {#writing-a-deployment-spec}

Giống như mọi cấu hình Kubernetes khác, một Deployment cần các trường `.apiVersion`, `.kind` và `.metadata`.
Để biết thông tin chung về cách làm việc với các file cấu hình, xem
[triển khai ứng dụng](/docs/tasks/run-application/run-stateless-application-deployment/),
cấu hình container, và [sử dụng kubectl để quản lý tài nguyên](/docs/concepts/overview/working-with-objects/object-management/).

Khi control plane tạo các Pod mới cho một Deployment, `.metadata.name` của
Deployment là một phần cơ sở để đặt tên cho các Pod đó. Tên của Deployment phải là một giá trị
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
hợp lệ, nhưng điều này có thể gây ra kết quả không mong muốn cho hostname của Pod. Để tương thích tốt nhất,
tên nên tuân theo các quy tắc chặt chẽ hơn của một
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).

Một Deployment cũng cần có [phần `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Pod Template {#pod-template}

`.spec.template` và `.spec.selector` là các trường bắt buộc duy nhất của `.spec`.

`.spec.template` là một [Pod template](/docs/concepts/workloads/pods/#pod-templates). Nó có schema giống hệt một {{< glossary_tooltip text="Pod" term_id="pod" >}}, ngoại trừ việc nó được lồng bên trong và không có `apiVersion` hay `kind`.

Ngoài các trường bắt buộc của một Pod, Pod template trong một Deployment phải chỉ định các
label và một restart policy phù hợp. Với label, hãy đảm bảo không trùng lặp với các controller khác. Xem [selector](#selector).

Chỉ cho phép [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) bằng `Always`,
đây cũng là giá trị mặc định nếu không được chỉ định.

### Replicas {#replicas}

`.spec.replicas` là một trường tùy chọn, chỉ định số lượng Pod mong muốn. Giá trị mặc định là 1.

Nếu bạn scale một Deployment thủ công, ví dụ qua `kubectl scale deployment
deployment --replicas=X`, rồi sau đó cập nhật Deployment đó dựa trên một manifest
(ví dụ: bằng cách chạy `kubectl apply -f deployment.yaml`),
thì việc áp dụng manifest đó sẽ ghi đè lên việc scale thủ công mà bạn đã thực hiện trước đó.

Nếu một [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (hoặc bất kỳ
API tương tự nào cho horizontal scaling) đang quản lý việc scale cho một Deployment, đừng đặt `.spec.replicas`.

Thay vào đó, hãy để
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} của Kubernetes tự động quản lý
trường `.spec.replicas`.

### Selector {#selector}

`.spec.selector` là một trường bắt buộc, chỉ định một [label selector](/docs/concepts/overview/working-with-objects/labels/)
cho các Pod mà Deployment này nhắm tới.

`.spec.selector` phải khớp với `.spec.template.metadata.labels`, nếu không sẽ bị API từ chối.

Trong phiên bản API `apps/v1`, `.spec.selector` và `.metadata.labels` không mặc định lấy giá trị của `.spec.template.metadata.labels` nếu không được đặt. Vì vậy chúng phải được đặt một cách tường minh. Cũng lưu ý rằng trong `apps/v1`, `.spec.selector` là bất biến sau khi Deployment được tạo.

Một Deployment có thể dừng (terminate) các Pod có label khớp với selector nếu template của chúng khác
với `.spec.template` hoặc nếu tổng số lượng các Pod như vậy vượt quá `.spec.replicas`. Nó sẽ khởi chạy các Pod mới
với `.spec.template` nếu số lượng Pod ít hơn số lượng mong muốn.

{{< note >}}
Bạn không nên tạo các Pod khác có label khớp với selector này, dù là trực tiếp, bằng cách tạo
một Deployment khác, hay bằng cách tạo một controller khác như ReplicaSet hoặc ReplicationController. Nếu bạn
làm vậy, Deployment đầu tiên sẽ cho rằng chính nó đã tạo ra các Pod khác này. Kubernetes không ngăn bạn làm điều này.
{{< /note >}}

Nếu bạn có nhiều controller có selector trùng lặp nhau, các controller đó sẽ tranh chấp với nhau
và sẽ không hoạt động đúng.

### Strategy {#strategy}

`.spec.strategy` chỉ định chiến lược được sử dụng để thay thế các Pod cũ bằng các Pod mới.
`.spec.strategy.type` có thể là "Recreate" hoặc "RollingUpdate". "RollingUpdate" là
giá trị mặc định.

#### Recreate Deployment {#recreate-deployment}

Khi `.spec.strategy.type==Recreate`, tất cả các Pod hiện có sẽ bị dừng trước khi các Pod mới được tạo.

{{< note >}}
Điều này chỉ đảm bảo các Pod bị dừng trước khi tạo Pod mới đối với các lần nâng cấp. Nếu bạn nâng cấp một Deployment, tất cả các Pod
của revision cũ sẽ bị dừng ngay lập tức. Hệ thống chờ việc xóa thành công rồi mới tạo bất kỳ Pod nào của
revision mới. Nếu bạn xóa thủ công một Pod, vòng đời của nó do ReplicaSet kiểm soát và
Pod thay thế sẽ được tạo ngay lập tức (ngay cả khi Pod cũ vẫn đang ở trạng thái Terminating). Nếu bạn cần
đảm bảo "tối đa" (at most) cho các Pod của mình, bạn nên cân nhắc sử dụng một
[StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
{{< /note >}}

#### Rolling Update Deployment {#rolling-update-deployment}

Deployment cập nhật các Pod theo kiểu rolling update
(scale down dần các ReplicaSet cũ và scale up ReplicaSet mới) khi `.spec.strategy.type==RollingUpdate`. Bạn có thể chỉ định `maxUnavailable` và `maxSurge` để kiểm soát
quá trình rolling update.

##### Max Unavailable {#max-unavailable}

`.spec.strategy.rollingUpdate.maxUnavailable` là một trường tùy chọn, chỉ định số lượng Pod tối đa
có thể không khả dụng (unavailable) trong quá trình cập nhật. Giá trị có thể là một số tuyệt đối (ví dụ: 5)
hoặc tỷ lệ phần trăm của số Pod mong muốn (ví dụ: 10%). Số tuyệt đối được tính từ tỷ lệ phần trăm bằng cách
làm tròn xuống. Giá trị này không thể bằng 0 nếu `.spec.strategy.rollingUpdate.maxSurge` bằng 0. Giá trị mặc định là 25%.

Ví dụ, khi giá trị này được đặt là 30%, ReplicaSet cũ có thể được scale down xuống còn 70% số Pod
mong muốn ngay khi rolling update bắt đầu. Khi các Pod mới đã sẵn sàng, ReplicaSet cũ có thể được scale
down thêm, tiếp theo là scale up ReplicaSet mới, đảm bảo rằng tổng số Pod khả dụng
tại mọi thời điểm trong quá trình cập nhật luôn ít nhất bằng 70% số Pod mong muốn.

##### Max Surge {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge` là một trường tùy chọn, chỉ định số lượng Pod tối đa
có thể được tạo vượt quá số lượng Pod mong muốn. Giá trị có thể là một số tuyệt đối (ví dụ: 5) hoặc
tỷ lệ phần trăm của số Pod mong muốn (ví dụ: 10%). Giá trị này không thể bằng 0 nếu `maxUnavailable` bằng 0. Số tuyệt đối
được tính từ tỷ lệ phần trăm bằng cách làm tròn lên. Giá trị mặc định là 25%.

Ví dụ, khi giá trị này được đặt là 30%, ReplicaSet mới có thể được scale up ngay khi
rolling update bắt đầu, sao cho tổng số Pod cũ và mới không vượt quá 130% số Pod
mong muốn. Khi các Pod cũ đã bị dừng, ReplicaSet mới có thể được scale up thêm, đảm bảo rằng
tổng số Pod đang chạy tại mọi thời điểm trong quá trình cập nhật tối đa là 130% số Pod mong muốn.

Dưới đây là một số ví dụ về Rolling Update Deployment sử dụng `maxUnavailable` và `maxSurge`:

{{< tabs name="tab_with_md" >}}
{{% tab name="Max Unavailable" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
 ```

{{% /tab %}}
{{% tab name="Max Surge" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
 ```

{{% /tab %}}
{{% tab name="Hybrid" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
 ```

{{% /tab %}}
{{< /tabs >}}

### Progress Deadline Seconds {#progress-deadline-seconds}

`.spec.progressDeadlineSeconds` là một trường tùy chọn, chỉ định số giây bạn muốn
chờ Deployment tiến triển trước khi hệ thống báo cáo rằng Deployment đã
[không tiến triển được](#failed-deployment) - được thể hiện dưới dạng một condition với `type: Progressing`, `status: "False"`.
và `reason: ProgressDeadlineExceeded` trong trạng thái của tài nguyên. Deployment controller sẽ tiếp tục
thử lại Deployment. Giá trị mặc định là 600.

Nếu được chỉ định, trường này cần lớn hơn `.spec.minReadySeconds`.

### Min Ready Seconds {#min-ready-seconds}

`.spec.minReadySeconds` là một trường tùy chọn, chỉ định số giây tối thiểu mà một Pod mới
được tạo phải ở trạng thái ready mà không có container nào bị crash, để được coi là available (khả dụng).
Giá trị mặc định là 0 (Pod sẽ được coi là available ngay khi nó ready). Để tìm hiểu thêm về thời điểm
một Pod được coi là ready, xem [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Các Pod đang dừng (terminating) {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

Bạn chỉ có thể thấy các Pod đang dừng nếu `DeploymentReplicaSetTerminatingReplicas`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) được bật
trên [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
và trên [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)

Các Pod chuyển sang trạng thái đang dừng do bị xóa hoặc do scale down có thể mất nhiều thời gian để dừng hẳn, và có thể tiêu tốn
thêm tài nguyên trong khoảng thời gian đó. Do đó, tổng số Pod có thể tạm thời vượt quá
`.spec.replicas`. Bạn có thể theo dõi các Pod đang dừng bằng trường `.status.terminatingReplicas` của Deployment.

### Revision History Limit {#revision-history-limit}

Lịch sử revision của một Deployment được lưu trữ trong các ReplicaSet mà nó kiểm soát.

`.spec.revisionHistoryLimit` là một trường tùy chọn, chỉ định số lượng ReplicaSet cũ được giữ lại
để cho phép rollback. Các ReplicaSet cũ này tiêu tốn tài nguyên trong `etcd` và làm rối kết quả của `kubectl get rs`. Cấu hình của mỗi revision Deployment được lưu trữ trong các ReplicaSet của nó; do đó, một khi ReplicaSet cũ bị xóa, bạn sẽ mất khả năng rollback về revision đó của Deployment. Theo mặc định, 10 ReplicaSet cũ sẽ được giữ lại, tuy nhiên giá trị lý tưởng của trường này phụ thuộc vào tần suất và độ ổn định của các Deployment mới.

Cụ thể hơn, việc đặt trường này bằng 0 có nghĩa là tất cả các ReplicaSet cũ có 0 replica sẽ bị dọn dẹp.
Trong trường hợp này, không thể hoàn tác (undo) một rollout mới của Deployment, vì lịch sử revision của nó đã bị dọn dẹp.

### Paused {#paused}

`.spec.paused` là một trường boolean tùy chọn dùng để tạm dừng và tiếp tục một Deployment. Điểm khác biệt duy nhất giữa
một Deployment đang tạm dừng và một Deployment không bị tạm dừng là mọi thay đổi đối với PodTemplateSpec của Deployment
đang tạm dừng sẽ không kích hoạt rollout mới chừng nào nó còn đang bị tạm dừng. Theo mặc định, một Deployment không bị tạm dừng khi
được tạo.

## {{% heading "whatsnext" %}}

* Tìm hiểu thêm về [Pod](/docs/concepts/workloads/pods).
* [Chạy một ứng dụng stateless bằng Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
* Đọc {{< api-reference page="apps/deployment-v1" >}} để hiểu về Deployment API.
* Đọc về [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) và cách
  bạn có thể sử dụng nó để quản lý tính khả dụng của ứng dụng khi có gián đoạn (disruption).
* Sử dụng kubectl để [tạo một Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/).

---
reviewers:
- huynguyennovem
title: Container Lifecycle Hooks
content_type: concept
weight: 30
---

<!-- overview -->

Trang này mô tả cách mà kubelet quản lý các Container có thể sử dụng framework Container lifecycle hook để
chạy mã nguồn được kích hoạt bởi các sự kiện trong lifecycle của nó.  




<!-- body -->

## Tổng quan

Tương tự như nhiều framework ngôn ngữ lập trình có thành phần các lifecycle hooks, như là Angular,
Kubernetes cung cấp các Container cùng với các lifecycle hook.
Các hooks cho phép các Container nhận thức được các sự kiện trong lifecycle của chúng
và chạy mã nguồn được triển khai trong một trình xử lý khi lifecycle hook tương ứng được thực thi.

## Container hooks

Có 2 hooks được cung cấp cho các Containers:

`PostStart`

Hook này thực thi ngay sau khi một container được tạo mới.
Tuy nhiên, không có gì đảm bảo rằng hook này sẽ thực thi trước container ENTRYPOINT.
Không có tham số nào được truyền cho trình xử lý (handler).

`PreStop`

Hook này được gọi tức thì ngay trước khi một container bị chấm dứt bởi một API request hoặc sự kiện quản lý như liveness/startup probe failure, preemption, tranh chấp tài nguyên và các vấn đề khác. Một lời gọi tới `PreStop` hook thất bại nếu container ở trạng thái đã chấm dứt (terminated) hoặc đã hoàn thành (completed) và hook phải hoàn thành trước khi tín hiệu TERM được gửi tới để dừng container.
Thời gian gia hạn chấm dứt của Pod bắt đầu trước khi hook `PreStop` được chạy, nên Container cuối cùng sẽ chấm dứt trong thời gian gia hạn chấm dứt của Pod bất kể kết quả của handler là gì.
Không có tham số nào được truyền cho trình xử lý (handler).

Xem thêm chi tiết về hành vi chấm dứt (termination behavior) tại
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### Các cách thực hiện Hook handler (Hook handler implementations)

Các Containers có thể truy cập một hook bằng cách thực hiện và đăng ký một handler cho hook đó.
Có 3 loại hook handler có thể được triển khai cho các Containers:

* Exec - Thực thi một lệnh cụ thể, như là `pre-stop.sh` trong cgroups và namespaces của Container.
Tài nguyên được sử dụng bởi lệnh được tính vào Container.
* HTTP - Thực thi một HTTP request với một endpoint cụ thể trên Container.
* Sleep - Dừng container trong một khoảng thời gian. Đây là tính năng đang ở
beta-level, được tự động bật bởi `PodLifecycleSleepAction`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

{{< note >}}
Tính năng beta `PodLifecycleSleepActionAllowZero` được bật mặc định từ bản v1.33.
Tính năng này cho phép bạn thiết lập thời gian sleep là 0 giây (hay không thực hiện hành động
nào) cho các hooks Sleep lifecycle của bạn.
{{< /note >}}

### Thực thi hook handler (Hook handler execution)

Khi một hook quản lý Container lifecycle được gọi,
hệ thống quản lý Kubernetes thực thi trình xử lý (handler) dựa trên hành động của hook.
`httpGet`, `tcpSocket` ([deprecated](/docs/reference/generated/kubernetes-api/v1.31/#lifecyclehandler-v1-core)) và `sleep` được thực thi bởi tiến trình kubelet, còn `exec` được thực thi trong container.

Lời gọi hook `PostStart` handler được khởi tạo khi một container được tạo,
nghĩa là container ENTRYPOINT và hook `PostStart` được kích hoạt đồng thời.
Tuy nhiên, nếu hook `PostStart` mất quá nhiều thời gian để chạy hoặc bị treo,
container không thể chuyển sang trạng thái `running`.

Các hooks `PreStop` không được thực thi bất đồng bộ với tín hiệu dừng Container; hook phải được hoàn thành thực thi trước khi tín hiệu TERM được gửi.
Nếu hook `PreStop` bị treo khi thực thi, Pod phase ở trạng thái `Terminating` và tiếp tục cho tới khi bị chấm dứt sau `terminationGracePeriodSeconds` hết hạn. Khoảng thời gian gia hạn này bằng tổng thời gian mà cả hook `PreStop` thực thi và Container dừng lại một cách bình thường.
Ví dụ, nếu `terminationGracePeriodSeconds` là 60, và hook mất 55 giây để hoàn thành, và Container mất thêm 10 giây để dừng lại sau khi nhận được tín hiệu, thì Container sẽ bị chấm dứt trước khi nó kịp dừng bình thường, vì `terminationGracePeriodSeconds` nhỏ hơn tổng thời gian cần thiết để thực hiện hai việc này (55+10).

Nếu hook `PostStart` hoặc `PreStop` thất bại,
nó sẽ xóa Container.

Người dùng nên làm cho hook handlers nhẹ nhất có thể.
Tuy nhiên, có những trường hợp khi những lệnh chạy dài có ý nghĩa,
chẳng hạn như khi lưu trạng thái trước khi dừng một container.

### Hook delivery guarantees

Hook delivery được trù định *ít nhất một lần*,
điều đó có nghĩa là hook có thể được gọi nhiều lần cho bất kỳ sự kiện cho trước nào,
chẳng hạn như `PostStart` hoặc `PreStop`.
Tùy thuộc vào việc thực hiện hook để xử lý việc này một cách chính xác.

Nhìn chung, chỉ có các deliveries đơn được thực hiện.
Ví dụ, nếu một HTTP hook receiver bị down và không thể nhận các traffic,
sẽ không được gửi lại.
Tuy nhiên, trong một số trường hợp hiếm hoi, delivery kép có thể xảy ra.
Chẳng hạn, nếu một kubelet khởi động lại ở giữa quá trình gửi một hook,
hook có thể được gửi lại sau khi kubelet quay trở lại.

### Debugging Hook handlers

Log cho một Hook handler không được hiển thị trong các Pod events.
Nếu một handler thất bại vì lí do nào đó, nó sẽ broadcast một event.
Đối với `PostStart`, đây là event `FailedPostStartHook`,
và đối với `PreStop`, đây là event `FailedPreStopHook`.
Để tự tạo ra một event lỗi `FailedPostStartHook`, bạn có thể điều chỉnh file
[lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml)
để thay đổi lệnh postStart thành "badcommand" và áp dụng nó.
Dưới đây là một số ví dụ output của events từ việc chạy lệnh `kubectl describe pod
lifecycle-demo`:

```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```



## {{% heading "whatsnext" %}}


* Xem thêm về [Container environment](/docs/concepts/containers/container-environment-variables/).
* Kinh nghiệm thực hành 
  [gắn các trình xử lý vào các sự kiện trong lifecycle của Container](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).




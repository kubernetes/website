---
title: Image
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

Một container image là dữ liệu nhị phân đóng gói một ứng dụng cùng toàn bộ
các thành phần phụ thuộc phần mềm của nó. Container image là các gói phần mềm có thể thực thi, có thể chạy
độc lập và có những giả định được xác định rất rõ ràng về môi trường runtime của chúng.

Thông thường, bạn tạo một container image cho ứng dụng của mình và push nó lên một registry
trước khi tham chiếu tới nó trong một {{< glossary_tooltip text="Pod" term_id="pod" >}}.

Trang này trình bày tổng quan về khái niệm container image.

{{< note >}}
Nếu bạn đang tìm các container image cho một bản phát hành
Kubernetes (chẳng hạn v{{< skew latestVersion >}}, bản phát hành minor mới nhất),
hãy truy cập [Tải xuống Kubernetes](https://kubernetes.io/releases/download/).
{{< /note >}}

<!-- body -->

## Tên image {#image-names}

Container image thường được đặt tên như `pause`, `example/mycontainer` hoặc `kube-apiserver`.
Image cũng có thể bao gồm hostname của registry; ví dụ: `fictional.registry.example/imagename`,
và có thể có cả số cổng; ví dụ: `fictional.registry.example:10443/imagename`.

Nếu bạn không chỉ định hostname của registry, Kubernetes sẽ giả định rằng bạn muốn dùng [Docker public registry](https://hub.docker.com/).
Bạn có thể thay đổi hành vi này bằng cách thiết lập một image registry mặc định trong
cấu hình của [container runtime](/docs/setup/production-environment/container-runtimes/).

Sau phần tên image, bạn có thể thêm _tag_ hoặc _digest_ (giống như khi dùng với các lệnh
như `docker` hoặc `podman`). Tag giúp bạn phân biệt các phiên bản khác nhau trong cùng một loạt image.
Digest là định danh duy nhất cho một phiên bản cụ thể của image. Digest là giá trị băm (hash) của nội dung image,
và không thể thay đổi. Tag có thể được chuyển sang trỏ tới các image khác, nhưng digest thì cố định.

Tag của image gồm các chữ cái thường và chữ hoa, chữ số, dấu gạch dưới (`_`),
dấu chấm (`.`) và dấu gạch ngang (`-`). Một tag có thể dài tối đa 128 ký tự, và phải
tuân theo mẫu regex sau: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`.
Bạn có thể đọc thêm và tìm regex dùng để kiểm tra tính hợp lệ trong
[OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories).
Nếu bạn không chỉ định tag, Kubernetes sẽ giả định rằng bạn muốn dùng tag `latest`.

Digest của image gồm một thuật toán băm (chẳng hạn `sha256`) và một giá trị băm. Ví dụ:
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`.
Bạn có thể tìm thêm thông tin về định dạng digest trong
[OCI Image Specification](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests).

Một số ví dụ về tên image mà Kubernetes có thể sử dụng:

- `busybox` &mdash; Chỉ có tên image, không có tag hay digest. Kubernetes sẽ dùng Docker
    public registry và tag latest. Tương đương với `docker.io/library/busybox:latest`.
- `busybox:1.32.0` &mdash; Tên image kèm tag. Kubernetes sẽ dùng Docker
    public registry. Tương đương với `docker.io/library/busybox:1.32.0`.
- `registry.k8s.io/pause:latest` &mdash; Tên image với registry tùy chỉnh và tag latest.
- `registry.k8s.io/pause:3.5` &mdash; Tên image với registry tùy chỉnh và tag không phải latest.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    Tên image kèm digest.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    Tên image kèm tag và digest. Khi pull image, chỉ digest được sử dụng.

## Cập nhật image {#updating-images}

Khi bạn tạo lần đầu một {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, hoặc đối tượng
khác có chứa PodTemplate, và chính sách pull (pull policy) không được chỉ định rõ ràng,
thì theo mặc định, chính sách pull của tất cả các container trong Pod đó sẽ được đặt thành
`IfNotPresent`. Chính sách này khiến
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} bỏ qua việc pull một
image nếu image đó đã tồn tại.

### Chính sách pull image {#image-pull-policy}

`imagePullPolicy` của một container và tag của image cùng ảnh hưởng tới _thời điểm_
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) cố gắng pull
(tải xuống) image được chỉ định.

Dưới đây là danh sách các giá trị bạn có thể đặt cho `imagePullPolicy` và tác dụng
của từng giá trị:

`IfNotPresent`
: image chỉ được pull nếu nó chưa có sẵn ở máy cục bộ.

`Always`
: mỗi khi kubelet khởi chạy một container, kubelet yêu cầu
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
  pull image. Container runtime liên hệ với registry, phân giải
  tag hoặc tên image thành một
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier),
  và tải xuống các layer chưa được lưu đệm (cache) ở máy cục bộ.
  Nếu tất cả các layer đã có sẵn, container runtime sẽ dùng image
  đã được cache mà không tải lại. Bản thân kubelet không kiểm tra
  xem image đã được cache ở máy cục bộ hay chưa; kubelet luôn giao việc này cho container
  runtime.

`Never`
: kubelet không cố gắng tải image. Nếu bằng cách nào đó image đã có sẵn
  ở máy cục bộ, kubelet sẽ cố gắng khởi động container; nếu không, quá trình khởi động sẽ thất bại.
  Xem [image được pull sẵn](#pre-pulled-images) để biết thêm chi tiết.

Nhờ cơ chế cache của container runtime, ngay cả
`imagePullPolicy: Always` cũng hoạt động hiệu quả, miễn là registry luôn truy cập được ổn định.
Container runtime có thể nhận biết rằng các layer của image đã tồn tại trên node
nên không cần tải xuống lại.

{{< note >}}
Bạn nên tránh dùng tag `:latest` khi triển khai container trong môi trường production vì
khi đó sẽ khó theo dõi phiên bản nào của image đang chạy hơn và khó rollback
đúng cách hơn.

Thay vào đó, hãy chỉ định một tag có ý nghĩa như `v1.42.0` và/hoặc một digest.
{{< /note >}}

Để đảm bảo Pod luôn dùng cùng một phiên bản của container image, bạn có thể chỉ định
digest của image;
thay `<image-name>:<tag>` bằng `<image-name>@<digest>`
(ví dụ, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).

Khi dùng tag của image, nếu image registry thay đổi phần mã mà tag của image đó
đại diện, bạn có thể gặp tình trạng lẫn lộn giữa các Pod chạy mã cũ và mã mới. Digest của image
định danh duy nhất một phiên bản cụ thể của image, vì vậy Kubernetes sẽ chạy cùng một mã mỗi khi
khởi động một container với tên image và digest đó. Việc chỉ định image bằng digest
sẽ cố định mã mà bạn chạy, nhờ đó thay đổi ở registry không thể gây ra tình trạng lẫn lộn phiên bản như vậy.

Có những [admission controller](/docs/reference/access-authn-authz/admission-controllers/) của bên thứ ba
có thể thay đổi (mutate) các Pod (và PodTemplate) khi chúng được tạo, sao cho
workload đang chạy được xác định dựa trên digest của image thay vì tag.
Điều đó có thể hữu ích nếu bạn muốn đảm bảo toàn bộ workload của mình
đang chạy cùng một mã, bất kể tag ở registry thay đổi thế nào.

#### Chính sách pull image mặc định {#imagepullpolicy-defaulting}

Khi bạn (hoặc một controller) gửi một Pod mới tới API server, cluster của bạn sẽ đặt
trường `imagePullPolicy` khi thỏa mãn các điều kiện cụ thể sau:

- nếu bạn bỏ qua trường `imagePullPolicy` và chỉ định digest cho
  container image, `imagePullPolicy` sẽ tự động được đặt thành `IfNotPresent`.
- nếu bạn bỏ qua trường `imagePullPolicy` và tag của container image là
  `:latest`, `imagePullPolicy` sẽ tự động được đặt thành `Always`.
- nếu bạn bỏ qua trường `imagePullPolicy` và không chỉ định tag cho
  container image, `imagePullPolicy` sẽ tự động được đặt thành `Always`.
- nếu bạn bỏ qua trường `imagePullPolicy` và chỉ định một tag cho container
  image không phải là `:latest`, `imagePullPolicy` sẽ tự động được đặt thành
  `IfNotPresent`.

{{< note >}}
Giá trị `imagePullPolicy` của container luôn được đặt khi đối tượng
được _tạo_ lần đầu, và không được cập nhật nếu tag hoặc digest của image thay đổi sau đó.

Ví dụ, nếu bạn tạo một Deployment với image có tag _không phải_ là
`:latest`, và sau đó cập nhật image của Deployment đó sang tag `:latest`,
trường `imagePullPolicy` sẽ _không_ chuyển thành `Always`. Bạn phải tự thay đổi
chính sách pull của bất kỳ đối tượng nào sau khi nó được tạo lần đầu.
{{< /note >}}

#### Bắt buộc pull image {#required-image-pull}

Nếu bạn muốn luôn bắt buộc pull, bạn có thể làm theo một trong các cách sau:

- Đặt `imagePullPolicy` của container thành `Always`.
- Bỏ qua `imagePullPolicy` và dùng `:latest` làm tag cho image cần dùng;
  Kubernetes sẽ đặt chính sách thành `Always` khi bạn gửi Pod.
- Bỏ qua `imagePullPolicy` và tag cho image cần dùng;
  Kubernetes sẽ đặt chính sách thành `Always` khi bạn gửi Pod.
- Bật admission controller
  [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages).

### ImagePullBackOff {#imagepullbackoff}

Khi kubelet bắt đầu tạo các container cho một Pod bằng container runtime,
có thể container sẽ ở trạng thái [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
do `ImagePullBackOff`.

Trạng thái `ImagePullBackOff` có nghĩa là container không thể khởi động vì Kubernetes
không thể pull container image (vì những lý do như tên image không hợp lệ, hoặc pull
từ một registry riêng tư mà không có `imagePullSecret`). Phần `BackOff` cho biết
Kubernetes sẽ tiếp tục thử pull image, với độ trễ back-off tăng dần.

Kubernetes tăng độ trễ giữa các lần thử cho tới khi đạt giới hạn được biên dịch sẵn,
là 300 giây (5 phút).

### Pull image theo runtime class {#image-pull-per-runtime-class}

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
Kubernetes có hỗ trợ ở mức alpha cho việc pull image dựa trên RuntimeClass của Pod.

Nếu bạn bật [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `RuntimeClassInImageCriApi`,
kubelet sẽ tham chiếu container image bằng một bộ (tuple) gồm tên image và runtime handler
thay vì chỉ dùng tên image hoặc digest.
{{< glossary_tooltip text="Container runtime" term_id="container-runtime" >}}
của bạn có thể điều chỉnh hành vi dựa trên runtime handler được chọn.
Pull image dựa trên runtime class hữu ích cho các container chạy trên máy ảo (VM), chẳng hạn
container Windows Hyper-V.

## Pull image tuần tự và song song {#serial-and-parallel-image-pulls}

Theo mặc định, kubelet pull các image một cách tuần tự. Nói cách khác, tại mỗi thời điểm kubelet chỉ gửi
một yêu cầu pull image tới image service. Các yêu cầu pull image
khác phải đợi cho tới khi yêu cầu đang được xử lý hoàn tất.

Mỗi node đưa ra quyết định pull image một cách độc lập. Ngay cả khi bạn dùng chế độ pull image
tuần tự, hai node khác nhau vẫn có thể pull cùng một image song song.

Nếu bạn muốn bật pull image song song, bạn có thể đặt trường
`serializeImagePulls` thành false trong [cấu hình kubelet](/docs/reference/config-api/kubelet-config.v1beta1/).
Khi `serializeImagePulls` được đặt thành false, các yêu cầu pull image sẽ được gửi ngay tới image service,
và nhiều image sẽ được pull cùng lúc.

Khi bật pull image song song, hãy đảm bảo rằng image service của container
runtime có thể xử lý việc pull image song song.

Kubelet không bao giờ pull nhiều image song song cho cùng một Pod. Ví dụ,
nếu bạn có một Pod gồm một init container và một container ứng dụng, việc pull image
cho hai container này sẽ không diễn ra song song. Tuy nhiên, nếu bạn có hai
Pod dùng các image khác nhau, và tính năng pull image song song được bật,
kubelet sẽ pull các image song song cho hai Pod khác nhau đó.

### Số lượng pull image song song tối đa {#maximum-parallel-image-pulls}

{{< feature-state for_k8s_version="v1.35" state="stable" >}}

Khi `serializeImagePulls` được đặt thành false, theo mặc định kubelet không giới hạn
số lượng image tối đa được pull cùng lúc. Nếu bạn muốn
giới hạn số lượng pull image song song, bạn có thể đặt trường `maxParallelImagePulls`
trong cấu hình kubelet. Khi `maxParallelImagePulls` được đặt thành _n_, chỉ _n_
image có thể được pull cùng lúc, và mọi lượt pull image vượt quá _n_ sẽ phải
đợi cho tới khi ít nhất một lượt pull image đang diễn ra hoàn tất.

Việc giới hạn số lượng pull image song song giúp tránh việc pull image tiêu tốn
quá nhiều băng thông mạng hoặc I/O ổ đĩa, khi pull image song song được bật.

Bạn có thể đặt `maxParallelImagePulls` thành một số dương lớn hơn hoặc
bằng 1. Nếu bạn đặt `maxParallelImagePulls` lớn hơn hoặc bằng 2,
bạn phải đặt `serializeImagePulls` thành false. Kubelet sẽ không khởi động được
nếu thiết lập `maxParallelImagePulls` không hợp lệ.

## Image đa kiến trúc với image index {#multi-architecture-images-with-image-indexes}

Ngoài việc cung cấp các image nhị phân, một container registry cũng có thể cung cấp một
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md).
Một image index có thể trỏ tới nhiều [image manifest](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
cho các phiên bản dành riêng cho từng kiến trúc của một container. Ý tưởng là bạn có thể có
một tên cho image (ví dụ: `pause`, `example/mycontainer`, `kube-apiserver`)
và cho phép các hệ thống khác nhau tải về đúng image nhị phân cho kiến trúc
máy mà chúng đang sử dụng.

Dự án Kubernetes thường tạo container image cho các bản phát hành của mình với
tên có hậu tố `-$(ARCH)`. Để tương thích ngược, hãy tạo
các image cũ hơn kèm hậu tố. Ví dụ, một image có tên `pause` sẽ là
một image đa kiến trúc chứa manifest cho tất cả các kiến trúc được hỗ trợ,
trong khi `pause-amd64` sẽ là phiên bản tương thích ngược cho các cấu hình cũ hơn,
hoặc cho các file YAML có tên image kèm hậu tố được viết cứng (hardcode).

## Sử dụng registry riêng tư {#using-a-private-registry}

Registry riêng tư (private registry) có thể yêu cầu xác thực thì mới khám phá và/hoặc pull
được image từ đó.
Thông tin xác thực (credential) có thể được cung cấp theo nhiều cách:

- [Chỉ định `imagePullSecrets` khi bạn định nghĩa một Pod](#specifying-imagepullsecrets-on-a-pod)

  Chỉ những Pod cung cấp khóa của riêng chúng mới có thể truy cập registry riêng tư.

- [Cấu hình Node để xác thực với registry riêng tư](#configuring-nodes-to-authenticate-to-a-private-registry)
  - Tất cả các Pod đều có thể đọc mọi registry riêng tư đã được cấu hình.
  - Yêu cầu quản trị viên cluster cấu hình node.
- Sử dụng plugin _kubelet credential provider_ để [lấy thông tin xác thực cho registry riêng tư một cách động](#kubelet-credential-provider)

  Kubelet có thể được cấu hình để dùng exec plugin credential provider cho
  registry riêng tư tương ứng.

- [Image được pull sẵn](#pre-pulled-images)
  - Tất cả các Pod đều có thể dùng bất kỳ image nào đã được cache trên một node.
  - Yêu cầu quyền root trên tất cả các node để thiết lập.
- Phần mở rộng riêng của nhà cung cấp hoặc phần mở rộng cục bộ

  Nếu bạn đang dùng một cấu hình node tùy chỉnh, bạn (hoặc nhà cung cấp đám mây của bạn) có thể
  tự triển khai cơ chế xác thực node với container registry.

Các tùy chọn này được giải thích chi tiết hơn ở bên dưới.

### Chỉ định `imagePullSecrets` trên một Pod {#specifying-imagepullsecrets-on-a-pod}

{{< note >}}
Đây là cách được khuyến nghị để chạy các container dựa trên image
trong registry riêng tư.
{{< /note >}}

Kubernetes hỗ trợ chỉ định khóa của container image registry trên một Pod.
Tất cả `imagePullSecrets` phải là các Secret tồn tại trong cùng
{{< glossary_tooltip term_id="namespace" >}} với
Pod. Các Secret này phải có kiểu `kubernetes.io/dockercfg` hoặc `kubernetes.io/dockerconfigjson`.

### Cấu hình node để xác thực với registry riêng tư {#configuring-nodes-to-authenticate-to-a-private-registry}

Hướng dẫn cụ thể về cách thiết lập thông tin xác thực phụ thuộc vào container runtime và registry mà bạn
chọn sử dụng. Bạn nên tham khảo tài liệu của giải pháp mà bạn dùng để có thông tin chính xác nhất.

Để xem ví dụ về cách cấu hình một container image registry riêng tư, hãy xem tác vụ
[Pull một Image từ Registry riêng tư](/docs/tasks/configure-pod-container/pull-image-private-registry).
Ví dụ đó sử dụng một registry riêng tư trên Docker Hub.

### Kubelet credential provider cho việc pull image có xác thực {#kubelet-credential-provider}

Bạn có thể cấu hình kubelet để gọi một plugin dạng tệp nhị phân (binary) nhằm lấy
thông tin xác thực registry cho một container image một cách động. Đây là cách mạnh mẽ và linh hoạt nhất
để lấy thông tin xác thực cho registry riêng tư, nhưng cũng đòi hỏi phải cấu hình ở cấp kubelet
để bật.

Kỹ thuật này đặc biệt hữu ích khi chạy các {{< glossary_tooltip term_id="static-pod" text="static Pod" >}}
cần container image được lưu trữ trong registry riêng tư.
Bạn không thể dùng {{< glossary_tooltip term_id="service-account" >}} hoặc
{{< glossary_tooltip term_id="secret" >}} để cung cấp thông tin xác thực cho registry riêng tư
trong đặc tả của một static Pod, vì static Pod _không thể_
tham chiếu tới các tài nguyên API khác trong đặc tả của mình.

Xem [Cấu hình kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) để biết thêm chi tiết.

### Cách diễn giải config.json {#config-json}

Cách diễn giải `config.json` khác nhau giữa bản triển khai Docker gốc
và cách diễn giải của Kubernetes. Trong Docker, các key trong `auths`
chỉ có thể chỉ định URL gốc, trong khi Kubernetes cho phép cả URL dạng glob lẫn
đường dẫn khớp theo tiền tố. Hạn chế duy nhất là các mẫu glob (`*`) phải
bao gồm dấu chấm (`.`) cho mỗi subdomain. Số lượng subdomain được khớp
phải bằng số lượng mẫu glob (`*.`), ví dụ:

- `*.kubernetes.io` sẽ *không* khớp với `kubernetes.io`, nhưng sẽ khớp với
    `abc.kubernetes.io`.
- `*.*.kubernetes.io` sẽ *không* khớp với `abc.kubernetes.io`, nhưng sẽ khớp với
    `abc.def.kubernetes.io`.
- `prefix.*.io` sẽ khớp với `prefix.kubernetes.io`.
- `*-good.kubernetes.io` sẽ khớp với `prefix-good.kubernetes.io`.

Điều này có nghĩa là một `config.json` như sau là hợp lệ:

```json
{
    "auths": {
        "my-registry.example/images": { "auth": "…" },
        "*.my-registry.example/images": { "auth": "…" }
    }
}
```

Các thao tác pull image sẽ chuyển thông tin xác thực tới CRI container runtime cho mọi
mẫu hợp lệ. Ví dụ, các tên container image sau sẽ được khớp
thành công:

- `my-registry.example/images`
- `my-registry.example/images/my-image`
- `my-registry.example/images/another-image`
- `sub.my-registry.example/images/my-image`

Tuy nhiên, các tên container image sau sẽ *không* được khớp:

- `a.sub.my-registry.example/images/my-image`
- `a.b.sub.my-registry.example/images/my-image`

Kubelet thực hiện pull image tuần tự với từng thông tin xác thực tìm được. Điều này
có nghĩa là `config.json` cũng có thể có nhiều mục cho các đường dẫn khác nhau:

```json
{
    "auths": {
        "my-registry.example/images": {
            "auth": "…"
        },
        "my-registry.example/images/subpath": {
            "auth": "…"
        }
    }
}
```

Khi đó, nếu một container chỉ định image `my-registry.example/images/subpath/my-image`
cần được pull, kubelet sẽ thử tải image bằng cả hai nguồn
xác thực nếu một trong hai nguồn thất bại.

### Image được pull sẵn {#pre-pulled-images}

{{< note >}}
Cách này phù hợp nếu bạn có thể kiểm soát cấu hình node. Nó
sẽ không hoạt động ổn định nếu nhà cung cấp đám mây của bạn quản lý các node và tự động
thay thế chúng.
{{< /note >}}

Theo mặc định, kubelet cố gắng pull từng image từ registry được chỉ định.
Tuy nhiên, nếu thuộc tính `imagePullPolicy` của container được đặt thành `IfNotPresent` hoặc `Never`,
thì image cục bộ sẽ được sử dụng (tương ứng là ưu tiên dùng hoặc chỉ dùng image cục bộ).

Nếu bạn muốn dựa vào các image được pull sẵn để thay thế cho việc xác thực với registry,
bạn phải đảm bảo tất cả các node trong cluster đều có cùng các image được pull sẵn.

Cách này có thể được dùng để tải trước một số image nhằm tăng tốc độ hoặc làm phương án thay thế cho
việc xác thực với registry riêng tư.

Tương tự như cách dùng [kubelet credential provider](#kubelet-credential-provider),
các image được pull sẵn cũng phù hợp để khởi chạy
các {{< glossary_tooltip text="static Pod" term_id="static-pod" >}} phụ thuộc
vào image được lưu trữ trong registry riêng tư.

{{< note >}}
{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}
Quyền truy cập vào các image được pull sẵn có thể được cấp phép theo [cơ chế xác minh thông tin xác thực khi pull image](#ensureimagepullcredentialverification).
{{< /note >}}

### Đảm bảo xác minh thông tin xác thực khi pull image {#ensureimagepullcredentialverification}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

Nếu feature gate `KubeletEnsureSecretPulledImages` được bật cho cluster của bạn,
Kubernetes sẽ kiểm tra thông tin xác thực của mọi image cần thông tin xác thực
để pull, ngay cả khi image đó đã có sẵn trên node. Việc kiểm tra này
đảm bảo rằng những image trong yêu cầu của Pod chưa từng được pull thành công
bằng thông tin xác thực được cung cấp sẽ phải được pull lại từ registry.
Ngoài ra, các lượt pull image dùng lại cùng thông tin xác thực
đã từng pull image thành công trước đó sẽ không cần pull lại từ
registry mà được kiểm tra cục bộ, không cần truy cập registry
(với điều kiện image có sẵn ở máy cục bộ).
Việc này được điều khiển bởi trường `imagePullCredentialsVerificationPolicy` trong
[cấu hình Kubelet](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy).

Cấu hình này quy định khi nào phải xác minh thông tin xác thực pull image nếu
image đã có sẵn trên node:

 * `NeverVerify`: Mô phỏng hành vi khi feature gate này bị tắt.
   Nếu image có sẵn ở máy cục bộ, thông tin xác thực pull image sẽ không được xác minh.
 * `NeverVerifyPreloadedImages`: Các image được pull bên ngoài kubelet sẽ không được xác minh,
 nhưng tất cả các image khác sẽ được xác minh thông tin xác thực. Đây là hành vi mặc định.
 * `NeverVerifyAllowListedImages`: Các image được pull bên ngoài kubelet và có trong
   `preloadedImagesVerificationAllowlist` được chỉ định trong cấu hình kubelet sẽ không được xác minh.
 * `AlwaysVerify`: Tất cả các image sẽ được xác minh thông tin xác thực
   trước khi có thể được sử dụng.

Việc xác minh này áp dụng cho [image được pull sẵn](#pre-pulled-images),
image được pull bằng secret ở cấp node, và image được pull bằng secret ở cấp Pod.

{{< note >}}
Trong trường hợp xoay vòng thông tin xác thực (credential rotation), thông tin xác thực trước đây đã dùng để pull image
sẽ tiếp tục được xác minh mà không cần truy cập registry. Thông tin xác thực mới hoặc đã được xoay vòng
sẽ yêu cầu image phải được pull lại từ registry.
{{< /note >}}

#### Bật `KubeletEnsureSecretPulledImages` lần đầu tiên {#enabling-kubeletensuresecretpulledimages-for-the-first-time}

Khi `KubeletEnsureSecretPulledImages` được bật lần đầu tiên, dù là
do nâng cấp kubelet hay do bật tính năng một cách tường minh, nếu kubelet có thể
truy cập bất kỳ image nào vào thời điểm đó, tất cả các image này sẽ được coi là đã được pull sẵn. Điều này xảy ra
vì trong trường hợp này kubelet không có bản ghi nào về việc các image đã được pull.
Kubelet chỉ có thể bắt đầu tạo bản ghi pull image khi một image bất kỳ được
pull lần đầu tiên.

Nếu đây là điều bạn lo ngại, bạn nên dọn khỏi các node tất cả những image không nên
được coi là pull sẵn trước khi bật tính năng này.

Lưu ý rằng việc xóa thư mục chứa các bản ghi pull image cũng sẽ có tác dụng
tương tự khi kubelet khởi động lại, cụ thể là các image đang được container runtime cache trên các node
đều sẽ được coi là đã được pull sẵn.

### Tạo Secret bằng cấu hình Docker {#creating-a-secret-with-a-docker-config}

Bạn cần biết tên người dùng, mật khẩu registry và địa chỉ email client để xác thực
với registry, cũng như hostname của registry đó.
Chạy lệnh sau, thay các giá trị giữ chỗ bằng giá trị phù hợp:

```shell
kubectl create secret docker-registry <name> \
  --docker-server=<docker-registry-server> \
  --docker-username=<docker-user> \
  --docker-password=<docker-password> \
  --docker-email=<docker-email>
```

Nếu bạn đã có sẵn file thông tin xác thực Docker thì thay vì dùng lệnh
ở trên, bạn có thể import file thông tin xác thực đó thành một
{{< glossary_tooltip text="Secret" term_id="secret" >}} của Kubernetes.
[Tạo Secret dựa trên thông tin xác thực Docker hiện có](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
giải thích cách thiết lập việc này.

Cách này đặc biệt hữu ích nếu bạn đang dùng nhiều container registry
riêng tư, vì `kubectl create secret docker-registry` tạo ra một Secret
chỉ hoạt động với một registry riêng tư duy nhất.

{{< note >}}
Pod chỉ có thể tham chiếu tới image pull secret trong namespace của chính nó,
vì vậy quy trình này cần được thực hiện một lần cho mỗi namespace.
{{< /note >}}

#### Tham chiếu `imagePullSecrets` trên một Pod {#referring-to-imagepullsecrets-on-a-pod}

Bây giờ, bạn có thể tạo các pod tham chiếu tới secret đó bằng cách thêm phần `imagePullSecrets`
vào định nghĩa Pod. Mỗi mục trong mảng `imagePullSecrets` chỉ có thể
tham chiếu tới một Secret trong cùng namespace.

Ví dụ:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

Việc này cần được thực hiện cho mỗi Pod sử dụng registry riêng tư.

Tuy nhiên, bạn có thể tự động hóa quy trình này bằng cách chỉ định phần `imagePullSecrets`
trong tài nguyên [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/).
Xem [Thêm ImagePullSecrets vào Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
để biết hướng dẫn chi tiết.

Bạn có thể dùng cách này kết hợp với file `.docker/config.json` trên từng node. Các thông tin xác thực
sẽ được hợp nhất.

### Các trường hợp sử dụng {#use-cases}

Có một số giải pháp để cấu hình registry riêng tư. Dưới đây là một số
trường hợp sử dụng phổ biến và giải pháp được đề xuất.

1. Cluster chỉ chạy các image không độc quyền (ví dụ: mã nguồn mở). Không cần ẩn image.
   - Sử dụng image công khai từ registry công khai
     - Không cần cấu hình.
     - Một số nhà cung cấp đám mây tự động cache hoặc mirror các image công khai, giúp cải thiện
       tính sẵn sàng và giảm thời gian pull image.
1. Cluster chạy một số image độc quyền cần được ẩn với những người bên ngoài công ty, nhưng
   hiển thị với tất cả người dùng cluster.
   - Sử dụng một registry riêng tư được lưu trữ (hosted)
     - Có thể cần cấu hình thủ công trên các node cần truy cập registry riêng tư.
   - Hoặc, chạy một registry riêng tư nội bộ phía sau tường lửa với quyền đọc mở.
     - Không cần cấu hình Kubernetes.
   - Sử dụng một dịch vụ container image registry được lưu trữ (hosted) có kiểm soát quyền truy cập image
     - Cách này sẽ hoạt động tốt hơn với tính năng tự động điều chỉnh số lượng Node (Node autoscaling) so với cấu hình node thủ công.
   - Hoặc, trên một cluster mà việc thay đổi cấu hình node gây bất tiện, hãy dùng `imagePullSecrets`.
1. Cluster có các image độc quyền, trong đó một vài image yêu cầu kiểm soát truy cập nghiêm ngặt hơn.
   - Đảm bảo [admission controller AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     đang hoạt động. Nếu không, tất cả các Pod đều có khả năng truy cập vào mọi image.
   - Chuyển dữ liệu nhạy cảm vào một tài nguyên Secret, thay vì đóng gói nó trong image.
1. Một cluster nhiều tenant (multi-tenant), trong đó mỗi tenant cần registry riêng tư của riêng mình.
   - Đảm bảo [admission controller AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     đang hoạt động. Nếu không, tất cả các Pod của tất cả các tenant đều có khả năng truy cập vào mọi image.
   - Chạy một registry riêng tư có yêu cầu phân quyền.
   - Tạo thông tin xác thực registry cho mỗi tenant, lưu vào một Secret, và phân phối
     Secret đó tới namespace của mọi tenant.
   - Sau đó, tenant thêm Secret đó vào `imagePullSecrets` của mỗi namespace.

Nếu bạn cần truy cập nhiều registry, bạn có thể tạo một Secret cho mỗi registry.

## Kubelet credential provider tích hợp sẵn kiểu cũ {#legacy-built-in-kubelet-credential-provider}

Trong các phiên bản Kubernetes cũ hơn, kubelet được tích hợp trực tiếp với thông tin xác thực
của nhà cung cấp đám mây. Điều này cho phép lấy thông tin xác thực
cho các image registry một cách động.

Có ba bản triển khai tích hợp sẵn của kubelet credential provider:
ACR (Azure Container Registry), ECR (Elastic Container Registry),
và GCR (Google Container Registry).

Kể từ phiên bản 1.26 của Kubernetes, cơ chế cũ này đã bị loại bỏ,
vì vậy bạn cần thực hiện một trong hai cách:
- cấu hình kubelet image credential provider trên mỗi node; hoặc
- chỉ định thông tin xác thực pull image bằng `imagePullSecrets` và ít nhất một Secret.

## {{% heading "whatsnext" %}}

* Đọc [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/main/manifest.md).
* Tìm hiểu về [thu gom rác (garbage collection) container image](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Tìm hiểu thêm về [pull một Image từ Registry riêng tư](/docs/tasks/configure-pod-container/pull-image-private-registry).

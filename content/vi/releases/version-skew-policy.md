---
title: Chính sách về độ lệch phiên bản
type: docs
description: >
  Độ lệch phiên bản tối đa được hỗ trợ giữa các thành phần của Kubernetes.
---

<!-- overview -->

Độ lệch phiên bản (version skew) đề cập đến sự khác biệt về phiên bản giữa các thành phần khác nhau trong cụm Kubernetes. Điều quan trọng là phải quản lý độ lệch phiên bản để đảm bảo khả năng tương thích và tính ổn định trong cụm.

Tài liệu này mô tả độ lệch phiên bản tối đa được hỗ trợ giữa các thành phần Kubernetes khác nhau.

Chú ý: Các công cụ triển khai cụm có thể có các hạn chế khác về độ lệch phiên bản, không được đề cập đến trong tài liệu này.

<!-- body -->

## Các phiên bản được hỗ trợ

Phiên bản Kubernetes được biểu thị dưới dạng **x.y.z**.
Ở đây, **x** chỉ phiên bản chính (major), **y** chỉ phiên bản phụ (minor) và **z** chỉ phiên bản vá (patch), theo thuật ngữ Phiên bản ngữ nghĩa ([Semantic Versioning](https://semver.org/)). Tham khảo thêm tại [Kubernetes Release Versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning).

Kubernetes duy trì các nhánh phát hành cho ba bản phát hành phụ gần đây nhất: ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes phiên bản 1.19 trở lên sẽ nhận được hỗ trợ bản vá trong [khoảng một năm](/releases/patch-releases/#support-period).
Các phiên bản Kubernetes trước 1.18 được hỗ trợ bản vá trong khoảng chín tháng.

Các bản sửa lỗi chức năng, bao gồm cả các sửa lỗi bảo mật, có thể được thêm vào ba nhánh phát hành đó, tùy thuộc vào mức độ nghiêm trọng và tính khả thi. Các bản vá được phát hành từ các nhánh đó theo
[lịch phát hành định kỳ](/releases/patch-releases/#cadence), cộng với các bản phát hành khẩn cấp bổ sung, khi cần thiết.

[Nhóm quản lý phát hành](/releases/release-managers/) sẽ chịu trách nhiệm đưa ra quyết định này.

Thông tin chi tiết, tham khảo thêm tại tài liệu [phát hành bản vá Kubernetes](/releases/patch-releases/).

## Các phiên bản lệch được hỗ trợ

Các phiên bản lệch (so với phiên bản mới nhất) được hỗ trợ cho từng thành phần của Kubernetes theo chính sách sau.

### kube-apiserver

Đối với [Cụm khả dụng cao (HA Clusters)](/docs/setup/production-environment/tools/kubeadm/high-availability/) (cụm có nhiều instance `kube-apiserver` cùng hoạt động), phiên bản cũ nhất và mới nhất của các instance `kube-apiserver` trong cụm không lệch nhau quá 1 phiên bản phụ.

Ví dụ:

* phiên bản mới nhất của một instance `kube-apiserver` là **{{< skew currentVersion >}}**
* phiên bản được cho phép của các intance `kube-apiserver` khác trong cùng cụm là **{{< skew currentVersion >}}** và **{{< skew currentVersionAddMinor -1 >}}**

### kubelet

* phiên bản phát hành của `kubelet` không được phép mới hơn của `kube-apiserver`
* phiên bản phát hành của `kubelet` được phép tối đa cũ hơn 3 phiên bản phát hành phụ (minor release) so với của `kube-apiserver` (đối với `kubelet` phiên bản trước 1.25, được phép cũ hơn tối đa 2 phiên bản)

Ví dụ:

* phiên bản phát hành của `kube-apiserver` là **{{< skew currentVersion >}}**
* phiên bản phát hành được cho phép của `kubelet` là **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}**, và **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Trong trường hợp cụm HA chứa các instance `kube-apiserver` lệch phiên bản, số lượng phiên bản được cho phép của `kubelet` sẽ bị giảm đi.
{{</ note >}}

Ví dụ:

* phiên bản phát hành của các `kube-apiserver` instance trong cụm là **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* các phiên bản phát hành được cho phép của `kubelet` sẽ là **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  và **{{< skew currentVersionAddMinor -3 >}}** (bản **{{< skew currentVersion >}}** không được cho phép vì mới hơn phiên bản phát hành của instance `kube-apiserver` phiên bản **{{< skew currentVersionAddMinor -1 >}}**)

### kube-proxy

* phiên bản phát hành của `kube-proxy` không được mới hơn của `kube-apiserver`
* phiên bản phát hành của `kube-proxy` được phép tối đa cũ hơn 3 phiên bản phát hành phụ (minor release) so với của `kube-apiserver` (đối với `kube-proxy` phiên bản trước 1.25, được phép cũ hơn tối đa 2 phiên bản)
* phiên bản phát hành của `kube-proxy` được phép mới hơn hoặc cũ hơn tối đa 3 phiên bản phát hành phụ (minor release) so với của `kubelet` chạy cùng node với nó (đối với `kube-proxy` phiên bản trước 1.25, được phép mới hơn hoặc cũ hơn tối đa tối đa 2 phiên bản)

Ví dụ:

* phiên bản phát hành của `kube-apiserver` là **{{< skew currentVersion >}}**
* phiên bản phát hành được cho phép của `kube-proxy` là **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}**, và **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Trong trường hợp cụm HA chứa các instance `kube-apiserver` lệch phiên bản, số lượng phiên bản được cho phép của `kube-proxy` sẽ bị giảm đi.
{{</ note >}}

* phiên bản phát hành của các `kube-apiserver` instance trong cụm là **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* các phiên bản phát hành được cho phép của `kube-proxy` sẽ là **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  và **{{< skew currentVersionAddMinor -3 >}}** (bản **{{< skew currentVersion >}}** không được cho phép vì mới hơn phiên bản phát hành của instance `kube-apiserver` phiên bản **{{< skew currentVersionAddMinor -1 >}}**)

### kube-controller-manager, kube-scheduler, cloud-controller-manager

Phiên bản phát hành của `kube-controller-manager`, `kube-scheduler`, và `cloud-controller-manager` không được phép mới hơn của `kube-apiserver` mà chúng hoạt động cùng. Phiên bản phát hành được kỳ vọng là trùng với phiên bản phát hành của `kube-apiserver`, tuy nhiên có thể cũ hơn tối đa 1 phiên bản phát hành phụ (minor release) trong trường hợp nâng cấp cụm (live upgrades).

Ví dụ:

* phiên bản phát hành của `kube-apiserver` là **{{< skew currentVersion >}}**
* phiên bản phát hành của `kube-controller-manager`, `kube-scheduler`, và `cloud-controller-manager` được cho phép là **{{< skew currentVersion >}}** và **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Trong trường hợp cụm HA chứa các instance `kube-apiserver` lệch phiên bản, và các thành phần này có thể tương tác với tất cả các instance `kube-apiserver` trong cụm (chẳng hạn thông qua load balancer), số lượng phiên bản được cho phép của các thành phần này sẽ giảm đi.
{{< /note >}}

Ví dụ:

* phiên bản phát hành của các `kube-apiserver` instance trong cụm là **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kube-controller-manager`, `kube-scheduler`, và `cloud-controller-manager` có thể kết nối với tất cả các instance `kube-apiserver` thông qua load balancer
* phiên bản phát hành được cho phép của `kube-controller-manager`, `kube-scheduler`, và `cloud-controller-manager` là **{{< skew currentVersionAddMinor -1 >}}** (bản **{{< skew currentVersion >}}** không được cho phép vì mới hơn phiên bản phát hành của instance `kube-apiserver` phiên bản **{{< skew currentVersionAddMinor -1 >}}**)

### kubectl

Độ lệch phiên bản phát hành được cho phép của `kubectl` là 1 bản phát hành phụ (minor release) cũ hoặc mới hơn so với phiên bản phát hành của `kube-apiserver`

Ví dụ:

* phiên bản phát hành của `kube-apiserver` là **{{< skew currentVersion >}}**
* phiên bản phát hành được cho phép của `kubectl` là **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**, và **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Trong trường hợp cụm HA chứa các instance `kube-apiserver` lệch phiên bản, số lượng phiên bản được cho phép của `kubectl` sẽ bị giảm đi.
{{< /note >}}

Ví dụ:

* phiên bản phát hành của các `kube-apiserver` instance trong cụm là **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* phiên bản phát hành được cho phép của `kubectl` sẽ là **{{< skew currentVersion >}}** và **{{< skew currentVersionAddMinor -1 >}}** (các phiên bản khác có thể có độ lệch lớn hơn 1 so với phiên bản phát hành của `kube-apiserver`)

## Thứ tự nâng cấp thành phần

Độ lệch phiên bản được hỗ trợ giữa các thành phần có tác động tới thứ tự mà các thành phần được nâng cấp. Phần này mô tả thứ tự mà các thành phần phải được nâng cấp để chuyển đổi cụm hiện có từ phiên bản **{{< skew currentVersionAddMinor -1 >}}** sang phiên bản **{{< skew currentVersion >}}**.

Ngoài ra, khi chuẩn bị nâng cấp, Kubernetes khuyến nghị bạn thực hiện các bước sau để được hưởng lợi từ nhiều bản sửa lỗi và hồi quy nhất có thể trong quá trình nâng cấp:

* Đảm bảo phiên bản hiện tại của các thành phần đang ở bản vá (patch) mới nhất trong số các phiên bản vá của bản phát hành phụ hiện tại (minor version)
* Khi tiến hành cập nhật, hãy cập nhật lên phiển bản vá mới nhất của phiên bản phát hành phụ dự định cập nhật

Chẳng hạn, hiện tại bạn đang sử dụng phiên bản phát hành {{<skew currentVersionAddMinor -1>}}, hãy chắc chắn bạn đã đang sử dụng bản vá mới nhất. Sau đó, tiến hành nâng cấp cụm lên phiên bản vá mới nhất của {{<skew currentVersion>}}.

### kube-apiserver

Điều kiện:

* Trường hợp cụm đơn, phiên bản phát hành của `kube-apiserver` đang là **{{< skew currentVersionAddMinor -1 >}}**
* Trường hợp cụm cài đặt HA, tất cả các instance của `kube-apiserver` đang là **{{< skew currentVersionAddMinor -1 >}}** hoặc
  **{{< skew currentVersion >}}** (điều này đảm bảo độ lệch phiên bản tối đa giữa các instance `kube-apiserver` là 1)
* Các thành phần `kube-controller-manager`, `kube-scheduler`, và `cloud-controller-manager` đang kết nối với `kube-apiserver` phải ở phiên bản **{{< skew currentVersionAddMinor -1 >}}** (điều này đảm bảo chúng không chạy phiên bản mới hơn `kube-apiserver` và có độ lệch không quá 1 phiên bản phụ so với phiên bản `kube-apiserver` dự định nâng cấp)
* Phiên bản phát hành của các instance `kubelet` trên tất cả các node trong cụm đều ở phiên bản **{{< skew currentVersionAddMinor -1 >}}** hoặc **{{< skew currentVersionAddMinor -2 >}}**
(điều này đảm bảo chúng không chạy phiên bản phát hành mới hơn và có độ lệch phiên bản không quá 2 so với phiên bản `kube-apiserver` dự định nâng cấp)
* Các webhooks quản lý đăng ký phải có khả năng tiếp nhận dữ liệu mà instance `kube-apiserver` mới sẽ gửi cho chúng:
  * `ValidatingWebhookConfiguration` và `MutatingWebhookConfiguration` object được cập nhật để chứa thông tin về phiên bản mới của các REST resources được thêm vào trong phiên bản **{{< skew currentVersion >}}** (hoặc sử dụng [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) đối với các phiên bản v1.15+)
  * Các webhooks phải có khả năng tiếp nhận và xử lý bất cứ phiên bản mới của các REST resources sẽ được gửi tới chúng, cũng như bất kỳ thông tin mới được thêm vào cho các phiên bản hiện tại **{{< skew currentVersion >}}**

Tiến hành nâng cấp `kube-apiserver` lên phiên bản **{{< skew currentVersion >}}**.


{{< note >}}
Theo chính sách cho [API deprecation](/docs/reference/using-api/deprecation-policy/) và
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md), `kube-apiserver` được yêu cầu nâng cấp lần lượt qua tất cả các phiên bản phát hành phụ (minor release), bất kể trong trường hợp cài đặt HA hay không
{{< /note >}}

### kube-controller-manager, kube-scheduler, cloud-controller-manager

Điều kiện:

* Phiên bản phát hành của `kube-aapiserver` phải là **{{< skew currentVersion >}}**
  (trong trường hợp cụm HA, các thành phần này có khả năng tương tác với tất cả các instance `kube-apiserver` trong cụm, tất cả các instance `kube-apiserver` phải được nâng cấp trước khi nâng cấp controllers và scheduler)

Tiến hành nâng cấp `kube-controller-manager`, `kube-scheduler`, và
`cloud-controller-manager` lên phiên bản **{{< skew currentVersion >}}**.

Không có yêu cầu nào về thứ tự nâng cấp giữa các controllers và scheduler. Bạn có thể nâng cấp theo bất cứ thứ tự nào, thậm trí nâng cấp đồng thời tất cả các controllers và scheduler.

### kubelet

Điều kiện:

* Phiên bản phát hành của `kube-apiserver` mà `kubelet` sẽ tương tác phải là **{{< skew currentVersion >}}**

Có thể nâng cấp phiên bản phát hành của `kubelet` lên **{{< skew currentVersion >}}** (hoặc cũng có thể để nguyên ở **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, hoặc **{{< skew currentVersionAddMinor -3 >}}**)

{{< note >}}
Trước khi tiến hành nâng cấp phiên bản `kubelet`, [drain](/docs/tasks/administer-cluster/safely-drain-node/) tất cả pod khỏi node đó. Nâng cấp phiên bản phát hành cho `kubelet` khi đang hoạt động hiện chưa được hỗ trợ.
{{</ note >}}

{{< warning >}}
Sử dụng một cụm có chứa các `kubelet` đang chạy ở phiên bản phát hành cũ hơn của `kube-apiserver` 3 phiên bản, đồng nghĩa bạn phải nâng cấp `kubelet` trước khi có thể nâng cấp control plane (`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, etc.)
{{</ warning >}}

### kube-proxy

Điều kiện:

* Phiên bản phát hành của `kube-apiserver` mà `kube-proxy` sẽ tương tác phải là **{{< skew currentVersion >}}**

Có thể nâng cấp phiên bản phát hành của `kube-proxy` lên **{{< skew currentVersion >}}** (hoặc cũng có thể để nguyên ở **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, hoặc **{{< skew currentVersionAddMinor -3 >}}**)

{{< warning >}}
Sử dụng một cụm có chứa các `kube-proxy` đang chạy ở phiên bản phát hành cũ hơn của `kube-apiserver` 3 phiên bản, đồng nghĩa bạn phải nâng cấp `kube-proxy` trước khi có thể nâng cấp control plane (`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, etc.)
{{</ warning >}}

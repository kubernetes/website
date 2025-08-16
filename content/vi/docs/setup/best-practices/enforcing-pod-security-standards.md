---
title: Thực thi các tiêu chuẩn bảo mật Pod
weight: 40
---

<!-- overview -->

Trang này cung cấp tổng quan về các phương pháp tốt nhất khi thực thi
[Tiêu chuẩn bảo mật Pod](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Sử dụng Pod Security Admission Controller tích hợp sẵn

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

[Pod Security Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
được tạo ra để thay thế PodSecurityPolicies đã bị loại bỏ.

### Cấu hình tất cả các namespace trong cluster

Các namespace không có bất kỳ cấu hình nào nên được xem là những lỗ hổng đáng kể trong mô hình bảo mật cluster của bạn. Chúng tôi khuyến nghị bạn nên dành thời gian phân tích các loại workload trong mỗi namespace, và bằng cách tham khảo Tiêu chuẩn bảo mật Pod, quyết định mức độ phù hợp cho từng namespace. Các namespace chưa được gắn nhãn chỉ nên được hiểu là chúng chưa được đánh giá.

Trong trường hợp tất cả các workload trong tất cả các namespace đều có cùng yêu cầu bảo mật, chúng tôi cung cấp một [ví dụ](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces) minh họa cách áp dụng đồng loạt các nhãn PodSecurity.

### Áp dụng nguyên tắc đặc quyền tối thiểu

Trong một thế giới lý tưởng, mọi pod trong mọi namespace đều đáp ứng các yêu cầu của chính sách `restricted`. Tuy nhiên, điều này không khả thi và không thực tế, vì một số workload sẽ cần các đặc quyền nâng cao vì những lý do chính đáng.

- Các namespace cho phép workload `privileged` cần thiết lập và thực thi các kiểm soát truy cập phù hợp.
- Đối với các workload chạy trong những namespace có tính permissive, hãy duy trì tài liệu về các yêu cầu bảo mật đặc thù của chúng. Nếu có thể, hãy xem xét cách các yêu cầu đó có thể được giới hạn thêm.

### Áp dụng chiến lược đa chế độ

Các chế độ `audit` và `warn` của Pod Security Standards admission controller giúp dễ dàng thu thập các thông tin bảo mật quan trọng về pod của bạn mà không ảnh hưởng đến các workload hiện có.

Một thực hành tốt là bật các chế độ này cho tất cả các namespace, đặt chúng ở mức độ và phiên bản _mong muốn_ mà bạn cuối cùng muốn `enforce`. Các cảnh báo và chú thích audit được tạo ra trong giai đoạn này có thể hướng dẫn bạn đạt được trạng thái đó. Nếu bạn mong đợi các tác giả workload thực hiện thay đổi để phù hợp với mức độ mong muốn, hãy bật chế độ `warn`. Nếu bạn dự định sử dụng nhật ký audit để theo dõi/thúc đẩy các thay đổi phù hợp với mức độ mong muốn, hãy bật chế độ `audit`.

Khi bạn đã đặt chế độ `enforce` ở giá trị mong muốn, các chế độ này vẫn có thể hữu ích theo một số cách khác nhau:

- Bằng cách đặt `warn` ở cùng mức với `enforce`, các client sẽ nhận được cảnh báo khi cố gắng tạo Pod (hoặc tài nguyên có Pod template) không vượt qua validation. Điều này sẽ giúp họ cập nhật các tài nguyên đó để tuân thủ.
- Trong các Namespace gắn `enforce` vào một phiên bản cụ thể không phải latest, việc đặt các chế độ `audit` và `warn` ở cùng mức với `enforce`, nhưng ở phiên bản `latest`, giúp hiển thị các cài đặt được phép bởi các phiên bản trước nhưng không được phép theo best practices hiện tại.

## Các giải pháp thay thế từ bên thứ ba

{{% thirdparty-content %}}

Các giải pháp thay thế khác để thực thi security profile đang được phát triển trong hệ sinh thái Kubernetes:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

Quyết định sử dụng giải pháp _tích hợp sẵn_ (ví dụ: Pod Security admission controller) hay công cụ của bên thứ ba hoàn toàn phụ thuộc vào tình huống cụ thể của bạn. Khi đánh giá bất kỳ giải pháp nào, sự tin tưởng vào chuỗi cung ứng của bạn là yếu tố then chốt. Cuối cùng, việc sử dụng _bất kỳ_ phương pháp nào trong số các phương pháp đã đề cập sẽ tốt hơn là không làm gì cả.

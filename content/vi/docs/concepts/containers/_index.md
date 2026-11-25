---
title: Container
weight: 40
description: Công nghệ đóng gói một ứng dụng cùng với các thành phần phụ thuộc mà ứng dụng cần khi chạy.
content_type: concept
card:
  name: concepts
  weight: 50
---

<!-- overview -->

Trang này trình bày về container và container image, cũng như cách sử dụng chúng trong vận hành và phát triển giải pháp.

Từ _container_ được dùng với nhiều nghĩa khác nhau. Mỗi khi dùng từ này, bạn hãy kiểm tra xem người nghe có hiểu theo cùng một định nghĩa với bạn hay không.

Mỗi container mà bạn chạy đều có thể tái lập (repeatable); việc chuẩn hóa bằng cách đóng gói kèm
các thành phần phụ thuộc giúp bạn nhận được cùng một hành vi ở bất cứ nơi nào bạn
chạy container đó.

Container tách rời ứng dụng khỏi hạ tầng máy chủ (host) bên dưới.
Điều này giúp việc triển khai trở nên dễ dàng hơn trên các môi trường đám mây hoặc hệ điều hành khác nhau.

Mỗi {{< glossary_tooltip text="node" term_id="node" >}} trong một cluster
Kubernetes chạy các container tạo nên các
[Pod](/docs/concepts/workloads/pods/) được gán cho node đó.
Các container trong một Pod luôn được đặt cùng vị trí (co-located) và lập lịch cùng nhau (co-scheduled) để chạy trên cùng một node.


<!-- body -->

## Container image {#container-images}
Một [container image](/docs/concepts/containers/images/) là một gói phần mềm
sẵn sàng để chạy, chứa mọi thứ cần thiết để chạy một ứng dụng:
mã chương trình và mọi runtime mà nó cần, các thư viện ứng dụng và thư viện hệ thống,
cùng với giá trị mặc định cho mọi thiết lập thiết yếu.

Container được thiết kế theo hướng stateless và
[bất biến](https://glossary.cncf.io/immutable-infrastructure/):
bạn không nên thay đổi
mã của một container đang chạy. Nếu bạn có một ứng dụng đã được container hóa
và muốn thay đổi nó, quy trình đúng là build một image mới
có chứa thay đổi đó, sau đó tạo lại container để khởi động từ
image đã được cập nhật.

## Container runtime {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

Thông thường, bạn có thể để cluster tự chọn container runtime mặc định
cho một Pod. Nếu bạn cần dùng nhiều hơn một container runtime trong cluster,
bạn có thể chỉ định [RuntimeClass](/docs/concepts/containers/runtime-class/)
cho Pod để đảm bảo rằng Kubernetes chạy các container đó bằng một
container runtime cụ thể.

Bạn cũng có thể dùng RuntimeClass để chạy các Pod khác nhau với cùng một container
runtime nhưng với các thiết lập khác nhau.

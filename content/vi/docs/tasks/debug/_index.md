---
title: "Giám sát, ghi nhật ký và gỡ lỗi"
description: Thiết lập hệ thống giám sát và ghi nhật ký để khắc phục sự cố cụm, hoặc gỡ lỗi ứng dụng trong container.
weight: 40
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Getting help
---

<!-- overview -->

Đôi khi mọi thứ diễn ra không như mong muốn. Hướng dẫn này sẽ giúp bạn thu thập những thông tin cần thiết và khắc phục sự cố. Hướng dẫn này được chia làm 4 phần:

* [Gỡ lỗi ứng dụng](/docs/tasks/debug/debug-application/) - Hữu ích cho những người
  triển khai ứng dụng lên Kubernetes và muốn hiểu vì sao ứng dụng không hoạt động như mong đợi.
  
* [Gỡ lỗi cụm](/docs/tasks/debug/debug-cluster/) - Hữu ích cho 
  các quản trị viên và người vận hành cụm khắc phục các sự cố trong cụm.
  
* [Ghi nhật ký trong Kubernetes](/docs/tasks/debug/logging/) - Hữu ích cho
  các quản trị viên muốn thiết lập và quản lý hệ thống nhật ký trong Kubernetes.
  
* [Giám sát trong Kubernetes](/docs/tasks/debug/monitoring/) - Hữu ích cho
  các quản trị viên muốn triển khai hệ thống giám sát trong Kubernetes.
  

Bạn cũng nên tham khảo các sự cố đã biết của [phiên bản](https://github.com/kubernetes/kubernetes/releases) mà bạn đang sử dụng.

<!-- body -->

## Nhận trợ giúp

Nếu bạn vẫn chưa tìm được cách xử lý cho vấn đề của mình trong các hướng dẫn ở trên,
bạn có thể tìm kiếm sự hỗ trợ từ cộng đồng Kubernetes thông qua nhiều kênh khác nhau.

### Câu hỏi

Tài liệu trên trang này được tổ chức nhằm giải đáp nhiều loại câu hỏi khác nhau về Kubernetes.
[Khái niệm](/docs/concepts/) giải thích kiến trúc của Kubernetes và cách thức hoạt động của từng thành phần.
[Thiết lập](/docs/setup/) cung cấp các hướng dẫn để bạn bắt đầu sử dụng Kubernetes.
[Tác vụ](/docs/tasks/) hướng dẫn cách thực hiện các tác vụ thường gặp, và
[Hướng dẫn thực hành](/docs/tutorials/) cung cấp hướng dẫn chi tiết cho các tình huống thực tế,
theo từng lĩnh vực hoặc trong toàn bộ quy trình phát triển.
Mục [Tài liệu tham khảo](/docs/reference/) cung cấp tài liệu chi tiết về [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
và các giao diện dòng lệnh (CLIs) như [`kubectl`](/docs/reference/kubectl/).

## Giúp với! Vấn đề của tôi không có trong tài liệu! Tôi cần hỗ trợ ngay! 

### Stack Exchange, Stack Overflow, hoặc Server Fault {#stack-exchange}

Nếu bạn có câu hỏi liên quan đến *phát triển phần mềm* cho ứng dụng chạy trong container,
bạn có thể đặt câu hỏi trên [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

Nếu bạn có câu hỏi về Kubernetes liên quan đến *quản lý cụm* hay *cấu hình*,
bạn có thể đặt câu hỏi trên [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

Ngoài ra, hệ thống Stack Exchange còn có nhiều trang chuyên biệt khác, 
phù hợp để đặt các câu hỏi về Kubernetes trong những lĩnh vực như
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), 
[Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes),
hay [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Rất có thể đã có một thành viên trong cộng đồng gặp phải vấn đề tương tự
hoặc có thể sẵn sàng giúp bạn giải quyết vấn đề.

Đội ngũ Kubernetes cũng theo dõi
[các bài đăng được gắn thẻ Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
Nếu không có câu hỏi nào giải quyết được vấn đề của bạn, **hãy đảm bảo rằng vấn đề đó
[phù hợp với chủ đề của Stack Overflow](https://stackoverflow.com/help/on-topic),
[Server Fault](https://serverfault.com/help/on-topic), hoặc trang Stack Exchange 
mà bạn định đăng bài**, đồng thời hãy đọc qua hướng dẫn 
[cách đặt câu hỏi mới](https://stackoverflow.com/help/how-to-ask) trước khi tạo bài đăng!

### Slack

Nhiều thành viên trong cộng đồng Kubernetes trao đổi trên Kubernetes Slack, trong kênh `#kubernetes-users`.
Slack yêu cầu phải đăng ký; bạn có thể [gửi yêu cầu tham dự](https://slack.kubernetes.io),
việc đăng ký được mở cho tất cả mọi người. Đừng ngại tham gia và đặt bất kỳ câu hỏi nào.
Sau khi đăng ký, truy cập [Kubernetes trên Slack](https://kubernetes.slack.com) thông qua trình duyệt hoặc qua ứng dụng Slack.

Sau khi tham gia, bạn có thể khám phá danh sách các kênh thảo luận theo từng chủ đề. Ví dụ, người mới bắt đầu với Kubernetes có thể tham gia kênh
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice). Các nhà phát triển có thể tham gia kênh 
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors).

Ngoài ra còn có các kênh dành riêng cho từng quốc gia hoặc ngôn ngữ. Bạn có thể tham gia các kênh này
để nhận được sự hỗ trợ và trao đổi thông tin bằng ngôn ngữ địa phương:

{{< table caption="Kênh Slack cho các quốc gia / ngôn ngữ" >}}
Quốc gia | Kênh
:---------|:------------
Trung Quốc | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Phần Lan | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
Pháp | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Đức | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
Ấn Độ | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Ý | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Nhật Bản | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Hàn Quốc | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Hà Lan | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Na Uy | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Ba Lan | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Nga | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Tây Ban Nha | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Thuỵ Điển | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Thổ Nhĩ Kỳ | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Diễn đàn

Bạn được chào đón tham gia diễn đàn chính thức của Kubernetes: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Báo lỗi và đề xuất tính năng

Nếu bạn phát hiện ra lỗi hoặc muốn đề xuất một tính năng, hãy sử dụng 
[GitHub issue](https://github.com/kubernetes/kubernetes/issues).

Trước khi tạo một issue mới, hãy tìm trong các issue hiện có để xem các vấn đề của bạn đã được thảo luận trước đó hay chưa.

Khi báo cáo lỗi, hãy cung cấp đầy đủ thông tin để có thể tái hiện lỗi, ví dụ:

* Phiên bản Kubernetes `kubectl version`
* Nhà cung cấp Cloud, hệ điều hành, cấu hình mạng, phiên bản container runtime
* Các bước để tái hiện sự cố


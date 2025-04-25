---
title: Quản lý phát hành
type: docs
---

"Người quản lý phát hành" là thuật ngữ chung bao gồm nhóm những người đóng góp cho Kubernetes chịu trách nhiệm duy trì các nhánh phát hành và tạo các bản phát hành bằng cách sử dụng các công cụ mà SIG Release cung cấp.

Vai trò của từng nhóm được thể hiện như sau
<!-- 
- [Contact](#contact)
  - [Security Embargo Policy](#security-embargo-policy)
- [Handbooks](#handbooks)
- [Release Managers](#release-managers)
  - [Becoming a Release Manager](#becoming-a-release-manager)
- [Release Manager Associates](#release-manager-associates)
  - [Becoming a Release Manager Associate](#becoming-a-release-manager-associate)
- [SIG Release Leads](#sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)
-->

- [Thông tin liên hệ](#contact)
  - [Chính sách cấm chia sẻ thông tin an ninh](#security-embargo-policy)
- [Handbooks](#handbooks)
- [Nhóm quản lý phát hành](#release-managers)
  - [Tham gia nhóm quản lý phát hành](#becoming-a-release-manager)
- [Nhóm dự bị quản lý phát hành](#release-manager-associates)
  - [Tham gia nhóm dự bị quản lý phát hành](#becoming-a-release-manager-associate)
- [SIG Release Leads](#sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)

## Thông tin liên hệ {#contact}

| Mailing List | Slack | Visibility | Mục đích | Thành viên |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (channel) / @release-managers (user group) | Public | Nơi thảo luận công khai của nhóm quản lý phát hành | Tất cả thành viên (bao gồm cả nhóm trợ lý, và SIG Chairs) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Private | Nơi thảo luận riêng cho các quản trị viên đặc quyền | Nhóm quản trị phát hành, leader tại SIG Release |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (channel) / @security-rel-team (user group) | Private | Nhóm an ninh và nhóm ứng phó sự cố an ninh | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Chính sách cấm chia sẻ thông tin an ninh {#security-embargo-policy}

Một số thông tin về bản phát hành có thể không được công khai và chúng tôi đã xác định chính sách về cách thiết lập lệnh cấm công khai đó.
Tham khảo thêm tại [Chính sách cấm chia sẻ thông tin an ninh](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy).

## Handbooks

**LƯU Ý: Handbook cho Nhóm phát hành bản vá và Nhóm quản trị nhánh phát hành (branch) sẽ được loại bỏ trùng lặp sau.**

- [Nhóm phát hành bản vá][handbook-patch-release]
- [Nhóm quản trị nhánh phát hành][handbook-branch-mgmt]

## Nhóm quản lý phát hành {#release-managers}

**Lưu ý:** Tài liệu có thể đề cập đến Nhóm phát hành bản vá và vai trò Quản lý nhánh phát hành. Hai vai trò đó được hợp nhất thành vai trò Quản lý phát hành.

Yêu cầu tối thiểu cho Nhóm quản lý phát hành và Nhóm hỗ trợ quản lý phát hành:

- Thành thạo sử dụng các câu lệnh Unix, có khả năng debug shell scripts.
- Thành thạo sử dụng `git` và quản lý nhánh (branch) sử dụng `git` command.
- Kiến thức về Google Cloud (Cloud Build và Cloud Storage).
- Sẵn sàng tìm kiếm sự giúp đỡ khi gặp sự cố, khả năng giao tiếp rõ ràng.
- Kubernetes Community [membership][community-membership]

Nhóm quản lý phát hành có trách nhiệm:

- Phối hợp và phát hành phiên bản Kubernetes:
  - Bản vá - Patch releases (`x.y.z`, where `z` > 0)
  - Bản phụ - Minor releases (`x.y.z`, where `z` = 0)
  - Bản dùng thử Pre-releases (alpha, beta, và release candidates(rc))
  - Làm việc với [Nhóm phát hành][release-team] trong chu kỳ phát hành
  - Thiết lập [lịch và nhịp độ phát hành cho bản vá][patches]
- Duy trì các nhánh phát hành (release branch):
  - Đánh giá các cherry picks
  - Đảm bảo nhánh phát hành luôn hoạt động tốt và không có bản vá lỗi không mong muốn nào được hợp nhất
- Hướng dẫn [Nhóm dự bị quản lý phát hành](#release-manager-associates)
- Phát triển tính năng và duy trì code trong k/release
- Hỗ trợ nhóm dự dự bị quản lý phát hành và những người đóng góp độc lập thông qua chương trình Buddy
  - Định kỳ họp mặt với nhóm dự bị, phân chia nhiệm vụ (phát triển tính năng hoặc quản lý phát hành), hoặc hướng dẫn.
  - Hỗ trợ nhóm dự bị trong việc hướng dẫn bước đầu cho những người đóng góp mới, trả lời các câu hỏi liên quan hoặc gợi ý những nhiệm vụ có thể cho họ.

Nhóm quản lý phát hành cũng làm việc chặt chẽ với [Ủy ban ứng phó vấn đề an ninh][src], do đó tuân thủ theo các hướng dẫn được nêu trong [Quy trình an ninh cho phát hành][security-release-process].

GitHub Access Controls: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Mentions: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Tham gia nhóm quản lý phát hành {#becoming-a-release-manager}

Để trở thành thành viên nhóm quản lý phát hành, bạn phải trải qua quá trình dự bị quản lý phát hành. Những thành viên dự bị được thăng hạng trở thành thành viên quản lý phát hành thông qua việc hoàn thành những nhiệm vụ được giao qua nhiều vòng phát triển (release cycles), đồng thời:

- Thể hiện sự sẵn sàng cho vai trò quản lý
- Làm việc hiệu quả với nhóm quản lý phát hành và có khả năng tạo bản phát hành một cách độc lập
  - Vì mỗi bản phát hành có chức năng hạn chế, chúng tôi cũng xem xét những đóng góp đáng kể cho việc quảng bá hình ảnh và các nhiệm vụ kỹ thuật khác trong quá trình phát hành
- Khả năng hỗ trợ các dự bị quản lý phát hành khác, khả năng đề xuất cải tiến, thu thập phản hồi và thúc đẩy sự thay đổi
- Đáng tin cậy, có khả năng phản hồi nhanh
- Có lý do chính đáng cho việc tham gia, chẳng hạn cần có quyền truy cập của nhóm quản lý phát hành để hoàn thành nhiệm vụ được giao

## Nhóm dự bị quản lý phát hành {#release-manager-associates}

Nhóm dự bị quản lý phát hành được hiểu là người học việc để trở thành người thuộc Nhóm quản lý phát hành. Trách nhiệm bao gồm:

- Các nhiệm vụ liên quan đến phát hành bản vá, review cherry-pick
- Đóng góp trực tiếp cho k/release: nâng cấp phiên bản cho các thư viện phụ thuộc, làm quen với source codebase
- Đóng góp cho tài liệu: bảo trì handbook, đảm bảo quy trình phát hành được tài liệu hóa
- Với sự hỗ trợ của Nhóm quản lý phát hành: làm việc cùng nhóm phát hành trong các vòng phát triển, hỗ trợ việc phát hành các phiên bản
- Chủ động tìm kiếm các cơ hộ để quảng bá và thông báo về các bản phát hành
  - Đưa ra các thông báo sớm hoặc các cập nhật về các bản vá sắp tới
  - Cập nhật lịch phát hành, đưa ra các mốc thời gian cũng như thông báo về các bản phát hành mới trên [Timeline vòng phát triển][k-sig-release-releases]
- Thông qua chương trình Buddy, hướng dẫn bước đầu cho những người đóng góp mới và làm việc cùng họ trong các nhiệm vụ

GitHub Mentions: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Tham gia nhóm dự bị quản lý phát hành {#becoming-a-release-manager-associate}

Người đóng góp độc lập có thể tham gia vào nhóm dự bị quản lý phát hành qua việc đạt được các tiêu chí sau:

- Tham gia thường xuyên, bao gồm 6-12 tháng có hoạt động liên quan đến vấn đề kỹ thuật
- Có kinh nghiệm đảm nhiệm vai trò lãnh đạo kỹ thuật trong Nhóm phát hành trong chu kỳ phát hành
  - kinh nghiệm này cung cấp một cơ sở vững chắc để hiểu cách SIG Release hoạt động tổng thể—bao gồm cả kỳ vọng của chúng tôi về kỹ năng kỹ thuật, giao tiếp/phản hồi và độ tin cậy
- Làm việc trên các mục k/release giúp cải thiện tương tác của chúng tôi với Testgrid, dọn dẹp thư viện, v.v.
  - Những nhiệm vụ này đòi hỏi phải tương tác với các thành viên Nhóm quản lý phát hành và dự bị

## SIG Release Leads

SIG Release Chairs và Technical Leads có nhiệm vụ:

- Quản lý SIG Release
- Dẫn dắt các buổi trao đổi kiến ​​thức cho các quản lý phát hành và dự bị quản lý phát hành
- Huấn luyện các kỹ năng lãnh đạo và lên lịch ưu tiên

Họ được đề cập rõ ràng ở đây vì họ là có đặc quyền ở nhiều kênh liên lạc và nhóm phân quyền (ví dụ nhóm phân quyền trên GitHub org, quyền truy cập GCP) cho từng vai trò. Do đó, họ là thành viên cộng đồng có đặc quyền cao và được biết một số thông tin liên lạc không công khai, đôi khi có thể liên quan đến vấn đề bảo mật của Kubernetes.

GitHub team: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Chairs

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Technical Leads

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Bạn có thể tìm thấy thông tin về các nhóm quản lý nhánh phát hành trước đây tại [thư mục releases][k-sig-release-releases] của repo kubernetes/sig-release, các tệp `release-x.y/release_team.md`.

Ví dụ: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md

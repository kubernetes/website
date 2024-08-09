# Tài liệu Kubernetes

[![Trạng thái Netlify](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![Phiên bản GitHub](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Kho lưu trữ này chứa các tài sản cần thiết để xây dựng [trang web và tài liệu Kubernetes](https://kubernetes.io/). Chúng tôi rất vui mừng khi bạn muốn đóng góp!

- [Đóng góp vào tài liệu](#đóng-góp-vào-tài-liệu)
- [READMEs đa ngôn ngữ](#các-tệp-readme-đa-ngôn-ngữ)

## Sử dụng kho lưu trữ này

Bạn có thể chạy trang web này ở chế độ local bằng cách sử dụng [Hugo (Phiên bản mở rộng)](https://gohugo.io/), hoặc bạn có thể chạy nó trong một container runtime. Chúng tôi khuyến nghị sử dụng container runtime, vì nó mang lại tính nhất quán trong triển khai so với trang web thực tế.

## Chuẩn bị để sử dụng

Để sử dụng kho lưu trữ này, bạn cần cài đặt các phần mềm sau trên máy tính của bạn:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Phiên bản mở rộng)](https://gohugo.io/)
- Một container runtime, như [Docker](https://www.docker.com/).

> [!Chú ý]
Hãy chắc chắn rằng bạn mở rộng của Hugo bạn cài đặt trùng với phiên bản được chỉ định thông qua biến môi trường `HUGO_VERSION` trong tệp [`netlify.toml`](netlify.toml#L11).

Trước khi bắt đầu, hãy cài đặt các phụ thuộc. Sao chép kho lưu trữ và di chuyển đến thư mục:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Trang web Kubernetes sử dụng [Docsy Hugo](https://github.com/google/docsy#readme). Ngay cả khi bạn dự định chạy trang web trong một vùng chứa, chúng tôi thực sự khuyên bạn nên kéo mô-đun con và các phần phụ thuộc phát triển khác bằng cách chạy như sau:

### Windows

```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```

### Linux / other Unix

```bash
# fetch submodule dependencies
make module-init
```

## Chạy trang web bằng container

Để xây dựng trang web trong một container, chạy lệnh sau:

```bash
# Bạn có thể đặt biến $CONTAINER_ENGINE thành tên của bất kỳ công cụ container giống Docker nào
make container-serve
```

Nếu bạn thấy lỗi, điều đó có thể có nghĩa là container Hugo không có đủ tài nguyên. Để giải quyết nó, hãy tăng số lượng CPU và bộ nhớ được phép sử dụng cho Docker trên máy của bạn ([macOS](https://docs.docker.com/desktop/setings/mac/) và [windows](https://docs.docker.com/desktop/settings/windows/)).

Mở trình duyệt của bạn, truy cập <http://localhost:1313> để xem trang web. Khi bạn thay đổi các tệp nguồn, Hugo sẽ cập nhật và tự động làm mới lại trang web.

## Chạy trang web trực tiếp bằng cách sử dụng Hugo

Đảm bảo cài đặt phiên bản mở rộng Hugo được chỉ định bởi biến môi trường `HUGO_VERSION` trong tệp [`netlify.toml`](netlify.toml#l11).

Để cài đặt các phụ thuộc, triển khai và kiểm tra trang web cục bộ, chạy:

- Đối với MacOS và Linux

  ```bash
  npm ci
  make serve
  ```

- Đối với Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

Máy chủ Hugo cục bộ sẽ được khởi động trên cổng 1313. Mở trình duyệt của bạn, truy cập <http://localhost:1313> để xem trang web. Khi bạn thay đổi các tệp nguồn, Hugo sẽ cập nhật và tự động làm mới lại trang web.

## Xây dựng các trang tài liệu tham khảo API

Các trang tài liệu tham khảo API nằm trong thư mục `content/en/docs/reference/kubernetes-api` được xây dựng từ Swagger specification, còn được gọi là OpenAPI specification, sử dụng <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

Để cập nhật các trang tài liệu tham khảo cho một phiên bản Kubernetes mới, làm theo các bước sau:

1. Kéo về submodule `api-ref-generator`:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Cập nhật Swagger specification:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. Trong `api-ref-assets/config/`, điều chỉnh các tệp `toc.yaml` và `fields.yaml` để phản ánh các thay đổi của phiên bản mới.

4. Tiếp theo, xây dựng các trang:

   ```bash
   make api-reference
   ```

   Bạn có thể kiểm tra kết quả bằng cách xây dựng và chạy trang web từ một container:

   ```bash
   make container-serve
   ```

   Trong trình duyệt web, truy cập vào <http://localhost:1313/docs/reference/kubernetes-api/> để xem tài liệu tham khảo API.

5. Khi tất cả các thay đổi được phản ánh vào các tệp cấu hình `toc.yaml` và `fields.yaml`, tạo một Pull Request với các trang tài liệu tham khảo API mới được tạo ra.

## Khắc phục sự cố

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo được cung cấp dưới dạng hai phiên bản (cơ bản và bản mở rộng - extended) vì lý do kỹ thuật. Trang web hiện tại chỉ chạy với phiên bản **Hugo Extended**. Trong [trang phát hành của Hugo](https://github.com/gohugoio/hugo/releases), tìm kiếm các 
phiên bản có chứa từ khóa `extended` trong tên. Để xác nhận, chạy `hugo version` và tìm từ khóa `extended`.

### Khắc phục sự cố trên macOS với quá nhiều tệp mở

Nếu bạn chạy `make serve` trên macOS và nhận được lỗi sau đây:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Hãy kiểm tra giới hạn hiện tại cho số tệp mở:

`launchctl limit maxfiles`

Sau đó, chạy các lệnh sau (được lấy từ <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Các lệnh trên hoạt động trên cả macOS Catalina và Mojave.

## Tham gia với SIG Docs

Tìm hiểu thêm về cộng đồng SIG Docs Kubernetes và cuộc họp trên [trang cộng đồng](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

Bạn cũng có thể liên hệ với những người duy trì dự án này tại:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Nhận lời mời tham gia Slack này](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Đóng góp vào tài liệu

Bạn có thể nhấp vào nút **Fork** ở phía trên bên phải của màn hình để tạo một bản sao của kho lưu trữ này trong tài khoản GitHub của bạn. Bản sao này được gọi là _fork_. Thực hiện bất kỳ thay đổi nào bạn muốn trong fork của bạn, và khi bạn sẵn sàng gửi những thay đổi đó cho chúng tôi, hãy vào fork của bạn và tạo một pull request mới để thông báo cho chúng tôi biết về nó.

Sau khi pull request của bạn được tạo, một người xem Kubernetes sẽ chịu trách nhiệm cung cấp phản hồi rõ ràng, có thể thực hiện được. Là chủ sở hữu của pull request, **bạn có trách nhiệm sửa đổi pull request của mình để giải quyết phản hồi đã được cung cấp cho bạn bởi người đánh giá tài liệu Kubernetes.**

Lưu ý rằng bạn có thể nhận được phản hồi từ nhiều người đánh giá Kubernetes hoặc bạn có thể nhận được phản hồi từ một người đánh giá Kubernetes khác với người được chỉ định ban đầu để cung cấp phản hồi.

Hơn nữa, trong một số trường hợp, một trong những người đánh giá của bạn có thể yêu cầu một đánh giá kỹ thuật từ một người đánh giá kỹ thuật Kubernetes khi cần thiết. Người đánh giá sẽ cố gắng cung cấp phản hồi một cách kịp thời, nhưng thời gian phản hồi có thể thay đổi tùy thuộc vào các tình huống.

Để biết thêm thông tin về việc đóng góp vào tài liệu Kubernetes, hãy xem:

- [Đóng góp vào tài liệu Kubernetes](https://kubernetes.io/docs/contribute/)
- [Loại nội dung trang](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Hướng dẫn về phong cách tài liệu](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Dịch tài liệu Kubernetes](https://kubernetes.io/docs/contribute/localization/)
- [Giới thiệu về tài liệu Kubernetes](https://www.youtube.com/watch?v=pprMgmNzDcw)

### Đại sứ đóng góp mới

Nếu bạn cần trợ giúp bất kỳ lúc nào khi đóng góp, [Đại sứ đóng góp mới](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) là điểm liên lạc tốt. Đây là những người phê duyệt SIG Docs có trách nhiệm hướng dẫn các đóng góp viên mới và giúp họ qua những pull request đầu tiên. Nơi tốt nhất để liên hệ với Đại sứ đóng góp mới là trên [Kubernetes Slack](https://slack.k8s.io/). Đại sứ đóng góp mới hiện tại cho SIG Docs:

| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh              | @sreeram.venkitesh                   | @sreeram-venkitesh              |

## Các tệp README đa ngôn ngữ

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Chinese](README-zh.md)    | [Korean](README-ko.md)     |
| [French](README-fr.md)     | [Polish](README-pl.md)     |
| [German](README-de.md)     | [Portuguese](README-pt.md) |
| [Hindi](README-hi.md)      | [Russian](README-ru.md)    |
| [Indonesian](README-id.md) | [Spanish](README-es.md)    |
| [Italian](README-it.md)    | [Ukrainian](README-uk.md)  |
| [Japanese](README-ja.md)   | [Vietnamese](README-vi.md) |

## Quy tắc ứng xử

Sự tham gia vào cộng đồng Kubernetes được điều chỉnh bởi [Quy tắc ứng xử của CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## Cảm ơn bạn

Kubernetes phát triển dựa trên sự tham gia của cộng đồng, và chúng tôi đánh giá cao những đóng góp của bạn cho trang web và tài liệu của chúng tôi!

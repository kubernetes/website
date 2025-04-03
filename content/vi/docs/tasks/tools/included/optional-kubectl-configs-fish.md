---
title: "Gợi ý lệnh trên Fish"
description: "Đề xuất cấu hình gợi ý lệnh trên Fish shell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Gợi ý lệnh cho Fish yêu cầu người dùng phải sử dụng `kubectl` phiên bản 1.23 trở về sau.
{{< /note >}}

Script gợi ý lệnh `kubectl` cho Fish có thể được tạo bằng lệnh:

```shell
kubectl completion fish
```

Sau đó trích dẫn script này trong shell để bật tính năng gợi ý lệnh cho `kubectl`.

Để bật tính năng này trong tất cả các phiên (session) shell, hãy thêm dòng sau vào tập tin `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Sau khi tải shell, tính năng gợi ý của kubectl sẽ được bật.
---
title: "Tự động hoàn thành lệnh với fish"
description: "Cấu hình tuỳ chọn để bật tính năng tự động hoàn thành lệnh cho fish shell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Tính năng tự động hoàn thành lệnh cho Fish yêu cầu phiên bản kubectl 1.23 hoặc mới hơn.
{{< /note >}}

Có thể tạo script tự động hoàn thành lệnh kubectl cho Fish bằng lệnh `kubectl completion fish`. Nạp script này vào shell sẽ bật tính năng tự động hoàn thành lệnh cho kubectl.

Để áp dụng cho tất cả phiên làm việc của shell, thêm dòng sau vào file `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Sau khi khởi động lại shell, tính năng tự động hoàn thành lệnh cho kubectl sẽ hoạt động.

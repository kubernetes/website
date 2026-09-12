---
title: "Tự động hoàn thành lệnh với PowerShell"
description: "Cấu hình tuỳ chọn để bật tính năng tự động hoàn thành lệnh cho powershell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Có thể tạo script tự động hoàn thành lệnh kubectl cho PowerShell bằng lệnh `kubectl completion powershell`. 

Để áp dụng cho tất cả phiên làm việc của shell, thêm dòng sau vào file `$PROFILE` của bạn.

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

Câu lệnh trên sẽ tạo lại script tự động hoàn thành mỗi khi PowerShell khởi động. Bạn cũng có thể thêm trực tiếp script vào file `$PROFILE` của bạn.

Để thêm script vào file `$PROFILE`, chạy lệnh sau với PowerShell:

```powershell
kubectl completion powershell >> $PROFILE
```

Sau khi khởi động lại shell, tính năng tự động hoàn thành lệnh cho kubectl sẽ hoạt động.

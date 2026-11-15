---
title: "Tự động hoàn thành lệnh với zsh"
description: "Cấu hình tuỳ chọn để bật tính năng tự động hoàn thành lệnh cho zsh."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Có thể tạo script tự động hoàn thành lệnh kubectl cho Zsh bằng lệnh `kubectl completion zsh`. Nạp script này vào shell sẽ bật tính năng tự động hoàn thành lệnh cho kubectl.

Để áp dụng cho tất cả phiên làm việc của shell, thêm dòng sau vào file `~/.zshrc`

```zsh
source <(kubectl completion zsh)
```

Nếu bạn đặt alias cho kubectl, tính năng tự động hoàn thành cũng sẽ áp dụng cho alias đó. 

Sau khi khởi động lại shell, tính năng tự động hoàn thành lệnh cho kubectl sẽ hoạt động.

Nếu bạn gặp lỗi như `2: command not found: compdef`, hãy thêm đoạn sau vào đầu file `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```
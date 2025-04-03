---
title: "Gợi ý lệnh trên Zsh"
description: "Một số đề xuất cấu hình cho gợi ý lệnh trên Zsh."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
 
Script cho tính năng gợi ý lệnh `kubectl` cho Zsh có thể được tạo bằng lệnh:
 
```zsh
kubectl completion zsh
```
 
Trích dẫn script này trong shell của bạn để kích hoạt tính năng này cho kubectl.
 
Để thực hiện tất cả các thao tác nêu trên trong tất cả các phiên (session) của shell, hãy thêm dòng sau vào file `~/.zshrc`:
 
```zsh
source <(kubectl completion zsh)
```
 
Nếu bạn có tên viết tắt (alias) cho `kubectl` thì tính năng này sẽ hoạt động tương tự.
 
Sau khi tải lại shell, tính năng gợi ý lệnh cho kubectl sẽ được kích hoạt.
 
Nếu bạn nhận được thông báo lỗi: `2: command not found: compdef`, hãy thêm các dòng lệnh dưới đây vào đầu tập tin `~/.zshrc`:
 
```zsh
autoload -Uz compinit
compinit
```
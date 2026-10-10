---
title: "Tự động hoàn thành lệnh bash trên Linux"
description: "Một vài cấu hình tuỳ chọn cho tự động hoàn thành lệnh bash trên Linux"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Giới thiệu

Có thể tạo script tự động hoàn thành lệnh kubectl cho Bash bằng lệnh `kubectl completion bash`.
Khi nạp script này vào shell sẽ có thể sử dụng tính năng tự động hoàn thành lệnh kubectl. 

Tuy nhiên, script này phụ thuộc vào
[**bash-completion**](https://github.com/scop/bash-completion),
có nghĩa là bạn phải cài đặt công cụ này trước
(bạn có thể kiểm tra xem bash-completion đã được cài đặt hay chưa bằng lệnh `type _init_completion`).

### Cài đặt bash-completion

bash-completion có thể được cài đặt bằng nhiều trình quản lý gói khác nhau
(xem [tại đây](https://github.com/scop/bash-completion#installation)).
Bạn có thể cài đặt bằng lệnh `apt-get install bash-completion` hoặc `yum install bash-completion`,...

Các câu lệnh trên sẽ tạo `/usr/share/bash-completion/bash_completion`,
cũng là script chính của bash-completion. Tuỳ thuộc vào trình quản lý gói của bạn,
bạn có thể cần tự thêm file này vào `~/.bashrc`

Để kiểm tra, hãy khởi động lại shell và chạy lệnh `type _init_completion`.
Nếu lệnh chạy thành công thì bạn đã thiết lập xong, nếu không hãy thêm đoạn sau vào file `~/.bashrc`:

```bash
source /usr/share/bash-completion/bash_completion
```

Khởi động lại shell và kiểm tra xem bash-completion đã được cài đặt đúng cách chưa bằng cách chạy lệnh `type _init_completion`.

### Bật tính năng tự động hoàn thành cho kubectl

#### Bash

Bây giờ bạn cần đảm bảo rằng script tự động hoàn thành của kubectl được nạp vào tất cả các phiên shell.
Có thể làm được điều này bằng hai cách:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="User" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="System" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

Nếu bạn đặt alias cho kubectl, bạn có thể mở rộng tính năng tự động hoàn thành để sử dụng cùng alias đó: 

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion sẽ nạp tất cả các script tự động hoàn thành trong `/etc/bash_completion.d`.
{{< /note >}}

Cả hai cách đều tương đương nhau. Sau khi khởi động lại shell, tính năng tự động hoàn thành của kubectl sẽ hoạt động.
Để bật tự động hoàn thành lệnh bash trong phiên shell hiện tại, nạp file ~/.bashrc

```bash
source ~/.bashrc
```

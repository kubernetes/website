---
title: "Tự động hoàn thành lệnh bash trên macOS"
description: "Một vài cấu hình tuỳ chọn cho tự động hoàn thành lệnh bash trên macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Introduction

Có thể tạo script tự động hoàn thành lệnh kubectl cho Bash bằng lệnh `kubectl completion bash`.
Khi nạp script này vào shell sẽ có thể sử dụng tính năng tự động hoàn thành lệnh kubectl.

Tuy nhiên, script này phụ thuộc vào
[**bash-completion**](https://github.com/scop/bash-completion), bạn cần cài đặt công cụ này trước.

{{< warning>}}
Có hai phiên bản bash-completion, v1 và v2. V1 dành cho Bash 3.2
(phiên bản mặc định trên macOS), còn v2 dành cho Bash 4.1+. Script tự động hoàn thành
của kubectl **không hoạt động** đúng cách với bash-completion v1 và Bash 3.2.
Nó yêu cầu **bash-completion v2** và **Bash 4.1+**. Do đó, để sử dụng 
được tính năng tự động hoàn thành của kubectl trên macOS, bạn cần cài đặt và sử dụng  
Bash 4.1+ ([*hướng dẫn*](https://apple.stackexchange.com/a/292760)).
Các hướng dẫn dưới đây ngầm hiểu rằng bạn đang sử dụng Bash 4.1+
(tức là Bash phiên bản 4.1 trở lên).
{{< /warning >}}

### Nâng cấp bash

Các hướng dẫn dưới đây ngầm hiểu rằng bạn đang sử dụng Bash 4.1+. Bạn có thể kiểm tra phiên bản hiện tại của Bash bằng lệnh

```bash
echo $BASH_VERSION
```

Nếu đang sử dụng phiên bản quá cũ, bạn có thể cài đặt/nâng cấp nó sử dụng Homebrew: 

```bash
brew install bash
```

Khởi động lại shell và kiểm tra phiên bản hiện tại đã đúng với mong muốn hay chưa:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew thường cài đặt nó tại đường dẫn `/usr/local/bin/bash`.

### Cài đặt bash-completion

{{< note >}}
Như đã đề cập, các hướng dẫn này ngầm hiểu rằng bạn đang sử dụng Bash 4.1+, có nghĩa là
bạn sẽ cài đặt bash-completion v2 (khác với trường hợp sử dụng Bash 3.2 và bash-completion v1
khi đó tính năng tự động hoàn thành lệnh kubectl sẽ không hoạt động).
{{< /note >}}

Bạn có thể kiểm tra xem mình đã cài đặt bash-completion v2 chưa bằng lệnh `type _init_completion`.
Nếu chưa, bạn có thể cài đặt bằng Homebrew:

```bash
brew install bash-completion@2
```

Kết quả của lệnh trên sẽ chỉ dẫn bạn thêm nội dung sau vào file `~/.bash_profile`

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Khởi động lại shell và kiểm tra xem bash-completion v2 đã được cài đặt đúng cách chưa bằng lệnh `type _init_completion`.

### Bật tính năng tự động hoàn thành cho kubectl

Bây giờ bạn cần đảm bảo rằng script tự động hoàn thành của kubectl được nạp vào tất cả các phiên shell.
Có thể làm được điều này bằng nhiều cách:

- Nạp script vào file `~/.bash_profile`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Thêm script vào thư mục `/usr/local/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Nếu bạn đặt alias cho kubectl, bạn có thể mở rộng tính năng tự động hoàn thành để sử dụng cùng alias đó:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- Nếu bạn cài đặt kubectl bằng Homebrew (như đã nói ở
  [đây](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)),
  thì script tự động hoàn thành của kubectl đã nằm ở `/usr/local/etc/bash_completion.d/kubectl`.
  Trong trường hợp này, bạn không cần thực hiện thêm gì cả.

   {{< note >}}
   Bản cài đặt bash-completion v2 bằng Homebrew sẽ nạp tất cả các file nằm trong 
   thư mục `BASH_COMPLETION_COMPAT_DIR`, vậy nên hai cách cuối mới hoạt động.
   {{< /note >}}

Dù dùng cách nào, sau khi khởi động lại shell, tính năng tự động hoàn thành của kubectl sẽ hoạt động.

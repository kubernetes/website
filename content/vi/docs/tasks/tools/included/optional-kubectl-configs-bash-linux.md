---
title: "Gợi ý lệnh trên Bash của Linux"
description: "Một số đề xuất cấu hình cho gợi ý lệnh trên Bash của Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
 
### Giới thiệu
 
Để tạo script tự động gợi ý các lệnh thuộc `kubectl` cho Bash, chúng ta dùng lệnh: `kubectl completion bash`.
Trích dẫn script này vào shell của bạn sẽ kích hoạt tính năng tự động gợi ý lệnh cho kubectl.
 
Tuy nhiên, script này yêu cầu cài đặt
[**bash-completion**](https://github.com/scop/bash-completion),
như là điều kiện tiên quyết.
(Bạn có thể chạy lệnh `type _init_completion` để kiểm tra xem hệ thống đã có bash-completion chưa.)
 
---
 
### Cài đặt bash-completion
 
`bash-completion` được hỗ trợ cài đặt bởi nhiều trình quản lý gói (package manager)
(xem thêm tại [đây](https://github.com/scop/bash-completion#installation)).
 
Chúng ta có thể cài đặt bằng một trong các lệnh sau:
 
```bash
sudo apt-get install bash-completion
```
 
hoặc
 
```bash
sudo yum install bash-completion
```
 
Các lệnh trên sẽ tạo tệp  `/usr/share/bash-completion/bash_completion`, là script chính của `bash-completion`.  
Tùy vào trình quản lý gói mà bạn đang sử dụng, bạn có thể cần thêm dòng sau vào file `~/.bashrc` để sử dụng:
 
```bash
source /usr/share/bash-completion/bash_completion
```
 
Sau khi reload shell, kiểm tra lại bằng lệnh:
 
```bash
type _init_completion
```
 
### Kích hoạt tự động gợi ý cho kubectl
 
#### Bash
 
Để đảm bảo rằng script gợi ý lệnh cho kubectl sẽ được trích dẫn trong mọi phiên (session) của shell.  
Có hai cách để làm điều này:
 
{{< tabs name="kubectl_bash_autocompletion" >}}
 
{{< tab name="Người dùng cá nhân" codelang="bash" >}}
```bash
echo 'source <(kubectl completion bash)' >>~/.bashrc
```
{{< /tab >}}
 
{{< tab name="Toàn hệ thống" codelang="bash" >}}
```bash
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
```
{{< /tab >}}
{{< /tabs >}}
 
Nếu bạn có tên viết tắt (alias) cho `kubectl`, bạn cũng có thể kích hoạt tự động gợi ý cho tên viết tắt đó bằng các lệnh sau:
 
```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```
 
{{< note >}}
`bash-completion` sẽ tự động nạp tất cả các script gợi ý có trong thư mục `/etc/bash_completion.d`.
{{< /note >}}
 
Cả hai cách trên đều cho kết quả giống nhau. Sau khi tải lại shell, các lệnh gợi ý cho kubectl sẽ được hỗ trợ.
Để kích hoạt tính năng này ngay trong phiên làm việc hiện tại, hãy chạy:
 
```bash
source ~/.bashrc
```
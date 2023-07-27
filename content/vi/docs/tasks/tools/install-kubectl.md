---
reviewers:
- truongnh1992
title: Cài đặt và cấu hình kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl
---

<!-- overview -->
Công cụ command-line trong Kubernetes, [kubectl](/docs/user-guide/kubectl/), cho phép bạn thực thi các câu lệnh trong Kubernetes clusters. Bạn có thể sử dụng kubectl để triển khai các ứng dụng, theo dõi và quản lý tài nguyên của cluster, và xem log. Để biết các thao tác của kubectl, truy cập tới [Tổng quan về kubectl](/docs/reference/kubectl/overview/).


## {{% heading "prerequisites" %}}

Bạn cần phải sử dụng phiên bản kubectl sai lệch không quá một phiên bản với version của cluster. Ví dụ, một client v1.2 nên được hoạt động với master v1.1, v1.2 và v1.3. Sử dụng phiên bản mới nhất của kubectl giúp tránh được các vấn đề không lường trước được.


<!-- steps -->

## Cài đặt kubectl trên Linux

### Cài đặt kubectl binary với curl trên Linux

1. Tải về phiên bản mới nhất với câu lệnh:

    ```
    curl -LO https://dl.k8s.io/release/`curl -LS https://dl.k8s.io/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    Để tải về phiên bản cụ thể, hãy thay thế phần `$(curl -LS https://dl.k8s.io/release/stable.txt)` trong câu lệnh với một phiên bản cụ thể.

    Ví dụ như, để tải về phiên bản {{< skew currentPatchVersion >}} trên Linux, hãy nhập như sau:
    
    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
    ```

2. Tạo kubectl binary thực thi.

    ```
    chmod +x ./kubectl
    ```

3. Đưa bản binary vào biến môi trường PATH của bạn.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

### Cài đặt kubectl sử dụng trình quản lý gói

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}


### Cài đặt với snap

Nếu bạn đang sử dụng Ubuntu hoặc distro Linux khác hỗ trợ trình quản lý gói [snap](https://snapcraft.io/docs/core/install), thì kubectl đã có sẵn trong [snap](https://snapcraft.io/). 

1. Chuyển sang user snap và thực thi câu lệnh cài đặt:

    ```
    sudo snap install kubectl --classic
    ```

2. Kiểm tra phiên bản bạn vừa cài là mới nhất:

    ```
    kubectl version
    ```

## Cài đặt kubectl trên macOS

### Cài đặt kubectl binary với curl trên macOS

1. Tải về phiên bản mới nhất:

    ```		 
    curl -LO "https://dl.k8s.io/release/$(curl -LS https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
    ```

    Để tải về phiên bản cụ thể, hãy thay thế phần `$(curl -LS https://dl.k8s.io/release/stable.txt)` trong câu lệnh với phiên bản cụ thể. 

    Ví dụ, để tải về phiên bản {{< skew currentPatchVersion >}} trên macOS, gõ:
		  
    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl
    ```

2. Tạo kubectl binary thực thi.

    ```
    chmod +x ./kubectl
    ```

3. Đưa bản binary vào biến môi trường PATH của bạn.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

### Cài đặt với Homebrew trên macOS

Nếu bạn đang trên macOS và sử dụng trình quản lý gói [Homebrew](https://brew.sh/), bạn có thể cài đặt kubectl với Homebrew.

1. Chạy câu lệnh cài đặt:

    ```
    brew install kubectl 
    ```
    hoặc 
    
    ```
    brew install kubernetes-cli
    ```

2. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

### Cài đặt với Macports trên macOS

Nếu bạn đang trên macOS và sử dụng trình quản lý gói [Macports](https://macports.org/), bạn có thể cài đặt kubectl với Macports.

1. Chạy câu lệnh cài đặt:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

## Cài đặt kubectl trên Windows

### Cài đặt kubectl binary với curl trên Windows

1. Tải về phiên bản mới nhất {{< skew currentPatchVersion >}} từ [đường dẫn này](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe).

    Hoặc nếu bạn đã cài đặt `curl`, hãy sử dụng câu lệnh sau:

    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe
    ```

    Để tìm ra phiên bản ổn định mới nhất, hãy xem [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).

2. Đưa bản binary vào biến môi trường PATH của bạn.
3. Kiểm tra chắn chắn phiên bản `kubectl` giống với bản đã tải về:

    ```
    kubectl version
    ```
{{< note >}}
[Docker Desktop cho Windows](https://docs.docker.com/docker-for-windows/#kubernetes) thêm phiên bản `kubectl` riêng của nó vào PATH.
Nếu bạn đã cài đặt Docker Desktop trước đây, bạn có thể cần đặt đường dẫn PATH của bạn trước khi bản cài đặt Docker Desktop thêm 1 PATH vào hoặc loại bỏ `kubectl` của Docker Desktop.
{{< /note >}}

### Cài đặt với Powershell từ PSGallery

Nếu bạn đang ở trên Windows và sử dụng trình quản lý gói [Powershell Gallery](https://www.powershellgallery.com/), bạn có thể cài đặt và cập nhật kubectl với Powershell.

1. Thực thi các câu lệnh cài đặt sau (hãy đảm bảo bạn tự định nghĩa `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}}Nếu bạn không định nghĩa `DownloadLocation`, `kubectl` sẽ được cài đặt ở thư mục temp của user.{{< /note >}} 
    
    Bản cài đặt sẽ tạo ra `$HOME/.kube` và hướng dẫn để tạo ra file cấu hình

2. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

    {{< note >}}Cập nhật của bản cài đặt sẽ được thực hiện khi chạy lại các câu lệnh từ bước 1.{{< /note >}}

### Cài đặt trên Windows sử dụng Chocolatey hoặc Scoop

Để cài đặt kubectl trên Windows bạn có thể sử dụng trình quản lý gói [Chocolatey](https://chocolatey.org) hoặc bộ cài đặt câu lệnh [Scoop](https://scoop.sh).
{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
2. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

3. Di chuyển tới thư mục home của bạn:

    ```
    cd %USERPROFILE%
    ```
4. Tạo thư mục `.kube`:

    ```
    mkdir .kube
    ```

5. Di chuyển tới thư mục `.kube` bạn vừa mới tạo:

    ```
    cd .kube
    ```

6. Cấu hình kubectl để sử dụng Kubernetes cluster từ xa:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Chỉnh sửa file cấu hình với trình soạn thảo văn bản, như là Notepad.{{< /note >}}

## Tải xuống từ một phần của Google Cloud SDK

Bạn có thể cài đặt kubectl từ một phần của Google Cloud SDK.

1. Cài đặt [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Thực thi câu lệnh cài đặt `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
3. Kiểm tra chắc chắn rằng phiên bản bạn cài là mới nhất:

    ```
    kubectl version
    ```

## Xác minh cấu hình kubectl

Để kubectl tìm kiếm và truy cập Kubernetes cluster, nó cần một [kubeconfig file](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), được tự động tạo ra khi bạn tạo mới một cluster sử dụng [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) hoặc triển khai thành công một Minikube cluster. Mặc định thì cấu hình của kubectl được xác định tại `~/.kube/config`.

Kiểm tra kubectl được cấu hình đúng bằng việc xem trạng thái của cluster:

```shell
kubectl cluster-info
```
Nếu bạn trông thấy một URL phản hồi, thì kubectl đã được cấu hình đúng để truy cập vào cluster của bạn.

Nếu bạn trông thấy một tin nhắn tương tự bên dưới, thì kuberctl chưa được cấu hình đúng hoặc chưa thể kết nối với Kubernetes cluster.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Ví dụ như, nếu bạn đang định chạy một Kubernetes cluster trên laptop của bạn (locally), bạn sẽ cần một công cụ như Minikube được cài trước đó và chạy lại các câu lệnh bên trên.

Nếu kubectl cluster-info trả về url nhưng bạn không thể truy cập vào cluster của bạn, thì hãy kiểm tra nó đã được cấu hình đúng hay chưa, bằng cách:

```shell
kubectl cluster-info dump
```

## Các lựa chọn cấu hình kubectl

### Kích hoạt shell autocompletion 

kubectl cung cấp autocompletion hỗ trợ cho Bash and Zsh, giúp bạn giảm thiểu việc phải gõ nhiều câu lệnh.

Bên dưới đâu là các bước để thiết lập autocompletion cho Bash (bao gồm sự khác nhau giữa Linux và macOS) và Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash trên Linux" %}}

### Giới thiệu

Kubelet completion script cho Bash được tạo ra với câu lệnh `kubectl completion bash`. Sau khi script được tạo ra, bạn cần source (thực thi) script đó để kích hoạt tính năng autocompletion.

Tuy nhiên, completion script phụ thuộc vào [**bash-completion**](https://github.com/scop/bash-completion), nên bạn phải cài đặt bash-completion trước đó (kiểm tra bash-completion tồn tại với câu lệnh `type _init_completion`).

### Cài đặt bash-completion

bash-completion được cung cấp bởi nhiều trình quản lý gói (xem tại [đây](https://github.com/scop/bash-completion#installation)). Bạn có thể cài đặt với lệnh `apt-get install bash-completion` hoặc `yum install bash-completion`.

Các lệnh trên tạo ra `/usr/share/bash-completion/bash_completion`, đây là script chính của bash-completion. Tùy thuộc vào trình quản lý gói của bạn, mà bạn phải source (thực thi) file này trong file `~/.bashrc`.

Để tìm ra file này, reload lại shell hiện tại của bạn và chạy lệnh `type _init_completion`. Nếu thành công, bạn đã thiết lập xong, không thì hãy thêm đoạn sau vào file `~/.bashrc` của bạn:

```shell
source /usr/share/bash-completion/bash_completion
```

Reload lại shell của bạn và xác nhận bash-completion được cài đặt đúng bằng lệnh `type _init_completion`.

### Kích hoạt kubectl autocompletion

Bây giờ bạn cần đảm bảo rằng kubectl completion script được sourced trên tất cả các session của shell. Có 2 cách để làm việc này:

- Source script trong file `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Thêm script vào thư mục `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```
- Nếu bạn có một alias cho kubectl, bạn có thể thêm một shell completion nữa cho alias đó:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
bash-completion sources tất cả completion scripts trong `/etc/bash_completion.d`. 
{{< /note >}}

Các cách trên đều hiệu quả tương đương nhau. Sau khi reload lại shell, kubectl autocompletion sẽ làm việc.

{{% /tab %}}


{{% tab name="Bash trên macOS" %}}


### Giới thiệu

Kubectl completion script trên Bash được tạo ra bởi `kubectl completion bash`. Source script này sẽ kích hoạt tính năng kubectl completion.

Tuy nhiên, kubectl completion script phụ thuộc vào [**bash-completion**](https://github.com/scop/bash-completion) mà bạn cài trước đó.

{{< warning>}}
Có 2 phiên bản của bash-completion là v1 và v2. V1 dành cho Bash 3.2 (Bash mặc định trên macOS), và v2 dành cho Bash 4.1+. Kubectl completion script **không làm việc** phù hợp với bash-completion v1 và Bash 3.2. Nó tương thích với **bash-completion v2** và **Bash 4.1+**. Vì vậy, để sử dụng kubectl completion một cách chính xác trên macOS thì bạn phải cài đặt Bash 4.1+ ([*hướng dẫn*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Hướng dẫn tiếp theo giả định rằng bạn đang sử dụng Bash 4.1+ (nghĩa là, bất kỳ phiên bản Bash nào từ 4.1 trở lên).
{{< /warning >}}


### Cài đặt bash-completion

{{< note >}}
Như đã đề cập, những hướng dẫn này giả định bạn đang sử dụng Bash 4.1+, có nghĩa rằng bạn sẽ cài đặt bash-completion v2 (trái ngược với Bash 3.2 và bash-completion v1, trong trường hợp đó, kubectl completion sẽ không hoạt động).
{{< /note >}}

Bạn có thể kiểm tra bash-completion v2 đã cài đặt trước đó chưa với lệnh `type _init_completion`. Nếu chưa, bạn có thể cài đặt nó với Homebrew:

```shell
brew install bash-completion@2
```

Từ đầu ra của lệnh này, hãy thêm đoạn sau vào file `~/.bashrc` của bạn:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Tải lại shell của bạn và xác minh rằng bash-completion v2 được cài đặt chính xác chưa bằng lệnh `type _init_completion`.

### Kích hoạt kubectl autocompletion

Bây giờ bạn phải đảm bảo rằng kubectl completion script đã được sourced trong tất cả các phiên shell của bạn. Có nhiều cách để đạt được điều này:

- Source completion script trong file `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc

    ```

- Thêm completion script vào thư mục `/usr/local/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Nếu bạn có alias cho kubectl, bạn có thể mở rộng shell completion để làm việc với alias đó:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```
    
- Nếu bạn đã cài kubectl với Homebrew (như đã giới thiệu [bên trên](#install-with-homebrew-on-macos))) thì kubectl completion script sẽ có trong `/usr/local/etc/bash_completion.d/kubectl`. Trong trường hợp này thì bạn không cần làm gì cả.

{{< note >}}
Cài đặt theo cách Homebrew đã source tất cả các tệp trong thư mục `BASH_COMPLETION_COMPAT_DIR`, đó là lý do tại sao hai phương thức sau hoạt động.
{{< /note >}}

Trong mọi trường hợp, sau khi tải lại shell của bạn, kubectl completion sẽ hoạt động.
{{% /tab %}}

{{% tab name="Zsh" %}}

Kubectl completion script cho Zsh được tạo ra với lệnh `kubectl completion zsh`. Source completion script trong shell của bạn sẽ kích hoạt kubectl autocompletion.

Để nó hoạt động cho tất cả các shell, thêm dòng sau vào file `~/.zshrc`:

```shell
source <(kubectl completion zsh)
```

Nếu bạn có alias cho kubectl, bạn có thể mở rộng shell completion để làm việc với alias đó:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'compdef __start_kubectl k' >>~/.zshrc
```
    
Sau khi tải lại shell, kubectl autocompletion sẽ hoạt động.

Nếu bạn nhận được lỗi `complete:13: command not found: compdef`, thêm dòng sau vào đầu file `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [Cài đặt Minikube](/docs/tasks/tools/install-minikube/)
* Xem [hướng dẫn bắt đầu](/docs/setup/) để biết thêm về việc tạo cluster.
* [Tìm hiểu cách khởi chạy và hiển thị ứng dụng của bạn.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Nếu bạn cần quyền truy cập vào một cluster mà bạn không tạo, hãy xem [tài liệu Sharing Cluster Access](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Đọc [tài liệu tham khảo của kubectl](/docs/reference/kubectl/kubectl/)


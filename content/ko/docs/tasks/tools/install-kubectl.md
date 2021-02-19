---


title: kubectl 설치 및 설정
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: kubectl 설치
---

<!-- overview -->
쿠버네티스 커맨드 라인 도구인 [kubectl](/ko/docs/reference/kubectl/kubectl/)을 사용하면,
쿠버네티스 클러스터에 대해 명령을 실행할 수 있다.
kubectl을 사용하여 애플리케이션을 배포하고, 클러스터 리소스를 검사 및 관리하며
로그를 볼 수 있다. kubectl 작업의 전체 목록에 대해서는,
[kubectl 개요](/ko/docs/reference/kubectl/overview/)를 참고한다.


## {{% heading "prerequisites" %}}

클러스터의 마이너(minor) 버전 차이 내에 있는 kubectl 버전을 사용해야 한다.
예를 들어, v1.2 클라이언트는 v1.1, v1.2 및 v1.3의 마스터와 함께 작동해야 한다.
최신 버전의 kubectl을 사용하면 예기치 않은 문제를 피할 수 있다.

<!-- steps -->

## 리눅스에 kubectl 설치

### 리눅스에서 curl을 사용하여 kubectl 바이너리 설치

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
특정 버전을 다운로드하려면, `$(curl -L -s https://dl.k8s.io/release/stable.txt)` 명령 부분을 특정 버전으로 바꾼다.

예를 들어, 리눅스에서 버전 {{< param "fullversion" >}}을 다운로드하려면, 다음을 입력한다.

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl 체크섬(checksum) 파일을 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   kubectl 바이너리를 체크섬 파일을 통해 검증한다.

   ```bash
   echo "$(<kubectl.sha256) kubectl" | sha256sum --check
   ```

   검증이 성공한다면, 출력은 다음과 같다.

   ```bash
   kubectl: OK
   ```

   검증이 실패한다면, `sha256` 가 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```bash
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   동일한 버전의 바이너리와 체크섬을 다운로드한다.
   {{< /note >}}

1. kubectl 설치

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   대상 시스템에 root 접근 권한을 가지고 있지 않더라도, `~/.local/bin` 디렉터리에 kubectl을 설치할 수 있다.

   ```bash
   mkdir -p ~/.local/bin/kubectl
   mv ./kubectl ~/.local/bin/kubectl
   # 그리고 ~/.local/bin/kubectl을 $PATH에 추가
   ```

   {{< /note >}}

1. 설치한 버전이 최신인지 확인한다.

   ```bash
   kubectl version --client
   ```

### 기본 패키지 관리 도구를 사용하여 설치

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian 또는 HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2 curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}

{{< tab name="CentOS, RHEL 또는 Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

### 다른 패키지 관리 도구를 사용하여 설치

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
[snap](https://snapcraft.io/docs/core/install) 패키지 관리자를 지원하는 Ubuntu 또는 다른 리눅스 배포판을 사용하는 경우, kubectl을 [snap](https://snapcraft.io/) 애플리케이션으로 설치할 수 있다.

```shell
snap install kubectl --classic

kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
리눅스 상에서 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) 패키지 관리자를 사용한다면, [설치](https://docs.brew.sh/Homebrew-on-Linux#install)를 통해 kubectl을 사용할 수 있다.

```shell
brew install kubectl

kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}


## macOS에 kubectl 설치

### macOS에서 curl을 사용하여 kubectl 바이너리 설치

1. 최신 릴리스를 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

   {{< note >}}
   특정 버전을 다운로드하려면, `$(curl -L -s https://dl.k8s.io/release/stable.txt)` 명령 부분을 특정 버전으로 바꾼다.

   예를 들어, macOS에서 버전 {{< param "fullversion" >}}을 다운로드하려면, 다음을 입력한다.

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
   ```

   {{< /note >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl 체크섬 파일을 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   ```

   kubectl 바이너리를 체크섬 파일을 통해 검증한다.

   ```bash
   echo "$(<kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   검증이 성공한다면, 출력은 다음과 같다.

   ```bash
   kubectl: OK
   ```

   검증이 실패한다면, `sha256` 가 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   동일한 버전의 바이너리와 체크섬을 다운로드한다.
   {{< /note >}}

1. kubectl 바이너리를 실행 가능하게 한다.

   ```bash
   chmod +x ./kubectl
   ```

1. kubectl 바이너리를 시스템 `PATH` 의 파일 위치로 옮긴다.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl && \
   sudo chown root: /usr/local/bin/kubectl
   ```

1. 설치한 버전이 최신 버전인지 확인한다.

   ```bash
   kubectl version --client
   ```

### macOS에서 Homebrew를 사용하여 설치

macOS에서 [Homebrew](https://brew.sh/) 패키지 관리자를 사용하는 경우, Homebrew로 kubectl을 설치할 수 있다.

1. 설치 명령을 실행한다.

   ```bash
   brew install kubectl
   ```

   또는

   ```bash
   brew install kubernetes-cli
   ```

1. 설치한 버전이 최신 버전인지 확인한다.

   ```bash
   kubectl version --client
   ```

### macOS에서 Macports를 사용하여 설치

macOS에서 [Macports](https://macports.org/) 패키지 관리자를 사용하는 경우, Macports로 kubectl을 설치할 수 있다.

1. 설치 명령을 실행한다.

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. 설치한 버전이 최신 버전인지 확인한다.

   ```bash
   kubectl version --client
   ```

## 윈도우에 kubectl 설치

### 윈도우에서 curl을 사용하여 kubectl 바이너리 설치

1. [최신 릴리스 {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)를 다운로드한다.

   또는 `curl` 을 설치한 경우, 다음 명령을 사용한다.

   ```powershell
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

   {{< note >}}
   최신의 안정 버전(예: 스크립팅을 위한)을 찾으려면, [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)를 참고한다.
   {{< /note >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl 체크섬 파일을 다운로드한다.

   ```powershell
   curl -LO https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   kubectl 바이너리를 체크섬 파일을 통해 검증한다.

   - 수동으로 `CertUtil` 의 출력과 다운로드한 체크섬 파일을 비교하기 위해서 커맨드 프롬프트를 사용한다.

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - `-eq` 연산자를 통해 `True` 또는 `False` 결과를 얻는 자동 검증을 위해서 PowerShell을 사용한다.

     ```powershell
     $($(CertUtil -hashfile .\kubectl.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl.exe.sha256)
     ```

1. 바이너리를 `PATH` 가 설정된 디렉터리에 추가한다.

1. `kubectl` 의 버전이 다운로드한 버전과 같은지 확인한다.

   ```cmd
   kubectl version --client
   ```

{{< note >}}
[윈도우용 도커 데스크톱](https://docs.docker.com/docker-for-windows/#kubernetes)은 자체 버전의 `kubectl` 을 `PATH` 에 추가한다.
도커 데스크톱을 이전에 설치한 경우, 도커 데스크톱 설치 프로그램에서 추가한 `PATH` 항목 앞에 `PATH` 항목을 배치하거나 도커 데스크톱의 `kubectl` 을 제거해야 할 수도 있다.
{{< /note >}}

### PSGallery에서 PowerShell로 설치

윈도우에서 [Powershell Gallery](https://www.powershellgallery.com/) 패키지 관리자를 사용하는 경우, Powershell로 kubectl을 설치하고 업데이트할 수 있다.

1. 설치 명령을 실행한다(`DownloadLocation` 을 지정해야 한다).

   ```powershell
   Install-Script -Name install-kubectl -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <path>]
   ```

   {{< note >}}
   `DownloadLocation` 을 지정하지 않으면, `kubectl` 은 사용자의 `temp` 디렉터리에 설치된다.
   {{< /note >}}

   설치 프로그램은 `$HOME/.kube` 를 생성하고 구성 파일을 작성하도록 지시한다.

1. 설치한 버전이 최신 버전인지 확인한다.

   ```powershell
   kubectl version --client
   ```

{{< note >}}
설치 업데이트는 1 단계에서 나열한 두 명령을 다시 실행하여 수행한다.
{{< /note >}}

### Chocolatey 또는 Scoop을 사용하여 윈도우에 설치

1. 윈도우에 kubectl을 설치하기 위해서 [Chocolatey](https://chocolatey.org) 패키지 관리자나 [Scoop](https://scoop.sh) 커맨드 라인 설치 프로그램을 사용할 수 있다.

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
    choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
    scoop install kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}


1. 설치한 버전이 최신 버전인지 확인한다.

   ```powershell
   kubectl version --client
   ```

1. 홈 디렉터리로 이동한다.

   ```powershell
   # cmd.exe를 사용한다면, 다음을 실행한다. cd %USERPROFILE%
   cd ~
   ```

1. `.kube` 디렉터리를 생성한다.

   ```powershell
   mkdir .kube
   ```

1. 금방 생성한 `.kube` 디렉터리로 이동한다.

   ```powershell
   cd .kube
   ```

1. 원격 쿠버네티스 클러스터를 사용하도록 kubectl을 구성한다.

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
메모장과 같은 텍스트 편집기를 선택하여 구성 파일을 편집한다.
{{< /note >}}

## Google Cloud SDK의 일부로 다운로드

kubectl을 Google Cloud SDK의 일부로 설치할 수 있다.

1. [Google Cloud SDK](https://cloud.google.com/sdk/)를 설치한다.

1. `kubectl` 설치 명령을 실행한다.

   ```shell
   gcloud components install kubectl
   ```

1. 설치한 버전이 최신 버전인지 확인한다.

   ```shell
   kubectl version --client
   ```

## kubectl 구성 확인

kubectl이 쿠버네티스 클러스터를 찾아 접근하려면,
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)를
사용하여 클러스터를 생성하거나 Minikube 클러스터를 성공적으로 배포할 때 자동으로 생성되는
[kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)이
필요하다.
기본적으로, kubectl 구성은 `~/.kube/config` 에 있다.

클러스터 상태를 가져와서 kubectl이 올바르게 구성되어 있는지 확인한다.

```shell
kubectl cluster-info
```

URL 응답이 표시되면, kubectl이 클러스터에 접근하도록 올바르게 구성된 것이다.

다음과 비슷한 메시지가 표시되면, kubectl이 올바르게 구성되지 않았거나 쿠버네티스 클러스터에 연결할 수 없다.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

예를 들어, 랩톱에서 로컬로 쿠버네티스 클러스터를 실행하려면, Minikube와 같은 도구를 먼저 설치한 다음 위에서 언급한 명령을 다시 실행해야 한다.

kubectl cluster-info가 URL 응답을 반환하지만 클러스터에 접근할 수 없는 경우, 올바르게 구성되었는지 확인하려면 다음을 사용한다.

```shell
kubectl cluster-info dump
```

## 선택적 kubectl 구성

### 셸 자동 완성 활성화

kubectl은 Bash 및 Zsh에 대한 자동 완성 지원을 제공하므로 입력을 위한 타이핑을 많이 절약할 수 있다.

다음은 Bash(리눅스와 macOS의 다른 점 포함) 및 Zsh에 대한 자동 완성을 설정하는 절차이다.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="리눅스에서의 Bash" %}}

### 소개

Bash의 kubectl 완성 스크립트는 `kubectl completion bash` 명령으로 생성할 수 있다. 셸에서 완성 스크립트를 소싱(sourcing)하면 kubectl 자동 완성 기능이 활성화된다.

그러나, 완성 스크립트는 [**bash-completion**](https://github.com/scop/bash-completion)에 의존하고 있으며, 이 소프트웨어를 먼저 설치해야 한다(`type _init_completion` 을 실행하여 bash-completion이 이미 설치되어 있는지 확인할 수 있음).

### bash-completion 설치

bash-completion은 많은 패키지 관리자에 의해 제공된다([여기](https://github.com/scop/bash-completion#installation) 참고). `apt-get install bash-completion` 또는 `yum install bash-completion` 등으로 설치할 수 있다.

위의 명령은 bash-completion의 기본 스크립트인 `/usr/share/bash-completion/bash_completion` 을 생성한다. 패키지 관리자에 따라, `~/.bashrc` 파일에서 이 파일을 수동으로 소스(source)해야 한다.

확인하려면, 셸을 다시 로드하고 `type _init_completion` 을 실행한다. 명령이 성공하면, 이미 설정된 상태이고, 그렇지 않으면 `~/.bashrc` 파일에 다음을 추가한다.

```bash
source /usr/share/bash-completion/bash_completion
```

셸을 다시 로드하고 `type _init_completion` 을 입력하여 bash-completion이 올바르게 설치되었는지 확인한다.

### kubectl 자동 완성 활성화

이제 kubectl 완성 스크립트가 모든 셸 세션에서 제공되도록 해야 한다. 이를 수행할 수 있는 두 가지 방법이 있다.

- `~/.bashrc` 파일에서 완성 스크립트를 소싱한다.

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bashrc
   ```

- 완성 스크립트를 `/etc/bash_completion.d` 디렉터리에 추가한다.

   ```bash
   kubectl completion bash >/etc/bash_completion.d/kubectl
   ```

kubectl에 대한 앨리어스(alias)가 있는 경우, 해당 앨리어스로 작업하도록 셸 완성을 확장할 수 있다.

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion은 `/etc/bash_completion.d` 에 있는 모든 완성 스크립트를 소싱한다.
{{< /note >}}

두 방법 모두 동일하다. 셸을 다시 로드한 후, kubectl 자동 완성 기능이 작동해야 한다.

{{% /tab %}}


{{% tab name="macOS에서의 Bash" %}}


### 소개

Bash의 kubectl 완성 스크립트는 `kubectl completion bash` 로 생성할 수 있다. 이 스크립트를 셸에 소싱하면 kubectl 완성이 가능하다.

그러나 kubectl 완성 스크립트는 미리 [**bash-completion**](https://github.com/scop/bash-completion)을 설치해야 동작한다.

{{< warning>}}
bash-completion에는 v1과 v2 두 가지 버전이 있다. v1은 Bash 3.2(macOS의 기본 설치 버전) 버전용이고, v2는 Bash 4.1 이상 버전용이다. kubectl 완성 스크립트는 bash-completion v1과 Bash 3.2 버전에서는 **작동하지 않는다**. **bash-completion v2** 와 **Bash 4.1 이상 버전** 이 필요하다. 따라서, macOS에서 kubectl 완성 기능을 올바르게 사용하려면, Bash 4.1 이상을 설치하고 사용해야한다([*지침*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). 다음의 내용에서는 Bash 4.1 이상(즉, 모든 Bash 버전 4.1 이상)을 사용한다고 가정한다.
{{< /warning >}}

### Bash 업그레이드

여기의 지침에서는 Bash 4.1 이상을 사용한다고 가정한다. 다음을 실행하여 Bash 버전을 확인할 수 있다.

```bash
echo $BASH_VERSION
```

너무 오래된 버전인 경우, Homebrew를 사용하여 설치/업그레이드할 수 있다.

```bash
brew install bash
```

셸을 다시 로드하고 원하는 버전을 사용 중인지 확인한다.

```bash
echo $BASH_VERSION $SHELL
```

Homebrew는 보통 `/usr/local/bin/bash` 에 설치한다.

### bash-completion 설치

{{< note >}}
언급한 바와 같이, 이 지침에서는 Bash 4.1 이상을 사용한다고 가정한다. 이는 bash-completion v2를 설치한다는 것을 의미한다(Bash 3.2 및 bash-completion v1의 경우, kubectl 완성이 작동하지 않음).
{{< /note >}}

bash-completion v2가 이미 설치되어 있는지 `type_init_completion` 으로 확인할 수 있다. 그렇지 않은 경우, Homebrew로 설치할 수 있다.

```bash
brew install bash-completion@2
```

이 명령의 출력에 명시된 바와 같이, `~/.bash_profile` 파일에 다음을 추가한다.

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

셸을 다시 로드하고 bash-completion v2가 올바르게 설치되었는지 `type _init_completion` 으로 확인한다.

### kubectl 자동 완성 활성화

이제 kubectl 완성 스크립트가 모든 셸 세션에서 제공되도록 해야 한다. 이를 수행하는 방법에는 여러 가지가 있다.

- 완성 스크립트를 `~/.bash_profile` 파일에서 소싱한다.

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- 완성 스크립트를 `/usr/local/etc/bash_completion.d` 디렉터리에 추가한다.

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- kubectl에 대한 앨리어스가 있는 경우, 해당 앨리어스로 작업하기 위해 셸 완성을 확장할 수 있다.

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -F __start_kubectl k' >>~/.bash_profile
    ```

- Homebrew로 kubectl을 설치한 경우([위](#macos에서-homebrew를-사용하여-설치)의 설명을 참고), kubectl 완성 스크립트는 이미 `/usr/local/etc/bash_completion.d/kubectl` 에 있어야 한다. 이 경우, 아무 것도 할 필요가 없다.

   {{< note >}}
   bash-completion v2의 Homebrew 설치는 `BASH_COMPLETION_COMPAT_DIR` 디렉터리의 모든 파일을 소싱하므로, 후자의 두 가지 방법이 적용된다.
   {{< /note >}}

어쨌든, 셸을 다시 로드 한 후에, kubectl 완성이 작동해야 한다.
{{% /tab %}}

{{% tab name="Zsh" %}}

Zsh용 kubectl 완성 스크립트는 `kubectl completion zsh` 명령으로 생성할 수 있다. 셸에서 완성 스크립트를 소싱하면 kubectl 자동 완성 기능이 활성화된다.

모든 셸 세션에서 사용하려면, `~/.zshrc` 파일에 다음을 추가한다.

```zsh
source <(kubectl completion zsh)
```

kubectl에 대한 앨리어스가 있는 경우, 해당 앨리어스로 작업하도록 셸 완성을 확장할 수 있다.

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

셸을 다시 로드 한 후, kubectl 자동 완성 기능이 작동해야 한다.

`complete:13: command not found: compdef` 와 같은 오류가 발생하면, `~/.zshrc` 파일의 시작 부분에 다음을 추가한다.

```zsh
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [Minikube 설치](https://minikube.sigs.k8s.io/docs/start/)
* 클러스터 생성에 대한 자세한 내용은 [시작하기](/ko/docs/setup/)를 참고한다.
* [애플리케이션을 시작하고 노출하는 방법에 대해 배운다.](/ko/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 직접 생성하지 않은 클러스터에 접근해야하는 경우,
  [클러스터 접근 공유 문서](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)를 참고한다.
* [kubectl 레퍼런스 문서](/ko/docs/reference/kubectl/kubectl/) 읽기

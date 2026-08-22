---
reviewers:
- mikedanese
title: 리눅스에 kubectl 설치 및 설정
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

클러스터와 마이너 버전 차이가 1 이내인 kubectl 버전을 사용해야 한다.
예를 들어, v{{< skew currentVersion >}} 클라이언트는
v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
그리고 v{{< skew currentVersionAddMinor 1 >}} 컨트롤 플레인과 통신할 수 있다.
호환되는 최신 버전의 kubectl을 사용하면 예기치 않은 문제를 방지하는 데 도움이 된다.

## 리눅스에 kubectl 설치

다음과 같은 방법으로 리눅스에 kubectl을 설치할 수 있다.

- [리눅스에 curl을 사용하여 kubectl 바이너리 설치](#install-kubectl-binary-with-curl-on-linux)
- [기본 패키지 관리 도구를 사용하여 설치](#install-using-native-package-management)
- [다른 패키지 관리 도구를 사용하여 설치](#install-using-other-package-management)

### 리눅스에서 curl을 사용하여 kubectl 바이너리 설치 {#install-kubectl-binary-with-curl-on-linux}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   특정 버전을 다운로드하려면, `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   명령 부분을 특정 버전으로 바꾼다.

   예를 들어, 리눅스 x86-64에서 {{< skew currentPatchVersion >}} 버전을 다운로드하려면 다음을 입력한다.

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   Linux ARM64의 경우 다음과 같이 입력한다:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /note >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl 체크섬(checksum) 파일을 다운로드한다.

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   kubectl 바이너리를 체크섬 파일과 대조하여 검증한다:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   검증에 성공하면 다음과 같이 출력된다:

   ```console
   kubectl: OK
   ```

   검증이 실패한다면, `shasum`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다:

   ```console
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
   대상 시스템에 root 접근 권한을 가지고 있지 않더라도, 
   `~/.local/bin` 디렉터리에 kubectl을 설치할 수 있다.

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # 그리고 ~/.local/bin 을 $PATH의 앞부분 또는 뒷부분에 추가
   ```

   {{< /note >}}

1. 설치한 버전이 최신인지 확인한다.

   ```bash
   kubectl version --client
   ```

   또는 다음을 실행하여 버전에 대한 더 자세한 정보를 본다.

   ```cmd
   kubectl version --client --output=yaml    
   ```

### 기본 패키지 관리 도구를 사용하여 설치

{{< tabs name="kubectl_install" >}}
{{% tab name="데비안 기반의 배포판" %}}

1. `apt` 패키지 색인을 업데이트하고 쿠버네티스 `apt` 리포지터리를 사용하는 데 필요한 패키지들을 설치한다.

   ```shell
   sudo apt-get update
   # apt-transport-https는 더미 패키지일 수 있다. 이 경우, 해당 패키지는 생략할 수 있다.
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. 쿠버네티스 패키지 리포지터리용 공개 서명 키를 다운로드한다. 동일한 서명 키는 모든 리포지터리에 사용되므로 URL에 있는 버전은 무시해도 된다.

   ```shell
   # `/etc/apt/keyrings` 디렉터리가 존재하지 않는다면 curl 명령을 실행하기 전에 생성해야 한다. 아래 note를 참고한다.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # 권한이 없는 APT 프로그램이 이 키링을 읽을 수 있도록 한다.
   ```

{{< note >}}
Debian 12 및 Ubuntu 22.04 이전 릴리스에서는 `/etc/apt/keyrings` 디렉터리가 기본적으로 존재하지 않으므로 curl 명령을 실행하기 전에 생성해야 한다.
{{< /note >}}

3. 쿠버네티스 `apt` 리포지터리를 추가한다. {{< param "version" >}}과 다른 쿠버네티스 버전을 사용하려면 
아래 명령에서 {{< param "version" >}}을 원하는 마이너 버전으로 바꾼다.

   ```shell
   # /etc/apt/sources.list.d/kubernetes.list의 기존 설정을 모두 덮어쓴다.
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # command-not-found 같은 도구가 올바르게 작동하도록 한다.
   ```

{{< note >}}
다른 마이너 릴리스의 kubectl로 업그레이드하려면 `apt-get update`와 `apt-get upgrade`를 실행하기 전에 `/etc/apt/sources.list.d/kubernetes.list`의 버전을 올려야 한다. 이 절차에 대한 자세한 내용은 [쿠버네티스 패키지 리포지터리 변경하기](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)에서 확인할 수 있다.
{{< /note >}}

4. `apt` 패키지 색인을 업데이트하고 kubectl을 설치한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="레드햇 기반의 배포판" %}}

1. 쿠버네티스 `yum` 리포지터리를 추가한다. {{< param "version" >}}과 다른 쿠버네티스 버전을
   사용하려면, 아래 명령에서 {{< param "version" >}}을 원하는
   마이너 버전으로 바꾼다.

   ```bash
   # /etc/yum.repos.d/kubernetes.repo의 기존 설정을 모두 덮어쓴다.
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
다른 마이너 릴리스의 kubectl로 업그레이드하려면 `yum update`를 실행하기 전에 `/etc/yum.repos.d/kubernetes.repo`의 버전을 올려야 한다. 이 절차에 대한 자세한 내용은 [쿠버네티스 패키지 리포지터리 변경하기](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)에서 확인할 수 있다.
{{< /note >}}

2. yum을 사용하여 kubectl을 설치한다:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="SUSE-based distributions" %}}

1. 쿠버네티스 `zypper` 리포지터리를 추가한다. {{< param "version" >}}과 다른 쿠버네티스 버전을
사용하려면, 아래 명령에서 {{< param "version" >}}을 원하는
마이너 버전으로 바꾼다.

   ```bash
   # /etc/zypp/repos.d/kubernetes.repo의 기존 설정을 모두 덮어쓴다.
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
다른 마이너 릴리스의 kubectl로 업그레이드하려면 `/etc/zypp/repos.d/kubernetes.repo`의 버전을 올린 뒤
`zypper update`를 실행해야 한다. 이 절차에 대한 자세한 내용은
[쿠버네티스 패키지 리포지터리 변경하기](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)에서 확인할 수 있다.
{{< /note >}}

2. zypper를 업데이트하고 새 리포지터리가 추가되었는지 확인한다:

   ```bash
   sudo zypper update
   ```

   다음 메시지가 나타나면 't' 또는 'a'를 누른다:

   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```

3. `zypper`를 사용하여 kubectl을 설치한다:

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}
{{< /tabs >}}

### 다른 패키지 관리 도구를 사용하여 설치 

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
[snap](https://snapcraft.io/docs/core/install) 패키지 관리자를 지원하는 
Ubuntu 또는 다른 리눅스 배포판을 사용하는 경우, 
kubectl을 [snap](https://snapcraft.io/) 애플리케이션으로 설치할 수 있다.

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
리눅스 상에서 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) 패키지 관리자를 사용한다면, 
[설치](https://docs.brew.sh/Homebrew-on-Linux#install)를 통해 kubectl을 사용할 수 있다.

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## kubectl 구성 확인

{{< include "included/verify-kubectl.md" >}}

## 선택적 kubectl 구성 및 플러그인

### 셸 자동 완성 활성화

kubectl은 Bash, Zsh, Fish, 및 PowerShell에 대한 자동 완성 지원을 제공하므로 
입력을 위한 타이핑을 많이 절약할 수 있다.

다음은 Bash, Fish, 및 Zsh에 대한 자동 완성을 설정하는 절차이다.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### kuberc 구성

자세한 내용은 [kuberc](/docs/reference/kubectl/kuberc)를 참조하십시오.

### `kubectl convert` 플러그인 설치

{{< include "included/kubectl-convert-overview.md" >}}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl-convert 체크섬(checksum) 파일을 다운로드한다.

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   kubectl-convert 바이너리를 체크섬 파일을 통해 검증한다.

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   검증이 성공한다면, 출력은 다음과 같다.

   ```console
   kubectl-convert: OK
   ```

   검증이 실패한다면, `sha256`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   동일한 버전의 바이너리와 체크섬을 다운로드한다.
   {{< /note >}}

1. kubectl-convert 설치

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. 플러그인이 정상적으로 설치되었는지 확인한다.

   ```shell
   kubectl convert --help
   ```

   에러가 출력되지 않는다면, 플러그인이 정상적으로 설치된 것이다.

1. 플러그인을 설치한 후 설치 파일을 정리한다: 

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}

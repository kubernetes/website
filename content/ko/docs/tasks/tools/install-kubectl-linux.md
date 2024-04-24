---
# reviewers:
# - mikedanese
title: 리눅스에 kubectl 설치 및 설정
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: 리눅스에 kubectl 설치하기
---

## {{% heading "prerequisites" %}}

클러스터의 마이너(minor) 버전 차이 내에 있는 kubectl 버전을 사용해야 한다. 예를 들어, v{{< skew currentVersion >}} 클라이언트는 v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersion >}}, v{{< skew currentVersionAddMinor 1 >}}의 컨트롤 플레인과 연동될 수 있다.
호환되는 최신 버전의 kubectl을 사용하면 예기치 않은 문제를 피할 수 있다.

## 리눅스에 kubectl 설치

다음과 같은 방법으로 리눅스에 kubectl을 설치할 수 있다.

- [리눅스에 curl을 사용하여 kubectl 바이너리 설치](#install-kubectl-binary-with-curl-on-linux)
- [기본 패키지 관리 도구를 사용하여 설치](#install-using-native-package-management)
- [다른 패키지 관리 도구를 사용하여 설치](#install-using-other-package-management)

### 리눅스에서 curl을 사용하여 kubectl 바이너리 설치 {#install-kubectl-binary-with-curl-on-linux}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
특정 버전을 다운로드하려면, `$(curl -L -s https://dl.k8s.io/release/stable.txt)` 명령 부분을 특정 버전으로 바꾼다.

예를 들어, 리눅스에서 버전 {{< skew currentPatchVersion >}}을 다운로드하려면, 다음을 입력한다.

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

1. 바이너리를 검증한다. (선택 사항)

   kubectl 체크섬(checksum) 파일을 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   kubectl 바이너리를 체크섬 파일을 통해 검증한다.

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   검증이 성공한다면, 출력은 다음과 같다.

   ```bash
   kubectl: OK
   ```

   검증이 실패한다면, `shasum`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

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

### 기본 패키지 관리 도구를 사용하여 설치 {#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="데비안 기반의 배포판" %}}

1. `apt` 패키지 색인을 업데이트하고 쿠버네티스 `apt` 리포지터리를 사용하는 데 필요한 패키지들을 설치한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```
   Debian 9(stretch) 또는 그 이전 버전을 사용하는 경우 `apt-transport-https`도 설치해야 한다.
   ```shell
   sudo apt-get install -y apt-transport-https
   ```

2. 구글 클라우드 공개 사이닝 키를 다운로드한다.

   ```shell
   sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

3. 쿠버네티스 `apt` 리포지터리를 추가한다.

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. 새 리포지터리의 `apt` 패키지 색인을 업데이트하고 kubectl을 설치한다.

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```
{{< note >}}
Debian 12 또는 Ubuntu 22.04 이전 릴리스에서는 기본적으로 `/etc/apt/keyrings` 파일이 존재하지 않는다.
필요할 경우, 읽기 권한은 모두에게 부여되지만 쓰기 권한은 관리자만 갖도록 해당 디렉토리를 생성한다.
{{< /note >}}

{{% /tab %}}

{{% tab name="레드햇 기반의 배포판" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
```

{{% /tab %}}
{{< /tabs >}}

### 다른 패키지 관리 도구를 사용하여 설치 {#install-using-other-package-management}

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

## kubectl 구성 확인

{{< include "included/verify-kubectl.md" >}}

## 선택적 kubectl 구성 및 플러그인

### 셸 자동 완성 활성화

kubectl은 Bash, Zsh, Fish, 및 PowerShell에 대한 자동 완성 지원을 제공하므로 입력을 위한 타이핑을 많이 절약할 수 있다.

다음은 Bash, Fish, 및 Zsh에 대한 자동 완성을 설정하는 절차이다.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert` 플러그인 설치

{{< include "included/kubectl-convert-overview.md" >}}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   ```

1. 바이너리를 검증한다. (선택 사항)

   kubectl-convert 체크섬(checksum) 파일을 다운로드한다.

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

   kubectl-convert 바이너리를 체크섬 파일을 통해 검증한다.

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   검증이 성공한다면, 출력은 다음과 같다.

   ```console
   kubectl-convert: OK
   ```

   검증이 실패한다면, `sha256`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```bash
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

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}

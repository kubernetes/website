---
# reviewers:
# - mikedanese
title: macOS에 kubectl 설치 및 설정
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

클러스터와 마이너 버전 차이가 1 이내인 kubectl 버전을 사용해야 한다.
예를 들어, v{{< skew currentVersion >}} 클라이언트는
v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} 및
v{{< skew currentVersionAddMinor 1 >}} 컨트롤 플레인과 통신할 수 있다.
호환되는 최신 kubectl 버전을 사용하면 예기치 않은 문제를 방지하는 데 도움이 된다.

## macOS에 kubectl 설치

다음 방법으로 macOS에 kubectl을 설치할 수 있다.

- [macOS에 kubectl 설치](#macos에-kubectl-설치)
  - [macOS에서 curl을 사용하여 kubectl 바이너리 설치](#macos에서-curl을-사용하여-kubectl-바이너리-설치)
  - [macOS에서 Homebrew를 사용하여 설치](#macos에서-homebrew를-사용하여-설치)
  - [macOS에서 Macports를 사용하여 설치](#macos에서-macports를-사용하여-설치)
- [kubectl 구성 확인](#kubectl-구성-확인)
- [선택적 kubectl 구성 및 플러그인](#선택적-kubectl-구성-및-플러그인)
  - [셸 자동 완성 활성화](#셸-자동-완성-활성화)
  - [`kubectl convert` 플러그인 설치](#kubectl-convert-플러그인-설치)

### macOS에서 curl을 사용하여 kubectl 바이너리 설치

1. 최신 릴리스를 다운로드한다.

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   특정 버전을 다운로드하려면 명령에서 `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   부분을 해당 버전으로 바꾼다.

   예를 들어, Intel macOS에서 {{< skew currentPatchVersion >}} 버전을 다운로드하려면 다음을 입력한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   Apple Silicon 기반 macOS에서는 다음을 입력한다.

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. 바이너리 검증(선택 사항)

   kubectl 체크섬(checksum) 파일을 다운로드한다.

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   kubectl 바이너리를 체크섬 파일과 대조하여 검증한다.

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   검증에 성공하면 다음과 같이 출력된다.

   ```console
   kubectl: OK
   ```

   검증에 실패하면 `shasum`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   동일한 버전의 바이너리와 체크섬을 다운로드한다.
   {{< /note >}}

1. kubectl 바이너리에 실행 권한을 부여한다.

   ```bash
   chmod +x ./kubectl
   ```

1. kubectl 바이너리를 시스템 `PATH`에 포함된 디렉터리로 옮긴다.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   `/usr/local/bin`이 `PATH` 환경 변수에 포함되어 있는지 확인한다.
   {{< /note >}}

1. 설치한 버전이 최신인지 확인한다.

   ```bash
   kubectl version --client
   ```

   또는 다음 명령으로 버전 정보를 자세히 확인한다.

   ```cmd
   kubectl version --client --output=yaml
   ```

1. kubectl을 설치하고 검증한 후 체크섬 파일을 삭제한다.

   ```bash
   rm kubectl.sha256
   ```

### macOS에서 Homebrew를 사용하여 설치

macOS에서 [Homebrew](https://brew.sh/) 패키지 관리자를 사용한다면
Homebrew로 kubectl을 설치할 수 있다.

1. 설치 명령을 실행한다.

   ```bash
   brew install kubectl
   ```

   또는

   ```bash
   brew install kubernetes-cli
   ```

1. 설치한 버전이 최신인지 확인한다.

   ```bash
   kubectl version --client
   ```

### macOS에서 Macports를 사용하여 설치

macOS에서 [Macports](https://macports.org/) 패키지 관리자를 사용한다면
Macports로 kubectl을 설치할 수 있다.

1. 설치 명령을 실행한다.

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. 설치한 버전이 최신인지 확인한다.

   ```bash
   kubectl version --client
   ```

## kubectl 구성 확인

{{< include "included/verify-kubectl.md" >}}

## 선택적 kubectl 구성 및 플러그인

### 셸 자동 완성 활성화

kubectl은 Bash, Zsh, Fish, PowerShell의 자동 완성을 지원하므로
입력량을 크게 줄일 수 있다.

다음은 Bash, Fish, Zsh에서 자동 완성을 설정하는 절차이다.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### kuberc 구성

자세한 내용은 [kuberc](/docs/reference/kubectl/kuberc)를 참고한다.

### `kubectl convert` 플러그인 설치

{{< include "included/kubectl-convert-overview.md" >}}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. 바이너리 검증(선택 사항)

   kubectl-convert 체크섬 파일을 다운로드한다.

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   kubectl-convert 바이너리를 체크섬 파일과 대조하여 검증한다.

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   검증에 성공하면 다음과 같이 출력된다.

   ```console
   kubectl-convert: OK
   ```

   검증에 실패하면 `shasum`이 0이 아닌 상태로 종료되며 다음과 유사한 결과를 출력한다.

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   동일한 버전의 바이너리와 체크섬을 다운로드한다.
   {{< /note >}}

1. kubectl-convert 바이너리에 실행 권한을 부여한다.

   ```bash
   chmod +x ./kubectl-convert
   ```

1. kubectl-convert 바이너리를 시스템 `PATH`에 포함된 디렉터리로 옮긴다.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   `/usr/local/bin`이 `PATH` 환경 변수에 포함되어 있는지 확인한다.
   {{< /note >}}

1. 플러그인이 정상적으로 설치됐는지 확인한다.

   ```shell
   kubectl convert --help
   ```

   오류가 표시되지 않으면 플러그인이 정상적으로 설치된 것이다.

1. 플러그인을 설치한 후 설치 파일을 정리한다.

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### macOS에서 kubectl 제거

`kubectl` 설치 방법에 따라 다음 방법 중 하나를 사용한다.

### 명령줄에서 kubectl 제거

1.  시스템에서 `kubectl` 바이너리의 위치를 확인한다.

    ```bash
    which kubectl
    ```

1.  `kubectl` 바이너리를 제거한다.

    ```bash
    sudo rm <path>
    ```
    `<path>`를 이전 단계에서 확인한 `kubectl` 바이너리 경로로 바꾼다. 예를 들어, `sudo rm /usr/local/bin/kubectl`을 실행한다.

### Homebrew를 사용하여 kubectl 제거

Homebrew로 `kubectl`을 설치했다면 다음 명령을 실행한다.

```bash
brew remove kubectl
```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}



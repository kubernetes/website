---
# reviewers:
# - mikedanese
title: 윈도우에 kubectl 설치 및 설정
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

클러스터와 마이너 버전 차이가 1 이내인 kubectl 버전을 사용해야 한다.
예를 들어, v{{< skew currentVersion >}} 클라이언트는
v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} 및
v{{< skew currentVersionAddMinor 1 >}} 컨트롤 플레인과 통신할 수 있다.
호환되는 최신 kubectl 버전을 사용하면 예기치 않은 문제를 방지하는 데 도움이 된다.

## 윈도우에 kubectl 설치

다음 방법으로 윈도우에 kubectl을 설치할 수 있다.

- [윈도우에서 직접 다운로드 또는 curl로 kubectl 바이너리 설치](#윈도우에서-직접-다운로드-또는-curl로-kubectl-바이너리-설치)
- [Chocolatey, Scoop 또는 winget을 사용하여 윈도우에 설치](#install-nonstandard-package-tools)

### 윈도우에서 직접 다운로드 또는 curl로 kubectl 바이너리 설치

1. 윈도우 장치에 kubectl을 설치하는 방법은 두 가지이다.

   - 직접 다운로드.

     [쿠버네티스 릴리스 페이지](https://kubernetes.io/releases/download/#binaries)에서 사용 중인 아키텍처에 맞는 최신 {{< skew currentVersion >}} 패치 릴리스 바이너리를 직접 다운로드한다. 사용하는 아키텍처(예: amd64, arm64)에 맞는 바이너리를 선택해야 한다.

   - curl 사용.

     `curl`이 설치되어 있다면 다음 명령을 사용한다.

     ```powershell
     curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
     ```

   {{< note >}}
   스크립트 등에 사용할 최신 안정 버전은 아래에서 확인한다.
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. 바이너리를 검증한다(선택 사항).

   `kubectl` 체크섬(checksum) 파일을 다운로드한다.

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   `kubectl` 바이너리를 체크섬 파일과 대조하여 검증한다.

   - 명령 프롬프트에서 `CertUtil` 출력과 다운로드한 체크섬 파일을 수동으로 비교한다.

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - PowerShell에서 `-eq` 연산자를 사용하여 검증을 자동화하고
     `True` 또는 `False` 결과를 얻는다.

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. `kubectl` 바이너리가 있는 폴더를 `PATH` 환경 변수의 앞이나 뒤에 추가한다.

1. `kubectl` 버전이 다운로드한 버전과 같은지 확인한다.

   ```cmd
   kubectl version --client
   ```

   더 자세한 버전 정보를 확인하려면 다음 명령을 사용한다.

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[윈도우용 도커 데스크톱](https://docs.docker.com/docker-for-windows/#kubernetes)은
자체 `kubectl` 버전을 `PATH`에 추가한다. 도커 데스크톱을 이미 설치했다면
도커 데스크톱 설치 프로그램이 추가한 경로보다 앞에 사용하려는 `PATH` 항목을 배치하거나
도커 데스크톱의 `kubectl`을 제거해야 할 수도 있다.
{{< /note >}}

### Chocolatey, Scoop 또는 winget을 사용하여 윈도우에 설치 {#install-nonstandard-package-tools}

1. 윈도우에 kubectl을 설치할 때 [Chocolatey](https://chocolatey.org)
   패키지 관리자, [Scoop](https://scoop.sh) 명령줄 설치 도구 또는
   [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) 패키지 관리자를 사용할 수 있다.

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
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. 설치한 버전이 최신인지 확인한다.

   ```powershell
   kubectl version --client
   ```

1. 홈 디렉터리로 이동한다.

   ```powershell
   # cmd.exe에서는 cd %USERPROFILE% 명령을 실행한다.
   cd ~
   ```

1. `.kube` 디렉터리를 만든다.

   ```powershell
   mkdir .kube
   ```

1. 방금 만든 `.kube` 디렉터리로 이동한다.

   ```powershell
   cd .kube
   ```

1. 원격 쿠버네티스 클러스터를 사용하도록 kubectl을 구성한다.

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
메모장 등 원하는 텍스트 편집기로 구성 파일을 편집한다.
{{< /note >}}

## kubectl 구성 확인

{{< include "included/verify-kubectl.md" >}}

## 선택적 kubectl 구성 및 플러그인

### 셸 자동 완성 활성화

kubectl은 Bash, Zsh, Fish, PowerShell의 자동 완성을 지원하므로
입력량을 크게 줄일 수 있다.

다음은 PowerShell에서 자동 완성을 설정하는 절차이다.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### kuberc 구성

자세한 내용은 [kuberc](/docs/reference/kubectl/kuberc)를 참고한다.

### `kubectl convert` 플러그인 설치

{{< include "included/kubectl-convert-overview.md" >}}

1. 다음 명령으로 최신 릴리스를 다운로드한다.

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. 바이너리를 검증한다(선택 사항).

   `kubectl-convert` 체크섬 파일을 다운로드한다.

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   `kubectl-convert` 바이너리를 체크섬 파일과 대조하여 검증한다.

   - 명령 프롬프트에서 `CertUtil` 출력과 다운로드한 체크섬 파일을 수동으로 비교한다.

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - PowerShell에서 `-eq` 연산자를 사용하여 검증을 자동화하고
     `True` 또는 `False` 결과를 얻는다.

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. `kubectl-convert` 바이너리가 있는 폴더를 `PATH` 환경 변수의 앞이나 뒤에 추가한다.

1. 플러그인이 정상적으로 설치됐는지 확인한다.

   ```shell
   kubectl convert --help
   ```

   오류가 표시되지 않으면 플러그인이 정상적으로 설치된 것이다.

1. 플러그인을 설치한 후 설치 파일을 정리한다.

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}

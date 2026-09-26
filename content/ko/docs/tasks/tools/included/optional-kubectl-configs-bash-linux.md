---
title: "리눅스에서 bash 자동 완성 사용하기"
description: "리눅스에서 bash 자동 완성을 위한 몇 가지 선택적 구성에 대해 설명한다."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### 소개

Bash용 kubectl 자동 완성 스크립트는 `kubectl completion bash` 명령으로 생성할 수 있다.
셸에서 이 스크립트를 불러오면 kubectl 자동 완성이 활성화된다.

하지만 자동 완성 스크립트는
[**bash-completion**](https://github.com/scop/bash-completion)에 의존한다.
따라서 먼저 이 소프트웨어를 설치해야 한다.
(설치 여부는 `type _init_completion` 명령으로 확인할 수 있다.)

### bash-completion 설치

bash-completion은 여러 패키지 관리자에서 제공한다.
(설치 방법은 [여기](https://github.com/scop/bash-completion#installation)를 참고한다.)
`apt-get install bash-completion` 또는 `dnf install bash-completion` 등으로 설치할 수 있다.

위 명령을 실행하면 `/usr/share/bash-completion/bash_completion` 파일이 생성된다.
이 파일은 bash-completion의 기본 스크립트이다. 패키지 관리자에 따라
`~/.bashrc` 파일에서 이 파일을 수동으로 불러와야 한다.

확인하려면 셸을 다시 불러온 뒤 `type _init_completion`을 실행한다.
명령이 성공하면 이미 설정된 것이다. 그렇지 않으면 `~/.bashrc` 파일에 다음을 추가한다.

```bash
source /usr/share/bash-completion/bash_completion
```

셸을 다시 불러온 뒤 `type _init_completion`을 입력하여 bash-completion이 올바르게 설치됐는지 확인한다.

### kubectl 자동 완성 활성화

#### Bash

이제 모든 셸 세션에서 kubectl 자동 완성 스크립트를
불러오도록 설정해야 한다. 다음 두 가지 방법이 있다.

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="현재 사용자에만 적용" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="시스템 전체에 적용" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

kubectl 별칭을 사용한다면 해당 별칭에도 셸 자동 완성이 적용되도록 확장할 수 있다.

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion은 `/etc/bash_completion.d`에 있는 모든 자동 완성 스크립트를 불러온다.
{{< /note >}}

두 방법은 동일하게 작동한다. 셸을 다시 불러오면 kubectl 자동 완성이 작동한다.
현재 셸 세션에서 Bash 자동 완성을 활성화하려면 `~/.bashrc` 파일을 불러온다.

```bash
source ~/.bashrc
```

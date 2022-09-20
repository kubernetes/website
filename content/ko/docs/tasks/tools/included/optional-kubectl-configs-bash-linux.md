---
title: "리눅스에서 bash 자동 완성 사용하기"
description: "리눅스에서 bash 자동 완성을 위한 몇 가지 선택적 구성에 대해 설명한다."
headless: true
---

### 소개

Bash의 kubectl 자동 완성 스크립트는 `kubectl completion bash` 명령으로 생성할 수 있다. 셸에서 자동 완성 스크립트를 소싱(sourcing)하면 kubectl 자동 완성 기능이 활성화된다.

그러나, 자동 완성 스크립트는 [**bash-completion**](https://github.com/scop/bash-completion)에 의존하고 있으며, 이 소프트웨어를 먼저 설치해야 한다(`type _init_completion` 을 실행하여 bash-completion이 이미 설치되어 있는지 확인할 수 있음).

### bash-completion 설치

bash-completion은 많은 패키지 관리자에 의해 제공된다([여기](https://github.com/scop/bash-completion#installation) 참고). `apt-get install bash-completion` 또는 `yum install bash-completion` 등으로 설치할 수 있다.

위의 명령은 bash-completion의 기본 스크립트인 `/usr/share/bash-completion/bash_completion` 을 생성한다. 패키지 관리자에 따라, `~/.bashrc` 파일에서 이 파일을 수동으로 소스(source)해야 한다.

확인하려면, 셸을 다시 로드하고 `type _init_completion` 을 실행한다. 명령이 성공하면, 이미 설정된 상태이고, 그렇지 않으면 `~/.bashrc` 파일에 다음을 추가한다.

```bash
source /usr/share/bash-completion/bash_completion
```

셸을 다시 로드하고 `type _init_completion` 을 입력하여 bash-completion이 올바르게 설치되었는지 확인한다.

### kubectl 자동 완성 활성화

#### Bash

이제 kubectl 자동 완성 스크립트가 모든 셸 세션에서 제공되도록 해야 한다. 이를 수행할 수 있는 두 가지 방법이 있다.

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="현재 사용자에만 적용" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="시스템 전체에 적용" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
{{< /tab >}}
{{< /tabs >}}

kubectl에 대한 앨리어스(alias)가 있는 경우, 해당 앨리어스로 작업하도록 셸 자동 완성을 확장할 수 있다.

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion은 `/etc/bash_completion.d` 에 있는 모든 자동 완성 스크립트를 소싱한다.
{{< /note >}}

두 방법 모두 동일하다. 셸을 다시 로드하면, kubectl 자동 완성 기능이 작동할 것이다.
셸의 현재 세션에서 bash 자동 완성을 활성화하려면 `exec bash`를 실행한다.
```bash
exec bash
```

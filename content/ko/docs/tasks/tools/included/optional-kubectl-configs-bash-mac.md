---
title: "macOS에서 bash 자동 완성 사용하기"
description: "macOS에서 bash 자동 완성을 위한 몇 가지 선택적 구성에 대해 설명한다."
headless: true
---

### 소개

Bash의 kubectl 자동 완성 스크립트는 `kubectl completion bash` 로 생성할 수 있다. 이 스크립트를 셸에 소싱하면 kubectl 자동 완성이 가능하다.

그러나 kubectl 자동 완성 스크립트는 미리 [**bash-completion**](https://github.com/scop/bash-completion)을 설치해야 동작한다.

{{< warning>}}
bash-completion에는 v1과 v2 두 가지 버전이 있다. v1은 Bash 3.2(macOS의 기본 설치 버전) 버전용이고, v2는 Bash 4.1 이상 버전용이다. kubectl 자동 완성 스크립트는 bash-completion v1과 Bash 3.2 버전에서는 **작동하지 않는다**. **bash-completion v2** 와 **Bash 4.1 이상 버전** 이 필요하다. 따라서, macOS에서 kubectl 자동 완성 기능을 올바르게 사용하려면, Bash 4.1 이상을 설치하고 사용해야 한다([*지침*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). 다음의 내용에서는 Bash 4.1 이상(즉, 모든 Bash 버전 4.1 이상)을 사용한다고 가정한다.
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
언급한 바와 같이, 이 지침에서는 Bash 4.1 이상을 사용한다고 가정한다. 이는 bash-completion v2를 설치한다는 것을 의미한다(Bash 3.2 및 bash-completion v1의 경우, kubectl 자동 완성이 작동하지 않음).
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

이제 kubectl 자동 완성 스크립트가 모든 셸 세션에서 제공되도록 해야 한다. 이를 수행하는 방법에는 여러 가지가 있다.

- 자동 완성 스크립트를 `~/.bash_profile` 파일에서 소싱한다.

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- 자동 완성 스크립트를 `/usr/local/etc/bash_completion.d` 디렉터리에 추가한다.

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- kubectl에 대한 앨리어스가 있는 경우, 해당 앨리어스로 작업하기 위해 셸 자동 완성을 확장할 수 있다.

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -F __start_kubectl k' >>~/.bash_profile
    ```

- Homebrew로 kubectl을 설치한 경우([여기](/ko/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)의 설명을 참고), kubectl 자동 완성 스크립트가 이미 `/usr/local/etc/bash_completion.d/kubectl` 에 있을 것이다. 이 경우, 아무 것도 할 필요가 없다.

   {{< note >}}
   bash-completion v2의 Homebrew 설치는 `BASH_COMPLETION_COMPAT_DIR` 디렉터리의 모든 파일을 소싱하므로, 후자의 두 가지 방법이 적용된다.
   {{< /note >}}

어떤 경우든, 셸을 다시 로드하면, kubectl 자동 완성 기능이 작동할 것이다.
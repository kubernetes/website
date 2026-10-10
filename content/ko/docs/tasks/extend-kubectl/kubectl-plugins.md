---
title: 플러그인으로 kubectl 확장
# reviewers:
# - juanvallejo
# - soltysh
description: kubectl 플러그인을 작성하고 설치해서 kubectl을 확장한다.
content_type: task
---

<!-- overview -->

이 가이드는 [kubectl](/ko/docs/reference/kubectl/kubectl/) 확장을 설치하고 작성하는 방법을 보여준다. 핵심 `kubectl` 명령을 쿠버네티스 클러스터와 상호 작용하기 위한 필수 구성 요소로 생각함으로써, 클러스터 관리자는
플러그인을 이러한 구성 요소를 활용하여 보다 복잡한 동작을 만드는 수단으로 생각할 수 있다. 플러그인은 새로운 하위 명령으로 `kubectl` 을 확장하고, 주요 배포판에 포함되지 않은 `kubectl` 의 새로운 사용자 정의 기능을 허용한다.



## {{% heading "prerequisites" %}}


동작하는 `kubectl` 바이너리가 설치되어 있어야 한다.



<!-- steps -->

## kubectl 플러그인 설치

플러그인은 이름이 `kubectl-` 로 시작되는 독립형 실행 파일이다. 플러그인을 설치하려면, 실행 파일을 `PATH` 에 지정된 디렉터리로 옮기면 된다.

[Krew](https://krew.dev/)를 사용하여 오픈소스에서 사용 가능한
kubectl 플러그인을 검색하고 설치할 수도 있다. Krew는 쿠버네티스 SIG CLI 커뮤니티에서 관리하는
플러그인 관리자이다.

{{< caution >}}
Krew [플러그인 인덱스](https://krew.sigs.k8s.io/plugins/)를 통해 사용할 수 있는 kubectl 플러그인은
보안 감사를 받지 않는다. 써드파티 플러그인은 시스템에서 실행되는 임의의
프로그램이므로, 사용자는 이를 인지한 상태에서 설치하고 실행해야 한다.
{{< /caution >}}

### 플러그인 디스커버리

`kubectl` 은 유효한 플러그인 실행 파일을 `PATH` 에서 검색하는 `kubectl plugin list` 명령을 제공한다.
이 명령을 실행하면 `PATH` 에 있는 모든 파일을 탐색한다. 실행 가능하고, `kubectl-` 로 시작하는 모든 파일은 이 명령의 출력 결과에 *`PATH` 에 있는 순서대로* 표시된다.
실행 파일이 *아닌* 파일이 `kubectl-` 시작하는 경우 경고가 포함된다.
서로의 이름과 겹치는 유효한 플러그인 파일에 대한 경고도 포함된다.

[Krew](https://krew.dev/)를 사용하여 커뮤니티가 관리하는
[플러그인 인덱스](https://krew.sigs.k8s.io/plugins/)에서 `kubectl`
플러그인을 검색하고 설치할 수 있다.

#### 제한 사항

현재 기존 `kubectl` 명령을 덮어 쓰는 플러그인을 생성할 수 없다. 예를 들어, 플러그인 `kubectl-version` 을 만들면 기존의 `kubectl version` 명령이 항상 우선하므로, 플러그인이 실행되지 않는다. 이 제한으로 인해, 플러그인을 사용하여 기존 `kubectl` 명령에 새로운 하위 명령을 추가할 수도 *없다*. 예를 들어, 플러그인 이름을 `kubectl-create-foo` 로 지정하여 `kubectl create foo` 하위 명령을 추가하면 해당 플러그인이 무시된다.

`kubectl plugin list` 는 이를 시도하는 유효한 플러그인에 대한 경고를 표시한다.

## kubectl 플러그인 작성

커맨드-라인 명령을 작성할 수 있는 프로그래밍 언어나 스크립트로 플러그인을 작성할 수 있다.

플러그인 설치 또는 사전 로딩이 필요하지 않다. 플러그인 실행 파일은
`kubectl` 바이너리에서 상속된 환경을 받는다.
플러그인은 이름을 기반으로 구현할 명령 경로를 결정한다.
예를 들어, `kubectl-foo` 라는 플러그인은 `kubectl foo` 명령을 제공한다.
`PATH` 어딘가에 플러그인 실행 파일을 설치해야 한다.

### 플러그인 예제

```bash
#!/bin/bash

# 선택적 인수 처리
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# 선택적 인수 처리
if [[ "$1" == "config" ]]
then
    echo "$KUBECONFIG"
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

### 플러그인 사용

플러그인을 사용하려면, 실행 가능하게 만든다.

```shell
sudo chmod +x ./kubectl-foo
```

그리고 `PATH` 의 어느 곳에나 옮겨 놓는다.

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

이제 플러그인을 `kubectl` 명령으로 호출할 수 있다.

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

모든 인수와 플래그는 그대로 실행 파일로 전달된다.

```shell
kubectl foo version
```
```
1.0.0
```

모든 환경 변수도 실행 파일로 그대로 전달된다.

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config

```
```
/home/<user>/.kube/config
```

```shell
KUBECONFIG=/etc/kube/config kubectl foo config
```

```
/etc/kube/config
```

또한, 플러그인으로 전달되는 첫 번째 인수는 항상 호출된 위치의 전체 경로이다(위의 예에서 `$0` 은 `/usr/local/bin/kubectl-foo` 와 동일하다).

### 플러그인 이름 지정

위 예제에서 볼 수 있듯이, 플러그인은 파일명을 기반으로 구현할 명령 경로를 결정한다. 플러그인이 대상으로 하는 명령 경로의 모든 하위 명령은 대시(`-`)로 구분된다.
예를 들어, 사용자가 `kubectl foo bar baz` 명령을 호출할 때마다 호출되는 플러그인은 파일명이 `kubectl-foo-bar-baz` 이다.

#### 플래그와 인수 처리

{{< note >}}
플러그인 메커니즘은 플러그인 프로세스에 대한 사용자 정의, 플러그인 특정 값 또는 환경 변수를 생성하지 *않는다*.

이전 kubectl 플러그인 메커니즘은 `KUBECTL_PLUGINS_CURRENT_NAMESPACE` 와 같이 더이상 사용하지 않는 환경 변수를 제공했다.
{{< /note >}}

kubectl 플러그인은 전달된 모든 인수를 파싱하고 유효성을 검사해야 한다.
플러그인 작성자를 대상으로 하는 Go 라이브러리에 대한 자세한 내용은 [커맨드 라인 런타임 패키지 사용](#커맨드-라인-런타임-패키지-사용)을 참고한다.

다음은 사용자가 추가 플래그와 인수를 제공하면서 플러그인을 호출하는 추가 사례이다. 이것은 위 시나리오의 `kubectl-foo-bar-baz` 플러그인을 기반으로한다.

`kubectl foo bar baz arg1 --flag=value arg2` 를 실행하면, kubectl의 플러그인 메커니즘은 먼저 가장 긴 가능한 이름을 가진 플러그인을 찾으려고 시도한다. 여기서는
`kubectl-foo-bar-baz-arg1` 이다. 해당 플러그인을 찾지 못하면, kubectl은 대시로 구분된 마지막 값을 인수(여기서는 `arg1`)로 취급하고, 다음으로 가장 긴 가능한 이름인 `kubectl-foo-bar-baz` 를 찾는다.
이 이름의 플러그인을 찾으면, kubectl은 해당 플러그인을 호출하여, 플러그인 이름 뒤에 모든 인수와 플래그를 플러그인 프로세스의 인수로 전달한다.

예:

```bash
# 플러그인 생성
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# $PATH에 있는 디렉터리로 옮겨 플러그인을 "설치"
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# 플러그인을 kubectl이 인식하는지 확인
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```
# test that calling your plugin via a "kubectl" command works
# even when additional arguments and flags are passed to your
# plugin executable by the user.
kubectl foo bar baz arg1 --meaningless-flag=true
```

```
My first command-line argument was arg1
```

보시다시피, 사용자가 지정한 `kubectl` 명령을 기반으로 플러그인을 찾았으며, 모든 추가 인수와 플래그는 플러그인 실행 파일이 발견되면 그대로 전달된다.

#### 대시와 언더스코어가 있는 이름

`kubectl` 플러그인 메커니즘은 플러그인 파일명에 대시(`-`)를 사용하여 플러그인이 처리하는 하위 명령 시퀀스를 분리하지만, 파일명에
언더스코어(`_`)를 사용하여 커맨드 라인 호출에 대시를 포함하는 플러그인 명령을 생성할 수 있다.

예:

```bash
# 파일명에 언더스코어(_)가 있는 플러그인 생성
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar

# $PATH에 플러그인을 옮긴다
sudo mv ./kubectl-foo_bar /usr/local/bin

# 이제 kubectl을 통해 플러그인을 사용할 수 있다
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

참고로 플러그인 파일명에 언더스코어를 추가해도 `kubectl foo_bar` 와 같은 명령을 사용할 수 있다.
위 예에서 명령은 대시(`-`) 또는 언더스코어(`_`)을 사용하여 호출할 수 있다.

```bash
# 대시를 포함한 사용자 정의 명령을 사용할 수 있다
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```bash
# 언더스코어를 포함한 사용자 정의 명령을 사용할 수도 있다
kubectl foo_bar
```

```
I am a plugin with a dash in my name
```

#### 이름 충돌과 오버셰도잉(overshadowing)

`PATH` 의 다른 위치에 동일한 파일명을 가진 여러 플러그인이 있을 수 있다.
예를 들어, `PATH` 값이 `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins` 로 주어지고, `kubectl-foo` 플러그인을 복사한 파일이 `/usr/local/bin/plugins` 와 `/usr/local/bin/moreplugins` 에 있을 수 있다.
`kubectl plugin list` 명령의 출력 결과는 다음과 같다.

```bash
PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/plugins/kubectl-foo
/usr/local/bin/moreplugins/kubectl-foo
  - warning: /usr/local/bin/moreplugins/kubectl-foo is overshadowed by a similarly named plugin: /usr/local/bin/plugins/kubectl-foo

error: one plugin warning was found
```

위 시나리오에서, `/usr/local/bin/moreplugins/kubectl-foo` 아래의 경고는 이 플러그인이 실행되지 않을 것임을 알려준다. 대신, `PATH` 에 먼저 나타나는 실행 파일인 `/usr/local/bin/plugins/kubectl-foo` 는 항상 발견되고 `kubectl` 플러그인 메카니즘에 의해 먼저 실행된다.

이 문제를 해결하는 방법은 `kubectl` 와 함께 사용하려는 플러그인의 위치가 `PATH` 에 항상에서 먼저 오도록 하는 것이다. 예를 들어, `kubectl` 명령 `kubectl foo` 가 호출될 때마다 항상 `/usr/local/bin/moreplugins/kubectl-foo` 를 사용하려면, `PATH` 의 값을 `/usr/local/bin/moreplugins:/usr/local/bin/plugins` 로 변경한다.

#### 가장 긴 실행 파일명의 호출

플러그인 파일명으로 발생할 수 있는 또 다른 종류의 오버셰도잉이 있다. 사용자의 `PATH` 에 `kubectl-foo-bar` 와 `kubectl-foo-bar-baz` 라는 두 개의 플러그인이 있다면, `kubectl` 플러그인 메커니즘은 항상 주어진 사용자의 명령에 대해 가장 긴 가능한 플러그인 이름을 선택한다. 아래에 몇 가지 예가 있다.

```bash
# 주어진 kubectl 명령의 경우, 가장 긴 가능한 파일명을 가진 플러그인이 항상 선호된다
kubectl foo bar baz
```

```
Plugin kubectl-foo-bar-baz is executed
```

```bash
kubectl foo bar
```

```
Plugin kubectl-foo-bar is executed
```

```bash
kubectl foo bar baz buz
```

```
Plugin kubectl-foo-bar-baz is executed, with "buz" as its first argument
```

```bash
kubectl foo bar buz
```

```
Plugin kubectl-foo-bar is executed, with "buz" as its first argument
```

이 디자인 선택은 필요한 경우 여러 파일에 플러그인 하위 명령을 구현할 수 있도록 하고 이러한 하위 명령을 "부모" 플러그인 명령 아래에 중첩할 수 있도록 한다.

```bash
ls ./plugin_command_tree
```

```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

### 플러그인 경고 확인

위에서 언급한 `kubectl plugin list` 명령을 사용하여 `kubectl` 에 의해 플러그인이 표시되는지 확인하고, `kubectl` 명령으로 호출되지 못하게 하는 경고가 없는지 확인할 수 있다.

```bash
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

test/fixtures/pkg/kubectl/plugins/kubectl-foo
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo is overshadowed by a similarly named plugin: test/fixtures/pkg/kubectl/plugins/kubectl-foo
plugins/kubectl-invalid
  - warning: plugins/kubectl-invalid identified as a kubectl plugin, but it is not executable

error: 2 plugin warnings were found
```

### 커맨드 라인 런타임 패키지 사용

kubectl 용 플러그인을 작성하고 있고 Go를 사용한다면,
[cli-runtime](https://github.com/kubernetes/cli-runtime) 유틸리티 라이브러리를
사용할 수 있다.

이 라이브러리는 사용자의
[kubeconfig](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
파일을 파싱이나 업데이트하거나, REST 스타일의 요청을 API 서버에 작성하거나, 구성 및 출력과
관련된 플래그를 바인딩하기 위한 헬퍼를 제공한다.

CLI 런타임 리포지터리에 제공된 도구 사용법의 예제는
[샘플 CLI 플러그인](https://github.com/kubernetes/sample-cli-plugin)을 참고한다.

## kubectl 플러그인 배포

다른 사람이 사용할 수 있는 플러그인을 개발한 경우, 이를 패키징하고, 배포하고
사용자에게 업데이트를 제공하는 방법을 고려해야 한다.

### Krew {#distributing-krew}

[Krew](https://krew.dev/)는 플러그인을 패키징하고 배포하는 크로스-플랫폼
방식을 제공한다. 이렇게 하면, 모든 대상 플랫폼(리눅스, 윈도우, macOS 등)에
단일 패키징 형식을 사용하고 사용자에게 업데이트를 제공한다.
Krew는 또한 다른 사람들이 여러분의 플러그인을 검색하고 설치할 수 있도록
[플러그인 인덱스](https://krew.sigs.k8s.io/plugins/)를
유지 관리한다.


### 네이티브 / 플랫폼 별 패키지 관리 {#distributing-native}

다른 방법으로는, 리눅스의 `apt` 나 `yum`,
윈도우의 Chocolatey, macOS의 Homebrew와 같은 전통적인 패키지 관리자를 사용할 수 있다.
새 실행 파일을 사용자의 `PATH` 어딘가에 배치할 수 있는 패키지 관리자라면
어떤 패키지 관리자도 괜찮다.
플러그인 작성자로서, 이 옵션을 선택하면 각 릴리스의 여러 플랫폼에서
kubectl 플러그인의 배포 패키지를
업데이트해야 한다.

### 소스 코드 {#distributing-source-code}

소스 코드를 게시(예를 들어, Git 리포지터리)할 수 있다. 이
옵션을 선택하면, 해당 플러그인을 사용하려는 사람이 코드를 가져와서,
빌드 환경을 설정하고(컴파일이 필요한 경우), 플러그인을 배포해야 한다.
컴파일된 패키지를 사용 가능하게 하거나, Krew를 사용하면 설치가
더 쉬워진다.

## {{% heading "whatsnext" %}}

* Go로 작성된 플러그인의
  [자세한 예제](https://github.com/kubernetes/sample-cli-plugin)에 대해서는
  샘플 CLI 플러그인 리포지터리를 확인한다.
  궁금한 사항이 있으면,
  [SIG CLI 팀](https://github.com/kubernetes/community/tree/master/sig-cli)에 문의한다.
* kubectl 플러그인 패키지 관리자인 [Krew](https://krew.dev/)에 대해 읽어본다.

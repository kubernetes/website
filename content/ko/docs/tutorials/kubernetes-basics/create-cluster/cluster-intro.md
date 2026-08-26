---
title: Minikube를 사용해서 클러스터 생성하기
content_type: tutorial
weight: 10
---

## {{% heading "objectives" %}}

* 쿠버네티스 클러스터가 무엇인지 배운다.
* Minikube가 무엇인지 배운다.
* 컴퓨터에서 쿠버네티스 클러스터를 시작한다.

## {{% heading "prerequisites" %}}

이 튜토리얼은 `minikube`가 이미 설치되어 있다고 가정한다.
설치 방법은 [minikube 시작하기](https://minikube.sigs.k8s.io/docs/start/)를 참고한다.
{{< note >}}
**1단계: 설치**에 나온 지침만 실행한다. 나머지는 이 튜토리얼에서 다룬다.
{{< /note >}}

`kubectl`도 설치해야 한다.
설치 방법은 [도구 설치](/docs/tasks/tools/#kubectl)를 참고한다.

이 튜토리얼의 셸 명령어는 POSIX 셸 문법을 사용하며, 이는 대부분의 리눅스 및 macOS
시스템의 기본 셸(예: bash, zsh, sh)에서 지원된다.
윈도우 사용자는 명령어를 작성된 그대로 실행하려면
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
또는 [Git Bash](https://gitforwindows.org/)와 같은 POSIX 호환 셸을 사용해야 한다.
`export`, `$()` 및 이와 유사한 구문을 사용하는 명령어는 PowerShell이나 윈도우 명령
프롬프트(Command Prompt)와 **호환되지 않는다**.

## 쿠버네티스 클러스터

{{% alert %}}
_쿠버네티스는 컴퓨터 클러스터 내부와 클러스터 간에 애플리케이션 컨테이너의
배치(스케줄링) 및 실행을 오케스트레이션하는 운영 수준의 오픈소스
플랫폼이다._
{{% /alert %}}

**쿠버네티스는 컴퓨터들을 연결하여 단일 형상으로 동작하도록 가용성 높은 클러스터를
조율한다.** 사용자는 쿠버네티스의 추상화 개념을 통해 개별 머신에 얽매이지 않고
컨테이너화된 애플리케이션을 클러스터에 배포할 수 있다. 이렇게 새로운 배포 모델을
활용하려면, 애플리케이션을 개별 호스트에 독립적인 방식으로 패키징할 필요가 있다.
즉, 컨테이너화가 필요하다. 예전 배치 모델인 설치형 애플리케이션이 특정 머신의
호스트와 밀접하게 통합되는 패키지인 것에 비해, 컨테이너화된 애플리케이션은
유연성(flexible)과 가용성(available)이 훨씬 높다. **쿠버네티스는 이러한 애플리케이션
컨테이너를 클러스터에 분산시키고 스케줄링하는 일을 더욱 효율적으로 자동화한다.**
쿠버네티스는 오픈소스 플랫폼이며 운영 수준의
안정성(production-ready)을 제공한다.

쿠버네티스 클러스터는 두 가지 형태의 자원으로 구성된다.

* **컨트롤 플레인**은 클러스터를 조율한다.
* **노드**는 애플리케이션을 구동하는 작업자(worker)이다.

### 클러스터 다이어그램

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**컨트롤 플레인은 클러스터 관리를 담당한다.** 컨트롤 플레인은 애플리케이션을
스케줄링하거나, 애플리케이션의 항상성을 유지하거나, 애플리케이션을 스케일링하고, 새로운
변경사항을 순서대로 반영(rolling out)하는 일과 같은 클러스터 내 모든 활동을 조율한다.

{{% alert %}}
_컨트롤 플레인은 실행 중인 애플리케이션을 호스팅하기 위해 사용되는 노드와 클러스터를
관리한다._
{{% /alert %}}

**노드는 쿠버네티스 클러스터 내 워커 머신으로 동작하는 VM 또는 물리적인 컴퓨터다.**
각 노드는 노드를 관리하고 쿠버네티스 컨트롤 플레인과 통신하는 Kubelet이라는 에이전트를
갖는다. 노드는 컨테이너 운영을 처리하는
{{< glossary_tooltip text="containerd" term_id="containerd" >}} 또는
{{< glossary_tooltip term_id="cri-o" >}}와 같은 툴도 갖는다. 일반적으로 지원되는 배포
모델은 전용 컨트롤 플레인 노드에서 쿠버네티스 컨트롤 플레인 컴포넌트를 실행하는 것이다.

애플리케이션을 쿠버네티스에 배포하기 위해서는, 컨트롤 플레인에 애플리케이션 컨테이너의
구동을 지시하면 된다. 그러면 컨트롤 플레인은 컨테이너를 클러스터의 어느 노드에
구동시킬지 스케줄한다. **노드는 컨트롤 플레인이 제공하는
[쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)를 통해서 컨트롤 플레인과 통신한다.**
최종 사용자도 쿠버네티스 API를 사용해서 클러스터와 직접 상호작용(interact)할
수 있다.

쿠버네티스 클러스터는 물리 및 가상 머신 모두에 설치될 수 있다. 쿠버네티스 개발을
시작하려면 Minikube를 사용할 수 있다. Minikube는 가벼운 쿠버네티스 구현체이며, 로컬
머신에 VM을 만들고 하나의 노드로 구성된 간단한 클러스터를 생성한다. Minikube는 리눅스,
맥, 그리고 윈도우 시스템에서 구동이 가능하다. Minikube CLI는 클러스터에 대해 시작, 중지,
상태 조회 및 삭제 등의 기본적인 부트스트래핑(bootstrapping) 기능을
제공한다.

## minikube 클러스터 생성하기

minikube 클러스터를 시작하려면 다음과 같이 실행한다.

```shell
minikube start
```

클러스터 상태를 확인하려면 다음과 같이 실행한다.

```shell
minikube status
```

첫 번째 애플리케이션을 배포하고 쿠버네티스 대시보드를 살펴보는 전체 과정은 [Hello Minikube](/docs/tutorials/hello-minikube/) 튜토리얼을 참고한다.

## {{% heading "whatsnext" %}}

* [애플리케이션 배포하기](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) 튜토리얼.
* [클러스터 아키텍처](/docs/concepts/architecture/)에 대해 더 알아본다.
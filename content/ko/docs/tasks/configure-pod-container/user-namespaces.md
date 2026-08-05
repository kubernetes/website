---
title: 파드에 유저 네임스페이스 사용하기
reviewers:
content_type: task
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

이 페이지는 스테이트리스(stateless) 파드에 유저 네임스페이스를 구성하는 방법을 다룬다. 이를 통해
컨테이너 내부에서 실행 중인 유저를 호스트의 유저로부터 분리할 수
있다.

컨테이너에서 루트로 실행되는 프로세스는 호스트에서 다른(루트가 아닌) 유저로 실행할 수
있다. 즉, 프로세스는 유저 네임스페이스 내부의 작업에 대한 
모든 권한을 갖지만 네임스페이스 외부의 작업에 대해서는
권한이 없다.

이 기능을 사용하여 손상된 컨테이너가 호스트 또는 동일한 노드의 다른 파드에 미칠 
피해를 줄일 수 있다. 유저 네임스페이스를 이용하면, 
**HIGH** 또는 **CRITICAL** 로 분류되는 여러 [보안 취약점][KEP-vulns]을 
보완할 수 있다. 유저 네임스페이스는 향후 발생할 수 있는 여러 취약점도 
완화시킬 것으로 예상된다.

유저 네임스페이스를 사용하지 않고 루트로 실행하는 컨테이너는 
컨테이너 브레이크아웃(breakout)이 발생하면 노드의 루트 권한을 갖는다. 그리고 컨테이너에
어떤 기능이 부여되어 있다면 해당 기능은 호스트에서도 유효하다. 유저 네임스페이스를
이용한다면 전혀 해당되지 않는 내용이다.

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

* 노드의 운영체제는 리눅스를 사용한다.
* 호스트에서 커맨드를 exec 할 수 있어야 한다.
* 파드 내부로 exec 할 수 있어야 한다.
* 기능 게이트 'UserNamespacesStatelessPodsSupport'를 활성화해야 한다.

추가적으로, 쿠버네티스 스테이트리스(stateless) 파드에서 
이 기능을 사용하려면 
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}에서 지원이 필요하다.

* CRI-O: v1.25는 유저 네임스페이스를 지원한다.

**컨테이너 런타임이 유저 네임스페이스를 지원하지 않으면, 
새 `pod.spec` 필드는 별다른 경고 없이 무시되고 파드는 유저 네임스페이스 없이 생성된다** 는 
사실을 명심한다.

<!-- steps -->

## 유저 네임스페이스를 사용하는 파드를 동작시키기 {#create-pod}

스테이트리스 파드의 유저 네임스페이스는 `.spec`의 `hostUsers` 필드를 
`false`로 설정하여 사용할 수 있다. 다음은 예시이다.

{{< codenew file="pods/user-namespaces-stateless.yaml" >}}

1. 클러스터에 파드를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/user-namespaces-stateless.yaml
   ```

1. 컨테이너에 연결하고 `readlink /proc/self/ns/user`를 실행한다.

   ```shell
   kubectl attach -it userns bash
   ```

그리고 명령을 실행한다. 결과는 다음과 유사하다.

```none
readlink /proc/self/ns/user
user:[4026531837]
cat /proc/self/uid_map
0          0 4294967295
```

그런 다음 호스트에서 셸을 열고 동일한 명령을 실행한다.

결과는 분명 다를 것이다. 이는 호스트와 파드가 다른 유저 네임스페이스를 사용하고 있음을 
의미한다. 유저 네임스페이스를 따로 만들지 않으면 호스트와 파드는 동일한 
유저 네임스페이스를 사용한다.

유저 네임스페이스 내에서 kubelet을 실행하고 있다면, 
파드에서 실행한 명령의 결과와 호스트에서 실행한 결과를 비교한다.

```none
readlink /proc/$pid/ns/user
user:[4026534732]
```

`$pid`은 kubelet의 PID로 대체한다.

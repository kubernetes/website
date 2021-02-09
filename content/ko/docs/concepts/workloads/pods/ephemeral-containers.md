---
title: 임시(Ephemeral) 컨테이너
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

이 페이지는 임시 컨테이너에 대한 개요를 제공한다: 이 특별한 유형의 컨테이너는
트러블 슈팅과 같은 사용자가 시작한 작업을 완료하기위해 기존 {{< glossary_tooltip text="파드" term_id="pod" >}} 에서
임시적으로 실행된다. 사용자는 애플리케이션 빌드보다는 서비스를 점검할 때 임시
컨테이너를 사용한다.

{{< warning >}}
임시 컨테이너는 초기 알파 상태이며,
프로덕션 클러스터에는 적합하지 않다.
[쿠버네티스 사용 중단(deprecation) 정책](/docs/reference/using-api/deprecation-policy/)에 따라
이 알파 기능은 향후 크게 변경되거나, 완전히 제거될 수 있다.
{{< /warning >}}



<!-- body -->

## 임시 컨테이너 이해하기

{{< glossary_tooltip text="파드" term_id="pod" >}} 는 쿠버네티스 애플리케이션의
기본 구성 요소이다. 파드는 일회용이고, 교체 가능한 것으로 의도되었기
때문에, 사용자는 파드가 한번 생성되면, 컨테이너를 추가할 수 없다.
대신, 사용자는 보통 {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}} 를
사용해서 제어하는 방식으로 파드를 삭제하고 교체한다.

그러나 때때로 재현하기 어려운 버그의 문제 해결을 위해
기존 파드의 상태를 검사해야 할 수 있다. 이 경우 사용자는
기존 파드에서 임시 컨테이너를 실행해서 상태를 검사하고, 임의의 명령을
실행할 수 있다.

### 임시 컨테이너는 무엇인가?

임시 컨테이너는 리소스 또는 실행에 대한 보증이 없다는 점에서
다른 컨테이너와 다르며, 결코 자동으로 재시작되지 않는다. 그래서
애플리케이션을 만드는데 적합하지 않다. 임시 컨테이너는
일반 컨테이너와 동일한 `ContainerSpec` 을 사용해서 명시하지만, 많은 필드가
호환되지 않으며 임시 컨테이너에는 허용되지 않는다.

- 임시 컨테이너는 포트를 가지지 않을 수 있으므로, `ports`,
  `livenessProbe`, `readinessProbe` 와 같은 필드는 허용되지 않는다.
- 파드에 할당된 리소스는 변경할 수 없으므로, `resources` 설정이 허용되지 않는다.
- 허용되는 필드의 전체 목록은 [임시컨테이너 참조
  문서](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)를 본다.

임시 컨테이너는 `pod.spec` 에 직접 추가하는 대신
API에서 특별한 `ephemeralcontainers` 핸들러를 사용해서 만들어지기 때문에
`kubectl edit`을 사용해서 임시 컨테이너를 추가할 수 없다.

일반 컨테이너와 마찬가지로, 사용자는 임시 컨테이너를 파드에 추가한
이후에 변경하거나 제거할 수 없다.

## 임시 컨테이너의 사용

임시 컨테이너는 컨테이너가 충돌 되거나 또는 컨테이너 이미지에
디버깅 도구가 포함되지 않은 이유로 `kubectl exec` 이 불충분할 때
대화형 문제 해결에 유용하다.

특히, [distroless 이미지](https://github.com/GoogleContainerTools/distroless)
를 사용하면 공격 표면(attack surface)과 버그 및 취약점의 노출을 줄이는 최소한의
컨테이너 이미지를 배포할 수 있다. distroless 이미지는 셸 또는 어떤 디버깅 도구를
포함하지 않기 때문에, `kubectl exec` 만으로는 distroless
이미지의 문제 해결이 어렵다.

임시 컨테이너 사용 시 [프로세스 네임스페이스
공유](/docs/tasks/configure-pod-container/share-process-namespace/)를
활성화하면 다른 컨테이너 안의 프로세스를 보는데 도움이 된다.

임시 컨테이너를 사용해서 문제를 해결하는 예시는
[임시 디버깅 컨테이너로 디버깅하기]
(/docs/tasks/debug-application-cluster/debug-running-pod/#ephemeral-container)를 참조한다.

## 임시 컨테이너 API

{{< note >}}
이 섹션의 예시는 `EphemeralContainers` [기능
게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)의
활성화를 필요로 하고, 쿠버네티스 클라이언트와 서버는 v1.16 또는 이후의 버전이어야 한다.
{{< /note >}}

이 섹션의 예시는 임시 컨테이너가 어떻게 API에 나타나는지
보여준다. 일반적으로 `kubectl debug` 또는
다른 `kubectl` [플러그인](/ko/docs/tasks/extend-kubectl/kubectl-plugins/)을
사용해서 API를 직접 호출하지 않고 이런 단계들을 자동화 한다.

임시 컨테이너는 파드의 `ephemeralcontainers` 하위 리소스를
사용해서 생성되며, `kubectl --raw` 를 사용해서 보여준다. 먼저
`EphemeralContainers` 목록으로 추가하는 임시 컨테이너를 명시한다.

```json
{
    "apiVersion": "v1",
    "kind": "EphemeralContainers",
    "metadata": {
            "name": "example-pod"
    },
    "ephemeralContainers": [{
        "command": [
            "sh"
        ],
        "image": "busybox",
        "imagePullPolicy": "IfNotPresent",
        "name": "debugger",
        "stdin": true,
        "tty": true,
        "terminationMessagePolicy": "File"
    }]
}
```

이미 실행중인 `example-pod` 에 임시 컨테이너를 업데이트 한다.

```shell
kubectl replace --raw /api/v1/namespaces/default/pods/example-pod/ephemeralcontainers  -f ec.json
```

그러면 새로운 임시 컨테이너 목록이 반환된다.

```json
{
   "kind":"EphemeralContainers",
   "apiVersion":"v1",
   "metadata":{
      "name":"example-pod",
      "namespace":"default",
      "selfLink":"/api/v1/namespaces/default/pods/example-pod/ephemeralcontainers",
      "uid":"a14a6d9b-62f2-4119-9d8e-e2ed6bc3a47c",
      "resourceVersion":"15886",
      "creationTimestamp":"2019-08-29T06:41:42Z"
   },
   "ephemeralContainers":[
      {
         "name":"debugger",
         "image":"busybox",
         "command":[
            "sh"
         ],
         "resources":{

         },
         "terminationMessagePolicy":"File",
         "imagePullPolicy":"IfNotPresent",
         "stdin":true,
         "tty":true
      }
   ]
}
```

사용자는 `kubectl describe` 를 사용해서 새로 만든 임시 컨테이너의 상태를 볼 수 있다.

```shell
kubectl describe pod example-pod
```

```
...
Ephemeral Containers:
  debugger:
    Container ID:  docker://cf81908f149e7e9213d3c3644eda55c72efaff67652a2685c1146f0ce151e80f
    Image:         busybox
    Image ID:      docker-pullable://busybox@sha256:9f1003c480699be56815db0f8146ad2e22efea85129b5b5983d0e0fb52d9ab70
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
    State:          Running
      Started:      Thu, 29 Aug 2019 06:42:21 +0000
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

예시와 같이 `kubectl attach`, `kubectl exec`, 그리고 `kubectl logs` 를 사용해서
다른 컨테이너와 같은 방식으로 새로운 임시 컨테이너와
상호작용할 수 있다.

```shell
kubectl attach -it example-pod -c debugger
```

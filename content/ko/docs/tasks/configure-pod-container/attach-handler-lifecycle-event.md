---
title: 컨테이너 라이프사이클 이벤트에 핸들러 연결하기
weight: 180
---

<!-- overview -->

이 페이지에서는 컨테이너 라이프사이클 이벤트에 핸들러를 연결하는 방법을 보여준다. 쿠버네티스는
postStart 이벤트와 preStop 이벤트를 지원한다. 쿠버네티스는 컨테이너가 시작된 직후
postStart 이벤트를 전송하고, 컨테이너가 종료되기 직전에 preStop 이벤트를 전송한다.
컨테이너는 이벤트당 하나의 핸들러를 지정할 수 있다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## postStart 및 preStop 핸들러 정의

이 연습에서는 하나의 컨테이너로 이루어진 파드를 생성한다. 컨테이너에는
postStart와 preStop 이벤트에 대한 핸들러가 있다.

다음은 파드의 구성 파일이다.

{{< codenew file="pods/lifecycle-events.yaml" >}}

구성 파일에서, postStart 명령은 컨테이너의 `/usr/share` 디렉토리에
`message` 파일을 생성하는 것을 확인할 수 있다. preStop 명령은 nginx를
정상적으로(gracefully) 종료한다. 이는 컨테이너가 장애로 인해 종료되는 경우에 유용하다.

파드를 생성한다.

    kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml

파드의 컨테이너가 실행 중인지 확인한다.

    kubectl get pod lifecycle-demo

파드에서 실행 중인 컨테이너 셸로 진입한다.

    kubectl exec -it lifecycle-demo -- /bin/bash

셸에서 `postStart` 핸들러가 `message` 파일을 생성했는지 확인한다.

    root@lifecycle-demo:/# cat /usr/share/message

출력에는 postStart 핸들러가 작성한 텍스트가 표시된다.

    Hello from the postStart handler





<!-- discussion -->

## 토의

쿠버네티스는 컨테이너가 생성된 직후 postStart 이벤트를 전송한다.
그러나 컨테이너의 엔트리포인트가 호출되기 전에 postStart
핸들러가 호출된다는 보장은 없다. postStart 핸들러는 컨테이너 코드에
대해 비동기적으로 실행되지만, 쿠버네티스의 컨테이너 관리는
postStart 핸들러가 완료될 때까지 차단된다. postStart 핸들러가
완료될 때까지 컨테이너의 상태는 실행 중으로 설정되지 않는다.

쿠버네티스는 컨테이너가 종료되기 직전에 preStop 이벤트를 전송한다.
파드의 유예 기간(grace period)이 만료되지 않은 한, 쿠버네티스의 컨테이너 관리는
preStop 핸들러가 완료될 때까지 차단된다. 자세한 내용은
[파드 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)을 참고한다.

{{< note >}}
쿠버네티스는 파드가 *terminated* 일 때만 preStop 이벤트를 전송한다.
즉, 파드가 *completed* 일 때는 preStop 훅(hook)이 호출되지 않는다.
이 제한은 [이슈 #55087](https://github.com/kubernetes/kubernetes/issues/55807)에서 추적되었다.
{{< /note >}}




## {{% heading "whatsnext" %}}


* [컨테이너 라이프사이클 훅](/ko/docs/concepts/containers/container-lifecycle-hooks/)에 대해 더 알아보기.
* [파드 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)에 대해 더 알아보기.


### Reference

* [라이프사이클](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [컨테이너](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 에서 `terminationGracePeriodSeconds` 살펴보기





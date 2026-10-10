---
# reviewers:
# - mikedanese
# - thockin
title: 파드 디버깅하기
content_type: task
weight: 10
---

<!-- overview -->

이 가이드는 쿠버네티스에 배포되었지만 제대로 동작하지 않는 애플리케이션을 디버깅하는 방법을 소개한다. 
이 가이드는 클러스터 디버깅에 대한 것은 아니다. 
클러스터 디버깅에 대해서는 [이 가이드](/ko/docs/tasks/debug/debug-cluster/)를 참고한다.

<!-- body -->

## 문제 진단하기

트러블슈팅의 첫 단계는 문제를 파악하는 것이다. 
무엇이 문제인가? 파드인가, 레플리케이션 컨트롤러인가, 서비스인가?

   * [파드 디버깅하기](#debugging-pods)
   * [레플리케이션컨트롤러 디버깅하기](#debugging-replication-controllers)
   * [서비스 디버깅하기](#debugging-services)

### 파드 디버깅하기 {#debugging-pods}

파드 디버깅의 첫 번째 단계는 파드를 살펴 보는 것이다. 다음의 명령어를 사용하여 파드의 현재 상태와 최근 이벤트를 점검한다.

```shell
kubectl describe pods ${POD_NAME}
```

파드 내부 컨테이너의 상태를 확인한다. 모두 `Running` 상태인가? 최근에 재시작 되었는가?

파드의 상태에 따라 디버깅을 계속한다.

#### 파드가 계속 pending 상태인 경우

파드가 `Pending` 상태로 멈춰 있는 경우는, 노드에 스케줄 될 수 없음을 의미한다.
일반적으로 이것은 어떤 유형의 리소스가 부족하거나 스케줄링을 방해하는 다른 요인 때문이다.
상단의 `kubectl describe ...` 명령의 결과를 확인하자.
파드를 스케줄 할 수 없는 사유에 대한 스케줄러의 메세지가 있을 것이다. 다음과 같은 사유가 있을 수 있다.

* **리소스가 부족한 경우**: 사용자 클러스터의 CPU 나 메모리가 고갈되었을 수 있다. 
이러한 경우, 파드를 삭제하거나, 리소스 요청을 조정하거나, 클러스터에 노드를 추가해야 한다. 
[컴퓨트 자원 문서](/ko/docs/concepts/configuration/manage-resources-containers/)에서 더 많은 정보를 확인한다.

* **`hostPort`를 사용하고 있는 경우**: 파드를 `hostPort`에 바인딩할 때, 파드가 스케줄링될 수 있는 장소 수 제한이 존재한다. 
대부분의 경우 `hostPort`는 불필요하므로, 파드를 노출하기 위해서는 서비스(Service) 오브젝트 사용을 고려해 본다. 
`hostPort`가 꼭 필요하다면 클러스터의 노드 수 만큼만 파드를 스케줄링할 수 있다.


#### 파드가 계속 waiting 상태인 경우

파드가 `Waiting` 상태에서 멈춘 경우는, 파드가 워커 노드에 스케줄링되었지만 해당 노드에서 실행될 수 없음을 의미한다.
다시 말하지만, `kubectl describe ...` 명령은 유용한 정보를 제공한다. 파드가 `Waiting` 상태에서 멈추는 가장 흔한 원인은 이미지 풀링(pulling)에 실패했기 때문이다. 다음의 3가지 사항을 확인한다.

* 이미지 이름이 올바른지 확인한다.
* 해당 이미지를 저장소에 푸시하였는가?
* 이미지가 풀 될 수 있는지 확인하기 위해 수동으로 이미지를 풀 해본다. 
  예를 들어, PC에서 도커를 사용하는 경우, `docker pull <image>` 명령을 실행한다.

#### 파드가 손상(crashing)되었거나 양호하지 않을(unhealthy) 경우

일단 사용자의 파드가 스케줄 되면, [구동중인 파드 디버그하기](/ko/docs/tasks/debug/debug-application/debug-running-pod/)에
있는 방법을 사용하여 디버깅을 할 수 있다.

#### 파드가 running 상태이지만 해야 할 일을 하고 있지 않은 경우

파드가 예상과 다르게 동작 중이라면, 파드 상세(예: 로컬 머신에 있는 `mypod.yaml` 파일)에 에러가 있었는데 
파드 생성 시에 에러가 조용히 지나쳐진 경우일 수 있다. 
종종 파드 상세의 들여쓰기가 잘못되었거나, 
키 이름에 오타가 있어서 해당 키가 무시되는 일이 있을 수 있다. 
예를 들어, `command`를 `commnd`로 잘못 기재했다면 
해당 파드는 생성은 되지만 명시한 명령줄을 실행하지 않을 것이다.

가장 먼저 해야 할 일은 파드를 삭제한 다음, `--validate` 옵션을 사용하여 다시 만들어 보는 것이다.
예를 들어, `kubectl apply --validate -f mypod.yaml` 를 실행한다.
`command`를 `commnd`로 잘못 기재했다면 다음과 같은 에러가 발생할 것이다.

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

다음으로 확인할 것은 apiserver를 통해 확인한 파드 상세가 
사용자가 의도한 파드 상세(예: 로컬 머신에 있는 yaml 파일)와 일치하는지 여부이다.
예를 들어, `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` 를 실행한 다음, 
원본 파드 상세(`mypod.yaml`)와 apiserver를 통해 확인한 파드 상세(`mypod-on-apiserver.yaml`)를 수동으로 비교한다. 
보통 원본 버전에는 없지만 "apiserver" 버전에는 있는 줄들이 존재한다. 
이는 예상대로이다. 
하지만, 원본 버전에는 있지만 "apiserver" 버전에는 없는 줄들이 있다면, 
이는 원본 파드 상세에 문제가 있을 수도 있음을 의미한다.

## 레플리케이션컨트롤러 디버깅하기 {#debugging-replication-controllers}

레플리케이션컨트롤러의 경우에는 매우 직관적이다. 파드 생성이 가능하거나 또는 불가능한 경우 둘 뿐이다. 
레플리케이션컨트롤러가 파드를 생성할 수 없다면, [위의 지침](#debugging-pods)을 참고하여 파드를 디버깅한다.

사용자는 `kubectl describe rc ${CONTROLLER_NAME}` 을 사용하여 
레플리케이션 컨트롤러와 관련된 이벤트를 검사할 수도 있다.

### 서비스 디버깅하기 {#debugging-services}

서비스는 파드 집합에 대한 로드 밸런싱 기능을 제공한다. 일반적인 몇몇 문제들 때문에 서비스가 제대로 동작하지 않을 수 있다. 
다음 지침을 이용하여 서비스 문제를 디버깅할 수 있다.

먼저, 서비스를 위한 엔드포인트가 존재하는지 확인한다. 모든 서비스 오브젝트에 대해, apiserver는 `endpoints` 리소스를 생성하고 사용 가능한(available) 상태로 만든다.

다음 명령을 사용하여 이 리소스를 볼 수 있다.

```shell
kubectl get endpoints ${SERVICE_NAME}
```

엔드포인트의 수가 해당 서비스에 속하는 파드의 수와 일치하는지 확인한다.
예를 들어, 서비스가 레플리카 3개인 nginx 컨테이너를 위한 것이라면, 
서비스의 엔드포인트 항목에서 서로 다른 3개의 IP 주소가 확인되어야 한다.

#### 서비스에 엔드포인트가 없는 경우

엔드포인트가 없는 상태라면, 서비스가 사용 중인 레이블을 이용하여 파드 목록을 조회해 본다. 
다음과 같은 레이블을 갖는 서비스를 가정한다.

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

다음의 명령을 사용하여,

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

이 셀렉터에 매치되는 파드 목록을 조회할 수 있다. 서비스에 속할 것으로 예상하는 파드가 모두 조회 결과에 있는지 확인한다. 
파드의 `containerPort`가 서비스의 `targetPort`와 일치하는지 확인한다.

#### 네트워크 트래픽이 포워드되지 않는 경우

[서비스 디버깅하기](/ko/docs/tasks/debug/debug-application/debug-service/)에서 더 많은 정보를 확인한다.

## {{% heading "whatsnext" %}}

위의 방법 중 어떤 것으로도 문제가 해결되지 않는다면, 
[서비스 디버깅하기 문서](/ko/docs/tasks/debug/debug-application/debug-service/)를 참조하여 
`서비스`가 실행 중인지, 서비스에 `엔드포인트`가 있는지, `파드`가 실제로 서빙 중인지 확인한다. 
예를 들어, DNS가 실행 중이고, iptables 규칙이 설정되어 있고, kube-proxy가 정상적으로 동작하는 것으로 보이는 상황이라면, 
위와 같은 사항을 확인해 볼 수 있다.

[트러블슈팅 문서](/ko/docs/tasks/debug/)에서 더 많은 정보를 볼 수도 있다.

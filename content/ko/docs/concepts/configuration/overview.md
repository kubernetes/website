---


title: 구성 모범 사례
content_type: concept
weight: 10
---

<!-- overview -->
이 문서는 사용자 가이드, 시작하기 문서 및 예제들에 걸쳐 소개된 구성 모범 사례를 강조하고 통합한다.

이 문서는 지속적으로 변경 가능하다. 이 목록에 없지만 다른 사람들에게 유용할 것 같은 무엇인가를 생각하고 있다면, 새로운 이슈를 생성하거나 풀 리퀘스트를 제출하는 것을 망설이지 말기를 바란다.


<!-- body -->
## 일반적인 구성 팁

- 구성을 정의할 때, 안정된 최신 API 버전을 명시한다.

- 구성 파일들은 클러스터에 적용되기 전에 버전 컨트롤에 저장되어 있어야 한다. 이는 만약 필요하다면 구성의 변경 사항을 빠르게 되돌릴 수 있도록 해준다. 이는 또한 클러스터의 재-생성과 복원을 도와준다.

- JSON보다는 YAML을 사용해 구성 파일을 작성한다. 비록 이러한 포맷들은 대부분의 모든 상황에서 통용되어 사용될 수 있지만, YAML이 좀 더 사용자 친화적인 성향을 가진다.

- 의미상 맞다면 가능한 연관된 오브젝트들을 하나의 파일에 모아 놓는다. 때로는 여러 개의 파일보다 하나의 파일이 더 관리하기 쉽다. 이 문법의 예시로서 [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/all-in-one/guestbook-all-in-one.yaml) 파일을 참고한다.

- 많은 `kubectl` 커맨드들은 디렉터리에 대해 호출될 수 있다. 예를 들어, 구성 파일들의 디렉터리에 대해 `kubectl apply`를 호출할 수 있다.

- 불필요하게 기본 값을 명시하지 않는다. 간단하고 최소한의 설정은 에러를 덜 발생시킨다.

- 더 나은 인트로스펙션(introspection)을 위해서, 어노테이션에 오브젝트의 설명을 넣는다.


## "단독(Naked)" 파드 vs 레플리카셋(ReplicaSet), 디플로이먼트(Deployment), 그리고 잡(Job) {#naked-pods-vs-replicasets-deployments-and-jobs}

- 가능하다면 단독 파드(즉, [레플리카셋](/ko/docs/concepts/workloads/controllers/replicaset/)이나 [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)에 연결되지 않은 파드)를 사용하지 않는다. 단독 파드는 노드 장애 이벤트가 발생해도 다시 스케줄링되지 않는다.

  명백하게 [`restartPolicy: Never`](/ko/docs/concepts/workloads/pods/pod-lifecycle/#재시작-정책)를 사용하는 상황을 제외한다면, 의도한 파드의 수가 항상 사용 가능한 상태를 유지하는 레플리카셋을 생성하고, 파드를 교체하는 전략([롤링 업데이트](/ko/docs/concepts/workloads/controllers/deployment/#디플로이먼트-롤링-업데이트)와 같은)을 명시하는 디플로이먼트는 파드를 직접 생성하기 위해 항상 선호되는 방법이다. [잡](/ko/docs/concepts/workloads/controllers/job/) 또한 적절할 수 있다.


## 서비스

- 서비스에 대응하는 백엔드 워크로드(디플로이먼트 또는 레플리카셋) 또는 서비스 접근이 필요한 어떠한 워크로드를 생성하기 전에 [서비스](/ko/docs/concepts/services-networking/service/)를 미리 생성한다. 쿠버네티스가 컨테이너를 시작할 때, 쿠버네티스는 컨테이너 시작 당시에 생성되어 있는 모든 서비스를 가리키는 환경 변수를 컨테이너에 제공한다. 예를 들어, `foo` 라는 이름의 서비스가 존재한다면, 모든 컨테이너들은 초기 환경에서 다음의 변수들을 얻을 것이다.

  ```shell
  FOO_SERVICE_HOST=<서비스가 동작 중인 호스트>
  FOO_SERVICE_PORT=<서비스가 동작 중인 포트>
  ```

  *이는 순서를 정하는 일이 요구됨을 암시한다* - `파드`가 접근하기를 원하는 어떠한 `서비스`는 `파드` 스스로가 생성되기 전에 미리 생성되어 있어야 하며, 그렇지 않으면 환경 변수가 설정되지 않을 것이다. DNS는 이러한 제한을 가지고 있지 않다.

- 선택적인(그렇지만 매우 권장되는) [클러스터 애드온](/ko/docs/concepts/cluster-administration/addons/)은 DNS 서버이다.
DNS 서버는 새로운 `서비스`를 위한 쿠버네티스 API를 Watch하며, 각 서비스를 위한 DNS 레코드 셋을 생성한다. 만약 DNS가 클러스터에 걸쳐 활성화되어 있다면, 모든 `파드`는 `서비스`의 이름을 자동으로 해석할 수 있어야 한다.

- 반드시 필요한 것이 아니라면 파드에 `hostPort` 를 명시하지 않는다. <`hostIP`, `hostPort`, `protocol`> 조합은 유일해야 하기 때문에, `hostPort`로 바인드하는 것은 파드가 스케줄링될 수 있는 위치의 개수를 제한한다. 만약 `hostIP`와 `protocol`을 뚜렷히 명시하지 않으면, 쿠버네티스는 `hostIP`의 기본 값으로 `0.0.0.0`를, `protocol`의 기본 값으로 `TCP`를 사용한다.

  만약 오직 디버깅의 목적으로 포트에 접근해야 한다면, [apiserver proxy](/ko/docs/tasks/access-application-cluster/access-cluster/#수작업으로-apiserver-proxy-url을-구축) 또는 [`kubectl port-forward`](/ko/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)를 사용할 수 있다.

  만약 파드의 포트를 노드에서 명시적으로 노출해야 한다면, `hostPort`에 의존하기 전에 [NodePort](/ko/docs/concepts/services-networking/service/#nodeport) 서비스를 사용하는 것을 고려할 수 있다.

- `hostPort`와 같은 이유로, `hostNetwork`를 사용하는 것을 피한다.

- `kube-proxy` 로드 밸런싱이 필요하지 않을 때, 서비스 발견을 위해 [헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)(`ClusterIP`의 값을 `None`으로 가지는)를 사용한다.

## 레이블 사용하기

- `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`처럼 애플리케이션이나 디플로이먼트의 __속성에 대한 의미__ 를 식별하는 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)을 정의해 사용한다. 다른 리소스를 위해 적절한 파드를 선택하는 용도로 이러한 레이블을 이용할 수 있다. 예를 들어, 모든 `tier: frontend` 파드를 선택하거나, `app: myapp`의 모든 `phase: test` 컴포넌트를 선택하는 서비스를 생각해 볼 수 있다. 이 접근 방법의 예시는 [방명록](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/) 앱을 참고한다.

릴리스에 특정되는 레이블을 서비스의 셀렉터에서 생략함으로써 여러 개의 디플로이먼트에 걸치는 서비스를 생성할 수 있다. 동작 중인 서비스를 다운타임 없이 갱신하려면, [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)를 사용한다.

오브젝트의 의도한 상태는 디플로이먼트에 의해 기술되며, 만약 그 스펙에 대한 변화가 _적용될_ 경우, 디플로이먼트 컨트롤러는 일정한 비율로 실제 상태를 의도한 상태로 변화시킨다.

- 일반적인 활용 사례인 경우 [쿠버네티스 공통 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/)을 사용한다. 이 표준화된 레이블은 `kubectl` 및 [대시보드](/ko/docs/tasks/access-application-cluster/web-ui-dashboard)와 같은 도구들이 상호 운용이 가능한 방식으로 동작할 수 있도록 메타데이터를 향상시킨다.

- 디버깅을 위해 레이블을 조작할 수 있다. (레플리카셋과 같은) 쿠버네티스 컨트롤러와 서비스는 셀렉터 레이블을 사용해 파드를 선택하기 때문에, 관련된 레이블을 파드에서 삭제하는 것은 컨트롤러로부터 관리되거나 서비스로부터 트래픽을 전달받는 것을 중단시킨다. 만약 이미 존재하는 파드의 레이블을 삭제한다면, 파드의 컨트롤러는 그 자리를 대신할 새로운 파드를 생성한다. 이것은 이전에 "살아 있는" 파드를 "격리된" 환경에서 디버그할 수 있는 유용한 방법이다. 레이블을 상호적으로 추가하고 삭제하기 위해서, [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label)를 사용할 수 있다.

## 컨테이너 이미지

[imagePullPolicy](/ko/docs/concepts/containers/images/#이미지-업데이트)와 이미지의 태그는 [kubelet](/docs/reference/command-line-tools-reference/kubelet/)이 명시된 이미지를 풀(pull) 하려고 시도할 때 영향을 미친다.

- `imagePullPolicy: IfNotPresent`: 이미지가 로컬에 이미 존재하지 않으면 이미지가 풀(Pull) 된다.

- `imagePullPolicy: Always`: kubelet이 컨테이너를 시작할 때마다, kubelet은 컨테이너 이미지 레지스트리를 쿼리해서 이름을 이미지 다이제스트(digest)로 확인한다. kubelet에 정확한 다이제스트가 저장된 컨테이너 이미지가 로컬로 캐시된 경우, kubelet은 캐시된 이미지를 사용한다. 그렇지 않으면, kubelet은 확인한 다이제스트를 사용해서 이미지를 다운로드(pull)하고, 해당 이미지를 사용해서 컨테이너를 시작한다.

- `imagePullPolicy`가 생략되어 있고, 이미지 태그가 `:latest` 이거나 생략되어 있다면 `imagePullPolicy`는 자동으로 `Always`가 적용된다. 태그 값을 변경하더라도 이 값은 `IfNotPresent`로 업데이트 되지 _않는다_.

- `imagePullPolicy`가 생략되어 있고, 이미지 태그가 존재하지만 `:latest`가 아니라면 `imagePullPolicy`는 자동으로 `IfNotPresent`가 적용된다. 태그가 나중에 제거되거나 `:latest`로 변경되더라도 `Always`로 업데이트 되지 _않는다_.

- `imagePullPolicy: Never`: 이미지가 로컬에 존재한다고 가정한다. 이미지를 풀(Pull) 하기 위해 시도하지 않는다.

{{< note >}}
컨테이너가 항상 같은 버전의 이미지를 사용하도록 하기 위해, `<이미지 이름>:<태그>` 를 `<이미지 이름>@<다이제스트>` (예시 `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`)로 변경해서 이미지의 [다이제스트](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)를 명시할 수 있다. 다이제스트는 특정 버전의 이미지를 고유하게 식별하며, 다이제스트 값을 변경하지 않는 한 쿠버네티스에 의해 절대로 변경되지 않는다.
{{< /note >}}

{{< note >}}
운영 환경에서 컨테이너를 생성할 때 `:latest` 태그의 사용을 피하는 것이 좋은데, 이는 어떠한 버전의 이미지가 실행 중인지 추적하기가 어렵고, 적절히 롤백하기가 더 어려워지기 때문이다.
{{< /note >}}

{{< note >}}
레지스트리가 안정적으로 동작하는 상황에서는, `imagePullPolicy: Always`로 설정되어 있더라도 기반 이미지 관리 도구의 캐싱 정책을 통해 이미지 풀(pull) 작업의 효율성을 높일 수 있다. 예를 들어, 도커를 사용하는 경우 이미지가 이미 존재한다면 풀(Pull) 시도는 빠르게 진행되는데, 이는 모든 이미지 레이어가 캐시되어 있으며 이미지 다운로드가 필요하지 않기 때문이다.
{{< /note >}}

## kubectl 사용하기

- `kubectl apply -f <디렉터리>`를 사용한다. 이 명령어는 `<디렉터리>` 내부의 모든 `.yaml`, `.yml`, 그리고 `.json` 쿠버네티스 구성 파일을 찾아 `apply`에 전달한다.

- `get`과 `delete` 동작을 위해 특정 오브젝트의 이름 대신 레이블 셀렉터를 사용한다. [레이블 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/#레이블-셀렉터)와 [효율적으로 레이블 사용하기](/ko/docs/concepts/cluster-administration/manage-deployment/#효과적인-레이블-사용)를 참고할 수 있다.

- 단일 컨테이너로 구성된 디플로이먼트와 서비스를 빠르게 생성하기 위해 `kubectl create deployment` 와 `kubectl expose` 를 사용한다. [클러스터 내부의 애플리케이션에 접근하기 위한 서비스 사용](/ko/docs/tasks/access-application-cluster/service-access-application-cluster/)에서 예시를 확인할 수 있다.

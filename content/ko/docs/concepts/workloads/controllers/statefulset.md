---
# reviewers:
# - enisoc
# - erictune
# - foxish
# - janetkuo
# - kow3ns
# - smarterclayton
title: 스테이트풀셋
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  스테이트풀셋은 파드 그룹을 실행하고 각 파드에 대해 고정된 식별자를 유지한다. 이는
  영구적인 저장소 또는 안정적이고 고유한 네트워크 신원이 필요한 애플리케이션을 관리하는 데 유용하다.
weight: 30
hide_summary: true # 섹션 인덱스에서 별도로 나열된다
---

<!-- overview -->

스테이트풀셋(StatefulSet)은 스테이트풀 애플리케이션을 관리하는 데 사용하는 워크로드 API 오브젝트이다.

{{< glossary_definition term_id="statefulset" length="all" >}}

<!-- body -->

## 스테이트풀셋 사용

스테이트풀셋은 다음 중 하나 또는 그 이상을 요구하는 애플리케이션에
유용하다.

* 안정된, 고유한 네트워크 식별자.
* 안정된, 지속성을 갖는 스토리지.
* 순차적인, 정상 배포(graceful deployment)와 스케일링.
* 순차적인, 자동 롤링 업데이트.

여기서 안정적이라는 것은 파드가 (재)스케줄링되는 과정 전반에서 지속됨을 의미한다.
만약 애플리케이션이 안정적인 식별자 또는 순차적인 배포,
삭제 또는 스케일링이 필요하지 않으면, 스테이트리스 레플리카 집합을
제공하는 워크로드 오브젝트를 사용해서 애플리케이션을 배포해야 한다.
[디플로이먼트(Deployment)](/docs/concepts/workloads/controllers/deployment/) 또는
[레플리카셋(ReplicaSet)](/docs/concepts/workloads/controllers/replicaset/)과 같은 컨트롤러가 스테이트리스 요구에 더 적합할 수 있다.

## 제한사항

* 특정 파드의 스토리지는 요청된 _스토리지 클래스_ 를 기준으로
  [퍼시스턴트 볼륨 프로비저너](/docs/concepts/storage/dynamic-provisioning/)가 프로비저닝하거나,
  관리자가 미리 프로비저닝해야 한다.
* 스테이트풀셋을 삭제 또는 스케일 다운해도 스테이트풀셋과 연관된 볼륨이 삭제되지 *_않는다_*.
  이는 일반적으로 스테이트풀셋과 연관된 모든 리소스를 자동으로 제거하는 것보다 더 중요한
  데이터의 안전을 보장하기 위함이다.
* 스테이트풀셋은 현재 파드의 네트워크 신원을 책임지는 [헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-서비스)가
  필요하다.
  사용자는 이 서비스를 생성할 책임이 있다.
* 스테이트풀셋은 삭제 시 파드 종료를 보장하지 않는다. 파드가 순차적이고 정상적으로 종료되게 하려면,
  삭제 전에 스테이트풀셋의
  크기를 0으로 축소할 수 있다.
* [롤링 업데이트](#롤링-업데이트)와 기본
  [파드 관리 정책](#파드-관리-정책) (`OrderedReady`)를
  함께 사용 시 [복구를 위한 수동 개입](#강제-롤백)이
  필요한 파손 상태로 빠질 수 있다.

## 구성 요소

아래의 예시에서는 스테이트풀셋의 구성요소를 보여 준다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # .spec.template.metadata.labels 와 일치해야 한다
  serviceName: "nginx"
  replicas: 3 # 기본값은 1
  minReadySeconds: 10 # 기본값은 0
  template:
    metadata:
      labels:
        app: nginx # .spec.selector.matchLabels 와 일치해야 한다
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

{{< note >}}
이 예제에서는 편의를 위해 `ReadWriteOnce` 접근 모드를 사용한다. 운영 환경에서는
쿠버네티스 프로젝트에서 `ReadWriteOncePod` 액세스 모드를 사용할 것을 
권장한다.
{{< /note >}}

위의 예시에서:

* `nginx`라는 이름의 헤드리스 서비스는 네트워크 도메인을 제어하는 데 사용된다.
* `web`이라는 이름의 스테이트풀셋은 Spec(사양)을 가지며, 이는 nginx 컨테이너의 복제본 3개가 각각 고유한 파드에서 실행될 것을 지시한다.
* `volumeClaimTemplates`은 퍼시스턴트 볼륨 프로비저너에서 프로비전한
  [퍼시스턴트볼륨(PersistentVolume)](/docs/concepts/storage/persistent-volumes/)을 사용해서
  안정적인 스토리지를 제공한다.

스테이트풀셋 오브젝트의 이름은 유효한
[DNS 레이블](/docs/concepts/overview/working-with-objects/names/#dns-label-names)이어야 한다.

### 파드 셀렉터

스테이트풀셋의 `.spec.selector` 필드는
`.spec.template.metadata.labels` 레이블과 일치하도록 설정해야 한다. 해당되는 파드 셀렉터를 찾지 못하면
스테이트풀셋 생성 과정에서 검증 오류가 발생한다.

### 볼륨 클레임 템플릿

`.spec.volumeClaimTemplates` 필드를 설정하여
[퍼시스턴트볼륨클레임(PersistentVolumeClaim)](/docs/concepts/storage/persistent-volumes/)을 생성할 수 있다.
다음 두 조건 중 하나를 만족하면 스테이트풀셋에 안정적인 스토리지를 제공한다:

* 볼륨 클레임에 지정된 스토리지클래스(StorageClass)가
  [동적 프로비저닝](/docs/concepts/storage/dynamic-provisioning/)을 사용하도록 설정되어 있다.
* 클러스터에 올바른 스토리지클래스와
  충분한 저장 공간을 가진 퍼시스턴트볼륨(PersistentVolume)이 이미 존재하는 경우에 해당한다.

### 최소 준비 시간 초

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`.spec.minReadySeconds`는 새로 생성된 파드가 사용 가능하다고 간주되기 위해, 컨테이너가
문제 없이 실행되고 준비되는 최소 시간(초)을 나타내는 선택적인 필드이다.
[롤링 업데이트](#롤링-업데이트) 전략을 사용할 때 롤아웃 진행 상황을 확인하는 데 사용된다.
이 필드의 기본값은 0이다(이 경우, 파드가 Ready 상태가 되면 바로 사용 가능하다고 간주된다).
파드가 언제 사용 가능하다고 간주되는지에 대한 자세한 정보는 [컨테이너 프로브(probe)](/docs/concepts/workloads/pods/pod-lifecycle/#컨테이너-프로브-probe)를 참고한다.

## 파드 신원

스테이트풀셋 파드는 서수, 안정적인 네트워크 신원
그리고 안정적인 스토리지로 구성되는 고유한 신원을 가진다.
이 신원은 어느 노드에서 (재)스케줄링되는지와 관계없이 파드에 유지된다.

### 서수 인덱스

N개의 [레플리카](#레플리카)가 있는 스테이트풀셋의 경우, 스테이트풀셋에 있는
각 파드에는 스테이트풀셋 내에서 고유한 정수 서수가 할당된다.
기본적으로 파드는 0부터 N-1까지의 서수를 할당받는다. 또한, 스테이트풀셋 컨트롤러는
`apps.kubernetes.io/pod-index`과 같은 인덱스 값을 가진 파드 레이블을 추가한다.

### 시작 순서

{{< feature-state feature_gate_name="StatefulSetStartOrdinal" >}}

`.spec.ordinals`은 각 파드에 할당할 순서에 대한
정수값을 설정할 수 있게 해주는 선택적인 필드로, 기본값은 nil이다.
이 필드를 사용하기 위해서는 다음과 같은 옵션들을 설정할 수 있다.

* `.spec.ordinals.start`: 만약 `.spec.ordinals.start` 필드가 설정된 경우, 파드는
  `.spec.ordinals.start`부터
  `.spec.ordinals.start + .spec.replicas - 1`의 순서대로 할당된다.

### 안정적인 네트워크 신원

스테이트풀셋의 각 파드는 스테이트풀셋의 이름과 파드의 서수에서
호스트 이름을 얻는다. 호스트 이름을 구성하는 패턴은
`$(statefulset name)-$(ordinal)` 이다. 위의 예시에서 생성된 3개 파드의 이름은
`web-0,web-1,web-2` 이다.
스테이트풀셋은 스테이트풀셋에 있는 파드의 도메인을 제어하기 위해
[헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-서비스)를 사용할 수 있다.
이 서비스가 관리하는 도메인은 `$(service name).$(namespace).svc.cluster.local`의 형식을 가지며,
여기서 "cluster.local"은 클러스터 도메인이다.
각 파드는 생성되면 `$(podname).$(governing service domain)` 형식을 가지고
일치되는 DNS 서브도메인을 가지며, 여기서 거버닝 서비스(governing service)는
스테이트풀셋의 `serviceName` 필드에 의해 정의된다.

클러스터에서 DNS가 구성된 방식에 따라, 새로 실행된 파드의 DNS 이름을
즉시 찾지 못할 수 있다. 이 동작은 클러스터의 다른 클라이언트가
파드가 생성되기 전에 파드의 호스트 이름에 대한 쿼리를 이미 보낸 경우에 발생할 수 있다.
네거티브 캐싱(DNS에서 일반적)은 이전에 실패한 조회 결과가
파드가 실행된 후에도 적어도 몇 초 동안 기억되고 재사용됨을 의미한다.

파드를 생성한 후 즉시 파드를 검색해야 하는 경우, 몇 가지 옵션이 있다.

* DNS 조회에 의존하지 않고 쿠버네티스 API를 직접 쿼리한다(예를 들어 watch 사용).
* 쿠버네티스 DNS 공급자의 캐싱 시간(일반적으로 CoreDNS의 컨피그맵(ConfigMap)을
  편집하는 것을 의미하며, 현재 30초 동안 캐시함)을 줄인다.

[제한사항](#제한사항) 섹션에서 언급한 것처럼 사용자는
파드의 네트워크 신원을 책임지는
[헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-서비스)를 생성할 책임이 있다.

다음은 클러스터 도메인, 서비스 이름, 스테이트풀셋 이름을 선택하고,
그 선택이 스테이트풀셋 파드의 DNS 이름에 어떻게 영향을 주는지에 대한 예시이다.

클러스터 도메인 | 서비스 (ns/이름) | 스테이트풀셋 (ns/이름)  | 스테이트풀셋 도메인  | 파드 DNS | 파드 호스트 이름 |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
클러스터 도메인을 [별도로 구성하지 않는 한](/docs/concepts/services-networking/dns-pod-service/),
`cluster.local`로 설정된다.
{{< /note >}}

### 안정된 스토리지

스테이트풀셋에 정의된 볼륨 클레임 템플릿 항목마다, 각 파드는 하나의
퍼시스턴트볼륨클레임을 받는다. 위의 nginx 예시에서 각 파드는 `my-storage-class`라는 스토리지클래스와
1 GiB의 프로비전된 스토리지를 가지는 단일 퍼시스턴트볼륨을 받게 된다. 만약 스토리지클래스가
명시되지 않은 경우, 기본 스토리지클래스가 사용된다. 파드가 노드에서 (재)스케줄링되면
파드의 `volumeMounts`에 퍼시스턴트볼륨클레임과 연결된 퍼시스턴트볼륨이 마운트된다.
참고로, 파드의 퍼시스턴트볼륨클레임과 관련된 퍼시스턴트볼륨은
파드 또는 스테이트풀셋이 삭제되더라도 삭제되지 않는다.
이것은 반드시 수동으로 해야 한다.

### 파드 이름 레이블

스테이트풀셋 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}
가 파드를 생성할 때 파드 이름으로 `statefulset.kubernetes.io/pod-name`
레이블이 추가된다. 이 레이블로 스테이트풀셋의 특정 파드에 서비스를
연결할 수 있다.

### 파드 인덱스 레이블

{{< feature-state feature_gate_name="PodIndexLabel" >}}

스테이트풀셋 {{<glossary_tooltip text="컨트롤러" term_id="controller">}}가 파드를 만들 때,
새로운 파드는 `apps.kubernetes.io/pod-index`로 레이블링 된다. 이 레이블의 값은 파드의 
인덱스 순서이다. 이 레이블을 사용하면 특정 파드 인덱스로 트래픽을 라우팅하고, 파드 인덱스 레이블을 사용하여 
로그/메트릭을 필터링하는 등의 작업을 수행할 수 있다. 기능 게이트 `PodIndexLabel`은 이 기능을 위해
기본적으로 활성화되고 잠겨 있으며, 이를 비활성화하려면 사용자는 서버 에뮬레이션 버전 v1.31을 사용해야 한다.

## 배포 및 스케일링 보장

* N개의 레플리카가 있는 스테이트풀셋이 파드를 배포할 때 연속해서 {0..N-1}의 순서로 생성한다.
* 파드가 삭제될 때는 {N-1..0}의 순서인 역순으로 종료된다.
* 파드에 스케일링 작업을 적용하기 전에 모든 선행 파드가 Running 및 Ready 상태여야 한다. `.spec.minReadySeconds`가 설정된 경우, 선행 파드는 최소 `minReadySeconds` 동안 Ready 상태여서 사용 가능한 상태여야 한다.
* 파드가 종료되기 전에 모든 후속 파드가 완전히 종료되어야 한다.

스테이트풀셋은 `pod.Spec.TerminationGracePeriodSeconds`을 0으로 명시해서는 안 된다. 이 방법은
안전하지 않으며, 사용하지 않기를 강권한다. 자세한 설명은
[스테이트풀셋 파드 강제 삭제](/docs/tasks/run-application/force-delete-stateful-set-pod/)를 참고한다.

위의 nginx 예시가 생성될 때 web-0, web-1, web-2 순서로 3개 파드가
배포된다. web-1은 web-0이
[Running 및 Ready](/docs/concepts/workloads/pods/pod-lifecycle/) 상태가 되기 전에는 배포되지 않으며,
web-2도 web-1이 Running 및 Ready 상태가 되기 전에는 배포되지 않는다. 만약 web-1이 Running 및 Ready 상태가 된 이후,
web-2가 시작되기 전에 web-0이 실패하게 된다면, web-2는 web-0이 성공적으로 재시작되고,
Running 및 Ready 상태가 되기 전까지 시작되지 않는다.

만약 사용자가 배포된 예제의 스테이트풀셋을 `replicas=1`으로 패치해서
스케일한 경우 web-2가 먼저 종료된다. web-1은 web-2가 완전히 종료 및 삭제되기
전까지 종료되지 않는다. 만약 web-2가 완전히 종료되고, web-1이 종료되기 전에
web-0이 실패할 경우 web-1은 web-0이 Running 및 Ready 상태가
되기 전까지 종료되지 않는다.

### 파드 관리 정책

스테이트풀셋의 `.spec.podManagementPolicy` 필드를 통해
고유성 및 신원 보증을 유지하면서 순차 보증을 완화한다.

#### OrderedReady 파드 관리

`OrderedReady` 파드 관리는 스테이트풀셋의 기본이다.
이것은 [배포 및 스케일링 보장](#배포-및-스케일링-보장)에 설명되어 있는 동작을 구현한다.

#### Parallel 파드 관리

`Parallel` 파드 관리는 스테이트풀셋 컨트롤러에게 모든 파드를
병렬로 실행 또는 종료하게 하고, 다른 파드의 실행이나
종료에 앞서 파드가 Running 및 Ready 상태가 되거나 완전히 종료되기를
기다리지 않는다.

스케일링 작업에서는, 이것이 모든 파드가 동시에 생성되거나 종료되는 것을 의미한다.

[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](#최대-사용-불가능-파드-수)가 1보다 큰
롤링 업데이트에서는 스테이트풀셋 컨트롤러가 최대 `maxUnavailable`개의 파드를 동시에 종료하고 생성한다(이를 버스팅(bursting)이라고도 한다).
이 방식은 업데이트 속도를 높일 수 있지만 파드가 순서와 다르게 준비될 수 있으므로, 엄격한 순서가 필요한 애플리케이션에는 적합하지 않을 수 있다.

## 업데이트 전략

스테이트풀셋의 `.spec.updateStrategy` 필드는 스테이트풀셋의
파드에 대한 컨테이너, 레이블, 리소스의 요청/제한 그리고 어노테이션에 대한 자동화된 롤링 업데이트를
구성하거나 비활성화할 수 있다. 두 가지 가능한 전략이 있다.

`OnDelete`(삭제 시)
: 스테이트풀셋의 `.spec.updateStrategy.type`이 `OnDelete`로 설정되면,
스테이트풀셋 컨트롤러는 스테이트풀셋의 파드를 자동으로 업데이트하지 않는다. 
사용자는 컨트롤러가 스테이트풀셋의
`.spec.template`를 반영하는 수정된 새로운 파드를 생성하도록 수동으로 파드를 삭제해야 한다.

`RollingUpdate`(롤링 업데이트)
: `RollingUpdate` 업데이트 전략은 스테이트풀셋의 파드에 대한 자동화된 롤링 업데이트를
  구현한다. 기본 업데이트 전략이다.

## 롤링 업데이트

스테이트풀셋의 `.spec.updateStrategy.type`이 `RollingUpdate`로 설정되면,
스테이트풀셋 컨트롤러는 스테이트풀셋의 각 파드를 삭제하고 다시 생성한다. 이 과정은 파드 종료와 같은
순서(가장 큰 서수부터 가장 작은 서수까지)로 진행되며,
한 번에 하나의 파드만 업데이트한다.

쿠버네티스 컨트롤 플레인은 이전 파드를 업데이트하기 전에 업데이트된 파드가 Running 및 Ready 상태가 될 때까지 기다린다.
`.spec.minReadySeconds`([최소 준비 시간 초](#최소-준비-시간-초) 참조)를
설정한 경우, 
컨트롤 플레인은 파드가 Ready 상태로 전환된 후 해당 시간만큼 추가로 기다린 뒤 다음 단계로 진행한다.

### 파티션 롤링 업데이트

`RollingUpdate` 업데이트 전략은 `.spec.updateStrategy.rollingUpdate.partition`을
지정하여 파티션으로 나눌 수 있다. 만약 파티션을 지정하면 스테이트풀셋의 `.spec.template`가
업데이트될 때 서수가 파티션보다 크거나 같은 모든 파드가 업데이트된다.
파티션보다 작은 수를 가진 모든 파드는 업데이트되지 않으며,
삭제된 경우라도 이전 버전에서 재생성된다.
만약 스테이트풀셋의 `.spec.updateStrategy.rollingUpdate.partition`이
`.spec.replicas`보다 큰 경우 `.spec.template`의 업데이트는 해당 파드에 전달하지 않는다.
대부분의 케이스는 파티션을 사용할 필요가 없지만 업데이트를 준비하거나,
카나리의 롤 아웃 또는 단계적인 롤아웃을 행하려는 경우에는 유용하다.

### 최대 사용 불가능 파드 수

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

`.spec.updateStrategy.rollingUpdate.maxUnavailable` 필드를 명시하여, 
업데이트 과정에서 사용 불가능(unavailable) 파드를 최대 몇 개까지 허용할 것인지를 조절할 수 있다. 
값은 절대값(예: `5`) 또는 의도한 파드의 백분율(예: `10%`)로 지정할 수 있다.
절대값은 백분율 값으로 계산한 뒤 올림하여 얻는다.
이 필드는 0일 수 없다. 기본값은 1이다.

이 필드는 `0`에서 `replicas - 1` 사이 범위에 있는 모든 파드에 적용된다.
이 범위 내에 사용 불가능한 파드가 있으면,
`maxUnavailable`로 집계된다.

{{< note >}}
`maxUnavailable` 필드는 현재 베타 단계이며 기본적으로 비활성화되어 있다.
{{< /note >}}

### 강제 롤백

기본 [파드 관리 정책](#파드-관리-정책) (`OrderedReady`)과
함께 [롤링 업데이트](#롤링-업데이트)를 사용할 경우
직접 수동으로 복구를 해야하는 고장난 상태가 될 수 있다.

만약 파드 템플릿을 Running 및 Ready 상태가 되지 않는 구성으로 업데이트하는
경우(예시: 잘못된 바이너리 또는 애플리케이션 레벨 구성 오류로 인한)
스테이트풀셋은 롤아웃을 중지하고 기다린다.

이 상태에서는 파드 템플릿을 올바른 구성으로 되돌리는 것으로 충분하지 않다.
[알려진 이슈](https://github.com/kubernetes/kubernetes/issues/67250)로
인해 스테이트풀셋은 손상된 파드가 Ready 상태가 될 때까지 (이는 절대 일어나지 않는다) 기다린
후에야 작동하는 구성으로 되돌리기를
시도한다.

템플릿을 되돌린 이후에는 스테이트풀셋이 이미 잘못된 구성으로
실행하려고 시도한 모든 파드를 삭제해야 한다.
그러면 스테이트풀셋은 되돌린 템플릿을 사용해서 파드를 다시 생성하기 시작한다.

## 리비전 내역

컨트롤러리비전(ControllerRevision)은 스테이트풀셋 컨트롤러와 같은 컨트롤러에서 구성 변경 내역을 추적하는 데 사용되는 쿠버네티스 API 리소스이다.

스테이트풀셋은 컨트롤러리비전을 사용하여 리비전 내역을 유지하고 롤백 및 버전 추적을 지원한다.

### 스테이트풀셋이 컨트롤러리비전을 사용하여 변경 사항을 추적하는 방법

스테이트풀셋의 파드 템플릿(`spec.template`)을 업데이트하면 스테이트풀셋 컨트롤러는 다음을 수행한다.

1. 새 컨트롤러리비전 오브젝트를 준비한다.  
2. 파드 템플릿 및 메타 데이터의 스냅샷을 저장한다.
3. 증가하는 리비전 번호를 할당한다.

#### 주요 속성

키 속성 및 기타 세부 정보는 [컨트롤러리비전](/docs/reference/kubernetes-api/workload-resources/controller-revision-v1/)에서 확인할 수 있다.

---

### 리비전 내역 관리

`.spec.revisionHistoryLimit`을 사용하여 보관되는 리비전 수를 제어한다.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  revisionHistoryLimit: 5  # 최근 리비전 5개 유지
  # ... 다른 사양 필드 ...
```

- **기본값**: 지정하지 않으면 리비전 10개가 유지된다.
- **정리**: 제한을 초과하면 가장 오래된 리비전이 가비지 컬렉션된다.

#### 롤백 수행

다음 명령을 사용하여 이전 구성으로 되돌릴 수 있다.

```bash
# 수정 내역 보기
kubectl rollout history statefulset/webapp

# 특정 수정 내역으로 롤백 
kubectl rollout undo statefulset/webapp --to-revision=3
```

이렇게 하면 다음이 수행된다.

- 리비전 3의 파드 템플릿을 적용한다.
- 업데이트된 리비전 번호로 새 컨트롤러리비전을 생성한다.

#### 컨트롤러리비전 검사

관련된 컨트롤러리비전을 보려면, 

```bash
# 스테이트풀셋의 모든 리비전 나열
kubectl get controllerrevisions -l app.kubernetes.io/name=webapp

# 특정 리비전의 자세한 구성 보기
kubectl get controllerrevision/webapp-3 -o yaml
```

#### 모범 사례

##### 보존 정책

- 대부분의 워크로드에 대해 `revisionHistoryLimit`을 **5–10** 사이로 설정한다.
- **심층 롤백 기록** 이 필요한 경우에만 늘린다.

##### 모니터링

- 다음을 사용하여 정기적으로 개정 내용을 확인한다.

  ```bash
  kubectl get controllerrevisions
  ```

- **급격한 개정 횟수 증가** 알림

##### 피해야 할 사항

- 컨트롤러리비전 오브젝트를 수동으로 편집하지 않는다.  
- 리비전을 백업 메커니즘으로 사용하지 않는다(실제 백업 도구를 사용한다).
- `revisionHistoryLimit: 0` (롤백 기능을 비활성화한다).

## 퍼시스턴트볼륨클레임 보존

{{< feature-state feature_gate_name="StatefulSetAutoDeletePVC" >}}

선택적 필드인 `.spec.persistentVolumeClaimRetentionPolicy`는
스테이트풀셋의 생애 주기 동안 PVC를 삭제할 것인지,
삭제한다면 어떻게 삭제하는지를 관리한다. 
이 필드를 사용하려면 API 서버와 컨트롤러 매니저에 `StatefulSetAutoDeletePVC` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 한다. 
활성화 시, 각 스테이트풀셋에 대해 두 가지 정책을 설정할 수 있다.

`whenDeleted`
: 스테이트풀셋이 삭제될 때 적용할 볼륨 보존 동작을 설정한다.

`whenScaled`
: 스테이트풀셋의 레플리카 수가 줄어들 때(예: 스테이트풀셋을 스케일 다운할 때)
  적용할 볼륨 보존 동작을 설정한다.

설정 가능한 각 정책에 대해, 그 값을 `Delete` 또는 `Retain`으로 설정할 수 있다.

`Delete`
: 정책의 영향을 받는 각 파드에 대해 스테이트풀셋의 `volumeClaimTemplate`에서 생성된 PVC가
  삭제된다. `whenDeleted` 정책에서는 `volumeClaimTemplate`의 모든 PVC가
  해당 파드가 삭제된 후에 삭제된다. `whenScaled` 정책에서는 스케일 다운되는 파드 레플리카에
  해당하는 PVC만 해당 파드가 삭제된 후에
  삭제된다.

`Retain` (기본값)
: 파드가 삭제되어도 `volumeClaimTemplate`으로부터 생성된 PVC는 영향을 받지 않는다.
  이는 이 신기능이 도입되기 전의 기본 동작이다.

이러한 정책은 파드의 삭제가 스테이트풀셋 삭제 또는 스케일 다운으로 인한 경우에**만** 적용됨에 유의한다.
예를 들어, 스테이트풀셋과 연결된 파드가 노드 실패로 인해 실패했고,
컨트롤 플레인이 대체 파드를 생성했다면, 스테이트풀셋은 기존 PVC를 유지한다.
기존 볼륨은 영향을 받지 않으며,
새 파드가 실행될 노드에 클러스터가 볼륨을 연결한다.

정책의 기본값은 `Retain`이며, 이는 이 기능이 도입되기 전 스테이트풀셋의 기본 동작과 같다.

다음은 정책 예시이다.

```yaml
apiVersion: apps/v1
kind: StatefulSet
...
spec:
  persistentVolumeClaimRetentionPolicy:
    whenDeleted: Retain
    whenScaled: Delete
...
```

스테이트풀셋 {{<glossary_tooltip text="컨트롤러" term_id="controller">}}는
[소유자 참조](/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications)를
PVC에 추가하며, 파드가 종료되면 {{<glossary_tooltip text="가비지 컬렉터"
term_id="garbage-collection">}}가 해당 PVC를 삭제한다. 이로 인해
PVC가 삭제되기 전에(보존 정책에 따라 기반 PV와 볼륨이 삭제되기 전에도)
파드가 모든 볼륨을 정상적으로 마운트 해제할 수 있다.
`whenDeleted` 정책을 `Delete`로 설정하면,
해당 스테이트풀셋에 연결된 모든 PVC에 스테이트풀셋 인스턴스의 소유자 참조가 기록된다.

`whenScaled` 정책은 파드가 스케일 다운되었을 때에만 PVC를 삭제하며,
파드가 다른 원인으로 삭제되면 PVC를 삭제하지 않는다.
조정 상황 발생 시, 스테이트풀셋 컨트롤러는 의도한 레플리카 수와
클러스터에 실제로 존재하는 파드 수를 비교한다. ID가 레플리카 수보다 큰 스테이트풀셋 파드는
부적격 판정을 받으며 삭제 대상으로 표시된다. `whenScaled` 정책이 `Delete`이면, 부적격 파드는 삭제되기 전에,
연결된 스테이트풀셋 템플릿 PVC의 소유자로 지정된다.
이로 인해, 부적격 파드가 종료된 이후에만 PVC가 가비지 컬렉션된다.

이는 컨트롤러가 강제 종료되어 재시작되면, 각 파드의 소유자 참조가 정책에 맞게
업데이트되기 전에는 어떤 파드도 삭제되지 않음을 의미한다.
만약 컨트롤러가 다운된 동안 부적격 파드가 강제로 삭제되면,
컨트롤러가 중단된 시점에 따라 소유자 참조가 설정됐을 수도 있고 아닐 수도 있다.
소유자 참조가 업데이트되기까지 몇 번의 조정 절차가 필요할 수 있으며,
따라서 일부 부적격 파드는 소유자 참조 설정을 완료하고 나머지는 그러지 못했을 수 있다.
이런 이유로, 컨트롤러가 다시 실행되어 파드를 종료하기 전에 소유자 참조를 확인할 때까지
기다리는 것을 권장한다.
이것이 불가능하다면, 운영자는 PVC의 소유자 참조를 확인하여 파드가 강제 삭제되었을 때 예상한 오브젝트가 삭제되도록 해야 한다.

### 레플리카

`.spec.replicas`은 필요한 파드의 수를 지정하는 선택적 필드이다. 기본값은 1이다.

예를 들어 `kubectl scale statefulset statefulset --replicas=X` 명령으로
스테이트풀셋의 크기를 수동으로 조정한 뒤, 
매니페스트를 이용하여 스테이트풀셋을 업데이트하면(예: `kubectl apply -f statefulset.yaml` 실행), 
수동으로 설정했던 스테이트풀셋의 크기가 
오버라이드된다.

[HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)(또는 수평 스케일링을 위한 유사 API)가 
스테이트풀셋 크기를 관리하고 있다면, `.spec.replicas`를 설정해서는 안 된다.
대신, 쿠버네티스 
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이 
`.spec.replicas` 필드를 자동으로 관리한다.

## {{% heading "whatsnext" %}}

* [파드](/docs/concepts/workloads/pods)에 대해 배운다.
* 스테이트풀셋을 사용하는 방법을 알아본다.
  * [스테이트풀셋 애플리케이션 배포](/docs/tutorials/stateful-application/basic-stateful-set/) 예제를 따라한다.
  * [스테이트풀셋으로 카산드라 배포](/docs/tutorials/stateful-application/cassandra/) 예제를 따라한다.
  * [복제된 스테이트풀셋 애플리케이션 구동하기](/docs/tasks/run-application/run-replicated-stateful-application/) 예제를 따라한다.
  * [스테이트풀셋 확장하기](/docs/tasks/run-application/scale-stateful-set/)에 대해 배운다.
  * [스테이트풀셋을 삭제하면](/docs/tasks/run-application/delete-stateful-set/) 어떤 일이 수반되는지를 배운다.
  * [스토리지의 볼륨을 사용하는 파드 구성](/docs/tasks/configure-pod-container/configure-volume-storage/)을 하는 방법을 배운다.
  * [스토리지로 퍼시스턴트볼륨을 사용하도록 파드 설정](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)하는 방법을 배운다.
* `StatefulSet`은 쿠버네티스 REST API의 상위-수준 리소스이다.
  스테이트풀셋 API에 대해 이해하기 위해 
  {{< api-reference page="workload-resources/stateful-set-v1" >}} 오브젝트 정의를 읽는다.
* [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)과
  이를 사용해서 어떻게 중단 중에 애플리케이션 가용성을 관리할 수 있는지에 대해 읽는다.

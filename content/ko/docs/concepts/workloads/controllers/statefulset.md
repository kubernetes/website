---
title: 스테이트풀셋
content_type: concept
weight: 30
---

<!-- overview -->

스테이트풀셋은 애플리케이션의 스테이트풀을 관리하는데 사용하는 워크로드 API 오브젝트이다.

{{< glossary_definition term_id="statefulset" length="all" >}}


<!-- body -->

## 스테이트풀셋 사용

스테이트풀셋은 다음 중 하나 또는 이상이 필요한 애플리케이션에
유용하다.

* 안정된, 고유한 네트워크 식별자.
* 안정된, 지속성을 갖는 스토리지.
* 순차적인, 정상 배포(graceful deployment)와 스케일링.
* 순차적인, 자동 롤링 업데이트.

위의 안정은 파드의 (재)스케줄링 전반에 걸친 지속성과 같은 의미이다.
만약 애플리케이션이 안정적인 식별자 또는 순차적인 배포,
삭제 또는 스케일링이 필요하지 않으면, 스테이트리스 레플리카셋(ReplicaSet)을
제공하는 워크로드 오브젝트를 사용해서 애플리케이션을 배포해야 한다.
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/) 또는
[레플리카셋](/ko/docs/concepts/workloads/controllers/replicaset/)과 같은 컨트롤러가 스테이트리스 요구에 더 적합할 수 있다.

## 제한사항

* 파드에 지정된 스토리지는 관리자에 의해 [퍼시스턴트 볼륨 프로비저너](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/persistent-volume-provisioning/README.md)를 기반으로 하는 `storage class` 를 요청해서 프로비전하거나 사전에 프로비전이 되어야 한다.
* 스테이트풀셋을 삭제 또는 스케일 다운해도 스테이트풀셋과 연관된 볼륨이 *삭제되지 않는다*. 이는 일반적으로 스테이트풀셋과 연관된 모든 리소스를 자동으로 제거하는 것보다 더 중요한 데이터의 안전을 보장하기 위함이다.
* 스테이트풀셋은 현재 파드의 네트워크 신원을 책임지고 있는 [헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)가 필요하다. 사용자가 이 서비스를 생성할 책임이 있다.
* 스테이트풀셋은 스테이트풀셋의 삭제 시 파드의 종료에 대해 어떠한 보증을 제공하지 않는다. 스테이트풀셋에서는 파드가 순차적이고 정상적으로 종료(graceful termination)되도록 하려면, 삭제 전 스테이트풀셋의 스케일을 0으로 축소할 수 있다.
* [롤링 업데이트](#롤링-업데이트)와 기본
  [파드 매니지먼트 폴리시](#파드-매니지먼트-폴리시) (`OrderedReady`)를
  함께 사용시 [복구를 위한 수동 개입](#강제-롤백)이
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
      app: nginx # has to match .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # by default is 1
  template:
    metadata:
      labels:
        app: nginx # has to match .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: k8s.gcr.io/nginx-slim:0.8
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

위의 예시에서:

* 이름이 nginx라는 헤드리스 서비스는 네트워크 도메인을 컨트롤하는데 사용 한다.
* 이름이 web인 스테이트풀셋은 3개의 nginx 컨테이너의 레플리카가 고유의 파드에서 구동될 것이라 지시하는 Spec을 갖는다.
* volumeClaimTemplates은 퍼시스턴트 볼륨 프로비저너에서 프로비전한 [퍼시스턴트 볼륨](/ko/docs/concepts/storage/persistent-volumes/)을 사용해서 안정적인 스토리지를 제공한다.

스테이트풀셋 오브젝트의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

## 파드 셀렉터

스테이트풀셋의 `.spec.selector` 필드는 `.spec.template.metadata.labels` 레이블과 일치하도록 설정해야 한다. 쿠버네티스 1.8 이전에서는 생략시에 `.spec.selector` 필드가 기본 설정 되었다. 1.8 과 이후 버전에서는 파드 셀렉터를 명시하지 않으면 스테이트풀셋 생성시 유효성 검증 오류가 발생하는 결과가 나오게 된다.

## 파드 신원

스테이트풀셋 파드는 순서, 안정적인 네트워크 신원
그리고 안정적인 스토리지로 구성되는 고유한 신원을 가진다.
신원은 파드가 어떤 노드에 있고, (재)스케줄과도 상관없이 파드에 붙어있다.

### 순서 색인

N개의 레플리카가 있는 스테이트풀셋은 스테이트풀셋에 있는
각 파드에 0에서 N-1 까지의 정수가 순서대로 할당되며 해당 스테이트풀셋 내에서 고유 하다.

### 안정적인 네트워크 신원

스테이트풀셋의 각 파드는 스테이트풀셋의 이름과 파드의 순번에서
호스트 이름을 얻는다. 호스트 이름을 구성하는 패턴은
`$(statefulset name)-$(ordinal)` 이다. 위의 예시에서 생성된 3개 파드의 이름은
`web-0,web-1,web-2` 이다.
스테이트풀셋은 스테이트풀셋에 있는 파드의 도메인을 제어하기위해
[헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)를 사용할 수 있다.
이 서비스가 관리하는 도메인은 `$(service name).$(namespace).svc.cluster.local` 의 형식을 가지며,
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

- DNS 조회에 의존하지 않고 쿠버네티스 API를 직접(예를 들어 watch 사용) 쿼리한다.
- 쿠버네티스 DNS 공급자의 캐싱 시간(일반적으로 CoreDNS의 컨피그맵을 편집하는 것을 의미하며, 현재 30초 동안 캐시함)을 줄인다.


[제한사항](#제한사항) 섹션에서 언급한 것처럼 사용자는
파드의 네트워크 신원을 책임지는
[헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)를 생성할 책임이 있다.

여기 클러스터 도메인, 서비스 이름, 스테이트풀셋 이름을 선택을 하고,
그 선택이 스테이트풀셋 파드의 DNS이름에 어떻게 영향을 주는지에 대한 약간의 예시가 있다.

클러스터 도메인 | 서비스 (ns/이름) | 스테이트풀셋 (ns/이름)  | 스테이트풀셋 도메인  | 파드 DNS | 파드 호스트 이름 |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
클러스터 도메인이 달리 [구성된 경우](/ko/docs/concepts/services-networking/dns-pod-service/)가
아니라면 `cluster.local`로 설정된다.
{{< /note >}}

### 안정된 스토리지

쿠버네티스는 각 VolumeClaimTemplate마다 하나의 [퍼시스턴트 볼륨](/ko/docs/concepts/storage/persistent-volumes/)을
생성한다. 위의 nginx 예시에서 각 파드는 `my-storage-class` 라는 스토리지 클래스와
1 Gib의 프로비전된 스토리지를 가지는 단일 퍼시스턴트 볼륨을 받게 된다. 만약 스토리지 클래스가
명시되지 않은 경우, 기본 스토리지 클래스가 사용된다. 파드가 노드에서 스케줄 혹은 재스케줄이 되면
파드의 `volumeMounts` 는 퍼시스턴트 볼륨 클레임과 관련된 퍼시스턴트 볼륨이 마운트 된다.
참고로, 파드 퍼시스턴트 볼륨 클레임과 관련된 퍼시스턴트 볼륨은
파드 또는 스테이트풀셋이 삭제되더라도 삭제되지 않는다.
이것은 반드시 수동으로 해야 한다.

### 파드 이름 레이블

스테이트풀셋 {{< glossary_tooltip term_id="controller" >}}
가 파드를 생성할 때 파드 이름으로 `statefulset.kubernetes.io/pod-name`
레이블이 추가된다. 이 레이블로 스테이트풀셋의 특정 파드에 서비스를
연결할 수 있다.

## 디플로이먼트와 스케일링 보증

* N개의 레플리카가 있는 스테이트풀셋이 파드를 배포할 때 연속해서 {0..N-1}의 순서로 생성한다.
* 파드가 삭제될 때는 {N-1..0}의 순서인 역순으로 종료된다.
* 파드에 스케일링 작업을 적용하기 전에 모든 선행 파드가 Running 및 Ready 상태여야 한다.
* 파드가 종료되기 전에 모든 후속 파드가 완전히 종료 되어야 한다.

스테이트풀셋은 `pod.Spec.TerminationGracePeriodSeconds` 을 0으로 명시해서는 안된다. 이 방법은 안전하지 않으며, 사용하지 않기를 강권한다. 자세한 설명은 [스테이트풀셋 파드 강제 삭제](/docs/tasks/run-application/force-delete-stateful-set-pod/)를 참고한다.

위의 nginx 예시가 생성될 때 web-0, web-1, web-2 순서로 3개 파드가
배포된다. web-1은 web-0이
[Running 및 Ready](/ko/docs/concepts/workloads/pods/pod-lifecycle/) 상태가 되기 전에는 배포되지 않으며,
web-2 도 web-1이 Running 및 Ready 상태가 되기 전에는 배포되지 않는다. 만약 web-1이 Running 및 Ready 상태가 된 이후,
web-2가 시작되기 전에 web-0이 실패하게 된다면, web-2는 web-0이 성공적으로 재시작이되고,
Running 및 Ready 상태가 되기 전까지 시작되지 않는다.

만약 사용자가 배포된 예제의 스테이트풀셋을 `replicas=1` 으로 패치해서
스케일한 경우 web-2가 먼저 종료된다. web-1은 web-2가 완전히 종료 및 삭제되기
전까지 정지되지 않는다. 만약 web-2의 종료 및 완전히 중지되고, web-1이 종료되기 전에
web-0이 실패할 경우 web-1은 web-0이 Running 및 Ready 상태가
되기 전까지 종료되지 않는다.

### 파드 관리 정책
쿠버네티스 1.7 및 이후에는 스테이트풀셋의 `.spec.podManagementPolicy` 필드를
통해 고유성 및 신원 보증을 유지하면서 순차 보증을 완화한다.

#### OrderedReady 파드 관리

`OrderedReady` 파드 관리는 스테이트풀셋의 기본이다.
이것은 [위에서](#디플로이먼트와-스케일-보증) 설명한 행위를 구현한다.

#### 병렬 파드 관리

`병렬` 파드 관리는 스테이트풀셋 컨트롤러에게 모든 파드를
병렬로 실행 또는 종료하게 한다.  그리고 다른 파드의 실행이나
종료에 앞서 파드가 Running 및 Ready 상태가 되거나 완전히 종료되기를 기다리지 않는다.
이 옵션은 오직 스케일링 작업에 대한 동작에만 영향을 미친다. 업데이트는 영향을
받지 않는다.

## 업데이트 전략

쿠버네티스 1.7 및 이후에는 스테이트풀셋의 `.spec.updateStrategy` 필드는 스테이트풀셋의
파드에 대한 컨테이너, 레이블, 리소스의 요청/제한 그리고 주석에 대한 자동화된 롤링 업데이트를
구성하거나 비활성화 할 수 있다.

### 삭제 시(On Delete)

`OnDelete` 업데이트 전략은 레거시(1.6과 이전)의 행위를 구현한다. 이때 스테이트풀셋의
`.spec.updateStrategy.type` 은 `OnDelete` 를 설정하며, 스테이트풀셋 컨트롤러는
스테이트풀셋의 파드를 자동으로 업데이트하지 않는다. 사용자는 컨트롤러가 스테이트풀셋의
`.spec.template`를 반영하는 수정된 새로운 파드를 생성하도록 수동으로 파드를 삭제해야 한다.

### 롤링 업데이트

`롤링 업데이트` 의 업데이트 전략은 스테이트풀셋의 파드에 대한 롤링 업데이트를
구현한다. 롤링 업데이트는 `.spec.updateStrategy` 가 지정되지 않으면 기본 전략이 된다. 스테이트풀셋에 `롤링 업데이트` 가 `.spec.updateStrategy.type` 에 설정되면
스테이트풀셋 컨트롤러는 스테이트풀셋의 각 파드를 삭제 및 재생성을 한다. 이 과정에서 똑같이
순차적으로 파드가 종료되고(가장 큰 수에서 작은 수까지),
각 파드의 업데이트는 한 번에 하나씩 한다. 이전 버전을 업데이트하기 전까지 업데이트된 파드가 실행 및 준비될
때까지 기다린다.

#### 파티션(Partition)

`롤링 업데이트` 의 업데이트 전략은 `.spec.updateStrategy.rollingUpdate.partition`
를 명시해서 파티션 할 수 있다. 만약 파티션을 명시하면 스테이트풀셋의 `.spec.template` 가
업데이트 될 때 부여된 수가 파티션보다 크거나 같은 모든 파드가 업데이트 된다.
파티션보다 작은 수를 가진 모든 파드는 업데이트 되지 않으며,
삭제 된 경우라도 이전 버전에서 재생성된다.
만약 스테이트풀셋의 `.spec.updateStrategy.rollingUpdate.partition` 이
`.spec.replicas` 보다 큰 경우 `.spec.template` 의 업데이트는 해당 파드에 전달하지 않는다.
대부분의 케이스는 파티션을 사용할 필요가 없지만 업데이트를 준비하거나,
카나리의 롤 아웃 또는 단계적인 롤 아웃을 행하려는 경우에는 유용하다.

#### 강제 롤백

기본 [파드 관리 정책](#파드-관리-정책) (`OrderedReady`)과
함께 [롤링 업데이트](#롤링-업데이트)를 사용할 경우
직접 수동으로 복구를 해야하는 고장난 상태가 될 수 있다.

만약 파드 템플릿을 Running 및 Ready 상태가 되지 않는 구성으로 업데이트하는
경우(예시: 잘못된 바이너리 또는 애플리케이션-레벨 구성 오류로 인한)
스테이트풀셋은 롤아웃을 중지하고 기다린다.

이 상태에서는 파드 템플릿을 올바른 구성으로 되돌리는 것으로 충분하지 않다.
[알려진 이슈](https://github.com/kubernetes/kubernetes/issues/67250)로
인해 스테이트풀셋은 손상된 파드가 준비(절대 되지 않음)될 때까지 기다리며
작동하는 구성으로 되돌아가는 시도를 하기
전까지 기다린다.

템플릿을 되돌린 이후에는 스테이트풀셋이 이미 잘못된 구성으로
실행하려고 시도한 모든 파드를 삭제해야 한다.
그러면 스테이트풀셋은 되돌린 템플릿을 사용해서 파드를 다시 생성하기 시작 한다.


## {{% heading "whatsnext" %}}


* [스테이트풀 애플리케이션의 배포](/ko/docs/tutorials/stateful-application/basic-stateful-set/)의 예시를 따른다.
* [카산드라와 스테이트풀셋 배포](/ko/docs/tutorials/stateful-application/cassandra/)의 예시를 따른다.
* [레플리케이티드(replicated) 스테이트풀 애플리케이션 실행하기](/docs/tasks/run-application/run-replicated-stateful-application/)의 예시를 따른다.

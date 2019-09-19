---
title: 스테이트풀셋
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

스테이트풀셋은 애플리케이션의 스테이트풀을 관리하는데 사용하는 워크로드 API 오브젝트이다.

{{< glossary_definition term_id="statefulset" length="all" >}}
{{% /capture %}}

{{% capture body %}}

## 스테이트풀셋 사용

스테이트풀셋은 다음 중 하나 또는 이상이 필요한 애플리케이션에
유용하다.

* 안정된 고유한 네트워크 식별자.
* 안정된 퍼시스던트 스토리지.
* 순차적인 정상 디플로이먼트와 스케일링.
* 순차적인 자동 롤링 업데이트.

위의 안정은 파드의 스케쥴링 및 재 스케줄링 전반에 걸친 퍼시스던트와 아주 밀접하다.
만약 애플리케이션이 안정적인 식별자 또는 순차적인 디플로이먼트, 
삭제 또는 스케일링이 필요하지 않으면, 스테이트리스 레플리카 셋을 
제공하는 컨트롤러로 애플리케이션을 디플로이 해야 한다. 아마도 
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/) 또는 
[레플리카셋](/ko/docs/concepts/workloads/controllers/replicaset/)과 같은 컨트롤러는 스테이트리스가 필요한 경우에 더 적합할 수 있다.

## 제한사항

* 파드에 지정된 스토리지는 관리자에 의해 [퍼시스던트 볼륨 프로비저너](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/persistent-volume-provisioning/README.md)를 기반으로 하는 `storage class` 를 요청해서 프로비전하거나 사전에 프로비전이 되어야 한다.
* 스테이트풀셋을 삭제 또는 스케일링으로 다운하면 스테이트풀셋과 연관된 볼륨이 *삭제되지 않는다*. 이 것은 데이터의 안전을 보장하기위해 한다. 일반적으로 스테이트풀셋과 연관된 모든 리소스를 자동으로 제거하는 것보다 더 중요하다.
* 스테이트풀셋은 현재 파드의 네트워크 신원을 책임지고 있는 [헤드리스 서비스](/docs/concepts/services-networking/service/#headless-services)가 필요하다. 이 서비스를 생성할 책임이 있다.
* 스테이트풀셋은 스테이트풀셋의 삭제시 파드의 종료에 대해 어떠한 보증을 제공하지 않는다. 스테이트풀셋에서는 파드가 순차적이고, 안정적으로 종료를 마치기 위해 식제 전 스테이트풀셋의 스케일을 0으로 축소할 수 있다.
* [롤링 업데이트](#롤링-업데이트)와 기본 
  [파드 매니지먼트 폴리시](#파드-매니지먼트-폴리시) ( `OrderedReady` )를
  함께 사용시 [수동 복구 개입](#강제-롤백)이
  필요한 파손 상태로 빠질 수 있다.

## 구성 요소
아래의 예시에서는 스테이트풀셋의 구성요소를 보여 준다.

* 이름이 nginx라는 헤드리스 서비스는 네트워크 도메인을 컨트롤하는데 사용 한다.
* 이름이 web으로 된 스테이트풀셋은 Spec에 명시된 nginx 컨테이너가 실행되는 3개의 레플리카가 속한 고유한 파드를 가진다.
* volumeClaimTemplates은 퍼시스던트 볼륨 프로비저너에서 프로비전한 [퍼시스던트 볼륨](/docs/concepts/storage/persistent-volumes/)을 사용해서 안정적인 스토리지를 제공한다.

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

## 파드 셀렉터
스테이트풀셋의 `.spec.selector` 필드는 `.spec.template.metadata.labels` 레이블과 일치하도록 설정 해야 한다. 쿠버네티스 1.8 이전에서는 생략시에 `.spec.selector` 필드가 기본 설정 되었다. 1.8 과 이후 버전에서는 파드 셀렉터를 명시하지 않으면 스테이트풀셋 생성시 유효성 검증 오류가 발생하는 결과가 나오게 된다.

## 파드 신원
스테이트풀셋 파드는 안정적인 네트워크 신원과 안정적인 
스토리지의 순서로 구성되는 고유한 신원을 가진다. 신원은 노드의 
스케쥴 또는 재 스캐쥴에 상관없이 파드에 붙어 있다.

### 순서 색인

N개의 레플리카가 있는 스테이트풀셋은 스테이트풀셋에 있는
각 파드에 0에서 N-1 까지의 정수가 순서대로 할당되며 세트를 넘어 고유 하다.

### 안정적인 네트워크 신원

스테이트풀셋의 각 파드는 스테이트풀셋의 이름과 파드의 순번에서 
호스트 이름을 얻는다. 호스트 이름을 구성하는 패턴은 
`$(statefulset name)-$(ordinal)` 이다. 위의 예시에서 생성된 3개 파드의 이름은 
`web-0,web-1,web-2` 이다.
스테이트풀셋은 스테이트풀셋에 있는 파드의 도메인을 제어하기위해 
[헤드리스 서비스](/docs/concepts/services-networking/service/#headless-services)를 사용할 수 있다.
이 서비스가 관리하는 도메인은 `$(service name).$(namespace).svc.cluster.local` 의 형식을 가지며, 
여기서 "cluster.local"은 클러스터 도메인이다.
각 파드는 생성되면 `$(podname).$(governing service domain)` 형식을 가지고 
일치되는 DNS 서브도메인을 가지며, 여기서 governing service는 
스테이트풀셋의 `serviceName` 필드에 의해 정의된다.

[제한사항](#제한사항) 섹션에서 언급한 것처럼 
파드의 네트워크 신원을 책임지는 
[헤드리스 서비스](/docs/concepts/services-networking/service/#headless-services)를 생성할 책임이 있다.

여기 클러스터 도메인, 서비스 이름, 스테이트풀셋 이름을 선택을 하고, 
스테이트풀셋 파드의 DNS이름에 어떻게 영향을 주는지에 대한 약간의 예시가 있다.

클러스터 도메인 | 서비스 (ns/이름) | 스테이트풀셋 (ns/이름)  | 스테이트풀셋 도메인  | 파드 DNS | 파드 호스트 이름 |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
클러스터 도메인이 달리 [구성된 경우](/docs/concepts/services-networking/dns-pod-service/#how-it-works)가 
아니라면 `cluster.local`로 설정된다.
{{< /note >}}

### 안정된 스토리지

쿠버네티스는 각 VolumeClaimTemplate마다 하나의 [퍼시스던트 볼륨](/docs/concepts/storage/persistent-volumes/)을 
생성한다. 위의 nginx 예시에서 각 파드는 `my-storage-class` 라는 스토리지 클래스와 
1 Gib의 프로비전된 스토리지를 가지는 단일 퍼시스던트 볼륨을 받게된다. 만약 스토리지 클래스가 
명시되지 않은 경우 기본 스토리지 클래스를 사용된다. 파드가 노드에서 스케쥴 혹은 재 스케쥴이되면 
파드의 `volumeMounts` 는 퍼시스턴트 볼륨 클레임과 관련된 퍼시스던트 볼륨이 마운트 된다.
참고, 파드 퍼시스던트 볼륨 크레임과 관련된 퍼시스던트 볼륨은 
파드 또는 스테이트풀셋이 삭제되더라도 삭제되지 않는다.
이것은 반드시 수동으로 해야한다.

### 파드 이름 레이블

스테이트풀셋 컨트롤러가 파드를 생성할 때 파드 이름에 `statefulset.kubernetes.io/pod-name` 
레이블이 추가된다. 이 레이블로 스테이트풀셋의 특정 파드에 서비스를 
연결할 수 있다.

## 디플로이먼트와 스케일링 보증

* N개의 레플리카가 있는 스테이트풀셋이 파드를 디플로이할 때 연속해서 {0..N-1}의 순서로 생성한다.
* 파드를 삭제될 때는 {N-1..0}의 순서인 역순으로 종료한다.
* 파드에 스케일링 작업을 적용하기 전에 모든 선행 작업이 실행 중이고, 준비 되어야 한다.
* 파드가 종료되기 전에 모든 후속 작업이 완전히 종료 되어야 한다.

스테이트풀셋은 `pod.Spec.TerminationGracePeriodSeconds` 을 0으로 명시해서는 안된다. 이 방법은 안전하지 않으며, 사용하지 않는게 좋다. 자세한 설명은 [스테이트풀셋 파드 강제 삭제](/docs/tasks/run-application/force-delete-stateful-set-pod/)를 참고한다.

위의 nginx 예시가 생성될 때 web-0, web-1, web-2 순서로 3개 파드가 
디플로이된다. web-1은 web-0이 
[실행 및 준비](/ko/docs/concepts/workloads/pods/pod-lifecycle/)가 되기 전에는 디플로이 되지 않으며, 
web-2 도 web-1이 실행 및 준비가 되기 전에는 디플로이 되지 않는다. 만약 web-1이 실행 및 준비가 된 이후, 
web-2가 시작되기 전에 web-0이 실패하게 된다면, web-2는 web-0이 성공적으로 재시작이되고, 
실행 및 준비가 되기 전까지 시작되지 않는다.

만약 사용자가 스테이트풀셋을 `replicas=1` 으로 패치한 예시를 디플로이하고 
스케일한 경우 web-2가 먼저 종료된다. web-1은 web-2가 완전히 종료 및 삭제되기 
전까지 정지되지 않는다. 만약 web-2의 종료 및 완전히 중지되고, web-1이 종료되기 전에 
web-0이 실패할 경우 web-1은 web-0이 실행 및 준비가 
되기 전까지 종료되지 않는다.

### 파드 관리 정책
쿠버네티스 1.7 및 이후에는 스테이트풀셋의 `.spec.podManagementPolicy` 필드를 
통해 고유성 및 신원 보증을 유지하면서 순차 보증을 완화한다.

#### OrderedReady 파드 관리

`OrderedReady` 파드 관리는 스테이트풀셋의 기본이다. 
이것은 [위에서](#디플로이먼트와-스케일-보증) 설명한 동작을 실행한다.

#### 병렬 파드 관리

`병렬` 파드 관리는 스테이트풀셋 컨트롤러에게 포든 파드를 
병렬로 실행 또는 종료하게 한다.  그리고 다른 파드가 실행중이거나 
종료중인 것에 앞서 파드가 실행, 준비 또는 완전한 종료를 기다리지 않는다.
이 옵션은 오직 스케일링 작업에 대한 동작에만 영향을 미친다. 업데이트는 영향을 
받지 않는다.

## 업데이트 계획

쿠버네티스 1.7 및 이후에는 스테이트풀셋의 `.spec.updateStrategy` 필드는 스테이트풀셋의 
파드에 대한 컨테이너, 레이블, 리소스의 요청/제한 그리고 주석에 대한 자동화된 롤링 업데이트를 
구성하거나 비활성화 할 수 있다.

### 삭제 시(On Delete)

`OnDelete` 업데이트는 레거시(1.6과 이전) 동작의 계획을 실행한다.  이때 스테이트풀셋의 
`.spec.updateStrategy.type` 은 `OnDelete` 를 설정하며, 스테이트풀셋 컨트롤러는 
스테이트풀셋의 파드를 자동으로 업데이트하지 않는다. 사용자는 컨트롤러가 스테이트풀셋의 
`.spec.template`를 반영하는 수정된 새로운 파드를 생성하도록 수동으로 파드를 삭제해야 한다.

### 롤링 업데이트

`롤링 업데이트` 의 업데이트 계획은 스테이트풀셋의 파드에 대한 롤링 업데이트를 
실행한다. 롤링 업데이트는 `.spec.updateStrategy` 가 지정되지 않으면 기본 계획이 된다. 스테이트풀셋에 `롤링 업데이트` 가 `.spec.updateStrategy.type` 에 설정되면 
스테이트풀셋 컨트롤러는 스테이트풀셋의 각 파드를 삭제 및 재생성을 한다. 이 과정에서 똑같이 
순차적으로 파드가 종료되고(가장 큰 수에서 작은 수까지), 
각 파드의 업데이트는 한번에 하나씩 한다. 이전 버전을 업데이트하기 전까지 업데이트된 파드가 실행 및 준비될 
때까지 기다린다.

#### 분할(Partitions)

`롤링 업데이트` 의 업데이트 계획은 `.spec.updateStrategy.rollingUpdate.partition` 
를 명시해서 분할 할 수 있다. 만약 분할을 명시하면 스테이트풀셋의 `.spec.template` 가 
업데이트되면 부여된 수가 분할보다 크거나 같은 모든 파드가 업데이트 된다.
분할보다 작은 수를 가진 모든 파드는 업데이트 되지 않으며, 
삭제 된 경우라도 이전 버전에서 재생성된다.
만약 스테이트풀셋의 `.spec.updateStrategy.rollingUpdate.partition` 이 
`.spec.replicas` 보다 큰 경우 `.spec.template` 의 업데이트는 해당 파드에 전달하지 않는다.
대부분의 케이스는 분할을 사용할 필요가 없지만 업데이트를 준비하거나, 
카나리의 롤 아웃 또는 단계적인 롤 아웃을 행하려는 경우에는 유용하다.

#### 강제 롤백

기본 [파드 관리 정책](#파드-관리-정책) (`OrderedReady`)과 
함께 [롤링 업데이트](#롤링-업데이트)를 사용할 경우 
직접 수동으로 복구를 해야하는 고장난 상태가 될 수 있다.

만약 파드 템플릿을 실행 및 준비가 되지 않는 구성으로 업데이트하는 
경우(예시: 잘못된 바이너리 또는 애플리케이션-레벨 구성 오류로 인한) 
스테이트풀셋은 롤아웃을 중지하고 기다린다.

이 상태에서는 파드 템플릿을 올바른 구성으로 되돌리는 것으로 충분하지 않다.
[알려진 이슈](https://github.com/kubernetes/kubernetes/issues/67250)로 
인해 스테이트풀셋은 손상된 파드가 준비(절대 되지 않음)될 때까지 기다리며 
작동하는 구성으로 되돌아가는 시도를 하기 
전까지 기다린다.

템플릿을 되돌린 이후에는 스테이트풀셋이 이미 잘못된 구성으로 
실행하려고 시도한 모든 파드를 삭제해야 한다.
그러면 스테이트풀셋은 되돌린 템플릿을 사용해서 파드를 다시생성하기 시작한다.

{{% /capture %}}
{{% capture whatsnext %}}

* [스테이트풀 애플리케이션의 배포](/docs/tutorials/stateful-application/basic-stateful-set/)의 예시를 따른다.
* [카산드라와 스테이트풀셋 배포](/docs/tutorials/stateful-application/cassandra/)의 예시를 따른다.

{{% /capture %}}


---
title: 레플리카셋
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

레플리카셋의 목적은 레플리카 파드 셋이 주어진 시간동안 안정적인 실행 및 유지하는 것이다.
이처럼 레플리카셋은 보통 동일한 파드에 대한 설정된 갯수의 가용성을 보증하는데 사용한다.

{{% /capture %}}

{{% capture body %}}

## 레플리카셋의 작동 방식

레플리카셋은 파드를 식별하는 셀렉터와 적절한 수의 파드를 유지하기 위한 레플리카의 수, 
파드 템플릿에 명시된 새로운 파드를 위한 생성에 필요한 레플리카의 수가 필드로 명시된다. 
레플리카셋은 필드에 지정된 설정을 충족하기 위해 필요한 만큼 파드를 만들고 삭제한다.
레플리카셋이 새로운 파드를 생성해야하는 필요할때 필드로 명시되어 있는 파드 템플릿을 사용한다.

레플리카셋과 파드와의 링크는 파드의 [metadata.ownerReferences](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
필드 제공되며 현재 오브젝트가 소유하는 리소스를 지정한다.
레플리카셋이 가지고 있는 모든 파드에는 레플리카셋의 소유자 정보가 ownerReferences 필드에 있다.
이 링크를 통해 레플리카셋은 자신이 유지하는 파드의 상태를 확인하고 이에 따라 관리 한다.

레플리카셋은 셀렉터를 이용해서 필요한 새 파드를 식별한다. 만약 파드에 OwnerReference이 없거나 
OwnerReference를 컨트롤러가 아니고 레플리카셋의 셀렉터와 일치한다면 레플리카셋이 즉각 파드를 
가지려 할 것이다.

## 레플리카셋을 사용하는 시기

레플리카셋은 지정된 수의 파드 레플리카가 지정된 시간동안 실행되도록 보장한다.
그러나 디플로이먼트는 레플리카셋을 관리하고 다른 유용한 기능과 함께 
파드에 대한 선언적 업데이트를 제공하는 상위 개념이다.
따라서 우리는 사용자 지정 오케스트레이션이 필요하거나 업데이트가 전혀 필요하지 않은 경우라면 
레플리카셋을 직접적으로 사용하기 보다는 디플로이먼트를 사용하는 것을 권장한다.

이는 레플리카셋 오브젝트를 조작할 필요가 없다는 것을 의미한다.
대신 디플로이먼트를 이용하고 사양 부분에서 애플리케이션을 정의하라.

## 예시

{{< codenew file="controllers/frontend.yaml" >}}

이 매니페스트를 `frontend.yaml`에 저장하고 쿠버네티스 클러스터에 적용하면 정의되어있는 레플리카셋이 생성되고 레플리카셋이 괸리하는 파드가 생성된다.

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

현재 배포된 레플리카셋을 확인할 수 있다.
```shell
kubectl get rs
```

그리고 생성된 프런트엔드를 볼 수 있다.
```shell
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

또한 레플리카셋의 상태를 확인할 수 있다.
```shell
kubectl describe rs/frontend
```

다음과 유사한 것을 확인할 수 있다.
```shell
Name:		frontend
Namespace:	default
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook
		tier=frontend
Annotations:	<none>
Replicas:	3 current / 3 desired
Pods Status:	3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=guestbook
                tier=frontend
  Containers:
   php-redis:
    Image:      gcr.io/google_samples/gb-frontend:v3
    Port:       80/TCP
    Requests:
      cpu:      100m
      memory:   100Mi
    Environment:
      GET_HOSTS_FROM:   dns
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-qhloh
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-dnjpy
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-9si5l
```

마지막으로 파드가 올라왔는지 확인할 수 있다.
```shell
kubectl get Pods
```

다음과 유시한 파드 정보를 볼 수 있다.
```shell
NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
```

또한 프런트엔드 레플리카셋 파드의 소유자 관련 정보를 확인할 수 있다.
확인을 위해서는 실행중인 파드중 하나의 yaml을 확인한다.
```shell
kubectl get pods frontend-9si5l -o yaml
```

메타데이터의 ownerReferences 필드에 설정되어있는 프런트엔드 레플리카셋의 정보가 다음과 유사하게 나오는 것을 볼 수 있다.
```shell
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: 2019-01-31T17:20:41Z
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-9si5l
  namespace: default
  ownerReferences:
  - apiVersion: extensions/v1beta1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: 892a2330-257c-11e9-aecd-025000000001
...
```

## 템플릿을 사용하지 않는 파드의 인식

문제없이 기본 파드를 생성 할 수 있지만, 기본 파드가 레플리카셋의 셀렉터와 일치하는 레이블을 가지지 않도록 확인하는 것을 강력하게 권장한다.
이 이유는 레플리카셋이 템플릿에 명시된 파드에만 국한되지 않기 때문이며, 앞서 설명한 레플리카셋의 작동 방식으로 다른 파드를 인식할 수 있다.

이전 프런트엔드 레플리카셋 예제와 매니페스트에 명시된 파드를 가져와 참조한다.

{{< codenew file="pods/pod-rs.yaml" >}}

기본 파드는 소유자 관련 정보에 컨트롤러(또는 오브젝트)를 가지지 않기 때문에 프런트엔드 
레플리카셋의 셀렉터와 일치하면 즉시 셀렉터에 의해 인식된다.

프런트엔드 레플리카셋이 배포되고 필요한 만큼 레플리카 수를 충족하기위해 파드 레플리카를 생성한 다음에 기본 파드를 생성하는 것으로 가정한다.

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

새로은 파드는 레플리카셋에 의해 인식되며 레플리카셋이 필요한 수량을 초과하면 
즉시 종료된다.

파드를 가져온다.
```shell
kubectl get Pods
```

결과에는 새로운 파드가 이미 종료되었거나 종료가 진행중인 것을 보여준다.
```shell
NAME             READY   STATUS        RESTARTS   AGE
frontend-9si5l   1/1     Running       0          1m
frontend-dnjpy   1/1     Running       0          1m
frontend-qhloh   1/1     Running       0          1m
pod2             0/1     Terminating   0          4s
```

파드를 먼저 생성한다.
```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

그 다음 레플리카셋을 생성한다.
```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

레플리카셋이 기본 파드를 인식하는 것을 볼 수 있으며 새 파드의 수와 필요한 수와 일치할 때까지 사양에 따라 기본 파드만 생성한다.
파드를 가져온다.
```shell
kubectl get Pods
```

다음 출력에서 볼 수 있다.
```shell
NAME             READY   STATUS    RESTARTS   AGE
frontend-pxj4r   1/1     Running   0          5s
pod1             1/1     Running   0          13s
pod2             1/1     Running   0          13s
```

이러한 방식으로 레플리카셋은 템플릿을 사용하지 않는 파드를 소유하게 된다.

## 레플리카셋 매니페스트 작성하기

레플리카셋은 모든 쿠버네티스 API 오브젝트와 마찬가지로 `apiVersion`, `kind`, `metadata` 필드가 필요하다.
레플리카셋은 항상 레플리카셋이다.
쿠버네티스 1.9에서의 레플리카셋의 버전은 API 버전 `apps/v1`과 동일하고 기본적으로 활성화 되어있다. API 버전 `apps/v1beta2`은 더 이상 사용하지 않는다.
API버전에 대해서는 `frontend.yaml` 예제의 첫 번째 줄을 참고한다.

레플리카셋도 [`.spec` 섹션](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)이 필요하다.

### 파드 템플릿

`.spec.template`은 레이블을 붙이도록 되어있는 [파드 템플릿](/docs/concepts/workloads/Pods/pod-overview/#pod-templates)이다.
우리는 `frontend.yaml` 예제에서 `tier: frontend`이라는 레이블을 하나 가지고 있다.
이 파드를 다른 컨트롤러가 취하지 않도록 다른 컨트롤러의 셀렉터와 겹치지 않도록 주의해야 한다.

템플릿의 [재시작 정책](/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy) 필드인 
`.spec.template.spec.restartPolicy`는 기본값인 `Always`만 허용된다.

### 파드 셀렉터

`.spec.selector` 필드는 [레이블 셀렉터](/docs/concepts/overview/working-with-objects/labels/)이다.
[앞서](#레플리카-셋의-작동-방식) 논의한 것처럼 이 레이블은 파드를 식별하는데 사용된다.
우리 `frontend.yaml` 예제에서의 셀렉터는 다음과 같다.
```shell
matchLabels:
	tier: frontend
```

레플리카셋에서 `.spec.template.metadata.labels`는 `spec.selector`과 일치해야 하며 
그렇지 않으면 API에 의해 거부된다.

{{< note >}}
2개의 레플리카셋이 동일한 `.spec.selector`필드를 지정하지만 각 필드가 `.spec.template.metadata.labels`과 `.spec.template.spec`인경우 각 레플리카 셋은 다른 레플리카 셋이 생성한 파드를 무시한다.
{{< /note >}}

### 레플리카

`.spec.replicas`를 설정해서 동시에 실행할 파드의 수를 지정할 수 있다.
레플리카셋은 파드의 수가 일치하도록 생성 및 삭제한다.

만약 `.spec.replicas`를 지정하지 않으면 기본값은 1이다.

## 레플리카셋 작업

### 레플리카셋과 해당 파드 삭제

레플리카셋 및 모든 파드를 삭제하려면 [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)를 사용한다. [가비지 수집기](/docs/concepts/workloads/controllers/garbage-collection/)는 기본적으로 종속되어있는 모든 파드를 자동으로 삭제한다.

REST API또는 `client-go` 라이브러리를 이용할 때는 -d 옵션으로 `propagationPolicy`를 `Background`또는 `Foreground`로 
설정해야 한다.
예시:
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
> -H "Content-Type: application/json"
```

### 레플리카셋만 삭제하기

레플리카셋을 `--cascade=false` 옵션과 함께 [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)를 사용하면 연관 파드에 영향을 주지 않고 삭제할 수 있다.
REST API 또는 `client-go` 라이브러리를 이용할 때는 `propagationPolicy`에 `Orphan`을 설정해야 한다.
예시:
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
> -H "Content-Type: application/json"
```

원본이 삭제되면 새 레플리카셋을 생성해서 대체할 수 있다.
기존 `.spec.selector`와 신규 `.spec.selector`가 같으면 새 레플리카셋은 기존 파드를 선택한다.
하지만 새 레플리카셋은 기존 파드에 대해 새로운 파드 템플릿 또는 다른 파드 템플릿과 일치하도록 활동하지 않는다.
컨트롤 방식으로 파드를 새로운 사양으로 업데이트 하기 위해서는 [디플로이먼트](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)를 이용해야 한다. 
이는 레플리카셋이 롤링 업데이트를 직접적으로 지원하지 않기 떄문이다.


### 레플리카셋에서 파드 격리

레이블을 변경하면 레플리카셋에서 파드를 제거할 수 있다. 이 방식은 디버깅과 데이터 복구 등을 
위해 서비스에서 파드를 제거하는 데 사용할 수 있다. 이 방식으로 제거된 파드는 자동으로 교체된다(
레플리카의 수가 변경되지 않는다고 가정한다).

### 레플리카셋의 스케일링

레플리카셋을 손쉽게 스케일 업 또는 다운하는 방법은 단순히 `.spec.replicas` 필드를 업데이트 하면 된다.
레플리카셋 컨트롤러는 일치하는 레이블 셀렉터있는 파드에 대해 사용하거나 작동할 수 있도록 필요한 수의 파드를 보장한다.

### 레플리카셋을 Horizontal Pod Autoscaler 대상으로 설정

레플리카 셋은 
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/)의 대상이 될 수 있다.
즉, 레플리카셋은 HPA에 의해 오토스케일될 수 있다.
다음은 이전에 만든 예시에서 만든 레플리카셋을 대상으로 하는 HPA 예시이다.

{{< codenew file="controllers/hpa-rs.yaml" >}}

이 매니페스트를 `hpa-rs.yaml`로 저장한 다음 쿠버네티스 클러스터에 적용하면 
CPU사용량에 따라 파드가 복제되는 오토스케일 레플리카 셋 HPA가 생성된다.

```shell
kubectl apply -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

또는 `kubectl autoscale` 명령을 사용해서 동일한 작업을 할 수있다.
(그리고 더 쉽다!)

```shell
kubectl autoscale rs frontend --max=10
```

## 레플리카셋의 대안

### 디플로이먼트(권장)

[`디플로이먼트`](/docs/concepts/workloads/controllers/deployment/)는 레플리카셋을 소유하거나 업데이트를 하고, 
파드의 선언적인 업데이트와 서버측 롤링 업데이트를 할 수 있는 오브젝트이다.
레플리카셋은 단독으로 사용할 수 있지만, 오늘날에는 주로 디플로이먼트로 파드의 생성과 삭제 그리고 업데이트를 오케스트레이션하는 메커니즘으로 사용한다.
디플로이먼트를 이용해서 배포할 때 생성되는 레플리카셋을 관리하는 것에 대해 걱정하지 않아도 된다.
디플로이먼트는 레플리카셋을 소유하거나 관리한다.
따라서 레플리카셋을 원한다면 디플로이먼트를 사용하는 것을 권장한다.

### 기본 파드

사용자가 직접 파드를 생성하는 경우와는 다르게 레플리카셋은 노드 장애 또는 노드의 커널 업그레이드와 같은 관리하는 것과 같은 어떤 이유로든 종료되거나 삭제된 파드를 교체한다. 이런 이유로 애플리케이션이 단일 파드가 필요하더라도 레플리카셋을 이용하는 것을 권장한다. 레플리카셋을 프로세스 관리자와 유사하게 생각해본다면 단일 노드에서의 개별 프로세스가 아닌 다수의 노드에 걸쳐있는 다수의 파드를 관리한다. 레플리카셋은 로컬 컨테이너의 재시작을 노드에 있는 어떤 에이전트에게 위임한다(예를들어 Kubelet 또는 도커).

### 잡

종료될 것으로 예상되는 파드의 레플리카셋 대신 [`잡`](/docs/concepts/jobs/run-to-completion-finite-workloads/)을 이용한다
(즉, 배치 잡).

### 데몬셋

머신 모니터링 또는 머신 로깅과 같은 머신-레벨의 기능 파드의 레플리카셋 대신 
[`데몬셋`](/docs/concepts/workloads/controllers/daemonset/)을 사용한다.
머신-레벨의 기능 파드의 수명은 머신의 수명과 연관되어있고, 머신에서 다른 파드가 시작하기 전에 실행되어야 하며, 
머신을 재부팅/종료를 위해 준비가 되면 종료하는 것이 안전하다.

### 레플리케이션 컨트롤러

레플리카셋은 [_레플리케이션 컨트롤러_](/docs/concepts/workloads/controllers/replicationcontroller/)를 계승했습니다.
이 두개는 동일한 용도이며, 레플리케이션 컨트롤러가 [레이블 사용자 가이드](/docs/concepts/overview/working-with-objects/labels/#label-selectors)에 
설명된 설정-기반의 셀렉터의 요건을 지원하지 않는다는 점을 제외하면 유사하다.
따라서 레플리카셋은 레플리케이션 컨트롤러보다 선호한다.

{{% /capture %}}

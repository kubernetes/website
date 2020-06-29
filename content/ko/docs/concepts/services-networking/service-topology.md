---
title: 서비스 토폴로지
feature:
  title: 서비스 토폴로지
  description: >
    클러스터 토폴로지를 기반으로 서비스 트래픽 라우팅.

content_type: concept
weight: 10
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

_서비스 토폴로지_ 를 활성화 하면 서비스는 클러스터의 노드 토폴로지를
기반으로 트래픽을 라우팅한다. 예를 들어, 서비스는 트래픽을
클라이언트와 동일한 노드이거나 동일한 가용성 영역에 있는 엔드포인트로
우선적으로 라우팅되도록 지정할 수 있다.



<!-- body -->

## 소개

기본적으로 `ClusterIP` 또는 `NodePort` 서비스로 전송된 트래픽은 서비스의
모든 백엔드 주소로 라우팅 될 수 있다. 쿠버네티스 1.7부터는 "외부(external)"
트래픽을 수신한 노드에서 실행중인 파드로 라우팅할 수 있었지만,
`ClusterIP` 서비스에서는 지원되지 않으며 더 복잡한
토폴로지 &mdash; 영역별 라우팅과 같은 &mdash; 에서는 불가능 했다.
_서비스 토폴로지_ 기능은 서비스 생성자가 발신 노드와 수신 노드에 대해서
노드 레이블에 기반한 트래픽 라우팅 정책을 정의할 수 있도록
함으로써 이 문제를 해결한다.

소스와 목적지의 노드 레이블 일치를 사용하여 운영자는 운영자의 요구 사항에
적합한 메트릭에 대해서 서로 "근접(closer)" 하거나 "먼(farther)"
노드 그룹을 지정할 수 있다. 공용 클라우드의 많은 운영자들이 서비스 트래픽을
동일한 영역에서 유지하는 것을 선호하는 것을 필요성의 예제로 볼 수 있다. 그 이유는
지역간의 트래픽에는 관련 비용이 발생하지만 지역 내의 트래픽은 발생하지 않기 때문이다.
다른 일반적인 필요성으로는 DaemonSet이 관리하는 로컬 파드로
트래픽을 라우팅 하거나, 대기시간을 최소화하기 위해 동일한 랙 상단(top-of-rack) 스위치에
연결된 노드로 트래픽을 유지하는 것이 있다.


## 서비스 토폴로지 사용하기

만약 클러스터에서 서비스 토폴로지가 활성화된 경우, 서비스 사양에서
`topologyKeys` 필드를 지정해서 서비스 트래픽 라우팅을 제어할 수 있다. 이 필드는
이 서비스에 접근할 때 엔드포인트를 정렬하는데 사용되는 노드
레이블의 우선 순위 목록이다. 트래픽은 첫 번째 레이블 값이 해당 레이블의
발신 노드 값과 일치하는 노드로 보내진다. 만약 노드에 서비스와 일치하는
백엔드가 없는 경우, 두 번째 레이블을 그리고 더 이상의
레이블이 남지 않을 때까지 고려한다.

만약 일치하는 것을 못찾는 경우에는, 서비스에 대한 백엔드가 없었던 것처럼
트래픽이 거부될 것이다. 즉, 엔드포인트는 사용 가능한 백엔드가 있는 첫 번째
토폴로지 키를 기반으로 선택된다. 만약 이 필드가 지정되고 모든 항목에
클라이언트의 토폴로지와 일치하는 백엔드가 없는 경우, 서비스에는 해당 클라이언트에
대한 백엔드가 없기에 연결에 실패해야 한다. 특수한 값인 `"*"` 은 "모든 토폴로지"를
의미하는데 사용될 수 있다. 이 캐치 올(catch-all) 값을 사용하는 경우
목록의 마지막 값으로만 타당하다.

만약 `topologyKeys` 가 지정되지 않거나 비어있는 경우 토폴로지 제약 조건이 적용되지 않는다.

호스트 이름, 영역 이름 그리고 지역 이름으로 레이블이 지정된 노드가 있는
클러스터가 있다고 생각해 보자. 그러고 나면, 서비스의 `topologyKeys` 값을 설정해서 다음과 같이 트래픽을
전달할 수 있다.

* 동일한 노드의 엔드포인트에만 해당하고, 엔드포인트가 노드에 없으면 실패한다:
  `["kubernetes.io/hostname"]`.
* 동일한 노드의 엔드포인트를 선호하지만, 동일한 영역의 엔드포인트로 대체
  한 후 동일한 지역으로 대체되고, 그렇지 않으면 실패한다: `["kubernetes.io/hostname",
  "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`.
  예를 들어 데이터 위치가 중요한 경우에 유용할 수 있다.
* 동일한 영역이 선호되지만, 이 영역 내에 사용할 수 있는 항목이 없는 경우에는
  사용가능한 엔드포인트로 대체된다:
  `["topology.kubernetes.io/zone", "*"]`.



## 제약들

* 서비스 토폴로지는 `externalTrafficPolicy=Local` 와 호환되지 않으므로
  서비스는 이 두 가지 기능을 함께 사용할 수 없다. 동일한 서비스가 아닌
  같은 클러스터의 다른 서비스라면 이 기능을 함께 사용할
  수 있다.

* 유효한 토폴로지 키는 현재 `kubernetes.io/hostname`,
  `topology.kubernetes.io/zone` 그리고 `topology.kubernetes.io/region` 로
  제한되어있지만, 앞으로 다른 노드 레이블로 일반화 될 것이다.

* 토폴로지 키는 유효한 레이블 키이어야 하며 최대 16개의 키를 지정할 수 있다.

* 만약 캐치 올(catch-all) 값인 `"*"` 를 사용한다면 토폴로지 키들의 마지막 값이어야
  한다.


## 예시들

다음은 서비스 토폴로지 기능을 사용하는 일반적인 예시이다.

### 노드 로컬 엔드포인트만

노드 로컬 엔드포인트로만 라우팅하는 서비스이다. 만약 노드에 엔드포인트가 없으면 트레픽이 드롭된다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
```

### 노드 로컬 엔드포인트 선호

노드 로컬 엔드포인트를 선호하지만, 노드 로컬 엔드포인트가 없는 경우 클러스터 전체 엔드포인트로 폴백 하는 서비스이다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "*"
```


### 영역 또는 지리적 엔드포인트만

영역보다는 지리적 엔드포인트를 선호하는 서비스이다. 만약 엔드포인트가 없다면, 트래픽은 드롭된다.


```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
```

### 노드 로컬, 영역 및 지역 엔드포인트 선호

노드 로컬, 영역 및 지역 엔드포인트를 선호하지만, 클러스터 전체 엔드포인트로 폴백하는 서비스이다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
    - "*"
```




## {{% heading "whatsnext" %}}


* [서비스 토폴로지 활성화하기](/docs/tasks/administer-cluster/enabling-service-topology)를 읽어보기.
* [서비스와 애플리케이션 연결하기](/ko/docs/concepts/services-networking/connect-applications-service/)를 읽어보기.



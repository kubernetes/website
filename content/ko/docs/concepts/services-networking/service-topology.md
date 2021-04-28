---



title: 토폴로지 키를 사용하여 토폴로지-인지 트래픽 라우팅
content_type: concept
weight: 10
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

{{< note >}}

이 기능, 특히 알파 `topologyKeys` API는 쿠버네티스 v1.21부터
더 이상 사용되지 않는다.
쿠버네티스 v1.21에 도입된 [토폴로지 인지 힌트](/docs/concepts/services-networking/topology-aware-hints/)는
유사한 기능을 제공한다.

{{</ note >}}

_서비스 토폴로지_ 를 활성화 하면 서비스는 클러스터의 노드 토폴로지를
기반으로 트래픽을 라우팅한다. 예를 들어, 서비스는 트래픽을
클라이언트와 동일한 노드이거나 동일한 가용성 영역에 있는 엔드포인트로
우선적으로 라우팅되도록 지정할 수 있다.


<!-- body -->

## 소개

기본적으로 `ClusterIP` 또는 `NodePort` 서비스로 전송된 트래픽은 서비스의
모든 백엔드 주소로 라우팅될 수 있다. 쿠버네티스 1.7을 사용하면 트래픽을 수신한
동일한 노드에서 실행 중인 파드로 "외부(external)" 트래픽을 라우팅할 수
있다. `ClusterIP` 서비스의 경우, 라우팅에 대한 동일한 노드 기본 설정이
불가능했다. 또한 동일한 영역 내의 엔드 포인트에 대한 라우팅을 선호하도록
클러스터를 구성할 수도 없다.
서비스에 `topologyKeys` 를 설정하면, 출발 및 대상 노드에 대한
노드 레이블을 기반으로 트래픽을 라우팅하는 정책을 정의할 수 있다.

소스와 목적지 사이의 레이블 일치를 통해 클러스터 운영자는
서로 "근접(closer)"하거나 "먼(father)" 노드 그룹을 지정할 수 있다.
자신의 요구 사항에 맞는 메트릭을 나타내는 레이블을 정의할 수 있다.
예를 들어, 퍼블릭 클라우드에서는 지역 간의 트래픽에는 관련 비용이 발생(지역 내
트래픽은 일반적으로 그렇지 않다)하기 때문에, 네트워크 트래픽을 동일한 지역 내에 유지하는 것을
선호할 수 있다. 다른 일반적인 필요성으로는 데몬셋(DaemonSet)이 관리하는
로컬 파드로 트래픽을 라우팅하거나, 대기 시간을 최소화하기 위해
동일한 랙 상단(top-of-rack) 스위치에 연결된 노드로 트래픽을
유지하는 것이 있다.


## 서비스 토폴로지 사용하기

만약 클러스터에서 `ServiceTopology` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화된 경우, 서비스 사양에서
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

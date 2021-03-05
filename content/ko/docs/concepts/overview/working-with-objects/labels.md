---


title: 레이블과 셀렉터
content_type: concept
weight: 40
---

<!-- overview -->

_레이블_ 은 파드와 같은 오브젝트에 첨부된 키와 값의 쌍이다.
레이블은 오브젝트의 특성을 식별하는 데 사용되어 사용자에게 중요하지만, 코어 시스템에 직접적인 의미는 없다.
레이블로 오브젝트의 하위 집합을 선택하고, 구성하는데 사용할 수 있다. 레이블은 오브젝트를 생성할 때에 붙이거나 생성 이후에 붙이거나 언제든지 수정이 가능하다.
오브젝트마다 키와 값으로 레이블을 정의할 수 있다. 오브젝트의 키는 고유한 값이어야 한다.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

레이블은 UI와 CLI에서 효율적인 쿼리를 사용하고 검색에 사용하기에
적합하다. 식별되지 않는 정보는
[어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/)으로 기록해야 한다.

<!-- body -->

## 사용 동기

레이블을 이용하면 사용자가 느슨하게 결합한 방식으로 조직 구조와 시스템 오브젝트를 매핑할 수 있으며, 클라이언트에 매핑 정보를 저장할 필요가 없다.

서비스 배포와 배치 프로세싱 파이프라인은 흔히 다차원의 엔티티들이다(예: 다중 파티션 또는 배포, 다중 릴리즈 트랙, 다중 계층, 계층 속 여러 마이크로 서비스들). 관리에는 크로스-커팅 작업이 필요한 경우가 많은데 이 작업은 사용자보다는 인프라에 의해 결정된 엄격한 계층 표현인 캡슐화를 깨트린다.

레이블 예시:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

이 예시는 일반적으로 사용하는 레이블이며, 사용자는 자신만의 규칙(convention)에 따라 자유롭게 개발할 수 있다. 오브젝트에 붙여진 레이블 키는 고유해야 한다는 것을 기억해야 한다.

## 구문과 캐릭터 셋

_레이블_ 은 키와 값의 쌍이다. 유효한 레이블 키에는 슬래시(`/`)로 구분되는 선택한 접두사와 이름이라는 2개의 세그먼트가 있다. 이름 세그먼트는 63자 미만으로 시작과 끝은 알파벳과 숫자(`[a-z0-9A-Z]`)이며, 대시(`-`), 밑줄(`_`), 점(`.`)과 함께 사용할 수 있다. 접두사는 선택이다. 만약 접두사를 지정한 경우 접두사는 DNS의 하위 도메인으로 해야 하며, 점(`.`)과 전체 253자 이하, 슬래시(`/`)로 구분되는 DNS 레이블이다.

접두사를 생략하면 키 레이블은 개인용으로 간주한다. 최종 사용자의 오브젝트에 자동화된 시스템 컴포넌트(예: `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl` 또는 다른 타사의 자동화 구성 요소)의 접두사를 지정해야 한다.

`kubernetes.io/`와 `k8s.io/` 접두사는 쿠버네티스의 핵심 컴포넌트로 예약되어있다.

유효한 레이블 값은 63자 미만 또는 공백이며 시작과 끝은 알파벳과 숫자(`[a-z0-9A-Z]`)이며, 대시(`-`), 밑줄(`_`), 점(`.`)과 함께 사용할 수 있다.

다음의 예시는 파드에 `environment: production` 과 `app: nginx` 2개의 레이블이 있는 구성 파일이다.

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80

```

## 레이블 셀렉터

[이름과 UID](/ko/docs/concepts/overview/working-with-objects/names/)와 다르게 레이블은 고유하지 않다. 일반적으로 우리는 많은 오브젝트에 같은 레이블을 가질 것으로 예상한다.

레이블 셀렉터를 통해 클라이언트와 사용자는 오브젝트를 식별할 수 있다. 레이블 셀렉터는 쿠버네티스 코어 그룹의 기본이다.

API는 현재 _일치성 기준_ 과 _집합성 기준_ 이라는 두 종류의 셀렉터를 지원한다.
레이블 셀렉터는 쉼표로 구분된 다양한 _요구사항_ 에 따라 만들 수 있다. 다양한 요구사항이 있는 경우 쉼표 기호가 AND(`&&`) 연산자로 구분되는 역할을 하도록 해야 한다.

비어있거나 지정되지 않은 셀렉터는 상황에 따라 달라진다.
셀렉터를 사용하는 API 유형은 유효성과 의미를
문서화해야 한다.

{{< note >}}
레플리카셋(ReplicaSet)과 같은 일부 API 유형에서 두 인스턴스의 레이블 셀렉터는 네임스페이스 내에서 겹치지 않아야 한다. 그렇지 않으면 컨트롤러는 상충하는 명령으로 보고, 얼마나 많은 복제본이 필요한지 알 수 없다.
{{< /note >}}

{{< caution >}}
일치성 기준과 집합성 기준 조건 모두에 대해 논리적인 _OR_ (`||`) 연산자가 없다. 필터 구문이 적절히 구성되어있는지 확인해야 한다.
{{< /caution >}}

### _일치성 기준_ 요건

_일치성 기준_ 또는 _불일치 기준_ 의 요구사항으로 레이블의 키와 값의 필터링을 허용한다. 일치하는 오브젝트는 추가 레이블을 가질 수 있지만, 레이블의 명시된 제약 조건을 모두 만족해야 한다.
`=`,`==`,`!=` 이 세 가지 연산자만 허용한다. 처음 두 개의 연산자의 _일치성_(그리고 동의어), 나머지는 _불일치_ 를 의미한다. 예를 들면,

```
environment = production
tier != frontend
```

전자는 `environment`를 키로 가지는 것과 `production`을 값으로 가지는 모든 리소스를 선택한다.
후자는 `tier`를 키로 가지고, 값을 `frontend`를 가지는 리소스를 제외한 모든 리소스를 선택하고, `tier`를 키로 가지며, 값을 공백으로 가지는 모든 리소스를 선택한다.
`environment=production,tier!=frontend` 처럼 쉼표를 통해 한 문장으로 `frontend`를 제외한 `production`을 필터링할 수 있다.

일치성 기준 레이블 요건에 대한 하나의 이용 시나리오는 파드가 노드를 선택하는 기준을 지정하는 것이다.
예를 들어, 아래 샘플 파드는 "`accelerator=nvidia-tesla-p100`"
레이블을 가진 노드를 선택한다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### _집합성 기준_ 요건

_집합성 기준_ 레이블 요건에 따라 값 집합을 키로 필터링할 수 있다. `in`,`notin`과 `exists`(키 식별자만 해당)의 3개의 연산자를 지원한다. 예를 들면,

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

* 첫 번째 예시에서 키가 `environment`이고 값이 `production` 또는 `qa`인 모든 리소스를 선택한다.
* 두 번째 예시에서 키가 `tier`이고 값이 `frontend`와 `backend`를 가지는 리소스를 제외한 모든 리소스와 키로 `tier`를 가지고 값을 공백으로 가지는 모든 리소스를 선택한다.
* 세 번째 예시에서 레이블의 값에 상관없이 키가 `partition`을 포함하는 모든 리소스를 선택한다.
* 네 번째 예시에서 레이블의 값에 상관없이 키가 `partition`을 포함하지 않는 모든 리소스를 선택한다.

마찬가지로 쉼표는 _AND_ 연산자로 작동한다. 따라서 `partition,environment notin (qa)`와 같이 사용하면 값과 상관없이 키가 `partition`인 것과 키가 `environment`이고 값이 `qa`와 다른 리소스를 필터링할 수 있다.
_집합성 기준_ 레이블 셀렉터는 일반적으로 `environment=production`과 `environment in (production)`을 같은 것으로 본다. 유사하게는 `!=`과 `notin`을 같은 것으로 본다.

_집합성 기준_ 요건은 _일치성 기준_ 요건과 조합해서 사용할 수 있다. 예를 들어 `partition in (customerA, customerB),environment!=qa`


## API

### LIST와 WATCH 필터링

LIST와 WATCH 작업은 쿼리 파라미터를 사용해서 반환되는 오브젝트 집합을 필터링하기 위해 레이블 셀렉터를 지정할 수 있다. 다음의 두 가지 요건 모두 허용된다(URL 쿼리 문자열을 그대로 표기함).

  * _일치성 기준_ 요건: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * _집합성 기준_ 요건: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

두 가지 레이블 셀렉터 스타일은 모두 REST 클라이언트를 통해 선택된 리소스를 확인하거나 목록을 볼 수 있다. 예를 들어, `kubectl`로 `apiserver`를 대상으로 _일치성 기준_ 으로 하는 셀렉터를 다음과 같이 이용할 수 있다.

```shell
kubectl get pods -l environment=production,tier=frontend
```

또는 _집합성 기준_ 요건을 사용하면

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

앞서 안내한 것처럼 _집합성 기준_ 요건은 더 보여준다. 예시에서 다음과 같이 OR 연산자를 구현할 수 있다.

```shell
kubectl get pods -l 'environment in (production, qa)'
```

또는 _exists_ 연산자에 불일치한 것으로 제한할 수 있다.

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### API 오브젝트에서 참조 설정

[`services`](/ko/docs/concepts/services-networking/service/) 와
[`replicationcontrollers`](/ko/docs/concepts/workloads/controllers/replicationcontroller/)와 같은
일부 쿠버네티스 오브젝트는 레이블 셀렉터를 사용해서
[파드](/ko/docs/concepts/workloads/pods/)와 같은 다른 리소스 집합을 선택한다.

#### 서비스와 레플리케이션 컨트롤러

`services`에서 지정하는 파드 집합은 레이블 셀렉터로 정의한다. 마찬가지로 `replicationcontrollers`가 관리하는 파드의 오브젝트 그룹도 레이블 셀렉터로 정의한다.

서비스와 레플리케이션 컨트롤러의 레이블 셀렉터는 `json` 또는 `yaml` 파일에 매핑된 _일치성 기준_ 요구사항의 셀렉터만 지원한다.

```json
"selector": {
    "component" : "redis",
}
```
or

```yaml
selector:
    component: redis
```

`json` 또는 `yaml` 서식에서 셀렉터는 `component=redis` 또는 `component in (redis)` 모두 같은 것이다.

#### 세트-기반 요건을 지원하는 리소스

[`Job`](/ko/docs/concepts/workloads/controllers/job/),
[`Deployment`](/ko/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/ko/docs/concepts/workloads/controllers/replicaset/) 그리고
[`DaemonSet`](/ko/docs/concepts/workloads/controllers/daemonset/) 같은
새로운 리소스들은 _집합성 기준_ 의 요건도 지원한다.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels`는 `{key,value}`의 쌍과 매칭된다. `matchLabels`에 매칭된 단일 `{key,value}`는 `matchExpressions`의 요소와 같으며 `key` 필드는 "key"로, `operator`는 "In" 그리고 `values`에는 "value"만 나열되어 있다. `matchExpressions`는 파드 셀렉터의 요건 목록이다. 유효한 연산자에는 In, NotIn, Exists 및 DoNotExist가 포함된다. In 및 NotIn은 설정된 값이 있어야 한다. `matchLabels`와 `matchExpressions` 모두 AND로 되어있어 일치하기 위해서는 모든 요건을 만족해야 한다.

#### 노드 셋 선택

레이블을 통해 선택하는 사용 사례 중 하나는 파드를 스케줄 할 수 있는 노드 셋을 제한하는 것이다.
자세한 내용은 [노드 선택](/ko/docs/concepts/scheduling-eviction/assign-pod-node/) 문서를 참조한다.

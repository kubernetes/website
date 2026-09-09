---
# reviewers:
# - erictune
# - deads2k
# - liggitt
title: RBAC 인가 사용하기
content_type: concept
aliases: [/ko/rbac/]
weight: 33
---

<!-- overview -->
역할 기반 접근 제어(Role-Based Access Control, RBAC)는 조직 내 개별 사용자의 역할을 기준으로
컴퓨터 또는 네트워크 리소스에 대한 접근을 제어하는 방법이다.


<!-- body -->
RBAC 인가는 `rbac.authorization.k8s.io`
{{< glossary_tooltip text="API 그룹" term_id="api-group" >}}을 사용하여 인가 여부를
결정하며, 쿠버네티스 API를 통해 정책을 동적으로 구성할 수 있다.

RBAC을 활성화하려면, `--authorization-config` 플래그에 `RBAC` 인가자가 포함된 파일을 지정하여
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}를 시작한다. 예를 들면 다음과 같다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: RBAC
  ...
```

또는 `--authorization-mode` 플래그에 `RBAC`을 포함하는 쉼표로 구분된 목록을 지정하여
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}를 시작한다.
예를 들면 다음과 같다.
```shell
kube-apiserver --authorization-mode=...,RBAC --other-options --more-options
```

## API 오브젝트 {#api-overview}

RBAC API는 네 가지 종류의 쿠버네티스 오브젝트인 _롤(Role)_, _클러스터롤(ClusterRole)_,
_롤바인딩(RoleBinding)_, _클러스터롤바인딩(ClusterRoleBinding)_ 을 정의한다. 다른 쿠버네티스
오브젝트와 마찬가지로 `kubectl`과 같은 도구를 사용하여 RBAC
{{< glossary_tooltip text="오브젝트" term_id="object" >}}를 조회하거나 수정할 수 있다.

{{< caution >}}
이 오브젝트들은 설계상 접근 제한을 적용한다. 학습하면서
클러스터를 변경하는 경우,
[권한 상승 방지 및 부트스트래핑](#privilege-escalation-prevention-and-bootstrapping)을 참고하여
이러한 제한으로 인해 일부 변경이 차단될 수 있는 이유를 알아본다.
{{< /caution >}}

### 롤과 클러스터롤 {#role-and-clusterrole}

RBAC _롤_ 또는 _클러스터롤_ 에는 권한 집합을 나타내는 규칙이 포함된다.
권한은 추가하는 방식으로만 부여된다("거부" 규칙은 없다).

롤은 항상 특정 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}} 내의 권한을 설정한다.
롤을 생성할 때는 해당 롤이 속할 네임스페이스를 지정해야 한다.

반면 클러스터롤은 네임스페이스에 속하지 않는 리소스이다. 쿠버네티스 오브젝트는 네임스페이스에 속하거나
속하지 않는 것 중 하나여야 하며, 두 가지 모두에 해당할 수 없으므로
이 리소스들은 서로 다른 이름(롤과 클러스터롤)을 사용한다.

클러스터롤은 여러 용도로 사용할 수 있다. 클러스터롤을 사용하여 다음을 수행할 수 있다.

1. 네임스페이스에 속하는 리소스의 권한을 정의하고 개별 네임스페이스 내에서 접근 권한을 부여받는다.
1. 네임스페이스에 속하는 리소스의 권한을 정의하고 모든 네임스페이스에 걸쳐 접근 권한을 부여받는다.
1. 클러스터 범위의 리소스에 대한 권한을 정의한다.

네임스페이스 내에서 역할을 정의하려면 롤을 사용하고, 클러스터 전체에 걸쳐
역할을 정의하려면 클러스터롤을 사용한다.

#### 롤 예시 {#role-example}

다음은 "default" 네임스페이스에서 {{< glossary_tooltip text="파드" term_id="pod" >}}에 대한
읽기 접근 권한을 부여하는 데 사용할 수 있는 롤의 예시이다.

{{% code_sample file="access/simple-role.yaml" %}}

#### 클러스터롤 예시 {#clusterrole-example}

클러스터롤을 사용하면 롤과 동일한 권한을 부여할 수 있다.
클러스터롤은 클러스터 범위에 적용되므로 다음에 대한 접근 권한도 부여할 수 있다.

* 클러스터 범위의 리소스({{< glossary_tooltip text="노드" term_id="node" >}} 등)
* 리소스가 아닌 엔드포인트(`/healthz` 등)
* 모든 네임스페이스에 걸쳐 네임스페이스에 속하는 리소스(파드 등)

  예를 들어 클러스터롤을 사용하여 특정 사용자가 다음 명령을 실행하도록 허용할 수 있다.
  `kubectl get pods --all-namespaces`

다음은 특정 네임스페이스 또는 모든 네임스페이스의
{{< glossary_tooltip text="시크릿(Secret)" term_id="secret" >}}에 대한 읽기 접근 권한을 부여하는 클러스터롤의 예시이다.
적용 범위는 [바인딩 방식](#rolebinding-and-clusterrolebinding)에 따라 달라진다.

{{% code_sample file="access/simple-clusterrole.yaml" %}}

롤 또는 클러스터롤 오브젝트의 이름은 유효한
[경로 세그먼트 이름](/docs/concepts/overview/working-with-objects/names#경로-세그먼트-이름)이어야 한다.

### 롤바인딩과 클러스터롤바인딩 {#rolebinding-and-clusterrolebinding}

롤 바인딩은 롤에 정의된 권한을 사용자 또는 사용자 집합에 부여한다.
롤 바인딩에는 *주체(subject)* 목록(사용자, 그룹 또는 서비스 어카운트)과
부여할 롤에 대한 참조가 포함된다.
롤바인딩은 특정 네임스페이스 내에서 권한을 부여하고, 클러스터롤바인딩은
클러스터 전체에 걸쳐 해당 접근 권한을 부여한다.

롤바인딩은 동일한 네임스페이스의 모든 롤을 참조할 수 있다. 또는 클러스터롤을
참조하여 해당 클러스터롤을 롤바인딩의 네임스페이스에 바인딩할 수도 있다.
클러스터롤을 클러스터의 모든 네임스페이스에 바인딩하려면
클러스터롤바인딩을 사용한다.

롤바인딩 또는 클러스터롤바인딩 오브젝트의 이름은 유효한
[경로 세그먼트 이름](/docs/concepts/overview/working-with-objects/names#경로-세그먼트-이름)이어야 한다.

#### 롤바인딩 예시 {#rolebinding-example}

다음은 "default" 네임스페이스 내에서 사용자 "jane"에게 "pod-reader" 롤을
부여하는 롤바인딩의 예시이다.
이를 통해 "jane"은 "default" 네임스페이스의 파드를 읽을 수 있다.

{{% code_sample file="access/simple-rolebinding-with-role.yaml" %}}

롤바인딩은 클러스터롤을 참조하여 해당 클러스터롤에 정의된 권한을
롤바인딩의 네임스페이스 내 리소스에 부여할 수도 있다. 이러한 참조를 사용하면
클러스터 전체에서 공통으로 사용할 롤 집합을 정의한 후, 여러 네임스페이스에서
재사용할 수 있다.

예를 들어 다음 롤바인딩은 클러스터롤을 참조하지만,
메타데이터에 지정된 롤바인딩의 네임스페이스가 "development"이므로
"dave"(주체이며 대소문자를 구분함)는 "development" 네임스페이스의 시크릿만 읽을 수 있다.

{{% code_sample file="access/simple-rolebinding-with-clusterrole.yaml" %}}

#### 클러스터롤바인딩 예시 {#clusterrolebinding-example}

클러스터 전체에 걸쳐 권한을 부여하려면 클러스터롤바인딩을 사용할 수 있다.
다음 클러스터롤바인딩은 "manager" 그룹에 속한 모든 사용자가 모든 네임스페이스의
시크릿을 읽을 수 있도록 허용한다.

{{% code_sample file="access/simple-clusterrolebinding.yaml" %}}

바인딩을 생성한 후에는 해당 바인딩이 참조하는 롤이나 클러스터롤을 변경할 수 없다.
바인딩의 `roleRef`를 변경하려고 하면 유효성 검사 오류가 발생한다. 바인딩의
`roleRef`를 변경하려면 바인딩 오브젝트를 삭제하고
새로 생성해야 한다.

이러한 제한이 있는 이유는 두 가지이다.

1. `roleRef`를 변경할 수 없도록 하면, 기존 바인딩 오브젝트에 대한 `update` 권한을 부여받은 사용자가
   주체에게 부여된 롤을 변경하지 못하면서도
   주체 목록을 관리할 수 있다.
1. 다른 롤에 대한 바인딩은 근본적으로 다른 바인딩이다.
   `roleRef`를 변경할 때 바인딩을 삭제하고 다시 생성하도록 요구하면
   바인딩에 포함된 모든 주체에게 새 롤을 부여하려는 의도인지
   확인할 수 있다. 이는 기존 주체 모두에게 새 롤의 권한을
   부여해도 되는지 확인하지 않은 채 `roleRef`만 변경하도록
   허용하거나 실수로 변경하는 일을 방지한다.

`kubectl auth reconcile` 커맨드라인 유틸리티는 RBAC 오브젝트가 포함된 매니페스트 파일을 생성하거나 업데이트하고,
참조하는 롤을 변경하기 위해 필요한 경우 바인딩 오브젝트의 삭제 및 재생성도 처리한다.
자세한 내용은 [명령 사용법 및 예시](#kubectl-auth-reconcile)를 참고한다.

### 리소스 참조하기 {#referring-to-resources}

쿠버네티스 API에서 대부분의 리소스는 파드의 `pods`와 같이
오브젝트 이름을 문자열로 표현하여 나타내고 접근한다. RBAC은 해당 API 엔드포인트의
URL에 나타나는 것과 정확히 동일한 이름을 사용하여 리소스를 참조한다.
일부 쿠버네티스 API에는 파드의 로그와 같은
_하위 리소스(subresource)_ 가 있다. 파드의 로그를 요청하는 형식은 다음과 같다.

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

이 경우 `pods`는 파드 리소스에 대한 네임스페이스 범위의 리소스이고, `log`는
`pods`의 하위 리소스이다. RBAC 롤에서 이를 표현하려면 슬래시(`/`)로
리소스와 하위 리소스를 구분한다. 주체가 `pods`를 읽고 각 파드의
`log` 하위 리소스에도 접근할 수 있도록 허용하려면 다음과 같이 작성한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

특정 요청에서는 `resourceNames` 목록을 통해 이름으로 리소스를 참조할 수도 있다.
이를 지정하면 개별 리소스 인스턴스로 요청을 제한할 수 있다.
다음은 주체가 `my-configmap`이라는
{{< glossary_tooltip term_id="ConfigMap" text="컨피그맵(ConfigMap)" >}}에 대해 `get` 또는 `update`만 수행하도록 제한하는 예시이다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
리소스 이름으로 **deletecollection** 또는 최상위 리소스에 대한 **create** 요청을 제한할 수는 없다.
**create**의 경우, 인가 시점에 새 오브젝트의 이름을 알 수 없을 수 있기 때문에 이러한 제한이 있다. 다만 **create** 제한은 최상위 리소스에만 적용되며 하위 리소스에는 적용되지 않는다. 예를 들어 `pods/exec`에는 `resourceNames` 필드를 사용할 수 있다.
`resourceName`으로 **list** 또는 **watch**를 제한하는 경우, 클라이언트는 인가를 받기 위해 **list** 또는 **watch** 요청에 지정된 `resourceName`과 일치하는
`metadata.name` 필드 셀렉터를 포함해야 한다.
예를 들면 다음과 같다. `kubectl get configmaps --field-selector=metadata.name=my-configmap`
{{< /note >}}

개별 `resources`, `apiGroups`, `verbs`를 참조하는 대신,
와일드카드(wildcard) 기호 `*`를 사용하여 해당 오브젝트 모두를 참조할 수 있다.
`nonResourceURLs`에서는 와일드카드 `*`를 접미사 글로브(glob) 일치에 사용할 수 있다.
`resourceNames`에서는 빈 집합이 모든 것을 허용한다는 의미이다.
다음은 `example.com` API 그룹의 현재 및 미래의 모든 리소스에 대해
현재 및 미래의 모든 작업을 수행할 수 있도록 접근을 허용하는 예시이다.
이는 기본 제공 `cluster-admin` 롤과 유사하다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: example.com-superuser # DO NOT USE THIS ROLE, IT IS JUST AN EXAMPLE
rules:
- apiGroups: ["example.com"]
  resources: ["*"]
  verbs: ["*"]
```

{{< caution >}}
리소스와 동사 항목에 와일드카드를 사용하면 민감한 리소스에 대해
지나치게 광범위한 접근 권한이 부여될 수 있다.
예를 들어 새 리소스 타입이나 하위 리소스가 추가되거나,
새 사용자 정의 동사를 검사하게 되면 와일드카드 항목은 자동으로 접근을 허용하므로 의도하지 않은 결과가 발생할 수 있다.
[최소 권한 원칙](/docs/concepts/security/rbac-good-practices/#최소-권한)에 따라
구체적인 리소스와 동사를 사용하여 워크로드가 올바르게 동작하는 데
필요한 권한만 적용해야 한다.
{{< /caution >}}

### 집계된 클러스터롤 {#aggregated-clusterroles}

여러 클러스터롤을 하나의 클러스터롤로 _집계(aggregate)_ 할 수 있다.
클러스터 컨트롤 플레인의 일부로 실행되는 컨트롤러는 `aggregationRule`이
설정된 클러스터롤 오브젝트를 감시한다. `aggregationRule`은 레이블
{{< glossary_tooltip text="셀렉터" term_id="selector" >}}를 정의하며, 컨트롤러는 이 셀렉터로
해당 클러스터롤의 `rules` 필드에 합쳐야 하는 다른 클러스터롤
오브젝트를 찾는다.

{{< caution >}}
컨트롤 플레인은 집계된 클러스터롤의 `rules` 필드에 수동으로 지정한 값을
덮어쓴다. 규칙을 변경하거나 추가하려면 `aggregationRule`이 선택하는
`ClusterRole` 오브젝트에서 변경한다.

집계된 클러스터롤의 매니페스트에서는 `rules` 필드를 생략한다. 빈 목록이라도
이 필드를 설정하면 [서버 사이드 어플라이](/docs/reference/using-api/server-side-apply/)로
매니페스트를 적용할 때 해당 필드의 소유권을 갖게 된다. 이러한 소유권은
적용 주체와 컨트롤 플레인 간에 충돌을 일으킨다. 이후 적용 시 `.rules`의
필드 관리자 충돌로 실패하거나, GitOps 컨트롤러가 일반적으로 하는 것처럼
충돌을 강제로 처리하면 집계된 규칙을 반복해서 지우고 컨트롤 플레인이
다시 채우는 일이 발생한다.
{{< /caution >}}

다음은 집계된 클러스터롤의 예시이다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
# The control plane automatically fills in the rules
```

기존 집계된 클러스터롤의 레이블 셀렉터와 일치하는 새 클러스터롤을 생성하면,
그 변경으로 인해 집계된 클러스터롤에 새 규칙이 추가된다.
다음은 `rbac.example.com/aggregate-to-monitoring: true` 레이블이 있는 다른
클러스터롤을 생성하여 "monitoring" 클러스터롤에 규칙을 추가하는 예시이다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpointslices
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# When you create the "monitoring-endpointslices" ClusterRole,
# the rules below will be added to the "monitoring" ClusterRole.
rules:
- apiGroups: [""]
  resources: ["services", "pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["discovery.k8s.io"]
  resources: ["endpointslices"]
  verbs: ["get", "list", "watch"]
```

[기본 사용자 대상 롤](#default-roles-and-role-bindings)은 클러스터롤 집계를 사용한다. 이를 통해
클러스터 관리자는 {{< glossary_tooltip term_id="CustomResourceDefinition" text="커스텀리소스데피니션(CustomResourceDefinition)" >}}이나
집계된 API 서버가 제공하는 리소스와 같은 사용자 정의 리소스에 대한 규칙을
포함하여 기본 롤을 확장할 수 있다.

예를 들어 다음 클러스터롤은 "admin"과 "edit" 기본 롤이 CronTab이라는 사용자 정의 리소스를
관리할 수 있도록 하며, "view" 롤은 CronTab 리소스에 대한 읽기 작업만 수행할 수 있도록 한다.
API 서버에서 보는 URL에서 CronTab 오브젝트의 이름은 `"crontabs"`라고 가정한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Add these permissions to the "admin" and "edit" default roles.
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Add these permissions to the "view" default role.
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### 롤 예시 {#role-examples}

다음 예시들은 롤 또는 클러스터롤 오브젝트에서 발췌한 것으로,
`rules` 섹션만 보여준다.

코어 {{< glossary_tooltip text="API 그룹" term_id="api-group" >}}의
`"pods"` 리소스 읽기를 허용한다.

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

`"apps"` API 그룹의 디플로이먼트(Deployment)(HTTP 수준에서는 URL의 리소스 부분이
`"deployments"`인 오브젝트)에 대한 읽기와 쓰기를 허용한다.

```yaml
rules:
- apiGroups: ["apps"]
  #
  # at the HTTP level, the name of the resource for accessing Deployment
  # objects is "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

코어 API 그룹의 파드 읽기와 `"batch"` API 그룹의 잡(Job)
리소스 읽기 또는 쓰기를 허용한다.

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch"]
  #
  # at the HTTP level, the name of the resource for accessing Job
  # objects is "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

"my-config"라는 컨피그맵 읽기를 허용한다(하나의 네임스페이스에 있는 하나의 컨피그맵으로
제한하려면 롤바인딩으로 바인딩해야 한다).

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

코어 그룹의 `"nodes"` 리소스 읽기를 허용한다(노드는 클러스터 범위이므로
이 규칙이 효력을 가지려면 클러스터롤바인딩으로 바인딩된
클러스터롤에 포함되어야 한다).

```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Node
  # objects is "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

리소스가 아닌 엔드포인트 `/healthz`와 모든 하위 경로에 대한 GET 및 POST 요청을
허용한다(효력을 가지려면 클러스터롤바인딩으로 바인딩된
클러스터롤에 포함되어야 한다).

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```

### 주체 참조하기 {#referring-to-subjects}

롤바인딩이나 클러스터롤바인딩은 롤을 주체에 바인딩한다.
주체는 그룹, 사용자 또는
{{< glossary_tooltip text="서비스어카운트(ServiceAccount)" term_id="service-account" >}}일 수 있다.

쿠버네티스는 사용자 이름을 문자열로 표현한다.
"alice"와 같은 일반 이름, "bob@example.com"과 같은 이메일 형식의 이름,
또는 문자열로 표현된 숫자 사용자 ID를 사용할 수 있다. 클러스터 관리자는
인증 결과가 원하는 형식의 사용자 이름이 되도록
[인증 모듈](/docs/reference/access-authn-authz/authentication/)을 구성해야 한다.

{{< caution >}}
접두사 `system:`은 쿠버네티스 시스템용으로 예약되어 있으므로,
실수로 `system:`으로 시작하는 이름의 사용자나 그룹을
만들지 않도록 해야 한다.
이 특별한 접두사 외에는 RBAC 인가 시스템에서 사용자 이름에
특정 형식을 요구하지 않는다.
{{< /caution >}}

쿠버네티스에서는 인증자 모듈이 그룹 정보를 제공한다.
그룹은 사용자와 마찬가지로 문자열로 표현하며, 접두사 `system:`이 예약되어 있다는 점
외에는 문자열에 대한 형식 요구 사항이 없다.

[서비스어카운트](/docs/tasks/configure-pod-container/configure-service-account/)의 이름은
`system:serviceaccount:`로 시작하며, 이름이 `system:serviceaccounts:`로 시작하는 그룹에 속한다.

{{< note >}}
- `system:serviceaccount:`(단수형)는 서비스 어카운트 사용자 이름의 접두사이다.
- `system:serviceaccounts:`(복수형)는 서비스 어카운트 그룹의 접두사이다.
{{< /note >}}

#### 롤바인딩 예시 {#role-binding-examples}

다음은 `RoleBinding`에서 `subjects` 섹션만
발췌한 예시이다.

`alice@example.com`이라는 사용자의 경우 다음과 같다.

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

`frontend-admins`라는 그룹의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

"kube-system" 네임스페이스의 기본 서비스 어카운트의 경우 다음과 같다.

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

"qa" 네임스페이스의 모든 서비스 어카운트의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

모든 네임스페이스의 모든 서비스 어카운트의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

인증된 모든 사용자의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

인증되지 않은 모든 사용자의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

모든 사용자의 경우 다음과 같다.

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## 기본 롤과 롤 바인딩 {#default-roles-and-role-bindings}

API 서버는 기본 클러스터롤 및 클러스터롤바인딩 오브젝트 집합을 생성한다.
이 중 다수는 `system:` 접두사를 사용하며, 이는 해당 리소스를 클러스터
컨트롤 플레인이 직접 관리한다는 의미이다.
모든 기본 클러스터롤과 클러스터롤바인딩에는 `kubernetes.io/bootstrapping=rbac-defaults` 레이블이 지정된다.

{{< caution >}}
이름에 `system:` 접두사가 있는 클러스터롤과 클러스터롤바인딩을
수정할 때는 주의해야 한다.
이 리소스들을 수정하면 클러스터가 정상적으로 동작하지 않을 수 있다.
{{< /caution >}}

### 자동 조정 {#auto-reconciliation}

API 서버는 시작할 때마다 기본 클러스터롤에 누락된 권한을 추가하고,
기본 클러스터롤바인딩에 누락된 주체를 추가한다.
이를 통해 클러스터는 실수로 변경된 내용을 복구하고, 새 쿠버네티스 릴리스에서 권한과 주체가
변경됨에 따라 롤과 롤 바인딩을 최신 상태로 유지할 수 있다.

이 조정을 비활성화하려면 기본 클러스터롤 또는 기본 클러스터롤바인딩의
`rbac.authorization.kubernetes.io/autoupdate` 어노테이션을 `false`로 설정한다.
기본 권한과 주체가 누락되면 클러스터가 정상적으로 동작하지 않을 수 있음에 유의한다.

RBAC 인가자가 활성화되어 있으면 자동 조정은 기본적으로 활성화된다.

### API 디스커버리 롤 {#discovery-roles}

기본 클러스터롤바인딩은 인증되지 않은 사용자와 인증된 사용자가 공개해도 안전하다고
판단되는 API 정보(커스텀리소스데피니션 포함)를 읽을 수 있도록 인가한다.
인증되지 않은 익명 접근을 비활성화하려면 API 서버 구성에
`--anonymous-auth=false` 플래그를 추가한다.

`kubectl`을 통해 이 롤들의 구성을 확인하려면 다음을 실행한다.

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
해당 클러스터롤을 수정하면 API 서버가 다시 시작될 때
[자동 조정](#auto-reconciliation)에 의해 변경 사항이 덮어써진다. 이를 방지하려면
롤을 수동으로 수정하지 않거나 자동 조정을 비활성화한다.
{{< /note >}}

<table>
<caption>쿠버네티스 RBAC API 디스커버리 롤</caption>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>기본 클러스터롤</th>
<th>기본 클러스터롤바인딩</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> 그룹</td>
<td>사용자가 자신에 대한 기본 정보에 읽기 전용으로 접근하도록 허용한다. v1.14 이전에는 이 롤이 기본적으로 <tt>system:unauthenticated</tt>에도 바인딩되었다.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> 그룹</td>
<td>API 수준을 탐색하고 협상하는 데 필요한 API 디스커버리 엔드포인트에 대한 읽기 전용 접근을 허용한다. v1.14 이전에는 이 롤이 기본적으로 <tt>system:unauthenticated</tt>에도 바인딩되었다.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> 및 <b>system:unauthenticated</b> 그룹</td>
<td>클러스터의 민감하지 않은 정보에 대한 읽기 전용 접근을 허용한다. 쿠버네티스 v1.14에서 도입되었다.</td>
</tr>
</tbody>
</table>

### 사용자 대상 롤 {#user-facing-roles}

일부 기본 클러스터롤에는 `system:` 접두사가 없다. 이들은 사용자를 대상으로 하는 롤이다.
여기에는 슈퍼유저 롤(`cluster-admin`), 클러스터롤바인딩을 통해 클러스터 전체에
부여하도록 설계된 롤, 롤바인딩을 통해 특정 네임스페이스 내에서
부여하도록 설계된 롤(`admin`, `edit`, `view`)이 포함된다.

사용자 대상 클러스터롤은 [클러스터롤 집계](#aggregated-clusterroles)를 사용하여 관리자가 이 클러스터롤에
사용자 정의 리소스에 대한 규칙을 포함할 수 있도록 한다. `admin`, `edit`, `view` 롤에 규칙을 추가하려면,
다음 레이블 중 하나 이상을 포함하는 클러스터롤을 생성한다.

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>기본 클러스터롤</th>
<th>기본 클러스터롤바인딩</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> 그룹</td>
<td>모든 리소스에 대해 모든 작업을 수행할 수 있는 슈퍼유저 접근을 허용한다.
<b>클러스터롤바인딩</b>에서 사용하면 클러스터와 모든 네임스페이스의 모든 리소스에 대한 완전한 제어 권한을 부여한다.
<b>롤바인딩</b>에서 사용하면 네임스페이스 자체를 포함하여 해당 롤 바인딩의 네임스페이스에 있는 모든 리소스에 대한 완전한 제어 권한을 부여한다.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>없음</td>
<td>관리자 접근을 허용하며, <b>롤바인딩</b>을 사용하여 네임스페이스 내에서 부여하도록 설계되었다.

<b>롤바인딩</b>에서 사용하면 네임스페이스 내에 롤과 롤 바인딩을 생성하는 기능을
포함하여 네임스페이스의 대부분의 리소스에 대한 읽기와 쓰기 접근을 허용한다.
이 롤은 리소스 쿼터나 네임스페이스 자체에 대한 쓰기 접근을 허용하지 않는다.
또한 쿠버네티스 v1.22 이상으로 생성된 클러스터에서는
엔드포인트슬라이스(EndpointSlice)에 대한 쓰기 접근도 허용하지 않는다. 자세한 내용은
["엔드포인트슬라이스에 대한 쓰기 접근" 섹션](#write-access-for-endpoints)을 참고한다.</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>없음</td>
<td>네임스페이스의 대부분의 오브젝트에 대한 읽기와 쓰기 접근을 허용한다.

이 롤은 롤이나 롤 바인딩의 조회 또는 수정을 허용하지 않는다.
그러나 시크릿에 접근하고 네임스페이스 내 모든 서비스어카운트로 파드를 실행할 수 있도록
허용하므로, 네임스페이스 내 모든 서비스어카운트의 API 접근 수준을
얻는 데 사용될 수 있다. 또한 쿠버네티스 v1.22 이상으로 생성된
클러스터에서는 엔드포인트슬라이스에 대한 쓰기 접근을 허용하지 않는다.
자세한 내용은 ["엔드포인트슬라이스에 대한 쓰기 접근" 섹션](#write-access-for-endpoints)을 참고한다.</td>
</tr>
<tr>
<td><b>view</b></td>
<td>없음</td>
<td>네임스페이스의 대부분의 오브젝트를 볼 수 있는 읽기 전용 접근을 허용한다.
롤이나 롤 바인딩의 조회는 허용하지 않는다.

시크릿의 내용을 읽으면 네임스페이스 내 서비스어카운트의
자격 증명에 접근할 수 있고, 이를 통해 네임스페이스 내
모든 서비스어카운트로 API에 접근할 수 있으므로
(권한 상승의 한 형태), 이 롤은 시크릿의 조회를 허용하지 않는다.</td>
</tr>
</tbody>
</table>

### 핵심 컴포넌트 롤 {#core-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>기본 클러스터롤</th>
<th>기본 클러스터롤바인딩</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> 사용자</td>
<td>{{< glossary_tooltip term_id="kube-scheduler" text="스케줄러" >}} 컴포넌트에 필요한 리소스에 대한 접근을 허용한다.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> 사용자</td>
<td>kube-scheduler 컴포넌트에 필요한 볼륨 리소스에 대한 접근을 허용한다.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> 사용자</td>
<td>{{< glossary_tooltip term_id="kube-controller-manager" text="컨트롤러 매니저" >}} 컴포넌트에 필요한 리소스에 대한 접근을 허용한다.
개별 컨트롤러에 필요한 권한은 <a href="#controller-roles">컨트롤러 롤</a>에 자세히 설명되어 있다.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>없음</td>
<td><b>모든 시크릿에 대한 읽기 접근과 모든 파드 상태 오브젝트에 대한 쓰기 접근을 포함하여</b> kubelet에 필요한 리소스에 대한 접근을 허용한다.

<tt>system:node</tt> 롤 대신 <a href="/docs/reference/access-authn-authz/node/">노드 인가자</a>와 <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction 어드미션 플러그인</a>을 사용하여 kubelet에서 실행되도록 스케줄된 파드를 기준으로 kubelet에 API 접근 권한을 부여해야 한다.

<tt>system:node</tt> 롤은 v1.8 이전 버전에서 업그레이드한 쿠버네티스 클러스터와의 호환성을 위해서만 존재한다.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> 사용자</td>
<td>{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} 컴포넌트에 필요한 리소스에 대한 접근을 허용한다.</td>
</tr>
</tbody>
</table>

### 기타 컴포넌트 롤 {#other-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>기본 클러스터롤</th>
<th>기본 클러스터롤바인딩</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:auth-delegator</b></td>
<td>없음</td>
<td>위임된 인증 및 인가 검사를 허용한다.
일반적으로 애드온 API 서버가 통합 인증 및 인가를 위해 사용한다.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>없음</td>
<td><a href="https://github.com/kubernetes/heapster">힙스터(Heapster)</a> 컴포넌트용 롤이다(사용 중단(deprecated)).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>없음</td>
<td><a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> 컴포넌트용 롤이다.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-system</b> 네임스페이스의 <b>kube-dns</b> 서비스 어카운트</td>
<td>사용 중단된 kube-dns 컴포넌트용 롤이다. (<a href="/docs/concepts/services-networking/dns-pod-service/">CoreDNS</a>는 이 롤을 사용하지 않는다.)</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>없음</td>
<td>kubelet API에 대한 전체 접근을 허용한다.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>없음</td>
<td><a href="/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">kubelet TLS 부트스트래핑</a>을 수행하는 데 필요한
리소스에 대한 접근을 허용한다.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>없음</td>
<td><a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> 컴포넌트용 롤이다.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>없음</td>
<td>대부분의 <a href="/docs/concepts/storage/persistent-volumes/#dynamic">동적 볼륨 프로비저너</a>에 필요한 리소스에 대한 접근을 허용한다.</td>
</tr>
<tr>
<td><b>system:monitoring</b></td>
<td><b>system:monitoring</b> 그룹</td>
<td>컨트롤 플레인 모니터링 엔드포인트(즉, {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}의 활성 및 준비성 엔드포인트(<tt>/healthz</tt>, <tt>/livez</tt>, <tt>/readyz</tt>), 개별 헬스 체크 엔드포인트(<tt>/healthz/*</tt>, <tt>/livez/*</tt>, <tt>/readyz/*</tt>), <tt>/metrics</tt>)에 대한 읽기 접근을 허용하고, kube-apiserver가 트레이싱(tracing)을 위해 요청과 함께 제공된 traceparent 헤더를 사용하도록 한다. 개별 헬스 체크 엔드포인트와 메트릭 엔드포인트는 민감한 정보를 노출할 수 있음에 유의한다.</td>
</tr>
</tbody>
</table>

### 기본 제공 컨트롤러의 롤 {#controller-roles}

쿠버네티스 {{< glossary_tooltip term_id="kube-controller-manager" text="컨트롤러 매니저" >}}는
쿠버네티스 컨트롤 플레인에 내장된
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}}를 실행한다.
`--use-service-account-credentials`로 실행하면 kube-controller-manager는 각 컨트롤러를
별도의 서비스 어카운트를 사용하여 시작한다.
각 기본 제공 컨트롤러에 대응하는 롤이 있으며, `system:controller:` 접두사를 사용한다.
컨트롤러 매니저를 `--use-service-account-credentials` 없이 시작하면 자체 자격 증명으로
모든 제어 루프를 실행하므로, 해당 자격 증명에 관련된 모든 롤을 부여해야 한다.
이 롤에는 다음이 포함된다.

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

## 권한 상승 방지 및 부트스트래핑 {#privilege-escalation-prevention-and-bootstrapping}

RBAC API는 사용자가 롤이나 롤 바인딩을 수정하여 권한을 상승시키는 것을 방지한다.
이는 API 수준에서 적용되므로 RBAC 인가자를 사용하지 않는 경우에도 적용된다.

### 롤 생성 또는 업데이트 제한 {#restrictions-on-role-creation-or-update}

다음 중 하나 이상에 해당하는 경우에만 롤을 생성하거나 업데이트할 수 있다.

1. 수정하는 오브젝트와 동일한 범위에서 해당 롤에 포함된 모든 권한을 이미 가지고 있다.
   (클러스터롤의 경우 클러스터 전체, 롤의 경우 동일한 네임스페이스 또는 클러스터 전체)
2. `rbac.authorization.k8s.io` API 그룹의 `roles` 또는 `clusterroles` 리소스에 대해
   `escalate` 동사를 수행할 명시적인 권한을 부여받았다.

예를 들어 `user-1`이 클러스터 전체의 시크릿을 나열할 수 없다면, 해당 권한이 포함된 클러스터롤을
생성할 수 없다. 사용자가 롤을 생성하거나 업데이트할 수 있도록 허용하려면 다음과 같이 한다.

1. 필요에 따라 롤 또는 클러스터롤 오브젝트를 생성하거나 업데이트할 수 있는 롤을 부여한다.
2. 생성하거나 업데이트하는 롤에 특정 권한을 포함할 수 있는 권한을 부여한다.
   * 해당 권한을 부여하여 암묵적으로 허용한다(사용자 자신에게 부여되지 않은 권한을 포함하는 롤이나
     클러스터롤을 생성하거나 수정하려고 하면 API 요청이 금지된다).
   * 또는 `rbac.authorization.k8s.io` API 그룹의 `roles` 또는 `clusterroles` 리소스에 대해
     `escalate` 동사를 수행할 권한을 부여하여 `Role` 또는 `ClusterRole`에
     모든 권한을 지정할 수 있도록 명시적으로 허용한다.

### 롤 바인딩 생성 또는 업데이트 제한 {#restrictions-on-role-binding-creation-or-update}

참조하는 롤에 포함된 모든 권한을 롤 바인딩과 동일한 범위에서 이미 가지고 있거나,
참조하는 롤에 대해 `bind` 동사를 수행하도록 인가받은 경우에만 롤 바인딩을 생성하거나 업데이트할 수 있다.
예를 들어 `user-1`이 클러스터 전체의 시크릿을 나열할 수 없다면, 해당 권한을 부여하는 롤에 대한
클러스터롤바인딩을 생성할 수 없다. 사용자가 롤 바인딩을 생성하거나 업데이트할 수 있도록 허용하려면 다음과 같이 한다.

1. 필요에 따라 롤바인딩 또는 클러스터롤바인딩 오브젝트를 생성하거나 업데이트할 수 있는 롤을 부여한다.
2. 특정 롤을 바인딩하는 데 필요한 권한을 부여한다.
   * 해당 롤에 포함된 권한을 부여하여 암묵적으로 허용한다.
   * 특정 롤(또는 클러스터롤)에 대해 `bind` 동사를 수행할 권한을 부여하여 명시적으로 허용한다.

예를 들어 다음 클러스터롤과 롤바인딩은 `user-1`이 `user-1-namespace` 네임스페이스에서 다른 사용자에게 `admin`, `edit`, `view` 롤을 부여할 수 있도록 허용한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  # omit resourceNames to allow binding any ClusterRole
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

최초의 롤과 롤 바인딩을 부트스트랩할 때는 초기 사용자가 아직 보유하지 않은 권한을 부여해야 한다.
초기 롤과 롤 바인딩을 부트스트랩하려면 다음과 같이 한다.

* 기본 바인딩에 의해 "cluster-admin" 슈퍼유저 롤에 바인딩된 "system:masters" 그룹의 자격 증명을 사용한다.

## 커맨드라인 유틸리티 {#command-line-utilities}

### `kubectl create role`

하나의 네임스페이스 내에서 권한을 정의하는 롤 오브젝트를 생성한다. 예시는 다음과 같다.

* 사용자가 파드에 대해 `get`, `watch`, `list`를 수행할 수 있는 "pod-reader" 롤을 생성한다.

  ```shell
  kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
  ```

* resourceNames를 지정하여 "pod-reader" 롤을 생성한다.

  ```shell
  kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

* apiGroups를 지정하여 "foo" 롤을 생성한다.

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
  ```

* 하위 리소스 권한을 포함하는 "foo" 롤을 생성한다.

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
  ```

* 특정 이름의 리소스를 가져오거나 업데이트할 수 있는 "my-component-lease-holder" 롤을 생성한다.

  ```shell
  kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
  ```

### `kubectl create clusterrole`

클러스터롤을 생성한다. 예시는 다음과 같다.

* 사용자가 파드에 대해 `get`, `watch`, `list`를 수행할 수 있는 "pod-reader" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
  ```

* resourceNames를 지정하여 "pod-reader" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

* apiGroups를 지정하여 "foo" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
  ```

* 하위 리소스 권한을 포함하는 "foo" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
  ```

* nonResourceURL을 지정하여 "foo" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
  ```

* aggregationRule을 지정하여 "monitoring" 클러스터롤을 생성한다.

  ```shell
  kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
  ```

### `kubectl create rolebinding`

특정 네임스페이스 내에서 롤이나 클러스터롤을 부여한다. 예시는 다음과 같다.

* "acme" 네임스페이스 내에서 "bob" 사용자에게 "admin" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
  ```

* "acme" 네임스페이스 내에서 "acme" 네임스페이스의 "myapp" 서비스 어카운트에 "view" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
  ```

* "acme" 네임스페이스 내에서 "myappnamespace" 네임스페이스의 "myapp" 서비스 어카운트에 "view" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
  ```

### `kubectl create clusterrolebinding`

클러스터 전체(모든 네임스페이스)에 걸쳐 클러스터롤을 부여한다. 예시는 다음과 같다.

* 클러스터 전체에 걸쳐 "root" 사용자에게 "cluster-admin" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
  ```

* 클러스터 전체에 걸쳐 "system:kube-proxy" 사용자에게 "system:node-proxier" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
  ```

* 클러스터 전체에 걸쳐 "acme" 네임스페이스의 "myapp" 서비스 어카운트에 "view" 클러스터롤의 권한을 부여한다.

  ```shell
  kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
  ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

매니페스트 파일로부터 `rbac.authorization.k8s.io/v1` API 오브젝트를 생성하거나 업데이트한다.

존재하지 않는 오브젝트를 생성하며, 필요한 경우 네임스페이스에 속하는 오브젝트를 위한 네임스페이스도 생성한다.

기존 롤은 입력 오브젝트의 권한을 포함하도록 업데이트하며,
`--remove-extra-permissions`를 지정하면 추가 권한을 제거한다.

기존 바인딩은 입력 오브젝트의 주체를 포함하도록 업데이트하며,
`--remove-extra-subjects`를 지정하면 추가 주체를 제거한다.

예시는 다음과 같다.

* RBAC 오브젝트의 매니페스트 파일 적용을 시험하고, 적용 시 변경될 내용을 표시한다.

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
  ```

* 롤의 추가 권한과 바인딩의 추가 주체를 유지하면서 RBAC 오브젝트의 매니페스트 파일을 적용한다.

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml
  ```

* 롤의 추가 권한과 바인딩의 추가 주체를 제거하면서 RBAC 오브젝트의 매니페스트 파일을 적용한다.

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
  ```

## 서비스어카운트 권한 {#service-account-permissions}

기본 RBAC 정책은 컨트롤 플레인 컴포넌트, 노드, 컨트롤러에 제한된 범위의 권한을
부여하지만, `kube-system` 네임스페이스 외부의 서비스 어카운트에는
([API 디스커버리 롤](#discovery-roles)이 부여하는 권한을 제외하고) *아무런 권한도 부여하지 않는다*.

이를 통해 필요에 따라 특정 서비스어카운트에 특정 롤을 부여할 수 있다.
세분화된 롤 바인딩은 보안성이 높지만 관리에 더 많은 노력이 필요하다.
광범위한 권한 부여는 서비스어카운트에 불필요한 API 접근 권한을 부여하고
권한 상승으로 이어질 가능성도 있지만, 관리하기는 더 쉽다.

보안성이 높은 순서대로 나열하면 다음과 같다.

1. 애플리케이션 전용 서비스 어카운트에 롤 부여(권장 방법)

   애플리케이션은 파드 명세에 `serviceAccountName`을 지정해야 하며,
   서비스 어카운트도 생성해야 한다(API, 애플리케이션 매니페스트, `kubectl create serviceaccount` 등을 통해 생성).

   예를 들어 "my-sa" 서비스 어카운트에 "my-namespace" 내의 읽기 전용 권한을 부여한다.

   ```shell
   kubectl create rolebinding my-sa-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:my-sa \
     --namespace=my-namespace
   ```

2. 네임스페이스의 "default" 서비스 어카운트에 롤 부여

   애플리케이션이 `serviceAccountName`을 지정하지 않으면 "default" 서비스 어카운트를 사용한다.

   {{< note >}}
   "default" 서비스 어카운트에 부여한 권한은 해당 네임스페이스에서
   `serviceAccountName`을 지정하지 않은 모든 파드가 사용할 수 있다.
   {{< /note >}}

   예를 들어 "default" 서비스 어카운트에 "my-namespace" 내의 읽기 전용 권한을 부여한다.

   ```shell
   kubectl create rolebinding default-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:default \
     --namespace=my-namespace
   ```

3. 네임스페이스의 모든 서비스 어카운트에 롤 부여

   사용하는 서비스 어카운트에 관계없이 네임스페이스의 모든 애플리케이션에 롤을 부여하려면,
   해당 네임스페이스의 서비스 어카운트 그룹에 롤을 부여할 수 있다.

   예를 들어 "my-namespace"의 모든 서비스 어카운트에 해당 네임스페이스 내의 읽기 전용 권한을 부여한다.

   ```shell
   kubectl create rolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts:my-namespace \
     --namespace=my-namespace
   ```

4. 클러스터 전체의 모든 서비스 어카운트에 제한된 롤 부여(권장하지 않음)

   네임스페이스별로 권한을 관리하지 않으려면, 모든 서비스 어카운트에 클러스터 전체 범위의 롤을 부여할 수 있다.

   예를 들어 클러스터의 모든 서비스 어카운트에 모든 네임스페이스에 걸친 읽기 전용 권한을 부여한다.

   ```shell
   kubectl create clusterrolebinding serviceaccounts-view \
     --clusterrole=view \
    --group=system:serviceaccounts
   ```

5. 클러스터 전체의 모든 서비스 어카운트에 슈퍼유저 접근 권한 부여(절대 권장하지 않음)

   권한 분리를 전혀 고려하지 않는다면, 모든 서비스 어카운트에 슈퍼유저 접근 권한을 부여할 수 있다.

   {{< warning >}}
   이렇게 하면 모든 애플리케이션이 클러스터에 대한 전체 접근 권한을 갖게 되며,
   시크릿에 대한 읽기 접근 권한이 있거나 파드를 생성할 수 있는
   모든 사용자도 클러스터에 대한 전체 접근 권한을 갖게 된다.
   {{< /warning >}}

   ```shell
   kubectl create clusterrolebinding serviceaccounts-cluster-admin \
     --clusterrole=cluster-admin \
     --group=system:serviceaccounts
   ```

## 엔드포인트슬라이스에 대한 쓰기 접근 {#write-access-for-endpoints}

쿠버네티스 v1.22 이전에 생성된 쿠버네티스 클러스터의 집계된 "edit" 및 "admin" 롤에는
엔드포인트슬라이스(및 현재 사용 중단된 엔드포인트(Endpoints) API)에 대한 쓰기 접근 권한이 포함된다.
[CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675)에 대한 완화 조치로,
쿠버네티스 v1.22 이상으로 생성하는 클러스터에서는
이 접근 권한이 집계된 롤에 포함되지 않는다.

쿠버네티스 v1.22로 업그레이드한 기존 클러스터에는
이 변경 사항이 적용되지 않는다. [CVE
공지](https://github.com/kubernetes/kubernetes/issues/103675)에는
기존 클러스터에서 이 접근 권한을 제한하는 방법이 안내되어 있다.

새 클러스터의 집계된 롤에서도 이 접근 수준을 유지하려면,
다음 클러스터롤을 생성할 수 있다.

{{% code_sample file="access/endpoints-aggregated.yaml" %}}

## ABAC에서 업그레이드하기 {#upgrading-from-abac}

처음에 이전 쿠버네티스 버전으로 실행되던 클러스터는 모든 서비스 어카운트에
전체 API 접근 권한을 부여하는 등의
관대한 ABAC 정책을 사용하는 경우가 많았다.

기본 RBAC 정책은 컨트롤 플레인 컴포넌트, 노드, 컨트롤러에 제한된 범위의 권한을
부여하지만, `kube-system` 네임스페이스 외부의 서비스 어카운트에는
([API 디스커버리 롤](#discovery-roles)이 부여하는 권한을 제외하고) *아무런 권한도 부여하지 않는다*.

이 방식은 훨씬 더 안전하지만, API 권한이 자동으로 부여된다고 가정하는 기존 워크로드에는 지장을 줄 수 있다.
이 전환을 관리하는 두 가지 방법은 다음과 같다.

### 인가자 병행 사용 {#parallel-authorizers}

RBAC 및 ABAC 인가자를 모두 실행하고,
[기존 ABAC 정책](/docs/reference/access-authn-authz/abac/#policy-file-format)이 포함된 정책 파일을 지정한다.

```shell
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

첫 번째 커맨드라인 옵션을 자세히 설명하면, Node와 같은 앞선 인가자가 요청을
거부할 경우 RBAC 인가자가 해당 API 요청의 인가를 시도한다. RBAC도
해당 API 요청을 거부하면 ABAC 인가자가 실행된다. 즉, RBAC 또는 ABAC 정책 중
*어느 하나라도* 허용하는 요청은 허용된다.

RBAC 컴포넌트의 로그 레벨을 5 이상으로 설정하여
(`--vmodule=rbac*=5` 또는 `--v=5`) kube-apiserver를 실행하면, API 서버 로그에서
RBAC 거부 내역을 확인할 수 있다(`RBAC` 접두사로 표시).
이 정보를 사용하여 어떤 사용자, 그룹 또는 서비스 어카운트에 어떤 롤을 부여해야 하는지 판단할 수 있다.

[서비스 어카운트에 롤을 부여](#service-account-permissions)하고 서버 로그에 RBAC 거부 메시지 없이
워크로드가 실행되면, ABAC 인가자를 제거할 수 있다.

### 관대한 RBAC 권한 {#permissive-rbac-permissions}

RBAC 롤 바인딩을 사용하여 관대한 ABAC 정책을 재현할 수 있다.

{{< warning >}}
다음 정책은 **모든** 서비스 어카운트가 클러스터 관리자로 동작할 수 있도록 허용한다.
컨테이너에서 실행되는 모든 애플리케이션은 서비스 어카운트 자격 증명을 자동으로 받으며,
시크릿 조회와 권한 수정을 포함하여 API에 대해 모든 작업을 수행할 수 있게 된다.
이 정책은 권장하지 않는다.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

RBAC 사용으로 전환한 후에는 클러스터의 접근 제어를 조정하여
정보 보안 요구 사항에 부합하도록 해야 한다.

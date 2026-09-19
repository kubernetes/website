---
# reviewers:
# - timstclair
# - deads2k
# - liggitt
title: 노드 인가 사용하기
content_type: concept
weight: 34
---

<!-- overview -->
노드 인가는 kubelet이 생성한 API 요청을 특별히 인가하는
특수 목적의 인가 모드다.


<!-- body -->
## 개요

노드 인가자(authorizer)는 kubelet이 API 작업을 수행하도록 허용한다. 여기에는 다음이 포함된다.

읽기 작업은 다음과 같다.

* 서비스
* 엔드포인트(Endpoints)
* 노드(Node)
* 파드
* kubelet의 노드에 바인딩된 파드와 관련된 시크릿(Secret), 컨피그맵(ConfigMap),
  퍼시스턴트볼륨클레임(PersistentVolumeClaim), 퍼시스턴트볼륨(PersistentVolume)

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

kubelet은 자신의 노드 오브젝트만 읽을 수 있으며, 해당 노드에 바인딩된 파드만 읽을 수 있다.

쓰기 작업은 다음과 같다.

* 노드 및 노드 상태(`NodeRestriction` 어드미션 플러그인을 활성화하여 kubelet이
  자신의 노드만 수정하도록 제한한다.)
* 파드 및 파드 상태(`NodeRestriction` 어드미션 플러그인을 활성화하여 kubelet이
  자신에게 바인딩된 파드만 수정하도록 제한한다.)
* 이벤트

인증/인가 관련 작업은 다음과 같다.

* TLS 부트스트래핑을 위한
  [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)에
  대한 읽기/쓰기 접근 권한
* 위임된 인증/인가 검사를 위해 토큰리뷰(TokenReview)와
  서브젝트액세스리뷰(SubjectAccessReview)를 생성하는 기능

향후 릴리스에서 노드 인가자는 kubelet이 올바르게 작동하는 데 필요한
최소한의 권한만 갖도록 권한을 추가하거나 제거할 수 있다.

노드 인가자의 인가를 받으려면 kubelet은 자신이 `system:nodes` 그룹에 속하고
사용자 이름이 `system:node:<nodeName>`임을 나타내는 자격 증명을
사용해야 한다.
이 그룹과 사용자 이름 형식은 각 kubelet에 대해
[kubelet TLS 부트스트래핑](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)의 일부로 생성되는 신원과 일치한다.

`<nodeName>` 값은 kubelet이 등록한 노드 이름과 **반드시** 정확히
일치해야 한다. 기본적으로 이 값은
`hostname`이 제공하는 호스트네임이거나,
[kubelet 옵션](/docs/reference/command-line-tools-reference/kubelet/)
`--hostname-override`를 통해 재정의한 값이다. 하지만 kubelet의 `--cloud-provider`
옵션을 사용하면 로컬 `hostname`과 `--hostname-override` 옵션을 무시하고
클라우드 공급자가 특정 호스트네임을 결정할 수 있다.
kubelet이 호스트네임을 결정하는 방식에 대한 자세한 내용은
[kubelet 옵션 레퍼런스](/docs/reference/command-line-tools-reference/kubelet/)를 참고한다.

노드 인가자를 활성화하려면, `Node` 인가자가 포함된 파일을
`--authorization-config` 플래그에 지정하여 {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}를 시작한다. 예시는 다음과 같다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

또는 `Node`를 포함한 쉼표로 구분된 목록을 `--authorization-mode` 플래그에 지정하여
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}를 시작한다.
예시는 다음과 같다.
```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

kubelet이 쓸 수 있는 API 오브젝트를 제한하려면,
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
어드미션 플러그인을 활성화한 상태로 다음과 같이 API 서버를 시작한다.
`--enable-admission-plugins=...,NodeRestriction,...`

## 서비스 어카운트 토큰 오디언스 제한 {#service-account-token-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

`ServiceAccountNodeAudienceRestriction` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가
활성화되고 `NodeRestriction` 어드미션 플러그인이 활성화되어 있으면,
kubelet은 해당 노드에서 실행 중인 파드가 이미 참조하는 오디언스(audience)에
대해서만 서비스 어카운트 토큰을 요청할 수 있다. 이는 손상된 노드가 임의의 오디언스에 대한 토큰을 얻지 못하게 한다.

허용되는 오디언스는 파드 명세에 따라 결정된다.

- 기본 API 서버 오디언스(빈 값 또는 API 서버에 설정된 오디언스).
- 프로젝티드 서비스 어카운트 토큰 볼륨 소스에 설정된 오디언스.
- 파드가 인라인 CSI 볼륨, 퍼시스턴트볼륨클레임 기반 볼륨 또는
  임시 볼륨을 통해 사용하는 모든 CSI 드라이버의 `spec.tokenRequests`에
  구성된 오디언스.

이는 [이미지 자격 증명 공급자를 위한 서비스 어카운트 토큰](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls)을
사용할 때 특히 관련이 있으며, 이 경우 kubelet은 파드를 대신하여 레지스트리별 오디언스가 지정된 토큰을 요청한다.

### RBAC으로 추가 오디언스 허용하기 {#allowing-additional-audiences}

파드 명세가 참조하는 범위를 벗어난 오디언스에 대한 토큰을 요청할 권한을
kubelet에 부여할 수 있다. kubelet이 파드 명세에 없는 오디언스가
지정된 토큰을 요청하면, NodeRestriction 어드미션 플러그인은 다음
속성을 사용하여 인가 검사를 수행함으로써 kubelet이 인가되었는지
확인한다.

| 속성           | 값 |
| -------------- | -- |
| 동사           | `request-serviceaccounts-token-audience` |
| API 그룹       | (빈 문자열, 코어 API 그룹을 의미) |
| 리소스         | 요청된 오디언스 값 |
| 이름           | 서비스 어카운트 이름 |
| 네임스페이스   | 서비스 어카운트 네임스페이스 |

이러한 검사를 인가하는 데 표준 RBAC 규칙을 사용할 수 있다. `resources` 필드는
허용할 오디언스를 제어하고, `resourceNames` 필드는 규칙을 적용할 서비스
어카운트를 지정한다.

예를 들어, 특정 서비스 어카운트에 대해 오디언스 `my-registry-audience`를
요청하도록 kubelet에 허용하려면 다음과 같이 한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-my-registry
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["my-service-account"]
```

`resourceNames`를 생략하면 모든 서비스 어카운트에 해당 오디언스를 허용한다.
`resources`에 와일드카드(`"*"`)를 사용하면 모든 오디언스를 허용한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-unrestricted
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["*"]  # 모든 오디언스
  # resourceNames 없음: 모든 서비스 어카운트
```

모든 kubelet에 적용하려면 클러스터롤(ClusterRole)을 `system:nodes` 그룹에 바인딩한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-audience-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-audience-my-registry
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
```

{{< note >}}
이 제한은 NodeRestriction 어드미션 플러그인의 일부이며 노드 신원(kubelet)에만
적용된다. 이는 `TokenRequest` API의 다른 호출자가 요청할 수 있는 오디언스를 제한하지
않는다. 다른 호출자를 제한해야 한다면 [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) 사용을 고려한다.
{{< /note >}}

## 마이그레이션 고려 사항

### `system:nodes` 그룹 외부의 kubelet

`system:nodes` 그룹 외부의 kubelet은 `Node` 인가 모드의 인가를 받지
못하므로, 현재 해당 kubelet을 인가하는 메커니즘을 통해 계속
인가를 받아야 한다.
노드 어드미션 플러그인은 이러한 kubelet의 요청을 제한하지 않는다.

### 노드별로 구분되지 않는 사용자 이름을 사용하는 kubelet

일부 배포 환경에서는 kubelet이 `system:nodes` 그룹에 속하도록 하는 자격 증명을 가지고 있지만,
이 자격 증명은 `system:node:...` 형식의 사용자 이름이 없어 해당 kubelet과 연결된
특정 노드를 식별하지 못한다.
이러한 kubelet은 `Node` 인가 모드의 인가를 받지 못하므로,
현재 해당 kubelet을 인가하는 메커니즘을 통해 계속 인가를 받아야 한다.

`NodeRestriction` 어드미션 플러그인은 기본 노드 식별자 구현이 해당 kubelet을
노드 신원으로 간주하지 않으므로, 이러한 kubelet의 요청을 무시한다.

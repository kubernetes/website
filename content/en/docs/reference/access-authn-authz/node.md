—
검토자:
팀스트클레어
- deads2k
- 갈고리
제목: 노드 권한 부여 사용
content_type: 개념
무게: 90
—


<!— 개요 —>
노드 인증은 쿠벨릿에서 만든 API 요청을 구체적으로 승인하는 특수 목적 인증 모드입니다.




<!— 본문 —>
## 개요


노드 승인자는 kubelet이 API 작업을 수행할 수 있도록 허용합니다. 여기에는 다음이 포함됩니다.


읽기 작업:


* 서비스
* 끝점
* 노드
* 포드
* kubelet 노드에 연결된 포드와 관련된 보안, 구성 맵, 영구 볼륨 클레임 및 영구 볼륨


쓰기 작업:


* 노드 및 노드 상태(`NodeRestriction` 승인 플러그인을 사용하여 kubelet을 제한하여 자체 노드를 수정할 수 있도록 함)
* pods 및 pod 상태 ( `NodeRestriction` 승인 플러그인을 사용하여 자체로 바인딩된 pods를 수정하도록 kubelet을 제한할 수 있음)
* 이벤트


인증 관련 작업:


* TLS 부트스트래핑을 위한 [CertificateSigningRequests API](/docs/reference/access-authz/certificate-signing-requests/)에 대한 읽기/쓰기 액세스
* 위임된 인증/권한 부여 확인을 위해 TokenReviews 및 SubjectAccessReviews를 만드는 기능


향후 릴리즈에서 노드 승인자는 쿠벨렛을 보장하기 위해 권한을 추가하거나 제거할 수 있습니다
올바르게 작동하는 데 필요한 최소 권한 집합을 보유합니다.


노드 승인자가 인증하려면 kubelets는 해당 인증서를 다음으로 식별하는 자격 증명을 사용해야 합니다.
사용자 이름이 `system:node:<nodeName>`인 `system:nodes` 그룹에 있습니다.
이 그룹 및 사용자 이름 형식은 각 kubelet에 대해 만들어진 ID와 일치합니다.
[kubelet TLS 부트스트랩](/docs/reference/access-authn-authz/kubelet-tls-부트스트랩/).


`<nodeName>` **는 kubelet에 등록된 노드 이름과 정확하게 일치해야 **. 기본적으로 이 이름은 `hostname`에서 제공하는 호스트 이름이거나 [kubelet option](/docs/reference/command-line-tools-reference/kubelet/) `—hostname-override`를 통해 재정의됩니다. 그러나 `—cloud-provider` kubelet 옵션을 사용할 때 로컬 `hostname` 및 `—hostname-override` 옵션을 무시하고 특정 호스트 이름을 클라우드 공급자가 결정할 수 있습니다.
kubelet이 호스트 이름을 결정하는 방법에 대한 자세한 내용은 [kubelet options reference](/docs/reference/command-line-tools-reference/kubelet/)를 참조하십시오.


노드 승인자를 활성화하려면 `—authorization-mode=Node'로 apiserver를 시작합니다.


kubelets에서 쓸 수 있는 API 객체를 제한하려면 `—enable-admission-plugins=..,NodeRestriction,..`(으)로 apiserver를 시작하여 [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction) 수락 플러그인을 활성화합니다.


## 마이그레이션 고려 사항


### `system:nodes` 그룹 외부의 Kubelets


`system:nodes` 그룹 외부의 kubelets는 `Node` 권한 부여 모드에 의해 승인되지 않습니다.
그리고 현재 권한을 부여하고 있는 어떤 메커니즘을 통해서든 계속해서 권한을 부여받아야 합니다.
노드 허용 플러그 인은 이러한 kubelets의 요청을 제한하지 않습니다.


차별화되지 않은 사용자 이름이 있는 ### Kubelets


일부 배포에서 kubelets는 `system:nodes` 그룹에 배치하는 자격 증명을 가지고 있습니다.
그러나 연결된 특정 노드를 식별하지 마십시오.
`system:node:...` 형식의 사용자 이름이 없기 때문입니다.
이 kubelets는 `Node` 권한 부여 모드로 승인되지 않습니다.
그리고 현재 권한을 부여하고 있는 어떤 메커니즘을 통해서든 계속해서 권한을 부여받아야 합니다.


`NodeRestriction` 입학 플러그인은 이러한 kubelets의 요청을 무시합니다.
기본 노드 식별자 구현에서는 해당 노드 id를 고려하지 않습니다.


### RBAC를 사용하여 이전 버전에서 업그레이드


'system:nodes' 그룹 바인딩이 이미 존재하기 때문에 [RBAC](/docs/reference/access-authn-authz/rbac/)를 사용하여 업그레이드된 pre-1.7 클러스터가 그대로 작동합니다.


클러스터 관리자가 `Node` 승인자 및 `NodeRestriction` 승인 플러그인 사용을 시작하려는 경우
중단 없이 수행할 수 있는 API에 대한 노드 액세스를 제한하려면 다음과 같이 하십시오.


1. `Node` 권한 부여 모드(`—권한 부여 모드=Node,RBAC`) 및 `NodeRestriction` 입장 플러그인을 활성화합니다.
2. 모든 kubelets의 자격 증명이 그룹/사용자 이름 요구 사항에 부합하는지 확인합니다.
3. apiserver 로그를 감사하여 `Node` 승인자가 kubelets의 요청을 거부하지 않는지 확인합니다(영구 `NODE DENY` 메시지가 기록되지 않음).
4. `system:node` 클러스터 역할 바인딩 삭제


### RBAC 노드 권한


1.6에서는 [RBAC Authorization mode](/docs/reference/access-authn-authz/rbac/)를 사용할 때 `system:node` 클러스터 역할이 `system:nodes` 그룹에 자동으로 바인딩되었습니다.


1.7에서는 `system:nodes` 그룹을 `system:node` 역할에 자동 바인딩하는 것이 더 이상 사용되지 않습니다
노드 승인자는 추가 제한의 이점을 가지고 동일한 목적을 달성하기 때문입니다.
보안 및 configmap 액세스. `Node`와 `RBAC` 인증 모드가 모두 활성화된 경우
`system:nodes` 그룹을 `system:node` 역할에 자동으로 바인딩하는 작업은 1.7에서 생성되지 않습니다.


1.8에서는 바인딩이 전혀 만들어지지 않습니다.


RBAC를 사용할 때 `system:node` 클러스터 역할이 계속 생성됩니다.
다른 사용자 또는 그룹을 해당 역할에 바인딩하는 배포 메서드와의 호환성을 위해 제공됩니다.

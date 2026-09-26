---
# reviewers:
# - lavalamp
# - davidopp
# - derekwaynecarr
# - erictune
# - janetkuo
# - thockin
title: 쿠버네티스의 어드미션 컨트롤
linkTitle: 어드미션 컨트롤
content_type: concept
weight: 40
---

<!-- overview -->
이 페이지는 _어드미션 컨트롤러_ 의 개요를 제공한다.

어드미션 컨트롤러는 쿠버네티스 API 서버로 전달된 요청의 인증과 인가가
완료된 후, 리소스를 영구 저장하기 전에
해당 요청을 가로채는 코드이다.

쿠버네티스의 여러 주요 기능을 올바르게 지원하려면 어드미션 컨트롤러를
활성화해야 한다. 따라서 적절한 어드미션 컨트롤러 집합으로
올바르게 구성하지 않은 쿠버네티스 API 서버는 불완전한 서버이며,
기대하는 모든 기능을 지원하지 못한다.

<!-- body -->
## 어드미션 컨트롤러란? {#what-are-they}

어드미션 컨트롤러는 쿠버네티스
{{< glossary_tooltip term_id="kube-apiserver" text="API 서버" >}}에 포함된 코드로,
리소스를 수정하는 요청에 담긴 데이터를 검사한다.

어드미션 컨트롤러는 오브젝트를 생성, 삭제 또는 수정하는 요청에 적용된다.
또한 API 서버 프록시를 통해 파드에 연결하는 요청과 같은
사용자 정의 동사를 차단할 수도 있다. 읽기 요청은 어드미션 컨트롤 계층을
거치지 않으므로, 어드미션 컨트롤러는 오브젝트를 읽는(**get**, **watch**, **list**) 요청을
차단하지 _않으며_, 차단할 수도 없다.

어드미션 컨트롤 메커니즘은 _검증(validating)_, _변형(mutating)_ 또는 두 가지 모두를 수행할 수 있다.
변형 컨트롤러는 수정 대상 리소스의 데이터를 변경할 수 있지만, 검증 컨트롤러는 변경할 수 없다.

쿠버네티스 {{< skew currentVersion >}}의 어드미션 컨트롤러는 아래
[목록](#what-does-each-admission-controller-do)으로 구성되며,
`kube-apiserver` 바이너리에 컴파일되어 포함된다. 이 컨트롤러는 클러스터
관리자만 구성할 수 있다.

### 어드미션 컨트롤 확장 지점 {#admission-control-extension-points}

전체 [목록](#what-does-each-admission-controller-do)에는 네 가지
특별한 컨트롤러가 있다.
[MutatingAdmissionWebhook](#mutatingadmissionwebhook),
[MutatingAdmissionPolicy](#mutatingadmissionpolicy),
[ValidatingAdmissionWebhook](#validatingadmissionwebhook),
[ValidatingAdmissionPolicy](#validatingadmissionpolicy)이다.
두 웹훅(webhook) 컨트롤러는 API에 구성된 변형 및 검증
[어드미션 컨트롤 웹훅](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)을
각각 실행한다. ValidatingAdmissionPolicy는 외부 HTTP 호출에 의존하지 않고
선언적인 검증 코드를 API에 포함하는 방법을 제공한다.
MutatingAdmissionPolicy는 선언적인 변형에 대해 같은 기능을 제공한다.

이 네 가지 어드미션 컨트롤러를 사용하여 어드미션 시점의
클러스터 동작을 사용자 정의할 수 있다.

### 어드미션 컨트롤 단계 {#admission-control-phases}

어드미션 컨트롤 과정은 두 단계로 진행된다. 첫 번째 단계에서는
변형 어드미션 컨트롤러를 실행한다. 두 번째 단계에서는 검증
어드미션 컨트롤러를 실행한다. 일부 컨트롤러는 두 가지 모두를
수행한다는 점에 다시 유의한다.

어느 단계에서든 컨트롤러 하나가 요청을 거부하면 전체
요청을 즉시 거부하고 최종 사용자에게 오류를 반환한다.

마지막으로, 어드미션 컨트롤러는 대상 오브젝트를 변경하는 것 외에도
부수 효과를 일으킬 수 있다. 즉, 요청 처리의 일부로 관련
리소스를 변경할 수 있다. 쿼터 사용량을 증가시키는 것이 이러한 동작이
필요한 대표적인 예이다. 특정 어드미션 컨트롤러는 해당 요청이
다른 모든 어드미션 컨트롤러를 통과할지 확실히 알 수 없으므로,
이러한 부수 효과에는 그에 대응하는 회수 또는 조정 과정이
필요하다.

이러한 호출의 순서는 아래에서 확인할 수 있다.

{{< figure src="/docs/reference/access-authn-authz/admission-control-phases.svg" alt="어드미션 단계에서 kube-apiserver가 요청을 처리하는 순서도. 변형 웹훅, ValidatingAdmissionPolicy, 검증 웹훅 순으로 실행하며, 처음으로 요청이 거부되거나 모든 검사를 통과할 때까지 진행한다. 변형 웹훅이 오브젝트를 변경하면 이전에 호출된 모든 웹훅을 다시 호출한다." class="diagram-large" link="https://mermaid.live/edit#pako:eNqtVm1r3DgQ_iuDj9CUc3aPlBa6HIFeSu_CEQhNr4XiL7I9a6srSz5J3mQb9r93RrK9jjcp9-H8xdZoXh7N80jyQ1KYEpNV4vDfDnWB76WorGgynemTE_hLbBG8AYce1kb7W_kdoVImF0rtQDjwtXQgnX7hwaJrsfBYQtmFoNr71q2Wy0r6ussXhWmWDdpGyPLsmxs-l9K5Dt3y1du3v3HJB6mlXz1kia-xwSxZZYnGzluhsiTNkgEETUCWnJ-392SmrwE-2ym4kdYa-67wxjoyedvhPs000NNn_iysFLlCFyPCVJwWHPXHpgq1f3l1_qbA11x77vIJ7_2lUcYGx7taepy5KWPaqRc8l08bj1Rx4ldZ3M2cnlp6pvf7_ckJsxVdibNPkRKiBkEof-YJAZFnQRQFOidzqaTfpSB0Ca42nSohR-jaUjB3uEW7Ay8bDAnKKAfKt4gFKMl7dIWd9uy2b_7ozdU2XY5nopUOLaWEmsopqSuSCTk770gllscBZtmQDKTR0NbCIcO647mm88Kz-Q7z2piNSym1UuaOgOY72AolCTV5jglao2Qh0YXVraUOOj34jYkWcIB_5UNB7pjwAU9BrZaaVNzRWwXTWlrHGv9GEqc6KdASc-SU3NbWR0RUDsyaA5pZBaGcmZYZluY4LA4m8KAQncOQrrW4laZztI6CxlRndKI9Rsz1VlEJqXuS9oMcWmE99aMV2sM_xARv2fA-nn53c8WzfxNtVqOnFrLlNrD3hHfna3bnN1KTisjTr8FgrPwexqMmH4WWzaW3KkSPvF9Sx61RMSA39_Anrcblxho49oLfc3txGZcdGZqxc4z3uu_wl9g7Lj6YoLedupfHcZ9H6dyYAPlgmOC66VX3s_hJ5UmOeW3U5WEzB6bOLi4CEyv4GHcOnOKiWqRQWKQdCwJaU77sCWXHEEAsrKbkkJQD_bQruHlFjcUmmlo6h-My3FCXzy34wCcG6W_eJneQdRABl5t1dwVXems2-LPYOSEH1NemlOsd76_IJ5g8vE7lGjRiieW0V0d4J819TMuI9hGnI9Zn4x5L4IDz439ER3J4CtzQEpCaXVjN6lmg88Y-kef_ATvWJiWRgPisnTDRn92DToLa2JmFyjVcSypCGBTqunDjcALk-5iKJWnSX_z0zxGukMNNT5-lsJtwq5Gf6Ly53ekiXt9pYk1X1clqTScpjeJ91f-tjFYsJd3M1_GXJvzZpAntw6_GDD77H6uICLI" >}}

## 어드미션 컨트롤러가 필요한 이유 {#why-do-i-need-them}

쿠버네티스의 여러 주요 기능을 올바르게 지원하려면 어드미션 컨트롤러를
활성화해야 한다. 따라서 적절한 어드미션 컨트롤러 집합으로
올바르게 구성하지 않은 쿠버네티스 API 서버는 불완전한 서버이며,
기대하는 모든 기능을 지원하지 못한다.

## 어드미션 컨트롤러 활성화하기 {#how-do-i-turn-on-an-admission-controller}

쿠버네티스 API 서버의 `enable-admission-plugins` 플래그는 클러스터의 오브젝트를 수정하기 전에 호출할 어드미션 컨트롤 플러그인의 목록을 쉼표로 구분하여 받는다.
예를 들어 다음 커맨드라인은 `NamespaceLifecycle`과 `LimitRanger`
어드미션 컨트롤 플러그인을 활성화한다.

```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
쿠버네티스 클러스터의 배포 방식과 API 서버의 시작 방식에 따라
설정을 적용하는 방법이 달라질 수 있다. 예를 들어 API 서버가
systemd 서비스로 배포되어 있다면 systemd 유닛 파일을 수정해야 할 수 있으며,
쿠버네티스가 자체 호스팅 방식으로 배포되어 있다면 API 서버의
매니페스트 파일을 수정해야 할 수 있다.
{{< /note >}}

## 어드미션 컨트롤러 비활성화하기 {#how-do-i-turn-off-an-admission-controller}

쿠버네티스 API 서버의 `disable-admission-plugins` 플래그는 비활성화할 어드미션 컨트롤 플러그인의 목록을 쉼표로 구분하여 받는다. 기본적으로 활성화되는 플러그인 목록에 포함되어 있어도 비활성화한다.

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

## 기본적으로 활성화되는 플러그인 {#which-plugins-are-enabled-by-default}

활성화되는 어드미션 플러그인을 확인하려면 다음을 실행한다.

```shell
kube-apiserver -h | grep enable-admission-plugins
```

쿠버네티스 {{< skew currentVersion >}}에서 기본적으로 활성화되는 플러그인은 다음과 같다.

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook
```

## 각 어드미션 컨트롤러의 역할 {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**유형**: 검증.

이 어드미션 컨트롤러는 모든 파드를 클러스터에 허용한다. 어드미션 컨트롤러가 전혀
없는 경우와 동작이 같으므로 **사용 중단(deprecated)** 되었다.

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

**유형**: 검증.

모든 요청을 거부한다. AlwaysDeny는 실질적인 의미가 없으므로 **사용 중단** 되었다.

### AlwaysPullImages {#alwayspullimages}

**유형**: 변형 및 검증.

이 어드미션 컨트롤러는 새 파드를 모두 수정하여 이미지 풀 정책을 `Always`로 강제한다. 이는 멀티테넌트(multitenant)
클러스터에서 유용하며, 사용자는 이미지를 가져올 자격 증명을 보유한 사람만 자신의
비공개 이미지를 사용할 수 있다고 확신할 수 있다. 이 어드미션 컨트롤러가 없으면 이미지가 한 번
노드에 내려받아진 이후에는 어떤 사용자의 파드라도 이미지 이름만 알면 이미지에 대한
인가 검사 없이 사용할 수 있다(파드가 해당 노드에 스케줄된다고 가정). 이 어드미션 컨트롤러를
활성화하면 컨테이너를 시작하기 전에 항상 이미지를 내려받으므로, 유효한 자격 증명이
필요하다.

### CertificateApproval {#certificateapproval}

**유형**: 검증.

이 어드미션 컨트롤러는 CertificateSigningRequest 리소스의 승인 요청을 관찰하고 추가
인가 검사를 수행하여, 승인하는 사용자가 CertificateSigningRequest 리소스의
`spec.signerName`에 지정된 인증서 요청을 **승인** 할 권한이 있는지 확인한다.

CertificateSigningRequest 리소스에 대해 여러 작업을 수행하는 데 필요한 권한의
자세한 내용은 [인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/)을 참고한다.

### CertificateSigning {#certificatesigning}

**유형**: 검증.

이 어드미션 컨트롤러는 CertificateSigningRequest 리소스의 `status.certificate` 필드 업데이트를
관찰하고 추가 인가 검사를 수행하여, 서명하는 사용자가 CertificateSigningRequest 리소스의
`spec.signerName`에 지정된 인증서 요청에 **서명** 할 권한이 있는지 확인한다.

CertificateSigningRequest 리소스에 대해 여러 작업을 수행하는 데 필요한 권한의
자세한 내용은 [인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/)을 참고한다.

### CertificateSubjectRestriction {#certificatesubjectrestriction}

**유형**: 검증.

이 어드미션 컨트롤러는 `spec.signerName`이 `kubernetes.io/kube-apiserver-client`인
CertificateSigningRequest 리소스의 생성을 관찰한다. '그룹'(또는 '조직 속성')으로
`system:masters`를 지정하는 모든 요청을 거부한다.

### DefaultIngressClass {#defaultingressclass}

**유형**: 변형.

이 어드미션 컨트롤러는 특정 인그레스 클래스를 요청하지 않는 `Ingress` 오브젝트의
생성을 관찰하고, 기본 인그레스 클래스를 자동으로 추가한다. 따라서 특별한
인그레스 클래스를 요청하지 않는 사용자는 인그레스 클래스를 전혀 신경 쓰지 않아도
기본 클래스를 사용할 수 있다.

기본 인그레스 클래스가 구성되지 않으면 이 어드미션 컨트롤러는 아무 작업도 수행하지 않는다. 두 개 이상의
인그레스 클래스가 기본값으로 표시되어 있으면 모든 `Ingress` 생성을 오류와 함께 거부하며, 관리자는
`IngressClass` 오브젝트를 다시 확인하여 하나만 기본값으로 표시해야 한다
("ingressclass.kubernetes.io/is-default-class" 어노테이션 사용). 이 어드미션 컨트롤러는
`Ingress` 업데이트를 모두 무시하며, 생성 시에만 동작한다.

인그레스 클래스와 클래스를 기본값으로 지정하는 방법에 대한 자세한 내용은
[인그레스](/docs/concepts/services-networking/ingress/) 문서를 참고한다.

### DefaultStorageClass {#defaultstorageclass}

**유형**: 변형.

이 어드미션 컨트롤러는 특정 스토리지 클래스를 요청하지 않는 `PersistentVolumeClaim` 오브젝트의 생성을
관찰하고, 기본 스토리지 클래스를 자동으로 추가한다.
따라서 특별한 스토리지 클래스를 요청하지 않는 사용자는 스토리지 클래스를 전혀 신경 쓰지 않아도
기본 클래스를 사용할 수 있다.

기본 `StorageClass`가 없으면 이 어드미션 컨트롤러는 아무 작업도 수행하지 않는다. 두 개 이상의 스토리지
클래스가 기본값으로 표시되어 있고 `storageClassName`을 설정하지 않은 `PersistentVolumeClaim`을 생성하면,
쿠버네티스는 가장 최근에 생성된 기본 `StorageClass`를 사용한다.
`volumeName`을 지정하여 `PersistentVolumeClaim`을 생성한 경우, 기본 스토리지클래스(StorageClass)를
적용한 후의 `PersistentVolumeClaim`의 `storageClassName`이 정적 볼륨의 `storageClassName`과
일치하지 않으면 해당 클레임은 Pending 상태로 유지된다.
이 어드미션 컨트롤러는 `PersistentVolumeClaim` 업데이트를 모두 무시하며, 생성 시에만 동작한다.

퍼시스턴트볼륨클레임(PersistentVolumeClaim), 스토리지 클래스 및 스토리지 클래스를 기본값으로 지정하는
방법은 [퍼시스턴트 볼륨](/docs/concepts/storage/persistent-volumes/) 문서를 참고한다.

### DefaultTolerationSeconds {#defaulttolerationseconds}

**유형**: 변형.

이 어드미션 컨트롤러는 파드에 `node.kubernetes.io/not-ready:NoExecute` 또는
`node.kubernetes.io/unreachable:NoExecute` 테인트(taint)에 대한 톨러레이션(toleration)이
아직 없는 경우, k8s-apiserver 입력 파라미터인
`default-not-ready-toleration-seconds`와 `default-unreachable-toleration-seconds`를 기준으로
`notready:NoExecute`와 `unreachable:NoExecute` 테인트를 용인하는 기본 유예 톨러레이션을 설정한다.
`default-not-ready-toleration-seconds`와 `default-unreachable-toleration-seconds`의 기본값은 5분이다.

### DenyServiceExternalIPs

**유형**: 검증.

이 어드미션 컨트롤러는 `Service`의 `externalIPs` 필드를 새로 사용하는 모든 요청을 거부한다.
이 기능은 네트워크 트래픽 가로채기를 허용하는 매우 강력한 기능이며,
정책으로 충분히 제어되지 않는다. 컨트롤러를 활성화하면 클러스터 사용자는
`externalIPs`를 사용하는 새 서비스를 생성하거나, 기존 `Service` 오브젝트의
`externalIPs`에 새 값을 추가할 수 없다. 기존의 `externalIPs` 사용에는
영향이 없으며, 기존 `Service` 오브젝트의 `externalIPs`에서 값을 제거할 수는 있다.

대부분의 사용자는 이 기능이 전혀 필요하지 않으므로 클러스터 관리자는 비활성화를 고려해야 한다.
이 기능을 사용해야 하는 클러스터에서는 사용자 정의 정책으로 사용을 관리하는
방법을 고려해야 한다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

**유형**: 검증.

이 어드미션 컨트롤러는 새 이벤트(Event)를 저장하는 요청이 API 서버에
폭주하는 문제를 완화한다. 클러스터 관리자는 다음과 같이 이벤트 속도 제한을 지정할 수 있다.

* `EventRateLimit` 어드미션 컨트롤러를 활성화한다.
* API 서버의 커맨드라인 플래그 `--admission-control-config-file`에 제공한 파일에서
  `EventRateLimit` 구성 파일을 참조한다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: EventRateLimit
    path: eventconfig.yaml
...
```

구성에는 네 가지 유형의 제한을 지정할 수 있다.

 * `Server`: API 서버가 받은 모든 이벤트 요청(생성 또는 수정)이 하나의 버킷(bucket)을 공유한다.
 * `Namespace`: 각 네임스페이스가 전용 버킷을 가진다.
 * `User`: 각 사용자에게 버킷을 할당한다.
 * `SourceAndObject`: 이벤트의 소스와 관련 오브젝트의 각 조합에
   버킷을 할당한다.

다음은 이러한 구성을 위한 `eventconfig.yaml` 예시이다.

```yaml
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
  - type: Namespace
    qps: 50
    burst: 100
    cacheSize: 2000
  - type: User
    qps: 10
    burst: 50
```

자세한 내용은 [EventRateLimit 구성 API(v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)를
참고한다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

### ExtendedResourceToleration {#extendedresourcetoleration}

**유형**: 변형.

이 플러그인은 확장 리소스가 있는 전용 노드의 생성을 돕는다.
운영자가 GPU, FPGA 등 확장 리소스가 있는 전용 노드를 생성하려면, 확장 리소스의 이름을
키로 사용하여 [노드에 테인트를 설정](/docs/concepts/scheduling-eviction/taint-and-toleration/#유스케이스-예시)해야 한다.
이 어드미션 컨트롤러를 활성화하면 확장 리소스를 요청하는 파드에
해당 테인트의 톨러레이션을 자동으로 추가하므로, 사용자가 이 톨러레이션을
수동으로 추가할 필요가 없다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

### ImagePolicyWebhook {#imagepolicywebhook}

**유형**: 검증.

ImagePolicyWebhook 어드미션 컨트롤러는 백엔드 웹훅이 어드미션 결정을 내릴 수 있도록 한다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

#### 구성 파일 형식 {#imagereview-config-file-format}

ImagePolicyWebhook은 구성 파일을 사용하여 백엔드 동작의 옵션을 설정한다.
이 파일은 JSON 또는 YAML 형식일 수 있으며, 다음과 같은 형식을 사용한다.

```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # time in s to cache approval
  allowTTL: 50
  # time in s to cache denial
  denyTTL: 50
  # time in ms to wait between retries
  retryBackoff: 500
  # determines behavior if the webhook backend fails
  defaultAllow: true
```

API 서버의 커맨드라인 플래그 `--admission-control-config-file`에 제공한 파일에서 ImagePolicyWebhook 구성 파일을 참조한다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    path: imagepolicyconfig.yaml
...
```

또는 파일에 구성을 직접 포함할 수 있다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    configuration:
      imagePolicy:
        kubeConfigFile: <path-to-kubeconfig-file>
        allowTTL: 50
        denyTTL: 50
        retryBackoff: 500
        defaultAllow: true
```

ImagePolicyWebhook 구성 파일은 백엔드 연결을 설정하는
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
형식의 파일을 참조해야 한다.
백엔드는 반드시 TLS를 통해 통신해야 한다.

kubeconfig 파일의 `cluster` 필드는 원격 서비스를 가리켜야 하며, `user` 필드는
반환된 인가자를 포함해야 한다.

```yaml
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-imagepolicy-service
    cluster:
      certificate-authority: /path/to/ca.pem    # CA for verifying the remote service.
      server: https://images.example.com/policy # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook admission controller to use
      client-key: /path/to/key.pem          # key matching the cert
```

추가 HTTP 구성은
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 문서를 참고한다.

#### 요청 페이로드(payload) {#request-payloads}

어드미션 결정이 필요하면 API 서버는 작업을 설명하는
`imagepolicy.k8s.io/v1alpha1` `ImageReview` 오브젝트를 JSON으로 직렬화하여 POST 요청으로 보낸다.
이 오브젝트에는 허용 여부를 결정할 컨테이너를 설명하는 필드와
`*.image-policy.k8s.io/*`에 일치하는 모든 파드 어노테이션이 포함된다.

{{< note >}}
웹훅 API 오브젝트에는 다른 쿠버네티스 API 오브젝트와 동일한 버전
호환성 규칙이 적용된다. 구현자는 알파 오브젝트의 호환성 보장이 더 느슨함에
유의하고, 올바르게 역직렬화할 수 있도록 요청의 `apiVersion` 필드를
확인해야 한다.
또한 API 서버에서 `imagepolicy.k8s.io/v1alpha1` API 익스텐션(extension)
그룹을 활성화해야 한다(`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
{{< /note >}}

요청 본문의 예시는 다음과 같다.

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "spec": {
    "containers": [
      {
        "image": "myrepo/myimage:v1"
      },
      {
        "image": "myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations": {
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace": "mynamespace"
  }
}
```

원격 서비스는 요청의 `status` 필드를 채워 접근을 허용하거나
허용하지 않는 응답을 반환해야 한다. 응답 본문의 `spec` 필드는 무시되며
생략할 수 있다. 접근을 허용하는 응답은 다음과 같다.

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

접근을 허용하지 않으려면 서비스는 다음과 같이 반환한다.

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

{{< note >}}
`ImageReview` 오브젝트에는 파드에서 컨테이너로 실행할 모든 이미지가
포함된다. 파드 명세의 containers,
initContainers, ephemeralContainers 필드에 지정된 이미지가 이에 해당한다.
따라서 이미지 볼륨에 포함된 이미지는
ImagePolicyWebhook의 적용 범위에 포함되지 않는다.
{{< /note >}}

자세한 문서는
[`imagepolicy.v1alpha1` API](/docs/reference/config-api/imagepolicy.v1alpha1/)를 참고한다.

#### 어노테이션으로 확장하기 {#extending-with-annotations}

파드의 어노테이션 중 `*.image-policy.k8s.io/*`에 일치하는 것은 모두 웹훅으로 전송된다.
어노테이션을 전송하면 이미지 정책 백엔드를 알고 있는 사용자가
추가 정보를 보낼 수 있으며, 백엔드 구현에 따라
서로 다른 정보를 받을 수 있다.

여기에 포함할 수 있는 정보의 예시는 다음과 같다.

* 비상시에 정책을 재정의하기 위한 "긴급 접근(break glass)" 요청.
* 긴급 접근 요청을 기록한 티켓 시스템의 티켓 번호.
* 정책 서버가 별도로 조회하지 않도록 제공된 이미지의 imageID에 대한 힌트.

어떤 경우든 어노테이션은 사용자가 제공하며, 쿠버네티스는 이를 어떠한 방식으로도 검증하지 않는다.

### LimitPodHardAntiAffinityTopology {#limitpodhardantiaffinitytopology}

**유형**: 검증.

이 어드미션 컨트롤러는 `requiredDuringSchedulingIgnoredDuringExecution`에서
`kubernetes.io/hostname` 이외의 `AntiAffinity` 토폴로지 키를 정의하는 모든 파드를 거부한다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

### LimitRanger {#limitranger}

**유형**: 변형 및 검증.

이 어드미션 컨트롤러는 수신 요청을 관찰하고 `Namespace`의 `LimitRange` 오브젝트에
나열된 제약 조건을 위반하지 않는지 확인한다. 쿠버네티스 배포에서
`LimitRange` 오브젝트를 사용한다면 이러한 제약을 적용하기 위해 이 어드미션 컨트롤러를
반드시 사용해야 한다. LimitRanger는 리소스 요청을 지정하지 않은 파드에 기본 리소스 요청을
적용하는 데 사용할 수도 있다. 현재 기본 LimitRanger는 `default` 네임스페이스의 모든
파드에 0.1 CPU 요구량을 적용한다.

자세한 내용은 [리밋레인지(LimitRange) API 레퍼런스](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)와
[리밋레인지 예시](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)를
참고한다.

### MutatingAdmissionPolicy {#mutatingadmissionpolicy}

**유형**: 변형.

[이 어드미션 컨트롤러](/docs/reference/access-authn-authz/mutating-admission-policy/)는 일치하는 수신 요청에 대해
선언적인 프로세스 내부 변형을 구현한다. 변형은 어플라이 구성이나 JSON 패치를 사용하여
일치하는 오브젝트를 수정하는 CEL 표현식으로 정의된다.
외부 HTTP 호출에 의존하지 않으면서
[MutatingAdmissionWebhook](#mutatingadmissionwebhook)보다 지연 시간이 짧은
대안을 제공한다.
MutatingAdmissionPolicy 중 하나라도 실패하면 요청이 실패한다.

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

**유형**: 변형.

이 어드미션 컨트롤러는 요청과 일치하는 모든 변형 웹훅을 호출한다. 일치하는
웹훅은 순차적으로 호출되며, 각 웹훅은 필요에 따라 오브젝트를 수정할 수 있다.

이 어드미션 컨트롤러는 이름에서 알 수 있듯이 변형 단계에서만 실행된다.

이 컨트롤러가 호출한 웹훅에 부수 효과(예: 쿼터 감소)가 있다면,
뒤이어 실행되는 웹훅이나 검증 어드미션 컨트롤러가 요청 완료를 허용한다고
보장할 수 없으므로 *반드시* 조정 시스템이 있어야 한다.

MutatingAdmissionWebhook을 비활성화하면 `--runtime-config` 플래그를 통해
`admissionregistration.k8s.io/v1` 그룹/버전의 `MutatingWebhookConfiguration`
오브젝트도 비활성화해야 한다. 두 가지 모두 기본적으로 활성화되어 있다.

#### 변형 웹훅 작성 및 설치 시 주의 사항 {#use-caution-when-authoring-and-installing-mutating-webhooks}

* 생성하려던 오브젝트와 반환받은 오브젝트가 다르면
  사용자가 혼란을 느낄 수 있다.
* 기본 제공 제어 루프가 생성하려던 오브젝트와 다시 읽은 오브젝트가
  다르면 제어 루프가 정상 동작하지 않을 수 있다.
  * 원래 설정되지 않은 필드를 설정하는 것이 원래 요청에서 설정된 필드를
    덮어쓰는 것보다 문제를 일으킬 가능성이 낮다. 후자는 피한다.
* 기본 제공 리소스나 서드파티 리소스의 제어 루프가 향후 변경되면
  현재 잘 동작하는 웹훅도 동작하지 않을 수 있다. 웹훅 설치 API가
  확정되더라도 가능한 모든 웹훅 동작이 무기한 지원된다고
  보장되지는 않는다.

### NamespaceAutoProvision {#namespaceautoprovision}

**유형**: 변형.

이 어드미션 컨트롤러는 네임스페이스에 속하는 리소스에 대한 모든 수신 요청을 검사하고,
참조하는 네임스페이스가 존재하는지 확인한다.
네임스페이스를 찾을 수 없으면 생성한다.
이 어드미션 컨트롤러는 사용 전에 네임스페이스를 미리 생성하도록
제한하고 싶지 않은 배포 환경에서 유용하다.

### NamespaceExists {#namespaceexists}

**유형**: 검증.

이 어드미션 컨트롤러는 `Namespace` 자체를 제외한 네임스페이스 범위 리소스의 모든 요청을 검사한다.
요청에서 참조하는 네임스페이스가 존재하지 않으면 요청을 거부한다.

### NamespaceLifecycle {#namespacelifecycle}

**유형**: 검증.

이 어드미션 컨트롤러는 종료 중인 `Namespace`에 새 오브젝트를 생성하지 못하도록
하고, 존재하지 않는 `Namespace`에 대한 요청을 거부한다.
또한 시스템용으로 예약된 세 네임스페이스인 `default`,
`kube-system`, `kube-public`의 삭제를 방지한다.

`Namespace`를 삭제하면 해당 네임스페이스의 모든 오브젝트(파드, 서비스 등)를
제거하는 일련의 작업이 시작된다. 이 과정의 무결성을 보장하려면
이 어드미션 컨트롤러를 실행할 것을 강력히 권장한다.

### NodeDeclaredFeatureValidator {#nodedeclaredfeaturevalidator}

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

**유형**: 검증.

이 어드미션 컨트롤러는 바인딩된 파드에 대한 쓰기를 가로채어,
변경 사항이 파드가 현재 실행 중인 노드에서 선언한 기능과
호환되는지 확인한다. 노드의 `.status.declaredFeatures` 필드를 사용하여
활성화된 기능 집합을 확인한다. 파드 업데이트에 현재 노드의 기능
목록에 없는 기능이 필요하면, 어드미션 컨트롤러는
업데이트 요청을 거부한다. 이를 통해 파드가 스케줄된 후 기능
불일치로 인해 런타임 오류가 발생하는 것을 방지한다.

이 어드미션 컨트롤러는 [`NodeDeclaredFeatures`](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures) 기능 게이트를
활성화하면 기본적으로 활성화된다.

### NodeRestriction {#noderestriction}

**유형**: 검증.

이 어드미션 컨트롤러는 kubelet이 수정할 수 있는 `Node`와 `Pod` 오브젝트를 제한한다. 이 어드미션 컨트롤러의 제한을 받으려면,
kubelet은 `system:node:<nodeName>` 형식의 사용자 이름으로 `system:nodes` 그룹의 자격 증명을 사용해야 한다.
이러한 kubelet은 자신의 `Node` API 오브젝트와 자신의 노드에 바인딩된 `Pod` API 오브젝트만 수정할 수 있다.
kubelet은 자신의 `Node` API 오브젝트에서 테인트를 업데이트하거나 제거할 수 없다.

`NodeRestriction` 어드미션 플러그인은 kubelet이 자신의 `Node` API 오브젝트를 삭제하지 못하도록 하며,
`kubernetes.io/` 또는 `k8s.io/` 접두사 아래의 레이블 수정에 다음과 같은 제한을 적용한다.

* **금지**(kubelet은 이 레이블을 수정할 수 없음)
  * `node-restriction.kubernetes.io/` 접두사를 사용하는 레이블. 이 접두사는 관리자가 워크로드 격리를 위해 `Node` 오브젝트에 레이블을 지정하는 용도로 예약되어 있다.
  * `node-role.kubernetes.io/` 접두사를 사용하는 레이블(예: `node-role.kubernetes.io/control-plane`). 권한이 없는 노드가 클러스터 역할을 스스로 선언하지 못하도록 제한한다.
* **허용**(kubelet이 추가, 제거, 업데이트할 수 있음)
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region`(사용 중단)
  * `failure-domain.beta.kubernetes.io/zone`(사용 중단)
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/` 접두사를 사용하는 레이블
  * `node.kubernetes.io/` 접두사를 사용하는 레이블
* **예약됨**
  kubelet이 `kubernetes.io` 또는 `k8s.io` 접두사 아래의 다른 레이블을 사용하는 것은 예약되어 있다.
  `NodeRestriction` 어드미션 플러그인은 인가되지 않은 자체 레이블 지정을 방지하기 위해 일반적으로 이를 허용하지 않지만,
  향후 기능의 일부로 이러한 접두사 아래에 추가 레이블을 허용할 수 있다.

`ServiceAccountNodeAudienceRestriction` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
활성화하면, 이 어드미션 플러그인은 kubelet이 `TokenRequest` API를 통해 서비스 어카운트 토큰을
요청할 수 있는 오디언스(audience)도 제한한다. kubelet은 해당 노드의 파드에서 이미
참조하는 오디언스(프로젝티드 서비스 어카운트 토큰 볼륨 또는 CSI 드라이버 토큰 요청으로 참조)나,
RBAC의 `request-serviceaccounts-token-audience` 동사를 통해 명시적으로
허용된 오디언스에 대해서만 토큰을 요청할 수 있다. 자세한 내용은
[서비스 어카운트 토큰 오디언스 제한](/docs/reference/access-authn-authz/node/#service-account-token-audience-restriction)을 참고한다.

향후 버전에서는 kubelet이 올바르게 동작하는 데 필요한 최소 권한만 갖도록
추가 제한이 적용될 수 있다.

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

**유형**: 검증.

이 어드미션 컨트롤러는 오브젝트에 대한 **delete** 권한을 가진 사용자만
`metadata.ownerReferences`를 변경할 수 있도록 해당 필드에 대한 접근을 보호한다.
또한 참조된 *소유자(owner)* 의 `finalizers` 하위 리소스에 대한
**update** 권한을 가진 사용자만 오브젝트의 `metadata.ownerReferences[x].blockOwnerDeletion`을
변경할 수 있도록 해당 필드에 대한 접근을 보호한다.

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

**유형**: 검증.

이 어드미션 컨트롤러는 수신되는 `PersistentVolumeClaim` 크기 조정 요청을
확인하기 위한 추가 검증을 구현한다.

`PersistentVolumeClaimResize` 어드미션 컨트롤러를 활성화할 것을 권장한다.
이 어드미션 컨트롤러는 클레임의 `StorageClass`에서 `allowVolumeExpansion`을 `true`로
설정하여 크기 조정을 명시적으로 활성화하지 않는 한, 기본적으로 모든 클레임의 크기 조정을 차단한다.

예를 들어 다음 `StorageClass`에서 생성된 모든 `PersistentVolumeClaim`은 볼륨 확장을 지원한다.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

퍼시스턴트볼륨클레임에 대한 자세한 내용은 [퍼시스턴트볼륨클레임](/docs/concepts/storage/persistent-volumes/#퍼시스턴트볼륨클레임)을 참고한다.

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

**유형**: 검증.

이 어드미션 컨트롤러는 네임스페이스 어노테이션과 전역 구성을 읽어,
네임스페이스 내에서 사용할 노드 셀렉터의 기본값을 설정하고 사용 범위를 제한한다.

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

#### 구성 파일 형식 {#configuration-file-format}

`PodNodeSelector`는 구성 파일을 사용하여 백엔드 동작의 옵션을 설정한다.
향후 릴리스에서는 구성 파일 형식이 버전이 지정된 파일로 바뀔 예정임에 유의한다.
이 파일은 JSON 또는 YAML 형식일 수 있으며, 다음과 같은 형식을 사용한다.

```yaml
podNodeSelectorPluginConfig:
  clusterDefaultNodeSelector: name-of-node-selector
  namespace1: name-of-node-selector
  namespace2: name-of-node-selector
```

API 서버의 커맨드라인 플래그 `--admission-control-config-file`에 제공한 파일에서
`PodNodeSelector` 구성 파일을 참조한다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```

#### 구성 어노테이션 형식 {#configuration-annotation-format}

`PodNodeSelector`는 `scheduler.alpha.kubernetes.io/node-selector` 어노테이션 키를 사용하여
네임스페이스에 노드 셀렉터를 할당한다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: name-of-node-selector
  name: namespace3
```

#### 내부 동작 {#internal-behavior}

이 어드미션 컨트롤러는 다음과 같이 동작한다.

1. `Namespace`에 `scheduler.alpha.kubernetes.io/node-selector` 키의 어노테이션이 있으면,
   해당 값을 노드 셀렉터로 사용한다.
2. 네임스페이스에 해당 어노테이션이 없으면, `PodNodeSelector` 플러그인 구성 파일에 정의된
   `clusterDefaultNodeSelector`를 노드 셀렉터로 사용한다.
3. 파드의 노드 셀렉터와 네임스페이스의 노드 셀렉터가 충돌하는지 검사한다.
   충돌하면 거부한다.
4. 파드의 노드 셀렉터를 플러그인 구성 파일에 정의된 네임스페이스별 허용 셀렉터와
   비교한다. 충돌하면 거부한다.

{{< note >}}
PodNodeSelector를 사용하면 파드가 특정 레이블을 가진 노드에서 실행되도록 강제할 수 있다. 특정 테인트가
있는 노드에서 파드가 실행되지 않도록 하는 PodTolerationRestriction 어드미션 플러그인도 참고한다.
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

**유형**: 검증.

PodSecurity 어드미션 컨트롤러는 새 파드를 허용하기 전에
검사하고, 요청한 시큐리티 컨텍스트와 파드가 속할 네임스페이스에
허용된 [파드 시큐리티 표준](/docs/concepts/security/pod-security-standards/)의
제한을 기준으로 해당 파드를 허용할지 결정한다.

자세한 내용은 [파드 시큐리티 어드미션](/docs/concepts/security/pod-security-admission/)
문서를 참고한다.

PodSecurity는 PodSecurityPolicy라는 이전 어드미션 컨트롤러를 대체했다.

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

**유형**: 변형 및 검증.

PodTolerationRestriction 어드미션 컨트롤러는 파드의 톨러레이션과
해당 네임스페이스의 톨러레이션 사이에 충돌이 있는지 확인한다.
충돌이 있으면 파드 요청을 거부한다.
그런 다음 네임스페이스에 어노테이션으로 지정된 톨러레이션을 파드의 톨러레이션에 합친다.
결과로 얻은 톨러레이션을 네임스페이스에 어노테이션으로 지정된 허용 톨러레이션 목록과 비교한다.
검사를 통과하면 파드 요청을 허용하고, 그렇지 않으면 거부한다.

파드의 네임스페이스에 기본 톨러레이션이나 허용 톨러레이션이 어노테이션으로
지정되어 있지 않으면, 클러스터 수준의 기본 톨러레이션이나 허용 톨러레이션 목록이
지정된 경우 이를 대신 사용한다.

네임스페이스의 톨러레이션은 `scheduler.alpha.kubernetes.io/defaultTolerations` 어노테이션 키로 할당한다.
허용 톨러레이션 목록은 `scheduler.alpha.kubernetes.io/tolerationsWhitelist` 어노테이션 키로 추가할 수 있다.

네임스페이스 어노테이션의 예시는 다음과 같다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

이 어드미션 컨트롤러는 기본적으로 비활성화되어 있다.

### PodTopologyLabels {#podtopologylabels}

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

**유형**: 변형

PodTopologyLabels 어드미션 컨트롤러는 노드에 바인딩된 모든 파드의
`pods/binding` 하위 리소스를 변형하여, 바인딩된 노드와 일치하는 토폴로지 레이블을 추가한다.
이를 통해 노드의 토폴로지 레이블을 파드 레이블로 사용할 수 있으며,
[다운워드(Downward) API](/docs/concepts/workloads/pods/downward-api/)를 사용하여
실행 중인 컨테이너에 노출할 수 있다.
이 컨트롤러를 통해 사용할 수 있는 레이블은
[topology.kubernetes.io/region](/docs/reference/labels-annotations-taints/#topologykubernetesioregion)과
[topology.kubernetes.io/zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)이다.

{{<note>}}
변형 어드미션 웹훅이 `pods/binding` 하위 리소스의 레이블을 추가하거나 수정하면,
이 컨트롤러에 의해 해당 변경 사항이 파드 레이블에 전파되며,
키가 충돌하는 레이블을 덮어쓴다.
{{</note>}}

이 어드미션 컨트롤러는 `PodTopologyLabelsAdmission` 기능 게이트를 활성화하면 활성화된다.

### Priority {#priority}

**유형**: 변형 및 검증.

Priority 어드미션 컨트롤러는 `priorityClassName` 필드를 사용하여 우선순위의
정숫값을 채운다.
우선순위 클래스를 찾을 수 없으면 파드를 거부한다.

### ResourceQuota {#resourcequota}

**유형**: 검증.

이 어드미션 컨트롤러는 수신 요청을 관찰하고 `Namespace`의 `ResourceQuota` 오브젝트에
나열된 제약 조건을 위반하지 않는지 확인한다. 쿠버네티스 배포에서
`ResourceQuota` 오브젝트를 사용한다면 쿼터 제약을 적용하기 위해
이 어드미션 컨트롤러를 반드시 사용해야 한다.

자세한 내용은 [리소스쿼터(ResourceQuota) API 레퍼런스](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)와
[리소스 쿼터 예시](/docs/concepts/policy/resource-quotas/)를 참고한다.

### RuntimeClass {#runtimeclass}

**유형**: 변형 및 검증.

[파드 오버헤드](/docs/concepts/scheduling-eviction/pod-overhead/)를 구성한 런타임클래스(RuntimeClass)를
정의하면, 이 어드미션 컨트롤러가 수신되는 파드를 검사한다.
이 어드미션 컨트롤러를 활성화하면 오버헤드가 이미 설정된
모든 파드 생성 요청을 거부한다.
`.spec`에 런타임클래스를 구성하고 선택한 파드의 경우,
이 어드미션 컨트롤러는 해당 런타임클래스에 정의된 값을 기준으로
파드의 `.spec.overhead`를 설정한다.

자세한 내용은 [파드 오버헤드](/docs/concepts/scheduling-eviction/pod-overhead/)도
참고한다.

### ServiceAccount {#serviceaccount}

**유형**: 변형 및 검증.

이 어드미션 컨트롤러는
[서비스어카운트(ServiceAccount)](/docs/tasks/configure-pod-container/configure-service-account/)를 위한 자동화를 구현한다.
쿠버네티스 프로젝트는 이 어드미션 컨트롤러의 활성화를 강력히 권장한다.
쿠버네티스 `ServiceAccount` 오브젝트를 사용하려면
이 어드미션 컨트롤러를 활성화해야 한다.

시크릿(Secret)의 보안을 강화하려면, 별도의 네임스페이스를 사용하여 마운트된 시크릿에 대한 접근을 격리한다.

### StorageObjectInUseProtection

**유형**: 변형.

`StorageObjectInUseProtection` 플러그인은 새로 생성된 퍼시스턴트볼륨클레임(PVC) 또는 퍼시스턴트볼륨(PersistentVolume, PV)에
`kubernetes.io/pvc-protection` 또는 `kubernetes.io/pv-protection` 파이널라이저(finalizer)를 추가한다.
사용자가 PVC 또는 PV를 삭제하더라도, PVC 또는 PV 보호 컨트롤러가 해당
PVC 또는 PV에서 파이널라이저를 제거할 때까지 PVC 또는 PV는 제거되지 않는다.
자세한 내용은
[사용 중인 스토리지 오브젝트 보호](/docs/concepts/storage/persistent-volumes/#사용-중인-스토리지-오브젝트-보호)를
참고한다.

### TaintNodesByCondition {#taintnodesbycondition}

**유형**: 변형.

이 어드미션 컨트롤러는 새로 생성된 노드에 `NotReady`와 `NoSchedule`
{{< glossary_tooltip text="테인트" term_id="taint" >}}를 설정한다. 이를 통해 보고된 상태를 정확히 반영하도록
새 노드의 테인트를 업데이트하기 전에 파드가 해당 노드에 스케줄될 수 있는
경쟁 상태를 방지한다.

### ValidatingAdmissionPolicy {#validatingadmissionpolicy}

**유형**: 검증.

[이 어드미션 컨트롤러](/docs/reference/access-authn-authz/validating-admission-policy/)는 일치하는 수신 요청에 대한 CEL 검증을 구현한다.
`validatingadmissionpolicy` 기능 게이트와 `admissionregistration.k8s.io/v1alpha1` 그룹/버전을 모두 활성화하면 활성화된다.
ValidatingAdmissionPolicy 중 하나라도 실패하면 요청이 실패한다.

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

**유형**: 검증.

이 어드미션 컨트롤러는 요청과 일치하는 모든 검증 웹훅을 호출한다. 일치하는
웹훅은 병렬로 호출되며, 하나라도 요청을 거부하면 요청이
실패한다. 이 어드미션 컨트롤러는 검증 단계에서만 실행된다. `MutatingAdmissionWebhook` 어드미션
컨트롤러가 호출하는 웹훅과 달리, 이 컨트롤러가 호출하는 웹훅은 오브젝트를 변경할 수 없다.

이 컨트롤러가 호출한 웹훅에 부수 효과(예: 쿼터 감소)가 있다면,
뒤이어 실행되는 웹훅이나 다른 검증 어드미션 컨트롤러가 요청 완료를 허용한다고
보장할 수 없으므로 *반드시* 조정 시스템이 있어야 한다.

ValidatingAdmissionWebhook을 비활성화하면 `--runtime-config` 플래그를 통해
`admissionregistration.k8s.io/v1` 그룹/버전의 `ValidatingWebhookConfiguration`
오브젝트도 비활성화해야 한다.

## 권장하는 어드미션 컨트롤러 집합 {#is-there-a-recommended-set-of-admission-controllers-to-use}

권장하는 어드미션 컨트롤러는 기본적으로 활성화되어 있으므로
([여기](/docs/reference/command-line-tools-reference/kube-apiserver/#options)에 표시됨),
명시적으로 지정할 필요가 없다.
`--enable-admission-plugins` 플래그를 사용하면 기본 집합 외에 추가 어드미션 컨트롤러를
활성화할 수 있다(**순서는 중요하지 않다**).

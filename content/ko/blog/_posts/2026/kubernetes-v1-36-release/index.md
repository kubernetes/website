---
layout: blog
title: "쿠버네티스 v1.36: ハル (Haru)"
date: 2026-04-22
evergreen: true
slug: kubernetes-v1-36-release
author: >
  [쿠버네티스 v1.36 릴리스 팀](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
translator: >
  [Jaehan Byun(Supergate)](https://github.com/jaehanbyun), [Ian Y. Choi (AWS)](https://github.com/ianychoi), [Seokho Son (ETRI)](https://github.com/seokho-son), [쿠버네티스 문서 한글화 팀](https://kubernetes.slack.com/archives/CA1MMR86S)
release_announcement:
  minor_version: "1.36"
---

**편집자:** Chad M. Crowell, Kirti Goyal, Sophia Ugochukwu, Swathi Rao, Utkarsh Umre

이전 릴리스와 마찬가지로 쿠버네티스 v1.36 릴리스에는 새로운 스테이블(Stable), 베타(Beta), 알파(Alpha) 기능이 포함되었습니다. 고품질 릴리스를 꾸준히 제공할 수 있는 것은 쿠버네티스 개발 주기의 강력함과 활발한 커뮤니티 덕분입니다.

이번 릴리스에는 70개의 개선 사항이 있습니다. 그중 18개는 스테이블로 승격되었고, 25개는 베타, 25개는 알파 단계에 진입했습니다.

이번 릴리스에는 [사용 중단(deprecation) 및 제거(removal)](#deprecations-removals-and-community-updates)도 있으니 꼭 확인하시기 바랍니다.

## 릴리스 테마와 로고

{{< figure src="k8s-v1.36.svg" alt="쿠버네티스 v1.36 Haru 로고: 육각형 배지 안에 v1.36 아래로 흐르는 글씨체의 Haru 제목이 있다. 오른쪽에는 후지산이 솟아 있고, 봉우리는 붉게 빛나며 옅은 눈 자국이 있다. 일본 서예 晴れに翔け가 산비탈을 따라 쓰여 있다. 왼쪽 푸른 하늘에는 흰색 쿠버네티스 심볼이 우키요에 양식의 구름 사이에 떠 있다. 앞쪽에는 한 쌍의 수호자처럼 두 마리 고양이가 있는데, 왼쪽에는 회색과 흰색 고양이, 오른쪽에는 주황색 얼룩 고양이가 있으며 각각 작은 파란색 쿠버네티스 심볼 장식이 달린 목걸이를 하고 있다" class="release-logo" >}}

우리는 계절이 바뀌고 산 위의 빛이 달라지는 때에 찾아온 쿠버네티스 v1.36과 함께 2026년을 시작합니다. ハル(_Haru_)는 여러 의미를 담은 일본어 발음입니다. 그중에서도 우리가 특히 주목한 의미는 春(봄), 晴れ(_hare_, 맑은 하늘), 遥か(_haruka_, 아득한, 먼)입니다. 계절, 하늘, 지평선. 이 세 가지는 이어지는 이야기 곳곳에 담겨 있습니다.

[avocadoneko / Natsuho Ide](https://x.com/avocadoneko)가 제작한 이 로고는 [가쓰시카 호쿠사이](https://en.wikipedia.org/wiki/Hokusai)의 [_후가쿠 36경_](https://en.wikipedia.org/wiki/Thirty-six_Views_of_Mount_Fuji)(富嶽三十六景, _Fugaku Sanjūrokkei_)에서 영감을 받았습니다. 이 연작은 세계적으로 알려진 [_가나가와 해변의 높은 파도 아래_](https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa)를 낳은 바로 그 작품군입니다. v1.36 로고는 이 연작에서 가장 유명한 판화 중 하나인 [_개풍쾌청_](https://en.wikipedia.org/wiki/Fine_Wind,_Clear_Morning)(凱風快晴, _Gaifū Kaisei_), 일명 붉은 후지(赤富士, _Aka Fuji_)를 새롭게 해석합니다. 긴 해빙 뒤 눈이 사라진 산이 여름 새벽에 붉게 빛나는 모습입니다. 36이라는 숫자는 v1.36과 잘 어울리는 숫자였고, 호쿠사이조차 거기에서 멈추지 않았다는 사실을 떠올리게 합니다.<sup>1</sup> 쿠버네티스 심볼은 산과 나란히 하늘에 자리 잡고 이 장면을 지켜봅니다.

후지산 기슭에는 목걸이에 쿠버네티스 심볼이 달린 두 마리 고양이 Stella(왼쪽)와 Nacho(오른쪽)가 앉아 일본 신사를 지키는 한 쌍의 사자개 수호자인 [_고마이누_](https://en.wikipedia.org/wiki/Komainu)의 역할을 대신합니다. 이들이 한 쌍으로 그려진 것은, 지키는 일에는 언제나 함께하는 존재가 필요하기 때문입니다. Stella와 Nacho는 SIG와 워킹 그룹, 메인테이너와 리뷰어, 문서와 블로그와 번역 뒤의 사람들, 릴리스 팀, 첫발을 내딛는 신규 기여자, 계절마다 돌아오는 평생 기여자 등 훨씬 더 큰 공동체를 상징합니다. 쿠버네티스 v1.36은 언제나처럼 많은 손에 의해 떠받쳐지고 있습니다.

붉은 후지 위에 붓글씨로 쓰인 晴れに翔け(_hare ni kake_)는 "맑은 하늘로 날아오르다"라는 뜻입니다. 산에 다 담기에는 너무 길었던 한 쌍의 구절 중 앞부분입니다.

> **晴れに翔け、未来よ明け**\
> _hare ni kake, asu yo ake_\
> "맑은 하늘로 날아오르라. 내일의 해돋이를 향해."<sup>2</sup>

이것이 우리가 이번 릴리스에 담은 바람입니다. 릴리스 자체를 위해, 프로젝트를 위해, 그리고 함께 릴리스를 만드는 모든 사람이 맑은 하늘로 날아오르기를 바라는 마음입니다. 붉은 후지 위로 밝아오는 새벽은 끝이 아니라 통과점입니다. 이번 릴리스는 우리를 다음 릴리스로, 그다음 릴리스로, 어떤 단일한 풍경으로도 담을 수 없는 훨씬 먼 지평선으로 데려갑니다.

<sub>1. 이 연작은 큰 인기를 얻어 호쿠사이가 열 점을 더 추가했고, 총 마흔여섯 점이 되었습니다.</sub>\
<sub>2. 未来는 가장 넓은 의미의 "미래"를 뜻하며, 단지 내일이 아니라 아직 오지 않은 모든 것을 의미합니다. 보통 *mirai*로 읽지만, 여기서는 비격식 읽기인 *asu*를 사용합니다.</sub>

## 주요 업데이트 하이라이트

쿠버네티스 v1.36에는 새로운 기능과 개선 사항이 많습니다. 릴리스팀이
강조하고 싶은 주요 업데이트 몇 가지를 소개합니다.

### 스테이블: 세분화된 API 권한 부여

쿠버네티스 SIG Auth와 SIG Node를 대표하여, 세분화된 `kubelet` API 권한 부여가
쿠버네티스 v1.36에서 GA로 승격되었음을
알리게 되어 기쁩니다.

`KubeletFineGrainedAuthz` 기능 게이트는 쿠버네티스 v1.32에서 선택적으로 활성화하는 알파 기능으로
도입되었고, 이어서 v1.33에서 베타(기본 활성화)로 승격되었습니다.
이제 이 기능은 스테이블입니다.
이 기능은 일반적인 모니터링과 관측가능성 유스케이스에서
지나치게 광범위한 nodes/proxy 권한을 부여할 필요를 없애고,
kubelet의 HTTPS API에 대해 더 정밀하고 최소 권한에 가까운 접근 제어를 제공합니다.

이 작업은 SIG Auth와 SIG Node가 주도한 [KEP \#2862](https://kep.k8s.io/2862)의 일환으로 진행되었습니다.

### 베타: 리소스 상태

v1.34 릴리스 전까지 쿠버네티스에는 할당된 장치의 상태를 보고하는 네이티브 방법이 없어서,
하드웨어 장애로 인한 파드 크래시를 진단하기 어려웠습니다.
장치 플러그인에 초점을 맞췄던 v1.31의 초기 알파 릴리스를 바탕으로,
쿠버네티스 v1.36은 각 파드의 `.status` 안에 있는 `allocatedResourcesStatus`
필드를 베타로 승격하여 이 기능을 확장합니다. 이 필드는 모든 특수 하드웨어에 대해
통합된 상태 보고 메커니즘을 제공합니다.

사용자는 이제 `kubectl describe pod`를 실행하여 컨테이너의 크래시 루프가
전통적인 플러그인으로 프로비저닝된 하드웨어인지, 더 새로운 DRA 프레임워크로
프로비저닝된 하드웨어인지와 관계없이 `Unhealthy` 또는 `Unknown` 장치 상태 때문인지 확인할 수 있습니다.
이렇게 향상된 관측가능성은 관리자와 자동화된 컨트롤러가
결함이 있는 하드웨어를 빠르게 식별하고 고성능 워크로드의 복구를 간소화하도록 돕습니다.

이 작업은 SIG Node가 주도한 [KEP \#4680](https://kep.k8s.io/4680)의 일환으로 진행되었습니다.

### 알파: 워크로드 인지 스케줄링(WAS) 기능

이전에는 쿠버네티스 스케줄러와 잡 컨트롤러가 파드를 독립적인 단위로 관리했기 때문에,
복잡한 분산 워크로드에서 스케줄링이 조각나거나 리소스가 낭비되는 경우가 많았습니다.
쿠버네티스 v1.36은 알파 단계의 포괄적인 워크로드 인지 스케줄링(Workload Aware Scheduling, WAS) 기능 모음을 도입하여,
잡 컨트롤러를 개정된 [워크로드(Workload)](/docs/concepts/workloads/workload-api/)
API 및 새롭게 분리된 PodGroup API와 네이티브로 통합하고,
관련 파드들을 하나의 논리적 단위로 다룹니다.

쿠버네티스 v1.35는 이미 어떤 파드도 노드에 바인딩되기 전에
스케줄 가능한 최소 파드 수를 요구하는 방식으로 [갱 스케줄링(gang scheduling)](/docs/concepts/scheduling-eviction/gang-scheduling/)을 지원했습니다.
v1.36은 여기에서 더 나아가 전체 그룹을 원자적으로 평가하는 새로운 PodGroup 스케줄링 주기를 도입합니다.
이를 통해, 그룹의 모든 파드가 함께 바인딩되거나, 아무 파드도 바인딩되지 않도록 합니다.

이 작업은 SIG Scheduling과 SIG Apps가 주도한 여러 KEP([\#4671](https://kep.k8s.io/4671), [\#5547](https://kep.k8s.io/5547), [\#5832](https://kep.k8s.io/5832), [\#5732](https://kep.k8s.io/5732), [\#5710](https://kep.k8s.io/5710) 포함)에 걸쳐 진행되었습니다.

## 스테이블로 승격된 기능들

_v1.36 릴리스 이후 스테이블이 된 개선 사항 중 일부를 소개합니다._

### 볼륨 그룹 스냅샷

여러 주기 동안 베타에 머무른 뒤, VolumeGroupSnapshot 지원이 쿠버네티스 v1.36에서 GA로 승격되었습니다.
이 기능을 사용하면 여러 퍼시스턴트볼륨클레임(PersistentVolumeClaim)에 대해 크래시 일관성(crash-consistent)이 있는 스냅샷을 동시에 만들 수 있습니다.
볼륨 그룹 스냅샷 지원은 [그룹 스냅샷용 확장 API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis) 집합에 의존합니다.
이 API들은 사용자가 볼륨 집합에 대해 크래시 일관성이 있는 스냅샷을 만들 수 있게 합니다.
핵심 목표는 해당 스냅샷 집합을 새 볼륨으로 복원하고,
크래시 일관성 복구 지점(crash consistent recovery point)을 바탕으로 워크로드를 복구할 수 있게 하는 것입니다.

이 작업은 SIG Storage가 주도한 [KEP \#3476](https://kep.k8s.io/3476)의 일환으로 진행되었습니다.

### 변경 가능한 볼륨 연결 한도

쿠버네티스 v1.36에서 _변경 가능한 `CSINode` 할당 가능 수(allocatable)_ 기능이 스테이블로 승격되었습니다.
이 개선 사항은 [컨테이너 스토리지 인터페이스(CSI)](https://kubernetes-csi.github.io/docs/introduction.html) 드라이버가
노드가 처리할 수 있는 최대 볼륨 수의 보고 값을 동적으로 업데이트할 수 있게 합니다.

이 업데이트를 통해 `kubelet`은 노드의 볼륨 한도와 용량 정보를 동적으로 업데이트할 수 있습니다.
`kubelet`은 주기적인 검사에 따라 또는 CSI 드라이버에서 발생한
리소스 고갈 오류에 응답하여, 컴포넌트 재시작 없이 이 한도를 조정합니다.
이를 통해 쿠버네티스 스케줄러가 스토리지 가용성을 정확히 파악하고,
오래된 볼륨 한도로 인한 파드 스케줄링 실패를 방지합니다.

이 작업은 SIG Storage가 주도한 [KEP \#4876](https://kep.k8s.io/4876)의 일환으로 진행되었습니다.

### 서비스어카운트(ServiceAccount) 토큰 외부 서명 API {#api-for-external-signing-of-service-account-tokens}

쿠버네티스 v1.36에서 서비스 어카운트용 _외부 서비스어카운트 토큰 서명자_ 기능이 스테이블로 승격되어,
토큰 서명을 외부 시스템으로 오프로드하면서도 쿠버네티스 API와 자연스럽게 통합할 수 있게 되었습니다.
클러스터는 이제 필요할 때 연장된 만료도 지원하는 표준 서비스 어카운트 토큰 형식을 따르는
프로젝티드 서비스 어카운트 토큰을 발급하기 위해 외부 JWT 서명자에 의존할 수 있습니다.
이는 이미 외부 ID나 키 관리 시스템에 의존하는 클러스터에 특히 유용하며,
컨트롤 플레인 내부에서 키 관리를 중복하지 않고 쿠버네티스와 통합할 수 있게 합니다.

kube-apiserver는 외부 서명자에서 공개 키를 발견하고,
이를 캐시하며, 자신이 직접 서명하지 않은 토큰을 검증하도록 구성되어 있어,
기존 인증과 권한 부여 흐름이 예상대로 계속 작동합니다.
알파와 베타 단계를 거치며 외부 서명자 플러그인의 API와 구성,
경로 검증, OIDC 디스커버리는 실제 배포와 교체 패턴을 안전하게 처리하도록 강화되었습니다.

v1.36에서 GA가 되면서 외부 서비스어카운트 토큰 서명은
ID와 서명을 중앙에서 관리하는 플랫폼에서 완전히 지원되는 옵션이 되었습니다.
이를 통해 외부 IAM 시스템과의 통합이 단순해지고, 컨트롤 플레인 내부에서 직접 서명 키를 관리할 필요가 줄어듭니다.

이 작업은 SIG Auth가 주도한 [KEP \#740](https://kep.k8s.io/740)의 일환으로 진행되었습니다.

### 스테이블로 승격된 DRA 기능

동적 리소스 할당(Dynamic Resource Allocation, DRA) 생태계의 일부는
쿠버네티스 v1.36에서 핵심 거버넌스 및 선택 기능이 스테이블로 승격되면서 운영 환경에서 사용할 만큼 충분히 성숙해졌습니다.
*DRA 관리자 접근 권한*이 GA로 전환되면서 클러스터 관리자가 하드웨어 리소스에 전역으로
접근하고 관리할 수 있는 영구적이고 안전한 프레임워크가 제공됩니다. 또한 *우선순위 목록*이 안정화되어
리소스 선택 로직이 모든 클러스터 환경에서 일관되고 예측 가능하게 유지됩니다.

이제 조직은 장기 API 안정성과 하위 호환성을 바탕으로
미션 크리티컬 하드웨어 자동화를 안심하고 배포할 수 있습니다. 이 기능들은 사용자가
대규모 GPU 클러스터와 멀티 테넌트 AI 플랫폼에 필수적인 정교한 리소스 공유 정책과
관리자 재정의를 구현할 수 있게 하며, 차세대 리소스 관리를 위한
핵심 아키텍처 기반이 갖춰졌음을 의미합니다.

이 작업은 SIG Auth와 SIG Scheduling이 주도한 KEP [\#5018](https://kep.k8s.io/5018) 및 [\#4816](https://kep.k8s.io/4816)의 일환으로 진행되었습니다.

### 변형 어드미션 정책(mutating admission policies)

선언적 클러스터 관리는 [MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)가 스테이블로
승격되면서 쿠버네티스 v1.36에서 한층 더 정교해졌습니다. 이 단계는 관리자가
공통 표현식 언어(Common Expression Language, CEL)를 사용해 API 서버 안에서 직접
리소스 변이를 정의할 수 있게 함으로써, 많은 일반 유스케이스에서 외부 인프라가 필요 없도록 하는
전통적인 웹훅의 네이티브 고성능 대안을 제공합니다.

이제 클러스터 운영자는 커스텀 어드미션 웹훅을 관리할 때 수반되는 지연 시간과 운영
복잡성 없이 들어오는 요청을 수정할 수 있습니다.
변이 로직을 선언적이고 버전이 지정된 정책으로 옮김으로써, 조직은
더 예측 가능한 클러스터 동작, 감소한 네트워크 오버헤드,
그리고 장기 API 안정성이 완전히 보장되는 강화된 보안 모델을 얻을 수 있습니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#3962](https://kep.k8s.io/3962)의 일환으로 진행되었습니다.

### `validation-gen`을 사용한 쿠버네티스 네이티브 타입의 선언적 검증 {#declarative-validation-of-kubernetes-native-types-with-validation-gen}

쿠버네티스 v1.36에서 _선언적 검증_(`validation-gen` 사용)이 스테이블로 승격되면서
커스텀 리소스 개발은 한층 더 효율적으로 발전했습니다.
이 개선 사항은 개발자가 공통 표현식 언어(CEL)를 사용해 Go 구조체 태그 안에
정교한 검증 로직을 직접 정의할 수 있게 하여, 복잡한 OpenAPI 스키마를
수동으로 작성하는 오류가 잦은 작업을 대체합니다.

쿠버네티스 기여자는 이제 커스텀 검증 함수를 작성하는 대신,
`+k8s:minimum` 또는 `+k8s:enum` 같은 IDL 마커 주석을 사용해 검증
규칙을 API 타입 정의(`types.go`) 안에 직접 정의할 수 있습니다. `validation-gen` 도구는 이
주석을 파싱하여 컴파일 시점에 견고한 API 검증 코드를 자동으로 생성합니다.
이는 유지보수 오버헤드를 줄이고 API 검증이
소스 코드와 일관되고 동기화된 상태를 유지할 수 있게 합니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5073](https://kep.k8s.io/5073)의 일환으로 진행되었습니다.

### 쿠버네티스 API 타입의 gogo protobuf 의존성 제거 {#remove-gogo-protobuf-dependency-for-kubernetes-api-types}

쿠버네티스 v1.36에서 `gogoprotobuf` 제거가 완료되면서,
쿠버네티스 코드베이스의 보안과 장기 유지보수성이 크게 진전되었습니다.
이 이니셔티브는 유지보수되지 않는 `gogoprotobuf` 라이브러리에 대한 중요한 의존성을 제거했습니다.
이 라이브러리는 잠재적 보안 취약점의 원천이 되었고,
현대적인 Go 언어 기능 도입을 막는 요인이 되었습니다.

쿠버네티스 API 타입에 호환성 위험을 가져올 수 있었던 표준 Protobuf 생성으로 마이그레이션하는 대신,
프로젝트는 필요한 생성 로직을 포크하여
`k8s.io/code-generator` 내부로 가져오는 방식을 선택했습니다. 이 접근 방식은
기존 API 동작과 직렬화 호환성을 보존하면서
쿠버네티스 의존성 그래프에서 유지보수되지 않는 런타임 의존성을 제거했습니다.
쿠버네티스 API Go 타입 사용자에게 이 변경은 기술 부채를 줄이고,
표준 protobuf 라이브러리와의 우발적인 오용을 방지합니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5589](https://kep.k8s.io/5589)의 일환으로 진행되었습니다.

### 노드 로그 쿼리

이전에는 쿠버네티스에서 클러스터 관리자가 컨트롤 플레인 또는 워커 노드와 관련된 문제를
디버깅하려면 SSH로 노드에 로그인하거나 클라이언트 측 리더를 구현해야 했습니다.
일부 문제는 여전히 직접 노드 접속이 필요하지만, kube-proxy 또는 kubelet 문제는
로그를 살펴봄으로써 진단할 수 있습니다. 노드 로그는 클러스터 관리자에게
kubelet API와 kubectl 플러그인을 사용해 이러한 로그를 볼 수 있는 방법을 제공하여,
파드나 컨테이너와 관련된 문제를 디버깅하는 것과 유사하게
노드에 로그인하지 않고도 문제 해결을 단순화합니다. 이 방식은 운영 체제와 관계없이 사용할 수 있으며,
서비스나 노드가 `/var/log`에 로그를 남겨야 합니다.

이 기능은 프로덕션 워크로드에 대한 철저한 성능 검증을 거쳐 쿠버네티스 1.36에서 GA로 승격되면서,
`NodeLogQuery` 기능 게이트를 통해 kubelet에서 기본적으로 활성화됩니다.
또한 `enableSystemLogQuery` kubelet 구성 옵션도 활성화해야 합니다.

이 작업은 SIG Windows가 주도한 [KEP \#2258](https://kep.k8s.io/2258)의 일환으로 진행되었습니다.

### 파드에서 User Namespaces 지원

User Namespaces 지원이 스테이블로 승격되면서, 컨테이너 격리와 노드 보안은
쿠버네티스 v1.36에서 중요한 성숙도 단계에 도달했습니다.
오랫동안 기다려 온 이 기능은 컨테이너의 root 사용자를
호스트의 비특권 사용자에 매핑할 수 있게 하여,
프로세스가 컨테이너를 탈출하더라도
기반 노드에 대한 관리 권한을 갖지 못하게 하는 중요한 심층 방어 계층을 제공합니다.

이제 클러스터 운영자는 컨테이너 탈출 취약점의 영향을 완화하기 위해
프로덕션 워크로드에서 이 강화된 격리를 자신 있게 활성화할 수 있습니다.
컨테이너 내부 ID를 호스트의 ID와 분리함으로써,
쿠버네티스는 멀티 테넌트 환경과 민감한 인프라를 무단 접근으로부터 보호하는
견고하고 표준화된 메커니즘을 제공합니다.
이 모든 것은 장기 API 안정성이 완전히 보장되는 상태에서 이루어집니다.

이 작업은 SIG Node가 주도한 [KEP \#127](https://kep.k8s.io/127)의 일환으로 진행되었습니다.

### cgroupv2 기반 PSI 지원

Pressure Stall Information(PSI) 메트릭 내보내기가 스테이블로 승격되면서,
쿠버네티스 v1.36에서 노드 리소스 관리와 관측가능성이 더 정밀해졌습니다.
이 기능은 kubelet이 CPU, 메모리, I/O에 대한 "압력" 메트릭을 보고할 수 있게 하며,
전통적인 사용률 메트릭보다 리소스 경합을
더 세분화해서 볼 수 있게 합니다.

클러스터 운영자와 오토스케일러는 이 메트릭을 사용하여 단순히 바쁜 시스템과
리소스 고갈로 실제 지연을 겪는 시스템을 구분할 수 있습니다.
이 신호를 활용하면 사용자는 파드 리소스 요청을 더 정확하게 조정하고,
수직 오토스케일링의 신뢰성을 높이며, 애플리케이션 성능 저하나 노드 불안정으로 이어지기 전에
노이즈 네이버(noisy neighbor) 영향을 감지할 수 있습니다.

이 작업은 SIG Node가 주도한 [KEP \#4205](https://kep.k8s.io/4205)의 일환으로 진행되었습니다.

### 볼륨 소스: OCI 아티팩트 및/또는 이미지 {#volumesource-oci-artifact-and-or-image}

_OCI 볼륨 소스_ 지원이 스테이블로 승격되면서, 쿠버네티스 v1.36에서 컨테이너 데이터 배포가 더 유연해졌습니다.
이 기능은 외부 스토리지 제공자나 컨피그맵(ConfigMap)에서 볼륨을 마운트해야 하는
전통적인 요구 사항을 넘어, kubelet이 컨테이너 이미지나 아티팩트 리포지터리 같은
OCI 호환 레지스트리에서 직접 콘텐츠를 가져와 마운트할 수 있게 합니다.

이제 개발자와 플랫폼 엔지니어는 애플리케이션 데이터, 모델, 정적 자산을 OCI 아티팩트로 패키징하고,
이미 컨테이너 이미지에 사용 중인 동일한 레지스트리와 버전 관리 워크플로우를 사용해 파드에 전달할 수 있습니다.
이미지와 볼륨 관리의 이러한 수렴은 CI/CD 파이프라인을 단순화하고,
읽기 전용 콘텐츠를 위한 특수 스토리지 백엔드 의존성을 줄이며,
어떤 환경에서도 데이터가 이식 가능하고 안전하게 접근할 수 있도록 보장합니다.

이 작업은 SIG Node가 주도한 [KEP \#4639](https://kep.k8s.io/4639)의 일환으로 진행되었습니다.

## 베타로 승격된 신규 기능

_v1.36 릴리스에서 베타가 된 주요 개선 사항 일부를 소개합니다._

### 컨트롤러의 오래된 상태(staleness) 완화

쿠버네티스 컨트롤러에서 오래된 상태는 많은 컨트롤러에 영향을 주고 컨트롤러 동작에 미묘한 영향을 줄 수 있는 문제입니다.
보통 프로덕션의 컨트롤러가 이미 잘못된 조치를 취한 뒤, 즉 너무 늦은 시점이 되어서야
컨트롤러 작성자가 세운 어떤 기본 가정 때문에 오래된 상태가 문제가 되었음을 알게 됩니다.
이는 캐시가 오래된 상태인 동안 컨트롤러 조정(reconciliation)이 충돌하는 업데이트나 데이터 손상을 일으키는 결과로 이어질 수 있습니다.

쿠버네티스 v1.36에 컨트롤러의 오래된 상태를 완화하고
컨트롤러 동작에 대한 더 나은 관측가능성을 제공하는 새 기능이 포함되었음을 알리게 되어 기쁩니다.
이는 클러스터 상태의 오래된 관점을 기반으로 한 조정을 방지하여, 해로운 동작으로 이어지기 쉬운 상황을 막습니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5647](https://kep.k8s.io/5647)의 일환으로 진행되었습니다.

### IP/CIDR 검증 개선

쿠버네티스 v1.36에서 API IP 및 CIDR 필드를 위한 `StrictIPCIDRValidation` 기능이 베타로 승격되어,
이전에는 통과되던 잘못된 형식의 주소와 접두사를 잡아내도록 검증이 강화되었습니다.
이는 서비스, 파드, 네트워크폴리시(NetworkPolicy) 또는 다른 리소스가 잘못된 IP를 참조하여
혼란스러운 런타임 동작이나 보안상 예기치 못한 결과로 이어질 수 있는
미묘한 구성 버그를 방지하는 데 도움이 됩니다.

컨트롤러는 오브젝트에 다시 기록하는 IP를 정규화하고,
이미 저장되어 있던 잘못된 값을 만나면 경고하도록 업데이트되어, 클러스터가
정리되고 일관성 있는 데이터 상태로 점진적으로 나아갈 수 있습니다. 베타 단계에 진입한 `StrictIPCIDRValidation`은 더 많은 환경에서 사용할 수 있게 되었으며,
운영자가 시간이 지나며 네트워크와 정책을 발전시킬 때
IP 관련 구성에 대해 더 신뢰할 수 있는 보호 장치를 제공합니다.

이 작업은 SIG Network가 주도한 [KEP \#4858](https://kep.k8s.io/4858)의 일환으로 진행되었습니다.

### kubectl 사용자 선호 설정과 클러스터 구성 분리

`kubectl` 사용자 환경설정을 커스터마이즈하기 위한 `.kuberc` 기능은 계속 베타이며
디폴트로 활성화됩니다. `~/.kube/kuberc` 파일은 사용자가 클러스터 엔드포인트와 자격 증명을 담는
`kubeconfig` 파일과 별도로 별칭, 기본 플래그, 기타 개인 설정을 저장할 수 있게 합니다.
이 분리는 서로 다른 클러스터와 컨텍스트 전반에서 일관된 `kubectl` 경험을 유지하면서,
개인 선호 설정이 CI 파이프라인이나 공유 `kubeconfig` 파일을 방해하지 않도록 합니다.

쿠버네티스 v1.36에서 `.kuberc`는 더 안전한 인증 관행을 강제하기 위해
자격 증명 플러그인에 대한 정책(허용 목록 또는 거부 목록)을 정의하는 기능으로 확장되었습니다.
필요한 경우 사용자는 `KUBECTL_KUBERC=false` 또는 `KUBERC=off` 환경 변수를 설정하여 이 기능을 비활성화할 수 있습니다.

이 작업은 SIG Auth의 도움을 받아 SIG CLI가 주도한 [KEP \#3104](https://kep.k8s.io/3104)의 일환으로 진행되었습니다.

### 잡이 일시 중단되었을 때 변경 가능한 컨테이너 리소스

쿠버네티스 v1.36에서 `MutablePodResourcesForSuspendedJobs` 기능은 베타로 승격되어 기본적으로 활성화됩니다.
이번 업데이트는 잡이 일시 중단된 동안 컨테이너 CPU, 메모리,
GPU, 확장 리소스 요청과 한도를 업데이트할 수 있도록 잡 검증을 완화합니다.

이 기능을 통해 큐 컨트롤러와 운영자는 클러스터의 현재 상태에 따라
배치 워크로드 요구 사항을 조정할 수 있습니다. 예를 들어 큐 시스템은 들어오는 잡을 일시 중단하고,
리소스 요구 사항을 사용 가능한 용량이나 쿼터에 맞게 조정한 다음 일시 중단을 해제할 수 있습니다.
이 기능은 실행 중인 파드에 방해가 되는 변경을 막기 위해,
변경 가능성을 일시 중단된 잡(또는 일시 중단 시 파드가 종료된 잡)으로 엄격히 제한합니다.

이 작업은 SIG Apps가 주도한 [KEP \#5440](https://kep.k8s.io/5440)의 일환으로 진행되었습니다.

### 제한된 가장

쿠버네티스 v1.36에서 사용자 가장을 위한 `ConstrainedImpersonation` 기능이 베타로 승격되어,
기존의 '전부 허용하거나 전혀 허용하지 않던' 메커니즘을 실제로 최소 권한 원칙을 따를 수 있는 방식으로 강화합니다.
이 기능이 활성화되면 가장 수행자는 두 가지 별개의 권한 집합을 가져야 합니다.
하나는 특정 ID로 가장하기 위한 권한이고, 다른 하나는 그 ID를 대신해 특정 작업을 수행하기 위한 권한입니다.
이는 지원 도구, 컨트롤러, 노드 에이전트가 가장 RBAC를 잘못 구성했더라도
자신에게 허용된 것보다 더 넓은 접근 권한을 얻기 위해 가장을 사용하는 일을 방지합니다.
기존 가장 규칙은 계속 작동하지만, API 서버는 새로운 제한된 검사를 먼저 선호하므로
전환은 한 번에 이루어지는 방식이 아니라 점진적으로 이루어집니다. v1.36에서 베타가 되면서 `ConstrainedImpersonation`은 테스트되고,
문서화되었으며, 디버깅, 프록시, 노드 수준 컨트롤러에 가장을 활용하는
플랫폼 팀이 더 넓게 채택할 준비가 되었습니다.

이 작업은 SIG Auth가 주도한 [KEP \#5284](https://kep.k8s.io/5284)의 일환으로 진행되었습니다.

### 베타의 DRA 기능

[동적 리소스 할당(DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) 프레임워크는 여러 핵심 기능이 베타로 승격되고 디폴트로 활성화되면서 쿠버네티스 v1.36에서 한 단계 더 성숙해졌습니다.
이 전환은 [분할 가능한 장치](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)와 [소비 가능 용량](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity)을 승격하여 DRA를 기본 할당을 넘어선 단계로 옮기며, GPU 같은 하드웨어를 더 세분화해 공유할 수 있게 합니다.
또한 [장치 테인트와 톨러레이션](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)은 특수 리소스가 적절한 워크로드에만 사용되도록 보장합니다.

이제 사용자는 [ResourceClaim 장치 상태](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)와
파드 스케줄링 전에 장치 연결을 보장하는 기능을 통해 리소스 라이프사이클을 더 안정적으로 관찰할 수 있습니다.
이 기능들을 [확장 리소스](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource) 지원과 통합함으로써,
쿠버네티스는 레거시 장치 플러그인 시스템을 대체할 수 있는 견고한 프로덕션 준비 대안을 제공하고,
복잡한 AI 및 HPC 워크로드가 이전보다 훨씬 높은 정밀도와 운영 안정성을 갖고 하드웨어를 관리할 수 있게 합니다.

이 작업은 SIG Scheduling과 SIG Node가 주도한 여러 KEP([\#5004](https://kep.k8s.io/5004), [\#4817](https://kep.k8s.io/4817), [\#5055](https://kep.k8s.io/5055), [\#5075](https://kep.k8s.io/5075), [\#4815](https://kep.k8s.io/4815), [\#5007](https://kep.k8s.io/issues/5007) 포함)에 걸쳐 진행되었습니다.

### 쿠버네티스 컴포넌트용 Statusz

쿠버네티스 v1.36에서 핵심 쿠버네티스 컴포넌트를 위한 `ComponentStatusz` 기능 게이트가 베타로 승격되어,
각 컴포넌트의 현재 빌드 및 버전 세부 정보를 보여주는 `/statusz` 엔드포인트(디폴트 활성화)를 제공합니다.
이 낮은 오버헤드의 [z-page](/docs/reference/instrumentation/zpages/)는 시작 시간, 가동 시간, Go 버전, 바이너리 버전,
에뮬레이션 버전, 최소 호환 버전 같은 정보를 노출하여, 운영자와 개발자가 로그나 구성을 뒤지지 않고도
무엇이 실행 중인지 정확히 빠르게 확인할 수 있게 합니다.

이 엔드포인트는 기본적으로 사람이 읽기 쉬운 텍스트 뷰를 제공하고, 명시적인 콘텐츠 협상을 통해
JSON, YAML 또는 CBOR로 프로그래밍 방식으로 접근할 수 있는 버전이 지정된 구조화 API(`config.k8s.io/v1beta1`)도 제공합니다.
접근 권한은 `system:monitoring` 그룹에 부여되어,
헬스 및 메트릭 엔드포인트에 대한 기존 보호와 맞춰지고 민감한 데이터 노출을 피합니다.

베타가 되면서 `ComponentStatusz`는 모든 핵심 컨트롤 플레인 컴포넌트와 노드 에이전트에서 기본적으로 활성화되고,
단위, 통합, 엔드-투-엔드 테스트로 뒷받침되어 프로덕션에서
관측가능성과 디버깅 워크플로우에 안전하게 사용할 수 있습니다.

이 작업은 SIG Instrumentation이 주도한 [KEP \#4827](https://kep.k8s.io/4827)의 일환으로 진행되었습니다.

### 쿠버네티스 컴포넌트용 Flagz

쿠버네티스 v1.36에서 핵심 쿠버네티스 컴포넌트를 위한 `ComponentFlagz` 기능 게이트가 베타로 승격되어,
각 컴포넌트가 시작될 때 사용된 실제 커맨드라인 플래그를 노출하는 `/flagz` 엔드포인트를 표준화합니다.
이는 클러스터 운영자와 개발자가 클러스터 안에서 현재 구성을 확인할 수 있게 하여,
예상치 못한 동작을 디버깅하거나 재시작 이후 플래그 롤아웃이 실제로 적용되었는지 확인하기 훨씬 쉽게 만듭니다.

이 엔드포인트는 사람이 읽기 쉬운 텍스트 뷰와 버전이 지정된 구조화 API(초기에는 `config.k8s.io/v1beta1`)를 모두 지원하므로,
장애 상황에서 `curl`로 확인하거나 준비가 되면 자동화 도구에 연결할 수 있습니다.
접근 권한은 `system:monitoring` 그룹에 부여되며 민감한 값은 마스킹될 수 있어,
구성 정보를 확인하는 방식도 헬스 및 상태 엔드포인트 주변의 기존 보안 관행과 일관성을 유지합니다.

베타가 되면서 `ComponentFlagz`는 이제 기본적으로 활성화되고 모든 핵심 컨트롤 플레인 컴포넌트와
노드 에이전트 전반에 구현되며, 프로덕션 클러스터에서 엔드포인트가 신뢰할 수 있음을 보장하기 위해 단위, 통합, 엔드-투-엔드 테스트로 뒷받침됩니다.

이 작업은 SIG Instrumentation이 주도한 [KEP \#4828](https://kep.k8s.io/4828)의 일환으로 진행되었습니다.

### 혼합 버전 프록시(일명 _알 수 없는 버전 상호운용성 프록시(unknown version interoperability proxy)_) {#mixed-version-proxy}

쿠버네티스 v1.36에서 _혼합 버전 프록시_ 기능은 v1.28에서 알파로 도입된 기반 위에서 베타로 승격되어,
혼합 버전 클러스터의 컨트롤 플레인 업그레이드를 더 안전하게 합니다. 이제 각 API 요청은
요청된 그룹, 버전, 리소스를 제공하는 apiserver 인스턴스로 라우팅될 수 있어 버전 차이로 인한 404와 실패를 줄입니다.

이 기능은 피어 집계 디스커버리에 의존하므로, apiserver들은 자신이 노출하는 리소스와 버전에 대한 정보를 공유하고,
필요할 때 그 데이터를 사용해 요청을 투명하게 다시 라우팅합니다. 다시 라우팅된 트래픽과 프록시 동작에 대한 새 메트릭은
운영자가 요청이 얼마나 자주 전달되고 어떤 피어로 전달되는지 이해하도록 돕습니다.
이 변화들은 함께 다단계 또는 부분 컨트롤 플레인 업그레이드를 수행하면서도
고가용성 혼합 버전 API 컨트롤 플레인을 프로덕션에서 더 쉽게 운영할 수 있게 합니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#4020](https://kep.k8s.io/4020)의 일환으로 진행되었습니다.

### cgroups v2를 사용하는 메모리 QoS

쿠버네티스는 이제 리눅스 cgroup v2 노드에서 더 세밀하고 계층화된 메모리 보호를 통해 메모리 QoS를 향상시켜,
커널 제어가 파드 요청과 한도에 더 잘 맞도록 하고, 같은 노드를 공유하는 워크로드의 간섭과 스래싱(thrashing)을 줄입니다.
이번 반복에서는 kubelet이 memory.high와 memory.min을 설정하는 방식도 개선하고, 라이브락(livelocks)을 피하기 위한 메트릭과 보호 장치를 추가하며,
클러스터 운영자가 환경에 맞게 메모리 보호 동작을 조정할 수 있는 구성 옵션을 도입합니다.

이 작업은 SIG Node가 주도한 [KEP \#2570](https://kep.k8s.io/2570)의 일환으로 진행되었습니다.

## 알파로 승격된 신규 기능

v1.36 릴리스에서 알파가 된 주요 개선 사항 일부를 소개합니다.

### 커스텀 메트릭을 위한 HPA의 0으로 스케일링

지금까지 HorizontalPodAutoscaler(HPA)는 실행 중인 파드의 메트릭(CPU 또는 메모리 등)을
기반으로만 스케일링 필요량을 계산할 수 있었기 때문에 최소 하나 이상의 레플리카가 활성 상태로 남아 있어야 했습니다.
쿠버네티스 v1.36은 알파 단계에서 _HPA scale to zero_ 기능(기본 비활성화)의 개발을 계속하며,
오브젝트(Object) 또는 외부(External) 메트릭을 사용할 때 워크로드가 특별히 0 레플리카까지 스케일 다운될 수 있게 합니다.

이제 사용자는 처리 대기 중인 작업이 없을 때 무거운 워크로드를 완전히 유휴 상태로 만들어
인프라 비용을 크게 줄이는 실험을 할 수 있습니다. 이 기능은 여전히 `HPAScaleToZero` 기능 게이트 뒤에 있지만,
실행 중인 파드가 0개인 상태에서도 HPA가 활성 상태를 유지하도록 하며,
외부 메트릭(예: 큐 길이)이 새 작업이 도착했음을 나타내는 즉시
디플로이먼트를 자동으로 다시 스케일 업할 수 있게 합니다.

이 작업은 SIG Autoscaling이 주도한 [KEP \#2021](https://kep.k8s.io/2021)의 일환으로 진행되었습니다.

### 알파의 DRA 기능

역사적으로 동적 리소스 할당(DRA) 프레임워크는 상위 수준 컨트롤러와 매끄럽게 통합되지 못했고,
장치별 메타데이터나 가용성에 대한 관측가능성도 제한적이었습니다.
쿠버네티스 v1.36은 워크로드를 위한 네이티브 ResourceClaim 지원과
DRA의 유연성을 CPU 관리에 제공하기 위한 DRA 네이티브 리소스를 포함하여, 알파 단계의 DRA 개선 사항을 대거 도입합니다.

이제 사용자는 [다운워드(Downward) API](/docs/concepts/workloads/pods/downward-api/)를 활용해 복잡한 리소스 속성을 컨테이너에 직접 노출하고,
더 예측 가능한 스케줄링을 위해 리소스 가용성을 더 잘 관찰할 수 있습니다. 이러한 업데이트는
장치 속성의 리스트 타입 지원과 결합되어 DRA를 저수준 프리미티브에서
현대적인 AI와 고성능 컴퓨팅(HPC) 스택의 정교한 네트워킹 및 컴퓨팅 요구 사항을 처리할 수 있는
견고한 시스템으로 바꿉니다.

이 작업은 SIG Scheduling과 SIG Node가 주도한 여러 KEP([\#5729](https://kep.k8s.io/5729), [\#5304](https://kep.k8s.io/5304), [\#5517](https://kep.k8s.io/5517), [\#5677](https://kep.k8s.io/5677), [\#5491](https://kep.k8s.io/5491) 포함)에 걸쳐 진행되었습니다.

### 쿠버네티스 메트릭의 네이티브 히스토그램 지원

쿠버네티스 v1.36에서 네이티브 히스토그램 지원이 알파로 도입되면서 고해상도 모니터링이
새로운 단계에 도달했습니다. 기존 프로메테우스 히스토그램은 정적이고 미리 정의된 버킷에 의존해
데이터 정확성과 메모리 사용량 사이에서 타협을 강요하는 경우가 많았지만, 이번 업데이트는 컨트롤 플레인이
현재 데이터를 기반으로 해상도를 동적으로 조정하는 희소 히스토그램을 내보낼 수 있게 합니다.

이제 클러스터 운영자는 수동 버킷 관리의 오버헤드 없이 kube-apiserver와 다른 핵심 컴포넌트의
정밀한 지연 시간 분포를 포착할 수 있습니다. 이 아키텍처 변화는 더 신뢰할 수 있는 SLI와 SLO를 보장하고,
가장 예측하기 어려운 워크로드 급증 상황에서도 정확성을 유지하는 고정밀 히트맵을 제공합니다.

이 작업은 SIG Instrumentation이 주도한 [KEP \#5808](https://kep.k8s.io/5808)의 일환으로 진행되었습니다.

### 매니페스트 기반 어드미션 컨트롤 구성

쿠버네티스 v1.36에서 _매니페스트 기반 어드미션 컨트롤_ 구성이 알파로 도입되면서,
어드미션 컨트롤러 관리는 더 선언적이고 일관된 모델로 나아갑니다.
이 변경은 관리자가 구조화된 매니페스트를 통해 원하는 어드미션 컨트롤 상태를
직접 정의할 수 있게 하여, 서로 다른 커맨드라인 플래그나 별도의 복잡한 구성 파일로
어드미션 플러그인을 구성해야 했던 오랜 과제를 해결합니다.

이제 클러스터 운영자는 다른 쿠버네티스 오브젝트에 사용하는 것과 동일한 버전이 지정된 선언적 워크플로우를 사용해
어드미션 플러그인 설정을 관리할 수 있으며, 클러스터 업그레이드 중 구성 드리프트와 수동 오류의 위험을 크게 줄입니다.
이러한 구성을 하나의 매니페스트로 모아 관리함으로써 kube-apiserver는 더 쉽게 감사하고 자동화할 수 있게 되고,
더 안전하고 재현 가능한 클러스터 배포로 이어지는 길을 엽니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5793](https://kep.k8s.io/5793)의 일환으로 진행되었습니다.

### CRI 리스트 스트리밍

*CRI 리스트 스트리밍*이 알파로 도입되면서, 쿠버네티스 v1.36은 새로운 내부 스트리밍 방식을 사용합니다.
이 개선 사항은 kubelet과 컨테이너 런타임 사이의 전통적인 단일 `List` 요청을
더 효율적인 서버 측 스트리밍 RPC로 대체하여, 대규모 노드에서 자주 보이던 메모리 압박과 지연 시간 급증을 해결합니다.

이제 kubelet은 모든 컨테이너 또는 이미지 데이터를 담은 하나의 거대한 응답을 기다리는 대신,
스트리밍되는 결과를 점진적으로 처리할 수 있습니다. 이 전환은 kubelet의 최대 메모리 사용량을 크게 줄이고
고밀도 노드에서 응답성을 개선하여, 노드당 컨테이너 수가 계속 증가해도
클러스터 관리를 원활하게 유지할 수 있습니다.

이 작업은 SIG Node가 주도한 [KEP \#5825](https://kep.k8s.io/5825)의 일환으로 진행되었습니다.

## 기타 주목할 만한 변경 사항

### Ingress NGINX 은퇴

생태계의 안전과 보안을 우선하기 위해 쿠버네티스 SIG Network와 Security Response Committee는
2026년 3월 24일 Ingress NGINX를 은퇴시켰습니다.
그 날짜 이후에는 추가 릴리스, 버그 수정, 발견된 보안 취약점을 해결하기 위한 업데이트가 없습니다. 기존
Ingress NGINX 배포는 계속 작동하며, Helm 차트와 컨테이너 이미지 같은 설치 아티팩트는 계속 사용할 수 있습니다.

전체 세부 사항은 [공식 은퇴 발표](/blog/2025/11/11/ingress-nginx-retirement/)를 참고합니다.

### 볼륨을 위한 더 빠른 SELinux 레이블링(GA) {#volume-selinux-labelling}

쿠버네티스 v1.36은 SELinux 볼륨 마운팅 개선 사항을 일반적으로 사용할 수 있게 합니다. 이 변경은 재귀적 파일
레이블 재지정을 `mount -o context=XYZ` 옵션으로 대체하여, 마운트 시점에 전체 볼륨에 올바른 SELinux 레이블을 적용합니다.
SELinux 강제 적용 시스템에서 더 일관된 성능을 제공하고 파드 시작 지연을 줄입니다.

이 기능은 v1.28에서 `ReadWriteOncePod` 볼륨을 대상으로 베타로 도입되었습니다. v1.32에서는 충돌을 포착하는 데 도움이 되는
메트릭과 옵트아웃 옵션(`securityContext.seLinuxChangePolicy: Recursive`)이 추가되었습니다. 이제 v1.36에서는
스테이블에 도달했고 모든 볼륨에 기본 적용되며, 파드 또는 CSIDriver가 `spec.seLinuxMount`를 통해 옵트인합니다.

하지만 이 기능은 향후 쿠버네티스 릴리스에서, 특히 같은 노드의 특권 파드와 비특권 파드가 하나의 볼륨을 공유하는 상황 때문에 호환성을 깨는 변경이 될 위험이 있습니다.

개발자는 파드의 `seLinuxChangePolicy` 필드와 SELinux 볼륨 레이블을 설정할 책임이 있습니다. 디플로이먼트(Deployment), 스테이트풀셋(StatefulSet), 데몬셋(DaemonSet), 또는 파드 템플릿을 포함하는 커스텀 리소스를 작성하는 경우를 막론하고, 이러한 설정을 부주의하게 다루면 파드가 볼륨을 공유할 때 파드가 제대로 시작되지 않는 등 다양한 문제가 발생할 수 있습니다.

쿠버네티스 v1.36은 클러스터를 감사(audit)하기에 이상적인 릴리스입니다. 자세한 내용은 [SELinux 볼륨 레이블 변경 사항의 GA 승격(및 v1.37에서 예상되는 영향)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/) 블로그를 확인합니다.

이 개선 사항에 대한 자세한 내용은 [KEP-1710: 재귀적 SELinux 레이블 변경 속도 향상](https://kep.k8s.io/1710)를 참고합니다.


## v1.36의 승격, 사용 중단 및 제거

### 스테이블로 승격

아래는 스테이블(GA라고도 함)로 승격된 모든 기능 목록입니다.
알파에서 베타로의 승격과 새 기능을 포함한 전체 업데이트 목록은 릴리스 노트를 참고합니다.

이번 릴리스에는 스테이블로 승격된 개선 사항이 총 18개 포함됩니다.

- [파드에서 User Namespaces 지원](https://kep.k8s.io/127)
- [서비스 어카운트 토큰 외부 서명 API](https://kep.k8s.io/740)
- [재귀적 SELinux 레이블 변경 속도 향상](https://kep.k8s.io/1710)
- [Portworx 파일 인트리에서 CSI 드라이버로 마이그레이션](https://kep.k8s.io/2589)
- [세분화된 Kubelet API 권한 부여](https://kep.k8s.io/2862)
- [변형 어드미션 정책(Mutating Admission Policies)](https://kep.k8s.io/3962)
- [노드 로그 쿼리](https://kep.k8s.io/2258)
- [VolumeGroupSnapshot](https://kep.k8s.io/3476)
- [변경 가능한 CSINode 할당 가능 수 속성(Mutable CSINode Allocatable Property)](https://kep.k8s.io/4876)
- [DRA: 장치 요청의 우선순위 대안](https://kep.k8s.io/4816)
- [cgroupv2 기반 PSI 지원](https://kep.k8s.io/4205)
- [ProcMount 옵션 추가](https://kep.k8s.io/4265)
- [DRA: 동적 리소스 할당(Dynamic Resource Allocation)의 리소스를 포함하도록 PodResources 확장](https://kep.k8s.io/3695)
- [VolumeSource: OCI 아티팩트 및/또는 이미지](https://kep.k8s.io/4639)
- [CPU Manager에서 L3 캐시 토폴로지 인식 분리](https://kep.k8s.io/5109)
- [DRA: ResourceClaims와 ResourceClaimTemplates를 위한 AdminAccess](https://kep.k8s.io/5018)
- [쿠버네티스 API 타입의 gogo protobuf 의존성 제거](https://kep.k8s.io/5589)
- [secrets 필드를 통한 서비스 어카운트 토큰용 CSI 드라이버 옵트인](https://kep.k8s.io/5538)

## 사용 중단, 제거 및 커뮤니티 업데이트 {#deprecations-removals-and-community-updates}

쿠버네티스가 발전하고 성숙해짐에 따라, 프로젝트의 전반적인 상태를 개선하기 위해 기능이 사용 중단되거나, 제거되거나, 더 나은 기능으로 대체될 수 있습니다.
이 과정에 대한 자세한 내용은 쿠버네티스 사용 중단 및 제거 정책을 참고합니다.
쿠버네티스 v1.36에는 몇 가지 사용 중단이 포함됩니다.

### 서비스 .spec.externalIPs 사용 중단 {#deprecate-service-spec-externalips}

이번 릴리스에서 서비스 `spec`의 `externalIPs` 필드는 사용 중단됩니다. 이는 해당 기능이 아직 존재하지만 쿠버네티스의 **향후** 버전에서는 더 이상 작동하지 않음을 의미합니다. 현재 이 필드에 의존하고 있다면 마이그레이션을 계획해야 합니다.
이 필드는 수년 동안 알려진 보안 골칫거리였으며,
[CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/97076)에 문서화된 것처럼 클러스터 트래픽에 대한 중간자 공격을 가능하게 했습니다.
쿠버네티스 v1.36부터는 이 필드를 사용할 때 사용 중단 경고가 표시되며, v1.43에서 완전히 제거될 예정입니다.

서비스가 여전히 `externalIPs`에 의존하고 있다면, 클라우드 관리형 인그레스를 위해 LoadBalancer 서비스를 사용하거나,
간단한 포트 노출을 위해 NodePort를 사용하거나, 외부 트래픽을 더 유연하고 안전하게 처리하기 위해 [Gateway API](https://gateway-api.sigs.k8s.io/)를 사용하는 것을 고려합니다.

이 필드와 사용 중단에 대한 자세한 내용은 [외부 IP](/docs/concepts/services-networking/service/#external-ips)를 참고하거나
[KEP-5707: service.spec.externalIPs 사용 중](https://kep.k8s.io/5707)를 읽어봅니다.

### `gitRepo` 볼륨 드라이버 제거 {#remove-gitrepo-volume-driver}

`gitRepo` 볼륨 타입은 v1.11부터 사용 중단되었습니다. 쿠버네티스 v1.36에서 `gitRepo` 볼륨 플러그인은
영구적으로 비활성화되며 다시 켤 수 없습니다. 이 변경은 `gitRepo` 사용 시 공격자가
노드에서 root로 코드를 실행할 수 있게 하는 심각한 보안 문제로부터 클러스터를 보호합니다.

`gitRepo`는 수년 동안 사용 중단되었고 더 나은 대안이 권장되어 왔지만,
이전 릴리스에서는 기술적으로는 여전히 사용할 수 있었습니다.
v1.36부터는 `gitRepo` 볼륨을 사용하는 방법이 완전히 막히므로, `gitRepo`에 의존하는 기존 워크로드는
초기화 컨테이너나 외부 `git-sync` 스타일 도구 같은 지원되는 접근 방식으로 마이그레이션해야 합니다.

이 제거에 대한 자세한 내용은 [KEP-5040: gitRepo 볼륨 드라이버 제거](https://kep.k8s.io/5040)를 참고합니다.

## 릴리스 노트

쿠버네티스 v1.36 릴리스의 전체 세부 사항은 [릴리스 노트](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)를 확인합니다.

## 다운로드 및 시작하기

쿠버네티스 v1.36은 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.36.0) 또는 [쿠버네티스 다운로드 페이지](https://kubernetes.io/releases/download/)에서 다운로드할 수 있습니다.

쿠버네티스를 시작하려면 [튜토리얼](https://kubernetes.io/docs/tutorials/)을 참고하거나 [minikube](https://minikube.sigs.k8s.io/)를 사용해 로컬 쿠버네티스 클러스터를 실행합니다.
[kubeadm을 사용해 v1.36을 설치](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)할 수도 있습니다.

## 릴리스 팀

쿠버네티스는 커뮤니티의 지원, 헌신, 그리고 노력 없이는 불가능합니다. 각 릴리스 팀은
여러분이 의존하는 쿠버네티스 릴리스를 구성하는 수많은 조각을 만들기 위해 함께 일하는
헌신적인 커뮤니티 자원봉사자들로 이루어져 있습니다. 여기에는 코드 자체부터 문서화와 프로젝트 관리에 이르기까지,
커뮤니티 곳곳의 사람들이 가진 전문 기술이 필요합니다.

쿠버네티스 v1.36 릴리스를 커뮤니티에 전달하기 위해 수많은 시간을 들여 열심히 작업해 준 전체 [릴리스 팀](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)에 감사드립니다.
릴리스 팀의 구성원은 처음 참여한 섀도우부터 여러 릴리스 주기를 거치며
경험을 쌓은 복귀 팀 리드까지 다양합니다.
성공적인 릴리스 주기를 이끌고, 문제 해결에 직접 참여하는 접근 방식과
커뮤니티를 앞으로 나아가게 하는 에너지와 세심함을 보여준 릴리스 리드 Ryota Sawada에게 특별한 감사를 전합니다.

## 프로젝트 속도

CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) 프로젝트는
쿠버네티스와 다양한 하위 프로젝트의 개발 속도와 관련된 여러 데이터를 집계합니다. 여기에는 개인 기여부터
기여하는 회사 수까지 모든 것이 포함되며, 이 생태계를 발전시키는 데 들어가는 노력의 깊이와 폭을 보여줍니다.

2026년 1월 12일부터 2026년 4월 22일까지 15주 동안 이어진 v1.36 릴리스 주기 동안,
쿠버네티스는 106개의 서로 다른 회사와 491명의 개인으로부터 기여를 받았습니다.
더 넓은 클라우드 네이티브 생태계에서는 총 2235명의 기여자를 집계했을 때 그 수가 370개 회사까지 올라갑니다.

"기여"는 누군가 커밋, 코드 리뷰, 댓글을 하거나, 이슈 또는 PR을 만들거나,
PR(블로그와 문서 포함)을 리뷰하거나 이슈와 PR에 댓글을 달 때 집계된다는 점에 유의합니다.
기여에 관심이 있다면 기여자 웹사이트의 [시작하기](https://www.kubernetes.dev/docs/guide/#getting-started)를 방문합니다.

이 데이터의 출처:
- [쿠버네티스에 기여하는 회사](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [전체 생태계 기여](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)


## 이벤트 업데이트

KubeCon + CloudNativeCon, KCD 및 전 세계의 기타 주요 콘퍼런스를 포함한
다가오는 쿠버네티스와 클라우드 네이티브 이벤트를 살펴봅니다. 최신 정보를 확인하고 쿠버네티스 커뮤니티에 참여합니다.

**2026년 4월**
- KCD - [Kubernetes Community Days: Guadalajara](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-2026/cohost-kcd-guadalajara/): 2026년 4월 18일 | 과달라하라, 멕시코

**2026년 5월**
- KCD - [Kubernetes Community Days: Toronto](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-2026/): 2026년 5월 13일 | 토론토, 캐나다
- KCD - [Kubernetes Community Days: Texas](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-2026/cohost-kcd-texas/): 2026년 5월 15일 | 오스틴, 미국
- KCD - [Kubernetes Community Days: Istanbul](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2026/): 2026년 5월 15일 | 이스탄불, 터키
- KCD - [Kubernetes Community Days: Helsinki](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/): 2026년 5월 20일 | 헬싱키, 핀란드
- KCD - [Kubernetes Community Days: Czech & Slovak](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-prague-2026/): 2026년 5월 21일 | 프라하, 체코

**2026년 6월**
- KCD - [Kubernetes Community Days: New York](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2026/): 2026년 6월 10일 | 뉴욕, 미국
- KCD - [Kubernetes Community Days: Kuala Lumpur](https://community2.cncf.io/events/details/cncf-kcd-kuala-lumpur-2026-presents-kcd-kuala-lumpur-2026/): 2026년 6월 27일 | 쿠알라룸푸르, 말레이시아
- [KubeCon + CloudNativeCon India 2026: 2026년 6월 18-19일](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/) | 뭄바이, 인도

**2026년 7월**
- [KubeCon + CloudNativeCon Japan 2026: 2026년 7월 29-30일](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/) | 요코하마, 일본

**2026년 9월**
- [KubeCon + CloudNativeCon China 2026: 2026년 9월 8-9일](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/) | 상하이, 중국

**2026년 10월**
- KCD - [Kubernetes Community Days: UK: 2026년 10월 19일](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/) | 에든버러, 영국

**2026년 11월**
- KCD - [Kubernetes Community Days: Porto](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/): 2026년 11월 19일 | 포르투, 포르투갈
- [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2026년 11월 9-12일 | 솔트레이크, 미국

최신 이벤트 세부 사항은 [여기](https://community.cncf.io/events/#/list)에서 확인할 수 있습니다.

## 예정된 릴리스 웨비나

쿠버네티스 v1.36 릴리스팀 멤버들이 **2026년 5월 20일 수요일 오후 4:00(UTC)** 에 릴리스 주요 내용을 소개하는 웨비나를 진행합니다.
자세한 정보와 등록은 CNCF Online Programs 사이트의 [이벤트 페이지](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v136-release/)에서 확인합니다.


## 참여 방법

쿠버네티스에 참여하는 가장 쉬운 방법은 관심 분야에 맞는 다양한 [SIG(Special Interest Group)](https://github.com/kubernetes/community/blob/master/sig-list.md)에 가입하는 것입니다.
쿠버네티스 커뮤니티에 공유하고 싶은 소식이 있나요? 매주 열리는 [커뮤니티 미팅](https://github.com/kubernetes/community/tree/master/communication)과
아래 채널을 통해 의견을 공유합니다. 지속적인 피드백과 응원에 감사드립니다.

* 최신 소식을 Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io)에서 확인합니다.
* [Discuss](https://discuss.kubernetes.io/)에서 커뮤니티 토론에 참여합니다.
* [Slack](https://slack.k8s.io/)에서 커뮤니티와 소통합니다.
* [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)에서 질문을 올리거나 답변합니다.
* 여러분의 쿠버네티스 [스토리](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)를 공유합니다.
* [블로그](https://kubernetes.io/blog/)에서 쿠버네티스 최신 소식을 읽습니다.
* [쿠버네티스 릴리스 팀](https://github.com/kubernetes/sig-release/tree/master/release-team)에 대해 더 알아봅니다.

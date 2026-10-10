---
layout: blog
title: "쿠버네티스 v1.34: 바람과 의지 (O' WaW)"
date: 2025-08-27T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-34-release
author: >
  [쿠버네티스 v1.34 릴리스 팀](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
translator: >
  [Ian Y. Choi (AWS)](https://github.com/ianychoi), [Jihoon Shin (Sejong Univ.)](https://github.com/developowl), [Eunjeong Park (Innogrid)](https://github.com/Eundms), [Seokho Son (ETRI)](https://github.com/seokho-son), [쿠버네티스 문서 한글화 팀](https://kubernetes.slack.com/archives/CA1MMR86S)
---

**편집자:** Agustina Barbetta, Alejandro Josue Leon Bellido, Graziano Casto, Melony Qin, Dipesh Rawat

이전 릴리스와 마찬가지로 쿠버네티스 v1.34 릴리스에는 새로운 스테이블(Stable), 베타(Beta), 알파(Alpha) 기능이 포함되었습니다. 고품질의 릴리스가 지속적으로 제공되는 이유는 쿠버네티스 개발 주기의 강력함과 활발한 커뮤니티 덕분입니다.

이번 릴리스에는 58개의 개선 사항이 있습니다. 그 중 23개는 스테이블로 졸업하였으며, 22개는 베타로 진입, 13개는 알파에 진입하였습니다.

이번 릴리스에는 [사용 중단 및 제거](#deprecations-and-removals)도 있으니 꼭 확인하시기 바랍니다.

## 릴리스 테마와 로고

{{< figure src="k8s-v1.34.png" alt="쿠버네티스 v1.34 로고: 세 마리 곰이 나무 배로 항해를 하며, 깃발에는 발바닥 모양이, 돛과 배의 키에 심볼이 있으며, 바람이 바다를 가로질러 불고 있다" class="release-logo" >}}

우리 주변의 바람과 우리 내부 의지로 만들어진 릴리스입니다.

매 릴리스 주기마다 우리는 도구, 문서, 그리고 프로젝트의 역사적인
특이점과 같이 완전히 통제할 수 없는 바람을 맞습니다.
때로는 이 바람이 우리의 돛을 채우고, 때로는 옆으로 밀거나 잦아들기도
합니다.

쿠버네티스를 움직이는 것은 완벽한 바람이 아니라, 돛을 조정하고,
키를 잡고, 항로를 그리며 배를 안정적으로 유지하는 선원들의 의지입니다.
릴리스가 이루어지는 것은 항상 이상적인 조건이기 때문이 아니라, 그것을 만드는
사람들, 릴리스하는 사람들, 그리고 곰<sup>^</sup>, 고양이, 개, 마법사,
호기심 많은 이들이 어떤 바람이 불든 쿠버네티스를
힘차게 항해하게 하기 때문입니다.

이번 릴리스 **바람과 의지 (O' WaW)** 는 우리를 만든 바람과
앞으로 나아가게 하는 의지를 기립니다.

<sub>^ 아, 왜 곰일까요? 계속 궁금증을 가져보세요!</sub>

## 주요 업데이트 하이라이트

쿠버네티스 v1.34에는 새로운 기능과 개선 사항이 많습니다. 릴리스팀이 강조하고 싶은 주요 업데이트 몇 가지를 소개합니다.

### 스테이블: DRA의 핵심이 GA로

[동적 리소스 할당](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA)는
GPU, TPU, NIC, 기타 장치를 더 강력하게 선택하고 할당하고 공유하고
구성할 수 있게 합니다.

v1.30 릴리스부터 DRA는 쿠버네티스의 코어에 영향을 주지 않는 방식으로(opaque)
*구조화된 매개변수(structured parameters)*로 장치를 클레임하는 방식으로 동작합니다. 이 개선 사항은
스토리지 볼륨의 동적 프로비저닝에서 영감을 받았습니다.
구조화된 매개변수를 사용하는 DRA는 ResourceClaim, DeviceClass,
ResourceClaimTemplate, ResourceSlice API 타입 등, 이를 지원하는 API kind를
기반으로 하고, 파드의 `.spec`에 새로운 `resourceClaims` 필드를 확장합니다.
`resource.k8s.io/v1` API는 스테이블로 승격돼서 기본적으로 사용할 수 있습니다.

이 작업은 WG Device Management가 주도한 [KEP \#4381](https://kep.k8s.io/4381)의 일환으로 진행되었습니다.

### 베타: `kubelet` 이미지 인증 제공자를 위한 프로젝티드 서비스어카운트(ServiceAccount) 토큰

`kubelet`의 이미지 인증 제공자는 프라이빗 컨테이너 이미지를 가져올 때, 전통적으로 노드나 클러스터에 저장된 장기 시크릿(Secret)에 의존했습니다. 이 방식은 인증 정보가 특정 워크로드에 연결되지 않고 자동으로 회전되지 않아서 보안 위험과 관리 부담이 컸습니다.
이 문제를 해결하기 위해, 이제 `kubelet`은 컨테이너 레지스트리 인증을 위해 단기적이고 오디언스(audience)가 지정된 서비스어카운트(ServiceAccount) 토큰을 요청할 수 있습니다. 그래서 이미지 풀 작업이 노드 수준 인증 정보가 아니라 파드의 고유한 신원에 기반해 승인이 이루어집니다.
주요 이점은 보안성이 크게 좋아진다는 것입니다. 이미지 풀을 위한 장기 시크릿이 필요 없어서 공격 표면이 줄고, 관리자와 개발자 모두 인증 정보 관리가 쉬워집니다.

이 작업은 SIG Auth와 SIG Node가 주도한 [KEP \#4412](https://kep.k8s.io/4412)의 일환으로 진행되었습니다.

### 알파: KYAML(쿠버네티스에 최적화된 YAML 형식) 지원

KYAML은 쿠버네티스에 최적화되어 더 안전하고 모호함이 적은 YAML 하위 집합을 목표로 합니다. 어떤 버전의 쿠버네티스를 사용하든 쿠버네티스 v1.34부터는 kubectl의 새로운 출력 형식으로 KYAML을 사용할 수 있습니다.

KYAML은 YAML과 JSON 모두에 있는 특정 문제를 해결합니다. YAML은 공백이 중요해서 들여쓰기와 중첩에 신경 써야 하고, 문자열 인용이 선택적이라 예기치 않은 타입 변환이 생길 수 있습니다(예: ["The Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)). 반면 JSON은 주석 지원이 없고, 끝에 쉼표와 키 인용에 엄격한 요구사항이 있습니다.

KYAML로 작성한 파일은 모든 버전의 `kubectl`에 입력으로 전달할 수 있고, KYAML 파일은 YAML로도 유효합니다. `kubectl` v1.34에서는 환경 변수 `KUBECTL_KYAML=true`를 설정하면 [KYAML 출력](/docs/reference/kubectl/#syntax-1)을 요청할 수 있습니다(kubectl get -o kyaml …). 필요에 따라 기존 JSON 또는 YAML 형식도 계속 사용할 수 있습니다.

이 작업은 SIG CLI가 주도한 [KEP \#5295](https://kep.k8s.io/5295)의 일환으로 진행되었습니다.

## 스테이블로 승격된 기능들

*v1.34 릴리스에서 스테이블로 바뀐 주요 개선 사항 일부를 소개합니다.*

### 잡의 대체 파드 지연 생성

기본적으로 잡 컨트롤러는 파드가 종료되기 시작하면 즉시 대체 파드를 생성해서 두 파드가 동시에 실행됩니다. 이는 리소스가 제한된 클러스터에서 대체 파드가 원래 파드가 완전히 종료될 때까지 사용 가능한 노드를 찾기 어려워져 리소스 경쟁을 유발할 수 있습니다. 또한, 이 상황은 원치 않는 클러스터 오토스케일러의 확장도 유발할 수 있습니다.
추가적으로, TensorFlow, [JAX](https://jax.readthedocs.io/en/latest/)와 같은 일부 머신러닝 프레임워크는 한 번에 인덱스당 하나의 파드만 실행되어야 하므로 동시 실행이 문제가 될 수 있습니다.
이 기능은 잡에 `.spec.podReplacementPolicy`를 도입합니다. 파드가 완전히 종료(즉, `.status.phase: Failed`)된 경우에만 대체 파드를 생성하도록 선택할 수 있습니다. 이를 위해 `.spec.podReplacementPolicy: Failed`로 설정합니다.
v1.28에서 알파로 도입된 이 기능은 v1.34에서 스테이블로 승격되었습니다.

이 작업은 SIG Apps가 주도한 [KEP \#3939](https://kep.k8s.io/3939)의 일환으로 진행되었습니다.

### 볼륨 확장 실패 복구

이 기능은 사용자가 기본 스토리지 제공자가 지원하지 않는 볼륨 확장을 취소하고, 더 작은 값으로 재시도할 수 있도록 합니다.
v1.23에서 알파로 도입된 이 기능은 v1.34에서 스테이블로 승격되었습니다.

이 작업은 SIG Storage가 주도한 [KEP \#1790](https://kep.k8s.io/1790)의 일환으로 진행되었습니다.

### 볼륨 수정용 VolumeAttributesClass

[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/)가 v1.34에서 스테이블로 승격되었습니다. VolumeAttributesClass는 프로비저닝된 IO 등 볼륨 매개변수를 수정할 수 있는 범용 쿠버네티스 네이티브 API입니다. 제공자가 지원하는 경우, 워크로드가 비용과 성능 균형을 위해 볼륨을 온라인으로 수직 확장할 수 있습니다.
쿠버네티스의 모든 새로운 볼륨 기능과 마찬가지로, 이 API는 [컨테이너 스토리지 인터페이스(CSI)](https://kubernetes-csi.github.io/docs/)를 통해 구현됩니다. 프로비저너별 CSI 드라이버가 이 기능의 CSI 측면인 ModifyVolume API를 지원해야 합니다.

이 작업은 SIG Storage가 주도한 [KEP \#3751](https://kep.k8s.io/3751)의 일환으로 진행되었습니다.

### 구조화된 인증 구성

쿠버네티스 v1.29는 API 서버 클라이언트 인증을 관리하기 위한 구성 파일 형식을 도입해서, 이전의 많은 커맨드라인 옵션 의존에서 벗어납니다.
[AuthenticationConfiguration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration) 유형을 통해 관리자는 여러 JWT 인증자, CEL 표현식 검증, 동적 재로딩을 지원할 수 있습니다.
이 변화는 클러스터 인증 설정의 관리성과 감사 용이성(auditability)을 크게 향상시키며, v1.34에서 스테이블로 승격되었습니다.

이 작업은 SIG Auth가 주도한 [KEP \#3331](https://kep.k8s.io/3331)의 일환으로 진행되었습니다.

### 셀렉터 기반 세분화된 권한 부여

쿠버네티스 권한 부여자(웹훅 인증자, 내장 노드 인증자 등)는 이제 들어오는 요청의 필드 및 레이블 셀렉터를 기반으로 권한 부여 결정을 내릴 수 있습니다. **list**, **watch**, **deletecollection** 요청에 셀렉터가 포함되면, 권한 부여 계층이 그 추가 컨텍스트로 접근을 평가할 수 있습니다.

예를 들어, 특정 `.spec.nodeName`에 바인딩된 파드만 나열할 수 있도록 권한 정책을 작성할 수 있습니다.
클라이언트(예: 특정 노드의 kubelet)는 정책이 요구하는
필드 셀렉터를 반드시 지정해야 하며, 그렇지 않으면 요청이 거부됩니다.
이 변경으로 클라이언트가 제한에 맞게 동작할 수 있다면 최소 권한 규칙을 설정하는 것이 가능해집니다.
쿠버네티스 v1.34는 노드별 격리, 커스텀 멀티테넌트 환경 등에서 더 세분화된 제어를 지원합니다.

이 작업은 SIG Auth가 주도한 [KEP \#4601](https://kep.k8s.io/4601)의 일환으로 진행되었습니다.

### 세분화된 제어로 익명 요청 제한

익명 접근을 완전히 허용하거나 비활성화하는 대신, 이제 인증되지 않은 요청을 허용할 엔드포인트 목록을 엄격하게 지정할 수 있습니다. 이는 `/healthz`, `/readyz`, `/livez`와 같은 헬스 체크나 부트스트랩 엔드포인트에 익명 접근이 필요한 클러스터에 더 안전한 대안을 제공합니다.

이 기능을 통해 익명 사용자에게 광범위한 접근 권한을 부여하는 실수(RBAC 오동작)를 방지할 수 있고, 외부 프로브나 부트스트랩 도구를 변경할 필요가 없습니다.

이 작업은 SIG Auth가 주도한 [KEP \#4633](https://kep.k8s.io/4633)의 일환으로 진행되었습니다.

### 플러그인별 콜백을 통한 더 효율적인 재큐잉(requeueing)

`kube-scheduler`에서는 이제 이전에 스케줄링할 수 없었던 파드를 다시 스케줄링하는 시점을 보다 정확하게 판단할 수 있습니다. 각 스케줄링 플러그인은 이제 콜백 함수를 등록해서, 클러스터 이벤트가 거부된 파드를 다시 스케줄링 가능하게 만들지 여부를 스케줄러에 알릴 수 있습니다.

이로 인해 불필요한 재시도 횟수가 줄고, 전체 스케줄링 처리량이 향상됩니다. 특히 동적 리소스 할당을 사용하는 클러스터에서 효과적입니다. 또한, 특정 플러그인은 안전할 경우 일반적인 백오프 지연을 건너뛸 수 있어서, 특정 상황에서 스케줄링이 더 빨라집니다.

이 작업은 SIG Scheduling이 주도한 [KEP \#4247](https://kep.k8s.io/4247)의 일환으로 진행되었습니다.

### 네임스페이스 삭제 순서 지정

반복적으로 무작위로 리소스를 삭제하다보면, 네트워크 정책이 삭제된 후에도 파드가 남아있는 등 보안 문제나 의도치 않은 동작이 발생할 수 있습니다.
이 개선 사항은 쿠버네티스 [네임스페이스](/ko/docs/concepts/overview/working-with-objects/namespaces/)의 삭제 과정을 더 구조적으로 만들어, 논리적, 보안적 의존성을 존중하는 삭제 순서를 강제함으로써 파드가 다른 리소스들보다 먼저 삭제되는 것을 보장합니다.
이 기능은 쿠버네티스 v1.33에서 도입되어 v1.34에서 스테이블로 승격됐다. 이로 인해 비결정적 삭제로 인한 위험(예: [CVE-2024-7598](https://github.com/advisories/GHSA-r56h-j38w-hrqq)에서 설명된 취약점)이 완화되어 보안성과 신뢰성이 향상됩니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5080](https://kep.k8s.io/5080)의 일환으로 진행되었습니다.

### **list** 응답 스트리밍

쿠버네티스에서 대규모 **list** 응답을 처리하는 것이 이전에는 확장성에 큰 도전이었습니다. 클라이언트가 수천 개의 파드나 커스텀 리소스 등 방대한 목록을 요청하면, API 서버는 모든 객체를 하나의 큰 메모리 버퍼에 직렬화한 뒤 전송해야 했습니다. 이 과정은 메모리 부담을 초래하고, 성능 저하 및 클러스터 안정성 저하로 이어질 수 있었습니다.
이를 해결하기 위해 컬렉션(list 응답)에 대한 스트리밍 인코딩 메커니즘이 도입되었습니다.
JSON 및 쿠버네티스 Protobuf 응답 형식에서는 이 스트리밍 메커니즘이
자동으로 활성화되며, 관련 기능 게이트는 스테이블입니다.
이 방식의 주요 이점은 API 서버에서 대규모 메모리 할당을 피할 수 있어, 메모리 사용량이 훨씬 작고 예측이 가능해진다는 점입니다.
결과적으로, 대규모 환경에서 빈번한 대량 리소스 목록 요청이 있을 때 클러스터의 복원력과 성능이 크게 향상됩니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5116](https://kep.k8s.io/5116)의 일환으로 진행되었습니다.

### 견고한 watch 캐시 초기화

Watch 캐시는 `kube-apiserver` 내부의 캐싱 계층으로, etcd에 저장된 클러스터 상태를 최종 일관성있는 상태로 캐싱을 합니다. 과거에는 `kube-apiserver`가 시작될 때 watch 캐시가 아직 초기화되지 않았거나 재초기화가 필요할 때 문제가 발생할 수 있었습니다.

이 문제를 해결하기 위해 watch 캐시 초기화 과정이 실패에 더 견고하게 대응하도록 개선해서, 컨트롤 플레인 안정성이 향상되고 컨트롤러 및 클라이언트가 신뢰성 있게 watch를 설정할 수 있게 되었습니다. 이 개선 사항은 v1.31에서 베타로 도입되어, 이제 스테이블입니다.

이 작업은 SIG API Machinery와 SIG Scalability가 주도한 [KEP \#4568](https://kep.k8s.io/4568)의 일환으로 진행되었습니다.

### DNS 검색 경로 검증 완화

이전에는 쿠버네티스에서 파드의 DNS `검색` 경로에 대한 엄격한 검증이 복잡하거나 레거시 네트워크 환경에서 통합에 어려움을 초래했습니다. 이로 인해 조직 인프라에 필요한 구성을 막아서, 관리자가 어려운 우회 방법을 써야 했습니다.
이를 해결하기 위해 v1.32에서 알파로 도입된 완화된 DNS 검증이 v1.34에서 스테이블로 승격되었습니다. 대표적인 사용 사례는 파드가 쿠버네티스 내부 서비스와 외부 도메인 모두와 통신해야 하는 경우입니다. 파드의 `.spec.dnsConfig`에 대한 `searches` 목록 첫 번째 항목에 점(`.`)을 설정하면, 시스템 리졸버가 외부 쿼리에 클러스터 내부 검색 도메인을 추가하지 않게 됩니다. 이로 인해 외부 호스트명에 대해 내부 DNS 서버로 불필요한 요청이 발생하지 않아 효율성이 향상되고, 잠재적 이름 확인 오류도 방지할 수 있습니다.

이 작업은 SIG Network가 주도한 [KEP \#4427](https://kep.k8s.io/4427)의 일환으로 진행되었습니다.

### 윈도우(Windows) `kube-proxy`의 Direct Service Return(DSR) 지원

DSR은 로드 밸런서를 통해 라우팅된 반환 트래픽이 로드 밸런서를 우회해서 클라이언트에 직접 응답하도록 해서, 로드 밸런서의 부하를 줄이고 전체 지연 시간을 개선하는 성능 최적화 기능입니다. 윈도우의 DSR에 대한 자세한 내용은 [Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710)을 참고합니다.
v1.14에서 처음 도입된 이 기능은 v1.34에서 스테이블로 승격되었습니다.

이 작업은 SIG Windows가 주도한 [KEP \#5100](https://kep.k8s.io/5100)의 일환으로 진행되었습니다.

### 컨테이너 라이프사이클 훅의 Sleep 액션

컨테이너의 PreStop 및 PostStart 라이프사이클 훅에 Sleep 액션이 도입되어, 점진적 종료 관리와 전체 컨테이너 라이프사이클 관리가 더 쉬워집니다.  
Sleep 액션은 컨테이너가 시작 후 또는 종료 전 지정된 시간만큼 일시정지할 수 있게 합니다. 음수 또는 0의 sleep 시간은 즉시 반환되어 아무 동작도 하지 않습니다.
Sleep 액션은 쿠버네티스 v1.29에서 도입됐고, 제로값 지원은 v1.32에 추가되었습니다. 두 기능 모두 v1.34에서 스테이블로 승격되었습니다.

이 작업은 SIG Node가 주도한 [KEP \#3960](https://kep.k8s.io/3960) 및 [KEP \#4818](https://kep.k8s.io/4818)의 일환으로 진행되었습니다.

### 리눅스 노드 스왑 지원

역사적으로 쿠버네티스에서 스왑 지원이 없으면, 노드에 메모리 압박이 있을 때 프로세스가 갑자기 종료되어 워크로드가 불안정해질 수 있었습니다. 이는 대용량이지만 드물게 접근하는 메모리 풋프린트를 가진 애플리케이션에 특히 영향을 줬고, 더 점진적인 리소스 관리가 불가능해졌습니다.

이를 해결하기 위해 노드별로 설정 가능한 스왑 지원이 v1.22에서 도입되었습니다. 알파와 베타 단계를 거쳐 v1.34에서 스테이블로 승격되었습니다. 기본 모드인 `LimitedSwap`은 파드가 기존 메모리 한도 내에서 스왑을 사용할 수 있게 해서, 문제에 직접적인 해결책을 제공합니다. 기본적으로 `kubelet`은 `NoSwap` 모드로 설정되어 쿠버네티스 워크로드는 스왑을 사용할 수 없습니다.

이 기능은 워크로드 안정성을 향상시키고 자원 활용도를 더욱 효율적으로 만듭니다. 자원에 제약이 있는 환경에서 보다 다양한 어플리케이션을 지원할 수 있게 해주지만, 관리자는 반드시 스왑 사용에 의한 잠재적인 성능 영향을 고려해야 합니다.

이 작업은 SIG Node가 주도한 [KEP \#2400](https://kep.k8s.io/2400)의 일환으로 진행되었습니다.

### 환경 변수에 특수 문자 허용

쿠버네티스의 환경 변수 검증 규칙이 완화되어, `=`를 제외한 거의 모든
출력 가능한 ASCII 문자를 변수명에 사용할 수 있게 됩니다.
이 변경은 .NET Core와 같이 `:`를 중첩 구성 키로 사용하는 프레임워크 등 변수명에 비표준 문자가 필요한 워크로드를 지원합니다.

완화된 검증은 파드 명세에 직접 정의된 환경 변수뿐만 아니라, ConfigMap 및
시크릿을 참조해서 `envFrom`으로 주입된 환경 변수에도 적용됩니다.

이 작업은 SIG Node가 주도한 [KEP \#4369](https://kep.k8s.io/4369)의 일환으로 진행되었습니다.

### 테인트(Taint) 관리와 Node 라이프사이클 분리

기존에는 노드 상태(NotReady, Unreachable 등)에 따라 NoSchedule 및 NoExecute 테인트를 적용하는 `TaintManager`의 로직이 노드 라이프사이클 컨트롤러와 강하게 결합되어 있었습니다. 이로 인해 코드 유지보수와 테스트가 어려워지고, 테인트 기반 축출 메커니즘의 유연성이 제한되었습니다.
이번 KEP에서는 `TaintManager`를 쿠버네티스 컨트롤러 매니저 내 별도의 컨트롤러로 리팩터링하였습니다. 이는 내부 아키텍처 개선으로, 코드 모듈화와 유지보수성을 높입니다. 이 변경으로 테인트 기반 축출 로직을 독립적으로 테스트하고 발전시킬 수 있지만, 테인트 사용 방식에 있어 직접적인 사용자 영향은 없습니다.

이 작업은 SIG Scheduling과 SIG Node가 주도한 [KEP \#3902](https://kep.k8s.io/3902)의 일환으로 진행되었습니다.

## 베타로 승격된 신규 기능

*v1.34 릴리스에서 베타가 된 주요 개선 사항 일부를 소개합니다.*

### 파드 단위 리소스 요청 및 제한

여러 컨테이너가 포함된 파드의 리소스 요구사항을 정의하는 것은 그동안 어려웠습니다.
요청과 제한을 컨테이너 단위로만 설정할 수 있었기 때문입니다.
이로 인해 개발자는 각 컨테이너에 리소스를 과다 할당하거나,
원하는 총 리소스를 세밀하게 나누어야 했고, 설정이 복잡해지고
리소스 할당이 비효율적이었습니다.
이를 간소화하기 위해 파드 단위로 리소스 요청과 제한을 지정할 수 있는 기능이 도입되었습니다.
이제 개발자는 파드의 전체의 리소스 예산을 정의하고, 해당 리소스가
구성 컨테이너 간에 공유가 이루어집니다.
이 기능은 v1.32에서 알파로 도입되어 v1.34에서 베타로 승격됐으며,
HPA도 파드 단위 리소스 명세를 지원합니다.

주요 이점은 다중 컨테이너 파드의 리소스를 더 직관적이고 간단하게 관리할 수 있다는 점입니다.
모든 컨테이너가 사용하는 총 리소스가 파드에 정의된 한도를
초과하지 않도록 보장해서, 리소스 계획, 스케줄링 정확도,
클러스터 리소스 활용 효율이 향상됩니다.

이 작업은 SIG Scheduling과 SIG Autoscaling이 주도한 [KEP \#2837](https://kep.k8s.io/2837)의 일환으로 진행되었습니다.

### `kubectl` 사용자 환경설정용 `.kuberc` 파일

`.kuberc` 구성 파일을 통해 `kubectl`의 기본 옵션, 명령어 별칭 등 사용자 환경설정을 정의할 수 있습니다. kubeconfig 파일과 달리 `.kuberc`에는 클러스터 정보, 사용자명, 비밀번호가 포함되지 않습니다.
이 기능은 v1.33에서 알파로 도입되어 환경 변수 `KUBECTL_KUBERC`로 활성화를 하였으며, v1.34에서는 베타로 승격되어 디폴트로 활성화됩니다.

이 작업은 SIG CLI가 주도한 [KEP \#3104](https://kep.k8s.io/3104)의 일환으로 진행되었습니다.

### 외부 ServiceAccount 토큰 서명

전통적으로 쿠버네티스에서는 ServiceAccount 토큰을 `kube-apiserver` 시작 시 디스크에서 로드한 정적 서명 키로 관리합니다. 이번 기능은 외부 프로세스 서명을 위한 `ExternalJWTSigner` gRPC 서비스를 도입해서, 쿠버네티스 배포판이 ServiceAccount 토큰 서명에 정적 디스크 기반 키 대신 외부 키 관리 솔루션(HSM, 클라우드 KMS 등)과 통합할 수 있게 지원합니다.

v1.32에서 알파로 도입된 이 외부 JWT 서명 기능은 v1.34에서 베타로 승격되어 디폴트로 활성화됩니다.

이 작업은 SIG Auth가 주도한 [KEP \#740](https://kep.k8s.io/740)의 일환으로 진행되었습니다.

### 베타 상태인 DRA 기능

#### 안전한 리소스 모니터링을 위한 관리자 접근 권한

DRA는 ResourceClaims 또는 ResourceClaimTemplates의 `adminAccess` 필드를 통해 관리자가 이미 다른 사용자가 사용 중인 장치에 모니터링이나 진단 목적으로 접근할 수 있도록 제어된 관리 권한을 지원합니다. 이 특권을 가진(privileged) 모드는 `resource.k8s.io/admin-access: "true"` 레이블이 지정된 네임스페이스에서 해당 오브젝트를 생성할 권한이 있는 사용자에게만 제한되므로, 일반 워크로드에는 영향을 주지 않습니다. v1.34에서 베타로 승격된 이 기능은 네임스페이스 기반 권한 검사를 통해 워크로드 격리를 유지하면서 안전한 인트로스펙션 기능을 제공합니다.

이 작업은 WG Device Management와 SIG Auth가 주도한 [KEP \#5018](https://kep.k8s.io/5018)의 일환으로 진행되었습니다.

#### ResourceClaims 및 ResourceClaimTemplates의 우선순위 대안

워크로드가 단일 고성능 GPU에서 가장 잘 동작할 수 있지만, 두 개의 중간급 GPU에서 실행할 수도 있습니다.  
`DRAPrioritizedList` 기능 게이트(이제 디폴트로 활성화)로 ResourceClaims와 ResourceClaimTemplates에 `firstAvailable`라는 새로운 필드가 추가되었습니다. 이 필드는 요청을 여러 방식으로 만족시킬 수 있음을 순서대로 지정할 수 있으며, 특정 하드웨어가 없으면 아무 것도 할당하지 않을 수도 있습니다. 스케줄러는 목록의 대안을 순서대로 만족시키려고 시도하므로, 워크로드는 클러스터에서 사용 가능한 최상의 장치 세트를 할당받게 됩니다.

이 작업은 WG Device Management가 주도한 [KEP \#4816](https://kep.k8s.io/4816)의 일환으로 진행되었습니다.

#### `kubelet`의 DRA 리소스 할당 보고

`kubelet`의 API가 DRA를 통해 할당된 파드 리소스를 보고하도록 업데이트 되었습니다. 이를 통해 노드 모니터링 에이전트가 노드의 파드에 할당된 DRA 리소스를 확인할 수 있습니다. 또한, 노드 컴포넌트가 PodResourcesAPI를 사용해서 DRA 정보를 활용해 새로운 기능이나 통합을 개발할 수 있습니다.
쿠버네티스 v1.34부터 이 기능은 디폴트로 활성화됩니다.

이 작업은 WG Device Management가 주도한 [KEP \#3695](https://kep.k8s.io/3695)의 일환으로 진행되었습니다.

### `kube-scheduler` 논블로킹 API 호출

`kube-scheduler`는 스케줄링 사이클 중 블로킹 API 호출을 하며, 이는 성능 병목 현상을 만들어냅니다. 이번 기능은 우선순위 큐 시스템과 요청 중복 제거를 통한 비동기 API 처리를 도입해서, 스케줄러가 API 작업이 백그라운드에서 완료되는 동안 파드 처리를 계속할 수 있게 합니다. 주요 이점은 스케줄링 지연 감소, API 지연 시 스케줄러 스레드 고갈 방지, 스케줄링 불가 파드의 즉시 재시도 가능성 등입니다. 구현은 하위 호환성을 유지하며, 대기 중인 API 작업 모니터링을 위한 메트릭도 추가합니다.

이 작업은 SIG Scheduling이 주도한 [KEP \#5229](https://kep.k8s.io/5229)의 일환으로 진행되었습니다.

### 변형 어드미션 정책(Mutating admission policies)

[MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)는 변형 어드미션 웹훅에 대한, 선언적 방식과, 인프로세스(in-process) 대안을 제공합니다. 이 기능은 CEL의 객체 인스턴스화 및 JSON Patch 전략, 그리고 서버 사이드 Apply의 병합 알고리즘을 결합합니다.
관리자가 API 서버에서 직접 변형 규칙을 정의할 수 있어서 어드미션 제어가 크게 단순화됩니다.
v1.32에서 알파로 도입된 변형 어드미션 정책은 v1.34에서 베타로 승격되었습니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#3962](https://kep.k8s.io/3962)의 일환으로 진행되었습니다.

### 스냅샷 가능한 API 서버 캐시

`kube-apiserver`의 캐싱 메커니즘(watch 캐시)은 최신 상태 요청을 효율적으로 처리합니다. 하지만 이전 상태(예: 페이징, `resourceVersion` 지정)로 **list** 요청을 하면 캐시를 우회해서 etcd에서 직접 데이터를 가져오게 됩니다. 이 직접 접근은 성능 비용이 크고, 대용량 리소스의 경우 대량 데이터 전송으로 인한 메모리 부담으로 안정성 문제가 발생할 수 있습니다.
`ListFromCacheSnapshot` 기능 게이트가 디폴트로 활성화되면, `kube-apiserver`는 요청된 `resourceVersion`보다 오래된 스냅샷이 있으면 그 스냅샷에서 응답을 제공합니다. `kube-apiserver`는 시작 시 스냅샷이 없고, 각 watch 이벤트마다 새 스냅샷을 만들고, etcd가 compacted되거나 캐시에 75초보다 오래된 이벤트가 가득 차면 스냅샷을 삭제합니다. 제공된 `resourceVersion`이 없으면 서버는 etcd로 다시 되돌아옵니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#4988](https://kep.k8s.io/4988)의 일환으로 진행되었습니다.

### 쿠버네티스 네이티브 타입에 대한 선언적인 검증 도구

이전까지 쿠버네티스 내장 API의 검증 규칙은
모두 수작업으로 작성되어, 유지보수자가 규칙을 찾고 이해하고 개선하거나 테스트하기 어려웠습니다.
API에 적용될 수 있는 모든 검증 규칙을 한 번에 찾는 방법이 없었습니다.
_선언적 검증_은 쿠버네티스 유지보수자에게 API 개발, 유지보수, 리뷰를 쉽게 해주고, 더 나은 도구와 문서화를 위한 프로그래밍적 검사를 가능하게 해줍니다.
쿠버네티스 라이브러리를 사용해 자체 코드(예시: 컨트롤러)를 작성하는
사람은 복잡한 검증 함수 대신 IDL 태그로 새 필드를 쉽게 추가할 수 있습니다.
이 변경은 검증 보일러플레이트(boilerplate)를 자동화해서 API 생성 속도를 높이고,
버전 타입에서 검증을 수행해 더 적합한 오류 메시지를 제공합니다.
이 개선 사항은 v1.33에서 베타로 승격되어 v1.34에서도 베타로 유지되며, CEL 기반 검증 규칙을 네이티브 쿠버네티스 타입에 도입합니다. 타입 정의에 직접 더 세분화되고 선언적인 검증을 정의할 수 있어서 API 일관성과 개발자 경험이 향상됩니다.

이 작업은 SIG API Machinery가 주도한 [KEP \#5073](https://kep.k8s.io/5073)의 일환으로 진행되었습니다.

### **list** 요청용 스트리밍 인포머

스트리밍 인포머 기능은 v1.32부터 베타였고, v1.34에서 추가 개선이 이루어졌습니다. 이 기능은 **list** 요청이 etcd에서 페이징 결과를 조립하는 대신, API 서버의 watch 캐시에서 객체를 연속 스트림으로 반환할 수 있게 해줍니다. **watch** 작업과 동일한 메커니즘을 재사용함으로써, API 서버는 대용량 데이터셋을 안정적으로 메모리 사용량을 유지하며 처리할 수 있습니다.

이번 릴리스에서는 `kube-apiserver`와 `kube-controller-manager`가 디폴트로 새로운 `WatchList` 메커니즘을 활용합니다. `kube-apiserver`는 list 요청을 더 효율적으로 스트리밍하고, `kube-controller-manager`는 인포머를 더 메모리 효율적이고 예측 가능하게 사용할 수 있습니다. 이 개선으로 대규모 list 작업 시 메모리 압박이 줄고, 지속적인 부하에서도 신뢰성이 향상되어 list 스트리밍이 더 예측 가능하고 효율적이 됩니다.

이 작업은 SIG API Machinery와 SIG Scalability가 주도한 [KEP \#3157](https://kep.k8s.io/3157)의 일환으로 진행되었습니다.

### 윈도우 노드의 점진적 노드 종료 처리

윈도우 노드의 `kubelet`이 시스템 종료 이벤트를 감지해서 실행 중인 파드의 점진적 종료를 시작할 수 있게 해줍니다. 이는 기존 리눅스의 동작을 반영한 것으로, 계획된 종료나 재시작 시 워크로드가 깔끔하게 종료되도록 돕습니다.
시스템이 종료를 시작하면, `kubelet`은 표준 종료 로직을 사용해서 라이프사이클 훅과 그레이스 기간을 준수해서 노드가 꺼지기 전에 파드가 종료될 시간을 제공합니다. 이 기능은 윈도우의 사전 종료 알림을 활용해 프로세스를 조정합니다. 이번 개선으로 유지보수, 재시작, 시스템 업데이트 시 워크로드 신뢰성이 향상됩니다. 현재 베타이며 디폴트로 활성화됩니다.

이 작업은 SIG Windows가 주도한 [KEP \#4802](https://kep.k8s.io/4802)의 일환으로 진행되었습니다.

## 인플레이스 파드(In-place Pod) 리사이즈 개선

v1.33에서 베타로 승격되어 기본 활성화된 인플레이스 파드 리사이즈 기능이 v1.34에서 추가 개선되었습니다. 여기에는 메모리 사용량 감소 지원과 파드 단위 리소스 통합을 포함합니다.

이 기능은 v1.34에서도 베타로 유지됩니다. 자세한 사용법과 예시는 [컨테이너에 할당된 CPU 및 메모리 리소스 리사이즈](/docs/tasks/configure-pod-container/resize-container-resources/) 문서를 참고합니다.

이 작업은 SIG Node와 SIG Autoscaling이 주도한 [KEP \#1287](https://kep.k8s.io/1287)에서 진행되었습니다.

## 알파로 승격된 신규 기능

*v1.34 릴리스에서 알파가 된 주요 개선 사항 일부를 소개합니다.*

### mTLS 인증을 위한 파드 인증서

클러스터 내 워크로드 인증, 특히 API 서버와의 통신은 주로 ServiceAccount 토큰에 의존해왔습니다. 효과적이나, 이 토큰은 mTLS(상호 TLS)에서 강력하고 검증 가능한 신원을 제공하기에 항상 이상적이지 않고, 인증서 기반 인증을 기대하는 외부 시스템과 통합시 어려움이 있습니다.
쿠버네티스 v1.34는 [PodCertificateRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests)를 통해 파드가 X.509 인증서를 획득할 수 있는 내장 메커니즘을 도입합니다. `kubelet`이 파드용 인증서를 요청·관리할 수 있고, 이를 통해 쿠버네티스 API 서버 및 기타 서비스에 mTLS로 인증할 수 있습니다.
주요 이점은 파드에 더 강력하고 유연한 신원 메커니즘을 제공한다는 점입니다. bearer 토큰에만 의존하지 않고, 표준 보안 관행에 맞는 mTLS 인증을 네이티브로 구현할 수 있어서, 인증서 기반 관찰·보안 도구와의 통합도 간소화됩니다.

이 작업은 SIG Auth가 주도한 [KEP \#4317](https://kep.k8s.io/4317)의 일환으로 진행되었습니다.

### "Restricted" 파드 보안 표준에서 원격 프로브 금지

프로브 및 라이프사이클 핸들러의 `host` 필드는 `podIP`가 아닌 다른 엔티티를 `kubelet`이 프로브하도록 지정할 수 있습니다.
하지만 이 필드는 **임의의** 값(보안에 민감한 외부 호스트, 노드의 localhost 등)으로 설정할 수 있어 오용 및 보안 우회 공격 경로가 될 수 있습니다.
쿠버네티스 v1.34에서는, 파드가
`host` 필드를 비워두거나 해당 종류의 프로브를 사용하지 않을 때만
[Restricted](/docs/concepts/security/pod-security-standards/#restricted)
파드 보안 표준을 충족합니다.
_파드 보안 어드미션_ 또는 서드파티 솔루션을 사용해서 파드가 이 표준을 준수하도록 강제할 수 있습니다.
보안 제어이므로, 선택한 강제 메커니즘의 한계와 동작을 문서에서 반드시 확인합니다.

이 작업은 SIG Auth가 주도한 [KEP \#4940](https://kep.k8s.io/4940)의 일환으로 진행되었습니다.

### 파드 배치 의사 표현을 위한 `.status.nominatedNodeName` 사용

`kube-scheduler`가 파드를 노드에 바인딩하는 데 시간이 걸릴 때, 클러스터 오토스케일러가 파드가 특정 노드에 바인딩될 것임을 이해하지 못해 해당 노드를 미사용으로 간주하고 삭제할 수 있습니다.
이 문제를 해결하기 위해, `kube-scheduler`는 프리엠션 진행뿐 아니라 파드 배치 의사를 표현하기 위해 `.status.nominatedNodeName`을 사용할 수 있습니다. `NominatedNodeNameForExpectation` feature gate를 활성화하면, 스케줄러가 이 필드를 사용해서 파드가 바인딩될 노드를 표시합니다. 이를 통해 외부 컴포넌트가 내부 예약 정보를 활용해 더 나은 결정을 내릴 수 있습니다.

이 작업은 SIG Scheduling이 주도한 [KEP \#5278](https://kep.k8s.io/5278)의 일환으로 진행되었습니다.

### 알파 상태인 DRA 기능

#### DRA 리소스 헬스 상태

파드가 장애가 있거나 일시적으로 비정상인 장치를 사용할 때 이를 파악하기 어려워, 파드 충돌 원인 분석이 어렵거나 불가능할 수 있습니다.
DRA의 리소스 헬스 상태 기능은 파드에 할당된 장치의 헬스 상태를 파드의 상태에 노출해서 관찰성을 높입니다. 이를 통해 비정상 장치로 인한 파드 문제의 원인을 쉽게 파악하고 적절히 대응할 수 있습니다.
이 기능을 사용하려면 `ResourceHealthStatus` 기능 게이트를 활성화하고, DRA 드라이버가 `DRAResourceHealth` gRPC 서비스를 구현해야 합니다.

이 작업은 WG Device Management가 주도한 [KEP \#4680](https://kep.k8s.io/4680)의 일환으로 진행되었습니다.

#### 확장 리소스 매핑

확장 리소스 매핑은 DRA의 표현력 있고 유연한 접근 방식에 대한 더 간단한 대안으로, 리소스 용량과 소비를 쉽게 기술할 수 있게 해줍니다. 이 기능을 통해 클러스터 관리자는 DRA로 관리되는 리소스를 *확장 리소스*로 광고할 수 있고, 애플리케이션 개발자와 운영자는 익숙한 컨테이너의 `.spec.resources` 문법을 그대로 사용해서 이를 소비할 수 있습니다.
이 기능을 통해 기존 워크로드도 별도의 수정 없이 DRA를 도입할 수 있어서, 애플리케이션 개발자와 클러스터 관리자의 DRA 전환이 간소화됩니다.

이 작업은 WG Device Management가 주도한 [KEP \#5004](https://kep.k8s.io/5004)의 일환으로 진행되었습니다.

#### DRA 소비 가능 용량(DRA consumable capacity)

쿠버네티스 v1.33에서는 리소스 드라이버가 전체 장치가 아닌, 사용 가능한 장치의 슬라이스만 광고할 수 있도록 지원했습니다. 하지만 이 방식은 장치 드라이버가 사용자 수요에 따라 장치 리소스의 세밀하고 동적인 부분을 관리하거나, 스펙과 네임스페이스로 제한되는 ResourceClaims와 독립적으로 리소스를 공유해야 하는 시나리오를 처리할 수 없었습니다.  
`DRAConsumableCapacity` 기능 게이트를 활성화하면
(v1.34에서 알파로 도입)
리소스 드라이버가 동일한 장치 또는 장치의 슬라이스를 여러 ResourceClaims 또는 여러 DeviceRequests에 걸쳐 공유할 수 있습니다.
이 기능은 스케줄러가 `capacity` 필드에 정의된 장치 리소스의
일부를 할당할 수 있도록 확장합니다.
DRA의 이 기능은 네임스페이스와 클레임 간 장치 공유를 개선해서 파드의 요구에 맞게 조정할 수 있습니다. 드라이버가 용량 제한을 강제할 수 있고, 스케줄링을 개선하며, 대역폭 인식 네트워킹이나 멀티테넌트 공유 등 새로운 사용 사례도 지원합니다.

이 작업은 WG Device Management가 주도한 [KEP \#5075](https://kep.k8s.io/5075)의 일환으로 진행되었습니다.

#### 장치 바인딩 조건

쿠버네티스 스케줄러는 파드가 필요한 외부 리소스(예: attachable 장치, FPGA 등)가 준비되었는지 확인될 때까지 노드에 바인딩을 지연시켜 신뢰성을 높입니다.
이 지연 메커니즘은 스케줄링 프레임워크의 [PreBind 단계](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)에 구현되어 있습니다. 이 단계에서 스케줄러는 모든 필요한 장치 조건이 충족되었는지 확인한 후 바인딩을 진행합니다. 이를 통해 외부 장치 컨트롤러와의 조율이 가능해져, 더 견고하고 예측 가능한 스케줄링이 가능합니다.

이 작업은 WG Device Management가 주도한 [KEP \#5007](https://kep.k8s.io/5007)의 일환으로 진행되었습니다.

### 컨테이너 재시작 규칙

현재 파드 내 모든 컨테이너는 종료 또는 충돌 시 동일한 `.spec.restartPolicy`를 따릅니다. 하지만 여러 컨테이너가 있는 파드는 각 컨테이너마다 다른 재시작 요구가 있을 수 있습니다. 예를 들어, 초기화용 init 컨테이너는 실패 시 재시작하지 않는 것이 바람직할 수 있습니다. ML 연구 환경의 장기 학습 워크로드에서는, 재시작 가능한 종료 코드로 실패한 컨테이너는 파드를 재생성하지 않고 빠르게 인플레이스 재시작하는 것이 좋습니다.
쿠버네티스 v1.34는 `ContainerRestartRules` 기능 게이트를 도입합니다. 활성화하면 파드 내 각 컨테이너에 대해 `restartPolicy`를 지정할 수 있습니다. 또한, 마지막 종료 코드에 따라 `restartPolicy`를 오버라이드하는 `restartPolicyRules` 목록도 정의할 수 있습니다. 이를 통해 복잡한 시나리오에 맞는 세분화된 제어와 컴퓨트 리소스의 더 나은 활용이 가능합니다.

이 작업은 SIG Node가 주도한 [KEP \#5307](https://kep.k8s.io/5307)의 일환으로 진행되었습니다.

### 런타임 생성 파일에서 환경 변수 로드
애플리케이션 개발자는 환경 변수 선언의 유연성을 오랫동안 요구해왔습니다.
기존에는 환경 변수를 API 서버에서 고정(static) 값, 컨피그맵(ConfigMap), 시크릿 등으로 선언할 수 있었습니다.

`EnvFiles` 기능 게이트를 통해 쿠버네티스 v1.34는 런타임에 환경 변수를 선언할 수 있는 기능을 도입합니다.  
한 컨테이너(주로 init 컨테이너)가 변수를 생성해서 파일에 저장하면,
이후 컨테이너가 해당 파일에서 환경 변수를 로드해 시작할 수 있습니다.  
이 방식은 대상 컨테이너의 entrypoint를 "감쌀" 필요 없이, 파드 내 컨테이너 오케스트레이션을
더 유연하게 할 수 있게 합니다.

이 기능은 특히 AI/ML 학습 워크로드에 유용하며, 학습 잡의 각 파드가
런타임에 정의된 값으로 초기화되어야 할 때 활용됩니다.

이 작업은 SIG Node가 주도한 [KEP \#5307](https://kep.k8s.io/3721)의 일환으로 진행되었습니다.

## v1.34에서의 승격, 사용 중단, 제거 사항

### 스테이블로 승격된 기능

아래는 스테이블로 승격된 모든 기능 목록입니다. 알파에서 베타로 승격된 기능 등 전체 업데이트 목록은 릴리스 노트를 참고하십시오.

이번 릴리스에서는 총 23개의 개선 사항이 스테이블로 승격되었습니다.

* [환경 변수에 거의 모든 출력 가능한 ASCII 문자 허용](https://kep.k8s.io/4369)
* [Job 컨트롤러에서 완전히 종료된 Pod 재생성 허용](https://kep.k8s.io/3939)
* [PreStop Hook의 Sleep 액션에 0값 허용](https://kep.k8s.io/4818)
* [API 서버 트레이싱](https://kep.k8s.io/647)
* [AppArmor 지원](https://kep.k8s.io/24)
* [필드 및 레이블 셀렉터로 권한 부여](https://kep.k8s.io/4601)
* [캐시에서 일관된 읽기](https://kep.k8s.io/2340)
* [TaintManager와 NodeLifecycleController 분리](https://kep.k8s.io/3902)
* [CRI에서 cgroup 드라이버 탐지](https://kep.k8s.io/4033)
* [DRA: 구조화된 매개변수](https://kep.k8s.io/4381)
* [PreStop Hook의 Sleep 액션 도입](https://kep.k8s.io/3960)
* [Kubelet OpenTelemetry 트레이싱](https://kep.k8s.io/2831)
* [쿠버네티스 VolumeAttributesClass ModifyVolume](https://kep.k8s.io/3751)
* [노드 메모리 스왑 지원](https://kep.k8s.io/2400)
* [지정된 엔드포인트에만 익명 인증 허용](https://kep.k8s.io/4633)
* [네임스페이스 삭제 순서 지정](https://kep.k8s.io/5080)
* [kube-scheduler의 플러그인별 콜백 함수로 정확한 재큐잉](https://kep.k8s.io/4247)
* [DNS 검색 문자열 검증 완화](https://kep.k8s.io/4427)
* [견고한 Watchcache 초기화](https://kep.k8s.io/4568)
* [LIST 응답의 스트리밍 인코딩](https://kep.k8s.io/5116)
* [구조화된 인증 구성](https://kep.k8s.io/3331)
* [윈도우 kube-proxy에서 Direct Service Return(DSR) 및 오버레이 네트워킹 지원](https://kep.k8s.io/5100)
* [볼륨 확장 실패 복구 지원](https://kep.k8s.io/1790)

### 사용 중단 및 제거 {#deprecations-and-removals}

쿠버네티스가 발전하고 성숙해지면서, 프로젝트의 건강을 위해 기능이
사용 중단되거나 제거되거나 더 나은 기능으로 대체될 수 있습니다.
자세한 내용은 쿠버네티스 [사용 중단 및 제거 정책](/docs/reference/using-api/deprecation-policy/)을
참고합니다. 쿠버네티스 v1.34에는 몇 가지 사용 중단 사항이 포함되어 있습니다.

#### 수동 cgroup 드라이버 설정 사용 중단

역사적으로 올바른 cgroup 드라이버를 설정하는 것은 쿠버네티스 클러스터 사용자에게 복잡한 작업이었습니다.
쿠버네티스 v1.28에서는 `kubelet`이
CRI 구현에 쿼리해서 사용할 cgroup 드라이버를 자동으로 감지하는 방식을 추가하였습니다. 이 자동 감지는 이제
**강력히 권장**되며, v1.34에서 스테이블로 승격되었습니다.
만약 사용 중인 CRI 컨테이너 런타임이 필요한
cgroup 드라이버를 보고할 수 없다면,
런타임을 업그레이드하거나 변경해야 합니다.
`kubelet` 구성 파일의 `cgroupDriver` 설정은 이제 사용 중단되었습니다.
명령줄 옵션 `--cgroup-driver`도 이전에 사용 중단됐으며,
쿠버네티스는 구성 파일을 대신 사용할 것을 권장합니다.
구성 설정과 명령줄 옵션 모두 향후 릴리스에서 제거될 예정이며,
v1.36 이전에는 제거되지 않습니다.

이 작업은 SIG Node가 주도한 [KEP \#4033](https://kep.k8s.io/4033)의 일환으로 진행되었습니다.

#### v1.36에서 containerd 1.x 쿠버네티스 지원 종료 예정
쿠버네티스 v1.34는 여전히 containerd 1.7 및 기타 LTS 릴리스를 지원하지만,
자동 cgroup 드라이버 감지 도입에 따라 쿠버네티스 SIG Node 커뮤니티는
containerd v1.X에 대한 최종 지원 일정을 공식적으로 합의했습니다.
containerd 1.7 EOL과 맞물려, v1.35가 마지막 지원 릴리스가 될 예정입니다.
containerd 1.X를 사용 중이라면 곧 2.0+로 전환하는 것을 고려해야 합니다.
`kubelet_cri_losing_support` 메트릭을 모니터링하여 클러스터 내 노드가 곧
지원이 중단될 containerd 버전을 사용 중인지 확인합니다.

이 작업은 SIG Node가 주도한 [KEP \#4033](https://kep.k8s.io/4033)의 일환으로 진행되었습니다.

#### `PreferClose` 트래픽 분배 사용 중단
쿠버네티스 [서비스](/docs/concepts/services-networking/service/)의 `spec.trafficDistribution` 필드는 트래픽을 서비스 엔드포인트에 라우팅하는 방식을 지정할 수 있습니다.

[KEP-3015](https://kep.k8s.io/3015)는 `PreferClose`를 사용 중단하고, 두 가지 추가 값인 `PreferSameZone`과 `PreferSameNode`를 도입합니다. `PreferSameZone`은 기존 `PreferClose`의 의미를 명확히 하기 위한 별칭입니다. `PreferSameNode`는 가능할 경우 로컬 엔드포인트로 연결을 전달하고, 불가능할 경우 원격 엔드포인트로 다시 되돌아옵니다.

이 기능은 v1.33에서 `PreferSameTrafficDistribution` 기능 게이트로 도입됐으며, v1.34에서 베타로 승격되어 디폴트로 활성화됩니다.

이 작업은 SIG Network가 주도한 [KEP \#3015](https://kep.k8s.io/3015)의 일환으로 진행되었습니다.

## 릴리스 노트

쿠버네티스 v1.34 릴리스의 전체 세부사항은 [릴리스 노트](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)에서 확인합니다.

## 다운로드 및 시작하기

쿠버네티스 v1.34는 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.34.0) 또는 [쿠버네티스 다운로드 페이지](/releases/download/)에서 다운로드할 수 있습니다.

쿠버네티스를 시작하려면 [인터랙티브 튜토리얼](/ko/docs/tutorials/)을 참고하거나, [minikube](https://minikube.sigs.k8s.io/)로 로컬 쿠버네티스 클러스터를 실행합니다. [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)을 사용하면 v1.34를 손쉽게 설치할 수 있습니다.

## 릴리스 팀

쿠버네티스는 커뮤니티의 지원, 헌신, 그리고 노력 없이는 불가능합니다. 각 릴리스 팀은 커뮤니티 자원봉사자들로 구성되어, 모두가 의존하는 쿠버네티스 릴리스를 함께 만들어갑니다. 이는 코드부터 문서, 프로젝트 관리까지 커뮤니티 각 분야의 전문성이 필요합니다.

[Rodolfo "Rodo" Martínez Vega와의 기억을 존경합니다](https://github.com/cncf/memorials/blob/main/rodolfo-martinez.md). 기술과 커뮤니티 빌딩에 대한 열정으로 쿠버네티스 커뮤니티에 큰 흔적을 남긴 헌신적인 기여자를 기억합니다. Rodo는 v1.22-v1.23과 v1.25-v1.30를 포함한 여러 릴리스에서 쿠버네티스 릴리스 팀 구성원으로 활약하며 프로젝트의 성공과 안정성에 변함없는 헌신을 보여줬습니다.
릴리스 팀 활동 외에도, Rodo는 Cloud Native LATAM 커뮤니티 활성화에 깊이 관여하며 언어와 문화의 장벽을 허물었습니다. 쿠버네티스 스페인어 문서와 CNCF 용어집 작업을 통해 스페인어권 개발자들에게 지식을 더 쉽게 전달하는 데 헌신했습니다. Rodo의 유산은 그가 멘토링한 수많은 커뮤니티 구성원, 그가 기여한 릴리스, 그리고 그가 키운 LATAM 쿠버네티스 커뮤니티에 살아 있습니다.

쿠버네티스 v1.34 릴리스를 커뮤니티에 제공하기 위해 노력해준 [릴리스 팀](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md) 전체에 감사드립니다. 릴리스 팀은 첫 참여자부터 여러 릴리스를 경험한 리더까지 다양하게 구성되어 있습니다. 특히 릴리스 리드 Vyom Yadav에게 성공적인 릴리스 사이클을 이끌고, 문제 해결에 직접 나서며, 커뮤니티에 에너지와 배려를 불어넣어준 점에 깊이 감사드립니다.

## 프로젝트 속도

CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) 프로젝트는 쿠버네티스와 다양한 서브 프로젝트의 개발 속도와 관련된 흥미로운 데이터를 집계합니다. 여기에는 개인별 기여, 참여 기업 수 등 생태계 발전에 투입된 노력의 깊이와 폭을 보여주는 지표가 포함됩니다.

v1.34 릴리스 사이클(2025년 5월 19일~8월 27일, 15주) 동안 쿠버네티스에는 106개 기업과 491명의 개인이 기여했습니다. 더 넓은 클라우드 네이티브 생태계에서는 370개 기업, 2,235명의 기여자가 활동했습니다.

여기서 "기여"란 커밋, 코드 리뷰, 댓글, 이슈 또는 PR 생성, PR 리뷰(블로그·문서 포함), 이슈·PR 댓글 등 모든 활동을 포함합니다.  
기여에 관심이 있다면 [시작하기](https://www.kubernetes.dev/docs/guide/#getting-started) 페이지를 방문합니다.

이 데이터의 출처:

* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## 이벤트 소식

다가오는 쿠버네티스 및 클라우드 네이티브 행사를 소개합니다. KubeCon \+ CloudNativeCon, KCD, 그리고 전 세계 주요 컨퍼런스 정보를 확인하고 커뮤니티와 함께하세요\!

**2025년 8월**

- [**KCD - Kubernetes Community Days: 콜롬비아**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/): 2025년 8월 28일 | 보고타, 콜롬비아

**2025년 9월**

- [**CloudCon 시드니**](https://community.cncf.io/events/details/cncf-cloud-native-sydney-presents-cloudcon-sydney-sydney-international-convention-centre-910-september/): 2025년 9월 9~10일 | 시드니, 호주
- [**KCD - Kubernetes Community Days: 샌프란시스코 베이 에어리어**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/): 2025년 9월 9일 | 샌프란시스코, 미국
- [**KCD - Kubernetes Community Days: 워싱턴 DC**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2025/): 2025년 9월 16일 | 워싱턴 D.C., 미국
- [**KCD - Kubernetes Community Days: 소피아**](https://community.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia/): 2025년 9월 18일 | 소피아, 불가리아
- [**KCD - Kubernetes Community Days: 엘살바도르**](https://community.cncf.io/events/details/cncf-kcd-el-salvador-presents-kcd-el-salvador/): 2025년 9월 20일 | 산살바도르, 엘살바도르

**2025년 10월**

- [**KCD - Kubernetes Community Days: 바르샤바**](https://community.cncf.io/events/details/cncf-kcd-warsaw-presents-kcd-warsaw-2025/): 2025년 10월 9일 | 바르샤바, 폴란드
- [**KCD - Kubernetes Community Days: 에든버러**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2025/): 2025년 10월 21일 | 에든버러, 영국
- [**KCD - Kubernetes Community Days: 스리랑카**](https://community.cncf.io/events/details/cncf-kcd-sri-lanka-presents-kcd-sri-lanka-2025/): 2025년 10월 26일 | 콜롬보, 스리랑카

**2025년 11월**

- [**KCD - Kubernetes Community Days: 포르투**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2025/): 2025년 11월 3일 | 포르투, 포르투갈
- [**KubeCon + CloudNativeCon North America 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2025년 11월 10~13일 | 애틀랜타, 미국
- [**KCD - Kubernetes Community Days: 항저우**](https://sessionize.com/kcd-hangzhou-and-oicd-2025/): 2025년 11월 14일 | 항저우, 중국

**2025년 12월**

- [**KCD - Kubernetes Community Days: 스위스 로망드**](https://community.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/): 2025년 12월 4일 | 제네바, 스위스

최신 행사 정보는 [여기](https://community.cncf.io/events/#/list)에서 확인합니다.

## 다가오는 릴리스 웨비나

쿠버네티스 v1.34 릴리스 팀 멤버들이 **2025년 9월 24일(수) 오후 4시(UTC)** 에 릴리스 주요 내용을 소개하는 웨비나를 진행합니다. 자세한 정보와 등록은 CNCF 온라인 프로그램의 [행사 페이지](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v134-release/)에서 확인합니다.

## 참여 방법

쿠버네티스에 참여하는 가장 쉬운 방법은 관심 분야에 맞는 다양한 [SIG(Special Interest Group)](https://github.com/kubernetes/community/blob/master/sig-list.md)에 가입하는 것입니다. 커뮤니티에 알리고 싶은 내용이 있다면, 매주 열리는 [커뮤니티 미팅](https://github.com/kubernetes/community/tree/master/communication)과 아래 채널을 통해 의견을 공유합니다. 지속적인 피드백과 응원에 감사드립니다.

* 최신 소식을 Bluesky [@Kubernetesio](https://bsky.app/profile/kubernetes.io)에서 확인합니다
* [Discuss](https://discuss.kubernetes.io/)에서 커뮤니티 토론에 참여합니다
* [Slack](http://slack.k8s.io/)에서 커뮤니티와 소통합니다
* [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)에서 질문을 올리거나 답변합니다
* 여러분의 쿠버네티스 [스토리](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)를 공유합니다
* [블로그](https://kubernetes.io/blog/)에서 쿠버네티스 최신 소식을 읽습니다
* [쿠버네티스 릴리스 팀](https://github.com/kubernetes/sig-release/tree/master/release-team)에 대해 더 알아봅니다

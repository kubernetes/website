---
# reviewers:
# - tallclair
# - liggitt
title: 파드 시큐리티 어드미션
description: >
  파드 보안을 적용할 수 있는 파드 시큐리티 어드미션 컨트롤러에 대한
  개요
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

쿠버네티스 [파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards/)는 
파드에 대해 서로 다른 격리 수준을 정의한다. 이러한 표준을 사용하면 파드의 동작을
명확하고 일관된 방식으로 제한하는 방법을 정의할 수 있다.

쿠버네티스는 파드 시큐리티 스탠다드를 적용하기 위해 내장된 _파드 시큐리티_
{{< glossary_tooltip text="어드미션 컨트롤러" term_id="admission-controller" >}}를 제공한다. 파드 시큐리티의 제한은
파드가 생성될 때 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}} 수준에서
적용된다.

### 내장된 파드 시큐리티 어드미션 적용

이 페이지는 쿠버네티스 v{{< skew currentVersion >}}에 대한 문서 일부이다.
다른 버전의 쿠버네티스를 실행 중인 경우, 해당 릴리즈에 대한 문서를 참고한다.

<!-- body -->

## 파드 시큐리티 수준

파드 시큐리티 어드미션은 파드의 
[시큐리티 컨텍스트](/docs/tasks/configure-pod-container/security-context/) 및 기타 관련 필드인
[파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards)에 정의된 세가지 수준에 따라 요구사항을 적용한다:
`특권(privileged)`, `기본(baseline)` 그리고 `제한(restricted)`.
이러한 요구사항에 대한 자세한 내용은
[파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards) 페이지를 참고한다.

## 네임스페이스에 대한 파드 시큐리티 어드미션 레이블

이 기능이 활성화되거나 웹훅이 설치되면, 네임스페이스를 구성하여
각 네임스페이스에서 파드 보안에 사용할 어드미션 제어 모드를 정의할 수 있다.
쿠버네티스는 미리 정의된 파드 시큐리티 스탠다드 수준을 사용자가 네임스페이스에 정의하여
사용할 수 있도록 {{< glossary_tooltip term_id="label" text="레이블" >}} 집합을 정의한다.
선택한 레이블은 잠재적인 위반이 감지될 경우 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}이
취하는 조치를 정의한다.

{{< table caption="파드 시큐리티 어드미션 모드" >}}
모드 | 설명
:---------|:------------
**강제(enforce)** | 정책 위반 시 파드가 거부된다.
**감사(audit)** | 정책 위반이 [감사 로그](/ko/docs/tasks/debug/debug-cluster/audit/)에 감사 어노테이션 이벤트로 추가되지만, 허용은 된다.
**경고(warn)** | 정책 위반이 사용자에게 드러나도록 경고를 트리거하지만, 허용은 된다.
{{< /table >}}

네임스페이스는 일부 또는 모든 모드를 구성하거나, 모드마다 다른 수준을 설정할 수 있다.

각 모드에는, 사용되는 정책을 결정하는 두 개의 레이블이 존재한다.

```yaml
# 모드별 단계 레이블은 모드에 적용할 정책 수준을 나타낸다.
#
# 모드(MODE)는 반드시 `강제(enforce)`, `감사(audit)` 혹은 `경고(warn)`중 하나여야 한다.
# 단계(LEVEL)는 반드시 `특권(privileged)`, `기본(baseline)`, or `제한(restricted)` 중 하나여야 한다.
pod-security.kubernetes.io/<MODE>: <LEVEL>

# 선택 사항: 특정 쿠버네티스 마이너 버전(예를 들어, v{{< skew currentVersion >}})과 함께
# 제공된 버전에 정책을 고정하는 데 사용할 수 있는 모드별 버전 레이블
#
# 모드(MODE)는 반드시 `강제(enforce)`, `감사(audit)` 혹은 `경고(warn)`중 하나여야 한다.
# 버전(VERSION)은 반드시 올바른 쿠버네티스의 마이너(minor) 버전 혹은 '최신(latest)'하나여야 한다.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

[네임스페이스 레이블로 파드 시큐리티 스탠다드 적용하기](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) 문서를 확인하여 사용 예시를 확인한다.

## 워크로드 리소스 및 파드 템플릿

파드는 {{< glossary_tooltip term_id="deployment" >}}나 {{< glossary_tooltip term_id="job">}}과 같은
[워크로드 오브젝트](/ko/docs/concepts/workloads/controllers/) 생성을 통해
간접적으로 생성되는 경우가 많다. 워크로드 오브젝트는 _파드 템플릿_을 정의하고
워크로드 리소스에 대한 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}}는
해당 템플릿을 기반으로 파드를 생성한다. 위반을 조기에 발견할 수 있도록 감사 모드와 경고 모드가
모두 워크로드 리소스에 적용된다. 그러나 강제 모드에서는 워크로드 리소스에
적용되지 **않으며**, 결과가 되는 파드 오브젝트에만 적용된다.

## 면제 (exemptions)

지정된 네임스페이스와 관련된 정책으로 인해 금지된
파드 생성을 허용하기 위해 파드 보안 강제에서 _면제_ 를 정의할 수 있다.
면제는 [어드미션 컨트롤러 구성하기](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)
에서 정적으로 구성할 수 있다.

면제는 명시적으로 열거해야 한다. 면제 기준을 충족하는 요청은
어드미션 컨트롤러에 의해 _무시_ 된다. 면제 기준은 다음과 같다.

- **사용자 이름(Usernames):** 면제 인증된(혹은 사칭한) 사용자 이름을 가진 사용자의 요청은
  무시된다.
- **런타임 클래스 이름(RuntimeClassNames):** 면제 런타임 클래스 이름을 지정하는 파드 및 [워크로드 리소스](#워크로드-리소스-및-파드-템플릿)는
  무시된다.
- **네임스페이스(Namespaces):** 파드 및 [워크로드 리소스](#워크로드-리소스-및-파드-템플릿)는 면제 네임스페이스에서 무시된다.

{{< caution >}}

대부분의 파드는 컨트롤러가 [워크로드 리소스](#워크로드-리소스-및-파드-템플릿)
에 대한 응답으로 생성되므로, 최종 사용자가 파드를 직접 생성할 때만
적용을 면제하고 워크로드 리소스를 생성할 때는 적용이 면제하지 않는다.
컨트롤러 서비스 어카운트(예로 `system:serviceaccount:kube-system:replicaset-controller`)
는 일반적으로 해당 워크로드 리소스를 생성할 수 있는 모든 사용자를 암시적으로 
면제할 수 있으므로 면제해서는 안 된다.

{{< /caution >}}

다음 파드 필드에 대한 업데이트는 정책 검사에서 제외되므로, 파드 업데이트 요청이
이러한 필드만 변경하는 경우, 파드가 현재 정책 수준을 위반하더라도 
거부되지 않는다.

- seccomp 또는 AppArmor 어노테이션에 대한 변경 사항을 **제외한** 모든 메타데이터 업데이트.
  - `seccomp.security.alpha.kubernetes.io/pod` (사용 중단)
  - `container.seccomp.security.alpha.kubernetes.io/*` (사용 중단)
  - `container.apparmor.security.beta.kubernetes.io/*`
- `.spec.activeDeadlineSeconds` 에 대해 유효한 업데이트
- `.spec.tolerations` 에 대해 유효한 업데이트

## {{% heading "whatsnext" %}}

- [파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards)
- [파드 시큐리티 스탠다드 적용하기](/ko/docs/setup/best-practices/enforcing-pod-security-standards)
- [기본 제공 어드미션 컨트롤러를 구성하여 파드 시큐리티 스탠다드 적용하기](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [네임스페이스 레이블로 파드 시큐리티 스탠다드 적용하기](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)
- [파드시큐리티폴리시(PodSecurityPolicy)에서 내장 파드시큐리티어드미션컨트롤러(PodSecurity Admission Controller)로 마이그레이션](/docs/tasks/configure-pod-container/migrate-from-psp)

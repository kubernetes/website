---
title: 네임스페이스 레이블로 파드 시큐리티 스탠다드 적용하기
# reviewers:
# - tallclair
# - liggitt
content_type: task
weight: 250
---

네임스페이스에 레이블을 지정하여 [파드 시큐리티 스탠다드](/docs/concepts/security/pod-security-standards)를 적용할 수 있다. 세 가지 정책인
[특권(privileged)](/docs/concepts/security/pod-security-standards/#privileged), [기본(baseline)](/docs/concepts/security/pod-security-standards/#baseline)
그리고 [제한(restricted)](/docs/concepts/security/pod-security-standards/#restricted)은 보안 스펙트럼을 폭넓게 다루며,
[파드 시큐리티](/docs/concepts/security/pod-security-admission/) {{< glossary_tooltip
text="어드미션 컨트롤러" term_id="admission-controller" >}}에 의해 구현된다.

## {{% heading "prerequisites" %}}

파드 시큐리티 어드미션은 쿠버네티스 v1.23에서 베타가 되면서
기본적으로 사용할 수 있게 되었다. 버전 1.25부터는 파드 시큐리티 어드미션을
정식으로 사용할 수 있다.

{{% version-check %}}

## 네임스페이스 레이블로 `baseline` 파드 시큐리티 스탠다드 요구하기

이 매니페스트는 다음과 같은 네임스페이스 `my-baseline-namespace`를 정의한다.

- `baseline` 정책 요구사항을 충족하지 않는 모든 파드를 _차단한다_.
- `restricted` 정책 요구사항을 충족하지 않는 파드가 생성되면 사용자에게 경고를 표시하고
  감사(audit) 어노테이션을 추가한다.
- `baseline` 및 `restricted` 정책의 버전을 v{{< skew currentVersion >}}으로 고정한다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # _원하는_ `enforce` 수준으로 설정한다.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## `kubectl label`로 기존 네임스페이스에 레이블 추가하기

{{< note >}}
`enforce` 정책(또는 버전) 레이블이 추가되거나 변경되면, 어드미션 플러그인은 네임스페이스의
각 파드를 새 정책에 대해 검사한다. 위반 사항은 사용자에게 경고로 반환된다.
{{< /note >}}

네임스페이스의 보안 프로필 변경을 처음 평가할 때는 `--dry-run` 플래그를 적용하는 것이
유용하다. 파드 시큐리티 스탠다드 검사는 _dry run_ 모드에서도 그대로 실행되므로,
실제로 정책을 업데이트하지 않고도 새 정책이 기존 파드를 어떻게 처리할지에 대한 정보를 얻을 수 있다.

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### 모든 네임스페이스에 적용하기

파드 시큐리티 스탠다드를 처음 도입한다면, 모든 네임스페이스에 `baseline`과 같은
더 엄격한 수준의 감사 어노테이션을 설정하는 것이 적절한 첫 단계가 될 수 있다.

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

아직 명시적으로 평가되지 않은 네임스페이스를 구별할 수 있도록, 강제(enforce) 수준은
설정하지 않는다는 점에 유의한다. 다음 명령을 사용하여 강제 수준이 명시적으로 설정되지 않은
네임스페이스를 나열할 수 있다.

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### 단일 네임스페이스에 적용하기

특정 네임스페이스만 업데이트할 수도 있다. 다음 명령은 `my-existing-namespace`에 `enforce=restricted`
정책을 추가하고, restricted 정책 버전을 v{{< skew currentVersion >}}으로 고정한다.

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```

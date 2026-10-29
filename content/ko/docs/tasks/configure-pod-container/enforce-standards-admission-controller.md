---
title: 내장 어드미션 컨트롤러를 구성하여 파드 시큐리티 스탠다드 적용하기
reviewers:
- tallclair
- liggitt
content_type: task
weight: 240
---

쿠버네티스는 [파드 시큐리티 스탠다드](/docs/concepts/security/pod-security-standards)를
적용하기 위한 내장 [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)를 제공한다.
이 어드미션 컨트롤러를 구성하여 클러스터 전체의 기본값과 [면제(exemptions)](/ko/docs/concepts/security/pod-security-admission/#면제-exemptions)를 설정할 수 있다.

## {{% heading "prerequisites" %}}

파드 시큐리티 어드미션은 쿠버네티스 v1.22에서
알파로 릴리스된 이후, 쿠버네티스 v1.23에서는 베타가 되면서 기본적으로 사용할 수 있게 되었다.
버전 1.25부터는 파드 시큐리티 어드미션을
정식으로 사용할 수 있다.

{{% version-check %}}

쿠버네티스 {{< skew currentVersion >}} 버전을 실행하고 있지 않다면,
실행 중인 쿠버네티스 버전에 해당하는 문서로 전환하여
이 페이지를 확인할 수 있다.

## 어드미션 컨트롤러 구성하기

{{< note >}}
`pod-security.admission.config.k8s.io/v1` 구성은 v1.25 이상이 필요하다.
v1.23 및 v1.24에서는 [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)을 사용한다.
v1.22에서는 [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)을 사용한다.
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1 # 호환성 참고 사항 확인
    kind: PodSecurityConfiguration
    # 모드 레이블이 설정되지 않았을 때 적용되는 기본값.
    #
    # 수준(level) 레이블 값은 다음 중 하나여야 한다.
    # - "privileged" (기본값)
    # - "baseline"
    # - "restricted"
    #
    # 버전 레이블 값은 다음 중 하나여야 한다.
    # - "latest" (기본값) 
    # - "v{{< skew currentVersion >}}"과 같은 특정 버전
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 면제할 인증된 사용자 이름의 배열.
      usernames: []
      # 면제할 런타임 클래스 이름의 배열.
      runtimeClasses: []
      # 면제할 네임스페이스의 배열.
      namespaces: []
```

{{< note >}}
위 매니페스트는 kube-apiserver에 `--admission-control-config-file`을 통해 지정해야 한다.
{{< /note >}}


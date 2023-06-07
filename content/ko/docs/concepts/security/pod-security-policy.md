---
title: 파드 시큐리티 폴리시
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="제거된 기능" color="warning" %}}
파드시큐리티폴리시(PodSecurityPolicy)는 쿠버네티스 1.21 버전부터 [사용 중단(deprecated)](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)되었으며, 
v1.25 버전 때 쿠버네티스에서 제거되었다. 
{{% /alert %}}

파드시큐리티폴리시를 사용하는 것 대신, 다음 중 하나를 사용하거나 둘 다 사용하여 파드에 유사한 제한을 
적용할 수 있다.

- [파드 시큐리티 어드미션](/ko/docs/concepts/security/pod-security-admission/)
- 직접 배포하고 구성할 수 있는 서드파티 어드미션 플러그인

마이그레이션에 관한 설명이 필요하다면 [파드시큐리티폴리시(PodSecurityPolicy)에서 빌트인 파드시큐리티어드미션컨트롤러(PodSecurity Admission Controller)로 마이그레이션](/docs/tasks/configure-pod-container/migrate-from-psp/)을 참고한다.
이 API 제거에 대해 더 많은 정보가 필요하다면,
[파드시큐리티폴리시(PodSecurityPolicy) 사용 중단: 과거, 현재, 미래](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)를 참고한다.

쿠버네티스 v{{< skew currentVersion >}} 이외의 버전을 실행 중이라면,
해당 쿠버네티스 버전에 대한 문서를 확인한다.

---
title: API 접근 제어
weight: 15
no_list: true
---

쿠버네티스가 API 접근을 구현 및 제어하는 방법에 대한 자세한 내용은
[쿠버네티스 API에 대한 접근 제어](/ko/docs/concepts/security/controlling-access/)를 참고한다.

참조 문헌

- [인증](/docs/reference/access-authn-authz/authentication/)
   - [부트스트랩 토큰 인증](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [승인 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)
   - [동적 승인 제어](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [인가](/ko/docs/reference/access-authn-authz/authorization/)
   - [역할 기반 접근 제어](/docs/reference/access-authn-authz/rbac/)
   - [속성 기반 접근 제어](/docs/reference/access-authn-authz/abac/)
   - [노드 인가](/docs/reference/access-authn-authz/node/)
   - [웹훅 인가](/docs/reference/access-authn-authz/webhook/)
- [인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - [CSR 승인](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)과
     [인증서 서명](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)을 포함함
- 서비스 어카운트
  - [개발자 가이드](/docs/tasks/configure-pod-container/configure-service-account/)
  - [관리](/ko/docs/reference/access-authn-authz/service-accounts-admin/)

---
title: 쿠버네티스 보안과 공개 정보
aliases: [/ko/security/]
# reviewers:
# - eparis
# - erictune
# - philips
# - jessfraz
content_type: concept
weight: 20
---

<!-- overview -->
이 페이지는 쿠버네티스 보안 및 공개 정보를 설명한다.


<!-- body -->
## 보안 공지

보안 및 주요 API 공지에 대한 이메일을 위해서는 [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce)) 그룹에 가입한다.

## 취약점 보고

우리는 쿠버네티스 오픈소스 커뮤니티에 취약점을 보고하는 보안 연구원들과 사용자들에게 매우 감사하고 있다. 모든 보고서는 커뮤니티 자원 봉사자들에 의해 철저히 조사된다.

보고서를 작성하려면, [쿠버네티스 버그 현상금 프로그램](https://hackerone.com/kubernetes)에 취약점을 제출한다. 이를 통해 표준화된 응답시간으로 취약점을 분류하고 처리할 수 있다.

또한, 보안 세부 내용과 [모든 쿠버네티스 버그 보고서](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml)로 부터 예상되는 세부사항을 [security@kubernetes.io](mailto:security@kubernetes.io)로 이메일을 보낸다.

[보안 대응 위원회(Security Response Committee) 구성원](https://git.k8s.io/security/README.md#product-security-committee-psc)의 GPG 키를 사용하여 이 목록으로 이메일을 암호화할 수 있다. GPG를 사용한 암호화는 공개할 필요가 없다.

### 언제 취약점을 보고해야 하는가?

- 쿠버네티스에서 잠재적인 보안 취약점을 발견했다고 생각하는 경우
- 취약성이 쿠버네티스에 어떤 영향을 미치는지 확신할 수 없는 경우
- 쿠버네티스가 의존하는 다른 프로젝트에서 취약점을 발견한 경우
  - 자체 취약성 보고 및 공개 프로세스가 있는 프로젝트의 경우 직접 보고한다.


### 언제 취약점을 보고하지 말아야 하는가?

- 보안을 위해 쿠버네티스 구성요소를 조정하는데 도움이 필요한 경우
- 보안 관련 업데이트를 적용하는 데 도움이 필요한 경우
- 보안 관련 문제가 아닌 경우

## 보안 취약점 대응

각 보고서는 보안 대응 위원회 위원들에 의해 작업일 3일 이내에 인정되고 분석된다. 이렇게 하면 [보안 릴리스 프로세스](https://git.k8s.io/security/security-release-process.md#disclosures)가 시작된다.

보안 대응 위원회와 공유하는 모든 취약성 정보는 쿠버네티스 프로젝트 내에 있으며, 문제를 해결할 필요가 없는 한 다른 프로젝트에 전파되지 않는다.

보안 문제가 심사에서 확인된 수정, 릴리스 계획으로 이동함에 따라 리포터를 계속 업데이트할 것이다.

## 공개 시기

공개 날짜는 쿠버네티스 보안 대응 위원회와 버그 제출자가 협상한다. 사용자 완화가 가능해지면 가능한 빨리 버그를 완전히 공개하는 것이 좋다. 버그 또는 픽스가 아직 완전히 이해되지 않았거나 솔루션이 제대로 테스트되지 않았거나 벤더 협력을 위해 공개를 지연시키는 것이 합리적이다. 공개 기간은 즉시(특히 이미 공개적으로 알려진 경우)부터 몇 주까지다. 간단한 완화 기능이 있는 취약점의 경우 보고 날짜부터 공개 날짜까지는 7일 정도 소요될 것으로 예상된다. 쿠버네티스 보안 대응 위원회는 공개 날짜를 설정할 때 최종 결정권을 갖는다.


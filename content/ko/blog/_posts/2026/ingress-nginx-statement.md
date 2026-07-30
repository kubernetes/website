---
layout: blog
title: "인그레스(Ingress) NGINX: 쿠버네티스 운영위원회 및 보안 대응 위원회의 성명"
date: 2026-01-29
slug: ingress-nginx-statement
author: >
  [Kat Cosgrove](https://github.com/katcosgrove) (Steering Committee)
translator: >
  [Inyong Hong(SamsungSDS)](https://github.com/hongp)
---

**2026년 3월, 쿠버네티스는 클라우드 네이티브 환경의 절반가량에서 핵심 구성 요소로 사용되는 인그레스 NGINX를 은퇴시킬 예정이다.** 프로젝트에 기여자와 유지관리자가 절실히 필요하다는 사실을 수년간 공개적으로 [경고](https://groups.google.com/a/kubernetes.io/g/dev/c/rxtrKvT_Q8E/m/6_ej0c1ZBAAJ)한 끝에, 인그레스 NGINX의 2026년 3월 은퇴 계획이 [발표](https://kubernetes.io/ko/blog/2025/11/11/ingress-nginx-retirement/)됐다. 프로젝트가 은퇴한 뒤에는 버그 수정, 보안 패치 또는 그 밖의 어떠한 업데이트도 더 이상 릴리스되지 않는다. 이 문제를 외면하거나 대수롭지 않게 여기거나 마지막 순간까지 미뤄서는 안 된다. 이 상황의 심각성과 [게이트웨이 API](https://gateway-api.sigs.k8s.io/guides/getting-started/) 또는 다양한 [서드파티 인그레스 컨트롤러](https://kubernetes.io/ko/docs/concepts/services-networking/ingress-controllers/)와 같은 대안으로 즉시 마이그레이션을 시작해야 한다는 점은 아무리 강조해도 지나치지 않다.

분명히 말하자면, 인그레스 NGINX가 은퇴한 뒤에도 계속 사용하면 여러분과 사용자가 공격에 취약해진다. 현재 이용 가능한 대안 가운데 바로 교체해서 사용할 수 있는 것은 없다. 이를 위해서는 계획을 세우고 기술적으로 준비할 시간이 필요하다. 여러분 중 절반이 영향을 받게 된다. 준비할 수 있는 기간은 두 달뿐이다.

**기존에 배포된 인그레스 NGINX는 계속 작동하므로, 미리 확인하지 않으면 침해 사고가 발생할 때까지 자신이 영향을 받는다는 사실을 알지 못할 수도 있다.** 대부분의 경우 클러스터 관리자 권한으로 `kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx`를 실행하여 인그레스 NGINX 사용 여부를 확인할 수 있다.

인그레스 NGINX는 폭넓은 인기를 얻어 다양한 규모의 기업에서 널리 사용되었고 유지관리자들도 거듭 도움을 요청했지만, 인그레스 NGINX 프로젝트는 절실히 필요했던 기여자를 끝내 확보하지 못했다. Datadog 내부 조사에 따르면 현재 클라우드 네이티브 환경의 약 50%가 이 도구를 사용하고 있지만, 지난 몇 년 동안 개인 시간을 들여 작업하는 단 한두 명이 유지보수를 전담해 왔다. 우리와 사용자 모두가 안전하다고 여길 수준으로 도구를 유지보수할 인력이 충분하지 않은 상황에서, 책임 있는 선택은 프로젝트를 종료하고 [게이트웨이 API](https://gateway-api.sigs.k8s.io/guides/getting-started/)와 같은 현대적 대안에 다시 집중하는 것이다.

우리는 이 결정을 가볍게 내리지 않았다. 지금은 불편하더라도 모든 사용자와 생태계 전체의 안전을 위해 반드시 필요한 결정이다. 안타깝게도 한때 장점이었던 인그레스 NGINX의 유연한 설계는 이제 해결할 수 없는 부담이 되었다. 누적된 기술 부채와 보안 결함을 악화시키는 근본적인 설계 결정으로 인해, 설령 자원이 확보되더라도 이 도구를 계속 유지보수하는 것은 더 이상 합리적이지도, 가능하지도 않다.

이 문제를 무시할 경우 상당수의 쿠버네티스 사용자가 심각한 위험에 처할 수 있다는 점과 이번 변화의 규모를 강조하기 위해 공동으로 이 성명을 발표한다. 지금 즉시 클러스터를 확인해야 한다. 인그레스 NGINX를 사용하고 있다면 마이그레이션 계획을 세우기 시작해야 한다.

감사합니다.

쿠버네티스 운영위원회

쿠버네티스 보안 대응 위원회

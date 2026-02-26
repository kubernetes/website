---
layout: blog
title: "인그레스(Ingress) NGINX 은퇴: 여러분이 알아야 할 사항"
slug: ingress-nginx-retirement
canonicalUrl: https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement
date: 2025-11-11T10:30:00-08:00
author: >
  Tabitha Sable (Kubernetes SRC)
translator: >
  [Jihoon Shin (Sejong Univ.)](https://github.com/developowl), [(Wonyong Hwang) (ASKUL)](https://github.com/wonyongg), [Ian Y. Choi (AWS)](https://github.com/ianychoi), [Seokho Son (ETRI)](https://github.com/seokho-son), [쿠버네티스 문서 한글화 팀](https://kubernetes.slack.com/archives/CA1MMR86S)
---

생태계의 안전과 보안을 우선시하기 위해, 쿠버네티스 SIG Network와 보안 대응 위원회(Security Response Committee)는 [인그레스(Ingress) NGINX](https://github.com/kubernetes/ingress-nginx/)의 은퇴(retirement) 예정을 발표한다. 최선의 노력으로 진행될 유지보수(best-effort maintenance)는 2026년 3월까지 계속된다. 그 이후에는 더 이상의 릴리스나 버그 수정은 없으며, 발견될 수 있는 보안 취약점을 해결하기 위한 업데이트도 제공되지 않는다. **기존에 배포된 인그레스 NGINX는 계속해서 작동할 것이며, 설치 아티팩트(artifacts) 또한 사용 가능한 상태로 유지될 것이다.**

우리는 다양한 대안 중 하나로 마이그레이션할 것을 권장한다. 인그레스의 현대적 대체제인 [게이트웨이 API로의 마이그레이션](https://gateway-api.sigs.k8s.io/guides/)을 고려하길 바란다. 만약 인그레스를 계속 사용해야 한다면, 다양한 인그레스 컨트롤러 대안이 [인그레스 컨트롤러](https://kubernetes.io/ko/docs/concepts/services-networking/ingress-controllers/)에 나열되어 있다. 인그레스 NGINX의 역사, 현재 상태, 그리고 향후 단계에 대한 추가 정보를 보려면 계속 읽어보길 바란다.

## 인그레스 NGINX에 대해

[인그레스(Ingress)](https://kubernetes.io/ko/docs/concepts/services-networking/ingress/)는 쿠버네티스에서 구동 중인 워크로드로 네트워크 트래픽을 직접(direct) 전달하는, 기존의 사용자 친화적 방식이다. ([게이트웨이 API](https://kubernetes.io/docs/concepts/services-networking/gateway/)는 동일 목표의 상당 부분을 달성하기 위한 더 새로운 방식이다.) 클러스터에서 인그레스가 작동하려면 [인그레스 컨트롤러](https://kubernetes.io/ko/docs/concepts/services-networking/ingress-controllers/)가 실행 중이어야 한다. 다양한 사용자의 필요와 사용 사례를 충족하는 많은 인그레스 컨트롤러 선택지가 존재한다. 일부는 특정 클라우드 제공 업체에 특화되어 있으며, 다른 것들은 더 일반적인 적용성을 갖추고 있다.

[인그레스 NGINX](https://www.github.com/kubernetes/ingress-nginx)는 API의 예시 구현체로서 쿠버네티스 프로젝트 역사 초기에 개발된 인그레스 컨트롤러였다. 이는 엄청난 유연성, 광범위한 기능, 그리고 특정 클라우드나 인프라 제공 업체로부터의 독립성 덕분에 매우 대중화되었다. 그 시절 이후로, 쿠버네티스 프로젝트 내의 커뮤니티 그룹들과 클라우드 네이티브 벤더들에 의해 수많은 다른 인그레스 컨트롤러들이 만들어졌다. 인그레스 NGINX는 수많은 호스팅형 쿠버네티스 플랫폼의 일부로, 그리고 무수히 많은 독립 사용자들의 클러스터 내에 배포되며 가장 인기 있는 컨트롤러 중 하나로 지속되어 왔다.

## 역사와 과제

인그레스 NGINX의 광범위함과 유연성은 유지보수 측면에서 많은 과제를 야기했다. 클라우드 네이티브 소프트웨어에 대한 기대치의 변화 또한 복잡성을 가중시켰다. 한때 유용한 옵션으로 여겨졌던 것들이, "스니펫(snippets)" 어노테이션을 통해 임의의 NGINX 설정 지시문을 추가할 수 있는 기능처럼, 때로는 심각한 보안 결함으로 간주되기에 이르렀다. 어제의 유연성은 오늘날 극복할 수 없는 기술 부채가 되었다.

사용자들 사이에서의 프로젝트 인기에도 불구하고, 인그레스 NGINX는 항상 불충분하거나 간신히 충족되는 수준의 유지보수 인력 문제로 어려움을 겪어왔다. 수년간 이 프로젝트는 단 한두 명의 인원이 퇴근 후 시간이나 주말 등 개인 시간을 할애하여 개발 업무를 수행해 왔다. 지난해, 인그레스 NGINX 유지관리자들은 인그레스 NGINX를 점진적으로 종료하고 게이트웨이 API 커뮤니티와 함께 대체 컨트롤러를 개발하겠다는 계획을 [발표](https://kccncna2024.sched.com/event/1hoxW/securing-the-future-of-ingress-nginx-james-strong-isovalent-marco-ebert-giant-swarm)했다. 불행하게도, 그 발표조차 인그레스 NGINX의 유지보수를 돕거나 이를 대체할 InGate를 개발하는 데 있어 추가적인 관심을 불러일으키는 데 실패했다. (InGate 개발은 성숙한 대체제를 만들 수 있을 만큼 충분히 진척되지 못했으며, 이 또한 은퇴할 예정이다.)

## 현재 상태와 향후 단계

현재 인그레스 NGINX는 최선을 다한 유지보수를 받고 있다. SIG Network와 보안 대응 위원회는 인그레스 NGINX를 지속 가능하게 만들기 위해 추가적인 지원을 찾으려 노력했으나, 이제는 모든 수단이 소진되었다. 사용자 안전을 최우선으로 하기 위해, 우리는 이 프로젝트를 은퇴시켜야만 한다.

2026년 3월, 인그레스 NGINX의 유지보수는 중단될 것이며, 해당 프로젝트는 [은퇴](https://github.com/kubernetes-retired/)될 것이다. 그 시점 이후로는 더 이상의 릴리스나 버그 수정은 없을 것이며, 발견될 수 있는 그 어떤 보안 취약점을 해결하기 위한 업데이트도 제공되지 않을 것이다. 깃허브 저장소는 읽기 전용으로 전환될 것이며, 참조를 위해 가용 상태로 남겨질 것이다.

기존에 배포된 인그레스 NGINX가 고장 나지는 않을 것이다. 헬름 차트(Helm charts)나 컨테이너 이미지와 같은 기존 프로젝트 아티팩트들도 사용 가능한 상태로 남을 것이다.

대부분의 경우, 클러스터 관리자 권한으로 `kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx` 명령어를 실행하여 인그레스 NGINX 사용 여부를 확인할 수 있다.

우리는 이 프로젝트를 만들고 유지해 온 인그레스 NGINX 유지관리자들의 노고에 감사를 표하며, 그들의 헌신은 여전히 인상적이다. 이 인그레스 컨트롤러는 전 세계 데이터 센터와 홈랩에서 수십억 건의 요청을 처리해 왔다. 여러 면에서 쿠버네티스는 인그레스 NGINX 없이 지금의 자리에 있지 못했을 것이며, 우리는 수년간의 믿기 힘든 노력에 감사한다.

**SIG Network와 보안 대응 위원회는 모든 인그레스 NGINX 사용자가 즉시 게이트웨이 API 또는 다른 인그레스 컨트롤러로의 마이그레이션을 시작할 것을 권고한다.** 쿠버네티스 문서에는 [게이트웨이 API](https://gateway-api.sigs.k8s.io/guides/), [인그레스(Ingress)](https://kubernetes.io/ko/docs/concepts/services-networking/ingress-controllers/)와 같은 다양한 선택지가 나열되어 있다. 사용 중인 벤더에 따라 추가적인 옵션을 제공받을 수 있다.

---
title: 쿠버네티스 API
id: kubernetes-api
date: 2018-04-12
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  애플리케이션은 RESTful 인터페이스를 통해 쿠버네티스 기능을 제공하고 클러스터의 상태를 저장한다.

aka: 
tags:
- fundamental
- architecture
---
 애플리케이션은 RESTful 인터페이스를 통해 쿠버네티스 기능을 제공하고 클러스터의 상태를 저장한다.

<!--more--> 

쿠버네티스 자원과 "의도 기록"은 모두 API 오브젝트로 저장되고, API에 대한 RESTful 호출을 통해 수정된다. API는 선언적인 방법으로 구성을 관리할 수 있도록 허용한다. 사용자는 쿠버네티스 API나 `kubectl`과 같은 도구를 통해 상호작용할 수 있다. 쿠버네티스 주요 API는 유연하며 사용자 지정 리소스를 지원하도록 확장할 수 있다.
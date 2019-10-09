---
title: 워크로드(Workloads)
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   워크로드는 클러스터의 컨테이너를 동작시키고 관리하기 위해 사용하는 오브젝트이다.

aka: 
tags:
- fundamental
---
  워크로드는 쿠버네티스에서 구동되는 애플리케이션이다.

<!--more--> 

데몬셋, 디플로이먼트, 잡, 레플리카셋, 그리고 스테이트풀셋 오브젝트를 포함해서
서로 다른 워크로드의 유형이나 부분을 대표하는 다양한 핵심 오브젝트.

예를 들어, 웹 서버와 데이터베이스가 있는 워크로드는
데이터베이스를 한 {{< glossary_tooltip text="스테이트풀셋" term_id="StatefulSet" >}} 안에서 실행할 것이며, 
웹서버를 {{< glossary_tooltip text="디플로이먼트" term_id="Deployment" >}}를 통해 실행할 것이다.


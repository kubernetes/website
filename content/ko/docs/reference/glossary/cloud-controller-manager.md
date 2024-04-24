---
title: 클라우드 컨트롤 매니저
id: cloud-controller-manager
date: 2018-04-12
full_link: /ko/docs/concepts/architecture/cloud-controller/
short_description: >
  쿠버네티스를 타사 클라우드 공급자와 통합하는 컨트롤 플레인 컴포넌트.
aka:
tags:
- core-object
- architecture
- operation
---
클라우드별 컨트롤 로직을 포함하는 쿠버네티스
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 컴포넌트이다.
클라우드 컨트롤러 매니저를 통해 클러스터를 클라우드 공급자의 API에 연결하고,
해당 클라우드 플랫폼과 상호 작용하는 컴포넌트와 클러스터와만 상호 작용하는 컴포넌트를 구분할 수 있게 해 준다.

<!--more-->

쿠버네티스와 기본 클라우드 인프라스터럭처 간의 상호 운용성 로직을
분리함으로써, cloud-controller-manager 컴포넌트는 클라우드 공급자가
주요 쿠버네티스 프로젝트와 다른 속도로 기능들을 릴리스할 수 있도록 한다.

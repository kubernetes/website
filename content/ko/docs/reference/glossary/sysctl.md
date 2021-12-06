---
title: sysctl
id: sysctl
date: 2019-02-12
full_link: /ko/docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  유닉스 커널 파라미터를 가져오거나 설정하는 데 사용하는 인터페이스

aka:
tags:
- tool
---
 `sysctl`은 동작 중인 유닉스 커널의 속성을 읽거나 수정하는 데 사용하는
 (준)표준 인터페이스이다. 

<!--more-->

유닉스 계열 시스템에서 `sysctl`은 관리자가 이러한 설정을 확인하고 수정하는데 사용하는 도구의 
이름이기도 하고, 해당 도구가 사용하는 시스템 콜이기도
하다.

{{< glossary_tooltip text="컨테이너" term_id="container" >}} 런타임과 
네트워크 플러그인은 특정 방식으로 설정된 `sysctl` 값에 의존성이 있을 수 있다.

---
title: 시큐리티 컨텍스트(원문, Security Context)
id: security-context
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  시큐리티 컨텍스트 필드는 파드 또는 컨테이너의 권한과 접근 제어 설정을 정의한다.  

aka: 
tags:
- security
---
 `securityContext` 필드는 {{< glossary_tooltip text="파드" term_id="pod" >}}
또는 {{< glossary_tooltip text="컨테이너" term_id="container" >}}의 권한과 
접근 제어 설정을 정의한다.

<!--more-->

`securityContext`에서는 프로세스가 실행될 사용자, 프로세스가 실행될 그룹, 
그리고 권한 관련 설정을 정의할 수 있다.
또한 보안 정책(예: SELinux, AppArmor 또는 seccomp)도 설정할 수 있다.

`PodSpec.securityContext` 설정은 파드 내 모든 컨테이너에 적용된다.

---
title: 앱 컨테이너(App Container)
id: app-container
date: 2019-02-12
full_link:
short_description: >
  워크로드의 일부를 실행하는데 사용되는 컨테이너. 초기화 컨테이너와 비교된다.

aka:
tags:
- workload
---
 애플리케이션 컨테이너(또는 앱 컨테이너)는 {{< glossary_tooltip text="파드" term_id="pod" >}} 내의 모든 {{< glossary_tooltip text="초기화 컨테이너" term_id="init-container" >}}가 완료된 후 시작되는  {{< glossary_tooltip text="컨테이너" term_id="container" >}}이다.

<!--more-->

초기화 컨테이너를 사용하면 전체 
{{< glossary_tooltip text="워크로드" term_id="workload" >}}에 대해서 중요한 초기화 세부 사항을 분리할 수 있으며, 애플리케이션 
컨테이너가 시작된 후에는 계속 동작시킬 필요가 없다. 
만약 파드에 설정된 초기화 컨테이너가 없는 경우, 파드의 모든 컨테이너는 앱 컨테이너이다.

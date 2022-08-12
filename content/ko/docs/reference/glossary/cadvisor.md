---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Tool that provides understanding of the resource usage and performance characteristics for containers
  컨테이너에 대한 리소스 사용량 및 성능 특징을 이해하게끔 돕는 도구
aka:
tags:
- tool
---
cAdvisor (Container Advisor) provides container users an understanding of the resource usage and performance characteristics of their running {{< glossary_tooltip text="containers" term_id="container" >}}.
cAdvisor(Container Advisor)는 컨테이너 사용자에게 실행 중인 리소스 사용량 및 성능 특징을 이해하게끔 도와준다 {{< glossary_tooltip text="컨테이너" term_id="container" >}}

<!--more-->

It is a running daemon that collects, aggregates, processes, and exports information about running containers. Specifically, for each container it keeps resource isolation parameters, historical resource usage, histograms of complete historical resource usage and network statistics. This data is exported by container and machine-wide.
실행 중인 컨테이너에 대한 정보를 수집, 집계, 처리 및 출력해주는 실행 데몬이다. 특히, 각 컨테이너에 대해 리소스 분리 매개 변수, 리소스 사용량 기록, 전체 기록된 리소스 사용량의 히스토그램 그리고 네트워크 통계를 저장한다. 이 데이터는 컨테이너 및 기계 전체로 내보내진다.

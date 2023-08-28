---
title: Horizontal Pod Autoscaler
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /ko/docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  CPU 사용률 또는 사용자 정의 메트릭을 기반으로 파드의 레플리카 수를 자동으로 조절하는 API 리소스이다.

aka: 
- HPA
tags:
- operation
---
 CPU 사용률 또는 사용자 정의 메트릭을 기반으로 {{< glossary_tooltip text="파드" term_id="pod" >}}의 레플리카 수를 자동으로 조절하는 API 리소스이다.

<!--more--> 

HPA는 일반적으로 {{< glossary_tooltip text="레플리케이션 컨트롤러" term_id="replication-controller" >}}, {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}, {{< glossary_tooltip text="레플리카셋" term_id="replica-set" >}}과 함께 사용된다. 조절할 수 없는 개체(예: {{< glossary_tooltip text="데몬셋" term_id="daemonset" >}})에는 적용할 수 없다.
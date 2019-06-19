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
- core-object
- workload
---
  워크로드는 클러스터의 컨테이너를 동작시키고 관리하기 위해 사용하는 오브젝트이다.

<!--more--> 

쿠버네티스는 
애플리케이션의 현재 상태에 따라 워크로드의 디플로이먼트와 업데이트를 수행한다.
워크로드는 데몬셋, 디플로이먼트, 잡, 파드, 레플리카셋, 레플리케이션컨트롤러, 스테이트풀셋과 같은 오브젝트를 포함한다.

예를 들어, 웹 요소와 데이터베이스 요소가 있는 워크로드는 
데이터베이스를 {{< glossary_tooltip text="파드" term_id="pod" >}}의 한 
{{< glossary_tooltip text="스테이트풀셋" term_id="StatefulSet" >}} 안에서 실행할 것이며, 
웹서버를 많은 웹 앱 {{< glossary_tooltip text="파드" term_id="pod" >}}로 구성된 
{{< glossary_tooltip text="디플로이먼트" term_id="Deployment" >}}를 통해 실행할 것이다.


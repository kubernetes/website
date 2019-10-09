---
title: 스테이트풀 셋(StatefulSet)
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  파드 집합의 디플로이먼트와 스케일링을 관리하며, 파드들의 *순서 및 고유성을 보장한다* .

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 {{< glossary_tooltip text="파드" term_id="pod" >}} 집합의 디플로이먼트와 스케일링을 관리하며, 파드들의 *순서 및 고유성을 보장한다* .

<!--more--> 

{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}와 유사하게, 스테이트풀 셋은 동일한 컨테이너 스펙을 기반으로 둔 파드들을 관리한다. 디플로이먼트와는 다르게, 스테이트풀 셋은 각 파드의 독자성을 유지한다. 이 파드들은 동일한 스팩으로 생성되었지만, 서로 교체는 불가능하다. 다시 말해, 각각은 재스케줄링 간에도 지속적으로 유지되는 식별자를 가진다.

스테이트풀 셋도 다른 컨트롤러와 같은 패턴으로 운용된다. 사용자는 의도한 상태를 스테이트풀 셋 *오브젝트* 로 정의하고, 스테이트풀 셋 *컨트롤러* 는 현재 상태에서 의도한 상태에 이르기 위해 필요한 업데이트를 수행한다.


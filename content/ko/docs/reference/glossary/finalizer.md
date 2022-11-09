---
title: 파이널라이저(Finalizer)
id: finalizer
date: 2021-07-07
full_link: /ko/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  쿠버네티스가 오브젝트를 완전히 삭제하기 이전, 삭제 표시를 위해
  특정 조건이 충족될 때까지 대기하도록 알려주기 위한 네임스페이스에 속한 키(namespaced key)이다.
aka: 
tags:
- fundamental
- operation
---
파이널라이저는 쿠버네티스가 오브젝트를 완전히 삭제하기 이전, 삭제 표시를 위해
특정 조건이 충족될 때까지 대기하도록 알려주기 위한 네임스페이스에 속한 키(namespaced key)이다.
파이널라이저는 삭제 완료된 오브젝트가 소유한 리소스를 정리하기 위해
{{<glossary_tooltip text="컨트롤러" term_id="controller">}}에게 알린다.

<!--more-->

파이널라이저를 가진 특정한 오브젝트를 쿠버네티스가 삭제하도록 지시할 때,
쿠버네티스 API는 `.metadata.delationTimestamp`을 덧붙여 삭제하도록 오브젝트에 표시하며,
`202` 상태코드(HTTP "Accepted")을 리턴한다. 대상 오브젝트가 Terminating 상태를 유지하는 동안 컨트롤 플레인 
또는 다른 컴포넌트는 하나의 파이널라이저에서 정의한 작업을 수행한다.
정의된 작업이 완료 후에, 그 컨트롤러는 대상 오브젝트로부터 연관된 파이널라이저을 삭제한다.
`metadata.finalizers` 필드가 비어 있을 때, 쿠버네티스는
삭제가 완료된 것으로 간주하고 오브젝트를 삭제한다.

파이널라이저가 리소스들의 {{<glossary_tooltip text="가비지 컬렉션" term_id="garbage-collection">}}을 제어하도록 
사용할 수 있다. 예를 들어, 하나의 파이널라이저를 컨트롤러가 대상 리소소를 삭제하기 전에 
연관된 리소스들 또는 인프라를 정리하도록 정의할 수 있다.
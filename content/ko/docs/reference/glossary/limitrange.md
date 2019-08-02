---
title: 범위 제한(LimitRange)
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  네임스페이스 안의 컨테이너나 파드의 리소스 사용량을 제한하는 제약을 제공한다.

aka:
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
  네임스페이스 안의 {{< glossary_tooltip text="컨테이너" term_id="container" >}}나 {{< glossary_tooltip text="파드" term_id="pod" >}}의 리소스 사용량을 제한하는 제약을 제공한다.

<!--more-->
범위 제한은 타입별로 만들 수 있는 객체의 수와
네임스페이스 안의 개별 {{< glossary_tooltip text="컨테이너" term_id="container" >}}나 {{< glossary_tooltip text="파드" term_id="pod" >}}가 요청하거나 소비한 컴퓨팅 리소스의 양을 제한한다.

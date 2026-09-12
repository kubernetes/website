---
title: 엔드포인트슬라이스 (원문, EndpointSlice)
id: endpoint-slice
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  엔드포인트슬라이스는 서비스의 백엔드 파드 IP 주소를 추적한다.

aka:
tags:
- networking
---
엔드포인트슬라이스는 백엔드 엔드포인트의 IP 주소를 추적한다.
엔드포인트슬라이스는 일반적으로
{{< glossary_tooltip text="서비스" term_id="service" >}}와 연관되며, 백엔드 엔드포인트는 보통
{{< glossary_tooltip text="파드" term_id="pod" >}}를 나타낸다.

<!--more-->
하나의 서비스는 여러 파드를 백엔드로 둘 수 있다. 쿠버네티스는 서비스의 백엔드 엔드포인트를
해당 서비스와 연관된 엔드포인트슬라이스 집합으로 나타낸다.
백엔드 엔드포인트는 일반적으로 클러스터에서 실행되는 파드이지만, 항상 그런 것은 아니다.

컨트롤 플레인은 일반적으로 엔드포인트슬라이스를 자동으로 관리한다. 그러나
{{< glossary_tooltip text="셀렉터" term_id="selector" >}}가 지정되지 않은
{{< glossary_tooltip text="서비스" term_id="service" >}}에 대해 엔드포인트슬라이스를 수동으로 정의할 수도 있다.

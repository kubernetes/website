---
title: 노드(Node)
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  노드는 쿠버네티스의 워커 머신이다.

aka: 
tags:
- fundamental
---
 노드는 쿠버네티스의 워커 머신이다.

<!--more--> 

워커 머신은 클러스터에 따라 VM이거나 물리 머신일 것이다. 그것은 실행해야 하는 {{< glossary_tooltip text="서비스" term_id="service" >}}와 {{< glossary_tooltip text="파드" term_id="pod" >}}를 가지고 있으며, 마스터 컴포넌트에 의해서 관리된다. 노드에 있는 {{< glossary_tooltip text="서비스" term_id="service" >}}는 Docker, kubelet, kube-proxy를 포함한다.


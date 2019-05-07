---
title: 컨트롤러(Controller)
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  Apiserver를 통해 클러스터의 공유된 상태를 감시하고, 현재 상태를 원하는 상태로 이행시키는 컨트롤 루프.

aka: 
tags:
- architecture
- fundamental
---
 {{< glossary_tooltip text="Apiserver" term_id="kube-apiserver" >}}를 통해 클러스터의 공유된 상태를 감시하고, 현재 상태를 원하는 상태로 이행시키는 컨트롤 루프.

<!--more--> 

현재 쿠버네티스에 포함된 컨트롤러의 예시로는 레플리케이션 컨트롤러, 엔드포인트 컨트롤러, 네임스페이스 컨트롤러, 서비스 어카운트 컨트롤러가 있다.


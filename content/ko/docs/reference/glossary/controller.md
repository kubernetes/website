---
title: 컨트롤러
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  apiserver를 통해 클러스터의 공유 상태를 감시하고 현재 상태를 의도한 상태가 되도록 변경시켜주는 컨트롤러 루프.

aka:
tags:
- architecture
- fundamental
---
 {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}}를 통해 클러스터의 공유 상태를 감시하고 현재 상태를 의도한 상태가 되도록 변경시켜주는 컨트롤러 루프

<!--more-->

최근 쿠버네티스와 함께 출하되는 컨트롤러의 예로는 레플리케이션 컨트롤러, 엔드포인트 컨트롤러, 네임스페이스 컨트롤러, 서비스계정 컨트롤러 등이 있다.

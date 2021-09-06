---
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  name: reference
  weight: 40
---

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm은 쿠버네티스 클러스터 생성을 위한 모범 사례의 "빠른 경로"로 `kubeadm init` 과 `kubeadm join` 을 제공하도록 만들어진 도구이다.

kubeadm은 실행 가능한 최소 클러스터를 시작하고 실행하는 데 필요한 작업을 수행한다. 설계 상, 시스템 프로비저닝이 아닌 부트스트랩(bootstrapping)만 다룬다. 마찬가지로, 쿠버네티스 대시보드, 모니터링 솔루션 및 클라우드별 애드온과 같은 다양한 있으면 좋은(nice-to-have) 애드온을 설치하는 것은 범위에 포함되지 않는다.

대신, 우리는 더 높은 수준의 맞춤형 도구가 kubeadm 위에 구축될 것으로 기대하며, 이상적으로는, 모든 배포의 기반으로 kubeadm을 사용하면 규격을 따르는 클러스터를 더 쉽게 생성할 수 있다.

## 설치 방법

kubeadm을 설치하려면, [설치 가이드](/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)를 참고한다.

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/): 쿠버네티스 컨트롤 플레인 노드를 부트스트랩한다.
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/): 쿠버네티스 워커(worker) 노드를 부트스트랩하고 클러스터에 조인시킨다.
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/): 쿠버네티스 클러스터를 새로운 버전으로 업그레이드한다.
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/): kubeadm v1.7.x 이하의 버전을 사용하여 클러스터를 초기화한 경우, `kubeadm upgrade` 를 위해 사용자의 클러스터를 구성한다.
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/): `kubeadm join` 을 위한 토큰을 관리한다.
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/): `kubeadm init` 또는 `kubeadm join` 에 의한 호스트의 모든 변경 사항을 되돌린다.
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version/): kubeadm 버전을 출력한다.
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/): 커뮤니티에서 피드백을 수집하기 위해서 기능 미리 보기를 제공한다.

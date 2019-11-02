---
title: kubeadm 개요
weight: 10
card:
  name: reference
  weight: 40
---
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice “fast paths” for creating Kubernetes clusters.

Kubeadm은 최소의 실행 가능한 클러스터를 가동 및 실행하는데 필요한 조치를 수행합니다. 설계상으로는 시스템 프로비저닝이 아니라 부트스트래핑에만 관심이 있습니다. 마찬가지로 쿠버네티스 대시보드, 모니터링 솔루션, 클라우드 별 애드온과 같은 다양한 기능을 갖춘 애드온을 설치하는 것은 범위에 포함하지 않습니다. 

대신, 우리는 Kubeadm 위에 더 높은 수준의 맞춤형 툴링이 구축될 것으로 예상되며, 이상적으로는 Kubeadm을 모든 배치의 기반으로 사용하는 것이 적합한 클러스터를 보다 쉽게 만들 수 있도록 할 것입니다.

## 설치 방법

kubeadm을 설치하기 위해서는 [installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm) 문서를 참조하시기 바랍니다..

## 다음

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init)으로 kubernetes의 제어 영역 노드를 부트스트랩
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join)으로 Kubernetes의 작업자 노드를 부트스트랩하고 클러스터에 결합
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) 로 Kubernetes 클러스터를 최신 버전으로 업그레이드
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config)는 만약 kubeadm v1.7.x 나 그 이하의 버전으로 클러스터를 초기화 한 경우 `kubeadm upgrade` 를 사용하여 클러스터를 구성하세요.
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) 으로 `kubeadm join`의 토큰을 관리
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) 으로 현재 호스트에서 `kubeadm init` 나 `kubeadm join` 의 변경 사항을 되돌릴 수 있습니다.
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version)는 kubeadm 버전을 출력하기 위해 사용
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) 로 커뮤니티로부터의 피드백을 수집할 수 있는 다양한 기능을 미리볼 수 있습니다. 

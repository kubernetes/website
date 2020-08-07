---
title: kubeadm 개요
weight: 10
card:
  name: reference
  weight: 40
---
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm은 쿠버네티스 클러스터를 "빠른 경로"로 생성하기 위한 모범 사례인 `kubeadm init`과 `kubeadm join`을 제공하기 위해 구성된 도구이다.

kubeadm은 최소 기능 클러스터(minimum viable cluster)를 시작하고 실행하는 데 필요한 작업을 수행한다. 설계상, 부트스트랩만 다루며, 머신을 프로비저닝하지는 않는다. 마찬가지로, 쿠버네티스 대시보드, 모니터링 솔루션 및 클라우드 별 애드온과 같은 다양한 기능을 갖춘 애드온을 설치하는 것은 범위에 포함되지 않는다.

대신, kubeadm 위에 있는 더 높은 수준의 맞춤형 도구가 구축될 것으로 예상되며, 모든 배포의 기초로서 kubeadm을 사용하면 적합한 클러스터를 보다 쉽게 만들 수 있다.

## 설치하는 방법

kubeadm을 설치하려면 [설치 가이드](/docs/setup/production-environment/tools/kubeadm/install-kubeadm)를 참조한다.

## 다음 내용

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init): 쿠버네티스 컨트롤 플레인 노드를 부트스트랩 함
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join): 쿠버네티스 워커 노드를 부트스트랩 후 클러스터에 결합시킴
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade): 쿠버네티스 클러스터를 최신 버전으로 업그레이드
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config): kubeadm v1.7.x이하의 버전을 사용하여 클러스터를 초기화한 경우, 클러스터를 설정하여 `kubeadm upgrade`하기 위해 사용
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token): `kubeadm join`을 위한 토큰 관리
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset): `kubeadm init`나 `kubeadm join`를 의한 호스트에 대해서 변경된 사항을 되돌림
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version): kubeadm 버전을 출력
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha): 커뮤니티의 피드백 수집을 위해서 기능 미리 보기를 제공


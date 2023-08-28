---
# reviewers:
# - murali-reddy
title: 네트워크 폴리시로 큐브 라우터(Kube-router) 사용하기
content_type: task
weight: 30
---



<!-- overview -->
이 페이지는 네트워크 폴리시(NetworkPolicy)로 [큐브 라우터(Kube-router)](https://github.com/cloudnativelabs/kube-router)를 사용하는 방법을 살펴본다.


## {{% heading "prerequisites" %}}

운영 중인 쿠버네티스 클러스터가 필요하다. 클러스터가 없다면, Kops, Bootkube, Kubeadm 등을 이용해서 클러스터를 생성할 수 있다.


<!-- steps -->
## 큐브 라우터 애드온 설치하기
큐브 라우터 애드온은 갱신된 모든 네트워크 폴리시 및 파드에 대해 쿠버네티스 API 서버를 감시하고, 정책에 따라 트래픽을 허용하거나 차단하도록 iptables 규칙와 ipset을 구성하는 네트워크 폴리시 컨트롤러와 함께 제공된다. 큐브 라우터 애드온을 설치하는 [큐브 라우터를 클러스터 인스톨러와 함께 사용하기](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) 안내서를 따라해 봅니다.


## {{% heading "whatsnext" %}}

큐브 라우터 애드온을 설치한 후에는, 쿠버네티스 네트워크 폴리시를 시도하기 위해 [네트워크 폴리시 선언하기](/ko/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다.

---
title: 레퍼런스
linkTitle: "레퍼런스"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스 문서의 본 섹션에서는 레퍼런스를 다룬다. 

{{% /capture %}}

{{% capture body %}}

## API 레퍼런스

* [Kubernetes API Overview](/docs/reference/using-api/api-overview/) - 쿠버네티스 API에 대한 개요
* 쿠버네티스 API 버전
  * [1.12](/docs/reference/generated/kubernetes-api/v1.12/)
  * [1.11](/docs/reference/generated/kubernetes-api/v1.11/)
  * [1.10](https://v1-10.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/)
  * [1.9](https://v1-9.docs.kubernetes.io/docs/api-reference/v1.9/)
  * [1.8](https://v1-8.docs.kubernetes.io/docs/api-reference/v1.8/)
  * [1.7](https://v1-7.docs.kubernetes.io/docs/api-reference/v1.7/)

## API 클라이언트 라이브러리

프로그래밍 언어에서 쿠버네티스 API를 호출하기 위해서, 
[client libraries](/docs/reference/using-api/client-libraries/)를 사용할 수 있다. 
공식적으로 지원되는 클라이언트 라이브러리는 다음과 같다.

- [Kubernetes Go client library](https://github.com/kubernetes/client-go/)
- [Kubernetes Python client library](https://github.com/kubernetes-client/python)

## CLI 레퍼런스

* [kubectl](/docs/user-guide/kubectl-overview) - 명령어를 실행하거나 쿠버네티스 클러스터를 관리하기 위해 사용하는 주된 CLI 도구.
    * [JSONPath](/docs/user-guide/jsonpath/) - kubectl에서 [JSONPath expressions](http://goessner.net/articles/JsonPath/)을 사용하기 위한 문법 가이드.
* [kubeadm](/docs/admin/kubeadm/) - 안정적인 쿠버네티스 클러스터를 쉽게 프로비전하기 위한 CLI 도구.
* [kubefed](/docs/admin/kubefed/) - 연합된(federated) 클러스터 관리를 도와주는 CLI 도구.

## 설정 레퍼런스

* [kubelet](/docs/admin/kubelet/) - 각 노드에서 구동되는 주요한 *노드 에이전트*. kubelet은 PodSpecs 집합을 가지며 기술된 컨테이너가 구동되고 있는지, 정상 작동하는지를 보장한다.
* [kube-apiserver](/docs/admin/kube-apiserver/) - 파드, 서비스, 레플리케이션 컨트롤러와 같은 API 오브젝트에 대한 검증과 구성을 수행하는 REST API.
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - 쿠버네티스에 탑재된 핵심 제어 루프를 포함하는 데몬.
* [kube-proxy](/docs/admin/kube-proxy/) - 간단한 TCP/UDP 스트림 포워딩이나 백-엔드 집합에 걸쳐서 라운드-로빈 TCP/UDP 포워딩을 할 수 있다.
* [kube-scheduler](/docs/admin/kube-scheduler/) - 가용성, 성능 및 용량을 관리하는 스케줄러.
* [federation-apiserver](/docs/admin/federation-apiserver/) - 연합된 클러스터를 위한 API 서버.
* [federation-controller-manager](/docs/admin/federation-controller-manager/) - 쿠버네티스 연합에 탑재된 핵심 제어 루프를 포함하는 데몬.

## 설계 문서

쿠버네티스 기능에 대한 설계 문서의 아카이브. [Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md)와 [Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals)가 좋은 출발점이다.

{{% /capture %}}

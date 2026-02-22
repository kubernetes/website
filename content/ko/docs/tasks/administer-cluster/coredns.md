---
# reviewers:
# - johnbelamaric
title: 서비스 디스커버리를 위해 CoreDNS 사용하기
min-kubernetes-server-version: v1.9
content_type: task
---

<!-- overview -->
이 페이지는 CoreDNS 업그레이드 프로세스와 kube-dns 대신 CoreDNS를 설치하는 방법을 보여준다.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## CoreDNS 소개

[CoreDNS](https://coredns.io)는 쿠버네티스 클러스터의 DNS 역할을 수행할 수 있는, 
유연하고 확장 가능한 DNS 서버이다.
쿠버네티스와 동일하게, CoreDNS 프로젝트도 
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}가 관리한다.

사용자는 기존 디플로이먼트인 kube-dns를 교체하거나, 
클러스터를 배포하고 업그레이드하는 kubeadm과 같은 툴을 사용하여 
클러스터 안의 kube-dns 대신 CoreDNS를 사용할 수 있다.

## CoreDNS 설치

Kube-dns의 배포나 교체에 관한 매뉴얼은 [CoreDNS GitHub 프로젝트](https://github.com/coredns/deployment/tree/master/kubernetes)에
있는 문서를 확인하자.

## CoreDNS로 이관하기

### Kubeadm을 사용해 기존 클러스터 업그레이드하기

쿠버네티스 버전 1.21에서, kubeadm은 DNS 애플리케이션으로서의 `kube-dns` 지원을 제거했다. 
`kubeadm` v{{< skew currentVersion >}} 버전에서는, 
DNS 애플리케이션으로 CoreDNS만이 지원된다.

`kube-dns`를 사용 중인 클러스터를 업그레이드하기 위하여 
`kubeadm` 을 사용할 때 CoreDNS로 전환할 수 있다. 
이 경우, `kubeadm` 은 `kube-dns` 컨피그맵(ConfigMap)을 기반으로 
스텁 도메인(stub domain), 업스트림 네임 서버의 설정을 유지하며 CoreDNS 설정("Corefile")을 생성한다.

## CoreDNS 업그레이드하기

[쿠버네티스에서의 CoreDNS 버전](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md) 페이지에서, 
쿠버네티스 각 버전에 대해 kubeadm이 설치하는 
CoreDNS의 버전을 확인할 수 있다.

CoreDNS만 업그레이드하고 싶거나 커스텀 이미지를 사용하고 싶은 경우, 
CoreDNS를 수동으로 업그레이드할 수 있다. 
[가이드라인 및 따라해보기](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)를 참고하여 
부드러운 업그레이드를 수행할 수 있다. 
클러스터를 업그레이드할 때 
기존 CoreDNS 환경 설정("Corefile")을 보존했는지 확인한다.

`kubeadm` 도구를 사용하여 클러스터를 업그레이드하는 경우, 
`kubeadm`이 자동으로 기존 CoreDNS 환경 설정을 보존한다.


## CoreDNS 튜닝하기

리소스 활용이 중요한 경우, 
CoreDNS 구성을 조정하는 것이 유용할 수 있다. 
더 자세한 내용은 [CoreDNS 스케일링에 대한 설명서](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)를 확인한다.

## {{% heading "whatsnext" %}}

CoreDNS 환경 설정("Corefile")을 수정하여 
kube-dns보다 더 많은 유스케이스를 지원하도록 [CoreDNS](https://coredns.io)를 구성할 수 있다. 
더 많은 정보는 CoreDNS의 `kubernetes` 플러그인 
[문서](https://coredns.io/plugins/kubernetes/)를 참고하거나, 
CoreDNS 블로그의 
[쿠버네티스를 위한 커스텀 DNS 엔트리](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)를 확인한다.

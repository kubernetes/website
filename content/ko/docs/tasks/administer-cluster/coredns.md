---
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

[CoreDNS](https://coredns.io)는 쿠버네티스 클러스터의 DNS 역할을 수행할 수 있는, 유연하고 확장 가능한 DNS 서버이다.
쿠버네티스와 동일하게, CoreDNS 프로젝트도 {{< glossary_tooltip text="CNCF" term_id="cncf" >}}가 관리한다.

사용자는 기존 디플로이먼트인 kube-dns를 교체하거나, 클러스터를 배포하고 업그레이드하는 
kubeadm과 같은 툴을 사용하여 클러스터 안의 kube-dns 대신 CoreDNS를 사용할 수 있다.

## CoreDNS 설치

Kube-dns의 배포나 교체에 관한 매뉴얼은 [CoreDNS GitHub 프로젝트](https://github.com/coredns/deployment/tree/master/kubernetes)에
있는 문서를 확인하자.

## CoreDNS로 이관하기

### Kubeadm을 사용해 기존 클러스터 업그레이드하기

쿠버네티스 버전 1.10 이상에서, `kube-dns` 를 사용하는 클러스터를 업그레이드하기 위하여
`kubeadm` 을 사용할 때 CoreDNS로 전환할 수도 있다. 이 경우, `kubeadm` 은
`kube-dns` 컨피그맵(ConfigMap)을 기반으로 패더레이션, 스텁 도메인(stub domain), 업스트림 네임 서버의
설정을 유지하며 CoreDNS 설정("Corefile")을 생성한다.

만약 kube-dns에서 CoreDNS로 이동하는 경우, 업그레이드 과정에서 기능 게이트의 `CoreDNS` 값을 `true` 로 설정해야 한다.
예를 들어, `v1.11.0` 로 업그레이드 하는 경우는 다음과 같다.
```
kubeadm upgrade apply v1.11.0 --feature-gates=CoreDNS=true
```

쿠버네티스 1.13 이상에서 기능 게이트의 `CoreDNS` 항목은 제거되었으며, CoreDNS가 기본적으로 사용된다.
업그레이드된 클러스터에서 kube-dns를 사용하려는 경우, [여기](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon)에 
설명된 지침 가이드를 참고하자.

1.11 미만 버전일 경우 업그레이드 과정에서 만들어진 파일이 Corefile을 **덮어쓴다**.
**만약 컨피그맵을 사용자 정의한 경우, 기존의 컨피그맵을 저장해야 한다.** 새 컨피그맵이
시작된 후에 변경 사항을 다시 적용해야 할 수도 있다.

만약 쿠버네티스 1.11 이상 버전에서 CoreDNS를 사용하는 경우, 업그레이드 과정에서,
기존의 Corefile이 유지된다.


### Kubeadm을 사용해 CoreDNS가 아닌 kube-dns 설치하기

{{< note >}}
쿠버네티스 1.11 버전에서, CoreDNS는 GA(General Availability) 되었으며,
기본적으로 설치된다.
{{< /note >}}

{{< warning >}}
쿠버네티스 1.18 버전에서, kubeadm을 통한 kube-dns는 사용 중단되었으며, 향후 버전에서 제거될 예정이다.
{{< /warning >}}

1.13 보다 이전 버전에서 kube-dns를 설치하는경우, 기능 게이트의 `CoreDNS` 
값을 `false` 로 변경해야 한다.

```
kubeadm init --feature-gates=CoreDNS=false
```

1.13 이후 버전에서는, [여기](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon)에 설명된 지침 가이드를 참고하자.

## CoreDNS 업그레이드하기

CoreDNS는 쿠버네티스 1.9 버전부터 사용할 수 있다.
쿠버네티스와 함께 제공되는 CoreDNS의 버전과 CoreDNS의 변경 사항은 [여기](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)에서 확인할 수 있다.

CoreDNS는 사용자 정의 이미지를 사용하거나 CoreDNS만 업그레이드 하려는 경우에 수동으로 업그레이드할 수 있다.
업그레이드를 원활하게 수행하는 데 유용한 [가이드라인 및 연습](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)을 참고하자.

## CoreDNS 튜닝하기

리소스 활용이 중요한 경우, CoreDNS 구성을 조정하는 것이 유용할 수 있다. 
더 자세한 내용은 [CoreDNS 스케일링에 대한 설명서](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)를 확인하자.



## {{% heading "whatsnext" %}}


`Corefile` 을 수정하여 kube-dns 보다 더 많은 유스케이스를 지원하도록 
[CoreDNS](https://coredns.io)를 구성할 수 있다.
더 자세한 내용은 [CoreDNS 웹사이트](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)을 확인하자.

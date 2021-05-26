---



title: Kubelet의 인증서 갱신 구성
content_type: task
---

<!-- overview -->
이 페이지는 kubelet에 대한 인증서 갱신을 활성화하고 구성하는 방법을 보여준다.


{{< feature-state for_k8s_version="v1.19" state="stable" >}}

## {{% heading "prerequisites" %}}


* 쿠버네티스 1.8.0 버전 혹은 그 이상의 버전이 요구됨



<!-- steps -->

## 개요

kubelet은 쿠버네티스 API 인증을 위해 인증서를 사용한다.
기본적으로 이러한 인증서는 1년 만기로 발급되므로
너무 자주 갱신할 필요는 없다.

쿠버네티스 1.8은 [kubelet 인증서
갱신](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)을 포함하며,
이 기능은 현재 인증서의 만료 시한이 임박한 경우,
새로운 키를 자동으로 생성하고 쿠버네티스 API에서 새로운 인증서를 요청하는 베타 기능이다.
새로운 인증서를 사용할 수 있게 되면
쿠버네티스 API에 대한 연결을 인증하는데 사용된다.

## 클라이언트 인증서 갱신 활성화하기

`kubelet` 프로세스는 현재 사용 중인 인증서의 만료 시한이 다가옴에 따라
kubelet이 자동으로 새 인증서를 요청할지 여부를 제어하는
`--rotate-certificates` 인자를 허용한다.


`kube-controller-manager` 프로세스는 얼마나 오랜 기간 인증서가 유효한지를 제어하는
`--cluster-signing-duration` (1.19 이전은 `--experimental-cluster-signing-duration`)
인자를 허용한다.

## 인증서 갱신 구성에 대한 이해

kubelet이 시작할 때 부트 스트랩 (`--bootstrap-kubeconfig` 플래그를 사용)
을 구성하면 초기 인증서를 사용하여 쿠버네티스 API에 연결하고
인증서 서명 요청을 발행한다.
다음을 사용하여 인증서 서명 요청 상태를 볼 수 있다.

```sh
kubectl get csr
```

초기에 노드의 kubelet에서 인증서 서명 요청은 `Pending` 상태이다.
인증서 서명 요청이 특정 기준을 충족하면 컨트롤러 관리자가
자동으로 승인한 후 상태가 `Approved` 가 된다.
다음으로, 컨트롤러 관리자는
`--cluster-signing-duration` 파라미터에 의해 지정된 기간 동안
발행된 인증서에 서명하고
서명된 인증서는 인증서 서명 요청에 첨부된다.

kubelet은 쿠버네티스 API로 서명된 인증서를 가져와서
`--cert-dir`에 지정된 위치에 디스크에 기록한다.
그런 다음 kubelet은 쿠버네티스 API에 연결해서 새로운 인증서를 사용한다.

서명된 인증서의 만료가 다가오면 kubelet은 쿠버네티스 API를 사용하여
새로운 인증서 서명 요청을 자동으로 발행한다.
이는 인증서 유효 기간이 30%-10% 남은 시점에 언제든지 실행될 수 있다.
또한, 컨트롤러 관리자는 인증서 요청을 자동으로 승인하고
서명된 인증서를 인증서 서명 요청에 첨부한다.
kubelet은 쿠버네티스 API로 서명된 새로운 인증서를 가져와서 디스크에 쓴다.
그런 다음 새로운 인증서를 사용한 재연결을 위해서
가지고 있는 쿠버네티스 API로의 연결을 업데이트 한다.

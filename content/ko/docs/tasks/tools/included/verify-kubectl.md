---
title: "kubectl 설치 검증하기"
description: "kubectl을 검증하는 방법에 대해 설명한다."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

kubectl이 쿠버네티스 클러스터를 찾고 접근하려면
[kubeconfig 파일](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)이 필요하다.
이 파일은 클러스터를
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)로 생성하거나
Minikube 클러스터를 성공적으로 배포하면 자동으로 생성된다.
기본적으로 kubectl 구성은 `~/.kube/config`에 있다.

클러스터 상태를 조회하여 kubectl이 올바르게 구성되었는지 확인한다.

```shell
kubectl cluster-info
```

URL 응답이 나타나면 kubectl이 클러스터에 접근하도록 올바르게 구성된 것이다.

다음과 유사한 메시지가 나타나면 kubectl 구성이 올바르지 않거나
쿠버네티스 클러스터에 연결할 수 없는 것이다.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

예를 들어, 랩톱에서 쿠버네티스 클러스터를 로컬로 실행하려면
[Minikube](https://minikube.sigs.k8s.io/docs/start/)와 같은 도구를
먼저 설치한 다음 위 명령을 다시 실행해야 한다.

`kubectl cluster-info`가 URL 응답을 반환했지만 클러스터에 접근할 수 없다면
다음 명령으로 구성이 올바른지 확인한다.

```shell
kubectl cluster-info dump
```

### 'No Auth Provider Found' 오류 메시지 문제 해결 {#no-auth-provider-found}

쿠버네티스 1.26에서 다음 클라우드
제공자가 관리하는 쿠버네티스 서비스에 대한 kubectl 내장 인증이 제거되었다. 각 제공자는
클라우드별 인증을 위한 kubectl 플러그인을 출시했다. 사용 방법은 다음 제공자 문서를 참고한다.

* Azure AKS: [kubelogin 플러그인](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

같은 오류 메시지가 표시되더라도 이 변경과 관련 없는 다른 원인이
있을 수 있다.

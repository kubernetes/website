---
title: "kubectl 설치 검증하기"
description: "kubectl을 검증하는 방법에 대해 설명한다."
headless: true
---

kubectl이 쿠버네티스 클러스터를 찾아 접근하려면,
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)를
사용하여 클러스터를 생성하거나 Minikube 클러스터를 성공적으로 배포할 때 자동으로 생성되는
[kubeconfig 파일](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)이
필요하다.
기본적으로, kubectl 구성은 `~/.kube/config` 에 있다.

클러스터 상태를 가져와서 kubectl이 올바르게 구성되어 있는지 확인한다.

```shell
kubectl cluster-info
```

URL 응답이 표시되면, kubectl이 클러스터에 접근하도록 올바르게 구성된 것이다.

다음과 비슷한 메시지가 표시되면, kubectl이 올바르게 구성되지 않았거나 쿠버네티스 클러스터에 연결할 수 없다.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

예를 들어, 랩톱에서 로컬로 쿠버네티스 클러스터를 실행하려면, Minikube와 같은 도구를 먼저 설치한 다음 위에서 언급한 명령을 다시 실행해야 한다.

kubectl cluster-info가 URL 응답을 반환하지만 클러스터에 접근할 수 없는 경우, 올바르게 구성되었는지 확인하려면 다음을 사용한다.

```shell
kubectl cluster-info dump
```
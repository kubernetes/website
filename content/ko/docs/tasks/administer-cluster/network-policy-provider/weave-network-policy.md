---
reviewers:
title: 네트워크 폴리시로 위브넷(Weave Net) 사용하기
content_template: templates/task
weight: 50
---

{{% capture overview %}}

이 페이지는 네트워크 폴리시(NetworkPolicy)로 위브넷(Weave Net)를 사용하는 방법을 살펴본다.

{{% /capture %}}

{{% capture prerequisites %}}

쿠버네티스 클러스터가 필요하다. 맨 땅에서부터 시작하기를 위해서 [kubeadm 시작하기 안내서](/docs/getting-started-guides/kubeadm/)를 따른다.

{{% /capture %}}

{{% capture steps %}}

## Weave Net 애드온을 설치한다

[애드온을 통한 쿠버네티스 통합하기](https://www.weave.works/docs/net/latest/kube-addon/) 가이드를 따른다.

쿠버네티스의 위브넷 애드온은 쿠버네티스의 모든 네임스페이스의 네크워크 정책 어노테이션을 자동으로 모니터링하며, 정책에 따라 트래픽을 허용하고 차단하는 `iptables` 규칙을 구성하는 [네트워크 폴리시 컨트롤러](https://www.weave.works/docs/net/latest/kube-addon/#npc)와 함께 제공된다.

## 설치 시험

위브넷이 동작하는지 확인한다.

다음 커맨드를 입력한다.

```shell
kubectl get pods -n kube-system -o wide
```

출력은 다음과 유사하다.

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

위브넷 파드를 가진 각 노드와 모든 파드는 `Running`이고 `2/2 READY`이다(`2/2`는 각 파드가 `weave`와 `weave-npc`를 가지고 있음을 뜻한다).

{{% /capture %}}

{{% capture whatsnext %}}

위브넷 애드온을 설치하고 나서, 쿠버네티스 네트워크 폴리시를 시도하기 위해 [네트워크 폴리시 선언하기](/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다. 질문이 있으면 [슬랙 #weave-community 이나 Weave 유저그룹](https://github.com/weaveworks/weave#getting-help)에 연락한다.

{{% /capture %}}



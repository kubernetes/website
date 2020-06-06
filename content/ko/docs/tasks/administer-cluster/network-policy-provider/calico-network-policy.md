---
reviewers:
title: 네트워크 폴리시로 캘리코(Calico) 사용하기
content_template: templates/task
weight: 10
---

{{% capture overview %}}
이 페이지는 쿠버네티스에서 캘리코(Calico) 클러스터를 생성하는 몇 가지 빠른 방법을 살펴본다.
{{% /capture %}}

{{% capture prerequisites %}}
[클라우드](#creating-a-calico-cluster-with-google-kubernetes-engine-gke)나 [지역](#creating-a-local-calico-cluster-with-kubeadm) 클러스터 중에 어디에 배포할지 결정한다.
{{% /capture %}}

{{% capture steps %}}
## 구글 쿠버네티스 엔진(GKE)에 캘리코 클러스터 생성하기 {#creating-a-calico-cluster-with-google-kubernetes-engine-gke}

**사전요구사항**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1.  캘리코로 GKE 클러스터를 시작하려면, `--enable-network-policy` 플래그를 추가하면 된다.

    **문법**
    ```shell
    gcloud container clusters create [클러스터_이름] --enable-network-policy
    ```

    **예시**
    ```shell
    gcloud container clusters create my-calico-cluster --enable-network-policy
    ```

1.  배포를 확인하기 위해, 다음 커맨드를 이용하자.

    ```shell
    kubectl get pods --namespace=kube-system
    ```

    캘리코 파드는 `calico`로 시작한다. 각각의 상태가 `Running`임을 확인하자.

## kubeadm으로 지역 캘리코 클러스터 생성하기 {#creating-a-local-calico-cluster-with-kubeadm}

Kubeadm을 이용해서 15분 이내에 지역 단일 호스트 캘리코 클러스터를 생성하려면,
[캘리코 빠른 시작](https://docs.projectcalico.org/latest/getting-started/kubernetes/)을 참고한다.

{{% /capture %}}


{{% capture whatsnext %}}
클러스터가 동작하면, 쿠버네티스 네트워크 폴리시(NetworkPolicy)를 시도하기 위해
[네트워크 폴리시 선언하기](/docs/tasks/administer-cluster/declare-network-policy/)를 따라 할 수 있다.
{{% /capture %}}


---
title: "도커 엔진 노드를 도커심에서 cri-dockerd로 마이그레이션하기"
weight: 9
content_type: task 
---

{{% thirdparty-content %}}

이 페이지는 도커 엔진 노드가 도커심 대신 `cri-dockerd`를 사용하도록 마이그레이션하는 방법을 보여 준다.
다음 시나리오에서는 아래 단계를 따라야 한다.

 * 도커심 사용은 중단하고 싶지만,
    쿠버네티스의 컨테이너 실행에는 여전히 도커 엔진을 사용하기를 원하는 경우
 * 쿠버네티스 버전 v{{< skew currentVersion >}}로 업그레이드를 원하고
    기존 클러스터가 도커심을 사용하는 경우.
    이러한 경우에는 도커심을 다른 것으로 대체해야 하며 `cri-dockerd`도 선택지 중 하나이다.

도커심 제거에 관하여 더 배우려면, [FAQ page](/dockershim)를 읽어보자.

## cri-dockerd란 무엇인가? {#what-is-cri-dockerd}

쿠버네티스 1.23 이하에서는 _도커심_ 이라는 이름의 쿠버네티스 내장 구성요소를 사용하여
도커 엔진을 쿠버네티스 컨테이너 런타임으로 사용할 수 있었다.
도커심 구성 요소는 쿠버네티스 1.24 릴리스에서 제거되었지만,
대신 서드 파티 대체제 `cri-dockerd`를 사용할 수 있다.
`cri-dockerd` 어댑터를 사용하면 {{<glossary_tooltip term_id="cri">}}를 통해 도커 엔진을 사용할 수 있다.

{{<note>}}
이미 `cri-dockerd`를 사용한다면, 도커심 제거에 의한 영향은 받지 않는다.
시작하기 전에, [노드가 도커심을 사용하는지 확인](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)하자.
{{</note>}}

컨테이너 런타임으로 도커 엔진을 계속 사용할 수 있도록
`cri-dockerd`로 마이그레이션하려는 경우
영향을 받는 각각의 노드에 아래 내용을 진행해야 한다.

1.  `cri-dockerd`를 설치한다.
1.  노드를 통제(cordon)하고 비운다(drain).
1.  `cri-dockerd`를 사용하도록 kubelet를 설정한다. 
1.  kubelet을 재시작한다.
1.  노드가 정상(healthy)인지 확인한다.

중요하지 않은(non-critical) 노드에서 먼저 테스트한다.

`cri-dockerd`로 마이그레이션하려는 각 노드에 대해
아래 단계를 수행해야 한다.

## {{% heading "prerequisites" %}}

*   [`cri-dockerd`](https://github.com/mirantis/cri-dockerd#build-and-install)를
    각 노드에 설치하고 시작한다.
*   [네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).

## 노드의 통제(Cordon)와 비우기(drain)

1.  새로운 파드를 노드에 스케줄링하는 것을 막기 위해 노드를 통제한다.

    ```shell
    kubectl cordon <NODE_NAME>
    ```
    `<NODE_NAME>` 부분에 노드의 이름을 입력한다.

1.  실행 중인 파드를 안전하게 축출하기 위해 노드를 비운다. 

    ```shell
    kubectl drain <NODE_NAME> \
        --ignore-daemonsets
    ```

## cri-dockerd를 사용하도록 kubelet 설정

아래의 단계는 kubeadm 도구를 사용하여 생성된 클러스터에 적용된다.
다른 도구를 사용했다면, 해당 도구에 대한 환경 설정 방법을 참고하여 
kubelet 환경 설정을 수정해야 한다.

1.  영향 받는 각 노드의 `/var/lib/kubelet/kubeadm-flags.env`를 연다.
1.  `--container-runtime-endpoint` 플래그를
    `unix:///var/run/cri-dockerd.sock`로 수정한다.

kubeadm 도구는 노드의 소켓을 컨트롤 플레인의 `Node` 오브젝트의 어노테이션으로 저장한다.
영향을 받는 각 노드의 해당 소켓을 수정하려면 다음을 따른다.

1.  `Node` 오브젝트의 YAML 표현식을 편집한다.

    ```shell
    KUBECONFIG=/path/to/admin.conf kubectl edit no <NODE_NAME>
    ```
    각 인자는 다음과 같이 입력한다.
    
    *   `/path/to/admin.conf`: 
        kubectl 환경 설정 파일(`admin.conf`)의 경로.
    *   `<NODE_NAME>`: 수정을 원하는 노드의 이름.

1.  `kubeadm.alpha.kubernetes.io/cri-socket`의 값
    `/var/run/dockershim.sock`을 `unix:///var/run/cri-dockerd.sock`로 변경한다.
1.  변경을 저장한다. `Node` 오브젝트는 저장 시 업데이트된다.

## kubelet 재시작

```shell
systemctl restart kubelet
```

## 노드가 정상(healthy)인지 확인

노드가 `cri-dockerd` 엔드포인트를 사용하는지 확인하려면,
[사용 런타임 찾기](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/) 지침을 따른다.
kubelet의 `--container-runtime-endpoint` 플래그는 `unix:///var/run/cri-dockerd.sock` 이어야 한다.

## 노드 통제 해제(Uncordon)

노드에 파드를 스케줄 하도록 통제를 해제한다. 

```shell
kubectl uncordon <NODE_NAME>
```

## {{% heading "whatsnext" %}}

*   [도커심 제거 FAQ](/dockershim/) 읽기.
*   [도커 엔진의 도커심을 containerd로 마이그레이션하는 방법 알아보기](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/). 
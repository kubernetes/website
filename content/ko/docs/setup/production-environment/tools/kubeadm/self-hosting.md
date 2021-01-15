---
reviewers:
title: 컨트롤 플레인을 자체 호스팅하기 위해 쿠버네티스 클러스터 구성하기
content_type: concept
weight: 100
---

<!-- overview -->

### 쿠버네티스 컨트롤 플레인 자체 호스팅하기 {#self-hosting}

kubeadm은 실험적으로 _자체 호스팅_ 된 쿠버네티스 컨트롤 플레인을 만들 수 있도록
해준다. API 서버, 컨트롤러 매니저 및 스케줄러와 같은 주요 구성 요소가 정적(static) 파일을
통해 kubelet에 구성된 [스태틱(static) 파드](/ko/docs/tasks/configure-pod-container/static-pod/)
대신 쿠버네티스 API를 통해 구성된 [데몬셋(DaemonSet) 파드](/ko/docs/concepts/workloads/controllers/daemonset/)
로 실행된다.

자체 호스팅된 클러스터를 만들려면 [kubeadm alpha selfhosting pivot](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-selfhosting)
명령어를 확인한다.

<!-- body -->

#### 주의사항

{{< caution >}}
이 기능은 클러스터를 지원되지 않는 상태로 전환하여 더 이상 클러스터를 관리할 수 없게 만든다.
이것은 `kubeadm upgrade`를 포함한다.
{{< /caution >}}

1. 1.8 이후 버전에서 자체 호스팅은 몇 가지 중요한 한계가 있다.
  특히 자체 호스팅된 클러스터는 수동 조정 없이는
  _컨트롤 플레인 노드를 재부팅하고 나서 복구할 수 없다._

1. 기본적으로 자체 호스팅된 컨트롤 플레인 파드는
  [`hostPath`](/ko/docs/concepts/storage/volumes/#hostpath) 볼륨에서 불러 온
  자격 증명에 의존한다. 초기 생성을 제외하고, 이러한 자격 증명은 kubeadm에 의해
  관리되지 않는다.

1. 컨트롤 플레인의 자체 호스팅된 부분에는 스태틱 파드로 실행되는 etcd가
  포함되지 않는다.

#### 프로세스

자체 호스팅 부트스트랩 프로세스는 [kubeadm 설계
문서](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting)에 기록되어 있다.

요약하면 `kubeadm alpha selfhosting`은 다음과 같이 작동한다.

  1. 부트스트랩 스태틱 컨트롤 플레인이 실행되고 정상 상태가 될 때까지 기다린다.
    이것은 자체 호스팅이 없는 `kubeadm init` 프로세스와 동일하다.

  1. 스태틱 컨트롤 플레인 파드 매니페스트를 사용하여 자체 호스팅된 컨트롤
    플레인을 실행할 데몬셋 매니페스트 집합을 구성한다. 또한 필요한 경우
    해당 매니페스트를 수정한다. 예를 들어, 시크릿을 위한 새로운 볼륨을
    추가한다.

  1. `kube-system` 네임스페이스에 데몬셋을 생성하고 결과 파드가 실행될 때까지
    대기한다.

  1. 일단 자체 호스팅된 파드가 동작하면 관련 스태틱 파드가 삭제되고
    kubeadm은 계속해서 다음 구성 요소를 설치한다.
    이것은 kubelet이 스태틱 파드를 멈추게 한다.

  1. 기존의 컨트롤 플레인이 멈추면 새롭게 자체 호스팅된 컨트롤 플레인은
    리스닝 포트에 바인딩하여 활성화할 수 있다.

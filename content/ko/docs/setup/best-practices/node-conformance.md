---
# reviewers:
# - Random-Liu
title: 노드 구성 검증하기
weight: 30
---

## 노드 적합성 테스트

*노드 적합성 테스트*는 노드의 시스템 검증과 기능 테스트를 제공하는
컨테이너화된 테스트 프레임워크이다. 이 테스트는 노드가 쿠버네티스의 최소 요구 사항을
충족하는지 검증하며, 테스트를 통과한 노드는
쿠버네티스 클러스터에 참여할 자격을 얻는다.

## 노드 필수 구성 요소

노드 적합성 테스트를 실행하려면 노드는 표준 쿠버네티스 노드와 동일한
전제 조건을 충족해야 한다. 노드에는 최소한 다음 데몬이 설치되어
있어야 한다.

* 도커, containerd, CRI-O와 같이 CRI와 호환되는 컨테이너 런타임
* kubelet

## 노드 적합성 테스트 실행

노드 적합성 테스트를 실행하려면 다음 단계를 수행한다.

1. kubelet에 대한 `--kubeconfig` 옵션의 값을 확인한다. 예를 들면, 다음과 같다.
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
   테스트 프레임워크는 kubelet을 테스트하기 위해 로컬 컨트롤 플레인을 시작하므로,
   API 서버의 URL로 `http://localhost:8080`을 사용한다.
   사용할 수 있는 다른 kubelet 커맨드라인 파라미터도 있다.

   * `--cloud-provider`: `--cloud-provider=gce`를 사용 중이라면,
    테스트 실행 시에는 제거해야 한다.

1. 다음 커맨드로 노드 적합성 테스트를 실행한다.

   ```shell
   # $CONFIG_DIR는 kubelet의 파드 매니페스트 경로이다.
   # $LOG_DIR는 테스트 출력 경로이다.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## 다른 아키텍처에서 노드 적합성 테스트 실행

쿠버네티스는 다른 아키텍처용 노드 적합성 테스트 도커 이미지도
제공한다.

|  Arch  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## 선택된 테스트 실행

특정 테스트를 실행하려면 실행할 테스트의 정규식으로 환경 변수 `FOCUS`를
덮어쓴다.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # MirrorPod 테스트만 실행
  registry.k8s.io/node-test:0.2
```

특정 테스트를 건너뛰려면 건너뛸 테스트의 정규식으로 환경 변수 `SKIP`을
덮어쓴다.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # 모든 적합성 테스트를 실행하되 MirrorPod 테스트는 건너뜀
  registry.k8s.io/node-test:0.2
```

노드 적합성 테스트는 [노드 e2e 테스트](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md)를
컨테이너화한 버전이다.
기본적으로, 모든 적합성 테스트를 실행한다.

이론적으로 컨테이너를 구성하고 필요한 볼륨을 올바르게 마운트하면 모든 노드 e2e 테스트를 실행할 수 있다.
하지만 적합성 테스트가 아닌 테스트를 실행하려면 훨씬 복잡한 구성이 필요하므로,
**적합성 테스트만 실행할 것을 강력히 권장한다.**

## 주의 사항

* 테스트 후 노드에는 노드 적합성 테스트 이미지와
  기능 테스트에 사용된 컨테이너 이미지 등 일부
  도커 이미지가 남는다.
* 테스트 후 노드에는 죽은 컨테이너가 남는다.
  이 컨테이너는 기능 테스트 중 생성된다.

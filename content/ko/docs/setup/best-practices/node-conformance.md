---
# reviewers:
# - Random-Liu
title: 노드 구성 검증하기
weight: 30
---


## 노드 적합성 테스트

*노드 적합성 테스트* 는 노드의 시스템 검증과 기능 테스트를 제공하기 위해 컨테이너화된 
테스트 프레임워크이다. 
테스트는 노드가 쿠버네티스를 위한 최소 요구조건을 만족하는지를 검증한다. 
그리고 테스트를 통과한 노드는 쿠버네티스 클러스터에 참여할 자격이 주어진다.

## 노드 필수 구성 요소

노드 적합성 테스트를 실행하기 위해서는, 
해당 노드는 표준 쿠버네티스 노드로서 동일한 전제조건을 만족해야 한다.
노드는 최소한 아래 데몬들이 설치되어 있어야 한다.

* 컨테이너 런타임 (Docker)
* Kubelet

## 노드 적합성 테스트 실행

노드 적합성 테스트는 다음 순서로 진행된다.
1. kubelet에 대한 `--kubeconfig` 옵션의 값을 계산한다. 예를 들면, 다음과 같다.
   `--kubeconfig = / var / lib / kubelet / config.yaml`.
   테스트 프레임워크는 kubelet을 테스트하기 위해 로컬 컨트롤 플레인을 시작하기 때문에,
   `http://localhost:8080` 을 API 서버의 URL로 사용한다.
   사용할 수 있는 kubelet 커맨드 라인 파라미터가 몇 개 있다.
  * `--cloud-provider`: `--cloud-provider=gce`를 사용 중이라면, 
    테스트 실행 시에는 제거해야 한다.

2. 다음 커맨드로 노드 적합성 테스트를 실행한다.

```shell
# $CONFIG_DIR는 Kublet의 파드 매니페스트 경로이다.
# $LOG_DIR는 테스트 출력 경로이다.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  registry.k8s.io/node-test:0.2
```

## 다른 아키텍처에서 노드 적합성 테스트 실행

쿠버네티스는 다른 아키텍쳐용 노드 적합성 테스트 Docker 이미지도 제공한다.

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## 선택된 테스트 실행

특정 테스트만 실행하기 위해서는 환경 변수 `FOCUS`에 테스트하고자 하는 테스트를 정규식으로 지정한다.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # MirrorPod 테스트만 실행
  registry.k8s.io/node-test:0.2
```

특정 테스트를 건너뛰기 위해서는, 환경 변수 `SKIP`에 건너뛰고자 하는 테스트를 정규식으로 지정한다.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # MirrorPod 테스트만 건너뛰고 모든 적합성 테스트를 실행한다
  registry.k8s.io/node-test:0.2
```

노드 적합성 테스트는 [노드 e2e 테스트](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)를 컨테이너화한 버전이다.
기본적으로, 모든 적합성 테스트를 실행한다.

이론적으로, 컨테이너와 필요한 볼륨을 적절히 설정했다면 어떤 노드 e2e 테스트도 수행할 수 있다.
하지만, 적합성 테스트가 아닌 테스트들은 훨씬 복잡한 설정이 필요하기 때문에 **적합성 테스트만 실행하기를 강하게 추천한다.**

## 주의 사항

* 테스트 후, 노드 적합성 테스트 이미지 및 기능 테스트에 사용된 이미지들을 포함하여 몇 개의 Docker 이미지들이 노드에 남는다.
* 테스트 후, 노드에 죽은 컨테이너가 남는다. 기능 테스트 도중에 생성된 컨테이너들이다.

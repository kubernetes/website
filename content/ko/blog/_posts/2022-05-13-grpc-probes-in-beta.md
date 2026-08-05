---
layout: blog
title: "쿠버네티스 1.24: gRPC 컨테이너 프로브 베타"
date: 2022-05-13
slug: grpc-probes-now-in-beta
author: >
  Sergey Kanzhelev (Google)
translator:
  송원석 (쏘카),
  손석호 (ETRI),
  김상홍 (국민대),
  김보배 (11번가)
---

쿠버네티스 1.24에서 gRPC 프로브 기능이 베타에 진입했으며 기본적으로 사용 가능하다.
이제 HTTP 엔드포인트를 노출하지 않고, gRPC 앱에 대한 스타트업(startup), 활성(liveness) 및 준비성(readiness) 프로브를 구성할 수 있으며,
실행 파일도 필요하지 않는다. 쿠버네티스는 기본적으로 gRPC를 통해 워크로드에 자체적으로(natively) 연결 가능하며, 상태를 쿼리할 수 있다.

## 약간의 히스토리

시스템이 워크로드의 앱이 정상인지, 정상적으로 시작되었는지,
트래픽을 수용할 수 있는지에 대해 관리하는 것은 유용하다.
gRPC 지원이 추가되기 전에도, 쿠버네티스는 이미 컨테이너 이미지
내부에서 실행 파일을 실행하거나, HTTP 요청을 하거나,
TCP 연결이 성공했는지 여부를 확인하여 상태를 확인할 수 있었다.

대부분의 앱은, 이러한 검사로 충분하다. 앱이 상태(또는 준비성) 확인을
위한 gRPC 엔드포인트를 제공하는 경우 `exec` 프로브를
gRPC 상태 확인에 사용하도록 쉽게 용도를 변경할 수 있다.
블로그 기사 [쿠버네티스의 gRPC 서버 상태 확인](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/)에서, Ahmet Alp Balkan은 이를 수행하는 방법을 설명하였으며, 이는 지금도 여전히 작동하는 메커니즘이다.

이것을 활성화하기 위해 일반적으로 사용하는 도구는 2018년 8월 21일에 [생성](https://github.com/grpc-ecosystem/grpc-health-probe/commit/2df4478982e95c9a57d5fe3f555667f4365c025d)되었으며, 이 도구의 첫 릴리즈는 [2018년 9월 19일](https://github.com/grpc-ecosystem/grpc-health-probe/releases/tag/v0.1.0-alpha.1)에 나왔다.

gRPC 앱 상태 확인을 위한 이 접근 방식은 매우 인기있다. `grpc_health_probe`를 포함하고 있는 [Dockerfile은 3,626개](https://github.com/search?l=Dockerfile&q=grpc_health_probe&type=code)이며, (문서 작성 시점에)GitHub의 기본 검색으로 발견된 [yaml 파일은 6,621개](https://github.com/search?l=YAML&q=grpc_health_probe&type=Code)가 있다. 이것은 도구의 인기와 이를 기본적으로 지원해야 할 필요성을 잘 나타낸다.

쿠버네티스 v1.23은 gRPC를 사용하여 워크로드 상태를 쿼리하는 기본(native) 지원을 알파 수준의 구현으로 기본 지원으로 도입 및 소개했다. 알파 기능이었기 때문에 v1.23 릴리스에서는 기본적으로 비활성화되었다.

## 기능 사용

우리는 다른 프로브와 유사한 방식으로 gRPC 상태를 확인할 수 있도록 구축했으며, 쿠버네티스의 다른 프로브에 익숙하다면 [사용하기 쉬울 것](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)이라 믿는다.
자체적으로 지원되는 상태 프로브는 `grpc_health_probe` 실행 파일과 관련되어 있던 차선책에 비해 많은 이점이 있다.

기본 gRPC 지원을 사용하면 이미지에 `10MB`의 추가 실행 파일을 다운로드하여 저장할 필요가 없다.
Exec 프로브는 실행 파일을 실행하기 위해 새 프로세스를 인스턴스화해야 하므로 일반적으로 gRPC 호출보다 느리다.
또한 파드가 리소스 최대치로 실행 중이고 새 프로세스를 인스턴스화하는데 문제가 있는 경우에는 검사의 분별성을 낮추게 만든다.

그러나 여기에는 몇 가지 제약이 있다. 프로브용 클라이언트 인증서(certificate)를 구성하는 것이 어렵기 때문에, 클라이언트 인증(authentication)이 필요한 서비스는 지원하지 않는다. 기본 제공(built-in) 프로브도 서버 인증서를 확인하지 않고 관련 문제를 무시한다.

또한 기본 제공 검사는 특정 유형의 오류를 무시하도록 구성할 수 없으며 (`grpc_health_probe`는 다른 오류에 대해 다른 종료 코드를 반환함), 단일 프로브에서 여러 서비스 상태 검사를 실행하도록 "연계(chained)"할 수 없다.

그러나 이러한 모든 제한 사항은 gRPC에서 꽤 일반적이며 이에 대한 쉬운 해결 방법이 있다.

## 직접 해 보기

### 클러스터 수준의 설정

오늘 이 기능을 사용해 볼 수 있다. 기본 gRPC 프로브 사용을 시도하려면, `GRPCContainerProbe` 기능 게이트를 활성화하여 쿠버네티스 클러스터를 직접 가동한다. [가용한 도구](/ko/docs/tasks/tools/)가 많이 있다.

기능 게이트 `GRPCContainerProbe`는 1.24에서 기본적으로 활성화되어 있으므로, 많은 공급업체가 이 기능을 즉시 사용 가능하도록 제공할 것이다.
따라서 선택한 플랫폼에서 1.24 클러스터를 그냥 생성하면 된다. 일부 공급업체는 1.23 클러스터에서 알파 기능을 사용 할 수 있도록 허용한다.

예를 들어, 빠른 테스트를 위해 GKE에서 테스트 클러스터를 가동할 수 있다. (해당 문서 작성 시점 기준)
다른 공급업체도 유사한 기능을 가지고 있을 수 있다. 특히 쿠버네티스 1.24 릴리스 이후 이 블로그 게시물을 읽고 있는 경우에는 더욱 그렇다.

GKE에서 다음 명령어를 사용한다. (참고로 버전은 `1.23`이고 `enable-kubernetes-alpha`가 지정됨).

```shell
gcloud container clusters create test-grpc \
    --enable-kubernetes-alpha \
    --no-enable-autorepair \
    --no-enable-autoupgrade \
    --release-channel=rapid \
    --cluster-version=1.23
```

또한 클러스터에 접근하기 위해서 `kubectl`을 구성할 필요가 있다.

```shell
gcloud container clusters get-credentials test-grpc
```

### 기능 사용해 보기

gRPC 프로브가 작동하는 방식을 테스트하기 위해 파드를 생성해 보겠다. 이 테스트에서는 `agnhost` 이미지를 사용한다.
이것은 모든 종류의 워크로드 테스트에 사용할 수 있도록, k8s가 유지 관리하는 이미지다.
예를 들어, 두 개의 포트를 노출하는 유용한 [grpc-health-checking](https://github.com/kubernetes/kubernetes/blob/b2c5bd2a278288b5ef19e25bf7413ecb872577a4/test/images/agnhost/README.md#grpc-health-checking) 모듈을 가지고 있다. 하나는 상태 확인 서비스를 제공하고 다른 하나는 `make-serving` 및 `make-not-serving` 명령에 반응하는 http 포트다.

다음은 파드 정의의 예시이다. 이 예시는 `grpc-health-checking` 모듈을 시작하고, 포트 `5000` 및 `8080`을 노출하며, gRPC 준비성 프로브를 구성한다.

``` yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: test-grpc
spec:
  containers:
  - name: agnhost
    # 이미지가 변경됨 (기존에는 "k8s.gcr.io" 레지스트리를 사용)
    image: registry.k8s.io/e2e-test-images/agnhost:2.35
    command: ["/agnhost", "grpc-health-checking"]
    ports:
    - containerPort: 5000
    - containerPort: 8080
    readinessProbe:
      grpc:
        port: 5000
```

`test.yaml`이라는 파일이 있으면, 파드를 생성하고 상태를 확인할 수 있다. 파드는 아래 출력 스니펫(snippet)에 표시된 대로 준비(ready) 상태가 된다.

```shell
kubectl apply -f test.yaml
kubectl describe test-grpc
```

출력에는 다음과 같은 내용이 포함된다.

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

이제 상태 확인 엔드포인트 상태를 NOT_SERVING으로 변경해 보겠다.
파드의 http 포트를 호출하기 위해 포트 포워드를 생성한다.

```shell
kubectl port-forward test-grpc 8080:8080
```

명령을 호출하기 위해 `curl`을 사용할 수 있다 ...

```shell
curl http://localhost:8080/make-not-serving
```

... 그리고 몇 초 후에 포트 상태가 준비되지 않음으로 전환된다.

```shell
kubectl describe pod test-grpc
```

이제 다음과 같은 출력을 확인할 수 있을 것이다.

```
Conditions:
  Type              Status
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
...
  Warning  Unhealthy  2s (x6 over 42s)  kubelet            Readiness probe failed: service unhealthy (responded with "NOT_SERVING")
```

다시 전환되면, 약 1초 후에 파드가 준비(ready) 상태로 돌아간다.

``` bsh
curl http://localhost:8080/make-serving
kubectl describe test-grpc
```

아래 출력은 파드가 다시 `Ready` 상태로 돌아갔다는 것을 나타낸다.

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

쿠버네티스에 내장된 이 새로운 gRPC 상태 프로브를 사용하면 별도의 `exec` 프로브를 사용하는 이전 접근 방식보다 gRPC를 통한 상태 확인을 훨씬 쉽게 구현할 수 있다. 더 자세한 내용 파악을 위해 공식 [문서](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)를 자세히 살펴보고, 기능이 GA로 승격되기 전에 피드백을 제공하길 바란다.

## 요약

쿠버네티스는 인기 있는 워크로드 오케스트레이션 플랫폼이며 피드백과 수요를 기반으로 기능을 추가한다.
gRPC 프로브 지원과 같은 기능은 많은 앱 개발자의 삶을 더 쉽게 만들고 앱을 더 탄력적으로 만들 수 있는 마이너한 개선이다. 오늘 기능을 사용해보고 기능이 GA로 전환되기 전에 오늘 사용해 보고 피드백을 제공해보자.

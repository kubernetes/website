---
title: 로컬에서 텔레프레즌스를 이용한 서비스 개발 및 디버깅
content_type: task
---

<!-- overview -->

{{% thirdparty-content %}}

쿠버네티스 애플리케이션은 일반적으로 각각 자체 컨테이너에서 실행되는 여러 개의 개별 서비스로 구성된다. 원격 쿠버네티스 클러스터 상에서 이러한 서비스를 개발하고 디버깅하려면 디버깅 도구를 실행하기 위해 [동작 중인 컨테이너의 셸(shell)에 접근](/ko/docs/tasks/debug/debug-application/get-shell-running-container/)해야 하기 때문에 번거로울 수 있다.
 
`텔레프레즌스(telepresence)`는 원격 쿠버네티스 클러스터로 서비스를 프록시하면서 로컬에서 서비스를 개발 및 디버깅하는 과정을 용이하게 하는 도구이다. `텔레프레즌스`를 사용하면 로컬 서비스에 디버거 및 IDE와 같은 사용자 지정 도구를 사용할 수 있고 원격 클러스터에서 실행되는 컨피그맵(ConfigMap), 시크릿(Secret) 및 서비스(Service)에 대한 전체 접근 권한을 서비스에 제공할 수 있다.
 
이 문서는 `텔레프레즌스`를 사용하여 원격 클러스터에서 실행 중인 서비스를 로컬로 개발하고 디버그하는 방법을 설명한다.

## {{% heading "prerequisites" %}}

* 쿠버네티스 클러스터가 설치되어 있어야 한다.
* `kubectl`은 클러스터와 통신하도록 구성되어 있어야 한다.
* [텔레프레즌스](https://www.telepresence.io/reference/install)가 설치되어 있어야 한다.


<!-- steps -->

## 로컬 머신을 원격 쿠버네티스 클러스터에 연결
 
`텔레프레즌스`를 설치한 후 `텔레프레즌스 커넥트(telepresence connect)`를 실행하여 데몬을 실행하고 로컬 워크스테이션을 클러스터에 연결한다.

```
$ telepresence connect
 
Launching Telepresence Daemon
...
Connected to context default (https://<cluster public IP>)
```

쿠버네티스 구문을 사용하여 서비스에 curl이 가능하다. 예, `curl -ik https://kubernetes.default`
 
## 기존 서비스 개발 또는 디버깅

쿠버네티스에서 애플리케이션을 개발할 때 일반적으로 단일 서비스를 프로그래밍하거나 디버그한다. 서비스를 테스트 및 디버깅하기 위해 다른 서비스에 접근이 필요할 수 있다. 지속적 배포(continuous deployment) 파이프라인을 사용하는 것도 한 가지 옵션이지만, 가장 빠른 배포 파이프라인이라도 프로그래밍 또는 디버그 주기에 지연이 발생할 수 있다.
 
`telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT` 명령을 사용하여 원격 서비스 트래픽을 다시 라우팅하기 위한 "인터셉트(intercept)"를 생성한다.
 
아래의 각 항목에 대한 설명을 참고한다.

- `$SERVICE_NAME`은 로컬 서비스의 이름이다.
- `$LOCAL_PORT`는 서비스가 로컬 워크스테이션에서 실행 중인 포트이다.
- `$REMOTE_PORT`는 서비스가 클러스터에서 수신하는 포트이다.

이 명령을 실행하면 원격 쿠버네티스 클러스터의 서비스 대신 로컬 서비스에 원격 트래픽을 보내도록 텔레프레즌스에 지시한다. 서비스 소스 코드를 로컬에서 편집하고 저장하여 원격 애플리케이션에 접근할 때 해당 변경 사항이 즉시 적용되는지 확인한다. 디버거 또는 기타 로컬 개발 도구를 사용하여 로컬 서비스를 실행할 수도 있다.

## 텔레프레즌스는 어떻게 작동하는가?

Telepresence는 원격 클러스터에서 실행 중인 기존 애플리케이션의 컨테이너 옆에 트래픽 에이전트 사이드카(sidecar)를 설치한다. 그런 다음 파드로 들어오는 모든 트래픽 요청을 캡처하고, 이를 원격 클러스터의 애플리케이션에 전달하는 대신, 모든 트래픽([글로벌 인터셉트](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)를 생성하는 경우) 또는 일부 트래픽([개인 인터셉트](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept)를 생성하는 경우)을 로컬 개발 환경으로 라우팅한다.

## {{% heading "whatsnext" %}}
 
핸즈온 튜토리얼에 관심이 있다면 구글 쿠버네티스 엔진 상의 방명록 애플리케이션을 로컬로 개발하는 과정을 안내하는 [이 튜토리얼](https://cloud.google.com/community/tutorials/developing-services-with-k8s)을 확인한다.
 
자세한 내용은 [텔레프레즌스 웹사이트](https://www.telepresence.io)를 참조한다.
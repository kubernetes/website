---
title: 공유 볼륨을 이용하여 동일한 파드의 컨테이너 간에 통신하기
content_template: templates/task
weight: 110
---

{{% capture overview %}}

이 페이지는 동일한 파드(Pod)에서 실행 중인 두 개의 컨테이너 간에 통신할 때에, 어떻게 볼륨(Volume)을 이용하는지
살펴본다.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## 두 개의 컨테이너를 실행하는 파드 생성

이 실습에서 두 개의 컨테이너를 실행하는 파드를 생성한다. 이 컨테이너들은
통신에 사용할 수 있는 볼륨을 공유한다.
아래는 이 파드의 구성 파일이다.

{{< codenew file="pods/two-container-pod.yaml" >}}

이 구성 파일에는 파드가 `shared-data`로 명명한 볼륨을 가진 것을
알 수 있다.

첫 번째 컨테이너에는 nginx 웹 서버를 실행하는 구성 파일이 나열되어 있다.
공유 볼륨의 마운트 경로는 `/usr/share/nginx/html`이다.
두 번째 컨테이너는 debian 이미지 기반이고, 마운트 경로는 `/pod-data`이다.
두 번째 컨테이너는 다음 명령어를 실행한 후에 종료한다.

    echo debian 컨테이너에서 안녕하세요 > /pod-data/index.html

두 번째 컨테이너는 `index.html` 파일을
nginx 웹 서버에서 호스팅하는 문서의 루트 디렉터리(`/usr/share/nginx/html/`)에 저장한다.

이제, 파드와 두 개의 컨테이너를 생성한다.

    kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml

파드와 컨테이너의 정보를 확인한다.

    kubectl get pod two-containers --output=yaml

출력의 일부는 다음과 같다.

    apiVersion: v1
    kind: Pod
    metadata:
      ...
      name: two-containers
      namespace: default
      ...
    spec:
      ...
      containerStatuses:

      - containerID: docker://c1d8abd1 ...
        image: debian
        ...
        lastState:
          terminated:
            ...
        name: debian-container
        ...

      - containerID: docker://96c1ff2c5bb ...
        image: nginx
        ...
        name: nginx-container
        ...
        state:
          running:
        ...

Debian 컨테이너가 종료되었음을 알 수 있고, nginx 컨테이너는
아직 실행 중이다.

nginx 컨테이너의 쉘(shell)을 실행한다.

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

쉘에서 nginx 웹 서버가 실행 중인지 확인한다.

    root@two-containers:/# apt-get update
    root@two-containers:/# apt-get install curl procps
    root@two-containers:/# ps aux

출력은 아래와 유사하다.

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

Debian 컨테이너에서 nginx 웹 서버가 호스팅하는 문서의 루트 디렉터리에 `index.html` 파일을 생성했었음을 상기하자.
`curl`을 이용하여 nginx 웹 서버에 HTTP GET 요청을 보낸다.

    root@two-containers:/# curl localhost

출력을 보면, nginx 웹 서버에서 debian 컨테이너에서 쓰여진 웹 페이지를 제공하는 것을 알 수 있다.

    debian 컨테이너에서 안녕하세요

{{% /capture %}}


{{% capture discussion %}}

## 토의

파드가 여러 컨테이너를 갖을 수 있는 우선적인 이유는 근본 애플리케이션을 보조할
도우미(helper) 애플리케이션을 제공하기 위해서이다. 도우미 애플리케이션의 일반적인 예로는
데이터를 가지고 오는 경우(data puller)나 데이터를 보내주는 경우(data pusher)이거나 프록시가 있다.
도우미와 근본 애플리케이션은 종종 서로 간에 통신을 해야 할 수 있다.
보통 이는 이번 예제에서 살펴본 것 같이, 공유 파일 시스템을 통하거나,
루프백 네트워크 인터페이스 곧 로컬 호스트(localhost)를 통해서 이뤄진다. 이 패턴의 한가지 예는
웹 서버가 도우미 프로그램과 함께 Git 저장소에서 새 업데이트를 받아오는 경우이다.

이 예제에서 볼륨은 파드의 생명 주기 동안 컨테이너를 위한 통신 방법으로 이용했다.
파드가 삭제되고 재생성되면, 공유 볼륨에 저장된 데이터는
잃어버린다.

{{% /capture %}}


{{% capture whatsnext %}}

* [합성 컨테이너(composite container) 패턴](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)에 관하여
더 공부한다.

* [모듈 구조를 위한 컴포지트 컨테이너](http://www.slideshare.net/Docker/slideshare-burns)에 관하여
공부한다.

* [저장소로 볼륨을 사용하는 파드 구성 방법](/docs/tasks/configure-pod-container/configure-volume-storage/)을
참고한다.

* [볼륨](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)을 확인한다.

* [파드](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)을 확인한다.

{{% /capture %}}




---
title: 초기화 컨테이너에 대한 구성
content_type: task
weight: 130
---

<!-- overview -->
이 페이지는 애플리케이션 실행 전에 파드를 초기화하기 위해 어떻게 초기화 컨테이너를
구성해야 하는지 보여준다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 초기화 컨테이너를 갖는 파드 생성

이 연습에서 하나의 애플리케이션 컨테이너와 하나의 초기화 컨테이너를 갖는
파드를 생성한다. 초기화 컨테이너는 애플리케이션 시작
전에 실행을 종료한다.

아래는 해당 파드의 구성 파일이다.

{{< codenew file="pods/init-containers.yaml" >}}

이 구성 파일에서, 파드가 가진 볼륨을 초기화
컨테이너와 애플리케이션 컨테이너가 공유하는 것을 볼 수 있다.

초기화 컨테이너는 공유된 볼륨을
`/work-dir` 에 마운트하고, 애플리케이션 컨테이너는 공유된 볼륨을
`/usr/share/nginx/html` 에 마운트한다. 초기화 컨테이너는 다음 명령을 실행 후
종료한다.

    wget -O /work-dir/index.html http://info.cern.ch

초기화 컨테이너는 nginx 서버의 루트 디렉터리 내 `index.html` 파일을
저장한다.

파드를 생성한다.

    kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml

nginx 컨테이너가 실행 중인지 확인한다.

    kubectl get pod init-demo

출력 결과는 nginx 컨테이너가 실행 중임을 보여준다.

    NAME        READY     STATUS    RESTARTS   AGE
    init-demo   1/1       Running   0          1m

init-demo 파드 내 실행 중인 nginx 컨테이너의 셸을 실행한다.

    kubectl exec -it init-demo -- /bin/bash

셸에서 GET 요청을 nginx 서버로 전송한다.

    root@nginx:~# apt-get update
    root@nginx:~# apt-get install curl
    root@nginx:~# curl localhost

출력 결과는 nginx가 초기화 컨테이너에 의해 저장된 웹 페이지를 제공하고 있음을 보여준다.

    <html><head></head><body><header>
    <title>http://info.cern.ch</title>
    </header>

    <h1>http://info.cern.ch - home of the first website</h1>
      ...
      <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
      ...



## {{% heading "whatsnext" %}}


* [같은 파드 내 실행 중인 컨테이너들간 통신](/ko/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)에
대해 배우기.
* [초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)에 대해 배우기.
* [볼륨](/ko/docs/concepts/storage/volumes/)에 대해 배우기.
* [초기화 컨테이너 디버깅](/ko/docs/tasks/debug/debug-application/debug-init-containers/)에 대해 배우기.

---
# reviewers:
# - Random-Liu
# - feiskyer
# - mrunalp
title: crictl로 쿠버네티스 노드 디버깅하기
content_type: task
weight: 30
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`crictl`은 CRI-호환 컨테이너 런타임에 사용할 수 있는 커맨드라인 인터페이스이다.
쿠버네티스 노드에서 컨테이너 런타임과 애플리케이션을 검사하고
디버그하는 데 사용할 수 있다.
`crictl`과 그 소스는 [cri-tools](https://github.com/kubernetes-sigs/cri-tools) 저장소에서 호스팅한다.

## {{% heading "prerequisites" %}}

`crictl`은 CRI 런타임이 있는 리눅스 운영체제를  필요로 한다.

<!-- steps -->

## crictl 설치하기

cri-tools [릴리스 페이지](https://github.com/kubernetes-sigs/cri-tools/releases)에서
다양한 아키텍처 별로 압축된 `crictl` 아카이브(archive)를 다운로드할 수 있다.
설치된 쿠버네티스 버전에 해당하는 버전을 다운로드한다.
`/usr/local/bin/`와 같은 시스템 경로의 위치에
압축을 푼다.

## 일반적인 사용법

`crictl` 커맨드에는 여러 하위 커맨드와 런타임 플래그가 있다.
자세한 내용은 `crictl help` 또는 `crictl <subcommand> help`를 참조한다.

아래 내용 중 하나를 통해 `crictl`의 엔드포인트를 설정할 수 있다.

* `--runtime-endpoint`와 `--image-endpoint` 플래그 설정.
* `CONTAINER_RUNTIME_ENDPOINT`와 `IMAGE_SERVICE_ENDPOINT` 환경 변수
  설정.
* 구성 파일 `/etc/crictl.yaml`에 엔드포인트 설정.
  다른 파일을 지정하기 위해서는 `crictl`을 실행할 때 `--config=PATH_TO_FILE` 플래그를 사용한다.

{{<note>}}
엔드포인트를 설정하지 않으면,
`crictl`이 알려진 엔드포인트 목록에 연결을 시도하므로 성능에 영향을 줄 수 있다.
{{</note>}}

서버에 연결할 때 구성 파일에서 `timeout` 또는 `debug` 값을 명시하거나,
`--timeout` 그리고 `--debug` 커맨드라인 플래그를 사용하여
타임아웃 값을 지정하고 디버깅을 활성화하거나 비활성화할 수 있다.

현재 구성을 보거나 편집하려면 `/etc/crictl.yaml`의 내용을 보거나 편집한다.
예를 들어,
`containerd` 컨테이너 런타임 사용 시 구성은 아래와 유사하다.

```
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 10
debug: true
```

`crictl`에 대해 자세히 알고 싶다면,
[`crictl` 문서](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)를 참조한다.

## crictl 커맨드 예시

아래 예시를 통해 `crictl` 커맨드와 출력을 확인해보자.

{{< warning >}}
구동 중인 쿠버네티스 클러스터에서 `crictl`을 사용하여 파드 샌드박스(sandbox)나 컨테이너를 만들게 되면,
결국에는 kubelet이 그것들을 삭제하게 된다.
`crictl`은 일반적인 워크플로우 툴이 아니라 디버깅에 유용한 툴임을 명심해야 한다.
{{< /warning >}}

### 파드 목록 조회

모든 파드의 목록 조회

```shell
crictl pods
```

출력은 다음과 유사하다.

```
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

이름으로 파드의 목록 조회

```shell
crictl pods --name nginx-65899c769f-wv2gp
```

출력은 다음과 유사하다.

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

레이블로 파드의 목록 조회

```shell
crictl pods --label run=nginx
```

출력은 다음과 유사하다.

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### 이미지 목록 조회

모든 이미지의 목록 조회

```shell
crictl images
```

출력은 다음과 유사하다.

```
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

저장소로 이미지 목록 조회

```shell
crictl images nginx
```

출력은 다음과 유사하다.

```
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

이미지의 IDs 목록만 조회

```shell
crictl images -q
```

출력은 다음과 유사하다.

```
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

### 컨테이너 목록 조회

모든 컨테이너 목록 조회

```shell
crictl ps -a
```

출력은 다음과 유사하다.

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

실행 중인 컨테이너 목록 조회

```shell
crictl ps
```

출력은 다음과 유사하다.

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

### 실행 중인 컨테이너 안에서 명령 실행

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```

출력은 다음과 유사하다.

```
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### 컨테이너의 로그 조회

모든 컨테이너의 로그 조회

```shell
crictl logs 87d3992f84f74
```

출력은 다음과 유사하다.

```
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

최신 `N`개 줄의 로그만 조회

```shell
crictl logs --tail=1 87d3992f84f74
```

출력은 다음과 유사하다.

```
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

### 파드 샌드박스 실행

`crictl`을 사용하여 파드 샌드박스를 실행하는 것은 컨테이너 런타임 디버깅에 유용하다.
구동 중인 쿠버네티스 클러스터에서
이러한 샌드박스는 kubelet에 의해서 결국 중지 및 삭제된다.

1. 다음과 같은 JSON 파일 생성한다.

   ```json
   {
     "metadata": {
       "name": "nginx-sandbox",
       "namespace": "default",
       "attempt": 1,
       "uid": "hdishd83djaidwnduwk28bcsb"
     },
     "log_directory": "/tmp",
     "linux": {
     }
   }
   ```

2. `crictl runp` 커맨드를 사용하여 JSON을 적용하고 샌드박스를 실행한다.

   ```shell
   crictl runp pod-config.json
   ```

   결과로 샌드박스의 ID가 반환될 것이다.

### 컨테이너 생성

`crictl`을 사용하여 컨테이너를 만드는 것은 컨테이너 런타임 디버깅에 유용하다.
구동 중인 쿠버네티스 클러스터에서
이러한 샌드박스는 kubelet에 의해서 결국 중지 및 삭제된다.

1. busybox 이미지 가져오기

   ```shell
   crictl pull busybox
   ```
   ```none
   Image is up to date for busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47
   ```

2. 파드와 컨테이너 구성(config) 생성

   **파드 구성**:

   ```json
   {
     "metadata": {
       "name": "busybox-sandbox",
       "namespace": "default",
       "attempt": 1,
       "uid": "aewi4aeThua7ooShohbo1phoj"
     },
     "log_directory": "/tmp",
     "linux": {
     }
   }
   ```

   **컨테이너 구성**:

   ```json
   {
     "metadata": {
       "name": "busybox"
     },
     "image":{
       "image": "busybox"
     },
     "command": [
       "top"
     ],
     "log_path":"busybox.log",
     "linux": {
     }
   }
   ```

3. 이전에 생성한 파드의 ID 및 컨테이너 구성 파일과 파드 구성 파일을 커맨드 인자로 전달하여,
컨테이너를 생성한다.
결과로 컨테이너의 ID가 반환될 것이다.

   ```shell
   crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json
   ```

4. 모든 컨테이너의 목록을 조회하여
   새로 생성된 컨테이너의 상태가 `Created`임을 확인한다.

   ```shell
   crictl ps -a
   ```

   출력은 다음과 유사하다.
      
   ```
   CONTAINER ID        IMAGE               CREATED             STATE               NAME                ATTEMPT
   3e025dd50a72d       busybox             32 seconds ago      Created             busybox             0
   ```

### 컨테이너 시작하기

컨테이너를 시작하기 위해서 컨테이너 ID를 `crictl start`에 인자로 전달한다.

```shell
crictl start 3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

출력은 다음과 유사하다.

```
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

컨테이너의 상태가 `Running`임을 확인한다.

```shell
crictl ps
```
출력은 다음과 유사하다.

```
CONTAINER ID   IMAGE    CREATED              STATE    NAME     ATTEMPT
3e025dd50a72d  busybox  About a minute ago   Running  busybox  0
```

## {{% heading "whatsnext" %}}

* [`crictl` 더 알아보기](https://github.com/kubernetes-sigs/cri-tools).
* [`docker` CLI 커맨드를 `crictl`로 매핑하기](/docs/reference/tools/map-crictl-dockercli/).


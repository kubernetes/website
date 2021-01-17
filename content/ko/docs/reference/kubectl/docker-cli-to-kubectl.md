---
title: 도커 사용자를 위한 kubectl
content_type: concept



---

<!-- overview -->
당신은 쿠버네티스 커맨드 라인 도구인 kubectl을 사용하여 API 서버와 상호 작용할 수 있다. 만약 도커 커맨드 라인 도구에 익숙하다면 kubectl을 사용하는 것은 간단하다. 다음 섹션에서는 도커의 하위 명령을 보여주고 kubectl과 같은 명령어를 설명한다.


<!-- body -->
## docker run

nginx 디플로이먼트(Deployment)를 실행하고 해당 디플로이먼트를 노출시키려면, [kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-)을 참고한다.
docker:

```shell
docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
```
```
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db
```

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
# nginx 실행하는 파드를 시작한다
kubectl create deployment --image=nginx nginx-app
```
```
deployment.apps/nginx-app created
```

```shell
# nginx-app 에 env를 추가한다
kubectl set env deployment/nginx-app  DOMAIN=cluster
```
```
deployment.apps/nginx-app env updated
```

{{< note >}}
`kubectl` 커맨드는 생성되거나 변경된 리소스의 유형과 이름을 출력하므로, 이를 후속 커맨드에 사용할 수 있다. 디플로이먼트가 생성된 후에는 새로운 서비스를 노출할 수 있다.
{{< /note >}}

```shell
# 서비스를 통해 포트를 노출
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
```
service "nginx-http" exposed
```

kubectl을 사용하면, N개의 파드가 nginx를 실행하도록 [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)를 생성할 수 있다. 여기서 N은 스펙에 명시된 레플리카 수이며, 기본값은 1이다. 또한 파드의 레이블과 셀럭터를 사용하여 서비스를 생성할 수 있다. 자세한 내용은 [클러스터 내 애플리케이션에 접근하기 위해 서비스 사용하기](/ko/docs/tasks/access-application-cluster/service-access-application-cluster)를 참고한다.

기본적으로 이미지는 `docker run -d ...` 와 비슷하게 백그라운드로 실행된다. 포그라운드로 실행하려면 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run)을 이용하여 파드를 생성한다.
```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

`docker run ...` 과 달리 `--attach` 를 지정하면 `표준 입력(stdin)`, `표준 출력(stdout)` 및 `표준 오류(stderr)`가 붙는다. 연결된(attached) 스트림을 제어할 수 없다(`docker -a ...`).
해당 컨테이너에서 분리(detach)하려면 이스케이프 시퀀스(escape sequence) Ctrl+P를 입력한 다음 Ctrl+Q를 입력한다.

## docker ps

현재 실행 중인 목록을 보기 위해서는 [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get)을 참고한다.

docker:

```shell
docker ps -a
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
kubectl get po
```
```
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

## docker attach

이미 실행 중인 컨테이너에 연결하려면 [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach)를 참고한다.

docker:

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   5 minutes ago       Up 5 minutes        0.0.0.0:80->80/tcp   nginx-app
```

```shell
docker attach 55c103fa1296
...
```

kubectl:

```shell
kubectl get pods
```
```
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl attach -it nginx-app-5jyvm
...
```

컨테이너에서 분리하려면 이스케이프 시퀀스 Ctrl+P를 입력한 다음 Ctrl+Q를 입력한다.

## docker exec

컨테이너에서 커맨드를 실행하려면 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)를 참고한다.

docker:

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   nginx-app
```
```shell
docker exec 55c103fa1296 cat /etc/hostname
```
```
55c103fa1296
```

kubectl:

```shell
kubectl get po
```
```
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl exec nginx-app-5jyvm -- cat /etc/hostname
```
```
nginx-app-5jyvm
```

대화형 커맨드를 사용한다.


docker:

```shell
docker exec -ti 55c103fa1296 /bin/sh
# exit
```

kubectl:

```shell
kubectl exec -ti nginx-app-5jyvm -- /bin/sh
# exit
```

자세한 내용은 [실행 중인 컨테이너의 셸 얻기](/docs/tasks/debug-application-cluster/get-shell-running-container/)를 참고한다.

## docker logs

실행 중인 프로세스의 표준 입력(stdout)/표준 오류(stderr)를 수행하려면 [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs)를 참고한다.


docker:

```shell
docker logs -f a9e
```
```
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

kubectl:

```shell
kubectl logs -f nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

파드와 컨테이너에는 근소한 차이가 있다. 기본적으로 파드는 프로세스가 종료되어도 종료되지 않는다. 대신 파드가 프로세스를 다시 시작한다. 이는 도커의 실행 옵션인 `--restart=always`와 유사하지만, 한 가지 큰 차이점이 있다. 도커에서는 프로세스의 각 호출에 대한 출력이 연결되지만, 쿠버네티스의 경우 각 호출은 별개다. 쿠버네티스에서 이전 실행의 출력 내용을 보려면 다음을 수행한다.

```shell
kubectl logs --previous nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

자세한 정보는 [로깅 아키텍처](/ko/docs/concepts/cluster-administration/logging/)를 참고한다.

## docker stop 과 docker rm

실행 중인 프로세스를 중지하고 삭제하려면 [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete)을 참고한다.

docker:

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                         NAMES
a9ec34d98787        nginx               "nginx -g 'daemon of"  22 hours ago        Up 22 hours         0.0.0.0:80->80/tcp, 443/tcp   nginx-app
```

```shell
docker stop a9ec34d98787
```
```
a9ec34d98787
```

```shell
docker rm a9ec34d98787
```
```
a9ec34d98787
```

kubectl:

```shell
kubectl get deployment nginx-app
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nginx-app    1/1     1            1           2m
```

```shell
kubectl get po -l run=nginx-app
```
```
NAME                         READY     STATUS    RESTARTS   AGE
nginx-app-2883164633-aklf7   1/1       Running   0          2m
```
```shell
kubectl delete deployment nginx-app
```
```
deployment "nginx-app" deleted
```

```shell
kubectl get po -l run=nginx-app
# 아무것도 반환하지 않는다
```

{{< note >}}
kubectl을 사용할 때는 파드를 직접 삭제하지 않는다. 먼저 파드를 소유한 디플로이먼트를 삭제해야 한다. 만약 파드를 직접 삭제하면 디플로이먼트가 파드를 재생성할 것이다.
{{< /note >}}

## docker login

kubectl은 `docker login`와 직접적인 유사점은 없다. 프라이빗 레지스트리와 함께 쿠버네티스를 사용하려면 [프라이빗 레지스트리 사용](/ko/docs/concepts/containers/images/#프라이빗-레지스트리-사용)을 참고한다.

## docker version

클라이언트와 서버의 버전을 가져오려면 [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version)을 참고한다.

docker:

```shell
docker version
```
```
Client version: 1.7.0
Client API version: 1.19
Go version (client): go1.4.2
Git commit (client): 0baf609
OS/Arch (client): linux/amd64
Server version: 1.7.0
Server API version: 1.19
Go version (server): go1.4.2
Git commit (server): 0baf609
OS/Arch (server): linux/amd64
```

kubectl:

```shell
kubectl version
```
```
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

## docker info

환경 및 설정에 대한 자세한 정보는 [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info)를 참고한다.

docker:

```shell
docker info
```
```
Containers: 40
Images: 168
Storage Driver: aufs
 Root Dir: /usr/local/google/docker/aufs
 Backing Filesystem: extfs
 Dirs: 248
 Dirperm1 Supported: false
Execution Driver: native-0.2
Logging Driver: json-file
Kernel Version: 3.13.0-53-generic
Operating System: Ubuntu 14.04.2 LTS
CPUs: 12
Total Memory: 31.32 GiB
Name: k8s-is-fun.mtv.corp.google.com
ID: ADUV:GCYR:B3VJ:HMPO:LNPQ:KD5S:YKFQ:76VN:IANZ:7TFV:ZBF4:BYJO
WARNING: No swap limit support
```

kubectl:

```shell
kubectl cluster-info
```
```
Kubernetes master is running at https://203.0.113.141
KubeDNS is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
kubernetes-dashboard is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
Grafana is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```

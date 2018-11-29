---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
---

{{% capture overview %}}

이 튜토리얼의 목표는 Node.js 로 작성된 간단한 Hello World 애플리케이션을 쿠버네티스에서 실행되는
애플리케이션으로 변환하는 것이다. 튜토리얼을 통해 로컬에서 작성된 코드를 Docker 컨테이너 이미지로
변환한 다음, [Minikube](/docs/getting-started-guides/minikube)에서 해당 이미지를 실행하는
방법을 보여 준다. Minikube는 무료로 로컬 머신을 이용해서 쿠버네티스를 실행할 수 있는 간단한 방법을
제공한다.

{{% /capture %}}

{{% capture objectives %}}

* Node.js로 hello world 애플리케이션을 실행한다.
* Minikube에 만들어진 애플리케이션을 배포한다.
* 애플리케이션 로그를 확인한다.
* 애플리케이션 이미지를 업데이트한다.


{{% /capture %}}

{{% capture prerequisites %}}

* macOS의 경우, [Homebrew](https://brew.sh)를 사용하여 Minikube를 설치할 수 있다.

  {{< note >}}
  **참고:** macOS 10.13 버전으로 업데이트 후 `brew update`를 실행 시 Homebrew에서 다음과 같은 오류가 발생할 경우에는,

  ```
  Error: /usr/local is not writable. You should change the ownership
  and permissions of /usr/local back to your user account:
  sudo chown -R $(whoami) /usr/local
  ```
  Homebrew를 다시 설치하여 문제를 해결할 수 있다.
  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```
  {{< /note >}}

* 예제 애플리케이션을 실행하기 위해서는 [NodeJS](https://nodejs.org/en/)가 필요하다.

* Docker를 설치한다. macOS의 경우,
[Docker for Mac](https://docs.docker.com/engine/installation/mac/)를 권장한다.


{{% /capture %}}

{{% capture lessoncontent %}}

## Minikube 클러스터 만들기

이 튜토리얼에서는 [Minikube](https://github.com/kubernetes/minikube)를 사용하여
로컬 클러스터를 만든다. 이 튜토리얼에서는 macOS에서
[Docker for Mac](https://docs.docker.com/engine/installation/mac/)을
사용한다고 가정하였다. Docker for Mac 대신 Linux 혹은 VirtualBox와 같이 다른 플랫폼을
사용하는 경우, Minikube를 설치하는 방법이 약간 다를 수 있다. 일반적인 Minikube 설치 지침은
[Minikube installation guide](/docs/getting-started-guides/minikube/)
를 참조한다.

Homebrew를 사용하여 최신 버전의 Minikube를 설치한다.
```shell
brew cask install minikube
```

[Minikube driver installation guide](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperkit-driver)에
설명한 것과 같이 HyperKit 드라이버를 설치한다.

Homebrew를 사용하여 쿠버네티스 클러스터와 상호 작용을 위한
`kubectl` 명령줄 도구를 다운로드한다.

```shell
brew install kubernetes-cli
```

프록시를 거치지않고 직접 [https://cloud.google.com/container-registry/](https://cloud.google.com/container-registry/)같은 사이트에 액세스 할 수 있는지 확인하려면 새 터미널을 열고 다음과 같이 실행한다.

```shell
curl --proxy "" https://cloud.google.com/container-registry/
```

Docker 데몬이 시작되었는지 확인한다. Docker가 실행 중인지는 다음과 같은 커맨드를 사용하여 확인할 수 있다.

```shell
docker images
```

프록시가 필요하지 않은 경우, Minikube 클러스터를 시작한다.

```shell
minikube start --vm-driver=hyperkit
```
프록시가 필요한 경우, 다음 방법을 사용하여 프록시 설정과 함께 Minikube 클러스터를 시작할 수 있다.

```shell
minikube start --vm-driver=hyperkit --docker-env HTTP_PROXY=http://your-http-proxy-host:your-http-proxy-port  --docker-env HTTPS_PROXY=http(s)://your-https-proxy-host:your-https-proxy-port
```

`--vm-driver=hyperkit` 플래그는 Docker for Mac을 사용하고 있음을 의미한다.
기본 VM 드라이버는 VirtualBox이다.

이제 Minikube 컨텍스트를 설정한다. 컨텍스트는 'kubectl'이 어떠한 클러스터와 상호 작용하려고
하는지를 결정한다. `~/.kube/config` 파일에 사용 가능한 모든 컨텍스트가 들어있다.

```shell
kubectl config use-context minikube
```

`kubectl`이 클러스터와 통신할 수 있도록 설정되어 있는지 확인한다.

```shell
kubectl cluster-info
```

브라우저에서 쿠버네티스 대시보드를 연다.

```shell
minikube dashboard
```

## Node.js 애플리케이션 만들기

다음 단계에서는 애플리케이션을 작성해 본다. 아래 코드를 `hellonode` 폴더에
`server.js`라는 이름으로 저장한다.

{{< codenew language="js" file="minikube/server.js" >}}

작성된 애플리케이션을 실행한다.

```shell
node server.js
```

[http://localhost:8080/](http://localhost:8080/)에 접속하면 "Hello World!"라는 메시지를 확인할 수 있을 것이다.

**Ctrl-C**를 입력하면 실행 중인 Node.js 서버가 중단된다.

다음 단계는 작성된 애플리케이션을 Docker 컨테이너에 패키지하는 것이다.

## Docker 컨테이너 이미지 만들기

앞에서 사용하였던 `hellonode` 폴더에  `Dockerfile`이라는 이름으로 파일을 만든다. Dockerfile
은 빌드하고자 하는 이미지를 기술한 파일이다. 기존 이미지를 확장하여 Docker
컨테이너 이미지를 빌드할 수 있다. 이 튜토리얼에서는 기존 Node.js 이미지를 확장하여 사용한다.

{{< codenew language="conf" file="minikube/Dockerfile" >}}

본 레시피는 Docker 레지스트리에 있는 공식 Node.js LTS 이미지로부터 시작해서,
8080 포트를 열고, `server.js` 파일을 이미지에 복사하고
Node.js 서버를 시작한다.

이 튜토리얼은 Minikube를 사용하기 때문에, Docker 이미지를 레지스트리로 Push하는 대신,
Minikube VM과 동일한 Docker 호스트를 사용하면 이미지를 단순히 빌드하기만 해도
이미지가 자동으로 (역주: Minikube에서 사용할 수 있는 위치에) 생긴다. 이를 위해서,
다음의 커맨드를 사용해서 Minikube Docker 데몬을 사용할 수 있도록 한다.

```shell
eval $(minikube docker-env)
```

{{< note >}}
**참고:** 나중에 Minikube 호스트를 더 이상 사용하고 싶지 않은 경우,
`eval $ (minikube docker-env -u)`를 실행하여 변경을 되돌릴 수 있다.
{{< /note >}}

Minikube Docker 데몬을 사용하여 Docker 이미지를 빌드한다. (마지막의 점에 주의)

```shell
docker build -t hello-node:v1 .
```

이제 Minikube VM에서 빌드한 이미지를 실행할 수 있다.

## 디플로이먼트 만들기

쿠버네티스 [*파드*](/docs/concepts/workloads/pods/pod/)는 관리 및 네트워크 구성을 목적으로
함께 묶은 하나 이상의 컨테이너 그룹이다.
이 튜토리얼의 파드에는 단 하나의 컨테이너만 있다.
쿠버네티스 [*디플로이먼트*](/docs/concepts/workloads/controllers/deployment/)는 파드의
헬스를 검사해서 파드의 컨테이너가 종료되면 다시 시작해준다.
파드의 생성 및 확장을 관리하는 방법으로 디플로이먼트를 권장한다.

`kubectl create` 커맨드를 사용하여 파드를 관리하는 디플로이먼트를 만든다.
파드는 `hello-node:v1` Docker 이미지를 기반으로 한 컨테이너를 실행한다.
(이미지를 레지스트리에 Push하지 않았기 때문에) Docker 레지스트리에서 이미지를 가져오기 보다는, 
항상 로컬 이미지를 사용하기 위해 `--image-pull-policy` 플래그를 `Never`로 설정한다.

```shell
kubectl create deployment hello-node --image=hello-node:v1 --port=8080 --image-pull-policy=Never
```

디플로이먼트를 확인한다.


```shell
kubectl get deployments
```

출력:


```shell
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   1         1         1            1           3m
```

파드를 확인한다.


```shell
kubectl get pods
```

출력:


```shell
NAME                         READY     STATUS    RESTARTS   AGE
hello-node-714049816-ztzrb   1/1       Running   0          6m
```

클러스터 이벤트를 확인한다.

```shell
kubectl get events
```

`kubectl`의 설정을 확인한다.

```shell
kubectl config view
```

`kubectl` 커맨드에 대한 더 많은 정보를 원하는 경우,
[kubectl overview](/docs/user-guide/kubectl-overview/)를 확인한다.

## 서비스 만들기

기본적으로 파드는 쿠버네티스 클러스터 내의 내부 IP 주소로만 접속 가능하다.
쿠버네티스 가상 네트워크 밖에서 `hello-node` 컨테이너에 접속하기 위해서는 파드를
쿠버네티스 [*서비스*](/docs/concepts/services-networking/service/)로
노출해야 한다.

개발 환경에서, `kubectl expose` 커맨드를 사용해서 파드를 퍼블릭 인터넷에
노출할 수 있다.

```shell
kubectl expose deployment hello-node --type=LoadBalancer
```

방금 생성한 서비스를 확인한다.

```shell
kubectl get services
```

출력:

```shell
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
hello-node   ClusterIP   10.0.0.71    <pending>     8080/TCP   6m
kubernetes   ClusterIP   10.0.0.1     <none>        443/TCP    14d
```

`--type=LoadBalancer` 플래그는 해당 서비스를 클러스터 바깥으로 노출시키는
것을 지시한다. 로드 밸런서를 지원하는 클라우드 제공 업체의 경우, 외부
IP 주소가 프로비저닝되어서 서비스에 접근할 수 있도록 해준다. Minikube에서 
`LoadBalancer` 타입의 서비스는 `minikube service` 커맨드를 통해 접근할 수 있다.

```shell
minikube service hello-node
```

위 커맨드는 앱을 서비스하는 로컬 IP 주소로 브라우저를 자동으로 열어서
"Hello World" 메세지를 보여준다.

브라우저 또는 curl을 통해 새 웹서비스에 요청을 보내면, 로그가 쌓이는
것을 확인할 수 있을 것이다.

```shell
kubectl logs <POD-NAME>
```

## App 업데이트

새로운 메시지를 출력하도록 `server.js` 파일을 수정한다.

```javascript
response.end('Hello World Again!');

```

새로운 버전의 이미지를 빌드한다. (마지막의 점에 주의하라)

```shell
docker build -t hello-node:v2 .
```

디플로이먼트의 이미지를 업데이트한다.

```shell
kubectl set image deployment/hello-node hello-node=hello-node:v2
```

앱을 다시 실행하여 새로운 메시지를 확인한다.

```shell
minikube service hello-node
```

## 애드온 활성화하기

Minikube에는 활성화하거나 비활성화할 수 있고 로컬 쿠버네티스 환경에서 접속해 볼 수 있는 내장 애드온이 있다.

우선 현재 지원되는 애드온 목록을 확인한다.

```shell
minikube addons list
```

출력:

```shell
- storage-provisioner: enabled
- kube-dns: enabled
- registry: disabled
- registry-creds: disabled
- addon-manager: enabled
- dashboard: disabled
- default-storageclass: enabled
- coredns: disabled
- heapster: disabled
- efk: disabled
- ingress: disabled
```

이하의 커맨드를 적용하기 위해서는 Minikube가 실행 중이어야 한다. 예를 들어, `heapster` 애드온을 활성화하기 위해서는 
다음과 같이 실행한다.

```shell
minikube addons enable heapster
```

출력:

```shell
heapster was successfully enabled
```

생성한 파드와 서비스를 확인한다.

```shell
kubectl get po,svc -n kube-system
```

출력:

```shell
NAME                             READY     STATUS    RESTARTS   AGE
pod/heapster-zbwzv                1/1       Running   0          2m
pod/influxdb-grafana-gtht9        2/2       Running   0          2m

NAME                           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)             AGE
service/heapster               NodePort    10.0.0.52    <none>        80:31655/TCP        2m
service/monitoring-grafana     NodePort    10.0.0.33    <none>        80:30002/TCP        2m
service/monitoring-influxdb    ClusterIP   10.0.0.43    <none>        8083/TCP,8086/TCP   2m
```

브라우저에서 엔드포인트를 열어 heapster와 상호 작용한다.

```shell
minikube addons open heapster
```

출력:

```shell
Opening kubernetes service kube-system/monitoring-grafana in default browser...
```

## 제거하기

이제 클러스터에서 만들어진 리소스를 제거한다.

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

필요 시, 생성된 Docker 이미지를 강제로 제거한다.

```shell
docker rmi hello-node:v1 hello-node:v2 -f
```

필요 시, Minikube VM을 정지한다.

```shell
minikube stop
eval $(minikube docker-env -u)
```

필요 시, Minikube VM을 삭제한다.

```shell
minikube delete
```

{{% /capture %}}


{{% capture whatsnext %}}

* [Deployment objects](/docs/concepts/workloads/controllers/deployment/)에 대해서 더 배워 본다.
* [Deploying applications](/docs/user-guide/deploying-applications/)에 대해서 더 배워 본다.
* [Service objects](/docs/concepts/services-networking/service/)에 대해서 더 배워 본다.

{{% /capture %}}



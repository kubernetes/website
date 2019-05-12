---
title: Minikube로 로컬 상에서 쿠버네티스 구동
content_template: templates/concept	
---

{{% capture overview %}}

Minikube는 쿠버네티스를 로컬에서 쉽게 실행하는 도구이다. Minikube는 매일 쿠버네티스를 사용하거나 개발하려는 사용자들을 위해 VM 이나 노트북에서 단일 노드 쿠버네티스 클러스터를 실행한다.

{{% /capture %}}

{{% capture body %}}

## Minikube 특징

* Minikube는 다음과 같은 쿠버네티스의 기능을 제공한다.
  * DNS
  * 노드 포트
  * 컨피그 맵과 시크릿
  * 대시보드
  * 컨테이너 런타임: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o) 와 [containerd](https://github.com/containerd/containerd)
  * CNI(Container Network Interface) 사용
  * 인그레스

## 설치

[Minikube 설치](/ko/docs/tasks/tools/install-minikube/) 항목을 보자.

## 빠른 시작

여기부터는 Minikube 사용에 대한 간단한 데모이다.
VM 드라이버를 바꾸기 원하면 적절한 `--vm-driver=xxx` 플래그를 `minikube start`에 추가한다.
Minikube는 다음의 드라이버를 지원한다.

* virtualbox
* vmwarefusion
* kvm2 ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* hyperkit ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* hyperv ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
아래 나오는 IP주소는 동적이고 변할 수 있음을 알린다. 이는 `minikube ip` 명령으로 확인할 수 있다.
* vmware ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#vmware-unified-driver)) (VMware unified driver)
* none (쿠버네티스 구성요소는 VM이 아닌 호스트상에서 동작한다. 이 드라이버를 사용하기 위해서는 Docker ([docker 설치](https://docs.docker.com/install/linux/docker-ce/ubuntu/))와 리눅스 환경)이 필요하다.

```shell
minikube start
```
```
Starting local Kubernetes cluster...
Running pre-create checks...
Creating machine...
Starting local Kubernetes cluster...
```
```shell
kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
```
```
deployment.apps/hello-minikube created
```

```shell
kubectl expose deployment hello-minikube --type=NodePort
```
```
service/hello-minikube exposed
```

에코 서버 파드를 실행했지만 노출된 서비스를 통해 curl 등의 접근하기 전에
파드가 올라갈 때까지 기다려야 한다.
파드가 실행 중인지 확인하기 위해 다음을 이용할 수 있다.

```
kubectl get pod
```
```
NAME                              READY     STATUS              RESTARTS   AGE
hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
```

이 파드는 ContainerCreating 상태임을 알 수 있다.
kubectl get pod

```
NAME                              READY     STATUS    RESTARTS   AGE
hello-minikube-3383150820-vctvh   1/1       Running   0          13s
```

이제 파드가 Running 상태이므로 curl를 실행해 볼 수 있다.

```
curl $(minikube service hello-minikube --url)
```
```

Hostname: hello-minikube-7c77b68cff-8wdzq

Pod Information:
	-no pod information available-

Server values:
	server_version=nginx: 1.13.3 - lua: 10008

Request Information:
	client_address=172.17.0.1
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://192.168.99.100:8080/

Request Headers:
	accept=*/*
	host=192.168.99.100:30674
	user-agent=curl/7.47.0

Request Body:
	-no body in request-
```

```shell
kubectl delete services hello-minikube
```
```
service "hello-minikube" deleted
```

```shell
kubectl delete deployment hello-minikube
```
```
deployment.extensions "hello-minikube" deleted
```

```shell
minikube stop
```
```
Stopping local Kubernetes cluster...
Stopping "minikube"...
```

### 다른 컨테이너 런타임

#### containerd

[containerd](https://github.com/containerd/containerd)를 컨테이너 런타임으로 사용하려면, 다음을 실행한다.

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

혹은 확장 버전을 사용할 수 있다.

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```

#### CRI-O

[CRI-O](https://github.com/kubernetes-incubator/cri-o)를 컨테이너 런타임으로 사용하려면, 다음을 실행한다.

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

혹은 확장 버전을 사용할 수 있다.

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```

#### rkt 컨테이너 엔진

[rkt](https://github.com/rkt/rkt)를 컨테이너 런타임으로 사용하려면, 다음을 실행한다.

```shell
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=rkt
```

이것은 rkt와 Docker와 CNI 네트워킹을 포함하는 대안적인 Minikube ISO 이미지를 이용한다.

### 드라이버 플러그인

지원하는 드라이버 상세 정보와 설치방법은 [드라이버](https://git.k8s.io/minikube/docs/drivers.md)를 살펴보자
꼭 필요하다면 말이다.

### Docker 데몬 재사용

쿠버네티스 단일 VM을 사용하면 Minikube에 내장된 Docker 데몬을 재사용하기에 매우 간편하다. 이 경우는 호스트 장비에 Docker 레지스트리를 설치하고 이미지를 푸시할 필요가 없다. 또 로컬에서 빠르게 실행할 수 있는데 이는 Minikube와 동일한 Docker 데몬 안에서 이미지를 빌드하기 때문이다. Docker 이미지를 'latest'가 아닌 다른 태그로 태그했는지 확인하고 이미지를 풀링할 때에는 그 태그를 이용한다. 혹시 이미지 태그 버전을 지정하지 않았다면, 기본값은 `:latest`이고 이미지 풀링 정책은 `Always`가 가정하나, 만약 기본 Docker 레지스트리(보통 DockerHub)에 해당 Docker 이미지 버전이 없다면 `ErrImagePull`의 결과가 나타날 것이다.

맥이나 리눅스 호스트의 Docker 데몬에서 이 작업이 가능하게 하려면 `docker-env command`를 쉘에서 사용해야 한다.

```shell
eval $(minikube docker-env)
```

맥이나 리눅스 호스트에서 Minikube VM안에 Docker 데몬과 통신하도록 Docker를 명령행에서 사용할 수 있어야 한다.

```shell
docker ps
```

Centos 7 에서 Docker는 아래와 같은 오류를 발생한다.

```shell
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

해결 방법은 /etc/sysconfig/docker를 Minikube의 환경 변화를 기대한 것대로 바꾸도록 업데이트하는 것이다.

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

imagePullPolicy:Always를 꺼야하는 것은 명심하자. 그렇지 않으면 쿠버네티스가 로컬에서 빌드한 이미지를 사용하지 않는다.

## 클러스터 관리

### 클러스터 시작

`minikube start` 명령은 클러스터를 시작하는데 사용할 수 있다.
이 명령은 단일 노드 쿠버네티스 클러스터를 실행하는 가상머신을 생성하고 구성한다.
또한 클러스터와 통신하기 위해 [kubectl](/docs/user-guide/kubectl-overview/)를 구성한다.

만약 웹 프록시를 사용 중이라면 `minikube start` 명령에서 이 정보를 포함해야 한다.

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

불행히 환경 설정 변수만으로는 동작하지 않는다.

Minikube는 또한 "minikube" 컨텍스트를 생성하고, kubectl의 기본값으로 설정한다.
나중에 이 컨택스트를 변경하려면, `kubectl config use-context minikube` 명령을 실행하자.

#### 쿠버네티스 버전 지정

Minikube에서 사용할 쿠버네티스 버전은 `--kubernetes-version` 문자열을
`minikube start` 명령에 추가하여 지정할 수 있다.
예를 들어, `v1.7.3`을 이용한다면 아래처럼 할 수 있다.

```
minikube start --kubernetes-version v1.7.3
```

### 쿠버네티스 구성

Minikube는 사용자가 쿠버네티스 컴포넌트를 다양한 값으로 설정할 수 있도록 하는 '설정기' 기능이 있다.
이 기능을 사용하려면, `--extra-config` 플래그를 `minikube start` 명령어에 추가하여야 한다.

이 플래그는 여러번 쓸 수 있어 여러 옵션 설정을 전달 할 수 있다.

이 플래그는 `component.key=value`형식의 문자열로,
앞에 `component`는 아래 목록에 하나의 문자열이며 `key`는 configuration struct의 값이고 `value`는 설정할 값이다(역주: key는 struct의 맴버명).

올바른 키들은 각 컴포넌트의 쿠버네티스 `componentconfigs` 문서에서 찾아 볼 수 있다.
다음은 각각의 지원하는 설정에 대한 문서이다.

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/kubeletconfig#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### 예제

쿠블렛에서 `MaxPods` 설정을 5로 바꾸려면 `--extra-config=kubelet.MaxPods=5` 플래그를 전달하자.

이 기능은 또한 중첩 구조를 지원한다. 스케쥴러에서 `LeaderElection.LeaderElect` 설정을 `true`로 하려면, `--extra-config=scheduler.LeaderElection.LeaderElect=true` 플래그를 전달하자.

`apiserver`에서 `AuthorizationMode`를 `RBAC`으로 바꾸려면, `--extra-config=apiserver.authorization-mode=RBAC`를 사용할 수 있다.

### 클러스터 중지
`minikube stop` 명령어는 클러스터를 중지하는데 사용할 수 있다.
이 명령어는 Minikube 가상 머신을 종료하지만, 모든 클러스터 상태와 데이터를 보존한다.
클러스터를 다시 시작하면 이전의 상태로 돌려줍니다. 

### 클러스터 삭제
`minikube delete` 명령은 클러스터를 삭제하는데 사용할 수 있다.
이 명령어는 Minikube 가상 머신을 종료하고 삭제한다. 어떤 데이터나 상태도 보존되지 않다.

## 클러스터와 상호 작용

### Kubectl

`minikube start` 명령어는 Minikube로 부르는 "[kubectl 컨텍스트](/docs/reference/generated/kubectl/kubectl-commands/#-em-set-context-em-)" 를 생성한다. 
이 컨텍스트는 Minikube 클러스터와 통신하는 설정을 포함한다.

Minikube는 이 컨텍스트를 자동적으로 기본으로 설정한다. 만약 미래에 이것을 바꾸고 싶다면 

`kubectl config use-context minikube`을 실행하자.

혹은 각 명령어를 `kubectl get pods --context=minikube`처럼 컨텍스트를 전달하십시오.

### 대시보드

[쿠버네티스 대시보드](/docs/tasks/access-application-cluster/web-ui-dashboard/)를 이용하려면, Minikube를 실행한 후 쉘에서 아래 명령어를 실행하여 주소를 확인한다.

```shell
minikube dashboard
```

### 서비스

노드 포트로 노출된 서비스를 접근하기 위해, Minikube를 시작한 이후 쉘에서 아래 명령어를 실행하여 주소를 확인하자.

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## 네트워킹

Minikube VM은 host-only IP 주소를 통해 호스트 시스템에 노출되고, 이 IP 주소는 `minikube ip` 명령어로 확인할 수 있다.
`NodePort` 서비스 타입은 IP 주소에 해당 노드 포트로 접근할 수 있다.

서비스의 NodePort를 확인하려면 `kubectl` 명령어로 아래와 같이 하면 된다.

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## 퍼시스턴트 볼륨
Minikube는 [퍼시스턴트 볼륨](/docs/concepts/storage/persistent-volumes/)을 `hostPath` 타입으로 지원한다.
이런 퍼시스턴트 볼륨은 Minikube VM 내에 디렉터리로 매핑됩니다.

Minikube VM은 tmpfs에서 부트하는데, 매우 많은 디렉터리가 재부트(`minikube stop`)까지는 유지되지 않다.
그러나, Minikube는 다음의 호스트 디렉터리 아래 파일은 유지하도록 설정되어 있다.

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

이것은 `/data` 디렉터리에 데이터를 보존하도록 한 퍼시스턴트 볼륨 환경설정의 예이다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## 호스트 폴더 마운트
어떤 드라이버는 VM 안에 호스트 폴더를 마운트하여 VM과 호스트 사이에 쉽게 파일을 공유할 수 있게 한다. 이들은 지금 설정할 수 없고 사용하는 드라이버나 운영체제에 따라 다르다.

{{< note >}}
호스트 폴더 공유는 KVM 드라이버에서 아직 구현되어 있지 않다.
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

## 프라이빗 컨테이너 레지스트리

프라이빗 컨테이너 레지스트리를 이용하려면, [이 페이지](/docs/concepts/containers/images/)의 단계를 따르자.

`ImagePullSecrets`를 이용하기를 권하지만, Minikube VM 상에서 설정하려 한다면 `/home/docker` 디렉터리에 `.dockercfg`를 두거나 `/home/docker/.docker` 디렉터리에 `config.json`을 둘 수 있다.

## 애드온

Minikube에서 커스텀 애드온을 적절히 시작하고 재시작할 수 있으려면, 
Minikube와 함께 시작하려는 애드온을 `~/.minikube/addons` 디렉터리에 두자.
폴더 내부의 애드온은 Minikube VM으로 이동되어
Minikube가 시작하거나 재시작될 때에 함께 실행된다.

## HTTP 프록시 환경에서 Minikube 사용

Minikube는 쿠버네티스와 Docker 데몬을 포함한 가상 머신을 생성한다.
쿠버네티스가 Docker를 이용하여 컨테이너를 스케쥴링 시도할 때에, Docker 데몬은 컨테이너 이미지를 풀링하기 위해 외부 네트워크를 이용해야 한다.

HTTP 프록시 내부라면, Docker에서 프록시 설정을 해야 한다.
이를 하기 위해서 요구되는 환경 변수를 `minikube start` 중에 플래그로 전달한다.

예를 들어:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

만약 가상 머신 주소가 192.168.99.100 이라면 프록시 설정이 `kubectl`에 직접적으로 도달하지 못할 수도 있다.
이 IP 주소에 대해 프록시 설정을 지나치게 하려면 no_proxy 설정을 수정해야 한다. 다음과 같이 할 수 있다.

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## 알려진 이슈
* 클라우드 공급자를 필요로 하는 기능은 Minikube에서 동작하지 않는다. 여기에는 다음이 포함된다.
  * 로드밸런서
* 다중 노드를 위한 기능들이다. 여기에는 다음이 포함된다.
  * 진보된 스케쥴링 정책

## 설계

Minikube는 VM 프로비저닝을 위해서 [libmachine](https://github.com/docker/machine/tree/master/libmachine)를 사용하고, 쿠버네티스 클러스터를 프로비저닝하기 위해 [kubeadm](https://github.com/kubernetes/kubeadm)을 사용한다.

Minikube에 대한 더 자세한 정보는, [제안](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md) 부분을 읽어보자.

## 추가적인 링크:

* **목표와 비목표**: Minikube 프로젝트의 목표와 비목표에 대해서는 [로드맵](https://git.k8s.io/minikube/docs/contributors/roadmap.md)을 살펴보자.
* **개발 가이드**: 풀 리퀘스트를 보내는 방법에 대한 개요는 [참여 가이드](https://git.k8s.io/minikube/CONTRIBUTING.md)를 살펴보자.
* **Minikube 빌드**: Minikube를 소스에서 빌드/테스트하는 방법은 [빌드 가이드](https://git.k8s.io/minikube/docs/contributors/build_guide.md)를 살펴보자.
* **새 의존성 추가하기**: Minikube에 새 의존성을 추가하는 방법에 대해서는, [의존성 추가 가이드](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md)를 보자.
* **새 애드온 추가하기**: Minikube에 새 애드온을 추가하는 방법에 대해서는, [애드온 추가 가이드](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md)를 보자. 
* **MicroK8s**: 가상 머신을 사용하지 않으려는 Linux 사용자는 대안으로 [MicroK8s](https://microk8s.io/)를 고려할 수 있다.

## 커뮤니티

컨트리뷰션, 질문과 의견은 모두 환영하며 격려한다! Minikube 개발자는 [슬랙](https://kubernetes.slack.com)에 #minikube 채널(초청받으려면 [여기](http://slack.kubernetes.io/))에 상주하고 있다. 또한 [kubernetes-dev 구글 그룹 메일링 리스트](https://groups.google.com/forum/#!forum/kubernetes-dev)도 있다. 메일링 리스트에 포스팅한다면 제목에 "minikube: "라는 접두어를 사용하자.

{{% /capture %}}

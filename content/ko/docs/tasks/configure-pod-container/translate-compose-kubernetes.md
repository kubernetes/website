---
# reviewers:
# - cdrage
title: 도커 컴포즈 파일을 쿠버네티스 리소스로 변환하기
content_type: task
weight: 200
---

<!-- overview -->

Kompose는 무엇일까? Kompose는 컴포즈(즉, Docker Compose)를 컨테이너 오케스트레이션(쿠버네티스나 오픈시프트)으로 변환하는 도구이다.

더 자세한 내용은 Kompose 웹사이트 [http://kompose.io](http://kompose.io)에서 찾아볼 수 있다. 

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Kompose 설치하기

Kompose를 설치하기 위한 여러가지 방법들이 있다. 우리는 깃허브 최신 릴리스에서 바이너리를 다운 받는 방법을 사용할 것이다.

{{< tabs name="install_ways" >}}
{{% tab name="깃허브 다운로드" %}}

Kompose는 3주 주기로 깃허브에 릴리스된다. 현재 릴리스에 관한 모든 정보는 [깃허브 릴리스 페이지](https://github.com/kubernetes/kompose/releases)에서 확인할 수 있다.

```sh
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

또 다른 방법으로, [tarball](https://github.com/kubernetes/kompose/releases)를 다운로드 받을 수 있다.

{{% /tab %}}
{{% tab name="소스 빌드" %}}

`go get`을 통해 설치를 진행하면 최신 개발 변경점을 담고 있는 마스터 브랜치를 pull 한다.

```sh
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="CentOS 패키지" %}}

Kompose는 [EPEL](https://fedoraproject.org/wiki/EPEL) CentOS 저장소이다.
만약 [EPEL](https://fedoraproject.org/wiki/EPEL) 저장소를 설치하고 활성화하지 않았다면, `sudo yum install epel-release`으로 이를 수행할 수 있다.

시스템에 [EPEL](https://fedoraproject.org/wiki/EPEL)이 활성화되어 있다면, 다른 패키지처럼 Kompose를 설치할 수 있다.

```bash
sudo yum -y install kompose
```

{{% /tab %}}
{{% tab name="페도라 패키지" %}}

Kompose는 페도라 24, 25, 그리고 26 저장소에 있다. 다른 패키지들처럼 설치할 수 있다.

```bash
sudo dnf -y install kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

macOS에서는 [Homebrew](https://brew.sh)를 통해 최신 릴리스를 설치할 수 있다.

```bash
brew install kompose
```

{{% /tab %}}
{{< /tabs >}}

## Kompose 사용하기

몇 단계를 수행하면, 도커 컴포즈를 쿠버네티스로 변환할 수 있다.
`docker-compose.yml` 파일만 있으면 된다.

1. `docker-compose.yml` 파일이 존재하는 디렉토리로 이동한다. 만약 없다면, 아래 예제로 테스트한다.

   ```yaml
   version: "2"

   services:

     redis-master:
       image: registry.k8s.io/redis:e2e
       ports:
         - "6379"

     redis-slave:
       image: gcr.io/google_samples/gb-redisslave:v3
       ports:
         - "6379"
       environment:
         - GET_HOSTS_FROM=dns

     frontend:
       image: gcr.io/google-samples/gb-frontend:v4
       ports:
         - "80:80"
       environment:
         - GET_HOSTS_FROM=dns
       labels:
         kompose.service.type: LoadBalancer
   ```

2. `docker-compose.yml` 파일을 `kubectl`를 통해 활용할 수 있는 파일들로 변환하기 위해서는,
   `kompose convert`를 실행한 후, `kubectl apply -f <output file>`를 실행한다.

   ```bash
   kompose convert
   ```

   결과는 다음과 같다.

   ```none
   INFO Kubernetes file "frontend-service.yaml" created
      INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
      INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
      INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
      INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
      INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
      INFO Kubernetes file "redis-slave-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
   ```

   ```bash
    kubectl apply -f frontend-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,redis-master-deployment.yaml,redis-slave-deployment.yaml
   ```

   결과는 다음과 같다.

   ```none
   service/frontend created
   service/redis-master created
   service/redis-slave created
   deployment.apps/frontend created
   deployment.apps/redis-master created
   deployment.apps/redis-slave created
   ```

    디플로이먼트들은 쿠버네티스에서 실행된다.

3. 애플리케이션에 접근하기.

   `minikube`를 개발 환경으로 사용하고 있다면

   ```bash
   minikube service frontend
   ```

   이 외에는, 서비스가 사용중인 IP를 확인해보자!

   ```sh
   kubectl describe svc frontend
   ```

   ```none
   Name:                   frontend
   Namespace:              default
   Labels:                 service=frontend
   Selector:               service=frontend
   Type:                   LoadBalancer
   IP:                     10.0.0.183
   LoadBalancer Ingress:   192.0.2.89
   Port:                   80      80/TCP
   NodePort:               80      31144/TCP
   Endpoints:              172.17.0.4:80
   Session Affinity:       None
   No events.
   ```

   클라우드 환경을 사용하고 있다면, IP는 `LoadBalancer Ingress` 옆에 나열되어 있을 것이다.

   ```sh
   curl http://192.0.2.89
   ```

<!-- discussion -->

## 사용자 가이드

- CLI
  - [`kompose convert`](#kompose-convert)
- 문서
  - [다른 형식으로의 변환](#다른-형식으로의-변환)
  - [레이블](#레이블)
  - [재시작](#재시작)
  - [도커 컴포즈 버전](#도커-컴포즈-버전)

Kompose는 오픈시프트와 쿠버네티스 두 제공자를 지원한다.
`--provider` 글로벌 옵션을 통해 대상 제공자를 선택할 수 있다. 만약 제공자가 명시되지 않았다면, 쿠버네티스가 기본값으로 설정된다.

## `kompose convert`

Kompose는 도커 컴포즈 V1, V2, 그리고 V3 파일에 대한 쿠버네티스와 오픈시프트 오브젝트로의 변환을 지원한다.

### 쿠버네티스 `kompose convert` 예제

```shell
kompose --file docker-voting.yml convert
```

```none
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
INFO Kubernetes file "worker-svc.yaml" created
INFO Kubernetes file "db-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "result-svc.yaml" created
INFO Kubernetes file "vote-svc.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "result-deployment.yaml" created
INFO Kubernetes file "vote-deployment.yaml" created
INFO Kubernetes file "worker-deployment.yaml" created
INFO Kubernetes file "db-deployment.yaml" created
```

```shell
ls
```

```none
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-voting.yml          redis-svc.yaml     result-svc.yaml        vote-svc.yaml           worker-svc.yaml
```

동시에 여러 도커 컴포즈 파일들을 명시할 수도 있다

```shell
kompose -f docker-compose.yml -f docker-guestbook.yml convert
```

```none
INFO Kubernetes file "frontend-service.yaml" created         
INFO Kubernetes file "mlbparks-service.yaml" created         
INFO Kubernetes file "mongodb-service.yaml" created          
INFO Kubernetes file "redis-master-service.yaml" created     
INFO Kubernetes file "redis-slave-service.yaml" created      
INFO Kubernetes file "frontend-deployment.yaml" created      
INFO Kubernetes file "mlbparks-deployment.yaml" created      
INFO Kubernetes file "mongodb-deployment.yaml" created       
INFO Kubernetes file "mongodb-claim0-persistentvolumeclaim.yaml" created
INFO Kubernetes file "redis-master-deployment.yaml" created  
INFO Kubernetes file "redis-slave-deployment.yaml" created   
```

```shell
ls
```

```none
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml  
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

만약 여러 도커 컴포즈 파일들이 명시되면 설정들은 병합된다. 공통적인 설정들은 그 다음 파일의 내용으로 덮어씌워진다.

### 오픈시프트 `kompose convert` 예제

```sh
kompose --provider openshift --file docker-voting.yml convert
```

```none
WARN [worker] Service cannot be created because of missing port.
INFO OpenShift file "vote-service.yaml" created             
INFO OpenShift file "db-service.yaml" created               
INFO OpenShift file "redis-service.yaml" created            
INFO OpenShift file "result-service.yaml" created           
INFO OpenShift file "vote-deploymentconfig.yaml" created    
INFO OpenShift file "vote-imagestream.yaml" created         
INFO OpenShift file "worker-deploymentconfig.yaml" created  
INFO OpenShift file "worker-imagestream.yaml" created       
INFO OpenShift file "db-deploymentconfig.yaml" created      
INFO OpenShift file "db-imagestream.yaml" created           
INFO OpenShift file "redis-deploymentconfig.yaml" created   
INFO OpenShift file "redis-imagestream.yaml" created        
INFO OpenShift file "result-deploymentconfig.yaml" created  
INFO OpenShift file "result-imagestream.yaml" created  
```

서비스 내 빌드 명령에 대한 빌드컨피그(buildconfig) 생성도 지원한다. 기본적으로, 현재 깃 브랜치에 대한 리모트 저장소를 소스 저장소로 사용한다. 그리고 현재 브랜치를 빌드를 위한 소스 브랜치로 사용한다. ``--build-repo``와 ``--build-branch`` 옵션으로 다른 소스 저장소와 브랜치를 각각 지정할 수 있다.

```sh
kompose --provider openshift --file buildconfig/docker-compose.yml convert
```

```none
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created     
INFO OpenShift file "foo-imagestream.yaml" created          
INFO OpenShift file "foo-buildconfig.yaml" created
```

{{< note >}}
만약 ``oc create -f``로 오픈시프트 아티팩트들을 수동으로 푸쉬한다면, 이미지스트림 아티팩트를 빌드컨피그 아티팩트 이전에 푸쉬해야 한다. 해당 오픈시프트 이슈에 대한 해결방안은 https://github.com/openshift/origin/issues/4518를 참고한다.
{{< /note >}}

## 다른 형식으로의 변환

`kompose`의 기본 변환은 쿠버네티스 [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)와 [서비스](/ko/docs/concepts/services-networking/service/)를 yaml 형식으로 생성하는 것이다. 또 다른 방법으로는 `-j` 옵션으로 json을 생성할 수도 있다. 또한, [레플리케이션 컨트롤러](/ko/docs/concepts/workloads/controllers/replicationcontroller/) 오브젝트와, [데몬셋](/ko/docs/concepts/workloads/controllers/daemonset/), [Helm](https://github.com/helm/helm) 차트를 생성할 수도 있다.

```sh
kompose convert -j
INFO Kubernetes file "redis-svc.json" created
INFO Kubernetes file "web-svc.json" created
INFO Kubernetes file "redis-deployment.json" created
INFO Kubernetes file "web-deployment.json" created
```

`*-deployment.json` 파일은 디플로이먼트 오브젝트들을 담고 있다.

```sh
kompose convert --replication-controller
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

`*-replicationcontroller.yaml` 파일들은 레플리케이션 컨트롤러 오브젝트들을 담고 있다. 만약 레플리카를 명시하고 싶다면, `--replicas` 플래그를 사용한다. `kompose convert --replication-controller --replicas 3`.

```shell
kompose convert --daemon-set
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-daemonset.yaml" created
INFO Kubernetes file "web-daemonset.yaml" created
```

`*-daemonset.yaml` 파일들은 데몬셋 오브젝트를 담고 있다.

만약 [헬름](https://github.com/kubernetes/helm)을 통해 차트를 생성하고 싶다면, 아래 명령을 실행한다.

```shell
kompose convert -c
```

```none
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
chart created in "./docker-compose/"
```

```shell
tree docker-compose/
```

```none
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

차트 구조는 헬름 차트를 만들기 위한 골격을 제공한다.

## 레이블

`kompose`는 서비스의 행동을 변환 시에 명시적으로 정의하기 위해 Kompose에 특화된 레이블들을 `docker-compose.yml` 파일에서 지원한다.

- `kompose.service.type`는 서비스의 종류를 정의한다.

  예를 들어

  ```yaml
  version: "2"
  services:
    nginx:
      image: nginx
      dockerfile: foobar
      build: ./foobar
      cap_add:
        - ALL
      container_name: foobar
      labels:
        kompose.service.type: nodeport
  ```

- `kompose.service.expose`는 서비스가 클러스터 외부에서 접근 가능한지를 정의한다. 값이 "true"로 설정되어 있다면, 제공자는 자동으로 엔드포인트를 설정한다. 이외의 값의 경우에는, 호스트네임으로 값이 설정된다. 서비스에 여러 포드들이 정의되어 있다면, 첫번째 포트가 선택되어 노출된다.
  - 쿠버네티스 제공자는, 인그레스 컨트롤러가 이미 설정되었다고 가정한 상태에서 인그레스 리소스가 생성된다.
  - 오픈시프트 제공자는 라우트를 생성한다.

  예를 들어:

  ```yaml
  version: "2"
  services:
    web:
      image: tuna/docker-counter23
      ports:
      - "5000:5000"
      links:
      - redis
      labels:
        kompose.service.expose: "counter.example.com"
    redis:
      image: redis:3.0
      ports:
      - "6379"
  ```

현재 지원하는 옵션들은 다음과 같다.

| Key                  | Value                               |
|----------------------|-------------------------------------|
| kompose.service.type | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |

{{< note >}}
`kompose.service.type` 레이블은 `ports` 만을 정의해야 한다. 이 외의 경우에는 `kompose`가 실패한다.
{{< /note >}}

## 재시작

만약 컨트롤러 없이 일반 파드들을 생성하고 싶다면, 도커 컴포즈에 `restart`를 명시하여 이를 정의한다. `restart` 값을 설정하였을 때 어떤 일이 일어나는지는 아래 표를 확인한다.

| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |

{{< note >}}
컨트롤러 오브젝트는 `deployment`이나 `replicationcontroller`가 될 수 있다.
{{< /note >}}

예를 들어, `pival` 서비스는 아래 파드가 될 것이다. 이 컨테이너의 계산된 값은 `pi`이다.

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

### 디플로이먼트 설정에 관한 주의사항

만약 도커 컴포즈 파일에 서비스를 위한 볼륨이 명시되어 있다면, 디플로이먼트(쿠버네티스)나 디플로이먼트컨피그(오픈시프트) 전략은 "롤링 업데이트"(기본값)이 아닌 "재생성"으로 변경된다. 이것은 서비스의 여러 인스턴스들이 동시에 같은 볼륨에 접근하는 것을 막기 위함이다.

만약 도커 컴포즈 파일의 서비스 이름에 `_`이 포함되어 있다면 (예를 들어, `web_service`와 같은), `-`으로 대체되고 서비스의 이름 또한 마찬가지로 변경될 것이다 (예를 들어, `web-service`로). 이는 쿠버네티스가 오브젝트 이름에 `_`를 허용하지 않기 때문이다.

서비스 이름을 변경할 경우 `docker-compose` 파일의 일부가 작동하지 않을 수도 있다.

## 도커 컴포즈 버전

Kompose는 다음의 도커 컴포즈 버전을 지원한다. 1, 2, 그리고 3. 버전 2.1와 3.2는 실험적인 환경이기 때문에 제한적으로 지원한다.

호환하지 않는 도커 컴포즈 키 리스트를 포함한 3개의 버전들에 관한 모든 호환성 리스트는 [변환 문서](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md)에서 확인 할 수 있다.

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
card:
  name: tutorials
  weight: 10
---

{{% capture overview %}}

이 튜토리얼에서는 [Minikube](/ko/docs/setup/learning-environment/minikube)와 Katacoda를 이용하여
쿠버네티스에서 Node.js 로 작성된 간단한 Hello World 애플리케이션을 어떻게 실행하는지 살펴본다.
Katacode는 무료로 브라우저에서 쿠버네티스 환경을 제공한다.

{{< note >}}
[로컬에서 Minikube](/ko/docs/tasks/tools/install-minikube/)를 설치했다면 이 튜토리얼도 따라 할 수 있다.
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* hello world 애플리케이션을 Minikube에 배포한다.
* 배포한 애플리케이션을 실행한다.
* 애플리케이션의 로그를 확인한다.

{{% /capture %}}

{{% capture prerequisites %}}

이 튜토리얼에서 아래 파일들을 빌드한 컨테이너 이미지를 제공한다.

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

`docker build`명령에 대한 자세한 설명은 [Docker 문서](https://docs.docker.com/engine/reference/commandline/build/)를 읽어보자.

{{% /capture %}}

{{% capture lessoncontent %}}

## Minikubue 클러스터 만들기

1. **Launch Terminal** 을 클릭

    {{< kat-button >}}

    {{< note >}}Minikube를 로컬에 설치했다면 `minikube start`을 실행한다.{{< /note >}}

2. 브라우저에서 쿠버네티스 대시보드를 열어보자.

    ```shell
    minikube dashboard
    ```

3. Katacoda 환경에서는: 터미널 패널의 상단에서 플러스를 클릭하고, 이어서 **Select port to view on Host 1**를 클릭

4. Katacoda 환경에서는: 30000 을 입력하고 **Display Port**을 클릭.

## 디플로이먼트 만들기

쿠버네티스 [*파드*](/ko/docs/concepts/workloads/pods/pod/)는 관리와
네트워킹 목적으로 함께 묶여 있는 하나 이상의 컨테이너 그룹이다.
이 튜토리얼의 파드에는 단 하나의 컨테이너만 있다. 쿠버네티스
[*디플로이먼트*](/ko/docs/concepts/workloads/controllers/deployment/)는 파드의
헬스를 검사해서 파드의 컨테이너가 종료되었다면 재시작해준다.
파드의 생성 및 스케일링을 관리하는 방법으로 디플로이먼트를 권장한다.

1. `kubectl create` 명령어를 실행하여 파드를 관리할 디플로이먼트를 만든다. 이
파드는 제공된 Docker 이미지를 기반으로 한 컨테이너를 실행한다.

    ```shell
    kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
    ```

2. 디플로이먼트 보기

    ```shell
    kubectl get deployments
    ```

    다음과 유사하게 출력된다.

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. 파드 보기

    ```shell
    kubectl get pods
    ```
    다음과 유사하게 출력된다.

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. 클러스터 이벤트 보기

    ```shell
    kubectl get events
    ```

5. `kubectl` 환경설정 보기

    ```shell
    kubectl config view
    ```

    {{< note >}}`kubectl` 명령어에 관해 자세히 알기 원하면 [kubectl 개관](/docs/user-guide/kubectl-overview/)을 살펴보자.{{< /note >}}

## 서비스 만들기

기본적으로 파드는 쿠버네티스 클러스터 내부의 IP 주소로만
접근할 수 있다. `hello-node` 컨테이너를 쿠버네티스 가상 네트워크
외부에서 접근하려면 파드를 쿠버네티스
[*서비스*](/ko/docs/concepts/services-networking/service/)로 노출해야 한다.

1. `kubectl expose` 명령어로 퍼블릭 인터넷에 파드 노출하기

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer`플래그는 클러스터 밖의 서비스로 노출하기
    원한다는 뜻이다.

2. 방금 생성한 서비스 살펴보기

    ```shell
    kubectl get services
    ```

    다음과 유사하게 출력된다.

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    로드 밸런서를 지원하는 클라우드 공급자의 경우에는
    서비스에 접근할 수 있도록 외부 IP 주소가 프로비저닝 한다.
    Minikube에서 `LoadBalancer`타입은 `minikube service` 명령어를 통해서 해당 서비스를 접근할 수
    있게 한다.

3. 다음 명령어를 실행한다

    ```shell
    minikube service hello-node
    ```

4. Katacoda 환경에서만: 플러스를 클릭한 후에 **Select port to view on Host 1** 를 클릭.

5. Katacoda 환경에서만: 서비스 출력에서 `8080`의 반대편에 표시되는 5자리 포트 번호를 기록 한다. 이 포트 번호는 무작위로 생성되며, 사용자마다 다를 수 있다. 포트 번호 텍스트 상자에 포트 번호를 입력한 다음, 포트 표시를 클릭한다. 이전 예시를 사용해서 `30369` 를 입력한다.

    이렇게 하면 당신의 앱을 서비스하는 브라우저 윈도우를 띄우고 "Hello World" 메시지를 보여준다.

## 애드온 사용하기

Minikube에는 활성화하거나 비활성화 할 수 있고 로컬 쿠버네티스 환경에서 접속해 볼 수 있는 내장 {{< glossary_tooltip text="애드온" term_id="addons" >}} 셋이 있다.

1. 현재 지원하는 애드온 목록을 확인한다.

    ```shell
    minikube addons list
    ```

    다음과 유사하게 출력된다.

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. 한 애드온을 활성화 한다. 예를 들어 `metrics-server`

    ```shell
    minikube addons enable metrics-server
    ```

    다음과 유사하게 출력된다.

    ```
    metrics-server was successfully enabled
    ```

3. 방금 생성한 파드와 서비스를 확인한다.

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    다음과 유사하게 출력된다.

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. `metrics-server` 비활성화

    ```shell
    minikube addons disable metrics-server
    ```

    다음과 유사하게 출력된다.

    ```
    metrics-server was successfully disabled
    ```

## 제거하기

이제 클러스터에서 만들어진 리소스를 제거할 수 있다.

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

필요하면 Minikube 가상 머신(VM)을 정지한다.

```shell
minikube stop
```

필요하면 minikube VM을 삭제한다.

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* [디플로이먼트 오브젝트](/ko/docs/concepts/workloads/controllers/deployment/)에 대해서 더 배워 본다.
* [애플리케이션 배포](/docs/tasks/run-application/run-stateless-application-deployment/)에 대해서 더 배워 본다.
* [서비스 오브젝트](/ko/docs/concepts/services-networking/service/)에 대해서 더 배워 본다.

{{% /capture %}}
---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

이 튜토리얼에서는 Minikube를 이용하여 쿠버네티스에서 샘플 애플리케이션을 어떻게 실행하는지 살펴본다.
이 튜토리얼은 NGINX를 통해 모든 요청을 그대로 되돌려 주는 (echo back) 컨테이너 이미지를 제공한다.

## {{% heading "objectives" %}}

* 샘플 애플리케이션을 minikube에 배포한다.
* 배포한 애플리케이션을 실행한다.
* 애플리케이션의 로그를 확인한다.

## {{% heading "prerequisites" %}}


이 튜토리얼은 이미 `minikube`가 이미 구축되어 있다고 가정한다.
설치 방법은 [minikube 시작](https://minikube.sigs.k8s.io/docs/start/)의 __Step 1, Installation__ 을 참고한다.
{{< note >}}
**Step 1, Installation**의 지침만 실행한다. 나머지 내용은 이 페이지에서 다룬다.
{{< /note >}}

또한, `kubectl` 을 설치해야 한다.
설치 방법은 [도구 설치](/ko/docs/tasks/tools/)를 참고한다.


<!-- lessoncontent -->

## minikube 클러스터 만들기

```shell
minikube start
```

## 대시보드 접속하기

쿠버네티스 대시보드를 여는 방법은 두 가지 방법이 있다.

{{< tabs name="dashboard" >}}
{{% tab name="브라우저 구동" %}}
**새** 터미널을 열고 다음 명령어를 실행한다.
```shell
# 새 터미널에서 시작하고, 해당 터미널은 실행 상태로 두어야 함.
minikube dashboard
```

이제 `minikube start`를 실행했던 터미널로 다시 전환한다.

{{< note >}}
`dashboard` 명령어는 대시보드 애드온을 활성화하고 기본 웹 브라우저에서 프록시를 연다.
대시보드에서 디플로이먼트(Deployment), 서비스와 같은 쿠버네티스 리소스를 생성할 수 있다.

브라우저를 터미널에서 직접 호출하지 않고 웹 대시보드에 접속하기 위한 URL을 얻는 방법을 알아보려면, "URL 복사 및 붙여넣기" 탭을 참고한다.

기본적으로 대시보드는 쿠버네티스 내부 가상 네트워크 내에서만 접근할 수 있다.
`dashboard` 명령어는 대시보드가 쿠버네티스 가상 네트워크 외부에서 접근할 수 있도록 임시 프록시를 생성한다.

프록시를 중지하려면 `Ctrl+C`를 실행하여 프로세스를 종료한다.
명령이 종료된 후에도 대시보드는 쿠버네티스 클러스터에서 계속 실행된다.
대시보드에 접근하기 위한 또 다른 프록시를 생성하려면 `dashboard` 명령어를 다시 실행하면 된다.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL 복사 및 붙여넣기" %}}

minikube가 자동으로 웹 브라우저를 열지 않게 하려면, `dashboard` 서브커맨드를 
`--url` 플래그와 함께 실행한다. `minikube`는 사용자가 선호하는 브라우저를 사용할 수 있도록 URL을 출력한다.

**새** 터미널을 열고 다음 명령어를 실행한다.
```Shell
# 새 터미널에서 시작하고, 해당 터미널은 실행 상태로 두어야 함.
minikube dashboard --url
```

이제 이 URL을 사용하여 `minikube start`를 실행했던 터미널로 다시 전환할 수 있다.

{{% /tab %}}
{{< /tabs >}}

## 디플로이먼트 만들기

쿠버네티스 [*파드*](/ko/docs/concepts/workloads/pods/)는 관리와
네트워킹 목적으로 함께 묶여 있는 하나 이상의 컨테이너 그룹이다.
이 튜토리얼의 파드에는 단 하나의 컨테이너만 있다. 쿠버네티스
[*디플로이먼트*](/ko/docs/concepts/workloads/controllers/deployment/)는 파드의
상태를 확인하고, 파드의 컨테이너가 종료되었다면 재시작한다.
파드의 생성 및 스케일링을 관리하는 방법으로 디플로이먼트를 권장한다.

1. `kubectl create` 명령어를 실행하여 파드를 관리할 디플로이먼트를 만든다. 이
파드는 제공된 Docker 이미지를 기반으로 한 컨테이너를 실행한다.

    ```shell
    # 테스트용 웹 서버 컨테이너 이미지를 실행한다.
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
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

    (파드가 준비되는 데 시간이 걸릴 수 있다. "0/1"이 표시되면 몇 초 후에 다시 시도해본다.)

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

6. 파드 내 컨테이너의 애플리케이션 로그를 확인한다. (파드 이름을 `kubectl get pods` 명령어로 얻은 이름으로 교체한다)

    {{< note >}}    
    아래 `kubectl logs` 명령어에서 `hello-node-5f76cf6ccf-br9b5` 부분을 `kubectl get pods` 명령어 출력에서 얻은 파드 이름으로 교체한다.
    {{< /note >}}

    ```shell
    kubectl logs hello-node-5f76cf6ccf-br9b5
    ```

    출력은 다음과 유사하다.
    
    ```
    I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
    I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
    ```


{{< note >}}
`kubectl` 명령어에 관해 자세히 알고 싶다면 [kubectl 개요](/ko/docs/reference/kubectl/)을 살펴본다.
{{< /note >}}

## 서비스 만들기

기본적으로 파드는 쿠버네티스 클러스터 내부의 IP 주소로만
접근할 수 있다. `hello-node` 컨테이너를 쿠버네티스 가상 네트워크
외부에서 접근하려면 파드를 쿠버네티스
[*서비스*](/ko/docs/concepts/services-networking/service/)로 노출해야 한다.

{{< warning >}}
agnhost 컨테이너에는 디버깅에 유용한 `/shell` 엔드포인트가 있지만, 이는 
공용 인터넷에 노출하기에 위험하다. 이 컨테이너를 인터넷에 연결된 클러스터나 
프로덕션 클러스터에서 실행하지 않는다.
{{< /warning >}}

1. `kubectl expose` 명령어로 퍼블릭 인터넷에 파드 노출하기

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer`플래그는 클러스터 밖의 서비스로 노출하기
    원한다는 뜻이다.

    `registry.k8s.io/echoserver` 이미지 내의 애플리케이션 코드는 TCP 포트 8080에서만 수신한다. `kubectl expose`를
    사용하여 다른 포트를 노출한 경우, 클라이언트는 다른 포트에 연결할 수 없다.

2. 생성한 서비스 살펴보기

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
    minikube에서 `LoadBalancer`타입은 `minikube service` 명령어를 통해서 해당 서비스를 접근할 수
    있게 한다.

3. 다음 명령어를 실행한다

    ```shell
    minikube service hello-node
    ```

    이 명령은 브라우저 창을 열어 앱을 보여주고, 그 응답을 표시한다.

## 애드온 사용하기

minikube 툴은 활성화하거나 비활성화할 수 있고 로컬 쿠버네티스 환경에서 접속해 볼 수 있는 내장 {{< glossary_tooltip text="애드온" term_id="addons" >}} 셋이 포함되어 있다.

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

2. 애드온을 활성화 한다. 여기서는 `metrics-server`를 예시로 사용한다.

    ```shell
    minikube addons enable metrics-server
    ```

    다음과 유사하게 출력된다.

    ```
    The 'metrics-server' addon is enabled
    ```

3. 생성한 파드와 서비스를 확인한다.

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

4. `metrics-server`의 출력 결과를 확인한다.

    ```shell
    kubectl top pods
    ```

    다음과 유사하게 출력된다.

    ```
    NAME                         CPU(cores)   MEMORY(bytes)   
    hello-node-ccf4b9788-4jn97   1m           6Mi             
    ```

    만약 다음의 메시지가 보인다면, 잠시 기다렸다가 다시 시도한다.

    ```
    error: Metrics API not available
    ```

5. `metrics-server`를 비활성화한다.

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

Minikube 클러스터를 종료한다.

```shell
minikube stop
```

필요하면 minikube VM을 삭제한다.

```shell
# 선택사항
minikube delete
```

쿠버네티스를 더 배우기 위해 minikube를 다시 사용할 계획이라면, 굳이 삭제하지 않아도 된다.

## 결론

이 페이지에서는 minikube 클러스터를 실행하고 애플리케이션을 배포하기 위한 기본적인 내용을 다루었다. 이제 애플리케이션을 배포할 준비가 되었다.

## {{% heading "whatsnext" %}}


* _[kubectl을 사용해 쿠버네티스에 첫 번째 애플리케이션 배포하기](/ko/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_ 에 대한 튜토리얼.
* [디플로이먼트 오브젝트](/ko/docs/concepts/workloads/controllers/deployment/)에 대해서 더 배워 본다.
* [애플리케이션 배포](/ko/docs/tasks/run-application/run-stateless-application-deployment/)에 대해서 더 배워 본다.
* [서비스 오브젝트](/ko/docs/concepts/services-networking/service)에 대해서 더 배워 본다.


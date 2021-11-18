---
title: NGINX 인그레스(Ingress) 컨트롤러로 Minikube에서 인그레스 설정하기
content_type: task
weight: 100
---

<!-- overview -->

[인그레스](/ko/docs/concepts/services-networking/ingress/)는 클러스터의 서비스에 대한 외부 액세스를 허용하는 규칙을 정의하는 
API 객체이다. [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)는 인그레스에 설정된 규칙을 이행한다.

이 페이지에서는 HTTP URI에 따라 요청을 Service web 또는 web2로 라우팅하는 간단한 인그레스를 설정하는 방법을 보여준다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Minikube 클러스터 생성하기

1. **터미널 실행**을 클릭한다.

    {{< kat-button >}}

1. (선택 사항) Minikube를 로컬로 설치한 경우 다음 명령을 실행한다.

    ```shell
    minikube start
    ```

## 인그레스 컨트롤러 활성화

1. NGINX 인그레스 컨트롤러를 활성화하기 위해 다음 명령을 실행한다.

    ```shell
    minikube addons enable ingress
    ```

1. NGINX 인그레스 컨트롤러가 실행 중인지 확인한다.


  {{< tabs name="tab_with_md" >}}
  {{% tab name="minikube v1.19 or later" %}}
```shell
kubectl get pods -n ingress-nginx
```
  {{< note >}}이 작업은 1분 정도 소요될 수 있다.{{< /note >}}

Output:

```
NAME                                        READY   STATUS      RESTARTS    AGE
ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
```
    {{% /tab %}}

  {{% tab name="minikube v1.18.1 or earlier" %}}
```shell
kubectl get pods -n kube-system
```
{{< note >}}이 작업은 1분 정도 소요될 수 있다.{{< /note >}}

Output:

```
NAME                                        READY     STATUS    RESTARTS   AGE
default-http-backend-59868b7dd6-xb8tq       1/1       Running   0          1m
kube-addon-manager-minikube                 1/1       Running   0          3m
kube-dns-6dcb57bcc8-n4xd4                   3/3       Running   0          2m
kubernetes-dashboard-5498ccf677-b8p5h       1/1       Running   0          2m
nginx-ingress-controller-5984b97644-rnkrg   1/1       Running   0          1m
storage-provisioner                         1/1       Running   0          2m
```
    {{% /tab %}}
      {{< /tabs >}}
  


    ```shell
    kubectl get pods -n ingress-nginx
    ```

    {{< note >}}이 작업은 1분 정도 소요될 수 있다.{{< /note >}}

    Output:

    ```shell
    NAME                                        READY   STATUS      RESTARTS   AGE
    ingress-nginx-admission-create-2tgrf        0/1     Completed   0          3m28s
    ingress-nginx-admission-patch-68b98         0/1     Completed   0          3m28s
    ingress-nginx-controller-59b45fb494-lzmw2   1/1     Running     0          3m28s
    ```


## hello, world 앱 배포하기

1. 다음 명령을 사용하여 디플로이먼트(Deployment)를 생성한다.

    ```shell
    kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
    ```

    Output:

    ```shell
    deployment.apps/web created
    ```

1. 디플로이먼트를 노출시킨다.

    ```shell
    kubectl expose deployment web --type=NodePort --port=8080
    ```

    Output:

    ```shell
    service/web exposed
    ```

1. 서비스(Service)가 생성되고 노드 포트에서 사용할 수 있는지 확인한다.

    ```shell
    kubectl get service web
    ```

    Output:

    ```shell
    NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
    web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
    ```

1. 노드포트(NodePort)를 통해 서비스에 접속한다.

    ```shell
    minikube service web --url
    ```

    Output:

    ```shell
    http://172.17.0.15:31637
    ```

    {{< note >}}Katacoda 환경만 해당: 터미널 패널 상단에서 더하기 기호를 클릭한 다음 **Select port to view on Host 1**을 클릭한다. 노드포트(이 경우 '31637')를 입력한 다음 **Display Port**를 클릭한다.{{< /note >}}

    Output:

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

    이제 Minikube IP 주소와 노드포트를 통해 샘플 앱에 액세스할 수 있다. 다음 단계에서는 
    인그레스 리소스를 사용하여 앱에 액세스할 수 있다.

## 인그레스 리소스 생성하기

다음 파일은 hello-world.info를 통해 서비스로 트래픽을 보내는 인그레스 리소스다.

1. 다음 파일을 통해 `example-ingress.yaml`을 만든다.

  {{< codenew file="service/networking/example-ingress.yaml" >}}

1. 다음 명령어를 실행하여 인그레스 리소스를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
    ```

    Output:

    ```shell
    ingress.networking.k8s.io/example-ingress created
    ```

1. IP 주소가 설정되었는지 확인한다.

    ```shell
    kubectl get ingress
    ```

    {{< note >}}이 작업은 몇 분 정도 소요될 수 있다.{{< /note >}}

    ```shell
    NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
    example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
    ```

1. `/etc/hosts` 파일의 맨 아래에 다음 행을 추가한다.

    {{< note >}}Minikube를 로컬에서 실행하는 경우 'minikube ip'를 사용하여 외부 IP를 가져온다. 인그레스 목록에 표시되는 IP 주소는 내부 IP가 된다.{{< /note >}}

    ```
    172.17.0.15 hello-world.info
    ```

    이것은 hello-world.info에서 Minikube로 요청을 보낸다.

1. 인그레스 컨트롤러가 트래픽을 전달하는지 확인한다.

    ```shell
    curl hello-world.info
    ```

    Output:

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

    {{< note >}}Minikube를 로컬에서 실행하는 경우 브라우저에서 hello-world.info에 접속할 수 있다.{{< /note >}}

## 두 번째 디플로이먼트 생성하기

1. 다음 명령을 사용하여 v2 디플로이먼트를 생성한다.

    ```shell
    kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
    ```
    Output:

    ```shell
    deployment.apps/web2 created
    ```

1. 디플로이먼트를 노출시킨다.

    ```shell
    kubectl expose deployment web2 --port=8080 --type=NodePort
    ```

    Output:

    ```shell
    service/web2 exposed
    ```

## 인그레스 수정하기

1. 기존 `example-ingress.yaml`을 편집하여 다음 줄을 추가한다.

    ```yaml
          - path: /v2
            pathType: Prefix
            backend:
              service:
                name: web2
                port:
                  number: 8080
    ```

1. 변경 사항을 적용한다.

    ```shell
    kubectl apply -f example-ingress.yaml
    ```

    Output:

    ```shell
    ingress.networking/example-ingress configured
    ```

## 인그레스 테스트하기

1. Hello World 앱의 첫 번째 버전에 액세스한다.

    ```shell
    curl hello-world.info
    ```

    Output:

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

1. Hello World 앱의 두 번째 버전에 액세스한다.

    ```shell
    curl hello-world.info/v2
    ```

    Output:

    ```shell
    Hello, world!
    Version: 2.0.0
    Hostname: web2-75cd47646f-t8cjk
    ```

    {{< note >}}Minikube를 로컬에서 실행하는 경우 브라우저에서 hello-world.info 및 hello-world.info/v2에 접속할 수 있다.{{< /note >}}




## {{% heading "whatsnext" %}}

* [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대해 더 보기.
* [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)에 대해 더 보기.
* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 더 보기.




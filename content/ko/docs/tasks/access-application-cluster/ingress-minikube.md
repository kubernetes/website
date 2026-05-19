---
title: NGINX 인그레스(Ingress) 컨트롤러로 Minikube에서 인그레스 설정하기
content_type: task
weight: 100
min-kubernetes-server-version: 1.19
---

<!-- overview -->

[인그레스](/ko/docs/concepts/services-networking/ingress/)는 클러스터의 서비스에 대한 외부 액세스를 허용하는 규칙을 정의하는 
API 객체이다. 
[인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)는
인그레스에 설정된 규칙을 이행한다.

이 페이지에서는 HTTP URI에 따라 요청을 Service 'web' 또는 'web2' 로 라우팅하는
간단한 인그레스를 설정하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

이 튜토리얼에서는 로컬 Kubernetes 클러스터를 실행하기 위해 `minikube`를 사용한다고 가정한다.
`minikube` 설치 방법은 [도구 설치](/ko/docs/tasks/tools/#minikube) 문서를 참고하자.

{{< note >}}
이 튜토리얼에서는 AMD64 아키텍처를 필요로 하는 컨테이너를 사용한다.
다른 CPU 아키텍처를 사용하는 컴퓨터에서 minikube를 실행하는 경우,
AMD64 아키텍처를 에뮬레이션할 수 있는 드라이버를 사용하는 방법을 고려할 수 있다.
예를 들어, Docker Desktop 드라이버가 이를 지원한다.
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
만약 이보다 더 이전 버전의 쿠버네티스를 사용하고 있다면, 해당 쿠버네티스 버전의 문서를 참고한다.

### Minikube 클러스터 생성하기

아직 클러스터를 로컬에 생성하지 않았다면,
  `minikube start`를 실행하여 클러스터를 생성한다.

<!-- steps -->

## 인그레스 컨트롤러 활성화

1. NGINX 인그레스 컨트롤러를 활성화하기 위해 다음 명령을 실행한다.

    ```shell
    minikube addons enable ingress
    ```

1. NGINX 인그레스 컨트롤러가 실행 중인지 확인한다.

   ```shell
    kubectl get pods -n ingress-nginx
   ```

   {{< note >}} 
   파드가 정상적으로 실행되기까지 1분 정도 소요될 수 있다.
   {{< /note >}}

   결과는 다음과 같다.

   ```
    NAME                                        READY   STATUS      RESTARTS    AGE
    ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
    ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
    ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
   ```

## hello, world 앱 배포하기

1. 다음 명령을 사용하여 디플로이먼트(Deployment)를 생성한다.

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   결과는 다음과 같다.

   ```
   deployment.apps/web created
   ```

    디플로이먼트가 준비(Ready) 상태인지 확인한다.

    ```shell
   kubectl get deployment web 
   ```  

   결과는 다음과 같다.

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web    1/1     1            1           53s
   ``` 



1. 디플로이먼트를 노출시킨다.

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   결과는 다음과 같다.

   ```
   service/web exposed
   ```

1. 서비스(Service)가 생성되고 노드 포트에서 사용할 수 있는지 확인한다.

   ```shell
   kubectl get service web
   ```

   결과는 다음과 같다.

   ```
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

1. [`minikube service`](https://minikube.sigs.k8s.io/docs/handbook/accessing/#using-minikube-service-with-tunnel) 를 사용하여 노드포트(NodePort)를 통해 서비스에 접속한다. 사용 중인 플랫폼에 해당하는 지침을 따라 진행한다. 

   {{< tabs name="minikube_service" >}}
   {{% tab name="Linux" %}}

   ```shell
   minikube service web --url
   ```
   결과는 다음과 같다.
   ```
   http://172.17.0.15:31637
   ```
   이전 단계의 출력에서 얻은 URL을 호출한다.
   ```shell
   curl http://172.17.0.15:31637 
   ```
   {{% /tab %}}
   {{% tab name="MacOS" %}}
   ```shell
   # 별도의 터미널에서 명령어를 실행한다.
   minikube service web --url 
   ```
   결과는 다음과 같다.
   ```none
   http://127.0.0.1:62445
   ! Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
   ```
   다른 터미널에서, 이전 단계 출력에서 얻은 URL을 호출한다.
   ```shell
   curl http://127.0.0.1:62445 
   ```
   {{% /tab %}}
   {{< /tabs >}} 
   <br>
   결과는 다음과 같다.

   ```
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   이제 Minikube IP 주소와 노드포트를 통해 샘플 앱에 액세스할 수 있다. 다음 단계에서는 
   인그레스 리소스를 사용하여 앱에 액세스할 수 있다.

## 인그레스 생성하기

다음 매니페스트는 `hello-world.example`를 통해 
서비스로 트래픽을 보내는 인그레스를 정의한다.

1. 다음 파일을 통해 `example-ingress.yaml`을 만든다.

   {{% code_sample file="service/networking/example-ingress.yaml" %}}

1. 다음 명령어를 실행하여 인그레스 오브젝트를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   결과는 다음과 같다.

   ```
   ingress.networking.k8s.io/example-ingress created
   ```

1. IP 주소가 설정되었는지 확인한다.

   ```shell
   kubectl get ingress
   ```

   {{< note >}}
   이 작업은 몇 분 정도 소요될 수 있다.
   {{< /note >}}

   다음 예시와 같이, ADDRESS 열에서 IPv4 주소를 확인할 수 있다.

   ```
   NAME              CLASS    HOSTS                 ADDRESS        PORTS   AGE
   example-ingress   <none>   hello-world.example   172.17.0.15    80      38s
   ```


1. Ingress 컨트롤러가 트래픽을 제대로 라우팅하는지 확인한다. 사용 중인 플랫폼에 맞는 지침을 따른다.

  {{< note >}}
  MacOS(Darwin)에서 Docker 드라이버를 사용하는 경우, 네트워크가 제한되어 Node IP에 직접 접근할 수 없다. 인그레스를 동작시키려면 새 터미널을 열고 `minikube tunnel`을 실행해야 한다.
  이 과정에서는 `sudo` 권한이 필요하므로, 요청이 나오면 비밀번호를 입력한다.
  {{< /note >}}
  

  {{< tabs name="ingress" >}}
  {{% tab name="Linux" %}}
  
  ```shell
  curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
  ```
  {{% /tab %}}
  {{% tab name="MacOS" %}}

  ```shell
  minikube tunnel
  ```
  결과는 다음과 같다.

  ```none
  Tunnel successfully started
  
  NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...
  
  The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
  sudo permission will be asked for it.
  Starting tunnel for service example-ingress.
  ```

  새 터미널을 열고 다음 명령어를 실행한다.
  ```shell
  curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
  ```

  {{% /tab %}}
  {{< /tabs >}} 
  <br>
  결과는 다음과 같다.

  ```none
  Hello, world!
  Version: 1.0.0
  Hostname: web-55b8c6998d-8k564
  ```

1. 원한다면 브라우저에서 `hello-world.example` 에 접속할 수도 있다. 
   
   호스트 컴퓨터의 `/etc/hosts` 파일 맨 아래에 
   다음 행을 추가한다 (관리자 권한 필요).

     {{< tabs name="hosts" >}}
     {{% tab name="Linux" %}} 
   minikube 에서 알려준 external IP 주소를 확인한다.
   ```none
     minikube ip 
   ``` 
   <br>
   
   ```none
     172.17.0.15 hello-world.example
   ```

   {{< note >}}
   IP 주소를 `minikube ip` 출력 값에 맞게 바꾼다.
   {{< /note >}}
   {{% /tab %}}
     {{% tab name="MacOS" %}}
   ```none
   127.0.0.1 hello-world.example
   ```
     {{% /tab %}}
     {{< /tabs >}}

     <br>

    이렇게 하면, 웹 브라우저가
   `hello-world.example` URL에 대한 요청을 Minikube로 보낸다.

## 두 번째 디플로이먼트 생성하기

1. 다음 명령을 사용하여 두 번째 디플로이먼트를 생성한다.

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```
   
   결과는 다음과 같다.

   ```
   deployment.apps/web2 created
   ```
   디플로이먼트가 준비(Ready) 상태인지 확인한다.

   ```shell
   kubectl get deployment web2 
   ```  

   결과는 다음과 같다.

   ```none
   NAME   READY   UP-TO-DATE   AVAILABLE   AGE
   web2    1/1     1            1           53s
   ```

1. 두 번째 디플로이먼트를 노출시킨다.

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   결과는 다음과 같다.

   ```
   service/web2 exposed
   ```

## 기존 인그레스 수정하기 {#edit-ingress}

1. 기존 `example-ingress.yaml` 매니페스트를 편집하고, 
하단에 다음 줄을 추가한다.

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

   결과는 다음과 같다.

   ```
   ingress.networking/example-ingress configured
   ```

## 인그레스 테스트하기

1. Hello World 앱의 첫 번째 버전에 액세스한다.

   {{< tabs name="ingress2-v1" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example
   ```
   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```
   결과는 다음과 같다.

   ```none
   Tunnel successfully started

   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   새로운 터미널을 열고, 아래 명령을 입력한다.
   ```shell
   curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example
   ```

   {{% /tab %}}
   {{< /tabs >}}
   <br>

   결과는 다음과 같다.

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

1. Hello World 앱의 두 번째 버전에 액세스한다.

   {{< tabs name="ingress2-v2" >}}
   {{% tab name="Linux" %}}

   ```shell
   curl --resolve "hello-world.example:80:$( minikube ip )" -i http://hello-world.example/v2
   ```
   {{% /tab %}}
   {{% tab name="MacOS" %}}

   ```shell
   minikube tunnel
   ```
   결과는 다음과 같다.

   ```none
   Tunnel successfully started

   NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

   The service/ingress example-ingress requires privileged ports to be exposed: [80 443]
   sudo permission will be asked for it.
   Starting tunnel for service example-ingress.
   ```

   새로운 터미널을 열고, 아래 명령을 입력한다.
   ```shell
   curl --resolve "hello-world.example:80:127.0.0.1" -i http://hello-world.example/v2
   ```

   {{% /tab %}}
   {{< /tabs >}}

   결과는 다음과 같다.

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   {{< note >}}
   옵션으로 `/etc/hosts`를 수정했다면, 브라우저에서 `hello-world.example` 과 
   `hello-world.example/v2` 에도 접속할 수 있다.
   {{< /note >}}

## {{% heading "whatsnext" %}}

* [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대해 더 보기.
* [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/)에 대해 더 보기.
* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 더 보기.


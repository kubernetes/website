---
title: 서비스를 사용하여 프론트엔드를 백엔드에 연결
content_type: tutorial
weight: 70
---

<!-- overview -->

이 작업은 프론트엔드와 마이크로서비스 백엔드를 어떻게 생성하는지를
설명한다. 백엔드 마이크로서비스는 인사하기(hello greeter)이다.
프론트엔드와 백엔드는 쿠버네티스 {{< glossary_tooltip term_id="service" text="서비스" >}}
오브젝트를 이용해 연결되어 있다.

## {{% heading "objectives" %}}

* {{< glossary_tooltip term_id="deployment" text="디플로이먼트(Deployment)" >}} 오브젝트를 사용해 마이크로서비스를 생성하고 실행한다.
* 프론트엔드를 사용하여 백엔드로 트래픽을 전달한다.
* 프론트엔드 애플리케이션을 백엔드 애플리케이션에 연결하기 위해
  서비스 오브젝트를 사용한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

이 작업은
지원되는 환경이 필요한
[외부 로드밸런서가 있는 서비스](/docs/tasks/access-application-cluster/create-external-load-balancer/)를 사용한다. 만약, 이를 지원하지 않는 환경이라면, [노드포트](/ko/docs/concepts/services-networking/service/#nodeport) 서비스 타입을
대신 사용할 수 있다.

<!-- lessoncontent -->

## 디플로이먼트를 사용해 백엔드 생성하기

백엔드는 인사하기라는 간단한 마이크로서비스이다. 여기에 백엔드 디플로이먼트
구성 파일이 있다.

{{< codenew file="service/access/hello.yaml" >}}

백엔드 디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello.yaml
```

백엔드 디플로이먼트에 관한 정보를 본다.

```shell
kubectl describe deployment hello
```

결과는 아래와 같다.

```
Name:                           hello
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       7 desired | 7 updated | 7 total | 7 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (7/7 replicas created)
Events:
...
```

## 백엔드 서비스 오브젝트 생성하기

프론트엔드와 백엔드를 연결하는 방법은 백엔드
서비스이다. 서비스는 백엔드 마이크로서비스에 언제든 도달하기 위해
변하지 않는 IP 주소와 DNS 이름 항목을 생성한다. 서비스는
트래픽을 보내는 파드를 찾기 위해
{{< glossary_tooltip text="selectors" term_id="selector" text="셀렉터" >}}를 사용한다.

먼저, 서비스 구성 파일을 살펴보자.

{{< codenew file="service/access/hello-service.yaml" >}}

구성 파일에서 서비스가 `app: hello` 과 `tier: backend` 레이블을 갖는
파드에 트래픽을 보내는 것을 볼 수 있다.

`hello` 서비스를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello-service.yaml
```

이 시점에서, 백엔드 디플로이먼트는 Running 중이며, 해당 백엔드로
트래픽을 보내는 서비스를 갖고 있다.

## 프론트엔드 생성하기

이제 백엔드가 있기 때문에 백엔드와 연결하는 프론트엔드를 생성할 수 있다.
프론트엔드는 백엔드 서비스에서 제공된 DNS 이름을 사용해 백엔드 워커
파드에 연결할 수 있다. DNS 이름은 "hello" 이고, 앞선
서비스 구성 파일의 `name` 항목의 값이다.

프론트엔드 디플로이먼트 안에 파드는 hello 백엔드 서비스를 찾도록
구성된 nginx 이미지를 실행한다. 여기에 nginx 구성 파일이 있다.

{{< codenew file="service/access/frontend.conf" >}}

백엔드와 같이, 프론트엔드는 디플로이먼트와 서비스를 갖고 있다.
서비스의 구성은 `type: LoadBalancer` 이며, 이는 서비스가
클라우드 공급자의 기본 로드 밸런서를 사용하는 것을 의미한다.

{{< codenew file="service/access/frontend.yaml" >}}

프론트엔드 디플로이먼트와 서비스를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend.yaml
```

결과는 두 리소스가 생성되었음을 확인한다.

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
nginx 구성은 [컨테이너 이미지](/examples/service/access/Dockerfile)에
반영 되었다. 이를 실행하는 더 좋은 방법은
구성을
보다 쉽게 변경할
수 있는 [컨피그맵(ConfigMap)](/docs/tasks/configure-pod-container/configure-pod-configmap/)을 사용하는 것이다.
{{< /note >}}

## 프론트엔드 서비스와 통신하기

일단 로드밸런서 타입의 서비스를 생성하면, 이 명령어를
사용해 외부 IP를 찾을 수 있다.

```shell
kubectl get service frontend --watch
```

`frontend` 서비스의 구성을 보여주고, 변경 사항을
주시한다. 처음에, 외부 IP는 `<pending>` 으로 나열된다.

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

하지만, 외부 IP가 생성되자마자 구성은
`EXTERNAL-IP` 제목 아래에 새로운 IP를 포함하여 갱신한다.

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

이제 해당 IP는 클러스터 외부에서 `frontend` 서비스와 통신하는데
사용된다.

## 프론트엔드 통해서 트래픽 보내기

이제 프론트엔드와 백엔드가 연결되었다. 프론트엔드 서비스의 외부 IP에서
curl 명령을 사용해 엔드포인트에 도달할 수 있다.

```shell
curl http://${EXTERNAL_IP} # 앞의 예에서 본 EXTERNAL-IP로 수정한다
```

결과로 백엔드에서 생성된 메시지가 보인다.

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

서비스를 삭제하기 위해, 아래 명령어를 입력하자.

```shell
kubectl delete services frontend hello
```

백엔드와 프론트엔드 애플리케이션에서 실행 중인 디플로이먼트, 레플리카셋, 파드를 삭제하기 위해, 아래 명령어를 입력하자.

```shell
kubectl delete deployment frontend hello
```

## {{% heading "whatsnext" %}}

* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 더 알아본다.
* [컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/)에 대해 더 알아본다.


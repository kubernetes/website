---
title: 클러스터 내 애플리케이션에 접근하기 위해 서비스 사용하기
content_type: tutorial
weight: 60
---

<!-- overview -->

이 문서는 외부 클라이언트가 클러스터에서 실행 중인 애플리케이션에 접근하기
위해 사용하는 쿠버네티스 서비스 오브젝트를 생성하는 방법을 설명한다. 서비스는
실행 중인 두 개의 인스턴스를 갖는 애플리케이션에 대한 로드 밸런싱을 제공한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- Hello World 애플리케이션 인스턴스 두 개를 실행한다.
- 노드 포트를 노출하는 서비스 오브젝트를 생성한다.
- 실행 중인 애플리케이션에 접근하기 위해 서비스 오브젝트를 사용한다.

<!-- lessoncontent -->

## 두 개의 파드에서 실행 중인 애플리케이션에 대한 서비스 생성하기

다음은 애플리케이션 디플로이먼트(Deployment) 설정 파일이다.

{{< codenew file="service/access/hello-application.yaml" >}}

1. 클러스터 내 Hello World 애플리케이션을 실행하자.
   위 파일을 사용하여 애플리케이션 디플로이먼트를 생성하자.

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```
   
   앞의 명령은
   {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}
   오브젝트와 연관된
   {{< glossary_tooltip term_id="replica-set" text="레플리카셋(ReplicaSet)" >}}
   오브젝트를 생성한다. 레플리카셋은 두 개의
   {{< glossary_tooltip text="파드" term_id="pod" >}}를 갖고,
   각각은 Hello World 애플리케이션을 실행한다.

1. 디플로이먼트에 대한 정보를 보여준다.

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. 레플리카셋 오브젝트에 대한 정보를 보여준다.

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. 디플로이먼트를 노출하는 서비스 오브젝트를 생성한다.

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. 서비스에 대한 정보를 보여준다.

   ```shell
   kubectl describe services example-service
   ```

   결과는 아래와 같다.

   ```shell
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   서비스의 노드포트(NodePort) 값을 메모하자. 예를 들어,
   앞선 결과에서, 노드포트 값은 31496이다.

1. Hello World 애플리케이션이 실행 중인 파드를 나열한다.

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   결과는 아래와 같다.

   ```shell
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. Hello World 파드가 실행 중인 노드들 중 하나의 노드에 대해 공용
   IP 주소를 얻자. 이 주소를 얻는 방법은 어떻게 클러스터를 설치했는지에
   따라 다르다. 예를 들어, Minikube를 사용하면, `kubectl cluster-info`를
   실행하여 노드 주소를 알 수 있다. Google Compute Engine 인스턴스를
   사용하면, `gcloud compute instances list` 명령어를
   사용하여 노드들의 공용 주소를 알 수
   있다.

1. 선택한 노드에서 노드 포트에 대해 TCP 통신을 허용하도록 방화벽 규칙을
   생성하자. 예를 들어, 서비스의 노드포트 값이 31568인 경우,
   31568 포트로 TCP 통신을 허용하도록 방화벽 규칙을 생성하자. 다른
   클라우드 공급자는 방화벽 규칙을 설정하는 다른 방법을 제공한다.

1. Hello World 애플리케이션 접근을 위해 노드 주소와 노드 포트를 사용하자.
   
   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   `<public-node-ip>`는 노드의 공용 IP 주소이고,
   `<node-port>`는 서비스의 노드포트 값이다.
   성공적인 요청에 대한 응답은 hello 메시지이다.

   ```shell
   Hello Kubernetes!
   ```

## 서비스 설정 파일 사용하기

`kubectl expose`를 사용하는 대신,
[서비스 설정 파일](/ko/docs/concepts/services-networking/service/)을 사용해
서비스를 생성할 수 있다.

## {{% heading "cleanup" %}}

서비스를 삭제하기 위해 다음 명령어를 입력하자.

    kubectl delete services example-service

디플로이먼트, 레플리카셋, Hello World 애플리케이션이 실행 중인 파드를
삭제하기 위해 다음 명령어를 입력하자.

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}}

튜토리얼
[서비스와 애플리케이션 연결하기](/ko/docs/tutorials/services/connect-applications-service/)
따라하기
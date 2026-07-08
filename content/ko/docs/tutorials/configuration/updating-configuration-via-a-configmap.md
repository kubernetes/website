---
title: 컨피그맵으로 구성 파일 업데이트하기
content_type: tutorial
weight: 20
---

<!-- overview -->
이 페이지는 컨피그맵을 활용하여 파드 구성을 업데이트하는 단계별 예제를 제공하며
[컨피그맵을 사용하도록 파드 구성](/docs/tasks/configure-pod-container/configure-pod-configmap/) 작업을 기반으로 한다.  
이 튜토리얼을 마치면 실행 중인 애플리케이션의 구성을 변경하는 방법을 이해하게 된다.
이 튜토리얼에서는 `alpine` 및 `nginx` 이미지를 예시로 사용한다.

## {{% heading "prerequisites" %}}
{{< include "task-tutorial-prereqs.md" >}}

터미널이나 명령 프롬프트에서 HTTP 요청을 하려면 
[curl](https://curl.se/) 명령줄 도구가 필요하다. `curl`이 설치되어 있지 않으면, 직접 설치할 수 있다. 로컬 운영 체제에 해당하는
문서를 확인한다.

## {{% heading "objectives" %}}
* 볼륨으로 마운트된 컨피그맵을 통해 구성 업데이트
* 컨피그맵을 통해 파드의 환경 변수 업데이트
* 다중 컨테이너 파드의 컨피그맵을 통해 구성 업데이트
* 사이드카 컨테이너를 포함하는 파드의 컨피그맵을 통해 구성 업데이트

<!-- lessoncontent -->

## 볼륨으로 마운트된 컨피그맵으로 구성 업데이트하기 {#rollout-configmap-volume}

`kubectl create configmap` 명령어를 사용하여 
[리터럴 값](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)으로 컨피그맵을 생성한다.

```shell
kubectl create configmap sport --from-literal=sport=football
```

아래는 컨피그맵 `sport`가 파드의 유일한 컨테이너에 
{{< glossary_tooltip text="볼륨" term_id="volume" >}}으로 마운트된 디플로이먼트(Deployment) 매니페스트의 예이다. 
{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}} 

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

이 디플로이먼트의 파드가 준비되었는지 확인한다
({{< glossary_tooltip text="셀렉터" term_id="selector" >}}와 일치).

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

다음과 유사한 출력을 확인할 수 있다.

```
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

이러한 파드 중 하나가 실행 중인 각 노드에서, kubelet은 컨피그맵에 대한 
데이터를 가져와 로컬 볼륨의 파일로 변환한다.
그런 다음 kubelet은 파드 템플릿에 지정한 볼륨을 컨테이너에 마운트한다.
해당 컨테이너에서 실행되는 코드는 파일에서 정보를 로드하고 
이를 사용하여 stdout으로 보고서를 출력한다.
해당 디플로이먼트에 있는 파드 중 하나의 로그를 확인하여 이 보고서를 확인할 수 있다.

```shell
# 배포에 속하는 하나의 파드를 선택하고, 해당 로그를 확인한다.
kubectl logs deployments/configmap-volume
```

다음과 유사한 출력을 확인할 수 있다.

```
Found 3 pods, using pod/configmap-volume-76d9c5678f-x5rgj
Thu Jan  4 14:06:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:06:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:06 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:16 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:26 UTC 2024 My preferred sport is football
```

컨피그맵을 수정한다.

```shell
kubectl edit configmap sport
```

편집기가 나타나면, 키 `sport`의 값을 `football`에서 `cricket`으로 변경한다. 변경 사항을 저장한다.
kubectl 도구가 컨피그맵을 적절히 업데이트한다(오류가 발생하면 다시 시도한다). 

다음은 매니페스트를 편집한 후 어떻게 표시되는지 보여주는 예이다.

```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# 기존 메타데이터는 그대로 두어도 된다.
# 표시되는 값들은 아래 예시와 정확히 일치하지 않을 수 있다.
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

다음과 유사한 출력을 확인할 수 있다.

```
configmap/sport edited
```

이 디플로이먼트에 속하는 파드 중 하나의 로그를 추적한다. (최신 항목을 따른다)

```shell
kubectl logs deployments/configmap-volume --follow
```

몇 초 후에, 로그 출력이 다음과 같이 변경되는 것을 볼 수 있다.

```
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

`configMap` 볼륨이나 `projected` 볼륨을 사용하여 
실행 중인 파드에 매핑된 컨피그맵이 있고, 해당 컨피그맵을 업데이트하면,
실행 중인 파드는 거의 즉시 업데이트를 인식한다.  
하지만, 애플리케이션은 변경 사항을 폴링하거나 파일 업데이트를 감시하도록 
작성된 경우에만 변경 사항을 인식한다.  
시작 시 구성을 한 번 로드하는 애플리케이션은 변경 사항을 인식하지 못한다.

{{< note >}}
컨피그맵이 업데이트 되는 순간부터 
새 키가 파드에 투영되는 순간까지의 총 지연 시간은 kubelet 동기화 기간만큼 길어질 수 있다. 
[마운트 된 컨피그맵 자동 업데이트](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically)도 확인한다.
{{< /note >}} 

## 컨피그맵으로 파드 환경 변수 업데이트하기 {#rollout-configmap-env}

`kubectl create configmap` 명령어를 사용하여 
[리터럴 값](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)으로 컨피그맵을 생성한다.

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

다음은 컨피그맵 `fruits`를 통해 구성된 환경 변수가 포함된 디플로이먼트 매니페스트의 예이다.

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

이 디플로이먼트에 대한 파드가 준비되었는지 확인한다. ({{< glossary_tooltip text="셀렉터" term_id="selector" >}}
와 일치)

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

다음과 유사한 출력을 확인할 수 있다.

```
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

컨피그맵의 키-값 쌍은 파드 컨테이너의 환경 변수로 구성된다. 
디플로이먼트에 속한 파드 하나의 로그로 이를 확인한다.

```shell
kubectl logs deployment/configmap-env-var
```

다음과 유사한 출력을 확인할 수 있다.

```
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

컨피그맵을 수정한다.

```shell
kubectl edit configmap fruits
```

편집기가 나타나면 키 `fruits`의 값을 `apples`에서 `mangoes`로 변경한다. 변경 사항을 저장한다.
kubectl 도구가 컨피그맵을 적절히 업데이트한다. (오류가 표시되면 다시 시도한다).

매니페스트를 편집한 후 어떻게 보일지에 대한 예는 다음과 같다. 

```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# 기존 메타데이터는 그대로 두어도 된다.
# 표시되는 값들은 아래 예시와 정확히 일치하지 않을 수 있다.
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

다음과 유사한 출력을 확인할 수 있다.

```
configmap/fruits edited
```

디플로이먼트 로그를 추적하고 몇 초 동안 출력을 관찰한다.

```shell
# 텍스트에서 설명한 대로 출력은 변경되지 않는다
kubectl logs deployments/configmap-env-var --follow
```

컨피그맵을 편집했더라도 출력은 **변경되지 않은** 상태로 유지된다.

```
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< note >}}
컨피그맵 내부의 키 값이 변경되었지만, 파드의 환경변수는 
여전히 이전 값을 표시한다. 이는 파드 내부에서 실행되는 프로세스의 환경 변수가 
소스 데이터가 변경될 때 업데이트되지 **않기** 때문이다. 만약에
강제 업데이트를 수행하려면, 쿠버네티스가 기존 파드를 교체해야 한다.
그러면 새 파드가 업데이트된 정보로 실행된다. 
{{< /note >}}

이러한 대체를 유발할 수 있다. 배포에 대한 롤아웃을 수행하려면, 
[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)을 사용한다.

```shell
# 롤아웃을 유발한다
kubectl rollout restart deployment configmap-env-var

# 롤아웃이 완료되기를 기다린다
kubectl rollout status deployment configmap-env-var --watch=true
```

다음으로, 디플로이먼트를 확인한다.

```shell
kubectl get deployment configmap-env-var
```

다음과 유사한 출력을 확인할 수 있다.

```
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

파드를 확인한다.

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

롤아웃은 쿠버네티스가 새로운 디플로이먼트에 대해 {{< glossary_tooltip term_id="replica-set" text="레플리카셋(ReplicaSet)" >}}을 
만든다. 즉, 기존 파드는 결국 종료되고 새로운 파드가 생성된다. 
몇 초후, 다음과 유사한 출력을 확인할 수 있다.

```
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< note >}}
다음 단계로 진행하기 전에 이전 파드가 완전히 종료될 때까지 기다린다.
{{< /note >}}

이 디플로이먼트에서 파드의 로그를 확인한다.

```shell
# 디플로이먼트와 관련된 한 파드를 선택하여, 로그를 확인한다.
kubectl logs deployment/configmap-env-var
```

아래와 비슷한 출력을 확인할 수 있다.

```
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

이는 컨피그맵에서 파생된 파드의 환경 변수를 업데이트하는 시나리오를 
보여준다. 컨피그맵 값의 변경 사항은 이후 롤아웃 시점에 파드에 
적용된다. 만약 디플로이먼트가 스케일 아웃되는 등 다른 이유로 파드가 새로 생성되면, 
그 새로운 파드들은 최신 구성 값을 사용한다. 만약 롤아웃을 직접 트리거하지 않으면, 
애플리케이션이 이전 환경 변수 값과 최신 환경 변수 값을 섞어서 실행하는 상황이 발생할 수 있다.

## 다중 컨테이너 파드에서 컨피그맵으로 설정 업데이트하기 {#rollout-configmap-multiple-containers}

`kubectl create configmap` 명령어를 사용하여
[리터럴 값](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)에서 컨피그맵을 생성한다.

```shell
kubectl create configmap color --from-literal=color=red
```

아래는 파드 집합을 관리하는 디플로이먼트 매니페스트 예시이며, 각 파드에 2개의 컨테이너가 있다.
각 파드에는 두 개의 컨테이너가 있으며, 이 두 컨테이너는 통신을 위해 `emptyDir` 볼륨을 공유한다.
첫번째 컨테이너는 웹 서버(`nginx`)를 실행한다. 웹 서버 컨테이너에서 공유 볼륨의 
마운트 경로는 `/usr/share/nginx/html`이다. 두 번째 보조 컨테이너는 `alpine`을 기반으로 하며,
이 컨테이너에는 `emptyDir` 볼륨이 `/pod-data`에 마운트 된다. 보조 컨테이너는 
컨피그맵을 기반으로 HTML 내용을 가진 파일을 작성한다. 웹 서버 컨테이너는 해당 HTML을 HTTP를 통해 제공한다. 

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

이 디플로이먼트의 파드들이 준비되었는지 확인하려면 ({{< glossary_tooltip text="셀렉터" term_id="selector" >}}로 매칭하여) 
파드를 점검한다.

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

다음과 유사한 출력 결과를 볼 수 있다.

```
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

디플로이먼트를 노출한다(`kubectl` 도구가 
{{<glossary_tooltip text="서비스" term_id="service">}}를 생성한다).

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

`kubectl`을 사용하여 포트를 포워딩한다.

```shell
# 이는 백그라운드에서 계속 실행된다.
kubectl port-forward service/configmap-service 8080:8080 &
```

서비스에 접근한다.

```shell
curl http://localhost:8080
```

다음과 유사한 출력 결과를 볼 수 있다.

```
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

컨피그맵을 수정한다.

```shell
kubectl edit configmap color
```

편집기가 열리면 `color`키의 값을 `red`에서 `blue`로 변경한다. 변경 사항을 저장한다. 
kubectl 도구는 이에 따라 컨피그맵을 업데이트한다 (만약 오류가 발생하면 다시 시도한다).

아래는 편집 후 매니페스트가 어떻게 보일 수 있는지에 대한 예시이다.

```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# 기존 메타데이터는 그대로 두어도 된다.
# 표시되는 값들은 아래 예시와 정확히 일치하지 않을 수 있다.
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```

서비스 URL을 몇 초 동안 반복 호출한다.

```shell
# 결과가 만족스러우면 (Ctrl-C)로 중단한다.
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

다음과 같이 출력이 변경되는 것을 확인할 수 있다.

```
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

## 사이드카 컨테이너를 가진 파드에서 컨피그맵으로 설정 업데이트하기 {#rollout-configmap-sidecar}

위 시나리오는 HTML 파일을 쓰는 보조 컨테이너로 [사이드카 컨테이너](/ko/docs/concepts/workloads/pods/sidecar-containers/)를 
사용하여 재현할 수 있다.  
사이드카 컨테이너는 개념적으로 초기화 컨테이너이므로, 메인 웹 서버 컨테이너보다 먼저 시작됨이 보장된다. 
이렇게 하면 웹 서버가 요청을 처리할 준비가 되었을 때 항상 HTML 파일을 사용할 수 있다.  

이전 시나리오에 이어서 진행하는 경우, 이번 시나리오에서도 `color`라는 이름의 컨피그맵을 재사용할 수 있다. 
이 시나리오를 독립적으로 실행하는 경우, `kubectl create configmap` 명령을 사용하여 
[리터럴 값](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)으로 컨피그맵을 생성한다.

```shell
kubectl create configmap color --from-literal=color=blue
```

아래는 파드 집합을 관리하는 디플로이먼트 매니페스트 예시이며, 각 파드는 메인 컨테이너와 
사이드카 컨테이너를 가진다. 이 두 컨테이너는 통신을 위해 `emptyDir` 볼륨을 공유한다.
메인 컨테이너는 웹 서버(NGINX)를 실행한다. 웹 서버 컨테이너에서 마운트된 공유된 볼륨의 경로는 
`/usr/share/nginx/html`이다. 두 번째 컨테이너는 Alpine Linux 기반의 사이드카 컨테이너로 보조 컨테이너 
역할을 한다. 이 컨테이너에서 `emptyDir` 볼륨은 `/pod-data`에 마운트된다. 사이드카 컨테이너는 
컨피그맵 기반으로 HTML 파일을 작성한다. 웹 서버 컨테이너는 HTTP를 통해 HTML을 제공한다.

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

이 디플로이먼트의 파드들이 준비되었는지 확인한다({{< glossary_tooltip text="셀렉터" term_id="selector" >}}로 
매칭한다).

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

다음과 유사한 출력 결과를 확인할 수 있다. 

```
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

디플로이먼트를 노출한다(`kubectl` 도구가 
{{<glossary_tooltip text="서비스" term_id="service">}}를 생성한다). 

```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

`kubectl`을 사용하여 포트를 포워딩한다.

```shell
# 이는 백그라운드에서 실행된다.
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

서비스에 접근한다.

```shell
curl http://localhost:8081
```

다음과 유사한 출력을 확인할 수 있다.

```
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

컨피그맵을 수정한다.

```shell
kubectl edit configmap color
```

편집기가 열리면 `color`키의 값을 `blue`에서 `green`으로 변경한다. 변경 사항을 저장한다.
kubectl 도구는 이에 따라 컨피그맵을 업데이트한다(오류가 발생하면 다시 시도한다).

아래는 편집 후 매니페스트가 어떻게 보일 수 있는지에 대한 예시이다.

```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# 기존 메타데이터는 그대로 두어도 된다.
# 표시되는 값들은 아래 예시와 정확히 일치하지 않을 수 있다.
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

서비스 URL을 몇 초간 반복한다.

```shell
# 결과가 만족스러우면 (Ctrl-C)로 종료한다.
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

다음과 같이 출력이 변경되는 것을 확인할 수 있다.

```
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

## 볼륨으로 마운트된 불변 컨피그맵으로 설정 업데이트하기 {#rollout-configmap-immutable-volume}

{{< note >}}
불변 컨피그맵은 시간이 지나도 변경되지 **않을** 것으로 예상되는 
고정 구성이다. 컨피그맵을 불변으로 표시하면 kubelet이 변경 사항을 감시하지 않아도 되므로 성능을 개선할 수 있다.

변경이 필요하다면, 다음 중 하나를 계획해야 한다.

- 컨피그맵의 이름을 변경하고, 새 이름을 참조하는 파드를 실행하도록 전환한다
- 이전 값을 사용한 파드를 실행했던 클러스터의 모든 노드를 교체한다
- 과거에 오래된 컨피그맵을 로드했던 노드에서 kubelet을 재시작한다
{{< /note >}}

아래는 [불변 컨피그맵](/ko/docs/concepts/configuration/configmap/#configmap-immutable)의 매니페스트 예시이다.
{{% code_sample file="configmap/immutable-configmap.yaml" %}}

불변 컨피그맵을 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

아래는 불변 컨피그맵 `company-name-20150801`을 파드의 유일한 컨테이너에
{{< glossary_tooltip text="볼륨" term_id="volume" >}}으로 마운트한 디플로이먼트 매니페스트 예시이다.

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}} 

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

디플로이먼트의 파드들이 준비되었는지 확인한다.
({{< glossary_tooltip text="셀렉터" term_id="selector" >}}로 매칭)

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

다음과 유사한 출력을 확인할 수 있다.

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

파드의 컨테이너는 컨피그맵에 정의된 데이터를 참조하여 보고서를 stdout으로 출력한다.
이 디플로이먼트의 파드 중 하나의 로그를 확인하여 이 보고서를 볼 수 있다.

```shell
# 디플로이먼트에 속한 파드 하나를 선택해 로그를 본다
kubectl logs deployments/immutable-configmap-volume
```

다음과 유사한 출력이 표시된다.

```
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< note >}}
컨피그맵을 한 번 불변으로 표시하면, 이 변경을 되돌릴 수 없고 
data 또는 binaryData 필드의 내용을 변경할 수도 없다. 
이 구성을 사용하는 파드의 동작을 바꾸려면, 
새 불변 컨피그맵을 만들고, 디플로이먼트를 수정하여 
새 컨피그맵을 참조하도록 약간 다른 파드 템플릿을 정의해야 한다.
{{< /note >}}

아래 매니페스트를 사용하여 새 불변 컨피그맵을 생성한다. 

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

다음과 유사한 출력이 표시된다. 

```
configmap/company-name-20240312 created
```

새로 생성된 컨피그맵을 확인한다.

```shell
kubectl get configmap
```

이전과 새로운 두 컨피그맵이 모두 표시된다.

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

디플로이먼트를 수정하여 새 컨피그맵을 참조하도록 한다.

디플로이먼트를 수정한다.

```shell
kubectl edit deployment immutable-configmap-volume
```

열린 편집기에서 기존 볼륨 정의를 새 컨피그맵을 사용하도록 업데이트한다.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # 이 필드를 업데이트
  name: config-volume
```

다음과 같은 출력이 표시된다.

```
deployment.apps/immutable-configmap-volume edited
```

이 작업은 롤아웃을 트리거한다. 이전 파드가 종료되고 새 파드가 준비 상태가 될 때까지 기다린다.

파드 상태를 모니터링한다. 

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m
```

잠시 후에 다음과 유사한 출력이 표시된다.

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

이 디플로이먼트의 파드 로그를 확인한다.

```shell
# 디플로이먼트에 속한 파드 하나를 선택해 로그를 본다
kubectl logs deployment/immutable-configmap-volume
```

아래와 유사한 출력이 표시된다.

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

모든 디플로이먼트가 새 불변 컨피그맵을 사용하도록 마이그레이션되면, 이전 컨피그맵을 삭제하는 것이 좋다.

```shell
kubectl delete configmap company-name-20150801
```

## 요약

파드에 볼륨으로 마운트된 컨피그맵의 변경 사항은 이후 kubelet 동기화 후 매끄럽게 반영된다.

파드의 환경 변수를 구성하는 컨피그맵의 변경 사항은 해당 파드의 이후 롤아웃 이후에 반영된다.

컨피그맵을 불변으로 표시하면 이 상태를 되돌릴 수 없고 
(불변을 가변으로 바꿀 수 없음),
`data` 나 `binaryData` 필드의 내용도 변경할 수 없다. 컨피그맵을 
삭제하고 재생성하거나, 다른 이름의 새 컨피그맵을 만들어 사용할 수 있다. 컨피그맵을 삭제하더라도,
실행 중인 컨테이너와 파드는 해당 컨피그맵을 참조하던 볼륨의 
마운트 지점을 유지한다.

## {{% heading "cleanup" %}}

실행 중인 `kubectl port-forward`가 있다면 종료한다.

튜토리얼에서 생성한 리소스를 삭제한다.

```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # 작업 중에 처리되지 않았다면 삭제
```

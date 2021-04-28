---


title: 리소스 관리
content_type: concept
weight: 40
---

<!-- overview -->

애플리케이션을 배포하고 서비스를 통해 노출했다. 이제 무엇을 해야 할까? 쿠버네티스는 확장과 업데이트를 포함하여, 애플리케이션 배포를 관리하는 데 도움이 되는 여러 도구를 제공한다. 더 자세히 설명할 기능 중에는 [구성 파일](/ko/docs/concepts/configuration/overview/)과 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)이 있다.

<!-- body -->

## 리소스 구성 구성하기

많은 애플리케이션들은 디플로이먼트 및 서비스와 같은 여러 리소스를 필요로 한다. 여러 리소스의 관리는 동일한 파일에 그룹화하여 단순화할 수 있다(YAML에서 `---` 로 구분). 예를 들면 다음과 같다.

{{< codenew file="application/nginx-app.yaml" >}}

단일 리소스와 동일한 방식으로 여러 리소스를 생성할 수 있다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

리소스는 파일에 표시된 순서대로 생성된다. 따라서, 스케줄러가 디플로이먼트와 같은 컨트롤러에서 생성한 서비스와 관련된 파드를 분산시킬 수 있으므로, 서비스를 먼저 지정하는 것이 가장 좋다.

`kubectl apply` 는 여러 개의 `-f` 인수도 허용한다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

그리고 개별 파일 대신 또는 추가로 디렉터리를 지정할 수 있다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl` 은 접미사가 `.yaml`, `.yml` 또는 `.json` 인 파일을 읽는다.

동일한 마이크로서비스 또는 애플리케이션 티어(tier)와 관련된 리소스를 동일한 파일에 배치하고, 애플리케이션과 연관된 모든 파일을 동일한 디렉터리에 그룹화하는 것이 좋다. 애플리케이션의 티어가 DNS를 사용하여 서로 바인딩되면, 스택의 모든 컴포넌트를 함께 배포할 수 있다.

URL을 구성 소스로 지정할 수도 있다. 이는 GitHub에 체크인된 구성 파일에서 직접 배포하는 데 편리하다.

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## kubectl에서의 대량 작업

`kubectl` 이 대량으로 수행할 수 있는 작업은 리소스 생성만이 아니다. 또한 다른 작업을 수행하기 위해, 특히 작성한 동일한 리소스를 삭제하기 위해 구성 파일에서 리소스 이름을 추출할 수도 있다.

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

두 개의 리소스가 있는 경우, 리소스/이름 구문을 사용하여 커맨드 라인에서 둘다 모두 지정할 수도 있다.

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

리소스가 많을 경우, `-l` 또는 `--selector` 를 사용하여 지정된 셀렉터(레이블 쿼리)를 지정하여 레이블별로 리소스를 필터링하는 것이 더 쉽다.

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

`kubectl` 은 입력을 받아들이는 것과 동일한 구문으로 리소스 이름을 출력하므로, `$()` 또는 `xargs` 를 사용하여 작업을 연결할 수 있다.

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service | xargs -i kubectl get {}
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

위의 명령을 사용하여, 먼저 `examples/application/nginx/` 에 리소스를 생성하고 `-o name` 출력 형식으로 생성한 리소스를 출력한다(각 리소스를 resource/name으로 출력).
그런 다음 "service"만 `grep` 한 다음 `kubectl get` 으로 출력한다.

특정 디렉터리 내의 여러 서브 디렉터리에서 리소스를 구성하는 경우, `--filename,-f` 플래그와 함께 `--recursive` 또는 `-R` 을 지정하여, 서브 디렉터리에 대한 작업을 재귀적으로 수행할 수도 있다.

예를 들어, 리소스 유형별로 구성된 개발 환경에 필요한 모든 {{< glossary_tooltip text="매니페스트" term_id="manifest" >}}를 보유하는 `project/k8s/development` 디렉터리가 있다고 가정하자.

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

기본적으로, `project/k8s/development` 에서 대량 작업을 수행하면, 서브 디렉터리를 처리하지 않고, 디렉터리의 첫 번째 레벨에서 중지된다. 다음 명령을 사용하여 이 디렉터리에 리소스를 생성하려고 하면, 오류가 발생할 것이다.

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

대신, 다음과 같이 `--filename,-f` 플래그와 함께 `--recursive` 또는 `-R` 플래그를 지정한다.

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`--recursive` 플래그는 `kubectl {create,get,delete,describe,rollout}` 등과 같이 `--filename,-f` 플래그를 허용하는 모든 작업에서 작동한다.

`--recursive` 플래그는 여러 개의 `-f` 인수가 제공될 때도 작동한다.

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`kubectl` 에 대해 더 자세히 알고 싶다면, [kubectl 개요](/ko/docs/reference/kubectl/overview/)를 참조한다.

## 효과적인 레이블 사용

지금까지 사용한 예는 모든 리소스에 최대 한 개의 레이블만 적용하는 것이었다. 세트를 서로 구별하기 위해 여러 레이블을 사용해야 하는 많은 시나리오가 있다.

예를 들어, 애플리케이션마다 `app` 레이블에 다른 값을 사용하지만, [방명록 예제](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)와 같은 멀티-티어 애플리케이션은 각 티어를 추가로 구별해야 한다. 프론트엔드는 다음의 레이블을 가질 수 있다.

```yaml
     labels:
        app: guestbook
        tier: frontend
```

Redis 마스터와 슬레이브는 프론트엔드와 다른 `tier` 레이블을 가지지만, 아마도 추가로 `role` 레이블을 가질 것이다.

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

그리고

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

레이블은 레이블로 지정된 차원에 따라 리소스를 분할하고 사용할 수 있게 한다.

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```
```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## 카나리(canary) 디플로이먼트

여러 레이블이 필요한 또 다른 시나리오는 동일한 컴포넌트의 다른 릴리스 또는 구성의 디플로이먼트를 구별하는 것이다. 새 릴리스가 완전히 롤아웃되기 전에 실제 운영 트래픽을 수신할 수 있도록 새로운 애플리케이션 릴리스(파드 템플리트의 이미지 태그를 통해 지정됨)의 *카나리* 를 이전 릴리스와 나란히 배포하는 것이 일반적이다.

예를 들어, `track` 레이블을 사용하여 다른 릴리스를 구별할 수 있다.

기본(primary), 안정(stable) 릴리스에는 값이 `stable` 인 `track` 레이블이 있다.

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

그런 다음 서로 다른 값(예: `canary`)으로 `track` 레이블을 전달하는 방명록 프론트엔드의 새 릴리스를 생성하여, 두 세트의 파드가 겹치지 않도록 할 수 있다.

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```


프론트엔드 서비스는 레이블의 공통 서브셋을 선택하여(즉, `track` 레이블 생략) 두 레플리카 세트에 걸쳐 있으므로, 트래픽이 두 애플리케이션으로 리디렉션된다.

```yaml
  selector:
     app: guestbook
     tier: frontend
```

안정 및 카나리 릴리스의 레플리카 수를 조정하여 실제 운영 트래픽을 수신할 각 릴리스의 비율을 결정한다(이 경우, 3:1).
확신이 들면, 안정 릴리스의 track을 새로운 애플리케이션 릴리스로 업데이트하고 카나리를 제거할 수 있다.

보다 구체적인 예시는, [Ghost 배포에 대한 튜토리얼](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)을 확인한다.

## 레이블 업데이트

새로운 리소스를 만들기 전에 기존 파드 및 기타 리소스의 레이블을 다시 지정해야 하는 경우가 있다. 이것은 `kubectl label` 로 수행할 수 있다.
예를 들어, 모든 nginx 파드에 프론트엔드 티어로 레이블을 지정하려면, 다음과 같이 실행한다.

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

먼저 "app=nginx" 레이블이 있는 모든 파드를 필터링한 다음, "tier=fe" 레이블을 지정한다.
레이블을 지정한 파드를 보려면, 다음을 실행한다.

```shell
kubectl get pods -l app=nginx -L tier
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

그러면 파드 티어의 추가 레이블 열(`-L` 또는 `--label-columns` 로 지정)과 함께, 모든 "app=nginx" 파드가 출력된다.

더 자세한 내용은, [레이블](/ko/docs/concepts/overview/working-with-objects/labels/) 및 [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label)을 참고하길 바란다.

## 어노테이션 업데이트

때로는 어노테이션을 리소스에 첨부하려고 할 수도 있다. 어노테이션은 도구, 라이브러리 등과 같은 API 클라이언트가 검색할 수 있는 임의의 비-식별 메타데이터이다. 이는 `kubectl annotate` 으로 수행할 수 있다. 예를 들면 다음과 같다.

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

더 자세한 내용은, [어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/) 및 [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate) 문서를 참고하길 바란다.

## 애플리케이션 스케일링

애플리케이션의 로드가 증가하거나 축소되면, `kubectl` 을 사용하여 애플리케이션을 스케일링한다. 예를 들어, nginx 레플리카 수를 3에서 1로 줄이려면, 다음을 수행한다.

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```shell
deployment.apps/my-nginx scaled
```

이제 디플로이먼트가 관리하는 파드가 하나만 있다.

```shell
kubectl get pods -l app=nginx
```

```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

시스템이 필요에 따라 1에서 3까지의 범위에서 nginx 레플리카 수를 자동으로 선택하게 하려면, 다음을 수행한다.

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

이제 nginx 레플리카가 필요에 따라 자동으로 확장되거나 축소된다.

더 자세한 내용은, [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 및 [horizontal pod autoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale/) 문서를 참고하길 바란다.


## 리소스 인플레이스(in-place) 업데이트

때로는 자신이 만든 리소스를 필요한 부분만, 중단없이 업데이트해야 할 때가 있다.

### kubectl apply

구성 파일 셋을 소스 제어에서 유지하는 것이 좋으며
([코드로서의 구성](https://martinfowler.com/bliki/InfrastructureAsCode.html) 참조),
그렇게 하면 구성하는 리소스에 대한 코드와 함께 버전을 지정하고 유지할 수 있다.
그런 다음, [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)를 사용하여 구성 변경 사항을 클러스터로 푸시할 수 있다.

이 명령은 푸시하려는 구성의 버전을 이전 버전과 비교하고 지정하지 않은 속성에 대한 자동 변경 사항을 덮어쓰지 않은 채 수정한 변경 사항을 적용한다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

참고로 `kubectl apply` 는 이전의 호출 이후 구성의 변경 사항을 판별하기 위해 리소스에 어노테이션을 첨부한다. 호출되면, `kubectl apply` 는 리소스를 수정하는 방법을 결정하기 위해, 이전 구성과 제공된 입력 및 리소스의 현재 구성 간에 3-way diff를 수행한다.

현재, 이 어노테이션 없이 리소스가 생성되므로, `kubectl apply` 의 첫 번째 호출은 제공된 입력과 리소스의 현재 구성 사이의 2-way diff로 대체된다. 이 첫 번째 호출 중에는, 리소스를 생성할 때 설정된 특성의 삭제를 감지할 수 없다. 이러한 이유로, 그 특성들을 삭제하지 않는다.

`kubectl apply` 에 대한 모든 후속 호출, 그리고 `kubectl replace` 및 `kubectl edit` 와 같이 구성을 수정하는 다른 명령은, 어노테이션을 업데이트하여, `kubectl apply` 에 대한 후속 호출이 3-way diff를 사용하여 삭제를 감지하고 수행할 수 있도록 한다.

### kubectl edit

또는, `kubectl edit`로 리소스를 업데이트할 수도 있다.

```shell
kubectl edit deployment/my-nginx
```

이것은 먼저 리소스를 `get` 하여, 텍스트 편집기에서 편집한 다음, 업데이트된 버전으로 리소스를 `apply` 하는 것과 같다.

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# 편집한 다음, 파일을 저장한다.

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

이를 통해 보다 중요한 변경을 더 쉽게 ​​수행할 수 있다. 참고로 `EDITOR` 또는 `KUBE_EDITOR` 환경 변수를 사용하여 편집기를 지정할 수 있다.

더 자세한 내용은, [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit) 문서를 참고하길 바란다.

### kubectl patch

`kubectl patch` 를 사용하여 API 오브젝트를 인플레이스 업데이트할 수 있다. 이 명령은 JSON 패치,
JSON 병합 패치 그리고 전략적 병합 패치를 지원한다.
[kubectl patch를 사용한 인플레이스 API 오브젝트 업데이트](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)와
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch)를
참조한다.

## 파괴적(disruptive) 업데이트

경우에 따라, 한 번 초기화하면 업데이트할 수 없는 리소스 필드를 업데이트해야 하거나, 디플로이먼트에서 생성된 손상된 파드를 고치는 등의 재귀적 변경을 즉시 원할 수도 있다. 이러한 필드를 변경하려면, `replace --force` 를 사용하여 리소스를 삭제하고 다시 만든다. 이 경우, 원래 구성 파일을 수정할 수 있다.

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## 서비스 중단없이 애플리케이션 업데이트

언젠가는, 위의 카나리 디플로이먼트 시나리오에서와 같이, 일반적으로 새 이미지 또는 이미지 태그를 지정하여, 배포된 애플리케이션을 업데이트해야 한다. `kubectl` 은 여러 가지 업데이트 작업을 지원하며, 각 업데이트 작업은 서로 다른 시나리오에 적용할 수 있다.

디플로이먼트를 사용하여 애플리케이션을 생성하고 업데이트하는 방법을 안내한다.

nginx 1.14.2 버전을 실행한다고 가정해 보겠다.

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```shell
deployment.apps/my-nginx created
```

3개의 레플리카를 포함한다(이전과 새 개정판이 공존할 수 있음).

```shell
kubectl scale deployment my-nginx --current-replicas=1 --replicas=3
```

```
deployment.apps/my-nginx scaled
```

1.16.1 버전으로 업데이트하려면, 위에서 배운 kubectl 명령을 사용하여 `.spec.template.spec.containers[0].image` 를 `nginx:1.14.2` 에서 `nginx:1.16.1` 로 변경한다.

```shell
kubectl edit deployment/my-nginx
```

이것으로 끝이다! 디플로이먼트는 배포된 nginx 애플리케이션을 배후에서 점차적으로 업데이트한다. 업데이트되는 동안 특정 수의 이전 레플리카만 중단될 수 있으며, 원하는 수의 파드 위에 특정 수의 새 레플리카만 생성될 수 있다. 이에 대한 더 자세한 내용을 보려면, [디플로이먼트 페이지](/ko/docs/concepts/workloads/controllers/deployment/)를 방문한다.



## {{% heading "whatsnext" %}}


- [애플리케이션 검사 및 디버깅에 `kubectl` 을 사용하는 방법](/docs/tasks/debug-application-cluster/debug-application-introspection/)에 대해 알아본다.
- [구성 모범 사례 및 팁](/ko/docs/concepts/configuration/overview/)을 참고한다.

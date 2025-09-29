---
title: 워크로드 관리
content_type: concept
# reviewers:
# - janetkuo
weight: 40
---

<!-- overview -->

애플리케이션을 배포하고 서비스를 통해 노출하였다. 이제 무엇을 해야 할까? 쿠버네티스는 
스케일링과 업데이트를 포함하여 애플리케이션 배포 관리에 도움을 주는 여러 도구를 제공한다.

<!-- body -->

## 리소스 구성 정리하기

많은 애플리케이션은 디플로이먼트(Deployment)및 서비스와 같은 여러 리소스를 함께 생성해야 한다.
여러 리소스를 하나의 파일에 함께 모아둠으로써 간단하게 관리할 수 있다.
(YAML에서 `---` 으로 구분한다) 예를 들어,

{{% code_sample file="application/nginx-app.yaml" %}}

여러 리소스도 단일 리소스 생성과 동일한 방식으로 생성할 수 있다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

리소스는 매니페스트에 정의된 순서대로 생성된다. 따라서, 
서비스를 먼저 정의하여, 스케줄러가 서비스와 연결된 파드를  
디플로이먼트와 같은 컨트롤러가 생성한 후 고르게 배치하는 것을 보장하는 것이 좋다. 

`kubectl apply`는 여러 `-f` 인자도 받을 수 있다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```


동일한 마이크로서비스 또는 애플리케이션 계층과 관련된 리소스를 
하나의 파일 내에 배치하고, 애플리케이션과 관련된 모든 파일은 동일한 
디렉터리에 그룹화하는 것이 권장된다. 애플리케이션의 계층이 DNS를 사용하여 서로 바인딩되면, 스택의 모든 
구성 요소를 함께 배포할 수 있다.

또한, URL을 구성 소스로 지정하는 것도 가능하고, 이는 소스 제어 시스템의 매니페스트를 
통해 직접 배포할 때 유용하다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

컨피그맵(ConfigMap)을 추가하는 등 더 많은 매니페스트를 정의해야 하는 경우에도 동일하다.

### 외부 도구

이 섹션에서는 쿠버네티스에서 워크로드를 관리하는 데 사용되는 가장 일반적인 도구만 나열한다. 더 많은 목록을 보려면, 
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} 의 [애플리케이션 정의 및 이미지 빌드](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)
를 확인한다.

#### 헬름(Helm) {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[헬름](https://helm.sh/) 은 사전 구성된 
쿠버네티스 리소스 패키지를 관리하는 도구이다. 이 패키지를 _헬름 차트_ 라고 한다.

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/) 는 쿠버네티스 매니페스트를 탐색하여 구성 옵션을 추가, 삭제 또는 업데이트할 수 있다.
독립 실행형 바이너리와 kubectl의 [기본 기능](/ko/docs/tasks/manage-kubernetes-objects/kustomization/)으로 
모두 제공된다.

## kubectl 일괄 작업

리소스 생성만이 `kubectl`이 할 수 있는 유일한 일괄 작업은 아니다. 구성 파일에서 
리소스 이름을 추출하여 다른 작업을 수행하는 것도 가능하다.
특히, 생성한 리소스를 삭제하는 작업을 수행할 수 있다.

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

두 개의 리소스가 있는 경우, 명령줄에서 리소스/이름 구문을 사용하여 
두 리소스를 모두 지정할 수 있다.

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

리소스 수가 많을 경우, `-l` 또는 `--selector` 옵션을 사용하여 
셀렉터 (레이블 쿼리)를 지정하고 레이블로 리소스를 필터링하는 것이 더 쉽다.

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

### 체이닝과 필터링

`kubectl` 은 리소스 이름을 입력받는 것과 동일한 구문으로 출력하므로, `$()` 나 `xargs`를 
이용하여 동작을 체이닝할 수 있다.

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

출력 예시는 다음과 같다.

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

위 명령어는 처음에 `examples/application/nginx/` 아래의 리소스를 생성하고, 
`-o name`으로 생성된 리소스의 출력 형식을 정한다 (각 리소스를 리소스/이름으로 출력한다).
서비스만 `grep`한 다음에, [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/)을 사용하여 출력한다.

### 로컬 파일에 대한 재귀 작업

특정 디렉터리 내의 여러 하위 디렉터리에 리소스를 구성하는 
경우, `--filename`/`-f` 인수와 함께 `--recursive` 또는 `-R`을 지정하여 
하위 디렉터리에서도 작업을 재귀적으로 수행할 수 있다.

예를 들어, 개발 환경에 필요한 모든 
{{< glossary_tooltip text="manifests" term_id="manifest" >}} 가 
리소스 유형별로 정의되어 있는 `project/k8s/development` 디렉터리가 있다고 가정한다.

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

기본적으로, `project/k8s/development`에서 대량 작업을 수행하면 디렉터리의 첫번째 수준에서 
중단되고, 하위 디렉터리는 처리하지 않는다. 다음 명령어를 사용하여 
이 디렉터리에서 리소스를 생성하려고 했다면 오류가 발생했을 것이다.

```shell
kubectl apply -f project/k8s/development
```

```none
에러: 하나 또는 그 이상의 리소스를 인자 또는 파일 이름으로 제공해야 한다 (.json|.yaml|.yml|stdin)
```

대신에 `--recursive` 나 `-R`와 함께 `--filename`/`-f` 인수를 지정한다.

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`--recursive` 인수는 `--filename`/`-f` 인수를 허용하는 모든 연산에서 작동한다. 예를 들어,
`kubectl create`, `kubectl get`, `kubectl delete`, `kubectl describe`, 심지어 `kubectl rollout`까지 작동한다.

`--recursive` 인수는 여러 개의 `-f` 인수가 제공될 때도 작동한다.

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`kubectl`에 대해 더 배우고 싶다면, 
[명령줄 도구 (kubectl)](/ko/docs/reference/kubectl/)를 읽어본다

## 중단 없이 애플리케이션 업데이트하기

어느 시점이 되면, 결국 일반적으로 새 이미지나 이미지 태그를 지정하여 
배포된 애플리케이션을 업데이트 해야 할 수 있다. `kubectl`는 여러 업데이트 작업을 제공하며, 
각 작업은 다양한 시나리오에 적용 가능하다.

앱의 여러 복사본을 실행하고, _롤아웃(rollout)_ 을 사용하여 트래픽을 점진적으로
새로운 정상 파드로 전환할 수 있다. 결국, 실행 중인 모든 파드에 새로운 소프트웨어가 설치된다.

이 페이지의 섹션에서는 디플로이먼트를 통해 애플리케이션을 생성하고 업데이트하는 방법을 안내한다.

예를 들어, nginx의 1.14.2 버전을 실행한다고 가정한다.

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

1개의 레플리카가 있는지 확인한다.

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

그리고 쿠버네티스가 롤아웃 중에 임시 복제본을 더 추가할 수 있도록, _추가 최대값_ 을
100%로 설정한다.

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

1.16.1 버전을 업데이트하기 위해, `kubectl edit` 를 사용하여 `.spec.template.spec.containers[0].image`을 
`nginx:1.14.2` 에서 `nginx:1.16.1`로 변경한다.

```shell
kubectl edit deployment/my-nginx
# 최신 컨테이너 이미지를 사용할 수 있도록 매니페스트를 변경한 다음, 변경 사항을 저장한다
```

이게 전부이다! 디플로이먼트는 배포된 nginx 애플리케이션을 점진적으로
백그라운드에서 선언적으로 업데이트한다. 이는 업데이트되는 동안 특정 수의 이전 복제본만 
중단되고, 원하는 수의 파드 위에 특정 수의 새 복제본만 생성되도록 
보장한다. 어떻게 동작하는지 더 많은 정보를 배우기 위해,
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)을 방문한다.

데몬셋(DaemonSet), 디플로이먼트, 또는 스테이트풀셋(StatefulSet)에서 롤아웃을 사용할 수 있다.

### 롤아웃 관리하기

[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)을 기존 애플리케이션의 
점진적인 업데이트를 관리하기 위해 사용할 수 있다.

예를 들어,

```shell
kubectl apply -f my-deployment.yaml

# 롤아웃이 완료될 때까지 기다린다
kubectl rollout status deployment/my-deployment --timeout 10m # 타임아웃 10분
```

또는

```shell
kubectl apply -f backing-stateful-component.yaml

# 롤아웃이 끝날 때까지 기다리지 않고 상태만 확인한다
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

또한, 롤아웃을 일시 중지, 재개 또는 취소할 수도 있다. 
자세한 내용은 [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)을 방문한다.

## 카나리아 배포

<!--TODO: make a task out of this for canary deployment, ref #42786-->

여러 레이블이 필요한 또 다른 시나리오는 동일한 컴포넌트 요소의 서로 다른 
릴리스 또는 구성의 디플로이먼트를 구분하는 것이다. 새 애플리케이션 릴리스의 *카나리아* 버전을
이전 릴리스와 나란히 배포하는 것이 일반적이다. (파드 템플릿의 이미지 태그를 통해 지정) 
이렇게 하면 새로운 릴리즈가 완전히 배포되기 전에 라이브 프로덕션 트래픽을 수신할 수 
있다.

예를 들어, `track` 레이블을 사용하여 여러 릴리스를 구분할 수 있다.

기본적으로, 스테이블 릴리스는 `stable` 값을 가진 `track` 레이블이 지정되며,

```none
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

그런 다음 `track` 레이블에 다른 값(예시: `canary`)을 지정하여 
guestbook 프론트엔드의 새 릴리즈를 만들면, 두 세트의 파드가 겹치지 않는다.

```none
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

프론트엔드 서비스는 두 복제본 세트 모두에 걸친 레이블의 공통 하위 집합(즉, `track` 레이블 생략)을 
선택하여, 트래픽이 두 애플리케이션으로 리디렉션되도록 
한다.

```yaml
selector:
   app: guestbook
   tier: frontend
```

스테이블 릴리스와 카나리아 릴리스의 복제본 수를 조정하여 라이브 프로덕션 트래픽을 받을 
각 릴리스의 비율을 결정할 수 있다 (이 경우, 3:1).
충분히 확신이 서면, 안정적인 트랙을 새 애플리케이션 릴리즈로 업데이트하고 카나리아 트랙을
제거할 수 있다.

## 어노테이션 업데이트하기

때때로 리소스에 어노테이션을 첨부하는 것이 좋다. 어노테이션은 임의의
도구나 라이브러리와 같은 API 클라이언트가 검색하기 위한 비식별 메타데이터이다. 
`kubectl annotate`으로 할 수 있다. 예를 들면,

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

자세한 내용은 [어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/)과
[kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/)을 참고한다.

## 애플리케이션 스케일링하기

애플리케이션의 부하가 증가하거나 줄어들면, `kubectl`을 사용하여 애플리케이션을 확장한다.
예를 들어, nginx 레플리카 수를 3개에서 1개로 줄이려면 다음을 수행한다.

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

이제 배포에서 관리하는 파드는 하나뿐이다.

```shell
kubectl get pods -l app=nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

시스템이 필요에 따라 nginx 복제본 수를,
1 에서 3 까지 자동으로 선택하도록 하려면 다음과 같이 한다.

```shell
# 기존 컨테이너 및 파드 메트릭 소스가 필요하다
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

이제 nginx 복제본이 필요에 따라 자동으로 확장 및 축소된다.

자세한 내용은 [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/),
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) 및
[horizontal pod autoscaler](/ko/docs/tasks/run-application/horizontal-pod-autoscale/) 문서를 참고한다.

## 리소스의 현재 위치 업데이트하기

때로는 생성한 리소스에 대해 간략하고 중단없는 업데이트가 필요할 수 있다. 

### kubectl apply

소스 제어에서 구성 파일 세트를 유지하는 것이 권장된다.
([코드로 구성](https://martinfowler.com/bliki/InfrastructureAsCode.html) 참고),
이렇게 하면 해당 구성 파일에서 구성하는 리소스의 코드와 함께 유지 관리 및 버전 관리가 가능하다.
그런 다음 [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/)을 사용하여
구성 변경 사항을 클러스터에 푸시할 수 있다.

이 명령은 이전 버전과 푸시하는 구성의 버전을 비교하여 
지정하지 않은 속성이 자동으로 변경된 내용을 덮어쓰지 않고 
변경한 내용을 적용한다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

기본 메커니즘에 대해 자세히 알아보려면, [서버 측 적용](/docs/reference/using-api/server-side-apply/)을 읽어보자.

### kubectl edit

또는, [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/)을 사용하여 리소스를 업데이트할 수도 있다.

```shell
kubectl edit deployment/my-nginx
```

이는 먼저 리소스를 `get`하고, 텍스트 편집기에서 편집한 다음, 업데이트 된 버전으로 
리소스를 `apply` 하는 것과 같다.

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# 파일을 약간 수정한 뒤 저장한다

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

이렇게 하면 더 큰 변경 작업을 더 쉽게 수행할 수 있다. `EDITOR` 또는 `KUBE_EDITOR` 환경 변수를 사용하여 
편집기를 지정할 수 있다.

자세한 내용은 [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/)을 참고한다.

### kubectl 패치

[`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) 를 사용하여 API 객체를 현재 위치에서 업데이트할 수 있다.
이 하위 명령은 JSON 패치,
JSON 병합 패치, 그리고 전략적 병합 패치를 지원한다.

자세한 내용은 
[kubectl patch을 사용하여 API 객체를 제자리에 업데이트하는 방법](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
을 참고한다.

## 파괴적인 업데이트

경우에 따라 초기화 후 업데이트할 수 없는 리소스 필드를 업데이트해야 하거나,
배포에서 생성된 손상된 파드를 수정하는 등, 재귀적 변경을 즉시 적용해야 할 수 
있다. 이러한 필드를 변경하려면, `replace --force`를 사용하여 리소스를 삭제했다가 다시 
생성한다. 이 경우, 원본 구성 파일을 다음과 같이 수정할 수 있다.

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```


## {{% heading "whatsnext" %}}

- [`kubectl`을 사용하여 애플리케이션을 인트로스펙션(introspection)하고 디버깅하는 방법](/ko/docs/tasks/debug/debug-application/debug-running-pod/)을 학습한다. 

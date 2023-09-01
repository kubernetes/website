---
title: 클러스터에서 캐스케이딩 삭제 사용
content_type: task
---

<!--overview-->

이 페이지에서는 {{<glossary_tooltip text="가비지 수집" term_id="garbage-collection">}} 중 
클러스터에서 사용할 [캐스케이딩 삭제](/ko/docs/concepts/architecture/garbage-collection/#cascading-deletion) 
타입을 지정하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

또한 다양한 타입들의 캐스케이딩 삭제를 실험하려면 
[샘플 디플로이먼트를 생성](/ko/docs/tasks/run-application/run-stateless-application-deployment/#nginx-디플로이먼트-생성하고-탐색하기)할 필요가 있다. 각 타입에 대해 디플로이먼트를 
다시 생성해야 할 수도 있다.

## 파드에서 소유자 참조 확인

파드에서 `ownerReferences` 필드가 존재하는지 확인한다.

```shell 
kubectl get pods -l app=nginx --output=yaml
```

출력은 다음과 같이 `ownerReferences` 필드를 가진다.

```yaml
apiVersion: v1
    ...
    ownerReferences:
    - apiVersion: apps/v1
      blockOwnerDeletion: true
      controller: true
      kind: ReplicaSet
      name: nginx-deployment-6b474476c4
      uid: 4fdcd81c-bd5d-41f7-97af-3a3b759af9a7
    ...
```

## 포그라운드(foreground) 캐스케이딩 삭제 사용 {#use-foreground-cascading-deletion}

기본적으로 쿠버네티스는 종속 오브젝트를 삭제하기 위해서
[백그라운드 캐스케이딩 삭제](/ko/docs/concepts/architecture/garbage-collection/#background-deletion)를 사용한다. 클러스터를 실행하는 쿠버네티스 버전에 따라 
`kubectl` 또는 쿠버네티스 API를 사용해 
포그라운드 캐스케이딩 삭제로 전환할 수 있다. {{<version-check>}}


`kubectl` 또는 쿠버네티스 API를 사용해 
포그라운드 캐스케이딩 삭제로 오브젝트들을 삭제할 수 있다.

**kubectl 사용**

다음 명령어를 실행한다.
<!--TODO: verify release after which the --cascade flag is switched to a string in https://github.com/kubernetes/kubectl/commit/fd930e3995957b0093ecc4b9fd8b0525d94d3b4e-->

```shell
kubectl delete deployment nginx-deployment --cascade=foreground
```

**쿠버네티스 API 사용**

1. 로컬 프록시 세션을 시작한다.

   ```shell
   kubectl proxy --port=8080
   ```

1. 삭제를 작동시키기 위해 `curl`을 사용한다.

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
       -H "Content-Type: application/json"
   ```

   출력에는 다음과 같이 
   `foregroundDeletion` {{<glossary_tooltip text="파이널라이저(finalizer)" term_id="finalizer">}}가 포함되어 있다.

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "metadata": {
       "name": "nginx-deployment",
       "namespace": "default",
       "uid": "d1ce1b02-cae8-4288-8a53-30e84d8fa505",
       "resourceVersion": "1363097",
       "creationTimestamp": "2021-07-08T20:24:37Z",
       "deletionTimestamp": "2021-07-08T20:27:39Z",
       "finalizers": [
         "foregroundDeletion"
       ]
       ...
   ```


## 백그라운드 캐스케이딩 삭제 사용 {#use-background-cascading-deletion}

1. [샘플 디플로이먼트를 생성한다](/ko/docs/tasks/run-application/run-stateless-application-deployment/#nginx-디플로이먼트-생성하고-탐색하기).
1. 클러스터를 실행하는 쿠버네티스 버전에 따라 
   디플로이먼트를 삭제하기 위해 `kubectl` 또는 쿠버네티스 API를 사용한다. {{<version-check>}}


`kubectl` 또는 쿠버네티스 API를 사용해 
백그라운드 캐스케이딩 삭제로 오브젝트들을 삭제할 수 있다.

쿠버네티스는 기본적으로 백그라운드 캐스케이딩 삭제를 사용하므로, `--cascade` 플래그 
또는 `propagationPolicy` 인수 없이 
다음 명령을 실행해도 같은 작업을 수행한다.

**kubectl 사용**

다음 명령어를 실행한다.

```shell
kubectl delete deployment nginx-deployment --cascade=background
```

**쿠버네티스 API 사용**

1. 로컬 프록시 세션을 시작한다.

   ```shell
   kubectl proxy --port=8080
   ```

1. 삭제를 작동시키기 위해 `curl`을 사용한다.

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
       -H "Content-Type: application/json"
   ```

   출력은 다음과 유사하다.

   ```
   "kind": "Status",
   "apiVersion": "v1",
   ...
   "status": "Success",
   "details": {
       "name": "nginx-deployment",
       "group": "apps",
       "kind": "deployments",
       "uid": "cc9eefb9-2d49-4445-b1c1-d261c9396456"
   }
   ```


## 소유자 오브젝트 및 종속된 고아(orphan) 오브젝트 삭제 {#set-orphan-deletion-policy}

기본적으로, 쿠버네티스에 오브젝트를 삭제하도록 지시하면 
{{<glossary_tooltip text="컨트롤러" term_id="controller">}}는 
종속 오브젝트들도 제거한다. 클러스터를 실행하는 
쿠버네티스 버전에 따라 `kubectl` 또는 쿠버네티스 API를 사용해 
종속 오브젝트를 쿠버네티스 *고아*로 만들 수 있다. {{<version-check>}}


**kubectl 사용**

다음 명령어를 실행한다.

```shell
kubectl delete deployment nginx-deployment --cascade=orphan
```

**쿠버네티스 API 사용**

1. 로컬 프록시 세션을 시작한다.

   ```shell
   kubectl proxy --port=8080
   ```

1. 삭제를 작동시키기 위해 `curl`을 사용한다.

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
       -H "Content-Type: application/json"
   ```

   출력에는 다음과 같이 `finalizers` 필드에 `orphan`이 포함되어 있다.

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "namespace": "default",
   "uid": "6f577034-42a0-479d-be21-78018c466f1f",
   "creationTimestamp": "2021-07-09T16:46:37Z",
   "deletionTimestamp": "2021-07-09T16:47:08Z",
   "deletionGracePeriodSeconds": 0,
   "finalizers": [
     "orphan"
   ],
   ...
   ```


디플로이먼트가 관리하는 파드들이 계속 실행 중인지 확인할 수 있다.

```shell
kubectl get pods -l app=nginx
```

## {{% heading "whatsnext" %}}

* 쿠버네티스의 [소유자와 종속 오브젝트](/docs/concepts/overview/working-with-objects/owners-dependents/)에 대해 알아보자.
* 쿠버네티스 [파이널라이저(finalizers)](/ko/docs/concepts/overview/working-with-objects/finalizers/)에 대해 알아보자.
* [가비지(garbage) 수집](/ko/docs/concepts/architecture/garbage-collection/)에 대해 알아보자.

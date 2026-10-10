---
title: 노드에 대한 확장 리소스 알리기
content_type: task
---


<!-- overview -->

이 페이지는 노드의 확장 리소스를 지정하는 방법을 보여준다.
확장 리소스를 통해 클러스터 관리자는 쿠버네티스에게
알려지지 않은 노드-레벨 리소스를 알릴 수 있다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## 노드의 이름을 확인한다

```shell
kubectl get nodes
```

이 연습에 사용할 노드 중 하나를 선택한다.

## 노드 중 하나에 새로운 확장 리소스를 알린다

노드에서 새로운 확장 리소스를 알리려면, 쿠버네티스 API 서버에
HTTP PATCH 요청을 보낸다. 예를 들어, 노드 중 하나에 4개의 동글(dongle)이 있다고
가정한다. 다음은 노드에 4개의 동글 리소스를 알리는 PATCH 요청의
예이다.

```shell
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/example.com~1dongle",
    "value": "4"
  }
]
```

참고로 쿠버네티스는 동글이 무엇인지 또는 동글이 무엇을 위한 것인지 알 필요가 없다.
위의 PATCH 요청은 노드에 동글이라고 하는 네 가지 항목이 있음을
쿠버네티스에 알려준다.

쿠버네티스 API 서버에 요청을 쉽게 보낼 수 있도록 프록시를 시작한다.

```shell
kubectl proxy
```

다른 명령 창에서 HTTP PATCH 요청을 보낸다.
`<your-node-name>` 을 노드의 이름으로 바꾼다.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1dongle", "value": "4"}]' \
http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

{{< note >}}
이전 요청에서 `~1` 은 패치 경로의 / 문자에 대한
인코딩이다. JSON-Patch의 작업 경로값은 JSON-Pointer로
해석된다. 자세한 내용은 [IETF RFC 6901](https://tools.ietf.org/html/rfc6901)의
섹션 3을 참고한다.
{{< /note >}}

출력은 노드가 4개의 동글 용량을 가졌음을 나타낸다.

```
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

노드의 정보를 확인한다.

```
kubectl describe node <your-node-name>
```

다시 한 번, 출력에 동글 리소스가 표시된다.

```yaml
Capacity:
 cpu:  2
 memory:  2049008Ki
 example.com/dongle:  4
```

이제, 애플리케이션 개발자는 특정 개수의 동글을 요청하는 파드를
만들 수 있다. [컨테이너에 확장 리소스 할당하기](/ko/docs/tasks/configure-pod-container/extended-resource/)를
참고한다.

## 토론

확장 리소스는 메모리 및 CPU 리소스와 비슷하다. 예를 들어,
노드에서 실행 중인 모든 컴포넌트가 공유할 특정 양의 메모리와 CPU가
노드에 있는 것처럼, 노드에서 실행 중인 모든 컴포넌트가
특정 동글을 공유할 수 있다. 또한 애플리케이션 개발자가
특정 양의 메모리와 CPU를 요청하는 파드를 생성할 수 있는 것처럼, 특정
동글을 요청하는 파드를 생성할 수 있다.

확장 리소스는 쿠버네티스에게 불투명하다. 쿠버네티스는 그것들이
무엇인지 전혀 모른다. 쿠버네티스는 노드에 특정 개수의 노드만
있다는 것을 알고 있다. 확장 리소스는 정수로 알려야
한다. 예를 들어, 노드는 4.5개의 동글이 아닌, 4개의 동글을 알릴 수 있다.

### 스토리지 예제

노드에 800GiB의 특별한 종류의 디스크 스토리지가 있다고 가정한다.
example.com/special-storage와 같은 특별한 스토리지의 이름을 생성할 수 있다.
그런 다음 특정 크기, 100GiB의 청크로 알릴 수 있다. 이 경우,
노드에는 example.com/special-storage 유형의 8가지 리소스가 있다고
알린다.

```yaml
Capacity:
 ...
 example.com/special-storage: 8
```

이 특별한 스토리지에 대한 임의 요청을 허용하려면,
1바이트 크기의 청크로 특별한 스토리지를 알릴 수 있다. 이 경우, example.com/special-storage 유형의
800Gi 리소스를 알린다.

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

그런 다음 컨테이너는 최대 800Gi의 임의 바이트 수의 특별한 스토리지를 요청할 수 있다.

## 정리

다음은 노드에서 동글 알림을 제거하는 PATCH 요청이다.

```
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "remove",
    "path": "/status/capacity/example.com~1dongle",
  }
]
```

쿠버네티스 API 서버에 요청을 쉽게 보낼 수 있도록 프록시를 시작한다.

```shell
kubectl proxy
```

다른 명령 창에서 HTTP PATCH 요청을 보낸다.
`<your-node-name>`을 노드의 이름으로 바꾼다.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

동글 알림이 제거되었는지 확인한다.

```
kubectl describe node <your-node-name> | grep dongle
```

(출력이 보이지 않아야 함)




## {{% heading "whatsnext" %}}


### 애플리케이션 개발자를 위한 문서

* [컨테이너에 확장 리소스 할당하기](/ko/docs/tasks/configure-pod-container/extended-resource/)

### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

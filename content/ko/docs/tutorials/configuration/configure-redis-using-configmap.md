---



title: 컨피그맵을 사용해서 Redis 설정하기
content_type: tutorial
---

<!-- overview -->

이 페이지에서는 컨피그맵(ConfigMap)을 사용해서 Redis를 설정하는 방법에 대한 실세계 예제를 제공하고, [컨피그맵을 사용해서 컨테이너 설정하기](/docs/tasks/configure-pod-container/configure-pod-configmap/) 태스크로 빌드를 한다.



## {{% heading "objectives" %}}


* Redis 설정값으로 컨피그맵을 생성한다.
* 생성된 컨피그맵을 마운트하고 사용하는 Redis 파드를 생성한다.
* 설정이 잘 적용되었는지 확인한다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 예시는 `kubectl` 1.14 이상 버전에서 동작한다.
* [컨피그맵을 사용해서 컨테이너 설정하기](/docs/tasks/configure-pod-container/configure-pod-configmap/)를 이해한다.



<!-- lessoncontent -->


## 실세상 예제: 컨피그맵을 사용해서 Redis 설정하기

아래 단계를 통해서, 컨피그맵에 저장된 데이터를 사용하는 Redis 캐시를 설정한다.

우선, 비어 있는 설정으로 컨피그맵을 생성한다.

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```

위에서 생성한 컨피그맵을 Redis 파드 매니페스트와 함께 적용한다.

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml
```

Redis 파드 매니페스트의 내용을 검토하고 다음의 사항을 염두에 둔다.

* `config` 라는 이름의 볼륨은 `spec.volumes[1]` 에 의해서 생성된다.
* `spec.volumes[1].items[0]` 내부의 `key` 와 `path` 는 `config` 볼륨에 `redis.conf` 라는 파일명으로 지정된
  `example-redis-config` 컨피그맵의 `redis-config` 키를 노출시킨다.
* 그리고 `config` 볼륨은 `spec.containers[0].volumeMounts[1]` 에 의해서 `/redis-master` 에 마운트된다.

이 내용은 위의 `example-redis-config` 컨피그맵의 `data.redis-config` 내부 데이터를 파드 안에 있는
`/redis-master/redis.conf` 파일의 내용으로 노출시키는 순효과(net effect)를 낸다.

{{< codenew file="pods/config/redis-pod.yaml" >}}

생성된 오브젝트를 확인한다.

```shell
kubectl get pod/redis configmap/example-redis-config
```

다음의 결과를 볼 수 있다.

```shell
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

`example-redis-config` 컨피그맵의 `redis-config` 키를 공란으로 둔 것을 기억하자.

```shell
kubectl describe configmap/example-redis-config
```

`redis-config` 키가 비어 있는 것을 확인할 수 있다.

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

`kubectl exec` 를 사용하여 파드에 접속하고, 현재 설정 확인을 위해서 `redis-cli` 도구를 실행한다.

```shell
kubectl exec -it redis -- redis-cli
```

`maxmemory` 를 확인한다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

기본값인 0을 볼 수 있을 것이다.

```shell
1) "maxmemory"
2) "0"
```

유사하게, `maxmemory-policy` 를 확인한다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

이것도 기본값인 `noeviction` 을 보여줄 것이다.

```shell
1) "maxmemory-policy"
2) "noeviction"
```

이제 `example-redis-config` 컨피그맵에 몇 가지 설정값을 추가해 본다.

{{< codenew file="pods/config/example-redis-config.yaml" >}}

갱신된 컨피그맵을 적용한다.

```shell
kubectl apply -f example-redis-config.yaml
```

컨피그맵이 갱신된 것을 확인한다.

```shell
kubectl describe configmap/example-redis-config
```

방금 추가한 설정값을 확인할 수 있을 것이다.

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
----
maxmemory 2mb
maxmemory-policy allkeys-lru
```

설정이 적용되었는지 확인하려면, `kubectl exec` 를 통한 `redis-cli` 로 Redis 파드를 다시 확인한다.

```shell
kubectl exec -it redis -- redis-cli
```

`maxmemory` 를 확인한다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

기본값인 0을 볼 수 있을 것이다.

```shell
1) "maxmemory"
2) "0"
```

유사하게, `maxmemory-policy` 도 기본 설정인 `noeviction` 을 보여줄 것이다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

위의 명령은 다음을 반환한다.

```shell
1) "maxmemory-policy"
2) "noeviction"
```

파드는 연관된 컨피그맵에서 갱신된 값을 인지하기 위해서 재시작이 필요하므로
해당 설정값이 변경되지 않은 상태이다. 파드를 삭제하고 다시 생성한다.

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml
```

이제 마지막으로 설정값을 다시 확인해 본다.

```shell
kubectl exec -it redis -- redis-cli
```

`maxmemory` 를 확인한다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

이것은 이제 갱신된 값인 2097152를 반환한다.

```shell
1) "maxmemory"
2) "2097152"
```

유사하게, `maxmemory-policy` 도 갱신되어 있다.

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

이것은 원하는 값인 `allkeys-lru` 를 반환한다.

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

생성된 자원을 삭제하여 작업을 정리한다.

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* [컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/) 배우기.

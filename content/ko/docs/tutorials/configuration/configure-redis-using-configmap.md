---
title: 컨피그 맵을 사용해서 Redis 설정하기
content_template: templates/tutorial
---

{{% capture overview %}}

이 페이지에서는 컨피그 맵을 사용해서 Redis를 설정하는 방법에 대한 실세계 예제를 제공하고, [컨피그 맵을 사용해서 컨테이너 설정하기](/docs/tasks/configure-pod-container/configure-pod-configmap/) 태스크로 빌드를 한다.

{{% /capture %}}

{{% capture objectives %}}

* 다음을 포함하는 `kustomization.yaml` 파일을 생성한다.
  * 컨피그 맵 생성자
  * 컨피그 맵을 사용하는 파드 리소스
* `kubectl apply -k ./`를 실행하여 작업한 디렉토리를 적용한다.
* 구성이 잘 적용되었는지 확인한다.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* 예시는 `kubectl` 1.14 이상 버전에서 동작한다.
* [컨피그 맵을 사용해서 컨테이너 설정하기](/docs/tasks/configure-pod-container/configure-pod-configmap/)를 이해한다.

{{% /capture %}}

{{% capture lessoncontent %}}


## 실세상 예제: 컨피그 맵을 사용해서 Redis 설정하기

아래의 단계를 통해서 컨피그 맵에 저장된 데이터를 사용해서 Redis 캐시를 설정할 수 있다.

첫째, `redis-config` 파일에서 컨피그 맵을 포함한 `kustomization.yaml`를 생성한다.

{{< codenew file="pods/config/redis-config" >}}

```shell
curl -OL https://k8s.io/examples/pods/config/redis-config

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-redis-config
  files:
  - redis-config
EOF
```

`kustomization.yaml`에 파드 리소스 구성을 추가한다.

{{< codenew file="pods/config/redis-pod.yaml" >}}

```shell
curl -OL https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml

cat <<EOF >>./kustomization.yaml
resources:
- redis-pod.yaml
EOF
```

컨피그 맵과 파드 개체를 생성하도록 kustomization 디렉토리를 적용한다.

```shell
kubectl apply -k .
```

생성된 오브젝트를 확인한다.
```shell
> kubectl get -k .
NAME                                        DATA   AGE
configmap/example-redis-config-dgh9dg555m   1      52s

NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          52s
```

이 예제에서는 설정 볼륨이 `/redis-master`에 마운트되어 있다.
`redis-config` 키를 `redis.conf`라는 이름의 파일에 추가하기 위해 `path`를 사용한다.
따라서, Redis 설정을 위한 파일 경로는 `/redis-master/redis.conf`이다.
이곳이 이미지가 Redis 마스터를 위한 설정 파일을 찾는 곳이다.

설정이 올바르게 적용되었는지 확인하기 위해서,
`kubectl exec`를 사용해 파드 속에서 `redis-cli` 툴을 실행해 본다.

```shell
kubectl exec -it redis redis-cli
127.0.0.1:6379> CONFIG GET maxmemory
1) "maxmemory"
2) "2097152"
127.0.0.1:6379> CONFIG GET maxmemory-policy
1) "maxmemory-policy"
2) "allkeys-lru"
```

{{% /capture %}}

{{% capture whatsnext %}}

* [컨피그 맵](/docs/tasks/configure-pod-container/configure-pod-configmap/) 배우기.

{{% /capture %}}



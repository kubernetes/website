---
title: 일부 노드에서만 파드 실행하기
content_type: task
weight: 30
---
<!-- overview -->

이 페이지에서는 {{<glossary_tooltip term_id="daemonset" text="데몬셋(DaemonSet)">}}의 일부인 {{<glossary_tooltip term_id="pod" text="파드">}}를 일부 {{<glossary_tooltip term_id="node" text="노드">}}에만 실행하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## 일부 노드에만 파드 실행하기

{{<glossary_tooltip term_id="daemonset" text="데몬셋">}}을 실행하고 싶지만 로컬 SSD(솔리드 스테이트) 스토리지가 있는 노드에만
해당 데몬 파드를 실행해야 한다고 가정해보자. 예를 들어, 파드가 노드에 캐시 서비스를 제공하는 경우에,
캐시는 지연 시간이 짧은 로컬 스토리지를 사용할 수 있는 경우에만 유용하다.

### 1단계: 노드에 레이블을 추가하기

SSD가 있는 노드에 `ssd=true` 레이블을 추가한다.

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### 2단계: 매니페스트 생성하기

SSD 레이블이 지정된 노드에만 데몬 파드를 프로비저닝(provision)하는 {{<glossary_tooltip term_id="daemonset" text="데몬셋">}}을 생성해보자.


다음으로, `nodeSelector`를 사용하여 데몬셋이 `ssd` 레이블이
`"true"`로 설정된 노드에만 파드를 실행하도록 한다.

{{<codenew file="controllers/daemonset-label-selector.yaml">}}

### 3단계: 데몬셋 생성하기

매니페스트에서 `kubectl create` 또는 `kubectl apply`를 사용하여 데몬셋을 생성한다.

다른 노드에 `ssd=true`로 레이블을 지정해보자.

```shell
kubectl label nodes example-node-3 ssd=true
```

노드에 레이블을 지정하면 컨트롤 플레인(이 경우엔, 데몬셋 컨트롤러)이
해당 노드에 새 데몬 파드를 실행하도록 자동으로 트리거된다.

```shell
kubectl get pods -o wide
```
출력은 다음과 같을 것이다.

```
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
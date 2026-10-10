---
title: 특정 노드에서만 파드 실행하기
content_type: task
weight: 30
---
<!-- overview -->

이 페이지는 {{<glossary_tooltip term_id="daemonset" text="데몬셋(DaemonSet)">}}의 일부로서, 특정 {{<glossary_tooltip term_id="node" text="노드">}}에서만 {{<glossary_tooltip term_id="pod" text="파드">}}를 실행하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## 특정 노드에서만 파드 실행하기

{{<glossary_tooltip term_id="daemonset" text="데몬셋">}}을 실행하려고 하는데, 로컬 솔리드 스테이트 드라이브(SSD) 
스토리지가 있는 노드에서만 데몬 파드를 실행해야 한다고 가정하자. 예를 들어, 파드는 노드에 캐시 서비스를 제공할 수 있으며, 
이 캐시는 저지연 로컬 스토리지를 사용할 수 있을 때만 유용하다.

### 단계 1: 노드에 레이블 추가하기

SSD가 있는 노드에 `ssd=true`라는 레이블을 추가한다.

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### 단계 2: 매니페스트 생성하기

SSD 레이블이 붙은 {{<glossary_tooltip term_id="node" text="노드">}}에서만 데몬 파드를 프로비저닝하는 {{<glossary_tooltip term_id="daemonset" text="데몬셋">}}을 생성해보자.


다음으로, `nodeSelector`를 사용하여 데몬셋이 `ssd` 레이블이 `"true"`로 설정된 
노드에서만 파드를 실행하도록 한다.

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

### 단계 3: 데몬셋 생성하기

`kubectl create` 또는 `kubectl apply`를 사용하여 매니페스트로부터 데몬셋을 생성한다.

다른 노드에도 `ssd=true` 레이블을 지정해보자.

```shell
kubectl label nodes example-node-3 ssd=true
```

노드에 레이블을 지정하면 컨트롤 플레인(구체적으로, 데몬셋 컨트롤러)이 자동으로 해당 노드에서 
새로운 데몬 파드를 실행한다.

```shell
kubectl get pods -o wide
```
출력 결과는 다음과 비슷하다.

```
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
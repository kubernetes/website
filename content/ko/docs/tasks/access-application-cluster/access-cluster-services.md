---
title: 클러스터에서 실행되는 서비스에 접근
content_type: task
---

<!-- overview -->
이 페이지는 쿠버네티스 클러스터에서 실행되는 서비스에 연결하는 방법을 보여준다.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## 클러스터에서 실행되는 서비스에 접근

쿠버네티스에서, [노드](/ko/docs/concepts/architecture/nodes/),
[파드](/ko/docs/concepts/workloads/pods/) 및 [서비스](/ko/docs/concepts/services-networking/service/)는 모두
고유한 IP를 가진다. 당신의 데스크탑 PC와 같은 클러스터 외부 장비에서는
클러스터 상의 노드 IP, 파드 IP, 서비스 IP로 라우팅되지 않아서 
접근할 수 없을 것이다.

### 연결하는 방법

클러스터 외부에서 노드, 파드 및 서비스에 접속하기 위한 몇 가지 옵션이 있다.

  - 퍼블릭 IP를 통해 서비스에 접근한다.
    - 클러스터 외부에서 접근할 수 있도록 `NodePort` 또는 `LoadBalancer` 타입의
      서비스를 사용한다. [서비스](/ko/docs/concepts/services-networking/service/)와
      [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) 문서를 참고한다.
    - 클러스터 환경에 따라, 서비스는 회사 네트워크에만 노출되기도 하며,
      인터넷에 노출되는 경우도 있다. 이 경우 노출되는 서비스의 보안 여부를 고려해야 한다.
      해당 서비스는 자체적으로 인증을 수행하는가?
    - 파드는 서비스 뒤에 위치시킨다. 디버깅과 같은 목적으로 레플리카 집합에서 특정 파드에 접근하려면,
      파드에 고유한 레이블을 배치하고 이 레이블을 선택하는 새 서비스를 생성한다.
    - 대부분의 경우, 애플리케이션 개발자가 nodeIP를 통해 노드에 직접
      접근할 필요는 없다.
  - 프록시 작업(Proxy Verb)을 사용하여 서비스, 노드 또는 파드에 접근한다.
    - 원격 서비스에 접근하기 전에 apiserver 인증과 권한 부여를 수행한다.
      서비스가 인터넷에 노출되거나, 노드 IP의 포트에 접근하거나, 디버깅하기에
      충분히 안전하지 않은 경우 사용한다.
    - 프록시는 일부 웹 애플리케이션에 문제를 일으킬 수 있다.
    - HTTP/HTTPS에서만 작동한다.
    - [여기](#apiserver-프록시-url-수동-구성)에 설명되어 있다.
  - 클러스터의 노드 또는 파드에서 접근한다.
    - 파드를 실행한 다음, [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)를 사용하여 셸에 연결한다.
      해당 셸에서 다른 노드, 파드 및 서비스에 연결한다.
    - 일부 클러스터는 클러스터의 노드로 ssh를 통해 접근하는 것을 허용한다. 거기에서 클러스터 서비스에
      접근할 수 있다. 이것은 비표준 방법이며, 일부 클러스터에서는 작동하지만 다른 클러스터에서는
      작동하지 않는다. 브라우저 및 기타 도구가 설치되거나 설치되지 않을 수 있다. 클러스터 DNS가 작동하지 않을 수도 있다.

### 빌트인 서비스 검색

일반적으로 kube-system에 의해 클러스터에 실행되는 몇 가지 서비스가 있다. 
`kubectl cluster-info` 커맨드로 이 서비스의 리스트를 볼 수 있다.

```shell
kubectl cluster-info
```

출력은 다음과 비슷하다.

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

각 서비스에 접근하기 위한 프록시-작업 URL이 표시된다.
예를 들어, 이 클러스터에는 `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` 로
접근할 수 있는 (Elasticsearch를 사용한) 클러스터 수준 로깅이 활성화되어 있다. 적합한 자격 증명이 전달되는 경우나 kubectl proxy를 통해 도달할 수 있다. 예를 들어 다음의 URL에서 확인할 수 있다.
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.

{{< note >}}
자격 증명을 전달하거나 kubectl proxy를 사용하는 방법은 [쿠버네티스 API를 사용하여 클러스터에 접근하기](/ko/docs/tasks/administer-cluster/access-cluster-api/)를 참고한다.
{{< /note >}}

#### apiserver 프록시 URL 수동 구성

위에서 언급한 것처럼, `kubectl cluster-info` 명령을 사용하여 서비스의 프록시 URL을 검색한다. 서비스 엔드포인트, 접미사 및 매개 변수를 포함하는 프록시 URL을 작성하려면, 서비스의 프록시 URL에 추가하면 된다.
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

포트에 대한 이름을 지정하지 않은 경우, URL에 *port_name* 을 지정할 필요가 없다. 또한, 이름이 지정된 포트와 지정되지 않은 포트 모두에 대해, *port_name* 자리에 포트 번호를 기재할 수도 있다.

기본적으로, API 서버는 서비스로의 프록시를 HTTP로 제공한다. HTTPS를 사용하려면, 서비스 이름 앞에 `https:`를 추가한다.
`http://<쿠버네티스_컨트롤_플레인_주소>/api/v1/namespaces/<네임스페이스_이름>/services/<서비스_이름>/proxy`

URL에서 `<서비스_이름>`이 지원하는 형식은 다음과 같다.

* `<서비스_이름>` - 기본 포트 또는 이름이 지정되지 않은 포트로 http를 사용하여 프록시
* `<서비스_이름>:<포트_이름>` - 기재된 포트 이름 또는 포트 번호로 http를 사용하여 프록시
* `https:<서비스_이름>:` - 기본 포트 또는 이름이 지정되지 않은 포트로 https를 사용하여 프록시(맨 끝의 콜론에 유의)
* `https:<서비스_이름>:<포트_이름>` - 기재된 포트 이름 또는 포트 번호로 https를 사용하여 프록시

##### 예제

* Elasticsearch 서비스 엔드포인트 `_search?q=user:kimchy` 에 접근하려면, 다음을 사용한다.

    ```
    http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
    ```

* Elasticsearch 클러스터 상태 정보 `_cluster/health?pretty=true` 에 접근하려면, 다음을 사용한다.

    ```
    https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
    ```

    상태 정보는 다음과 비슷하다.

    ```json
    {
      "cluster_name" : "kubernetes_logging",
      "status" : "yellow",
      "timed_out" : false,
      "number_of_nodes" : 1,
      "number_of_data_nodes" : 1,
      "active_primary_shards" : 5,
      "active_shards" : 5,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 5
    }
    ```

* *https* Elasticsearch 서비스 상태 정보 `_cluster/health?pretty=true` 에 접근하려면, 다음을 사용한다.

    ```
    https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging/proxy/_cluster/health?pretty=true
    ```

#### 웹 브라우저를 사용하여 클러스터에서 실행되는 서비스에 접근

브라우저의 주소 표시줄에 apiserver 프록시 URL을 넣을 수 있다. 그러나,

  - 웹 브라우저는 일반적으로 토큰을 전달할 수 없으므로, 기본 (비밀번호) 인증을 사용해야 할 수도 있다. Apiserver는 기본 인증을 수락하도록 구성할 수 있지만,
    클러스터는 기본 인증을 수락하도록 구성되지 않을 수 있다.
  - 일부 웹 앱, 특히 프록시 경로 접두사를 인식하지 못하는 방식으로 URL을 구성하는 클라이언트 측 자바스크립트가 있는
    웹 앱이 작동하지 않을 수 있다.

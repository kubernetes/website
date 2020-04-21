---
content_template: templates/concept
title: 엘라스틱서치(Elasticsearch) 및 키바나(Kibana)를 사용한 로깅
---

{{% capture overview %}}

Google 컴퓨트 엔진(Compute Engine, GCE) 플랫폼에서, 기본 로깅 지원은
[스택드라이버(Stackdriver) 로깅](https://cloud.google.com/logging/)을 대상으로 한다. 이는
[스택드라이버 로깅으로 로깅하기](/docs/user-guide/logging/stackdriver)에 자세히 설명되어 있다.

이 문서에서는 GCE에서 운영할 때 스택드라이버 로깅의 대안으로,
[엘라스틱서치](https://www.elastic.co/products/elasticsearch)에 로그를 수집하고
[키바나](https://www.elastic.co/products/kibana)를 사용하여 볼 수 있도록
클러스터를 설정하는 방법에 대해 설명한다.

{{< note >}}
Google 쿠버네티스 엔진(Kubernetes Engine)에서 호스팅되는 쿠버네티스 클러스터에는 엘라스틱서치 및 키바나를 자동으로 배포할 수 없다. 수동으로 배포해야 한다.
{{< /note >}}

{{% /capture %}}

{{% capture body %}}

클러스터 로깅에 엘라스틱서치, 키바나를 사용하려면 kube-up.sh를 사용하여
클러스터를 생성할 때 아래와 같이 다음의 환경 변수를
설정해야 한다.

```shell
KUBE_LOGGING_DESTINATION=elasticsearch
```

또한 `KUBE_ENABLE_NODE_LOGGING=true`(GCE 플랫폼의 기본값)인지 확인해야 한다.

이제, 클러스터를 만들 때, 각 노드에서 실행되는 Fluentd 로그 수집 데몬이
엘라스틱서치를 대상으로 한다는 메시지가 나타난다.

```shell
cluster/kube-up.sh
```
```
...
Project: kubernetes-satnam
Zone: us-central1-b
... calling kube-up
Project: kubernetes-satnam
Zone: us-central1-b
+++ Staging server tars to Google Storage: gs://kubernetes-staging-e6d0e81793/devel
+++ kubernetes-server-linux-amd64.tar.gz uploaded (sha1 = 6987c098277871b6d69623141276924ab687f89d)
+++ kubernetes-salt.tar.gz uploaded (sha1 = bdfc83ed6b60fa9e3bff9004b542cfc643464cd0)
Looking for already existing resources
Starting master and configuring firewalls
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/zones/us-central1-b/disks/kubernetes-master-pd].
NAME                 ZONE          SIZE_GB TYPE   STATUS
kubernetes-master-pd us-central1-b 20      pd-ssd READY
Created [https://www.googleapis.com/compute/v1/projects/kubernetes-satnam/regions/us-central1/addresses/kubernetes-master-ip].
+++ Logging using Fluentd to elasticsearch
```

노드별 Fluentd 파드, 엘라스틱서치 파드 및 키바나 파드는
클러스터가 활성화된 직후 kube-system 네임스페이스에서 모두 실행되어야
한다.

```shell
kubectl get pods --namespace=kube-system
```
```
NAME                                           READY     STATUS    RESTARTS   AGE
elasticsearch-logging-v1-78nog                 1/1       Running   0          2h
elasticsearch-logging-v1-nj2nb                 1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-5oq0     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-6896     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-l1ds     1/1       Running   0          2h
fluentd-elasticsearch-kubernetes-node-lz9j     1/1       Running   0          2h
kibana-logging-v1-bhpo8                        1/1       Running   0          2h
kube-dns-v3-7r1l9                              3/3       Running   0          2h
monitoring-heapster-v4-yl332                   1/1       Running   1          2h
monitoring-influx-grafana-v1-o79xf             2/2       Running   0          2h
```

`fluentd-elasticsearch` 파드는 각 노드에서 로그를 수집하여
`elasticsearch-logging` 파드로 전송한다. 이 로그는 `elasticsearch-logging` 이라는
[서비스](/ko/docs/concepts/services-networking/service/)의 일부이다. 이
엘라스틱서치 파드는 로그를 저장하고 REST API를 통해 노출한다.
`kibana-logging` 파드는 엘라스틱서치에 저장된 로그를 읽기 위한 웹 UI를
제공하며, `kibana-logging` 이라는 서비스의 일부이다.

엘라스틱서치 및 키바나 서비스는 모두 `kube-system` 네임스페이스에
있으며 공개적으로 접근 가능한 IP 주소를 통해 직접 노출되지 않는다. 이를 위해,
[클러스터에서 실행 중인 서비스 접근](/ko/docs/tasks/access-application-cluster/access-cluster/#클러스터에서-실행되는-서비스로-액세스)에 대한 지침을 참고한다.

브라우저에서 `elasticsearch-logging` 서비스에 접근하려고 하면,
다음과 같은 상태 페이지가 표시된다.

![엘라스틱서치 상태](/images/docs/es-browser.png)

원할 경우, 이제 엘라스틱서치 쿼리를 브라우저에 직접 입력할 수
있다. 수행 방법에 대한 자세한 내용은 [엘라스틱서치의 문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html)를
참조한다.

또는, 키바나를 사용하여 클러스터의 로그를 볼 수도 있다(다시
[클러스터에서 실행되는 서비스에 접근하기 위한 지침](/ko/docs/tasks/access-application-cluster/access-cluster/#클러스터에서-실행되는-서비스로-액세스)을 참고).
키바나 URL을 처음 방문하면 수집된 로그 보기를
구성하도록 요청하는 페이지가 표시된다. 시계열 값에
대한 옵션을 선택하고 `@timestamp` 를 선택한다. 다음 페이지에서
`Discover` 탭을 선택하면 수집된 로그를 볼 수 있다.
로그를 정기적으로 새로 고치려면 새로 고침 간격을 5초로
설정할 수 있다.

키바나 뷰어에서 수집된 로그의 일반적인 보기는 다음과 같다.

![키바나 로그](/images/docs/kibana-logs.png)

{{% /capture %}}

{{% capture whatsnext %}}

키바나는 로그를 탐색하기 위한 모든 종류의 강력한 옵션을 제공한다! 이를 파헤치는 방법에 대한
아이디어는 [키바나의 문서](https://www.elastic.co/guide/en/kibana/current/discover.html)를 확인한다.

{{% /capture %}}

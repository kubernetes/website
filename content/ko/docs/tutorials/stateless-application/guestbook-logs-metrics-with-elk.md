---
title: "예시: PHP / Redis 방명록 예제에 로깅과 메트릭스 추가"
reviewers:
content_template: templates/tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "예시: PHP / Redis 방명록 예제에 로깅과 메트릭스 추가"
---

{{% capture overview %}}
이 튜토리얼은 [레디스(Redis)를 이용한 PHP 방명록](../guestbook) 튜토리얼을 기반으로 한다. 엘라스틱(Elastic)의 경량 로그, 메트릭, 네트워크 데이터 오픈소스 배송기인 *비트(Beats)* 를 방명록과 동일한 쿠버네티스 클러스터에 배포한다. 비트는 데이터를 수집하고 구문분석하여 엘라스틱서치(Elasticsearch)에 색인화하므로, 키바나(Kibana)에서 동작 정보를 결과로 보며 분석할 수 있다. 이 예시는 다음과 같이 구성되어 있다.

* [레디스를 이용한 PHP 방명록](../guestbook)을 실행한 인스턴스
* 엘라스틱서치와 키바나
* 파일비트(Filebeat)
* 메트릭비트(Metricbeat)
* 패킷비트(Packetbeat)

{{% /capture %}}

{{% capture objectives %}}
* 레디스를 이용한 PHP 방명록 시작.
* kube-state-metrics 설치.
* 쿠버네티스 시크릿 생성.
* 비트 배포.
* 로그와 메트릭의 대시보드 보기.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}

추가로 다음이 필요하다.

* 실행 중인 [레디스를 이용한 PHP 방명록](../guestbook) 튜토리얼의 배포본.

* 실행 중인 엘라스틱서치와 키바나 디플로이먼트. [엘라스틱 클라우드(Elastic Cloud)의 엘라스틱서치 서비스](https://cloud.elastic.co)를 사용하거나, [파일을 내려받아](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) 워크스테이션이나 서버에서 운영하거나, [엘라스틱 Helm 차트](https://github.com/elastic/helm-charts)를 이용한다.

{{% /capture %}}

{{% capture lessoncontent %}}

## 레디스를 이용한 PHP 방명록 시작
이 튜토리얼은 [레디스를 이용한 PHP 방명록](../guestbook)을 기반으로 한다. 실행 중인 이 방명록 애플리케이션을 가지고 있다면, 모니터링할 수 있다. 그렇지않았다면 다음 방법을 따라 방명록을 배포하고 **정리하기** 단계는 수행하지 말자. 실행 중인 방명록을 갖게 되면 이 페이지로 돌아오자.

## 클러스터 롤 바인딩 추가
[클러스터 단위 롤 바인딩](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding)을 생성하여, 클러스터 수준(kube-system 안에)으로 kube-state-metrics와 비트를 배포할 수 있게 하자.

```shell
kubectl create clusterrolebinding cluster-admin-binding \
 --clusterrole=cluster-admin --user=<your email associated with the k8s provider account>
```

## kube-state-metrics 설치

[*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics)는 쿠버네티스 API 서버를 모니터링하며 오브젝트 상태에 대한 메트릭을 생성하는 간단한 서비스이다. 이런 메트릭을 메트릭스비트(Metricbeat)이 보고한다. 방명록이 실행된 쿠버네티스 클러스터에서 kube-state-metrics을 추가하자.

### kube-state-metrics 실행 여부 확인
```shell
kubectl get pods --namespace=kube-system | grep kube-state
```
### 필요하면 kube-state-metrics 설치

```shell
git clone https://github.com/kubernetes/kube-state-metrics.git kube-state-metrics
kubectl create -f kube-state-metrics/kubernetes
kubectl get pods --namespace=kube-system | grep kube-state
```
kube-state-metrics이 실행 중이고 준비되었는지 확인하자
```shell
kubectl get pods -n kube-system -l k8s-app=kube-state-metrics
```

출력
```shell
NAME                                 READY   STATUS    RESTARTS   AGE
kube-state-metrics-89d656bf8-vdthm   2/2     Running     0          21s
```
## 엘라스틱의 예제를 GitHub 리포지터리에 클론하자
```shell
git clone https://github.com/elastic/examples.git
```

나머지 명령어는 `examples/beats-k8s-send-anywhere` 디렉터리의 파일을 참조할 것이라, 그쪽으로 현재 디렉터리를 변경하자.
```shell
cd examples/beats-k8s-send-anywhere
```

## 쿠버네티스 시크릿 만들기
쿠버네티스 {{< glossary_tooltip text="시크릿" term_id="secret" >}}은 암호나 토큰, 키 같이 소량의 민감한 데이터의 포함하는 오브젝트이다. 이러한 정보는 다른 방식으로도 파드 스펙이나 이미지에 넣을 수 있을 것이다. 시크릿 오브젝트에 넣으면 이것이 어떻게 사용되는지 다양하게 제어할 수 있고, 우발적인 노출 사고의 위험이 줄일 수 있다.

{{< note >}}
여기에는 방식이 나뉘는데, 하나는 *자체 관리(Self managed)*로 엘라스틱서치와 키바나(Elastic Helm 차트를 이용하여 사용자 서버를 구동하는)를 사용하는 경우와 나머지는 엘라스틱 클라우드의 엘라스틱서치 서비스의 *관리 서비스(Managed service)*를 사용하는 방식이다. 이 튜토리얼에서는 사용할 엘라스틱서치와 키바나 시스템의 종류에 따라 시크릿을 만들어야 한다.
{{< /note >}}

{{< tabs name="tab_with_md" >}}
{{% tab name="자체 관리(Self Managed)" %}}

### 자체 관리
엘라스틱 클라우드의 엘라스틱서치 서비스로 연결한다면 **관리 서비스** 탭으로 전환한다.

### 자격증명(credentials) 설정
자체 관리 엘라스틱서치와 키바나(셀프 메니지드는 사실상 엘라스틱 클라우드의 매니지드 엘라스틱서치와 다르다) 서비스에 접속할 때에 4개 파일을 수정하여 쿠버네티스 시크릿을 생성한다. 파일은 다음과 같다.

1. ELASTICSEARCH_HOSTS
1. ELASTICSEARCH_PASSWORD
1. ELASTICSEARCH_USERNAME
1. KIBANA_HOST

이 정보를 엘라스틱서치 클러스터와 키바나 호스트에 지정하자. 여기 예시가 있다.

#### `ELASTICSEARCH_HOSTS`
1. 엘라스틱의 엘라스틱서치 Helm 차트에서 노드 그룹(nodeGroup)

    ```shell
    ["http://elasticsearch-master.default.svc.cluster.local:9200"]
    ```
1. Mac을 위한 Docker에서 비트를 운영 중인 Mac에서 운영하는 단일 엘라스틱서치 노드

    ```shell
    ["http://host.docker.internal:9200"]
    ```
1. VM이나 물리 장비에서 운영 중인 두 개의 ELASTICSEARCH 노드.

    ```shell
    ["http://host1.example.com:9200", "http://host2.example.com:9200"]
    ```
`ELASTICSEARCH_HOSTS` 수정하자.
```shell
vi ELASTICSEARCH_HOSTS
```

#### `ELASTICSEARCH_PASSWORD`
화이트 스페이스나 인용 부호나 <> 도 없는 암호이다.

    <사용자의 시크릿 암호>

`ELASTICSEARCH_PASSWORD` 수정하자.
```shell
vi ELASTICSEARCH_PASSWORD
```

#### `ELASTICSEARCH_USERNAME`
화이트 스페이스나 인용 부호나 <> 도 없는 이름이다.

    <엘라스틱서치를 위한 수집 사용자 이름>

`ELASTICSEARCH_USERNAME` 수정하자.
```shell
vi ELASTICSEARCH_USERNAME
```

#### `KIBANA_HOST`

1.엘라스틱의 키바나 Helm 차트의 인스턴스이다. 하위 도메인 `default`는 기본 네임스페이스를 참조한다. 다른 네임 스페이슬ㄹ 사용하여 Helm 차트를 배포한 경우 하위 도메인이 다릅니다.

    ```shell
    "kibana-kibana.default.svc.cluster.local:5601"
    ```
1. Mac 용 Docker에서 실행하는 비트가 있는 Mac에서 실행하는 키바나 인스턴스

    ```shell
    "host.docker.internal:5601"
    ```
1. 가상머신이나 물리적 하드웨어에서 실행 중인 두 개의 엘라스틱서치 노드

    ```shell
    "host1.example.com:5601"
    ```
`KIBANA_HOST`를 편집하자.
```shell
vi KIBANA_HOST
```

### 쿠버네티스 시크릿 만들기
이 명령은 방금 편집한 파일을 기반으로 쿠버네티스의 시스템 수준의 네임스페이스(kube-system)에 시크릿을 만든다.

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTICSEARCH_HOSTS \
      --from-file=./ELASTICSEARCH_PASSWORD \
      --from-file=./ELASTICSEARCH_USERNAME \
      --from-file=./KIBANA_HOST \
      --namespace=kube-system

{{% /tab %}}
{{% tab name="관리 서비스(Managed service)" %}}

## 관리 서비스
이 탭은 엘라스틱 클라우드에서 엘라스틱서치 서비스 만에 대한 것으로, 이미 자체 관리 엘라스틱서치와 키바나 배포로 시크릿을 생성했다면, [비트 배포](#deploy-the-beats)를 계속하자.
### 자격증명(credentials) 설정
엘라스틱 클라우드에서 관리되는 엘라스틱 서비스에 연결할 때, 쿠버네티스 시크릿을 생성하기 위해 편집할 두 파일이 있다. 파일은 다음과 같다.

1. ELASTIC_CLOUD_AUTH
1. ELASTIC_CLOUD_ID

디플로이먼트를 생성할 때에 엘라스틱서치 콘솔에서 제공한 정보로 이를 설정한다. 여기 예시들이 있다.

#### ELASTIC_CLOUD_ID
```shell
devk8s:ABC123def456ghi789jkl123mno456pqr789stu123vwx456yza789bcd012efg345hijj678klm901nop345zEwOTJjMTc5YWQ0YzQ5OThlN2U5MjAwYTg4NTIzZQ==
```

#### ELASTIC_CLOUD_AUTH
사용자 이름, 콜론(`:`) 및 비밀번호인데, 공백 또는 따옴표는 없다.
```shell
elastic:VFxJJf9Tjwer90wnfTghsn8w
```

### 필요 파일 편집하기
```shell
vi ELASTIC_CLOUD_ID
vi ELASTIC_CLOUD_AUTH
```
### 쿠버네티스 시크릿 생성하기
이 명령은 방금 편집한 파일을 기반으로 쿠버네티스의 시스템 수준의 네임스페이스(kube-system)에 시크릿을 생성한다.

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTIC_CLOUD_ID \
      --from-file=./ELASTIC_CLOUD_AUTH \
      --namespace=kube-system

  {{% /tab %}}
{{< /tabs >}}

## 비트 배포하기 {#deploy-the-beats}
비트마다 메니페스트 파일을 제공한다. 이 메니페스트 파일은 앞서 생성한 시크릿을 사용하여, 엘라스틱서치 및 키바나 서버에 연결하도록 비트를 구성한다.

### 파일비트에 대해
파일비트는 쿠버네티스 노드와 해당 노두에서 실행되는 각 파드에서 실행되는 컨테이너의 로그를 수집한다. 파일비트는 {{< glossary_tooltip text="데몬 셋" term_id="daemonset" >}}으로 배포한다. 파일비트는 쿠버네티스 클러스터에서 실행 중인 애플리케이션을 자동 검색할 수 있다. 시작시에 파일비트는 기존 컨테이너를 검색하고 이에 적절한 구성을 시작하고 새 시작/종료 이벤트를 감시한다.

아래 내용은 파일비트가 방명록 애플리케이션과 함께 배포된 레디스 컨테이너에서 레디스 로그를 찾아 구문분석할 수 있게 하는 자동 검색 구성이다. 이 구성은 `filebeat-kubernetes.yaml`파일에 있다.

```yaml
- condition.contains:
    kubernetes.labels.app: redis
  config:
    - module: redis
      log:
        input:
          type: docker
          containers.ids:
            - ${data.kubernetes.container.id}
      slowlog:
        enabled: true
        var.hosts: ["${data.host}:${data.port}"]
```
이것은 `redis` 컨테이너가 `app` 문자열을 포함하는 레이블로 감지될 때에 파일비트 모듈 `redis`를 적용하도록 파일비트를 구성한다. 레디스 모듈은 Docker 입력 유형을 사용하여 컨테이너에서 `로그` 스트림을 수집할 수 있다(이 레디스 컨테이너의 STDOUT 스트림과 연관된 쿠버네티스 노드에서 파일 읽기). 또한 이 모듈은 컨테이너 메타 데이터에 제공되는 적절한 파드 호스트와 포트에 연결하여 레디스의 `slowlog` 항목을 수집할 수 있다.

### 파일비트 배포
```shell
kubectl create -f filebeat-kubernetes.yaml
```

#### 확인
```shell
kubectl get pods -n kube-system -l k8s-app=filebeat-dynamic
```

### 메트릭비트에 대해
메트릭비트 자동 검색은 파일비트와 같은 방식으로 구성된다. 다음은 레디스 컨테이너에 대한 메트릭비트 자동 검색 구성이다. 이 구성은 `metricbeat-kubernetes.yaml`에 있다.
```yaml
- condition.equals:
    kubernetes.labels.tier: backend
  config:
    - module: redis
      metricsets: ["info", "keyspace"]
      period: 10s

      # Redis hosts
      hosts: ["${data.host}:${data.port}"]
```
이것은 컨테이너가 `tier` 레이블이 `backend` 문자열과 같은 레이블로 감지될 때에 메트릭비트 모듈 `redis`를 적용하도록 메트릭비트를 구성한다. `redis` 모듈은 컨테이너 메타데이터에 제공되는 적절한 파드 호스트와 포트에 연결하여 컨테이너에서 `info` 및 `keyspace` 메트릭을 수집할 수 있다.

### 메트릭비트 배포
```shell
kubectl create -f metricbeat-kubernetes.yaml
```
#### 확인
```shell
kubectl get pods -n kube-system -l k8s-app=metricbeat
```

### 패킷비트에 대해
패킷비트 구성은 파일비트와 메트릭비트와는 다르다. 컨테이너 레이블과 일치시킬 패턴을 지정하지 않고, 구성은 관련 프로토콜 및 포트 번호를 기반으로 한다. 아래는 포트 번호의 하위 집합이다.

{{< note >}}
비표준 포트로 서비스를 실행했다면 해당 포트를 `filebeat.yaml`에 적절한 유형에 추가하고, 패킷비트 데몬 셋을 삭제하고 생성한다.
{{< /note >}}

```yaml
packetbeat.interfaces.device: any

packetbeat.protocols:
- type: dns
  ports: [53]
  include_authorities: true
  include_additionals: true

- type: http
  ports: [80, 8000, 8080, 9200]

- type: mysql
  ports: [3306]

- type: redis
  ports: [6379]

packetbeat.flows:
  timeout: 30s
  period: 10s
```

#### 패킷비트 배포하기
```shell
kubectl create -f packetbeat-kubernetes.yaml
```

#### 확인하기
```shell
kubectl get pods -n kube-system -l k8s-app=packetbeat-dynamic
```

## 키바나에서 뷰

브라우저에서 키바나를 연 다음 **대시보드** 애플리케이션을 열자. 검색창에 kubernetes 를 입력하고 쿠버네티스를 위한 메트릭비트 대시보드를 클릭한다. 이 대시보드는 노드 상태, 배포 등을 보고한다.

대시보드 페이지에 패킷비트를 검색하고 패킷비트의 개요 페이지를 보자.

마찬가지로 아파치(Apache)와 레디스를 위한 대시보드를 본다. 각 로그와 메트릭에 대한 대시보드가 표시된다. 이 아파치 메트릭비트 대시보드는 비어 있다. 아파치 파일비트 대시보드를 보고, 맨 아래로 스크롤하여 아파치 오류 로그를 보자. 아파치에 사용할 메트릭이 없는 이유를 알려줄 것이다.

메트릭비트에서 아파치 메트릭을 가져올 수 있게 하려면, mod-status 구성 파일을 포함한 컨피그맵을 추가하고 방명록을 재배포하여 서버 상태를 활성화한다.


## 배포를 확장하고 모니터링중인 새 파드를 확인하자
기존 배포를 나열한다.
```shell
kubectl get deployments
```

출력
```shell
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
frontend        3/3     3            3           3h27m
redis-master    1/1     1            1           3h27m
redis-slave     2/2     2            2           3h27m
```

프런트를 두 개의 파드로 축소하자.
```shell
kubectl scale --replicas=2 deployment/frontend
```
출력
```shell
deployment.extensions/frontend scaled
```

## 키바나에서 변화 확인하기
스크린 캡처를 보고, 표시된 필터를 추가하고, 그 열을 뷰에 추가한다. ScalingReplicaSet 항목이 표시되고, 여기에서 이벤트 목록의 맨 위에 풀링되는 이미지, 마운트된 볼륨, 파드 시작 등을 보여준다.
![키바나 디스커버리](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-discover.png)

{{% /capture %}}

{{% capture cleanup %}}
디플로이먼트와 서비스를 삭제하면 실행하는 파드도 삭제된다. 명령어 한 개로 여러 개의 리소스를 삭제하기 위해 레이블을 이용하자.

1. 다음 명령어를 실행하여 모든 파드, 디플로이먼트, 서비스를 삭제하자.

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      kubectl delete -f filebeat-kubernetes.yaml
      kubectl delete -f metricbeat-kubernetes.yaml
      kubectl delete -f packetbeat-kubernetes.yaml
      kubectl delete secret dynamic-logging -n kube-system
      ```

1. 실행 중인 파드가 없음을 확인하기 위해 파드 목록을 조회하자.

      ```shell
      kubectl get pods
      ```

      응답은 다음과 같아야 한다.

      ```
      No resources found.
      ```

{{% /capture %}}

{{% capture whatsnext %}}
* [리소스 모니터링 도구](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)를 공부하자.
* [로깅 아키텍처](/docs/concepts/클러스터-administration/logging/)를 더 읽어본다.
* [애플리케이션 검사 및 디버깅](/docs/tasks/debug-application-cluster/)을 더 읽어본다.
* [애플리케이션 문제 해결](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)을 더 읽어본다.
{{% /capture %}}

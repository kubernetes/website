---
title: 대형 클러스터 구축
weight: 20
---

## 지원

{{< param "version" >}} 버전에서, 쿠버네티스는 노드 5000개까지의 클러스터를 지원한다. 보다 정확하게는, 다음 기준을 *모두* 만족하는 설정을 지원한다.

* 노드 5000개 이하
* 전체 파드 150000개 이하
* 전체 컨테이너 300000개 이하
* 노드 당 파드 100개 이하


## 설치

클러스터는 쿠버네티스 에이전트가 구동하는 노드(물리 또는 가상 머신)의 집합이며, "마스터"(클러스터-수준 컨트롤 플레인)에 의해 관리된다.

보통 클러스터 내 노드 수는 플랫폼별 `config-default.sh` 파일 (예를 들면, [GCE의 `config-default.sh`](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh))에 있는 `NUM_NODES` 값에 따라 조절된다.

하지만 단순히 값만 매우 크게 바꾼다면, 클라우드 프로바이더에 따라 셋업 스크립트가 실패할 수도 있다. 예를 들어, GCE에 배포할 때 쿼터 이슈가 발생하여 클러스터 구축이 실패할 수 있다.

큰 쿠버네티스 클러스터를 설정할 때는 다음 이슈들을 고려해야 한다.

### 쿼터 문제

여러 노드를 가지는 클러스터를 만들 때, 클라우드 프로바이더 쿼터 이슈를 피하기 위해 고려할 점:

* CPU, IP 등의 쿼터를 늘린다.
  * 예를 들어, [GCE의 경우](https://cloud.google.com/compute/docs/resource-quotas) 다음에 관한 쿼터를 늘릴 수 있다.
    * CPU
    * VM 인스턴스
    * 전체 영구 디스크 예약
    * 사용 중인 IP 주소
    * 방화벽 규칙
    * 포워딩 규칙
    * 라우트
    * 대상 풀
* 일부 클라우드 프로바이더는 VM 생성 속도에 상한이 있어, 셋업 스크립트 수행 간 새로운 노드 VM을 생성하는 사이사이에 대기시간이 추가되는 작은 배치가 걸릴 수 있다.

### etcd 저장소

큰 클러스터의 성능 향상을 위해, 우리는 이벤트를 각각의 전용 etcd 인스턴스에 저장한다.

클러스터 생성시의 부가 스트립트이다.

* 추가 ectd 인스턴스 시작 및 설정
* 이벤트를 저장하기 위한 api-server 설정

### 마스터 크기와 마스터 구성 요소

GCE/구글 쿠버네티스 엔진 및 AWS에서, `kube-up`은 클러스터 내 노드의 수에 따라 마스터용으로 적합한 VM 크기를 자동으로 설정한다.
기타 다른 프로바이더의 경우, 수동으로 설정해야 한다. 참고로 GCE에 적용하는 크기는 다음과 같다.

* 1-5 노드: n1-standard-1
* 6-10 노드: n1-standard-2
* 11-100 노드: n1-standard-4
* 101-250 노드: n1-standard-8
* 251-500 노드: n1-standard-16
* 500 노드 이상: n1-standard-32

AWS에 적용하는 크기는 다음과 같다.

* 1-5 노드: m3.medium
* 6-10 노드: m3.large
* 11-100 노드: m3.xlarge
* 101-250 노드: m3.2xlarge
* 251-500 노드: c4.4xlarge
* 500 노드 이상: c4.8xlarge

{{< note >}}
구글 쿠버네티스 엔진에서, 마스터 노드 크기는 클러스터의 크기에 따라 자동적으로 조절된다. 자세한 사항은 [이 블로그 글](https://cloudplatform.googleblog.com/2017/11/Cutting-Cluster-Management-Fees-on-Google-Kubernetes-Engine.html)을 참고하라.

AWS에서, 마스터 노드의 크기는 클러스터 시작 시에 설정된 그대로이며 변경되지 않는다. 이후에 클러스터를 스케일 업/다운하거나 수동으로 노드를 추가/제거하거나 클러스터 오토스케일러를 사용하더라도 그렇다.
{{< /note >}}

### 애드온 자원

[클러스터 애드온](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons)이 메모리 누수 등 노드 상의 가용한 리소스를 모두 소비하는 리소스 이슈를 방지하기 위해, 쿠버네티스는 애드온 컨테이너가 소비할 수 있는 CPU와 메모리 리소스를 제한하는 리소스 상한을 둔다(PR [#10653](http://pr.k8s.io/10653/files)과 [#10778](http://pr.k8s.io/10778/files) 참고). 

예시:

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: k8s.gcr.io/fluentd-gcp:1.16
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

힙스터(Heapster)를 제외하고, 이러한 상한들은 정적이며 4-노드 클러스터에서 구동한 애드온으로부터 수집한 데이터에 기반한 것이다.([#10335](http://issue.k8s.io/10335#issuecomment-117861225) 참고). 애드온이 큰 클러스터에서 구동되면 더 많은 리소스를 소비한다([#5880](http://issue.k8s.io/5880#issuecomment-113984085) 참고). 따라서, 이러한 값의 조정 없이 큰 클러스터를 배포하면, 애드온들이 상한에 걸려 반복적으로 죽을 수 있다.

많은 노드를 가진 클러스터를 생성할 때는 애드온 리소스 이슈를 피하기 위해 다음을 고려하라.

* 다음 애드온을 사용한다면, 클러스터의 크기를 확장할 때 그에 맞게 메모리와 CPU 상한을 규모를 조정하라 (전체 클러스터를 담당하는 각 레플리카는, 메모리와 CPU 사용량이 대체로 클러스터의 크기/부하에 따라 비율적으로 증가할 것이다).
  * [InfluxDB와 Grafana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns, dnsmasq, 사이드카](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/kube-dns.yaml.in)
  * [Kibana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml)
* 다음 애드온들을 쓴다면 클러스터 크기에 따라 레플리카 수를 조절해준다(각각 레플리카가 여러 개 두면 늘어나는 부하를 처리하는 데 도움이 되지만, 레플리카 당 부하도 약간 늘어나게 되므로 CPU/메모리 상한을 높이는 것을 고려해보자):
  * [elasticsearch](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml)
* 다음의 애드온들을 쓴다면, 클러스터 크기에 따라 각각 메모리와 CPU 상한을 조금 더 높이자(노드 당 레플리카 1개만 있어도 클러스터 부하량/크기에 따라 CPU/메모리 사용율은 조금씩 증가한다).
  * [ElasticSearch 플러그인을 적용한 FluentD](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [GCP 플러그인을 적용한 FluentD](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

힙스터의 리소스 상한은 클러스터 최초 크기에 기초하여 동적으로 설정된다([#16185](http://issue.k8s.io/16185)과
[#22940](http://issue.k8s.io/22940) 참조). 힙스터에 리소스가 부족한 경우라면, 
 힙스터 메모리 요청량(상세내용은 해당 PR 참조)을 계산하는 공식을 적용해보자.

애드온 컨테이너가 리소스 상한에 걸리는 것을 탐지하는 방법에 대해서는 [컴퓨트 리소스의 트러블슈팅 섹션](/ko/docs/concepts/configuration/manage-resources-containers/#문제-해결)을 참고하라.

[미래](http://issue.k8s.io/13048)에는 모든 클러스터 애드온의 리소스 상한을 클러스터 크기에 맞게 설정해주고 클러스터를 키우거나 줄일 때 동적으로 조절해줄 수 있기를 기대한다.
이런 기능들에 대한 PR은 언제든 환영한다.

### 시작 시 사소한 노드 오류 허용

다양한 이유로(자세한 내용은 [#18969](https://github.com/kubernetes/kubernetes/issues/18969) 참고) 매우 큰 `NUM_NODES`를 주고 
`kube-up.sh`을 실행하면 제대로 기동되지 않은 극소수의 노드들 때문에 실패할 수 있다.
현재로서는 두 가지 선택지가 있다. 클러스터를 재시작하거나(`kube-down.sh` 한 후 다시 `kube-up.sh` ),
`kube-up.sh` 실행 전에 환경변수 `ALLOWED_NOTREADY_NODES`를 적당한 값으로 설정해주는 것이다. 
이렇게 하면 `NUM_NODES`에 못 미치는 경우에도 `kube-up.sh`이 성공할 수 있다.
실패 원인에 따라 일부 노드들이 늦게 결합되거나, 클러스터가 `NUM_NODES - ALLOWED_NOTREADY_NODES`의 크기로 남을 수 있다.

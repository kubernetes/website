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

<br>

{{< toc >}}

## 설치

클러스터는 쿠버네티스 에이전트가 구동하는 노드(물리 또는 가상 머신)의 집합이며, "마스터"(클러스터-수준 컨트롤 플레인)에 의해 관리된다.

보통 클러스터 내 노드 수는, 플랫폼별 `config-default.sh` 파일 (예를 들면, [GCE의 `config-default.sh`](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/gce/config-default.sh))에 있는 `NUM_NODES` 값에 따라 조절된다.

하지만 단순히 값만 매우 크게 바꾼다면, 클라우드 프로바이더에 따라 셋업 스크립트가 실패하게 되는 경우가 많다. 예를 들어 GCE에 배포할 때 쿼타 이슈가 발생하여 클러스터 구축이 실패할 수 있다.

큰 쿠버네티스 클러스터를 설정할 때는 다음 이슈들을 고려해야 한다.

### 쿼터 문제

여러 노드를 가지는 클러스터를 만들 때, 클라우드 프로바이더 쿼타 이슈를 피하기 위해 고려할 점:

* CPU, IP 등의 쿼타를 늘린다.
  * 예를 들어 [GCE의 경우](https://cloud.google.com/compute/docs/resource-quotas) 다음에 관한 쿼타를 늘릴 수 있다:
    * CPU
    * VM 인스턴스
    * 전체 영구 디스크 예약
    * 사용 중인 IP 주소
    * 방화벽 규칙
    * 포워딩 규칙
    * 라우트
    * 대상 풀
* 일부 클라우드 프로바이더는 VM 생성 속도에 제한이 있어, 셋업 스크립트 수행간 새로운 노드 VM을 생성하는 사이사이에 대기시간이 추가되는 작은 배치가 걸릴 수 있다.

### etcd 저장소

큰 클러스터의 성능 향상을 위해, 우리는 이벤트를 각각의 전용 etcd 인스터스에 저장한다.

클러스터 생성시의 부가 스트립트:

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
구글 쿠버네티스 엔진에서, 마스터 노드 크기는 클러스터의 크기에 따라 자동적으로 조절된다.
자세한 사항은 [이 블로그 글](https://cloudplatform.googleblog.com/2017/11/Cutting-Cluster-Management-Fees-on-Google-Kubernetes-Engine.html)을 참고하라.

AWS에서, 마스터 노드의 크기는 클러스터 시작시에 설정된 그대로이며 변경되지 않는다. 이후에 클러스터를 스케일 업/다운하거나 수동으로 노드를 추가/제거하거나 클러스터 오토스케일러를 사용하더라도 그렇다.
{{< /note >}}

### 애드온 자원
메모리 누수 또는 다른 리소스 이슈를 방지하기 위해
To prevent memory leaks or other resource issues in [cluster addons](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons) from consuming all the resources available on a node, Kubernetes sets resource limits on addon containers to limit the CPU and Memory resources they can consume (See PR [#10653](http://pr.k8s.io/10653/files) and [#10778](http://pr.k8s.io/10778/files)).

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

힙스터를 제외하고, 이러한 제약들은 정적이고 
Except for Heapster, these limits are static and are based on data we collected from addons running on 4-node clusters (see [#10335](http://issue.k8s.io/10335#issuecomment-117861225)). The addons consume a lot more resources when running on large deployment clusters (see [#5880](http://issue.k8s.io/5880#issuecomment-113984085)). So, if a large cluster is deployed without adjusting these values, the addons may continuously get killed because they keep hitting the limits.

To avoid running into cluster addon resource issues, when creating a cluster with many nodes, consider the following:

* Scale memory and CPU limits for each of the following addons, if used, as you scale up the size of cluster (there is one replica of each handling the entire cluster so memory and CPU usage tends to grow proportionally with size/load on cluster):
  * [InfluxDB and Grafana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/influxdb/influxdb-grafana-controller.yaml)
  * [kubedns, dnsmasq, and sidecar](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/kube-dns.yaml.in)
  * [Kibana](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml)
* Scale number of replicas for the following addons, if used, along with the size of cluster (there are multiple replicas of each so increasing replicas should help handle increased load, but, since load per replica also increases slightly, also consider increasing CPU/memory limits):
  * [elasticsearch](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml)
* Increase memory and CPU limits slightly for each of the following addons, if used, along with the size of cluster (there is one replica per node but CPU/memory usage increases slightly along with cluster load/size as well):
  * [FluentD with ElasticSearch Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml)
  * [FluentD with GCP Plugin](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/fluentd-gcp/fluentd-gcp-ds.yaml)

Heapster's resource limits are set dynamically based on the initial size of your cluster (see [#16185](http://issue.k8s.io/16185)
and [#22940](http://issue.k8s.io/22940)). If you find that Heapster is running
out of resources, you should adjust the formulas that compute heapster memory request (see those PRs for details).

For directions on how to detect if addon containers are hitting resource limits, see the [Troubleshooting section of Compute Resources](/docs/concepts/configuration/manage-compute-resources-container/#troubleshooting).

In the [future](http://issue.k8s.io/13048), we anticipate to set all cluster addon resource limits based on cluster size, and to dynamically adjust them if you grow or shrink your cluster.
We welcome PRs that implement those features.

### 시작 시 사소한 노드 오류 허용

다양한 이유로(자세한 내용은 [#18969](https://github.com/kubernetes/kubernetes/issues/18969) 참고) 매우 큰 `NUM_NODES`를 주고 `kube-up.sh`을 실행하면 제대로 기동되지 않은 극소수의 노드들 때문에 실패할 수 있다.

현재로서는 두 가지 선택지가 있다: 클러스터를 재시작하거나(`kube-down.sh` 한 후 다시 `kube-up.sh` ), `kube-up.sh` 실행 전에 환경변수 `ALLOWED_NOTREADY_NODES`를 적당한 값으로 설정해주는 것이다. 이렇게 하면 `NUM_NODES`에 못미치는 경우에도 `kube-up.sh`이 성공할 수 있다. 실패 원인에 따라 일부 노드들이 늦게 조인되거나, 클러스터가 `NUM_NODES - ALLOWED_NOTREADY_NODES`의 크기로 남을 수 있다.

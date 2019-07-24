---
title: 클러스터 관리
content_template: templates/concept
---

{{% capture overview %}}

이 문서는 클러스터의 라이프사이클에 관련된 몇 가지 주제들을 설명한다. 신규 클러스터 생성, 
클러스터의 마스터와 워커 노드들의 업그레이드, 
노드 유지보수(예. 커널 업그레이드) 수행, 운영 중인 클러스터의 
쿠버네티스 API 버전 업그레이드.

{{% /capture %}}


{{% capture body %}}

## 클러스터 생성과 설정

일련의 머신들에 쿠버네티스를 설치하려면, 환경에 맞게 기존의 [시작하기](/docs/setup/) 안내서들 중에 하나를 선택하여 참조한다.

## 클러스터 업그레이드

클러스터 업그레이드 상태의 현황은 제공자에 따라 달라지며, 몇몇 릴리스들은 업그레이드에 각별한 주의를 요하기도 한다. 관리자들에게는 클러스터 업그레이드에 앞서 [릴리스 노트](https://git.k8s.io/kubernetes/CHANGELOG.md)와 버전에 맞는 업그레이드 노트 모두를 검토하도록 권장하고 있다.

### Azure Kubernetes Service (AKS) 클러스터 업그레이드

Azure Kubernetes Service는 클러스터의 컨트롤 플레인과 노드를 손쉽게 셀프 서비스 업그레이드할 수 있게 해준다. 프로세스는 
현재 사용자가 직접 시작하는 방식이며 [Azure AKS 문서](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster)에 설명되어 있다.

### Google Compute Engine 클러스터 업그레이드

Google Compute Engine Open Source (GCE-OSS)는 마스터를 삭제하고 
재생성하는 방식으로 마스터 업그레이드를 지원한다. 하지만 업그레이드 간에 데이터를 보존하기 위해 
동일한 Persistent Disk(PD)를 유지한다.

GCE의 노드 업그레이드는 [관리형 인스턴스 그룹](https://cloud.google.com/compute/docs/instance-groups/)을 사용하며, 각 노드는 
순차적으로 제거된 후에 신규 소프트웨어를 가지고 재생성된다. 해당 노드에서 동작하는 파드들은 
레플리케이션 컨트롤러에 의해서 제어되거나, 롤 아웃 후에 수작업으로 재생성되어야 한다.

open source Google Compute Engine(GCE) 클러스터 업그레이드는 `cluster/gce/upgrade.sh` 스크립트로 제어한다.

`cluster/gce/upgrade.sh -h`를 실행하여 사용법을 알아볼 수 있다.

예를 들어, 마스터만 특정 버전(v1.0.2)로 업그레이드하려고 한다면 다음과 같이 커맨드를 사용한다.

```shell
cluster/gce/upgrade.sh -M v1.0.2
```

이 대신에, 전체 클러스터를 최신 안정 릴리스로 업그레이드하려고 한다면 다음과 같이 커맨드를 사용한다.

```shell
cluster/gce/upgrade.sh release/stable
```

### Google Kubernetes Engine 클러스터 업그레이드

Google Kubernetes Engine은 자동으로 마스터 구성요소들(예. `kube-apiserver`, `kube-scheduler`)을 최신 버전으로 업데이트한다. 이는 운영체제와 마스터 상에서 동작하는 다른 구성요소들의 업그레이드를 처리하기도 한다.

노드 업그레이드 프로세스는 사용자가 직접 시작하는 방식이며 [Google Kubernetes Engine 문서](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade)에 설명되어 있다.

### Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE) 클러스터 업그레이드

Oracle은 당신이 고가용성의 관리형 쿠버네티스 컨트롤 플레인을 가질 수 있도록 사용자를 대신하여 Oracle 컨트롤 플레인 내에 마스터 노드들의 세트를 (그리고 etcd 노드들과 같은 관련 쿠버네티스 인프라스트럭처를) 생성하고 관리한다. 또한 이 마스터 노드들을 다운타임 없이 쿠버네티스 신규 버전으로 유연하게 업그레이드할 수도 있다. 이 기능들은 [OKE 문서](https://docs.cloud.oracle.com/iaas/Content/ContEng/Tasks/contengupgradingk8smasternode.htm)에 설명되어 있다.

### 다른 플랫폼들의 클러스터 업그레이드

다른 제공자들과 도구들은 업그레이드를 다른 방식으로 관리한다. 이들의 업그레이드를 위해서는 이들의 주요 문서를 참조하기를 권장한다.

* [kops](https://github.com/kubernetes/kops)
* [kubespray](https://github.com/kubernetes-incubator/kubespray)
* [CoreOS Tectonic](https://coreos.com/tectonic/docs/latest/admin/upgrade.html)
* [Digital Rebar](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)
* ...

위 리스트에서 언급되지 않은 플랫폼의 클러스터 업그레이드는 [버전 차이 지원(skew)](/docs/setup/release/version-skew-policy/#supported-component-upgrade-order) 페이지 상의 구성요소 업그레이드 순서 부분을 확인해보는 것이 좋다.

## 클러스터 크기 재조정

[노드 자가 등록 모드](/docs/concepts/architecture/nodes/#self-registration-of-nodes)로 운영 중인 클러스터가 리소스가 부족하다면 쉽게 머신들을 더 추가할 수 있다. GCE나 Google Kubernetes Engine을 사용하고 있다면 노드들을 관리하는 인스턴스 그룹의 크기를 재조정하여 이를 수행할 수 있다. 
[Google Cloud 콘솔 페이지](https://console.developers.google.com)를 사용한다면 `Compute > Compute Engine > Instance groups > your group > Edit group`에서 인스턴스들의 숫자를 고쳐서 이를 수행할 수 있으며 gcloud CLI를 사용한다면 다음 커맨드를 사용하여 이를 수행할 수 있다.

```shell
gcloud compute instance-groups managed resize kubernetes-node-pool --size=42 --zone=$ZONE
```

인스턴스 그룹은 신규 머신들에 적절한 이미지를 넣고 시작하는 것을 관리하는 반면에 Kubelet은 자신의 노드를 API 서버에 등록하여 스케줄링할 수 있도록 해준다. 사용자가 인스턴스 그룹을 스케일 다운하면 시스템은 임의로 노드들을 선택하여 죽일 것이다.

다른 환경에서는 사용자가 직접 머신을 구성하고 어떤 머신에서 API 서버가 동작하는지를 Kubelet에 알려줘야 할 수도 있다.

### Azure Kubernetes Service (AKS) 클러스터 크기 재조정

Azure Kubernetes Service는 사용자가 CLI나 Azure 포털에서 클러스터의 크기를 재조정할 수 있게 해주며 [Azure AKS 문서](https://docs.microsoft.com/en-us/azure/aks/scale-cluster)에서 이를 설명하고 있다.


### 클러스터 오토스케일링

GCE나 Google Kubernetes Engine을 사용한다면, 파드가 필요로하는 리소스를 기반으로 클러스터의 크기를 자동으로 
재조정하도록 클러스터를 구성할 수 있다.

[컴퓨트 리소스](/docs/concepts/configuration/manage-compute-resources-container/)에 기술된 것처럼 사용자들은 파드에 얼마만큼의 CPU와 메모리를 할당할 것인지 예약할 수 있다. 
이 정보는 쿠버네티스 스케줄러가 해당 파드를 어디에서 실행시킬 것인지를 결정할 때 사용된다. 
여유 용량이 넉넉한 노드가 없다면 (또는 다른 파드 요구조건을 충족하지 못한다면) 해당 파드는 
다른 파드들이 종료될 때까지 기다리거나 신규 노드가 추가될 때까지 기다린다.

Cluster autoscaler는 스케줄링될 수 없는 파드들을 검색하여 클러스터 내의 다른 노드들과 유사한 신규 노드를 
추가하는 것이 도움이 되는지를 체크한다. 만약 도움이 된다면 대기중인 파드들을 수용하기 위해 클러스터의 크기를 재조정한다.

Cluster autoscaler는 또한 하나 이상의 노드들이 장기간(10분, 하지만 미래에는 변경될 수 있다.)동안 
더 이상 필요하지 않다는 것을 확인했을 때 클러스터를 스케일 다운하기도 한다.

Cluster autoscaler는 인스턴스 그룹(GCE)이나 노드 풀(Google Kubernetes Engine) 단위로 구성된다.

GCE를 사용한다면 kube-up.sh 스크립트로 클러스터를 생성할 때 Cluster autoscaler를 활성화할 수 있다. 
cluster autoscaler를 구성하려면 다음 세 가지 환경 변수들을 설정해야 한다.

* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - true로 설정되면 cluster autoscaler를 활성화한다.
* `KUBE_AUTOSCALER_MIN_NODES` - 클러스터 노드들의 최소 개수.
* `KUBE_AUTOSCALER_MAX_NODES` - 클러스터 노드들의 최대 개수.

예제:

```shell
KUBE_ENABLE_CLUSTER_AUTOSCALER=true KUBE_AUTOSCALER_MIN_NODES=3 KUBE_AUTOSCALER_MAX_NODES=10 NUM_NODES=5 ./cluster/kube-up.sh
```

Google Kubernetes Engine에서는 클러스터 생성이나 업데이트, 또는 (오토스케일하려고 하는) 특정 노드 풀의 
생성 시기에 해당 `gcloud` 커맨드에 `--enable-autoscaling` `--minnodes` `--maxnodes` 플래그들을 
전달하여 cluster autoscaler를 구성할 수 있다.

예제:

```shell
gcloud container clusters create mytestcluster --zone=us-central1-b --enable-autoscaling --min-nodes=3 --max-nodes=10 --num-nodes=5
```

```shell
gcloud container clusters update mytestcluster --enable-autoscaling --min-nodes=1 --max-nodes=15
```

**Cluster autoscaler는 노드가 수작업으로 변경(예. kubectl을 통해 레이블을 추가)되는 경우를 예상하지 않는데, 동일한 인스턴스 그룹 내의 신규 노드들에 이 속성들이 전파되지 않을 것이기 때문이다.**

cluster autoscaler가 클러스터 스케일 여부와 언제 어떻게 클러스터 스케일하는지에 대한 상세 사항은 
autoscaler 프로젝트의 [FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md) 
문서를 참조하기를 바란다.

## 노드 유지보수

(커널 업그레이드, libc 업그레이드, 하드웨어 수리 등으로) 한 노드를 리부트해야하는데 다운타임이 짧다면, 
Kubelet이 재시작할 때 해당 노드에 스케줄된 파드들을 재시작하려고 할 것이다. 만약 리부트가 길게 걸린다면 
(컨트롤러 관리자의 `--pod-eviction-timeout`으로 제어되는 기본 시간은 5분이다.) 
노드 컨트롤러는 사용불가한 노드에 묶여져 있는 파드들을 종료 시킬 것이다. 만약 상응하는 
레플리카 셋 (또는 레플리케이션 컨트롤러)가 존재한다면, 해당 파드의 신규 복제본을 다른 노드에서 기동시킬 것이다. 따라서, 모든 파드들이 
복제된 상황에서 모든 노드들이 동시에 다운되지 않는다고 가정했을 때, 별다른 조작없이 업데이트를 진행할 수 있다.

만약 업그레이드 과정을 상세하게 통제하기를 원한다면, 다음 워크플로우를 사용할 수 있다.

노드에 스케줄할 수 없도록 표시하면서 해당 노드 상의 모든 파드들을 자연스럽게 종료하기 위해 `kubectl drain`을 사용한다.

```shell
kubectl drain $NODENAME
```

이렇게하면 파드가 종료되는 동안 신규 파드들이 해당 노드에 스케줄되는 것을 방지한다.

레플리카 셋의 파드들은 신규 노드에 스케줄되는 신규 파드로 교체될 것이다. 추가적으로 해당 파드가 한 서비스의 일부라면, 클라이언트들은 자동으로 신규 파드로 재전송될 것이다.

레플리카 셋이 아닌 파드들은 직접 해당 파드의 새로운 복제본을 올려야 하며, 해당 파드가 한 서비스의 일부가 아니라면 클라이언트들을 신규 복제본으로 재전송해야 한다.

해당 노드에 유지보수 작업을 수행한다.

해당 노드가 다시 스케줄될 수 있도록 한다.

```shell
kubectl uncordon $NODENAME
```

해당 노드의 VM 인스턴스를 삭제하고 신규로 생성했다면, 신규로 스케줄 가능한 노드 리소스가 
자동으로 생성될 것이다.(당신이 노드 디스커버리를 지원하는 클라우드 제공자를 사용한다면; 
이는 현재 Google Compute Engine만 지원되며 Google Compute Engine 상에서 kube-register를 사용하는 CoreOS를 포함하지는 않는다.) 상세 내용은 [노드](/docs/concepts/architecture/nodes)를 참조하라.

## 고급 주제들

### 다른 API 버전으로 업그레이드

신규 API 버전이 릴리스 되었을 때, 해당 신규 API 버전을 지원하려면 클러스터를 업그레이드해야 할 수 있다.(예. 'v2'가 출시되었을 때 'v1'에서 'v2'로 변경)

이는 드문 경우지만 세심한 관리가 요구된다. 신규 API 버전으로 업그레이드하는데는 일련의 과정이 존재한다.

   1. 신규 API 버전을 ON한다.
   1. 신규 버전을 사용하도록 클러스터의 스토리지를 업그레이드한다.
   1. 모든 구성 파일들을 업그레이드한다. 구식 API 버전 엔드포인트의 사용자들을 식별한다.
   1. `cluster/update-storage-objects.sh`을 실행하여 스토리지 내에 기존 객체들을 신규 버전으로 업데이트한다.
   1. 구식 API 버전을 OFF한다.

### 클러스터에서 API 버전을 ON/OFF 하기

특정 API 버전들은 API 서버가 올라오는 동안 `--runtime-config=api/<version>` 플래그를 전달하여 ON/OFF 시킬 수 있다. 예를 들어, v1 API를 OFF 시키려면, `--runtime-config=api/v1=false`를 
전달한다. runtime-config는 모든 API들과 레거시 API들을 각각 제어하는 api/all과 api/legacy 2가지 특수 키도 지원한다. 
예를 들어, v1을 제외한 모든 API 버전들을 OFF하려면 `--runtime-config=api/all=false,api/v1=true`를 전달한다. 
이 플래그들을 위해 레거시 API들은 명확하게 사용중단된 API들이다.(예. `v1beta3`)

### 클러스터에서 스토리지 API 버전을 변경

클러스터 내에서 활성화된 쿠버네티스 리소스들의 클러스터의 내부 표현을 위해 디스크에 저장된 객체들은 특정 버전의 API를 사용하여 작성된다.
지원되는 API가 변경될 때, 이 객체들은 새로운 API로 재작성되어야 할 수도 있다. 이것이 실패하면 결과적으로 리소스들이 
쿠버네티스 API 서버에서 더 이상 해독되거나 사용할 수 없게 될 것이다.

### 구성 파일을 신규 API 버전으로 변경

다른 API 버전들 간에 구성 파일을 전환하는데 `kubectl convert` 커맨드를 사용할 수 있다.

```shell
kubectl convert -f pod.yaml --output-version v1
```

옵션에 대한 상세 정보는 [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert) 커맨드의 사용법을 참조하기를 바란다.

{{% /capture %}}

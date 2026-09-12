---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm API로 컴포넌트 사용자 정의하기
content_type: concept
weight: 40
---

<!-- overview -->

이 페이지는 kubeadm이 배포하는 컴포넌트(component)들을 사용자 정의하는 방법을 다룬다. 컨트롤 플레인 컴포넌트에
대해서는 `Cluster Configuration` 구조에서 플래그를 사용하거나 노드당 패치를 사용할 수 있다. kubelet과
kube-proxy의 경우, `KubeletConfiguration`과 `KubeProxyConfiguration`을 각각 사용할 수 있다.

이 모든 옵션이 kubeadm 구성 API를 통해 가용하다.
구성의 각 필드 상세 사항은
[API 참조 페이지](/docs/reference/config-api/kubeadm-config.v1beta4/)에서 찾아볼 수 있다.

{{< note >}}
이미 생성된 클러스터를 다시 구성하려면 
[kubeadm 클러스터 다시 구성하기](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/)를 참고한다.
{{< /note >}}

<!-- body -->

## `ClusterConfiguration`의 플래그로 컨트롤 플레인 사용자 정의하기

kubeadm의 `ClusterConfiguration` 오브젝트는 API 서버, 컨트롤러매니저, 스케줄러, Etcd와 같은 컨트롤 플레인 컴포넌트에 전달되는
기본 플래그를 사용자가 덮어쓸 수 있도록 노출한다.
이 컴포넌트는 다음 구조체를 사용하여 정의된다.

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

이 구조체들은 공통 필드인 `extraArgs`를 포함하며, 이 필드는 `이름` /  `값` 쌍으로 구성된다.
컨트롤 플레인 컴포넌트를 위한 플래그를 덮어쓰려면 다음을 수행한다.

1.  사용자 구성에 적절한 `extraArgs` 필드를 추가한다.
2.  `extraArgs` 필드에 플래그를 추가한다.
3.  `kubeadm init`에 `--config <CONFIG YAML 파일>` 파라미터를 추가해서 실행한다.

{{< note >}}
`kubeadm config print init-defaults`를 실행하고 원하는 파일에 출력을
저장하여 기본값들로 구성된 `ClusterConfiguration` 오브젝트를 생성할 수 있다.
{{< /note >}}

{{< note >}}
`ClusterConfiguration` 오브젝트는 현재 kubeadm 클러스터에서 전역(global)으로 사용된다. 즉, 사용자가 추가하는 모든 플래그는
다른 노드에 있는 동일한 컴포넌트에도 모두 적용될 것이다. 다른 노드에서
컴포넌트별로 개별 구성을 적용하려면 [패치](#patches)를 사용하면 된다.
{{< /note >}}

{{< note >}}
플래그(키)를 복제하거나 동일한 플래그 `--foo`를 여러 번 전달하는 것은 현재 지원하지 않는다.
이 문제를 해결하려면 [패치](#patches)를 사용해야 한다.
{{< /note >}}

### APIServer 플래그

자세한 내용은 [kube-apiserver 레퍼런스 문서](/docs/reference/command-line-tools-reference/kube-apiserver/)를 확인한다.

사용 예시:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### 컨트롤러매니저 플래그

자세한 내용은 [kube-controller-manager 레퍼런스 문서](/docs/reference/command-line-tools-reference/kube-controller-manager/)를 확인한다.

사용 예시:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### 스케줄러 플래그

자세한 내용은 [kube-scheduler 레퍼런스 문서](/docs/reference/command-line-tools-reference/kube-scheduler/)를 확인한다.

사용 예시:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Etcd 플래그

자세한 사항은 [etcd 서버 문서](https://etcd.io/docs/)를 확인한다.

사용 예시:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## 패치를 통해 사용자 정의하기 {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm을 사용하면 각 노드에서 패치 파일이 있는 디렉터리를 `InitConfiguration`,
`JoinConfiguration`, `UpgradeConfiguration`에
전달할 수 있다. 이 패치는 컴포넌트 구성이 디스크에 기록되기 전에 최종 사용자 정의 단계로
사용될 수 있다.

`--config <YOUR CONFIG YAML>`을 사용하여 이 파일을 `kubeadm init`에 전달할 수 있다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
  patches:
    directory: /home/user/somedir
```

{{< note >}}
`kubeadm init`의 경우, `---`로 구분된 `ClusterConfiguration`과 `InitConfiguration`을 모두
포함하는 파일을 전달할 수 있다.
{{< /note >}}

`--config <YOUR CONFIG YAML>`을 사용하여 이 파일을 `kubeadm join`에 전달할 수 있다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration
  patches:
    directory: /home/user/somedir
```

`kubeadm upgrade apply`와 `kubeadm upgrade node`를 사용하여 kubeadm 노드를 업그레이드하는
경우, 업그레이드 이후에도 사용자 정의가 유지되도록 동일한 패치를 다시 제공해야 한다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

디렉터리는 `target[suffix][+patchtype].extension` 형태의 파일을 포함해야 한다.
예를 들면, `kube-apiserver0+merge.yaml` 또는 단순히 `etcd.json`의 형태이다.

- `target`은 `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
`kubeletconfiguration`, `corednsdeployment` 중 하나가 될 수 있다.
- `suffix`는 영숫자순으로 어떤 패치가 먼저 적용될지 결정하는 데 사용할 수 있는 선택적
문자열이다.
- `patchtype`은 `strategic`, `merge` 그리고 `json` 중 하나가 될 수 있으며
[kubectl에서 지원하는](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch) 패치 형식을 준수해야 한다.
`patchtype`의 기본값은 `strategic`이다.
- `extension`은 `json` 또는 `yaml` 중 하나여야 한다.

## kubelet 사용자 정의하기 {#kubelet}

kubelet을 사용자 정의하려면, [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)을
동일한 구성 파일 내에서 `---`로 구분된 `ClusterConfiguration`이나 `InitConfiguration` 다음에 추가하면 된다.
그런 다음 `kubeadm init`에 해당 파일을 전달하면, kubeadm은 동일한 기본 `KubeletConfiguration`을
클러스터의 모든 노드에 적용한다.

기본 `KubeletConfiguration`에 더하여 인스턴스별 구성을 적용하기 위해서는 
[`kubeletconfiguration` 패치 target](#patches)을 이용할 수 있다.

다른 방법으로는, kubelet 플래그를 덮어쓰기(overrides)로 사용하여,
`InitConfiguration` 및 `JoinConfiguration` 모두에서 지원되는 `nodeRegistration.kubeletExtraArgs`에 전달할 수 있다.
일부 kubelet 플래그는 더 이상 사용되지 않는다(deprecated). 따라서 사용하기 전에
[kubelet 참조 문서](/docs/reference/command-line-tools-reference/kubelet)를 통해 상태를 확인해야 한다.

이 외 더 자세한 사항은 [kubeadm을 통해 클러스터의 각 kubelet 구성하기](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)에서 살펴본다.

## kube-proxy 사용자 정의하기

kube-proxy를 사용자 정의하려면, `KubeProxyConfiguration`을 `---`로 구분된 `ClusterConfiguration`이나 `InitConfiguration`
다음에 두고 `kubeadm init`에 전달하면 된다.

자세한 사항은 [API 참조 페이지](/docs/reference/config-api/kubeadm-config.v1beta4/)에서 살펴볼 수 있다.

{{< note >}}
kubeadm은 kube-proxy를 {{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}으로 배포한다. 이것은
`KubeProxyConfiguration`이 클러스터의 모든 kube-proxy 인스턴스에 적용된다는 것을 의미한다.
{{< /note >}}

## CoreDNS 사용자 정의하기

kubeadm을 사용하면 [`corednsdeployment` 패치 대상](#patches)에 패치를 적용하여
CoreDNS 디플로이먼트를 사용자 정의할 수 있다.

`kube-system/coredns` {{< glossary_tooltip text="컨피그맵" term_id="configmap" >}}과 같은
CoreDNS 관련 다른 API 오브젝트에 대한 패치는 현재 지원되지 않는다.
이러한 오브젝트는 kubectl을 사용하여 수동으로 패치한 후, CoreDNS
{{< glossary_tooltip text="파드" term_id="pod" >}}를 다시 생성해야 한다.

또는 `ClusterConfiguration`에 다음 옵션을 포함하여 kubeadm의 CoreDNS 디플로이먼트를
비활성화할 수 있다.

```yaml
dns:
  disabled: true
```

또한 다음 명령을 실행하면

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

kubeadm이 사용자 환경에서 CoreDNS용으로 생성할 매니페스트 파일을 얻을 수 있다.

---
title: 파드 시큐리티 스탠다드를 클러스터 수준에 적용하기
content_type: tutorial
weight: 10
---

{{% alert title="Note" %}}
이 튜토리얼은 새로운 클러스터에만 적용할 수 있다.
{{% /alert %}}

파드 시큐리티 어드미션은 파드가 생성될 때 
[파드 시큐리티 스탠다드(Pod Security Standards)](/docs/concepts/security/pod-security-standards/)를 
적용하는 어드미션 컨트롤러이다. v1.25에서 정식 출시되었다.
이 튜토리얼은 `baseline` 파드 시큐리티 
스탠다드를 클러스터 수준(level)에 적용하여 표준 구성을 클러스터의 모든 네임스페이스에 
적용하는 방법을 보여준다.

파드 시큐리티 스탠다드를 특정 네임스페이스에 적용하려면, 
[파드 시큐리티 스탠다드를 네임스페이스 수준에 적용하기](/docs/tutorials/security/ns-level-pss/)를 참고한다.

만약 쿠버네티스 버전이 v{{< skew currentVersion >}}이 아니라면,
해당 버전의 문서를 확인한다.

## {{% heading "prerequisites" %}}

워크스테이션에 다음을 설치한다.

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

이 튜토리얼은 완전히 제어 가능한 쿠버네티스 클러스터에서 무엇을 
설정할 수 있는지 보여준다. 컨트롤 플레인을 구성할 수 없는 관리형 클러스터에서 
파드 시큐리티 어드미션을 설정하는 방법을 배우려면, [파드 시큐리티 스탠다드를 네임스페이스 수준에 적용하기](/docs/tutorials/security/ns-level-pss)를 
읽어 본다.

## 적용할 알맞은 파드 시큐리티 스탠다드 선택하기

[파드 시큐리티 어드미션](/docs/concepts/security/pod-security-admission/)을 이용하여 
`enforce`, `audit`, 또는 `warn` 모드 중 하나로 
내장 [파드 시큐리티 스탠다드](/docs/concepts/security/pod-security-standards/)를 적용할 수 있다.

현재 구성에 가장 적합한 파드 시큐리티 스탠다드를 고르는 데 
도움이 되는 정보를 수집하려면, 다음을 수행한다.

1. 파드 시큐리티 스탠다드가 적용되지 않은 클러스터를 생성한다.

    ```shell
    kind create cluster --name psa-wo-cluster-pss
    ```
    다음과 비슷하게 출력될 것이다.
    ```
    Creating cluster "psa-wo-cluster-pss" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
    Set kubectl context to "kind-psa-wo-cluster-pss"
    You can now use your cluster with:

    kubectl cluster-info --context kind-psa-wo-cluster-pss

    Thanks for using kind! 😊
    ```

1. kubectl context를 새로 생성한 클러스터로 설정한다.

    ```shell
    kubectl cluster-info --context kind-psa-wo-cluster-pss
    ```
   다음과 비슷하게 출력될 것이다.

    ```
     Kubernetes control plane is running at https://127.0.0.1:61350

    CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

1. 클러스터의 네임스페이스 목록을 조회한다.

    ```shell
    kubectl get ns
    ```
    다음과 비슷하게 출력될 것이다.
    ```      
    NAME                 STATUS   AGE
    default              Active   9m30s
    kube-node-lease      Active   9m32s
    kube-public          Active   9m32s
    kube-system          Active   9m32s
    local-path-storage   Active   9m26s
    ```

1. `--dry-run=server`를 사용하여 다른 파드 시큐리티 스탠다드가 적용되었을 때 
   어떤 것이 변경되는지 확인한다.

   1. Privileged
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

     다음과 비슷하게 출력될 것이다.
      ```      
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```
   2. Baseline
      ```shell    
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=baseline
      ```

     다음과 비슷하게 출력될 것이다.
      ```   
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "baseline:latest"
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```   

   3. Restricted
     ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=restricted
      ```

     다음과 비슷하게 출력될 것이다.
      ```   
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "restricted:latest"
      Warning: coredns-7bb9c7b568-hsptc (and 1 other pod): unrestricted capabilities, runAsNonRoot != true, seccompProfile
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      namespace/kube-system labeled
      Warning: existing pods in namespace "local-path-storage" violate the new PodSecurity enforce level "restricted:latest"
      Warning: local-path-provisioner-d6d9f7ffc-lw9lh: allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
      namespace/local-path-storage labeled
      ```

위의 출력에서, `privileged` 파드 시큐리티 스탠다드를 적용하면 모든 네임스페이스에서 경고가 발생하지 않는 것을 볼 수 있다. 
그러나 `baseline` 및 `restricted` 파드 시큐리티 스탠다드에 대해서는 
`kube-system` 네임스페이스에서 경고가 발생한다.

## 모드, 버전 및 파드 시큐리티 스탠다드 설정

이 섹션에서는, 다음의 파드 시큐리티 스탠다드를 `latest` 버전에 적용한다.

* `baseline` 파드 시큐리티 스탠다드는 `enforce` 모드로 적용
* `restricted` 파드 시큐리티 스탠다드는 `warn` 및 `audit` 모드로 적용

`baseline` 파드 시큐리티 스탠다드는 
예외 목록을 간결하게 유지하고 알려진 권한 상승(privilege escalations)을 방지할 수 있는 
편리한 절충안을 제공한다.

추가적으로, `kube-system` 내의 파드가 실패하는 것을 방지하기 위해, 
해당 네임스페이스는 파드 시큐리티 스탠다드가 적용되지 않도록 제외할 것이다.

사용 중인 환경에 파드 시큐리티 어드미션을 적용할 때에는 
다음의 사항을 고려한다.

1. 클러스터에 적용된 위험 상태에 따라, 
   `restricted`와 같은 더 엄격한 파드 시큐리티 스탠다드가 더 나은 선택일 수 있다.
1. `kube-system` 네임스페이스를 제외하면 
   이 네임스페이스에서 파드가 `privileged`로 실행될 수 있다. 
   실제 사용 환경에서는 최소 권한 원칙에 따라 
   `kube-system`에 대한 접근을 제한하는 
   엄격한 RBAC 정책을 적용할 것을 쿠버네티스 프로젝트에서 강력히 권장한다.
   상기 스탠다드를 구현하려면, 다음을 수행한다.
1. 파드 시큐리티 어드미션 컨트롤러가 이러한 파드 시큐리티 스탠다드를 구현하는 데 사용할 수 있는 
   구성 파일을 생성한다.

    ```
    mkdir -p /tmp/pss
    cat <<EOF > /tmp/pss/cluster-level-pss.yaml 
    apiVersion: apiserver.config.k8s.io/v1
    kind: AdmissionConfiguration
    plugins:
    - name: PodSecurity
      configuration:
        apiVersion: pod-security.admission.config.k8s.io/v1
        kind: PodSecurityConfiguration
        defaults:
          enforce: "baseline"
          enforce-version: "latest"
          audit: "restricted"
          audit-version: "latest"
          warn: "restricted"
          warn-version: "latest"
        exemptions:
          usernames: []
          runtimeClasses: []
          namespaces: [kube-system]
    EOF
    ```

   {{< alert color="info" title="Note" >}}
    `pod-security.admission.config.k8s.io/v1` 설정은 쿠버네티스 v1.25 이상을 필요로 한다.
    쿠버네티스 v1.23과 v1.24의 경우, [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)을 사용한다.
    쿠버네티스 v1.22의 경우, [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)을 사용한다.
   {{< /alert >}}


1. API 서버가 클러스터 생성 과정에서 이 파일을 처리할 수 있도록 구성한다.

    ```
    cat <<EOF > /tmp/pss/cluster-config.yaml 
    kind: Cluster
    apiVersion: kind.x-k8s.io/v1alpha4
    nodes:
    - role: control-plane
      kubeadmConfigPatches:
      - |
        kind: ClusterConfiguration
        apiServer:
            extraArgs:
              admission-control-config-file: /etc/config/cluster-level-pss.yaml
            extraVolumes:
              - name: accf
                hostPath: /etc/config
                mountPath: /etc/config
                readOnly: false
                pathType: "DirectoryOrCreate"
      extraMounts:
      - hostPath: /tmp/pss
        containerPath: /etc/config
        # optional: if set, the mount is read-only.
        # default false
        readOnly: false
        # optional: if set, the mount needs SELinux relabeling.
        # default false
        selinuxRelabel: false
        # optional: set propagation mode (None, HostToContainer or Bidirectional)
        # see https://kubernetes.io/ko/docs/concepts/storage/volumes/#마운트-전파-propagation
        # default None
        propagation: None
    EOF
    ```

   {{< alert color="info" title="Note" >}}
   macOS에서 Docker Desktop과 *kind*를 사용하고 있다면, 
   **Preferences > Resources > File Sharing** 메뉴에서 
   `/tmp`를 Shared Directory로 추가할 수 있다.
   {{< /alert >}}

1. 이러한 파드 시큐리티 스탠다드를 적용하기 위해 
   파드 시큐리티 어드미션을 사용하는 클러스터를 생성한다.

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```
   다음과 비슷하게 출력될 것이다.
   ```
    Creating cluster "psa-with-cluster-pss" ...
     ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
     ✓ Preparing nodes 📦  
     ✓ Writing configuration 📜 
     ✓ Starting control-plane 🕹️ 
     ✓ Installing CNI 🔌 
     ✓ Installing StorageClass 💾 
    Set kubectl context to "kind-psa-with-cluster-pss"
    You can now use your cluster with:
    
    kubectl cluster-info --context kind-psa-with-cluster-pss
    
    Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
    ```

1. kubectl context를 새로 생성한 클러스터로 설정한다.
   ```shell
    kubectl cluster-info --context kind-psa-with-cluster-pss
    ```
   다음과 비슷하게 출력될 것이다.
    ```
     Kubernetes control plane is running at https://127.0.0.1:63855
     CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
  
     To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```
    
1. 기본 네임스페이스에 파드를 생성한다.

    {{% code_sample file="security/example-baseline-pod.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   파드는 정상적으로 시작되었지만, 출력 결과에 경고가 포함되어 있다.
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## 정리하기

위에서 생성한 클러스터들을 다음 명령어를 실행하여 삭제한다.

```shell
kind delete cluster --name psa-with-cluster-pss
```
```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}}

- 다음의 모든 단계를 한 번에 수행하려면 
  [셸 스크립트](/examples/security/kind-with-cluster-level-baseline-pod-security.sh)를 
  실행한다.
  1. 파드 시큐리티 스탠다드 기반의 클러스터 수준 구성(configuration)을 생성한다
  2. API 서버가 이 구성을 사용할 수 있도록 파일을 생성한다
  3. 이 구성을 사용하는 API 서버를 포함하는 클러스터를 생성한다
  4. kubectl context를 새로 생성한 클러스터에 설정한다
  5. 최소한의 파드 구성을 위한 yaml 파일을 생성한다
  6. 해당 파일을 적용하여 새 클러스터에 파드를 생성한다
- [파드 시큐리티 어드미션](/docs/concepts/security/pod-security-admission/)
- [파드 시큐리티 스탠다드](/docs/concepts/security/pod-security-standards/)
- [파드 시큐리티 스탠다드를 네임스페이스 수준에 적용하기](/docs/tutorials/security/ns-level-pss/)

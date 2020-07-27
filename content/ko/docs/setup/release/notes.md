---
title: v1.18 릴리스 노트
weight: 10
card:
  name: release-notes
  weight: 20
  anchors:
  - anchor: "#"
    title: 최신 릴리스 노트
  - anchor: "#긴급-업그레이드-노트"
    title: 긴급 업그레이드 노트
---

<!-- NEW RELEASE NOTES ENTRY -->

# v1.18.0

[문서](https://docs.k8s.io)

## v1.18.0 다운로드

파일명 | sha512 해시
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes.tar.gz) | `cd5b86a3947a4f2cea6d857743ab2009be127d782b6f2eb4d37d88918a5e433ad2c7ba34221c34089ba5ba13701f58b657f0711401e51c86f4007cb78744dee7`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-src.tar.gz) | `fb42cf133355ef18f67c8c4bb555aa1f284906c06e21fa41646e086d34ece774e9d547773f201799c0c703ce48d4d0e62c6ba5b2a4d081e12a339a423e111e52`

### 클라이언트 바이너리

파일명 | sha512 해시
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-darwin-386.tar.gz) | `26df342ef65745df12fa52931358e7f744111b6fe1e0bddb8c3c6598faf73af997c00c8f9c509efcd7cd7e82a0341a718c08fbd96044bfb58e80d997a6ebd3c2`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-darwin-amd64.tar.gz) | `803a0fed122ef6b85f7a120b5485723eaade765b7bc8306d0c0da03bd3df15d800699d15ea2270bb7797fa9ce6a81da90e730dc793ea4ed8c0149b63d26eca30`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-386.tar.gz) | `110844511b70f9f3ebb92c15105e6680a05a562cd83f79ce2d2e25c2dd70f0dbd91cae34433f61364ae1ce4bd573b635f2f632d52de8f72b54acdbc95a15e3f0`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-amd64.tar.gz) | `594ca3eadc7974ec4d9e4168453e36ca434812167ef8359086cd64d048df525b7bd46424e7cc9c41e65c72bda3117326ba1662d1c9d739567f10f5684fd85bee`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-arm.tar.gz) | `d3627b763606557a6c9a5766c34198ec00b3a3cd72a55bc2cb47731060d31c4af93543fb53f53791062bb5ace2f15cbaa8592ac29009641e41bd656b0983a079`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-arm64.tar.gz) | `ba9056eff1452cbdaef699efbf88f74f5309b3f7808d372ebf6918442d0c9fea1653c00b9db3b7626399a460eef9b1fa9e29b827b7784f34561cbc380554e2ea`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-ppc64le.tar.gz) | `f80fb3769358cb20820ff1a1ce9994de5ed194aabe6c73fb8b8048bffc394d1b926de82c204f0e565d53ffe7562faa87778e97a3ccaaaf770034a992015e3a86`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-linux-s390x.tar.gz) | `a9b658108b6803d60fa3cd4e76d9e58bf75201017164fe54054b7ccadbb68c4ad7ba7800746940bc518d90475e6c0a96965a26fa50882f4f0e56df404f4ae586`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-windows-386.tar.gz) | `18adffab5d1be146906fd8531f4eae7153576aac235150ce2da05aee5ae161f6bd527e8dec34ae6131396cd4b3771e0d54ce770c065244ad3175a1afa63c89e1`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-client-windows-amd64.tar.gz) | `162396256429cef07154f817de2a6b67635c770311f414e38b1e2db25961443f05d7b8eb1f8da46dec8e31c5d1d2cd45f0c95dad1bc0e12a0a7278a62a0b9a6b`

### 서버 바이너리

파일명 | sha512 해시
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-server-linux-amd64.tar.gz) | `a92f8d201973d5dfa44a398e95fcf6a7b4feeb1ef879ab3fee1c54370e21f59f725f27a9c09ace8c42c96ac202e297fd458e486c489e05f127a5cade53b8d7c4`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-server-linux-arm.tar.gz) | `62fbff3256bc0a83f70244b09149a8d7870d19c2c4b6dee8ca2714fc7388da340876a0f540d2ae9bbd8b81fdedaf4b692c72d2840674db632ba2431d1df1a37d`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-server-linux-arm64.tar.gz) | `842910a7013f61a60d670079716b207705750d55a9e4f1f93696d19d39e191644488170ac94d8740f8e3aa3f7f28f61a4347f69d7e93d149c69ac0efcf3688fe`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-server-linux-ppc64le.tar.gz) | `95c5b952ac1c4127a5c3b519b664972ee1fb5e8e902551ce71c04e26ad44b39da727909e025614ac1158c258dc60f504b9a354c5ab7583c2ad769717b30b3836`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-server-linux-s390x.tar.gz) | `a46522d2119a0fd58074564c1fa95dd8a929a79006b82ba3c4245611da8d2db9fd785c482e1b61a9aa361c5c9a6d73387b0e15e6a7a3d84fffb3f65db3b9deeb`

### 노드 바이너리

파일명 | sha512 해시
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-linux-amd64.tar.gz) | `f714f80feecb0756410f27efb4cf4a1b5232be0444fbecec9f25cb85a7ccccdcb5be588cddee935294f460046c0726b90f7acc52b20eeb0c46a7200cf10e351a`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-linux-arm.tar.gz) | `806000b5f6d723e24e2f12d19d1b9b3d16c74b855f51c7063284adf1fcc57a96554a3384f8c05a952c6f6b929a05ed12b69151b1e620c958f74c9600f3db0fcb`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-linux-arm64.tar.gz) | `c207e9ab60587d135897b5366af79efe9d2833f33401e469b2a4e0d74ecd2cf6bb7d1e5bc18d80737acbe37555707f63dd581ccc6304091c1d98dafdd30130b7`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-linux-ppc64le.tar.gz) | `a542ed5ed02722af44ef12d1602f363fcd4e93cf704da2ea5d99446382485679626835a40ae2ba47a4a26dce87089516faa54479a1cfdee2229e8e35aa1c17d7`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-linux-s390x.tar.gz) | `651e0db73ee67869b2ae93cb0574168e4bd7918290fc5662a6b12b708fa628282e3f64be2b816690f5a2d0f4ff8078570f8187e65dee499a876580a7a63d1d19`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0/kubernetes-node-windows-amd64.tar.gz) | `d726ed904f9f7fe7e8831df621dc9094b87e767410a129aa675ee08417b662ddec314e165f29ecb777110fbfec0dc2893962b6c71950897ba72baaa7eb6371ed`

## v1.17.0 이후 체인지로그

릴리스 노트의 전체 체인지로그는 이제 [https://relnotes.k8s.io][1]에서 사용자 정의 가능한
형식으로 호스팅된다. 확인하고 의견을 보내주기
바란다!

[1]: https://relnotes.k8s.io/?releaseVersions=1.18.0

## 새로운 소식 (주요 테마)

### 쿠버네티스 토폴로지 매니저가 베타로 전환 - 정렬!

릴리스 1.18의 쿠버네티스 베타 기능인 [토폴로지 매니저 기능](https://github.com/nolancon/website/blob/f4200307260ea3234540ef13ed80de325e1a7267/content/en/docs/tasks/administer-cluster/topology-manager.md)은 저-지연(low-latency)에 최적화된 환경에서 워크로드를 실행할 수 있도록 CPU 및 장치(예: SR-IOV VF)를 NUMA 정렬 할 수 있다. 토폴로지 매니저가 도입되기 전에, CPU와 장치 관리자는 서로 독립적으로 리소스 할당 결정을 내렸다. 이로 인해 다중-소켓 시스템에 의도하지 않은 할당이 발생하여, 지연에 민감한 애플리케이션의 성능을 저하시킬 수 있었다.

### 서버 사이드(server-side) 적용 - 베타 2

서버-사이드 적용은 1.16에서 베타로 승격되었지만, 1.18에서 두 번째 베타가 도입된다. 이 새 버전은 모든 새로운 쿠버네티스 오브젝트의 필드 변경 사항을 추적하고 관리하여, 리소스의 변경된 부분과 시기를 알 수 있다.

### 인그레스 확장 및 IngressClass로 사용 중단(deprecated) 어노테이션을 교체

쿠버네티스 1.18에서 인그레스에 두 가지 중요한 추가 사항이 있는데, 그것은 새로운 `pathType` 필드와 새로운 `IngressClass` 리소스이다. `pathType` 필드는 경로(path)를 일치시키는 방법을 지정한다. 기본 `ImplementationSpecific` 유형 외에도 새로운 `Exact` 와 `Prefix` 경로 유형이 있다.

`IngressClass` 리소스는 쿠버네티스 클러스터 내에서 인그레스 유형을 설명하는 데 사용된다. 인그레스는 인그레스에서 새로운 `ingressClassName` 필드를 사용하여 연관된 클래스를 지정할 수 있다. 이 새 리소스와 필드는 사용 중단된 `kubernetes.io/ingress.class` 어노테이션을 대체한다.

### SIG CLI의 kubectl 디버그 소개

SIG CLI는 이미 오랫동안 디버그 유틸리티의 필요성에 대해 논의하고 있었다. [임시(ephemeral) 컨테이너](/ko/docs/concepts/workloads/pods/ephemeral-containers/)가 개발되면서, `kubectl exec` 위에 구축된 도구를 통해 개발자를 지원할 수 있는 방법이 더욱 분명해졌다. `kubectl debug` [커맨드](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/20190805-kubectl-debug.md) 추가(알파이지만 피드백은 언제나 환영)로 개발자는 클러스터 내에서 파드를 쉽게 디버깅할 수 있다. 우리는 이 추가 기능이 매우 유용하다고 생각한다. 이 커맨드를 사용하면 검사하려는 파드 바로 옆에서 실행되는 임시 컨테이너를 만들 수 있고, 대화식 문제 해결을 위해 콘솔에 연결할 수도 있다.

### 쿠버네티스를 위한 윈도우 CSI 지원 알파 소개

쿠버네티스 1.18 릴리스에서는 윈도우 용 CSI 프록시(CSI Proxy)의 알파 버전이 릴리스 된다. CSI 프록시를 사용하면 권한이 없는(사전 승인된) 컨테이너가 윈도우에서 권한이 있는 스토리지 작업을 수행할 수 있다. CSI 프록시를 활용하여 윈도우에서 CSI 드라이버를 지원할 수 있다.
SIG 스토리지는 1.18 릴리스에서 많은 진전을 이루었다.
특히, 다음 스토리지 기능이 쿠버네티스 1.18에서 GA 되었다.
- 원시(Raw) 블록 지원: 볼륨을 마운트된 파일시스템 대신, 컨테이너 내에 블록 장치로 표시할 수 있다.
- 볼륨 복제: CSI를 통해 쿠버네티스 API를 사용하여 퍼시스턴트볼륨클레임(PersistentVolumeClaim) 및 기본 스토리지 볼륨을 복제한다.
- CSIDriver 쿠버네티스 API 오브젝트: CSI 드라이버 검색을 단순화하고 CSI 드라이버가 쿠버네티스 동작을 사용자 정의할 수 있게 한다.

SIG 스토리지는 쿠버네티스 1.18에서 다음과 같은 새로운 스토리지 기능을 알파로 도입했다.
- 윈도우 CSI 지원: 새로운 [CSIProxy](https://github.com/kubernetes-csi/csi-proxy)를 통해 윈도우에서 컨테이너화 된 CSI 노드 플러그인 활성화한다.
- 재귀 볼륨 소유권 OnRootMismatch 옵션: 소유권 변경이 필요하고 많은 디렉터리와 파일이 있는 볼륨의 마운트 시간을 단축할 수 있는 새로운 “OnRootMismatch” 정책을 추가한다.

### 다른 중요한 발표

새로운 CI 작업으로 테스트 커버리지를 크게 늘린 이후, SIG 네트워크는 쿠버네티스 1.18에서 IPv6를 베타로 전환한다.

NodeLocal DNSCache는 dnsCache 파드를 데몬셋으로 실행하여 clusterDNS 성능과 안정성을 향상시키는 애드온이다. 이 기능은 1.13 릴리스 이후 알파 버전으로 존재해왔다. SIG 네트워크는 Node Local DNSCache [#1351](https://github.com/kubernetes/enhancements/pull/1351)의 GA를 발표한다.

## 알려진 이슈

알려진 이슈가 보고되지 않음

## 긴급 업그레이드 노트

### (업그레이드하기 전에 반드시 읽어야 한다)

#### kube-apiserver:
- `--encryption-provider-config` 설정 파일에서, 명시적인 `cacheSize: 0` 파라미터는 이전에는 묵시적으로 1000개의 키를 캐싱하도록 기본으로 설정되었다. 쿠버네티스 1.18에서 이것은 이제 설정 유효성 검사 오류를 반환한다. 캐싱을 비활성화하려면 쿠버네티스 1.18 이상에서 음의 cacheSize 값을 지정할 수 있다.
- 'certificatesigningrequests/approval' API 사용자는 이제 CSR이 요청한 특정 서명자(signer)에 대해 CSR을 '승인'할 권한이 있어야 한다. 새 signerName 필드 및 필수 권한 부여에 대한 자세한 정보는 https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests#authorization ([#88246](https://github.com/kubernetes/kubernetes/pull/88246), [@munnerz](https://github.com/munnerz)) [SIG API Machinery, 앱, 인증, CLI, 노드 및 테스트] 에서 확인할 수 있다.
- 다음 기능은 무조건 활성화되며, 다음의 `--feature-gates`의 플래그가 제거되었다. `PodPriority`, `TaintNodesByCondition`, `ResourceQuotaScopeSelectors` 및 `ScheduleDaemonSetPods` ([#86210](https://github.com/kubernetes/kubernetes/pull/86210), [@draveness](https://github.com/draveness)) [SIG 앱과 스케줄]

#### kubelet:
- `--enable-cadvisor-endpoints` 는 이제 기본적으로 비활성화되어 있다. cAdvisor v1 Json API에 접근해야 하는 경우, kubelet 커맨드 라인에서 명시적으로 활성화한다. 이 플래그는 1.15에서 사용 중단되었으며 1.19에서 제거될 것이다. ([#87440](https://github.com/kubernetes/kubernetes/pull/87440), [@dims](https://github.com/dims)) [SIG Instrumentation, 노드 및 테스트]
- CSIMigrationOpenStack을 베타로 승격한다(OpenStack Cinder CSI 드라이버를 설치해야 하므로 기본적으로 해제되어 있다). 인-트리(in-tree) AWS OpenStack Cinder 드라이버 "kubernetes.io/cinder"는 1.16에서 사용 중단되었으며, 1.20에서 제거될 것이다. 사용자는 CSIMigration + CSIMigrationOpenStack 기능을 활성화하고 OpenStack Cinder CSI 드라이버 (https://github.com/kubernetes-sigs/cloud-provider-openstack)를 설치하여 기존 파드와 PVC 오브젝트가 중단되지 않도록 해야한다. 사용자는 새 볼륨에 대해 OpenStack Cinder CSI 드라이버를 직접 사용해야 한다. ([#85637](https://github.com/kubernetes/kubernetes/pull/85637), [@dims](https://github.com/dims)) [SIG 클라우드 공급자]

#### kubectl:
- `kubectl` 및 k8s.io/client-go의 기본값은 더 이상 `http://localhost:8080`의 서버 주소가 아니다. 이러한 레거시 클러스터 중 하나를 소유한 경우, 서버를 안전하게 보호하는 것을 *강력히* 권장한다. 서버를 보호할 수 없다면, `$KUBERNETES_MASTER` 환경 변수를 `http://localhost:8080`으로 설정하여 서버 주소의 기본값을 계속 유지할 수 있다. `kubectl` 사용자는 `--server` 플래그를 사용하거나 `--kubeconfig` 또는 `$KUBECONFIG`를 통해 지정된 kubeconfig 파일에서 서버 주소를 설정할 수도 있다. ([#86173](https://github.com/kubernetes/kubernetes/pull/86173), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, CLI 및 테스트]
- `kubectl run`은 파드 생성과 관련이 없는 플래그와 함께, 이전에 사용 중단된 생성기(generator)를 삭제했다. `kubectl run`은 이제 파드만 생성한다. 파드 이외의 오브젝트를 만드려면, 특정 `kubectl create` 하위 커맨드를 참조한다.
([#87077](https://github.com/kubernetes/kubernetes/pull/87077), [@soltysh](https://github.com/soltysh)) [SIG Architecture, CLI 및 테스트]
- 사용 중단된 커맨드 `kubectl rolling-update`는 삭제되었다. ([#88057](https://github.com/kubernetes/kubernetes/pull/88057), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG 아키텍처, CLI 및 테스트]

#### client-go:
- 생성된 클라이언트 세트, 동적, 메타데이터 및 스케일 클라이언트의 메소드에 대한 서명이 `context.Context`를 첫 번째 인수로 채택하도록 수정되었다. Create, Update 및 Patch 메소드의 서명이 각각 CreateOptions, UpdateOptions 및 PatchOptions를 허용하도록 업데이트되었다. Delete 및 DeleteCollection 메소드의 서명은 이제 참조 대신 값으로 DeleteOptions를 허용한다. 이전 인터페이스를 사용하여 생성된 클라이언트 세트가 새로운 "사용 중단된" 패키지에 추가되어 새로운 API로 증분(incremental) 마이그레이션 할 수 있다. 사용 중단된 패키지는 1.21 릴리스에서 제거된다. http://sigs.k8s.io/clientgofix 에서 도구를 사용하여 새로운 서명에 대한 메소드 호출을 다시 쓸 수 있다.

- 다음의 사용 중단된 메트릭이 제거되었다. 해당 메트릭으로 변환한다.
  - 다음 교체 메트릭은 v1.14.0부터 제공된다.
      - `rest_client_request_latency_seconds` -> `rest_client_request_duration_seconds`
      - `scheduler_scheduling_latency_seconds` -> `scheduler_scheduling_duration_seconds `
      - `docker_operations` -> `docker_operations_total`
      - `docker_operations_latency_microseconds` -> `docker_operations_duration_seconds`
      - `docker_operations_errors` -> `docker_operations_errors_total`
      - `docker_operations_timeout` -> `docker_operations_timeout_total`
      - `network_plugin_operations_latency_microseconds` -> `network_plugin_operations_duration_seconds`
      - `kubelet_pod_worker_latency_microseconds` -> `kubelet_pod_worker_duration_seconds`
      - `kubelet_pod_start_latency_microseconds` -> `kubelet_pod_start_duration_seconds`
      - `kubelet_cgroup_manager_latency_microseconds` -> `kubelet_cgroup_manager_duration_seconds`
      - `kubelet_pod_worker_start_latency_microseconds` -> `kubelet_pod_worker_start_duration_seconds`
      - `kubelet_pleg_relist_latency_microseconds` -> `kubelet_pleg_relist_duration_seconds`
      - `kubelet_pleg_relist_interval_microseconds` -> `kubelet_pleg_relist_interval_seconds`
      - `kubelet_eviction_stats_age_microseconds` -> `kubelet_eviction_stats_age_seconds`
      - `kubelet_runtime_operations` -> `kubelet_runtime_operations_total`
      - `kubelet_runtime_operations_latency_microseconds` -> `kubelet_runtime_operations_duration_seconds`
      - `kubelet_runtime_operations_errors` -> `kubelet_runtime_operations_errors_total`
      - `kubelet_device_plugin_registration_count` -> `kubelet_device_plugin_registration_total`
      - `kubelet_device_plugin_alloc_latency_microseconds` -> `kubelet_device_plugin_alloc_duration_seconds`
      - `scheduler_e2e_scheduling_latency_microseconds` -> `scheduler_e2e_scheduling_duration_seconds`
      - `scheduler_scheduling_algorithm_latency_microseconds` -> `scheduler_scheduling_algorithm_duration_seconds`
      - `scheduler_scheduling_algorithm_predicate_evaluation` -> `scheduler_scheduling_algorithm_predicate_evaluation_seconds`
      - `scheduler_scheduling_algorithm_priority_evaluation` -> `scheduler_scheduling_algorithm_priority_evaluation_seconds`
      - `scheduler_scheduling_algorithm_preemption_evaluation` -> `scheduler_scheduling_algorithm_preemption_evaluation_seconds`
      - `scheduler_binding_latency_microseconds` -> `scheduler_binding_duration_seconds`
      - `kubeproxy_sync_proxy_rules_latency_microseconds` -> `kubeproxy_sync_proxy_rules_duration_seconds`
      - `apiserver_request_latencies` -> `apiserver_request_duration_seconds`
      - `apiserver_dropped_requests` -> `apiserver_dropped_requests_total`
      - `etcd_request_latencies_summary` -> `etcd_request_duration_seconds`
      - `apiserver_storage_transformation_latencies_microseconds ` -> `apiserver_storage_transformation_duration_seconds`
      - `apiserver_storage_data_key_generation_latencies_microseconds` -> `apiserver_storage_data_key_generation_duration_seconds`
      - `apiserver_request_count` -> `apiserver_request_total`
      - `apiserver_request_latencies_summary`
  - 다음 교체 메트릭은 v1.15.0부터 제공된다.
      - `apiserver_storage_transformation_failures_total` -> `apiserver_storage_transformation_operations_total` ([#76496](https://github.com/kubernetes/kubernetes/pull/76496), [@danielqsj](https://github.com/danielqsj)) [SIG API Machinery, 클러스터 라이프사이클, Instrumentation, 네트워크, 노드 및 스케줄링]

## 종류(Kind)별 변경

### 사용 중단

#### kube-apiserver:
- 다음의 사용 중단된 API는 더 이상 제공되지 않는다.
  - `apps/v1beta1`와 `apps/v1beta2`의 모든 리소스 대신 `apps/v1`을 사용한다.
  - `extensions/v1beta1`의 `daemonsets`, `deployments`, `replicasets` 리소스 대신 `apps/v1`을 사용한다.
  - `extensions/v1beta1`의 `networkpolicies` 리소스 대신 `networking.k8s.io/v1`을 사용한다.
  - `extensions/v1beta1`의 `podsecuritypolicies`의 리소스 대신 `policy/v1beta1`을 사용한다. ([#85903](https://github.com/kubernetes/kubernetes/pull/85903), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, 앱, 클러스터 라이프사이클, Instrumentation 및 테스트]

#### kube-controller-manager:
- Azure 서비스 어노테이션 service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset은 사용 중단되었다. 향후 릴리스에서는 지원이 제거될 것이다. ([#88462](https://github.com/kubernetes/kubernetes/pull/88462), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]

#### kubelet:
- StreamingProxyRedirects 기능과 `--redirect-container-streaming` 플래그는 사용 중단되었으며, 향후 릴리스에서 제거될 예정이다. 디폴트 동작 (kubelet을 통한 프록시 스트리밍 요청)이 유일하게 지원되는 옵션이다. `--redirect-container-streaming=true`로 설정하는 경우, 이 설정으로부터 마이그레이션 해야 한다. v1.20부터는 이 플래그를 더 이상 사용할 수 없다. 플래그를 설정하지 않으면, 아무것도 할 필요가 없다. ([#88290](https://github.com/kubernetes/kubernetes/pull/88290), [@tallclair](https://github.com/tallclair)) [SIG API Machinery와 노드]
- `/metrics/resource/v1alpha1` 리소스 메트릭 엔드포인트와 이 엔드포인트 이하 모든 메트릭은 사용 중단되었다. `/metrics/resource` 엔드포인트에서 생성된 다음의 메트릭으로 변환해야 한다.
      - scrape_error --> scrape_error
      - node_cpu_usage_seconds_total --> node_cpu_usage_seconds
      - node_memory_working_set_bytes --> node_memory_working_set_bytes
      - container_cpu_usage_seconds_total --> container_cpu_usage_seconds
      - container_memory_working_set_bytes --> container_memory_working_set_bytes
      - scrape_error --> scrape_error
      ([#86282](https://github.com/kubernetes/kubernetes/pull/86282), [@RainbowMango](https://github.com/RainbowMango)) [SIG 노드]
- 향후 릴리스에서, kubelet은 CSI 명세에 따라 더 이상 CSI NodePublishVolume 대상 디렉터리를 만들지 않는다. 대상 경로를 적절하게 생성하고 처리하려면 CSI 드라이버를 상황에 맞게 업데이트해야 한다. ([#75535](https://github.com/kubernetes/kubernetes/issues/75535)) [SIG 스토리지]

#### kube-proxy:
- `--healthz-port`와 `--metrics-port` 플래그는 사용 중단되었으므로, 대신 `--healthz-bind-address`와 `--metrics-bind-address`를 사용한다. ([#88512](https://github.com/kubernetes/kubernetes/pull/88512), [@SataQiu](https://github.com/SataQiu)) [SIG 네트워크]
- kube-proxy에서 엔드포인트슬라이스(EndpointSlice)의 사용을 제어하기 위해 새로운 `EndpointSliceProxying` 기능 게이트가 추가되었다. 이 동작을 제어하는데 사용된 엔드포인트슬라이스 기능 게이트는 더 이상 kube-proxy에 영향을 미치지 않는다. 이 기능은 기본적으로 비활성화되어 있다. ([#86137](https://github.com/kubernetes/kubernetes/pull/86137), [@robscott](https://github.com/robscott))

#### kubeadm:
- `kubeadm upgrade node`에 대한 커맨드 라인 옵션 "kubelet-version"은 사용 중단되었으며 향후 릴리스에서 제거될 예정이다. ([#87942](https://github.com/kubernetes/kubernetes/pull/87942), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- `kubeadm alpha certs renew` 커맨드에서 실험용 플래그 `--use-api`의 사용을 중단한다. ([#88827](https://github.com/kubernetes/kubernetes/pull/88827), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- kube-dns는 사용 중단되었으며 향후 버전에서 지원되지 않는다. ([#86574](https://github.com/kubernetes/kubernetes/pull/86574), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- kubeadm-config 컨피그맵(ConfigMap)에 있는 `ClusterStatus` 구조체는 사용 중단되었으며, 향후 버전에서 제거될 예정이다. 제거될 때까지 kubeadm에 의해 유지 관리된다. 동일 정보는 `etcd`, `kube-apiserver` 파드 어노테이션, `kubeadm.kubernetes.io/etcd.advertise-client-urls`, `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint`에서 각각 찾을 수 있다. ([#87656](https://github.com/kubernetes/kubernetes/pull/87656), [@ereslibre](https://github.com/ereslibre)) [SIG 클러스터 라이프사이클]

#### kubectl:
- --dry-run 플래그의 boolean 값과 설정되지 않은 값은 사용 중단되었으며 이후 버전에서는 --dry-run=server|client|none 값이 필요하다. ([#87580](https://github.com/kubernetes/kubernetes/pull/87580), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG CLI]
- `kubectl apply --server-dry-run` 은 사용 중단되었으며 --dry-run=server로 대체되었다. ([# 87580] (https://github.com/kubernetes/kubernetes/pull/87580), [@julianvmodesto](https://github.com/julianvmodesto) [SIG CLI]

#### add-ons:
- 클러스터-모니터링 애드온을 제거한다. ([#85512](https://github.com/kubernetes/kubernetes/pull/85512), [@serathius](https://github.com/serathius)) [SIG 클러스터 라이프사이클, Instrumentation, 확장성, 테스트]

#### kube-scheduler:
- `scheduling_duration_seconds` 요약 메트릭은 사용 중단되었다. ([#86586](https://github.com/kubernetes/kubernetes/pull/86586), [@xiaoanyunfei](https://github.com/xiaoanyunfei)) [SIG 스케줄링]
- `scheduling_algorithm_predicate_evaluation_seconds`,
 `scheduling_algorithm_priority_evaluation_seconds` 메트릭은 사용 중단되었으며, `framework_extension_point_duration_seconds[extension_point="Filter"]`, `framework_extension_point_duration_seconds[extension_point="Score"]`으로 대체되었다. ([#86584](https://github.com/kubernetes/kubernetes/pull/86584), [@xiaoanyunfei](https://github.com/xiaoanyunfei)) [SIG 스케줄링]
- 스케줄러 정책 API에서 `AlwaysCheckAllPredicates`는 사용 중단되었다. ([#86369](https://github.com/kubernetes/kubernetes/pull/86369), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG 스케줄링]

#### 기타 사용 중단:
- k8s.io/node-api 컴포넌트는 더 이상 업데이트되지 않는다. 대신, k8s.io/api의 RuntimeClass 타입과 k8s.io/client-go의 생성된 클라이언트를 사용한다. ([#87503](https://github.com/kubernetes/kubernetes/pull/87503), [@liggitt](https://github.com/liggitt)) [SIG 노드와 릴리스]
- apiserver_request_total에서 'client' 레이블을 제거했다. ([#87669](https://github.com/kubernetes/kubernetes/pull/87669), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery 와 Instrumentation]

### API 변경

#### 새로운 API 타입/버전:
- 새로운 IngressClass 리소스가 추가되어 보다 나은 인그레스 구성이 가능하다. ([#88509](https://github.com/kubernetes/kubernetes/pull/88509), [@robscott](https://github.com/robscott)) [SIG API Machinery, 앱, CLI, 네트워크, 노드, 테스트]
- CSIDriver API는 storage.k8s.io/v1을 졸업했으며, 이제 사용이 가능하다. ([#84814](https://github.com/kubernetes/kubernetes/pull/84814), [@huffmanca](https://github.com/huffmanca)) [SIG 스토리지]

#### 새로운 API 필드:
- autoscaling/v2beta2 HorizontalPodAutoscaler는 스케일 동작을 구성할 수 있는 `spec.behavior` 필드를 추가했다. 스케일 업과 다운에 대한 동작은 별도로 지정된다. 정책 목록과 정책 선택 방법 뿐만 아니라, 양 방향에서 안정화 윈도우를 지정할 수 있다. 정책은 추가되거나 제거되는 절대 파드 개수 또는 파드 비율을 제한할 수 있다.] ([#74525](https://github.com/kubernetes/kubernetes/pull/74525), [@gliush](https://github.com/gliush)) [SIG API Machinery, 앱, 오토스케일링, CLI]
- 인그레스:
  - `spec.ingressClassName`은 사용 중단된 `kubernetes.io/ingress.class` 어노테이션을 대체하고, 인그레스 오브젝트를 특정 컨트롤러와 연결할 수 있게 한다.
  - 경로 정의는 `pathType` 필드를 추가했는데, 지정 경로가 유입되는 요청과 어떻게 일치해야 하는지 표시하는 것을 허용한다. 유효한 값은 `Exact`, `Prefix`, `ImplementationSpecific` 이다. ([#88587](https://github.com/kubernetes/kubernetes/pull/88587), [@cmluciano](https://github.com/cmluciano)) [SIG 앱, 클러스터 라이프사이클과 네트워크]
- 알파 기능인 `AnyVolumeDataSource`는 퍼시스턴트볼륨클레임 오브젝트가 spec.dataSource 필드를 사용하여 사용자 정의 유형을 데이터 소스로 참조할 수 있도록 한다. ([#88636](https://github.com/kubernetes/kubernetes/pull/88636), [@bswartz](https://github.com/bswartz)) [SIG 앱, 스토리지]
- 알파 기능인 `ConfigurableFSGroupPolicy`는 v1 파드가 spec.securityContext.fsGroupChangePolicy 정책을 지정하여 파드에 마운트된 볼륨에 파일 권한이 적용되는 방식을 제어할 수 있다. ([#88488](https://github.com/kubernetes/kubernetes/pull/88488), [@gnufied](https://github.com/gnufied)) [SIG 스토리지]
- 알파 기능인 `ServiceAppProtocol`을 사용하면 ServicePort 및 EndpointPort 정의에서 `appProtocol` 필드를 설정할 수 있다. ([#88503](https://github.com/kubernetes/kubernetes/pull/88503), [@robscott](https://github.com/robscott)) [SIG 앱, 네트워크]
- 알파 기능인 `ImmutableEphemeralVolumes`는 시크릿(Secret) 및 컨피그맵 오브젝트의 `immutable` 필드를 통해 내용을 변경할 수 없는(immutable) 것으로 표시할 수 있다. ([#86377](https://github.com/kubernetes/kubernetes/pull/86377), [@wojtek-t](https://github.com/wojtek-t)) [SIG 앱, CLI, 테스팅]

#### 다른 API 변경:
- 베타 기능인 `ServerSideApply`는 모든 새로운 오브젝트에 대해 변경된 필드를 추적하고 관리할 수 있게 해준다. 이는 관리자와 그것의 자체 필드에 대한 목록과 함께 `metadata`에 `managedFields`가 있음을 의미한다.
- 알파 기능인 `ServiceAccountIssuerDiscovery`는 서비스 어카운트 토큰을 발행하도록 구성된 API 서버에 의해 `/.well-known/openid-configuration` 및 `/openid/v1/jwks` 엔드포인트에 위치한 OIDC 디스커버리 정보 및 서비스 어카운트 토큰 검증 키를 공개할 수 있게 한다. ([#80724](https://github.com/kubernetes/kubernetes/pull/80724), [@cceckman](https://github.com/cceckman)) [SIG API Machinery, 인증, 클러스터 라이프사이클, 테스트]
- `x-kubernetes-list-map-keys`를 사용하여 목록 아이템을 고유하게 식별하는 속성을 지정하는 커스텀리소스데피니션(CustomResourceDefinition) 스키마는 해당 속성이 모든 목록 아이템에 존재하도록 하기 위해, 해당 속성을 필수로 설정하거나 기본값을 가져야 한다. 자세한 내용은 https://kubernetes.io/docs/reference/using-api/api-concepts/#merge-strategy 를 확인한다. ([#88076](https://github.com/kubernetes/kubernetes/pull/88076), [@eloyekunle](https://github.com/eloyekunle)) [SIG API Machinery, 테스트]
- `x-kubernetes-list-type: map` 또는 `x-kubernetes-list-type: set`을 사용하는 커스텀리소스데피니션 스키마는 이제 해당 커스텀 리소스의 목록 아이템이 고유한지 확인할 수 있다. ([#84920](https://github.com/kubernetes/kubernetes/pull/84920), [@sttts](https://github.com/sttts)) [SIG API Machinery]

#### 설정 파일 변경:

#### kube-apiserver:
- `--egress-selector-config-file` 설정 파일은 이제 apiserver.k8s.io/v1beta1 EgressSelectorConfiguration 설정 오브젝트를 수용하며, 네트워크 프록시에 대한 HTTP 또는 GRPC 연결을 지정할 수 있도록 업데이트되었다. ([#87179](https://github.com/kubernetes/kubernetes/pull/87179), [@Jefftree](https://github.com/Jefftree)) [SIG API Machinery, 클라우드 공급자, 클러스터 라이프사이클]

#### kube-scheduler:
- 다중 스케줄링 프로파일을 지원하는 kubescheduler.config.k8s.io/v1alpha2 설정 파일 버전이 승인되었다. ([#87628](https://github.com/kubernetes/kubernetes/pull/87628), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링]
  - `kubescheduler.config.k8s.io/v1alpha2`에서 HardPodAffinityWeight가 최상위 ComponentConfig 파라미터에서 InterPodAffinity 플러그인의 PluginConfig 파라미터로 이동했다. ([#88002](https://github.com/kubernetes/kubernetes/pull/88002), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링, 테스트]
  - Kube-scheduler는 둘 이상의 스케줄링 프로파일을 실행할 수 있다. 파드가 주어지면, 프로파일은 `.spec.schedulerName`을 사용하여 선택된다. ([#88285](https://github.com/kubernetes/kubernetes/pull/88285), [@alculquicondor](https://github.com/alculquicondor)) [SIG 앱, 스케줄링, 테스트]
  - v1alpha2 컴포넌트 설정에서 스케줄러 확장자(Scheduler Extender)를 설정할 수 있다. ([#88768](https://github.com/kubernetes/kubernetes/pull/88768), [@damemi](https://github.com/damemi)) [SIG 릴리스, 스케줄링, 테스트]
  - 스케줄러 프레임워크의 PostFilter는 kubescheduler.config.k8s.io/v1alpha2에서 PreScore로 이름이 변경되었다. ([#87751](https://github.com/kubernetes/kubernetes/pull/87751), [@skilxn-go](https://github.com/skilxn-go)) [SIG 스케줄링, 테스트]

#### kube-proxy:
- IPVS 연결 타임아웃을 설정하기 위해 kube-proxy 플래그 `--ipvs-tcp-timeout`, `--ipvs-tcpfin-timeout`, `--ipvs-udp-timeout`을 추가했다. ([#85517](https://github.com/kubernetes/kubernetes/pull/85517), [@andrewsykim](https://github.com/andrewsykim)) [SIG 클러스터 라이프사이클, 네트워크]
- kube-proxy에 옵션 `--detect-local-mode` 플래그를 추가했다. 유효한 값은 "ClusterCIDR"(기본값은 이전 동작과 일치)과 "NodeCIDR"이다. ([#87748](https://github.com/kubernetes/kubernetes/pull/87748), [@satyasm](https://github.com/satyasm)) [SIG 클러스터 라이프사이클, 네트워크, 스케줄링]
- Kube-controller-manager와 kube-scheduler는 기본적으로 kube-apiserver와 일치하도록 프로파일링을 노출한다. 비활성화하려면 `--enable-profiling=false`를 사용한다. ([#88663](https://github.com/kubernetes/kubernetes/pull/88663), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, 클라우드 공급자, 스케줄링]
- Kubelet 파드 리소스 API는 이제 활성화(active)된 파드에 대한 정보만 제공한다. ([#79409](https://github.com/kubernetes/kubernetes/pull/79409), [@takmatsu](https://github.com/takmatsu)) [SIG 노드]
- kube-controller-manager의 새로운 플래그 `--endpointslice-updates-batch-period`를 사용하여 파드 변경으로 생성된 엔드포인트슬라이스 업데이트 수를 줄일 수 있다. ([#88745](https://github.com/kubernetes/kubernetes/pull/88745), [@mborsz](https://github.com/mborsz)) [SIG API Machinery, 앱, 네트워크]
- kube-proxy, kubelet, kube-controller-manager 및 kube-scheduler의 새로운 플래그 `--show-hidden-metrics-for-version`은 이전 마이너 릴리스에서 사용 중단된 모든 숨겨진 메트릭을 표시하는 데 사용할 수 있다. ([#85279](https://github.com/kubernetes/kubernetes/pull/85279), [@RainbowMango](https://github.com/RainbowMango)) [SIG 클러스터 라이프사이클, 네트워크]

#### 베타가 된 기능:
  - StartupProbe ([#83437](https://github.com/kubernetes/kubernetes/pull/83437), [@matthyx](https://github.com/matthyx)) [SIG 노드, Scalability, 테스트]

#### GA 된 기능:
  - VolumePVCDataSource ([#88686](https://github.com/kubernetes/kubernetes/pull/88686), [@j-griffith](https://github.com/j-griffith)) [SIG 스토리지]
  - TaintBasedEvictions ([#87487](https://github.com/kubernetes/kubernetes/pull/87487), [@skilxn-go](https://github.com/skilxn-go)) [SIG API Machinery, 앱, 노드, 스케줄링, 테스트]
  - BlockVolume 및 CSIBlockVolume ([#88673](https://github.com/kubernetes/kubernetes/pull/88673), [@jsafrane](https://github.com/jsafrane)) [SIG 스토리지]
  - 윈도우 RunAsUserName ([#87790](https://github.com/kubernetes/kubernetes/pull/87790), [@marosset](https://github.com/marosset)) [SIG 앱 및 윈도우]
- 이전 릴리스에서는 관련 기능이 무조건 활성화되었으므로, 다음 기능 게이트가 제거되었다. CustomResourceValidation, CustomResourceSubresources, CustomResourceWebhookConversion, CustomResourcePublishOpenAPI, CustomResourceDefaulting ([#87475](https://github.com/kubernetes/kubernetes/pull/87475), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]

### 기능

- (많은 요청으로 인한) API 요청량 제한이 이제 로그 레벨 2의 client-go 로그에 리포트 된다. 메시지는 `Throttling request took 1.50705208s, request: GET:<URL>` 형태이다. 이러한 메시지가 있으면 관리자에게 클러스터를 적절히 조정해야 함을 알릴 수 있다. ([#87740](https://github.com/kubernetes/kubernetes/pull/87740), [@jennybuckley](https://github.com/jennybuckley)) [SIG API Machinery]
- FC 볼륨 플러그인에 마운트 옵션 지원이 추가된다. ([#87499](https://github.com/kubernetes/kubernetes/pull/87499), [@ejweber](https://github.com/ejweber)) [SIG 스토리지]
- 이용자 그룹(audience) 클레임의 spn: 접두사 없이 AAD 토큰을 가져올 수 있도록 azure 인증 모듈에 config-mode 플래그를 추가한다. 지정하지 않으면, 디폴트 동작이 변경되지 않는다. ([#87630](https://github.com/kubernetes/kubernetes/pull/87630), [@weinong](https://github.com/weinong)) [SIG API Machinery, 인증, CLI, 클라우드 공급자]
- CoreDNS 레플리카 개수 설정을 허용한다. ([#85837](https://github.com/kubernetes/kubernetes/pull/85837), [@pickledrick](https://github.com/pickledrick)) [SIG 클러스터 라이프사이클]
- kubectl exec 호출 시 --filename 플래그를 사용하여 리소스를 지정할 수 있도록 허용 ([#88460](https://github.com/kubernetes/kubernetes/pull/88460), [@soltysh](https://github.com/soltysh)) [SIG CLI, 테스트]
- Apiserver는 HTTP/2 클라이언트가 단일 apiserver에 갇히는 것을 방지하기 위해 그레이스풀(GOAWAY)하게 닫히게 하는 요청의 일부인 새로운 플래그 --goaway-chance를 추가했다. ([#88567](https://github.com/kubernetes/kubernetes/pull/88567), [@answer1991](https://github.com/answer1991)) [SIG API Machinery]
- Azure 클라우드 공급자는 이제 쿠버네티스 클러스터와 다른 AAD 테넌트 및 구독에서 Azure 네트워크 리소스(가상 네트워크, 로드 밸런서, 퍼블릭 IP, 라우팅 테이블, 네트워크 보안 그룹 등) 사용을 지원한다. 이 기능을 사용하려면, 다음을 참고한다.  https://github.com/kubernetes-sigs/cloud-provider-azure/blob/master/docs/cloud-provider-config.md#host-network-resources-in-different-aad-tenant-and-subscription. ([#88384](https://github.com/kubernetes/kubernetes/pull/88384), [@bowen5](https://github.com/bowen5)) [SIG 클라우드 공급자]
- Azure VMSS/VMSSVM 클라이언트는 이제 스로틀링(throttling) 요청을 금지한다. ([#86740](https://github.com/kubernetes/kubernetes/pull/86740), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Azure 클라우드 공급자 캐시 TTL은 설정 가능하며, Azure 클라우드 공급자 목록은 다음과 같다.
  - "availabilitySetNodesCacheTTLInSeconds"
  - "vmssCacheTTLInSeconds"
  - "vmssVirtualMachinesCacheTTLInSeconds"
  - "vmCacheTTLInSeconds"
  - "loadBalancerCacheTTLInSeconds"
  - "nsgCacheTTLInSeconds"
  - "routeTableCacheTTLInSeconds"
  ([#86266](https://github.com/kubernetes/kubernetes/pull/86266), [@zqingqing1](https://github.com/zqingqing1)) [SIG 클라우드 공급자]
- Azure 글로벌 속도 제한(rate limit)은 클라이언트별로 전환된다. 새로운 속도 제한 설정 옵션이 도입되었고, 다음과 같다. routeRateLimit, SubnetsRateLimit, InterfaceRateLimit, RouteTableRateLimit, LoadBalancerRateLimit, PublicIPAddressRateLimit, SecurityGroupRateLimit, VirtualMachineRateLimit, StorageAccountRateLimit, DiskRateLimit, SnapshotRateLimit, VirtualMachineScaleSetRateLimit, VirtualMachineSizeRateLimit. 원래 속도 제한 옵션은 새 클라이언트의 속도 리미터(limiter)의 디폴트 값이다. ([#86515](https://github.com/kubernetes/kubernetes/pull/86515), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Azure 네트워크 및 VM 클라이언트가 이제 스로틀링 요청을 금지한다. ([#87122](https://github.com/kubernetes/kubernetes/pull/87122), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Azure 스토리지 클라이언트가 이제 스로틀링 요청을 금지한다. ([#87306](https://github.com/kubernetes/kubernetes/pull/87306), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Azure: 단일 스택 IPv6에 대한 지원을 추가한다. ([#88448](https://github.com/kubernetes/kubernetes/pull/88448), [@aramase](https://github.com/aramase)) [SIG 클라우드 공급자]
- 스케줄러의 ComponentConfig에서 PodTopologySpread 플러그인에 대한 DefaultConstraints를 지정할 수 있다. ([#88671](https://github.com/kubernetes/kubernetes/pull/88671), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링]
- VMSS 클러스터의 VM list 작업을 피하기 위해 DisableAvailabilitySetNodes가 추가되었다. vmType이 "vmss"이고 모든 노드(컨트롤 플레인 노드 포함)가 VMSS 가상 머신인 경우에만 사용해야 한다. ([#87685](https://github.com/kubernetes/kubernetes/pull/87685), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Elasticsearch는 advertise 주소 자동 설정을 지원한다. ([#85944](https://github.com/kubernetes/kubernetes/pull/85944), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클, Instrumentation]
- 엔드포인트슬라이스가 이제 디폴트로 활성화된다. 새로운 `EndpointSliceProxying` 기능 게이트는 kube-proxy가 엔드포인트슬라이스를 사용할지 여부를 결정하며, 디폴트로 비활성화되어 있다. ([#86137](https://github.com/kubernetes/kubernetes/pull/86137), [@robscott](https://github.com/robscott)) [SIG 네트워크]
- Kube-proxy: iptables 프록시에 이중 스택 IPv4/IPv6 지원이 추가되었다. ([#82462](https://github.com/kubernetes/kubernetes/pull/82462), [@vllry](https://github.com/vllry)) [SIG 네트워크]
- Kubeadm은 이제 kube-controller-manager에 대한 이중 스택 노드 cidr 마스크의 자동 계산을 지원한다. ([#85609](https://github.com/kubernetes/kubernetes/pull/85609), [@Arvinderpal](https://github.com/Arvinderpal)) [SIG 클러스터 라이프사이클]
- Kubeadm: 잡(Job)을 배포하는 업그레이드된 헬스 체크를 추가한다. ([#81319](https://github.com/kubernetes/kubernetes/pull/81319), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: 실험 기능 게이트 PublicKeysECDSA를 추가하여 "kubeadm init"에서 ECDSA 인증서가 있는
클러스터를 생성할 수 있게 한다. "kubeadm alpha certs renew"을 사용하여 기존 ECDSA 인증서의 갱신도 지원되지만, 즉시 또는 업그레이드 중에 RSA와 ECDSA 알고리즘간에 전환하지는 않는다. ([#86953](https://github.com/kubernetes/kubernetes/pull/86953), [@rojkov](https://github.com/rojkov)) [SIG API Machinery, Auth 및 클러스터 라이프사이클]
- Kubeadm: JSON, YAML, Go 템플릿 및 JsonPath 형식으로 'kubeadm config images list' 커맨드의 구조화된 출력을 구현했다. ([#86810](https://github.com/kubernetes/kubernetes/pull/86810), [@bart0sh](https://github.com/bart0sh)) [SIG 클러스터 라이프사이클]
- Kubeadm: kubeconfig 인증서 갱신 시, 내장된 CA를 디스크의 CA와 동기화된 상태로 유지한다. ([#88052](https://github.com/kubernetes/kubernetes/pull/88052), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: 같은 이름의 노드가 이미 존재하는 경우 클러스터에 조인하려는 노드를 거부한다. ([#81056](https://github.com/kubernetes/kubernetes/pull/81056), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: kubeadm-flags.env에서 윈도우 특화된 kubelet 플래그를 지원한다. ([#88287](https://github.com/kubernetes/kubernetes/pull/88287), [@gab-satchi](https://github.com/gab-satchi)) [SIG 클러스터 라이프사이클, 윈도우]
- Kubeadm: 이미지를 가져오는 데 실패한 후 자동 재시도를 지원한다. ([#86899](https://github.com/kubernetes/kubernetes/pull/86899), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 알 수 없는 k8s 버전이 전달되면 가장 근접한 알려진 etcd 버전으로 폴백(fallback) 업그레이드를 지원한다. ([#88373](https://github.com/kubernetes/kubernetes/pull/88373), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubectl/drain: 축출 비활성화(disable-eviction) 옵션을 추가한다. 축출이 지원되는 경우에도, 삭제하기 위해 강제로 드레인(drain)한다. 이것은 PodDisruptionBudgets 확인을 우회하므로 주의해서 사용해야 한다. ([#85571](https://github.com/kubernetes/kubernetes/pull/85571), [@michaelgugino](https://github.com/michaelgugino)) [SIG CLI]
- Kubectl/drain: skip-wait-for-delete-timeout 옵션을 추가한다. 파드의 `DeletionTimestamp`가 N초 보다 오래된 경우, 파드를 기다리는 것을 건너뛴다. 건너뛰려면 0초보다 커야 한다. ([#85577](https://github.com/kubernetes/kubernetes/pull/85577), [@michaelgugino](https://github.com/michaelgugino)) [SIG CLI]
- 사전 구성된 로드 밸런서의 Azure 클라우드 공급자에 `preConfiguredBackendPoolLoadBalancerTypes` 옵션이 추가됐다. 가능한 값: `""`, `"internal"`, `"external"`,`"all"` ([#86338](https://github.com/kubernetes/kubernetes/pull/86338), [@gossion](https://github.com/gossion)) [SIG 클라우드 공급자]
- PodTopologySpread 플러그인은 이제 스케줄링 결정을 할 때 terteringPod를 제외한다. ([#87845](https://github.com/kubernetes/kubernetes/pull/87845), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG 스케줄링]
- 클라우드 공급자/azure : 네트워크 보안 그룹은 이제 별도의 리소스 그룹에 있을 수 있다. ([#87035](https://github.com/kubernetes/kubernetes/pull/87035), [@CecileRobertMichon](https://github.com/CecileRobertMichon)) [SIG 클라우드 공급자]
- SafeSysctlWhitelist: net.ipv4.ping_group_range를 추가한다. ([#85463](https://github.com/kubernetes/kubernetes/pull/85463), [@AkihiroSuda](https://github.com/AkihiroSuda)) [SIG 인증]
- 스케줄러 프레임워크 허용 플러그인은 이제 예약 플러그인 후 스케줄링 주기가 끝나는 시점에 플러그인이 실행된다. 바인딩 주기 시작 시 허가 대기 상태가 유지된다. ([#88199](https://github.com/kubernetes/kubernetes/pull/88199), [@mateuszlitwin](https://github.com/mateuszlitwin)) [SIG 스케줄링]
- 스케줄러: DefaultBinder 플러그인을 추가한다. ([#87430](https://github.com/kubernetes/kubernetes/pull/87430), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링, 테스트]
- TopologySpreadConstraints를 정의하는 파드에 대한 디폴트 스프레드 스코어링(spreading scoring) 플러그인을 건너뛴다. ([#87566](https://github.com/kubernetes/kubernetes/pull/87566), [@skilxn-go](https://github.com/skilxn-go)) [SIG 스케줄링]
- kubectl --dry-run 플래그는 이제 클라이언트-사이드와 서버-사이드의 dry-run 전략을 지원하기 위해 'client', 'server', 'none' 값을 허용한다. --dry-run 플래그의 boolean 값과 설정되지 않은 값은 사용 중단(deprecated)되었으며 향후 버전에서는 값이 필요하다. ([#87580](https://github.com/kubernetes/kubernetes/pull/87580), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG CLI]
- apply, patch, create, run, annotate, label, set, autoscale, drain, rollout undo, 그리고 expose를 포함한 명령에 대해 --dry-run=server를 사용하여 kubectl에서 서버-사이드 dry-run을 지원한다. ([#87714](https://github.com/kubernetes/kubernetes/pull/87714), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG API Machinery, CLI, 테스트]
- --dry-run=server|client를 kubectl delete, taint, replace에 추가한다. ([#88292](https://github.com/kubernetes/kubernetes/pull/88292), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG CLI, 테스트]
- PodTopologySpread(기능 게이트 `EvenPodsSpread`) 기능은 1.18에서 디폴트로 활성화되었다. ([#88105](https://github.com/kubernetes/kubernetes/pull/88105), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG 스케줄링, 테스트]
- kubelet 및 디폴트 도커 런타임은 이제 대상 컨테이너의 리눅스 프로세스 네임스페이스에서 임시 컨테이너 실행을 지원한다. 다른 컨테이너 런타임은 이 기능에 대한 지원을 구현해야 해당 런타임에서 사용할 수 있다. ([#84731](https://github.com/kubernetes/kubernetes/pull/84731), [@verb](https://github.com/verb)) [SIG 노드]
- `CPUManager` 상태 파일의 기본 형식이 변경되었다. 업그레이드는 원활해야 하지만, 이전 형식을 참조하는 써드파티 도구는 업데이트해야 한다. ([#84462](https://github.com/kubernetes/kubernetes/pull/84462), [@klueska](https://github.com/klueska)) [SIG 노드, 테스트]
- CNI 버전을 v0.8.5로 업데이트한다. ([#78819](https://github.com/kubernetes/kubernetes/pull/78819), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, 클러스터 라이프사이클, 네트워크, 릴리스, 테스트]
- Webhook은 네트워크 프록시를 알파 버전으로 지원한다. ([#85870](https://github.com/kubernetes/kubernetes/pull/85870), [@Jefftree](https://github.com/Jefftree)) [SIG API Machinery, 인증, 테스트]
- 클라이언트 인증서 파일이 제공되면, 새 연결을 위해 파일을 다시 로드하고 인증서가 변경되면 연결을 닫는다. ([#79083](https://github.com/kubernetes/kubernetes/pull/79083), [@jackkleeman](https://github.com/jackkleeman)) [SIG API Machinery, 인증, 노드, 테스트]
- --force 플래그로 kubectl을 사용하여 오브젝트를 삭제할 때, 더 이상 --grace-period=0을 지정할 필요가 없다. ([#87776](https://github.com/kubernetes/kubernetes/pull/87776), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- GCE의 윈도우 노드는 컨트롤 플레인에 가상 TPM-기반 인증을 사용할 수 있다. ([#85466](https://github.com/kubernetes/kubernetes/pull/85466), [@pjh](https://github.com/pjh)) [SIG 클러스터 라이프사이클]
- 이제 "--node-ip ::"를 kubelet에 전달하여 노드의 기본 주소로 사용할 IPv6 주소를 자동으로 감지해야 함을 나타낼 수 있다. ([#85850](https://github.com/kubernetes/kubernetes/pull/85850), [@danwinship](https://github.com/danwinship)) [SIG 클라우드 공급자, 네트워크, 노드]
- `kubectl`은 이제 `kubectl alpha debug` 명령을 포함한다. 이 명령을 사용하면 디버깅 목적으로 임시 컨테이너를 실행 중인 파드에 연결할 수 있다. ([#88004](https://github.com/kubernetes/kubernetes/pull/88004), [@verb](https://github.com/verb)) [SIG CLI]
- kubeconfig 파일 및 kubectl의 --tls-server-name을 통해 TLS 서버 이름 재정의를 지정할 수 있다. ([#88769](https://github.com/kubernetes/kubernetes/pull/88769), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, 인증, CLI]

#### 메트릭:
- `rest_client_rate_limiter_duration_seconds` 메트릭을 컴포넌트 기반에 추가하여 클라이언트 사이드 속도 제한기(rate limiter) 지연(latency)을 초 단위로 추적한다. 동사(verb)와 URL로 분류된다. ([#88134](https://github.com/kubernetes/kubernetes/pull/88134), [@jennybuckley](https://github.com/jennybuckley)) [SIG API Machinery, 클러스터 라이프사이클, Instrumentation]
- exec 인증에 대한 두 개의 클라이언트 인증서 메트릭을 추가했다.
    - `rest_client_certificate_expiration_seconds`는 현재 클라이언트 인증서의 수명을 보고하는 측정기이다. UTC 1970년 1월 1일 이후 만료 시간을 초 단위로 보고한다.
    - `rest_client_certificate_rotation_age`는 방금 교체한 클라이언트 인증서의 수명을 초 단위로 보고하는 히스토그램이다. ([#84382](https://github.com/kubernetes/kubernetes/pull/84382), [@sambdavidson](https://github.com/sambdavidson)) [SIG API Machinery, 인증, 클러스터 라이프사이클, Instrumentation]
- 컨트롤러 관리자는 작업큐 메트릭을 제공한다. ([#87967](https://github.com/kubernetes/kubernetes/pull/87967), [@zhan849](https://github.com/zhan849)) [SIG API Machinery]
- 다음의 메트릭 기능이 꺼져 있다.
  - kubelet_pod_worker_latency_microseconds
  - kubelet_pod_start_latency_microseconds
  - kubelet_cgroup_manager_latency_microseconds
  - kubelet_pod_worker_start_latency_microseconds
  - kubelet_pleg_relist_latency_microseconds
  - kubelet_pleg_relist_interval_microseconds
  - kubelet_eviction_stats_age_microseconds
  - kubelet_runtime_operations
  - kubelet_runtime_operations_latency_microseconds
  - kubelet_runtime_operations_errors
  - kubelet_device_plugin_registration_count
  - kubelet_device_plugin_alloc_latency_microseconds
  - kubelet_docker_operations
  - kubelet_docker_operations_latency_microseconds
  - kubelet_docker_operations_errors
  - kubelet_docker_operations_timeout
  - network_plugin_operations_latency_microseconds ([#83841](https://github.com/kubernetes/kubernetes/pull/83841), [@RainbowMango](https://github.com/RainbowMango)) [SIG 네트워크, 노드]
- Kube-apiserver 메트릭은 이제 /healthz, /livez, /readyz 요청에 대한 요청 수, 대기 시간 및 응답 크기를 포함한다. ([#83598](https://github.com/kubernetes/kubernetes/pull/83598), [@jktomer](https://github.com/jktomer)) [SIG API Machinery]
- Kubelet은 이제 인증서 로테이션(rotation)을 수행할 수 없는 경우, `server_expiration_renew_failure` 및 `client_expiration_renew_failure` 메트릭 카운터를 제공한다. ([#84614](https://github.com/kubernetes/kubernetes/pull/84614), [@rphillips](https://github.com/rphillips)) [SIG API Machinery, 인증, CLI, 클라우드 공급자, 클러스터 라이프사이클, Instrumentation, 노드, 릴리스]
- Kubelet: 메트릭 process_start_time_seconds는 ALPHA 안정성 레벨로 표시된다. ([#85446](https://github.com/kubernetes/kubernetes/pull/85446), [@RainbowMango](https://github.com/RainbowMango)) [SIG API Machinery, 클러스터 라이프사이클, Instrumentation, 노드]
- 헬스 상태가 좋지 않은 PLEG의 진단을 돕기 위한 새로운 메트릭 `kubelet_pleg_last_seen_seconds`를 추가한다. ([#86251](https://github.com/kubernetes/kubernetes/pull/86251), [@bboreham](https://github.com/bboreham)) [SIG 노드]

### 기타 (버그, 정리(Cleanup) or Flake(플레이크))

- 1.16 이상의 API 서버에 대해, 1.15 이전으로 클라이언트 회귀가 파드 상태의 podIP 또는 노드 명세의 podCIDR을 업데이트할 수 없었던 문제를 수정했다. ([#88505](https://github.com/kubernetes/kubernetes/pull/88505), [@liggitt](https://github.com/liggitt)) [SIG 앱, 네트워크]
- 롤링 업데이트 파티션에 대한 "kubectl describe statefulsets.apps" 출력 가비지를 수정했다. ([#85846](https://github.com/kubernetes/kubernetes/pull/85846), [@phil9909](https://github.com/phil9909)) [SIG CLI]
- PV의 파일시스템이 디스크의 실제 파일시스템과 일치하지 않을 때 PV에 이벤트를 추가한다. ([#86982](https://github.com/kubernetes/kubernetes/pull/86982), [@gnufied](https://github.com/gnufied)) [SIG 스토리지]
- azure 디스크 WriteAccelerator 지원을 추가한다. ([#87945](https://github.com/kubernetes/kubernetes/pull/87945), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- VM 인스턴스 업데이트를 위해 고 루틴(goroutines) 간 지연(delay)을 추가한다. ([#88094](https://github.com/kubernetes/kubernetes/pull/88094), [@aramase](https://github.com/aramase)) [SIG 클라우드 공급자]
- 클러스터 덤프 정보에 init 컨테이너 로그를 추가한다. ([#88324](https://github.com/kubernetes/kubernetes/pull/88324), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- 애드온 : elasticsearch 디스커버리는 IPv6를 지원한다. ([#85543](https://github.com/kubernetes/kubernetes/pull/85543), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클, Instrumentation]
- PV 및 PVC에 "volume.beta.kubernetes.io/migrated-to" 어노테이션을 추가하면, PV 및 PVC가 마이그레이션되어 프로비저닝과 삭제를 위해 해당 오브젝트를 선택할 수 있도록 외부 프로비저너에 신호를 보낸다. ([#87098](https://github.com/kubernetes/kubernetes/pull/87098), [@davidz627](https://github.com/davidz627)) [SIG 스토리지]
- 모든 api-server 로그 요청 라인은 grep으로 찾기 쉬운 형식으로 되어 있다. ([#87203](https://github.com/kubernetes/kubernetes/pull/87203), [@lavalamp](https://github.com/lavalamp)) [SIG API Machinery]
- Azure VMSS LoadBalancerBackendAddressPools 업데이트는 순차적-동기(sequential-sync) + 동시-비동기(concurrent-async) 요청으로 개선되었다. ([#88699](https://github.com/kubernetes/kubernetes/pull/88699), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Azure 클라우드 공급자는 이제 이용자 그룹 클레임에 spn: 접두사가 없는 AAD 토큰을 얻는다. ([#87590](https://github.com/kubernetes/kubernetes/pull/87590), [@weinong](https://github.com/weinong)) [SIG 클라우드 공급자]
- AzureFile 및 CephFS는 민감한 마운트 옵션의 로깅을 방지하는 새로운 마운트 라이브러리를 사용한다. ([#88684](https://github.com/kubernetes/kubernetes/pull/88684), [@saad-ali](https://github.com/saad-ali)) [SIG 스토리지]
- 리눅스 노드와 윈도우 노드를 포함하는 쿠버네티스 클러스터에서 윈도우 스케줄링을 피하기 위해, dns-horizontal 컨테이너를 리눅스 노드에 바인딩한다. ([#83364](https://github.com/kubernetes/kubernetes/pull/83364), [@wawa0210](https://github.com/wawa0210)) [SIG 클러스터 라이프사이클, 윈도우]
- 윈도우 스케줄링을 피하기 위해 kube-dns 컨테이너를 리눅스 노드에 바인딩한다. ([#83358](https://github.com/kubernetes/kubernetes/pull/83358), [@wawa0210](https://github.com/wawa0210)) [SIG 클러스터 라이프사이클, 윈도우]
- 리눅스 노드와 윈도우 노드를 포함하는 쿠버네티스 클러스터에서 윈도우 스케줄링을 피하기 위해, metadata-agent 컨테이너를 리눅스 노드에 바인딩한다. ([#83363](https://github.com/kubernetes/kubernetes/pull/83363), [@wawa0210](https://github.com/wawa0210)) [SIG 클러스터 라이프사이클, Instrumentation, 윈도우]
- 리눅스 노드와 윈도우 노드를 포함하는 쿠버네티스 클러스터에서 윈도우 스케줄링을 피하기 위해, metrics-server 컨테이너를 리눅스 노드에 바인딩한다. ([#83362](https://github.com/kubernetes/kubernetes/pull/83362), [@wawa0210](https://github.com/wawa0210)) [SIG 클러스터 라이프사이클, Instrumentation, 윈도우]
- 버그 수정: 최신 패키지 노드를 포함해야 한다. &#35;351 (@caseydavenport) ([#84163](https://github.com/kubernetes/kubernetes/pull/84163), [@david-tigera](https://github.com/david-tigera)) [SIG 클러스터 라이프사이클]
- CPU 상한(limit)은 이제 윈도우 컨테이너에 적용된다. 노드가 오버-프로비저닝된 경우, 가중치가 사용되지 않으며 상한만 고려된다. ([#86101](https://github.com/kubernetes/kubernetes/pull/86101), [@PatrickLang](https://github.com/PatrickLang)) [SIG 노드, 테스트, 윈도우]
- COS 노드의 core_pattern을 절대 경로로 변경했다. ([#86329](https://github.com/kubernetes/kubernetes/pull/86329), [@mml](https://github.com/mml)) [SIG 클러스터 라이프사이클, 노드]
- Client-go 인증서 관리자 교체는 발급된 인증서와 함께 선택적인 중급(intermediate)의 체인을 유지하는 기능을 얻었다. ([#88744](https://github.com/kubernetes/kubernetes/pull/88744), [@jackkleeman](https://github.com/jackkleeman)) [SIG API Machinery, 인증]
- 클라우드 공급자 설정인 CloudProviderBackoffMode가 더 이상 사용되지 않으므로 제거되었다. ([#88463](https://github.com/kubernetes/kubernetes/pull/88463), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- debian-hyperkube-base 이미지가 사용 중단되고 제거되므로 적합(Conformance) 이미지는 이제 stretch-slim에 의존한다. ([#88702](https://github.com/kubernetes/kubernetes/pull/88702), [@dims](https://github.com/dims)) [SIG 클러스터 라이프사이클, 릴리스, 테스트]
- kubectl create 커맨드에서 --generator 플래그는 사용 중단(deprecated)됨 ([#88655](https://github.com/kubernetes/kubernetes/pull/88655), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- 초기화 단계(preflight) 동안, kubeadm은 이제 conntrack 실행 파일이 있는지 확인한다. ([#85857](https://github.com/kubernetes/kubernetes/pull/85857), [@hnanni](https://github.com/hnanni)) [SIG 클러스터 라이프사이클]
- 엔드포인트슬라이스에는 파드 종료를 위한 엔드포인트가 없어야 한다. ([#89056](https://github.com/kubernetes/kubernetes/pull/89056), [@andrewsykim](https://github.com/andrewsykim)) [SIG 앱, 네트워크]
- 임시 저장 한도를 초과하는 파드로 인한 축출은 이제 `kubelet_evictions` 메트릭에 의해 기록되며 경고할 수 있다. ([#87906](https://github.com/kubernetes/kubernetes/pull/87906), [@smarterclayton](https://github.com/smarterclayton)) [SIG 노드]
- kubectl이 널(null) 값을 잘못 거부하지 않도록 하기 위해 널 입력 가능(nullable), 필수/비필수 필드를 만들어 공개된 OpenAPI 스키마를 필터링한다. ([#85722](https://github.com/kubernetes/kubernetes/pull/85722), [@sttts](https://github.com/sttts)) [SIG API Machinery]
- --shutdown-delay-duration이 경과하기 전에, 종료가 시작된 직후 오류를 반환하도록 /readyz를 수정한다. ([#88911](https://github.com/kubernetes/kubernetes/pull/88911), [@tkashem](https://github.com/tkashem)) [SIG API Machinery]
- 감시(watch) 요청 처리 시 API Server 잠재적 메모리 누수 이슈를 수정한다. ([#85410](https://github.com/kubernetes/kubernetes/pull/85410), [@answer1991](https://github.com/answer1991)) [SIG API Machinery]
- 엔드포인트슬라이스 컨트롤러 경합 조건(race condition)을 수정하고 엔드포인트슬라이스의 외부 변경을 처리하는지 확인한다. ([#85703](https://github.com/kubernetes/kubernetes/pull/85703), [@robscott](https://github.com/robscott)) [SIG 앱, 네트워크]
- 순수한 ipv6 vsphere 환경에서 손실된 IPv6 주소 이슈를 수정한다. ([#86001](https://github.com/kubernetes/kubernetes/pull/86001), [@hubv](https://github.com/hubv)) [SIG 클라우드 공급자]
- 예기치 않은 LoadBalancer 업데이트가 발생하지 않도록 LoadBalancer 규칙 검사를 수정한다. ([#85990](https://github.com/kubernetes/kubernetes/pull/85990), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- Kube-proxy에서 다른 IP 군으로 로드 밸런서를 사용할 때 다운되는 버그를 수정한다. ([#87117](https://github.com/kubernetes/kubernetes/pull/87117), [@aojea](https://github.com/aojea)) [SIG 네트워크]
- port-forward 버그 수정: 이름이 지정된 포트가 서비스와 작동하지 않는 문제를 수정한다. ([#85511](https://github.com/kubernetes/kubernetes/pull/85511), [@oke-py](https://github.com/oke-py)) [SIG CLI]
- 오래된 IPv6 엔드포인트가 정리되지 않은 이중 스택 IPVS 프록시의 버그를 수정한다. ([#87695](https://github.com/kubernetes/kubernetes/pull/87695), [@andrewsykim](https://github.com/andrewsykim)) [SIG 네트워크]
- orphan 리비전(revision)을 채택할 수 없고 스테이트풀셋(statefulset)을 동기화 할 수 없는 버그를 수정한다. ([#86801](https://github.com/kubernetes/kubernetes/pull/86801), [@likakuli](https://github.com/likakuli)) [SIG 앱]
- ExternalTrafficPolicy가 ExternalIP 서비스에 적용되지 않는 버그를 수정한다. ([#88786](https://github.com/kubernetes/kubernetes/pull/88786), [@freehan](https://github.com/freehan)) [SIG 네트워크]
- kubenet이 tc 출력을 파싱(parse)하지 못하는 버그를 수정한다. ([#83572](https://github.com/kubernetes/kubernetes/pull/83572), [@chendotjs](https://github.com/chendotjs)) [SIG 네트워크]
- 파드가 IP 주소를 얻지 못하게 하는 kubenet의 회귀 문제를 수정한다. ([#85993](https://github.com/kubernetes/kubernetes/pull/85993), [@chendotjs](https://github.com/chendotjs)) [SIG 네트워크, 노드]
- azure 파일 AuthorizationFailure를 수정한다. ([#85475](https://github.com/kubernetes/kubernetes/pull/85475), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- 엔드포인트슬라이스 컨트롤러가 공유 오브젝트를 수정하려고 하는 버그를 수정한다. ([#85368](https://github.com/kubernetes/kubernetes/pull/85368), [@robscott](https://github.com/robscott)) [SIG API Machinery, 앱, 네트워크]
- aws-load-balancer-security-groups 어노테이션 처리 문제를 수정한다. 이 어노테이션이 할당된 보안 그룹은 더 이상 쿠버네티스에 의해 수정되지 않으며, 대부분의 사용자가 예상하는 동작이다. 이 어노테이션을 사용하면, 더 이상 불필요한 보안 그룹이 만들어지지 않는다. ([#83446](https://github.com/kubernetes/kubernetes/pull/83446), [@Elias481](https://github.com/Elias481)) [SIG 클라우드 공급자]
- 부정확한 캐시로 인한 잘못된 VMSS 업데이트를 수정한다. ([#89002](https://github.com/kubernetes/kubernetes/pull/89002), [@ArchangelSDY](https://github.com/ArchangelSDY)) [SIG 클라우드 공급자]
- hostname의 종속성을 제거하여 윈도우 용 isCurrentInstance를 수정한다. ([#89138](https://github.com/kubernetes/kubernetes/pull/89138), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- LoadBalancer가 또다른 리소스 그룹에 지정된 경우 azure 클라우드 공급자에서 찾을 수 없는 리소스에 대한 이슈 #85805를 수정한다. ([#86502](https://github.com/kubernetes/kubernetes/pull/86502), [@levimm](https://github.com/levimm)) [SIG 클라우드 공급자]
- local=true로 설정한 경우 kubectl annotate 오류를 수정한다. ([#86952](https://github.com/kubernetes/kubernetes/pull/86952), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- kubectl create deployment 커맨드가 사용하는 이미지 이름을 수정한다. ([#86636](https://github.com/kubernetes/kubernetes/pull/86636), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- `kubectl drain ignore` 데몬셋(daemonset) 및 기타 오류를 수정한다. ([#87361](https://github.com/kubernetes/kubernetes/pull/87361), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- 노드 이벤트에서 "involvedObject"에 대한 "apiVersion"이 누락되는 문제를 수정한다. ([#87537](https://github.com/kubernetes/kubernetes/pull/87537), [@uthark](https://github.com/uthark)) [SIG 앱, 노드]
- azure 클라우드 공급자에서 nil 포인터 역참조를 수정한다. ([#85975](https://github.com/kubernetes/kubernetes/pull/85975), [@ldx](https://github.com/ldx)) [SIG 클라우드 공급자]
- 스테이트풀셋을 여러 번 적용하지 못하게 하는 스테이트풀셋 변환에서 회귀 문제를 수정 ([#87706](https://github.com/kubernetes/kubernetes/pull/87706), [@liggitt](https://github.com/liggitt)) [SIG 앱, 테스트]
- 여러 경로를 함께 업데이트 할 때 경로 충돌된 경로 업데이트 작업을 수정한다. ([#88209](https://github.com/kubernetes/kubernetes/pull/88209), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- 파드 볼륨 처리가 실패할 때 kubelet이 PVC/PV 오브젝트를 반복적으로 가져오는 것을 방지하도록 수정한다. 이렇게 하면 이 같은 오류 시나리오에서 API 서버로의 계속적인 연결시도(hammering)를 막을 수 있지만, 파드 볼륨 처리의 일부 오류가 재시도되기까지 최대 2-3분이 소요될 수 있다. ([#88141](https://github.com/kubernetes/kubernetes/pull/88141), [@tedyu](https://github.com/tedyu)) [SIG 노드, 스토리지]
- DNS 레이블 서비스 어노테이션이 설정되지 않은 경우, PIP의 DNS가 삭제되는 버그를 수정한다. ([#87246] ([#87246](https://github.com/kubernetes/kubernetes/pull/87246), [@nilo19](https://github.com/nilo19)) [SIG 클라우드 공급자]
- 컨트롤 플레인을 사용할 수 없게 하는 etcd LIST에서 썬더링 허드(thundering herd)를 야기하는 컨트롤 플레인 호스트 롤링 업그레이드를 수정한다. ([#86430](https://github.com/kubernetes/kubernetes/pull/86430), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery, 노드, 테스트]
- 수정: CSINode에 대한 azure 디스크 마이그레이션 지원을 추가한다. ([#88014](https://github.com/kubernetes/kubernetes/pull/88014), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- 수정: azure 클라이언트에서 다시 시도할 수 없는(non-retriable) 오류를 추가한다. ([#87941](https://github.com/kubernetes/kubernetes/pull/87941), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자]
- 수정: azure 디스크 연결/해제 시 복구를 추가한다. ([#88444](https://github.com/kubernetes/kubernetes/pull/88444), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자]
- 수정: azure 데이터 디스크는 기본적으로 os 디스크와 동일한 키를 사용해야 한다. ([#86351](https://github.com/kubernetes/kubernetes/pull/86351), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자]
- 수정: azure 디스크를 Standard_DC4s/DC2s 인스턴스에 마운트할 수 없다. ([#86612](https://github.com/kubernetes/kubernetes/pull/86612), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- 수정: azure 파일 마운트 타임아웃 이슈를 해결한다. ([#88610](https://github.com/kubernetes/kubernetes/pull/88610), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- 수정: azure 디스크 전에 디스크 상태를 확인한다. ([#88360](https://github.com/kubernetes/kubernetes/pull/88360), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자]
- 수정: csi 드라이버에서 손상된 마운트 포인트를 해결한다. ([#88569](https://github.com/kubernetes/kubernetes/pull/88569), [@andyzhangx](https://github.com/andyzhangx)) [SIG 스토리지]
- 수정: azure 디스크 lun 이슈를 해결한다. ([#88158](https://github.com/kubernetes/kubernetes/pull/88158), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- 수정: azure 디스크 최대 개수를 업데이트한다. ([#88201](https://github.com/kubernetes/kubernetes/pull/88201), [@andyzhangx](https://github.com/andyzhangx)) [SIG 클라우드 공급자, 스토리지]
- AWS에서 "디바이스 X를 ​​요청했지만 Y를 찾음" 연결 오류를 수정했다. ([#85675](https://github.com/kubernetes/kubernetes/pull/85675), [@jsafrane](https://github.com/jsafrane)) [SIG 클라우드 공급자, 스토리지]
- CIDR 범위를 벗어나면 `Except` 값이 허용되는 네트워크폴리시(NetworkPolicy) 유효성 검사를 수정했다. ([#86578](https://github.com/kubernetes/kubernetes/pull/86578), [@tnqn](https://github.com/tnqn)) [SIG 네트워크]
- TopologyManager의 버그를 수정했다. 이전에는 컨테이너 생성이 직렬화된(serialized) 상황에서만 TopologyManager가 정렬을 보장했다. 이제는 컨테이너 생성의 모든 시나리오에서 정렬이 보장된다. ([#87759](https://github.com/kubernetes/kubernetes/pull/87759), [@klueska](https://github.com/klueska)) [SIG 노드]
- 노드가 추가될 때 공급자 ID를 판별하는 중에 오류가 발생하면 공급자 ID가 노드에 대해 설정되지 않는 버그가 수정되었다. ([#87043](https://github.com/kubernetes/kubernetes/pull/87043), [@zjs](https://github.com/zjs)) [SIG 앱, 클라우드 공급자]
- kubelet 이미지 관리자에서 스태틱(static) 파드 워커가 아무 경고 없이 작업을 중지시킬 수 있는 데이터 경합을 수정했다. ([#88915](https://github.com/kubernetes/kubernetes/pull/88915), [@roycaihw](https://github.com/roycaihw)) [SIG 노드]
- kubelet이 파드 볼륨을 정리하는 문제를 수정했다. ([#86277](https://github.com/kubernetes/kubernetes/pull/86277), [@tedyu](https://github.com/tedyu)) [SIG 스토리지]
- kubelet이 파드의 준비(ready) 상태를 업데이트하지 못하는 회귀 문제를 수정했다. ([#84951](https://github.com/kubernetes/kubernetes/pull/84951), [@tedyu](https://github.com/tedyu)) [SIG 노드]
- kubelet이 동시 파드 조정(reconciliation) 루프를 잘못 실행하여 충돌하는 문제를 수정했다. ([#89055](https://github.com/kubernetes/kubernetes/pull/89055), [@tedyu](https://github.com/tedyu)) [SIG 노드]
- 타임아웃 후 블록 CSI 볼륨 정리 문제를 수정했다. ([#88660](https://github.com/kubernetes/kubernetes/pull/88660), [@jsafrane](https://github.com/jsafrane)) [SIG 스토리지]
- 타임아웃 후 CSI 원시 블록 볼륨 정리 문제를 수정했다. ([#87978](https://github.com/kubernetes/kubernetes/pull/87978), [@jsafrane](https://github.com/jsafrane)) [SIG 스토리지]
- AWS 클라우드 공급자가 프로비저닝하지 않은 LoadBalancer 보안 그룹을 삭제 시도하도록 수정했으며, `service.beta.kubernetes.io/aws-load-balancer-security-groups` 어노테이션이 있더라도 AWS 클라우드 공급자가 기본 LoadBalancer 보안 그룹을 생성하도록 수정했다. aws-load-balancer-security-groups의 의도된 동작은 로드 밸런서에 할당된 모든 보안 그룹을 바꾸는 것이다. ([#84265](https://github.com/kubernetes/kubernetes/pull/84265), [@bhagwat070919](https://github.com/bhagwat070919)) [SIG 클라우드 공급자]
- 두 개의 스케줄러 메트릭(pending_pods와 schedule_attempts_total)이 기록되지 않는 문제를 수정했다. ([#87692](https://github.com/kubernetes/kubernetes/pull/87692), [@everpeace](https://github.com/everpeace)) [SIG 스케줄링]
- 삭제/재생성된 파드에 대해 kubelet이 보고한(kubelet-reported) 파드 상태와 관련된 이슈를 수정했다. ([#86320](https://github.com/kubernetes/kubernetes/pull/86320), [@liggitt](https://github.com/liggitt)) [SIG 노드]
- 커스텀 리소스의 no-op 패치 또는 업데이트 시 metadata.generation의 증가를 야기하는 멀티-버전 커스텀 리소스의 변환(conversion) 오류를 수정했다. ([#88995](https://github.com/kubernetes/kubernetes/pull/88995), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]
- kubectl이 획득한 AAD 토큰이 on-behalf-of flow 및 oidc와 호환되지 않는 문제를 수정했다. 이 수정 이전의 이용자 그룹은 "spn:" 접두사를 가진다. 이 수정 후에는 "spn:" 접두사가 생략된다. ([#86412](https://github.com/kubernetes/kubernetes/pull/86412), [@weinong](https://github.com/weinong)) [SIG API Machinery, 인증, 클라우드 공급자]
- c2, n2, m1, m2 머신 유형에 15개 이상의 GCE 퍼시스턴트(Persistent) 디스크를 연결할 수 없는 문제를 수정했다. ([#88602](https://github.com/kubernetes/kubernetes/pull/88602), [@yuga711](https://github.com/yuga711)) [SIG 스토리지]
- 윈도우에서 엔드포인트슬라이스 기능 게이트를 활성화할 때 kube-proxy가 지원하도록 수정한다. ([#86016](https://github.com/kubernetes/kubernetes/pull/86016), [@robscott](https://github.com/robscott)) [SIG 인증, 네트워크]
- 클라이언트 인증서 교체 사례에서 kubelet이 크래시되는 이슈를 수정한다. ([#88079](https://github.com/kubernetes/kubernetes/pull/88079), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, 인증, 노드]
- 서비스 어카운트(service account) 토큰 컨트롤러를 실행하지 않는 클러스터에서 서비스 어카운트 토큰 승인 오류를 수정한다. ([#87029](https://github.com/kubernetes/kubernetes/pull/87029), [@liggitt](https://github.com/liggitt)) [SIG 인증]
- 65536개의 IP 주소보다 큰 IPv4 범위를 사용하여 --service-cluster-ip-range 처리 중 v1.17.0 회귀 문제를 수정한다. ([#86534](https://github.com/kubernetes/kubernetes/pull/86534), [@liggitt](https://github.com/liggitt)) [SIG 네트워크]
- 네트워크 폴리시(NetworkPolicy) PolicyTypes의 잘못된 유효성 검사 결과를 수정한다. ([#85747](https://github.com/kubernetes/kubernetes/pull/85747), [@tnqn](https://github.com/tnqn)) [SIG 네트워크]
- 하위 프로토콜 교섭(negotiation)의 경우 클라이언트 및 서버 프로토콜이 모두 필요하다. ([#86646](https://github.com/kubernetes/kubernetes/pull/86646), [@tedyu](https://github.com/tedyu)) [SIG API Machinery, 노드]
- 여러 노드에서 연결을 허용하는 볼륨의 경우 이제 다른 노드에서 연결 및 분리 작업이 병렬로 실행된다. ([#88678](https://github.com/kubernetes/kubernetes/pull/88678), [@verult](https://github.com/verult)) [SIG 스토리지]
- 분리(orphan) 전파 정책으로 스테이트풀셋이 삭제되면 가비지 수집기가 ControllerRevisions를 올바르게 분리할 수 있다. ([#84984](https://github.com/kubernetes/kubernetes/pull/84984), [@cofyc](https://github.com/cofyc)) [SIG 앱]
- `Get-kube.sh`는 공급자가 메타데이터 서버 기본값 대신 GCE 또는 GKE 인 경우, 인증을 위해 gcloud의 현재 로컬 GCP 서비스 계정을 사용한다. ([#88383](https://github.com/kubernetes/kubernetes/pull/88383), [@BenTheElder](https://github.com/BenTheElder)) [SIG 클러스터 라이프사이클]
- CVE-2020-9283에 대한 수정 사항을 제공하도록 Golang/x/net이 업데이트되었다. ([#88381](https://github.com/kubernetes/kubernetes/pull/88381), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery, CLI, 클라우드 공급자, 클러스터 라이프사이클, Instrumentation]
- 서빙 인증서(serving certificate)의 파라미터가 SNI 인증서의 IP인 이름을 지정하면 서버 연결에 응답하는 데 우선 순위가 부여된다. ([#85308](https://github.com/kubernetes/kubernetes/pull/85308), [@deads2k](https://github.com/deads2k)) [SIG API Machinery]
- yaml 파싱 성능을 개선했다. ([#85458](https://github.com/kubernetes/kubernetes/pull/85458), [@cjcullen](https://github.com/cjcullen)) [SIG API Machinery, CLI, 클라우드 공급자, 클러스터 라이프사이클, Instrumentation, 노드]
- 노드 인증자(authorizer)의 성능을 개선한다. ([#87696](https://github.com/kubernetes/kubernetes/pull/87696), [@liggitt](https://github.com/liggitt)) [SIG 인증]
- GKE 알파 클러스터에서는 서비스 어노테이션 `cloud.google.com/network-tier: Standard`를 사용할 수 있다. ([#88487](https://github.com/kubernetes/kubernetes/pull/88487), [@zioproto](https://github.com/zioproto)) [SIG 클라우드 공급자]
- CSI 퍼시스턴트 볼륨을 설명할 때 FSType을 포함한다. ([#85293](https://github.com/kubernetes/kubernetes/pull/85293), [@huffmanca](https://github.com/huffmanca)) [SIG CLI, 스토리지]
- Iptables/유저스페이스(userspace) 프록시: 모든 외부 IP 대신, 동기화 루프 당 하나씩 로컬 주소를 가져옴으로써 성능을 개선한다 ([#85617](https://github.com/kubernetes/kubernetes/pull/85617), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery, CLI, 클라우드 공급자, 클러스터 라이프사이클, Instrumentation , 네트워크]
- Kube-aggregator: 항상 서비스의 현재 상태를 반영하기 위해 unavailableGauge 메트릭을 설정한다. ([#87778](https://github.com/kubernetes/kubernetes/pull/87778), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery]
- Kube-apiserver: gracePeriodSeconds=0 및 resourceVersion 전제 조건(precondition)이 있는 파드를 삭제하는 중에 발생하는 충돌 오류를 수정했다. ([#85516](https://github.com/kubernetes/kubernetes/pull/85516), [@michaelgugino](https://github.com/michaelgugino)) [SIG API Machinery]
- Kube-proxy가 더 이상 공유 엔드포인트슬라이스를 수정하지 않는다. ([#86092](https://github.com/kubernetes/kubernetes/pull/86092), [@robscott](https://github.com/robscott)) [SIG 네트워크]
- Kube-proxy: 이중 스택 모드에서 엔드포인트의 IP Family를 얻을 수 없는 경우, 주소가 없는 엔드포인트에 대한 로그가 넘치지 않도록 경고 대신 InfoV(4) 레벨로 로그를 남긴다. ([#88934](https://github.com/kubernetes/kubernetes/pull/88934), [@aojea](https://github.com/aojea)) [SIG 네트워크]
- Kubeadm을 사용하면 이중 스택이 활성화된 경우 단일 스택 클러스터를 구성할 수 있다. ([#87453](https://github.com/kubernetes/kubernetes/pull/87453), [@aojea](https://github.com/aojea)) [SIG API Machinery, 클러스터 라이프사이클, 네트워크]
- Kubeadm에 이제 CoreDNS 버전 1.6.7이 포함된다. ([#86260](https://github.com/kubernetes/kubernetes/pull/86260), [@rajansandeep](https://github.com/rajansandeep)) [SIG 클러스터 라이프사이클]
- Kubeadm 업그레이드는 항상 스택에 대한 etcd 백업을 유지한다. ([#86861](https://github.com/kubernetes/kubernetes/pull/86861), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 'kubeadm alpha kubelet config download'가 제거되었다. 대신 'kubeadm upgrade node phase kubelet-config'를 사용한다. ([#87944](https://github.com/kubernetes/kubernetes/pull/87944), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 클러스터 이름을 controller-manager 인수(argument)로 포워딩한다. ([#85817](https://github.com/kubernetes/kubernetes/pull/85817), [@ereslibre](https://github.com/ereslibre)) [SIG 클러스터 라이프사이클]
- Kubeadm: 더 이상 존재하지 않는 "ci-cross/*" 대신 "ci/k8s-master" 버전 레이블 지원을 추가한다. ([#86609](https://github.com/kubernetes/kubernetes/pull/86609), [@Pensu](https://github.com/Pensu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 동시 etcd 멤버 조인에 대한 잠정 지원을 추가로 개선한다. 여러 구성원이 동일한 호스트 이름을 받을 수 있는 버그를 수정한다. etcd 클라이언트 다이얼 타임아웃을 늘리고 추가/제거/... 작업에 대한 타임아웃을 다시 시도한다. ([#87505](https://github.com/kubernetes/kubernetes/pull/87505), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: "upgrade apply"에 kubelet 환경 파일을 쓰지 않도록 한다. ([#85412](https://github.com/kubernetes/kubernetes/pull/85412), [@boluisa](https://github.com/boluisa)) [SIG 클러스터 라이프사이클]
- Kubeadm: 손상된 kubelet.conf 파일로 "kubeadm reset"을 실행할 때 발생할 수 있는 문제를 수정한다. ([#86216](https://github.com/kubernetes/kubernetes/pull/86216), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: 단일 노드 클러스터에서 'kubeadm upgrade'가 멈추는 버그를 수정한다. ([#88434](https://github.com/kubernetes/kubernetes/pull/88434), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 태그가 변경되지 않았지만 내용이 변경된 경우에도 이미지를 미리 가져오도록 한다. ([#85603](https://github.com/kubernetes/kubernetes/pull/85603), [@bart0sh](https://github.com/bart0sh)) [SIG 클러스터 라이프사이클]
- Kubeadm: v1.15에서 사용 중단(deprecated) 되었으므로 'kubeadm upgrade node config' 명령을 제거한다. 대신 'kubeadm upgrade node phase kubelet-config'를 사용한다. ([#87975](https://github.com/kubernetes/kubernetes/pull/87975), [@SataQiu](https://github.com/SataQiu)) [SIG 클러스터 라이프사이클]
- Kubeadm: 사용 중단된 CoreDNS 기능-게이트(feature-gate)를 제거한다. 기능이 GA로 전환된 v1.11 이후부터 'true'로 설정되었다. v1.13에서는 CLI에서 사용 중단(deprecated) 및 히든(hidden)으로 표시되었다. ([#87400](https://github.com/kubernetes/kubernetes/pull/87400), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: apiserver가 응답하지 않으면 `kubeadm-config` 컨피그맵 생성 또는 변경(mutation)을 다시 시도한다. 이것은 새로운 컨트롤 플레인 노드에 조인할 때 복원력을 향상시킨다. ([#85763](https://github.com/kubernetes/kubernetes/pull/85763), [@ereslibre](https://github.com/ereslibre)) [SIG 클러스터 라이프사이클]
- Kubeadm: kubeconfig 파일에서 인증 기관(certificate authority) PEM 데이터의 유효성을 검사할 때 공백을 허용한다. ([#86705](https://github.com/kubernetes/kubernetes/pull/86705), [@neolit123](https://github.com/neolit123)) [SIG 클러스터 라이프사이클]
- Kubeadm: bind-address 옵션을 사용하여 kube-controller-manager 및 kube-scheduler http 프로브(probe)를 구성한다. ([#86493](https://github.com/kubernetes/kubernetes/pull/86493), [@aojea](https://github.com/aojea)) [SIG 클러스터 라이프사이클]
- Kubeadm: api-server AdvertiseAddress IP family를 사용하여 비 외부(non external) etcd 클러스터에 대한 etcd 엔드포인트 IP family를 선택한다. ([#85745](https://github.com/kubernetes/kubernetes/pull/85745), [@aojea](https://github.com/aojea)) [SIG 클러스터 라이프사이클]
- kubectl cluster-info dump --output-directory=xxx 는 이제 출력 형식에 따라 확장자가 있는 파일을 생성한다. ([#82070](https://github.com/kubernetes/kubernetes/pull/82070), [@olivierlemasle](https://github.com/olivierlemasle)) [SIG CLI]
- `kubectl describe <type>` 및 `kubectl top pod`는 표시할 결과가 없는 경우 `"No resources found"` 또는 `"No resources found in <namespace> namespace"` 라는 메시지를 반환한다. ([#87527](https://github.com/kubernetes/kubernetes/pull/87527), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- `kubectl drain node --dry-run`은 축출되거나 삭제될 파드를 나열한다. ([#82660](https://github.com/kubernetes/kubernetes/pull/82660), [@sallyom](https://github.com/sallyom)) [SIG CLI]
- `kubectl set resources`는 리소스에 대한 빈(empty) 변경 사항을 전달하면 더 이상 오류를 반환하지 않는다. `kubectl set subject`는 리소스에 대한 빈 변경 사항을 전달하면 더 이상 오류를 반환하지 않는다. ([#85490](https://github.com/kubernetes/kubernetes/pull/85490), [@sallyom](https://github.com/sallyom)) [SIG CLI]
- metrics-server 또는 prometheus를 통해 수집한 Kubelet 메트릭은 더 이상 3개 이상의 파드를 실행하는 윈도우 노드에 대해 타임아웃되지 않아야 한다. ([#87730](https://github.com/kubernetes/kubernetes/pull/87730), [@marosset](https://github.com/marosset)) [SIG 노드, 테스트, 윈도우]
- kubelet 메트릭이 버킷(bucket)으로 변경되었다. 예를 들어 `exec/{podNamespace}/{podID}/{containerName}`은 이제 exec 일뿐이다. ([#87913](https://github.com/kubernetes/kubernetes/pull/87913), [@cheftako](https://github.com/cheftako)) [SIG 노드]
- kubelet은 API 서버에서 불필요한 파드 상태 업데이트 작업을 줄인다. ([#88591](https://github.com/kubernetes/kubernetes/pull/88591), [@smarterclayton](https://github.com/smarterclayton)) [SIG 노드, 확장성]
- 쿠버네티스는 매초가 아닌 5초 동안 100 msec마다 iptables 잠금을 획득하려고 시도한다. 이는 이탈률이 높은 iptables 모드에서 kube-proxy를 사용하는 환경에 특히 유용하다. ([#85771](https://github.com/kubernetes/kubernetes/pull/85771), [@aojea](https://github.com/aojea)) [SIG 네트워크]
- GCE 대상 풀에 대한 단일 업데이트의 인스턴스 수를 1000으로 제한한다. ([#87881](https://github.com/kubernetes/kubernetes/pull/87881), [@wojtek-t](https://github.com/wojtek-t)) [SIG 클라우드 공급자, Network, 확장성]
- Azure 클라이언트가 지정된 HTTP 상태 코드에서만 다시 시도한다. ([#88017](https://github.com/kubernetes/kubernetes/pull/88017), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- 오류 메시지 및 서비스 이벤트 메시지를 보다 명확하게 만든다. ([#86078](https://github.com/kubernetes/kubernetes/pull/86078), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- externalTrafficPolicy가 로컬로 설정된 경우 AWS NLB 헬스 체크 타임아웃을 최소화한다. ([#73363](https://github.com/kubernetes/kubernetes/pull/73363), [@kellycampbell](https://github.com/kellycampbell)) [SIG 클라우드 공급자]
- Pause 이미지에 non-amd64 이미지의 "Architecture"가 포함된다. ([#87954](https://github.com/kubernetes/kubernetes/pull/87954), [@BenTheElder](https://github.com/BenTheElder)) [SIG 릴리스]
- kubelet 및 kubeadm에서 pause 이미지가 3.2로 업그레이드되었다. ([#88173](https://github.com/kubernetes/kubernetes/pull/88173), [@BenTheElder](https://github.com/BenTheElder)) [SIG CLI, 클러스터 라이프사이클, 노드, 테스트]
- 스케줄러를 실행할 때 플러그인/PluginConfig 및 정책 API는 상호 배타적이다. ([#88864](https://github.com/kubernetes/kubernetes/pull/88864), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링]
- `PreScore` 인터페이스에서 `FilteredNodesStatuses` 인수를 제거한다. ([#88189](https://github.com/kubernetes/kubernetes/pull/88189), [@skilxn-go](https://github.com/skilxn-go)) [SIG 스케줄링, 테스트]
- 노드 인증자(node authorizer) 인덱스 유지보수에서 성능 문제를 해결했다. ([#87693](https://github.com/kubernetes/kubernetes/pull/87693), [@liggitt](https://github.com/liggitt)) [SIG 인증]
- v1.17.0-rc.1에서 승인(admission), 인증(authentication) 및 권한(authorization) 웹훅(webhook) 성능의 회귀를 해결했다. ([#85810](https://github.com/kubernetes/kubernetes/pull/85810), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, 테스트]
- `kubectl get all` 과 `NewDiscoveryClientForConfig` 또는 `NewDiscoveryClientForConfigOrDie`를 사용하여 구성된 client-go 디스커버리 클라이언트에서 성능 회귀를 해결했다. ([#86168](https://github.com/kubernetes/kubernetes/pull/86168), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]
- oidc claim spn: 접두사가 생략되어 기존 Azure AD OIDC 활성화된 api-server와의 동작이 중단되는 kubectl azure 인증 모듈 변경을 되돌렸다. ([#87507](https://github.com/kubernetes/kubernetes/pull/87507), [@weinong](https://github.com/weinong)) [SIG API Machinery, 인증, 클라우드 공급자]
- 공유 정보 제공자(Shared informers)는 이제 네트워크 중단 시에 더 안정적이다. ([#86015](https://github.com/kubernetes/kubernetes/pull/86015), [@squeed](https://github.com/squeed)) [SIG API Machinery]
- 동일한 플러그인에 대해 PluginConfig를 두 번 이상 지정하면 스케줄러 시작을 실패한다.
  Extender 지정 및 NodeResourcesFit 플러그인에 대한 .ignoredResources 구성이 실패된다. ([#88870](https://github.com/kubernetes/kubernetes/pull/88870), [@alculquicondor](https://github.com/alculquicondor)) [SIG 스케줄링]
- restartPolicy=Never 파드의 종료(terminate)가 실제로 실패했을 때 더 이상 파드가 성공했다고 보고할 수 없다. ([#88440](https://github.com/kubernetes/kubernetes/pull/88440), [@smarterclayton](https://github.com/smarterclayton)) [SIG 노드, 테스트]
- CSR 서명 인증서/키 페어는 kube-apiserver 인증서/키 페어와 같이 디스크에서 다시 로드된다. ([#86816](https://github.com/kubernetes/kubernetes/pull/86816), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, 앱, 인증]
- k8s.io/client-go/tools/events의 EventRecorder는 관련 오브젝트에 설정되어 있지 않은 경우 (kube-system 대신) 디폴트 네임스페이스에 이벤트를 생성한다. ([#88815](https://github.com/kubernetes/kubernetes/pull/88815), [@enj](https://github.com/enj)) [SIG API Machinery]
- 이제 감사(audit) 이벤트 소스 IP 목록은 요청을 API 서버로 보낸 IP로 항상 끝난다. ([#87167](https://github.com/kubernetes/kubernetes/pull/87167), [@tallclair](https://github.com/tallclair)) [SIG API Machinery, 인증]
- 쿠버네티스 v1.17.0 샘플 apiserver를 사용하도록 sample-apiserver 집계 적합성 테스트가 업데이트되었다. ([#84735](https://github.com/kubernetes/kubernetes/pull/84735), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, 아키텍처, CLI, 테스트]
- 스로틀링 가능성을 줄이기 위해, Azure 노드 프로비저닝 상태가 삭제될 때 VM 캐시가 nil로 설정된다. ([#87635](https://github.com/kubernetes/kubernetes/pull/87635), [@feiskyer](https://github.com/feiskyer)) [SIG 클라우드 공급자]
- VMSS 캐시가 추가되어 VMSS GET 스로틀링 가능성이 감소한다. ([#85885](https://github.com/kubernetes/kubernetes/pull/85885), [@nilo19](https://github.com/nilo19)) [SIG 클라우드 공급자]
- 윈도우 노드에서 10초 이내로 kubelet 및 kube-proxy가 준비될 때까지 대기한다. ([#85228](https://github.com/kubernetes/kubernetes/pull/85228), [@YangLu1031](https://github.com/YangLu1031)) [SIG 클러스터 라이프사이클]
- `kubectl apply -f <file> --prune -n ​​<namespace>`는 cli 지정 네임스페이스에서 파일에 정의되지 않은 모든 리소스를 제거(prune)해야 한다. ([#85613](https://github.com/kubernetes/kubernetes/pull/85613), [@MartinKaburu](https://github.com/MartinKaburu)) [SIG CLI]
- `kubectl create clusterrolebinding`는 rbac.authorization.k8s.io/v1 오브젝트를 생성한다. ([#85889](https://github.com/kubernetes/kubernetes/pull/85889), [@oke-py](https://github.com/oke-py)) [SIG CLI]
- `kubectl diff`는 이제 diff가 변경 내역을 찾은 경우에만 1을, kubectl 오류에서는 >1을 반환한다. "exit status code 1" 메시지도 뮤트(mute)되었다. ([#87437](https://github.com/kubernetes/kubernetes/pull/87437), [@apelisse](https://github.com/apelisse)) [SIG CLI, 테스트]

## 의존성(Dependencies)

- v3.8.4로 칼리코(Calico) 업데이트 ([#84163](https://github.com/kubernetes/kubernetes/pull/84163), [@david-tigera](https://github.com/david-tigera))[SIG 클러스터 라이프사이클]
- v1.28.2로 aws-sdk-go 의존성 업데이트 ([#87253](https://github.com/kubernetes/kubernetes/pull/87253), [@SaranBalaji90](https://github.com/SaranBalaji90))[SIG API Machinery, 클라우드 공급자]
- v0.8.5로 CNI 버전 업데이트 ([#78819](https://github.com/kubernetes/kubernetes/pull/78819), [@justaugustus](https://github.com/justaugustus))[SIG 릴리스, 테스트, 네트워크, 클러스터 라이프사이클, API Machinery]
- v1.17.0으로 cri-tools 업데이트 ([#86305](https://github.com/kubernetes/kubernetes/pull/86305), [@saschagrunert](https://github.com/saschagrunert))[SIG 릴리스, 클러스터 라이프사이클]
- kubelet 및 kubeadm에서 Pause 이미지가 3.2로 업그레이드 ([#88173](https://github.com/kubernetes/kubernetes/pull/88173), [@BenTheElder](https://github.com/BenTheElder))[SIG CLI, 노드, 테스트, 클러스터 라이프사이클]
- kubeadm에서 1.6.7로 CoreDNS 버전 업데이트 ([#86260](https://github.com/kubernetes/kubernetes/pull/86260), [@rajansandeep](https://github.com/rajansandeep))[SIG 클러스터 라이프사이클]
- CVE-2020-9283을 수정하기 위해 golang.org/x/crypto를 업데이트 ([#8838](https://github.com/kubernetes/kubernetes/pull/88381), [@BenTheElder](https://github.com/BenTheElder))[SIG CLI, Instrumentation, API Machinery, 클러스터 라이프사이클, 클라우드 공급자]
- 1.13.8로 Go 업데이트 ([#87648](https://github.com/kubernetes/kubernetes/pull/87648), [@ialidzhikov](https://github.com/ialidzhikov))[SIG 릴리스, 테스트]
- 1.18.0으로 Cluster-Autoscaler 업데이트 ([#89095](https://github.com/kubernetes/kubernetes/pull/89095), [@losipiuk](https://github.com/losipiuk))[SIG 오토스케일링, 클러스터 라이프사이클]



# v1.18.0-rc.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-rc.1

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes.tar.gz) | `c17231d5de2e0677e8af8259baa11a388625821c79b86362049f2edb366404d6f4b4587b8f13ccbceeb2f32c6a9fe98607f779c0f3e1caec438f002e3a2c8c21`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-src.tar.gz) | `e84ffad57c301f5d6e90f916b996d5abb0c987928c3ca6b1565f7b042588f839b994ca12c43fc36f0ffb63f9fabc15110eb08be253b8939f49cd951e956da618`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-darwin-386.tar.gz) | `1aea99923d492436b3eb91aaecffac94e5d0aa2b38a0930d266fda85c665bbc4569745c409aa302247df3b578ce60324e7a489eb26240e97d4e65a67428ea3d1`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-darwin-amd64.tar.gz) | `07fa7340a959740bd52b83ff44438bbd988e235277dad1e43f125f08ac85230a24a3b755f4e4c8645743444fa2b66a3602fc445d7da6d2fc3770e8c21ba24b33`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-386.tar.gz) | `48cebd26448fdd47aa36257baa4c716a98fda055bbf6a05230f2a3fe3c1b99b4e483668661415392190f3eebb9cb6e15c784626b48bb2541d93a37902f0e3974`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-amd64.tar.gz) | `c3a5fedf263f07a07f59c01fea6c63c1e0b76ee8dc67c45b6c134255c28ed69171ccc2f91b6a45d6a8ec5570a0a7562e24c33b9d7b0d1a864f4dc04b178b3c04`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-arm.tar.gz) | `a6b11a55bd38583bbaac14931a6862f8ce6493afe30947ba29e5556654a571593358278df59412bbeb6888fa127e9ae4c0047a9d46cb59394995010796df6b14`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-arm64.tar.gz) | `9e15331ac8010154a9b64f5488969fc8ee2f21059639896cb84c5cf4f05f4c9d1d8970cb6f9831de6b34013848227c1972c12a698d07aac1ecc056e972fe6f79`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-ppc64le.tar.gz) | `f828fe6252678de9d4822e482f5873309ae9139b2db87298ab3273ce45d38aa07b6b9b42b76c140705f27ba71e101d58b43e59ac7259d7c08dc647ea809e207c`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-linux-s390x.tar.gz) | `19da4b45f0666c063934af616f3e7ed3caa99d4ee1e46d53efadc7a8a4d38e43a36ced7249acd7ad3dcc4b4f60d8451b4f7ec7727e478ee2fadd14d353228bce`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-windows-386.tar.gz) | `775c9afb6cb3e7c4ba53e9f48a5df2cf207234a33059bd74448bc9f177dd120fb3f9c58ab45048a566326acc43bc8a67e886e10ef99f20780c8f63bb17426ebd`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-client-windows-amd64.tar.gz) | `208d2595a5b57ac97aac75b4a2a6130f0c937f781a030bde1a432daf4bc51f2fa523fca2eb84c38798489c4b536ee90aad22f7be8477985d9691d51ad8e1c4dc`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-server-linux-amd64.tar.gz) | `dcf832eae04f9f52ff473754ef5cfe697b35f4dc1a282622c94fa10943c8c35f4a8777a0c58c7de871c3c428c8973bf72d6bcd8751416d4c682125268b8fcefe`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-server-linux-arm.tar.gz) | `a04e34bea28eb1c8b492e8b1dd3c0dd87ebee71a7dbbef72be10a335e553361af7e48296e504f9844496b04e66350871114d20cfac3f3b49550d8be60f324ba3`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-server-linux-arm64.tar.gz) | `a6af086b07a8c2e498f32b43e6511bf6a5e6baf358c572c6910c8df17cd6cae94f562f459714fcead1595767cb14c7f639c5735f1411173bbd38d5604c082a77`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-server-linux-ppc64le.tar.gz) | `5a960ef5ba0c255f587f2ac0b028cd03136dc91e4efc5d1becab46417852e5524d18572b6f66259531ec6fea997da3c4d162ac153a9439672154375053fec6c7`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-server-linux-s390x.tar.gz) | `0f32c7d9b14bc238b9a5764d8f00edc4d3bf36bcf06b340b81061424e6070768962425194a8c2025c3a7ffb97b1de551d3ad23d1591ae34dd4e3ba25ab364c33`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-linux-amd64.tar.gz) | `27d8955d535d14f3f4dca501fd27e4f06fad84c6da878ea5332a5c83b6955667f6f731bfacaf5a3a23c09f14caa400f9bee927a0f269f5374de7f79cd1919b3b`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-linux-arm.tar.gz) | `0d56eccad63ba608335988e90b377fe8ae978b177dc836cdb803a5c99d99e8f3399a666d9477ca9cfe5964944993e85c416aec10a99323e3246141efc0b1cc9e`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-linux-arm64.tar.gz) | `79bb9be66f9e892d866b28e5cc838245818edb9706981fab6ccbff493181b341c1fcf6fe5d2342120a112eb93af413f5ba191cfba1ab4c4a8b0546a5ad8ec220`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-linux-ppc64le.tar.gz) | `3e9e2c6f9a2747d828069511dce8b4034c773c2d122f005f4508e22518055c1e055268d9d86773bbd26fbd2d887d783f408142c6c2f56ab2f2365236fd4d2635`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-linux-s390x.tar.gz) | `4f96e018c336fa13bb6df6f7217fe46a2b5c47f806f786499c429604ccba2ebe558503ab2c72f63250aa25b61dae2d166e4b80ae10f6ab37d714f87c1dcf6691`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-rc.1/kubernetes-node-windows-amd64.tar.gz) | `ab110d76d506746af345e5897ef4f6993d5f53ac818ba69a334f3641047351aa63bfb3582841a9afca51dd0baff8b9010077d9c8ec85d2d69e4172b8d4b338b0`

## Changelog since v1.18.0-beta.2

## Changes by Kind

### API Change

- Removes ConfigMap as suggestion for IngressClass parameters ([#89093](https://github.com/kubernetes/kubernetes/pull/89093), [@robscott](https://github.com/robscott)) [SIG Network]

### Other (Bug, Cleanup or Flake)

- EndpointSlice should not contain endpoints for terminating pods ([#89056](https://github.com/kubernetes/kubernetes/pull/89056), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps and Network]
- Fix a bug where ExternalTrafficPolicy is not applied to service ExternalIPs. ([#88786](https://github.com/kubernetes/kubernetes/pull/88786), [@freehan](https://github.com/freehan)) [SIG Network]
- Fix invalid VMSS updates due to incorrect cache ([#89002](https://github.com/kubernetes/kubernetes/pull/89002), [@ArchangelSDY](https://github.com/ArchangelSDY)) [SIG Cloud Provider]
- Fix isCurrentInstance for Windows by removing the dependency of hostname. ([#89138](https://github.com/kubernetes/kubernetes/pull/89138), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fixed a data race in kubelet image manager that can cause static pod workers to silently stop working. ([#88915](https://github.com/kubernetes/kubernetes/pull/88915), [@roycaihw](https://github.com/roycaihw)) [SIG Node]
- Fixed an issue that could cause the kubelet to incorrectly run concurrent pod reconciliation loops and crash. ([#89055](https://github.com/kubernetes/kubernetes/pull/89055), [@tedyu](https://github.com/tedyu)) [SIG Node]
- Kube-proxy: on dual-stack mode, if it is not able to get the IP Family of an endpoint, logs it with level InfoV(4) instead of Warning, avoiding flooding the logs for endpoints without addresses ([#88934](https://github.com/kubernetes/kubernetes/pull/88934), [@aojea](https://github.com/aojea)) [SIG Network]
- Update Cluster Autoscaler to 1.18.0; changelog: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.18.0 ([#89095](https://github.com/kubernetes/kubernetes/pull/89095), [@losipiuk](https://github.com/losipiuk)) [SIG Autoscaling and Cluster Lifecycle]


# v1.18.0-beta.2

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-beta.2

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes.tar.gz) | `3017430ca17f8a3523669b4a02c39cedfc6c48b07281bc0a67a9fbe9d76547b76f09529172cc01984765353a6134a43733b7315e0dff370bba2635dd2a6289af`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-src.tar.gz) | `c5fd60601380a99efff4458b1c9cf4dc02195f6f756b36e590e54dff68f7064daf32cf63980dddee13ef9dec7a60ad4eeb47a288083fdbbeeef4bc038384e9ea`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-darwin-386.tar.gz) | `7e49ede167b9271d4171e477fa21d267b2fb35f80869337d5b323198dc12f71b61441975bf925ad6e6cd7b61cbf6372d386417dc1e5c9b3c87ae651021c37237`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | `3f5cdf0e85eee7d0773e0ae2df1c61329dea90e0da92b02dae1ffd101008dc4bade1c4951fc09f0cad306f0bcb7d16da8654334ddee43d5015913cc4ac8f3eda`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-386.tar.gz) | `b67b41c11bfecb88017c33feee21735c56f24cf6f7851b63c752495fc0fb563cd417a67a81f46bca091f74dc00fca1f296e483d2e3dfe2004ea4b42e252d30b9`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | `1fef2197cb80003e3a5c26f05e889af9d85fbbc23e27747944d2997ace4bfa28f3670b13c08f5e26b7e274176b4e2df89c1162aebd8b9506e63b39b311b2d405`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-arm.tar.gz) | `84e5f4d9776490219ee94a84adccd5dfc7c0362eb330709771afcde95ec83f03d96fe7399eec218e47af0a1e6445e24d95e6f9c66c0882ef8233a09ff2022420`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | `ba613b114e0cca32fa21a3d10f845aa2f215d3af54e775f917ff93919f7dd7075efe254e4047a85a1f4b817fc2bd78006c2e8873885f1208cbc02db99e2e2e25`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | `502a6938d8c4bbe04abbd19b59919d86765058ff72334848be4012cec493e0e7027c6cd950cf501367ac2026eea9f518110cb72d1c792322b396fc2f73d23217`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | `c24700e0ed2ef5c1d2dd282d638c88d90392ae90ea420837b39fd8e1cfc19525017325ccda71d8472fdaea174762208c09e1bba9bbc77c89deef6fac5e847ba2`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-windows-386.tar.gz) | `0d4c5a741b052f790c8b0923c9586ee9906225e51cf4dc8a56fc303d4d61bb5bf77fba9e65151dec7be854ff31da8fc2dcd3214563e1b4b9951e6af4aa643da4`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | `841ef2e306c0c9593f04d9528ee019bf3b667761227d9afc1d6ca8bf1aa5631dc25f5fe13ff329c4bf0c816b971fd0dec808f879721e0f3bf51ce49772b38010`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | `b373df2e6ef55215e712315a5508e85a39126bd81b7b93c6b6305238919a88c740077828a6f19bcd97141951048ef7a19806ef6b1c3e1772dbc45715c5fcb3af`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-server-linux-arm.tar.gz) | `b8103cb743c23076ce8dd7c2da01c8dd5a542fbac8480e82dc673139c8ee5ec4495ca33695e7a18dd36412cf1e18ed84c8de05042525ddd8e869fbdfa2766569`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | `8f8f05cf64fb9c8d80cdcb4935b2d3e3edc48bdd303231ae12f93e3f4d979237490744a11e24ba7f52dbb017ca321a8e31624dcffa391b8afda3d02078767fa0`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | `b313b911c46f2ec129537407af3f165f238e48caeb4b9e530783ffa3659304a544ed02bef8ece715c279373b9fb2c781bd4475560e02c4b98a6d79837bc81938`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `a1b6b06571141f507b12e5ef98efb88f4b6b9aba924722b2a74f11278d29a2972ab8290608360151d124608e6e24da0eb3516d484cb5fa12ff2987562f15964a`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `20e02ca327543cddb2568ead3d5de164cbfb2914ab6416106d906bf12fcfbc4e55b13bea4d6a515e8feab038e2c929d72c4d6909dfd7881ba69fd1e8c772ab99`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `ecd817ef05d6284f9c6592b84b0a48ea31cf4487030c9fb36518474b2a33dad11b9c852774682e60e4e8b074e6bea7016584ca281dddbe2994da5eaf909025c0`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `0020d32b7908ffd5055c8b26a8b3033e4702f89efcfffe3f6fcdb8a9921fa8eaaed4193c85597c24afd8c523662454f233521bb7055841a54c182521217ccc9d`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `e065411d66d486e7793449c1b2f5a412510b913bf7f4e728c0a20e275642b7668957050dc266952cdff09acc391369ae6ac5230184db89af6823ba400745f2fc`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `082ee90413beaaea41d6cbe9a18f7d783a95852607f3b94190e0ca12aacdd97d87e233b87117871bfb7d0a4b6302fbc7688549492a9bc50a2f43a5452504d3ce`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `fb5aca0cc36be703f9d4033eababd581bac5de8399c50594db087a99ed4cb56e4920e960eb81d0132d696d094729254eeda2a5c0cb6e65e3abca6c8d61da579e`

## Changelog since v1.18.0-beta.1

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

- `kubectl` no longer defaults to `http://localhost:8080`.  If you own one of these legacy clusters, you are *strongly- encouraged to secure your server.   If you cannot secure your server, you can set `KUBERNETES_MASTER` if you were relying on that behavior and you're a client-go user. Set `--server`, `--kubeconfig` or `KUBECONFIG` to make it work in `kubectl`. ([#86173](https://github.com/kubernetes/kubernetes/pull/86173), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, CLI and Testing]

## Changes by Kind

### Deprecation

- AlgorithmSource is removed from v1alpha2 Scheduler ComponentConfig ([#87999](https://github.com/kubernetes/kubernetes/pull/87999), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- Kube-proxy: deprecate `--healthz-port` and `--metrics-port` flag, please use `--healthz-bind-address` and `--metrics-bind-address` instead ([#88512](https://github.com/kubernetes/kubernetes/pull/88512), [@SataQiu](https://github.com/SataQiu)) [SIG Network]
- Kubeadm: deprecate the usage of the experimental flag '--use-api' under the 'kubeadm alpha certs renew' command. ([#88827](https://github.com/kubernetes/kubernetes/pull/88827), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]

### API Change

- A new IngressClass resource has been added to enable better Ingress configuration. ([#88509](https://github.com/kubernetes/kubernetes/pull/88509), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps, CLI, Network, Node and Testing]
- Added GenericPVCDataSource feature gate to enable using arbitrary custom resources as the data source for a PVC. ([#88636](https://github.com/kubernetes/kubernetes/pull/88636), [@bswartz](https://github.com/bswartz)) [SIG Apps and Storage]
- Allow user to specify fsgroup permission change policy for pods ([#88488](https://github.com/kubernetes/kubernetes/pull/88488), [@gnufied](https://github.com/gnufied)) [SIG Apps and Storage]
- BlockVolume and CSIBlockVolume features are now GA. ([#88673](https://github.com/kubernetes/kubernetes/pull/88673), [@jsafrane](https://github.com/jsafrane)) [SIG Apps, Node and Storage]
- CustomResourceDefinition schemas that use `x-kubernetes-list-map-keys` to specify properties that uniquely identify list items must make those properties required or have a default value, to ensure those properties are present for all list items. See https://kubernetes.io/docs/reference/using-api/api-concepts/&#35;merge-strategy for details. ([#88076](https://github.com/kubernetes/kubernetes/pull/88076), [@eloyekunle](https://github.com/eloyekunle)) [SIG API Machinery and Testing]
- Fixes a regression with clients prior to 1.15 not being able to update podIP in pod status, or podCIDR in node spec, against >= 1.16 API servers ([#88505](https://github.com/kubernetes/kubernetes/pull/88505), [@liggitt](https://github.com/liggitt)) [SIG Apps and Network]
- Ingress: Add Exact and Prefix maching to Ingress PathTypes ([#88587](https://github.com/kubernetes/kubernetes/pull/88587), [@cmluciano](https://github.com/cmluciano)) [SIG Apps, Cluster Lifecycle and Network]
- Ingress: Add alternate backends via TypedLocalObjectReference ([#88775](https://github.com/kubernetes/kubernetes/pull/88775), [@cmluciano](https://github.com/cmluciano)) [SIG Apps and Network]
- Ingress: allow wildcard hosts in IngressRule ([#88858](https://github.com/kubernetes/kubernetes/pull/88858), [@cmluciano](https://github.com/cmluciano)) [SIG Network]
- Kube-controller-manager and kube-scheduler expose profiling by default to match the kube-apiserver.  Use `--enable-profiling=false` to disable. ([#88663](https://github.com/kubernetes/kubernetes/pull/88663), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Cloud Provider and Scheduling]
- Move TaintBasedEvictions feature gates to GA ([#87487](https://github.com/kubernetes/kubernetes/pull/87487), [@skilxn-go](https://github.com/skilxn-go)) [SIG API Machinery, Apps, Node, Scheduling and Testing]
- New flag --endpointslice-updates-batch-period in kube-controller-manager can be used to reduce number of endpointslice updates generated by pod changes. ([#88745](https://github.com/kubernetes/kubernetes/pull/88745), [@mborsz](https://github.com/mborsz)) [SIG API Machinery, Apps and Network]
- Scheduler Extenders can now be configured in the v1alpha2 component config ([#88768](https://github.com/kubernetes/kubernetes/pull/88768), [@damemi](https://github.com/damemi)) [SIG Release, Scheduling and Testing]
- The apiserver/v1alph1&#35;EgressSelectorConfiguration API is now beta. ([#88502](https://github.com/kubernetes/kubernetes/pull/88502), [@caesarxuchao](https://github.com/caesarxuchao)) [SIG API Machinery]
- The storage.k8s.io/CSIDriver has moved to GA, and is now available for use. ([#84814](https://github.com/kubernetes/kubernetes/pull/84814), [@huffmanca](https://github.com/huffmanca)) [SIG API Machinery, Apps, Auth, Node, Scheduling, Storage and Testing]
- VolumePVCDataSource moves to GA in 1.18 release ([#88686](https://github.com/kubernetes/kubernetes/pull/88686), [@j-griffith](https://github.com/j-griffith)) [SIG Apps, CLI and Cluster Lifecycle]

### Feature

- Add `rest_client_rate_limiter_duration_seconds` metric to component-base to track client side rate limiter latency in seconds. Broken down by verb and URL. ([#88134](https://github.com/kubernetes/kubernetes/pull/88134), [@jennybuckley](https://github.com/jennybuckley)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- Allow user to specify resource using --filename flag when invoking kubectl exec ([#88460](https://github.com/kubernetes/kubernetes/pull/88460), [@soltysh](https://github.com/soltysh)) [SIG CLI and Testing]
- Apiserver add a new flag --goaway-chance which is the fraction of requests that will be closed gracefully(GOAWAY) to prevent HTTP/2 clients from getting stuck on a single apiserver.
  After the connection closed(received GOAWAY), the client's other in-flight requests won't be affected, and the client will reconnect.
  The flag min value is 0 (off), max is .02 (1/50 requests); .001 (1/1000) is a recommended starting point.
  Clusters with single apiservers, or which don't use a load balancer, should NOT enable this. ([#88567](https://github.com/kubernetes/kubernetes/pull/88567), [@answer1991](https://github.com/answer1991)) [SIG API Machinery]
- Azure: add support for single stack IPv6 ([#88448](https://github.com/kubernetes/kubernetes/pull/88448), [@aramase](https://github.com/aramase)) [SIG Cloud Provider]
- DefaultConstraints can be specified for the PodTopologySpread plugin in the component config ([#88671](https://github.com/kubernetes/kubernetes/pull/88671), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Kubeadm: support Windows specific kubelet flags in kubeadm-flags.env ([#88287](https://github.com/kubernetes/kubernetes/pull/88287), [@gab-satchi](https://github.com/gab-satchi)) [SIG Cluster Lifecycle and Windows]
- Kubectl cluster-info dump changed to only display a message telling you the location where the output was written when the output is not standard output. ([#88765](https://github.com/kubernetes/kubernetes/pull/88765), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Print NotReady when pod is not ready based on its conditions. ([#88240](https://github.com/kubernetes/kubernetes/pull/88240), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- Scheduler Extender API is now located under k8s.io/kube-scheduler/extender ([#88540](https://github.com/kubernetes/kubernetes/pull/88540), [@damemi](https://github.com/damemi)) [SIG Release, Scheduling and Testing]
- Signatures on scale client methods have been modified to accept `context.Context` as a first argument. Signatures of Get, Update, and Patch methods have been updated to accept GetOptions, UpdateOptions and PatchOptions respectively. ([#88599](https://github.com/kubernetes/kubernetes/pull/88599), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG API Machinery, Apps, Autoscaling and CLI]
- Signatures on the dynamic client methods have been modified to accept `context.Context` as a first argument. Signatures of Delete and DeleteCollection methods now accept DeleteOptions by value instead of by reference. ([#88906](https://github.com/kubernetes/kubernetes/pull/88906), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps, CLI, Cluster Lifecycle, Storage and Testing]
- Signatures on the metadata client methods have been modified to accept `context.Context` as a first argument. Signatures of Delete and DeleteCollection methods now accept DeleteOptions by value instead of by reference. ([#88910](https://github.com/kubernetes/kubernetes/pull/88910), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps and Testing]
- Webhooks will have alpha support for network proxy ([#85870](https://github.com/kubernetes/kubernetes/pull/85870), [@Jefftree](https://github.com/Jefftree)) [SIG API Machinery, Auth and Testing]
- When client certificate files are provided, reload files for new connections, and close connections when a certificate changes. ([#79083](https://github.com/kubernetes/kubernetes/pull/79083), [@jackkleeman](https://github.com/jackkleeman)) [SIG API Machinery, Auth, Node and Testing]
- When deleting objects using kubectl with the --force flag, you are no longer required to also specify --grace-period=0. ([#87776](https://github.com/kubernetes/kubernetes/pull/87776), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- `kubectl` now contains a `kubectl alpha debug` command. This command allows attaching an ephemeral container to a running pod for the purposes of debugging. ([#88004](https://github.com/kubernetes/kubernetes/pull/88004), [@verb](https://github.com/verb)) [SIG CLI]

### Documentation

- Update Japanese translation for kubectl help ([#86837](https://github.com/kubernetes/kubernetes/pull/86837), [@inductor](https://github.com/inductor)) [SIG CLI and Docs]
- `kubectl plugin` now prints a note how to install krew ([#88577](https://github.com/kubernetes/kubernetes/pull/88577), [@corneliusweig](https://github.com/corneliusweig)) [SIG CLI]

### Other (Bug, Cleanup or Flake)

- Azure VMSS LoadBalancerBackendAddressPools updating has been improved with squential-sync + concurrent-async requests. ([#88699](https://github.com/kubernetes/kubernetes/pull/88699), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- AzureFile and CephFS use new Mount library that prevents logging of sensitive mount options. ([#88684](https://github.com/kubernetes/kubernetes/pull/88684), [@saad-ali](https://github.com/saad-ali)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Storage]
- Build: Enable kube-cross image-building on K8s Infra ([#88562](https://github.com/kubernetes/kubernetes/pull/88562), [@justaugustus](https://github.com/justaugustus)) [SIG Release and Testing]
- Client-go certificate manager rotation gained the ability to preserve optional intermediate chains accompanying issued certificates ([#88744](https://github.com/kubernetes/kubernetes/pull/88744), [@jackkleeman](https://github.com/jackkleeman)) [SIG API Machinery and Auth]
- Conformance image now depends on stretch-slim instead of debian-hyperkube-base as that image is being deprecated and removed. ([#88702](https://github.com/kubernetes/kubernetes/pull/88702), [@dims](https://github.com/dims)) [SIG Cluster Lifecycle, Release and Testing]
- Deprecate --generator flag from kubectl create commands ([#88655](https://github.com/kubernetes/kubernetes/pull/88655), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- FIX: prevent apiserver from panicking when failing to load audit webhook config file ([#88879](https://github.com/kubernetes/kubernetes/pull/88879), [@JoshVanL](https://github.com/JoshVanL)) [SIG API Machinery and Auth]
- Fix /readyz to return error immediately after a shutdown is initiated, before the --shutdown-delay-duration has elapsed. ([#88911](https://github.com/kubernetes/kubernetes/pull/88911), [@tkashem](https://github.com/tkashem)) [SIG API Machinery]
- Fix a bug where kubenet fails to parse the tc output. ([#83572](https://github.com/kubernetes/kubernetes/pull/83572), [@chendotjs](https://github.com/chendotjs)) [SIG Network]
- Fix describe ingress annotations not sorted. ([#88394](https://github.com/kubernetes/kubernetes/pull/88394), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Fix handling of aws-load-balancer-security-groups annotation. Security-Groups assigned with this annotation are no longer modified by kubernetes which is the expected behaviour of most users. Also no unnecessary Security-Groups are created anymore if this annotation is used. ([#83446](https://github.com/kubernetes/kubernetes/pull/83446), [@Elias481](https://github.com/Elias481)) [SIG Cloud Provider]
- Fix kubectl create deployment image name ([#86636](https://github.com/kubernetes/kubernetes/pull/86636), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Fix missing "apiVersion" for "involvedObject" in Events for Nodes. ([#87537](https://github.com/kubernetes/kubernetes/pull/87537), [@uthark](https://github.com/uthark)) [SIG Apps and Node]
- Fix that prevents repeated fetching of PVC/PV objects by kubelet when processing of pod volumes fails. While this prevents hammering API server in these error scenarios, it means that some errors in processing volume(s) for a pod could now take up to 2-3 minutes before retry. ([#88141](https://github.com/kubernetes/kubernetes/pull/88141), [@tedyu](https://github.com/tedyu)) [SIG Node and Storage]
- Fix: azure file mount timeout issue ([#88610](https://github.com/kubernetes/kubernetes/pull/88610), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix: corrupted mount point in csi driver ([#88569](https://github.com/kubernetes/kubernetes/pull/88569), [@andyzhangx](https://github.com/andyzhangx)) [SIG Storage]
- Fixed a bug in the TopologyManager. Previously, the TopologyManager would only guarantee alignment if container creation was serialized in some way. Alignment is now guaranteed under all scenarios of container creation. ([#87759](https://github.com/kubernetes/kubernetes/pull/87759), [@klueska](https://github.com/klueska)) [SIG Node]
- Fixed block CSI volume cleanup after timeouts. ([#88660](https://github.com/kubernetes/kubernetes/pull/88660), [@jsafrane](https://github.com/jsafrane)) [SIG Node and Storage]
- Fixes issue where you can't attach more than 15 GCE Persistent Disks to c2, n2, m1, m2 machine types. ([#88602](https://github.com/kubernetes/kubernetes/pull/88602), [@yuga711](https://github.com/yuga711)) [SIG Storage]
- For volumes that allow attaches across multiple nodes, attach and detach operations across different nodes are now executed in parallel. ([#88678](https://github.com/kubernetes/kubernetes/pull/88678), [@verult](https://github.com/verult)) [SIG Apps, Node and Storage]
- Hide kubectl.kubernetes.io/last-applied-configuration in describe command ([#88758](https://github.com/kubernetes/kubernetes/pull/88758), [@soltysh](https://github.com/soltysh)) [SIG Auth and CLI]
- In GKE alpha clusters it will be possible to use the service annotation `cloud.google.com/network-tier: Standard` ([#88487](https://github.com/kubernetes/kubernetes/pull/88487), [@zioproto](https://github.com/zioproto)) [SIG Cloud Provider]
- Kubelets perform fewer unnecessary pod status update operations on the API server. ([#88591](https://github.com/kubernetes/kubernetes/pull/88591), [@smarterclayton](https://github.com/smarterclayton)) [SIG Node and Scalability]
- Plugin/PluginConfig and Policy APIs are mutually exclusive when running the scheduler ([#88864](https://github.com/kubernetes/kubernetes/pull/88864), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Specifying PluginConfig for the same plugin more than once fails scheduler startup.

  Specifying extenders and configuring .ignoredResources for the NodeResourcesFit plugin fails ([#88870](https://github.com/kubernetes/kubernetes/pull/88870), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Support TLS Server Name overrides in kubeconfig file and via --tls-server-name in kubectl ([#88769](https://github.com/kubernetes/kubernetes/pull/88769), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Auth and CLI]
- Terminating a restartPolicy=Never pod no longer has a chance to report the pod succeeded when it actually failed. ([#88440](https://github.com/kubernetes/kubernetes/pull/88440), [@smarterclayton](https://github.com/smarterclayton)) [SIG Node and Testing]
- The EventRecorder from k8s.io/client-go/tools/events will now create events in the default namespace (instead of kube-system) when the related object does not have it set. ([#88815](https://github.com/kubernetes/kubernetes/pull/88815), [@enj](https://github.com/enj)) [SIG API Machinery]
- The audit event sourceIPs list will now always end with the IP that sent the request directly to the API server. ([#87167](https://github.com/kubernetes/kubernetes/pull/87167), [@tallclair](https://github.com/tallclair)) [SIG API Machinery and Auth]
- Update to use golang 1.13.8 ([#87648](https://github.com/kubernetes/kubernetes/pull/87648), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Release and Testing]
- Validate kube-proxy flags --ipvs-tcp-timeout, --ipvs-tcpfin-timeout, --ipvs-udp-timeout ([#88657](https://github.com/kubernetes/kubernetes/pull/88657), [@chendotjs](https://github.com/chendotjs)) [SIG Network]


# v1.18.0-beta.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-beta.1

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes.tar.gz) | `7c182ca905b3a31871c01ab5fdaf46f074547536c7975e069ff230af0d402dfc0346958b1d084bd2c108582ffc407484e6a15a1cd93e9affbe34b6e99409ef1f`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-src.tar.gz) | `d104b8c792b1517bd730787678c71c8ee3b259de81449192a49a1c6e37a6576d28f69b05c2019cc4a4c40ddeb4d60b80138323df3f85db8682caabf28e67c2de`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `bc337bb8f200a789be4b97ce99b9d7be78d35ebd64746307c28339dc4628f56d9903e0818c0888aaa9364357a528d1ac6fd34f74377000f292ec502fbea3837e`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `38dfa5e0b0cfff39942c913a6bcb2ad8868ec43457d35cffba08217bb6e7531720e0731f8588505f4c81193ce5ec0e5fe6870031cf1403fbbde193acf7e53540`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-386.tar.gz) | `8e63ec7ce29c69241120c037372c6c779e3f16253eabd612c7cbe6aa89326f5160eb5798004d723c5cd72d458811e98dac3574842eb6a57b2798ecd2bbe5bcf9`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `c1be9f184a7c3f896a785c41cd6ece9d90d8cb9b1f6088bdfb5557d8856c55e455f6688f5f54c2114396d5ae7adc0361e34ebf8e9c498d0187bd785646ccc1d0`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `8eab02453cfd9e847632a774a0e0cf3a33c7619fb4ced7f1840e1f71444e8719b1c8e8cbfdd1f20bb909f3abe39cdcac74f14cb9c878c656d35871b7c37c7cbe`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `f7df0ec02d2e7e63278d5386e8153cfe2b691b864f17b6452cc824a5f328d688976c975b076e60f1c6b3c859e93e477134fbccc53bb49d9e846fb038b34eee48`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `36dd5b10addca678a518e6d052c9d6edf473e3f87388a2f03f714c93c5fbfe99ace16cf3b382a531be20a8fe6f4160f8d891800dd2cff5f23c9ca12c2f4a151b`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `5bdbb44b996ab4ccf3a383780270f5cfdbf174982c300723c8bddf0a48ae5e459476031c1d51b9d30ffd621d0a126c18a5de132ef1d92fca2f3e477665ea10cc`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-windows-386.tar.gz) | `5dea3d4c4e91ef889850143b361974250e99a3c526f5efee23ff9ccdcd2ceca4a2247e7c4f236bdfa77d2150157da5d676ac9c3ba26cf3a2f1e06d8827556f77`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `db298e698391368703e6aea7f4345aec5a4b8c69f9d8ff6c99fb5804a6cea16d295fb01e70fe943ade3d4ce9200a081ad40da21bd331317ec9213f69b4d6c48f`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `c6284929dd5940e750b48db72ffbc09f73c5ec31ab3db283babb8e4e07cd8cbb27642f592009caae4717981c0db82c16312849ef4cbafe76acc4264c7d5864ac`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `6fc9552cf082c54cc0833b19876117c87ba7feb5a12c7e57f71b52208daf03eaef3ca56bd22b7bce2d6e81b5a23537cf6f5497a6eaa356c0aab1d3de26c309f9`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `b794b9c399e548949b5bfb2fe71123e86c2034847b2c99aca34b6de718a35355bbecdae9dc2a81c49e3c82fb4b5862526a3f63c2862b438895e12c5ea884f22e`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `fddaed7a54f97046a91c29534645811c6346e973e22950b2607b8c119c2377e9ec2d32144f81626078cdaeca673129cc4016c1a3dbd3d43674aa777089fb56ac`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `65951a534bb55069c7419f41cbcdfe2fae31541d8a3f9eca11fc2489addf281c5ad2d13719212657da0be5b898f22b57ac39446d99072872fbacb0a7d59a4f74`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `992059efb5cae7ed0ef55820368d854bad1c6d13a70366162cd3b5111ce24c371c7c87ded2012f055e08b2ff1b4ef506e1f4e065daa3ac474fef50b5efa4fb07`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `c63ae0f8add5821ad267774314b8c8c1ffe3b785872bf278e721fd5dfdad1a5db1d4db3720bea0a36bf10d9c6dd93e247560162c0eac6e1b743246f587d3b27a`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `47adb9ddf6eaf8f475b89f59ee16fbd5df183149a11ad1574eaa645b47a6d58aec2ca70ba857ce9f1a5793d44cf7a61ebc6874793bb685edaf19410f4f76fd13`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `a3bc4a165567c7b76a3e45ab7b102d6eb3ecf373eb048173f921a4964cf9be8891d0d5b8dafbd88c3af7b0e21ef3d41c1e540c3347ddd84b929b3a3d02ceb7b2`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `109ddf37c748f69584c829db57107c3518defe005c11fcd2a1471845c15aae0a3c89aafdd734229f4069ed18856cc650c80436684e1bdc43cfee3149b0324746`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `a3a75d2696ad3136476ad7d811e8eabaff5111b90e592695e651d6111f819ebf0165b8b7f5adc05afb5f7f01d1e5fb64876cb696e492feb20a477a5800382b7a`

## Changelog since v1.18.0-beta.0

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

- The StreamingProxyRedirects feature and `--redirect-container-streaming` flag are deprecated, and will be removed in a future release. The default behavior (proxy streaming requests through the kubelet) will be the only supported option.
  If you are setting `--redirect-container-streaming=true`, then you must migrate off this configuration. The flag will no longer be able to be enabled starting in v1.20. If you are not setting the flag, no action is necessary. ([#88290](https://github.com/kubernetes/kubernetes/pull/88290), [@tallclair](https://github.com/tallclair)) [SIG API Machinery and Node]

- Yes.

  Feature Name: Support using network resources (VNet, LB, IP, etc.) in different AAD Tenant and Subscription than those for the cluster.

  Changes in Pull Request:

    1. Add properties `networkResourceTenantID` and `networkResourceSubscriptionID` in cloud provider auth config section, which indicates the location of network resources.
    2. Add function `GetMultiTenantServicePrincipalToken` to fetch multi-tenant service principal token, which will be used by Azure VM/VMSS Clients in this feature.
    3. Add function `GetNetworkResourceServicePrincipalToken` to fetch network resource service principal token, which will be used by Azure Network Resource (Load Balancer, Public IP, Route Table, Network Security Group and their sub level resources) Clients in this feature.
    4. Related unit tests.

  None.

  User Documentation: In PR https://github.com/kubernetes-sigs/cloud-provider-azure/pull/301 ([#88384](https://github.com/kubernetes/kubernetes/pull/88384), [@bowen5](https://github.com/bowen5)) [SIG Cloud Provider]

## Changes by Kind

### Deprecation

- Azure service annotation service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset has been deprecated. Its support would be removed in a future release. ([#88462](https://github.com/kubernetes/kubernetes/pull/88462), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]

### API Change

- API additions to apiserver types ([#87179](https://github.com/kubernetes/kubernetes/pull/87179), [@Jefftree](https://github.com/Jefftree)) [SIG API Machinery, Cloud Provider and Cluster Lifecycle]
- Add Scheduling Profiles to kubescheduler.config.k8s.io/v1alpha2 ([#88087](https://github.com/kubernetes/kubernetes/pull/88087), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling and Testing]
- Added support for multiple sizes huge pages on a container level ([#84051](https://github.com/kubernetes/kubernetes/pull/84051), [@bart0sh](https://github.com/bart0sh)) [SIG Apps, Node and Storage]
- AppProtocol is a new field on Service and Endpoints resources, enabled with the ServiceAppProtocol feature gate. ([#88503](https://github.com/kubernetes/kubernetes/pull/88503), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Fixed missing validation of uniqueness of list items in lists with `x-kubernetes-list-type: map` or x-kubernetes-list-type: set` in CustomResources. ([#84920](https://github.com/kubernetes/kubernetes/pull/84920), [@sttts](https://github.com/sttts)) [SIG API Machinery]
- Introduces optional --detect-local flag to kube-proxy.
  Currently the only supported value is "cluster-cidr",
  which is the default if not specified. ([#87748](https://github.com/kubernetes/kubernetes/pull/87748), [@satyasm](https://github.com/satyasm)) [SIG Cluster Lifecycle, Network and Scheduling]
- Kube-scheduler can run more than one scheduling profile. Given a pod, the profile is selected by using its `.spec.SchedulerName`. ([#88285](https://github.com/kubernetes/kubernetes/pull/88285), [@alculquicondor](https://github.com/alculquicondor)) [SIG Apps, Scheduling and Testing]
- Moving Windows RunAsUserName feature to GA ([#87790](https://github.com/kubernetes/kubernetes/pull/87790), [@marosset](https://github.com/marosset)) [SIG Apps and Windows]

### Feature

- Add --dry-run to kubectl delete, taint, replace ([#88292](https://github.com/kubernetes/kubernetes/pull/88292), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG CLI and Testing]
- Add huge page stats to Allocated resources in "kubectl describe node" ([#80605](https://github.com/kubernetes/kubernetes/pull/80605), [@odinuge](https://github.com/odinuge)) [SIG CLI]
- Kubeadm: The ClusterStatus struct present in the kubeadm-config ConfigMap is deprecated and will be removed on a future version. It is going to be maintained by kubeadm until it gets removed. The same information can be found on `etcd` and `kube-apiserver` pod annotations, `kubeadm.kubernetes.io/etcd.advertise-client-urls` and `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint` respectively. ([#87656](https://github.com/kubernetes/kubernetes/pull/87656), [@ereslibre](https://github.com/ereslibre)) [SIG Cluster Lifecycle]
- Kubeadm: add the experimental feature gate PublicKeysECDSA that can be used to create a
  cluster with ECDSA certificates from "kubeadm init". Renewal of existing ECDSA certificates is
  also supported using "kubeadm alpha certs renew", but not switching between the RSA and
  ECDSA algorithms on the fly or during upgrades. ([#86953](https://github.com/kubernetes/kubernetes/pull/86953), [@rojkov](https://github.com/rojkov)) [SIG API Machinery, Auth and Cluster Lifecycle]
- Kubeadm: on kubeconfig certificate renewal, keep the embedded CA in sync with the one on disk ([#88052](https://github.com/kubernetes/kubernetes/pull/88052), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: upgrade supports fallback to the nearest known etcd version if an unknown k8s version is passed ([#88373](https://github.com/kubernetes/kubernetes/pull/88373), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- New flag `--show-hidden-metrics-for-version` in kube-scheduler can be used to show all hidden metrics that deprecated in the previous minor release. ([#84913](https://github.com/kubernetes/kubernetes/pull/84913), [@serathius](https://github.com/serathius)) [SIG Instrumentation and Scheduling]
- Scheduler framework permit plugins now run at the end of the scheduling cycle, after reserve plugins. Waiting on permit will remain in the beginning of the binding cycle. ([#88199](https://github.com/kubernetes/kubernetes/pull/88199), [@mateuszlitwin](https://github.com/mateuszlitwin)) [SIG Scheduling]
- The kubelet and the default docker runtime now support running ephemeral containers in the Linux process namespace of a target container. Other container runtimes must implement this feature before it will be available in that runtime. ([#84731](https://github.com/kubernetes/kubernetes/pull/84731), [@verb](https://github.com/verb)) [SIG Node]

### Other (Bug, Cleanup or Flake)

- Add delays between goroutines for vm instance update ([#88094](https://github.com/kubernetes/kubernetes/pull/88094), [@aramase](https://github.com/aramase)) [SIG Cloud Provider]
- Add init containers log to cluster dump info. ([#88324](https://github.com/kubernetes/kubernetes/pull/88324), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- CPU limits are now respected for Windows containers. If a node is over-provisioned, no weighting is used - only limits are respected. ([#86101](https://github.com/kubernetes/kubernetes/pull/86101), [@PatrickLang](https://github.com/PatrickLang)) [SIG Node, Testing and Windows]
- Cloud provider config CloudProviderBackoffMode has been removed since it won't be used anymore. ([#88463](https://github.com/kubernetes/kubernetes/pull/88463), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Evictions due to pods breaching their ephemeral storage limits are now recorded by the `kubelet_evictions` metric and can be alerted on. ([#87906](https://github.com/kubernetes/kubernetes/pull/87906), [@smarterclayton](https://github.com/smarterclayton)) [SIG Node]
- Fix: add remediation in azure disk attach/detach ([#88444](https://github.com/kubernetes/kubernetes/pull/88444), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: check disk status before disk azure disk ([#88360](https://github.com/kubernetes/kubernetes/pull/88360), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fixed cleaning of CSI raw block volumes. ([#87978](https://github.com/kubernetes/kubernetes/pull/87978), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Get-kube.sh uses the gcloud's current local GCP service account for auth when the provider is GCE or GKE instead of the metadata server default ([#88383](https://github.com/kubernetes/kubernetes/pull/88383), [@BenTheElder](https://github.com/BenTheElder)) [SIG Cluster Lifecycle]
- Golang/x/net has been updated to bring in fixes for CVE-2020-9283 ([#88381](https://github.com/kubernetes/kubernetes/pull/88381), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle and Instrumentation]
- Kubeadm now includes CoreDNS version 1.6.7 ([#86260](https://github.com/kubernetes/kubernetes/pull/86260), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Kubeadm: fix the bug that 'kubeadm upgrade' hangs in single node cluster ([#88434](https://github.com/kubernetes/kubernetes/pull/88434), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Optimize kubectl version help info ([#88313](https://github.com/kubernetes/kubernetes/pull/88313), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Removes the deprecated command `kubectl rolling-update` ([#88057](https://github.com/kubernetes/kubernetes/pull/88057), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG Architecture, CLI and Testing]


# v1.18.0-alpha.5

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-alpha.5

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes.tar.gz) | `6452cac2b80721e9f577cb117c29b9ac6858812b4275c2becbf74312566f7d016e8b34019bd1bf7615131b191613bf9b973e40ad9ac8f6de9007d41ef2d7fd70`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-src.tar.gz) | `e41d9d4dd6910a42990051fcdca4bf5d3999df46375abd27ffc56aae9b455ae984872302d590da6aa85bba6079334fb5fe511596b415ee79843dee1c61c137da`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-darwin-386.tar.gz) | `5c95935863492b31d4aaa6be93260088dafea27663eb91edca980ca3a8485310e60441bc9050d4d577e9c3f7ffd96db516db8d64321124cec1b712e957c9fe1c`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-darwin-amd64.tar.gz) | `868faa578b3738604d8be62fae599ccc556799f1ce54807f1fe72599f20f8a1f98ad8152fac14a08a463322530b696d375253ba3653325e74b587df6e0510da3`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-386.tar.gz) | `76a89d1d30b476b47f8fb808e342f89608e5c1c1787c4c06f2d7e763f9482e2ae8b31e6ad26541972e2b9a3a7c28327e3150cdd355e8b8d8b050a801bbf08d49`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-amd64.tar.gz) | `07ad96a09b44d1c707d7c68312c5d69b101a3424bf1e6e9400b2e7a3fba78df04302985d473ddd640d8f3f0257be34110dbe1304b9565dd9d7a4639b7b7b85fd`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-arm.tar.gz) | `c04fed9fa370a75c1b8e18b2be0821943bb9befcc784d14762ea3278e73600332a9b324d5eeaa1801d20ad6be07a553c41dcf4fa7ab3eadd0730ab043d687c8c`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-arm64.tar.gz) | `4199147dea9954333df26d34248a1cb7b02ebbd6380ffcd42d9f9ed5fdabae45a59215474dab3c11436c82e60bd27cbd03b3dde288bf611cd3e78b87c783c6a9`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-ppc64le.tar.gz) | `4f6d4d61d1c52d3253ca19031ebcd4bad06d19b68bbaaab5c8e8c590774faea4a5ceab1f05f2706b61780927e1467815b3479342c84d45df965aba78414727c4`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-linux-s390x.tar.gz) | `e2a454151ae5dd891230fb516a3f73f73ab97832db66fd3d12e7f1657a569f58a9fe2654d50ddd7d8ec88a5ff5094199323a4c6d7d44dcf7edb06cca11dd4de1`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-windows-386.tar.gz) | `14b262ba3b71c41f545db2a017cf1746075ada5745a858d2a62bc9df7c5dc10607220375db85e2c4cb85307b09709e58bc66a407488e0961191e3249dc7742b0`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-client-windows-amd64.tar.gz) | `26353c294755a917216664364b524982b7f5fc6aa832ce90134bb178df8a78604963c68873f121ea5f2626ff615bdbf2ffe54e00578739cde6df42ffae034732`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-server-linux-amd64.tar.gz) | `ba77e0e7c610f59647c1b2601f82752964a0f54b7ad609a89b00fcfd553d0f0249f6662becbabaa755bb769b36a2000779f08022c40fb8cc61440337481317a1`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-server-linux-arm.tar.gz) | `45e87b3e844ea26958b0b489e8c9b90900a3253000850f5ff9e87ffdcafba72ab8fd17b5ba092051a58a4bc277912c047a85940ec7f093dff6f9e8bf6fed3b42`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-server-linux-arm64.tar.gz) | `155e136e3124ead69c594eead3398d6cfdbb8f823c324880e8a7bbd1b570b05d13a77a69abd0a6758cfcc7923971cc6da4d3e0c1680fd519b632803ece00d5ce`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-server-linux-ppc64le.tar.gz) | `3fa0fb8221da19ad9d03278961172b7fa29a618b30abfa55e7243bb937dede8df56658acf02e6b61e7274fbc9395e237f49c62f2a83017eca2a69f67af31c01c`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-server-linux-s390x.tar.gz) | `db3199c3d7ba0b326d71dc8b80f50b195e79e662f71386a3b2976d47d13d7b0136887cc21df6f53e70a3d733da6eac7bbbf3bab2df8a1909a3cee4b44c32dd0b`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-linux-amd64.tar.gz) | `addcdfbad7f12647e6babb8eadf853a374605c8f18bf63f416fa4d3bf1b903aa206679d840433206423a984bb925e7983366edcdf777cf5daef6ef88e53d6dfa`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-linux-arm.tar.gz) | `b2ac54e0396e153523d116a2aaa32c919d6243931e0104cd47a23f546d710e7abdaa9eae92d978ce63c92041e63a9b56f5dd8fd06c812a7018a10ecac440f768`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-linux-arm64.tar.gz) | `7aab36f2735cba805e4fd109831a1af0f586a88db3f07581b6dc2a2aab90076b22c96b490b4f6461a8fb690bf78948b6d514274f0d6fb0664081de2d44dc48e1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-linux-ppc64le.tar.gz) | `a579936f07ebf86f69f297ac50ba4c34caf2c0b903f73190eb581c78382b05ef36d41ade5bfd25d7b1b658cfcbee3d7125702a18e7480f9b09a62733a512a18a`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-linux-s390x.tar.gz) | `58fa0359ddd48835192fab1136a2b9b45d1927b04411502c269cda07cb8a8106536973fb4c7fedf1d41893a524c9fe2e21078fdf27bfbeed778273d024f14449`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.5/kubernetes-node-windows-amd64.tar.gz) | `9086c03cd92b440686cea6d8c4e48045cc46a43ab92ae0e70350b3f51804b9e2aaae7178142306768bae00d9ef6dd938167972bfa90b12223540093f735a45db`

## Changelog since v1.18.0-alpha.3

### Deprecation

- Kubeadm: command line option "kubelet-version" for `kubeadm upgrade node` has been deprecated and will be removed in a future release. ([#87942](https://github.com/kubernetes/kubernetes/pull/87942), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]

### API Change

- Kubelet podresources API now provides the information about active pods only. ([#79409](https://github.com/kubernetes/kubernetes/pull/79409), [@takmatsu](https://github.com/takmatsu)) [SIG Node]
- Remove deprecated fields from .leaderElection in kubescheduler.config.k8s.io/v1alpha2 ([#87904](https://github.com/kubernetes/kubernetes/pull/87904), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Signatures on generated clientset methods have been modified to accept `context.Context` as a first argument. Signatures of generated Create, Update, and Patch methods have been updated to accept CreateOptions, UpdateOptions and PatchOptions respectively. Clientsets that with the previous interface have been added in new "deprecated" packages to allow incremental migration to the new APIs. The deprecated packages will be removed in the 1.21 release. ([#87299](https://github.com/kubernetes/kubernetes/pull/87299), [@mikedanese](https://github.com/mikedanese)) [SIG API Machinery, Apps, Auth, Autoscaling, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Scheduling, Storage, Testing and Windows]
- The k8s.io/node-api component is no longer updated. Instead, use the RuntimeClass types located within k8s.io/api, and the generated clients located within k8s.io/client-go ([#87503](https://github.com/kubernetes/kubernetes/pull/87503), [@liggitt](https://github.com/liggitt)) [SIG Node and Release]

### Feature

- Add indexer for storage cacher ([#85445](https://github.com/kubernetes/kubernetes/pull/85445), [@shaloulcy](https://github.com/shaloulcy)) [SIG API Machinery]
- Add support for mount options to the FC volume plugin ([#87499](https://github.com/kubernetes/kubernetes/pull/87499), [@ejweber](https://github.com/ejweber)) [SIG Storage]
- Added a config-mode flag in azure auth module to enable getting AAD token without spn: prefix in audience claim. When it's not specified, the default behavior doesn't change. ([#87630](https://github.com/kubernetes/kubernetes/pull/87630), [@weinong](https://github.com/weinong)) [SIG API Machinery, Auth, CLI and Cloud Provider]
- Introduced BackoffManager interface for backoff management ([#87829](https://github.com/kubernetes/kubernetes/pull/87829), [@zhan849](https://github.com/zhan849)) [SIG API Machinery]
- PodTopologySpread plugin now excludes terminatingPods when making scheduling decisions. ([#87845](https://github.com/kubernetes/kubernetes/pull/87845), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]
- Promote CSIMigrationOpenStack to Beta (off by default since it requires installation of the OpenStack Cinder CSI Driver)
  The in-tree AWS OpenStack Cinder "kubernetes.io/cinder" was already deprecated a while ago and will be removed in 1.20. Users should enable CSIMigration + CSIMigrationOpenStack features and install the OpenStack Cinder CSI Driver (https://github.com/kubernetes-sigs/cloud-provider-openstack) to avoid disruption to existing Pod and PVC objects at that time.
  Users should start using the OpenStack Cinder CSI Driver directly for any new volumes. ([#85637](https://github.com/kubernetes/kubernetes/pull/85637), [@dims](https://github.com/dims)) [SIG Cloud Provider]

### Design

- The scheduler Permit extension point doesn't return a boolean value in its Allow() and Reject() functions. ([#87936](https://github.com/kubernetes/kubernetes/pull/87936), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]

### Other (Bug, Cleanup or Flake)

- Adds "volume.beta.kubernetes.io/migrated-to" annotation to PV's and PVC's when they are migrated to signal external provisioners to pick up those objects for Provisioning and Deleting. ([#87098](https://github.com/kubernetes/kubernetes/pull/87098), [@davidz627](https://github.com/davidz627)) [SIG Apps and Storage]
- Fix a bug in the dual-stack IPVS proxier where stale IPv6 endpoints were not being cleaned up ([#87695](https://github.com/kubernetes/kubernetes/pull/87695), [@andrewsykim](https://github.com/andrewsykim)) [SIG Network]
- Fix kubectl drain ignore daemonsets and others. ([#87361](https://github.com/kubernetes/kubernetes/pull/87361), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Fix: add azure disk migration support for CSINode ([#88014](https://github.com/kubernetes/kubernetes/pull/88014), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix: add non-retriable errors in azure clients ([#87941](https://github.com/kubernetes/kubernetes/pull/87941), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fixed NetworkPolicy validation that Except values are accepted when they are outside the CIDR range. ([#86578](https://github.com/kubernetes/kubernetes/pull/86578), [@tnqn](https://github.com/tnqn)) [SIG Network]
- Improves performance of the node authorizer ([#87696](https://github.com/kubernetes/kubernetes/pull/87696), [@liggitt](https://github.com/liggitt)) [SIG Auth]
- Iptables/userspace proxy: improve performance by getting local addresses only once per sync loop, instead of for every external IP ([#85617](https://github.com/kubernetes/kubernetes/pull/85617), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Network]
- Kube-aggregator: always sets unavailableGauge metric to reflect the current state of a service. ([#87778](https://github.com/kubernetes/kubernetes/pull/87778), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery]
- Kubeadm allows to configure single-stack clusters if dual-stack is enabled ([#87453](https://github.com/kubernetes/kubernetes/pull/87453), [@aojea](https://github.com/aojea)) [SIG API Machinery, Cluster Lifecycle and Network]
- Kubeadm:  'kubeadm alpha kubelet config download' has been removed, please use 'kubeadm upgrade node phase kubelet-config' instead ([#87944](https://github.com/kubernetes/kubernetes/pull/87944), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubeadm: remove 'kubeadm upgrade node config' command since it was deprecated in v1.15, please use 'kubeadm upgrade node phase kubelet-config' instead ([#87975](https://github.com/kubernetes/kubernetes/pull/87975), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubectl describe <type> and kubectl top pod will return a message saying "No resources found" or "No resources found in <namespace> namespace" if there are no results to display. ([#87527](https://github.com/kubernetes/kubernetes/pull/87527), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Kubelet metrics gathered through metrics-server or prometheus should no longer timeout for Windows nodes running more than 3 pods. ([#87730](https://github.com/kubernetes/kubernetes/pull/87730), [@marosset](https://github.com/marosset)) [SIG Node, Testing and Windows]
- Kubelet metrics have been changed to buckets.
  For example the exec/{podNamespace}/{podID}/{containerName} is now just exec. ([#87913](https://github.com/kubernetes/kubernetes/pull/87913), [@cheftako](https://github.com/cheftako)) [SIG Node]
- Limit number of instances in a single update to GCE target pool to 1000. ([#87881](https://github.com/kubernetes/kubernetes/pull/87881), [@wojtek-t](https://github.com/wojtek-t)) [SIG Cloud Provider, Network and Scalability]
- Make Azure clients only retry on specified HTTP status codes ([#88017](https://github.com/kubernetes/kubernetes/pull/88017), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Pause image contains "Architecture" in non-amd64 images ([#87954](https://github.com/kubernetes/kubernetes/pull/87954), [@BenTheElder](https://github.com/BenTheElder)) [SIG Release]
- Pods that are considered for preemption and haven't started don't produce an error log. ([#87900](https://github.com/kubernetes/kubernetes/pull/87900), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Prevent error message from being displayed when running kubectl plugin list and your path includes an empty string ([#87633](https://github.com/kubernetes/kubernetes/pull/87633), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- `kubectl create clusterrolebinding` creates rbac.authorization.k8s.io/v1 object ([#85889](https://github.com/kubernetes/kubernetes/pull/85889), [@oke-py](https://github.com/oke-py)) [SIG CLI]

# v1.18.0-alpha.4

[Documentation](https://docs.k8s.io)

## Important note about manual tag

Due to a [tagging bug in our Release Engineering tooling](https://github.com/kubernetes/release/issues/1080) during `v1.18.0-alpha.3`, we needed to push a manual tag (`v1.18.0-alpha.4`).

**No binaries have been produced or will be provided for `v1.18.0-alpha.4`.**

The changelog for `v1.18.0-alpha.4` is included as part of the [changelog since v1.18.0-alpha.3][#changelog-since-v1180-alpha3] section.

# v1.18.0-alpha.3

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-alpha.3

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes.tar.gz) | `60bf3bfc23b428f53fd853bac18a4a905b980fcc0bacd35ccd6357a89cfc26e47de60975ea6b712e65980e6b9df82a22331152d9f08ed4dba44558ba23a422d4`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-src.tar.gz) | `8adf1016565a7c93713ab6fa4293c2d13b4f6e4e1ec4dcba60bd71e218b4dbe9ef5eb7dbb469006743f498fc7ddeb21865cd12bec041af60b1c0edce8b7aecd5`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-darwin-386.tar.gz) | `abb32e894e8280c772e96227b574da81cd1eac374b8d29158b7f222ed550087c65482eef4a9817dfb5f2baf0d9b85fcdfa8feced0fbc1aacced7296853b57e1f`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | `5e4b1a993264e256ec1656305de7c306094cae9781af8f1382df4ce4eed48ce030827fde1a5e757d4ad57233d52075c9e4e93a69efbdc1102e4ba810705ccddc`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-386.tar.gz) | `68da39c2ae101d2b38f6137ceda07eb0c2124794982a62ef483245dbffb0611c1441ca085fa3127e7a9977f45646788832a783544ff06954114548ea0e526e46`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | `dc236ffa8ad426620e50181419e9bebe3c161e953dbfb8a019f61b11286e1eb950b40d7cc03423bdf3e6974973bcded51300f98b55570c29732fa492dcde761d`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | `ab0a8bd6dc31ea160b731593cdc490b3cc03668b1141cf95310bd7060dcaf55c7ee9842e0acae81063fdacb043c3552ccdd12a94afd71d5310b3ce056fdaa06c`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | `159ea083c601710d0d6aea423eeb346c99ffaf2abd137d35a53e87a07f5caf12fca8790925f3196f67b768fa92a024f83b50325dbca9ccd4dde6c59acdce3509`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | `16b0459adfa26575d13be49ab53ac7f0ffd05e184e4e13d2dfbfe725d46bb8ac891e1fd8aebe36ecd419781d4cc5cf3bd2aaaf5263cf283724618c4012408f40`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | `d5aa1f5d89168995d2797eb839a04ce32560f405b38c1c0baaa0e313e4771ae7bb3b28e22433ad5897d36aadf95f73eb69d8d411d31c4115b6b0adf5fe041f85`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-windows-386.tar.gz) | `374e16a1e52009be88c94786f80174d82dff66399bf294c9bee18a2159c42251c5debef1109a92570799148b08024960c6c50b8299a93fd66ebef94f198f34e9`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | `5a94c1068c19271f810b994adad8e62fae03b3d4473c7c9e6d056995ff7757ea61dd8d140c9267dd41e48808876673ce117826d35a3c1bb5652752f11a044d57`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | `a677bec81f0eba75114b92ff955bac74512b47e53959d56a685dae5edd527283d91485b1e86ad74ef389c5405863badf7eb22e2f0c9a568a4d0cb495c6a5c32f`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | `2fb696f86ff13ebeb5f3cf2b254bf41303644c5ea84a292782eac6123550702655284d957676d382698c091358e5c7fe73f32803699c19be7138d6530fe413b6`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | `738e95da9cfb8f1309479078098de1c38cef5e1dd5ee1129b77651a936a412b7cd0cf15e652afc7421219646a98846ab31694970432e48dea9c9cafa03aa59cf`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | `7a85bfcbb2aa636df60c41879e96e788742ecd72040cb0db2a93418439c125218c58a4cfa96d01b0296c295793e94c544e87c2d98d50b49bc4cb06b41f874376`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | `1f1cdb2efa3e7cac857203d8845df2fdaa5cf1f20df764efffff29371945ec58f6deeba06f8fbf70b96faf81b0c955bf4cb84e30f9516cb2cc1ed27c2d2185a6`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | `4ccfced3f5ba4adfa58f4a9d1b2c5bdb3e89f9203ab0e27d11eb1c325ac323ebe63c015d2c9d070b233f5d1da76cab5349da3528511c1cd243e66edc9af381c4`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | `d695a69d18449062e4c129e54ec8384c573955f8108f4b78adc2ec929719f2196b995469c728dd6656c63c44cda24315543939f85131ebc773cfe0de689df55b`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | `21df1da88c89000abc22f97e482c3aaa5ce53ec9628d83dda2e04a1d86c4d53be46c03ed6f1f211df3ee5071bce39d944ff7716b5b6ada3b9c4821d368b0a898`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | `ff77e3aacb6ed9d89baed92ef542c8b5cec83151b6421948583cf608bca3b779dce41fc6852961e00225d5e1502f6a634bfa61a36efa90e1aee90dedb787c2d2`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | `57d75b7977ec1a0f6e7ed96a304dbb3b8664910f42ca19aab319a9ec33535ff5901dfca4abcb33bf5741cde6d152acd89a5f8178f0efe1dc24430e0c1af5b98f`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | `63fdbb71773cfd73a914c498e69bb9eea3fc314366c99ffb8bd42ec5b4dae807682c83c1eb5cfb1e2feb4d11d9e49cc85ba644e954241320a835798be7653d61`

## Changelog since v1.18.0-alpha.2

### Deprecation

- Remove all the generators from kubectl run. It will now only create pods. Additionally, deprecates all the flags that are not relevant anymore. ([#87077](https://github.com/kubernetes/kubernetes/pull/87077), [@soltysh](https://github.com/soltysh)) [SIG Architecture, SIG CLI, and SIG Testing]
- kubeadm: kube-dns is deprecated and will not be supported in a future version ([#86574](https://github.com/kubernetes/kubernetes/pull/86574), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]

### API Change

- Add kubescheduler.config.k8s.io/v1alpha2 ([#87628](https://github.com/kubernetes/kubernetes/pull/87628), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- --enable-cadvisor-endpoints is now disabled by default. If you need access to the cAdvisor v1 Json API please enable it explicitly in the kubelet command line. Please note that this flag was deprecated in 1.15 and will be removed in 1.19. ([#87440](https://github.com/kubernetes/kubernetes/pull/87440), [@dims](https://github.com/dims)) [SIG Instrumentation, SIG Node, and SIG Testing]
- The following feature gates are removed, because the associated features were unconditionally enabled in previous releases: CustomResourceValidation, CustomResourceSubresources, CustomResourceWebhookConversion, CustomResourcePublishOpenAPI, CustomResourceDefaulting ([#87475](https://github.com/kubernetes/kubernetes/pull/87475), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]

### Feature

- aggragation api will have alpha support for network proxy ([#87515](https://github.com/kubernetes/kubernetes/pull/87515), [@Sh4d1](https://github.com/Sh4d1)) [SIG API Machinery]
- API request throttling (due to a high rate of requests) is now reported in client-go logs at log level 2.  The messages are of the form

  Throttling request took 1.50705208s, request: GET:<URL>

  The presence of these messages, may indicate to the administrator the need to tune the cluster accordingly. ([#87740](https://github.com/kubernetes/kubernetes/pull/87740), [@jennybuckley](https://github.com/jennybuckley)) [SIG API Machinery]
- kubeadm: reject a node joining the cluster if a node with the same name already exists ([#81056](https://github.com/kubernetes/kubernetes/pull/81056), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- disableAvailabilitySetNodes is added to avoid VM list for VMSS clusters. It should only be used when vmType is "vmss" and all the nodes (including masters) are VMSS virtual machines. ([#87685](https://github.com/kubernetes/kubernetes/pull/87685), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- The kubectl --dry-run flag now accepts the values 'client', 'server', and 'none', to support client-side and server-side dry-run strategies. The boolean and unset values for the --dry-run flag are deprecated and a value will be required in a future version. ([#87580](https://github.com/kubernetes/kubernetes/pull/87580), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG CLI]
- Add support for pre-allocated hugepages for more than one page size ([#82820](https://github.com/kubernetes/kubernetes/pull/82820), [@odinuge](https://github.com/odinuge)) [SIG Apps]
- Update CNI version to v0.8.5 ([#78819](https://github.com/kubernetes/kubernetes/pull/78819), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, SIG Cluster Lifecycle, SIG Network, SIG Release, and SIG Testing]
- Skip default spreading scoring plugin for pods that define TopologySpreadConstraints ([#87566](https://github.com/kubernetes/kubernetes/pull/87566), [@skilxn-go](https://github.com/skilxn-go)) [SIG Scheduling]
- Added more details to taint toleration errors ([#87250](https://github.com/kubernetes/kubernetes/pull/87250), [@starizard](https://github.com/starizard)) [SIG Apps, and SIG Scheduling]
- Scheduler: Add DefaultBinder plugin ([#87430](https://github.com/kubernetes/kubernetes/pull/87430), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling, and SIG Testing]
- Kube-apiserver metrics will now include request counts, latencies, and response sizes for /healthz, /livez, and /readyz requests. ([#83598](https://github.com/kubernetes/kubernetes/pull/83598), [@jktomer](https://github.com/jktomer)) [SIG API Machinery]

### Other (Bug, Cleanup or Flake)

- Fix the masters rolling upgrade causing thundering herd of LISTs on etcd leading to control plane unavailability. ([#86430](https://github.com/kubernetes/kubernetes/pull/86430), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery, SIG Node, and SIG Testing]
- `kubectl diff` now returns 1 only on diff finding changes, and >1 on kubectl errors. The "exit status code 1" message as also been muted. ([#87437](https://github.com/kubernetes/kubernetes/pull/87437), [@apelisse](https://github.com/apelisse)) [SIG CLI, and SIG Testing]
- To reduce chances of throttling, VM cache is set to nil when Azure node provisioning state is deleting ([#87635](https://github.com/kubernetes/kubernetes/pull/87635), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fix regression in statefulset conversion which prevented applying a statefulset multiple times. ([#87706](https://github.com/kubernetes/kubernetes/pull/87706), [@liggitt](https://github.com/liggitt)) [SIG Apps, and SIG Testing]
- fixed two scheduler metrics (pending_pods and schedule_attempts_total) not being recorded ([#87692](https://github.com/kubernetes/kubernetes/pull/87692), [@everpeace](https://github.com/everpeace)) [SIG Scheduling]
- Resolved a performance issue in the node authorizer index maintenance. ([#87693](https://github.com/kubernetes/kubernetes/pull/87693), [@liggitt](https://github.com/liggitt)) [SIG Auth]
- Removed the 'client' label from apiserver_request_total. ([#87669](https://github.com/kubernetes/kubernetes/pull/87669), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, and SIG Instrumentation]
- `(*"k8s.io/client-go/rest".Request).{Do,DoRaw,Stream,Watch}` now require callers to pass a `context.Context` as an argument. The context is used for timeout and cancellation signaling and to pass supplementary information to round trippers in the wrapped transport chain. If you don't need any of this functionality, it is sufficient to pass a context created with `context.Background()` to these functions. The `(*"k8s.io/client-go/rest".Request).Context` method is removed now that all methods that execute a request accept a context directly. ([#87597](https://github.com/kubernetes/kubernetes/pull/87597), [@mikedanese](https://github.com/mikedanese)) [SIG API Machinery, SIG Apps, SIG Auth, SIG Autoscaling, SIG CLI, SIG Cloud Provider, SIG Cluster Lifecycle, SIG Instrumentation, SIG Network, SIG Node, SIG Scheduling, SIG Storage, and SIG Testing]
- For volumes that allow attaches across multiple nodes, attach and detach operations across different nodes are now executed in parallel. ([#87258](https://github.com/kubernetes/kubernetes/pull/87258), [@verult](https://github.com/verult)) [SIG Apps, SIG Node, and SIG Storage]
- kubeadm: apply further improvements to the tentative support for concurrent etcd member join. Fixes a bug where multiple members can receive the same hostname. Increase the etcd client dial timeout and retry timeout for add/remove/... operations. ([#87505](https://github.com/kubernetes/kubernetes/pull/87505), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Reverted a kubectl azure auth module change where oidc claim spn: prefix was omitted resulting a breaking behavior with existing Azure AD OIDC enabled api-server ([#87507](https://github.com/kubernetes/kubernetes/pull/87507), [@weinong](https://github.com/weinong)) [SIG API Machinery, SIG Auth, and SIG Cloud Provider]
- Update cri-tools to v1.17.0 ([#86305](https://github.com/kubernetes/kubernetes/pull/86305), [@saschagrunert](https://github.com/saschagrunert)) [SIG Cluster Lifecycle, and SIG Release]
- kubeadm: remove the deprecated CoreDNS feature-gate. It was set to "true" since v1.11 when the feature went GA. In v1.13 it was marked as deprecated and hidden from the CLI. ([#87400](https://github.com/kubernetes/kubernetes/pull/87400), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Shared informers are now more reliable in the face of network disruption. ([#86015](https://github.com/kubernetes/kubernetes/pull/86015), [@squeed](https://github.com/squeed)) [SIG API Machinery]
- the CSR signing cert/key pairs will be reloaded from disk like the kube-apiserver cert/key pairs ([#86816](https://github.com/kubernetes/kubernetes/pull/86816), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, SIG Apps, and SIG Auth]
- "kubectl describe statefulsets.apps" prints garbage for rolling update partition ([#85846](https://github.com/kubernetes/kubernetes/pull/85846), [@phil9909](https://github.com/phil9909)) [SIG CLI]


<!-- NEW RELEASE NOTES ENTRY -->


# v1.18.0-alpha.2

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-alpha.2


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes.tar.gz) | `7af83386b4b35353f0aa1bdaf73599eb08b1d1ca11ecc2c606854aff754db69f3cd3dc761b6d7fc86f01052f615ca53185f33dbf9e53b2f926b0f02fc103fbd3`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-src.tar.gz) | `a14b02a0a0bde97795a836a8f5897b0ee6b43e010e13e43dd4cca80a5b962a1ef3704eedc7916fed1c38ec663a71db48c228c91e5daacba7d9370df98c7ddfb6`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `427f214d47ded44519007de2ae87160c56c2920358130e474b768299751a9affcbc1b1f0f936c39c6138837bca2a97792a6700896976e98c4beee8a1944cfde1`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `861fd81ac3bd45765575bedf5e002a2294aba48ef9e15980fc7d6783985f7d7fcde990ea0aef34690977a88df758722ec0a2e170d5dcc3eb01372e64e5439192`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `7d59b05d6247e2606a8321c72cd239713373d876dbb43b0fb7f1cb857fa6c998038b41eeed78d9eb67ce77b0b71776ceed428cce0f8d2203c5181b473e0bd86c`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `7cdefb4e32bad9d2df5bb8e7e0a6f4dab2ae6b7afef5d801ac5c342d4effdeacd799081fa2dec699ecf549200786c7623c3176252010f12494a95240dd63311d`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `6212bbf0fa1d01ced77dcca2c4b76b73956cd3c6b70e0701c1fe0df5ff37160835f6b84fa2481e0e6979516551b14d8232d1c72764a559a3652bfe2a1e7488ff`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `1f0d9990700510165ee471acb2f88222f1b80e8f6deb351ce14cf50a70a9840fb99606781e416a13231c74b2bd7576981b5348171aa33b628d2666e366cd4629`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `77e00ba12a32db81e96f8de84609de93f32c61bb3f53875a57496d213aa6d1b92c09ad5a6de240a78e1a5bf77fac587ff92874f34a10f8909ae08ca32fda45d2`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `a39ec2044bed5a4570e9c83068e0fc0ce923ccffa44380f8bbc3247426beaff79c8a84613bcb58b05f0eb3afbc34c79fe3309aa2e0b81abcfd0aa04770e62e05`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `1a0ab88f9b7e34b60ab31d5538e97202a256ad8b7b7ed5070cae5f2f12d5d4edeae615db7a34ebbe254004b6393c6b2480100b09e30e59c9139492a3019a596a`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `1966eb5dfb78c1bc33aaa6389f32512e3aa92584250a0164182f3566c81d901b59ec78ee4e25df658bc1dd221b5a9527d6ce3b6c487ca3e3c0b319a077caa735`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `f814d6a3872e4572aa4da297c29def4c1fad8eba0903946780b6bf9788c72b99d71085c5aef9e12c01133b26fa4563c1766ba724ad2a8af2670a24397951a94d`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `56aa08225e546c92c2ff88ac57d3db7dd5e63640772ea72a429f080f7069827138cbc206f6f5fe3a0c01bfca043a9eda305ecdc1dcb864649114893e46b6dc84`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `fb87128d905211ba097aa860244a376575ae2edbaca6e51402a24bc2964854b9b273e09df3d31a2bcffc91509f7eecb2118b183fb0e0eb544f33403fa235c274`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `6d21fbf39b9d3a0df9642407d6f698fabdc809aca83af197bceb58a81b25846072f407f8fb7caae2e02dc90912e3e0f5894f062f91bcb69f8c2329625d3dfeb7`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `ddcda4dc360ca97705f71bf2a18ddacd7b7ddf77535b62e699e97a1b2dd24843751313351d0112e238afe69558e8271eba4d27ab77bb67b4b9e3fbde6eec85c9`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `78915a9bde35c70c67014f0cea8754849db4f6a84491a3ad9678fd3bc0203e43af5a63cfafe104ae1d56b05ce74893a87a6dcd008d7859e1af6b3bce65425b5d`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `3218e811abcb0cb09d80742def339be3916db5e9bbc62c0dc8e6d87085f7e3d9eeed79dea081906f1de78ddd07b7e3acdbd7765fdb838d262bb35602fd1df106`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `fa22de9c4440b8fb27f4e77a5a63c5e1c8aa8aa30bb79eda843b0f40498c21b8c0ad79fff1d841bb9fef53fe20da272506de9a86f81a0b36d028dbeab2e482ce`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `bbda9b5cc66e8f13d235703b2a85e2c4f02fa16af047be4d27a3e198e11eb11706e4a0fbb6c20978c770b069cd4cd9894b661f09937df9d507411548c36576e0`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `b2ed1eda013069adce2aac00b86d75b84e006cfce9bafac0b5a2bafcb60f8f2cb346b5ea44eafa72d777871abef1ea890eb3a2a05de28968f9316fa88886a8ed`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `bd8eb23dba711f31b5148257076b1bbe9629f2a75de213b2c779bd5b29279e9bf22f8bde32f4bc814f4c0cc49e19671eb8b24f4105f0fe2c1490c4b78ec3c704`

## Changelog since v1.18.0-alpha.1

### Other notable changes

* Bump golang/mock version to v1.3.1 ([#87326](https://github.com/kubernetes/kubernetes/pull/87326), [@wawa0210](https://github.com/wawa0210))
* fix a bug that orphan revision cannot be adopted and statefulset cannot be synced ([#86801](https://github.com/kubernetes/kubernetes/pull/86801), [@likakuli](https://github.com/likakuli))
* Azure storage clients now suppress requests on throttling ([#87306](https://github.com/kubernetes/kubernetes/pull/87306), [@feiskyer](https://github.com/feiskyer))
* Introduce Alpha field `Immutable` in both Secret and ConfigMap objects to mark their contents as immutable. The implementation is hidden behind feature gate `ImmutableEphemeralVolumes` (currently in Alpha stage). ([#86377](https://github.com/kubernetes/kubernetes/pull/86377), [@wojtek-t](https://github.com/wojtek-t))
* EndpointSlices will now be enabled by default. A new `EndpointSliceProxying` feature gate determines if kube-proxy will use EndpointSlices, this is disabled by default. ([#86137](https://github.com/kubernetes/kubernetes/pull/86137), [@robscott](https://github.com/robscott))
* kubeadm upgrades always persist the etcd backup for stacked ([#86861](https://github.com/kubernetes/kubernetes/pull/86861), [@SataQiu](https://github.com/SataQiu))
* Fix the bug PIP's DNS is deleted if no DNS label service annotation isn't set. ([#87246](https://github.com/kubernetes/kubernetes/pull/87246), [@nilo19](https://github.com/nilo19))
* New flag `--show-hidden-metrics-for-version` in kube-controller-manager can be used to show all hidden metrics that deprecated in the previous minor release. ([#85281](https://github.com/kubernetes/kubernetes/pull/85281), [@RainbowMango](https://github.com/RainbowMango))
* Azure network and VM clients now suppress requests on throttling ([#87122](https://github.com/kubernetes/kubernetes/pull/87122), [@feiskyer](https://github.com/feiskyer))
* `kubectl apply  -f <file> --prune -n <namespace>` should prune all resources not defined in the file in the cli specified namespace. ([#85613](https://github.com/kubernetes/kubernetes/pull/85613), [@MartinKaburu](https://github.com/MartinKaburu))
* Fixes service account token admission error in clusters that do not run the service account token controller ([#87029](https://github.com/kubernetes/kubernetes/pull/87029), [@liggitt](https://github.com/liggitt))
* CustomResourceDefinition status fields are no longer required for client validation when submitting manifests.  ([#87213](https://github.com/kubernetes/kubernetes/pull/87213), [@hasheddan](https://github.com/hasheddan))
* All apiservers log request lines in a more greppable format. ([#87203](https://github.com/kubernetes/kubernetes/pull/87203), [@lavalamp](https://github.com/lavalamp))
* provider/azure: Network security groups can now be in a separate resource group. ([#87035](https://github.com/kubernetes/kubernetes/pull/87035), [@CecileRobertMichon](https://github.com/CecileRobertMichon))
* Cleaned up the output from `kubectl describe CSINode <name>`. ([#85283](https://github.com/kubernetes/kubernetes/pull/85283), [@huffmanca](https://github.com/huffmanca))
* Fixed the following  ([#84265](https://github.com/kubernetes/kubernetes/pull/84265), [@bhagwat070919](https://github.com/bhagwat070919))
    * -  AWS Cloud Provider attempts to delete LoadBalancer security group it didn’t provision
    * -  AWS Cloud Provider creates default LoadBalancer security group even if annotation [service.beta.kubernetes.io/aws-load-balancer-security-groups] is present
* kubelet: resource metrics endpoint `/metrics/resource/v1alpha1` as well as all metrics under this endpoint have been deprecated. ([#86282](https://github.com/kubernetes/kubernetes/pull/86282), [@RainbowMango](https://github.com/RainbowMango))
    * Please convert to the following metrics emitted by endpoint `/metrics/resource`:
    * - scrape_error --> scrape_error
    * - node_cpu_usage_seconds_total --> node_cpu_usage_seconds
    * - node_memory_working_set_bytes --> node_memory_working_set_bytes
    * - container_cpu_usage_seconds_total --> container_cpu_usage_seconds
    * - container_memory_working_set_bytes --> container_memory_working_set_bytes
    * - scrape_error --> scrape_error
* You can now pass "--node-ip ::" to kubelet to indicate that it should autodetect an IPv6 address to use as the node's primary address. ([#85850](https://github.com/kubernetes/kubernetes/pull/85850), [@danwinship](https://github.com/danwinship))
* kubeadm: support automatic retry after failing to pull image ([#86899](https://github.com/kubernetes/kubernetes/pull/86899), [@SataQiu](https://github.com/SataQiu))
* TODO ([#87044](https://github.com/kubernetes/kubernetes/pull/87044), [@jennybuckley](https://github.com/jennybuckley))
* Improved yaml parsing performance ([#85458](https://github.com/kubernetes/kubernetes/pull/85458), [@cjcullen](https://github.com/cjcullen))
* Fixed a bug which could prevent a provider ID from ever being set for node if an error occurred determining the provider ID when the node was added. ([#87043](https://github.com/kubernetes/kubernetes/pull/87043), [@zjs](https://github.com/zjs))
* fix a regression in kubenet that prevent pods to obtain ip addresses ([#85993](https://github.com/kubernetes/kubernetes/pull/85993), [@chendotjs](https://github.com/chendotjs))
* Bind kube-dns containers to linux nodes to avoid Windows scheduling ([#83358](https://github.com/kubernetes/kubernetes/pull/83358), [@wawa0210](https://github.com/wawa0210))
* The following features are unconditionally enabled and the corresponding `--feature-gates` flags have been removed: `PodPriority`, `TaintNodesByCondition`, `ResourceQuotaScopeSelectors` and `ScheduleDaemonSetPods` ([#86210](https://github.com/kubernetes/kubernetes/pull/86210), [@draveness](https://github.com/draveness))
* Bind dns-horizontal containers to linux nodes to avoid Windows scheduling on kubernetes cluster includes linux nodes and windows nodes ([#83364](https://github.com/kubernetes/kubernetes/pull/83364), [@wawa0210](https://github.com/wawa0210))
* fix kubectl annotate error when local=true is set ([#86952](https://github.com/kubernetes/kubernetes/pull/86952), [@zhouya0](https://github.com/zhouya0))
* Bug fixes: ([#84163](https://github.com/kubernetes/kubernetes/pull/84163), [@david-tigera](https://github.com/david-tigera))
    * Make sure we include latest packages node #351 ([@caseydavenport](https://github.com/caseydavenport))
* fix kuebctl apply set-last-applied namespaces error   ([#86474](https://github.com/kubernetes/kubernetes/pull/86474), [@zhouya0](https://github.com/zhouya0))
* Add VolumeBinder method to FrameworkHandle interface, which allows user to get the volume binder when implementing scheduler framework plugins. ([#86940](https://github.com/kubernetes/kubernetes/pull/86940), [@skilxn-go](https://github.com/skilxn-go))
* elasticsearch supports automatically setting the advertise address ([#85944](https://github.com/kubernetes/kubernetes/pull/85944), [@SataQiu](https://github.com/SataQiu))
* If a serving certificates param specifies a name that is an IP for an SNI certificate, it will have priority for replying to server connections. ([#85308](https://github.com/kubernetes/kubernetes/pull/85308), [@deads2k](https://github.com/deads2k))
* kube-proxy: Added dual-stack IPv4/IPv6 support to the iptables proxier. ([#82462](https://github.com/kubernetes/kubernetes/pull/82462), [@vllry](https://github.com/vllry))
* Azure VMSS/VMSSVM clients now suppress requests on throttling ([#86740](https://github.com/kubernetes/kubernetes/pull/86740), [@feiskyer](https://github.com/feiskyer))
* New metric kubelet_pleg_last_seen_seconds to aid diagnosis of PLEG not healthy issues. ([#86251](https://github.com/kubernetes/kubernetes/pull/86251), [@bboreham](https://github.com/bboreham))
* For subprotocol negotiation, both client and server protocol is required now. ([#86646](https://github.com/kubernetes/kubernetes/pull/86646), [@tedyu](https://github.com/tedyu))
* kubeadm: use bind-address option to configure the kube-controller-manager and kube-scheduler http probes ([#86493](https://github.com/kubernetes/kubernetes/pull/86493), [@aojea](https://github.com/aojea))
* Marked scheduler's metrics scheduling_algorithm_predicate_evaluation_seconds and ([#86584](https://github.com/kubernetes/kubernetes/pull/86584), [@xiaoanyunfei](https://github.com/xiaoanyunfei))
    * scheduling_algorithm_priority_evaluation_seconds as deprecated. Those are replaced by framework_extension_point_duration_seconds[extenstion_point="Filter"] and framework_extension_point_duration_seconds[extenstion_point="Score"] respectively.
* Marked scheduler's scheduling_duration_seconds Summary metric as deprecated ([#86586](https://github.com/kubernetes/kubernetes/pull/86586), [@xiaoanyunfei](https://github.com/xiaoanyunfei))
* Add instructions about how to bring up e2e test cluster ([#85836](https://github.com/kubernetes/kubernetes/pull/85836), [@YangLu1031](https://github.com/YangLu1031))
* If a required flag is not provided to a command, the user will only see the required flag error message, instead of the entire usage menu. ([#86693](https://github.com/kubernetes/kubernetes/pull/86693), [@sallyom](https://github.com/sallyom))
* kubeadm: tolerate whitespace when validating certificate authority PEM data in kubeconfig files ([#86705](https://github.com/kubernetes/kubernetes/pull/86705), [@neolit123](https://github.com/neolit123))
* kubeadm: add support for the "ci/k8s-master" version label as a replacement for "ci-cross/*", which no longer exists. ([#86609](https://github.com/kubernetes/kubernetes/pull/86609), [@Pensu](https://github.com/Pensu))
* Fix EndpointSlice controller race condition and ensure that it handles external changes to EndpointSlices. ([#85703](https://github.com/kubernetes/kubernetes/pull/85703), [@robscott](https://github.com/robscott))
* Fix nil pointer dereference in azure cloud provider ([#85975](https://github.com/kubernetes/kubernetes/pull/85975), [@ldx](https://github.com/ldx))
* fix: azure disk could not mounted on Standard_DC4s/DC2s instances ([#86612](https://github.com/kubernetes/kubernetes/pull/86612), [@andyzhangx](https://github.com/andyzhangx))
* Fixes v1.17.0 regression in --service-cluster-ip-range handling with IPv4 ranges larger than 65536 IP addresses ([#86534](https://github.com/kubernetes/kubernetes/pull/86534), [@liggitt](https://github.com/liggitt))
* Adds back support for AlwaysCheckAllPredicates flag. ([#86496](https://github.com/kubernetes/kubernetes/pull/86496), [@ahg-g](https://github.com/ahg-g))
* Azure global rate limit is switched to per-client. A set of new rate limit configure options are introduced, including routeRateLimit, SubnetsRateLimit, InterfaceRateLimit, RouteTableRateLimit, LoadBalancerRateLimit, PublicIPAddressRateLimit, SecurityGroupRateLimit, VirtualMachineRateLimit, StorageAccountRateLimit, DiskRateLimit, SnapshotRateLimit, VirtualMachineScaleSetRateLimit and VirtualMachineSizeRateLimit. ([#86515](https://github.com/kubernetes/kubernetes/pull/86515), [@feiskyer](https://github.com/feiskyer))
    * The original rate limit options would be default values for those new client's rate limiter.
* Fix issue [#85805](https://github.com/kubernetes/kubernetes/pull/85805) about resource not found in azure cloud provider when lb specified in other resource group. ([#86502](https://github.com/kubernetes/kubernetes/pull/86502), [@levimm](https://github.com/levimm))
* `AlwaysCheckAllPredicates` is deprecated in scheduler Policy API. ([#86369](https://github.com/kubernetes/kubernetes/pull/86369), [@Huang-Wei](https://github.com/Huang-Wei))
* Kubernetes KMS provider for data encryption now supports disabling the in-memory data encryption key (DEK) cache by setting cachesize to a negative value. ([#86294](https://github.com/kubernetes/kubernetes/pull/86294), [@enj](https://github.com/enj))
* option `preConfiguredBackendPoolLoadBalancerTypes` is added to azure cloud provider for the pre-configured load balancers, possible values: `""`, `"internal"`, "external"`, `"all"` ([#86338](https://github.com/kubernetes/kubernetes/pull/86338), [@gossion](https://github.com/gossion))
* Promote StartupProbe to beta for 1.18 release ([#83437](https://github.com/kubernetes/kubernetes/pull/83437), [@matthyx](https://github.com/matthyx))
* Fixes issue where AAD token obtained by kubectl is incompatible with on-behalf-of flow and oidc. ([#86412](https://github.com/kubernetes/kubernetes/pull/86412), [@weinong](https://github.com/weinong))
    * The audience claim before this fix has "spn:" prefix. After this fix, "spn:" prefix is omitted.
* change CounterVec to Counter about  PLEGDiscardEvent ([#86167](https://github.com/kubernetes/kubernetes/pull/86167), [@yiyang5055](https://github.com/yiyang5055))
* hollow-node do not use remote CRI anymore ([#86425](https://github.com/kubernetes/kubernetes/pull/86425), [@jkaniuk](https://github.com/jkaniuk))
* hollow-node use fake CRI ([#85879](https://github.com/kubernetes/kubernetes/pull/85879), [@gongguan](https://github.com/gongguan))



# v1.18.0-alpha.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.18.0-alpha.1


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes.tar.gz) | `0c4904efc7f4f1436119c91dc1b6c93b3bd9c7490362a394bff10099c18e1e7600c4f6e2fcbaeb2d342a36c4b20692715cf7aa8ada6dfac369f44cc9292529d7`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-src.tar.gz) | `0a50fc6816c730ca5ae4c4f26d5ad7b049607d29f6a782a4e5b4b05ac50e016486e269dafcc6a163bd15e1a192780a9a987f1bb959696993641c603ed1e841c8`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `c6d75f7f3f20bef17fc7564a619b54e6f4a673d041b7c9ec93663763a1cc8dd16aecd7a2af70e8d54825a0eecb9762cf2edfdade840604c9a32ecd9cc2d5ac3c`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `ca1f19db289933beace6daee6fc30af19b0e260634ef6e89f773464a05e24551c791be58b67da7a7e2a863e28b7cbcc7b24b6b9bf467113c26da76ac8f54fdb6`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `af2e673653eb39c3f24a54efc68e1055f9258bdf6cf8fea42faf42c05abefc2da853f42faac3b166c37e2a7533020b8993b98c0d6d80a5b66f39e91d8ae0a3fb`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `9009032c3f94ac8a78c1322a28e16644ce3b20989eb762685a1819148aed6e883ca8e1200e5ec37ec0853f115c67e09b5d697d6cf5d4c45f653788a2d3a2f84f`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `afba9595b37a3f2eead6e3418573f7ce093b55467dce4da0b8de860028576b96b837a2fd942f9c276e965da694e31fbd523eeb39aefb902d7e7a2f169344d271`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `04fc3b2fe3f271807f0bc6c61be52456f26a1af904964400be819b7914519edc72cbab9afab2bb2e2ba1a108963079367cedfb253c9364c0175d1fcc64d52f5c`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `04c7edab874b33175ff7bebfff5b3a032bc6eb088fcd7387ffcd5b3fa71395ca8c5f9427b7ddb496e92087dfdb09eaf14a46e9513071d3bd73df76c182922d38`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `499287dbbc33399a37b9f3b35e0124ff20b17b6619f25a207ee9c606ef261af61fa0c328dde18c7ce2d3dfb2eea2376623bc3425d16bc8515932a68b44f8bede`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `cf84aeddf00f126fb13c0436b116dd0464a625659e44c84bf863517db0406afb4eefd86807e7543c4f96006d275772fbf66214ae7d582db5865c84ac3545b3e6`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `69f20558ccd5cd6dbaccf29307210db4e687af21f6d71f68c69d3a39766862686ac1333ab8a5012010ca5c5e3c11676b45e498e3d4c38773da7d24bcefc46d95`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `3f29df2ce904a0f10db4c1d7a425a36f420867b595da3fa158ae430bfead90def2f2139f51425b349faa8a9303dcf20ea01657cb6ea28eb6ad64f5bb32ce2ed1`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `4a21073b2273d721fbf062c254840be5c8471a010bcc0c731b101729e36e61f637cb7fcb521a22e8d24808510242f4fff8a6ca40f10e9acd849c2a47bf135f27`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `7f1cb6d721bedc90e28b16f99bea7e59f5ad6267c31ef39c14d34db6ad6aad87ee51d2acdd01b6903307c1c00b58ff6b785a03d5a491cc3f8a4df9a1d76d406c`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `8f2b552030b5274b1c2c7c166eacd5a14b0c6ca0f23042f4c52efe87e22a167ba4460dcd66615a5ecd26d9e88336be1fb555548392e70efe59070dd2c314da98`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `8d9f2c96f66edafb7c8b3aa90960d29b41471743842aede6b47b3b2e61f4306fb6fc60b9ebc18820c547ee200bfedfe254c1cde962d447c791097dd30e79abdb`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `84194cb081d1502f8ca68143569f9707d96f1a28fcf0c574ebd203321463a8b605f67bb2a365eaffb14fbeb8d55c8d3fa17431780b242fb9cba3a14426a0cd4a`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `0091e108ab94fd8683b89c597c4fdc2fbf4920b007cfcd5297072c44bc3a230dfe5ceed16473e15c3e6cf5edab866d7004b53edab95be0400cc60e009eee0d9d`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `b7e85682cc2848a35d52fd6f01c247f039ee1b5dd03345713821ea10a7fa9939b944f91087baae95eaa0665d11857c1b81c454f720add077287b091f9f19e5d3`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `cd1f0849e9c62b5d2c93ff0cebf58843e178d8a88317f45f76de0db5ae020b8027e9503a5fccc96445184e0d77ecdf6f57787176ac31dbcbd01323cd0a190cbb`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `e1e697a34424c75d75415b613b81c8af5f64384226c5152d869f12fd7db1a3e25724975b73fa3d89e56e4bf78d5fd07e68a709ba8566f53691ba6a88addc79ea`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.18.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `c725a19a4013c74e22383ad3fb4cb799b3e161c4318fdad066daf806730a89bc3be3ff0f75678d02b3cbe52b2ef0c411c0639968e200b9df470be40bb2c015cc`

## Changelog since v1.17.0

### Action Required

* action required ([#85363](https://github.com/kubernetes/kubernetes/pull/85363), [@immutableT](https://github.com/immutableT))
    * 1. Currently, if users were to explicitly specify CacheSize of 0 for KMS provider, they would end-up with a provider that caches up to 1000 keys. This PR changes this behavior.
    * Post this PR, when users supply 0 for CacheSize this will result in a validation error.
    * 2. CacheSize type was changed from int32 to *int32. This allows defaulting logic to differentiate between cases where users explicitly supplied 0 vs. not supplied any value.
    * 3. KMS Provider's endpoint (path to Unix socket) is now validated when the EncryptionConfiguration files is loaded. This used to be handled by the GRPCService.

### Other notable changes

* fix: azure data disk should use same key as os disk by default ([#86351](https://github.com/kubernetes/kubernetes/pull/86351), [@andyzhangx](https://github.com/andyzhangx))
* New flag `--show-hidden-metrics-for-version` in kube-proxy can be used to show all hidden metrics that deprecated in the previous minor release. ([#85279](https://github.com/kubernetes/kubernetes/pull/85279), [@RainbowMango](https://github.com/RainbowMango))
* Remove cluster-monitoring addon ([#85512](https://github.com/kubernetes/kubernetes/pull/85512), [@serathius](https://github.com/serathius))
* Changed core_pattern on COS nodes to be an absolute path. ([#86329](https://github.com/kubernetes/kubernetes/pull/86329), [@mml](https://github.com/mml))
* Track mount operations as uncertain if operation fails with non-final error ([#82492](https://github.com/kubernetes/kubernetes/pull/82492), [@gnufied](https://github.com/gnufied))
* add kube-proxy flags --ipvs-tcp-timeout, --ipvs-tcpfin-timeout, --ipvs-udp-timeout to configure IPVS connection timeouts. ([#85517](https://github.com/kubernetes/kubernetes/pull/85517), [@andrewsykim](https://github.com/andrewsykim))
* The sample-apiserver aggregated conformance test has updated to use the Kubernetes v1.17.0 sample apiserver ([#84735](https://github.com/kubernetes/kubernetes/pull/84735), [@liggitt](https://github.com/liggitt))
* The underlying format of the `CPUManager` state file has changed. Upgrades should be seamless, but any third-party tools that rely on reading the previous format need to be updated. ([#84462](https://github.com/kubernetes/kubernetes/pull/84462), [@klueska](https://github.com/klueska))
* kubernetes will try to acquire the iptables lock every 100 msec during 5 seconds instead of every second. This specially useful for environments using kube-proxy in iptables mode with a high churn rate of services. ([#85771](https://github.com/kubernetes/kubernetes/pull/85771), [@aojea](https://github.com/aojea))
* Fixed a panic in the kubelet cleaning up pod volumes ([#86277](https://github.com/kubernetes/kubernetes/pull/86277), [@tedyu](https://github.com/tedyu))
* azure cloud provider cache TTL is configurable, list of the azure cloud provider is as following: ([#86266](https://github.com/kubernetes/kubernetes/pull/86266), [@zqingqing1](https://github.com/zqingqing1))
    * - "availabilitySetNodesCacheTTLInSeconds"
    * - "vmssCacheTTLInSeconds"
    * - "vmssVirtualMachinesCacheTTLInSeconds"
    * - "vmCacheTTLInSeconds"
    * - "loadBalancerCacheTTLInSeconds"
    * - "nsgCacheTTLInSeconds"
    * - "routeTableCacheTTLInSeconds"
* Fixes kube-proxy when EndpointSlice feature gate is enabled on Windows. ([#86016](https://github.com/kubernetes/kubernetes/pull/86016), [@robscott](https://github.com/robscott))
* Fixes wrong validation result of NetworkPolicy PolicyTypes ([#85747](https://github.com/kubernetes/kubernetes/pull/85747), [@tnqn](https://github.com/tnqn))
* Fixes an issue with kubelet-reported pod status on deleted/recreated pods. ([#86320](https://github.com/kubernetes/kubernetes/pull/86320), [@liggitt](https://github.com/liggitt))
* kube-apiserver no longer serves the following deprecated APIs: ([#85903](https://github.com/kubernetes/kubernetes/pull/85903), [@liggitt](https://github.com/liggitt))
        * All resources under `apps/v1beta1` and `apps/v1beta2` - use `apps/v1` instead
        * `daemonsets`, `deployments`, `replicasets` resources under `extensions/v1beta1` - use `apps/v1` instead
        * `networkpolicies` resources under `extensions/v1beta1` - use `networking.k8s.io/v1` instead
        * `podsecuritypolicies` resources under `extensions/v1beta1` - use `policy/v1beta1` instead
* kubeadm: fix potential panic when executing "kubeadm reset" with a corrupted kubelet.conf file ([#86216](https://github.com/kubernetes/kubernetes/pull/86216), [@neolit123](https://github.com/neolit123))
* Fix a bug in port-forward: named port not working with service ([#85511](https://github.com/kubernetes/kubernetes/pull/85511), [@oke-py](https://github.com/oke-py))
* kube-proxy no longer modifies shared EndpointSlices. ([#86092](https://github.com/kubernetes/kubernetes/pull/86092), [@robscott](https://github.com/robscott))
* allow for configuration of CoreDNS replica count ([#85837](https://github.com/kubernetes/kubernetes/pull/85837), [@pickledrick](https://github.com/pickledrick))
* Fixed a regression where the kubelet would fail to update the ready status of pods. ([#84951](https://github.com/kubernetes/kubernetes/pull/84951), [@tedyu](https://github.com/tedyu))
* Resolves performance regression in client-go discovery clients constructed using `NewDiscoveryClientForConfig` or `NewDiscoveryClientForConfigOrDie`. ([#86168](https://github.com/kubernetes/kubernetes/pull/86168), [@liggitt](https://github.com/liggitt))
* Make error message and service event message more clear ([#86078](https://github.com/kubernetes/kubernetes/pull/86078), [@feiskyer](https://github.com/feiskyer))
* e2e-test-framework: add e2e test namespace dump if all tests succeed but the cleanup fails. ([#85542](https://github.com/kubernetes/kubernetes/pull/85542), [@schrodit](https://github.com/schrodit))
* SafeSysctlWhitelist: add net.ipv4.ping_group_range ([#85463](https://github.com/kubernetes/kubernetes/pull/85463), [@AkihiroSuda](https://github.com/AkihiroSuda))
* kubelet: the metric process_start_time_seconds be marked as with the ALPHA stability level. ([#85446](https://github.com/kubernetes/kubernetes/pull/85446), [@RainbowMango](https://github.com/RainbowMango))
* API request throttling (due to a high rate of requests) is now reported in the kubelet (and other component) logs by default.  The messages are of the form ([#80649](https://github.com/kubernetes/kubernetes/pull/80649), [@RobertKrawitz](https://github.com/RobertKrawitz))
    * Throttling request took 1.50705208s, request: GET:<URL>
    * The presence of large numbers of these messages, particularly with long delay times, may indicate to the administrator the need to tune the cluster accordingly.
* Fix API Server potential memory leak issue in processing watch request. ([#85410](https://github.com/kubernetes/kubernetes/pull/85410), [@answer1991](https://github.com/answer1991))
* Verify kubelet & kube-proxy can recover after being killed on Windows nodes ([#84886](https://github.com/kubernetes/kubernetes/pull/84886), [@YangLu1031](https://github.com/YangLu1031))
* Fixed an issue that the scheduler only returns the first failure reason. ([#86022](https://github.com/kubernetes/kubernetes/pull/86022), [@Huang-Wei](https://github.com/Huang-Wei))
* kubectl/drain: add skip-wait-for-delete-timeout option. ([#85577](https://github.com/kubernetes/kubernetes/pull/85577), [@michaelgugino](https://github.com/michaelgugino))
    * If pod DeletionTimestamp older than N seconds, skip waiting for the pod.  Seconds must be greater than 0 to skip.
* Following metrics have been turned off: ([#83841](https://github.com/kubernetes/kubernetes/pull/83841), [@RainbowMango](https://github.com/RainbowMango))
    * - kubelet_pod_worker_latency_microseconds
    * - kubelet_pod_start_latency_microseconds
    * - kubelet_cgroup_manager_latency_microseconds
    * - kubelet_pod_worker_start_latency_microseconds
    * - kubelet_pleg_relist_latency_microseconds
    * - kubelet_pleg_relist_interval_microseconds
    * - kubelet_eviction_stats_age_microseconds
    * - kubelet_runtime_operations
    * - kubelet_runtime_operations_latency_microseconds
    * - kubelet_runtime_operations_errors
    * - kubelet_device_plugin_registration_count
    * - kubelet_device_plugin_alloc_latency_microseconds
    * - kubelet_docker_operations
    * - kubelet_docker_operations_latency_microseconds
    * - kubelet_docker_operations_errors
    * - kubelet_docker_operations_timeout
    * - network_plugin_operations_latency_microseconds
* - Renamed Kubelet metric certificate_manager_server_expiration_seconds to certificate_manager_server_ttl_seconds and changed to report the second until expiration at read time rather than absolute time of expiry. ([#85874](https://github.com/kubernetes/kubernetes/pull/85874), [@sambdavidson](https://github.com/sambdavidson))
    * - Improved accuracy of Kubelet metric rest_client_exec_plugin_ttl_seconds.
* Bind metadata-agent containers to linux nodes to avoid Windows scheduling on kubernetes cluster includes linux nodes and windows nodes ([#83363](https://github.com/kubernetes/kubernetes/pull/83363), [@wawa0210](https://github.com/wawa0210))
* Bind metrics-server containers to linux nodes to avoid Windows scheduling on kubernetes cluster includes linux nodes and windows nodes ([#83362](https://github.com/kubernetes/kubernetes/pull/83362), [@wawa0210](https://github.com/wawa0210))
* During initialization phase (preflight), kubeadm now verifies the presence of the conntrack executable ([#85857](https://github.com/kubernetes/kubernetes/pull/85857), [@hnanni](https://github.com/hnanni))
* VMSS cache is added so that less chances of VMSS GET throttling ([#85885](https://github.com/kubernetes/kubernetes/pull/85885), [@nilo19](https://github.com/nilo19))
* Update go-winio module version from 0.4.11 to 0.4.14 ([#85739](https://github.com/kubernetes/kubernetes/pull/85739), [@wawa0210](https://github.com/wawa0210))
* Fix LoadBalancer rule checking so that no unexpected LoadBalancer updates are made ([#85990](https://github.com/kubernetes/kubernetes/pull/85990), [@feiskyer](https://github.com/feiskyer))
* kubectl drain node --dry-run will list pods that would be evicted or deleted ([#82660](https://github.com/kubernetes/kubernetes/pull/82660), [@sallyom](https://github.com/sallyom))
* Windows nodes on GCE can use TPM-based authentication to the master. ([#85466](https://github.com/kubernetes/kubernetes/pull/85466), [@pjh](https://github.com/pjh))
* kubectl/drain: add disable-eviction option. ([#85571](https://github.com/kubernetes/kubernetes/pull/85571), [@michaelgugino](https://github.com/michaelgugino))
    * Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, and should be used with caution.
* kubeadm now errors out whenever a not supported component config version is supplied for the kubelet and kube-proxy ([#85639](https://github.com/kubernetes/kubernetes/pull/85639), [@rosti](https://github.com/rosti))
* Fixed issue with addon-resizer using deprecated extensions APIs ([#85793](https://github.com/kubernetes/kubernetes/pull/85793), [@bskiba](https://github.com/bskiba))
* Includes FSType when describing CSI persistent volumes. ([#85293](https://github.com/kubernetes/kubernetes/pull/85293), [@huffmanca](https://github.com/huffmanca))
* kubelet now exports a "server_expiration_renew_failure" and "client_expiration_renew_failure" metric counter if the certificate rotations cannot be performed. ([#84614](https://github.com/kubernetes/kubernetes/pull/84614), [@rphillips](https://github.com/rphillips))
* kubeadm: don't write the kubelet environment file on "upgrade apply" ([#85412](https://github.com/kubernetes/kubernetes/pull/85412), [@boluisa](https://github.com/boluisa))
* fix azure file AuthorizationFailure ([#85475](https://github.com/kubernetes/kubernetes/pull/85475), [@andyzhangx](https://github.com/andyzhangx))
* Resolved regression in admission, authentication, and authorization webhook performance in v1.17.0-rc.1 ([#85810](https://github.com/kubernetes/kubernetes/pull/85810), [@liggitt](https://github.com/liggitt))
* kubeadm: uses the apiserver AdvertiseAddress IP family to choose the etcd endpoint IP family for non external etcd clusters ([#85745](https://github.com/kubernetes/kubernetes/pull/85745), [@aojea](https://github.com/aojea))
* kubeadm: Forward cluster name to the controller-manager arguments ([#85817](https://github.com/kubernetes/kubernetes/pull/85817), [@ereslibre](https://github.com/ereslibre))
* Fixed "requested device X but found Y" attach error on AWS. ([#85675](https://github.com/kubernetes/kubernetes/pull/85675), [@jsafrane](https://github.com/jsafrane))
* addons: elasticsearch discovery supports IPv6 ([#85543](https://github.com/kubernetes/kubernetes/pull/85543), [@SataQiu](https://github.com/SataQiu))
* kubeadm: retry `kubeadm-config` ConfigMap creation or mutation if the apiserver is not responding. This will improve resiliency when joining new control plane nodes. ([#85763](https://github.com/kubernetes/kubernetes/pull/85763), [@ereslibre](https://github.com/ereslibre))
* Update Cluster Autoscaler to 1.17.0; changelog: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.17.0 ([#85610](https://github.com/kubernetes/kubernetes/pull/85610), [@losipiuk](https://github.com/losipiuk))
* Filter published OpenAPI schema by making nullable, required fields non-required in order to avoid kubectl to wrongly reject null values. ([#85722](https://github.com/kubernetes/kubernetes/pull/85722), [@sttts](https://github.com/sttts))
* kubectl set resources will no longer return an error if passed an empty change for a resource.  ([#85490](https://github.com/kubernetes/kubernetes/pull/85490), [@sallyom](https://github.com/sallyom))
    * kubectl set subject will no longer return an error if passed an empty change for a resource.
* kube-apiserver: fixed a conflict error encountered attempting to delete a pod with gracePeriodSeconds=0 and a resourceVersion precondition ([#85516](https://github.com/kubernetes/kubernetes/pull/85516), [@michaelgugino](https://github.com/michaelgugino))
* kubeadm: add a upgrade health check that deploys a Job ([#81319](https://github.com/kubernetes/kubernetes/pull/81319), [@neolit123](https://github.com/neolit123))
* kubeadm: make sure images are pre-pulled even if a tag did not change but their contents changed ([#85603](https://github.com/kubernetes/kubernetes/pull/85603), [@bart0sh](https://github.com/bart0sh))
* kube-apiserver: Fixes a bug that hidden metrics can not be enabled by the command-line option `--show-hidden-metrics-for-version`. ([#85444](https://github.com/kubernetes/kubernetes/pull/85444), [@RainbowMango](https://github.com/RainbowMango))
* kubeadm now supports automatic calculations of dual-stack node cidr masks to kube-controller-manager.  ([#85609](https://github.com/kubernetes/kubernetes/pull/85609), [@Arvinderpal](https://github.com/Arvinderpal))
* Fix bug where EndpointSlice controller would attempt to modify shared objects. ([#85368](https://github.com/kubernetes/kubernetes/pull/85368), [@robscott](https://github.com/robscott))
* Use context to check client closed instead of http.CloseNotifier in processing watch request which will reduce 1 goroutine for each request if proto is HTTP/2.x . ([#85408](https://github.com/kubernetes/kubernetes/pull/85408), [@answer1991](https://github.com/answer1991))
* kubeadm: reset raises warnings if it cannot delete folders ([#85265](https://github.com/kubernetes/kubernetes/pull/85265), [@SataQiu](https://github.com/SataQiu))
* Wait for kubelet & kube-proxy to be ready on Windows node within 10s ([#85228](https://github.com/kubernetes/kubernetes/pull/85228), [@YangLu1031](https://github.com/YangLu1031))

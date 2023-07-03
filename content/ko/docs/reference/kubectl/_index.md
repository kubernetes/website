---
title: 명령줄 도구 (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="쿠버네티스는 다음을 제공한다: " term_id="kubectl" length="short" >}}

이 툴의 이름은 `kubectl`이다.

구성을 위해, `kubectl` 은 config 파일을 $HOME/.kube 에서 찾는다.
KUBECONFIG 환경 변수를 설정하거나 [`--kubeconfig`](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
플래그를 설정하여 다른 [kubeconfig](/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
파일을 지정할 수 있다.

이 개요는 `kubectl` 구문을 다루고, 커맨드 동작을 설명하며, 일반적인 예제를 제공한다.
지원되는 모든 플래그 및 하위 명령을 포함한 각 명령에 대한 자세한 내용은
[kubectl](/docs/reference/generated/kubectl/kubectl-commands/) 참조 문서를 참고한다.

설치 방법에 대해서는 [kubectl 설치](/ko/docs/tasks/tools/)를 참고하고, 
빠른 가이드는 [치트 시트](/ko/docs/reference/kubectl/cheatsheet/)를 참고한다. `docker` 명령줄 도구에 익숙하다면, 
[도커 사용자를 위한 `kubectl`](/ko/docs/reference/kubectl/docker-cli-to-kubectl/)에서 대응되는 쿠버네티스 명령어를 볼 수 있다.

<!-- body -->

## 구문

터미널 창에서 `kubectl` 명령을 실행하려면 다음의 구문을 사용한다.

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

다음은 `command`, `TYPE`, `NAME` 과 `flags` 에 대한 설명이다.

* `command`: 하나 이상의 리소스에서 수행하려는 동작을 지정한다.
예: `create`, `get`, `describe`, `delete`

* `TYPE`: [리소스 타입](#리소스-타입)을 지정한다. 리소스 타입은 대소문자를 구분하지 않으며
  단수형, 복수형 또는 약어 형식을 지정할 수 있다.
  예를 들어, 다음의 명령은 동일한 출력 결과를 생성한다.

   ```shell
   kubectl get pod pod1
   kubectl get pods pod1
   kubectl get po pod1
   ```

* `NAME`: 리소스 이름을 지정한다. 이름은 대소문자를 구분한다. 이름을 생략하면, 모든 리소스에 대한 세부 사항이 표시된다. 예: `kubectl get pods`

   여러 리소스에 대한 작업을 수행할 때, 타입 및 이름별로 각 리소스를 지정하거나 하나 이상의 파일을 지정할 수 있다.

   * 타입 및 이름으로 리소스를 지정하려면 다음을 참고한다.

      * 리소스가 모두 동일한 타입인 경우 리소스를 그룹화하려면 다음을 사용한다. `TYPE1 name1 name2 name<#>`<br/>
      예: `kubectl get pod example-pod1 example-pod2`

      * 여러 리소스 타입을 개별적으로 지정하려면 다음을 사용한다. `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`<br/>
      예: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

   * 하나 이상의 파일로 리소스를 지정하려면 다음을 사용한다. `-f file1 -f file2 -f file<#>`

      * YAML이 특히 구성 파일에 대해 더 사용자 친화적이므로, [JSON 대신 YAML을 사용한다](/ko/docs/concepts/configuration/overview/#일반적인-구성-팁).<br/>
     예: `kubectl get -f ./pod.yaml`

* `flags`: 선택적 플래그를 지정한다. 예를 들어, `-s` 또는 `--server` 플래그를 사용하여 쿠버네티스 API 서버의 주소와 포트를 지정할 수 있다.<br/>

{{< caution >}}
커맨드 라인에서 지정하는 플래그는 기본값과 해당 환경 변수를 무시한다.
{{< /caution >}}

도움이 필요하다면, 터미널 창에서 `kubectl help` 를 실행한다.

## 클러스터 내 인증과 네임스페이스 오버라이드

기본적으로 `kubectl`은 먼저 자신이 파드 안에서 실행되고 있는지, 즉 클러스터 안에 있는지를 판별한다. 이를 위해 `KUBERNETES_SERVICE_HOST`와 `KUBERNETES_SERVICE_PORT` 환경 변수, 그리고 서비스 어카운트 토큰 파일이 `/var/run/secrets/kubernetes.io/serviceaccount/token` 경로에 있는지를 확인한다. 세 가지가 모두 감지되면, 클러스터 내 인증이 적용된다.

하위 호환성을 위해, 클러스터 내 인증 시에 `POD_NAMESPACE` 환경 변수가 설정되어 있으면, 서비스 어카운트 토큰의 기본 네임스페이스 설정을 오버라이드한다. 기본 네임스페이스 설정에 의존하는 모든 매니페스트와 도구가 영향을 받을 것이다.

**`POD_NAMESPACE` 환경 변수**

`POD_NAMESPACE` 환경 변수가 설정되어 있으면, 네임스페이스에 속하는 자원에 대한 CLI 작업은 환경 변수에 설정된 네임스페이스를 기본값으로 사용한다. 예를 들어, 환경 변수가 `seattle`로 설정되어 있으면, `kubectl get pods` 명령은 `seattle` 네임스페이스에 있는 파드 목록을 반환한다. 이는 파드가 네임스페이스에 속하는 자원이며, 명령어에 네임스페이스를 특정하지 않았기 때문이다. `kubectl api-resources` 명령을 실행하고 결과를 확인하여 특정 자원이 네임스페이스에 속하는 자원인지 판별한다.

명시적으로 `--namespace <value>` 인자를 사용하면 위와 같은 동작을 오버라이드한다.

**kubectl이 서비스어카운트 토큰을 관리하는 방법**

만약
* 쿠버네티스 서비스 어카운트 토큰 파일이 
  `/var/run/secrets/kubernetes.io/serviceaccount/token` 경로에 마운트되어 있고,
* `KUBERNETES_SERVICE_HOST` 환경 변수가 설정되어 있고,
* `KUBERNETES_SERVICE_PORT` 환경 변수가 설정되어 있고,
* kubectl 명령에 네임스페이스를 명시하지 않으면

kubectl은 자신이 클러스터 내부에서 실행되고 있다고 가정한다. 
kubectl은 해당 서비스어카운트의 네임스페이스(파드의 네임스페이스와 동일하다)를 인식하고 해당 네임스페이스에 대해 동작한다.
이는 클러스터 외부에서 실행되었을 때와는 다른데, 
kubectl이 클러스터 외부에서 실행되었으며 네임스페이스가 명시되지 않은 경우 
kubectl 명령어는 클라이언트 구성에서 현재 컨텍스트(current context)에
설정된 네임스페이스에 대해 동작한다.
kubectl이 동작하는 기본 네임스페이스를 변경하려면 아래의 명령어를 실행한다.

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## 명령어

다음 표에는 모든 `kubectl` 작업에 대한 간단한 설명과 일반적인 구문이 포함되어 있다.

명령어       | 구문    |       설명
-------------------- | -------------------- | --------------------
`alpha`    | `kubectl alpha SUBCOMMAND [flags]` | 쿠버네티스 클러스터에서 기본적으로 활성화되어 있지 않은 알파 기능의 사용할 수 있는 명령을 나열한다.
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 하나 이상의 리소스 어노테이션을 추가하거나 업데이트한다.
`api-resources`    | `kubectl api-resources [flags]` | 사용 가능한 API 리소스를 나열한다.
`api-versions`    | `kubectl api-versions [flags]` | 사용 가능한 API 버전을 나열한다.
`apply`            | `kubectl apply -f FILENAME [flags]`| 파일이나 표준입력(stdin)으로부터 리소스에 구성 변경 사항을 적용한다.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | 실행 중인 컨테이너에 연결하여 출력 스트림을 보거나 표준입력을 통해 컨테이너와 상호 작용한다.
`auth`    | `kubectl auth [flags] [options]` | 승인을 검사한다.
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | 레플리케이션 컨트롤러에서 관리하는 파드 집합을 자동으로 조정한다.
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | 인증서 리소스를 수정한다.
`cluster-info`    | `kubectl cluster-info [flags]` | 클러스터의 마스터와 서비스에 대한 엔드포인트 정보를 표시한다.
`completion`    | `kubectl completion SHELL [options]` | 지정된 셸(bash 또는 zsh)에 대한 셸 완성 코드를 출력한다.
`config`        | `kubectl config SUBCOMMAND [flags]` | kubeconfig 파일을 수정한다. 세부 사항은 개별 하위 명령을 참고한다.
`convert`    | `kubectl convert -f FILENAME [options]` | 다른 API 버전 간에 구성 파일을 변환한다. YAML 및 JSON 형식이 모두 허용된다. 참고 - `kubectl-convert` 플러그인을 설치해야 한다.
`cordon`    | `kubectl cordon NODE [options]` | 노드를 스케줄 불가능(unschedulable)으로 표시한다.
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | 컨테이너에서 그리고 컨테이너로 파일 및 디렉터리를 복사한다.
`create`        | `kubectl create -f FILENAME [flags]` | 파일이나 표준입력에서 하나 이상의 리소스를 생성한다.
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | 파일, 표준입력 또는 레이블 셀렉터, 이름, 리소스 셀렉터 또는 리소스를 지정하여 리소스를 삭제한다.
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | 하나 이상의 리소스의 자세한 상태를 표시한다.
`diff`        | `kubectl diff -f FILENAME [flags]`| 라이브 구성에 대해 파일이나 표준입력의 차이점을 출력한다.
`drain`    | `kubectl drain NODE [options]` | 유지 보수를 준비 중인 노드를 드레인한다.
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | 기본 편집기를 사용하여 서버에서 하나 이상의 리소스 정의를 편집하고 업데이트한다.
`events`      | `kubectl events` | List events
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | 파드의 컨테이너에 대해 명령을 실행한다.
`explain`    | `kubectl explain  [--recursive=false] [flags]` | 파드, 노드, 서비스 등의 다양한 리소스에 대한 문서를 출력한다.
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | 레플리케이션 컨트롤러, 서비스 또는 파드를 새로운 쿠버네티스 서비스로 노출한다.
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | 하나 이상의 리소스를 나열한다.
`kustomize`    | `kubectl kustomize <dir> [flags] [options]` | kustomization.yaml 파일의 지시 사항에서 생성된 API 리소스 집합을 나열한다. 인수는 파일을 포함하는 디렉터리의 경로이거나, 리포지터리 루트와 관련하여 경로 접미사가 동일한 git 리포지터리 URL이어야 한다.
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 하나 이상의 리소스 레이블을 추가하거나 업데이트한다.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | 파드의 컨테이너에 대한 로그를 출력한다.
`options`    | `kubectl options` | 모든 명령에 적용되는 전역 커맨드 라인 옵션을 나열한다.
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | 전략적 병합 패치 프로세스를 사용하여 리소스의 하나 이상의 필드를 업데이트한다.
`plugin`    | `kubectl plugin [flags] [options]` | 플러그인과 상호 작용하기 위한 유틸리티를 제공한다.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | 하나 이상의 로컬 포트를 파드로 전달한다.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | 쿠버네티스 API 서버에 프록시를 실행한다.
`replace`        | `kubectl replace -f FILENAME` | 파일 또는 표준입력에서 리소스를 교체한다.
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | 리소스의 롤아웃을 관리한다. 유효한 리소스 타입에는 디플로이먼트(deployment), 데몬셋(daemonset)과 스테이트풀셋(statefulset)이 포함된다.
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | 클러스터에서 지정된 이미지를 실행한다.
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | 지정된 레플리케이션 컨트롤러의 크기를 업데이트한다.
`set`    | `kubectl set SUBCOMMAND [options]` | 애플리케이션 리소스를 구성한다.
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | 하나 이상의 노드에서 테인트(taint)를 업데이트한다.
`top`    | `kubectl top [flags] [options]` | 리소스(CPU/메모리/스토리지) 사용량을 표시한다.
`uncordon`    | `kubectl uncordon NODE [options]` | 노드를 스케줄 가능(schedulable)으로 표시한다.
`version`        | `kubectl version [--client] [flags]` | 클라이언트와 서버에서 실행 중인 쿠버네티스 버전을 표시한다.
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | 실험(experimental) 기능: 하나 이상의 리소스에서 특정 조건을 기다린다.

명령 동작에 대한 자세한 내용을 배우려면 [kubectl](/ko/docs/reference/kubectl/kubectl/) 참조 문서를 참고한다.

## 리소스 타입

다음 표에는 지원되는 모든 리소스 타입과 해당 약어가 나열되어 있다.

(이 출력은 `kubectl api-resources` 에서 확인할 수 있으며, 쿠버네티스 1.25.0 에서의 출력을 기준으로 한다.)

| NAME | SHORTNAMES | APIVERSION | NAMESPACED | KIND |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## 출력 옵션

특정 명령의 출력을 서식화하거나 정렬하는 방법에 대한 정보는 다음 섹션을 참고한다. 다양한 출력 옵션을 지원하는 명령에 대한 자세한 내용은 [kubectl](/ko/docs/reference/kubectl/kubectl/) 참조 문서를 참고한다.

### 출력 서식화

모든 `kubectl` 명령의 기본 출력 형식은 사람이 읽을 수 있는 일반 텍스트 형식이다. 특정 형식으로 터미널 창에 세부 정보를 출력하려면, 지원되는 `kubectl` 명령에 `-o` 또는 `--output` 플래그를 추가할 수 있다.

#### 구문

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

`kubectl` 명령에 따라, 다음과 같은 출력 형식이 지원된다.

출력 형식 | 설명
--------------| -----------
`-o custom-columns=<spec>` | 쉼표로 구분된 [사용자 정의 열](#custom-columns) 목록을 사용하여 테이블을 출력한다.
`-o custom-columns-file=<filename>` | `<filename>` 파일에서 [사용자 정의 열](#custom-columns) 템플릿을 사용하여 테이블을 출력한다.
`-o json`     | JSON 형식의 API 오브젝트를 출력한다.
`-o jsonpath=<template>` | [jsonpath](/ko/docs/reference/kubectl/jsonpath/) 표현식에 정의된 필드를 출력한다.
`-o jsonpath-file=<filename>` | `<filename>` 파일에서 [jsonpath](/ko/docs/reference/kubectl/jsonpath/) 표현식으로 정의된 필드를 출력한다.
`-o name`     | 리소스 이름만 출력한다.
`-o wide`     | 추가 정보가 포함된 일반 텍스트 형식으로 출력된다. 파드의 경우, 노드 이름이 포함된다.
`-o yaml`     | YAML 형식의 API 오브젝트를 출력한다.

##### 예제

이 예제에서, 다음의 명령은 단일 파드에 대한 세부 정보를 YAML 형식의 오브젝트로 출력한다.

```shell
kubectl get pod web-pod-13je7 -o yaml
```

기억하기: 각 명령이 지원하는 출력 형식에 대한 자세한 내용은
[kubectl](/ko/docs/reference/kubectl/kubectl/) 참조 문서를 참고한다.

#### 사용자 정의 열 {#custom-columns}

사용자 정의 열을 정의하고 원하는 세부 정보만 테이블에 출력하려면, `custom-columns` 옵션을 사용할 수 있다.
사용자 정의 열을 인라인으로 정의하거나 템플릿 파일을 사용하도록 선택할 수 있다. `-o custom-columns=<spec>` 또는 `-o custom-columns-file=<filename>`

##### 예제

인라인:

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

템플릿 파일:

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

`template.txt` 파일에 포함된 내용은 다음과 같다.

```
NAME          RSRC
metadata.name metadata.resourceVersion
```
두 명령 중 하나를 실행한 결과는 다음과 비슷하다.

```
NAME           RSRC
submit-queue   610995
```

#### 서버측 열

`kubectl` 는 서버에서 오브젝트에 대한 특정 열 정보 수신을 지원한다.
이는 클라이언트가 출력할 수 있도록, 주어진 리소스에 대해 서버가 해당 리소스와 관련된 열과 행을 반환한다는 것을 의미한다.
이는 서버가 출력의 세부 사항을 캡슐화하도록 하여, 동일한 클러스터에 대해 사용된 클라이언트에서 사람이 읽을 수 있는 일관된 출력을 허용한다.

이 기능은 기본적으로 활성화되어 있다. 사용하지 않으려면,
`kubectl get` 명령에 `--server-print=false` 플래그를 추가한다.

##### 예제

파드 상태에 대한 정보를 출력하려면, 다음과 같은 명령을 사용한다.

```shell
kubectl get pods <pod-name> --server-print=false
```

출력 결과는 다음과 비슷하다.

```
NAME       AGE
pod-name   1m
```

### 오브젝트 목록 정렬

터미널 창에서 정렬된 목록으로 오브젝트를 출력하기 위해, 지원되는 `kubectl` 명령에 `--sort-by` 플래그를 추가할 수 있다. `--sort-by` 플래그와 함께 숫자나 문자열 필드를 지정하여 오브젝트를 정렬한다. 필드를 지정하려면, [jsonpath](/ko/docs/reference/kubectl/jsonpath/) 표현식을 사용한다.

#### 구문

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### 예제

이름별로 정렬된 파드 목록을 출력하려면, 다음을 실행한다.

```shell
kubectl get pods --sort-by=.metadata.name
```

## 예제: 일반적인 작업

다음 예제 세트를 사용하여 일반적으로 사용되는 `kubectl` 조작 실행에 익숙해진다.

`kubectl apply` - 파일 또는 표준입력에서 리소스를 적용하거나 업데이트한다.

```shell
# example-service.yaml의 정의를 사용하여 서비스를 생성한다.
kubectl apply -f example-service.yaml

# example-controller.yaml의 정의를 사용하여 레플리케이션 컨트롤러를 생성한다.
kubectl apply -f example-controller.yaml

# <directory> 디렉터리 내의 .yaml, .yml 또는 .json 파일에 정의된 오브젝트를 생성한다.
kubectl apply -f <directory>
```

`kubectl get` - 하나 이상의 리소스를 나열한다.

```shell
# 모든 파드를 일반 텍스트 출력 형식으로 나열한다.
kubectl get pods

# 모든 파드를 일반 텍스트 출력 형식으로 나열하고 추가 정보(예: 노드 이름)를 포함한다.
kubectl get pods -o wide

# 지정된 이름의 레플리케이션 컨트롤러를 일반 텍스트 출력 형식으로 나열한다. 팁: 'replicationcontroller' 리소스 타입을 'rc'로 짧게 바꿔쓸 수 있다.
kubectl get replicationcontroller <rc-name>

# 모든 레플리케이션 컨트롤러와 서비스를 일반 텍스트 출력 형식으로 함께 나열한다.
kubectl get rc,services

# 모든 데몬 셋을 일반 텍스트 출력 형식으로 나열한다.
kubectl get ds

# 노드 server01에서 실행 중인 모든 파드를 나열한다.
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - 초기화되지 않은 리소스를 포함하여 하나 이상의 리소스의 기본 상태를 디폴트로 표시한다.

```shell
# 노드 이름이 <node-name>인 노드의 세부 사항을 표시한다.
kubectl describe nodes <node-name>

# 파드 이름이 <pod-name> 인 파드의 세부 정보를 표시한다.
kubectl describe pods/<pod-name>

# 이름이 <rc-name>인 레플리케이션 컨트롤러가 관리하는 모든 파드의 세부 정보를 표시한다.
# 기억하기: 레플리케이션 컨트롤러에서 생성된 모든 파드에는 레플리케이션 컨트롤러 이름이 접두사로 붙는다.
kubectl describe pods <rc-name>

# 모든 파드의 정보를 출력한다.
kubectl describe pods
```

{{< note >}}
`kubectl get` 명령은 일반적으로 동일한 리소스 타입의 하나 이상의
리소스를 검색하는 데 사용된다. 예를 들어, `-o` 또는 `--output` 플래그를
사용하여 출력 형식을 사용자 정의할 수 있는 풍부한 플래그 세트가 있다.
`-w` 또는 `--watch` 플래그를 지정하여 특정 오브젝트에 대한 업데이트 진행과정을 확인할 수
있다. `kubectl describe` 명령은 지정된 리소스의 여러 관련 측면을
설명하는 데 더 중점을 둔다. API 서버에 대한 여러 API 호출을 호출하여
사용자에 대한 뷰(view)를 빌드할 수 있다. 예를 들어, `kubectl describe node`
명령은 노드에 대한 정보뿐만 아니라, 노드에서 실행 중인 파드의 요약 정보, 노드에 대해 생성된 이벤트 등의
정보도 검색한다.
{{< /note >}}

`kubectl delete` - 파일, 표준입력 또는 레이블 선택기, 이름, 리소스 선택기나 리소스를 지정하여 리소스를 삭제한다.

```shell
# pod.yaml 파일에 지정된 타입과 이름을 사용하여 파드를 삭제한다.
kubectl delete -f pod.yaml

# '<label-key>=<label-value>' 레이블이 있는 모든 파드와 서비스를 삭제한다.
kubectl delete pods,services -l <label-key>=<label-value>

# 초기화되지 않은 파드를 포함한 모든 파드를 삭제한다.
kubectl delete pods --all
```

`kubectl exec` - 파드의 컨테이너에 대해 명령을 실행한다.

```shell
# 파드 <pod-name>에서 'date'를 실행한 결과를 얻는다. 기본적으로, 첫 번째 컨테이너에서 출력된다.
kubectl exec <pod-name> -- date

# 파드 <pod-name>의 <container-name> 컨테이너에서 'date'를 실행하여 출력 결과를 얻는다.
kubectl exec <pod-name> -c <container-name> -- date

# 파드 <pod-name>에서 대화식 TTY를 연결해 /bin/bash를 실행한다. 기본적으로, 첫 번째 컨테이너에서 출력된다.
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` - 파드의 컨테이너에 대한 로그를 출력한다.

```shell
# 파드 <pod-name>에서 로그의 스냅샷을 반환한다.
kubectl logs <pod-name>

# 파드 <pod-name>에서 로그 스트리밍을 시작한다. 이것은 리눅스 명령 'tail -f'와 비슷하다.
kubectl logs -f <pod-name>
```

`kubectl diff` - 제안된 클러스터 업데이트의 차이점을 본다.

```shell
# "pod.json"에 포함된 리소스의 차이점을 출력한다.
kubectl diff -f pod.json

# 표준입력에서 파일을 읽어 차이점을 출력한다.
cat service.yaml | kubectl diff -f -
```

## 예제: 플러그인 작성 및 사용

`kubectl` 플러그인 작성과 사용에 익숙해지려면 다음의 예제 세트를 사용한다.

```shell
# 어떤 언어로든 간단한 플러그인을 만들고 "kubectl-" 접두사로
# 시작하도록 실행 파일의 이름을 지정한다.
cat ./kubectl-hello
```
```shell
#!/bin/sh

# 이 플러그인은 "hello world"라는 단어를 출력한다
echo "hello world"
```
작성한 플러그인을 실행 가능하게 한다
```bash
chmod a+x ./kubectl-hello

# 그리고 PATH의 위치로 옮긴다
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# 이제 kubectl 플러그인을 만들고 "설치했다".
# kubectl에서 플러그인을 일반 명령처럼 호출하여 플러그인을 사용할 수 있다
kubectl hello
```
```
hello world
```

```shell
# 플러그인을 배치한 $PATH의 폴더에서 플러그인을 삭제하여,
# 플러그인을 "제거"할 수 있다
sudo rm /usr/local/bin/kubectl-hello
```

`kubectl` 에 사용할 수 있는 모든 플러그인을 보려면,
`kubectl plugin list` 하위 명령을 사용한다.

```shell
kubectl plugin list
```
출력 결과는 다음과 비슷하다.
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

`kubectl plugin list` 는 또한 실행 가능하지 않거나,
다른 플러그인에 의해 차단된 플러그인에 대해 경고한다. 예를 들면 다음과 같다.
```shell
sudo chmod -x /usr/local/bin/kubectl-foo # 실행 권한 제거
kubectl plugin list
```
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

플러그인은 기존 kubectl 명령 위에 보다 복잡한 기능을
구축하는 수단으로 생각할 수 있다.

```shell
cat ./kubectl-whoami
```
다음 몇 가지 예는 이미 `kubectl-whoami` 에
다음 내용이 있다고 가정한다.
```shell
#!/bin/bash

# 이 플러그인은 현재 선택된 컨텍스트를 기반으로 현재 사용자에 대한
# 정보를 출력하기 위해 'kubectl config' 명령을 사용한다.
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

위의 플러그인을 실행하면 KUBECONFIG 파일에서 현재의 컨텍스트에 대한
사용자가 포함된 출력이 제공된다.

```shell
# 파일을 실행 가능하게 한다
sudo chmod +x ./kubectl-whoami

# 그리고 PATH로 옮긴다
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}}

* `kubectl` 레퍼런스 문서를 읽는다.
  * kubectl [명령어 레퍼런스](/ko/docs/reference/kubectl/kubectl/)
  * [명령줄 인자](/docs/reference/generated/kubectl/kubectl-commands/) 레퍼런스
* [`kubectl` 사용 규칙](/ko/docs/reference/kubectl/conventions/)에 대해 알아본다.
* kubectl의 [JSONPath 지원](/ko/docs/reference/kubectl/jsonpath/)에 대해 알아본다.
* [플러그인으로 kubectl 확장](/ko/docs/tasks/extend-kubectl/kubectl-plugins/)에 대해 알아본다.
  * 플러그인에 대해 좀 더 알아보려면, [예시 CLI 플러그인](https://github.com/kubernetes/sample-cli-plugin)을 살펴본다.

---
title: Admission Controllersを使う
content_type: concept
weight: 30
---

<!-- overview -->
このページでは、Admission Controllersの概要について説明します。


<!-- body -->
## Admission Controllersとは

Admission controllersとは、オブジェクトの永続化に先立ち、リクエストが認証・認可された後に、Kubernetes APIサーバーへのリクエストを傍受するコードのことです。

Admission controllersは、以下の[リスト](#what-does-each-admission-controller-do)で構成されています。これらのコントローラは、`kube-apiserver`バイナリにコンパイルされ、クラスタ管理者のみが設定することができます。

そのリストの中に、2つの特別なコントローラがあります:
「MutatingAdmissionWebhook」と「ValidatingAdmissionWebhook」です。

これらはAPIで設定された「Mutating」と「Validating」それぞれの[admission control webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)を実行します。

Admission controllersは「Mutating」、「Validating」、またはその両方を行います。
承認したオブジェクトを、Mutating controllersは変更でき、Validating controllersは変更できません。

Admission controllersはオブジェクト作成、削除、変更、プロキシへの接続などのリクエストを制限し、オブジェクト参照のリクエストを制限しません。

Admission controllersは2つのフェーズで進行する。
第1フェーズでは，Mutating controllersが実行される。
第2フェーズでは，Validating controllersが実行される。
また，いくつかのコントローラは両方ともであることに注意してください。

いずれかのフェーズのコントローラがリクエストを拒否した場合、リクエスト全体が直ちに拒否され、エンドユーザーにエラーが返されます。

最後に、問題のオブジェクトを時々変更することに加えて、Admission controllersは時々副作用を持つかもしれない、つまり、リクエスト処理の一部として関連リソースを変更する。

クォータ使用量の増加は、関連リソースの変更が必要な理由の典型的な例です。
指定されたAdmission controllersは、与えられたリクエストが他のすべてのAdmission controllersを通過することを確実には知らないので、そのような副作用には、対応する回収または調整のプロセスが必要です。

## なぜAdmission Controllersが必要ですか？

Kubernetesの高度な機能の多くは、その機能を適切にサポートするためにAdmission Controllersを有効にする必要があります。
その結果、適切なAdmission Controllersのセットで適切に構成されていないKubernetes APIサーバーは不完全なサーバーであり、期待する機能をすべてサポートすることはできません。

## どのようにAdmission Controllersを有効にしますか？

Kubernetes APIのサーバーフラグである`enable-admission-plugins`には、クラスタ内のオブジェクトを変更する前に起動するAdmission Controllersプラグインのコンマ区切りのリストを指定します。
例えば、次のコマンドラインは、`NamespaceLifecycle`と`LimitRanger`のAdmission Controllersプラグインを有効にします。


```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
Kubernetesクラスターの展開方法やAPIサーバーの起動方法によっては、異なる方法で設定を適用する必要があります。

例えば、APIサーバーがsystemdのサービスとしてデプロイされている場合はsystemdのユニットファイルを変更する必要があるかもしれません。Kubernetesがセルフホスト方式でデプロイされている場合はAPIサーバーのマニフェストファイルを修正する必要があるかもしれません。
{{< /note >}}

## どのようにAdmission Controllersを無効にしますか？

Kubernetes APIサーバーフラグの`disable-admission-plugins`は、デフォルトで有効化されているプラグインのリストに含まれていても、無効化するAdmission Controllersプラグインのコンマ区切りのリストを受け取ります。

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

## デフォルトで有効なプラグインはなんですか？

どのAdmission Controllersプラグインが有効になっているかを確認するには:

```shell
kube-apiserver -h | grep enable-admission-plugins
```

現在のバージョンでは、デフォルトのものは:

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook
```

## 各Admission Controllerの役割はなんですか？

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

このAdmission Controllerは、すべてのポッドをクラスターに入れることができます。
その動作はAdmission Controllerが全くない場合と同じであるため非推奨です。

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

すべての要求を拒否します。
AlwaysDenyは、実際には意味を持たないため、廃止されました。

### AlwaysPullImages {#alwayspullimages}

このAdmission Controllerは、すべての新しいPodを修正して、イメージ・プル・ポリシーをAlwaysに強制します。
これは、マルチテナントクラスターにおいて、ユーザーが自分のプライベートイメージを、それを引き出すための資格を持っている人だけが使用できることを保証するために有用です。

このAdmission Controllerがないと、イメージがノードに引き込まれると、どのユーザーのどのポッドでも、イメージの名前を知るだけで（ポッドが正しいノードにスケジューリングされていると仮定して）、イメージに対する認証チェックなしに、そのイメージを使用することができます。

このAdmission Controllerーを有効にすると、コンテナを起動する前に必ずイメージがプルされるため、有効な認証情報が必要になります。

### CertificateApproval {#certificateapproval}

このAdmission Controllerは、CertificateSigningRequestリソースを承認するリクエストを監視し、承認するユーザがCertificateSigningRequestリソース上で要求された`spec.signerName`を持つ証明書リクエストを`approve`する権限を持っていることを確認するために、追加の認可チェックを行う。

CertificateSigningRequestリソース上で異なるアクションを実行するために必要なパーミッションの詳細については、[Certificate Signing Requests](/docs/reference/access-authn-authz/certificat-signing-requests/)を参照してください。

### CertificateSigning {#certificatesigning}

このアドミッション・コントローラは、CertificateSigningRequestリソースの`status.certificate`フィールドの更新を観察し
リソースの`status.certificate`フィールドの更新を監視し、署名ユーザが CertificateSigningRequest リソースで要求された`spec.signerName`を持つ証明書リクエストに`sign`する権限を持っていることを確認するために追加の認可チェックを行います。

証明書署名要求の実行に必要な権限については、[Certificate Signing Requests](/docs/reference/access-authn-authz/certificat-signing-requests/)を参照してください。

### CertificateSubjectRestrictions {#certificatesubjectrestrictions}

このアドミッションコントローラは、`kubernetes io/kube-apiserver-client`の`spec.signerName`を持つCertificateSigningRequestリソースの作成を監視します。
`system:masters`の`group`(または`organization attribute`)を指定したリクエストはすべて拒否します。


### DefaultIngressClass {#defaultingressclass}

This admission controller observes creation of `Ingress` objects that do not request any specific
ingress class and automatically adds a default ingress class to them.  This way, users that do not
request any special ingress class do not need to care about them at all and they will get the
default one.

This admission controller does not do anything when no default ingress class is configured. When more than one ingress
class is marked as default, it rejects any creation of `Ingress` with an error and an administrator
must revisit their `IngressClass` objects and mark only one as default (with the annotation
"ingressclass.kubernetes.io/is-default-class").  This admission controller ignores any `Ingress`
updates; it acts only on creation.

See the [ingress](/docs/concepts/services-networking/ingress/) documentation for more about ingress
classes and how to mark one as default.

### DefaultStorageClass {#defaultstorageclass}

This admission controller observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do not need to care about them at all and they
will get the default one.

This admission controller does not do anything when no default storage class is configured. When more than one storage
class is marked as default, it rejects any creation of `PersistentVolumeClaim` with an error and an administrator
must revisit their `StorageClass` objects and mark only one as default.
This admission controller ignores any `PersistentVolumeClaim` updates; it acts only on creation.

See [persistent volume](/docs/concepts/storage/persistent-volumes/) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.

### DefaultTolerationSeconds {#defaulttolerationseconds}

This admission controller sets the default forgiveness toleration for pods to tolerate
the taints `notready:NoExecute` and `unreachable:NoExecute` based on the k8s-apiserver input parameters
`default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` if the pods don't already
have toleration for taints `node.kubernetes.io/not-ready:NoExecute` or
`node.kubernetes.io/unreachable:NoExecute`.
The default value for `default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` is 5 minutes.

### DenyEscalatingExec {#denyescalatingexec}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

This admission controller will deny exec and attach commands to pods that run with escalated privileges that
allow host access.  This includes pods that run as privileged, have access to the host IPC namespace, and
have access to the host PID namespace.

The DenyEscalatingExec admission plugin is deprecated.

Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.

### DenyExecOnPrivileged {#denyexeconprivileged}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

This admission controller will intercept all requests to exec a command in a pod if that pod has a privileged container.

This functionality has been merged into [DenyEscalatingExec](#denyescalatingexec).
The DenyExecOnPrivileged admission plugin is deprecated.

Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.

### DenyServiceExternalIPs

This admission controller rejects all net-new usage of the `Service` field `externalIPs`.  This
feature is very powerful (allows network traffic interception) and not well
controlled by policy.  When enabled, users of the cluster may not create new
Services which use `externalIPs` and may not add new values to `externalIPs` on
existing `Service` objects.  Existing uses of `externalIPs` are not affected,
and users may remove values from `externalIPs` on existing `Service` objects.

Most users do not need this feature at all, and cluster admins should consider disabling it.
Clusters that do need to use this feature should consider using some custom policy to manage usage
of it.

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

This admission controller mitigates the problem where the API server gets flooded by
event requests. The cluster admin can specify event rate limits by:

 * Enabling the `EventRateLimit` admission controller;
 * Referencing an `EventRateLimit` configuration file from the file provided to the API
   server's command line flag `--admission-control-config-file`:

{{< tabs name="eventratelimit_example" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: EventRateLimit
  path: eventconfig.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: EventRateLimit
  path: eventconfig.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

There are four types of limits that can be specified in the configuration:

 * `Server`: All event requests received by the API server share a single bucket.
 * `Namespace`: Each namespace has a dedicated bucket.
 * `User`: Each user is allocated a bucket.
 * `SourceAndObject`: A bucket is assigned by each combination of source and
   involved object of the event.

Below is a sample `eventconfig.yaml` for such a configuration:

```yaml
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
- type: Namespace
  qps: 50
  burst: 100
  cacheSize: 2000
- type: User
  qps: 10
  burst: 50
```

See the [EventRateLimit proposal](https://git.k8s.io/community/contributors/design-proposals/api-machinery/admission_control_event_rate_limit.md)
for more details.

### ExtendedResourceToleration {#extendedresourcetoleration}

This plug-in facilitates creation of dedicated nodes with extended resources.
If operators want to create dedicated nodes with extended resources (like GPUs, FPGAs etc.), they are expected to
[taint the node](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) with the extended resource
name as the key. This admission controller, if enabled, automatically
adds tolerations for such taints to pods requesting extended resources, so users don't have to manually
add these tolerations.

### ImagePolicyWebhook {#imagepolicywebhook}

The ImagePolicyWebhook admission controller allows a backend webhook to make admission decisions.

#### Configuration File Format

ImagePolicyWebhook uses a configuration file to set options for the behavior of the backend.
This file may be json or yaml and has the following format:

```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # time in s to cache approval
  allowTTL: 50
  # time in s to cache denial
  denyTTL: 50
  # time in ms to wait between retries
  retryBackoff: 500
  # determines behavior if the webhook backend fails
  defaultAllow: true
```

Reference the ImagePolicyWebhook configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:

{{< tabs name="imagepolicywebhook_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  path: imagepolicyconfig.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  path: imagepolicyconfig.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

Alternatively, you can embed the configuration directly in the file:

{{< tabs name="imagepolicywebhook_example2" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  configuration:
    imagePolicy:
      kubeConfigFile: <path-to-kubeconfig-file>
      allowTTL: 50
      denyTTL: 50
      retryBackoff: 500
      defaultAllow: true
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  configuration:
    imagePolicy:
      kubeConfigFile: <path-to-kubeconfig-file>
      allowTTL: 50
      denyTTL: 50
      retryBackoff: 500
      defaultAllow: true
```
{{% /tab %}}
{{< /tabs >}}

The ImagePolicyWebhook config file must reference a
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
formatted file which sets up the connection to the backend.
It is required that the backend communicate over TLS.

The kubeconfig file's cluster field must point to the remote service, and the user field must contain the returned authorizer.

```yaml
# clusters refers to the remote service.
clusters:
- name: name-of-remote-imagepolicy-service
  cluster:
    certificate-authority: /path/to/ca.pem    # CA for verifying the remote service.
    server: https://images.example.com/policy # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
- name: name-of-api-server
  user:
    client-certificate: /path/to/cert.pem # cert for the webhook admission controller to use
    client-key: /path/to/key.pem          # key matching the cert
```

For additional HTTP configuration, refer to the
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation.

#### Request Payloads

When faced with an admission decision, the API Server POSTs a JSON serialized `imagepolicy.k8s.io/v1alpha1` `ImageReview` object describing the action. This object contains fields describing the containers being admitted, as well as any pod annotations that match `*.image-policy.k8s.io/*`.

Note that webhook API objects are subject to the same versioning compatibility rules as other Kubernetes API objects. Implementers should be aware of looser compatibility promises for alpha objects and check the "apiVersion" field of the request to ensure correct deserialization. Additionally, the API Server must enable the imagepolicy.k8s.io/v1alpha1 API extensions group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).

An example request body:

```json
{
  "apiVersion":"imagepolicy.k8s.io/v1alpha1",
  "kind":"ImageReview",
  "spec":{
    "containers":[
      {
        "image":"myrepo/myimage:v1"
      },
      {
        "image":"myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations":{
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace":"mynamespace"
  }
}
```

The remote service is expected to fill the `ImageReviewStatus` field of the request and respond to either allow or disallow access. The response body's "spec" field is ignored and may be omitted. A permissive response would return:

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

To disallow access, the service would return:

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

For further documentation refer to the `imagepolicy.v1alpha1` API objects and `plugin/pkg/admission/imagepolicy/admission.go`.

#### Extending with Annotations

All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook. Sending annotations allows users who are aware of the image policy backend to send extra information to it, and for different backends implementations to accept different information.

Examples of information you might put here are:

 * request to "break glass" to override a policy, in case of emergency.
 * a ticket number from a ticket system that documents the break-glass request
 * provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup

In any case, the annotations are provided by the user and are not validated by Kubernetes in any way. In the future, if an annotation is determined to be widely useful, it may be promoted to a named field of `ImageReviewSpec`.

### LimitPodHardAntiAffinityTopology {#limitpodhardantiaffinitytopology}

This admission controller denies any pod that defines `AntiAffinity` topology key other than
`kubernetes.io/hostname` in `requiredDuringSchedulingRequiredDuringExecution`.

### LimitRanger {#limitranger}

This admission controller will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `LimitRange` object in a `Namespace`.  If you are using `LimitRange` objects in
your Kubernetes deployment, you MUST use this admission controller to enforce those constraints. LimitRanger can also
be used to apply default resource requests to Pods that don't specify any; currently, the default LimitRanger
applies a 0.1 CPU requirement to all Pods in the `default` namespace.

See the [limitRange design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)
and the [example of Limit Range](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) for more details.

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

This admission controller calls any mutating webhooks which match the request. Matching
webhooks are called in serial; each one may modify the object if it desires.

This admission controller (as implied by the name) only runs in the mutating phase.

If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or validating admission controllers will permit the request to finish.

If you disable the MutatingAdmissionWebhook, you must also disable the
`MutatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag (both are on by default in
versions >= 1.9).

#### Use caution when authoring and installing mutating webhooks

 * Users may be confused when the objects they try to create are different from
   what they get back.
 * Built in control loops may break when the objects they try to create are
   different when read back.
   * Setting originally unset fields is less likely to cause problems than
     overwriting fields set in the original request. Avoid doing the latter.
 * Future changes to control loops for built-in resources or third-party resources
   may break webhooks that work well today. Even when the webhook installation API
   is finalized, not all possible webhook behaviors will be guaranteed to be supported
   indefinitely.

### NamespaceAutoProvision {#namespaceautoprovision}

This admission controller examines all incoming requests on namespaced resources and checks
if the referenced namespace does exist.
It creates a namespace if it cannot be found.
This admission controller is useful in deployments that do not want to restrict creation of
a namespace prior to its usage.

### NamespaceExists {#namespaceexists}

This admission controller checks all requests on namespaced resources other than `Namespace` itself.
If the namespace referenced from a request doesn't exist, the request is rejected.

### NamespaceLifecycle {#namespacelifecycle}

This admission controller enforces that a `Namespace` that is undergoing termination cannot have new objects created in it,
and ensures that requests in a non-existent `Namespace` are rejected. This admission controller also prevents deletion of
three system reserved namespaces `default`, `kube-system`, `kube-public`.

A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services, etc.) in that
namespace.  In order to enforce integrity of that process, we strongly recommend running this admission controller.

### NodeRestriction {#noderestriction}

This admission controller limits the `Node` and `Pod` objects a kubelet can modify. In order to be limited by this admission controller,
kubelets must use credentials in the `system:nodes` group, with a username in the form `system:node:<nodeName>`.
Such kubelets will only be allowed to modify their own `Node` API object, and only modify `Pod` API objects that are bound to their node.
In Kubernetes 1.11+, kubelets are not allowed to update or remove taints from their `Node` API object.

In Kubernetes 1.13+, the `NodeRestriction` admission plugin prevents kubelets from deleting their `Node` API object,
and enforces kubelet modification of labels under the `kubernetes.io/` or `k8s.io/` prefixes as follows:

* **Prevents** kubelets from adding/removing/updating labels with a `node-restriction.kubernetes.io/` prefix.
This label prefix is reserved for administrators to label their `Node` objects for workload isolation purposes,
and kubelets will not be allowed to modify labels with that prefix.
* **Allows** kubelets to add/remove/update these labels and label prefixes:
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region` (deprecated)
  * `failure-domain.beta.kubernetes.io/zone` (deprecated)
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/`-prefixed labels
  * `node.kubernetes.io/`-prefixed labels

Use of any other labels under the `kubernetes.io` or `k8s.io` prefixes by kubelets is reserved, and may be disallowed or allowed by the `NodeRestriction` admission plugin in the future.

Future versions may add additional restrictions to ensure kubelets have the minimal set of permissions required to operate correctly.

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

This admission controller protects the access to the `metadata.ownerReferences` of an object
so that only users with "delete" permission to the object can change it.
This admission controller also protects the access to `metadata.ownerReferences[x].blockOwnerDeletion`
of an object, so that only users with "update" permission to the `finalizers`
subresource of the referenced *owner* can change it.

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

This admission controller implements additional validations for checking incoming `PersistentVolumeClaim` resize requests.

{{< note >}}
Support for volume resizing is available as an alpha feature. Admins must set the feature gate `ExpandPersistentVolumes`
to `true` to enable resizing.
{{< /note >}}

After enabling the `ExpandPersistentVolumes` feature gate, enabling the `PersistentVolumeClaimResize` admission
controller is recommended, too. This admission controller prevents resizing of all claims by default unless a claim's `StorageClass`
 explicitly enables resizing by setting `allowVolumeExpansion` to `true`.

For example: all `PersistentVolumeClaim`s created from the following `StorageClass` support volume expansion:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

For more information about persistent volume claims, see [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### PersistentVolumeLabel {#persistentvolumelabel}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

This admission controller automatically attaches region or zone labels to PersistentVolumes
as defined by the cloud provider (for example, GCE or AWS).
It helps ensure the Pods and the PersistentVolumes mounted are in the same
region and/or zone.
If the admission controller doesn't support automatic labelling your PersistentVolumes, you
may need to add the labels manually to prevent pods from mounting volumes from
a different zone. PersistentVolumeLabel is DEPRECATED and labeling persistent volumes has been taken over by
the {{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}.
Starting from 1.11, this admission controller is disabled by default.

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

This admission controller defaults and limits what node selectors may be used within a namespace by reading a namespace annotation and a global configuration.

#### Configuration File Format

`PodNodeSelector` uses a configuration file to set options for the behavior of the backend.
Note that the configuration file format will move to a versioned file in a future release.
This file may be json or yaml and has the following format:

```yaml
podNodeSelectorPluginConfig:
 clusterDefaultNodeSelector: name-of-node-selector
 namespace1: name-of-node-selector
 namespace2: name-of-node-selector
```

Reference the `PodNodeSelector` configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:

{{< tabs name="podnodeselector_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

#### Configuration Annotation Format
`PodNodeSelector` uses the annotation key `scheduler.alpha.kubernetes.io/node-selector` to assign node selectors to namespaces.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: name-of-node-selector
  name: namespace3
```

#### Internal Behavior
This admission controller has the following behavior:

1. If the `Namespace` has an annotation with a key `scheduler.alpha.kubernetes.io/node-selector`, use its value as the
node selector.
2. If the namespace lacks such an annotation, use the `clusterDefaultNodeSelector` defined in the `PodNodeSelector`
plugin configuration file as the node selector.
3. Evaluate the pod's node selector against the namespace node selector for conflicts. Conflicts result in rejection.
4. Evaluate the pod's node selector against the namespace-specific allowed selector defined the plugin configuration file.
Conflicts result in rejection.

{{< note >}}
PodNodeSelector allows forcing pods to run on specifically labeled nodes. Also see the PodTolerationRestriction
admission plugin, which allows preventing pods from running on specifically tainted nodes.
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

This is the replacement for the deprecated [PodSecurityPolicy](#podsecuritypolicy) admission controller
defined in the next section. This admission controller acts on creation and modification of the pod and
determines if it should be admitted based on the requested security context and the 
[Pod Security Standards](/docs/concepts/security/pod-security-standards/).

See the [Pod Security Admission documentation](/docs/concepts/security/pod-security-admission/)
for more information.

### PodSecurityPolicy {#podsecuritypolicy}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

This admission controller acts on creation and modification of the pod and determines if it should be admitted
based on the requested security context and the available Pod Security Policies.

See also [Pod Security Policy documentation](/docs/concepts/policy/pod-security-policy/)
for more information.

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

The PodTolerationRestriction admission controller verifies any conflict between tolerations of a pod and the tolerations of its namespace.
It rejects the pod request if there is a conflict.
It then merges the tolerations annotated on the namespace into the tolerations of the pod.
The resulting tolerations are checked against a list of allowed tolerations annotated to the namespace.
If the check succeeds, the pod request is admitted otherwise it is rejected.

If the namespace of the pod does not have any associated default tolerations or allowed
tolerations annotated, the cluster-level default tolerations or cluster-level list of allowed tolerations are used
instead if they are specified.

Tolerations to a namespace are assigned via the `scheduler.alpha.kubernetes.io/defaultTolerations` annotation key.
The list of allowed tolerations can be added via the `scheduler.alpha.kubernetes.io/tolerationsWhitelist` annotation key.

Example for namespace annotations:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

### Priority {#priority}

The priority admission controller uses the `priorityClassName` field and populates the integer value of the priority. If the priority class is not found, the Pod is rejected.

### ResourceQuota {#resourcequota}

This admission controller will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `ResourceQuota` object in a `Namespace`.  If you are using `ResourceQuota`
objects in your Kubernetes deployment, you MUST use this admission controller to enforce quota constraints.

See the [resourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) and the [example of Resource Quota](/docs/concepts/policy/resource-quotas/) for more details.

### RuntimeClass {#runtimeclass}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

If you enable the `PodOverhead` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/), and define a RuntimeClass with [Pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/) configured, this admission controller checks incoming
Pods. When enabled, this admission controller rejects any Pod create requests that have the overhead already set.
For Pods that have a  RuntimeClass is configured and selected in their `.spec`, this admission controller sets `.spec.overhead` in the Pod based on the value defined in the corresponding RuntimeClass.

{{< note >}}
The `.spec.overhead` field for Pod and the `.overhead` field for RuntimeClass are both in beta. If you do not enable the `PodOverhead` feature gate, all Pods are treated as if `.spec.overhead` is unset.
{{< /note >}}

See also [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
for more information.

### SecurityContextDeny {#securitycontextdeny}

This admission controller will deny any pod that attempts to set certain escalating
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
fields, as shown in the
[Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
task.
This should be enabled if a cluster doesn't utilize 
[pod security policies](/docs/concepts/policy/pod-security-policy/)
to restrict the set of values a security context can take.

### ServiceAccount {#serviceaccount}

This admission controller implements automation for
[serviceAccounts](/docs/tasks/configure-pod-container/configure-service-account/).
We strongly recommend using this admission controller if you intend to make use of Kubernetes `ServiceAccount` objects.

### StorageObjectInUseProtection

The `StorageObjectInUseProtection` plugin adds the `kubernetes.io/pvc-protection` or `kubernetes.io/pv-protection`
finalizers to newly created Persistent Volume Claims (PVCs) or Persistent Volumes (PV).
In case a user deletes a PVC or PV the PVC or PV is not removed until the finalizer is removed
from the PVC or PV by PVC or PV Protection Controller. 
Refer to the
[Storage Object in Use Protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
for more detailed information.

### TaintNodesByCondition {#taintnodesbycondition}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

This admission controller {{< glossary_tooltip text="taints" term_id="taint" >}} newly created Nodes as `NotReady` and `NoSchedule`. That tainting avoids a race condition that could cause Pods to be scheduled on new Nodes before their taints were updated to accurately reflect their reported conditions.

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

This admission controller calls any validating webhooks which match the request. Matching
webhooks are called in parallel; if any of them rejects the request, the request
fails. This admission controller only runs in the validation phase; the webhooks it calls may not
mutate the object, as opposed to the webhooks called by the `MutatingAdmissionWebhook` admission controller.

If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or other validating admission controllers will permit the request to finish.

If you disable the ValidatingAdmissionWebhook, you must also disable the
`ValidatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag (both are on by default in
versions 1.9 and later).


## 推奨されるAdmission Controllersのセットはありますか？

推奨されるAdmission Controllersは、デフォルトで有効になっているので（[こちら](/docs/reference/command-line-tools-reference/kube-apiserver/#options)に表示されています）、明示的に指定する必要はありません。また、`--enable-admission-plugins`フラグを使用して、デフォルトセット以外のAdmission Controllersを有効にすることができます（**順番は関係ありません**）。

{{< note >}}
`--admission-control` は1.10で非推奨となり、`--enable-admission-plugins`で置き換えられました。
{{< /note >}}

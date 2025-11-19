---
layout: blog
title: "在 CRI 運行時內驗證容器鏡像簽名"
date: 2023-06-29
slug: container-image-signature-verification
---
<!--
layout: blog
title: "Verifying Container Image Signatures Within CRI Runtimes"
date: 2023-06-29
slug: container-image-signature-verification
-->

<!--
**Author**: Sascha Grunert
-->
**作者:** Sascha Grunert

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The Kubernetes community has been signing their container image-based artifacts
since release v1.24. While the graduation of the [corresponding enhancement][kep]
from `alpha` to `beta` in v1.26 introduced signatures for the binary artifacts,
other projects followed the approach by providing image signatures for their
releases, too. This means that they either create the signatures within their
own CI/CD pipelines, for example by using GitHub actions, or rely on the
Kubernetes [image promotion][promo] process to automatically sign the images by
proposing pull requests to the [k/k8s.io][k8s.io] repository. A requirement for
using this process is that the project is part of the `kubernetes` or
`kubernetes-sigs` GitHub organization, so that they can utilize the community
infrastructure for pushing images into staging buckets.
-->
Kubernetes 社區自 v1.24 版本開始對基於容器鏡像的工件進行簽名。在 v1.26 中，
[相應的增強特性][kep]從 `alpha` 進階至 `beta`，引入了針對二進制工件的簽名。
其他項目也採用了類似的方法，爲其發佈版本提供鏡像簽名。這意味着這些項目要麼使用 GitHub actions
在自己的 CI/CD 流程中創建簽名，要麼依賴於 Kubernetes 的[鏡像推廣][promo]流程，
通過向 [k/k8s.io][k8s.io] 倉庫提交 PR 來自動簽名鏡像。
使用此流程的前提要求是項目必須屬於 `kubernetes` 或 `kubernetes-sigs` GitHub 組織，
這樣能夠利用社區基礎設施將鏡像推送到暫存桶中。

[kep]: https://github.com/kubernetes/enhancements/issues/3031
[promo]: https://github.com/kubernetes-sigs/promo-tools/blob/e2b96dd/docs/image-promotion.md
[k8s.io]: https://github.com/kubernetes/k8s.io/tree/4b95cc2/k8s.gcr.io

<!--
Assuming that a project now produces signed container image artifacts, how can
one actually verify the signatures? It is possible to do it manually like
outlined in the [official Kubernetes documentation][docs]. The problem with this
approach is that it involves no automation at all and should be only done for
testing purposes. In production environments, tools like the [sigstore
policy-controller][policy-controller] can help with the automation. These tools
provide a higher level API by using [Custom Resource Definitions (CRD)][crd] as
well as an integrated [admission controller and webhook][admission] to verify
the signatures.
-->
假設一個項目現在生成了已簽名的容器鏡像工件，那麼如何實際驗證這些簽名呢？
你可以按照 [Kubernetes 官方文檔][docs]所述來手動驗證。但是這種方式的問題在於完全沒有自動化，
應僅用於測試目的。在生產環境中，[sigstore policy-controller][policy-controller]
這樣的工具有助於進行自動化處理。這些工具使用[自定義資源定義（CRD）][crd]提供了更高級別的 API，
並且利用集成的[准入控制器和 Webhook][admission]來驗證簽名。

[docs]: /zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures
[policy-controller]: https://docs.sigstore.dev/policy-controller/overview
[crd]: /zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources
[admission]: /zh-cn/docs/reference/access-authn-authz/admission-controllers

<!--
The general usage flow for an admission controller based verification is:
-->
基於准入控制器的驗證的一般使用流程如下：

<!--
{{< figure src="/blog/2023/06/29/container-image-signature-verification/flow.svg" alt="Create an instance of the policy and annotate the namespace to validate the signatures. Then create the pod. The controller evaluates the policy and if it passes, then it does the image pull if necessary. If the policy evaluation fails, then it will not admit the pod." >}}
-->
{{< figure src="/zh-cn/blog/2023/06/29/container-image-signature-verification/flow.svg" alt="創建一個策略的實例，並對命名空間添加註解以驗證簽名。然後創建 Pod。控制器會評估策略，如果評估通過，則根據需要執行鏡像拉取。如果策略評估失敗，則不允許該 Pod 運行。" >}}

<!--
A key benefit of this architecture is simplicity: A single instance within the
cluster validates the signatures before any image pull can happen in the
container runtime on the nodes, which gets initiated by the kubelet. This
benefit also brings along the issue of separation: The node which should pull
the container image is not necessarily the same node that performs the admission. This
means that if the controller is compromised, then a cluster-wide policy
enforcement can no longer be possible.

One way to solve this issue is doing the policy evaluation directly within the
[Container Runtime Interface (CRI)][cri] compatible container runtime. The
runtime is directly connected to the [kubelet][kubelet] on a node and does all
the tasks like pulling images. [CRI-O][cri-o] is one of those available runtimes
and will feature full support for container image signature verification in v1.28.
-->
這種架構的一個主要優點是簡單：集羣中的單個實例會先驗證簽名，然後纔在節點上的容器運行時中執行鏡像拉取操作，
鏡像拉取是由 kubelet 觸發的。這個優點也帶來了分離的問題：應拉取容器鏡像的節點不一定是執行准入控制的節點。
這意味着如果控制器受到攻擊，那麼無法在整個集羣範圍內強制執行策略。

解決此問題的一種方式是直接在與[容器運行時接口（CRI）][cri]兼容的容器運行時中進行策略評估。
這種運行時直接連接到節點上的 [kubelet][kubelet]，執行拉取鏡像等所有任務。
[CRI-O][cri-o] 是可用的運行時之一，將在 v1.28 中完全支持容器鏡像簽名驗證。

[cri]: /docs/concepts/architecture/cri
[kubelet]: /docs/reference/command-line-tools-reference/kubelet
[cri-o]: https://github.com/cri-o/cri-o

<!--
How does it work? CRI-O reads a file called [`policy.json`][policy.json], which
contains all the rules defined for container images. For example, you can define a
policy which only allows signed images `quay.io/crio/signed` for any tag or
digest like this:
-->
容器運行時是如何工作的呢？CRI-O 會讀取一個名爲 [`policy.json`][policy.json] 的文件，
其中包含了爲容器鏡像定義的所有規則。例如，你可以定義一個策略，
只允許帶有以下標記或摘要的已簽名鏡像 `quay.io/crio/signed`：

[policy.json]: https://github.com/containers/image/blob/b3e0ba2/docs/containers-policy.json.5.md#sigstoresigned

```json
{
  "default": [{ "type": "reject" }],
  "transports": {
    "docker": {
      "quay.io/crio/signed": [
        {
          "type": "sigstoreSigned",
          "signedIdentity": { "type": "matchRepository" },
          "fulcio": {
            "oidcIssuer": "https://github.com/login/oauth",
            "subjectEmail": "sgrunert@redhat.com",
            "caData": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI5ekNDQVh5Z0F3SUJBZ0lVQUxaTkFQRmR4SFB3amVEbG9Ed3lZQ2hBTy80d0NnWUlLb1pJemowRUF3TXcKS2pFVk1CTUdBMVVFQ2hNTWMybG5jM1J2Y21VdVpHVjJNUkV3RHdZRFZRUURFd2h6YVdkemRHOXlaVEFlRncweQpNVEV3TURjeE16VTJOVGxhRncwek1URXdNRFV4TXpVMk5UaGFNQ294RlRBVEJnTlZCQW9UREhOcFozTjBiM0psCkxtUmxkakVSTUE4R0ExVUVBeE1JYzJsbmMzUnZjbVV3ZGpBUUJnY3Foa2pPUFFJQkJnVXJnUVFBSWdOaUFBVDcKWGVGVDRyYjNQUUd3UzRJYWp0TGszL09sbnBnYW5nYUJjbFlwc1lCcjVpKzR5bkIwN2NlYjNMUDBPSU9aZHhleApYNjljNWlWdXlKUlErSHowNXlpK1VGM3VCV0FsSHBpUzVzaDArSDJHSEU3U1hyazFFQzVtMVRyMTlMOWdnOTJqCll6QmhNQTRHQTFVZER3RUIvd1FFQXdJQkJqQVBCZ05WSFJNQkFmOEVCVEFEQVFIL01CMEdBMVVkRGdRV0JCUlkKd0I1ZmtVV2xacWw2ekpDaGt5TFFLc1hGK2pBZkJnTlZIU01FR0RBV2dCUll3QjVma1VXbFpxbDZ6SkNoa3lMUQpLc1hGK2pBS0JnZ3Foa2pPUFFRREF3TnBBREJtQWpFQWoxbkhlWFpwKzEzTldCTmErRURzRFA4RzFXV2cxdENNCldQL1dIUHFwYVZvMGpoc3dlTkZaZ1NzMGVFN3dZSTRxQWpFQTJXQjlvdDk4c0lrb0YzdlpZZGQzL1Z0V0I1YjkKVE5NZWE3SXgvc3RKNVRmY0xMZUFCTEU0Qk5KT3NRNHZuQkhKCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0="
          },
          "rekorPublicKeyData": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFMkcyWSsydGFiZFRWNUJjR2lCSXgwYTlmQUZ3cgprQmJtTFNHdGtzNEwzcVg2eVlZMHp1ZkJuaEM4VXIvaXk1NUdoV1AvOUEvYlkyTGhDMzBNOStSWXR3PT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
        }
      ]
    }
  }
}
```

<!--
CRI-O has to be started to use that policy as the global source of truth:
-->
CRI-O 必須被啓動才能將策略用作全局的可信源：

```console
> sudo crio --log-level debug --signature-policy ./policy.json
```

<!--
CRI-O is now able to pull the image while verifying its signatures. This can be
done by using [`crictl` (cri-tools)][cri-tools], for example:
-->
CRI-O 現在可以在驗證鏡像簽名的同時拉取鏡像。例如，可以使用 [`crictl`（cri-tools）][cri-tools]
來完成此操作：

[cri-tools]: https://github.com/kubernetes-sigs/cri-tools

```console
> sudo crictl -D pull quay.io/crio/signed
DEBU[…] get image connection
DEBU[…] PullImageRequest: &PullImageRequest{Image:&ImageSpec{Image:quay.io/crio/signed,Annotations:map[string]string{},},Auth:nil,SandboxConfig:nil,}
DEBU[…] PullImageResponse: &PullImageResponse{ImageRef:quay.io/crio/signed@sha256:18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a,}
Image is up to date for quay.io/crio/signed@sha256:18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a
```

<!--
The CRI-O debug logs will also indicate that the signature got successfully
validated:
-->
CRI-O 的調試日誌也會表明簽名已成功驗證：

```console
DEBU[…] IsRunningImageAllowed for image docker:quay.io/crio/signed:latest
DEBU[…]  Using transport "docker" specific policy section quay.io/crio/signed
DEBU[…] Reading /var/lib/containers/sigstore/crio/signed@sha256=18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a/signature-1
DEBU[…] Looking for sigstore attachments in quay.io/crio/signed:sha256-18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a.sig
DEBU[…] GET https://quay.io/v2/crio/signed/manifests/sha256-18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a.sig
DEBU[…] Content-Type from manifest GET is "application/vnd.oci.image.manifest.v1+json"
DEBU[…] Found a sigstore attachment manifest with 1 layers
DEBU[…] Fetching sigstore attachment 1/1: sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…] Downloading /v2/crio/signed/blobs/sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…] GET https://quay.io/v2/crio/signed/blobs/sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…]  Requirement 0: allowed
DEBU[…] Overall: allowed
```

<!--
All of the defined fields like `oidcIssuer` and `subjectEmail` in the policy
have to match, while `fulcio.caData` and `rekorPublicKeyData` are the public
keys from the upstream [fulcio (OIDC PKI)][fulcio] and [rekor
(transparency log)][rekor] instances.
-->
策略中定義的 `oidcIssuer` 和 `subjectEmail` 等所有字段都必須匹配，
而 `fulcio.caData` 和 `rekorPublicKeyData` 是來自上游 [fulcio（OIDC PKI）][fulcio]
和 [rekor（透明日誌）][rekor] 實例的公鑰。

[fulcio]: https://github.com/sigstore/fulcio
[rekor]: https://github.com/sigstore/rekor

<!--
This means that if you now invalidate the `subjectEmail` of the policy, for example to
`wrong@mail.com`:
-->
這意味着如果你現在將策略中的 `subjectEmail` 作廢，例如更改爲 `wrong@mail.com`：

```console
> jq '.transports.docker."quay.io/crio/signed"[0].fulcio.subjectEmail = "wrong@mail.com"' policy.json > new-policy.json
> mv new-policy.json policy.json
```

<!--
Then remove the image, since it already exists locally:
-->
然後移除鏡像，因爲此鏡像已存在於本地：

```console
> sudo crictl rmi quay.io/crio/signed
```

<!--
Now when you pull the image, CRI-O complains that the required email is wrong:
-->
現在當你拉取鏡像時，CRI-O 將報錯所需的 email 是錯的：

```console
> sudo crictl pull quay.io/crio/signed
FATA[…] pulling image: rpc error: code = Unknown desc = Source image rejected: Required email wrong@mail.com not found (got []string{"sgrunert@redhat.com"})
```

<!--
It is also possible to test an unsigned image against the policy. For that you
have to modify the key `quay.io/crio/signed` to something like
`quay.io/crio/unsigned`:
-->
你還可以對未簽名的鏡像進行策略測試。爲此，你需要將鍵 `quay.io/crio/signed`
修改爲類似 `quay.io/crio/unsigned`：

```console
> sed -i 's;quay.io/crio/signed;quay.io/crio/unsigned;' policy.json
```

<!--
If you now pull the container image, CRI-O will complain that no signature exists
for it:
-->
如果你現在拉取容器鏡像，CRI-O 將報錯此鏡像不存在簽名：

```console
> sudo crictl pull quay.io/crio/unsigned
FATA[…] pulling image: rpc error: code = Unknown desc = SignatureValidationFailed: Source image rejected: A signature was required, but no signature exists
```

<!--
It is important to mention that CRI-O will match the
`.critical.identity.docker-reference` field within the signature to match with
the image repository. For example, if you verify the image
`registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.3`, then the corresponding
`docker-reference` should be `registry.k8s.io/kube-apiserver-amd64`:
-->
需要強調的是，CRI-O 將簽名中的 `.critical.identity.docker-reference` 字段與鏡像倉庫進行匹配。
例如，如果你要驗證鏡像 `registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.3`，
則相應的 `docker-reference` 須是 `registry.k8s.io/kube-apiserver-amd64`：

```console
> cosign verify registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.3 \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq -r '.[0].critical.identity."docker-reference"'
…

registry.k8s.io/kubernetes/kube-apiserver-amd64
```

<!--
The Kubernetes community introduced `registry.k8s.io` as proxy mirror for
various registries. Before the release of [kpromo v4.0.2][kpromo], images
had been signed with the actual mirror rather than `registry.k8s.io`:
-->
Kubernetes 社區引入了 `registry.k8s.io` 作爲各種鏡像倉庫的代理鏡像。
在 [kpromo v4.0.2][kpromo] 版本發佈之前，鏡像已使用實際鏡像簽名而不是使用
`registry.k8s.io` 簽名：

[kpromo]: https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.0.2

```console
> cosign verify registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.2 \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq -r '.[0].critical.identity."docker-reference"'
…

asia-northeast2-docker.pkg.dev/k8s-artifacts-prod/images/kubernetes/kube-apiserver-amd64
```

<!--
The change of the `docker-reference` to `registry.k8s.io` makes it easier for
end users to validate the signatures, because they cannot know anything about the
underlying infrastructure being used. The feature to set the identity on image
signing has been added to [cosign][cosign-pr] via the flag `sign
--sign-container-identity` as well and will be part of its upcoming release.
-->
將 `docker-reference` 更改爲 `registry.k8s.io` 使最終用戶更容易驗證簽名，
因爲他們不需要知道所使用的底層基礎設施的詳細信息。設置鏡像簽名身份的特性已通過
`sign --sign-container-identity` 標誌添加到 `cosign`，並將成爲即將發佈的版本的一部分。

[cosign-pr]: https://github.com/sigstore/cosign/pull/2984

<!--
The Kubernetes image pull error code `SignatureValidationFailed` got [recently added to
Kubernetes][pr-117717] and will be available from v1.28. This error code allows
end-users to understand image pull failures directly from the kubectl CLI. For
example, if you run CRI-O together with Kubernetes using the policy which requires
`quay.io/crio/unsigned` to be signed, then a pod definition like this:
-->
[最近在 Kubernetes 中添加了][pr-117717]鏡像拉取錯誤碼 `SignatureValidationFailed`，
將從 v1.28 版本開始可用。這個錯誤碼允許最終用戶直接從 kubectl CLI 瞭解鏡像拉取失敗的原因。
例如，如果你使用要求對 `quay.io/crio/unsigned` 進行簽名的策略同時運行 CRI-O 和 Kubernetes，
那麼 Pod 的定義如下：

[pr-117717]: https://github.com/kubernetes/kubernetes/pull/117717

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: quay.io/crio/unsigned
```

<!--
Will cause the `SignatureValidationFailed` error when applying the pod manifest:
-->
將在應用 Pod 清單時造成 `SignatureValidationFailed` 錯誤：

```console
> kubectl apply -f pod.yaml
pod/pod created
```

```console
> kubectl get pods
NAME   READY   STATUS                      RESTARTS   AGE
pod    0/1     SignatureValidationFailed   0          4s
```

```console
> kubectl describe pod pod | tail -n8
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  58s                default-scheduler  Successfully assigned default/pod to 127.0.0.1
  Normal   BackOff    22s (x2 over 55s)  kubelet            Back-off pulling image "quay.io/crio/unsigned"
  Warning  Failed     22s (x2 over 55s)  kubelet            Error: ImagePullBackOff
  Normal   Pulling    9s (x3 over 58s)   kubelet            Pulling image "quay.io/crio/unsigned"
  Warning  Failed     6s (x3 over 55s)   kubelet            Failed to pull image "quay.io/crio/unsigned": SignatureValidationFailed: Source image rejected: A signature was required, but no signature exists
  Warning  Failed     6s (x3 over 55s)   kubelet            Error: SignatureValidationFailed
```

<!--
This overall behavior provides a more Kubernetes native experience and does not
rely on third party software to be installed in the cluster.
-->
這種整體行爲提供了更符合 Kubernetes 原生體驗的方式，並且不依賴於在集羣中安裝的第三方軟件。

<!--
There are still a few corner cases to consider: For example, what if you want to
allow policies per namespace in the same way the policy-controller supports it?
Well, there is an upcoming CRI-O feature in v1.28 for that! CRI-O will support
the `--signature-policy-dir` / `signature_policy_dir` option, which defines the
root path for pod namespace-separated signature policies. This means that CRI-O
will lookup that path and assemble a policy like `<SIGNATURE_POLICY_DIR>/<NAMESPACE>.json`,
which will be used on image pull if existing. If no pod namespace is
provided on image pull ([via the sandbox config][sandbox-config]), or the
concatenated path is non-existent, then CRI-O's global policy will be used as
fallback.
-->
還有一些特殊情況需要考慮：例如，如果你希望像策略控制器那樣允許按命名空間設置策略，怎麼辦？
好消息是，CRI-O 在 v1.28 版本中即將推出這個特性！CRI-O 將支持 `--signature-policy-dir` /
`signature_policy_dir` 選項，爲命名空間隔離的簽名策略的 Pod 定義根路徑。
這意味着 CRI-O 將查找該路徑，並組裝一個類似 `<SIGNATURE_POLICY_DIR>/<NAMESPACE>.json`
的策略，在鏡像拉取時如果存在則使用該策略。如果（[通過沙盒配置][sandbox-config]）
在鏡像拉取時未提供 Pod 命名空間，或者串接的路徑不存在，則 CRI-O 的全局策略將用作後備。

[sandbox-config]: https://github.com/kubernetes/cri-api/blob/e5515a5/pkg/apis/runtime/v1/api.proto#L1448

<!--
Another corner case to consider is critical for the correct signature
verification within container runtimes: The kubelet only invokes container image
pulls if the image does not already exist on disk. This means that an
unrestricted policy from Kubernetes namespace A can allow pulling an image,
while namespace B is not able to enforce the policy because it already exits on
the node. Finally, CRI-O has to verify the policy not only on image pull, but
also on container creation. This fact makes things even a bit more complicated,
because the CRI does not really pass down the user specified image reference on
container creation, but an already resolved image ID, or digest. A [small
change to the CRI][pr-118652] can help with that.
-->
另一個需要考慮的特殊情況對於容器運行時中正確的簽名驗證至關重要：kubelet
僅在磁盤上不存在鏡像時才調用容器鏡像拉取。這意味着來自 Kubernetes 命名空間 A
的不受限策略可以允許拉取一個鏡像，而命名空間 B 則無法強制執行該策略，
因爲它已經存在於節點上了。最後，CRI-O 必須在容器創建時驗證策略，而不僅僅是在鏡像拉取時。
這一事實使情況變得更加複雜，因爲 CRI 在容器創建時並沒有真正傳遞用戶指定的鏡像引用，
而是傳遞已經解析過的鏡像 ID 或摘要。[對 CRI 進行小改動][pr-118652] 有助於解決這個問題。

[pr-118652]: https://github.com/kubernetes/kubernetes/pull/118652

<!--
Now that everything happens within the container runtime, someone has to
maintain and define the policies to provide a good user experience around that
feature. The CRDs of the policy-controller are great, while we could imagine that
a daemon within the cluster can write the policies for CRI-O per namespace. This
would make any additional hook obsolete and moves the responsibility of
verifying the image signature to the actual instance which pulls the image. [I
evaluated][thread] other possible paths toward a better container image
signature verification within plain Kubernetes, but I could not find a great fit
for a native API. This means that I believe that a CRD is the way to go, but
users still need an instance which actually serves it.
-->
現在一切都發生在容器運行時中，大家必須維護和定義策略以提供良好的用戶體驗。
策略控制器的 CRD 非常出色，我們可以想象集羣中的一個守護進程可以按命名空間爲 CRI-O 編寫策略。
這將使任何額外的回調過時，並將驗證鏡像簽名的責任移交給實際拉取鏡像的實例。
我已經評估了在純 Kubernetes 中實現更好的容器鏡像簽名驗證的其他可能途徑，
但我沒有找到一個很好的原生 API 解決方案。這意味着我相信 CRD 是正確的方法，
但用戶仍然需要一個實際有作用的實例。

[thread]: https://groups.google.com/g/kubernetes-sig-node/c/kgpxqcsJ7Vc/m/7X7t_ElsAgAJ

<!--
Thank you for reading this blog post! If you're interested in more, providing
feedback or asking for help, then feel free to get in touch with me directly via
[Slack (#crio)][slack] or the [SIG Node mailing list][mail].
-->
感謝閱讀這篇博文！如果你對更多內容感興趣，想提供反饋或尋求幫助，請隨時通過
[Slack (#crio)][slack] 或 [SIG Node 郵件列表][mail]直接聯繫我。

[slack]: https://kubernetes.slack.com/messages/crio
[mail]: https://groups.google.com/forum/#!forum/kubernetes-sig-node

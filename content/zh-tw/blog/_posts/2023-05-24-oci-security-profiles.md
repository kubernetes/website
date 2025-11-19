---
layout: blog
title: "使用 OCI 工件爲 seccomp、SELinux 和 AppArmor 分發安全配置文件"
date: 2023-05-24
slug: oci-security-profiles
---
<!--
layout: blog
title: "Using OCI artifacts to distribute security profiles for seccomp, SELinux and AppArmor"
date: 2023-05-24
slug: oci-security-profiles
-->

<!--
**Author**: Sascha Grunert
-->
**作者**: Sascha Grunert

**譯者**: [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The [Security Profiles Operator (SPO)][spo] makes managing seccomp, SELinux and
AppArmor profiles within Kubernetes easier than ever. It allows cluster
administrators to define the profiles in a predefined custom resource YAML,
which then gets distributed by the SPO into the whole cluster. Modification and
removal of the security profiles are managed by the operator in the same way,
but that’s a small subset of its capabilities.
-->
[Security Profiles Operator (SPO)][spo] 使得在 Kubernetes 中管理
seccomp、SELinux 和 AppArmor 配置文件變得更加容易。
它允許集羣管理員在預定義的自定義資源 YAML 中定義配置文件，然後由 SPO 分發到整個集羣中。
安全配置文件的修改和移除也由 Operator 以同樣的方式進行管理，但這只是其能力的一小部分。

[spo]: https://github.com/kubernetes-sigs/security-profiles-operator

<!--
Another core feature of the SPO is being able to stack seccomp profiles. This
means that users can define a `baseProfileName` in the YAML specification, which
then gets automatically resolved by the operator and combines the syscall rules.
If a base profile has another `baseProfileName`, then the operator will
recursively resolve the profiles up to a certain depth. A common use case is to
define base profiles for low level container runtimes (like [runc][runc] or
[crun][crun]) which then contain syscalls which are required in any case to run
the container. Alternatively, application developers can define seccomp base
profiles for their standard distribution containers and stack dedicated profiles
for the application logic on top. This way developers can focus on maintaining
seccomp profiles which are way simpler and scoped to the application logic,
without having a need to take the whole infrastructure setup into account.
-->
SPO 的另一個核心特性是能夠組合 seccomp 配置文件。這意味着用戶可以在 YAML
規約中定義 `baseProfileName`，然後 Operator 會自動解析並組合系統調用規則。
如果基本配置文件有另一個 `baseProfileName`，那麼 Operator 將以遞歸方式解析配置文件到一定深度。
常見的使用場景是爲低級容器運行時（例如 [runc][runc] 或 [crun][crun]）定義基本配置文件，
在這些配置文件中包含各種情況下運行容器所需的系統調用。另外，應用開發人員可以爲其標準分發容器定義
seccomp 基本配置文件，並在其上組合針對應用邏輯的專用配置文件。
這樣開發人員就可以專注於維護更簡單且範圍限制爲應用邏輯的 seccomp 配置文件，
而不需要考慮整個基礎設施的設置。

[runc]: https://github.com/opencontainers/runc
[crun]: https://github.com/containers/crun

<!--
But how to maintain those base profiles? For example, the amount of required
syscalls for a runtime can change over its release cycle in the same way it can
change for the main application. Base profiles have to be available in the same
cluster, otherwise the main seccomp profile will fail to deploy. This means that
they’re tightly coupled to the main application profiles, which acts against the
main idea of base profiles. Distributing and managing them as plain files feels
like an additional burden to solve.
-->
但是如何維護這些基本配置文件呢？
例如，運行時所需的系統調用數量可能會像主應用一樣在其發佈週期內發生變化。
基本配置文件必須在同一集羣中可用，否則主 seccomp 配置文件將無法部署。
這意味着這些基本配置文件與主應用配置文件緊密耦合，因此違背了基本配置文件的核心理念。
將基本配置文件作爲普通文件分發和管理感覺像是需要解決的額外負擔。

<!--
## OCI artifacts to the rescue

The [v0.8.0][spo-latest] release of the Security Profiles Operator supports
managing base profiles as OCI artifacts! Imagine OCI artifacts as lightweight
container images, storing files in layers in the same way images do, but without
a process to be executed. Those artifacts can be used to store security profiles
like regular container images in compatible registries. This means they can be
versioned, namespaced and annotated similar to regular container images.
-->
## OCI 工件成爲救命良方   {#oci-artifacts-to-rescue}

Security Profiles Operator 的 [v0.8.0][spo-latest] 版本支持將基本配置文件作爲
OCI 工件進行管理！將 OCI 工件假想爲輕量級容器鏡像，採用與鏡像相同的方式在各層中存儲文件，
但沒有要執行的進程。這些工件可以用於像普通容器鏡像一樣在兼容的鏡像倉庫中存儲安全配置文件。
這意味着這些工件可以被版本化、作用於命名空間並類似常規容器鏡像一樣添加註解。

[spo-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/v0.8.0

<!--
To see how that works in action, specify a `baseProfileName` prefixed with
`oci://` within a seccomp profile CRD, for example:
-->
若要查看具體的工作方式，可以在 seccomp 配置文件 CRD 內以前綴 `oci://`
指定 `baseProfileName`，例如：

```yaml
apiVersion: security-profiles-operator.x-k8s.io/v1beta1
kind: SeccompProfile
metadata:
  name: test
spec:
  defaultAction: SCMP_ACT_ERRNO
  baseProfileName: oci://ghcr.io/security-profiles/runc:v1.1.5
  syscalls:
    - action: SCMP_ACT_ALLOW
      names:
        - uname
```

<!--
The operator will take care of pulling the content by using [oras][oras], as
well as verifying the [sigstore (cosign)][cosign] signatures of the artifact. If
the artifacts are not signed, then the SPO will reject them. The resulting
profile `test` will then contain all base syscalls from the remote `runc`
profile plus the additional allowed `uname` one. It is also possible to
reference the base profile by its digest (SHA256) making the artifact to be
pulled more specific, for example by referencing
`oci://ghcr.io/security-profiles/runc@sha256:380…`.
-->
Operator 將負責使用 [oras][oras] 拉取內容，並驗證工件的 [sigstore (cosign)][cosign] 簽名。
如果某些工件未經簽名，則 SPO 將拒絕它們。隨後生成的配置文件 `test` 將包含來自遠程
`runc` 配置文件的所有基本系統調用加上額外允許的 `uname` 系統調用。
你還可以通過摘要（SHA256）來引用基本配置文件，使要被拉取的工件更爲確定，
例如通過引用 `oci：//ghcr.io/security-profiles/runc@sha256: 380…`。

[oras]: https://oras.land
[cosign]: https://github.com/sigstore/cosign

<!--
The operator internally caches pulled artifacts up to 24 hours for 1000
profiles, meaning that they will be refreshed after that time period, if the
cache is full or the operator daemon gets restarted.
-->
Operator 在內部緩存已拉取的工件，最多可緩存 1000 個配置文件 24 小時，
這意味着如果緩存已滿、Operator 守護進程重啓或超出給定時段後這些工件將被刷新。

<!--
Because the overall resulting syscalls are hidden from the user (I only have the
`baseProfileName` listed in the SeccompProfile, and not the syscalls themselves), I'll additionally
annotate that SeccompProfile with the final `syscalls`.

Here's how the SeccompProfile looks after I annotate it:
-->
因爲總體生成的系統調用對用戶不可見
（我只列出了 SeccompProfile 中的 `baseProfileName`，而沒有列出系統調用本身），
所以我爲該 SeccompProfile 的最終 `syscalls` 添加了額外的註解。

以下是我註解後的 SeccompProfile：

```console
> kubectl describe seccompprofile test
Name:         test
Namespace:    security-profiles-operator
Labels:       spo.x-k8s.io/profile-id=SeccompProfile-test
Annotations:  syscalls:
                [{"names":["arch_prctl","brk","capget","capset","chdir","clone","close",...
API Version:  security-profiles-operator.x-k8s.io/v1beta1
```

<!--
The SPO maintainers provide all public base profiles as part of the [“Security
Profiles” GitHub organization][org].
-->
SPO 維護者們作爲 [“Security Profiles” GitHub 組織][org] 的成員提供所有公開的基本配置文件。

[org]: https://github.com/orgs/security-profiles/packages

<!--
## Managing OCI security profiles

Alright, now the official SPO provides a bunch of base profiles, but how can I
define my own? Well, first of all we have to choose a working registry. There
are a bunch of registries that already supports OCI artifacts:
-->
## 管理 OCI 安全配置文件   {#managing-oci-security-profiles}

好的，官方的 SPO 提供了許多基本配置文件，但是我如何定義自己的配置文件呢？
首先，我們必須選擇一個可用的鏡像倉庫。有許多鏡像倉庫都已支持 OCI 工件：

- [CNCF Distribution](https://github.com/distribution/distribution)
- [Azure Container Registry](https://aka.ms/acr)
- [Amazon Elastic Container Registry](https://aws.amazon.com/ecr)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry)
- [GitHub Packages container registry](https://docs.github.com/en/packages/guides/about-github-container-registry)
- [Docker Hub](https://hub.docker.com)
- [Zot Registry](https://zotregistry.io)

<!--
The Security Profiles Operator ships a new command line interface called `spoc`,
which is a little helper tool for managing OCI profiles among doing various other
things which are out of scope of this blog post. But, the command `spoc push`
can be used to push a security profile to a registry:
-->
Security Profiles Operator 交付一個新的名爲 `spoc` 的命令行界面，
這是一個用於管理 OCI 配置文件的小型輔助工具，該工具提供的各項能力不在這篇博文的討論範圍內。
但 `spoc push` 命令可以用於將安全配置文件推送到鏡像倉庫：

```console
> export USERNAME=my-user
> export PASSWORD=my-pass
> spoc push -f ./examples/baseprofile-crun.yaml ghcr.io/security-profiles/crun:v1.8.3
16:35:43.899886 Pushing profile ./examples/baseprofile-crun.yaml to: ghcr.io/security-profiles/crun:v1.8.3
16:35:43.899939 Creating file store in: /tmp/push-3618165827
16:35:43.899947 Adding profile to store: ./examples/baseprofile-crun.yaml
16:35:43.900061 Packing files
16:35:43.900282 Verifying reference: ghcr.io/security-profiles/crun:v1.8.3
16:35:43.900310 Using tag: v1.8.3
16:35:43.900313 Creating repository for ghcr.io/security-profiles/crun
16:35:43.900319 Using username and password
16:35:43.900321 Copying profile to repository
16:35:46.976108 Signing container image
Generating ephemeral keys...
Retrieving signed certificate...

        Note that there may be personally identifiable information associated with this signed artifact.
        This may include the email address associated with the account with which you authenticate.
        This information will be used for signing this artifact and will be stored in public transparency logs and cannot be removed later.

By typing 'y', you attest that you grant (or have permission to grant) and agree to have this information stored permanently in transparency logs.
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=…
Successfully verified SCT...
tlog entry created with index: 16520520
Pushing signature to: ghcr.io/security-profiles/crun
```

<!--
You can see that the tool automatically signs the artifact and pushes the
`./examples/baseprofile-crun.yaml` to the registry, which is then directly ready
for usage within the SPO. If username and password authentication is required,
either use the `--username`, `-u` flag or export the `USERNAME` environment
variable. To set the password, export the `PASSWORD` environment variable.
-->
你可以看到該工具自動簽署工件並將 `./examples/baseprofile-crun.yaml` 推送到鏡像倉庫中，
然後直接可以在 SPO 中使用此文件。如果需要驗證用戶名和密碼，則可以使用 `--username`、
`-u` 標誌或導出 `USERNAME` 環境變量。要設置密碼，可以導出 `PASSWORD` 環境變量。

<!--
It is possible to add custom annotations to the security profile by using the
`--annotations` / `-a` flag multiple times in `KEY:VALUE` format. Those have no
effect for now, but at some later point additional features of the operator may
rely them.

The `spoc` client is also able to pull security profiles from OCI artifact
compatible registries. To do that, just run `spoc pull`:
-->
採用 `KEY:VALUE` 的格式多次使用 `--annotations` / `-a` 標誌，
可以爲安全配置文件添加自定義註解。目前這些對安全配置文件沒有影響，
但是在後續某個階段，Operator 的其他特性可能會依賴於它們。

`spoc` 客戶端還可以從兼容 OCI 工件的鏡像倉庫中拉取安全配置文件。
要執行此操作，只需運行 `spoc pull`：

```console
> spoc pull ghcr.io/security-profiles/runc:v1.1.5
16:32:29.795597 Pulling profile from: ghcr.io/security-profiles/runc:v1.1.5
16:32:29.795610 Verifying signature

Verification for ghcr.io/security-profiles/runc:v1.1.5 --
The following checks were performed on each of these signatures:
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates

[{"critical":{"identity":{"docker-reference":"ghcr.io/security-profiles/runc"},…}}]
16:32:33.208695 Creating file store in: /tmp/pull-3199397214
16:32:33.208713 Verifying reference: ghcr.io/security-profiles/runc:v1.1.5
16:32:33.208718 Creating repository for ghcr.io/security-profiles/runc
16:32:33.208742 Using tag: v1.1.5
16:32:33.208743 Copying profile from repository
16:32:34.119652 Reading profile
16:32:34.119677 Trying to unmarshal seccomp profile
16:32:34.120114 Got SeccompProfile: runc-v1.1.5
16:32:34.120119 Saving profile in: /tmp/profile.yaml
```

<!--
The profile can be now found in `/tmp/profile.yaml` or the specified output file
`--output-file` / `-o`. We can specify an username and password in the same way
as for `spoc push`.

`spoc` makes it easy to manage security profiles as OCI artifacts, which can be
then consumed directly by the operator itself.
-->
現在可以在 `/tmp/profile.yaml` 或 `--output-file` / `-o` 所指定的輸出文件中找到該配置文件。
我們可以像 `spoc push` 一樣指定用戶名和密碼。

`spoc` 使得以 OCI 工件的形式管理安全配置文件變得非常容易，這些 OCI 工件可以由 Operator 本身直接使用。

<!--
That was our compact journey through the latest possibilities of the Security
Profiles Operator! If you're interested in more, providing feedback or asking
for help, then feel free to get in touch with us directly via [Slack
(#security-profiles-operator)][slack] or [the mailing list][mail].
-->
本文簡要介紹了通過 Security Profiles Operator 能夠達成的各種最新可能性！
如果你有興趣瞭解更多，無論是提出反饋還是尋求幫助，
請通過 [Slack (#security-profiles-operator)][slack] 或[郵件列表][mail]直接與我們聯繫。

[slack]: https://kubernetes.slack.com/messages/security-profiles-operator
[mail]: https://groups.google.com/forum/#!forum/kubernetes-dev

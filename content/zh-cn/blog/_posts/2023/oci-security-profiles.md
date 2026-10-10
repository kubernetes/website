---
layout: blog
title: "使用 OCI 工件为 seccomp、SELinux 和 AppArmor 分发安全配置文件"
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

**译者**: [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
The [Security Profiles Operator (SPO)][spo] makes managing seccomp, SELinux and
AppArmor profiles within Kubernetes easier than ever. It allows cluster
administrators to define the profiles in a predefined custom resource YAML,
which then gets distributed by the SPO into the whole cluster. Modification and
removal of the security profiles are managed by the operator in the same way,
but that’s a small subset of its capabilities.
-->
[Security Profiles Operator (SPO)][spo] 使得在 Kubernetes 中管理
seccomp、SELinux 和 AppArmor 配置文件变得更加容易。
它允许集群管理员在预定义的自定义资源 YAML 中定义配置文件，然后由 SPO 分发到整个集群中。
安全配置文件的修改和移除也由 Operator 以同样的方式进行管理，但这只是其能力的一小部分。

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
SPO 的另一个核心特性是能够组合 seccomp 配置文件。这意味着用户可以在 YAML
规约中定义 `baseProfileName`，然后 Operator 会自动解析并组合系统调用规则。
如果基本配置文件有另一个 `baseProfileName`，那么 Operator 将以递归方式解析配置文件到一定深度。
常见的使用场景是为低级容器运行时（例如 [runc][runc] 或 [crun][crun]）定义基本配置文件，
在这些配置文件中包含各种情况下运行容器所需的系统调用。另外，应用开发人员可以为其标准分发容器定义
seccomp 基本配置文件，并在其上组合针对应用逻辑的专用配置文件。
这样开发人员就可以专注于维护更简单且范围限制为应用逻辑的 seccomp 配置文件，
而不需要考虑整个基础设施的设置。

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
但是如何维护这些基本配置文件呢？
例如，运行时所需的系统调用数量可能会像主应用一样在其发布周期内发生变化。
基本配置文件必须在同一集群中可用，否则主 seccomp 配置文件将无法部署。
这意味着这些基本配置文件与主应用配置文件紧密耦合，因此违背了基本配置文件的核心理念。
将基本配置文件作为普通文件分发和管理感觉像是需要解决的额外负担。

<!--
## OCI artifacts to the rescue

The [v0.8.0][spo-latest] release of the Security Profiles Operator supports
managing base profiles as OCI artifacts! Imagine OCI artifacts as lightweight
container images, storing files in layers in the same way images do, but without
a process to be executed. Those artifacts can be used to store security profiles
like regular container images in compatible registries. This means they can be
versioned, namespaced and annotated similar to regular container images.
-->
## OCI 工件成为救命良方   {#oci-artifacts-to-rescue}

Security Profiles Operator 的 [v0.8.0][spo-latest] 版本支持将基本配置文件作为
OCI 工件进行管理！将 OCI 工件假想为轻量级容器镜像，采用与镜像相同的方式在各层中存储文件，
但没有要执行的进程。这些工件可以用于像普通容器镜像一样在兼容的镜像仓库中存储安全配置文件。
这意味着这些工件可以被版本化、作用于命名空间并类似常规容器镜像一样添加注解。

[spo-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/v0.8.0

<!--
To see how that works in action, specify a `baseProfileName` prefixed with
`oci://` within a seccomp profile CRD, for example:
-->
若要查看具体的工作方式，可以在 seccomp 配置文件 CRD 内以前缀 `oci://`
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
Operator 将负责使用 [oras][oras] 拉取内容，并验证工件的 [sigstore (cosign)][cosign] 签名。
如果某些工件未经签名，则 SPO 将拒绝它们。随后生成的配置文件 `test` 将包含来自远程
`runc` 配置文件的所有基本系统调用加上额外允许的 `uname` 系统调用。
你还可以通过摘要（SHA256）来引用基本配置文件，使要被拉取的工件更为确定，
例如通过引用 `oci：//ghcr.io/security-profiles/runc@sha256: 380…`。

[oras]: https://oras.land
[cosign]: https://github.com/sigstore/cosign

<!--
The operator internally caches pulled artifacts up to 24 hours for 1000
profiles, meaning that they will be refreshed after that time period, if the
cache is full or the operator daemon gets restarted.
-->
Operator 在内部缓存已拉取的工件，最多可缓存 1000 个配置文件 24 小时，
这意味着如果缓存已满、Operator 守护进程重启或超出给定时段后这些工件将被刷新。

<!--
Because the overall resulting syscalls are hidden from the user (I only have the
`baseProfileName` listed in the SeccompProfile, and not the syscalls themselves), I'll additionally
annotate that SeccompProfile with the final `syscalls`.

Here's how the SeccompProfile looks after I annotate it:
-->
因为总体生成的系统调用对用户不可见
（我只列出了 SeccompProfile 中的 `baseProfileName`，而没有列出系统调用本身），
所以我为该 SeccompProfile 的最终 `syscalls` 添加了额外的注解。

以下是我注解后的 SeccompProfile：

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
SPO 维护者们作为 [“Security Profiles” GitHub 组织][org] 的成员提供所有公开的基本配置文件。

[org]: https://github.com/orgs/security-profiles/packages

<!--
## Managing OCI security profiles

Alright, now the official SPO provides a bunch of base profiles, but how can I
define my own? Well, first of all we have to choose a working registry. There
are a bunch of registries that already supports OCI artifacts:
-->
## 管理 OCI 安全配置文件   {#managing-oci-security-profiles}

好的，官方的 SPO 提供了许多基本配置文件，但是我如何定义自己的配置文件呢？
首先，我们必须选择一个可用的镜像仓库。有许多镜像仓库都已支持 OCI 工件：

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
Security Profiles Operator 交付一个新的名为 `spoc` 的命令行界面，
这是一个用于管理 OCI 配置文件的小型辅助工具，该工具提供的各项能力不在这篇博文的讨论范围内。
但 `spoc push` 命令可以用于将安全配置文件推送到镜像仓库：

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
你可以看到该工具自动签署工件并将 `./examples/baseprofile-crun.yaml` 推送到镜像仓库中，
然后直接可以在 SPO 中使用此文件。如果需要验证用户名和密码，则可以使用 `--username`、
`-u` 标志或导出 `USERNAME` 环境变量。要设置密码，可以导出 `PASSWORD` 环境变量。

<!--
It is possible to add custom annotations to the security profile by using the
`--annotations` / `-a` flag multiple times in `KEY:VALUE` format. Those have no
effect for now, but at some later point additional features of the operator may
rely them.

The `spoc` client is also able to pull security profiles from OCI artifact
compatible registries. To do that, just run `spoc pull`:
-->
采用 `KEY:VALUE` 的格式多次使用 `--annotations` / `-a` 标志，
可以为安全配置文件添加自定义注解。目前这些对安全配置文件没有影响，
但是在后续某个阶段，Operator 的其他特性可能会依赖于它们。

`spoc` 客户端还可以从兼容 OCI 工件的镜像仓库中拉取安全配置文件。
要执行此操作，只需运行 `spoc pull`：

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
现在可以在 `/tmp/profile.yaml` 或 `--output-file` / `-o` 所指定的输出文件中找到该配置文件。
我们可以像 `spoc push` 一样指定用户名和密码。

`spoc` 使得以 OCI 工件的形式管理安全配置文件变得非常容易，这些 OCI 工件可以由 Operator 本身直接使用。

<!--
That was our compact journey through the latest possibilities of the Security
Profiles Operator! If you're interested in more, providing feedback or asking
for help, then feel free to get in touch with us directly via [Slack
(#security-profiles-operator)][slack] or [the mailing list][mail].
-->
本文简要介绍了通过 Security Profiles Operator 能够达成的各种最新可能性！
如果你有兴趣了解更多，无论是提出反馈还是寻求帮助，
请通过 [Slack (#security-profiles-operator)][slack] 或[邮件列表][mail]直接与我们联系。

[slack]: https://kubernetes.slack.com/messages/security-profiles-operator
[mail]: https://groups.google.com/forum/#!forum/kubernetes-dev

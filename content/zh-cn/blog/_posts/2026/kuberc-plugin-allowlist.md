---
layout: blog
title: "Kubernetes v1.35：通过 exec 插件 allowList 限制 kubeconfig 调用的可执行文件，该插件已添加到 kuberc"
date: 2026-01-09T10:30:00-08:00
slug: kubernetes-v1-35-kuberc-credential-plugin-allowlist
author: >
  [Peter Engelbert](https://github.com/pmengelbert) (Microsoft)
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.35: Restricting executables invoked by kubeconfigs via exec plugin allowList added to kuberc"
date: 2026-01-09T10:30:00-08:00
slug: kubernetes-v1-35-kuberc-credential-plugin-allowlist
author: >
  [Peter Engelbert](https://github.com/pmengelbert) (Microsoft)
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft)
-->

<!--
Did you know that `kubectl` can run arbitrary executables, including shell
scripts, with the full privileges of the invoking user, and without your
knowledge? Whenever you download or auto-generate a `kubeconfig`, the
`users[n].exec.command` field can specify an executable to fetch credentials on
your behalf. Don't get me wrong, this is an incredible feature that allows you
to authenticate to the cluster with external identity providers. Nevertheless,
you probably see the problem: Do you know exactly what executables your `kubeconfig`
is running on your system? Do you trust the pipeline that generated your `kubeconfig`?
If there has been a supply-chain attack on the code that generates the kubeconfig,
or if the generating pipeline has been compromised, an attacker might well be
doing unsavory things to your machine by tricking your `kubeconfig` into running
arbitrary code.
-->
你知道吗？`kubectl` 可以在你不知情的情况下，以调用用户的完整权限运行任意可执行文件（包括 shell 脚本）。
每当你下载或自动生成 `kubeconfig` 时，`users[n].exec.command` 字段可以指定一个可执行文件代表你获取凭证。
别误会，这是一个很棒的特性，允许你使用外部身份提供者向集群进行身份验证。
然而，你可能已经看到了问题：你确切知道你的 `kubeconfig` 在系统上运行的是什么可执行文件吗？
你信任生成你 `kubeconfig` 的流水线吗？
如果生成 kubeconfig 的代码遭受了供应链攻击，或者生成流水线被入侵，
攻击者很可能通过诱骗你的 `kubeconfig` 运行任意代码来对你的机器做些不好的事情。

<!--
To give the user more control over what gets run on their system, [SIG-Auth](https://git.k8s.io/community/sig-auth) and [SIG-CLI](https://git.k8s.io/community/sig-cli) added the credential plugin policy and allowlist as a beta feature to
Kubernetes 1.35. This is available to all clients using the `client-go` library,
by filling out the [ExecProvider.PluginPolicy](https://github.com/kubernetes/client-go/blob/master/tools/clientcmd/api/types.go#L290) struct on a REST config. To
broaden the impact of this change, Kubernetes v1.35 also lets you manage this without
writing a line of application code. You can configure `kubectl` to enforce
the policy and allowlist by adding two fields to the `kuberc` configuration
file: `credentialPluginPolicy` and `credentialPluginAllowlist`. Adding one or
both of these fields restricts which credential plugins `kubectl` is allowed to execute.
-->
为了让用户更好地控制在其系统上运行的内容，[SIG-Auth](https://git.k8s.io/community/sig-auth)
和 [SIG-CLI](https://git.k8s.io/community/sig-cli) 在 Kubernetes 1.35
中将凭证插件策略和允许列表作为 Beta 特性添加。
所有使用 `client-go` 库的客户端都可以通过在 REST 配置上填写
[ExecProvider.PluginPolicy](https://github.com/kubernetes/client-go/blob/master/tools/clientcmd/api/types.go#L290)
结构体来使用此特性。
为了扩大此更改的影响，Kubernetes v1.35 还允许你无需编写任何应用代码即可管理此特性。
你可以通过在 `kuberc` 配置文件中添加两个字段来配置 `kubectl`
强制执行策略和允许列表：`credentialPluginPolicy` 和 `credentialPluginAllowlist`。
添加其中一个或两个字段会限制 `kubectl` 允许执行的凭证插件。

<!--
## How it works
-->
## 工作原理

<!--
A full description of this functionality is available in our [official documentation](/docs/reference/kubectl/kuberc/) for kuberc,
but this blog post will give a brief overview of the new security knobs. The new
features are in beta and available without using any feature gates.
-->
此特性的完整描述可在我们的[官方文档](/zh-cn/docs/reference/kubectl/kuberc/)中找到，
但这篇博客文章将简要概述新的安全控制选项。这些新特性处于 Beta 阶段，无需使用任何特性门控即可使用。

<!--
The following example is the simplest one: simply don't specify the new fields.
-->
以下示例是最简单的情况：不指定新字段。

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
```

<!--
This will keep `kubectl` acting as it always has, and all plugins will be
allowed.
-->
这将保持 `kubectl` 的行为与以往相同，允许所有插件。

<!--
The next example is functionally identical, but it is more explicit and
therefore preferred if it's actually what you want:
-->
下一个示例在特性上是相同的，但更明确，因此如果这确实是你想要的，建议使用：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: AllowAll
```

<!--
If you *don't know* whether or not you're using exec credential plugins, try
setting your policy to `DenyAll`:
-->
如果你*不知道*是否正在使用 exec 凭证插件，请尝试将策略设置为 `DenyAll`：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: DenyAll
```

<!--
If you *are* using credential plugins, you'll quickly find out what `kubectl` is
trying to execute. You'll get an error like the following.
-->
如果你*确实*正在使用凭证插件，你会很快发现 `kubectl` 尝试执行的内容。你会收到如下错误。

> Unable to connect to the server: getting credentials: plugin "cloudco-login" not allowed: policy set to "DenyAll"

<!--
If there is insufficient information for you to debug the issue, increase the
logging verbosity when you run your next command.  For example:
-->
如果信息不足以调试问题，请在运行下一个命令时增加日志详细级别。例如：

<!--
```bash
# 如果问题仍然不清楚，可以增加或减少描述过于冗长的内容。
kubectl get pods --verbosity 5
```
-->
```bash
# increase or decrease verbosity if the issue is still unclear
kubectl get pods --verbosity 5
```

<!--
### Selectively allowing plugins
-->
### 选择性允许插件

<!--
What if you need the `cloudco-login` plugin to do your daily work? That is why
there's a third option for your policy, `Allowlist`. To allow a specific plugin,
set the policy and add the `credentialPluginAllowlist`:
-->
如果你需要 `cloudco-login` 插件来完成日常工作怎么办？这就是为什么策略有第三个选项 `Allowlist`。
要允许特定插件，请设置策略并添加 `credentialPluginAllowlist`：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: /usr/local/bin/cloudco-login
  - name: get-identity
```

<!--
You'll notice that there are two entries in the allowlist. One of them is
specified by full path, and the other, `get-identity` is just a basename. When
you specify just the basename, the full path will be looked up using
`exec.LookPath`, which does not expand globbing or handle wildcards.
Globbing is not supported at this time. Both forms
(basename and full path) are acceptable, but the full path is preferable because
it narrows the scope of allowed binaries even further.
-->
你会注意到允许列表中有两个条目。其中一个通过完整路径指定，另一个 `get-identity` 只是一个基本名称。
当你只指定基本名称时，将使用 `exec.LookPath` 查找完整路径，它不展开通配符或处理通配符。
目前不支持通配符。两种形式（基本名称和完整路径）都可以接受，但完整路径更好，
因为它进一步缩小了允许的二进制文件的范围。

<!--
### Future enhancements
-->
### 未来增强

<!--
Currently, an allowlist entry has only one field, `name`. In the future, we
(Kubernetes SIG CLI) want to see other requirements added. One idea that seems
useful is checksum verification whereby, for example, a binary would only be allowed
to run if it has the sha256 sum
`b9a3fad00d848ff31960c44ebb5f8b92032dc085020f857c98e32a5d5900ff9c` **and**
exists at the path `/usr/bin/cloudco-login`.
-->
目前，允许列表条目只有一个字段 `name`。将来，我们（Kubernetes SIG CLI）希望添加其他要求。
一个有用的想法是校验和验证，例如，只有当二进制文件具有 sha256 校验和
`b9a3fad00d848ff31960c44ebb5f8b92032dc085020f857c98e32a5d5900ff9c`
**并且**存在于路径 `/usr/bin/cloudco-login` 时，才允许运行。

<!--
Another possibility is only allowing binaries that have been signed by one of a
set of a trusted signing keys.
-->
另一种可能性是只允许由一组可信签名密钥之一签名的二进制文件。

<!--
## Get involved
-->
## 参与其中

<!--
The credential plugin policy is still under development and we are very interested
in your feedback. We'd love to hear what you like about it and what problems
you'd like to see it solve. Or, if you have the cycles to contribute one of the
above enhancements, they'd be a great way to get started contributing to
Kubernetes. Feel free to join in the discussion on slack:
- [#sig-cli](https://kubernetes.slack.com/archives/C2GL57FJ4),
- [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY).
-->
凭证插件策略仍在开发中，我们非常感兴趣你的反馈。我们很想听听你喜欢它的哪些方面以及你希望它解决哪些问题。
或者，如果你有时间贡献上述增强特性之一，它们将是开始为 Kubernetes 做出贡献的好方法。
欢迎在 Slack 上加入讨论：
- [#sig-cli](https://kubernetes.slack.com/archives/C2GL57FJ4)，
- [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)。

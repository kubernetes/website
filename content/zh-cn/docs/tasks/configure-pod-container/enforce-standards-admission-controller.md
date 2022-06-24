---
title: 通过配置内置准入控制器实施 Pod 安全标准
content_type: task
min-kubernetes-server-version: v1.22
---

<!--
title: Enforce Pod Security Standards by Configuring the Built-in Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
-->

<!--
As of v1.22, Kubernetes provides a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).
You can configure this admission controller to set cluster-wide defaults and [exemptions](/docs/concepts/security/pod-security-admission/#exemptions).
-->
在 v1.22 版本中，Kubernetes 提供一种内置的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
用来强制实施 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)。
你可以配置此准入控制器来设置集群范围的默认值和[豁免选项](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)。

## {{% heading "prerequisites" %}}

{{% version-check %}}

<!--
- Ensure the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) is enabled.
-->
- 确保 `PodSecurity` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)已被启用。

<!--
## Configure the Admission Controller
-->
## 配置准入控制器    {#configure-the-admission-controller}

{{< tabs name="PodSecurityConfiguration_example_1" >}}
{{% tab name="pod-security.admission.config.k8s.io/v1beta1" %}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    # 当未设置 mode 标签时会应用的默认设置
    #
    # level 标签必须是以下取值之一：
    # - "privileged" (默认)
    # - "baseline"
    # - "restricted"
    #
    # version 标签必须是如下取值之一：
    # - "latest" (默认) 
    # - 诸如 "v{{< skew currentVersion>}}" 这类版本号
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 要豁免的已认证用户名列表
      usernames: []
      # 要豁免的运行时类名称列表
      runtimeClasses: []
      # 要豁免的名字空间列表
      namespaces: []
```

{{< note >}}
<!--
v1beta1 configuration requires v1.23+. For v1.22, use v1alpha1.
-->
v1beta1 配置结构需要使用 v1.23+ 版本；对于 v1.22 版本，可使用 v1alpha1。
{{< /note >}}

{{% /tab %}}
{{% tab name="pod-security.admission.config.k8s.io/v1alpha1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1alpha1
    kind: PodSecurityConfiguration
    # 当未设置 mode 标签时会应用的默认设置
    #
    # level 标签必须是以下取值之一：
    # - "privileged" (默认)
    # - "baseline"
    # - "restricted"
    #
    # version 标签必须是如下取值之一：
    # - "latest" (默认) 
    # - 诸如 "v{{< skew currentVersion>}}" 这类版本号
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 要豁免的已认证用户名列表
      usernames: []
      # 要豁免的运行时类名称列表
      runtimeClasses: []
      # 要豁免的名字空间列表
      namespaces: []
```
{{% /tab %}}
{{< /tabs >}}


---
title: 透過配置內建准入控制器實施 Pod 安全標準
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
在 v1.22 版本中，Kubernetes 提供一種內建的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
用來強制實施 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards)。
你可以配置此准入控制器來設定叢集範圍的預設值和[豁免選項](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)。

## {{% heading "prerequisites" %}}

{{% version-check %}}

<!--
- Ensure the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) is enabled.
-->
- 確保 `PodSecurity` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)已被啟用。

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
    # 當未設定 mode 標籤時會應用的預設設定
    #
    # level 標籤必須是以下取值之一：
    # - "privileged" (預設)
    # - "baseline"
    # - "restricted"
    #
    # version 標籤必須是如下取值之一：
    # - "latest" (預設) 
    # - 諸如 "v{{< skew latestVersion >}}" 這類版本號
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 要豁免的已認證使用者名稱列表
      usernames: []
      # 要豁免的執行時類名稱列表
      runtimeClasses: []
      # 要豁免的名字空間列表
      namespaces: []
```

{{< note >}}
<!--
v1beta1 configuration requires v1.23+. For v1.22, use v1alpha1.
-->
v1beta1 配置結構需要使用 v1.23+ 版本；對於 v1.22 版本，可使用 v1alpha1。
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
    # 當未設定 mode 標籤時會應用的預設設定
    #
    # level 標籤必須是以下取值之一：
    # - "privileged" (預設)
    # - "baseline"
    # - "restricted"
    #
    # version 標籤必須是如下取值之一：
    # - "latest" (預設) 
    # - 諸如 "v{{< skew latestVersion >}}" 這類版本號
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 要豁免的已認證使用者名稱列表
      usernames: []
      # 要豁免的執行時類名稱列表
      runtimeClasses: []
      # 要豁免的名字空間列表
      namespaces: []
```
{{% /tab %}}
{{< /tabs >}}


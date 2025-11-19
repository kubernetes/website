---
title: 通過設定內置准入控制器實施 Pod 安全標準
content_type: task
weight: 240
---
<!--
title: Enforce Pod Security Standards by Configuring the Built-in Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
weight: 240
-->

<!--
Kubernetes provides a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
to enforce the [Pod Security Standards](/docs/concepts/security/pod-security-standards).
You can configure this admission controller to set cluster-wide defaults and [exemptions](/docs/concepts/security/pod-security-admission/#exemptions).
-->
Kubernetes 提供一種內置的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
用來強制實施 [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards)。
你可以設定此准入控制器來設置叢集範圍的默認值和[豁免選項](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)。

## {{% heading "prerequisites" %}}

<!--
Following an alpha release in Kubernetes v1.22,
Pod Security Admission became available by default in Kubernetes v1.23, as
a beta. From version 1.25 onwards, Pod Security Admission is generally
available.
-->
Pod 安全性准入（Pod Security Admission）在 Kubernetes v1.22 作爲 Alpha 特性發布，
在 Kubernetes v1.23 中作爲 Beta 特性默認可用。從 1.25 版本起，
此特性進階至正式發佈（Generally Available）。

{{% version-check %}}

<!--
If you are not running Kubernetes {{< skew currentVersion >}}, you can switch
to viewing this page in the documentation for the Kubernetes version that you
are running.
-->
如果未運行 Kubernetes {{< skew currentVersion >}}，
你可以切換到與當前運行的 Kubernetes 版本所對應的文檔。

<!--
## Configure the Admission Controller
-->
## 設定准入控制器    {#configure-the-admission-controller}

{{< note >}}
<!--
`pod-security.admission.config.k8s.io/v1` configuration requires v1.25+.
For v1.23 and v1.24, use [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
For v1.22, use [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
-->
`pod-security.admission.config.k8s.io/v1` 設定需要 v1.25+。
對於 v1.23 和 v1.24，使用
[v1beta1](https://v1-24.docs.kubernetes.io/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)。
對於 v1.22，使用
[v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)。
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1
    kind: PodSecurityConfiguration
    # 當未設置 mode 標籤時會應用的默認設置
    #
    # level 標籤必須是以下取值之一：
    # - "privileged" (默認)
    # - "baseline"
    # - "restricted"
    #
    # version 標籤必須是如下取值之一：
    # - "latest" (默認) 
    # - 諸如 "v{{< skew currentVersion>}}" 這類版本號
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 要豁免的已認證用戶名列表
      usernames: []
      # 要豁免的運行時類名稱列表
      runtimeClasses: []
      # 要豁免的名字空間列表
      namespaces: []
```


{{< note >}}
<!--
The above manifest needs to be specified via the `--admission-control-config-file` to kube-apiserver.
-->
上面的清單需要通過 `——admission-control-config-file` 指定到 kube-apiserver。
{{< /note >}}

{{< note >}}
<!--
The above manifest needs to be specified via the `--admission-control-config-file` to kube-apiserver.
-->
上面的清單需要通過 `--admission-control-config-file` 指定給 kube-apiserver。
{{< /note >}}


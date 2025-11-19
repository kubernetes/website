---
layout: blog
title: '向 Client-Go 引入特性門控：增強靈活性和控制力'
date: 2024-08-12
slug: feature-gates-in-client-go
author: >
 Ben Luddy (Red Hat),
 Lukasz Szaszkiewicz (Red Hat)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: 'Introducing Feature Gates to Client-Go: Enhancing Flexibility and Control'
date: 2024-08-12
slug: feature-gates-in-client-go
author: >
 Ben Luddy (Red Hat),
 Lukasz Szaszkiewicz (Red Hat)
-->

<!--
Kubernetes components use on-off switches called _feature gates_ to manage the risk of adding a new feature.
The feature gate mechanism is what enables incremental graduation of a feature through the stages Alpha, Beta, and GA.
-->
Kubernetes 組件使用稱爲“特性門控（Feature Gates）”的開關來管理添加新特性的風險，
特性門控機制使特性能夠通過 Alpha、Beta 和 GA 階段逐步升級。

<!--
Kubernetes components, such as kube-controller-manager and kube-scheduler, use the client-go library to interact with the API. 
The same library is used across the Kubernetes ecosystem to build controllers, tools, webhooks, and more. client-go now includes 
its own feature gating mechanism, giving developers and cluster administrators more control over how they adopt client features.
-->
Kubernetes 組件（例如 kube-controller-manager 和 kube-scheduler）使用 client-go 庫與 API 交互，
整個 Kubernetes 生態系統使用相同的庫來構建控制器、工具、webhook 等。
client-go 現在包含自己的特性門控機制，使開發人員和叢集管理員能夠更好地控制如何使用客戶端特性。

<!--
To learn more about feature gates in Kubernetes, visit [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
要了解有關 Kubernetes 中特性門控的更多信息，請參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
## Motivation

In the absence of client-go feature gates, each new feature separated feature availability from enablement in its own way, if at all. 
Some features were enabled by updating to a newer version of client-go. Others needed to be actively configured in each program that used them. 
A few were configurable at runtime using environment variables. Consuming a feature-gated functionality exposed by the kube-apiserver sometimes 
required a client-side fallback mechanism to remain compatible with servers that don’t support the functionality due to their age or configuration. 
In cases where issues were discovered in these fallback mechanisms, mitigation required updating to a fixed version of client-go or rolling back.
-->
## 動機

在沒有 client-go 特性門控的情況下，每個新特性都以自己的方式（如果有的話）將特性可用性與特性的啓用分開。
某些特性可通過更新到較新版本的 client-go 來啓用，其他特性則需要在每個使用它們的程序中進行主動設定，
其中一些可在運行時使用環境變量進行設定。使用 kube-apiserver 公開的特性門控功能時，有時需要客戶端回退機制，
以保持與由於版本新舊或設定不同而不支持該特性伺服器的兼容性。
如果在這些回退機制中發現問題，則緩解措施需要更新到 client-go 的固定版本或回滾。

<!--
None of these approaches offer good support for enabling a feature by default in some, but not all, programs that consume client-go. 
Instead of enabling a new feature at first only for a single component, a change in the default setting immediately affects the default 
for all Kubernetes components, which broadens the blast radius significantly.
-->
這些方法都無法很好地支持爲某些（但不是全部）使用 client-go 的程序默認啓用特性。
默認設置的更改不會首先僅爲單個組件啓用新特性，而是會立即影響所有 Kubernetes 組件的默認設置，從而大大擴大影響半徑。

<!--
## Feature gates in client-go

To address these challenges, substantial client-go features will be phased in using the new feature gate mechanism. 
It will allow developers and users to enable or disable features in a way that will be familiar to anyone who has experience 
with feature gates  in the Kubernetes components.
-->
## client-go 中的特性門控

爲了應對這些挑戰，大量的 client-go 特性將使用新的特性門控機制來逐步引入。
這一機制將允許開發人員和使用者以類似 Kubernetes 組件特性門控的管理方式啓用或禁用特性。

<!--
Out of the box, simply by using a recent version of client-go, this offers several benefits.

For people who use software built with client-go:
-->
作爲一種開箱即用的能力，使用者只需使用最新版本的 client-go。這種設計帶來多種好處。

對於使用通過 client-go 構建的軟件的使用者：

<!--
* Early adopters can enable a default-off client-go feature on a per-process basis.
* Misbehaving features can be disabled without building a new binary.
* The state of all known client-go feature gates is logged, allowing users to inspect it.
-->
* 早期採用者可以針對各個進程分別啓用默認關閉的 client-go 特性。
* 無需構建新的二進制文件即可禁用行爲不當的特性。
* 所有已知的 client-go 特性門控的狀態都會被記錄到日誌中，允許使用者檢查。

<!--
For people who develop software built with client-go:

* By default, client-go feature gate overrides are read from environment variables. 
  If a bug is found in a client-go feature, users will be able to disable it without waiting for a new release.
* Developers can replace the default environment-variable-based overrides in a program to change defaults, 
  read overrides from another source, or disable runtime overrides completely. 
  The Kubernetes components use this customizability to integrate client-go feature gates with 
  the existing `--feature-gates` command-line flag, feature enablement metrics, and logging.
-->
對於開發使用 client-go 構建的軟件的人員：

* 默認情況下，client-go 特性門控覆蓋是從環境變量中讀取的。
  如果在 client-go 特性中發現錯誤，使用者將能夠禁用它，而無需等待新版本發佈。
* 開發人員可以替換程序中基於默認環境變量的覆蓋值以更改默認值、從其他源讀取覆蓋值或完全禁用運行時覆蓋值。
  Kubernetes 組件使用這種可定製性將 client-go 特性門控與現有的 `--feature-gates` 命令列標誌、特性啓用指標和日誌記錄集成在一起。

<!--
## Overriding client-go feature gates

**Note**: This describes the default method for overriding client-go feature gates at runtime. 
It can be disabled or customized by the developer of a particular program. 
In Kubernetes components, client-go feature gate overrides are controlled by the `--feature-gates` flag.

Features of client-go can be enabled or disabled by setting environment variables prefixed with `KUBE_FEATURE`. 
For example, to enable a feature named `MyFeature`, set the environment variable as follows:
-->
## 覆蓋 client-go 特性門控

**注意**：這描述了在運行時覆蓋 client-go 特性門控的默認方法，它可以由特定程序的開發人員禁用或自定義。
在 Kubernetes 組件中，client-go 特性門控覆蓋由 `--feature-gates` 標誌控制。

可以通過設置以 `KUBE_FEATURE` 爲前綴的環境變量來啓用或禁用 client-go 的特性。
例如，要啓用名爲 `MyFeature` 的特性，請按如下方式設置環境變量：

```shell
KUBE_FEATURE_MyFeature=true
```

<!--
To disable the feature, set the environment variable to `false`:
-->
要禁用特性，可將環境變量設置爲 `false`：

```shell
KUBE_FEATURE_MyFeature=false
```

<!--
**Note**: Environment variables are case-sensitive on some operating systems. 
Therefore, `KUBE_FEATURE_MyFeature` and `KUBE_FEATURE_MYFEATURE` would be considered two different variables.
-->
**注意**：在某些操作系統上，環境變量區分大小寫。
因此，`KUBE_FEATURE_MyFeature` 和 `KUBE_FEATURE_MYFEATURE` 將被視爲兩個不同的變量。

<!--
## Customizing client-go feature gates

The default environment-variable based mechanism for feature gate overrides can be sufficient for many programs in the Kubernetes ecosystem, 
and requires no special integration. Programs that require different behavior can replace it with their own custom feature gate provider. 
This allows a program to do things like force-disable a feature that is known to work poorly, 
read feature gates directly from a remote configuration service, or accept feature gate overrides through command-line options.
-->
## 自定義 client-go 特性門控

基於環境變量的默認特性門控覆蓋機制足以滿足 Kubernetes 生態系統中許多程序的需求，無需特殊集成。
需要不同行爲的程序可以用自己的自定義特性門控提供程序替換它。
這允許程序執行諸如強制禁用已知運行不良的特性、直接從遠程設定服務讀取特性門控或通過命令列選項接受特性門控覆蓋等操作。

<!--
The Kubernetes components replace client-go’s default feature gate provider with a shim to the existing Kubernetes feature gate provider. 
For all practical purposes, client-go feature gates are treated the same as other Kubernetes 
feature gates: they are wired to the `--feature-gates` command-line flag, included in feature enablement metrics, and logged on startup.
-->
Kubernetes 組件將 client-go 的默認特性門控提供程序替換爲現有 Kubernetes 特性門控提供程序的轉換層。
在所有實際應用場合中，client-go 特性門控與其他 Kubernetes 特性門控的處理方式相同：
它們連接到 `--feature-gates` 命令列標誌，包含在特性啓用指標中，並在啓動時記錄。

<!--
To replace the default feature gate provider, implement the Gates interface and call ReplaceFeatureGates 
at package initialization time, as in this simple example:
-->
要替換默認的特性門控提供程序，請實現 Gates 接口並在包初始化時調用 ReplaceFeatureGates，如以下簡單示例所示：

```go
import (
 "k8s.io/client-go/features"
)

type AlwaysEnabledGates struct{}

func (AlwaysEnabledGates) Enabled(features.Feature) bool {
 return true
}

func init() {
 features.ReplaceFeatureGates(AlwaysEnabledGates{})
}
```

<!--
Implementations that need the complete list of defined client-go features can get it by implementing the Registry interface 
and calling `AddFeaturesToExistingFeatureGates`. 
For a complete example, refer to [the usage within Kubernetes](https://github.com/kubernetes/kubernetes/blob/64ba17c605a41700f7f4c4e27dca3684b593b2b9/pkg/features/kube_features.go#L990-L997).
-->
需要定義的 client-go 特性完整列表的實現可以通過實現 Registry 接口並調用 `AddFeaturesToExistingFeatureGates` 來獲取它。
完整示例請參考
[Kubernetes 內部使用](https://github.com/kubernetes/kubernetes/blob/64ba17c605a41700f7f4c4e27dca3684b593b2b9/pkg/features/kube_features.go#L990-L997)。

<!--
## Summary

With the introduction of feature gates in client-go v1.30, rolling out a new client-go feature has become safer and easier. 
Users and developers can control the pace of their own adoption of client-go features. 
The work of Kubernetes contributors is streamlined by having a common mechanism for graduating features that span both sides of the Kubernetes API boundary.
-->
## 總結

隨着 client-go v1.30 中特性門控的引入，推出新的 client-go 特性變得更加安全、簡單。
使用者和開發人員可以控制自己採用 client-go 特性的步伐。
通過爲跨 Kubernetes API 邊界兩側的特性提供一種通用的培育機制，Kubernetes 貢獻者的工作得到了簡化。

<!--
Special shoutout to [@sttts](https://github.com/sttts) and [@deads2k](https://github.com/deads2k) for their help in shaping this feature.
-->
特別感謝 [@sttts](https://github.com/sttts) 和 [@deads2k](https://github.com/deads2k) 對此特性提供的幫助。

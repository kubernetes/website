---
title: kubectl 的用法約定
content_type: concept
weight: 60
---
<!--
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
Recommended usage conventions for `kubectl`.
-->
`kubectl` 的推薦用法約定。


<!-- body -->

<!--
## Using `kubectl` in Reusable Scripts
-->
## 在可重用腳本中使用 `kubectl` {#using-kubectl-in-reusable-scripts}

<!--
For a stable output in a script:
-->
對於腳本中的穩定輸出：

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Don't rely on context, preferences, or other implicit states.
-->

* 請求一個面向機器的輸出格式，例如 `-o name`、`-o json`、`-o yaml`、`-o go template` 或 `-o jsonpath`。
* 完全限定版本。例如 `jobs.v1.batch/myjob`。這將確保 kubectl 不會使用其默認版本，該版本會隨着時間的推移而更改。
* 不要依賴上下文、首選項或其他隱式狀態。

<!--
## Subresources
-->
## 子資源    {#subresources}

<!--
* You can use the `--subresource` argument for kubectl subcommands such as `get`, `patch`,
`edit`, `apply` and `replace` to fetch and update subresources for all resources that
support them. In Kubernetes version {{< skew currentVersion >}}, only the `status`, `scale`
and `resize` subresources are supported.
  * For `kubectl edit`, the `scale` subresource is not supported. If you use  `--subresource` with
    `kubectl edit` and specify `scale` as the subresource, the command will error out.
* The API contract against a subresource is identical to a full resource. While updating the
`status` subresource to a new value, keep in mind that the subresource could be potentially
reconciled by a controller to a different value.
-->

* 你可以將 `--subresource` 參數用於 kubectl 命令，例如 `get`、`patch`、`edit`、`apply` 和 `replace`
  來獲取和更新所有支持子資源的資源的子資源。Kubernetes {{< skew currentVersion >}} 版本中，
  僅支持 `status`, `scale` 和 `resize` 子資源。
  * 對於 `kubectl edit`，不支持 `scale` 子資源。如果將 `--subresource` 與 `kubectl edit` 一起使用，
    並指定 `scale` 作爲子資源，則命令將會報錯。
* 針對子資源的 API 協定與完整資源相同。在更新 `status` 子資源爲一個新值時，請記住，
  子資源可能是潛在的由控制器調和爲不同的值。

<!--
## Best Practices
-->
## 最佳實踐 {#best-practices}

### `kubectl run`

<!--
For `kubectl run` to satisfy infrastructure as code:
-->
若希望 `kubectl run` 滿足基礎設施即代碼的要求：

<!--
* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
-->

* 使用特定版本的標籤標記鏡像，不要將該標籤改爲新版本。例如使用 `:v1234`、`v1.2.3`、`r03062016-1-4`，
  而不是 `:latest`（有關詳細信息，請參閱[配置的最佳實踐](/zh-cn/docs/concepts/configuration/overview/#container-images))。
* 使用基於版本控制的腳本來運行包含大量參數的鏡像。
* 對於無法通過 `kubectl run` 參數來表示的功能特性，使用基於源碼控制的配置文件，以記錄要使用的功能特性。

<!--
You can use the `--dry-run=client` flag to preview the object that would be sent to your cluster, without really submitting it.
-->
你可以使用 `--dry-run=client` 參數來預覽而不真正提交即將下發到集羣的對象實例：

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->
* 你可以使用 `kubectl apply` 命令創建或更新資源。有關使用 kubectl apply 更新資源的詳細信息，請參閱 [Kubectl 文檔](https://kubectl.docs.kubernetes.io)。

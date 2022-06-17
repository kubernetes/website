---
title: kubectl 的用法約定
content_type: concept
---
<!--
title: kubectl Usage Conventions
reviewers:
- janetkuo
content_type: concept
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
## 在可重用指令碼中使用 `kubectl` {#using-kubectl-in-reusable-scripts}

<!--
For a stable output in a script:
-->
對於指令碼中的穩定輸出：

<!--
* Request one of the machine-oriented output forms, such as `-o name`, `-o json`, `-o yaml`, `-o go-template`, or `-o jsonpath`.
* Fully-qualify the version. For example, `jobs.v1.batch/myjob`. This will ensure that kubectl does not use its default version that can change over time.
* Don't rely on context, preferences, or other implicit states.
-->

* 請求一個面向機器的輸出格式，例如 `-o name`、`-o json`、`-o yaml`、`-o go template` 或 `-o jsonpath`。
* 完全限定版本。例如 `jobs.v1.batch/myjob`。這將確保 kubectl 不會使用其預設版本，該版本會隨著時間的推移而更改。
* 不要依賴上下文、首選項或其他隱式狀態。

<!--
## Subresources
-->
## 子資源    {#subresources}

<!--
* You can use the `--subresource` alpha flag for kubectl commands like `get`, `patch`,
`edit` and `replace` to fetch and update subresources for all resources that
support them. Currently, only the `status` and `scale` subresources are supported.
* The API contract against a subresource is identical to a full resource. While updating the
`status` subresource to a new value, keep in mind that the subresource could be potentially
reconciled by a controller to a different value.
-->

* 你可以將 `--subresource` alpha 標誌用於 kubectl 命令，例如 `get`、`patch`、`edit` 和 `replace`
  來獲取和更新所有支援子資源的資源的子資源。目前，僅支援 `status` 和 `scale` 子資源。
* 針對子資源的 API 協定與完整資源相同。在更新 `status` 子資源為一個新值時，請記住，
  子資源可能是潛在的由控制器調和為不同的值。

<!--
## Best Practices
-->
## 最佳實踐 {#best-practices}

### `kubectl run`

<!--
For `kubectl run` to satisfy infrastructure as code:
-->
若希望 `kubectl run` 滿足基礎設施即程式碼的要求：

<!--
* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.
-->

* 使用特定版本的標籤標記映象，不要將該標籤改為新版本。例如使用 `:v1234`、`v1.2.3`、`r03062016-1-4`，
  而不是 `:latest`（有關詳細資訊，請參閱[配置的最佳實踐](/zh-cn/docs/concepts/configuration/overview/#container-images))。
* 使用基於版本控制的指令碼來執行包含大量引數的映象。
* 對於無法透過 `kubectl run` 引數來表示的功能特性，使用基於原始碼控制的配置檔案，以記錄要使用的功能特性。

<!--
You can use the `--dry-run=client` flag to preview the object that would be sent to your cluster, without really submitting it.
-->
你可以使用 `--dry-run=client` 引數來預覽而不真正提交即將下發到叢集的物件例項：

### `kubectl apply`

<!--
* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).
-->
* 你可以使用 `kubectl apply` 命令建立或更新資源。有關使用 kubectl apply 更新資源的詳細資訊，請參閱 [Kubectl 文件](https://kubectl.docs.kubernetes.io)。

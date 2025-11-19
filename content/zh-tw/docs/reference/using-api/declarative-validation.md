---
title: 聲明式 API 驗證
content_type: concept
weight: 20
---
<!--
title: Declarative API Validation
reviewers:
- aaron-prindle
- yongruilin
- jpbetz
- thockin
content_type: concept
weight: 20
-->

{{< feature-state for_k8s_version="v1.33" state="beta" >}}

<!--
Kubernetes {{< skew currentVersion >}} includes optional _declarative validation_ for APIs. When enabled, the Kubernetes API server can use this mechanism rather than the legacy approach that relies on hand-written Go
code (`validation.go` files) to ensure that requests against the API are valid.
Kubernetes developers, and people [extending the Kubernetes API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/),
can define validation rules directly alongside the API type definitions (`types.go` files). Code authors define
pecial comment tags (e.g., `+k8s:minimum=0`). A code generator (`validation-gen`) then uses these tags to produce
optimized Go code for API validation.
-->
Kubernetes {{< skew currentVersion >}} 包含可選用於 API的**聲明式驗證**特性。
當啓用時，Kubernetes API 服務器可以使用此機制而不是依賴手寫的
Go 代碼（`validation.go` 文件）來確保針對 API 的請求是有效的。
Kubernetes 開發者和[擴展 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
的人員可以直接在 API 類型定義（`types.go` 文件）旁邊定義驗證規則。
代碼作者定義特殊的註釋標籤（例如，`+k8s:minimum=0`）。
然後，一個代碼生成器（`validation-gen`）會使用這些標籤來生成用於 API 驗證的優化 Go 代碼。

<!--
While primarily a feature impacting Kubernetes contributors and potentially developers of [extension API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), cluster administrators should understand its behavior, especially during its rollout phases.
-->
雖然這個特性主要影響 Kubernetes
貢獻者和潛在的[擴展 API 服務器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)開發者，
但集羣管理員應瞭解其行爲，特別是在其推出階段。

<!--
Declarative validation is being rolled out gradually.
In Kubernetes {{< skew currentVersion >}}, the APIs that use declarative validation include:

* [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)
-->
聲明式驗證正在逐步推出。
在 Kubernetes {{< skew currentVersion >}} 中，使用聲明式驗證的 API 包括：

* [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)

{{< note >}}
<!--
For the beta of this feature, Kubernetes is intentionally using a superseded API as a test bed for the change.
Future Kubernetes releases may roll this out to more APIs.
-->
對於此特性的 Beta 版，Kubernetes 故意使用一個被取代的 API 作爲變更的試驗場。
未來的 Kubernetes 版本可能會將此更改推廣到更多 API。
{{< /note >}}

<!--
*   `DeclarativeValidation`: (Beta, Default: `true`) When enabled, the API server runs *both* the new declarative validation and the old hand-written validation for migrated types/fields. The results are compared internally.
*   `DeclarativeValidationTakeover`: (Beta, Default: `false`) This gate determines which validation result is *authoritative* (i.e., returned to the user and used for admission decisions).
-->
* `DeclarativeValidation：（Beta， 默認值：`true`）當啓用時，
   API 服務器對遷移的類型/字段同時運行新的聲明式驗證和舊的手寫驗證。結果在內部進行比較。
* `DeclarativeValidationTakeover`**：（Beta， 默認值：`false`）
   此開關決定哪個驗證結果是**權威的**（即返回給用戶並用於准入決策）。

<!--
**Default Behavior (Kubernetes {{< skew currentVersion >}}):**

*   With `DeclarativeValidation=true` and `DeclarativeValidationTakeover=false` (the default values for the gates), both validation systems run.
*   **The results of the *hand-written* validation are used.** The declarative validation runs in a mismatch mode for comparison.
*   Mismatches between the two validation systems are logged by the API server and increment the `declarative_validation_mismatch_total` metric. This helps developers identify and fix discrepancies during the Beta phase.
*   **Cluster upgrades should be safe** regarding this feature, as the authoritative validation logic doesn't change by default.
-->
**默認行爲（Kubernetes {{< skew currentVersion >}}）：**

* 當 `DeclarativeValidation=true` 和 `DeclarativeValidationTakeover=false` （開關的默認值），兩種驗證系統都會運行。
* **使用手寫驗證的結果。**聲明式驗證以不匹配模式運行進行比較。
* 兩種驗證系統之間的不匹配將由 API 服務器記錄，並增加
  `declarative_validation_mismatch_total` 指標。這有助於開發人員在
  Beta 階段識別並修復不一致之處。
* 關於此特性的**集羣升級應該是安全的**，默認情況下權威的驗證邏輯不會改變。

<!--
Administrators can choose to explicitly enable `DeclarativeValidationTakeover=true` to make the *declarative* validation authoritative for migrated fields, typically after verifying stability in their environment (e.g., by monitoring the mismatch metric).
-->
管理員可以選擇顯式啓用 `DeclarativeValidationTakeover=true`
以使**聲明式**驗證對於遷移的字段具有權威性，通常是在驗證其環境中的穩定性之後
（例如，通過監控不匹配指標）。

<!--
## Disabling declarative validation {#opt-out}

As a cluster administrator, you might consider disabling declarative validation whilst it is still beta, under specific circumstances:
-->
## 禁用聲明式驗證 {#opt-out}

作爲集羣管理員，在特定情況下，你可能會考慮在聲明式驗證仍然是測試版時禁用它：

<!--
*   **Unexpected Validation Behavior:** If enabling `DeclarativeValidationTakeover` leads to unexpected validation errors or allows objects that were previously invalid.
*   **Performance Regressions:** If monitoring indicates significant latency increases (e.g., in `apiserver_request_duration_seconds`) correlated with the feature's enablement.
*   **High Mismatch Rate:** If the `declarative_validation_mismatch_total` metric shows frequent mismatches, suggesting potential bugs in the declarative rules affecting the cluster's workloads, even if `DeclarativeValidationTakeover` is false.
-->
* **意外的驗證行爲：** 如果啓用 `DeclarativeValidationTakeover`
  導致了未預期的驗證錯誤或允許之前無效的對象。
* **性能迴歸：** 如果監控顯示顯著的延遲增加（例如，在 `apiserver_request_duration_seconds` 中），
  且與該特性的啓用相關聯。
* **不匹配率高：** 如果 `declarative_validation_mismatch_total`
  指標顯示出頻繁的不匹配，這暗示聲明式規則中可能存在影響集羣工作負載的潛在錯誤，
  即使 `DeclarativeValidationTakeover` 爲 false。

<!--
To revert to only using hand-written validation (as used before Kubernetes v1.33), disable the `DeclarativeValidation` feature gate, for example
via command-line arguments: (`--feature-gates=DeclarativeValidation=false`). This also implicitly disables the effect of `DeclarativeValidationTakeover`.
-->
要恢復爲僅使用手寫驗證（如 Kubernetes v1.33 之前所用），請禁用
`DeclarativeValidation` 特性門控，例如
通過命令行參數：(`--feature-gates=DeclarativeValidation=false`)。
這也會隱式禁用 `DeclarativeValidationTakeover` 的效果。

<!--
## Considerations for downgrade and rollback

Disabling the feature acts as a safety mechanism. However, be aware of a potential edge case (considered unlikely due to extensive testing): If a bug in declarative validation (when `DeclarativeValidationTakeover=true`) *incorrectly allowed* an invalid object to be persisted, disabling the feature gates might then cause subsequent updates to that specific object to be blocked by the now-authoritative (and correct) hand-written validation. Resolving this might require manual correction of the stored object, potentially via direct etcd modification in rare cases.

For details on managing feature gates, see [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
## 降級和回滾的考慮事項

禁用特性特性充當一種安全機制。然而，要注意一個潛在的極端情況
（由於廣泛測試，這種情況被認爲是不太可能發生的）：
如果聲明式驗證中存在一個錯誤（當 `DeclarativeValidationTakeover=true` 時）
**錯誤地允許**無效對象被持久化，那麼禁用特性門可能會導致後續對該特定對象的更新被現在權威的（且正確的）
手寫驗證所阻止。解決此問題可能需要手動更正存儲的對象，在極少數情況下，可能需要通過直接修改 etcd 來進行。

有關管理特性門控的詳細信息，請參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

---
title: 使用 CustomResourceDefinition 擴充套件 Kubernetes API
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
---
<!--
title: Extend the Kubernetes API with CustomResourceDefinitions
reviewers:
- deads2k
- jpbetz
- liggitt
- roycaihw
- sttts
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
-->

<!-- overview -->
<!--
This page shows how to install a
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
into the Kubernetes API by creating a
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).
-->
本頁展示如何使用
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io)
將
[定製資源（Custom Resource）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
安裝到 Kubernetes API 上。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you are using an older version of Kubernetes that is still supported, switch to
the documentation for that version to see advice that is relevant for your cluster.
-->
如果你在使用較老的、仍處於被支援範圍的 Kubernetes 版本，請切換到該版本的
文件檢視對於的叢集而言有用的建議。

<!-- steps -->

<!--
## Create a CustomResourceDefinition

When you create a new CustomResourceDefinition (CRD), the Kubernetes API Server
creates a new RESTful resource path for each version you specify. The CRD can be
either namespaced or cluster-scoped, as specified in the CRD's `scope` field. As
with existing built-in objects, deleting a namespace deletes all custom objects
in that namespace. CustomResourceDefinitions themselves are non-namespaced and
are available to all namespaces.

For example, if you save the following CustomResourceDefinition to `resourcedefinition.yaml`:
-->
## 建立 CustomResourceDefinition  {#create-a-customresourcedefinition}

當你建立新的 CustomResourceDefinition（CRD）時，Kubernetes API 伺服器會為你所
指定的每一個版本生成一個 RESTful 的 資源路徑。CRD 可以是名字空間作用域的，也可以
是叢集作用域的，取決於 CRD 的 `scope` 欄位設定。和其他現有的內建物件一樣，刪除
一個名字空間時，該名字空間下的所有定製物件也會被刪除。CustomResourceDefinition
本身是不受名字空間限制的，對所有名字空間可用。

例如，如果你將下面的 CustomResourceDefinition 儲存到 `resourcedefinition.yaml`
檔案：

<!--
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.stable.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: stable.example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
    - name: v1
      # Each version can be enabled/disabled by Served flag.
      served: true
      # One and only one version must be marked as the storage version.
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the PascalCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```
-->
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # 名字必需與下面的 spec 欄位匹配，並且格式為 '<名稱的複數形式>.<組名>'
  name: crontabs.stable.example.com
spec:
  # 組名稱，用於 REST API: /apis/<組>/<版本>
  group: stable.example.com
  # 列舉此 CustomResourceDefinition 所支援的版本
  versions:
    - name: v1
      # 每個版本都可以透過 served 標誌來獨立啟用或禁止
      served: true
      # 其中一個且只有一個版本必需被標記為儲存版本
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名稱的複數形式，用於 URL：/apis/<組>/<版本>/<名稱的複數形式>
    plural: crontabs
    # 名稱的單數形式，作為命令列使用時和顯示時的別名
    singular: crontab
    # kind 通常是單數形式的帕斯卡編碼（PascalCased）形式。你的資源清單會使用這一形式。
    kind: CronTab
    # shortNames 允許你在命令列使用較短的字串來匹配資源
    shortNames:
    - ct
```

<!--
and create it:
-->
之後建立它：

```shell
kubectl apply -f resourcedefinition.yaml
```

<!--
Then a new namespaced RESTful API endpoint is created at:
-->
這樣一個新的受名字空間約束的 RESTful API 端點會被建立在：

```
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

<!--
This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` from the spec of the
CustomResourceDefinition object you created above.

It might take a few seconds for the endpoint to be created.
You can watch the `Established` condition of your CustomResourceDefinition
to be true or watch the discovery information of the API server for your
resource to show up.
-->
此端點 URL 自此可以用來建立和管理定製物件。物件的 `kind` 將是來自你上面建立時
所用的 spec 中指定的 `CronTab`。

建立端點的操作可能需要幾秒鐘。你可以監測你的 CustomResourceDefinition 的
`Established` 狀況變為 true，或者監測 API 伺服器的發現資訊等待你的資源出現在
那裡。

<!--
## Create custom objects

After the CustomResourceDefinition object has been created, you can create
custom objects. Custom objects can contain custom fields. These fields can
contain arbitrary JSON.
In the following example, the `cronSpec` and `image` custom fields are set in a
custom object of kind `CronTab`.  The kind `CronTab` comes from the spec of the
CustomResourceDefinition object you created above.

If you save the following YAML to `my-crontab.yaml`:
-->
## 建立定製物件   {#create-custom-objects}

在建立了 CustomResourceDefinition 物件之後，你可以建立定製物件（Custom
Objects）。定製物件可以包含定製欄位。這些欄位可以包含任意的 JSON 資料。
在下面的例子中，在類別為 `CrontTab` 的定製物件中，設定了`cronSpec` 和 `image`
定製欄位。類別 `CronTab` 來自你在上面所建立的 CRD 的規約。

如果你將下面的 YAML 儲存到 `my-crontab.yaml`：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

<!--
and create it:
-->
並執行建立命令：

```shell
kubectl apply -f my-crontab.yaml
```

<!--
You can then manage your CronTab objects using kubectl. For example:
-->
你就可以使用 kubectl 來管理你的 CronTab 物件了。例如：

```shell
kubectl get crontab
```

<!--
Should print a list like this:
-->
應該會輸出如下列表：

```none
NAME                 AGE
my-new-cron-object   6s
```

<!--
Resource names are not case-sensitive when using kubectl, and you can use either
the singular or plural forms defined in the CRD, as well as any short names.

You can also view the raw YAML data:
-->
使用 kubectl 時，資源名稱是大小寫不敏感的，而且你既可以使用 CRD 中所定義的單數
形式或複數形式，也可以使用其短名稱：

```shell
kubectl get ct -o yaml
```

<!--
You should see that it contains the custom `cronSpec` and `image` fields
from the YAML you used to create it:
-->
你可以看到輸出中包含了你建立定製物件時在 YAML 檔案中指定的定製欄位 `cronSpec`
和 `image`：

```yaml
apiVersion: v1
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    annotations:
      kubectl.kubernetes.io/last-applied-configuration: |
        {"apiVersion":"stable.example.com/v1","kind":"CronTab","metadata":{"annotations":{},"name":"my-new-cron-object","namespace":"default"},"spec":{"cronSpec":"* * * * */5","image":"my-awesome-cron-image"}}
    creationTimestamp: "2021-06-20T07:35:27Z"
    generation: 1
    name: my-new-cron-object
    namespace: default
    resourceVersion: "1326"
    uid: 9aab1d66-628e-41bb-a422-57b8b3b1f5a9
  spec:
    cronSpec: '* * * * */5'
    image: my-awesome-cron-image
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

<!--
## Delete a CustomResourceDefinition

When you delete a CustomResourceDefinition, the server will uninstall the RESTful API endpoint
and delete all custom objects stored in it.
-->
## 刪除 CustomResourceDefinition    {#delete-a-customresourcedefinition}

當你刪除某 CustomResourceDefinition 時，伺服器會解除安裝其 RESTful API
端點，並刪除伺服器上儲存的所有定製物件。

```shell
kubectl delete -f resourcedefinition.yaml
kubectl get crontabs
```

```none
Error from server (NotFound): Unable to list {"stable.example.com" "v1" "crontabs"}: the server could not find the requested resource (get crontabs.stable.example.com)
```

<!--
If you later recreate the same CustomResourceDefinition, it will start out empty.
-->
如果你在以後建立相同的 CustomResourceDefinition 時，該 CRD 會是一個空的結構。

<!--
## Specifying a structural schema

CustomResources store structured data in custom fiels (alongside the built-in
fields `apiVersion`, `kind` and `metadata`, which the API server validates
implicitly). With [OpenAPI v3.0 validation](#validation) a schema can be
specified, which is validated during creation and updates, compare below for
details and limits of such a schema.

With `apiextensions.k8s.io/v1` the definition of a structural schema is
mandatory for CustomResourceDefinitions. In the beta version of
CustomResourceDefinition, structural schemas were optional.
-->
## 設定結構化的模式   {#specifying-a-structural-schema}

CustomResource 物件在定製欄位中儲存結構化的資料，這些欄位和內建的欄位
`apiVersion`、`kind` 和 `metadata` 等一起儲存，不過內建的欄位都會被 API
伺服器隱式完成合法性檢查。有了 [OpenAPI v3.0 檢查](#validation)
能力之後，你可以設定一個模式（Schema），在建立和更新定製物件時，這一模式會被用來
對物件內容進行合法性檢查。參閱下文了解這類模式的細節和侷限性。

在 `apiextensions.k8s.io/v1` 版本中，CustomResourceDefinition 的這一結構化模式
定義是必需的。
在 CustomResourceDefinition 的 beta 版本中，結構化模式定義是可選的。

<!--
A structural schema is an [OpenAPI v3.0 validation schema](#validation) which:

1. specifies a non-empty type (via `type` in OpenAPI) for the root, for each specified field of an object node (via `properties` or `additionalProperties` in OpenAPI) and for each item in an array node (via `items` in OpenAPI), with the exception of:
   * a node with `x-kubernetes-int-or-string: true`
   * a node with `x-kubernetes-preserve-unknown-fields: true`
2. for each field in an object and each item in an array which is specified within any of `allOf`, `anyOf`, `oneOf` or `not`, the schema also specifies the field/item outside of those logical junctors (compare example 1 and 2).
3. does not set `description`, `type`, `default`, `additionalProperties`, `nullable` within an `allOf`, `anyOf`, `oneOf` or `not`, with the exception of the two pattern for `x-kubernetes-int-or-string: true` (see below).
4. if `metadata` is specified, then only restrictions on `metadata.name` and `metadata.generateName` are allowed.
-->
結構化模式本身是一個 [OpenAPI v3.0 驗證模式](#validation)，其中：

1. 為物件根（root）設定一個非空的 type 值（藉由 OpenAPI 中的 `type`），對每個
   object 節點的每個欄位（藉由 OpenAPI 中的 `properties` 或 `additionalProperties`）以及
   array 節點的每個條目（藉由 OpenAPI 中的 `items`）也要設定非空的 type 值，
   除非：
   * 節點包含屬性 `x-kubernetes-int-or-string: true`
   * 節點包含屬性 `x-kubernetes-preserve-unknown-fields: true`
2. 對於 object 的每個欄位或 array 中的每個條目，如果其定義中包含 `allOf`、`anyOf`、`oneOf`
   或 `not`，則模式也要指定這些邏輯組合之外的欄位或條目（試比較例 1 和例 2)。
3. 在 `allOf`、`anyOf`、`oneOf` 或 `not` 上下文內不設定 `description`、`type`、`default`、
   `additionalProperties` 或者 `nullable`。此規則的例外是
   `x-kubernetes-int-or-string` 的兩種模式（見下文）。
4. 如果 `metadata` 被設定，則只允許對 `metadata.name` 和 `metadata.generateName` 設定約束。

<!--
Non-structural example 1:
-->
非結構化的例 1:

```yaml
allOf:
- properties:
    foo:
      ...
```

<!--
conflicts with rule 2. The following would be correct:
-->
違反了第 2 條規則。下面的是正確的：

```yaml
properties:
  foo:
    ...
allOf:
- properties:
    foo:
      ...
```

<!--
Non-structural example 2:
-->
非結構化的例 2：

```yaml
allOf:
- items:
    properties:
      foo:
        ...
```

<!--
conflicts with rule 2. The following would be correct:
-->
違反了第 2 條規則。下面的是正確的：

```yaml
items:
  properties:
    foo:
      ...
allOf:
- items:
    properties:
      foo:
        ...
```

<!--
Non-structural example 3:
-->
非結構化的例 3：

```yaml
properties:
  foo:
    pattern: "abc"
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
      finalizers:
        type: array
        items:
          type: string
          pattern: "my-finalizer"
anyOf:
- properties:
    bar:
      type: integer
      minimum: 42
  required: ["bar"]
  description: "foo bar object"
```

<!--
is not a structural schema because of the following violations:

* the type at the root is missing (rule 1).
* the type of `foo` is missing (rule 1).
* `bar` inside of `anyOf` is not specified outside (rule 2).
* `bar`'s `type` is within `anyOf` (rule 3).
* the description is set within `anyOf` (rule 3).
* `metadata.finalizers` might not be restricted (rule 4).
-->
不是一個結構化的模式，因為其中存在以下違例：

* 根節點缺失 type 設定（規則 1）
* `foo` 的 type 缺失（規則 1）
* `anyOf` 中的 `bar` 未在外部指定（規則 2）
* `bar` 的 `type` 位於 `anyOf` 中（規則 3）
* `anyOf` 中設定了 `description` （規則 3）
* `metadata.finalizers` 不可以被限制 (規則 4）

<!--
In contrast, the following, corresponding schema is structural:
-->
作為對比，下面的 YAML 所對應的模式則是結構化的：

```yaml
type: object
description: "foo bar object"
properties:
  foo:
    type: string
    pattern: "abc"
  bar:
    type: integer
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
anyOf:
- properties:
    bar:
      minimum: 42
  required: ["bar"]
```

<!--
Violations of the structural schema rules are reported in the `NonStructural` condition in the CustomResourceDefinition.
-->
如果違反了結構化模式規則，CustomResourceDefinition 的 `NonStructural` 狀況中
會包含報告資訊。

<!--
### Field pruning

CustomResourceDefinitions store validated resource data in the cluster's persistence store, {{< glossary_tooltip term_id="etcd" text="etcd">}}. As with native Kubernetes resources such as {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, if you specify a field that the API server does not recognize, the unknown field  is _pruned_ (removed) before being persisted.
-->
### 欄位剪裁     {#field-pruning}

CustomResourceDefinition 在叢集的永續性儲存
{{< glossary_tooltip term_id="etcd" text="etcd">}}
中儲存經過合法性檢查的資源資料。
就像原生的 Kubernetes 資源，例如 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
如果你指定了 API 伺服器所無法識別的欄位，則該未知欄位會在儲存資源之前
被 _剪裁（Pruned）_ 掉（刪除）。

<!--
CRDs converted from `apiextensions.k8s.io/v1beta1` to
`apiextensions.k8s.io/v1` might lack structural schemas, and
`spec.preserveUnknownFields` might be `true`.

For legacy CustomResourceDefinition objects created as
`apiextensions.k8s.io/v1beta1` with `spec.preserveUnknownFields` set to
`true`, the following is also true:

* Pruning is not enabled.
* You can store arbitrary data.

For compatibility with `apiextensions.k8s.io/v1`, update your custom
resource definitions to:

1. Use a structural OpenAPI schema.
2. Set `spec.preserveUnknownFields` to `false`.
-->
{{< note >}}
從 `apiextensions.k8s.io/v1beta1` 轉換到 `apiextensions.k8s.io/v1` 的 CRD
可能沒有結構化的模式定義，因此其 `spec.preserveUnknownFields` 可能為 `true`。

對於使用 `apiextensions.k8s.io/v1beta1` 且將 `spec.preserveUnknownFields` 設定為 `true`
建立的舊 CustomResourceDefinition 物件，有以下表現：

* 裁剪未啟用。
* 可以儲存任意資料。

為了與 `apiextensions.k8s.io/v1` 相容，將你的定製資源定義更新為：

1. 使用結構化的 OpenAPI 模式。
2. `spec.preserveUnknownFields` 設定為 `false`。

{{< /note >}}

<!--
If you save the following YAML to `my-crontab.yaml`:
-->
如果你將下面的 YAML 儲存到 `my-crontab.yaml` 檔案：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  someRandomField: 42
```

<!--
and create it:
-->
並建立之：

```shell
kubectl create --validate=false -f my-crontab.yaml -o yaml
```

<!--
your output is similar to:
-->
輸出類似於：

```console
apiVersion: stable.example.com/v1
kind: CronTab
metadata:
  creationTimestamp: 2017-05-31T12:56:35Z
  generation: 1
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

<!--
Notice that the field `someRandomField` was pruned.
-->
注意其中的欄位 `someRandomField` 已經被剪裁掉。

<!--
This example turned off client-side validation to demonstrate the API server's behavior, by adding the `--validate=false` command line option.
Because the [OpenAPI validation schemas are also published](#publish-validation-schema-in-openapi-v2)
to clients, `kubectl` also checks for unknown fields and rejects those objects well before they would be sent to the API server.
-->
本例中透過 `--validate=false` 命令列選項 關閉了客戶端的合法性檢查以展示 API 伺服器的行為，
因為 [OpenAPI 合法性檢查模式也會發布到](#publish-validation-schema-in-openapi-v2)
客戶端，`kubectl` 也會檢查未知的欄位並在物件被髮送到 API
伺服器之前就拒絕它們。

<!--
#### Controlling pruning

By default, all unspecified fields for a custom resource, across all versions, are pruned. It is possible though to opt-out of that for specific sub-trees of fields by adding `x-kubernetes-preserve-unknown-fields: true` in the [structural OpenAPI v3 validation schema](#specifying-a-structural-schema).
For example:
-->
#### 控制剪裁   {#controlling-pruning}

預設情況下，定製資源的所有版本中的所有未規定的欄位都會被剪裁掉。
透過在結構化的 OpenAPI v3 [檢查模式定義](#specifying-a-structural-schema)
中為特定欄位的子樹新增 `x-kubernetes-preserve-unknown-fields: true` 屬性，可以
選擇不對其執行剪裁操作。
例如：

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
```

<!--
The field `json` can store any JSON value, without anything being pruned.

You can also partially specify the permitted JSON; for example:
-->
欄位 `json` 可以儲存任何 JSON 值，其中內容不會被剪裁掉。

你也可以部分地指定允許的 JSON 資料格式；例如：

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    description: this is arbitrary JSON
```

<!--
With this, only `object` type values are allowed.

Pruning is enabled again for each specified property (or `additionalProperties`):
-->
透過這樣設定，JSON 中只能設定 `object` 型別的值。

對於所指定的每個屬性（或 `additionalProperties`），剪裁會再次被啟用。

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    properties:
      spec:
        type: object
        properties:
          foo:
            type: string
          bar:
            type: string
```

<!--
With this, the value:
-->
對於上述定義，如果提供的數值如下：

```yaml
json:
  spec:
    foo: abc
    bar: def
    something: x
  status:
    something: x
```

<!--
is pruned to:
-->
則該值會被剪裁為：

```yaml
json:
  spec:
    foo: abc
    bar: def
  status:
    something: x
```

<!--
This means that the `something` field in the specified `spec` object is pruned, but everything outside is not.
-->
這意味著所指定的 `spec` 物件中的 `something` 欄位被剪裁掉，而其外部的內容都被保留。

<!--
### IntOrString

Nodes in a schema with `x-kubernetes-int-or-string: true` are excluded from rule 1, such that the following is structural:
-->
### IntOrString

模式定義中標記了 `x-kubernetes-int-or-string: true` 的節點不受前述規則 1
約束，因此下面的定義是結構化的模式：

```yaml
type: object
properties:
  foo:
    x-kubernetes-int-or-string: true
```

<!--
Also those nodes are partially excluded from rule 3 in the sense that the
following two patterns are allowed (exactly those, without variations in order
to additional fields):
-->
此外，所有這類節點也不再受規則 3 約束，也就是說，下面兩種模式是被允許的
（注意，僅限於這兩種模式，不支援新增新欄位的任何其他變種）：

```yaml
x-kubernetes-int-or-string: true
anyOf:
- type: integer
- type: string
...
```

和

```yaml
x-kubernetes-int-or-string: true
allOf:
- anyOf:
  - type: integer
  - type: string
- ... # zero or more
...
```

<!--
With one of those specification, both an integer and a string validate.

In [Validation Schema Publishing](#publish-validation-schema-in-openapi-v2),
`x-kubernetes-int-or-string: true` is unfolded to one of the two patterns shown above.
-->
在以上兩種規約中，整數值和字串值都會被認為是合法的。

在[合法性檢查模式定義的釋出時](#publish-validation-schema-in-openapi-v2)，
`x-kubernetes-int-or-string: true` 會被展開為上述兩種模式之一。

### RawExtension

<!--
RawExtensions (as in `runtime.RawExtension` defined in
[k8s.io/apimachinery](https://github.com/kubernetes/apimachinery/blob/03ac7a9ade429d715a1a46ceaa3724c18ebae54f/pkg/runtime/types.go#L94))
holds complete Kubernetes objects, i.e. with `apiVersion` and `kind` fields.

It is possible to specify those embedded objects (both completely without constraints or partially specified) by setting `x-kubernetes-embedded-resource: true`. For example:
-->
RawExtensions（就像在
[k8s.io/apimachinery](https://github.com/kubernetes/apimachinery/blob/03ac7a9ade429d715a1a46ceaa3724c18ebae54f/pkg/runtime/types.go#L94)
專案中 `runtime.RawExtension` 所定義的那樣）
可以儲存完整的 Kubernetes 物件，也就是，其中會包含 `apiVersion` 和 `kind`
欄位。

透過 `x-kubernetes-embedded-resource: true` 來設定這些巢狀物件的規約（無論是
完全無限制還是部分指定都可以）是可能的。例如：

```yaml
type: object
properties:
  foo:
    x-kubernetes-embedded-resource: true
    x-kubernetes-preserve-unknown-fields: true
```

<!--
Here, the field `foo` holds a complete object, e.g.:
-->
這裡，欄位 `foo` 包含一個完整的物件，例如：

```yaml
foo:
  apiVersion: v1
  kind: Pod
  spec:
    ...
```

<!--
Because `x-kubernetes-preserve-unknown-fields: true` is specified alongside,
nothing is pruned. The use of `x-kubernetes-preserve-unknown-fields: true` is
optional though.

With `x-kubernetes-embedded-resource: true`, the `apiVersion`, `kind` and `metadata` are implicitly specified and validated.
-->
由於欄位上設定了 `x-kubernetes-preserve-unknown-fields: true`，其中的內容不會
被剪裁。不過，在這個語境中，`x-kubernetes-preserve-unknown-fields: true` 的
使用是可選的。

設定了 `x-kubernetes-embedded-resource: true` 之後，`apiVersion`、`kind` 和
`metadata` 都是隱式設定並隱式完成合法性驗證。

<!--
## Serving multiple versions of a CRD

See [Custom resource definition versioning](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
for more information about serving multiple versions of your
CustomResourceDefinition and migrating your objects from one version to another.
-->
## 提供 CRD 的多個版本   {#serving-multiple-versions-of-a-crd}

關於如何為你的 CustomResourceDefinition 提供多個版本的支援，以及如何將你的物件
從一個版本遷移到另一個版本， 詳細資訊可參閱
[定製資源定義的版本](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)。

<!-- discussion -->

<!--
## Advanced topics

### Finalizers
-->
## 高階主題     {#advanced-topics}

### Finalizers

<!--
*Finalizers* allow controllers to implement asynchronous pre-delete hooks.
Custom objects support finalizers similar to built-in objects.

You can add a finalizer to a custom object like this:
-->
*Finalizer* 能夠讓控制器實現非同步的刪除前（Pre-delete）回撥。
與內建物件類似，定製物件也支援 Finalizer。

你可以像下面一樣為定製物件新增 Finalizer：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - stable.example.com/finalizer
```

<!--
Identifiers of custom finalizers consist of a domain name, a forward slash and the name of
the finalizer. Any controller can add a finalizer to any object's list of finalizers.

The first delete request on an object with finalizers sets a value for the
`metadata.deletionTimestamp` field but does not delete it. Once this value is set,
entries in the `finalizers` list can only be removed. While any finalizers remain it is also
impossible to force the deletion of an object.

When the `metadata.deletionTimestamp` field is set, controllers watching the object execute any
finalizers they handle and remove the finalizer from the list after they are done. It is the
responsibility of each controller to remove its finalizer from the list.
-->
自定義 Finalizer 的識別符號包含一個域名、一個正向斜線和 finalizer 的名稱。
任何控制器都可以在任何物件的 finalizer 列表中新增新的 finalizer。

對帶有 Finalizer 的物件的第一個刪除請求會為其 `metadata.deletionTimestamp`
設定一個值，但不會真的刪除物件。一旦此值被設定，`finalizers` 列表中的表項
只能被移除。在列表中仍然包含 finalizer 時，無法強制刪除對應的物件。

當 `metadata.deletionTimestamp` 欄位被設定時，監視該物件的各個控制器會
執行它們所能處理的 finalizer，並在完成處理之後將其從列表中移除。
每個控制器負責將其 finalizer 從列表中刪除。

<!--
The value of `metadata.deletionGracePeriodSeconds` controls the interval between polling updates.

Once the list of finalizers is empty, meaning all finalizers have been executed, the resource is
deleted by Kubernetes.
-->
`metadata.deletionGracePeriodSeconds` 的取值控制對更新的輪詢週期。

一旦 finalizers 列表為空時，就意味著所有 finalizer 都被執行過，
Kubernetes 會最終刪除該資源，

<!--
### Validation

Custom resources are validated via
[OpenAPI v3 schemas](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject),
by x-kubernetes-validations when the [Validation Rules feature](#validation-rules) is enabled, and you
can add additional validation using
[admission webhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook).
-->
### 合法性檢查    {#validation}

定製資源是透過
[OpenAPI v3 模式定義](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject)
來執行合法性檢查的，當啟用[驗證規則特性](#validation-rules)時，透過 `x-kubernetes-validations` 驗證，
你可以透過使用[准入控制 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
來新增額外的合法性檢查邏輯。

<!--
Additionally, the following restrictions are applied to the schema:

- These fields cannot be set:
  - `definitions`,
  - `dependencies`,
  - `deprecated`,
  - `discriminator`,
  - `id`,
  - `patternProperties`,
  - `readOnly`,
  - `writeOnly`,
  - `xml`,
  - `$ref`.
- The field `uniqueItems` cannot be set to `true`.
- The field `additionalProperties` cannot be set to `false`.
- The field `additionalProperties` is mutually exclusive with `properties`.
-->
此外，對模式定義存在以下限制：

- 以下欄位不可設定：
  - `definitions`
  - `dependencies`
  - `deprecated`
  - `discriminator`
  - `id`
  - `patternProperties`
  - `readOnly`
  - `writeOnly`
  - `xml`
  - `$ref`
- 欄位 `uniqueItems` 不可設定為 `true`
- 欄位 `additionalProperties` 不可設定為 `false`
- 欄位 `additionalProperties` 與 `properties` 互斥，不可同時使用

<!--
The `x-kubernetes-validations` extension can be used to validate custom resources using [Common
Expression Language (CEL)](https://github.com/google/cel-spec) expressions when the [Validation
rules](#validation-rules) feature is enabled and the CustomResourceDefinition schema is a
[structural schema](#specifying-a-structural-schema).
-->
當[驗證規則特性](#validation-rules)被啟用並且 CustomResourceDefinition
模式是一個[結構化的模式定義](#specifying-a-structural-schema)時，
`x-kubernetes-validations` 擴充套件可以使用[通用表示式語言(CEL)](https://github.com/google/cel-spec)表示式來驗證定製資源。

<!--
The `default` field can be set when the [Defaulting feature](#defaulting) is enabled,
which is the case with `apiextensions.k8s.io/v1` CustomResourceDefinitions.
Defaulting is in GA since 1.17 (beta since 1.16 with the `CustomResourceDefaulting`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled, which is the case automatically for many clusters for beta features).
-->
當[設定預設值特性](#defaulting)被啟用時，可以設定欄位 `default`。
就 `apiextensions.k8s.io/v1` 組的 CustomResourceDefinitions，這一條件是滿足的。
設定預設值的功能特性從 1.17 開始正式釋出。該特性在 1.16 版本中處於
Beta 狀態，要求 `CustomResourceDefaulting`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
被啟用。對於大多數叢集而言，Beta 狀態的特性門控預設都是自動啟用的。

<!--
Refer to the [structural schemas](#specifying-a-structural-schema) section for other
restrictions and CustomResourceDefinition features.
-->
關於對某些 CustomResourceDefinition 特性所必需的限制，可參見
[結構化的模式定義](#specifying-a-structural-schema)小節。

<!--
The schema is defined in the CustomResourceDefinition. In the following example, the
CustomResourceDefinition applies the following validations on the custom object:

- `spec.cronSpec` must be a string and must be of the form described by the regular expression.
- `spec.replicas` must be an integer and must have a minimum value of 1 and a maximum value of 10.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:
-->
模式定義是在 CustomResourceDefinition 中設定的。在下面的例子中，
CustomResourceDefinition 對定製物件執行以下合法性檢查：

- `spec.cronSpec` 必須是一個字串，必須是正則表示式所描述的形式；
- `spec.replicas` 必須是一個整數，且其最小值為 1、最大值為 10。

將此 CustomResourceDefinition 儲存到 `resourcedefinition.yaml` 檔案中：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema is the schema for validating custom objects.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

<!--
and create it:
-->
並建立 CustomResourceDefinition：

```shell
kubectl apply -f resourcedefinition.yaml
```

<!--
A request to create a custom object of kind CronTab is rejected if there are invalid values in its fields.
In the following example, the custom object contains fields with invalid values:

- `spec.cronSpec` does not match the regular expression.
- `spec.replicas` is greater than 10.

If you save the following YAML to `my-crontab.yaml`:
-->
對於一個建立 CronTab 類別物件的定製物件的請求而言，如果其欄位中包含非法值，則
該請求會被拒絕。
在下面的例子中，定製物件中包含帶非法值的欄位：

- `spec.cronSpec` 與正則表示式不匹配
- `spec.replicas` 數值大於 10。

如果你將下面的 YAML 儲存到 `my-crontab.yaml`：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * *"
  image: my-awesome-cron-image
  replicas: 15
```

<!--
and attempt to create it:
-->
並嘗試建立定製物件：

```shell
kubectl apply -f my-crontab.yaml
```

<!--
then you get an error:
-->
你會看到下面的錯誤資訊：

```console
The CronTab "my-new-cron-object" is invalid: []: Invalid value: map[string]interface {}{"apiVersion":"stable.example.com/v1", "kind":"CronTab", "metadata":map[string]interface {}{"name":"my-new-cron-object", "namespace":"default", "deletionTimestamp":interface {}(nil), "deletionGracePeriodSeconds":(*int64)(nil), "creationTimestamp":"2017-09-05T05:20:07Z", "uid":"e14d79e7-91f9-11e7-a598-f0761cb232d1", "clusterName":""}, "spec":map[string]interface {}{"cronSpec":"* * * *", "image":"my-awesome-cron-image", "replicas":15}}:
validation failure list:
spec.cronSpec in body should match '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
spec.replicas in body should be less than or equal to 10
```

<!--
If the fields contain valid values, the object creation request is accepted.

Save the following YAML to `my-crontab.yaml`:
-->
如果所有欄位都包含合法值，則物件建立的請求會被接受。

將下面的 YAML 儲存到 `my-crontab.yaml` 檔案：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 5
```

<!--
And create it:
-->
並建立定製物件：

```shell
kubectl apply -f my-crontab.yaml
crontab "my-new-cron-object" created
```
<!--
## Validation rules
-->
## 驗證規則

{{< feature-state state="alpha" for_k8s_version="v1.23" >}}

<!--
Validation rules are in alpha since 1.23 and validate custom resources when the
`CustomResourceValidationExpressions` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.
This feature is only available if the schema is a
[structural schema](#specifying-a-structural-schema).
-->
驗證規則從 1.23 開始處於 Alpha 狀態，
當 `CustomResourceValidationExpressions` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)被啟用時，
驗證定製資源。這個功能只有在模式是[結構化的模式](#specifying-a-structural-schema)時才可用。

<!--
Validation rules use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate custom resource values. Validation rules are included in
CustomResourceDefinition schemas using the `x-kubernetes-validations` extension.
-->
驗證規則使用[通用表示式語言（CEL）](https://github.com/google/cel-spec)來驗證定製資源的值。
驗證規則使用 `x-kubernetes-validations` 擴充套件包含在 `CustomResourceDefinition` 模式定義中。

<!--
The Rule is scoped to the location of the `x-kubernetes-validations` extension in the schema.
And `self` variable in the CEL expression is bound to the scoped value.
-->
規則的作用域是模式定義中 `x-kubernetes-validations` 擴充套件所在的位置。
CEL 表示式中的 `self` 變數被繫結到限定作用域的取值。

<!--
All validation rules are scoped to the current object: no cross-object or stateful validation rules are supported.
-->
所有驗證規則都是針對當前物件的：不支援跨物件或有狀態的驗證規則。

<!--
For example:
-->
例如:

```yaml
    ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "self.minReplicas <= self.replicas"
              message: "replicas should be greater than or equal to minReplicas."
            - rule: "self.replicas <= self.maxReplicas"
              message: "replicas should be smaller than or equal to maxReplicas."
          properties:
            ...
            minReplicas:
              type: integer
            replicas:
              type: integer
            maxReplicas:
              type: integer
          required:
            - minReplicas
            - replicas
            - maxReplicas
```

<!--
will reject a request to create this custom resource:
-->
將拒絕建立這個定製資源的請求:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  minReplicas: 0
  replicas: 20
  maxReplicas: 10
```
<!--
with the response:
-->

返回響應為：

```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: replicas should be smaller than or equal to maxReplicas.
```

<!--
`x-kubernetes-validations` could have multiple rules.

The `rule` under `x-kubernetes-validations` represents the expression which will be evaluated by CEL.

The `message` represents the message displayed when validation fails. If message is unset, the above response would be:
-->
`x-kubernetes-validations` 可以有多條規則。 

`x-kubernetes-validations` 下的 `rule` 代表將由 CEL 評估的表示式。

`message` 代表驗證失敗時顯示的資訊。如果訊息沒有設定，上述響應將是：
```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: failed rule: self.replicas <= self.maxReplicas
```

<!--
Validation rules are compiled when CRDs are created/updated.
The request of CRDs create/update will fail if compilation of validation rules fail.
Compilation process includes type checking as well.
-->
當 CRD 被建立/更新時，驗證規則被編譯。
如果驗證規則的編譯失敗，CRD 的建立/更新請求將失敗。
編譯過程也包括型別檢查。

<!--
The compilation failure:
- `no_matching_overload`: this function has no overload for the types of the arguments.

   e.g. Rule like `self == true` against a field of integer type will get error:
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"self == true", Message:""}: compilation failed: ERROR: \<input>:1:6: found no matching overload for '_==_' applied to '(int, bool)'
  ```

- `no_such_field`: does not contain the desired field.

   e.g. Rule like `self.nonExistingField > 0` against a non-existing field will return the error:
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"self.nonExistingField > 0", Message:""}: compilation failed: ERROR: \<input>:1:5: undefined field 'nonExistingField'
  ```

- `invalid argument`: invalid argument to macros.

  e.g. Rule like `has(self)` will return error:
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"has(self)", Message:""}: compilation failed: ERROR: <input>:1:4: invalid argument to has() macro
  ```
-->
編譯失敗：
- `no_matching_overload`：此函式沒有引數型別的過載。

  例如，像 `self == true` 這樣的規則對一個整數型別的欄位將得到錯誤：
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"self == true", Message:""}: compilation failed: ERROR: \<input>:1:6: found no matching overload for '_==_' applied to '(int, bool)'
  ```

- `no_such_field`：不包含所需的欄位。
  例如，針對一個不存在的欄位，像 `self.nonExistingField > 0` 這樣的規則將返回錯誤：
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"self.nonExistingField > 0", Message:""}: compilation failed: ERROR: \<input>:1:5: undefined field 'nonExistingField'
  ```

- `invalid argument`：對宏的無效引數。
  例如，像 `has(self)` 這樣的規則將返回錯誤：
  ```
  Invalid value: apiextensions.ValidationRule{Rule:"has(self)", Message:""}: compilation failed: ERROR: <input>:1:4: invalid argument to has() macro
  ```


<!--
Validation Rules Examples:

| Rule                                                                             | Purpose                                                                           |
| ----------------                                                                 | ------------                                                                      |
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`         | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in self.stateCounts`                                                | Validate that an entry with the 'Available' key exists in a map                   |
| `(size(self.list1) == 0) != (size(self.list2) == 0)`                             | Validate that one of two lists is non-empty, but not both                         |
| <code>!('MY_KEY' in self.map1) &#124;&#124; self['MY_KEY'].matches('^[a-zA-Z]*$')</code>               | Validate the value of a map for a specific key, if it is in the map               |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')` | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(self.expired) && self.created + self.ttl < self.expired`                    | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `self.health.startsWith('ok')`                                                   | Validate a 'health' string field has the prefix 'ok'                              |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                             | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(self) == string ? self == '100%' : self == 1000`                           | Validate an int-or-string field for both the the int and string cases             |
| `self.metadata.name.startsWith(self.prefix)`                                     | Validate that an object's name has the prefix of another field value              |
| `self.set1.all(e, !(e in self.set2))`                                            | Validate that two listSets are disjoint                                           |
| `size(self.names) == size(self.details) && self.names.all(n, n in self.details)` | Validate the 'details' map is keyed by the items in the 'names' listSet           |

Xref: [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)
-->
驗證規則例子：

| 規則                                                                             | 目的                                                                             |
| ----------------                                                                 | ------------                                                                     |
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`         | 驗證定義副本數的三個欄位大小順序是否正確                                             |
| `'Available' in self.stateCounts`                                                | 驗證 map 中是否存在鍵名為 `Available`的條目                                   |
| `(size(self.list1) == 0) != (size(self.list2) == 0)`                             | 驗證兩個 list 之一是非空的，但不是二者都非空                                   |
| <code>!('MY_KEY' in self.map1) &#124;&#124; self['MY_KEY'].matches('^[a-zA-Z]*$')</code>               | 如果某個特定的 key 在 map 中，驗證 map 中這個 key 的 value |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')` | 驗證一個 listMap 中主鍵 'name' 為 'MY_ENV' 'value' 的表項，檢查其取值 'value'             |
| `has(self.expired) && self.created + self.ttl < self.expired`    | 驗證 'Expired' 日期是否晚於 'Create' 日期加上 'ttl' 持續時間                   |
| `self.health.startsWith('ok')`                                                   | 驗證 'health' 字串欄位有字首 'ok'             |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                             | 驗證 key 為 'x' 的 listMap 項的 'foo' 屬性是否小於 10                             |
| `type(self) == string ? self == '100%' : self == 1000`                           | 在 int 型和 string 型兩種情況下驗證 int-or-string 欄位                           |
| `self.metadata.name.startsWith(self.prefix)`                                     | 驗證物件的名稱是否具有另一個欄位值的字首                                         |
| `self.set1.all(e, !(e in self.set2))`                                            | 驗證兩個 listSet 是否不相交                                                      |
| `size(self.names) == size(self.details) && self.names.all(n, n in self.details)` | 驗證 'details' map 是由 'names' listSet 的專案所決定的。                         |

參考：[CEL 中支援的求值](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)


<!--
- If the Rule is scoped to the root of a resource, it may make field selection into any fields
  declared in the OpenAPIv3 schema of the CRD as well as `apiVersion`, `kind`, `metadata.name` and
  `metadata.generateName`. This includes selection of fields in both the `spec` and `status` in the
  same expression:
-->
- 如果規則的作用域是某資源的根，則它可以對 CRD 的 OpenAPIv3 模式表示式中宣告的任何欄位進行欄位選擇，
  以及 `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName`。
  這包括在同一表示式中對 `spec` 和 `status` 的欄位進行選擇：
  ```yaml
      ...
      openAPIV3Schema:
        type: object
        x-kubernetes-validations:
          - rule: "self.status.availableReplicas >= self.spec.minReplicas"
        properties:
            spec:
              type: object
              properties:
                minReplicas:
                  type: integer
                ...
            status:
              type: object
              properties:
                availableReplicas:
                  type: integer
  ```

<!--
- If the Rule is scoped to an object with properties, the accessible properties of the object are field selectable
  via `self.field` and field presence can be checked via `has(self.field)`. Null valued fields are treated as
  absent fields in CEL expressions.
-->
- 如果規則的作用域是具有屬性的物件，那麼可以透過 `self.field` 對該物件的可訪問屬性進行欄位選擇，
  而欄位存在與否可以透過 `has(self.field)` 來檢查。
  在 CEL 表示式中，Null 值的欄位被視為不存在的欄位。

  ```yaml
      ...
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            x-kubernetes-validations:
              - rule: "has(self.foo)"
            properties:
              ...
              foo:
                type: integer
  ```

<!--
- If the Rule is scoped to an object with additionalProperties (i.e. a map) the value of the map
  are accessible via `self[mapKey]`, map containment can be checked via `mapKey in self` and all entries of the map
  are accessible via CEL macros and functions such as `self.all(...)`.
-->
- 如果規則的作用域是一個帶有 additionalProperties 的物件（即map），那麼 map 的值
  可以透過 `self[mapKey]` 訪問，map 的包含性可以透過 `mapKey in self` 檢查，
  map 中的所有條目可以透過 CEL 宏和函式如 `self.all(...)` 訪問。
  ```yaml
      ...
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            x-kubernetes-validations:
              - rule: "self['xyz'].foo > 0"
            additionalProperties:
              ...
              type: object
              properties:
                foo:
                  type: integer
  ```

<!--
- If the Rule is scoped to an array, the elements of the array are accessible via `self[i]` and also by macros and
  functions.
-->
- 如果規則的作用域是 array，則 array 的元素可以透過 `self[i]` 訪問，也可以透過宏和函式訪問。
  ```yaml
      ...
      openAPIV3Schema:
        type: object
        properties:
          ...
          foo:
            type: array
            x-kubernetes-validations:
              - rule: "size(self) == 1"
            items:
              type: string
  ```

<!--
- If the Rule is scoped to a scalar, `self` is bound to the scalar value.
-->
- 如果規則的作用域為標量，則 `self` 將繫結到標量值。
  ```yaml
      ...
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              ...
              foo:
                type: integer
                x-kubernetes-validations:
                - rule: "self > 0"
  ```
<!--
Examples:

|type of the field rule scoped to    | Rule example             |
| -----------------------| -----------------------|
| root object            | `self.status.actual <= self.spec.maxDesired`|
| map of objects         | `self.components['Widget'].priority < 10`|
| list of integers       | `self.values.all(value, value >= 0 && value < 100)`|
| string                 | `self.startsWith('kube')`|
-->
例子：

| 規則作用域欄位型別     | 規則示例             |
| -----------------------| -----------------------|
| 根物件            | `self.status.actual <= self.spec.maxDesired`|
| 物件對映         | `self.components['Widget'].priority < 10`|
| 整數列表       | `self.values.all(value, value >= 0 && value < 100)`|
| 字串                 | `self.startsWith('kube')`|


<!--
The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the
object and from any x-kubernetes-embedded-resource annotated objects. No other metadata properties are accessible.
-->
`apiVersion`、`kind``metadata.name` 和 `metadata.generateName` 始終可以從物件的根目錄和任何
帶有 `x-kubernetes-embedded-resource` 註解的物件訪問。
其他元資料屬性都不可訪問。

<!--
Unknown data preserved in custom resources via `x-kubernetes-preserve-unknown-fields` is not accessible in CEL
  expressions. This includes:
  - Unknown field values that are preserved by object schemas with x-kubernetes-preserve-unknown-fields.
  - Object properties where the property schema is of an "unknown type". An "unknown type" is recursively defined as:
    - A schema with no type and x-kubernetes-preserve-unknown-fields set to true
    - An array where the items schema is of an "unknown type"
    - An object where the additionalProperties schema is of an "unknown type"
-->
透過 `x-kubernetes-preserve-unknown-fields` 儲存在定製資源中的未知資料在 CEL 表達中無法訪問。
這包括：
  - 使用 `x-kubernetes-preserve-unknown-fields` 的物件模式保留的未知欄位值。
  - 屬性模式為"未知型別（Unknown Type）"的物件屬性。一個"未知型別"被遞迴定義為：
    - 一個沒有型別的模式，`x-kubernetes-preserve-unknown-fields` 設定為 true。
    - 一個數組，其中專案模式為"未知型別"
    - 一個 additionalProperties 模式為"未知型別"的物件


<!--
Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible.
Accessible property names are escaped according to the following rules when accessed in the expression:
-->
只有 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 形式的屬性名是可訪問的。
當在表示式中訪問時，可訪問的屬性名稱會根據以下規則進行轉義：

<!--
| ----------------------- | -----------------------|
| `__underscores__`       | `__`                  |
| `__dot__`               | `.`                   |
|`__dash__`               | `-`                   |
| `__slash__`             | `/`                   |
| `__{keyword}__`         | [CEL RESERVED keyword](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax)       |
-->
| 轉義序列                | 屬性名稱等效為        |
| ----------------------- | ----------------------|
| `__underscores__`       | `__`                  |
| `__dot__`               | `.`                   |
|`__dash__`               | `-`                   |
| `__slash__`             | `/`                   |
| `__{keyword}__`         | [CEL 保留關鍵字](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax)       |

<!--
Note: CEL RESERVED keyword needs to match the exact property name to be escaped (e.g. int in the word sprint would not be escaped).
-->
注意：CEL 保留關鍵字需要與要轉義的確切屬性名匹配(例如，單詞 `sprint` 中的 `int` 不會轉義)。

<!--
Examples on escaping:
-->
轉義的例子：

<!--
|property name    | rule with escaped property name     |
| ----------------| -----------------------             |
| namespace       | `self.__namespace__ > 0`            |
| x-prop          | `self.x__dash__prop > 0`            |
| redact__d       | `self.redact__underscores__d > 0`   |
| string          | `self.startsWith('kube')`           |
-->
|屬性名           | 轉義屬性名規則                      |
| ----------------| -----------------------             |
| namespace       | `self.__namespace__ > 0`            |
| x-prop          | `self.x__dash__prop > 0`            |
| redact__d       | `self.redact__underscores__d > 0`   |
| string          | `self.startsWith('kube')`           |


<!--
Equality on arrays with `x-kubernetes-list-type` of `set` or `map` ignores element order, i.e. [1, 2] == [2, 1].
Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:
 - `set`: `X + Y` performs a union where the array positions of all elements in `X` are preserved and
      non-intersecting elements in `Y` are appended, retaining their partial order.
 - `map`: `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
   are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
   non-intersecting keys are appended, retaining their partial order.
-->
`set` 或 `map` 的 `x-Kubernetes-list-type` 的陣列的等值比較會忽略元素順序，即[1，2] == [2，1]。
使用 `x-kubernetes-list-type` 對陣列進行串聯時，使用 List 型別的語義：
- `set`：`X + Y` 執行一個並集操作，其中 `X` 中所有元素的陣列位置被保留，
  `Y` 中不相交的元素被追加，保留其部分順序。
- `map`：`X + Y`執行合併，其中 `X` 中所有鍵的陣列位置被保留，
  但當 `X` 和 `Y` 的鍵集相交時，其值被 `Y` 中的值覆蓋。
  `Y` 中鍵值不相交的元素被附加，保留其部分順序。


<!--
Here is the declarations type mapping between OpenAPIv3 and CEL type:
-->
以下是 OpenAPIV3 和 CEL 型別之間的宣告型別對映：

<!--
| OpenAPIv3 type                                     | CEL type                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 'object' with Properties                           | object / "message type"                                                                                                      |
| 'object' with AdditionalProperties                 | map                                                                                                                          |
| 'object' with x-kubernetes-embedded-type           | object / "message type", 'apiVersion', 'kind', 'metadata.name' and 'metadata.generateName' are implicitly included in schema |
| 'object' with x-kubernetes-preserve-unknown-fields | object / "message type", unknown fields are NOT accessible in CEL expression                                                 |
| x-kubernetes-int-or-string                         | dynamic object that is either an int or a string, `type(value)` can be used to check the type                                |
| 'array                                             | list                                                                                                                         |
| 'array' with x-kubernetes-list-type=map            | list with map based Equality & unique key guarantees                                                                         |
| 'array' with x-kubernetes-list-type=set            | list with set based Equality & unique entry guarantees                                                                       |
| 'boolean'                                          | boolean                                                                                                                      |
| 'number' (all formats)                             | double                                                                                                                       |
| 'integer' (all formats)                            | int (64)                                                                                                                     |
| 'null'                                             | null_type                                                                                                                    |
| 'string'                                           | string                                                                                                                       |
| 'string' with format=byte (base64 encoded)         | bytes                                                                                                                        |
| 'string' with format=date                          | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=datetime                      | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=duration                      | duration (google.protobuf.Duration)                                                                                          |
-->
| OpenAPIv3 型別                                     | CEL 型別                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 帶有 Properties 的物件                           | 物件 / "訊息型別"                                                                                                      |
| 帶有 AdditionalProperties 的物件                 | map                                                                                                                          |
| 帶有 x-kubernetes-embedded-type 的物件           | 物件 / "訊息型別"，'apiVersion'、'kind'、'metadata.name' 和 'metadata.generateName' 都隱式包含在模式中 |
| 帶有 x-kubernetes-preserve-unknown-fields 的物件 | 物件 / "訊息型別"，未知欄位無法從 CEL 表示式中訪問                                                 |
| x-kubernetes-int-or-string                         | 可能是整數或字串的動態物件，可以用 `type(value)` 來檢查型別                                |
| 陣列                                            | list                                                                                                                         |
| 帶有 x-kubernetes-list-type=map 的陣列           | 列表，基於集合等值和唯一鍵名保證的 map 組成                                                                          |
| 帶有 x-kubernetes-list-type=set 的陣列            | 列表，基於集合等值和唯一鍵名保證的 set 組成                                                                        |
| 布林值                                          | boolean                                                                                                                      |
| 數字 (各種格式)                             | double                                                                                                                       |
| 整數 (各種格式)                            | int (64)                                                                                                                     |
| 'null'                                             | null_type                                                                                                                    |
| 字串                                           | string                                                                                                                       |
| 帶有 format=byte （base64 編碼）字串         | bytes                                                                                                                        |
| 帶有 format=date 字串                          | timestamp (google.protobuf.Timestamp)                                                                                        |
| 帶有 format=datetime 字串                      | timestamp (google.protobuf.Timestamp)                                                                                        |
| 帶有 format=duration 字串                      | duration (google.protobuf.Duration)                                                                                          |

<!--
xref: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values), [OpenAPI
types](https://swagger.io/specification/#data-types), [Kubernetes Structural Schemas](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).
-->
參考：[CEL 型別](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values)，
[OpenAPI 型別](https://swagger.io/specification/#data-types)，
[Kubernetes 結構化模式](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)。

<!--
#### Validation functions {#available-validation-functions}
-->
#### 驗證函式   {#available-validation-functions}

<!--
Functions available include:
  - CEL standard functions, defined in the [list of standard definitions](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)
  - CEL standard [macros](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
  - CEL [extended string function library](https://pkg.go.dev/github.com/google/cel-go@v0.11.2/ext#Strings)
  - Kubernetes [CEL extension library](https://pkg.go.dev/k8s.io/apiextensions-apiserver@v0.24.0/pkg/apiserver/schema/cel/library#pkg-functions)
-->
可用的函式包括：
  - CEL 標準函式，在[標準定義列表](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)中定義
  - CEL 標準[宏](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
  - CEL [擴充套件字串函式庫](https://pkg.go.dev/github.com/google/cel-go@v0.11.2/ext#Strings)
  - Kubernetes [CEL 擴充套件庫](https://pkg.go.dev/k8s.io/apiextensions-apiserver@v0.24.0/pkg/apiserver/schema/cel/library#pkg-functions)

<!--
#### Transition rules
-->
#### 轉換規則

<!--
A rule that contains an expression referencing the identifier `oldSelf` is implicitly considered a
_transition rule_. Transition rules allow schema authors to prevent certain transitions between two
otherwise valid states. For example:
-->
包含引用識別符號 `oldSself` 的表示式的規則被隱式視為“轉換規則（Transition Rule）”。
轉換規則允許模式作者阻止兩個原本有效的狀態之間的某些轉換。例如：

```yaml
type: string
enum: ["low", "medium", "high"]
x-kubernetes-validations:
- rule: "!(self == 'high' && oldSelf == 'low') && !(self == 'low' && oldSelf == 'high')"
  message: cannot transition directly between 'low' and 'high'
```

<!--
Unlike other rules, transition rules apply only to operations meeting the following criteria:
-->
與其他規則不同，轉換規則僅適用於滿足以下條件的操作：

<!--
- The operation updates an existing object. Transition rules never apply to create operations.
-->
- 更新現有物件的操作。轉換規則從不適用於建立操作。

<!--
- Both an old and a new value exist. It remains possible to check if a value has been added or
  removed by placing a transition rule on the parent node. Transition rules are never applied to
  custom resource creation. When placed on an optional field, a transition rule will not apply to
  update operations that set or unset the field.
-->
- 舊的值和新的值都存在。仍然可以透過在父節點上放置轉換規則來檢查值是否已被新增或移除。
  轉換規則從不應用於定製資源建立。當被放置在可選欄位上時，轉換規則將不適用於設定或取消設定該欄位的更新操作。

<!--
- The path to the schema node being validated by a transition rule must resolve to a node that is
  comparable between the old object and the new object. For example, list items and their
  descendants (`spec.foo[10].bar`) can't necessarily be correlated between an existing object and a
  later update to the same object.
-->
- 被轉換規則驗證的模式節點的路徑必須解析到一個在舊物件和新物件之間具有可比性的節點。
  例如，列表項和它們的後代（`spec.foo[10].bar`）不一定能在現有物件和後來對同一物件的更新之間產生關聯。

<!--
Errors will be generated on CRD writes if a schema node contains a transition rule that can never be
applied, e.g. "*path*: update rule *rule* cannot be set on schema because the schema or its parent
schema is not mergeable".
-->
如果一個模式節點包含一個永遠不能應用的轉換規則，在 CRD 寫入時將會產生錯誤，例如：
"*path*: update rule *rule* cannot be set on schema because the schema or its parent
schema is not mergeable"。

<!--
Transition rules are only allowed on _correlatable portions_ of a schema.
A portion of the schema is correlatable if all `array` parent schemas are of type `x-kubernetes-list-type=map`; any `set`or `atomic`array parent schemas make it impossible to unambiguously correlate a `self` with `oldSelf`.
-->
轉換規則只允許在模式的“可關聯部分（Correlatable Portions）”中使用。
如果所有 `array` 父模式都是 `x-kubernetes-list-type=map`型別的，那麼該模式的一部分就是可關聯的；
任何 `set` 或者 `atomic` 陣列父模式都不支援確定性地將 `self` 與 `oldSelf` 關聯起來。

<!--
Here are some examples for transition rules:
-->
這是一些轉換規則的例子：

<!--
{{< table caption="Transition rules examples" >}}
| Use Case                                                          | Rule
| --------                                                          | --------
| Immutability                                                      | `self.foo == oldSelf.foo`
| Prevent modification/removal once assigned                        | `oldSelf != 'bar' \|\| self == 'bar'` or `!has(oldSelf.field) \|\| has(self.field)`
| Append-only set                                                   | `self.all(element, element in oldSelf)`
| If previous value was X, new value can only be A or B, not Y or Z | `oldSelf != 'X' \|\| self in ['A', 'B']`
| Monotonic (non-decreasing) counters                               | `self >= oldSelf`
{{< /table >}}
-->
{{< table caption="轉換規則樣例" >}}
| 用例                                                 | 規則
| --------                                             | --------
| 不可變                                               | `self.foo == oldSelf.foo`
| 賦值後禁止修改/刪除                                  | `oldSelf != 'bar' \|\| self == 'bar'` or `!has(oldSelf.field) \|\| has(self.field)`
| 僅附加的 set                                         | `self.all(element, element in oldSelf)`
| 如果之前的值為 X，則新值只能為 A 或 B，不能為 Y 或 Z | `oldSelf != 'X' \|\| self in ['A', 'B']`
| 單調（非遞減）計數器                                   | `self >= oldSelf`
{{< /table >}}

<!--
#### Resource use by validation functions
-->
#### 驗證函式的資源使用

<!--
When you create or update a CustomResourceDefinition that uses validation rules,
the API server checks the likely impact of running those validation rules. If a rule is
estimated to be prohibitively expensive to execute, the API server rejects the create
or update operation, and returns an error message.
-->
當你建立或更新一個使用驗證規則的 CustomResourceDefinition 時，
API 伺服器會檢查執行這些驗證規則可能產生的影響。
如果一個規則的執行成本過高，API 伺服器會拒絕建立或更新操作，並返回一個錯誤資訊。
<!--
A similar system is used at runtime that observes the actions the interpreter takes. If the interpreter executes
too many instructions, execution of the rule will be halted, and an error will result.
-->
執行時也使用類似的系統來觀察直譯器的行動。如果直譯器執行了太多的指令，規則的執行將被停止，並且會產生一個錯誤。
<!--
Each CustomResourceDefinition is also allowed a certain amount of resources to finish executing all of
its validation rules. If the sum total of its rules are estimated at creation time to go over that limit,
then a validation error will also occur.
-->
每個 CustomResourceDefinition 也被允許有一定數量的資源來完成其所有驗證規則的執行。
如果在建立時估計其規則的總和超過了這個限制，那麼也會發生驗證錯誤。

<!--
You are unlikely to encounter issues with the resource budget for validation if you only
specify rules that always take the same amount of time regardless of how large their input is.
-->
如果你只指定那些無論輸入量有多大都要花費相同時間的規則，你不太可能遇到驗證的資源預算問題。
<!--
For example, a rule that asserts that `self.foo == 1` does not by itself have any
risk of rejection on validation resource budget groups.
-->
例如，一個斷言 `self.foo == 1` 的規則本身不存在因為資源預算組驗證而導致被拒絕的風險。
<!--
But if `foo` is a string and you define a validation rule `self.foo.contains("someString")`, that rule takes
longer to execute depending on how long `foo` is.
-->
但是，如果 `foo` 是一個字串，而你定義了一個驗證規則 `self.foo.contains("someString")`，
這個規則需要更長的時間來執行，取決於 `foo` 有多長。
<!--
Another example would be if `foo` were an array, and you specified a validation rule `self.foo.all(x, x > 5)`. The cost system always assumes the worst-case scenario if
a limit on the length of `foo` is not given, and this will happen for anything that can be iterated
over (lists, maps, etc.).
-->
另一個例子是如果 `foo` 是一個數組，而你指定了驗證規則 `self.foo.all(x, x > 5)`。
如果沒有給出 `foo` 的長度限制，成本系統總是假設最壞的情況，這將發生在任何可以被迭代的事物上（list、map 等）。

<!--
Because of this, it is considered best practice to put a limit via `maxItems`, `maxProperties`, and
`maxLength` for anything that will be processed in a validation rule in order to prevent validation errors during cost estimation. For example, given this schema with one rule:
-->
因此，透過 `maxItems`，`maxProperties` 和 `maxLength` 進行限制被認為是最佳實踐，
以在驗證規則中處理任何內容，以防止在成本估算期間驗證錯誤。例如，給定具有一個規則的模式：

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: string
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

<!--
then the API server rejects this rule on validation budget grounds with error:
-->
API 伺服器以驗證預算為由拒絕該規則，並顯示錯誤：
```
 spec.validation.openAPIV3Schema.properties[spec].properties[foo].x-kubernetes-validations[0].rule: Forbidden:
 CEL rule exceeded budget by more than 100x (try simplifying the rule, or adding maxItems, maxProperties, and
 maxLength where arrays, maps, and strings are used)
```

<!--
The rejection happens because `self.all` implies calling `contains()` on every string in `foo`,
which in turn will check the given string to see if it contains `'a string'`. Without limits, this is a very
expensive rule.
-->
這個拒絕會發生是因為 `self.all` 意味著對 `foo` 中的每一個字串呼叫 `contains()`，
而這又會檢查給定的字串是否包含 `'a string'`。如果沒有限制，這是一個非常昂貴的規則。

<!--
If you do not specify any validation limit, the estimated cost of this rule will exceed the per-rule cost limit. But if you
add limits in the appropriate places, the rule will be allowed:
-->
如果你不指定任何驗證限制，這個規則的估計成本將超過每條規則的成本限制。
但如果你在適當的地方新增限制，該規則將被允許：

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        maxLength: 10
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

<!--
The cost estimation system takes into account how many times the rule will be executed in addition to the
estimated cost of the rule itself. For instance, the following rule will have the same estimated cost as the
previous example (despite the rule now being defined on the individual array items):
-->
成本評估系統除了考慮規則本身的估計成本外，還考慮到規則將被執行的次數。
例如，下面這個規則的估計成本與前面的例子相同（儘管該規則現在被定義在單個數組項上）：

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        x-kubernetes-validations:
          - rule: "self.contains('a string'))"
        maxLength: 10
```

<!--
If a list inside of a list has a validation rule that uses `self.all`, that is significantly more expensive
than a non-nested list with the same rule. A rule that would have been allowed on a non-nested list might need lower limits set on both nested lists in order to be allowed. For example, even without having limits set,
the following rule is allowed:
-->
如果在一個列表內部的一個列表有一個使用 `self.all` 的驗證規則，那就會比具有相同規則的非巢狀列表的成本高得多。
一個在非巢狀列表中被允許的規則可能需要在兩個巢狀列表中設定較低的限制才能被允許。
例如，即使沒有設定限制，下面的規則也是允許的：

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: integer
    x-kubernetes-validations:
      - rule: "self.all(x, x == 5)"
```

<!--
But the same rule on the following schema (with a nested array added) produces a validation error:
-->
但是同樣的規則在下面的模式中（添加了一個巢狀陣列）產生了一個驗證錯誤：

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: array
        items:
          type: integer
        x-kubernetes-validations:
          - rule: "self.all(x, x == 5)"
```

<!--
This is because each item of `foo` is itself an array, and each subarray in turn calls `self.all`. Avoid nested
lists and maps if possible where validation rules are used.
-->
這是因為 `foo` 的每一項本身就是一個數組，而每一個子陣列依次呼叫 `self.all`。
在使用驗證規則的地方，儘可能避免巢狀的列表和字典。

<!--
### Defaulting
-->
### 設定預設值   {#efaulting}

<!--
To use defaulting, your CustomResourceDefinition must use API version `apiextensions.k8s.io/v1`.
-->
{{< note >}}
要使用設定預設值功能，你的 CustomResourceDefinition 必須使用 API 版本 `apiextensions.k8s.io/v1`。
{{< /note >}}

<!--
Defaulting allows to specify default values in the [OpenAPI v3 validation schema](#validation):
-->
設定預設值的功能允許在 [OpenAPI v3 合法性檢查模式定義](#validation)中設定預設值：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema 是用來檢查定製物件的模式定義
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
                  default: "5 0 * * *"
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
                  default: 1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

<!--
With this both `cronSpec` and `replicas` are defaulted:
-->
使用此 CRD 定義時，`cronSpec` 和 `replicas` 都會被設定預設值：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  image: my-awesome-cron-image
```

<!--
leads to
-->
會生成：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "5 0 * * *"
  image: my-awesome-cron-image
  replicas: 1
```

<!--
Defaulting happens on the object

* in the request to the API server using the request version defaults,
* when reading from etcd using the storage version defaults,
* after mutating admission plugins with non-empty patches using the admission webhook object version defaults.

Defaults applied when reading data from etcd are not automatically written back to etcd. An update request via the API is required to persist those defaults back into etcd.
-->
預設值設定的行為發生在定製物件上：

* 在向 API 伺服器傳送的請求中，基於請求版本的設定設定預設值；
* 在從 etcd 讀取物件時，使用儲存版本來設定預設值；
* 在 Mutating 准入控制外掛執行非空的補丁操作時，基於准入 Webhook 物件
  版本設定預設值。

從 etcd 中讀取資料時所應用的預設值設定不會被寫回到 etcd 中。
需要透過 API 執行更新請求才能將這種方式設定的預設值寫回到 etcd。

<!--
Default values must be pruned (with the exception of defaults for `metadata` fields) and must validate against a provided schema.

Default values for `metadata` fields of `x-kubernetes-embedded-resources: true` nodes (or parts of a default value covering `metadata`) are not pruned during CustomResourceDefinition creation, but through the pruning step during handling of requests.
-->
預設值一定會被剪裁（除了 `metadata` 欄位的預設值設定），且必須透過所提供
的模式定義的檢查。

針對 `x-kubernetes-embedded-resource: true` 節點（或者包含 `metadata` 欄位的結構的預設值）
的 `metadata` 欄位的預設值設定不會在 CustomResourceDefinition 建立時被剪裁，
而是在處理請求的欄位剪裁階段被刪除。

<!--
#### Defaulting and Nullable

**New in 1.20:** null values for fields that either don't specify the nullable flag, or give it a `false` value, will be pruned before defaulting happens. If a default is present, it will be applied. When nullable is `true`, null values will be conserved and won't be defaulted.

For example, given the OpenAPI schema below:
-->
#### 設定預設值和欄位是否可為空（Nullable）   {#defaulting-and-nullable}

**1.20 版本新增:** 對於未設定其 nullable 標誌的欄位或者將該標誌設定為
`false` 的欄位，其空值（Null）會在設定預設值之前被剪裁掉。如果對應欄位
存在預設值，則預設值會被賦予該欄位。當 `nullable` 被設定為 `true` 時，
欄位的空值會被保留，且不會在設定預設值時被覆蓋。

例如，給定下面的 OpenAPI 模式定義：

```yaml
type: object
properties:
  spec:
    type: object
    properties:
      foo:
        type: string
        nullable: false
        default: "default"
      bar:
        type: string
        nullable: true
      baz:
        type: string
```

<!--
creating an object with null values for `foo` and `bar` and `baz`
-->
像下面這樣建立一個為 `foo`、`bar` 和 `baz` 設定空值的物件時：

```yaml
spec:
  foo: null
  bar: null
  baz: null
```

<!--
leads to
-->
其結果會是這樣：

```yaml
spec:
  foo: "default"
  bar: null
```

<!--
with `foo` pruned and defaulted because the field is non-nullable, `bar` maintaining the null value due to `nullable: true`, and `baz` pruned because the field is non-nullable and has no default.
-->
其中的 `foo` 欄位被剪裁掉並重新設定預設值，因為該欄位是不可為空的。
`bar` 欄位的 `nullable: true` 使得其能夠保有其空值。
`baz` 欄位則被完全剪裁掉，因為該欄位是不可為空的，並且沒有預設值設定。

<!--
### Publish Validation Schema in OpenAPI v2

CustomResourceDefinition [OpenAPI v3 validation schemas](#validation) which are [structural](#specifying-a-structural-schema) and [enable pruning](#field-pruning) are published as part of the [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) from Kubernetes API server.

The [kubectl](/docs/reference/kubectl/) command-line tool consumes the published schema to perform client-side validation (`kubectl create` and `kubectl apply`), schema explanation (`kubectl explain`) on custom resources. The published schema can be consumed for other purposes as well, like client generation or documentation.
-->
### 以 OpenAPI v2 形式釋出合法性檢查模式      {#publish-validation-schema-in-openapi-v2}

CustomResourceDefinition 的[結構化的](#specifying-a-structural-schema)、
[啟用了剪裁的](#preserving-unknown-fields) [OpenAPI v3 合法性檢查模式](#validation)
會在 Kubernetes API 伺服器上作為
[OpenAPI v2 規約](/zh-cn/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions)
的一部分發布出來。

[kubectl](/zh-cn/docs/reference/kubectl/) 命令列工具會基於所釋出的模式定義來執行客戶端的合法性檢查（`kubectl create` 和 `kubectl apply`），為定製資源的模式定義提供解釋（`kubectl explain`）。
所釋出的模式還可被用於其他目的，例如生成客戶端或者生成文件。

<!--
The OpenAPI v3 validation schema is converted to OpenAPI v2 schema, and
show up in `definitions` and `paths` fields in the [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).

The following modifications are applied during the conversion to keep backwards compatibility with
kubectl in previous 1.13 version. These modifications prevent kubectl from being over-strict and rejecting
valid OpenAPI schemas that it doesn't understand. The conversion won't modify the validation schema defined in CRD,
and therefore won't affect [validation](#validation) in the API server.
-->
OpenAPI v3 合法性檢查模式定義會被轉換為 OpenAPI v2 模式定義，並出現在
[OpenAPI v2 規範](/zh-cn/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions)
的 `definitions` 和 `paths` 欄位中。

在轉換過程中會發生以下修改，目的是保持與 1.13 版本以前的 kubectl 工具相容。
這些修改可以避免 kubectl 過於嚴格，以至於拒絕它無法理解的 OpenAPI 模式定義。
轉換過程不會更改 CRD 中定義的合法性檢查模式定義，因此不會影響到 API 伺服器中
的[合法性檢查](#validation)。

<!--
1. The following fields are removed as they aren't supported by OpenAPI v2 (in future versions OpenAPI v3 will be used without these restrictions)
   - The fields `allOf`, `anyOf`, `oneOf` and `not` are removed
2. If `nullable: true` is set, we drop `type`, `nullable`, `items` and `properties` because OpenAPI v2 is not able to express nullable. To avoid kubectl to reject good objects, this is necessary.
-->
1. 以下欄位會被移除，因為它們在 OpenAPI v2 中不支援（在將來版本中將使用 OpenAPI v3，
   因而不會有這些限制）
   - 欄位 `allOf`、`anyOf`、`oneOf` 和 `not` 會被刪除
2. 如果設定了 `nullable: true`，我們會丟棄 `type`、`nullable`、`items` 和 `properties`
   OpenAPI v2 無法表達 Nullable。為了避免 kubectl 拒絕正常的物件，這一轉換是必要的。

<!--
### Additional printer columns

The kubectl tool relies on server-side output formatting. Your cluster's API server decides which
columns are shown by the `kubectl get` command. You can customize these columns for a
CustomResourceDefinition. The following example adds the `Spec`, `Replicas`, and `Age`
columns.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:
-->
### 額外的列印列    {#additional-printer-columns}

`kubectl` 工具依賴伺服器端的輸出格式化。你的叢集的 API 伺服器決定 `kubectl
get` 命令要顯示的列有哪些。
你可以為 CustomResourceDefinition 定製這些要列印的列。
下面的例子添加了 `Spec`、`Replicas` 和 `Age` 列：

將此 CustomResourceDefinition 儲存到 `resourcedefinition.yaml` 檔案：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              cronSpec:
                type: string
              image:
                type: string
              replicas:
                type: integer
    additionalPrinterColumns:
    - name: Spec
      type: string
      description: The cron spec defining the interval a CronJob is run
      jsonPath: .spec.cronSpec
    - name: Replicas
      type: integer
      description: The number of jobs launched by the CronJob
      jsonPath: .spec.replicas
    - name: Age
      type: date
      jsonPath: .metadata.creationTimestamp
```

<!--
Create the CustomResourceDefinition:
-->
建立 CustomResourceDefinition：

```shell
kubectl apply -f resourcedefinition.yaml
```

<!--
Create an instance using the `my-crontab.yaml` from the previous section.
-->
使用前文中的 `my-crontab.yaml` 建立一個例項。

<!--
Invoke the server-side printing:
-->
啟用伺服器端列印輸出：

```shell
kubectl get crontab my-new-cron-object
```

<!--
Notice the `NAME`, `SPEC`, `REPLICAS`, and `AGE` columns in the output:
-->
注意輸出中的 `NAME`、`SPEC`、`REPLICAS` 和 `AGE` 列：

```
NAME                 SPEC        REPLICAS   AGE
my-new-cron-object   * * * * *   1          7s
```

<!--
The `NAME` column is implicit and does not need to be defined in the CustomResourceDefinition.
-->
{{< note >}}
`NAME` 列是隱含的，不需要在 CustomResourceDefinition 中定義。
{{< /note >}}

<!--
#### Priority

Each column includes a `priority` field. Currently, the priority
differentiates between columns shown in standard view or wide view (using the `-o wide` flag).

- Columns with priority `0` are shown in standard view.
- Columns with priority greater than `0` are shown only in wide view.
-->
#### 優先順序    {#priority}

每個列都包含一個 `priority`（優先順序）欄位。當前，優先順序用來區分標準檢視（Standard
View）和寬檢視（Wide View）（使用 `-o wide` 標誌）中顯示的列：

- 優先順序為 `0` 的列會在標準檢視中顯示。
- 優先順序大於 `0` 的列只會在寬檢視中顯示。

<!--
#### Type

A column's `type` field can be any of the following (compare [OpenAPI v3 data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)):

- `integer` – non-floating-point numbers
- `number` – floating point numbers
- `string` – strings
- `boolean` – `true` or `false`
- `date` – rendered differentially as time since this timestamp.
-->
#### 型別    {#type}

列的 `type` 欄位可以是以下值之一
（比較 [OpenAPI v3 資料型別](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)）：

- `integer` – 非浮點數字
- `number` – 浮點數字
- `string` – 字串
- `boolean` – `true` 或 `false`
- `date` – 顯示為以自此時間戳以來經過的時長

<!--
If the value inside a CustomResource does not match the type specified for the column,
the value is omitted. Use CustomResource validation to ensure that the value
types are correct.
-->
如果定製資源中的值與列中指定的型別不匹配，該值會被忽略。
你可以透過定製資源的合法性檢查來確保取值型別是正確的。

<!--
#### Format

A column's `format` field can be any of the following:
-->
#### 格式    {#format}

列的 `format` 欄位可以是以下值之一：

- `int32`
- `int64`
- `float`
- `double`
- `byte`
- `date`
- `date-time`
- `password`

<!--
The column's `format` controls the style used when `kubectl` prints the value.
-->
列的 `format` 欄位控制 `kubectl` 列印對應取值時採用的風格。

<!--
### Subresources

Custom resources support `/status` and `/scale` subresources.

The status and scale subresources can be optionally enabled by
defining them in the CustomResourceDefinition.
-->
### 子資源     {#subresources}

定製資源支援 `/status` 和 `/scale` 子資源。

透過在 CustomResourceDefinition 中定義 `status` 和 `scale`，
可以有選擇地啟用這些子資源。

<!--
#### Status subresource

When the status subresource is enabled, the `/status` subresource for the custom resource is exposed.

- The status and the spec stanzas are represented by the `.status` and `.spec` JSONPaths respectively inside of a custom resource.
- `PUT` requests to the `/status` subresource take a custom resource object and ignore changes to anything except the status stanza.
- `PUT` requests to the `/status` subresource only validate the status stanza of the custom resource.
- `PUT`/`POST`/`PATCH` requests to the custom resource ignore changes to the status stanza.
- The `.metadata.generation` value is incremented for all changes, except for changes to `.metadata` or `.status`.
-->
#### Status 子資源  {#status-subresource}

當啟用了 status 子資源時，對應定製資源的 `/status` 子資源會被暴露出來。

- status 和 spec 內容分別用定製資源內的 `.status` 和 `.spec` JSON 路徑來表達；
- 對 `/status` 子資源的 `PUT` 請求要求使用定製資源物件作為其輸入，但會忽略
  status 之外的所有內容。
- 對 `/status` 子資源的 `PUT` 請求僅對定製資源的 status 內容進行合法性檢查。
- 對定製資源的 `PUT`、`POST`、`PATCH` 請求會忽略 status 內容的改變。
- 對所有變更請求，除非改變是針對 `.metadata` 或 `.status`，`.metadata.generation`
  的取值都會增加。
<!--
- Only the following constructs are allowed at the root of the CRD OpenAPI validation schema:
-->
- 在 CRD OpenAPI 合法性檢查模式定義的根節點，只允許存在以下結構：

  - `description`
  - `example`
  - `exclusiveMaximum`
  - `exclusiveMinimum`
  - `externalDocs`
  - `format`
  - `items`
  - `maximum`
  - `maxItems`
  - `maxLength`
  - `minimum`
  - `minItems`
  - `minLength`
  - `multipleOf`
  - `pattern`
  - `properties`
  - `required`
  - `title`
  - `type`
  - `uniqueItems`

<!--
#### Scale subresource

When the scale subresource is enabled, the `/scale` subresource for the custom resource is exposed.
The `autoscaling/v1.Scale` object is sent as the payload for `/scale`.

To enable the scale subresource, the following fields are defined in the CustomResourceDefinition.
-->
#### Scale 子資源   {#scale-subresource}

當啟用了 scale 子資源時，定製資源的 `/scale` 子資源就被暴露出來。
針對 `/scale` 所傳送的物件是 `autoscaling/v1.Scale`。

為了啟用 scale 子資源，CustomResourceDefinition 定義了以下欄位：

<!--
- `specReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `scale.spec.replicas`.

  - It is a required value.
  - Only JSONPaths under `.spec` and with the dot notation are allowed.
  - If there is no value under the `specReplicasPath` in the custom resource,
the `/scale` subresource will return an error on GET.
-->
- `specReplicasPath` 指定定製資源內與 `scale.spec.replicas` 對應的 JSON 路徑。

  - 此欄位為必需值。
  - 只可以使用 `.spec` 下的 JSON 路徑，只可使用帶句點的路徑。
  - 如果定製資源的 `specReplicasPath` 下沒有取值，則針對 `/scale` 子資源執行 GET
    操作時會返回錯誤。

<!--
- `statusReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `scale.status.replicas`.

  - It is a required value.
  - Only JSONPaths under `.status` and with the dot notation are allowed.
  - If there is no value under the `statusReplicasPath` in the custom resource,
the status replica value in the `/scale` subresource will default to 0.
-->
- `statusReplicasPath` 指定定製資源內與 `scale.status.replicas` 對應的 JSON 路徑。

  - 此欄位為必需值。
  - 只可以使用 `.status` 下的 JSON 路徑，只可使用帶句點的路徑。
  - 如果定製資源的 `statusReplicasPath` 下沒有取值，則針對 `/scale` 子資源的
    副本個數狀態值預設為 0。

<!--
- `labelSelectorPath` defines the JSONPath inside of a custom resource that corresponds to `scale.status.selector`.

  - It is an optional value.
  - It must be set to work with HPA.
  - Only JSONPaths under `.status` or `.spec` and with the dot notation are allowed.
  - If there is no value under the `labelSelectorPath` in the custom resource,
the status selector value in the `/scale` subresource will default to the empty string.
  - The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form.
-->
- `labelSelectorPath` 指定定製資源內與 `scale.status.selector` 對應的 JSON 路徑。

  - 此欄位為可選值。
  - 此欄位必須設定才能使用 HPA。
  - 只可以使用 `.status` 或 `.spec` 下的 JSON 路徑，只可使用帶句點的路徑。
  - 如果定製資源的 `labelSelectorPath` 下沒有取值，則針對 `/scale` 子資源的
    選擇算符狀態值預設為空字串。
  - 此 JSON 路徑所指向的欄位必須是一個字串欄位（而不是複合的選擇算符結構），
    其中包含標籤選擇算符序列化的字串形式。

<!--
In the following example, both status and scale subresources are enabled.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:
-->
在下面的例子中，`status` 和 `scale` 子資源都被啟用。

將此 CustomResourceDefinition 儲存到 `resourcedefinition.yaml` 檔案：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
            status:
              type: object
              properties:
                replicas:
                  type: integer
                labelSelector:
                  type: string
      # subresources 描述定製資源的子資源
      subresources:
        # status 啟用 status 子資源
        status: {}
        # scale 啟用 scale 子資源
        scale:
          # specReplicasPath 定義定製資源中對應 scale.spec.replicas 的 JSON 路徑
          specReplicasPath: .spec.replicas
          # statusReplicasPath 定義定製資源中對應 scale.status.replicas 的 JSON 路徑 
          statusReplicasPath: .status.replicas
          # labelSelectorPath  定義定製資源中對應 scale.status.selector 的 JSON 路徑 
          labelSelectorPath: .status.labelSelector
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

<!--
And create it:
-->
之後建立此 CustomResourceDefinition：

```shell
kubectl apply -f resourcedefinition.yaml
```

<!--
After the CustomResourceDefinition object has been created, you can create custom objects.

If you save the following YAML to `my-crontab.yaml`:
-->
CustomResourceDefinition 物件建立完畢之後，你可以建立定製物件，。

如果你將下面的 YAML 儲存到 `my-crontab.yaml` 檔案：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 3
```

<!--
and create it:
-->
並建立定製物件：

```shell
kubectl apply -f my-crontab.yaml
```

<!--
Then new namespaced RESTful API endpoints are created at:
-->
那麼會建立新的、名稱空間作用域的 RESTful  API 端點：

```
/apis/stable.example.com/v1/namespaces/*/crontabs/status
```

<!-- and -->
和

```
/apis/stable.example.com/v1/namespaces/*/crontabs/scale
```

<!--
A custom resource can be scaled using the `kubectl scale` command.
For example, the following command sets `.spec.replicas` of the
custom resource created above to 5:
-->
定製資源可以使用 `kubectl scale` 命令來擴縮其規模。
例如下面的命令將前面建立的定製資源的 `.spec.replicas` 設定為 5：

```shell
kubectl scale --replicas=5 crontabs/my-new-cron-object
```
```
crontabs "my-new-cron-object" scaled
```
```shell
kubectl get crontabs my-new-cron-object -o jsonpath='{.spec.replicas}'
```
```
5
```

<!--
You can use a [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) to protect custom
resources that have the scale subresource enabled.
-->
你可以使用 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)
來保護啟用了 scale 子資源的定製資源。

<!--
### Categories
-->
### 分類   {#categories}

<!--
Categories is a list of grouped resources the custom resource belongs to (eg. `all`).
You can use `kubectl get <category-name>` to list the resources belonging to the category.

The following example adds `all` in the list of categories in the CustomResourceDefinition
and illustrates how to output the custom resource using `kubectl get all`.

Save the following CustomResourceDefinition to `resourcedefinition.yaml`:
-->
分類（Categories）是定製資源所歸屬的分組資源列表（例如，`all`）。
你可以使用 `kubectl get <分類名稱>` 來列舉屬於某分類的所有資源。

下面的示例在 CustomResourceDefinition 中將 `all` 新增到分類列表中，
並展示瞭如何使用 `kubectl get all` 來輸出定製資源：

將下面的 CustomResourceDefinition 儲存到 `resourcedefinition.yaml` 檔案中：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
    # categories 是定製資源所歸屬的分類資源列表
    categories:
    - all
```

<!--
and create it:
-->
之後建立此 CRD：

```shell
kubectl apply -f resourcedefinition.yaml
```

<!--
After the CustomResourceDefinition object has been created, you can create custom objects.

Save the following YAML to `my-crontab.yaml`:
-->
建立了 CustomResourceDefinition 物件之後，你可以建立定製物件。

將下面的 YAML 儲存到 `my-crontab.yaml` 中：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

<!--
and create it:
-->
並建立定製物件：

```shell
kubectl apply -f my-crontab.yaml
```

<!--
You can specify the category when using `kubectl get`:
-->
你可以在使用 `kubectl get` 時指定分類：

```shell
kubectl get all
```

<!--
The output will include the custom resources of kind `CronTab`:
-->
輸出中會包含類別為 `CronTab` 的定製資源：

```console
NAME                          AGE
crontabs/my-new-cron-object   3s
```

## {{% heading "whatsnext" %}}

<!--
* Read about [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

* See [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

* Serve [multiple versions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) of a
  CustomResourceDefinition.
-->
* 閱讀了解[定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 參閱 [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io)
* 參閱支援 CustomResourceDefinition 的[多個版本](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)


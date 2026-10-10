---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "RuleWithOperations"
content_type: "api_reference"
description: "RuleWithOperations 是由 operations 和 resources 组成的元组。建议确保所有元组展开均有效。"
title: "RuleWithOperations"
weight: 430
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "RuleWithOperations"
content_type: "api_reference"
description: "RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid."
title: "RuleWithOperations"
weight: 430
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## RuleWithOperations {#RuleWithOperations}

<!--
RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid.
-->
RuleWithOperations 是由 operations 和 resources 组成的元组。建议确保所有元组展开均有效。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiGroups</code><br/><em>string array</em></td>
      <td>
      <!--
      apiGroups is the API groups the resources belong to. '\*' is all groups. If '\*' is present, the length of the slice must be one. Required.
      -->
      apiGroups 是资源所属的 API 组。'*' 代表所有组。如果包含 '*'，则切片长度必须为 1。必填项。
      </td>
    </tr>
    <tr>
      <td><code>apiVersions</code><br/><em>string array</em></td>
      <td>
      <!--
      apiVersions is the API versions the resources belong to. '\*' is all versions. If '\*' is present, the length of the slice must be one. Required.
      -->
      apiVersions 是资源所属的 API 版本。'*' 代表所有版本。如果包含 '*'，则切片长度必须为 1。必填项。
      </td>
    </tr>
    <tr>
      <td><code>operations</code><br/><em>string array</em></td>
      <td>
      <!--
      operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '\*' is present, the length of the slice must be one. Required.
      -->
      operations 指定了准入钩子关注的操作类型，包括 CREATE、UPDATE、DELETE、CONNECT，
      或者使用 `*` 来涵盖所有这些操作以及未来新增的准入操作。
      如果使用了 `*`，则该切片的长度必须为 1。必填项。
      </td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em>string array</em></td>
      <td>
      <!--
      resources is a list of resources this rule applies to.  For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '\*' means all resources, but not subresources. 'pods/\*' means all subresources of pods. '\*/scale' means all scale subresources. '\*/\*' means all resources and their subresources.  If wildcard is present, the validation rule will ensure resources do not overlap with each other.  Depending on the enclosing object, subresources might not be allowed. Required.
      -->
      resources 是此规则适用的资源列表。例如：'pods' 指 Pod 资源；'pods/log'
      指 Pod 的 'log' 子资源；'*'' 指所有资源（但不包括子资源）；'pods/*' 指 Pod 的所有子资源；
      '*/scale' 指所有 'scale' 子资源；`*/*` 指所有资源及其子资源。
      如果使用了通配符，验证规则将确保各资源之间互不重叠。
      根据所处的对象类型，某些情况下可能不允许使用子资源。此字段为必填项。
      </td>
    </tr>
    <tr>
      <td><code>scope</code><br/><em>string</em></td>
      <td>
      <!--
      scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".<br/><br/>Possible enum values:<br/> - `"*"` means that all scopes are included.<br/> - `"Cluster"` means that scope is limited to cluster-scoped objects. Namespace objects are cluster-scoped.<br/> - `"Namespaced"` means that scope is limited to namespaced objects.
      -->
      scope 指定了此规则的适用范围。有效值为 "Cluster"、"Namespaced" 和 "*"。
      "Cluster" 表示仅集群作用域（cluster-scoped）的资源匹配此规则；
      Namespace API 对象属于集群作用域资源。
      "Namespaced" 表示仅命名空间作用域（namespaced）的资源匹配此规则。
      "*" 表示无范围限制。子资源（subresources）的适用范围与其父资源相同。默认值为 "*"。<br/><br/>
      可能的枚举值：<br/>
        - `"*"` 表示包含所有范围。<br/>
        - `"Cluster"` 表示范围仅限于集群作用域对象。Namespace 对象属于集群作用域对象。<br/>
        - `"Namespaced"` 表示范围仅限于命名空间作用域对象。
      </td>
    </tr>
  </tbody>
</table>


---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIResource"
content_type: "api_reference"
description: "APIResource 指定了资源的名称以及该资源是否具有命名空间作用域。"
title: "APIResource"
weight: 30
---
<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIResource"
content_type: "api_reference"
description: "APIResource specifies the name of a resource and whether it is namespaced."
title: "APIResource"
weight: 30
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## APIResource {#APIResource}

<!--
APIResource specifies the name of a resource and whether it is namespaced.
-->
APIResource 指定了资源的名称以及该资源是否具有命名空间作用域。

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>categories</code><br/><em>string array</em></td>
      <td>
      <!--
      categories is a list of the grouped resources this resource belongs to (e.g. 'all')
      -->
      categories 是该资源所属的分组资源列表（例如 “all”）。
      </td>
    </tr>
    <tr>
      <td><code>group</code><br/><em>string</em></td>
      <td>
      <!--
      group is the preferred group of the resource.  Empty implies the group of the containing resource list. For subresources, this may have a different value, for example: Scale".
      -->
      group 是该资源的首选组。若为空，则表示所属资源列表的组。对于子资源，该值可能不同，例如："Scale"。
      </td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')
      -->
      kind 是该资源的类型（例如 “Foo” 是资源 “foo” 的类型）。
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      name is the plural name of the resource.
      -->
      name 是该资源的复数名称。
    </td>
    </tr>
    <tr>
      <td><code>namespaced</code>&nbsp;<strong>*</strong><br/><em>boolean</em></td>
      <td>
      <!--
      namespaced indicates if a resource is namespaced or not.
      -->
      namespaced 表示该资源是否具有命名空间作用域。
      </td>
    </tr>
    <tr>
      <td><code>shortNames</code><br/><em>string array</em></td>
      <td>
      <!--
      shortNames is a list of suggested short names of the resource.
      -->
      shortNames 是该资源建议的短名称列表。
      </td>
    </tr>
    <tr>
      <td><code>singularName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface.
      -->
      singularName 是资源的单数名称。这允许客户端以不透明的方式处理复数和单数形式。
      singularName 更适合用于报告单个条目的状态，在 `kubectl` CLI 界面下单数和复数形式都是被允许的。
      </td>
    </tr>
    <tr>
      <td><code>storageVersionHash</code><br/><em>string</em></td>
      <td>
      <!--
      The hash value of the storage version, the version this resource is converted to when written to the data store. Value must be treated as opaque by clients. Only equality comparison on the value is valid. This is an alpha feature and may change or be removed in the future. The field is populated by the apiserver only if the StorageVersionHash feature gate is enabled. This field will remain optional even if it graduates.
      -->  
      存储版本（Storage Version）的哈希值，即该资源在写入数据存储时所转换到的版本。
      该值必须被客户端视为不透明；仅可对该值进行相等性比较。
      这是一项 Alpha 特性，未来可能发生变化或被移除。只有启用了 `StorageVersionHash` 特性门控后，
      apiserver 才会填充此字段。即使该字段升级为正式发布（GA），它也将保持可选。
      </td>
    </tr>
    <tr>
      <td><code>verbs</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>
      <!--
      verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy)
      -->
      verbs 是该资源支持的 kube 动词列表（包括
      get、list、watch、create、update、patch、delete、deletecollection 和 proxy）。
      </td>
    </tr>
    <tr>
      <td><code>version</code><br/><em>string</em></td>
      <td>
      <!--
      version is the preferred version of the resource.  Empty implies the version of the containing resource list. For subresources, this may have a different value, for example: v1 (while inside a v1beta1 version of the core resource's group).
      -->
      version 是该资源的首选版本。若为空，则表示所属资源列表的版本。
      对于子资源，该值可能不同，例如："v1"（在核心资源的 v1beta1 版本中）。
      </td>
    </tr>
  </tbody>
</table>


## APIResourceList {#APIResourceList}

<!--
APIResourceList is a list of APIResource, it is used to expose the name of the resources supported in a specific group and version, and if the resource is namespaced.
-->
APIResourceList 是 APIResource 的列表，用于公开特定组（group）和版本（version）下支持的资源名称，
以及该资源是否属于命名空间（namespaced）范围。

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      -->
      APIVersion 定义了对象这种表示形式的带版本模式。
      服务器应将已识别的模式转换为最新的内部值，并可以拒绝未识别的值。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
      </td>
    </tr>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      groupVersion is the group and version this APIResourceList is for.
      -->
      groupVersion 是该 APIResourceList 所属的组和版本。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 是该对象表示的 REST 资源的字符串值。
      服务器可能根据客户端提交的请求端点推断出此值，不能更新。
      此值为驼峰命名法。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>resources</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-resource-v1-meta#APIResource" >}}">APIResource array</a></em></td>
      <td>
      <!--
      resources contains the name of the resources and if they are namespaced.
      -->
      resources 包含资源的名称以及它们是否属于命名空间范围。
      </td>
    </tr>
  </tbody>
</table>

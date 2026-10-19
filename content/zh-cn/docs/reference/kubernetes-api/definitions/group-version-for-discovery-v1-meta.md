---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupVersionForDiscovery"
content_type: "api_reference"
description: "GroupVersion 包含版本号的 `group/version` 和 `version` 字符串。它被定义为结构体以保持可扩展性。"
title: "GroupVersionForDiscovery"
weight: 150
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "GroupVersionForDiscovery"
content_type: "api_reference"
description: "GroupVersion contains the &#34;group/version&#34; and &#34;version&#34; string of a version. It is made a struct to keep extensibility."
title: "GroupVersionForDiscovery"
weight: 150
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## GroupVersionForDiscovery {#GroupVersionForDiscovery}

<!--
GroupVersion contains the &#34;group/version&#34; and &#34;version&#34; string of a version. It is made a struct to keep extensibility.
-->
GroupVersion 包含版本号的 `group/version` 和 `version` 字符串。它被定义为结构体以保持可扩展性。


<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>groupVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      groupVersion specifies the API group and version in the form "group/version"
      -->
      groupVersion 指定了 API 组和版本，格式为 "group/version"。
      </td>
    </tr>
    <tr>
      <td><code>version</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      version specifies the version in the form of "version". This is to save the clients the trouble of splitting the GroupVersion.
      -->
      version 以 "version" 的格式指定版本。这样做是为了避免客户端需要拆分 GroupVersion 的麻烦。
      </td>
    </tr>
  </tbody>
</table>

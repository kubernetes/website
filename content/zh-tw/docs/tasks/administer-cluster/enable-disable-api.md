---
title: 啓用/禁用 Kubernetes API
content_type: task
weight: 200
---
<!-- 
---
title: Enable Or Disable A Kubernetes API
content_type: task
weight: 200
---
-->

<!-- overview -->
<!-- 
This page shows how to enable or disable an API version from your cluster's
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
-->
本頁展示怎麼用集羣的
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}.
啓用/禁用 API 版本。

<!-- steps -->


<!-- 
Specific API versions can be turned on or off by passing `--runtime-config=api/<version>` as a
command line argument to the API server. The values for this argument are a comma-separated
list of API versions. Later values override earlier values.

The `runtime-config` command line argument also supports 2 special keys:
-->
通過 API 服務器的命令行參數 `--runtime-config=api/<version>` ，
可以開啓/關閉某個指定的 API 版本。
此參數的值是一個逗號分隔的 API 版本列表。
此列表中，後面的值可以覆蓋前面的值。

命令行參數 `runtime-config` 支持兩個特殊的值（keys）：

<!-- 
- `api/all`, representing all known APIs
- `api/legacy`, representing only legacy APIs. Legacy APIs are any APIs that have been
   explicitly [deprecated](/zh-cn/docs/reference/using-api/deprecation-policy/).

For example, to turn off all API versions except v1, pass `--runtime-config=api/all=false,api/v1=true`
to the `kube-apiserver`.
-->
- `api/all`：指所有已知的 API
- `api/legacy`：指過時的 API。過時的 API 就是明確地
  [棄用](/zh-cn/docs/reference/using-api/deprecation-policy/)
  的 API。

例如：爲了停用除去 v1 版本之外的全部其他 API 版本，
就用參數 `--runtime-config=api/all=false,api/v1=true` 啓動 `kube-apiserver`。

## {{% heading "whatsnext" %}}

<!-- 
Read the [full documentation](/docs/reference/command-line-tools-reference/kube-apiserver/)
for the `kube-apiserver` component.
-->
閱讀[完整的文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/),
以瞭解 `kube-apiserver` 組件。
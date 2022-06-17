---
title: 啟用/禁用 Kubernetes API
content_type: task
---
<!-- 
---
title: Enable Or Disable A Kubernetes API
content_type: task
---
-->

<!-- overview -->
<!-- 
This page shows how to enable or disable an API version from your cluster's
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
-->
本頁展示怎麼用叢集的
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}.
啟用/禁用 API 版本。

<!-- steps -->


<!-- 
Specific API versions can be turned on or off by passing `--runtime-config=api/<version>` as a
command line argument to the API server. The values for this argument are a comma-separated
list of API versions. Later values override earlier values.

The `runtime-config` command line argument also supports 2 special keys:
-->
透過 API 伺服器的命令列引數 `--runtime-config=api/<version>` ，
可以開啟/關閉某個指定的 API 版本。
此引數的值是一個逗號分隔的 API 版本列表。
此列表中，後面的值可以覆蓋前面的值。

命令列引數 `runtime-config` 支援兩個特殊的值（keys）：

<!-- 
- `api/all`, representing all known APIs
- `api/legacy`, representing only legacy APIs. Legacy APIs are any APIs that have been
   explicitly [deprecated](/zh-cn/docs/reference/using-api/deprecation-policy/).

For example, to turning off all API versions except v1, pass `--runtime-config=api/all=false,api/v1=true`
to the `kube-apiserver`.
-->
- `api/all`：指所有已知的 API
- `api/legacy`：指過時的 API。過時的 API 就是明確地
  [棄用](/zh-cn/docs/reference/using-api/deprecation-policy/)
  的 API。

例如：為了停用除去 v1 版本之外的全部其他 API 版本，
就用引數 `--runtime-config=api/all=false,api/v1=true` 啟動 `kube-apiserver`。

## {{% heading "whatsnext" %}}

<!-- 
Read the [full documentation](/docs/reference/command-line-tools-reference/kube-apiserver/)
for the `kube-apiserver` component.
-->
閱讀[完整的文件](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/),
以瞭解 `kube-apiserver` 元件。
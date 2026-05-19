---
title: Enable Or Disable A Kubernetes API
content_type: task
weight: 200
---

<!-- overview -->
This page shows how to enable or disable an API version from your cluster's
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

<!-- steps -->


Specific API versions can be turned on or off by passing `--runtime-config=api/<version>` as a
command line argument to the API server. The values for this argument are a comma-separated
list of API versions. Later values override earlier values.

The `runtime-config` command line argument also supports 2 special keys:

- `api/all`, representing all known APIs
- `api/legacy`, representing only legacy APIs. Legacy APIs are any APIs that have been
   explicitly [deprecated](/docs/reference/using-api/deprecation-policy/).

For example, to turn off all API versions except v1, pass `--runtime-config=api/all=false,api/v1=true`
to the `kube-apiserver`.

## {{% heading "whatsnext" %}}

Read the [full documentation](/docs/reference/command-line-tools-reference/kube-apiserver/)
for the `kube-apiserver` component.

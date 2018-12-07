---
title: kubectl-test
content_template: templates/tool-reference
weight: 25
---

{{% capture synopsis %}}
The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```shell
kube-apiserver [flags]
```

{{% /capture %}}

{{% capture options %}}

<table>
  <tbody>

    <tr>
      <td>--admission-control-config-file string</td>
    </tr>
    <tr>
      <td></td><td>File with admission control configuration.</td>
    </tr>

    <tr>
      <td>--advertise-address ip</td>
    </tr>
    <tr>
      <td></td><td>The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.</td>
    </tr>
    </tbody>
    </table>

{{% /capture %}}

{{% capture body %}}

## First section in the body

This is a test, just a test of a command line tool template.

## Another section in the body

This is a test, in the second section.

{{% /capture %}}

{{% capture seealso %}}

Add individual links to command line tool usage

{{% /capture %}}
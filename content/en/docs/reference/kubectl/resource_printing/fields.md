---
title: "Fields"
linkTitle: "Fields"
weight: 3
type: docs
description: >
    Prints based on Field values
---



## Motivation

Kubectl Get is able to pull out fields from Resources it queries and format them as output.

This may be **useful for scripting or gathering data** about Resources from a Kubernetes cluster.

## Get

The `kubectl get` reads Resources from the cluster and formats them as output.  The examples in
this chapter will query for Resources by providing Get the *Resource Type* with the
Version and Group as an argument.
For more query options see [Queries and Options](/guides/resource_printing/queries_and_options/).

Kubectl can format and print specific fields from Resources using Json Path.

{{< alert color="warning" title="Scripting Pitfalls" >}}
By default, if no API group or version is specified, kubectl will use the group and version preferred by
the apiserver.

Because the **Resource structure may change between API groups and Versions**, users *should* specify the
API Group and Version when emitting fields from `kubectl get` to make sure the command does not break
in future releases.

Failure to do this may result in the different API group / version being used after a cluster upgrade, and
this group / version may have changed the representation of fields.
{{< /alert >}}

***Example:*** Print the JSON representation of the first Deployment in the list on a single line
```bash
kubectl get deployment.v1.apps -o=jsonpath='{.items[0]}{"\n"}'
```

you get:
```bash
map[apiVersion:apps/v1 kind:Deployment...replicas:1 updatedReplicas:1]]
```

This ideology can be extended to query out the specific fields in a yaml resource file.

{{% alert color="success" title="Command / Examples" %}}
Check out the [reference](/references/kubectl/get/options/field/) for more commands and examples.
{{% /alert %}}

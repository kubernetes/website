---
approvers:
- bgrant0607
- hw-qiaolei
title: Overview of kubectl
---

`kubectl` is a command line interface for running commands against Kubernetes clusters. This overview covers `kubectl` syntax, describes the command operations, and provides common examples. For details about each command, including all the supported flags and subcommands, see the [kubectl](/docs/user-guide/kubectl/) reference documentation. For installation instructions see [installing kubectl](/docs/tasks/kubectl/install/).

## Syntax

Use the following syntax to run `kubectl` commands from your terminal window:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

where `command`, `TYPE`, `NAME`, and `flags` are:

* `command`: Specifies the operation that you want to perform on one or more resources, for example `create`, `get`, `describe`, `delete`.

* `TYPE`: Specifies the [resource type](#resource-types). Resource types are case-insensitive and you can specify the singular, plural, or abbreviated forms. For example, the following commands produce the same output:

      $ kubectl get pod pod1
      $ kubectl get pods pod1
      $ kubectl get po pod1
   
* `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted, details for all resources are displayed, for example `$ kubectl get pods`.

   When performing an operation on multiple resources, you can specify each resource by type and name or specify one or more files:
   
   * To specify resources by type and name:
   
        * To group resources if they are all the same type:  `TYPE1 name1 name2 name<#>`.<br/>
        Example: `$ kubectl get pod example-pod1 example-pod2`
        
        * To specify multiple resource types individually:  `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
        Example: `$ kubectl get pod/example-pod1 replicationcontroller/example-rc1`
        
   * To specify resources with one or more files:  `-f file1 -f file2 -f file<#>`
   
        * [Use YAML rather than JSON](/docs/concepts/configuration/overview/#general-config-tips) since YAML tends to be more user-friendly, especially for configuration files.<br/>
     Example: `$ kubectl get pod -f ./pod.yaml`
* `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags to specify the address and port of the Kubernetes API server.<br/>
**Important**: Flags that you specify from the command line override default values and any corresponding environment variables.

If you need help, just run `kubectl help` from the terminal window.

## Operations

The following table includes short descriptions and the general syntax for all of the `kubectl` operations:

Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`annotate`    | `kubectl annotate (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | Add or update the annotations of one or more resources.
`api-versions`    | `kubectl api-versions [flags]` | List the API versions that are available.
`apply`            | `kubectl apply -f FILENAME [flags]`| Apply a configuration change to a resource from a file or stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Attach to a running container either to view the output stream or interact with the container (stdin).
`autoscale`    | `kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]` | Automatically scale the set of pods that are managed by a replication controller.
`cluster-info`    | `kubectl cluster-info [flags]` | Display endpoint information about the master and services in the cluster.
`config`        | `kubectl config SUBCOMMAND [flags]` | Modifies kubeconfig files. See the individual subcommands for details.
`create`        | `kubectl create -f FILENAME [flags]` | Create one or more resources from a file or stdin.
`delete`        | `kubectl delete (-f FILENAME | TYPE [NAME | /NAME | -l label | --all]) [flags]` | Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.
`describe`    | `kubectl describe (-f FILENAME | TYPE [NAME_PREFIX | /NAME | -l label]) [flags]` | Display the detailed state of one or more resources.
`edit`        | `kubectl edit (-f FILENAME | TYPE NAME | TYPE/NAME) [flags]` | Edit and update the definition of one or more resources on the server by using the default editor.
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Execute a command against a container in a pod,
`explain`    | `kubectl explain [--include-extended-apis=true] [--recursive=false] [flags]` | Get documentation of various resources. For instance pods, nodes, services, etc.
`expose`        | `kubectl expose (-f FILENAME | TYPE NAME | TYPE/NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [----external-ip=external-ip-of-service] [--type=type] [flags]` | Expose a replication controller, service, or pod as a new Kubernetes service.
`get`        | `kubectl get (-f FILENAME | TYPE [NAME | /NAME | -l label]) [--watch] [--sort-by=FIELD] [[-o | --output]=OUTPUT_FORMAT] [flags]` | List one or more resources.
`label`        | `kubectl label (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | Add or update the labels of one or more resources.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Print the logs for a container in a pod.
`patch`        | `kubectl patch (-f FILENAME | TYPE NAME | TYPE/NAME) --patch PATCH [flags]` | Update one or more fields of a resource by using the strategic merge patch process.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Forward one or more local ports to a pod.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Run a proxy to the Kubernetes API server.
`replace`        | `kubectl replace -f FILENAME` | Replace a resource from a file or stdin.
`rolling-update`    | `kubectl rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE | -f NEW_CONTROLLER_SPEC) [flags]` | Perform a rolling update by gradually replacing the specified replication controller and its pods.
`run`        | `kubectl run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [flags]` | Run a specified image on the cluster.
`scale`        | `kubectl scale (-f FILENAME | TYPE NAME | TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]` | Update the size of the specified replication controller.
`stop`        | `kubectl stop` | Deprecated: Instead, see `kubectl delete`.
`version`        | `kubectl version [--client] [flags]` | Display the Kubernetes version running on the client and server.

Remember: For more about command operations, see the [kubectl](/docs/user-guide/kubectl/) reference documentation.

## Resource types

The following table includes a list of all the supported resource types and their abbreviated aliases:

Resource type    | Abbreviated alias
-------------------- | --------------------
`apiservices` |
`certificatesigningrequests` |`csr`
`clusters` |
`clusterrolebindings` |
`clusterroles` |
`componentstatuses` |`cs`
`configmaps` |`cm`
`controllerrevisions` |
`cronjobs` |
`customresourcedefinition` |`crd`
`daemonsets` |`ds`
`deployments` |`deploy`
`endpoints` |`ep`
`events` |`ev`
`horizontalpodautoscalers` |`hpa`
`ingresses` |`ing`
`jobs` |
`limitranges` |`limits`
`namespaces` |`ns`
`networkpolicies` |`netpol`
`nodes` |`no`
`persistentvolumeclaims` |`pvc`
`persistentvolumes` |`pv`
`poddisruptionbudget` |`pdb`
`podpreset` |
`pods` |`po`
`podsecuritypolicies` |`psp`
`podtemplates` |
`replicasets` |`rs`
`replicationcontrollers` |`rc`
`resourcequotas` |`quota`
`rolebindings` |
`roles` |
`secrets` |
`serviceaccounts` |`sa`
`services` |`svc`
`statefulsets` |
`storageclasses` |

## Output options

Use the following sections for information about how you can format or sort the output of certain commands. For details about which commands support the various output options, see the [kubectl](/docs/user-guide/kubectl/) reference documentation.

### Formatting output

The default output format for all `kubectl` commands is the human readable plain-text format. To output details to your terminal window in a specific format, you can add either the `-o` or `-output` flags to a supported `kubectl` command.

#### Syntax

```shell
kubectl [command] [TYPE] [NAME] -o=<output_format>
```

Depending on the `kubectl` operation, the following output formats are supported:

Output format | Description
--------------| -----------
`-o=custom-columns=<spec>` | Print a table using a comma separated list of [custom columns](#custom-columns).
`-o=custom-columns-file=<filename>` | Print a table using the [custom columns](#custom-columns) template in the `<filename>` file.
`-o=json`     | Output a JSON formatted API object.
`-o=jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/user-guide/jsonpath) expression.
`-o=jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/user-guide/jsonpath) expression in the `<filename>` file.
`-o=name`     | Print only the resource name and nothing else.
`-o=wide`     | Output in the plain-text format with any additional information. For pods, the node name is included.
`-o=yaml`     | Output a YAML formatted API object.

##### Example

In this example, the following command outputs the details for a single pod as a YAML formatted object:

`$ kubectl get pod web-pod-13je7 -o=yaml`

Remember: See the [kubectl](/docs/user-guide/kubectl/) reference documentation for details about which output format is supported by each command.

#### Custom columns

To define custom columns and output only the details that you want into a table, you can use the `custom-columns` option. You can choose to define the custom columns inline or use a template file: `-o=custom-columns=<spec>` or `-o=custom-columns-file=<filename>`.

##### Examples

Inline:

```shell
$ kubectl get pods <pod-name> -o=custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

Template file:

```shell
$ kubectl get pods <pod-name> -o=custom-columns-file=template.txt
```

where the `template.txt` file contains:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```
The result of running either command is:

```shell
NAME           RSRC
submit-queue   610995
```

#### Server-side columns

`kubectl` supports receiving specific column information from the server about objects.
This means that for any given resource, the server will return columns and rows relevant to that resource, for the client to print.
This allows for consistent human-readable output across clients used against the same cluster, by having the server encapsulate the details of printing.

To output object information using this feature, you can add the `--experimental-server-print` flag to a supported `kubectl` command.

##### Examples

```shell
$ kubectl get pods <pod-name> --experimental-server-print
```

The result of running this command is:

```shell
NAME       READY     STATUS              RESTARTS   AGE
pod-name   1/1       Running             0          1m

### Sorting list objects

To output objects to a sorted list in your terminal window, you can add the `--sort-by` flag to a supported `kubectl` command. Sort your objects by specifying any numeric or string field with the `--sort-by` flag. To specify a field, use a [jsonpath](/docs/user-guide/jsonpath) expression.

#### Syntax

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### Example

To print a list of pods sorted by name, you run:

`$ kubectl get pods --sort-by=.metadata.name`

## Examples: Common operations

Use the following set of examples to help you familiarize yourself with running the commonly used `kubectl` operations:

`kubectl create` - Create a resource from a file or stdin.

```shell
// Create a service using the definition in example-service.yaml.
$ kubectl create -f example-service.yaml

// Create a replication controller using the definition in example-controller.yaml.
$ kubectl create -f example-controller.yaml

// Create the objects that are defined in any .yaml, .yml, or .json file within the <directory> directory.
$ kubectl create -f <directory>
```

`kubectl get` - List one or more resources.

```shell
// List all pods in plain-text output format.
$ kubectl get pods

// List all pods in plain-text output format and includes additional information (such as node name).
$ kubectl get pods -o wide

// List the replication controller with the specified name in plain-text output format. Tip: You can shorten and replace the 'replicationcontroller' resource type with the alias 'rc'.
$ kubectl get replicationcontroller <rc-name>

// List all replication controllers and services together in plain-text output format.
$ kubectl get rc,services

// List all daemon sets, including uninitialized ones, in plain-text output format.
$ kubectl get ds --include-uninitialized

// List all pods running on node server01
$ kubectl get pods --field-selector=spec.nodeName=server01

// List all pods in plain-text output format, delegating the details of printing to the server
$ kubectl get pods --experimental-server-print
```

`kubectl describe` - Display detailed state of one or more resources, including the uninitialized ones by default.

```shell
// Display the details of the node with name <node-name>.
$ kubectl describe nodes <node-name>

// Display the details of the pod with name <pod-name>.
$ kubectl describe pods/<pod-name>

// Display the details of all the pods that are managed by the replication controller named <rc-name>.
// Remember: Any pods that are created by the replication controller get prefixed with the name of the replication controller.
$ kubectl describe pods <rc-name>

// Describe all pods, not including uninitialized ones
$ kubectl describe pods --include-uninitialized=false
```

{{< note >}}
**Note:** The `kubectl get` command is usually used for retrieving one or more
resources of the same resource type. It features a rich set of flags that allows
you to customize the output format using the `-o` or `--output` flag, for example.
You can specify the `-w` or `--watch` flag to start watching updates to a particular
object. The `kubectl describe` command is more focused on describing the many
related aspects of a specified resource. It may invoke several API calls to the
API server to build a view for the user. For example, the `kubectl describe node`
command retrieves not only the information about the node, but also a summary of
the pods running on it, the events generated for the node etc.
{{< /note >}}

`kubectl delete` - Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.

```shell
// Delete a pod using the type and name specified in the pod.yaml file.
$ kubectl delete -f pod.yaml

// Delete all the pods and services that have the label name=<label-name>.
$ kubectl delete pods,services -l name=<label-name>

// Delete all the pods and services that have the label name=<label-name>, including uninitialized ones.
$ kubectl delete pods,services -l name=<label-name> --include-uninitialized

// Delete all pods, including uninitialized ones.
$ kubectl delete pods --all
```

`kubectl exec` - Execute a command against a container in a pod.

```shell
// Get output from running 'date' from pod <pod-name>. By default, output is from the first container.
$ kubectl exec <pod-name> date

// Get output from running 'date' in container <container-name> of pod <pod-name>.
$ kubectl exec <pod-name> -c <container-name> date

// Get an interactive TTY and run /bin/bash from pod <pod-name>. By default, output is from the first container.
$ kubectl exec -ti <pod-name> /bin/bash
```

`kubectl logs` - Print the logs for a container in a pod.

```shell
// Return a snapshot of the logs from pod <pod-name>.
$ kubectl logs <pod-name>

// Start streaming the logs from pod <pod-name>. This is similar to the 'tail -f' Linux command.
$ kubectl logs -f <pod-name>
```


## Next steps

Start using the [kubectl](/docs/user-guide/kubectl/) commands.

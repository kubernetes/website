---
title: Managing Kubernetes Objects Using Imperative Commands
---

{% capture overview %}
Kubernetes objects can quickly be created, updated, and deleted directly using
imperative commands built into `kubectl`.  This document explains how
those commands are organized and how to use them to manage live objects.
{% endcapture %}

{% capture body %}

## Trade-offs

Advantages compared to object configuration:

- Commands are simple, easy to learn and easy to remember.
- Commands require only a single step to make changes to the cluster.

Disadvantages compared to object configuration:

- Commands do not integrate with change review processes.
- Commands do not provide an audit trail associated with changes.
- Commands do not provide a source of records except for what is live.
- Commands do not provide a template for creating new objects.


## How to create objects

*Verb* driven creation commands exist for some of the most common object types.
They are named to be recognizable to users unfamiliar with the Kubernetes
object types.

- `run`: Create a new Deployment object to run one or more instances of a Container in a Pod.
- `expose`: Create a new Service object to load balance traffic across one or more Containers running in Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller (such as a Deployment).

*Object* type driven commands exist for a broader set of objects.  These
commands require that the user know the type of object they intend
to create, but support more object types and are more explicit about
their intent.

- `create <objecttype> [<subtype>] <instancename>`

Some objects can be configured in multiple ways.  The commands
for creating these objects have sub-commands that specify how
the object is configured.  For example, when creating a Service the
Service type is provided as a sub-command: `kubectl create service nodeport <myservicename>`.

The args and flags for creating a specific object can be found using
the `-h` flag after the sub-command: `kubectl create service nodeport -h`

## How to update objects

*Verb* driven update commands exist for some common operations.  These
commands are named to enable users unfamiliar with the Kubernetes
objects to perform operations without knowing the specific fields
that must be set to perform the operation.

- `scale`: Horizonally scale a controller to add or remove Pods by updating the replica count on a controller.
- `annotate`: Add or remove an annotation from an object in the cluster.
- `label`: Add or remove a label from an object in the cluster.

*Field* driven commands exist for updating a broader set of fields.  These
commands require that the user generally know the name of the field
they need to update.  *Field* driven commands currently do not exist for
all of the *Verb*, but will in the future.

- `set` <Field>: Set a specific field to a value on a object in the cluster

`kubectl` supports these additional ways to update a live object directly,
however they require a better understanding of the Kubernetes object schema being updated.

- `edit`: Directly edit the raw configuration of a live object using a text editor by opening its configuration in an editor.
- `patch`: Directly modify specific fields on a live object using a patch string.  For more details on patch strings, see the patch section in [API Conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#patch-operations).

## How to delete objects

Objects can be delete from the cluster using the deletion command.

**Note:** This is the same command for both *imperative commands* and
*imperative object configuration*, but using different arguments
for each.  When using *imperative commands* the object to be deleted is
passed as an argument `deployment/nginx`, or with a label selector flag
`deployment -l service=myservice`

- `delete type/name`

## How to view an object

Specific fields for an object can be printed using the counter-part
of `set`: `view`

- `view`: Prints the value of a specific field on a object.

There are several more commands for printing additional information about
an object:

- `get`: Prints basic information about matching objects.  Use `get -h` to see a list of options.
- `describe`: Prints aggregated detailed information about matching object.
- `logs`: Prints the stdout and stderr for a container running in a Pod.
- `top`: Print machine resource usage (cpu, memory) for a Kubernetes object

## Using `set` Commands to Modify Objects Before Creation

When creating a object the user may find that they want to specify a field,
but no creation flag exists to define it.  In some cases, they can
use the `set` commands to modify these fields before creation of the object.  This
is done by piping the output of the creation request to the `set` command
and then back into create.

Example:

```sh
kubectl create service clusterip <myservicename> -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

1. The `create service -o yaml --dry-run` command creates the config for the Service, but prints it to stdout as a yaml config instead of sending it to the Kubernetes API server.
2. The `set --local -f - -o yaml` command reads the config from stdin, and writes the updated config to stdout as yaml.
3. The `kubectl create -f -` command creates the object using the config provided via stdin.

## Using `--edit` to modify Objects Before Creation

Making arbitrary changes to the object before it is created is supported
by writing the configuration to a file and creating it with
`kubectl create --edit -f <file>`.

```sh
kubectl create service clusterip my-svc -o yaml --dry-run > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

{% endcapture %}

{% capture whatsnext %}
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/tools/kubectl/object-management-using-declarative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes Object Schema Reference](/docs/objects-reference/v1.5/)
{% endcapture %}

{% include templates/concept.md %}

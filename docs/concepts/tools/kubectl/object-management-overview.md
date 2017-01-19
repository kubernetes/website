---
    title: Kubenetes Object Management
---

{% capture overview %}
`kubectl` supports several different ways to create and manage
Kubernetes objects.  This document provides an overview of the different
approaches.
{% endcapture %}

{% capture body %}

# Management techniques table

**Warning:** A Kubernetes object should be managed using only 1 technique.  Mixing
and matching technique for the same object results in undefined behavior.

| Management Technique             | Operates On          |Recommended Environment | Supported Writers  | Learning Curve |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Imperative Commands              | Live Objects         | Development Projects   | 1+                 | Lowest         |
| Imperative Object Configuration  | Individual Files     | Production Projects    | 1                  | Moderate       |
| Declarative Object Configuration | Directories of Files | Production Projects    | 1+                 | Highest        |

# Imperative commands

When using imperative commands, a user operates directly on live objects
in a cluster.  The operations are provided to
the `kubectl` command line interface as arguments or flags.

This is the simplest way to get started or to run a one-off tasks in
a cluster.  Because this technique operates directly on the live
objects, it provides no history of previous configurations.

## Imperative command examples

Run an instance of the *nginx* container by creating a Deployment object

    ```sh
    kubectl run nginx --image nginx
    ```

Same as above, but using a different syntax

    ```sh
    kubectl create deployment nginx --image nginx
    ```

## Imperative command trade-offs

Advantages compared to *object configuration*

- Commands are simple, easy to learn and easy to remember
- Commands require only a single step to make changes to the cluster

Disadvantages compared to *object configuration*

- Commands do not integrate with change review processes
- Commands do not provide an audit trail associated with changes
- Commands do not provide a source of record beside what is live
- Commands do not provide a template for bootstrapping new objects

<!---
For a tutorial on how to use Imperative Commands for app management, see:
[App Management Using Comands](/docs/tutorials/kubectl/app-management-using-commands/)
-->

# Imperative object configuration

When using imperative object configuration, a user operates on object
configuration files stored locally.  The object configuration defines the full
object in either yaml or json.  An operation (create, replace, delete)
and one or more files are provide to `kubectl` as a command line argument
and flag command line flags respectively.

This technique requires a more in depth understanding of the Kubernetes
Object definitions.

**Note:** While this technique defines the object itself through a declarative
configuration file, the operations are imperative - create, replace, delete.

## Imperative object configuration example

Create the objects defined in the object configuration file

    ```sh
    kubectl create -f nginx.yaml
    ```

Delete the objects defined in the object configuration files

    ```sh
    kubectl delete -f nginx.yaml -f redis.yaml
    ```

Update the objects defined in the object configuration files by overwriting
the live configuration.

    ```sh
    kubectl replace -f nginx.yaml
    ```

## Imperative object configuration trade-offs

Advantages compared to *imperative commands*

- Object configuration can be stored in a source control system such as *git*
- Can integrate with processes such as reviewing changes before push and audit trails
- Provides template for bootstrapping new objects

Disadvantages compared to *imperative commands*

- Object configuration requires basic understanding of the object schema
- Initial creation of object configuration requires additional step of writing the yaml file

Advantages compared to  *declarative object configuration*

- Imperative object configuration behavior is simpler and easier to understand
- Imperative object configuration is more mature

Disadvantages compared to *declarative object configuration*

- Imperative object configuration works best on files, not directories
- Updates to live objects must be reflected in object configuration or they will be lost during next replace.

<!---
For a tutorial on how to use Yaml Config for app management, see:
[App Management Yaml Config](/docs/tutorials/kubectl/app-management-using-yaml-config/)
-->

# Declarative object configuration

When using declarative object configuration, a user operates on object
configuration files stored locally, however it *does not define the operations
on them*.  Create, update and delete operations are automatically detected
per-object by `kubectl`.  This enables working on directories, where
different operations may be needed for different objects.

**Note:** Declarative object configuration retains changes made by other
writers, even if the changes are not merged back to the object configuration file.
This is possible by using the *patch* API operation to write only
observed differences, instead of using the *replace*
API operation to replace the entire object configuration.

## Declarative object configuration Example

    ```sh
    kubectl apply -f configs/
    ```

## Declarative object configuration trade-offs

Advantages compared to *imperative object configuration*:

- Updates keep changes made directly to live objects, even if they are not merged back to the object config
- Better support for operating on directories and automatically detecting operation types per-object *(create, patch, delete)*

Disadvantages compared to *imperative object configuration*:

- Harder to debug and understand unexpected results
  - Perform partial updates using diffs creates complex merge and patch strategies
- Less mature.  Known issues with specific operations exist
- Limited support for ThirdPartyResources

<!---
For a tutorial on how to use Yaml Config with multiple writers, see:
[App Management Yaml Config](/docs/tutorials/kubectl/app-management-using-yaml-config-multiple-writers/)
-->

{% endcapture %}

{% capture whatsnext %}
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes Object Schema Reference](/docs/resources-reference/v1.5/)

<!---
- [App Management Using Yaml Config](/docs/tutorials/kubectl/declarative-app-management-using-yaml-config/)
- [App Management Using Yaml Config With Multiple Writers](/docs/tutorials/kubectl/declarative-app-management-using-yaml-config-multiple-writers/)
-->
{% endcapture %}

{% include templates/concept.md %}

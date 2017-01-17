---
title: App Management Overview
---

{% capture overview %}

*Kubectl* supports several different approaches for creating and managing
applications in a Kubernetes cluster.  This document provides an overview
of the different approaches and which environment each approach is best
suited towards.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

### Prerequisites

- [Kubernetes Basics Tutorial](/docs/tutorials/kubernetes-basics/)

{% endcapture %}

{% capture objectives %}

- Explore the different approaches for managing applications supported by *kubectl*.
- Explore which environment each approach is best suited for.

{% endcapture %}


{% capture lessoncontent %}

# App Management Styles Table

**Currently, a given resource should be managed using only 1 style.  Attempting
to mix-and-match styles for the same resource will result in undefined behavior.**

| Management Style          | Environment             | Writers  | Operates Best On     | Learning Curve |
|---------------------------|-------------------------|----------|----------------------|----------------|
| Imperative Commands       | Dev or Small Clusters   | 1+       | Live Resources       | Lowest         |
| Basic Yaml Config         | Production Clusters     | 1        | Individual Files     | Moderate       |
| Yaml Config with Apply    | Production Clusters     | 1+       | Directories of Files | Highest        |

# Imperative Commands

## Command Examples

Run an instance of the *nginx* container by creating a Deployment Resource

```sh
kubectl run nginx --image nginx
```

Same as above with different syntax (specifies resource type)

```sh
kubectl create deployment nginx --image nginx
```

## Command Overview

*Kubectl* supports creating, updating, and deleting applications directly
using the command line.  In this mode, the Kubernetes resources are
configured through commandline flags.  This is the simplest way to get
started or to run a one-off tasks in a cluster.  Because it does
not provide an audit record or source of record outside what is live
in the cluster, it may not be well suited for large production
environments or critical applications.

Advantages over *Config*

- Commands are simple, easy to learn and easy to remember
- Commands require only a single step to make changes to the cluster

Disadvantages over *Config*

- No review process for making changes
- No audit trail associated with changes
- No source of record beside what is live
- No template for bootstrapping new applications

<!---
For a tutorial on how to use Imperative Commands for app management, see:
[App Management Using Comands](/docs/tutorials/kubectl/app-management-using-commands/)
-->

# Basic Yaml Config

## Config Example

Create the resource defined in the configuration file.

```sh
kubectl create -f nginx_deployment.yaml
```

## Config Overview

*Kubectl* supports creating, updating, and deleting applications by defining
their configuration locally in a yaml or json config file, and using
it as the basis to create, update or delete an application.

This approach updates the application using `replace`, which will
replace the existing resource spec in the cluster with the one provided
to *kubectl*.

Advantages over *Imperative Commands*

- Config can be stored in a and SCM such as *git*
- Config contains source of record for resource
- Provides template for bootstrapping new applications

Disadvantages over *Imperative Commands*

- Config requires understanding resource definitions
- Initial creation of resource requires additional step of creating the defintion in a file

Advantages over *Yaml Config with `apply`*

- Behavior is simpler and easier to understand
- Better support for ThirdPartyResources
- Fewer edge cases

Disadvantages over *Yaml Config with `apply`*

- Works best on files, since it requires specify the operation (create, replace, delete)
  - Cannot mix create, replace, delete for different resources
- Updates to live resources must be reflected in config or will be lost during next replace.
  - **If the resource spec in the cluster is written to by sources without updating the yaml config, those changes will be lost when replacing the resource spec.**

<!---
For a tutorial on how to use Yaml Config for app management, see:
[App Management Yaml Config](/docs/tutorials/kubectl/app-management-using-yaml-config/)
-->

# Yaml Config with `apply`

## Apply Example

```sh
kubectl apply -f configs/
```

## Apply Overview

*Kubectl* has a declarative config management mode called `apply`.  This
supports several capabilities that the basic yaml config
do not support.

Advantages over basic *Yaml Config*:

- Retains changes made directly to the live resource even if they are not written to the backing config.
- Operates on directories and automatically detects the operation type per-resources *(create, patch, delete)*

Disadvantages over basic *Yaml Config*:

- Working on directories and doing patches is more complicated
- Still under development.  Known issues with specific resource types exist.
- Limited support for ThirdPartyResources

## Keeping changes without updating the config

This is done by applying **only** the deltas between the new config and the last config
to the live resource.

An example of this use case would be when using a *HorizonalPodAutoscaler*
to write the controller replica count, and omitting the replica count
from the spec.

## Operating on directories instead of files

Apply can take a directory as the `-f` argument, and recursively apply
each resource.  This will automatically detect whether a resource
is being created or patched (note - this is different than replace).
Detecting resources to delete is also supported, but in alpha only.

## Important Considerations

Apply updates resources by patching in changes to individual fields instead
or by replacing the entire configuration.  This can make understanding
the results of `apply` more challenging.

<!---
For a tutorial on how to use Yaml Config with multiple writers, see:
[App Management Yaml Config](/docs/tutorials/kubectl/app-management-using-yaml-config-multiple-writers/)
-->

# Migrating a Resource From One Management Style to Another

## From *Imperative Commands* -> *Yaml Config*

1. Output the config for the resource to a file using:

   ```sh
   kubectl get type/name -o yaml > type_name.yaml
   ```

2. Delete the *Status* field from the config, since this is managed by the system

3. *Optional:* Delete any server default fields from the config
  - The server will default certain fields if they are unset.  These can be safely removed from the config.

# From *Yaml Config* -> *Imperative Commands*

No changes required.  Stop using the yaml config.

# From *Hybrid* -> *Yaml Config*

1. Output the config for the resource to a file using:

   ```sh
   kubectl get type/name -o yaml > type_name.yaml
   ```

2. Delete the *Status* field from the config, since this is managed by the system

3. *Optional:* Delete any server default fields from the config
  - The server will default certain fields if they are unset.  These can be safely removed from the config.

# From *Yaml Config* -> *Hybrid*

**This is currently not well supported and requires an understanding of how `kubectl apply` works.**


{% endcapture %}

{% capture whatsnext %}
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
<!---
- [App Management Using Yaml Config](/docs/tutorials/kubectl/declarative-app-management-using-yaml-config/)
- [App Management Using Yaml Config With Multiple Writers](/docs/tutorials/kubectl/declarative-app-management-using-yaml-config-multiple-writers/)
-->
{% endcapture %}

{% include templates/tutorial.md %}

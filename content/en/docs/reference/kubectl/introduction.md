---
title: "Introduction To Kubectl"
content_type: concept
weight: 1
---

Kubectl is the Kubernetes cli version of a swiss army knife, and can do many things.

While this Book is focused on using Kubectl to declaratively manage Applications in Kubernetes, it
also covers other Kubectl functions.

## Command Families

Most Kubectl commands typically fall into one of a few categories:

| Type                                   | Used For                   | Description                                        |
|----------------------------------------|----------------------------|----------------------------------------------------|
| Declarative Resource Management        | Deployment and Operations (e.g. GitOps)   | Declaratively manage Kubernetes Workloads using Resource Config     |
| Imperative Resource Management         | Development Only           | Run commands to manage Kubernetes Workloads using Command Line arguments and flags |
| Printing Workload State | Debugging  | Print information about Workloads |
| Interacting with Containers | Debugging  | Exec, Attach, Cp, Logs |
| Cluster Management | Cluster Ops | Drain and Cordon Nodes |

## Declarative Application Management

The preferred approach for managing Resources is through
declarative files called Resource Config used with the Kubectl *Apply* command.
This command reads a local (or remote) file structure and modifies cluster state to
reflect the declared intent.

{{< alert color="success" title="Apply" >}}
Apply is the preferred mechanism for managing Resources in a Kubernetes cluster.
{{< /alert >}}

## Printing state about Workloads

Users will need to view Workload state.

- Printing summarize state and information about Resources
- Printing complete state and information about Resources
- Printing specific fields from Resources
- Query Resources matching labels

## Debugging Workloads

Kubectl supports debugging by providing commands for:

- Printing Container logs
- Printing cluster events
- Exec or attaching to a Container
- Copying files from Containers in the cluster to a user's filesystem

## Cluster Management

On occasion, users may need to perform operations to the Nodes of cluster.  Kubectl supports
commands to drain Workloads from a Node so that it can be decommission or debugged.

## Porcelain

Users may find using Resource Config overly verbose for *Development* and prefer to work with
the cluster *imperatively* with a shell-like workflow.  Kubectl offers porcelain commands for
generating and modifying Resources.

- Generating + creating Resources such as Deployments, StatefulSets, Services, ConfigMaps, etc
- Setting fields on Resources
- Editing (live) Resources in a text editor

{{< alert color="warning" title="Porcelain For Dev Only" >}}
Porcelain commands are time saving for experimenting with workloads in a dev cluster, but shouldn't
be used for production.
{{< /alert >}}

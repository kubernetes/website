---
title: "Introduction to kubectl"
content_type: concept
weight: 1
---

kubectl is the Kubernetes cli version of a swiss army knife, and can do many things.

While this Book is focused on using kubectl to declaratively manage applications in Kubernetes, it
also covers other kubectl functions.

## Command Families

Most kubectl commands typically fall into one of a few categories:

| Type                                   | Used For                   | Description                                        |
|----------------------------------------|----------------------------|----------------------------------------------------|
| Declarative Resource Management        | Deployment and operations (e.g. GitOps)   | Declaratively manage Kubernetes workloads using resource configuration     |
| Imperative Resource Management         | Development Only           | Run commands to manage Kubernetes workloads using Command Line arguments and flags |
| Printing Workload State | Debugging  | Print information about workloads |
| Interacting with Containers | Debugging  | Exec, attach, cp, logs |
| Cluster Management | Cluster operations | Drain and cordon Nodes |

## Declarative Application Management

The preferred approach for managing resources is through
declarative files called resource configuration used with the kubectl *Apply* command.
This command reads a local (or remote) file structure and modifies cluster state to
reflect the declared intent.

{{< alert color="success" title="Apply" >}}
Apply is the preferred mechanism for managing resources in a Kubernetes cluster.
{{< /alert >}}

## Printing State about Workloads

Users will need to view workload state.

- Printing summarize state and information about resources
- Printing complete state and information about resources
- Printing specific fields from resources
- Query resources matching labels

## Debugging Workloads

kubectl supports debugging by providing commands for:

- Printing Container logs
- Printing cluster events
- Exec or attaching to a Container
- Copying files from Containers in the cluster to a user's filesystem

## Cluster Management

On occasion, users may need to perform operations to the Nodes of cluster. kubectl supports
commands to drain workloads from a Node so that it can be decommissioned or debugged.

## Porcelain

Users may find using resource configuration overly verbose for *development* and prefer to work with
the cluster *imperatively* with a shell-like workflow. kubectl offers porcelain commands for
generating and modifying resources.

- Generating + creating resources such as Deployments, StatefulSets, Services, ConfigMaps, etc.
- Setting fields on resources
- Editing (live) resources in a text editor

{{< alert color="warning" title="Porcelain for Dev Only" >}}
Porcelain commands are time saving for experimenting with workloads in a dev cluster, but shouldn't
be used for production.
{{< /alert >}}

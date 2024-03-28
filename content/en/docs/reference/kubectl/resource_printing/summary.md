---
title: "Summaries"
linkTitle: "Summaries"
weight: 1
type: docs
description: >
    Prints Summary of currently working resources and their states
---


Summarizing Resource State using a columnar format is the most common way to view cluster
state when developing applications or triaging issues.  The **columnar view gives a compact
summary of the most relevant information** for a collection of Resources.

## Get

The `kubectl get` reads Resources from the cluster and formats them as output.  The examples in
this chapter will query for Resources by providing Get the *Resource Type* as an argument.
For more query options see [Queries and Options](queries_and_options.md).

### Default

If no output format is specified, Get will print a default set of columns.

**Note:** Some columns *may* not directly map to fields on the Resource, but instead may
be a summary of fields.

```bash
kubectl get deployments nginx
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx     1         1         1            0           5s
```

---

You can also use a number of options to query out and format the way the resources are displayed.
Some of the commonly used `options` include:
- wide
- custom columns
- labels
- show labels
- show kind

{{% alert color="success" title="Command / Examples" %}}
Check out the [reference](/references/kubectl/get/) for commands and examples for `get` with / without options
{{% /alert %}}

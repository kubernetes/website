---
title: Organizing Cluster Connection Information Using kubeconfig Files
---

{% capture overview %}

Use kubeconfig files to organize information about clusters, users, namespaces, and
authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to
find the information it needs to choose a cluster and communicate with the API server
of a cluster.

**Note:** A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
{: .note}

By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify additional kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the 
[`--kubeconfig`](/docs/user-guide/kubectl/{{page.version}}/#config) flag.

For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters.md).

{% endcapture %}


{% capture body %}

## Supporting multiple clusters, users, and authentication mechanisms

Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example:

- A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users.

With kubeconfig files, you can organize your clusters, users, and namespaces.
And you can define contexts that enable users to quickly and easily switch between
clusters and namespaces.

## The KUBECONFIG environment variable

The `KUBECONGIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `HOME/.kube/config`.

If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` evironment variable.

## Merging kubeconfig files

To see your configuration, enter this command:

```shell
kubectl config view
```

The output you see might be taken from a single kubeconfig file, `$HOME/.kube/config`,
or it might be the result of merging several kubeconfig files that are listed
in the `KUBECONFIG` environment variable.

Here are the rules that Kubernetes uses when it merges kubeconfig files:

1. If the `--kubeconfig` flag is set, use this file only. No merging. Only one instance of this flag is allowed.

   Otherwise, if the `KUBECONFIG` environment variable is set, use it as a
   list of files that should be merged.
   The files listed in the `KUBECONFIG` envrionment variable are merged
   according to these rules:

   * Empty filenames are ignored.
   * Files with non-deserializable content produce errors.
   * The first file to set a particular value or map key wins, and the value or map key is never changed.
     For example, the first file to set `CurrentContext` has its context preserved. 
     If two files specify a `red-user`, only values from the first file's `red-user` are used.
     Even non-conflicting entries from the second file's `red-user` are discarded.

   For an example of setting the `KUBECONFIG` environment variable, see
   [Setting the KUBECONFIG environment variable](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)

   Otherwise, use the default kubeconfig file, `$HOME/.kube/config` with no merging.

1. Determine the context to use based on the first hit in this chain:

    1. The value of the `--context` command-line flag
    1. The `current-context` from the merged kubeconfig files

   An empty context is allowed at this stage.

1. Determine the cluster and user. At this point, there may or may not be a context.
   The cluster and user are determined based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. The `--user` or `--cluster` command-line flag.
   1. If the context is non-empty, take the context's user or cluster.

   The user and cluster can be empty at this point.

1. Determine the actual cluster info to use.  At this point, we may or may not have a cluster info. 
   Build each piece of the cluster info based on the chain (first hit wins):

   1. Command line arguments - `server`, `api-version`, `certificate-authority`, and `insecure-skip-tls-verify`
   1. If cluster info is present and a value for the attribute is present, use it.
   1. If you don't have a server location, error.

1. Determine the actual user info to use. User is built using the same rules as cluster info,
   EXCEPT that you can only have one authentication technique per user.

   1. Load precedence is 1) command line flag, 2) user fields from kubeconfig
   1. The command line flags are: `client-certificate`, `client-key`, `username`, `password`, and `token`.
   1. If there are two conflicting techniques, fail.

1. For any information still missing, use default values and potentially
   prompt for authentication information

1. All file references inside of a kubeconfig file are resolved relative to the location
   of the kubeconfig file itself.  When file references are presented on the command line
   they are resolved relative to the current working directory.  When paths are saved in
   the `$HOME/.kube/config`, relative paths are stored relatively while absolute paths
   are stored absolutely.

Any path in a kubeconfig file is resolved relative to the location of the kubeconfig file itself.

{% endcapture %}


{% capture whatsnext %}

* TODO

{% endcapture %}

{% include templates/concept.md %}


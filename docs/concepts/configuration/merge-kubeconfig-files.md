---
title: Merging kubeconfig files
---

{% capture overview %}

Authentication in Kubernetes can differ for different individuals.

- A running kubelet might have one way of authenticating (i.e. certificates).
- Users might have a different way of authenticating (i.e. tokens).
- Administrators might have a list of certificates which they provide individual users.
- There may be multiple clusters, and we may want to define them all in one place - giving users the ability to use their own certificates and reusing the same global configuration.

So in order to easily switch between multiple clusters, for multiple users, a kubeconfig file was defined.

This file contains a series of authentication mechanisms and cluster connection information associated with nicknames.  It also introduces the concept of a tuple of authentication information (user) and cluster connection information called a context that is also associated with a nickname.

Multiple kubeconfig files are allowed, if specified explicitly.  At runtime they are loaded and merged along with override options specified from the command line (see [rules](#loading-and-merging-rules) below).

{% endcapture %}


{% capture body %}

## Loading and merging rules

The rules for loading and merging the kubeconfig files are straightforward, but there are a lot of them.
The final config is built in this order:

  1.  Get the kubeconfig  from disk.  This is done with the following hierarchy and merge rules:

      If the `CommandLineLocation` (the value of the `kubeconfig` command line option) is set, use this file only.  No merging.  Only one instance of this flag is allowed.

      Else, if `EnvVarLocation` (the value of `$KUBECONFIG`) is available, use it as a list of files that should be merged.
      Merge files together based on the following rules.
      Empty filenames are ignored.  Files with non-deserializable content produced errors.
      The first file to set a particular value or map key wins and the value or map key is never changed.
      This means that the first file to set `CurrentContext` will have its context preserved.  It also means that if two files specify a `red-user`, only values from the first file's `red-user` are used.  Even non-conflicting entries from the second file's `red-user` are discarded.

      Otherwise, use HomeDirectoryLocation (`~/.kube/config`) with no merging.

  1.  Determine the context to use based on the first hit in this chain
      1.  Command line argument - the value of the `context` command line option
      1.  `current-context` from the merged kubeconfig file
      1.  Empty is allowed at this stage

  1.  Determine the cluster info and user to use.  At this point, we may or may not have a context.  They are built based on the first hit in this chain.  (run it twice, once for user, once for cluster)

      1.  Command line argument - `user` for user name and `cluster` for cluster name
      1.  If context is present, then use the context's value
      1.  Empty is allowed

  1.  Determine the actual cluster info to use.  At this point, we may or may not have a cluster info.  Build each piece of the cluster info based on the chain (first hit wins):

      1.  Command line arguments - `server`, `api-version`, `certificate-authority`, and `insecure-skip-tls-verify`
      1.  If cluster info is present and a value for the attribute is present, use it.
      1.  If you don't have a server location, error.

  1.  Determine the actual user info to use. User is built using the same rules as cluster info, EXCEPT that you can only have one authentication technique per user.
      1. Load precedence is 1) command line flag, 2) user fields from kubeconfig
      1. The command line flags are: `client-certificate`, `client-key`, `username`, `password`, and `token`.
      1. If there are two conflicting techniques, fail.

  1.  For any information still missing, use default values and potentially prompt for authentication information

  1.  All file references inside of a kubeconfig file are resolved relative to the location of the kubeconfig file itself.  When file references are presented on the command line
  they are resolved relative to the current working directory.  When paths are saved in the ~/.kube/config, relative paths are stored relatively while absolute paths are stored absolutely.

Any path in a kubeconfig file is resolved relative to the location of the kubeconfig file itself.

{% endcapture %}


{% capture whatsnext %}

* TODO

{% endcapture %}

{% include templates/concept.md %}


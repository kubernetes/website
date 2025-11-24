---
layout: blog
title: "Kubernetes v1.35: Protect your Machine from Untrusted Executables with the Credential Plugin Policy"
date: 2025-11-19:30:00-08:00
slug: kubernetes-v1-35-kuberc-plugin-allowlist
Author: >
  [Peter Engelbert](https://github.com/pmengelbert) (Microsoft)
---

Did you know that `kubectl` can run arbitrary executables -- including shell
scripts -- with the full priveleges of the invoking user, and without your
knowledge? Whenever you download or auto-generate a `kubeconfig`, the
`users[n].exec.command` field can specify an executable to fetch credentials on
your behalf. Don't get me wrong, this is an incredible feature that allows you
to authenticate to the cluster with external identity providers. Nevertheless,
you probably see the problem: do you know what your `kubeconfig` is running on
your machine? Do you trust the pipeline that generated your `kubeconfig`?

To give the user more control over what gets run on their system, kubernetes
1.35 adds the credential plugin policy and allowlist. This is available to all
clients, but the feature has the most impact when used with the `kuberc`
configuration file, allowing you to prevent `kubectl` from executing anything
you don't want it to.

## How it works

A full description of this functionality is available [in our official documentation](/docs/reference/kubectl/kuberc/),
but this blog post will give a brief overview of the new security knobs.

The following example is the simplest one: simply don't specify the new fields.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
```

This will keep `kubectl` acting as it always has, and all plugins will be
allowed.

The next example is functionally identical, but it is more explicit and
therefore preferred if it's actually what you want:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: AllowAll
```

If you *don't know* whether or not you're using exec credential plugins, try
setting your policy to `DenyAll`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: DenyAll
```

### Selectively Allowing Plugins

If you *are* using credential plugins, you'll quickly find out what `kubectl` is
trying to execute. You'll get an error like the following.

> Unable to connect to the server: getting credentials: plugin "cloudco-login" not allowed: policy set to "DenyAll"

What if you need the `cloudco-login` plugin to do your daily work? That is why
there's a third option for your policy, `Allowlist`. To allow a specific plugin,
set the policy and add the `credentialPluginAllowlist`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: /usr/local/bin/cloudco-login
  - name: get-identity
```

You'll notice that there are two entries in the allowlist. One of them is
specified by full path, and the other, `get-identity` is just a basename. When
you specify just the basename, the full path will be looked up using
`exec.LookPath`. Both forms (basename and full path) are acceptable, but the
full path is preferable because it narrows the scope of allowed binaries even
further.

### Future Enhancements

Currently, an allowlist entry has only one field, `name`. In the future, we want
to see other requirements added. One idea that seems useful is checksum
verification whereby, for example, a binary would only be allowed to run if it
has the sha256 sum
`b9a3fad00d848ff31960c44ebb5f8b92032dc085020f857c98e32a5d5900ff9c` **and**
exists at the path `/usr/bin/cloudco-login`.

Another possibility is only allowing binaries that have been signed by one of a
set of a trusted signing keys.

## Get involved

The credential plugin policy and allowlist has reached beta, and we are very interested
in your feedback. We'd love to hear what you like about it and what problems
you'd like to see it solve. Or, if you have the cycles to contribute one of the
above enhancements, they'd be a great way to get started contributing to
Kubernetes. Feel free to join in the discussion on slack:
- [SIG-CLI](https://kubernetes.slack.com/archives/C2GL57FJ4),
- [SIG-Auth](https://kubernetes.slack.com/archives/C0EN96KUY).
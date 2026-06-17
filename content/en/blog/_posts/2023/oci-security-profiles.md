---
layout: blog
title: "Using OCI artifacts to distribute security profiles for seccomp, SELinux and AppArmor"
date: 2023-05-24
slug: oci-security-profiles
author: >
  Sascha Grunert
---

The [Security Profiles Operator (SPO)][spo] makes managing seccomp, SELinux and
AppArmor profiles within Kubernetes easier than ever. It allows cluster
administrators to define the profiles in a predefined custom resource YAML,
which then gets distributed by the SPO into the whole cluster. Modification and
removal of the security profiles are managed by the operator in the same way,
but that’s a small subset of its capabilities.

[spo]: https://github.com/kubernetes-sigs/security-profiles-operator

Another core feature of the SPO is being able to stack seccomp profiles. This
means that users can define a `baseProfileName` in the YAML specification, which
then gets automatically resolved by the operator and combines the syscall rules.
If a base profile has another `baseProfileName`, then the operator will
recursively resolve the profiles up to a certain depth. A common use case is to
define base profiles for low level container runtimes (like [runc][runc] or
[crun][crun]) which then contain syscalls which are required in any case to run
the container. Alternatively, application developers can define seccomp base
profiles for their standard distribution containers and stack dedicated profiles
for the application logic on top. This way developers can focus on maintaining
seccomp profiles which are way simpler and scoped to the application logic,
without having a need to take the whole infrastructure setup into account.

[runc]: https://github.com/opencontainers/runc
[crun]: https://github.com/containers/crun

But how to maintain those base profiles? For example, the amount of required
syscalls for a runtime can change over its release cycle in the same way it can
change for the main application. Base profiles have to be available in the same
cluster, otherwise the main seccomp profile will fail to deploy. This means that
they’re tightly coupled to the main application profiles, which acts against the
main idea of base profiles. Distributing and managing them as plain files feels
like an additional burden to solve.

## OCI artifacts to the rescue

The [v0.8.0][spo-latest] release of the Security Profiles Operator supports
managing base profiles as OCI artifacts! Imagine OCI artifacts as lightweight
container images, storing files in layers in the same way images do, but without
a process to be executed. Those artifacts can be used to store security profiles
like regular container images in compatible registries. This means they can be
versioned, namespaced and annotated similar to regular container images.

[spo-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/v0.8.0

To see how that works in action, specify a `baseProfileName` prefixed with
`oci://` within a seccomp profile CRD, for example:

```yaml
apiVersion: security-profiles-operator.x-k8s.io/v1beta1
kind: SeccompProfile
metadata:
  name: test
spec:
  defaultAction: SCMP_ACT_ERRNO
  baseProfileName: oci://ghcr.io/security-profiles/runc:v1.1.5
  syscalls:
    - action: SCMP_ACT_ALLOW
      names:
        - uname
```

The operator will take care of pulling the content by using [oras][oras], as
well as verifying the [sigstore (cosign)][cosign] signatures of the artifact. If
the artifacts are not signed, then the SPO will reject them. The resulting
profile `test` will then contain all base syscalls from the remote `runc`
profile plus the additional allowed `uname` one. It is also possible to
reference the base profile by its digest (SHA256) making the artifact to be
pulled more specific, for example by referencing
`oci://ghcr.io/security-profiles/runc@sha256:380…`.

[oras]: https://oras.land
[cosign]: https://github.com/sigstore/cosign

The operator internally caches pulled artifacts up to 24 hours for 1000
profiles, meaning that they will be refreshed after that time period, if the
cache is full or the operator daemon gets restarted.

Because the overall resulting syscalls are hidden from the user (I only have the
`baseProfileName` listed in the SeccompProfile, and not the syscalls themselves), I'll additionally
annotate that SeccompProfile with the final `syscalls`.

Here's how the SeccompProfile looks after I annotate it:

```console
> kubectl describe seccompprofile test
Name:         test
Namespace:    security-profiles-operator
Labels:       spo.x-k8s.io/profile-id=SeccompProfile-test
Annotations:  syscalls:
                [{"names":["arch_prctl","brk","capget","capset","chdir","clone","close",...
API Version:  security-profiles-operator.x-k8s.io/v1beta1
```

The SPO maintainers provide all public base profiles as part of the [“Security
Profiles” GitHub organization][org].

[org]: https://github.com/orgs/security-profiles/packages

## Managing OCI security profiles

Alright, now the official SPO provides a bunch of base profiles, but how can I
define my own? Well, first of all we have to choose a working registry. There
are a bunch of registries that already supports OCI artifacts:

- [CNCF Distribution](https://github.com/distribution/distribution)
- [Azure Container Registry](https://aka.ms/acr)
- [Amazon Elastic Container Registry](https://aws.amazon.com/ecr)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry)
- [GitHub Packages container registry](https://docs.github.com/en/packages/guides/about-github-container-registry)
- [Docker Hub](https://hub.docker.com)
- [Zot Registry](https://zotregistry.io)

The Security Profiles Operator ships a new command line interface called `spoc`,
which is a little helper tool for managing OCI profiles among doing various other
things which are out of scope of this blog post. But, the command `spoc push`
can be used to push a security profile to a registry:

```
> export USERNAME=my-user
> export PASSWORD=my-pass
> spoc push -f ./examples/baseprofile-crun.yaml ghcr.io/security-profiles/crun:v1.8.3
16:35:43.899886 Pushing profile ./examples/baseprofile-crun.yaml to: ghcr.io/security-profiles/crun:v1.8.3
16:35:43.899939 Creating file store in: /tmp/push-3618165827
16:35:43.899947 Adding profile to store: ./examples/baseprofile-crun.yaml
16:35:43.900061 Packing files
16:35:43.900282 Verifying reference: ghcr.io/security-profiles/crun:v1.8.3
16:35:43.900310 Using tag: v1.8.3
16:35:43.900313 Creating repository for ghcr.io/security-profiles/crun
16:35:43.900319 Using username and password
16:35:43.900321 Copying profile to repository
16:35:46.976108 Signing container image
Generating ephemeral keys...
Retrieving signed certificate...

        Note that there may be personally identifiable information associated with this signed artifact.
        This may include the email address associated with the account with which you authenticate.
        This information will be used for signing this artifact and will be stored in public transparency logs and cannot be removed later.

By typing 'y', you attest that you grant (or have permission to grant) and agree to have this information stored permanently in transparency logs.
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=…
Successfully verified SCT...
tlog entry created with index: 16520520
Pushing signature to: ghcr.io/security-profiles/crun
```

You can see that the tool automatically signs the artifact and pushes the
`./examples/baseprofile-crun.yaml` to the registry, which is then directly ready
for usage within the SPO. If username and password authentication is required,
either use the `--username`, `-u` flag or export the `USERNAME` environment
variable. To set the password, export the `PASSWORD` environment variable.

It is possible to add custom annotations to the security profile by using the
`--annotations` / `-a` flag multiple times in `KEY:VALUE` format. Those have no
effect for now, but at some later point additional features of the operator may
rely them.

The `spoc` client is also able to pull security profiles from OCI artifact
compatible registries. To do that, just run `spoc pull`:

```console
> spoc pull ghcr.io/security-profiles/runc:v1.1.5
16:32:29.795597 Pulling profile from: ghcr.io/security-profiles/runc:v1.1.5
16:32:29.795610 Verifying signature

Verification for ghcr.io/security-profiles/runc:v1.1.5 --
The following checks were performed on each of these signatures:
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates

[{"critical":{"identity":{"docker-reference":"ghcr.io/security-profiles/runc"},…}}]
16:32:33.208695 Creating file store in: /tmp/pull-3199397214
16:32:33.208713 Verifying reference: ghcr.io/security-profiles/runc:v1.1.5
16:32:33.208718 Creating repository for ghcr.io/security-profiles/runc
16:32:33.208742 Using tag: v1.1.5
16:32:33.208743 Copying profile from repository
16:32:34.119652 Reading profile
16:32:34.119677 Trying to unmarshal seccomp profile
16:32:34.120114 Got SeccompProfile: runc-v1.1.5
16:32:34.120119 Saving profile in: /tmp/profile.yaml
```

The profile can be now found in `/tmp/profile.yaml` or the specified output file
`--output-file` / `-o`. We can specify an username and password in the same way
as for `spoc push`.

`spoc` makes it easy to manage security profiles as OCI artifacts, which can be
then consumed directly by the operator itself.

That was our compact journey through the latest possibilities of the Security
Profiles Operator! If you're interested in more, providing feedback or asking
for help, then feel free to get in touch with us directly via [Slack
(#security-profiles-operator)][slack] or [the mailing list][mail].

[slack]: https://kubernetes.slack.com/messages/security-profiles-operator
[mail]: https://groups.google.com/forum/#!forum/kubernetes-dev

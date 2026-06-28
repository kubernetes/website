---
layout: blog
title: "Publishing a Kubernetes SIG's Images to registry.k8s.io"
draft: true
slug: publishing-images-to-registry-k8s-io
author: >
  [Kahiro Okina](https://github.com/kahirokunn) (Craftsman Software, Inc.)
---

My first instinct was to use a release path I had seen in many GitHub-hosted
open source projects: build the image in GitHub Actions, push it to `ghcr.io`,
and publish from there.

Inside the `kubernetes-sigs` GitHub organization, that path stopped short. I
could build the images, but I could not point users at GHCR as an official
Kubernetes project distribution path. I learned in the `#github-management`
channel on the [Kubernetes Slack](https://slack.k8s.io/) that GHCR is not
supported for that role. Publishing the two images through the official route,
`registry.k8s.io`, ended up involving the image-owning repository
(`kubernetes-sigs/cluster-inventory-api`) and three Kubernetes infrastructure or
configuration repositories:
[`kubernetes/k8s.io`](https://github.com/kubernetes/k8s.io),
[`kubernetes/test-infra`](https://github.com/kubernetes/test-infra), and
[`kubernetes/org`](https://github.com/kubernetes/org).

The two plugin images for the `cluster-inventory-api` project ultimately shipped
under `registry.k8s.io`.

This post has two parts. Part 1 follows the `cluster-inventory-api` case: how the
plan changed and where the release path broke down. Part 2 turns that experience
into the procedure I wish I had at the start. `cluster-inventory-api` is a
[SIG Multicluster](https://github.com/kubernetes/community/tree/master/sig-multicluster)
project, but the procedure is not specific to that SIG.

## Why an image needed to be distributed at all

Cluster Inventory API is a SIG Multicluster project for helping applications and
tools discover, interact with, and make placement decisions across multiple
Kubernetes clusters. Its first major component is the `ClusterProfile` API, which
represents one cluster and the information consumers need to use it.

Some `ClusterProfile` entries point at access-provider plugins, such as
[`secretreader`](https://github.com/kubernetes-sigs/cluster-inventory-api/tree/main/plugins/secretreader/cmd/plugin),
that resolve how to reach a cluster. These plugins support being used as
[image volumes](/docs/tasks/configure-pod-container/image-volumes/).

The work started when Kueue's MultiKueue work asked for the `secretreader` plugin
to be provided as a reusable artifact
([cluster-inventory-api#34](https://github.com/kubernetes-sigs/cluster-inventory-api/issues/34)).

## Part 1: the road to publication

### 1. The original plan was ghcr.io

The first plan was to use a GitHub Actions workflow to build container images for
`plugins/*` on tag pushes and publish to GHCR (`ghcr.io`)
([cluster-inventory-api#40](https://github.com/kubernetes-sigs/cluster-inventory-api/pull/40)).
Along the way I added a `RELEASE.md`, `v0.1.0` was released, and the push to
GHCR succeeded.

But I could not change the published package's visibility from private to public.

### 2. Rebuilding the release workflow

When I asked in the `#github-management` channel on the Kubernetes Slack, the
answer was clear:

> We don't support GHCR, which is why it's locked down. You can find more about
> how to publish official artifact images here:
> https://github.com/kubernetes/k8s.io/tree/main/artifacts#staging-buckets

GHCR was never going to work, so the workflow had to move to `registry.k8s.io`.
On the project side, that meant dropping the GitHub Actions workflow that pushed
to `ghcr.io` and replacing it with a path driven by
[Prow](https://docs.prow.k8s.io/) (the Kubernetes project's CI/CD system) and
Google Cloud Build
([cluster-inventory-api#53](https://github.com/kubernetes-sigs/cluster-inventory-api/pull/53)).
In practice, I added a `cloudbuild.yaml` and a `make release-staging` target so
that a tag push could build and push images to a staging registry on
Kubernetes-owned infrastructure instead of the project's own CI.

{{< figure src="ghcr-vs-official-path.svg" alt="Two flows compared. In the ghcr.io approach, a tag push triggers GitHub Actions and pushes to ghcr.io, where the image stays private and has no release path. In the official path, a tag push triggers a Prow postsubmit job, which runs Cloud Build and pushes to a staging registry. The image promoter then copies the image to registry.k8s.io." >}}

That PR merged, so the image-owning repository could now describe how to build a
staging image. But the infrastructure that receives that image did not exist
yet.

### 3. Untangling the infrastructure dependencies

Publishing to `registry.k8s.io` requires two pieces: a staging registry in
`kubernetes/k8s.io`, and a postsubmit job in `kubernetes/test-infra` that
triggers the build. A postsubmit is a Prow job that runs after a merge or tag,
unlike a presubmit that runs on pull requests.

These two pieces have to be set up in order. The staging registry is managed
with Terraform, and its config names the Google Group that gets push (writer)
access — so the group has to exist before the registry is applied, or the apply
stops at that permission assignment:

1. Create the Google Group
   ([kubernetes/k8s.io#9385](https://github.com/kubernetes/k8s.io/pull/9385)).
2. Create the staging registry
   ([kubernetes/k8s.io#9347](https://github.com/kubernetes/k8s.io/pull/9347)),
   whose Terraform points at that group as the one allowed to push.

I also tripped over a naming rule I did not know about: the staging access group
name has an 18-character limit on its suffix. My first choice,
`k8s-infra-staging-cluster-inventory-api@kubernetes.io`, was too long and had to
be shortened to `k8s-infra-staging-cluster-inv-api@kubernetes.io`
([kubernetes/k8s.io#9402](https://github.com/kubernetes/k8s.io/pull/9402)). If
your project name is long, decide on a short form up front.

Once a maintainer with the right permissions applied these, the staging registry
and group had writer access. The `test-infra` postsubmit job
([kubernetes/test-infra#36821](https://github.com/kubernetes/test-infra/pull/36821))
merged too, and Prow picked up the new job automatically.
Cutting a tag at this point finally produced a staging image.

### 4. Promoting from staging to registry.k8s.io

With a staging image in place, the next step is configuring its promotion to
`registry.k8s.io`
([kubernetes/k8s.io#9499](https://github.com/kubernetes/k8s.io/pull/9499)). That
first promotion used a manually authored `kubernetes/k8s.io` PR because the
project did not have image promoter configuration yet: an entry in `images.yaml`
listing the images to promote, a `promoter-manifest.yaml` file mapping the
staging repository to the production registry path, and an `OWNERS` file naming
who can approve this promotion. For subsequent releases,
[`kpromo`](https://github.com/kubernetes-sigs/promo-tools) can generate the
promotion pull request by updating `images.yaml` for the new tag. If you are
curious how that machinery works, see
[The Invisible Rewrite: Modernizing the Kubernetes Image Promoter](/blog/2026/03/17/image-promoter-rewrite/).

Review then flagged something I had not anticipated: the `OWNERS` file listed a
user who was not a member of the Kubernetes GitHub organization. Image-promotion
`OWNERS` must be organization members, and at the time neither I nor the other
reviewer was. I opened PRs to add the two of us to `kubernetes/org`
([kubernetes/org#6385](https://github.com/kubernetes/org/pull/6385),
[kubernetes/org#6386](https://github.com/kubernetes/org/pull/6386)).

After approval from the SIG Multicluster leads, the promotion PR merged and the
`v0.1.2` images were promoted to `registry.k8s.io/cluster-inventory-api/`. I
confirmed the production images could be pulled, published the GitHub release,
and announced the result in the relevant issues and on Slack.

The two images that finally shipped were:

```none
registry.k8s.io/cluster-inventory-api/secretreader:v0.1.3
registry.k8s.io/cluster-inventory-api/kubeconfig-secretreader:v0.1.3
```

The first successful `registry.k8s.io` release was `v0.1.2`; after I found a
mistake, I re-released the images as `v0.1.3`.

## Part 2: how to publish a new image to registry.k8s.io

This is the procedure for a Kubernetes SIG publishing images under
`registry.k8s.io/<project>/...` for the first time. The repositories involved and
their dependencies look like this:

{{< figure src="dependency-overview.svg" alt="A dependency graph for first-time registry.k8s.io image publishing. The image-owning repository provides cloudbuild.yaml and make release-staging, and a signed release tag triggers the kubernetes/test-infra image-pushing postsubmit job. In kubernetes/k8s.io, a staging Google Group must exist before the staging registry can be created, and that registry is the job's push target. The postsubmit job pushes the staging image. That staging image, together with image promoter config in kubernetes/k8s.io and OWNERS validation through kubernetes/org membership, promotes the image to registry.k8s.io." class="diagram-large" clicktozoom="true" caption="First-time setup dependencies for publishing a Kubernetes SIG's image to registry.k8s.io." >}}

### Before you start: choose registry paths, tag policy, and owners

- The project name and registry path, for example `cluster-inventory-api` maps to
  `registry.k8s.io/cluster-inventory-api/<image>:<tag>`.
- The staging repository name, for example
  `us-central1-docker.pkg.dev/k8s-staging-images/cluster-inventory-api`.
- The image names, for example `secretreader` and `kubeconfig-secretreader`.
- The tag policy. Here the repository's release tag and the image tag are kept in
  lockstep, such as `v0.1.2`.
- Which SIG owns the project, and who reviews and approves.
- Whether the people you want in the promotion `OWNERS` file are Kubernetes
  organization members. If not, request membership in `kubernetes/org` first.
- The staging access group name. Its suffix has an 18-character limit.

Throughout Part 2, `<project>` is the registry path segment (for example
`cluster-inventory-api`), `<image>` is an image name (for example
`secretreader`), `<version>` is the numeric release version (for example
`0.1.2`, so `v<version>` is `v0.1.2`), and `<yourname>` is your GitHub username.

### 1. Make the image-owning repository build images

Set up the repository so that a tag push can build and push a staging image. You
need:

- a `RELEASE.md`,
- a `cloudbuild.yaml` (the `test-infra` job in step 4 invokes this to build and
  push the image),
- a Dockerfile and/or Make target to build the image,
- a release target that pushes to the staging registry (for example
  `make release-staging`),
- release verification steps that confirm the release completed successfully.

References:
[cluster-inventory-api#53](https://github.com/kubernetes-sigs/cluster-inventory-api/pull/53)
(moving to the Prow/Cloud Build approach) and
[cluster-inventory-api#57](https://github.com/kubernetes-sigs/cluster-inventory-api/pull/57)
(passing the staging repository explicitly to `kpromo`).

### 2. Add a Google Group for staging artifacts

Add a Google Group that has push access to the staging registry, in your SIG's
group configuration under `groups/` in `kubernetes/k8s.io`. The two PRs below
show the exact entries to add (including the fix for getting the group to
reconcile): [kubernetes/k8s.io#9385](https://github.com/kubernetes/k8s.io/pull/9385),
[kubernetes/k8s.io#9402](https://github.com/kubernetes/k8s.io/pull/9402).

- Check that the group name fits the 18-character limit.
- Get approval from the SIG leads or chairs.

Do this first: if the group does not exist, the Terraform apply for the staging
registry in the next step stops while assigning writer access.

### 3. Add a staging registry in kubernetes/k8s.io

Add an Artifact Registry staging repository under the `k8s-staging-images`
project. Update the Terraform so that the writer group and reader permissions
are set correctly. Reference:
[kubernetes/k8s.io#9347](https://github.com/kubernetes/k8s.io/pull/9347).

### 4. Add an image-pushing postsubmit job in kubernetes/test-infra

Add a job under `config/jobs/image-pushing/` that runs the image-owning repository's
`cloudbuild.yaml` on a tag push or postsubmit and pushes to the staging
registry. Reference:
[kubernetes/test-infra#36821](https://github.com/kubernetes/test-infra/pull/36821).

Confirm the job name, repository, branch/tag trigger, staging project, and the
reference to the `cloudbuild.yaml`.

If the staging registry and writer group are not in place yet, the job will run
but fail because the permission or repository is missing.

### 5. Push a release tag to build a staging image

With everything above in place, push a
[signed tag](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-tags)
from the image-owning repository:

```bash
git tag -s v<version>
git push origin v<version>
gh release create v<version> --draft --generate-notes --verify-tag
```

Then verify the staging image:

```bash
docker manifest inspect us-central1-docker.pkg.dev/k8s-staging-images/<project>/<image>:v<version>
```

Keep the GitHub release as a draft and publish it only after the promotion to
production is done. Note that tag events are not processed retroactively: tags
created before the release pipeline existed will not produce a staging image.

### 6. Add the image promoter configuration in kubernetes/k8s.io

Open a normal `kubernetes/k8s.io` PR that adds the configuration for this
project:

- `registry.k8s.io/images/k8s-staging-<project>/OWNERS`,
- `registry.k8s.io/images/k8s-staging-<project>/images.yaml` (the promotion
  target),
- `registry.k8s.io/manifests/k8s-staging-<project>/promoter-manifest.yaml`.

For the first promotion, include the digest and tag entries for the staging image
or images in `images.yaml`.

Everyone listed in `OWNERS` must already be a Kubernetes organization member.
For the first promotion PR, get `/lgtm` from a SIG lead. References:
[kubernetes/k8s.io#9499](https://github.com/kubernetes/k8s.io/pull/9499) and the
organization membership PRs
[kubernetes/org#6385](https://github.com/kubernetes/org/pull/6385) and
[kubernetes/org#6386](https://github.com/kubernetes/org/pull/6386).

### 7. Verify the release and publish it

Once the promotion PR merges, run the project's release verification and confirm
the production image is available:

```bash
docker manifest inspect registry.k8s.io/<project>/<image>:v<version>
```

When that works, publish the draft GitHub release and announce it in the related
issues and on Slack.

### A recommended order for the first setup

Because of the dependencies, the first time through goes most smoothly in this
order:

1. `kubernetes/org`: Kubernetes organization membership
2. image-owning repository: image build, `release-staging` target, `cloudbuild.yaml`
3. `kubernetes/k8s.io`: staging Google Group
4. `kubernetes/k8s.io`: staging registry
5. `kubernetes/test-infra`: image-pushing postsubmit job
6. image-owning repository: push the release tag, verify the staging image
7. `kubernetes/k8s.io`: image promoter configuration and promotion entry
8. verify the release, publish the GitHub release

Starting with membership makes PR validation easier because CI can run without
waiting for `/ok-to-test`.

### Where to ask for help

Several of these steps depend on other people: reviewers, approvers, and SIG
leads. Expect to wait on reviews between steps rather than finishing in one
sitting. On the [Kubernetes Slack](https://slack.k8s.io/), these channels line
up with the work:

| Channel | Use it for |
| --- | --- |
| `#github-management` | Repository access, GHCR questions, and Kubernetes organization membership |
| `#sig-k8s-infra` | The staging Google Group and staging registry |

## After the first time, it is much lighter

Once the initial setup is done, routine releases are far simpler:

1. For this project, open a release proposal issue (lazy consensus: no
   objections within two weeks counts as approval).
2. Push a signed tag:

   ```bash
   git tag -s v<version>
   git push origin v<version>
   ```

3. Create a draft GitHub release:

   ```bash
   gh release create v<version> --draft --generate-notes --verify-tag
   ```

4. Confirm the `test-infra` postsubmit pushed the staging image:

   ```bash
   docker manifest inspect us-central1-docker.pkg.dev/k8s-staging-images/<project>/<image>:v<version>
   ```

5. Create the promotion PR with `kpromo pr` (install it from
   [promo-tools](https://github.com/kubernetes-sigs/promo-tools)). Pass
   `--staging-repo` to name the Artifact Registry staging repository explicitly:

   ```bash
   kpromo pr \
     --fork <yourname> \
     --project <project> \
     --tag v<version> \
     --staging-repo us-central1-docker.pkg.dev/k8s-staging-images/<project>
   ```

6. Have the promotion PR in `kubernetes/k8s.io` reviewed, approved, and merged.
7. Run the project's release verification and confirm the production image is
   available:

   ```bash
   docker manifest inspect registry.k8s.io/<project>/<image>:v<version>
   ```

8. Publish the draft GitHub release.
9. Announce in the release proposal issue, related issues, and on Slack.

## Wrapping up

What started as "push to `ghcr.io` from GitHub Actions" turned into work across
four repositories. If you are publishing images under `registry.k8s.io`, the
order above should give you a clearer path.

## Acknowledgments

This publication only happened because many people made time for review,
coordination, release guidance, and behind-the-scenes support.

Special thanks to [Mike Ng](https://github.com/mikeshng) and
[Laura Lorenz](https://github.com/lauralorenz) for keeping the release moving across
time zones: when I could not attend meetings, they joined on my behalf,
connected me with the right people, and helped coordinate the work across SIG
Multicluster. Thanks to [Jian Qiu](https://github.com/qiujian16) for
careful implementation reviews, and to SIG Multicluster lead
[Stephen Kitt](https://github.com/skitt) for reviewing the release process and
helping clarify the rules for publishing. I am also grateful to
[Arnaud M.](https://github.com/ameukam), who quickly reviewed the
`kubernetes/k8s.io` pull requests and guided the infrastructure and promotion
changes through to completion. I am thankful to everyone else who supported
this effort in many different ways.

## References

- [v0.1.2 release](https://github.com/kubernetes-sigs/cluster-inventory-api/releases/tag/v0.1.2)
- [Using Plugin OCI Images](https://github.com/kubernetes-sigs/cluster-inventory-api/blob/main/docs/plugin-images.md)
- [Image volumes](/docs/tasks/configure-pod-container/image-volumes/)
- [registry.k8s.io: faster, cheaper and Generally Available (GA)](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)
- [Publishing official artifact images (`kubernetes/k8s.io/artifacts`)](https://github.com/kubernetes/k8s.io/tree/main/artifacts#staging-buckets)
- [`kpromo` (promo-tools)](https://github.com/kubernetes-sigs/promo-tools)
- [Kubernetes Slack](https://slack.k8s.io/)

---
layout: blog
title: "Verifying Container Image Signatures Within CRI Runtimes"
date: 2023-06-29
slug: container-image-signature-verification
author: >
  Sascha Grunert
---

The Kubernetes community has been signing their container image-based artifacts
since release v1.24. While the graduation of the [corresponding enhancement][kep]
from `alpha` to `beta` in v1.26 introduced signatures for the binary artifacts,
other projects followed the approach by providing image signatures for their
releases, too. This means that they either create the signatures within their
own CI/CD pipelines, for example by using GitHub actions, or rely on the
Kubernetes [image promotion][promo] process to automatically sign the images by
proposing pull requests to the [k/k8s.io][k8s.io] repository. A requirement for
using this process is that the project is part of the `kubernetes` or
`kubernetes-sigs` GitHub organization, so that they can utilize the community
infrastructure for pushing images into staging buckets.

[kep]: https://github.com/kubernetes/enhancements/issues/3031
[promo]: https://github.com/kubernetes-sigs/promo-tools/blob/e2b96dd/docs/image-promotion.md
[k8s.io]: https://github.com/kubernetes/k8s.io/tree/4b95cc2/k8s.gcr.io

Assuming that a project now produces signed container image artifacts, how can
one actually verify the signatures? It is possible to do it manually like
outlined in the [official Kubernetes documentation][docs]. The problem with this
approach is that it involves no automation at all and should be only done for
testing purposes. In production environments, tools like the [sigstore
policy-controller][policy-controller] can help with the automation. These tools
provide a higher level API by using [Custom Resource Definitions (CRD)][crd] as
well as an integrated [admission controller and webhook][admission] to verify
the signatures.

[docs]: /docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures
[policy-controller]: https://docs.sigstore.dev/policy-controller/overview
[crd]: /docs/concepts/extend-kubernetes/api-extension/custom-resources
[admission]: /docs/reference/access-authn-authz/admission-controllers

The general usage flow for an admission controller based verification is:

{{< figure src="/blog/2023/06/29/container-image-signature-verification/flow.svg" alt="Create an instance of the policy and annotate the namespace to validate the signatures. Then create the pod. The controller evaluates the policy and if it passes, then it does the image pull if necessary. If the policy evaluation fails, then it will not admit the pod." >}}

A key benefit of this architecture is simplicity: A single instance within the
cluster validates the signatures before any image pull can happen in the
container runtime on the nodes, which gets initiated by the kubelet. This
benefit also brings along the issue of separation: The node which should pull
the container image is not necessarily the same node that performs the admission. This
means that if the controller is compromised, then a cluster-wide policy
enforcement can no longer be possible.

One way to solve this issue is doing the policy evaluation directly within the
[Container Runtime Interface (CRI)][cri] compatible container runtime. The
runtime is directly connected to the [kubelet][kubelet] on a node and does all
the tasks like pulling images. [CRI-O][cri-o] is one of those available runtimes
and will feature full support for container image signature verification in v1.28.

[cri]: /docs/concepts/architecture/cri
[kubelet]: /docs/reference/command-line-tools-reference/kubelet
[cri-o]: https://github.com/cri-o/cri-o

How does it work? CRI-O reads a file called [`policy.json`][policy.json], which
contains all the rules defined for container images. For example, you can define a
policy which only allows signed images `quay.io/crio/signed` for any tag or
digest like this:

[policy.json]: https://github.com/containers/image/blob/b3e0ba2/docs/containers-policy.json.5.md#sigstoresigned

```json
{
  "default": [{ "type": "reject" }],
  "transports": {
    "docker": {
      "quay.io/crio/signed": [
        {
          "type": "sigstoreSigned",
          "signedIdentity": { "type": "matchRepository" },
          "fulcio": {
            "oidcIssuer": "https://github.com/login/oauth",
            "subjectEmail": "sgrunert@redhat.com",
            "caData": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI5ekNDQVh5Z0F3SUJBZ0lVQUxaTkFQRmR4SFB3amVEbG9Ed3lZQ2hBTy80d0NnWUlLb1pJemowRUF3TXcKS2pFVk1CTUdBMVVFQ2hNTWMybG5jM1J2Y21VdVpHVjJNUkV3RHdZRFZRUURFd2h6YVdkemRHOXlaVEFlRncweQpNVEV3TURjeE16VTJOVGxhRncwek1URXdNRFV4TXpVMk5UaGFNQ294RlRBVEJnTlZCQW9UREhOcFozTjBiM0psCkxtUmxkakVSTUE4R0ExVUVBeE1JYzJsbmMzUnZjbVV3ZGpBUUJnY3Foa2pPUFFJQkJnVXJnUVFBSWdOaUFBVDcKWGVGVDRyYjNQUUd3UzRJYWp0TGszL09sbnBnYW5nYUJjbFlwc1lCcjVpKzR5bkIwN2NlYjNMUDBPSU9aZHhleApYNjljNWlWdXlKUlErSHowNXlpK1VGM3VCV0FsSHBpUzVzaDArSDJHSEU3U1hyazFFQzVtMVRyMTlMOWdnOTJqCll6QmhNQTRHQTFVZER3RUIvd1FFQXdJQkJqQVBCZ05WSFJNQkFmOEVCVEFEQVFIL01CMEdBMVVkRGdRV0JCUlkKd0I1ZmtVV2xacWw2ekpDaGt5TFFLc1hGK2pBZkJnTlZIU01FR0RBV2dCUll3QjVma1VXbFpxbDZ6SkNoa3lMUQpLc1hGK2pBS0JnZ3Foa2pPUFFRREF3TnBBREJtQWpFQWoxbkhlWFpwKzEzTldCTmErRURzRFA4RzFXV2cxdENNCldQL1dIUHFwYVZvMGpoc3dlTkZaZ1NzMGVFN3dZSTRxQWpFQTJXQjlvdDk4c0lrb0YzdlpZZGQzL1Z0V0I1YjkKVE5NZWE3SXgvc3RKNVRmY0xMZUFCTEU0Qk5KT3NRNHZuQkhKCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0="
          },
          "rekorPublicKeyData": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFMkcyWSsydGFiZFRWNUJjR2lCSXgwYTlmQUZ3cgprQmJtTFNHdGtzNEwzcVg2eVlZMHp1ZkJuaEM4VXIvaXk1NUdoV1AvOUEvYlkyTGhDMzBNOStSWXR3PT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
        }
      ]
    }
  }
}
```

CRI-O has to be started to use that policy as the global source of truth:

```console
> sudo crio --log-level debug --signature-policy ./policy.json
```

CRI-O is now able to pull the image while verifying its signatures. This can be
done by using [`crictl` (cri-tools)][cri-tools], for example:

[cri-tools]: https://github.com/kubernetes-sigs/cri-tools

```console
> sudo crictl -D pull quay.io/crio/signed
DEBU[…] get image connection
DEBU[…] PullImageRequest: &PullImageRequest{Image:&ImageSpec{Image:quay.io/crio/signed,Annotations:map[string]string{},},Auth:nil,SandboxConfig:nil,}
DEBU[…] PullImageResponse: &PullImageResponse{ImageRef:quay.io/crio/signed@sha256:18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a,}
Image is up to date for quay.io/crio/signed@sha256:18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a
```

The CRI-O debug logs will also indicate that the signature got successfully
validated:

```console
DEBU[…] IsRunningImageAllowed for image docker:quay.io/crio/signed:latest
DEBU[…]  Using transport "docker" specific policy section quay.io/crio/signed
DEBU[…] Reading /var/lib/containers/sigstore/crio/signed@sha256=18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a/signature-1
DEBU[…] Looking for sigstore attachments in quay.io/crio/signed:sha256-18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a.sig
DEBU[…] GET https://quay.io/v2/crio/signed/manifests/sha256-18b42e8ea347780f35d979a829affa178593a8e31d90644466396e1187a07f3a.sig
DEBU[…] Content-Type from manifest GET is "application/vnd.oci.image.manifest.v1+json"
DEBU[…] Found a sigstore attachment manifest with 1 layers
DEBU[…] Fetching sigstore attachment 1/1: sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…] Downloading /v2/crio/signed/blobs/sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…] GET https://quay.io/v2/crio/signed/blobs/sha256:8276724a208087e73ae5d9d6e8f872f67808c08b0acdfdc73019278807197c45
DEBU[…]  Requirement 0: allowed
DEBU[…] Overall: allowed
```

All of the defined fields like `oidcIssuer` and `subjectEmail` in the policy
have to match, while `fulcio.caData` and `rekorPublicKeyData` are the public
keys from the upstream [fulcio (OIDC PKI)][fulcio] and [rekor
(transparency log)][rekor] instances.

[fulcio]: https://github.com/sigstore/fulcio
[rekor]: https://github.com/sigstore/rekor

This means that if you now invalidate the `subjectEmail` of the policy, for example to
`wrong@mail.com`:

```console
> jq '.transports.docker."quay.io/crio/signed"[0].fulcio.subjectEmail = "wrong@mail.com"' policy.json > new-policy.json
> mv new-policy.json policy.json
```

Then remove the image, since it already exists locally:

```console
> sudo crictl rmi quay.io/crio/signed
```

Now when you pull the image, CRI-O complains that the required email is wrong:

```console
> sudo crictl pull quay.io/crio/signed
FATA[…] pulling image: rpc error: code = Unknown desc = Source image rejected: Required email wrong@mail.com not found (got []string{"sgrunert@redhat.com"})
```

It is also possible to test an unsigned image against the policy. For that you
have to modify the key `quay.io/crio/signed` to something like
`quay.io/crio/unsigned`:

```console
> sed -i 's;quay.io/crio/signed;quay.io/crio/unsigned;' policy.json
```

If you now pull the container image, CRI-O will complain that no signature exists
for it:

```console
> sudo crictl pull quay.io/crio/unsigned
FATA[…] pulling image: rpc error: code = Unknown desc = SignatureValidationFailed: Source image rejected: A signature was required, but no signature exists
```

It is important to mention that CRI-O will match the
`.critical.identity.docker-reference` field within the signature to match with
the image repository. For example, if you verify the image
`registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.3`, then the corresponding
`docker-reference` should be `registry.k8s.io/kube-apiserver-amd64`:

```console
> cosign verify registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.3 \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq -r '.[0].critical.identity."docker-reference"'
…

registry.k8s.io/kubernetes/kube-apiserver-amd64
```

The Kubernetes community introduced `registry.k8s.io` as proxy mirror for
various registries. Before the release of [kpromo v4.0.2][kpromo], images
had been signed with the actual mirror rather than `registry.k8s.io`:

[kpromo]: https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.0.2

```console
> cosign verify registry.k8s.io/kube-apiserver-amd64:v1.28.0-alpha.2 \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq -r '.[0].critical.identity."docker-reference"'
…

asia-northeast2-docker.pkg.dev/k8s-artifacts-prod/images/kubernetes/kube-apiserver-amd64
```

The change of the `docker-reference` to `registry.k8s.io` makes it easier for
end users to validate the signatures, because they cannot know anything about the
underlying infrastructure being used. The feature to set the identity on image
signing has been added to [cosign][cosign-pr] via the flag `sign
--sign-container-identity` as well and will be part of its upcoming release.

[cosign-pr]: https://github.com/sigstore/cosign/pull/2984

The Kubernetes image pull error code `SignatureValidationFailed` got [recently added to
Kubernetes][pr-117717] and will be available from v1.28. This error code allows
end-users to understand image pull failures directly from the kubectl CLI. For
example, if you run CRI-O together with Kubernetes using the policy which requires
`quay.io/crio/unsigned` to be signed, then a pod definition like this:

[pr-117717]: https://github.com/kubernetes/kubernetes/pull/117717

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: quay.io/crio/unsigned
```

Will cause the `SignatureValidationFailed` error when applying the pod manifest:

```console
> kubectl apply -f pod.yaml
pod/pod created
```

```console
> kubectl get pods
NAME   READY   STATUS                      RESTARTS   AGE
pod    0/1     SignatureValidationFailed   0          4s
```

```console
> kubectl describe pod pod | tail -n8
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  58s                default-scheduler  Successfully assigned default/pod to 127.0.0.1
  Normal   BackOff    22s (x2 over 55s)  kubelet            Back-off pulling image "quay.io/crio/unsigned"
  Warning  Failed     22s (x2 over 55s)  kubelet            Error: ImagePullBackOff
  Normal   Pulling    9s (x3 over 58s)   kubelet            Pulling image "quay.io/crio/unsigned"
  Warning  Failed     6s (x3 over 55s)   kubelet            Failed to pull image "quay.io/crio/unsigned": SignatureValidationFailed: Source image rejected: A signature was required, but no signature exists
  Warning  Failed     6s (x3 over 55s)   kubelet            Error: SignatureValidationFailed
```

This overall behavior provides a more Kubernetes native experience and does not
rely on third party software to be installed in the cluster.

There are still a few corner cases to consider: For example, what if you want to
allow policies per namespace in the same way the policy-controller supports it?
Well, there is an upcoming CRI-O feature in v1.28 for that! CRI-O will support
the `--signature-policy-dir` / `signature_policy_dir` option, which defines the
root path for pod namespace-separated signature policies. This means that CRI-O
will lookup that path and assemble a policy like `<SIGNATURE_POLICY_DIR>/<NAMESPACE>.json`,
which will be used on image pull if existing. If no pod namespace is
provided on image pull ([via the sandbox config][sandbox-config]), or the
concatenated path is non-existent, then CRI-O's global policy will be used as
fallback.

[sandbox-config]: https://github.com/kubernetes/cri-api/blob/e5515a5/pkg/apis/runtime/v1/api.proto#L1448

Another corner case to consider is critical for the correct signature
verification within container runtimes: The kubelet only invokes container image
pulls if the image does not already exist on disk. This means that an
unrestricted policy from Kubernetes namespace A can allow pulling an image,
while namespace B is not able to enforce the policy because it already exits on
the node. Finally, CRI-O has to verify the policy not only on image pull, but
also on container creation. This fact makes things even a bit more complicated,
because the CRI does not really pass down the user specified image reference on
container creation, but an already resolved image ID, or digest. A [small
change to the CRI][pr-118652] can help with that.

[pr-118652]: https://github.com/kubernetes/kubernetes/pull/118652

Now that everything happens within the container runtime, someone has to
maintain and define the policies to provide a good user experience around that
feature. The CRDs of the policy-controller are great, while we could imagine that
a daemon within the cluster can write the policies for CRI-O per namespace. This
would make any additional hook obsolete and moves the responsibility of
verifying the image signature to the actual instance which pulls the image. [I
evaluated][thread] other possible paths toward a better container image
signature verification within plain Kubernetes, but I could not find a great fit
for a native API. This means that I believe that a CRD is the way to go, but
users still need an instance which actually serves it.

[thread]: https://groups.google.com/g/kubernetes-sig-node/c/kgpxqcsJ7Vc/m/7X7t_ElsAgAJ

Thank you for reading this blog post! If you're interested in more, providing
feedback or asking for help, then feel free to get in touch with me directly via
[Slack (#crio)][slack] or the [SIG Node mailing list][mail].

[slack]: https://kubernetes.slack.com/messages/crio
[mail]: https://groups.google.com/forum/#!forum/kubernetes-sig-node

---
layout: blog
title: 'Moving Changed Block Tracking API support to Beta'
draft: true
slug: csi-changed-block-tracking-beta
author: >
   [Prasad Ghangal](https://github.com/PrasadG193) (Veeam Kasten)
---

Changed Block Tracking (CBT) support for CSI drivers
[shipped as Alpha](/blog/2025/09/25/csi-changed-block-tracking/) in
September 2025. With the `v1.0.0` release of the
[external-snapshot-metadata](https://github.com/kubernetes-csi/external-snapshot-metadata)
project, the feature now moves to **Beta**.

If you are new to changed block tracking, the
[Alpha announcement](/blog/2025/09/25/csi-changed-block-tracking/) covers
the motivation, the three primary components (the CSI `SnapshotMetadata`
gRPC service, the SnapshotMetadataService CRD, and the
`external-snapshot-metadata` sidecar), and a walkthrough of how to use the
API. This post focuses on what is different in Beta.

## What's new in Beta

The main change in this release is the promotion of the
SnapshotMetadataService CRD from `v1alpha1` to `v1beta1`. The CRD used to
advertise a driver's metadata service now serves
`cbt.storage.k8s.io/v1beta1`. The schema itself is unchanged, but this
release removes `v1alpha1` rather than serving it alongside the new version.
If you are upgrading from Alpha, you need to:

- Re-apply the CRD definition shipped with `v1.0.0`.
- Update SnapshotMetadataService manifests to use
  `apiVersion: cbt.storage.k8s.io/v1beta1`.
- Update any client or controller code that talks to the CRD.

This is a one-time change. There is no automatic conversion between the two
versions.

## Compatibility

- Minimum Kubernetes version: **1.33**
- CSI spec: **1.10 or newer**
- Container image: `registry.k8s.io/sig-storage/csi-snapshot-metadata:v1.0.0`

## Trying it out

The [Getting Started section in the Alpha
blog](/blog/2025/09/25/csi-changed-block-tracking/#getting-started) still
applies. In short:

1. Make sure your CSI driver supports volume snapshots and ships the
   `external-snapshot-metadata` sidecar.
2. Install the SnapshotMetadataService CRD (the `v1beta1` definition from
   the `v1.0.0` release).
3. Create a SnapshotMetadataService resource for your driver.
4. Use a client — `snapshot-metadata-lister`, or your own implementation —
   to call `GetMetadataAllocated` and `GetMetadataDelta`.

If you want to see the full flow end-to-end, the
[hostpath driver example](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/example-ephemeral.md)
is a good starting point.

## What's next?

The focus for the rest of the Beta cycle is wider CSI driver adoption and
operational feedback before the feature moves towards GA. If you maintain a
CSI driver, this is a good time to evaluate adding support. If you are
building a backup application on top of the API, feedback on the streaming
clients and the iterator package is very welcome.

## Where can I learn more?

- The [CSI developer
  documentation](https://kubernetes-csi.github.io/docs/external-snapshot-metadata.html)
  for snapshot metadata.
- [KEP-3314](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3314-csi-changed-block-tracking).
- The
  [external-snapshot-metadata](https://github.com/kubernetes-csi/external-snapshot-metadata)
  repository.
- The gRPC
  [schema](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto).
- The
  [snapshot-metadata-lister](https://github.com/kubernetes-csi/external-snapshot-metadata/tree/main/examples/snapshot-metadata-lister)
  example client.

## How do I get involved?

This work is the result of contributions from many people across SIG Storage.
A big thank you to everyone who helped review, code, and test the feature
through Alpha and into Beta:

- Ben Swartzlander ([bswartz](https://github.com/bswartz))
- Carl Braganza ([carlbraganza](https://github.com/carlbraganza))
- Daniil Fedotov ([hairyhum](https://github.com/hairyhum))
- Ivan Sim ([ihcsim](https://github.com/ihcsim))
- Nikhil Ladha ([Nikhil-Ladha](https://github.com/Nikhil-Ladha))
- Praveen M ([iPraveenParihar](https://github.com/iPraveenParihar))
- Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
- Xing Yang ([xing-yang](https://github.com/xing-yang))

If you would like to get involved with CSI or storage in Kubernetes,
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
is the place to start. The [Data Protection Working
Group](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit)
also holds regular meetings, and new attendees are always welcome.

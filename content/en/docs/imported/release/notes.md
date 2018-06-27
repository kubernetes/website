---
title: v1.11 Release Notes
---
<!-- BEGIN MUNGE: GENERATED_TOC -->
- [v1.11.0](#v1110)
  - [Downloads for v1.11.0](#downloads-for-v1110)
    - [Client Binaries](#client-binaries)
    - [Server Binaries](#server-binaries)
    - [Node Binaries](#node-binaries)
  - [Major Themes](#major-themes)
  - [Other notable improvements](#other-notable-improvements)
  - [Known Issues](#known-issues)
  - [Provider-specific Notes](#provider-specific-notes)
- [v1.11.0-rc.3](#v1110-rc3)
  - [Downloads for v1.11.0-rc.3](#downloads-for-v1110-rc3)
    - [Client Binaries](#client-binaries-1)
    - [Server Binaries](#server-binaries-1)
    - [Node Binaries](#node-binaries-1)
  - [Changelog since v1.11.0-rc.2](#changelog-since-v1110-rc2)
    - [Other notable changes](#other-notable-changes)
- [v1.11.0-rc.2](#v1110-rc2)
  - [Downloads for v1.11.0-rc.2](#downloads-for-v1110-rc2)
    - [Client Binaries](#client-binaries-2)
    - [Server Binaries](#server-binaries-2)
    - [Node Binaries](#node-binaries-2)
  - [Changelog since v1.11.0-rc.1](#changelog-since-v1110-rc1)
    - [Other notable changes](#other-notable-changes-1)
- [v1.11.0-rc.1](#v1110-rc1)
  - [Downloads for v1.11.0-rc.1](#downloads-for-v1110-rc1)
    - [Client Binaries](#client-binaries-3)
    - [Server Binaries](#server-binaries-3)
    - [Node Binaries](#node-binaries-3)
  - [Changelog since v1.11.0-beta.2](#changelog-since-v1110-beta2)
    - [Action Required](#action-required)
    - [Other notable changes](#other-notable-changes-2)
- [v1.11.0-beta.2](#v1110-beta2)
  - [Downloads for v1.11.0-beta.2](#downloads-for-v1110-beta2)
    - [Client Binaries](#client-binaries-4)
    - [Server Binaries](#server-binaries-4)
    - [Node Binaries](#node-binaries-4)
  - [Changelog since v1.11.0-beta.1](#changelog-since-v1110-beta1)
    - [Action Required](#action-required-1)
    - [Other notable changes](#other-notable-changes-3)
- [v1.11.0-beta.1](#v1110-beta1)
  - [Downloads for v1.11.0-beta.1](#downloads-for-v1110-beta1)
    - [Client Binaries](#client-binaries-5)
    - [Server Binaries](#server-binaries-5)
    - [Node Binaries](#node-binaries-5)
  - [Changelog since v1.11.0-alpha.2](#changelog-since-v1110-alpha2)
    - [Action Required](#action-required-2)
    - [Other notable changes](#other-notable-changes-4)
- [v1.11.0-alpha.2](#v1110-alpha2)
  - [Downloads for v1.11.0-alpha.2](#downloads-for-v1110-alpha2)
    - [Client Binaries](#client-binaries-6)
    - [Server Binaries](#server-binaries-6)
    - [Node Binaries](#node-binaries-6)
  - [Changelog since v1.11.0-alpha.1](#changelog-since-v1110-alpha1)
    - [Other notable changes](#other-notable-changes-5)
- [v1.11.0-alpha.1](#v1110-alpha1)
  - [Downloads for v1.11.0-alpha.1](#downloads-for-v1110-alpha1)
    - [Client Binaries](#client-binaries-7)
    - [Server Binaries](#server-binaries-7)
    - [Node Binaries](#node-binaries-7)
  - [Changelog since v1.10.0](#changelog-since-v1100)
    - [Action Required](#action-required-3)
    - [Other notable changes](#other-notable-changes-6)
<!-- END MUNGE: GENERATED_TOC -->

<!-- NEW RELEASE NOTES ENTRY -->


# v1.11.0

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes.tar.gz) | `3c779492574a5d8ce702d89915184f5dd52280da909abf134232e5ab00b4a885`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-src.tar.gz) | `f0b2d8e61860acaf50a9bae0dc36b8bfdb4bb41b8d0a1bb5a9bc3d87aad3b794`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-darwin-386.tar.gz) | `196738ef058510438b3129f0a72544544b7d52a8732948b4f9358781f87dab59`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-darwin-amd64.tar.gz) | `9ec8357b10b79f8fd87f3a836879d0a4bb46fb70adbb82f1e34dc7e91d74999f`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-386.tar.gz) | `e8ee8a965d3ea241d9768b9ac868ecbbee112ef45038ff219e4006fa7f4ab4e2`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-amd64.tar.gz) | `d31377c92b4cc9b3da086bc1974cbf57b0d2c2b22ae789ba84cf1b7554ea7067`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-arm.tar.gz) | `9e9da909293a4682a5d6270a39894b056b3e901532b15eb8fdc0814a8d628d65`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-arm64.tar.gz) | `149df9daac3e596042f5759977f9f9299a397130d9dddc2d4a2b513dd64f1092`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-ppc64le.tar.gz) | `ff3d3e4714406d92e9a2b7ef2887519800b89f6592a756524f7a37dc48057f44`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-s390x.tar.gz) | `e5a39bdc1e474d9d00974a81101e043aaff37c30c1418fb85a0c2561465e14c7`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-windows-386.tar.gz) | `4ba1102a33c6d4df650c4864a118f99a9882021fea6f250a35f4b4f4a2d68eaa`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-windows-amd64.tar.gz) | `0bb74af7358f9a2f4139ed1c10716a2f5f0c1c13ab3af71a0621a1983233c8d7`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-amd64.tar.gz) | `b8a8a88afd8a40871749b2362dbb21295c6a9c0a85b6fc87e7febea1688eb99e`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-arm.tar.gz) | `88b9168013bb07a7e17ddc0638e7d36bcd2984d049a50a96f54cb4218647d8da`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-arm64.tar.gz) | `12fab9e9f0e032f278c0e114c72ea01899a0430fc772401f23e26de306e0f59f`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-ppc64le.tar.gz) | `6616d726a651e733cfd4cccd78bfdc1d421c4a446edf4b617b8fd8f5e21f073e`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-s390x.tar.gz) | `291838980929c8073ac592219d9576c84a9bdf233585966c81a380c3d753316e`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-amd64.tar.gz) | `b23e905efb828fdffc4efc208f7343236b22c964e408fe889f529502aed4a335`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-arm.tar.gz) | `44bf8973581887a2edd33eb637407e76dc0dc3a5abcc2ff04aec8338b533156d`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-arm64.tar.gz) | `51e481c782233b46ee21e9635c7d8c2a84450cbe30d7b1cbe5c5982b33f40b13`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-ppc64le.tar.gz) | `d1a3feda31a954d3a83193a51a117873b6ef9f8acc3e10b3f1504fece91f2eb8`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-s390x.tar.gz) | `0ad76c6e6aef670c215256803b3b0d19f4730a0843429951c6421564c73d4932`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-windows-amd64.tar.gz) | `8ad26200ed40d40a1b78d7a5dbe56220f0813d31194f40f267b476499fe2c5c3`

## Major Themes

* TBD

## Other notable improvements

* TBD

## Known Issues

* TBD

## Provider-specific Notes

* TBD

- [v1.11.0-rc.3](#v1110-rc3)
- [v1.11.0-rc.2](#v1110-rc2)
- [v1.11.0-rc.1](#v1110-rc1)
- [v1.11.0-beta.2](#v1110-beta2)
- [v1.11.0-beta.1](#v1110-beta1)
- [v1.11.0-alpha.2](#v1110-alpha2)
- [v1.11.0-alpha.1](#v1110-alpha1)



# v1.11.0-rc.3

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0-rc.3


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes.tar.gz) | `25879ba96d7baf1eb9002956cef3ee40597ed7507784262881a09c00d35ab4c6`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-src.tar.gz) | `748786c0847e278530c790f82af52797de8b5a9e494e727d0049d4b35e370327`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-darwin-386.tar.gz) | `7a3c1b89d6787e275b4b6b855237da6964145e0234b82243c7c6803f1cbd3b46`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-darwin-amd64.tar.gz) | `0265652c3d7f98e36d1d591e3e6ec5018825b6c0cd37bf65c4d043dc313279e3`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-386.tar.gz) | `600d9c83ba4d2126da1cfcd0c079d97c8ede75fad61bead1135dc9e4f7e325ce`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-amd64.tar.gz) | `143fdaf82480dab68b1c783ae9f21916783335f3e4eaa132d72a2c1f7b4b393f`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-arm.tar.gz) | `1bf4a0823c9c8128b19a2f0a8fbaf81226a313bc35132412a9fa1d251c2af07c`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-arm64.tar.gz) | `643b84a227838dd6f1dc6c874f6966e9f098b64fd7947ff940776613fa2addf0`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-ppc64le.tar.gz) | `f46e1952046e977defd1a308ebe6de3ba6a710d562d17de987966a630ea2f7a3`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-linux-s390x.tar.gz) | `7ba61a3d8e6b50b238814eb086c6f9a9354342be9ac1882d0751d6cd2ce9f295`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-windows-386.tar.gz) | `587ca7b09cd45864b8093a8aa10284d473db1f528a6173cd2e58f336673aade0`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-client-windows-amd64.tar.gz) | `a8b1aac95def9f2bf54a5bbd2d83a1dd7778d0a08f1986187063a9a288a9079b`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-server-linux-amd64.tar.gz) | `d19cc5604370eb2fa826420c99dcbdbbb9bf096ea2916549a46ace990c09e20e`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-server-linux-arm.tar.gz) | `47b4ac984a855df2c78443a527705e45909da27405bb7cd8f257a5cde0314518`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-server-linux-arm64.tar.gz) | `09f8c2692f8de291c522fc96a5cbefcd60fe7a1ba9235251be11e6dda8663360`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-server-linux-ppc64le.tar.gz) | `594ff5991206887a70ec0c13624fa940f7ef4ce9cb17f9d8906f7a124a7ae4d1`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-server-linux-s390x.tar.gz) | `43a635f34ce473dcf52870e1d8fad324776d4d958b9829a3dce49eb07f8c4412`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-linux-amd64.tar.gz) | `b3259ed3bf2063aca9e6061cc27752adc4d787dfada4498bc4495cbc962826a2`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-linux-arm.tar.gz) | `9c71370709c345e4495708d8a2c03c1698f59cc9ca60678f498e895170530f9f`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-linux-arm64.tar.gz) | `d3d1cb767da267ebe8c03c7c6176490d5d047e33596704d099597ff50e5ae3b6`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-linux-ppc64le.tar.gz) | `d7c623d9ccce9cbb4c8a5d1432ac00222b54f420699d565416e09555e2cc7ff3`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-linux-s390x.tar.gz) | `288cd27f2e428a3e805c7fcc2c3945c0c6ee2db4812ad293e2bfd9f85bccf428`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.3/kubernetes-node-windows-amd64.tar.gz) | `991765513e0f778ec5416de456dfd709ed90a2fa97741f50dfdb0d30ee4ccbc0`

## Changelog since v1.11.0-rc.2

### Other notable changes

* Pass cluster_location argument to Heapster ([#65176](https://github.com/kubernetes/kubernetes/pull/65176), [@kawych](https://github.com/kawych))
* Fix concurrent map access panic ([#65331](https://github.com/kubernetes/kubernetes/pull/65331), [@dashpole](https://github.com/dashpole))
    * Don't watch .mount cgroups to reduce number of inotify watches
    * Fix NVML initialization race condition
    * Fix brtfs disk metrics when using a subdirectory of a subvolume
* User can now use `sudo crictl` on GCE cluster. ([#65389](https://github.com/kubernetes/kubernetes/pull/65389), [@Random-Liu](https://github.com/Random-Liu))



# v1.11.0-rc.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0-rc.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes.tar.gz) | `30742ea1e24ade88e148db872eeef58597813bc67d485c0ff6e4b7284d59500a`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-src.tar.gz) | `77e1f018820542088f1e9af453a139ae8ad0691cbde98ab01695a8f499dbe4cf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-darwin-386.tar.gz) | `2f8777fcb938bbc310fb481a56dca62e14c27f6a85e61ab4650aeb28e5f9f05a`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-darwin-amd64.tar.gz) | `30a5ed844d2b6b6b75e19e1f68f5c18ff8ec4f268c149737a6e715bc0a6e297f`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-386.tar.gz) | `e4c60f463366fdf62e9c10c45c6f6b75d63aa3bd6665a0b56c9c2e2104ea9da6`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-amd64.tar.gz) | `1d62f9ac92f23897d4545ebaf15d78b13b04157d83a839e347f4bd02cc484af4`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-arm.tar.gz) | `8f52c6da9f95c7e127a6945a164e66d5266ebf2f4d02261653c5dd6936ec6b00`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-arm64.tar.gz) | `e6b677601f0d78cf9463a86d6cc33b4861a88d2fbf3728b9c449a216fb84578e`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-ppc64le.tar.gz) | `2cd49eb1d5f6d97f1342ee7f4803e9713a9cf4bfa419c86f4e1f82182d27f535`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-linux-s390x.tar.gz) | `e8134efaea3146336b24e76ae2f6f5cdc63f6aeecc65b52cd0aae92edb8432ac`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-windows-386.tar.gz) | `226b8c687251c877d5876f95f086b131ff3f831fca01dd07caf168269ee2c51d`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-client-windows-amd64.tar.gz) | `c590a3a7f2e08f8046752b5bbc0d0b11f174f750fdd7912a68dd5335fcedc03d`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-server-linux-amd64.tar.gz) | `13c518091348c1b4355bf6b1a72514e71f68ad68a51df7d0706666c488e51158`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-server-linux-arm.tar.gz) | `d4b4fa98ece74d2cc240cf43b59629fe0115d3750d5938ae5ece972251a96018`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-server-linux-arm64.tar.gz) | `6b9e9de414619fb28dbbee05537697c2fdce130abe65372b477d3858571bfabd`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-server-linux-ppc64le.tar.gz) | `537f27284ad47d37d9ab8c4f4113b90f55948f88cd5dbab203349a34a9ddeccb`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-server-linux-s390x.tar.gz) | `71299a59bd4b7b38242631b3f441885ca9dcd99934427c8399b4f4598cc47fbb`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-linux-amd64.tar.gz) | `792da4aa3c06dee14b10f219591af8e967e466c5d5646d8973abfb1071cb5202`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-linux-arm.tar.gz) | `40a276dd0efdd6e87206d9b2a994ba49c336a455bad7076ddb22a4a6aa0a885f`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-linux-arm64.tar.gz) | `867504f25a864130c28f18aa5e99be0b2a8e0223ea86d46a4033e76cbe865533`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-linux-ppc64le.tar.gz) | `b1ff4471acf84a0d4f43854c778d6e18f8d0358da1323d1812f1d1a922b56662`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-linux-s390x.tar.gz) | `b527ab6ad8f7a3220e743780412c2d6c7fdaccc4eaa71ccfe90ad3e4e98d1d80`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.2/kubernetes-node-windows-amd64.tar.gz) | `1643e19c7dd5b139a6ab81768249d62392fcad5f6f2aec7edab279009368898b`

## Changelog since v1.11.0-rc.1

### Other notable changes

* Prevents a `kubectl delete` hang when deleting controller managed lists ([#65367](https://github.com/kubernetes/kubernetes/pull/65367), [@deads2k](https://github.com/deads2k))
* fixes a memory leak in the kube-controller-manager observed when large numbers of pods with tolerations are created/deleted ([#65339](https://github.com/kubernetes/kubernetes/pull/65339), [@liggitt](https://github.com/liggitt))
* The "kubectl cp" command now supports path shortcuts (../) in remote paths. ([#65189](https://github.com/kubernetes/kubernetes/pull/65189), [@juanvallejo](https://github.com/juanvallejo))
* Split 'scheduling_latency_seconds' metric into finer steps (predicate, priority, premption) ([#65306](https://github.com/kubernetes/kubernetes/pull/65306), [@shyamjvs](https://github.com/shyamjvs))
* fixed incorrect OpenAPI schema for CustomResourceDefinition objects ([#65256](https://github.com/kubernetes/kubernetes/pull/65256), [@liggitt](https://github.com/liggitt))



# v1.11.0-rc.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0-rc.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes.tar.gz) | `f4d6126030d76f4340bf36ba02562388ea6984aa3d3f3ece39359c2a0f605b73`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-src.tar.gz) | `6383966a2bc5b252f1938fdfe4a7c35fafaa7642da22f86a017e2b718dedda92`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-darwin-386.tar.gz) | `1582a21d8e7c9ec8719a003cd79a7c51e984f2b7b703f0816af50efa4b838c6f`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-darwin-amd64.tar.gz) | `77ae2765fcac147095d2791f42b212a6c150764a311dfb6e7740a70d0c155574`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-386.tar.gz) | `87f6e22ef05bcd468424b02da2a58c0d695bd875e2130cb94adb842988aa532c`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-amd64.tar.gz) | `978147f7989b5669a74be5af7c6fe9b3039956c958d17dc53f65ae2364f8485c`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-arm.tar.gz) | `e7e13c6f500f86641f62fcaa34715fd8aa40913fe97ac507a73a726fb6d2f3f4`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-arm64.tar.gz) | `5e35f3c80f0811b252c725c938dc4803034b4925d6fa1c2f0042132fd19d6db2`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-ppc64le.tar.gz) | `0cec908e2f85763e9f066661c2f12122b13901004f552729ced66673f12669da`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-linux-s390x.tar.gz) | `ae6e0d7eb75647531b224d8a873528bb951858bfddc9595771def8a26dd2a709`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-windows-386.tar.gz) | `9eaba9edce7e06c15088612b90c8adc714509cab8ba612019c960dc3fe306b9d`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-client-windows-amd64.tar.gz) | `dae41cc0be99bec6b28c8bd96eccd6c41b2d51602bc6a374dff922c34708354f`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-server-linux-amd64.tar.gz) | `73510e5be3650bdeb219e93f78b042b4c9b616cbe672c68cab2e713c13f040ca`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-server-linux-arm.tar.gz) | `00475cb20dbabbc7f1a048f0907ef1b2cf34cfacab3ad82d2d86e2afae466eca`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-server-linux-arm64.tar.gz) | `00b1a2fa9e7c6b9929e09d7e0ec9aadc3e697d7527dcda9cd7d57e89daf618f5`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-server-linux-ppc64le.tar.gz) | `6c2d303a243ca4452c19b613bc71c92222c33c9322983f9a485231a7d2471681`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-server-linux-s390x.tar.gz) | `c93d9021bd00bd1adda521e6952c72e08beebe8d994ad92cc14c741555e429a9`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-linux-amd64.tar.gz) | `7d84cd7f60186d59e84e4b48bc5cd25ddd0fbcef4ebb2a2a3bd06831433c0135`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-linux-arm.tar.gz) | `4fa046b5c0b3d860e741b33f4da722a16d4b7de9674ab6a60da2d5749b3175ef`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-linux-arm64.tar.gz) | `db80b1916da3262b1e3aeb658b9a9c829a76e85f97e30c5fc1b07a3ef331003a`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-linux-ppc64le.tar.gz) | `c693a8b7827f9098e8f407182febc24041dd396fdd66c61f8b666252fbbb342a`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-linux-s390x.tar.gz) | `ee5becf3f2034157e4c50488278095c3685a01b7f715693a1053fa986d983dcf`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-rc.1/kubernetes-node-windows-amd64.tar.gz) | `65f4f7a96f89c8dcba6c21e79aeac677790c8338c3f8f0e9e27fb16154d7e06f`

## Changelog since v1.11.0-beta.2

### Action Required

* A cluster-autoscaler ClusterRole is added to cover only the functionality required by Cluster Autoscaler and avoid abusing system:cluster-admin role. ([#64503](https://github.com/kubernetes/kubernetes/pull/64503), [@kgolab](https://github.com/kgolab))
    * action required: Cloud providers other than GCE might want to update their deployments or sample yaml files to reuse the role created via add-on.

### Other notable changes

* The "kubectl cp" command now supports path shortcuts (../) in remote paths. ([#65189](https://github.com/kubernetes/kubernetes/pull/65189), [@juanvallejo](https://github.com/juanvallejo))
* Update crictl on GCE to v1.11.0. ([#65254](https://github.com/kubernetes/kubernetes/pull/65254), [@Random-Liu](https://github.com/Random-Liu))
* kubeadm: Use the release-1.11 branch by default ([#65229](https://github.com/kubernetes/kubernetes/pull/65229), [@luxas](https://github.com/luxas))
* Updates Cluster Autoscaler version to 1.3.0. Release notes: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.3.0 ([#65219](https://github.com/kubernetes/kubernetes/pull/65219), [@aleksandra-malinowska](https://github.com/aleksandra-malinowska))
* The deprecated `--service-account-private-key-file` flag has been removed from the cloud-controller-manager. The flag is still present and supported in the kube-controller-manager. ([#65182](https://github.com/kubernetes/kubernetes/pull/65182), [@liggitt](https://github.com/liggitt))
* Update Cluster Autoscaler to v1.3.0-beta.2. Release notes for this version: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.3.0-beta.2 ([#65148](https://github.com/kubernetes/kubernetes/pull/65148), [@aleksandra-malinowska](https://github.com/aleksandra-malinowska))
* Fixed API server panic during concurrent GET or LIST requests with non-empty `resourceVersion`. ([#65092](https://github.com/kubernetes/kubernetes/pull/65092), [@sttts](https://github.com/sttts))
* Kubernetes json deserializer is now case-sensitive to restore compatibility with pre-1.8 servers. ([#65034](https://github.com/kubernetes/kubernetes/pull/65034), [@caesarxuchao](https://github.com/caesarxuchao))
    * If your config files contains fields with wrong case, the config files will be now invalid.
* GCE: Fixes operation polling to adhere to the specified interval. Furthermore, operation errors are now returned instead of ignored. ([#64630](https://github.com/kubernetes/kubernetes/pull/64630), [@nicksardo](https://github.com/nicksardo))
* Updated hcsshim dependency to v0.6.11 ([#64272](https://github.com/kubernetes/kubernetes/pull/64272), [@jessfraz](https://github.com/jessfraz))
* Include kms-plugin-container.manifest to master manifests tarball. ([#65035](https://github.com/kubernetes/kubernetes/pull/65035), [@immutableT](https://github.com/immutableT))
* kubeadm - Ensure the peer port is secured by explicitly setting the peer URLs for the default etcd instance. ([#64988](https://github.com/kubernetes/kubernetes/pull/64988), [@detiber](https://github.com/detiber))
    * kubeadm - Ensure that the etcd certificates are generated using a proper CN
    * kubeadm - Update generated etcd peer certificate to include localhost addresses for the default configuration.
    * kubeadm - Increase the manifest update timeout to make upgrades a bit more reliable.
* Kubernetes depends on v0.30.1 of cAdvisor ([#64987](https://github.com/kubernetes/kubernetes/pull/64987), [@dashpole](https://github.com/dashpole))
* Update Cluster Autoscaler version to 1.3.0-beta.1. Release notes: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.3.0-beta.1 ([#64977](https://github.com/kubernetes/kubernetes/pull/64977), [@aleksandra-malinowska](https://github.com/aleksandra-malinowska))
* Webhooks for the mutating admission controller now support "remove" operation. ([#64255](https://github.com/kubernetes/kubernetes/pull/64255), [@rojkov](https://github.com/rojkov))
* deprecated and inactive option '--enable-custom-metrics' is removed in 1.11 ([#60699](https://github.com/kubernetes/kubernetes/pull/60699), [@CaoShuFeng](https://github.com/CaoShuFeng))
* kubernetes now packages cri-tools (crictl) in addition to all the other kubeadm tools in a deb and rpm. ([#64836](https://github.com/kubernetes/kubernetes/pull/64836), [@chuckha](https://github.com/chuckha))
* Fix setup of configmap/secret/projected/downwardapi volumes ([#64855](https://github.com/kubernetes/kubernetes/pull/64855), [@gnufied](https://github.com/gnufied))
* Setup dns servers and search domains for Windows Pods in dockershim. Docker EE version >= 17.10.0 is required for propagating DNS to containers. ([#63905](https://github.com/kubernetes/kubernetes/pull/63905), [@feiskyer](https://github.com/feiskyer))



# v1.11.0-beta.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0-beta.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes.tar.gz) | `0addbff3fc61047460da0fca7413f4cc679fac7482c3f09aa4f4a60d8ec8dd5c`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-src.tar.gz) | `943629abc5b046cc5db280417e5cf3a8342c5f67c8deb3d7283b02de67b3a3c3`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-darwin-386.tar.gz) | `9b714bb99e9d8c51c718d9ec719412b2006c921e6a5566acf387797b57014386`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | `11fc9f94c82b2adc860964be8e84ed1e17ae711329cac3c7aff58067caeeffe2`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-386.tar.gz) | `016abd161dc394ab6e1e8f57066ff413b523c71ac2af458bfc8dfa2107530910`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | `f98c223c24680aae583ff63fa8e1ef49421ddd660bd748fea493841c24ad6417`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-arm.tar.gz) | `78cf5dca303314023d6f82c7570e92b814304029fb7d3941d7c04855679e120d`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | `c35e03687d491d9ca955121912c56d00741c86381370ed5890b0ee8b629a3e01`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | `4e848a58f822f971dbda607d26128d1b718fc07665d2f65b87936eec40b037b2`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | `ead83a70e4782efdaea3645ca2a59e51209041ce41f9d805d5c1d10f029b1cb0`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-windows-386.tar.gz) | `c357b28c83e769517d7b19e357260d62485e861005d98f84c752d109fa48bd20`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | `2ae78921a35a8a582b226521f904f0840c17e3e097364d6a3fcd10d196bec0dc`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | `26bd6e05a4bf942534f0578b1cdbd11b8c868aa3331e2681734ecc93d75f6b85`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-server-linux-arm.tar.gz) | `df706ccad0a235613e644eda363c49bfb858860a2ae5219b17b996f36669a7fc`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | `73f3e7a82d7c78a9f03ce0c84ae4904942f0bf88b3bf045fc9b1707b686cb04e`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | `ebeb67e45e630469d55b442d2c6092065f1c1403d1965c4340d0b6c1fa7f6676`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `c82e6a41b8e451600fb5bfdad3addf3c35b5edb518a7bf9ebd03af0574d57975`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `e6dbd56c10fee83f400e76ae02325eda0a583347f6b965eeb610c90d664d7990`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `df9d18c3af4d6ee237a238b3029823f6e90b2ae3f0d25b741d4b3fedb7ea14f8`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `d84e98702651615336256d3453516df9ad39f39400f6091d9e2b4c95b4111ede`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `a62037f00ab29302f72aa23116c304b676cc41a6f47f79a2faf4e4ea18059178`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `bef66f2080f7ebf442234d841ec9c994089fa02b400d98e1b01021f1f66c4cd0`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `2b029715b98c3355a172ed5a6e08e73ad4ef264c74a26ed5a3da67f90764b7dc`

## Changelog since v1.11.0-beta.1

### Action Required

* [action required] `kubeadm join` is now blocking on the kubelet performing the TLS Bootstrap properly. ([#64792](https://github.com/kubernetes/kubernetes/pull/64792), [@luxas](https://github.com/luxas))
    * Earlier, `kubeadm join` only did the discovery part and exited successfully without checking that the
    * kubelet actually started properly and performed the TLS bootstrap correctly. Now, as kubeadm runs
    * some post-join steps (e.g. annotating the Node API object with the CRISocket as in this PR, as a
    * stop-gap until this is discoverable automatically), `kubeadm join` is now waiting for the kubelet to
    * perform the TLS Bootstrap, and then uses that credential to perform further actions. This also
    * improves the UX, as `kubeadm` will exit with a non-zero code if the kubelet isn't in a functional
    * state, instead of pretending like everything's fine.
* [action required] The structure of the kubelet dropin in the kubeadm deb package has changed significantly. ([#64780](https://github.com/kubernetes/kubernetes/pull/64780), [@luxas](https://github.com/luxas))
    * Instead of hard-coding the parameters for the kubelet in the dropin, a structured configuration file
    * for the kubelet is used, and is expected to be present in `/var/lib/kubelet/config.yaml`.
    * For runtime-detected, instance-specific configuration values, a environment file with
    * dynamically-generated flags at `kubeadm init` or `kubeadm join` run time is used.
    * Finally, if the user wants to override something specific for the kubelet that can't be done via
    * the kubeadm Configuration file (which is preferred), they might add flags to the 
    * `KUBELET_EXTRA_ARGS` environment variable in either `/etc/default/kubelet`
    * or `/etc/sysconfig/kubelet`, depending on the system you're running on.
* [action required] The `--node-name` flag for kubeadm now dictates the Node API object name the ([#64706](https://github.com/kubernetes/kubernetes/pull/64706), [@liztio](https://github.com/liztio))
    * kubelet uses for registration, in all cases but where you might use an in-tree cloud provider.
    * If you're not using an in-tree cloud provider, `--node-name` will set the Node API object name.
    * If you're using an in-tree cloud provider, you MUST make `--node-name` match the name the
    * in-tree cloud provider decides to use.
* [action required] kubeadm: The Token-related fields in the `MasterConfiguration` object have now been refactored. Instead of the top-level `.Token`, `.TokenTTL`, `.TokenUsages`, `.TokenGroups` fields, there is now a `BootstrapTokens` slice of `BootstrapToken` objects that support the same features under the `.Token`, `.TTL`, `.Usages`, `.Groups` fields. ([#64408](https://github.com/kubernetes/kubernetes/pull/64408), [@luxas](https://github.com/luxas))

### Other notable changes

* Add Vertical Pod Autoscaler to autoscaling/v2beta1 ([#63797](https://github.com/kubernetes/kubernetes/pull/63797), [@kgrygiel](https://github.com/kgrygiel))
* kubeadm: only run kube-proxy on architecture consistent nodes ([#64696](https://github.com/kubernetes/kubernetes/pull/64696), [@dixudx](https://github.com/dixudx))
* kubeadm: Add a new `kubeadm upgrade node config` command ([#64624](https://github.com/kubernetes/kubernetes/pull/64624), [@luxas](https://github.com/luxas))
* Orphan delete is now supported for custom resources ([#63386](https://github.com/kubernetes/kubernetes/pull/63386), [@roycaihw](https://github.com/roycaihw))
* Update version of Istio addon from 0.6.0 to 0.8.0. ([#64537](https://github.com/kubernetes/kubernetes/pull/64537), [@ostromart](https://github.com/ostromart))
    * See https://istio.io/about/notes/0.8.html for full Isto release notes.
* Provides API support for external CSI storage drivers to support block volumes. ([#64723](https://github.com/kubernetes/kubernetes/pull/64723), [@vladimirvivien](https://github.com/vladimirvivien))
* kubectl will list all allowed print formats when an invalid format is passed. ([#64371](https://github.com/kubernetes/kubernetes/pull/64371), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Use IONice to reduce IO priority of du and find ([#64800](https://github.com/kubernetes/kubernetes/pull/64800), [@dashpole](https://github.com/dashpole))
    * cAdvisor ContainerReference no longer contains Labels. Use ContainerSpec instead.
    * Fix a bug where cadvisor failed to discover a sub-cgroup that was created soon after the parent cgroup.
* Kubelet will set extended resource capacity to zero after it restarts. If the extended resource is exported by a device plugin, its capacity will change to a valid value after the device plugin re-connects with the Kubelet. If the extended resource is exported by an external component through direct node status capacity patching, the component should repatch the field after kubelet becomes ready again. During the time gap, pods previously assigned with such resources may fail kubelet admission but their controller should create new pods in response to such failures. ([#64784](https://github.com/kubernetes/kubernetes/pull/64784), [@jiayingz](https://github.com/jiayingz))
* Introduce ContainersReady condition in Pod Status ([#64646](https://github.com/kubernetes/kubernetes/pull/64646), [@freehan](https://github.com/freehan))
* The Sysctls experimental feature has been promoted to beta (enabled by default via the `Sysctls` feature flag). PodSecurityPolicy and Pod objects now have fields for specifying and controlling sysctls. Alpha sysctl annotations will be ignored by 1.11+ kubelets. All alpha sysctl annotations in existing deployments must be converted to API fields to be effective. ([#63717](https://github.com/kubernetes/kubernetes/pull/63717), [@ingvagabund](https://github.com/ingvagabund))
* kubeadm now configures the etcd liveness probe correctly when etcd is listening on all interfaces ([#64670](https://github.com/kubernetes/kubernetes/pull/64670), [@stealthybox](https://github.com/stealthybox))
* Fix regression in `v1.JobSpec.backoffLimit` that caused failed Jobs to be restarted indefinitely. ([#63650](https://github.com/kubernetes/kubernetes/pull/63650), [@soltysh](https://github.com/soltysh))
* GCE: Update cloud provider to use TPU v1 API ([#64727](https://github.com/kubernetes/kubernetes/pull/64727), [@yguo0905](https://github.com/yguo0905))
* Kubelet: Add security context for Windows containers ([#64009](https://github.com/kubernetes/kubernetes/pull/64009), [@feiskyer](https://github.com/feiskyer))
* Volume topology aware dynamic provisioning ([#63193](https://github.com/kubernetes/kubernetes/pull/63193), [@lichuqiang](https://github.com/lichuqiang))
* CoreDNS deployment configuration now uses k8s.gcr.io imageRepository ([#64775](https://github.com/kubernetes/kubernetes/pull/64775), [@rajansandeep](https://github.com/rajansandeep))
* Updated Container Storage Interface specification version to v0.3.0 ([#64719](https://github.com/kubernetes/kubernetes/pull/64719), [@davidz627](https://github.com/davidz627))
* Kubeadm: Make CoreDNS run in read-only mode and drop all unneeded privileges  ([#64473](https://github.com/kubernetes/kubernetes/pull/64473), [@nberlee](https://github.com/nberlee))
* Add a volume projection that is able to project service account tokens. ([#62005](https://github.com/kubernetes/kubernetes/pull/62005), [@mikedanese](https://github.com/mikedanese))
* Fix kubectl auth can-i exit code. It will return 1 if the user is not allowed and 0 if it's allowed. ([#59579](https://github.com/kubernetes/kubernetes/pull/59579), [@fbac](https://github.com/fbac))
* apply global flag "context" for kubectl config view --minify ([#64608](https://github.com/kubernetes/kubernetes/pull/64608), [@dixudx](https://github.com/dixudx))
* Fix kube-controller-manager panic while provisioning Azure security group rules ([#64739](https://github.com/kubernetes/kubernetes/pull/64739), [@feiskyer](https://github.com/feiskyer))
* API change for volume topology aware dynamic provisioning ([#63233](https://github.com/kubernetes/kubernetes/pull/63233), [@lichuqiang](https://github.com/lichuqiang))
* Add azuredisk PV size grow feature ([#64386](https://github.com/kubernetes/kubernetes/pull/64386), [@andyzhangx](https://github.com/andyzhangx))
* Modify e2e tests to use priorityClass beta version & switch priorityClass feature to beta ([#63724](https://github.com/kubernetes/kubernetes/pull/63724), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Adding CSI driver registration code. ([#64560](https://github.com/kubernetes/kubernetes/pull/64560), [@sbezverk](https://github.com/sbezverk))
* fixes a potential deadlock in the garbage collection controller ([#64235](https://github.com/kubernetes/kubernetes/pull/64235), [@liggitt](https://github.com/liggitt))
* Fixes issue for readOnly subpath mounts for SELinux systems and when the volume mountPath already existed in the container image. ([#64351](https://github.com/kubernetes/kubernetes/pull/64351), [@msau42](https://github.com/msau42))
* Add log and fs stats for Windows containers ([#62266](https://github.com/kubernetes/kubernetes/pull/62266), [@feiskyer](https://github.com/feiskyer))
* client-go: credential exec plugins have been promoted to beta ([#64482](https://github.com/kubernetes/kubernetes/pull/64482), [@ericchiang](https://github.com/ericchiang))
* Revert [#64364](https://github.com/kubernetes/kubernetes/pull/64364) to resurrect rescheduler. More info https://github.com/kubernetes/kubernetes/issues/64725 :) ([#64592](https://github.com/kubernetes/kubernetes/pull/64592), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Add RequestedToCapacityRatioPriority priority function. Function is parametrized with set of points mapping node utilization (0-100) to score (0-10). ([#63929](https://github.com/kubernetes/kubernetes/pull/63929), [@losipiuk](https://github.com/losipiuk))
    * Function is linear between points. Resource utilization is defined as one minus ratio of total amount of resource requested by pods on node and node's capacity (scaled to 100). 
    * Final utilization used for computation is arithmetic mean of cpu utilization and memory utilization.
    * Function is disabled by default and can be enabled via scheduler policy config file.
    * If no parametrization is specified in config file it defaults to one which gives score 10 to utilization 0 and score 0 to utilization 100.
* `kubeadm init` detects if systemd-resolved is running and configures the kubelet to use a working resolv.conf. ([#64665](https://github.com/kubernetes/kubernetes/pull/64665), [@stealthybox](https://github.com/stealthybox))
* fix data loss issue if using existing azure disk with partitions in disk mount  ([#63270](https://github.com/kubernetes/kubernetes/pull/63270), [@andyzhangx](https://github.com/andyzhangx))
* Meta data of CustomResources is now pruned and schema checked during deserialization of requests and when read from etcd. In the former case, invalid meta data is rejected, in the later it is dropped from the CustomResource objects. ([#64267](https://github.com/kubernetes/kubernetes/pull/64267), [@sttts](https://github.com/sttts))
* Add Alpha support for dynamic volume limits based on node type ([#64154](https://github.com/kubernetes/kubernetes/pull/64154), [@gnufied](https://github.com/gnufied))
* Fixed CSI gRPC connection leak during volume operations. ([#64519](https://github.com/kubernetes/kubernetes/pull/64519), [@vladimirvivien](https://github.com/vladimirvivien))
* in-tree support for openstack credentials is now deprecated. please use the "client-keystone-auth" from the cloud-provider-openstack repository. details on how to use this new capability is documented here - https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-client-keystone-auth.md ([#64346](https://github.com/kubernetes/kubernetes/pull/64346), [@dims](https://github.com/dims))
* `ScheduleDaemonSetPods` is an alpha feature (since v1.11) that causes DaemonSet Pods ([#63223](https://github.com/kubernetes/kubernetes/pull/63223), [@k82cn](https://github.com/k82cn))
    * to be scheduler by default scheduler, instead of Daemonset controller. When it is enabled,
    * the `NodeAffinity` term (instead of `.spec.nodeName`) is added to the DaemonSet Pods;
    * this enables the default scheduler to bind the Pod to the target host. If node affinity
    * of DaemonSet Pod already exists, it will be replaced.
    * DaemonSet controller will only perform these operations when creating DaemonSet Pods;
    * and those operations will only modify the Pods of DaemonSet, no changes are made to the
    * `.spec.template` of DaemonSet.
* fix formatAndMount func issue on Windows ([#63248](https://github.com/kubernetes/kubernetes/pull/63248), [@andyzhangx](https://github.com/andyzhangx))
* AWS EBS, Azure Disk, GCE PD and Ceph RBD volume plugins support dynamic provisioning of raw block volumes. ([#64447](https://github.com/kubernetes/kubernetes/pull/64447), [@jsafrane](https://github.com/jsafrane))
* kubeadm upgrade apply can now ignore version errors with --force ([#64570](https://github.com/kubernetes/kubernetes/pull/64570), [@liztio](https://github.com/liztio))
* Adds feature gate for plugin watcher ([#64605](https://github.com/kubernetes/kubernetes/pull/64605), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* Kubelet now proxies container streaming between apiserver and container runtime. The connection between kubelet and apiserver is authenticated. Container runtime should change streaming server to serve on localhost, to make the connection between kubelet and container runtime local. ([#64006](https://github.com/kubernetes/kubernetes/pull/64006), [@Random-Liu](https://github.com/Random-Liu))
    * In this way, the whole container streaming connection is secure. To switch back to the old behavior, set `--redirect-container-streaming=true` flag.
* TokenRequests now are required to have an expiration duration between 10 minutes and 2^32 seconds. ([#63999](https://github.com/kubernetes/kubernetes/pull/63999), [@mikedanese](https://github.com/mikedanese))
* Expose `/debug/flags/v` to allow dynamically set glog logging level, if want to change glog level to 3, you only have to send a PUT request with like `curl -X PUT http://127.0.0.1:8080/debug/flags/v -d "3"`. ([#63777](https://github.com/kubernetes/kubernetes/pull/63777), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* New conformance test added for Watch. ([#61424](https://github.com/kubernetes/kubernetes/pull/61424), [@jennybuckley](https://github.com/jennybuckley))
* The GitRepo volume type is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container. ([#63445](https://github.com/kubernetes/kubernetes/pull/63445), [@ericchiang](https://github.com/ericchiang))
* kubeadm now preserves previous manifests after upgrades ([#64337](https://github.com/kubernetes/kubernetes/pull/64337), [@liztio](https://github.com/liztio))
* Implement kubelet side online file system resizing ([#62460](https://github.com/kubernetes/kubernetes/pull/62460), [@mlmhl](https://github.com/mlmhl))



# v1.11.0-beta.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0-beta.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes.tar.gz) | `3209303a10ca8dd311c500ee858b9151b43c1bb5c2b3a9fb9281722e021d6871`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-src.tar.gz) | `c2e4d3b1beb4cd0b2a775394a30da2c2949d380e57f729dc48c541069c103326`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `cbded4d58b3d2cbeb2e43c48c9dd359834c9c9aa376751a7f8960be45601fb40`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `ceccd21fda90b96865801053f1784d4062d69b11e2e911483223860dfe6c3a17`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-386.tar.gz) | `75c9794a7f43f891aa839b2571fa44ffced25197578adc31b4c3cb28d7fbf158`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `184905f6b8b856306483d811d015cf0b28c0703ceb372594622732da2a07989f`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `2d985829499588d32483d7c6a36b3b0f2b6d4031eda31c65b066b77bc51bae66`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `268556ede751058162a42d0156f27e42e37b23d60b2485e350cffe6e1b376fa4`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `8859bd7a37bf5a659eb17e47d2c54d228950b2ef48243c93f11799c455789983`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `90bbe2fc45ae722a05270820336b9178baaab198401bb6888e817afe6a1a304e`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-windows-386.tar.gz) | `948b01f555abfc30990345004d5ce679d4b9d0a32d699a50b6d8309040b2b2f2`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `091e9d4e7fa611cf06d2907d159e0cc36ae8602403ad0819d62df4ddbaba6095`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `727a5e8241035d631d90f3d119a27384abe93cde14c242c4d2d1cf948f84a650`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `6eb7479348e9480d9d1ee31dc991297b93e076dd21b567c595f82d45b66ef949`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `9eab5ccdfba2803a743ed12b4323ad0e8e0215779edf5752224103b6667a35c1`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `d86b07ee28ed3d2c0668a2737fff4b3d025d4cd7b6f1aadc85f8f13b4c12e578`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `c2d19acb88684a52a74f469ab26874ab224023f29290865e08c86338d30dd598`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `2957bf3e9dc9cd9570597434909e5ef03e996f8443c02f9d95fa6de2cd17126f`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `5995b8b9628fca9eaa92c283cfb4199ab353efa8953b980eec994f49ac3a0ebd`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `996691b3b894ec9769be1ee45c5053ff1560e3ef161de8f8b9ac067c0d3559d3`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `8bb7fe72ec704afa5ad96356787972144b0f7923fc68678894424f1f62da7041`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `4c1f0314ad60537c8a7866b0cabdece21284ee91ae692d1999b3d5273ee7cbaf`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `158832f41cd452f93482cc8a8f1dd69cc243eb63ce3581e7f2eab2de323f6202`

## Changelog since v1.11.0-alpha.2

### Action Required

* [action required] `.NodeName` and `.CRISocket` in the `MasterConfiguration` and `NodeConfiguration` v1alpha1 API objects are now `.NodeRegistration.Name` and `.NodeRegistration.CRISocket` respectively in the v1alpha2 API. The `.NoTaintMaster` field has been removed in the v1alpha2 API. ([#64210](https://github.com/kubernetes/kubernetes/pull/64210), [@luxas](https://github.com/luxas))
* (ACTION REQUIRED) PersisntVolumeLabel admission controller is now disabled by default. If you depend on this feature (AWS/GCE) then ensure it is added to the `--enable-admission-plugins` flag on the kube-apiserver. ([#64326](https://github.com/kubernetes/kubernetes/pull/64326), [@andrewsykim](https://github.com/andrewsykim))
* [action required] kubeadm: The `:Etcd` struct has been refactored in the v1alpha2 API. All the options now reside under either `.Etcd.Local` or `.Etcd.External`. Automatic conversions from the v1alpha1 API are supported. ([#64066](https://github.com/kubernetes/kubernetes/pull/64066), [@luxas](https://github.com/luxas))
* [action required] kubeadm: kubelets in kubeadm clusters now disable the readonly port (10255). If you're relying on unauthenticated access to the readonly port, please switch to using the secure port (10250). Instead, you can now use ServiceAccount tokens when talking to the secure port, which will make it easier to get access to e.g. the `/metrics` endpoint of the kubelet securely. ([#64187](https://github.com/kubernetes/kubernetes/pull/64187), [@luxas](https://github.com/luxas))
* [action required] kubeadm: Support for `.AuthorizationModes` in the kubeadm v1alpha2 API has been removed. Instead, you can use the `.APIServerExtraArgs` and `.APIServerExtraVolumes` fields to achieve the same effect. Files using the v1alpha1 API and setting this field will be automatically upgraded to this v1alpha2 API and the information will be preserved. ([#64068](https://github.com/kubernetes/kubernetes/pull/64068), [@luxas](https://github.com/luxas))
* [action required] The formerly publicly-available cAdvisor web UI that the kubelet ran on port 4194 by default is now turned off by default. The flag configuring what port to run this UI on `--cadvisor-port` was deprecated in v1.10. Now the default is `--cadvisor-port=0`, in other words, to not run the web server. The recommended way to run cAdvisor if you still need it, is via a DaemonSet. The `--cadvisor-port` will be removed in v1.12 ([#63881](https://github.com/kubernetes/kubernetes/pull/63881), [@luxas](https://github.com/luxas))
* [action required] kubeadm: The `.ImagePullPolicy` field has been removed in the v1alpha2 API version. Instead it's set statically to `IfNotPresent` for all required images. If you want to always pull the latest images before cluster init (like what `Always` would do), run `kubeadm config images pull` before each `kubeadm init`. If you don't want the kubelet to pull any images at `kubeadm init` time, as you for instance don't have an internet connection, you can also run `kubeadm config images pull` before `kubeadm init` or side-load the images some other way (e.g. `docker load -i image.tar`). Having the images locally cached will result in no pull at runtime, which makes it possible to run without any internet connection. ([#64096](https://github.com/kubernetes/kubernetes/pull/64096), [@luxas](https://github.com/luxas))
* [action required] In the new v1alpha2 kubeadm Configuration API, the `.CloudProvider` and `.PrivilegedPods` fields don't exist anymore. ([#63866](https://github.com/kubernetes/kubernetes/pull/63866), [@luxas](https://github.com/luxas))
    * Instead, you should use the out-of-tree cloud provider implementations which are beta in v1.11.
    * If you have to use the legacy in-tree cloud providers, you can rearrange your config like the example below. In case you need the `cloud-config` file (located in `{cloud-config-path}`), you can mount it into the API Server and controller-manager containers using ExtraVolumes like the example below.
    * If you need to use the `.PrivilegedPods` functionality, you can still edit the manifests in
    * `/etc/kubernetes/manifests/`, and set `.SecurityContext.Privileged=true` for the apiserver
    * and controller manager.
    * ---
    * kind: MasterConfiguration
    * apiVersion: kubeadm.k8s.io/v1alpha2
    * apiServerExtraArgs:
    *   cloud-provider: "{cloud}"
    *   cloud-config: "{cloud-config-path}"
    * apiServerExtraVolumes:
    * - name: cloud
    *   hostPath: "{cloud-config-path}"
    *   mountPath: "{cloud-config-path}"
    * controllerManagerExtraArgs:
    *   cloud-provider: "{cloud}"
    *   cloud-config: "{cloud-config-path}"
    * controllerManagerExtraVolumes:
    * - name: cloud
    *   hostPath: "{cloud-config-path}"
    *   mountPath: "{cloud-config-path}"
    * ---
* [action required] kubeadm now uses an upgraded API version for the configuration file, `kubeadm.k8s.io/v1alpha2`. kubeadm in v1.11 will still be able to read `v1alpha1` configuration, and will automatically convert the configuration to `v1alpha2` internally and when storing the configuration in the ConfigMap in the cluster. ([#63788](https://github.com/kubernetes/kubernetes/pull/63788), [@luxas](https://github.com/luxas))
* The annotation `service.alpha.kubernetes.io/tolerate-unready-endpoints` is deprecated.  Users should use Service.spec.publishNotReadyAddresses instead. ([#63742](https://github.com/kubernetes/kubernetes/pull/63742), [@thockin](https://github.com/thockin))
* avoid duplicate status in audit events ([#62695](https://github.com/kubernetes/kubernetes/pull/62695), [@CaoShuFeng](https://github.com/CaoShuFeng))

### Other notable changes

* Remove rescheduler from master. ([#64364](https://github.com/kubernetes/kubernetes/pull/64364), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Declare IPVS-based kube-proxy GA ([#58442](https://github.com/kubernetes/kubernetes/pull/58442), [@m1093782566](https://github.com/m1093782566))
* kubeadm: conditionally set the kubelet cgroup driver for Docker ([#64347](https://github.com/kubernetes/kubernetes/pull/64347), [@neolit123](https://github.com/neolit123))
* kubectl built for darwin from darwin now enables cgo to use the system-native C libraries for DNS resolution. Cross-compiled kubectl (e.g. from an official kubernetes release) still uses the go-native netgo DNS implementation.  ([#64219](https://github.com/kubernetes/kubernetes/pull/64219), [@ixdy](https://github.com/ixdy))
* AWS EBS volumes can be now used as ReadOnly in pods. ([#64403](https://github.com/kubernetes/kubernetes/pull/64403), [@jsafrane](https://github.com/jsafrane))
* Exec authenticator plugin supports TLS client certificates. ([#61803](https://github.com/kubernetes/kubernetes/pull/61803), [@awly](https://github.com/awly))
* Use Patch instead of Put to sync pod status ([#62306](https://github.com/kubernetes/kubernetes/pull/62306), [@freehan](https://github.com/freehan))
* kubectl apply --prune supports CronJob resource.  ([#62991](https://github.com/kubernetes/kubernetes/pull/62991), [@tomoe](https://github.com/tomoe))
* Label ExternalEtcdClientCertificates can be used for ignoring all preflight check issues related to client certificate files for external etcd. ([#64269](https://github.com/kubernetes/kubernetes/pull/64269), [@kad](https://github.com/kad))
* Provide a meaningful error message in openstack cloud provider when no valid IP address can be found for a node ([#64318](https://github.com/kubernetes/kubernetes/pull/64318), [@gonzolino](https://github.com/gonzolino))
* kubeadm: Add a 'kubeadm config migrate' command to convert old API types to their newer counterparts in the new, supported API types. This is just a client-side tool, it just executes locally without requiring a cluster to be running. You can think about this as an Unix pipe that upgrades config files. ([#64232](https://github.com/kubernetes/kubernetes/pull/64232), [@luxas](https://github.com/luxas))
* The --dry-run flag has been enabled for kubectl auth reconcile ([#64458](https://github.com/kubernetes/kubernetes/pull/64458), [@mrogers950](https://github.com/mrogers950))
* Add probe based mechanism for kubelet plugin discovery ([#63328](https://github.com/kubernetes/kubernetes/pull/63328), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* Add Establishing Controller on CRDs to avoid race between Established condition and CRs actually served. In HA setups, the Established condition is delayed by 5 seconds. ([#63068](https://github.com/kubernetes/kubernetes/pull/63068), [@xmudrii](https://github.com/xmudrii))
* CoreDNS is now v1.1.3 ([#64258](https://github.com/kubernetes/kubernetes/pull/64258), [@rajansandeep](https://github.com/rajansandeep))
* kubeadm will pull required images during preflight checks if it cannot find them on the system ([#64105](https://github.com/kubernetes/kubernetes/pull/64105), [@chuckha](https://github.com/chuckha))
* kubeadm: rename the addon parameter `kube-dns` to `coredns` for `kubeadm alpha phases addons` as CoreDNS is now the default DNS server in 1.11. ([#64274](https://github.com/kubernetes/kubernetes/pull/64274), [@neolit123](https://github.com/neolit123))
* kubeadm: when starting the API server use the arguments --enable-admission-plugins and --disable-admission-plugins instead of the deprecated --admission-control. ([#64165](https://github.com/kubernetes/kubernetes/pull/64165), [@neolit123](https://github.com/neolit123))
* Add spec.additionalPrinterColumns to CRDs to define server side printing columns. ([#60991](https://github.com/kubernetes/kubernetes/pull/60991), [@sttts](https://github.com/sttts))
* fix azure file size grow issue ([#64383](https://github.com/kubernetes/kubernetes/pull/64383), [@andyzhangx](https://github.com/andyzhangx))
* Fix issue of colliding nodePorts when the cluster has services with externalTrafficPolicy=Local ([#64349](https://github.com/kubernetes/kubernetes/pull/64349), [@nicksardo](https://github.com/nicksardo))
* fixes a panic applying json patches containing out of bounds operations ([#64355](https://github.com/kubernetes/kubernetes/pull/64355), [@liggitt](https://github.com/liggitt))
* Fail fast if cgroups-per-qos is set on Windows ([#62984](https://github.com/kubernetes/kubernetes/pull/62984), [@feiskyer](https://github.com/feiskyer))
* Move Volume expansion to Beta ([#64288](https://github.com/kubernetes/kubernetes/pull/64288), [@gnufied](https://github.com/gnufied))
* kubectl delete does not use reapers for removing objects anymore, but relies on server-side GC entirely ([#63979](https://github.com/kubernetes/kubernetes/pull/63979), [@soltysh](https://github.com/soltysh))
* Basic plumbing for volume topology aware dynamic provisioning ([#63232](https://github.com/kubernetes/kubernetes/pull/63232), [@lichuqiang](https://github.com/lichuqiang))
* API server properly parses propagationPolicy as a query parameter sent with a delete request ([#63414](https://github.com/kubernetes/kubernetes/pull/63414), [@roycaihw](https://github.com/roycaihw))
* Property `serverAddressByClientCIDRs` in `metav1.APIGroup` (discovery API) now become optional instead of required ([#61963](https://github.com/kubernetes/kubernetes/pull/61963), [@roycaihw](https://github.com/roycaihw))
* The dynamic Kubelet config feature is now beta, and the DynamicKubeletConfig feature gate is on by default. In order to use dynamic Kubelet config, ensure that the Kubelet's --dynamic-config-dir option is set.  ([#64275](https://github.com/kubernetes/kubernetes/pull/64275), [@mtaufen](https://github.com/mtaufen))
* Add reason message logs for non-exist Azure resources ([#64248](https://github.com/kubernetes/kubernetes/pull/64248), [@feiskyer](https://github.com/feiskyer))
* Fix SessionAffinity not updated issue for Azure load balancer ([#64180](https://github.com/kubernetes/kubernetes/pull/64180), [@feiskyer](https://github.com/feiskyer))
* The kube-apiserver openapi doc now includes extensions identifying APIService and CustomResourceDefinition kinds ([#64174](https://github.com/kubernetes/kubernetes/pull/64174), [@liggitt](https://github.com/liggitt))
* apiservices/status and certificatesigningrequests/status now support GET and PATCH ([#64063](https://github.com/kubernetes/kubernetes/pull/64063), [@roycaihw](https://github.com/roycaihw))
* kubectl: This client version requires the `apps/v1` APIs, so it will not work against a cluster version older than v1.9.0. Note that kubectl only guarantees compatibility with clusters that are +/-1 minor version away. ([#61419](https://github.com/kubernetes/kubernetes/pull/61419), [@enisoc](https://github.com/enisoc))
* Correct the way we reset containers and pods in kubeadm via crictl ([#63862](https://github.com/kubernetes/kubernetes/pull/63862), [@runcom](https://github.com/runcom))
* Allow env from resource with keys & updated tests ([#60636](https://github.com/kubernetes/kubernetes/pull/60636), [@PhilipGough](https://github.com/PhilipGough))
* The kubelet certificate rotation feature can now be enabled via the `.RotateCertificates` field in the kubelet's config file. The `--rotate-certificates` flag is now deprecated, and will be removed in a future release. ([#63912](https://github.com/kubernetes/kubernetes/pull/63912), [@luxas](https://github.com/luxas))
* Use DeleteOptions.PropagationPolicy instead of OrphanDependents in kubectl  ([#59851](https://github.com/kubernetes/kubernetes/pull/59851), [@nilebox](https://github.com/nilebox))
* add block device support for azure disk ([#63841](https://github.com/kubernetes/kubernetes/pull/63841), [@andyzhangx](https://github.com/andyzhangx))
* Fix incorrectly propagated ResourceVersion in ListRequests returning 0 items. ([#64150](https://github.com/kubernetes/kubernetes/pull/64150), [@wojtek-t](https://github.com/wojtek-t))
* Changes ext3/ext4 volume creation to not reserve any portion of the volume for the root user. ([#64102](https://github.com/kubernetes/kubernetes/pull/64102), [@atombender](https://github.com/atombender))
* Add CRD Versioning with NOP converter ([#63830](https://github.com/kubernetes/kubernetes/pull/63830), [@mbohlool](https://github.com/mbohlool))
* adds a kubectl wait command ([#64034](https://github.com/kubernetes/kubernetes/pull/64034), [@deads2k](https://github.com/deads2k))
* "kubeadm init" now writes a structured and versioned kubelet ComponentConfiguration file to `/var/lib/kubelet/config.yaml` and an environment file with runtime flags (you can source this file in the systemd kubelet dropin) to `/var/lib/kubelet/kubeadm-flags.env`. ([#63887](https://github.com/kubernetes/kubernetes/pull/63887), [@luxas](https://github.com/luxas))
* `kubectl auth reconcile` only works with rbac.v1 ([#63967](https://github.com/kubernetes/kubernetes/pull/63967), [@deads2k](https://github.com/deads2k))
* The dynamic Kubelet config feature will now update config in the event of a ConfigMap mutation, which reduces the chance for silent config skew. Only name, namespace, and kubeletConfigKey may now be set in Node.Spec.ConfigSource.ConfigMap. The least disruptive pattern for config management is still to create a new ConfigMap and incrementally roll out a new Node.Spec.ConfigSource. ([#63221](https://github.com/kubernetes/kubernetes/pull/63221), [@mtaufen](https://github.com/mtaufen))
* Graduate CRI container log rotation to beta, and enable it by default. ([#64046](https://github.com/kubernetes/kubernetes/pull/64046), [@yujuhong](https://github.com/yujuhong))
* APIServices with kube-like versions (e.g. v1, v2beta1, etc.) will be sorted appropriately within each group.  ([#64004](https://github.com/kubernetes/kubernetes/pull/64004), [@mbohlool](https://github.com/mbohlool))
* kubectl and client-go now detects duplicated name for user, cluster and context when loading kubeconfig and reports error  ([#60464](https://github.com/kubernetes/kubernetes/pull/60464), [@roycaihw](https://github.com/roycaihw))
* event object references with apiversion will now report an apiversion. ([#63913](https://github.com/kubernetes/kubernetes/pull/63913), [@deads2k](https://github.com/deads2k))
* Subresources for custom resources is now beta and enabled by default. With this, updates to the `/status` subresource will disallow updates to all fields other than `.status` (not just `.spec` and `.metadata` as before). Also, `required` can be used at the root of the CRD OpenAPI validation schema when the `/status` subresource is enabled. ([#63598](https://github.com/kubernetes/kubernetes/pull/63598), [@nikhita](https://github.com/nikhita))
* increase grpc client default response size ([#63977](https://github.com/kubernetes/kubernetes/pull/63977), [@runcom](https://github.com/runcom))
* HTTP transport now uses `context.Context` to cancel dial operations. k8s.io/client-go/transport/Config struct has been updated to accept a function with a `context.Context` parameter. This is a breaking change if you use this field in your code. ([#60012](https://github.com/kubernetes/kubernetes/pull/60012), [@ash2k](https://github.com/ash2k))
* Adds a mechanism in vSphere Cloud Provider to get credentials from Kubernetes secrets ([#63902](https://github.com/kubernetes/kubernetes/pull/63902), [@abrarshivani](https://github.com/abrarshivani))
* kubeadm: A `kubeadm config print-default` command has now been added that you can use as a starting point when writing your own kubeadm configuration files ([#63969](https://github.com/kubernetes/kubernetes/pull/63969), [@luxas](https://github.com/luxas))
* Update event-exporter to version v0.2.0  that supports old (gke_container/gce_instance) and new (k8s_container/k8s_node/k8s_pod) stackdriver resources. ([#63918](https://github.com/kubernetes/kubernetes/pull/63918), [@cezarygerard](https://github.com/cezarygerard))
* Cluster Autoscaler 1.2.2 (release notes: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.2.2) ([#63974](https://github.com/kubernetes/kubernetes/pull/63974), [@aleksandra-malinowska](https://github.com/aleksandra-malinowska))
* Update kubeadm's minimum supported kubernetes in v1.11.x to 1.10 ([#63920](https://github.com/kubernetes/kubernetes/pull/63920), [@dixudx](https://github.com/dixudx))
* Add 'UpdateStrategyType' and 'RollingUpdateStrategy' to 'kubectl describe sts' command output. ([#63844](https://github.com/kubernetes/kubernetes/pull/63844), [@tossmilestone](https://github.com/tossmilestone))
* Remove UID mutation from request.context. ([#63957](https://github.com/kubernetes/kubernetes/pull/63957), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* kubeadm has removed `.Etcd.SelfHosting` from its configuration API. It was never used in practice. ([#63871](https://github.com/kubernetes/kubernetes/pull/63871), [@luxas](https://github.com/luxas))
* list/watch API requests with a fieldSelector that specifies `metadata.name` can now be authorized as requests for an individual named resource ([#63469](https://github.com/kubernetes/kubernetes/pull/63469), [@wojtek-t](https://github.com/wojtek-t))
* Add a way to pass extra arguments to etcd. ([#63961](https://github.com/kubernetes/kubernetes/pull/63961), [@mborsz](https://github.com/mborsz))
* minor fix for VolumeZoneChecker predicate, storageclass can be in annotation and spec. ([#63749](https://github.com/kubernetes/kubernetes/pull/63749), [@wenlxie](https://github.com/wenlxie))
* vSphere Cloud Provider: add SAML token authentication support ([#63824](https://github.com/kubernetes/kubernetes/pull/63824), [@dougm](https://github.com/dougm))
* adds the `kubeadm upgrade diff` command to show how static pod manifests will be changed by an upgrade. ([#63930](https://github.com/kubernetes/kubernetes/pull/63930), [@liztio](https://github.com/liztio))
* Fix memory cgroup notifications, and reduce associated log spam. ([#63220](https://github.com/kubernetes/kubernetes/pull/63220), [@dashpole](https://github.com/dashpole))
* Adds a `kubeadm config images pull` command to pull container images used by kubeadm. ([#63833](https://github.com/kubernetes/kubernetes/pull/63833), [@chuckha](https://github.com/chuckha))
* Restores the pre-1.10 behavior of the openstack cloud provider which uses the instance name as the Kubernetes Node name. This requires instances be named with RFC-1123 compatible names. ([#63903](https://github.com/kubernetes/kubernetes/pull/63903), [@liggitt](https://github.com/liggitt))
* Added support for NFS relations on kubernetes-worker charm. ([#63817](https://github.com/kubernetes/kubernetes/pull/63817), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Stop using InfluxDB as default cluster monitoring ([#62328](https://github.com/kubernetes/kubernetes/pull/62328), [@serathius](https://github.com/serathius))
    * InfluxDB cluster monitoring is deprecated and will be removed in v1.12
* GCE: Fix to make the built-in `kubernetes` service properly point to the master's load balancer address in clusters that use multiple master VMs. ([#63696](https://github.com/kubernetes/kubernetes/pull/63696), [@grosskur](https://github.com/grosskur))
* Kubernetes cluster on GCE have crictl installed now. Users can use it to help debug their node. The documentation of crictl can be found https://github.com/kubernetes-incubator/cri-tools/blob/master/docs/crictl.md. ([#63357](https://github.com/kubernetes/kubernetes/pull/63357), [@Random-Liu](https://github.com/Random-Liu))
* The NodeRestriction admission plugin now prevents kubelets from modifying/removing taints applied to their Node API object. ([#63167](https://github.com/kubernetes/kubernetes/pull/63167), [@liggitt](https://github.com/liggitt))
* The status of dynamic Kubelet config is now reported via Node.Status.Config, rather than the KubeletConfigOk node condition. ([#63314](https://github.com/kubernetes/kubernetes/pull/63314), [@mtaufen](https://github.com/mtaufen))
* kubeadm now checks that IPv4/IPv6 forwarding is enabled ([#63872](https://github.com/kubernetes/kubernetes/pull/63872), [@kad](https://github.com/kad))
* kubeadm will now deploy CoreDNS by default instead of KubeDNS ([#63509](https://github.com/kubernetes/kubernetes/pull/63509), [@detiber](https://github.com/detiber))
* This PR will leverage subtests on the existing table tests for the scheduler units. ([#63658](https://github.com/kubernetes/kubernetes/pull/63658), [@xchapter7x](https://github.com/xchapter7x))
    * Some refactoring of error/status messages and functions to align with new approach.
* kubeadm upgrade now supports external etcd setups again ([#63495](https://github.com/kubernetes/kubernetes/pull/63495), [@detiber](https://github.com/detiber))
* fix mount unmount failure for a Windows pod ([#63272](https://github.com/kubernetes/kubernetes/pull/63272), [@andyzhangx](https://github.com/andyzhangx))
* CRI: update documents for container logpath. The container log path has been changed from containername_attempt#.log to containername/attempt#.log  ([#62015](https://github.com/kubernetes/kubernetes/pull/62015), [@feiskyer](https://github.com/feiskyer))
* Create a new `dryRun` query parameter for mutating endpoints. If the parameter is set, then the query will be rejected, as the feature is not implemented yet. This will allow forward compatibility with future clients; otherwise, future clients talking with older apiservers might end up modifying a resource even if they include the `dryRun` query parameter. ([#63557](https://github.com/kubernetes/kubernetes/pull/63557), [@apelisse](https://github.com/apelisse))
* kubelet: fix hangs in updating Node status after network interruptions/changes between the kubelet and API server ([#63492](https://github.com/kubernetes/kubernetes/pull/63492), [@liggitt](https://github.com/liggitt))
* The `PriorityClass` API is promoted to `scheduling.k8s.io/v1beta1` ([#63100](https://github.com/kubernetes/kubernetes/pull/63100), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Services can listen on same host ports on different interfaces with --nodeport-addresses specified ([#62003](https://github.com/kubernetes/kubernetes/pull/62003), [@m1093782566](https://github.com/m1093782566))
* kubeadm will no longer generate an unused etcd CA and certificates when configured to use an external etcd cluster. ([#63806](https://github.com/kubernetes/kubernetes/pull/63806), [@detiber](https://github.com/detiber))
* corrects a race condition in bootstrapping aggregated cluster roles in new HA clusters ([#63761](https://github.com/kubernetes/kubernetes/pull/63761), [@liggitt](https://github.com/liggitt))
* Adding initial Korean translation for kubectl ([#62040](https://github.com/kubernetes/kubernetes/pull/62040), [@ianychoi](https://github.com/ianychoi))
* Report node DNS info with --node-ip flag ([#63170](https://github.com/kubernetes/kubernetes/pull/63170), [@micahhausler](https://github.com/micahhausler))
* The old dynamic client has been replaced by a new one.  The previous dynamic client will exist for one release in `client-go/deprecated-dynamic`.  Switch as soon as possible. ([#63446](https://github.com/kubernetes/kubernetes/pull/63446), [@deads2k](https://github.com/deads2k))
* CustomResourceDefinitions Status subresource now supports GET and PATCH ([#63619](https://github.com/kubernetes/kubernetes/pull/63619), [@roycaihw](https://github.com/roycaihw))
* Re-enable nodeipam controller for external clouds.  ([#63049](https://github.com/kubernetes/kubernetes/pull/63049), [@andrewsykim](https://github.com/andrewsykim))
* Removes a preflight check for kubeadm that validated custom kube-apiserver, kube-controller-manager and kube-scheduler arguments. ([#63673](https://github.com/kubernetes/kubernetes/pull/63673), [@chuckha](https://github.com/chuckha))
* Adds a list-images subcommand to kubeadm that lists required images for a kubeadm install. ([#63450](https://github.com/kubernetes/kubernetes/pull/63450), [@chuckha](https://github.com/chuckha))
* Apply pod name and namespace labels to pod cgroup in cAdvisor metrics ([#63406](https://github.com/kubernetes/kubernetes/pull/63406), [@derekwaynecarr](https://github.com/derekwaynecarr))
* try to read openstack auth config from client config and fall back to read from the environment variables if not available ([#60200](https://github.com/kubernetes/kubernetes/pull/60200), [@dixudx](https://github.com/dixudx))
* GC is now bound by QPS (it wasn't before) and so if you need more QPS to avoid ratelimiting GC, you'll have to set it. ([#63657](https://github.com/kubernetes/kubernetes/pull/63657), [@shyamjvs](https://github.com/shyamjvs))
* The Kubelet's deprecated --allow-privileged flag now defaults to true. This enables users to stop setting --allow-privileged in order to transition to PodSecurityPolicy. Previously, users had to continue setting --allow-privileged, because the default was false. ([#63442](https://github.com/kubernetes/kubernetes/pull/63442), [@mtaufen](https://github.com/mtaufen))
* You must now specify Node.Spec.ConfigSource.ConfigMap.KubeletConfigKey when using dynamic Kubelet config to tell the Kubelet which key of the ConfigMap identifies its config file. ([#59847](https://github.com/kubernetes/kubernetes/pull/59847), [@mtaufen](https://github.com/mtaufen))
* Kubernetes version command line parameter in kubeadm has been updated to drop an unnecessary redirection from ci/latest.txt to ci-cross/latest.txt. Users should know exactly where the builds are stored on Google Cloud storage buckets from now on. For example for 1.9 and 1.10, users can specify ci/latest-1.9 and ci/latest-1.10 as the CI build jobs what build images correctly updates those. The CI jobs for master update the ci-cross/latest location, so if you are looking for latest master builds, then the correct parameter to use would be ci-cross/latest. ([#63504](https://github.com/kubernetes/kubernetes/pull/63504), [@dims](https://github.com/dims))
* Search standard KubeConfig file locations when using `kubeadm token` without `--kubeconfig`. ([#62850](https://github.com/kubernetes/kubernetes/pull/62850), [@neolit123](https://github.com/neolit123))
* Include the list of security groups when failing with the errors that more then one is tagged ([#58874](https://github.com/kubernetes/kubernetes/pull/58874), [@sorenmat](https://github.com/sorenmat))
* Allow "required" to be used at the CRD OpenAPI validation schema when the /status subresource is enabled. ([#63533](https://github.com/kubernetes/kubernetes/pull/63533), [@sttts](https://github.com/sttts))
* When updating /status subresource of a custom resource, only the value at the `.status` subpath for the update is considered. ([#63385](https://github.com/kubernetes/kubernetes/pull/63385), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Supported nodeSelector.matchFields (node's `metadata.node`) in scheduler. ([#62453](https://github.com/kubernetes/kubernetes/pull/62453), [@k82cn](https://github.com/k82cn))
* Do not check vmSetName when getting Azure node's IP ([#63541](https://github.com/kubernetes/kubernetes/pull/63541), [@feiskyer](https://github.com/feiskyer))
* Fix stackdriver metrics for node memory using wrong metric type ([#63535](https://github.com/kubernetes/kubernetes/pull/63535), [@serathius](https://github.com/serathius))
* [fluentd-gcp addon] Use the logging agent's node name as the metadata agent URL. ([#63353](https://github.com/kubernetes/kubernetes/pull/63353), [@bmoyles0117](https://github.com/bmoyles0117))
* `kubectl cp` supports completion. ([#60371](https://github.com/kubernetes/kubernetes/pull/60371), [@superbrothers](https://github.com/superbrothers))
* Azure VMSS: support VM names to contain the `_` character ([#63526](https://github.com/kubernetes/kubernetes/pull/63526), [@djsly](https://github.com/djsly))
* OpenStack built-in cloud provider is now deprecated. Please use the external cloud provider for OpenStack. ([#63524](https://github.com/kubernetes/kubernetes/pull/63524), [@dims](https://github.com/dims))
* the shortcuts which were moved server-side in at least 1.9 have been removed from being hardcoded in kubectl ([#63507](https://github.com/kubernetes/kubernetes/pull/63507), [@deads2k](https://github.com/deads2k))
* Fixes fake client generation for non-namespaced subresources ([#60445](https://github.com/kubernetes/kubernetes/pull/60445), [@jhorwit2](https://github.com/jhorwit2))
* `kubectl delete` with selection criteria defaults to ignoring not found errors ([#63490](https://github.com/kubernetes/kubernetes/pull/63490), [@deads2k](https://github.com/deads2k))
* Increase scheduler cache generation number monotonically in order to avoid collision and use of stale information in scheduler. ([#63264](https://github.com/kubernetes/kubernetes/pull/63264), [@bsalamat](https://github.com/bsalamat))
* Fixes issue where subpath readOnly mounts failed ([#63045](https://github.com/kubernetes/kubernetes/pull/63045), [@msau42](https://github.com/msau42))
* Update to use go1.10.2 ([#63412](https://github.com/kubernetes/kubernetes/pull/63412), [@praseodym](https://github.com/praseodym))
* `kubectl create [secret | configmap] --from-file` now works on Windows with fully-qualified paths ([#63439](https://github.com/kubernetes/kubernetes/pull/63439), [@liggitt](https://github.com/liggitt))
* kube-apiserver: the default `--endpoint-reconciler-type` is now `lease`. The `master-count` endpoint reconciler type is deprecated and will be removed in 1.13. ([#63383](https://github.com/kubernetes/kubernetes/pull/63383), [@liggitt](https://github.com/liggitt))
* owner references can be set during creation without deletion power ([#63403](https://github.com/kubernetes/kubernetes/pull/63403), [@deads2k](https://github.com/deads2k))
* Lays groundwork for OIDC distributed claims handling in the apiserver authentication token checker. ([#63213](https://github.com/kubernetes/kubernetes/pull/63213), [@filmil](https://github.com/filmil))
    * A distributed claim allows the OIDC provider to delegate a claim to a
    * separate URL.  Distributed claims are of the form as seen below, and are
    * defined in the OIDC Connect Core 1.0, section 5.6.2.
    * For details, see: 
    * http://openid.net/specs/openid-connect-core-1_0.html#AggregatedDistributedClaims
* Use /usr/bin/env in all script shebangs to increase portability. ([#62657](https://github.com/kubernetes/kubernetes/pull/62657), [@matthyx](https://github.com/matthyx))



# v1.11.0-alpha.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.11.0-alpha.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes.tar.gz) | `8f352d4f44b0c539cfb4fb72a64098c155771916cff31642b131f1eb7879da20`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-src.tar.gz) | `d2de8df039fd3bd997c992abedb0353e37691053bd927627c6438ad654055f80`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `ca70a374de0c3be4897d913f6ad22e426c6336837be6debff3cbf5f3fcf4b3ae`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `d6e0e6f286ef20a54047038b337b8a47f6cbd105b69917137c5c30c8fbee006f`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `6e73e49fa99391e1474d63a102f3cf758ef84b781bc0c0de42f1e5d1cc89132b`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `1c0c7a7aefabcda0d0407dfadd2ee7e379b395ae4ad1671535d99305e72eb2ae`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `e6310653c31114efe32db29aa06c2c1530c285cda4cccc30edf4926d0417a3a6`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `188312f25a53cf30f8375ab5727e64067ede4fba53823c3a4e2e4b768938244e`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `875f77e17c3236dde0d6e5f302c52a5193f1bf1d79d72115ae1c6de5f494b0a3`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `18502d6bd9fb483c3a858d73e2d55e32b946cbb351e09788671aca6010e39ba8`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `f0e83868dd731365b8e3f95fe33622a59d0b67d97907089c2a1c56a8eca8ebf7`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `571898fd6f612d75c9cfb248875cefbe9761155f3e8c7df48fce389606414028`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `1f36c8bb40050d4371f0d8362e8fad9d60c39c5f7f9e5569ec70d0731c9dd438`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `f503c149c1aaef2df9fea146524c4f2cb505a1946062959d1acf8bc399333437`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `660d282c18e2988744d902cb2c9f3b962b3418cbfae3644e3ea854835ca19d32`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `0682060c38c704c710cc42a887b40e26726fad9cb23368ef44236527c2a7858f`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `319337deee4e12e30da57ca484ef435f280a36792c2e2e3cd3515079b911281a`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `8d111b862d4cb3490d5ee2b97acd439e10408cba0c7f04c98a9f0470a4869e20`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `e04a30445bdabc0b895e036497fdebd102c39a53660108e45c870ae7ebc6dced`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `5fea9ce404e76e7d32c06aa2e1fbf2520531901c16a2e5f0047712d0a9422e42`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `fc6e0568f5f72790d14260ff70fe0802490a3772ed9aef2723952d706ef0fa3d`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `54f97b09c5adb4657e48fda59a9f4657386b0aa4be787c188eef1ece41bd4eb8`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `72dbc9c474b15cc70e7d806cd0f78f10af1f9a7b4a11f014167f1d47277154cf`

## Changelog since v1.11.0-alpha.1

### Other notable changes

* `kubeadm upgrade plan` now accepts a version which improves the UX nicer in air-gapped environments. ([#63201](https://github.com/kubernetes/kubernetes/pull/63201), [@chuckha](https://github.com/chuckha))
* kubectl now supports --field-selector for `delete`, `label`, and `annotate` ([#60717](https://github.com/kubernetes/kubernetes/pull/60717), [@liggitt](https://github.com/liggitt))
* kube-apiserver: `--endpoint-reconciler-type` now defaults to `lease`. The `master-count` reconciler is deprecated and will be removed in 1.13. ([#58474](https://github.com/kubernetes/kubernetes/pull/58474), [@rphillips](https://github.com/rphillips))
* OpenStack cloudprovider: Fix deletion of orphaned routes ([#62729](https://github.com/kubernetes/kubernetes/pull/62729), [@databus23](https://github.com/databus23))
* Fix a bug that headless service without ports fails to have endpoint created. ([#62497](https://github.com/kubernetes/kubernetes/pull/62497), [@MrHohn](https://github.com/MrHohn))
* Fix panic for attaching AzureDisk to vmss nodes ([#63275](https://github.com/kubernetes/kubernetes/pull/63275), [@feiskyer](https://github.com/feiskyer))
* `kubectl api-resources` now supports filtering to resources supporting specific verbs, and can output fully qualified resource names suitable for combining with commands like `kubectl get` ([#63254](https://github.com/kubernetes/kubernetes/pull/63254), [@liggitt](https://github.com/liggitt))
* fix cephfs fuse mount bug when user is not admin ([#61804](https://github.com/kubernetes/kubernetes/pull/61804), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* StorageObjectInUseProtection feature is GA. ([#62870](https://github.com/kubernetes/kubernetes/pull/62870), [@pospispa](https://github.com/pospispa))
* fixed spurious "unable to find api field" errors patching custom resources ([#63146](https://github.com/kubernetes/kubernetes/pull/63146), [@liggitt](https://github.com/liggitt))
* KUBE_API_VERSIONS is no longer respected.  It was used for testing, but runtime-config is the proper flag to set. ([#63165](https://github.com/kubernetes/kubernetes/pull/63165), [@deads2k](https://github.com/deads2k))
* Added CheckNodePIDPressurePredicate to checks if a pod can be scheduled on ([#60007](https://github.com/kubernetes/kubernetes/pull/60007), [@k82cn](https://github.com/k82cn))
    * a node reporting pid pressure condition.
* Upgrade Azure Go SDK to stable version (v14.6.0) ([#63063](https://github.com/kubernetes/kubernetes/pull/63063), [@feiskyer](https://github.com/feiskyer))
* kubeadm: prompt the user for confirmation when resetting a master node ([#59115](https://github.com/kubernetes/kubernetes/pull/59115), [@alexbrand](https://github.com/alexbrand))
* add warnings on using pod-infra-container-image for remote container runtime ([#62982](https://github.com/kubernetes/kubernetes/pull/62982), [@dixudx](https://github.com/dixudx))
* Deprecate kubectl rolling-update  ([#61285](https://github.com/kubernetes/kubernetes/pull/61285), [@soltysh](https://github.com/soltysh))
* client-go developers: the new dynamic client is easier to use and the old is deprecated, you must switch. ([#62913](https://github.com/kubernetes/kubernetes/pull/62913), [@deads2k](https://github.com/deads2k))
* Fix issue where on re-registration of device plugin, `allocatable` was not getting updated. This issue makes devices invisible to the Kubelet if device plugin restarts. Only work-around, if this fix is not there, is to restart the kubelet and then start device plugin. ([#63118](https://github.com/kubernetes/kubernetes/pull/63118), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* Remove METADATA_AGENT_VERSION configuration option. ([#63000](https://github.com/kubernetes/kubernetes/pull/63000), [@kawych](https://github.com/kawych))
* kubelets are no longer allowed to delete their own Node API object. Prior to 1.11, in rare circumstances related to cloudprovider node ID changes, kubelets would attempt to delete/recreate their Node object at startup. If a legacy kubelet encounters this situation, a cluster admin can remove the Node object: ([#62818](https://github.com/kubernetes/kubernetes/pull/62818), [@mikedanese](https://github.com/mikedanese))
        * `kubectl delete node/<nodeName>`
    * or grant self-deletion permission explicitly:
        * `kubectl create clusterrole self-deleting-nodes --verb=delete --resource=nodes`
        * `kubectl create clusterrolebinding self-deleting-nodes --clusterrole=self-deleting-nodes --group=system:nodes`
* kubeadm creates kube-proxy with a toleration to run on all nodes, no matter the taint. ([#62390](https://github.com/kubernetes/kubernetes/pull/62390), [@discordianfish](https://github.com/discordianfish))
* fix resultRun by resetting it to 0 on pod restart ([#62853](https://github.com/kubernetes/kubernetes/pull/62853), [@tony612](https://github.com/tony612))
* Mount additional paths required for a working CA root, for setups where /etc/ssl/certs doesn't contains certificates but just symlink. ([#59122](https://github.com/kubernetes/kubernetes/pull/59122), [@klausenbusk](https://github.com/klausenbusk))
* Introduce truncating audit backend that can be enabled for existing backend to limit the size of individual audit events and batches of events. ([#61711](https://github.com/kubernetes/kubernetes/pull/61711), [@crassirostris](https://github.com/crassirostris))
* kubeadm upgrade no longer races leading to unexpected upgrade behavior on pod restarts ([#62655](https://github.com/kubernetes/kubernetes/pull/62655), [@stealthybox](https://github.com/stealthybox))
    * kubeadm upgrade now successfully upgrades etcd and the controlplane to use TLS
    * kubeadm upgrade now supports external etcd setups
    * kubeadm upgrade can now rollback and restore etcd after an upgrade failure
* Add --ipvs-exclude-cidrs flag to kube-proxy.  ([#62083](https://github.com/kubernetes/kubernetes/pull/62083), [@rramkumar1](https://github.com/rramkumar1))
* Fix the liveness probe to use `/bin/bash -c` instead of `/bin/bash c`. ([#63033](https://github.com/kubernetes/kubernetes/pull/63033), [@bmoyles0117](https://github.com/bmoyles0117))
* Added `MatchFields` to `NodeSelectorTerm`; in 1.11, it only support `metadata.name`. ([#62002](https://github.com/kubernetes/kubernetes/pull/62002), [@k82cn](https://github.com/k82cn))
* Fix scheduler informers to receive events for all the pods in the cluster. ([#63003](https://github.com/kubernetes/kubernetes/pull/63003), [@bsalamat](https://github.com/bsalamat))
* removed unsafe double RLock in cpumanager ([#62464](https://github.com/kubernetes/kubernetes/pull/62464), [@choury](https://github.com/choury))
* Fix in vSphere Cloud Provider to handle upgrades from kubernetes version less than v1.9.4 to v1.9.4 and above. ([#62919](https://github.com/kubernetes/kubernetes/pull/62919), [@abrarshivani](https://github.com/abrarshivani))
* The `--bootstrap-kubeconfig` argument to Kubelet previously created the first bootstrap client credentials in the certificates directory as `kubelet-client.key` and `kubelet-client.crt`.  Subsequent certificates created by cert rotation were created in a combined PEM file that was atomically rotated as `kubelet-client-DATE.pem` in that directory, which meant clients relying on the `node.kubeconfig` generated by bootstrapping would never use a rotated cert.  The initial bootstrap certificate is now generated into the cert directory as a PEM file and symlinked to `kubelet-client-current.pem` so that the generated kubeconfig remains valid after rotation. ([#62152](https://github.com/kubernetes/kubernetes/pull/62152), [@smarterclayton](https://github.com/smarterclayton))
* stop kubelet to cloud provider integration potentially wedging kubelet sync loop ([#62543](https://github.com/kubernetes/kubernetes/pull/62543), [@ingvagabund](https://github.com/ingvagabund))
* Fix error where config map for Metadata Agent was not created by addon manager. ([#62909](https://github.com/kubernetes/kubernetes/pull/62909), [@kawych](https://github.com/kawych))
* Fixes the kubernetes.default.svc loopback service resolution to use a loopback configuration. ([#62649](https://github.com/kubernetes/kubernetes/pull/62649), [@liggitt](https://github.com/liggitt))
* Code generated for CRDs now passes `go vet`. ([#62412](https://github.com/kubernetes/kubernetes/pull/62412), [@bhcleek](https://github.com/bhcleek))
* fix permissions to allow statefulset scaling for admins, editors, and viewers ([#62336](https://github.com/kubernetes/kubernetes/pull/62336), [@deads2k](https://github.com/deads2k))
* Add support of standard LB to Azure vmss ([#62707](https://github.com/kubernetes/kubernetes/pull/62707), [@feiskyer](https://github.com/feiskyer))
* GCE: Fix for internal load balancer management resulting in backend services with outdated instance group links. ([#62885](https://github.com/kubernetes/kubernetes/pull/62885), [@nicksardo](https://github.com/nicksardo))
* The --experimental-qos-reserve kubelet flags is replaced by the alpha level --qos-reserved flag or QOSReserved field in the kubeletconfig and requires the QOSReserved feature gate to be enabled. ([#62509](https://github.com/kubernetes/kubernetes/pull/62509), [@sjenning](https://github.com/sjenning))
* Set pod status to "Running" if there is at least one container still reporting as "Running" status and others are "Completed". ([#62642](https://github.com/kubernetes/kubernetes/pull/62642), [@ceshihao](https://github.com/ceshihao))
* Split PodPriority and PodPreemption feature gate ([#62243](https://github.com/kubernetes/kubernetes/pull/62243), [@resouer](https://github.com/resouer))
* Add support to resize Portworx volumes. ([#62308](https://github.com/kubernetes/kubernetes/pull/62308), [@harsh-px](https://github.com/harsh-px))



# v1.11.0-alpha.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.11.0-alpha.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes.tar.gz) | `8e7f2b4c8f8fb948b4f7882038fd1bb3f2b967ee240d30d58347f40083ed199b`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-src.tar.gz) | `62ab39d8fd02309c74c2a978402ef809c0fe4bb576f1366d6bb0cff26d62e2ff`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `332fd9e243c9c37e31fd26d8fa1a7ccffba770a48a9b0ffe57403f028c6ad6f4`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `1703462ad564d2d52257fd59b0c8acab595fd08b41ea73fed9f6ccb4bfa074c7`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `61073b7c5266624e0f7be323481b3111ee01511b6b96cf16468044d8a68068e3`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `9a29117fa44ffc14a7004d55f4de97ad88d94076826cfc0bf9ec73c998c78f64`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `55114364aacd4eb6d080b818c859877dd5ce46b8f1e58e1469dfa9a50ade1cf9`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `276fb16cf4aef7d1444ca754ec83365ff36184e1bc30104853f791a57934ee37`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `8a9096dd1908b8f4004249daff7ae408e390dbc728cd237bc558192744f52116`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `9297755244647b90c2d41ce9e04ee31fb158a69f011c0f4f1ec2310fa57234e7`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `449562a4d6d82b5eb60151e6ff0b301f92b92f957e3a38b741a4c0d8b3c0611f`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `ab97f150723614bcbacdf27c4ced8b45166425522a44e7de693d0e987c425f07`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `4c2db4089271366933d0b63ea7fe8f0d9eb4af06fe91d6aac1b8240e2fbd62e1`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `d5abdfe5aa28b23cf4f4f6be27db031f885f87e2defef680f2d5b92098b2d783`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `bd8a8d7c45108f4b0c2af81411c00e338e410b680abe4463f6b6d88e8adcc817`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `cb5341af600c82d391fc5ca726ff96c48e741f597360a56cc2ada0a0f9e7ec95`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `91009df3801430afde03e888f1f13a83bcb9d00b7cd4194b085684cc11657549`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `22bf846c692545e7c2655e2ebe06ffc61313d7c76e4f75716be4cec457b548ed`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `351095bb0ec177ce1ba950d366516ed6154f6ce920eac39e2a26c48203a94e11`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `947e6e9e362652db435903e9b40f14750a7ab3cc60622e78257797f6ed63b1ab`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `1a0a1d0b96c3e01bc0737245eed76ed3db970c8d80c42450072193f23a0e186b`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `6891b2e8f1f93b4f590981dccc6fd976a50a0aa5c425938fc5ca3a9c0742d16a`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `70daea86c14fcafbd46f3d1bb252db50148fb9aab3371dffc4a039791caebac5`

## Changelog since v1.10.0

### Action Required

* NONE ([#62643](https://github.com/kubernetes/kubernetes/pull/62643), [@xiangpengzhao](https://github.com/xiangpengzhao))
* ACTION REQUIRED: Alpha annotation for PersistentVolume node affinity has been removed.  Update your PersistentVolumes to use the beta PersistentVolume.nodeAffinity field before upgrading to this release ([#61816](https://github.com/kubernetes/kubernetes/pull/61816), [@wackxu](https://github.com/wackxu))
* ACTION REQUIRED: In-place node upgrades to this release from versions 1.7.14, 1.8.9, and 1.9.4 are not supported if using subpath volumes with PVCs.  Such pods should be drained from the node first. ([#61373](https://github.com/kubernetes/kubernetes/pull/61373), [@msau42](https://github.com/msau42))

### Other notable changes

* Make volume usage metrics available for Cinder ([#62668](https://github.com/kubernetes/kubernetes/pull/62668), [@zetaab](https://github.com/zetaab))
* kubectl stops rendering List as suffix kind name for CRD resources ([#62512](https://github.com/kubernetes/kubernetes/pull/62512), [@dixudx](https://github.com/dixudx))
* Removes --include-extended-apis which was deprecated back in https://github.com/kubernetes/kubernetes/pull/32894 ([#62803](https://github.com/kubernetes/kubernetes/pull/62803), [@deads2k](https://github.com/deads2k))
* Add write-config-to to scheduler ([#62515](https://github.com/kubernetes/kubernetes/pull/62515), [@resouer](https://github.com/resouer))
* Kubelets will no longer set `externalID` in their node spec. ([#61877](https://github.com/kubernetes/kubernetes/pull/61877), [@mikedanese](https://github.com/mikedanese))
* kubeadm preflight: check CRI socket path if defined, otherwise check for Docker ([#62481](https://github.com/kubernetes/kubernetes/pull/62481), [@taharah](https://github.com/taharah))
* fix network setup in hack/local-up-cluster.sh (https://github.com/kubernetes/kubernetes/pull/60431) ([#60633](https://github.com/kubernetes/kubernetes/pull/60633), [@pohly](https://github.com/pohly))
    * better error diagnostics in hack/local-up-cluster.sh output
* Add prometheus cluster monitoring addon to kube-up ([#62195](https://github.com/kubernetes/kubernetes/pull/62195), [@serathius](https://github.com/serathius))
* Fix inter-pod anti-affinity check to consider a pod a match when all the anti-affinity terms match. ([#62715](https://github.com/kubernetes/kubernetes/pull/62715), [@bsalamat](https://github.com/bsalamat))
* GCE: Bump GLBC version to 1.1.1 - fixing an issue of handling multiple certs with identical certificates ([#62751](https://github.com/kubernetes/kubernetes/pull/62751), [@nicksardo](https://github.com/nicksardo))
* fixes configuration error when upgrading kubeadm from 1.9 to 1.10+ ([#62568](https://github.com/kubernetes/kubernetes/pull/62568), [@liztio](https://github.com/liztio))
    * enforces  kubeadm  upgrading kubernetes from the same major and minor versions as the kubeadm binary.
* Allow user to scale l7 default backend deployment ([#62685](https://github.com/kubernetes/kubernetes/pull/62685), [@freehan](https://github.com/freehan))
* Pod affinity `nodeSelectorTerm.matchExpressions` may now be empty, and works as previously documented: nil or empty `matchExpressions` matches no objects in scheduler. ([#62448](https://github.com/kubernetes/kubernetes/pull/62448), [@k82cn](https://github.com/k82cn))
* Add [@andrewsykim](https://github.com/andrewsykim) as an approver for CCM related code. ([#62749](https://github.com/kubernetes/kubernetes/pull/62749), [@andrewsykim](https://github.com/andrewsykim))
* Fix an issue in inter-pod affinity predicate that cause affinity to self being processed incorrectly ([#62591](https://github.com/kubernetes/kubernetes/pull/62591), [@bsalamat](https://github.com/bsalamat))
* fix WaitForAttach failure issue for azure disk ([#62612](https://github.com/kubernetes/kubernetes/pull/62612), [@andyzhangx](https://github.com/andyzhangx))
* Update kube-dns to Version 1.14.10. Major changes: ([#62676](https://github.com/kubernetes/kubernetes/pull/62676), [@MrHohn](https://github.com/MrHohn))
    * - Fix a bug in DNS resolution for externalName services
    * and PTR records that need to query from upstream nameserver.
* Update version of Istio addon from 0.5.1 to 0.6.0. ([#61911](https://github.com/kubernetes/kubernetes/pull/61911), [@ostromart](https://github.com/ostromart))
    * See https://istio.io/about/notes/0.6.html for full Isto release notes.
* Phase `kubeadm alpha phase kubelet` is added to support dynamic kubelet configuration in kubeadm. ([#57224](https://github.com/kubernetes/kubernetes/pull/57224), [@xiangpengzhao](https://github.com/xiangpengzhao))
* `kubeadm alpha phase kubeconfig user` supports groups (organizations) to be specified in client cert. ([#62627](https://github.com/kubernetes/kubernetes/pull/62627), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Fix user visible files creation for windows ([#62375](https://github.com/kubernetes/kubernetes/pull/62375), [@feiskyer](https://github.com/feiskyer))
* remove deprecated initresource admission plugin ([#58784](https://github.com/kubernetes/kubernetes/pull/58784), [@wackxu](https://github.com/wackxu))
* Fix machineID getting for vmss nodes when using instance metadata ([#62611](https://github.com/kubernetes/kubernetes/pull/62611), [@feiskyer](https://github.com/feiskyer))
* Fixes issue where PersistentVolume.NodeAffinity.NodeSelectorTerms were ANDed instead of ORed. ([#62556](https://github.com/kubernetes/kubernetes/pull/62556), [@msau42](https://github.com/msau42))
* Fix potential infinite loop that can occur when NFS PVs are recycled. ([#62572](https://github.com/kubernetes/kubernetes/pull/62572), [@joelsmith](https://github.com/joelsmith))
* Fix Forward chain default reject policy for IPVS proxier ([#62007](https://github.com/kubernetes/kubernetes/pull/62007), [@m1093782566](https://github.com/m1093782566))
* The kubeadm config option `API.ControlPlaneEndpoint` has been extended to take an optional port which may differ from the apiserver's bind port. ([#62314](https://github.com/kubernetes/kubernetes/pull/62314), [@rjosephwright](https://github.com/rjosephwright))
* cluster/kube-up.sh now provisions a Kubelet config file for GCE via the metadata server. This file is installed by the corresponding GCE init scripts. ([#62183](https://github.com/kubernetes/kubernetes/pull/62183), [@mtaufen](https://github.com/mtaufen))
* Remove alpha functionality that allowed the controller manager to approve kubelet server certificates. ([#62471](https://github.com/kubernetes/kubernetes/pull/62471), [@mikedanese](https://github.com/mikedanese))
* gitRepo volumes in pods no longer require git 1.8.5 or newer, older git versions are supported too now. ([#62394](https://github.com/kubernetes/kubernetes/pull/62394), [@jsafrane](https://github.com/jsafrane))
* Default mount propagation has changed from "HostToContainer" ("rslave" in Linux terminology) to "None" ("private") to match the behavior in 1.9 and earlier releases. "HostToContainer" as a default caused regressions in some pods. ([#62462](https://github.com/kubernetes/kubernetes/pull/62462), [@jsafrane](https://github.com/jsafrane))
* improve performance of affinity/anti-affinity predicate of default scheduler significantly. ([#62211](https://github.com/kubernetes/kubernetes/pull/62211), [@bsalamat](https://github.com/bsalamat))
* fix nsenter GetFileType issue in containerized kubelet ([#62467](https://github.com/kubernetes/kubernetes/pull/62467), [@andyzhangx](https://github.com/andyzhangx))
* Ensure expected load balancer is selected for Azure ([#62450](https://github.com/kubernetes/kubernetes/pull/62450), [@feiskyer](https://github.com/feiskyer))
* Resolves forbidden error when the `daemon-set-controller` cluster role access `controllerrevisions` resources. ([#62146](https://github.com/kubernetes/kubernetes/pull/62146), [@frodenas](https://github.com/frodenas))
* Adds --cluster-name to kubeadm init for specifying the cluster name in kubeconfig. ([#60852](https://github.com/kubernetes/kubernetes/pull/60852), [@karan](https://github.com/karan))
* Upgrade the default etcd server version to 3.2.18 ([#61198](https://github.com/kubernetes/kubernetes/pull/61198), [@jpbetz](https://github.com/jpbetz))
* [fluentd-gcp addon] Increase CPU limit for fluentd to 1 core to achieve 100kb/s throughput. ([#62430](https://github.com/kubernetes/kubernetes/pull/62430), [@bmoyles0117](https://github.com/bmoyles0117))
* GCE: Bump GLBC version to 1.1.0 - supporting multiple certificates and HTTP2 ([#62427](https://github.com/kubernetes/kubernetes/pull/62427), [@nicksardo](https://github.com/nicksardo))
* Fixed #731 kubeadm upgrade ignores HighAvailability feature gate ([#62455](https://github.com/kubernetes/kubernetes/pull/62455), [@fabriziopandini](https://github.com/fabriziopandini))
* Cluster Autoscaler 1.2.1 (release notes: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.2.1) ([#62457](https://github.com/kubernetes/kubernetes/pull/62457), [@mwielgus](https://github.com/mwielgus))
* Add generators for `apps/v1` deployments. ([#61288](https://github.com/kubernetes/kubernetes/pull/61288), [@ayushpateria](https://github.com/ayushpateria))
* kubeadm: surface external etcd preflight validation errors ([#60585](https://github.com/kubernetes/kubernetes/pull/60585), [@alexbrand](https://github.com/alexbrand))
* kube-apiserver: oidc authentication now supports requiring specific claims with `--oidc-required-claim=<claim>=<value>` ([#62136](https://github.com/kubernetes/kubernetes/pull/62136), [@rithujohn191](https://github.com/rithujohn191))
* Implements verbosity logging feature for kubeadm commands ([#57661](https://github.com/kubernetes/kubernetes/pull/57661), [@vbmade2000](https://github.com/vbmade2000))
* Allow additionalProperties in CRD OpenAPI v3 specification for validation, mutually exclusive to properties. ([#62333](https://github.com/kubernetes/kubernetes/pull/62333), [@sttts](https://github.com/sttts))
* cinder volume plugin :  ([#61082](https://github.com/kubernetes/kubernetes/pull/61082), [@wenlxie](https://github.com/wenlxie))
    * When the cinder volume status is `error`,  controller will not do `attach ` and `detach ` operation
* fix incompatible file type checking on Windows ([#62154](https://github.com/kubernetes/kubernetes/pull/62154), [@dixudx](https://github.com/dixudx))
* fix local volume absolute path issue on Windows ([#62018](https://github.com/kubernetes/kubernetes/pull/62018), [@andyzhangx](https://github.com/andyzhangx))
* Remove `ObjectMeta ` `ListOptions` `DeleteOptions` from core api group.  Please use that in meta/v1 ([#61809](https://github.com/kubernetes/kubernetes/pull/61809), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* fix the issue that default azure disk fsypte(ext4) does not work on Windows ([#62250](https://github.com/kubernetes/kubernetes/pull/62250), [@andyzhangx](https://github.com/andyzhangx))
* RBAC information is included in audit logs via audit.Event annotations: ([#58807](https://github.com/kubernetes/kubernetes/pull/58807), [@CaoShuFeng](https://github.com/CaoShuFeng))
    * authorization.k8s.io/decision = {allow, forbid}
    * authorization.k8s.io/reason = human-readable reason for the decision
* Update kube-dns to Version 1.14.9 in kubeadm. ([#61918](https://github.com/kubernetes/kubernetes/pull/61918), [@MrHohn](https://github.com/MrHohn))
* Add support to ingest log entries to Stackdriver against new "k8s_container" and "k8s_node" resources. ([#62076](https://github.com/kubernetes/kubernetes/pull/62076), [@qingling128](https://github.com/qingling128))
* remove deprecated --mode flag in check-network-mode ([#60102](https://github.com/kubernetes/kubernetes/pull/60102), [@satyasm](https://github.com/satyasm))
* Schedule even if extender is not available when using extender  ([#61445](https://github.com/kubernetes/kubernetes/pull/61445), [@resouer](https://github.com/resouer))
* Fixed column alignment when kubectl get is used with custom columns from OpenAPI schema ([#56629](https://github.com/kubernetes/kubernetes/pull/56629), [@luksa](https://github.com/luksa))
* Fixed bug in rbd-nbd utility when nbd is used. ([#62168](https://github.com/kubernetes/kubernetes/pull/62168), [@piontec](https://github.com/piontec))
* Extend the Stackdriver Metadata Agent by adding a new Deployment for ingesting unscheduled pods, and services.   ([#62043](https://github.com/kubernetes/kubernetes/pull/62043), [@supriyagarg](https://github.com/supriyagarg))
* Disabled CheckNodeMemoryPressure and CheckNodeDiskPressure predicates if TaintNodesByCondition enabled ([#60398](https://github.com/kubernetes/kubernetes/pull/60398), [@k82cn](https://github.com/k82cn))
* kubeadm config can now override the Node CIDR Mask Size passed to kube-controller-manager. ([#61705](https://github.com/kubernetes/kubernetes/pull/61705), [@jstangroome](https://github.com/jstangroome))
* Add warnings that authors of aggregated API servers must not rely on authorization being done by the kube-apiserver. ([#61349](https://github.com/kubernetes/kubernetes/pull/61349), [@sttts](https://github.com/sttts))
* Support custom test configuration for IPAM performance integration tests ([#61959](https://github.com/kubernetes/kubernetes/pull/61959), [@satyasm](https://github.com/satyasm))
* GCE: Updates GLBC version to 1.0.1 which includes a fix which prevents multi-cluster ingress objects from creating full load balancers. ([#62075](https://github.com/kubernetes/kubernetes/pull/62075), [@nicksardo](https://github.com/nicksardo))
* OIDC authentication now allows tokens without an "email_verified" claim when using the "email" claim. If an "email_verified" claim is present when using the "email" claim, it must be `true`. ([#61508](https://github.com/kubernetes/kubernetes/pull/61508), [@rithujohn191](https://github.com/rithujohn191))
* fix local volume issue on Windows ([#62012](https://github.com/kubernetes/kubernetes/pull/62012), [@andyzhangx](https://github.com/andyzhangx))
* kubeadm: Introduce join timeout that can be controlled via the discoveryTimeout config option (set to 5 minutes by default). ([#60983](https://github.com/kubernetes/kubernetes/pull/60983), [@rosti](https://github.com/rosti))
* Add e2e test for CRD Watch ([#61025](https://github.com/kubernetes/kubernetes/pull/61025), [@ayushpateria](https://github.com/ayushpateria))
* Fix panic create/update CRD when mutating/validating webhook configured. ([#61404](https://github.com/kubernetes/kubernetes/pull/61404), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Fix a bug that fluentd doesn't inject container logs for CRI container runtimes (containerd, cri-o etc.) into elasticsearch on GCE. ([#61818](https://github.com/kubernetes/kubernetes/pull/61818), [@Random-Liu](https://github.com/Random-Liu))
* Support for "alpha.kubernetes.io/nvidia-gpu" resource which was deprecated in 1.10 is removed. Please use the resource exposed by DevicePlugins instead ("nvidia.com/gpu"). ([#61498](https://github.com/kubernetes/kubernetes/pull/61498), [@mindprince](https://github.com/mindprince))
* Pods requesting resources prefixed with `*kubernetes.io` will remain unscheduled if there are no nodes exposing that resource. ([#61860](https://github.com/kubernetes/kubernetes/pull/61860), [@mindprince](https://github.com/mindprince))
* flexvolume: trigger plugin init only for the relevant plugin while probe ([#58519](https://github.com/kubernetes/kubernetes/pull/58519), [@linyouchong](https://github.com/linyouchong))
* Update to use go1.10.1 ([#60597](https://github.com/kubernetes/kubernetes/pull/60597), [@cblecker](https://github.com/cblecker))
* Rev the Azure SDK for networking to 2017-06-01 ([#61955](https://github.com/kubernetes/kubernetes/pull/61955), [@brendandburns](https://github.com/brendandburns))
* Return error if get NodeStageSecret and NodePublishSecret failed in CSI volume plugin ([#61096](https://github.com/kubernetes/kubernetes/pull/61096), [@mlmhl](https://github.com/mlmhl))
* kubectl: improves compatibility with older servers when creating/updating API objects ([#61949](https://github.com/kubernetes/kubernetes/pull/61949), [@liggitt](https://github.com/liggitt))
* kubernetes-master charm now supports metrics server for horizontal pod autoscaler. ([#60174](https://github.com/kubernetes/kubernetes/pull/60174), [@hyperbolic2346](https://github.com/hyperbolic2346))
* fix scheduling policy on ConfigMap breaks without the --policy-configmap-namespace flag set ([#61388](https://github.com/kubernetes/kubernetes/pull/61388), [@zjj2wry](https://github.com/zjj2wry))
* kubectl: restore the ability to show resource kinds when displaying multiple objects ([#61985](https://github.com/kubernetes/kubernetes/pull/61985), [@liggitt](https://github.com/liggitt))
* `kubectl certificate approve|deny` will not modify an already approved or denied CSR unless the `--force` flag is provided. ([#61971](https://github.com/kubernetes/kubernetes/pull/61971), [@smarterclayton](https://github.com/smarterclayton))
* Kubelet now exposes a new endpoint /metrics/probes which exposes a Prometheus metric containing the liveness and/or readiness probe results for a container. ([#61369](https://github.com/kubernetes/kubernetes/pull/61369), [@rramkumar1](https://github.com/rramkumar1))
* Balanced resource allocation priority in scheduler to include volume count on node  ([#60525](https://github.com/kubernetes/kubernetes/pull/60525), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* new dhcp-domain parameter to be used for figuring out the hostname of a node ([#61890](https://github.com/kubernetes/kubernetes/pull/61890), [@dims](https://github.com/dims))
* Fixed a panic in `kubectl run --attach ...` when the api server failed to create the runtime object (due to name conflict, PSP restriction, etc.) ([#61713](https://github.com/kubernetes/kubernetes/pull/61713), [@mountkin](https://github.com/mountkin))
* Ensure reasons end up as comments in `kubectl edit`. ([#60990](https://github.com/kubernetes/kubernetes/pull/60990), [@bmcstdio](https://github.com/bmcstdio))
* kube-scheduler has been fixed to use `--leader-elect` option back to true (as it was in previous versions) ([#59732](https://github.com/kubernetes/kubernetes/pull/59732), [@dims](https://github.com/dims))
* Azure cloud provider now supports standard SKU load balancer and public IP. To use it, set cloud provider config with ([#61884](https://github.com/kubernetes/kubernetes/pull/61884), [@feiskyer](https://github.com/feiskyer))
    * {
    *   "loadBalancerSku": "standard",
    *   "excludeMasterFromStandardLB": true,
    * }
    * If excludeMasterFromStandardLB is not set, it will be default to true, which means master nodes are excluded to the backend of standard LB.
    * Also note standard load balancer doesn't work with annotation `service.beta.kubernetes.io/azure-load-balancer-mode`. This is because all nodes (except master) are added as the LB backends.
* The node authorizer now automatically sets up rules for Node.Spec.ConfigSource when the DynamicKubeletConfig feature gate is enabled. ([#60100](https://github.com/kubernetes/kubernetes/pull/60100), [@mtaufen](https://github.com/mtaufen))
* Update kube-dns to Version 1.14.9. Major changes: ([#61908](https://github.com/kubernetes/kubernetes/pull/61908), [@MrHohn](https://github.com/MrHohn))
    * - Fix for kube-dns returns NXDOMAIN when not yet synced with apiserver.
    * - Don't generate empty record for externalName service.
    * - Add validation for upstreamNameserver port.
    * - Update go version to 1.9.3.
* CRI: define the mount behavior when host path does not exist: runtime should report error if the host path doesn't exist ([#61460](https://github.com/kubernetes/kubernetes/pull/61460), [@feiskyer](https://github.com/feiskyer))
* Fixed ingress issue with CDK and pre-1.9 versions of kubernetes. ([#61859](https://github.com/kubernetes/kubernetes/pull/61859), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Removed rknetes code, which was deprecated in 1.10. ([#61432](https://github.com/kubernetes/kubernetes/pull/61432), [@filbranden](https://github.com/filbranden))
* Disable ipamperf integration tests as part of every PR verification. ([#61863](https://github.com/kubernetes/kubernetes/pull/61863), [@satyasm](https://github.com/satyasm))
* Enable server-side print in kubectl by default, with the ability to turn it off with --server-print=false ([#61477](https://github.com/kubernetes/kubernetes/pull/61477), [@soltysh](https://github.com/soltysh))
* Add ipset and udevadm to the hyperkube base image. ([#61357](https://github.com/kubernetes/kubernetes/pull/61357), [@rphillips](https://github.com/rphillips))
* In a GCE cluster, the default HAIRPIN_MODE is now "hairpin-veth". ([#60166](https://github.com/kubernetes/kubernetes/pull/60166), [@rramkumar1](https://github.com/rramkumar1))
* Deployment will stop adding pod-template-hash labels/selector to ReplicaSets and Pods it adopts. Resources created by Deployments are not affected (will still have pod-template-hash labels/selector).  ([#61615](https://github.com/kubernetes/kubernetes/pull/61615), [@janetkuo](https://github.com/janetkuo))
* kubectl: fixes issue with `-o yaml` and `-o json` omitting kind and apiVersion when used with `--dry-run` ([#61808](https://github.com/kubernetes/kubernetes/pull/61808), [@liggitt](https://github.com/liggitt))
* Updated admission controller settings for Juju deployed Kubernetes clusters ([#61427](https://github.com/kubernetes/kubernetes/pull/61427), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Performance test framework and basic tests for the IPAM controller, to simulate behavior ([#61143](https://github.com/kubernetes/kubernetes/pull/61143), [@satyasm](https://github.com/satyasm))
    * of the four supported modes under lightly loaded and loaded conditions, where load is 
    * defined as the number of operations to perform as against the configured kubernetes
    * API server QPS.
* kubernetes-master charm now properly clears the client-ca-file setting on the apiserver snap ([#61479](https://github.com/kubernetes/kubernetes/pull/61479), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Fix racy panics when using fake watches with ObjectTracker ([#61195](https://github.com/kubernetes/kubernetes/pull/61195), [@grantr](https://github.com/grantr))
* [fluentd-gcp addon] Update event-exporter image to have the latest base image. ([#61727](https://github.com/kubernetes/kubernetes/pull/61727), [@crassirostris](https://github.com/crassirostris))
* Use inline func to ensure unlock is executed ([#61644](https://github.com/kubernetes/kubernetes/pull/61644), [@resouer](https://github.com/resouer))
* `kubectl apply view/edit-last-applied support completion. ([#60499](https://github.com/kubernetes/kubernetes/pull/60499), [@superbrothers](https://github.com/superbrothers))
* Automatically add system critical priority classes at cluster boostrapping. ([#60519](https://github.com/kubernetes/kubernetes/pull/60519), [@bsalamat](https://github.com/bsalamat))
* Ensure cloudprovider.InstanceNotFound is reported when the VM is not found on Azure ([#61531](https://github.com/kubernetes/kubernetes/pull/61531), [@feiskyer](https://github.com/feiskyer))
* Azure cloud provider now supports specifying allowed service tags by annotation `service.beta.kubernetes.io/azure-allowed-service-tags` ([#61467](https://github.com/kubernetes/kubernetes/pull/61467), [@feiskyer](https://github.com/feiskyer))
* Add all kinds of resource objects' statuses in HPA description. ([#59609](https://github.com/kubernetes/kubernetes/pull/59609), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* Bound cloud allocator to 10 retries with 100 ms delay between retries. ([#61375](https://github.com/kubernetes/kubernetes/pull/61375), [@satyasm](https://github.com/satyasm))
* Removed always pull policy from the template for ingress on CDK. ([#61598](https://github.com/kubernetes/kubernetes/pull/61598), [@hyperbolic2346](https://github.com/hyperbolic2346))
* escape literal percent sign when formatting ([#61523](https://github.com/kubernetes/kubernetes/pull/61523), [@dixudx](https://github.com/dixudx))
* Cluster Autoscaler 1.2.0 - release notes available here: https://github.com/kubernetes/autoscaler/releases ([#61561](https://github.com/kubernetes/kubernetes/pull/61561), [@mwielgus](https://github.com/mwielgus))
* Fix mounting of UNIX sockets(and other special files) in subpaths ([#61480](https://github.com/kubernetes/kubernetes/pull/61480), [@gnufied](https://github.com/gnufied))
* `kubectl patch` now supports `--dry-run`. ([#60675](https://github.com/kubernetes/kubernetes/pull/60675), [@timoreimann](https://github.com/timoreimann))
* fix sorting taints in case the sorting keys are equal ([#61255](https://github.com/kubernetes/kubernetes/pull/61255), [@dixudx](https://github.com/dixudx))
* NetworkPolicies can now target specific pods in other namespaces by including both a namespaceSelector and a podSelector in the same peer element. ([#60452](https://github.com/kubernetes/kubernetes/pull/60452), [@danwinship](https://github.com/danwinship))
* include node internal ip as additional information for kubectl ([#57623](https://github.com/kubernetes/kubernetes/pull/57623), [@dixudx](https://github.com/dixudx))
* Add apiserver configuration option to choose audit output version. ([#60056](https://github.com/kubernetes/kubernetes/pull/60056), [@crassirostris](https://github.com/crassirostris))
* `make test-cmd` now works on OSX. ([#61393](https://github.com/kubernetes/kubernetes/pull/61393), [@totherme](https://github.com/totherme))
* Remove kube-apiserver `--storage-version` flag, use `--storage-versions` instead. ([#61453](https://github.com/kubernetes/kubernetes/pull/61453), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Bump Heapster to v1.5.2 ([#61396](https://github.com/kubernetes/kubernetes/pull/61396), [@kawych](https://github.com/kawych))
* Conformance: ReplicaSet must be supported in the `apps/v1` version. ([#61367](https://github.com/kubernetes/kubernetes/pull/61367), [@enisoc](https://github.com/enisoc))
* You can now use the `base64decode` function in kubectl go templates to decode base64-encoded data, for example `kubectl get secret SECRET -o go-template='{{ .data.KEY | base64decode }}'`. ([#60755](https://github.com/kubernetes/kubernetes/pull/60755), [@glb](https://github.com/glb))
* Remove 'system' prefix from Metadata Agent rbac configuration ([#61394](https://github.com/kubernetes/kubernetes/pull/61394), [@kawych](https://github.com/kawych))
* Remove `--tls-ca-file` flag. ([#61386](https://github.com/kubernetes/kubernetes/pull/61386), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* fix sorting tolerations in case the keys are equal ([#61252](https://github.com/kubernetes/kubernetes/pull/61252), [@dixudx](https://github.com/dixudx))
* respect fstype in Windows for azure disk ([#61267](https://github.com/kubernetes/kubernetes/pull/61267), [@andyzhangx](https://github.com/andyzhangx))
* `--show-all` (which only affected pods and only for human readable/non-API printers) is inert in v1.11, and will be removed in a future release. ([#60793](https://github.com/kubernetes/kubernetes/pull/60793), [@charrywanganthony](https://github.com/charrywanganthony))
* Remove never used NewCronJobControllerFromClient method ([#59471](https://github.com/kubernetes/kubernetes/pull/59471), [@dmathieu](https://github.com/dmathieu))
* Support new NODE_OS_DISTRIBUTION 'custom' on GCE ([#61235](https://github.com/kubernetes/kubernetes/pull/61235), [@yguo0905](https://github.com/yguo0905))
* Fixed [#61123](https://github.com/kubernetes/kubernetes/pull/61123) by triggering syncer.Update on all cases including when a syncer is created ([#61124](https://github.com/kubernetes/kubernetes/pull/61124), [@satyasm](https://github.com/satyasm))
    * on a new add event.
* Unready pods will no longer impact the number of desired replicas when using horizontal auto-scaling with external metrics or object metrics. ([#60886](https://github.com/kubernetes/kubernetes/pull/60886), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* include file name in the error when visiting files ([#60919](https://github.com/kubernetes/kubernetes/pull/60919), [@dixudx](https://github.com/dixudx))
* Implement preemption for extender with a verb and new interface ([#58717](https://github.com/kubernetes/kubernetes/pull/58717), [@resouer](https://github.com/resouer))
* `kube-cloud-controller-manager` flag `--service-account-private-key-file` is removed in v1.11 ([#60875](https://github.com/kubernetes/kubernetes/pull/60875), [@charrywanganthony](https://github.com/charrywanganthony))
* kubeadm: Add the writable boolean option to kubeadm config. The option works on a per-volume basis for *ExtraVolumes config keys. ([#60428](https://github.com/kubernetes/kubernetes/pull/60428), [@rosti](https://github.com/rosti))
* DaemonSet scheduling associated with the alpha ScheduleDaemonSetPods feature flag has been removed from the 1.10 release. See https://github.com/kubernetes/features/issues/548 for feature status. ([#61411](https://github.com/kubernetes/kubernetes/pull/61411), [@liggitt](https://github.com/liggitt))
* Bugfix for erroneous upgrade needed messaging in kubernetes worker charm. ([#60873](https://github.com/kubernetes/kubernetes/pull/60873), [@wwwtyro](https://github.com/wwwtyro))
* Fix data race in node lifecycle controller ([#60831](https://github.com/kubernetes/kubernetes/pull/60831), [@resouer](https://github.com/resouer))
* Nodes are not deleted from kubernetes anymore if node is shutdown in Openstack. ([#59931](https://github.com/kubernetes/kubernetes/pull/59931), [@zetaab](https://github.com/zetaab))
* "beginPort+offset" format support for port range which affects kube-proxy only ([#58731](https://github.com/kubernetes/kubernetes/pull/58731), [@yue9944882](https://github.com/yue9944882))
* Added e2e test for watch ([#60331](https://github.com/kubernetes/kubernetes/pull/60331), [@jennybuckley](https://github.com/jennybuckley))
* kubelet's --cni-bin-dir option now accepts multiple comma-separated CNI binary directory paths, which are search for CNI plugins in the given order. ([#58714](https://github.com/kubernetes/kubernetes/pull/58714), [@dcbw](https://github.com/dcbw))

bernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `35981580c00bff0e3d92238f961e37dd505c08bcd4cafb11e274daa1eb8ced5f`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `ceedb0a322167bae33042407da5369e0b7889fbaa3568281500c921afcdbe310`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `b84ab4c486bc8f00841fccce2aafe4dcef25606c8f3184bce2551ab6486c8f71`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `b79a41145c28358a64d7a689cd282cf8361fe87c410fbae1cdc8db76cfcf6e5b`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `afc00f67b9f6d4fc149d4426fc8bbf6083077e11a1d2330d70be7e765b6cb923`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `f6128bbccddfe8ce39762bacb5c13c6c68d76a4bf8d35e773560332eb05a2c86`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `b1dde1ed2582cd511236fec69ebd6ca30281b30cc37e0841c493f06924a466cf`

## Changelog since v1.10.0-beta.1

### Action Required

* ACTION REQUIRED: LocalStorageCapacityIsolation feature is beta and enabled by default.  ([#60159](https://github.com/kubernetes/kubernetes/pull/60159), [@jingxu97](https://github.com/jingxu97))

### Other notable changes

* Upgrade the default etcd server version to 3.2.16 ([#59836](https://github.com/kubernetes/kubernetes/pull/59836), [@jpbetz](https://github.com/jpbetz))
* Cluster Autoscaler 1.1.2  ([#60842](https://github.com/kubernetes/kubernetes/pull/60842), [@mwielgus](https://github.com/mwielgus))
* ValidatingWebhooks and MutatingWebhooks will not be called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects in the admissionregistration.k8s.io group ([#59840](https://github.com/kubernetes/kubernetes/pull/59840), [@jennybuckley](https://github.com/jennybuckley))
* Kubeadm: CoreDNS supports migration of the kube-dns configuration to CoreDNS configuration when upgrading the service discovery from kube-dns to CoreDNS as part of Beta.  ([#58828](https://github.com/kubernetes/kubernetes/pull/58828), [@rajansandeep](https://github.com/rajansandeep))
* Fix broken useManagedIdentityExtension for azure cloud provider ([#60775](https://github.com/kubernetes/kubernetes/pull/60775), [@feiskyer](https://github.com/feiskyer))
* kubelet now notifies systemd that it has finished starting, if systemd is available and running. ([#60654](https://github.com/kubernetes/kubernetes/pull/60654), [@dcbw](https://github.com/dcbw))
* Do not count failed pods as unready in HPA controller ([#60648](https://github.com/kubernetes/kubernetes/pull/60648), [@bskiba](https://github.com/bskiba))
* fixed foreground deletion of podtemplates ([#60683](https://github.com/kubernetes/kubernetes/pull/60683), [@nilebox](https://github.com/nilebox))
* Conformance tests are added for the DaemonSet kinds in the apps/v1 group version. Deprecated versions of DaemonSet will not be tested for conformance, and conformance is only applicable to release 1.10 and later. ([#60456](https://github.com/kubernetes/kubernetes/pull/60456), [@kow3ns](https://github.com/kow3ns))
* Log audit backend can now be configured to perform batching before writing events to disk. ([#60237](https://github.com/kubernetes/kubernetes/pull/60237), [@crassirostris](https://github.com/crassirostris))
* Fixes potential deadlock when deleting CustomResourceDefinition for custom resources with finalizers ([#60542](https://github.com/kubernetes/kubernetes/pull/60542), [@liggitt](https://github.com/liggitt))
* fix azure file plugin failure issue on Windows after node restart ([#60625](https://github.com/kubernetes/kubernetes/pull/60625), [@andyzhangx](https://github.com/andyzhangx))
* Set Azure vmType to standard if it is not set in azure cloud config. ([#60623](https://github.com/kubernetes/kubernetes/pull/60623), [@feiskyer](https://github.com/feiskyer))
* On cluster provision or upgrade, kubeadm generates an etcd specific CA for all etcd related certificates. ([#60385](https://github.com/kubernetes/kubernetes/pull/60385), [@stealthybox](https://github.com/stealthybox))
* kube-scheduler: restores default leader election behavior. leader-elect command line parameter should "true" ([#60524](https://github.com/kubernetes/kubernetes/pull/60524), [@dims](https://github.com/dims))
* client-go: alpha support for exec-based credential providers ([#59495](https://github.com/kubernetes/kubernetes/pull/59495), [@ericchiang](https://github.com/ericchiang))



# v1.10.0-beta.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-beta.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes.tar.gz) | `428139d9877f5f94acc806cc4053b0a5f8eac2acc219f06efd0817807473dbc5`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-src.tar.gz) | `5bfdecdbb43d946ea965f22ec6b8a0fc7195197a523aefebc2b7b926d4252edf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `8cc086e901fe699df5e0711438195e675e099848a72ba272b290d22abc107a93`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `b2782b8f6dbfe3fa962b08606cbf3366b071b78c47794d2ef67f9d484b4af4e4`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-386.tar.gz) | `a4001ad2387ccb4557b15c560b0ea8ea4d7c7ed494375346e3f83c10eb9426ac`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `b95d354e80d9f00a883e5eeb8c2e0ceaacc0f3cc8c904cb2eca1e1b6d91462b2`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `647d234c59bc1d6f8eea88624d85b09bbe1272d9e27e1f7963e03cc025530ed0`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `187da9ad060ac7d426811772f6c3d891a354945af6a7d8832ac7097e19d4b46d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `6112396b8f0e7b1401b374aa2ae6195849da7718572036b6f060a722a89dc319`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `09789cf33d8eed610ad2eef7d3ae25a4b4a63ee5525e452f9094097a172a1ce9`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-windows-386.tar.gz) | `1e71bc9979c8915587cdea980dad36b0cafd502f972c051c2aa63c3bbfeceb14`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `3c2978479c6f65f1cb5043ba182a0571480090298b7d62090d9bf11b043dd27d`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `d887411450bbc06e2f4a24ce3c478fe6844856a8707b3236c045d44ab93b27d2`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `907f037eea90bf893520d3adeccdf29eda69eea32c564b08cecbedfd06471acd`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `f2ac4ad4f831a970cb35c1d7194788850dff722e859a08a879c918db1233aaa7`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `0bebb59217b491c5aa4b4b9dc740c0c8c5518872f6f86853cbe30493ea8539a5`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `5f343764e04e3a8639dffe225cc6f8bc6f17e1584b2c68923708546f48d38f89`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `c4475c315d4ae27c30f80bc01d6ea8b0b8549ec6a60a5dc745cf11a0c4398c23`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `4512a4c3e62cd26fb0d3f78bfc8de9a860e7d88e7c913c5df4c239536f89da42`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `1da407ad152b185f520f04215775a8fe176550a31a2bb79e3e82968734bdfb5c`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `f23f6f819e6d894f8ca7457f80ee4ede729fd35ac59e9c65ab031b56aa06d4a1`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `205c789f52a4c666a63ac7944ffa8ee325cb97e788b748c262eae59b838a94ba`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `aa7675fd22d9ca671585f429f6981aa79798f1894025c3abe3a7154f3c94aae6`

## Changelog since v1.10.0-alpha.3

### Action Required

* [action required] Default Flexvolume plugin directory for COS images on GCE is changed to `/home/kubernetes/flexvolume`. ([#58171](https://github.com/kubernetes/kubernetes/pull/58171), [@verult](https://github.com/verult))
* action required: [GCP kube-up.sh] Some variables that were part of kube-env are no longer being set (ones only used for kubelet flags) and are being replaced by a more portable mechanism (kubelet configuration file). The individual variables in the kube-env metadata entry were never meant to be a stable interface and this release note only applies if you are depending on them. ([#60020](https://github.com/kubernetes/kubernetes/pull/60020), [@roberthbailey](https://github.com/roberthbailey))
* action required: Deprecate format-separated endpoints for OpenAPI spec. Please use single `/openapi/v2` endpoint instead. ([#59293](https://github.com/kubernetes/kubernetes/pull/59293), [@roycaihw](https://github.com/roycaihw))
* action required: kube-proxy: feature gates are now specified as a map when provided via a JSON or YAML KubeProxyConfiguration, rather than as a string of key-value pairs. ([#57962](https://github.com/kubernetes/kubernetes/pull/57962), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Action Required: The boostrapped RBAC role and rolebinding for the `cloud-provider` service account is now deprecated. If you're currently using this service account, you must create and apply your own RBAC policy for new clusters. ([#59949](https://github.com/kubernetes/kubernetes/pull/59949), [@nicksardo](https://github.com/nicksardo))
* ACTION REQUIRED: VolumeScheduling and LocalPersistentVolume features are beta and enabled by default.  The PersistentVolume NodeAffinity alpha annotation is deprecated and will be removed in a future release. ([#59391](https://github.com/kubernetes/kubernetes/pull/59391), [@msau42](https://github.com/msau42))
* action required: Deprecate the kubelet's cadvisor port. The default will change to 0 (disabled) in 1.12, and the cadvisor port will be removed entirely in 1.13. ([#59827](https://github.com/kubernetes/kubernetes/pull/59827), [@dashpole](https://github.com/dashpole))
* action required: The `kubeletconfig` API group has graduated from alpha to beta, and the name has changed to `kubelet.config.k8s.io`. Please use `kubelet.config.k8s.io/v1beta1`, as `kubeletconfig/v1alpha1` is no longer available.  ([#53833](https://github.com/kubernetes/kubernetes/pull/53833), [@mtaufen](https://github.com/mtaufen))
* Action required: Default values differ between the Kubelet's componentconfig (config file) API and the Kubelet's command line. Be sure to review the default values when migrating to using a config file. ([#59666](https://github.com/kubernetes/kubernetes/pull/59666), [@mtaufen](https://github.com/mtaufen))
* kube-apiserver: the experimental in-tree Keystone password authenticator has been removed in favor of extensions that enable use of Keystone tokens. ([#59492](https://github.com/kubernetes/kubernetes/pull/59492), [@dims](https://github.com/dims))
* The udpTimeoutMilliseconds field in the kube-proxy configuration file has been renamed to udpIdleTimeout. Action required: administrators need to update their files accordingly. ([#57754](https://github.com/kubernetes/kubernetes/pull/57754), [@ncdc](https://github.com/ncdc))

### Other notable changes

* Enable IPVS feature gateway by default ([#60540](https://github.com/kubernetes/kubernetes/pull/60540), [@m1093782566](https://github.com/m1093782566))
* dockershim now makes an Image's Labels available in the Info field of ImageStatusResponse ([#58036](https://github.com/kubernetes/kubernetes/pull/58036), [@shlevy](https://github.com/shlevy))
* kube-scheduler: Support extender managed extended resources in kube-scheduler ([#60332](https://github.com/kubernetes/kubernetes/pull/60332), [@yguo0905](https://github.com/yguo0905))
* Fix the issue in kube-proxy iptables/ipvs mode to properly handle incorrect IP version. ([#56880](https://github.com/kubernetes/kubernetes/pull/56880), [@MrHohn](https://github.com/MrHohn))
* WindowsContainerResources is set now for windows containers ([#59333](https://github.com/kubernetes/kubernetes/pull/59333), [@feiskyer](https://github.com/feiskyer))
* GCE: support Cloud TPU API in cloud provider ([#58029](https://github.com/kubernetes/kubernetes/pull/58029), [@yguo0905](https://github.com/yguo0905))
* The node authorizer now allows nodes to request service account tokens for the service accounts of pods running on them. ([#55019](https://github.com/kubernetes/kubernetes/pull/55019), [@mikedanese](https://github.com/mikedanese))
* Fix StatefulSet to work with set-based selectors. ([#59365](https://github.com/kubernetes/kubernetes/pull/59365), [@ayushpateria](https://github.com/ayushpateria))
* New conformance tests added for the Garbage Collector ([#60116](https://github.com/kubernetes/kubernetes/pull/60116), [@jennybuckley](https://github.com/jennybuckley))
* Make NodePort IP addresses configurable ([#58052](https://github.com/kubernetes/kubernetes/pull/58052), [@m1093782566](https://github.com/m1093782566))
* Implements MountDevice and UnmountDevice for the CSI Plugin, the functions will call through to NodeStageVolume/NodeUnstageVolume for CSI plugins. ([#60115](https://github.com/kubernetes/kubernetes/pull/60115), [@davidz627](https://github.com/davidz627))
* Fixes a bug where character devices are not recongized by the kubelet ([#60440](https://github.com/kubernetes/kubernetes/pull/60440), [@andrewsykim](https://github.com/andrewsykim))
* [fluentd-gcp addon] Switch to the image, provided by Stackdriver. ([#59128](https://github.com/kubernetes/kubernetes/pull/59128), [@bmoyles0117](https://github.com/bmoyles0117))
* StatefulSet in apps/v1 is now included in Conformance Tests. ([#60336](https://github.com/kubernetes/kubernetes/pull/60336), [@enisoc](https://github.com/enisoc))
* K8s supports rbd-nbd for Ceph rbd volume mounts. ([#58916](https://github.com/kubernetes/kubernetes/pull/58916), [@ianchakeres](https://github.com/ianchakeres))
* AWS EBS volume plugin got block volume support ([#58625](https://github.com/kubernetes/kubernetes/pull/58625), [@screeley44](https://github.com/screeley44))
* Summary API will include pod CPU and Memory stats for CRI container runtime. ([#60328](https://github.com/kubernetes/kubernetes/pull/60328), [@Random-Liu](https://github.com/Random-Liu))
* dockertools: disable memory swap on Linux. ([#59404](https://github.com/kubernetes/kubernetes/pull/59404), [@ohmystack](https://github.com/ohmystack))
* On AWS kubelet returns an error when started under conditions that do not allow it to work (AWS has not yet tagged the instance). ([#60125](https://github.com/kubernetes/kubernetes/pull/60125), [@vainu-arto](https://github.com/vainu-arto))
* Increase timeout of integration tests ([#60458](https://github.com/kubernetes/kubernetes/pull/60458), [@jennybuckley](https://github.com/jennybuckley))
* Fixes a case when Deployment with recreate strategy could get stuck on old failed Pod. ([#60301](https://github.com/kubernetes/kubernetes/pull/60301), [@tnozicka](https://github.com/tnozicka))
* Buffered audit backend is introduced, to be used with other audit backends. ([#60076](https://github.com/kubernetes/kubernetes/pull/60076), [@crassirostris](https://github.com/crassirostris))
* Update dashboard version to v1.8.3 ([#57326](https://github.com/kubernetes/kubernetes/pull/57326), [@floreks](https://github.com/floreks))
* GCE PD volume plugin got block volume support ([#58710](https://github.com/kubernetes/kubernetes/pull/58710), [@screeley44](https://github.com/screeley44))
* force node name lowercase on static pod name generating ([#59849](https://github.com/kubernetes/kubernetes/pull/59849), [@yue9944882](https://github.com/yue9944882))
* AWS Security Groups created for ELBs will now be tagged with the same additional tags as the ELB (i.e. the tags specified by the "service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags" annotation.) ([#58767](https://github.com/kubernetes/kubernetes/pull/58767), [@2rs2ts](https://github.com/2rs2ts))
* Fixes an error when deleting an NLB in AWS - Fixes [#57568](https://github.com/kubernetes/kubernetes/pull/57568) ([#57569](https://github.com/kubernetes/kubernetes/pull/57569), [@micahhausler](https://github.com/micahhausler))
* fix device name change issue for azure disk ([#60346](https://github.com/kubernetes/kubernetes/pull/60346), [@andyzhangx](https://github.com/andyzhangx))
* On cluster provision or upgrade, kubeadm now generates certs and secures all connections to the etcd static-pod with mTLS. ([#57415](https://github.com/kubernetes/kubernetes/pull/57415), [@stealthybox](https://github.com/stealthybox))
* Some field names in the Kubelet's now v1beta1 config API differ from the v1alpha1 API: PodManifestPath is renamed to StaticPodPath, ManifestURL is renamed to StaticPodURL, ManifestURLHeader is renamed to StaticPodURLHeader. ([#60314](https://github.com/kubernetes/kubernetes/pull/60314), [@mtaufen](https://github.com/mtaufen))
* Adds BETA support for `DNSConfig` field in PodSpec and `DNSPolicy=None`. ([#59771](https://github.com/kubernetes/kubernetes/pull/59771), [@MrHohn](https://github.com/MrHohn))
* kubeadm: Demote controlplane passthrough flags to alpha flags ([#59882](https://github.com/kubernetes/kubernetes/pull/59882), [@kris-nova](https://github.com/kris-nova))
* DevicePlugins feature graduates to beta. ([#60170](https://github.com/kubernetes/kubernetes/pull/60170), [@jiayingz](https://github.com/jiayingz))
* Additional changes to iptables kube-proxy backend to improve performance on clusters with very large numbers of services. ([#60306](https://github.com/kubernetes/kubernetes/pull/60306), [@danwinship](https://github.com/danwinship))
* CSI now allows credentials to be specified on CreateVolume/DeleteVolume, ControllerPublishVolume/ControllerUnpublishVolume, and NodePublishVolume/NodeUnpublishVolume operations ([#60118](https://github.com/kubernetes/kubernetes/pull/60118), [@sbezverk](https://github.com/sbezverk))
* Disable mount propagation for windows containers. ([#60275](https://github.com/kubernetes/kubernetes/pull/60275), [@feiskyer](https://github.com/feiskyer))
* Introduced `--http2-max-streams-per-connection` command line flag on api-servers and set default to 1000 for aggregated API servers. ([#60054](https://github.com/kubernetes/kubernetes/pull/60054), [@MikeSpreitzer](https://github.com/MikeSpreitzer))
* APIserver backed by etcdv3 exports metric showing number of resources per kind ([#59757](https://github.com/kubernetes/kubernetes/pull/59757), [@gmarek](https://github.com/gmarek))
* The DaemonSet controller, its integration tests, and its e2e tests, have been updated to use the apps/v1 API. ([#59883](https://github.com/kubernetes/kubernetes/pull/59883), [@kow3ns](https://github.com/kow3ns))
* Fix image file system stats for windows nodes ([#59743](https://github.com/kubernetes/kubernetes/pull/59743), [@feiskyer](https://github.com/feiskyer))
* Custom resources can be listed with a set of grouped resources (category) by specifying the categories in the CustomResourceDefinition spec. Example: They can be used with `kubectl get all`, where `all` is a category. ([#59561](https://github.com/kubernetes/kubernetes/pull/59561), [@nikhita](https://github.com/nikhita))
* [fluentd-gcp addon] Fixed bug with reporting metrics in event-exporter ([#60126](https://github.com/kubernetes/kubernetes/pull/60126), [@serathius](https://github.com/serathius))
* Critical pods to use priorityClasses. ([#58835](https://github.com/kubernetes/kubernetes/pull/58835), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* `--show-all` (which only affected pods and only for human readable/non-API printers) is now defaulted to true and deprecated.  It will be inert in 1.11 and removed in a future release. ([#60210](https://github.com/kubernetes/kubernetes/pull/60210), [@deads2k](https://github.com/deads2k))
* Removed some redundant rules created by the iptables proxier, to improve performance on systems with very many services. ([#57461](https://github.com/kubernetes/kubernetes/pull/57461), [@danwinship](https://github.com/danwinship))
* Disable per-cpu metrics by default for scalability. ([#60106](https://github.com/kubernetes/kubernetes/pull/60106), [@dashpole](https://github.com/dashpole))
    * Fix inaccurate disk usage monitoring of overlayFs.
    * Retry docker connection on startup timeout to avoid permanent loss of metrics.
* When the `PodShareProcessNamespace` alpha feature is enabled, setting `pod.Spec.ShareProcessNamespace` to `true` will cause a single process namespace to be shared between all containers in a pod. ([#60181](https://github.com/kubernetes/kubernetes/pull/60181), [@verb](https://github.com/verb))
* add spelling checking script ([#59463](https://github.com/kubernetes/kubernetes/pull/59463), [@dixudx](https://github.com/dixudx))
* Allows HorizontalPodAutoscaler to use global metrics not associated with any Kubernetes object (for example metrics from a hoster service running outside of Kubernetes cluster). ([#60096](https://github.com/kubernetes/kubernetes/pull/60096), [@MaciekPytel](https://github.com/MaciekPytel))
* fix race condition issue when detaching azure disk ([#60183](https://github.com/kubernetes/kubernetes/pull/60183), [@andyzhangx](https://github.com/andyzhangx))
* Add kubectl create job command ([#60084](https://github.com/kubernetes/kubernetes/pull/60084), [@soltysh](https://github.com/soltysh))
* [Alpha] Kubelet now supports container log rotation for container runtime which implements CRI(container runtime interface). ([#59898](https://github.com/kubernetes/kubernetes/pull/59898), [@Random-Liu](https://github.com/Random-Liu))
    * The feature can be enabled with feature gate `CRIContainerLogRotation`.
    * The flags `--container-log-max-size` and `--container-log-max-files` can be used to configure the rotation behavior.
* Reorganized iptables rules to fix a performance regression on clusters with thousands of services. ([#56164](https://github.com/kubernetes/kubernetes/pull/56164), [@danwinship](https://github.com/danwinship))
* StorageOS volume plugin updated to support mount options and environments where the kubelet runs in a container and the device location should be specified. ([#58816](https://github.com/kubernetes/kubernetes/pull/58816), [@croomes](https://github.com/croomes))
* Use consts as predicate name in handlers ([#59952](https://github.com/kubernetes/kubernetes/pull/59952), [@resouer](https://github.com/resouer))
* `/status` and `/scale` subresources are added for custom resources. ([#55168](https://github.com/kubernetes/kubernetes/pull/55168), [@nikhita](https://github.com/nikhita))
* Allow kubectl env to specify which keys to import from a config map ([#60040](https://github.com/kubernetes/kubernetes/pull/60040), [@PhilipGough](https://github.com/PhilipGough))
* Set default enabled admission plugins `NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota` ([#58684](https://github.com/kubernetes/kubernetes/pull/58684), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Fix instanceID for vmss nodes. ([#59857](https://github.com/kubernetes/kubernetes/pull/59857), [@feiskyer](https://github.com/feiskyer))
* Deprecate kubectl scale jobs (only jobs).  ([#60139](https://github.com/kubernetes/kubernetes/pull/60139), [@soltysh](https://github.com/soltysh))
* Adds new flag `--apiserver-advertise-dns-address` which is used in node kubelet.confg to point to API server ([#59288](https://github.com/kubernetes/kubernetes/pull/59288), [@stevesloka](https://github.com/stevesloka))
* Fix kube-proxy flags validation for --healthz-bind-address and --metrics-bind-address to allow specifying ip:port. ([#54191](https://github.com/kubernetes/kubernetes/pull/54191), [@MrHohn](https://github.com/MrHohn))
* Increase allowed lag for ssh key sync loop in tunneler to allow for one failure ([#60068](https://github.com/kubernetes/kubernetes/pull/60068), [@wojtek-t](https://github.com/wojtek-t))
* Flags that can be set via the Kubelet's --config file are now deprecated in favor of the file. ([#60148](https://github.com/kubernetes/kubernetes/pull/60148), [@mtaufen](https://github.com/mtaufen))
* PVC Protection alpha feature was renamed to Storage Protection. Storage Protection feature is beta. ([#59052](https://github.com/kubernetes/kubernetes/pull/59052), [@pospispa](https://github.com/pospispa))
* kube-apiserver: the root /proxy paths have been removed (deprecated since v1.2). Use the /proxy subresources on objects that support HTTP proxying. ([#59884](https://github.com/kubernetes/kubernetes/pull/59884), [@mikedanese](https://github.com/mikedanese))
* Set an upper bound (5 minutes) on how long the Kubelet will wait before exiting when the client cert from disk is missing or invalid. This prevents the Kubelet from waiting forever without attempting to bootstrap a new client credentials. ([#59316](https://github.com/kubernetes/kubernetes/pull/59316), [@smarterclayton](https://github.com/smarterclayton))
* v1.Pod now has a field to configure whether a single process namespace should be shared between all containers in a pod. This feature is in alpha preview. ([#58716](https://github.com/kubernetes/kubernetes/pull/58716), [@verb](https://github.com/verb))
* Priority admission controller picks a global default with the lowest priority value if more than one such default PriorityClass exists. ([#59991](https://github.com/kubernetes/kubernetes/pull/59991), [@bsalamat](https://github.com/bsalamat))
* Add ipset binary for IPVS to hyperkube docker image ([#57648](https://github.com/kubernetes/kubernetes/pull/57648), [@Fsero](https://github.com/Fsero))
* kube-apiserver: the OpenID Connect authenticator can now verify ID Tokens signed with JOSE algorithms other than RS256 through the --oidc-signing-algs flag. ([#58544](https://github.com/kubernetes/kubernetes/pull/58544), [@ericchiang](https://github.com/ericchiang))
    * kube-apiserver: the OpenID Connect authenticator no longer accepts tokens from the Google v3 token APIs, users must switch to the "https://www.googleapis.com/oauth2/v4/token" endpoint.
* Rename StorageProtection to StorageObjectInUseProtection ([#59901](https://github.com/kubernetes/kubernetes/pull/59901), [@NickrenREN](https://github.com/NickrenREN))
* kubeadm: add criSocket field to MasterConfiguration manifiest ([#59057](https://github.com/kubernetes/kubernetes/pull/59057), [@JordanFaust](https://github.com/JordanFaust))
* kubeadm: add criSocket field to NodeConfiguration manifiest ([#59292](https://github.com/kubernetes/kubernetes/pull/59292), [@JordanFaust](https://github.com/JordanFaust))
* The `PodSecurityPolicy` API has been moved to the `policy/v1beta1` API group. The `PodSecurityPolicy` API in the `extensions/v1beta1` API group is deprecated and will be removed in a future release. Authorizations for using pod security policy resources should change to reference the `policy` API group after upgrading to 1.11. ([#54933](https://github.com/kubernetes/kubernetes/pull/54933), [@php-coder](https://github.com/php-coder))
* Restores the ability of older clients to delete and scale jobs with initContainers ([#59880](https://github.com/kubernetes/kubernetes/pull/59880), [@liggitt](https://github.com/liggitt))
* Support for resource quota on extended resources ([#57302](https://github.com/kubernetes/kubernetes/pull/57302), [@lichuqiang](https://github.com/lichuqiang))
* Fix race causing apiserver crashes during etcd healthchecking ([#60069](https://github.com/kubernetes/kubernetes/pull/60069), [@wojtek-t](https://github.com/wojtek-t))
* If TaintNodesByCondition enabled, taint node when it under PID pressure  ([#60008](https://github.com/kubernetes/kubernetes/pull/60008), [@k82cn](https://github.com/k82cn))
* Expose total usage of pods through the "pods" SystemContainer in the Kubelet Summary API ([#57802](https://github.com/kubernetes/kubernetes/pull/57802), [@dashpole](https://github.com/dashpole))
* Unauthorized requests will not match audit policy rules where users or groups are set. ([#59398](https://github.com/kubernetes/kubernetes/pull/59398), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Making sure CSI E2E test runs on a local cluster ([#60017](https://github.com/kubernetes/kubernetes/pull/60017), [@sbezverk](https://github.com/sbezverk))
* Addressing breaking changes introduced by new 0.2.0 release of CSI spec ([#59209](https://github.com/kubernetes/kubernetes/pull/59209), [@sbezverk](https://github.com/sbezverk))
* GCE: A role and clusterrole will now be provided with GCE/GKE for allowing the cloud-provider to post warning events on all services and watching configmaps in the kube-system namespace. ([#59686](https://github.com/kubernetes/kubernetes/pull/59686), [@nicksardo](https://github.com/nicksardo))
* Updated PID pressure node condition ([#57136](https://github.com/kubernetes/kubernetes/pull/57136), [@k82cn](https://github.com/k82cn))
* Add AWS cloud provider option to use an assumed IAM role  ([#59668](https://github.com/kubernetes/kubernetes/pull/59668), [@brycecarman](https://github.com/brycecarman))
* `kubectl port-forward` now supports specifying a service to port forward to: `kubectl port-forward svc/myservice 8443:443` ([#59809](https://github.com/kubernetes/kubernetes/pull/59809), [@phsiao](https://github.com/phsiao))
* Fix kubelet PVC stale metrics ([#59170](https://github.com/kubernetes/kubernetes/pull/59170), [@cofyc](https://github.com/cofyc))
* - Separate current ARM rate limiter into read/write ([#59830](https://github.com/kubernetes/kubernetes/pull/59830), [@khenidak](https://github.com/khenidak))
    * - Improve control over how ARM rate limiter is used within Azure cloud provider
* The ConfigOK node condition has been renamed to KubeletConfigOk. ([#59905](https://github.com/kubernetes/kubernetes/pull/59905), [@mtaufen](https://github.com/mtaufen))
* fluentd-gcp resources can be modified via a ScalingPolicy ([#59657](https://github.com/kubernetes/kubernetes/pull/59657), [@x13n](https://github.com/x13n))
* Adding pkg/kubelet/apis/deviceplugin/v1beta1 API. ([#59588](https://github.com/kubernetes/kubernetes/pull/59588), [@jiayingz](https://github.com/jiayingz))
* Fixes volume predicate handler for equiv class ([#59335](https://github.com/kubernetes/kubernetes/pull/59335), [@resouer](https://github.com/resouer))
* Bugfix: vSphere Cloud Provider (VCP) does not need any special service account anymore. ([#59440](https://github.com/kubernetes/kubernetes/pull/59440), [@rohitjogvmw](https://github.com/rohitjogvmw))
* Fixing a bug in OpenStack cloud provider, where dual stack deployments (IPv4 and IPv6) did not work well when using kubenet as the network plugin. ([#59749](https://github.com/kubernetes/kubernetes/pull/59749), [@zioproto](https://github.com/zioproto))
* Get parent dir via canonical absolute path when trying to judge mount-point ([#58433](https://github.com/kubernetes/kubernetes/pull/58433), [@yue9944882](https://github.com/yue9944882))
* Container runtime daemon (e.g. dockerd) logs in GCE cluster will be uploaded to stackdriver and elasticsearch with tag `container-runtime` ([#59103](https://github.com/kubernetes/kubernetes/pull/59103), [@Random-Liu](https://github.com/Random-Liu))
* Add AzureDisk support for vmss nodes ([#59716](https://github.com/kubernetes/kubernetes/pull/59716), [@feiskyer](https://github.com/feiskyer))
* Fixed a race condition in k8s.io/client-go/tools/cache.SharedInformer that could violate the sequential delivery guarantee and cause panics on shutdown. ([#59828](https://github.com/kubernetes/kubernetes/pull/59828), [@krousey](https://github.com/krousey))
* Avoid hook errors when effecting label changes on kubernetes-worker charm. ([#59803](https://github.com/kubernetes/kubernetes/pull/59803), [@wwwtyro](https://github.com/wwwtyro))
* kubectl port-forward now allows using resource name (e.g., deployment/www) to select a matching pod, as well as allows the use of --pod-running-timeout to wait till at least one pod is running. ([#59705](https://github.com/kubernetes/kubernetes/pull/59705), [@phsiao](https://github.com/phsiao))
    * kubectl port-forward no longer support deprecated -p flag
* Deprecate insecure HTTP port of kube-controller-manager and cloud-controller-manager. Use `--secure-port` and `--bind-address` instead. ([#59582](https://github.com/kubernetes/kubernetes/pull/59582), [@sttts](https://github.com/sttts))
* Eviction thresholds set to 0% or 100% are now ignored. ([#59681](https://github.com/kubernetes/kubernetes/pull/59681), [@mtaufen](https://github.com/mtaufen))
* [advanced audit] support subresources wildcard matching. ([#55306](https://github.com/kubernetes/kubernetes/pull/55306), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* CronJobs can be accessed through cj alias ([#59499](https://github.com/kubernetes/kubernetes/pull/59499), [@soltysh](https://github.com/soltysh))
* fix typo in resource_allocation.go ([#58275](https://github.com/kubernetes/kubernetes/pull/58275), [@carmark](https://github.com/carmark))
* fix the error prone account creation method of blob disk ([#59739](https://github.com/kubernetes/kubernetes/pull/59739), [@andyzhangx](https://github.com/andyzhangx))
* Add automatic etcd 3.2->3.1 and 3.1->3.0 minor version rollback support to gcr.io/google_container/etcd images. For HA clusters, all members must be stopped before performing a rollback. ([#59298](https://github.com/kubernetes/kubernetes/pull/59298), [@jpbetz](https://github.com/jpbetz))
* `kubeadm init` can now omit the tainting of the master node if configured to do so in `kubeadm.yaml`. ([#55479](https://github.com/kubernetes/kubernetes/pull/55479), [@ijc](https://github.com/ijc))
* Updated kubernetes-worker to request new security tokens when the aws cloud provider changes the registered node name. ([#59730](https://github.com/kubernetes/kubernetes/pull/59730), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Controller-manager --service-sync-period flag is removed (was never used in the code). ([#59359](https://github.com/kubernetes/kubernetes/pull/59359), [@khenidak](https://github.com/khenidak))
* Pod priority can be specified ins PodSpec even when the feature is disabled, but it will be effective only when the feature is enabled. ([#59291](https://github.com/kubernetes/kubernetes/pull/59291), [@bsalamat](https://github.com/bsalamat))
* kubeadm: Enable auditing behind a feature gate. ([#59067](https://github.com/kubernetes/kubernetes/pull/59067), [@chuckha](https://github.com/chuckha))
* Map correct vmset name for Azure internal load balancers ([#59747](https://github.com/kubernetes/kubernetes/pull/59747), [@feiskyer](https://github.com/feiskyer))
* Add generic cache for Azure VMSS ([#59652](https://github.com/kubernetes/kubernetes/pull/59652), [@feiskyer](https://github.com/feiskyer))
* kubeadm: New "imagePullPolicy" option in the init configuration file, that gets forwarded to kubelet static pods to control pull policy for etcd and control plane images. ([#58960](https://github.com/kubernetes/kubernetes/pull/58960), [@rosti](https://github.com/rosti))
* fix the create azure file pvc failure if there is no storage account in current resource group ([#56557](https://github.com/kubernetes/kubernetes/pull/56557), [@andyzhangx](https://github.com/andyzhangx))
* Add generic cache for Azure VM/LB/NSG/RouteTable ([#59520](https://github.com/kubernetes/kubernetes/pull/59520), [@feiskyer](https://github.com/feiskyer))
* The alpha KubeletConfiguration.ConfigTrialDuration field is no longer available. ([#59628](https://github.com/kubernetes/kubernetes/pull/59628), [@mtaufen](https://github.com/mtaufen))
* Updates Calico version to v2.6.7 (Fixed a bug where Felix would crash when parsing a NetworkPolicy with a named port. See https://github.com/projectcalico/calico/releases/tag/v2.6.7) ([#59130](https://github.com/kubernetes/kubernetes/pull/59130), [@caseydavenport](https://github.com/caseydavenport))
* return error if New-SmbGlobalMapping failed when mounting azure file on Windows ([#59540](https://github.com/kubernetes/kubernetes/pull/59540), [@andyzhangx](https://github.com/andyzhangx))
* Disallow PriorityClass names with 'system-' prefix for user defined priority classes. ([#59382](https://github.com/kubernetes/kubernetes/pull/59382), [@bsalamat](https://github.com/bsalamat))
* Fixed an issue where Portworx volume driver wasn't passing namespace and annotations to the Portworx Create API. ([#59607](https://github.com/kubernetes/kubernetes/pull/59607), [@harsh-px](https://github.com/harsh-px))
* Enable apiserver metrics for custom resources. ([#57682](https://github.com/kubernetes/kubernetes/pull/57682), [@nikhita](https://github.com/nikhita))
* fix typo  ([#59619](https://github.com/kubernetes/kubernetes/pull/59619), [@jianliao82](https://github.com/jianliao82))
    * incase -> in case
    * selction -> selection
* Implement envelope service with gRPC, so that KMS providers can be pulled out from API server. ([#55684](https://github.com/kubernetes/kubernetes/pull/55684), [@wu-qiang](https://github.com/wu-qiang))
* Enable golint for `pkg/scheduler` and fix the golint errors in it. ([#58437](https://github.com/kubernetes/kubernetes/pull/58437), [@tossmilestone](https://github.com/tossmilestone))
* AWS: Make attach/detach operations faster. from 10-12s to 2-6s ([#56974](https://github.com/kubernetes/kubernetes/pull/56974), [@gnufied](https://github.com/gnufied))
* CRI starts using moutpoint as image filesystem identifier instead of UUID. ([#59475](https://github.com/kubernetes/kubernetes/pull/59475), [@Random-Liu](https://github.com/Random-Liu))
* DaemonSet, Deployment, ReplicaSet, and StatefulSet objects are now persisted in etcd in apps/v1 format ([#58854](https://github.com/kubernetes/kubernetes/pull/58854), [@liggitt](https://github.com/liggitt))
* 'none' can now be specified in KubeletConfiguration.EnforceNodeAllocatable (--enforce-node-allocatable) to explicitly disable enforcement. ([#59515](https://github.com/kubernetes/kubernetes/pull/59515), [@mtaufen](https://github.com/mtaufen))
* vSphere Cloud Provider supports VMs provisioned on vSphere v1.6.5 ([#59519](https://github.com/kubernetes/kubernetes/pull/59519), [@abrarshivani](https://github.com/abrarshivani))
* Annotations is added to advanced audit api ([#58806](https://github.com/kubernetes/kubernetes/pull/58806), [@CaoShuFeng](https://github.com/CaoShuFeng))
* 2nd try at using a vanity GCR name ([#57824](https://github.com/kubernetes/kubernetes/pull/57824), [@thockin](https://github.com/thockin))
* Node's providerID is following Azure resource ID format now when useInstanceMetadata is enabled ([#59539](https://github.com/kubernetes/kubernetes/pull/59539), [@feiskyer](https://github.com/feiskyer))
* Block Volume Support: Local Volume Plugin update ([#59303](https://github.com/kubernetes/kubernetes/pull/59303), [@dhirajh](https://github.com/dhirajh))
* [action-required] The Container Runtime Interface (CRI) version has increased from v1alpha1 to v1alpha2. Runtimes implementing the CRI will need to update to the new version, which configures container namespaces using an enumeration rather than booleans. ([#58973](https://github.com/kubernetes/kubernetes/pull/58973), [@verb](https://github.com/verb))
* Fix the bug where kubelet in the standalone mode would wait for the update from the apiserver source. ([#59276](https://github.com/kubernetes/kubernetes/pull/59276), [@roboll](https://github.com/roboll))
* Add "keyring" parameter for Ceph RBD provisioner ([#58287](https://github.com/kubernetes/kubernetes/pull/58287), [@madddi](https://github.com/madddi))
* Ensure euqiv hash calculation is per schedule ([#59245](https://github.com/kubernetes/kubernetes/pull/59245), [@resouer](https://github.com/resouer))
* kube-scheduler: Use default predicates/prioritizers if they are unspecified in the policy config ([#59363](https://github.com/kubernetes/kubernetes/pull/59363), [@yguo0905](https://github.com/yguo0905))
* Fixed charm issue where docker login would run prior to daemon options being set.  ([#59396](https://github.com/kubernetes/kubernetes/pull/59396), [@kwmonroe](https://github.com/kwmonroe))
* Implementers of the cloud provider interface will note the addition of a context to this interface. Trivial code modification will be necessary for a cloud provider to continue to compile. ([#59287](https://github.com/kubernetes/kubernetes/pull/59287), [@cheftako](https://github.com/cheftako))
* /release-note-none ([#58264](https://github.com/kubernetes/kubernetes/pull/58264), [@WanLinghao](https://github.com/WanLinghao))
* Use a more reliable way to get total physical memory on windows nodes ([#57124](https://github.com/kubernetes/kubernetes/pull/57124), [@JiangtianLi](https://github.com/JiangtianLi))
* Add xfsprogs to hyperkube container image. ([#56937](https://github.com/kubernetes/kubernetes/pull/56937), [@redbaron](https://github.com/redbaron))
* Ensure Azure public IP removed after service deleted ([#59340](https://github.com/kubernetes/kubernetes/pull/59340), [@feiskyer](https://github.com/feiskyer))
* Improve messages user gets during and after volume resizing is done. ([#58415](https://github.com/kubernetes/kubernetes/pull/58415), [@gnufied](https://github.com/gnufied))
* Fix RBAC permissions for Stackdriver Metadata Agent. ([#57455](https://github.com/kubernetes/kubernetes/pull/57455), [@kawych](https://github.com/kawych))
* Scheduler should be able to read from config file if configmap is not present. ([#59386](https://github.com/kubernetes/kubernetes/pull/59386), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* MountPropagation feature is now beta. As consequence, all volume mounts in containers are now "rslave" on Linux by default. ([#59252](https://github.com/kubernetes/kubernetes/pull/59252), [@jsafrane](https://github.com/jsafrane))
* Fix RBAC role for certificate controller to allow cleaning. ([#59375](https://github.com/kubernetes/kubernetes/pull/59375), [@mikedanese](https://github.com/mikedanese))
* Volume metrics support for vSphere Cloud Provider ([#59328](https://github.com/kubernetes/kubernetes/pull/59328), [@divyenpatel](https://github.com/divyenpatel))
* Announcing the deprecation of the recycling reclaim policy. ([#59063](https://github.com/kubernetes/kubernetes/pull/59063), [@ayushpateria](https://github.com/ayushpateria))
* Intended for post-1.9 ([#57872](https://github.com/kubernetes/kubernetes/pull/57872), [@mlmhl](https://github.com/mlmhl))
* The `meta.k8s.io/v1alpha1` objects for retrieving tabular responses from the server (`Table`) or fetching just the `ObjectMeta` for an object (as `PartialObjectMetadata`) are now beta as part of `meta.k8s.io/v1beta1`.  Clients may request alternate representations of normal Kubernetes objects by passing an `Accept` header like `application/json;as=Table;g=meta.k8s.io;v=v1beta1` or `application/json;as=PartialObjectMetadata;g=meta.k8s.io;v1=v1beta1`.  Older servers will ignore this representation or return an error if it is not available.  Clients may request fallback to the normal object by adding a non-qualified mime-type to their `Accept` header like `application/json` - the server will then respond with either the alternate representation if it is supported or the fallback mime-type which is the normal object response. ([#59059](https://github.com/kubernetes/kubernetes/pull/59059), [@smarterclayton](https://github.com/smarterclayton))
* add PV size grow feature for azure file ([#57017](https://github.com/kubernetes/kubernetes/pull/57017), [@andyzhangx](https://github.com/andyzhangx))
* Upgrade default etcd server version to 3.2.14 ([#58645](https://github.com/kubernetes/kubernetes/pull/58645), [@jpbetz](https://github.com/jpbetz))
* Add windows config to Kubelet CRI ([#57076](https://github.com/kubernetes/kubernetes/pull/57076), [@feiskyer](https://github.com/feiskyer))
* Configurable etcd quota backend bytes in GCE ([#59259](https://github.com/kubernetes/kubernetes/pull/59259), [@wojtek-t](https://github.com/wojtek-t))
* Remove unmaintained kube-registry-proxy support from gce kube-up. ([#58564](https://github.com/kubernetes/kubernetes/pull/58564), [@mikedanese](https://github.com/mikedanese))
* Allow expanding mounted volumes ([#58794](https://github.com/kubernetes/kubernetes/pull/58794), [@gnufied](https://github.com/gnufied))
* Upped the timeout for apiserver communication in the juju kubernetes-worker charm. ([#59219](https://github.com/kubernetes/kubernetes/pull/59219), [@hyperbolic2346](https://github.com/hyperbolic2346))
* kubeadm init: skip checking cri socket in preflight checks ([#58802](https://github.com/kubernetes/kubernetes/pull/58802), [@dixudx](https://github.com/dixudx))
* Add "nominatedNodeName" field to PodStatus. This field is set when a pod preempts other pods on the node. ([#58990](https://github.com/kubernetes/kubernetes/pull/58990), [@bsalamat](https://github.com/bsalamat))
* Changes secret, configMap, downwardAPI and projected volumes to mount read-only, instead of allowing applications to write data and then reverting it automatically. Until version 1.11, setting the feature gate ReadOnlyAPIDataVolumes=false will preserve the old behavior. ([#58720](https://github.com/kubernetes/kubernetes/pull/58720), [@joelsmith](https://github.com/joelsmith))
* Fixed issue with charm upgrades resulting in an error state. ([#59064](https://github.com/kubernetes/kubernetes/pull/59064), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Ensure IP is set for Azure internal load balancer. ([#59083](https://github.com/kubernetes/kubernetes/pull/59083), [@feiskyer](https://github.com/feiskyer))
* Postpone PV deletion when it is being bound to a PVC ([#58743](https://github.com/kubernetes/kubernetes/pull/58743), [@NickrenREN](https://github.com/NickrenREN))
* Add V1beta1 VolumeAttachment API, co-existing with Alpha API object ([#58462](https://github.com/kubernetes/kubernetes/pull/58462), [@NickrenREN](https://github.com/NickrenREN))
* When using client or server certificate rotation, the Kubelet will no longer wait until the initial rotation succeeds or fails before starting static pods.  This makes running self-hosted masters with rotation more predictable. ([#58930](https://github.com/kubernetes/kubernetes/pull/58930), [@smarterclayton](https://github.com/smarterclayton))



# v1.10.0-alpha.3

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.3


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes.tar.gz) | `246f0373ccb25a243a387527b32354b69fc2211c422e71479d22bfb3a829c8fb`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-src.tar.gz) | `f9c60bb37fb7b363c9f66d8efd8aa5a36ea2093c61317c950719b3ddc86c5e10`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-darwin-386.tar.gz) | `ca8dfd7fbd34478e7ba9bba3779fcca08f7efd4f218b0c8a7f52bbeea0f42cd7`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | `713c35d99f44bd19d225d2c9f2d7c4f3976b5dd76e9a817b2aaf68ee0cb5a939`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-386.tar.gz) | `7601e55e3bb0f0fc11611c68c4bc000c3cbbb7a09652c386e482a1671be7e2d6`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | `8a6c498531c1832176e22d622008a98bac6043f05dec96747649651531ed3fd7`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | `81561820fb5a000152e9d8d94882e0ed6228025ea7973ee98173b5fc89d62a42`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | `6ce8c3ed253a10d78e62e000419653a29c411cd64910325b21ff3370cb0a89eb`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | `a46b42c94040767f6bbf2ce10aef36d8dbe94c0069f866a848d69b2274f8f0bc`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | `fa3e656b612277fc4c303aef95c60b58ed887e36431db23d26b536f226a23cf6`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-windows-386.tar.gz) | `832e12266495ac55cb54a999bc5ae41d42d160387b487d8b4ead577d96686b62`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | `7056a3eb5a8f9e8fa0326aa6e0bf97fc5b260447315f8ec7340be5747a16f5fd`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | `dc8e2be2fcb6477249621fb5c813c853371a3bf8732c5cb3a6d6cab667cfa324`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | `399071ad9042a72bccd6e1aa322405c02b4a807c0b4f987d608c4c9c369979d6`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | `7457ad16665e331fa9224a3d61690206723721197ad9760c3b488de9602293f5`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | `ffcb728d879c0347bd751c9bccac3520bb057d203ba1acd55f8c727295282049`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | `f942f6e15886a1fb0d91d04adf47677068c56070dff060f38c371c3ee3e99648`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | `81b22beb30be9d270016c7b35b86ea585f29c0c5f09128da9341f9f67c8865f9`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | `d9020b99c145f44c519b1a95b55ed24e69d9c679a02352c7e05e86042daca9d1`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | `1d10bee4ed62d70b318f5703b2cd8295a08e199f810d6b361f367907e3f01fb6`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | `67cd4dde212abda37e6f9e6dee1bb59db96e0727100ef0aa561c15562df0f3e1`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | `362b030e011ea6222b1f2dec62311d3971bcce4dba94997963e2a091efbf967b`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | `e609a2b0410acbb64d3ee6d7f134d98723d82d05bdbead1eaafd3584d3e45c39`

## Changelog since v1.10.0-alpha.2

### Other notable changes

* Fixed issue with kubernetes-worker option allow-privileged not properly handling the value True with a capital T. ([#59116](https://github.com/kubernetes/kubernetes/pull/59116), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Added anti-affinity to kube-dns pods ([#57683](https://github.com/kubernetes/kubernetes/pull/57683), [@vainu-arto](https://github.com/vainu-arto))
* cloudprovider/openstack: fix bug the tries to use octavia client to query flip ([#59075](https://github.com/kubernetes/kubernetes/pull/59075), [@jrperritt](https://github.com/jrperritt))
* Windows containers now support experimental Hyper-V isolation by setting annotation `experimental.windows.kubernetes.io/isolation-type=hyperv` and feature gates HyperVContainer. Only one container per pod is supported yet. ([#58751](https://github.com/kubernetes/kubernetes/pull/58751), [@feiskyer](https://github.com/feiskyer))
* `crds` is added as a shortname for CustomResourceDefinition i.e. `kubectl get crds` can now be used. ([#59061](https://github.com/kubernetes/kubernetes/pull/59061), [@nikhita](https://github.com/nikhita))
* Fix an issue where port forwarding doesn't forward local TCP6 ports to the pod ([#57457](https://github.com/kubernetes/kubernetes/pull/57457), [@vfreex](https://github.com/vfreex))
* YAMLDecoder Read now tracks rest of buffer on io.ErrShortBuffer ([#58817](https://github.com/kubernetes/kubernetes/pull/58817), [@karlhungus](https://github.com/karlhungus))
* Prevent kubelet from getting wedged if initialization of modules returns an error. ([#59020](https://github.com/kubernetes/kubernetes/pull/59020), [@brendandburns](https://github.com/brendandburns))
* Fixed a race condition inside kubernetes-worker that would result in a temporary error situation. ([#59005](https://github.com/kubernetes/kubernetes/pull/59005), [@hyperbolic2346](https://github.com/hyperbolic2346))
* [GCE] Apiserver uses `InternalIP` as the most preferred kubelet address type by default. ([#59019](https://github.com/kubernetes/kubernetes/pull/59019), [@MrHohn](https://github.com/MrHohn))
* Deprecate insecure flags `--insecure-bind-address`, `--insecure-port` and remove  `--public-address-override`. ([#59018](https://github.com/kubernetes/kubernetes/pull/59018), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Support GetLabelsForVolume in OpenStack Provider ([#58871](https://github.com/kubernetes/kubernetes/pull/58871), [@edisonxiang](https://github.com/edisonxiang))
* Build using go1.9.3. ([#59012](https://github.com/kubernetes/kubernetes/pull/59012), [@ixdy](https://github.com/ixdy))
* CRI: Add a call to reopen log file for a container.  ([#58899](https://github.com/kubernetes/kubernetes/pull/58899), [@yujuhong](https://github.com/yujuhong))
* The alpha KubeletConfigFile feature gate has been removed, because it was redundant with the Kubelet's --config flag. It is no longer necessary to set this gate to use the flag. The --config flag is still considered alpha. ([#58978](https://github.com/kubernetes/kubernetes/pull/58978), [@mtaufen](https://github.com/mtaufen))
* `kubectl scale` can now scale any resource (kube, CRD, aggregate) conforming to the standard scale endpoint ([#58298](https://github.com/kubernetes/kubernetes/pull/58298), [@p0lyn0mial](https://github.com/p0lyn0mial))
* kube-apiserver flag --tls-ca-file has had no effect for some time.  It is now deprecated and slated for removal in 1.11.  If you are specifying this flag, you must remove it from your launch config before upgrading to 1.11. ([#58968](https://github.com/kubernetes/kubernetes/pull/58968), [@deads2k](https://github.com/deads2k))
* Fix regression in the CRI: do not add a default hostname on short image names ([#58955](https://github.com/kubernetes/kubernetes/pull/58955), [@runcom](https://github.com/runcom))
* Get windows kernel version directly from registry ([#58498](https://github.com/kubernetes/kubernetes/pull/58498), [@feiskyer](https://github.com/feiskyer))
* Remove deprecated --require-kubeconfig flag, remove default --kubeconfig value ([#58367](https://github.com/kubernetes/kubernetes/pull/58367), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* Google Cloud Service Account email addresses can now be used in RBAC ([#58141](https://github.com/kubernetes/kubernetes/pull/58141), [@ahmetb](https://github.com/ahmetb))
    * Role bindings since the default scopes now include the "userinfo.email"
    * scope. This is a breaking change if the numeric uniqueIDs of the Google
    * service accounts were being used in RBAC role bindings. The behavior
    * can be overridden by explicitly specifying the scope values as
    * comma-separated string in the "users[*].config.scopes" field in the
    * KUBECONFIG file.
* kube-apiserver is changed to use SSH tunnels for webhook iff the webhook is not directly routable from apiserver's network environment. ([#58644](https://github.com/kubernetes/kubernetes/pull/58644), [@yguo0905](https://github.com/yguo0905))
* Updated priority of mirror pod according to PriorityClassName. ([#58485](https://github.com/kubernetes/kubernetes/pull/58485), [@k82cn](https://github.com/k82cn))
* Fixes a bug where kubelet crashes trying to free memory under memory pressure ([#58574](https://github.com/kubernetes/kubernetes/pull/58574), [@yastij](https://github.com/yastij))



# v1.10.0-alpha.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes.tar.gz) | `89efeb8b16c40e5074f092f51399995f0fe4a0312367a8f54bd227c3c6fcb629`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-src.tar.gz) | `eefbbf435f1b7a0e416f4e6b2c936c49ce5d692994da8d235c5e25bc408eec57`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `878366200ddfb9128a133d7d377057c6f878b24357062cf5243c0f0aac26b292`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `dc065b9ecfa513607eac6e7dd125b2c25c9a9e7c13d0b2b6e56586e17bbd6ae5`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `93c2462051935d8f6bca6c72d09948963d47cd64426660f63e0cea7d37e24812`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `0eef61285fad1f9ff8392c59986d3a41887abc642bcb5cb451c5a5300927e2c4`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `6cf7913730a57b503beaf37f5c4d0f97789358983ed03654036f8b986b60cc62`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `f03c3ecbf4c08d263f2daa8cbe838e20452d6650b80e9a74762c155c26a579b7`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `25a2f93ebb721901d262adae4c0bdaa4cf1293793e9dff4507e031b85f46aff8`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `3e0b9ef771f36edb61bd61ccb67996ed41793c01f8686509bf93e585ee882c94`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `387e5e6b0535f4f5996c0732f1b591d80691acaec86e35482c7b90e00a1856f7`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `c10a72d40252707b732d33d03beec3c6380802d0a6e3214cbbf4af258fddf28c`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `42c1e016e8b0c5cc36c7bf574abca18c63e16d719d35e19ddbcbcd5aaeabc46c`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `b7774c54344c75bf5c703d4ca271f0af6c230e86cbe40eafd9cbf98a4f4be6e9`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `c11c8554506b64d6fd1a6e79bfc4e1e19f4f826b9ba98de81bc757901e8cdc43`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `196bd957804b2a9049189d225e49bf78e52e9adef12c072128e4e85d35da438e`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `be12fbea28a6cb089734782fe11e6f90a30785b9ad1ec02bc08a59afeb95c173`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `a1feb239dfc473b49adf95d7d94e4a9c6c7d07416d4e935e3fc10175ffaa7163`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `26583c0bd08313bdc0bdfba6745f3ccd0f117431d3a5e2623bb5015675d506b8`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `79c6299a5482467e3e85ee881f21edf5d491bc28c94e547d9297d1e1ad1b7458`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `2732fd288f1eac44c599423ce28cbdb85b54a646970a3714be5ff86d1b14b5e2`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `8d49432f0ff3baf55e71c29fb6ffc1673b2a45b9eae2e1906138b1409da53940`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `15ff74edfa98cd1afadcc4e53dd592b1e2935fbab76ad731309d355ae23bdd09`

## Changelog since v1.10.0-alpha.1

### Action Required

* Bug fix: webhooks now do not skip cluster-scoped resources ([#58185](https://github.com/kubernetes/kubernetes/pull/58185), [@caesarxuchao](https://github.com/caesarxuchao))
    * Action required: Before upgrading your Kubernetes clusters, double check if you had configured webhooks for cluster-scoped objects (e.g., nodes, persistentVolume), these webhooks will start to take effect. Delete/modify the configs if that's not desirable.

### Other notable changes

* Fixing extra_sans option on master and load balancer. ([#58843](https://github.com/kubernetes/kubernetes/pull/58843), [@hyperbolic2346](https://github.com/hyperbolic2346))
* ConfigMap objects now support binary data via a new `binaryData` field. When using `kubectl create configmap --from-file`, files containing non-UTF8 data will be placed in this new field in order to preserve the non-UTF8 data. Use of this feature requires 1.10+ apiserver and kubelets. ([#57938](https://github.com/kubernetes/kubernetes/pull/57938), [@dims](https://github.com/dims))
* New alpha feature to limit the number of processes running in a pod. Cluster administrators will be able to place limits by using the new kubelet command line parameter --pod-max-pids. Note that since this is a alpha feature they will need to enable the "SupportPodPidsLimit" feature. ([#57973](https://github.com/kubernetes/kubernetes/pull/57973), [@dims](https://github.com/dims))
* Add storage-backend configuration option to kubernetes-master charm. ([#58830](https://github.com/kubernetes/kubernetes/pull/58830), [@wwwtyro](https://github.com/wwwtyro))
* use containing API group when resolving shortname from discovery ([#58741](https://github.com/kubernetes/kubernetes/pull/58741), [@dixudx](https://github.com/dixudx))
* Fix kubectl explain for resources not existing in default version of API group ([#58753](https://github.com/kubernetes/kubernetes/pull/58753), [@soltysh](https://github.com/soltysh))
* Ensure config has been created before attempting to launch ingress. ([#58756](https://github.com/kubernetes/kubernetes/pull/58756), [@wwwtyro](https://github.com/wwwtyro))
* Access to externally managed IP addresses via the kube-apiserver service proxy subresource is no longer allowed by default. This can be re-enabled via the `ServiceProxyAllowExternalIPs` feature gate, but will be disallowed completely in 1.11 ([#57265](https://github.com/kubernetes/kubernetes/pull/57265), [@brendandburns](https://github.com/brendandburns))
* Added support for external cloud providers in kubeadm ([#58259](https://github.com/kubernetes/kubernetes/pull/58259), [@dims](https://github.com/dims))
* rktnetes has been deprecated in favor of rktlet. Please see https://github.com/kubernetes-incubator/rktlet for more information. ([#58418](https://github.com/kubernetes/kubernetes/pull/58418), [@yujuhong](https://github.com/yujuhong))
* Fixes bug finding master replicas in GCE when running multiple Kubernetes clusters ([#58561](https://github.com/kubernetes/kubernetes/pull/58561), [@jesseshieh](https://github.com/jesseshieh))
* Update Calico version to v2.6.6 ([#58482](https://github.com/kubernetes/kubernetes/pull/58482), [@tmjd](https://github.com/tmjd))
* Promoting the apiregistration.k8s.io (aggregation) to GA ([#58393](https://github.com/kubernetes/kubernetes/pull/58393), [@deads2k](https://github.com/deads2k))
* Stability: Make Pod delete event handling of scheduler more robust. ([#58712](https://github.com/kubernetes/kubernetes/pull/58712), [@bsalamat](https://github.com/bsalamat))
* Added support for network spaces in the kubeapi-load-balancer charm ([#58708](https://github.com/kubernetes/kubernetes/pull/58708), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Added support for network spaces in the kubernetes-master charm ([#58704](https://github.com/kubernetes/kubernetes/pull/58704), [@hyperbolic2346](https://github.com/hyperbolic2346))
* update etcd unified version to 3.1.10 ([#54242](https://github.com/kubernetes/kubernetes/pull/54242), [@zouyee](https://github.com/zouyee))
* updates fluentd in fluentd-es-image to fluentd 1.1.0 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525), [@monotek](https://github.com/monotek))
* Support metrics API in `kubectl top` commands. ([#56206](https://github.com/kubernetes/kubernetes/pull/56206), [@brancz](https://github.com/brancz))
* Added support for network spaces in the kubernetes-worker charm ([#58523](https://github.com/kubernetes/kubernetes/pull/58523), [@hyperbolic2346](https://github.com/hyperbolic2346))
* CustomResourceDefinitions: OpenAPI v3 validation schemas containing `$ref`references are no longer permitted (valid references could not be constructed previously because property ids were not permitted either). Before upgrading, ensure CRD definitions do not include those `$ref` fields. ([#58438](https://github.com/kubernetes/kubernetes/pull/58438), [@carlory](https://github.com/carlory))
* Openstack: register metadata.hostname as node name ([#58502](https://github.com/kubernetes/kubernetes/pull/58502), [@dixudx](https://github.com/dixudx))
* Added nginx and default backend images to kubernetes-worker config. ([#58542](https://github.com/kubernetes/kubernetes/pull/58542), [@hyperbolic2346](https://github.com/hyperbolic2346))
* --tls-min-version on kubelet and kube-apiserver allow for configuring minimum TLS versions ([#58528](https://github.com/kubernetes/kubernetes/pull/58528), [@deads2k](https://github.com/deads2k))
* Fixes an issue where the resourceVersion of an object in a DELETE watch event was not the resourceVersion of the delete itself, but of the last update to the object. This could disrupt the ability of clients clients to re-establish watches properly. ([#58547](https://github.com/kubernetes/kubernetes/pull/58547), [@liggitt](https://github.com/liggitt))
* Fixed crash in kubectl cp when path has multiple leading slashes ([#58144](https://github.com/kubernetes/kubernetes/pull/58144), [@tomerf](https://github.com/tomerf))
* kube-apiserver: requests to endpoints handled by unavailable extension API servers (as indicated by an `Available` condition of `false` in the registered APIService) now return `503` errors instead of `404` errors. ([#58070](https://github.com/kubernetes/kubernetes/pull/58070), [@weekface](https://github.com/weekface))
* Correctly handle transient connection reset errors on GET requests from client library. ([#58520](https://github.com/kubernetes/kubernetes/pull/58520), [@porridge](https://github.com/porridge))
* Authentication information for OpenStack cloud provider can now be specified as environment variables ([#58300](https://github.com/kubernetes/kubernetes/pull/58300), [@dims](https://github.com/dims))
* Bump GCE metadata proxy to v0.1.9 to pick up security fixes. ([#58221](https://github.com/kubernetes/kubernetes/pull/58221), [@ihmccreery](https://github.com/ihmccreery))
* - kubeadm now supports CIDR notations in NO_PROXY environment variable ([#53895](https://github.com/kubernetes/kubernetes/pull/53895), [@kad](https://github.com/kad))
* kubeadm now accept `--apiserver-extra-args`, `--controller-manager-extra-args` and `--scheduler-extra-args` to override / specify additional flags for control plane components ([#58080](https://github.com/kubernetes/kubernetes/pull/58080), [@simonferquel](https://github.com/simonferquel))
* Add `--enable-admission-plugin` `--disable-admission-plugin` flags and deprecate `--admission-control`. ([#58123](https://github.com/kubernetes/kubernetes/pull/58123), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
    * Afterwards, don't care about the orders specified in the flags.
* "ExternalTrafficLocalOnly" has been removed from feature gate. It has been a GA feature since v1.7. ([#56948](https://github.com/kubernetes/kubernetes/pull/56948), [@MrHohn](https://github.com/MrHohn))
* GCP: allow a master to not include a metadata concealment firewall rule (if it's not running the metadata proxy). ([#58104](https://github.com/kubernetes/kubernetes/pull/58104), [@ihmccreery](https://github.com/ihmccreery))
* kube-apiserver: fixes loading of `--admission-control-config-file` containing AdmissionConfiguration apiserver.k8s.io/v1alpha1 config object ([#58439](https://github.com/kubernetes/kubernetes/pull/58439), [@liggitt](https://github.com/liggitt))
* Fix issue when using OpenStack config drive for node metadata ([#57561](https://github.com/kubernetes/kubernetes/pull/57561), [@dims](https://github.com/dims))
* Add FSType for CSI volume source to specify filesystems ([#58209](https://github.com/kubernetes/kubernetes/pull/58209), [@NickrenREN](https://github.com/NickrenREN))
* OpenStack cloudprovider: Ensure orphaned routes are removed. ([#56258](https://github.com/kubernetes/kubernetes/pull/56258), [@databus23](https://github.com/databus23))
* Reduce Metrics Server memory requirement ([#58391](https://github.com/kubernetes/kubernetes/pull/58391), [@kawych](https://github.com/kawych))
* Fix a bug affecting nested data volumes such as secret, configmap, etc. ([#57422](https://github.com/kubernetes/kubernetes/pull/57422), [@joelsmith](https://github.com/joelsmith))
* kubectl now enforces required flags at a more fundamental level ([#53631](https://github.com/kubernetes/kubernetes/pull/53631), [@dixudx](https://github.com/dixudx))
* Remove alpha Initializers from kubadm admission control ([#58428](https://github.com/kubernetes/kubernetes/pull/58428), [@dixudx](https://github.com/dixudx))
* Enable ValidatingAdmissionWebhook and MutatingAdmissionWebhook in kubeadm from v1.9 ([#58255](https://github.com/kubernetes/kubernetes/pull/58255), [@dixudx](https://github.com/dixudx))
* Fixed encryption key and encryption provider rotation ([#58375](https://github.com/kubernetes/kubernetes/pull/58375), [@liggitt](https://github.com/liggitt))
* set fsGroup by securityContext.fsGroup in azure file ([#58316](https://github.com/kubernetes/kubernetes/pull/58316), [@andyzhangx](https://github.com/andyzhangx))
* Remove deprecated and unmaintained salt support. kubernetes-salt.tar.gz will no longer be published in the release tarball. ([#58248](https://github.com/kubernetes/kubernetes/pull/58248), [@mikedanese](https://github.com/mikedanese))
* Detach and clear bad disk URI ([#58345](https://github.com/kubernetes/kubernetes/pull/58345), [@rootfs](https://github.com/rootfs))
* Allow version arg in kubeadm upgrade apply to be optional if config file already have version info ([#53220](https://github.com/kubernetes/kubernetes/pull/53220), [@medinatiger](https://github.com/medinatiger))
* feat(fakeclient): push event on watched channel on add/update/delete ([#57504](https://github.com/kubernetes/kubernetes/pull/57504), [@yue9944882](https://github.com/yue9944882))
* Custom resources can now be submitted to and received from the API server in application/yaml format, consistent with other API resources. ([#58260](https://github.com/kubernetes/kubernetes/pull/58260), [@liggitt](https://github.com/liggitt))
* remove spaces from kubectl describe hpa ([#56331](https://github.com/kubernetes/kubernetes/pull/56331), [@shiywang](https://github.com/shiywang))
* fluentd-gcp updated to version 2.0.14. ([#58224](https://github.com/kubernetes/kubernetes/pull/58224), [@zombiezen](https://github.com/zombiezen))
* Instrument the Azure cloud provider for Prometheus monitoring. ([#58204](https://github.com/kubernetes/kubernetes/pull/58204), [@cosmincojocar](https://github.com/cosmincojocar))
* -Add scheduler optimization options, short circuit all predicates if … ([#56926](https://github.com/kubernetes/kubernetes/pull/56926), [@wgliang](https://github.com/wgliang))
* Remove deprecated ContainerVM support from GCE kube-up.  ([#58247](https://github.com/kubernetes/kubernetes/pull/58247), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated kube-push.sh functionality.  ([#58246](https://github.com/kubernetes/kubernetes/pull/58246), [@mikedanese](https://github.com/mikedanese))
* The getSubnetIDForLB() should return subnet id rather than net id. ([#58208](https://github.com/kubernetes/kubernetes/pull/58208), [@FengyunPan](https://github.com/FengyunPan))
* Avoid panic when failing to allocate a Cloud CIDR (aka GCE Alias IP Range).  ([#58186](https://github.com/kubernetes/kubernetes/pull/58186), [@negz](https://github.com/negz))
* Handle Unhealthy devices ([#57266](https://github.com/kubernetes/kubernetes/pull/57266), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* Expose Metrics Server metrics via /metric endpoint. ([#57456](https://github.com/kubernetes/kubernetes/pull/57456), [@kawych](https://github.com/kawych))
* Remove deprecated container-linux support in gce kube-up.sh.  ([#58098](https://github.com/kubernetes/kubernetes/pull/58098), [@mikedanese](https://github.com/mikedanese))
* openstack cinder detach problem is fixed if nova is shutdowned ([#56846](https://github.com/kubernetes/kubernetes/pull/56846), [@zetaab](https://github.com/zetaab))
* Fixes a possible deadlock preventing quota from being recalculated ([#58107](https://github.com/kubernetes/kubernetes/pull/58107), [@ironcladlou](https://github.com/ironcladlou))
* fluentd-es addon: multiline stacktraces are now grouped into one entry automatically ([#58063](https://github.com/kubernetes/kubernetes/pull/58063), [@monotek](https://github.com/monotek))
* GCE: Allows existing internal load balancers to continue using an outdated subnetwork  ([#57861](https://github.com/kubernetes/kubernetes/pull/57861), [@nicksardo](https://github.com/nicksardo))
* ignore images in used by running containers when GC ([#57020](https://github.com/kubernetes/kubernetes/pull/57020), [@dixudx](https://github.com/dixudx))
* Remove deprecated and unmaintained photon-controller kube-up.sh.  ([#58096](https://github.com/kubernetes/kubernetes/pull/58096), [@mikedanese](https://github.com/mikedanese))
* The kubelet flag to run docker containers with a process namespace that is shared between all containers in a pod is now deprecated and will be replaced by a new field in `v1.Pod` that configures this behavior. ([#58093](https://github.com/kubernetes/kubernetes/pull/58093), [@verb](https://github.com/verb))
* fix device name change issue for azure disk: add remount logic ([#57953](https://github.com/kubernetes/kubernetes/pull/57953), [@andyzhangx](https://github.com/andyzhangx))
* The Kubelet now explicitly registers all of its command-line flags with an internal flagset, which prevents flags from third party libraries from unintentionally leaking into the Kubelet's command-line API. Many unintentionally leaked flags are now marked deprecated, so that users have a chance to migrate away from them before they are removed. One previously leaked flag, --cloud-provider-gce-lb-src-cidrs, was entirely removed from the Kubelet's command-line API, because it is irrelevant to Kubelet operation. ([#57613](https://github.com/kubernetes/kubernetes/pull/57613), [@mtaufen](https://github.com/mtaufen))
* Remove deprecated and unmaintained libvirt-coreos kube-up.sh.  ([#58023](https://github.com/kubernetes/kubernetes/pull/58023), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated and unmaintained windows installer.  ([#58020](https://github.com/kubernetes/kubernetes/pull/58020), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated and unmaintained openstack-heat kube-up.sh.  ([#58021](https://github.com/kubernetes/kubernetes/pull/58021), [@mikedanese](https://github.com/mikedanese))
* Fixes authentication problem faced during various vSphere operations. ([#57978](https://github.com/kubernetes/kubernetes/pull/57978), [@prashima](https://github.com/prashima))
* fluentd-gcp updated to version 2.0.13. ([#57789](https://github.com/kubernetes/kubernetes/pull/57789), [@x13n](https://github.com/x13n))
* Add support for cloud-controller-manager in local-up-cluster.sh ([#57757](https://github.com/kubernetes/kubernetes/pull/57757), [@dims](https://github.com/dims))
* Update CSI spec dependency to point to v0.1.0 tag ([#57989](https://github.com/kubernetes/kubernetes/pull/57989), [@NickrenREN](https://github.com/NickrenREN))
* Update kube-dns to Version 1.14.8 that includes only small changes to how Prometheus metrics are collected. ([#57918](https://github.com/kubernetes/kubernetes/pull/57918), [@rramkumar1](https://github.com/rramkumar1))
* Add proxy_read_timeout flag to kubeapi_load_balancer charm. ([#57926](https://github.com/kubernetes/kubernetes/pull/57926), [@wwwtyro](https://github.com/wwwtyro))
* Adding support for Block Volume type to rbd plugin. ([#56651](https://github.com/kubernetes/kubernetes/pull/56651), [@sbezverk](https://github.com/sbezverk))
* Fixes a bug in Heapster deployment for google sink. ([#57902](https://github.com/kubernetes/kubernetes/pull/57902), [@kawych](https://github.com/kawych))
* Forbid unnamed contexts in kubeconfigs. ([#56769](https://github.com/kubernetes/kubernetes/pull/56769), [@dixudx](https://github.com/dixudx))
* Upgrade to etcd client 3.2.13 and grpc 1.7.5 to improve HA etcd cluster stability. ([#57480](https://github.com/kubernetes/kubernetes/pull/57480), [@jpbetz](https://github.com/jpbetz))
* Default scheduler code is moved out of the plugin directory. ([#57852](https://github.com/kubernetes/kubernetes/pull/57852), [@misterikkit](https://github.com/misterikkit))
    * plugin/pkg/scheduler -> pkg/scheduler
    * plugin/cmd/kube-scheduler -> cmd/kube-scheduler
* Bump metadata proxy version to v0.1.7 to pick up security fix. ([#57762](https://github.com/kubernetes/kubernetes/pull/57762), [@ihmccreery](https://github.com/ihmccreery))
* HugePages feature is beta ([#56939](https://github.com/kubernetes/kubernetes/pull/56939), [@derekwaynecarr](https://github.com/derekwaynecarr))
* GCE: support passing kube-scheduler policy config via SCHEDULER_POLICY_CONFIG ([#57425](https://github.com/kubernetes/kubernetes/pull/57425), [@yguo0905](https://github.com/yguo0905))
* Returns an error for non overcommitable resources if they don't have limit field set in container spec. ([#57170](https://github.com/kubernetes/kubernetes/pull/57170), [@jiayingz](https://github.com/jiayingz))
* Update defaultbackend image to 1.4 and deployment apiVersion to apps/v1 ([#57866](https://github.com/kubernetes/kubernetes/pull/57866), [@zouyee](https://github.com/zouyee))
* kubeadm: set kube-apiserver advertise address using downward API ([#56084](https://github.com/kubernetes/kubernetes/pull/56084), [@andrewsykim](https://github.com/andrewsykim))
* CDK nginx ingress is now handled via a daemon set. ([#57530](https://github.com/kubernetes/kubernetes/pull/57530), [@hyperbolic2346](https://github.com/hyperbolic2346))
* The kubelet uses a new release 3.1 of the pause container with the Docker runtime. This version will clean up orphaned zombie processes that it inherits. ([#57517](https://github.com/kubernetes/kubernetes/pull/57517), [@verb](https://github.com/verb))
* Allow kubectl set image|env on a cronjob ([#57742](https://github.com/kubernetes/kubernetes/pull/57742), [@soltysh](https://github.com/soltysh))
* Move local PV negative scheduling tests to integration ([#57570](https://github.com/kubernetes/kubernetes/pull/57570), [@sbezverk](https://github.com/sbezverk))
* fix azure disk not available issue when device name changed ([#57549](https://github.com/kubernetes/kubernetes/pull/57549), [@andyzhangx](https://github.com/andyzhangx))
* Only create Privileged PSP binding during e2e tests if RBAC is enabled. ([#56382](https://github.com/kubernetes/kubernetes/pull/56382), [@mikkeloscar](https://github.com/mikkeloscar))
* RBAC: The system:kubelet-api-admin cluster role can be used to grant full access to the kubelet API ([#57128](https://github.com/kubernetes/kubernetes/pull/57128), [@liggitt](https://github.com/liggitt))
* Allow kubernetes components to react to SIGTERM signal and shutdown gracefully. ([#57756](https://github.com/kubernetes/kubernetes/pull/57756), [@mborsz](https://github.com/mborsz))
* ignore nonexistent ns net file error when deleting container network in case a retry ([#57697](https://github.com/kubernetes/kubernetes/pull/57697), [@dixudx](https://github.com/dixudx))
* check psp HostNetwork in DenyEscalatingExec admission controller. ([#56839](https://github.com/kubernetes/kubernetes/pull/56839), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* The alpha `--init-config-dir` flag has been removed. Instead, use the `--config` flag to reference a kubelet configuration file directly. ([#57624](https://github.com/kubernetes/kubernetes/pull/57624), [@mtaufen](https://github.com/mtaufen))
* Add cache for VM get operation in azure cloud provider ([#57432](https://github.com/kubernetes/kubernetes/pull/57432), [@karataliu](https://github.com/karataliu))
* Fix garbage collection when the controller-manager uses --leader-elect=false ([#57340](https://github.com/kubernetes/kubernetes/pull/57340), [@jmcmeek](https://github.com/jmcmeek))
* iSCSI sessions managed by kubernetes will now explicitly set startup.mode to 'manual' to ([#57475](https://github.com/kubernetes/kubernetes/pull/57475), [@stmcginnis](https://github.com/stmcginnis))
    * prevent automatic login after node failure recovery. This is the default open-iscsi mode, so
    * this change will only impact users who have changed their startup.mode to be 'automatic'
    * in /etc/iscsi/iscsid.conf.
* Configurable liveness probe initial delays for etcd and kube-apiserver in GCE ([#57749](https://github.com/kubernetes/kubernetes/pull/57749), [@wojtek-t](https://github.com/wojtek-t))
* Fixed garbage collection hang ([#57503](https://github.com/kubernetes/kubernetes/pull/57503), [@liggitt](https://github.com/liggitt))
* Fixes controller manager crash in certain vSphere cloud provider environment. ([#57286](https://github.com/kubernetes/kubernetes/pull/57286), [@rohitjogvmw](https://github.com/rohitjogvmw))
* Remove useInstanceMetadata parameter from Azure cloud provider. ([#57647](https://github.com/kubernetes/kubernetes/pull/57647), [@feiskyer](https://github.com/feiskyer))
* Support multiple scale sets in Azure cloud provider. ([#57543](https://github.com/kubernetes/kubernetes/pull/57543), [@feiskyer](https://github.com/feiskyer))
* GCE: Fixes ILB creation on automatic networks with manually created subnetworks. ([#57351](https://github.com/kubernetes/kubernetes/pull/57351), [@nicksardo](https://github.com/nicksardo))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57476](https://github.com/kubernetes/kubernetes/pull/57476), [@misterikkit](https://github.com/misterikkit))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57477](https://github.com/kubernetes/kubernetes/pull/57477), [@misterikkit](https://github.com/misterikkit))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57478](https://github.com/kubernetes/kubernetes/pull/57478), [@misterikkit](https://github.com/misterikkit))
* Allow use resource ID to specify public IP address in azure_loadbalancer ([#53557](https://github.com/kubernetes/kubernetes/pull/53557), [@yolo3301](https://github.com/yolo3301))
* Fixes a bug where if an error was returned that was not an `autorest.DetailedError` we would return `"not found", nil` which caused nodes to go to `NotReady` state. ([#57484](https://github.com/kubernetes/kubernetes/pull/57484), [@brendandburns](https://github.com/brendandburns))
* Add the path '/version/' to the `system:discovery` cluster role. ([#57368](https://github.com/kubernetes/kubernetes/pull/57368), [@brendandburns](https://github.com/brendandburns))
* Fixes issue creating docker secrets with kubectl 1.9 for accessing docker private registries. ([#57463](https://github.com/kubernetes/kubernetes/pull/57463), [@dims](https://github.com/dims))
* adding predicates ordering for the kubernetes scheduler. ([#57168](https://github.com/kubernetes/kubernetes/pull/57168), [@yastij](https://github.com/yastij))
* Free up CPU and memory requested but unused by Metrics Server Pod Nanny. ([#57252](https://github.com/kubernetes/kubernetes/pull/57252), [@kawych](https://github.com/kawych))
* The alpha Accelerators feature gate is deprecated and will be removed in v1.11. Please use device plugins instead. They can be enabled using the DevicePlugins feature gate. ([#57384](https://github.com/kubernetes/kubernetes/pull/57384), [@mindprince](https://github.com/mindprince))
* Fixed dynamic provisioning of GCE PDs to round to the next GB instead of GiB ([#56600](https://github.com/kubernetes/kubernetes/pull/56600), [@edisonxiang](https://github.com/edisonxiang))
* Separate loop and plugin control ([#52371](https://github.com/kubernetes/kubernetes/pull/52371), [@cheftako](https://github.com/cheftako))
* Use old dns-ip mechanism with older cdk-addons. ([#57403](https://github.com/kubernetes/kubernetes/pull/57403), [@wwwtyro](https://github.com/wwwtyro))
* Retry 'connection refused' errors when setting up clusters on GCE. ([#57394](https://github.com/kubernetes/kubernetes/pull/57394), [@mborsz](https://github.com/mborsz))
* Upgrade to etcd client 3.2.11 and grpc 1.7.5 to improve HA etcd cluster stability. ([#57160](https://github.com/kubernetes/kubernetes/pull/57160), [@jpbetz](https://github.com/jpbetz))
* Added the ability to select pods in a chosen node to be drained, based on given pod label-selector ([#56864](https://github.com/kubernetes/kubernetes/pull/56864), [@juanvallejo](https://github.com/juanvallejo))
* Wait for kubedns to be ready when collecting the cluster IP. ([#57337](https://github.com/kubernetes/kubernetes/pull/57337), [@wwwtyro](https://github.com/wwwtyro))
* Use "k8s.gcr.io" for container images rather than "gcr.io/google_containers".  This is just a redirect, for now, so should not impact anyone materially.   ([#54174](https://github.com/kubernetes/kubernetes/pull/54174), [@thockin](https://github.com/thockin))
    * Documentation and tools should all convert to the new name. Users should take note of this in case they see this new name in the system.
* Fix ipvs proxier nodeport eth* assumption ([#56685](https://github.com/kubernetes/kubernetes/pull/56685), [@m1093782566](https://github.com/m1093782566))



# v1.10.0-alpha.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes.tar.gz) | `403b90bfa32f7669b326045a629bd15941c533addcaf0c49d3c3c561da0542f2`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-src.tar.gz) | `266da065e9eddf19d36df5ad325f2f854101a0e712766148e87d998e789b80cf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `5aaa8e294ae4060d34828239e37f37b45fa5a69508374be668965102848626be`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `40a8e3bab11b88a2bb8e748f0b29da806d89b55775508039abe9c38c5f4ab97d`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `e08dde0b561529f0b2bb39c141f4d7b1c943749ef7c1f9779facf5fb5b385d6a`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `76a05d31acaab932ef45c67e1d6c9273933b8bc06dd5ce9bad3c7345d5267702`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `4b833c9e80f3e4ac4958ea0ffb5ae564b31d2a524f6a14e58802937b2b936d73`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `f1484ab75010a2258ed7717b1284d0c139d17e194ac9e391b8f1c0999eec3c2d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `da884f09ec753925b2c1f27ea0a1f6c3da2056855fc88f47929bb3d6c2a09312`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `c486f760c6707fc92d1659d3cbe33d68c03190760b73ac215957ee52f9c19195`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `514c550b7ff85ac33e6ed333bcc06461651fe4004d8b7c12ca67f5dc1d2198bf`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `ddad59222f6a8cb4e88c4330c2a967c4126cb22ac5e0d7126f9f65cca0fb9f45`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `514efd798ce1d7fe4233127f3334a3238faad6c26372a2d457eff02cbe72d756`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `f71f75fb96221f65891fc3e04fd52ae4e5628da8b7b4fbedece3fab4cb650afa`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `a9d8c2386813fd690e60623a6ee1968fe8f0a1a8e13bc5cc12b2caf8e8a862e1`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `21336a5e40aead4e2ec7e744a99d72bf8cb552341f3141abf8f235beb250cd93`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `257e44d38fef83f08990b6b9b5e985118e867c0c33f0e869f0900397b9d30498`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `97bf1210f0595ebf496ca7b000c4367f8a459d97ef72459efc6d0e07a072398f`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `eebcd3c14fb4faeb82ab047a2152db528adc2d9f7b20eef6f5dc58202ebe3124`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `3d4428416c775a0a6463f623286bd2ecdf9240ce901e1fbae180dfb564c53ea1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `5cc96b24fad0ac1779a66f9b136d90e975b07bf619fea905e6c26ac5a4c41168`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `134c13338edf4efcd511f4161742fbaa6dc232965d3d926c3de435e8a080fcbb`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `ae54bf2bbcb99cdcde959140460d0f83c0ecb187d060b594ae9c5349960ab055`

## Changelog since v1.9.0

### Action Required

* [action required] Remove the kubelet's `--cloud-provider=auto-detect` feature ([#56287](https://github.com/kubernetes/kubernetes/pull/56287), [@stewart-yu](https://github.com/stewart-yu))

### Other notable changes

* Fix Heapster configuration and Metrics Server configuration to enable overriding default resource requirements. ([#56965](https://github.com/kubernetes/kubernetes/pull/56965), [@kawych](https://github.com/kawych))
* YAMLDecoder Read now returns the number of bytes read ([#57000](https://github.com/kubernetes/kubernetes/pull/57000), [@sel](https://github.com/sel))
* Retry 'connection refused' errors when setting up clusters on GCE. ([#57324](https://github.com/kubernetes/kubernetes/pull/57324), [@mborsz](https://github.com/mborsz))
* Update kubeadm's minimum supported Kubernetes version in v1.10.x to v1.9.0 ([#57233](https://github.com/kubernetes/kubernetes/pull/57233), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Graduate CPU Manager feature from alpha to beta. ([#55977](https://github.com/kubernetes/kubernetes/pull/55977), [@ConnorDoyle](https://github.com/ConnorDoyle))
* Drop hacks used for Mesos integration that was already removed from main kubernetes repository ([#56754](https://github.com/kubernetes/kubernetes/pull/56754), [@dims](https://github.com/dims))
* Compare correct file names for volume detach operation ([#57053](https://github.com/kubernetes/kubernetes/pull/57053), [@prashima](https://github.com/prashima))
* Improved event generation in volume mount, attach, and extend operations ([#56872](https://github.com/kubernetes/kubernetes/pull/56872), [@davidz627](https://github.com/davidz627))
* GCE: bump COS image version to cos-stable-63-10032-71-0 ([#57204](https://github.com/kubernetes/kubernetes/pull/57204), [@yujuhong](https://github.com/yujuhong))
* fluentd-gcp updated to version 2.0.11. ([#56927](https://github.com/kubernetes/kubernetes/pull/56927), [@x13n](https://github.com/x13n))
* calico-node addon tolerates all NoExecute and NoSchedule taints by default. ([#57122](https://github.com/kubernetes/kubernetes/pull/57122), [@caseydavenport](https://github.com/caseydavenport))
* Support LoadBalancer for Azure Virtual Machine Scale Sets ([#57131](https://github.com/kubernetes/kubernetes/pull/57131), [@feiskyer](https://github.com/feiskyer))
* Makes the kube-dns addon optional so that users can deploy their own DNS solution. ([#57113](https://github.com/kubernetes/kubernetes/pull/57113), [@wwwtyro](https://github.com/wwwtyro))
* Enabled log rotation for load balancer's api logs to prevent running out of disk space. ([#56979](https://github.com/kubernetes/kubernetes/pull/56979), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Remove ScrubDNS interface from cloudprovider. ([#56955](https://github.com/kubernetes/kubernetes/pull/56955), [@feiskyer](https://github.com/feiskyer))
* Fix `etcd-version-monitor` to backward compatibly support etcd 3.1 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus) metrics format. ([#56871](https://github.com/kubernetes/kubernetes/pull/56871), [@jpbetz](https://github.com/jpbetz))
* enable flexvolume on Windows node ([#56921](https://github.com/kubernetes/kubernetes/pull/56921), [@andyzhangx](https://github.com/andyzhangx))
* When using Role-Based Access Control, the "admin", "edit", and "view" roles now have the expected permissions on NetworkPolicy resources. ([#56650](https://github.com/kubernetes/kubernetes/pull/56650), [@danwinship](https://github.com/danwinship))
* Fix the PersistentVolumeLabel controller from initializing the PV labels when it's not the next pending initializer. ([#56831](https://github.com/kubernetes/kubernetes/pull/56831), [@jhorwit2](https://github.com/jhorwit2))
* kube-apiserver: The external hostname no longer use the cloud provider API to select a default. It can be set explicitly using --external-hostname, if needed. ([#56812](https://github.com/kubernetes/kubernetes/pull/56812), [@dims](https://github.com/dims))
* Use GiB unit for creating and resizing volumes for Glusterfs ([#56581](https://github.com/kubernetes/kubernetes/pull/56581), [@gnufied](https://github.com/gnufied))
* PersistentVolume flexVolume sources can now reference secrets in a namespace other than the PersistentVolumeClaim's namespace. ([#56460](https://github.com/kubernetes/kubernetes/pull/56460), [@liggitt](https://github.com/liggitt))
* Scheduler skips pods that use a PVC that either does not exist or is being deleted. ([#55957](https://github.com/kubernetes/kubernetes/pull/55957), [@jsafrane](https://github.com/jsafrane))
* Fixed a garbage collection race condition where objects with ownerRefs pointing to cluster-scoped objects could be deleted incorrectly. ([#57211](https://github.com/kubernetes/kubernetes/pull/57211), [@liggitt](https://github.com/liggitt))
* Kubectl explain now prints out the Kind and API version of the resource being explained ([#55689](https://github.com/kubernetes/kubernetes/pull/55689), [@luksa](https://github.com/luksa))
* api-server provides specific events when unable to repair a service cluster ip or node port ([#54304](https://github.com/kubernetes/kubernetes/pull/54304), [@frodenas](https://github.com/frodenas))
* Added docker-logins config to kubernetes-worker charm ([#56217](https://github.com/kubernetes/kubernetes/pull/56217), [@Cynerva](https://github.com/Cynerva))
* delete useless params containerized ([#56146](https://github.com/kubernetes/kubernetes/pull/56146), [@jiulongzaitian](https://github.com/jiulongzaitian))
* add mount options support for azure disk ([#56147](https://github.com/kubernetes/kubernetes/pull/56147), [@andyzhangx](https://github.com/andyzhangx))
* Use structured generator for kubectl autoscale  ([#55913](https://github.com/kubernetes/kubernetes/pull/55913), [@wackxu](https://github.com/wackxu))
* K8s supports cephfs fuse mount. ([#55866](https://github.com/kubernetes/kubernetes/pull/55866), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* COS: Keep the docker network checkpoint ([#54805](https://github.com/kubernetes/kubernetes/pull/54805), [@yujuhong](https://github.com/yujuhong))
* Fixed documentation typo in IPVS README. ([#56578](https://github.com/kubernetes/kubernetes/pull/56578), [@shift](https://github.com/shift))


See the [Releases Page](https://github.com/kubernetes/kubernetes/releases) for older releases.

Release notes of older releases can be found in:

- [CHANGELOG-1.2.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.2.md)
- [CHANGELOG-1.3.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.3.md)
- [CHANGELOG-1.4.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.4.md)
- [CHANGELOG-1.5.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.5.md)
- [CHANGELOG-1.6.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.6.md)
- [CHANGELOG-1.7.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.7.md)
- [CHANGELOG-1.8.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.8.md)
- [CHANGELOG-1.9.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md)

[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/CHANGELOG.md?pixel)]()

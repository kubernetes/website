---
layout: blog
title: 'Kubernetes v1.36: Prepare for breaking changes in SELinux volume labelling'
draft: true
slug: breaking-changes-in-selinux-volume-labeling
author: >
  [Jan Šafránek](https://github.com/jsafrane) (Red Hat)
---

# Placeholder
Goal:

1. Warn users that use SELinux that breaking change is very likely coming in 1.37. They have some homework in 1.36 to make sure their applications keep working after upgrade to 1.37
1. Calm down users that don't use SELinux, nothing changes for them.

Proposed content:

1. Describe how SELinux works today.
1. Describe what we're improving.
1. Describe what breaks.
1. Describe how to identify pods that could break in 1.37
1. Describe how to fix those pods or opt-out from the new relabelling in 1.36 to ensure a smooth uprade to 1.37.

See [the KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling) and especially its [Story 3: cluster upgrade](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling#story-3-cluster-upgrade). `n` is 1.36 (the last version without breaking changes) and `M` is 1.37.

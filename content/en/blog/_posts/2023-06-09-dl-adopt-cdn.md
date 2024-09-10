---
layout: blog
title: "dl.k8s.io to adopt a Content Delivery Network"
date: 2023-06-09
slug: dl-adopt-cdn
author: >
  Arnaud Meukam (VMware),
  Hannah Aubry (Fastly),
  Frederico Muñoz (SAS Institute)
---

We're happy to announce that dl.k8s.io, home of the official Kubernetes
binaries, will soon be powered by [Fastly](https://www.fastly.com).

Fastly is known for its high-performance content delivery network (CDN) designed
to deliver content quickly and reliably around the world. With its powerful
network, Fastly will help us deliver official Kubernetes binaries to users
faster and more reliably than ever before.

The decision to use Fastly was made after an extensive evaluation process in
which we carefully evaluated several potential content delivery network
providers. Ultimately, we chose Fastly because of their commitment to the open
internet and proven track record of delivering fast and secure digital
experiences to some of the most known open source projects (through their [Fast
Forward](https://www.fastly.com/fast-forward) program).

## What you need to know about this change

- On Monday, July 24th, the IP addresses and backend storage associated with the
  dl.k8s.io domain name will change.
- The change will not impact the vast majority of users since the domain
  name will remain the same.
- If you restrict access to specific IP ranges, access to the dl.k8s.io domain
  could stop working.

If you think you may be impacted or want to know more about this change,
please keep reading.

## Why are we making this change

The official Kubernetes binaries site, dl.k8s.io, is used by thousands of users
all over the world, and currently serves _more than 5 petabytes of binaries each
month_. This change will allow us to improve access to those resources by
leveraging a world-wide CDN.

## Does this affect dl.k8s.io only, or are other domains also affected?

Only dl.k8s.io will be affected by this change.

## My company specifies the domain names that we are allowed to be accessed. Will this change affect the domain name?

No, the domain name (`dl.k8s.io`) will remain the same: no change will be
necessary, and access to the Kubernetes release binaries site should not be
affected.

## My company uses some form of IP filtering. Will this change affect access to the site?

If IP-based filtering is in place, it’s possible that access to the site will be
affected when the new IP addresses become active.

## If my company doesn’t use IP addresses to restrict network traffic, do we need to do anything?

No, the switch to the CDN should be transparent.

## Will there be a dual running period?

**No, it is a cutover.** You can, however, test your networks right now to check
if they can route to the new public IP addresses from Fastly.  You should add
the new IPs to your network's `allowlist` before July 24th. Once the transfer is
complete, ensure your networks use the new IP addresses to connect to
the `dl.k8s.io` service.

## What are the new IP addresses?

If you need to manage an allow list for downloads, you can get the ranges to
match from the Fastly API, in JSON: [public IP address
ranges](https://api.fastly.com/public-ip-list).  You don't need any credentials
to download that list of ranges.

## What next steps would you recommend?

If you have IP-based filtering in place, we recommend the following course of
action **before July, 24th**:

- Add the new IP addresses to your allowlist.
- Conduct tests with your networks/firewall to ensure your networks can route to
  the new IP addresses.

After the change is made, we recommend double-checking that HTTP calls are
accessing dl.k8s.io with the new IP addresses.

## What should I do if I detect some abnormality after the cutover date?

If you encounter any weirdness during binaries download, please [open an
issue](https://github.com/kubernetes/k8s.io/issues/new/choose).

---
title: NFTablesNetlink
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Allow kube-proxy in `nftables` mode to use netlink directly for nftables operations,
instead of running the `nft` command-line tool.

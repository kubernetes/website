---
title: কুবারনেটিস রিলিজ সাইকেল
type: docs
auto_generated: true
---

<!-- THIS CONTENT IS AUTO-GENERATED via ./scripts/releng/update-release-info.sh in kubernetes/website -->

{{< warning >}}
এই কনটেন্ট স্বয়ংক্রিয়ভাবে তৈরি এবং লিঙ্কগুলি কাজ নাও করতে পারে৷ উকুমেন্টটির সোর্স অবস্থিত [এখানে](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
{{< /warning >}}

# টার্গেটিং এনহ্যান্সমেন্টস, ইস্যু এবং PRs মাইলস্টোন রিলিজের জন্য

এই ডকুমেন্টটি ফোকাস করা কুবারনেটিস ডেভেলপার এবং কন্ট্রিবিউটরদের জন্য যাদের
একটি এনহ্যান্সমেন্ট, ইস্যু, অথবা পুল রিকুয়েস্ট তৈরি করতে হয় যা লক্ষ্য করে একটি নির্দিষ্ট 
মাইলফলক।

- [TL;DR](#tldr)
  - [Normal Dev (Weeks 1-11)](#normal-dev-weeks-1-11)
  - [Code Freeze (Weeks 12-14)](#code-freeze-weeks-12-14)
  - [Post-Release (Weeks 14+)](#post-release-weeks-14+)
- [Definitions](#definitions)
- [The Release Cycle](#the-release-cycle)
- [Removal Of Items From The Milestone](#removal-of-items-from-the-milestone)
- [Adding An Item To The Milestone](#adding-an-item-to-the-milestone)
  - [Milestone Maintainers](#milestone-maintainers)
  - [Feature additions](#feature-additions)
  - [Issue additions](#issue-additions)
  - [PR Additions](#pr-additions)
- [Other Required Labels](#other-required-labels)
  - [SIG Owner Label](#sig-owner-label)
  - [Priority Label](#priority-label)
  - [Issue/PR Kind Label](#issuepr-kind-label)

The process for shepherding enhancements, issues, and pull requests into a
Kubernetes release spans multiple stakeholders:

- the enhancement, issue, and pull request owner(s)
- SIG leadership
- the [Release Team][release-team]

ওয়ার্কফ্লো এবং ইন্টারেকশন সম্পর্কিত তথ্য নীচে বর্ণিত হয়েছে।

As the owner of an enhancement, issue, or pull request (PR), it is your
responsibility to ensure release milestone requirements are met. Automation and
the Release Team will be in contact with you if updates are required, but
inaction can result in your work being removed from the milestone. Additional
requirements exist when the target milestone is a prior release (see
[cherry pick process][cherry-picks] for more information).

---
title: Patch Releases
type: docs
---

Schedule and team contact information for Kubernetes patch releases.

For general information about Kubernetes release cycle, see the
[release process description].

## Cadence

Our typical patch release cadence is monthly. It is
commonly a bit faster (1 to 2 weeks) for the earliest patch releases
after a 1.X minor release. Critical bug fixes may cause a more
immediate release outside of the normal cadence. We also aim to not make
releases during major holiday periods.

## Contact

See the [Release Managers page][release-managers] for full contact details on the Patch Release Team.

Please give us a business day to respond - we may be in a different timezone!

In between releases the team is looking at incoming cherry pick
requests on a weekly basis. The team will get in touch with
submitters via GitHub PR, SIG channels in Slack, and direct messages
in Slack and [email](mailto:release-managers-private@kubernetes.io)
if there are questions on the PR.

## Cherry picks

Please follow the [cherry pick process][cherry-picks].

Cherry picks must be merge-ready in GitHub with proper labels (e.g.,
`approved`, `lgtm`, `release-note`) and passing CI tests ahead of the
cherry pick deadline. This is typically two days before the target
release, but may be more. Earlier PR readiness is better, as we
need time to get CI signal after merging your cherry picks ahead
of the actual release.

Cherry pick PRs which miss merge criteria will be carried over and tracked
for the next patch release.

## Support Period

In accordance with the [yearly support KEP][yearly-support], the Kubernetes
Community will support active patch release series for a period of roughly
fourteen (14) months.

The first twelve months of this timeframe will be considered the standard
period.

Towards the end of the twelve month, the following will happen:

- [Release Managers][release-managers] will cut a release
- The patch release series will enter maintenance mode

During the two-month maintenance mode period, Release Managers may cut
additional maintenance releases to resolve:

- CVEs (under the advisement of the Security Response Committee)
- dependency issues (including base image updates)
- critical core component issues

At the end of the two-month maintenance mode period, the patch release series
will be considered EOL (end of life) and cherry picks to the associated branch
are to be closed soon afterwards.

Note that the 28th of the month was chosen for maintenance mode and EOL target
dates for simplicity (every month has it).

## Upcoming Monthly Releases

Timelines may vary with the severity of bug fixes, but for easier planning we
will target the following monthly release points. Unplanned, critical
releases may also occur in between these.

| Monthly Patch Release | Cherry Pick Deadline | Target date |
| --------------------- | -------------------- | ----------- |
| August 2022           | 2022-08-12           | 2022-08-17  |
| September 2022        | 2022-09-09           | 2022-09-14  |
| October 2022          | 2022-10-07           | 2022-10-12  |

## Detailed Release History for Active Branches

### 1.24

Next patch release is **1.24.4**

End of Life for **1.24** is **2023-07-28**

| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |
|---------------|----------------------|-------------|------|
| 1.24.4        | 2022-08-12           | 2022-08-17  |      |
| 1.24.3        | 2022-07-08           | 2022-07-13  |      |
| 1.24.2        | 2022-06-10           | 2022-06-15  |      |
| 1.24.1        | 2022-05-20           | 2022-05-24  |      |

### 1.23

Next patch release is **1.23.10**

**1.23** enters maintenance mode on **2022-12-28**.

End of Life for **1.23** is **2023-02-28**.

| Patch Release | Cherry Pick Deadline | Target Date | Note |
|---------------|----------------------|-------------|------|
| 1.23.10       | 2022-08-12           | 2022-08-17  |      |
| 1.23.9        | 2022-07-08           | 2022-07-13  |      |
| 1.23.8        | 2022-06-10           | 2022-06-15  |      |
| 1.23.7        | 2022-05-20           | 2022-05-24  |      |
| 1.23.6        | 2022-04-08           | 2022-04-13  |      |
| 1.23.5        | 2022-03-11           | 2022-03-16  |      |
| 1.23.4        | 2022-02-11           | 2022-02-16  |      |
| 1.23.3        | 2022-01-24           | 2022-01-25  | [Out-of-Band Release](https://groups.google.com/a/kubernetes.io/g/dev/c/Xl1sm-CItaY) |
| 1.23.2        | 2022-01-14           | 2022-01-19  |      |
| 1.23.1        | 2021-12-14           | 2021-12-16  |      |

### 1.22

Next patch release is **1.22.13**

**1.22** enters maintenance mode on **2022-08-28**

End of Life for **1.22** is **2022-10-28**

| Patch Release | Cherry Pick Deadline | Target Date | Note |
|---------------|----------------------|-------------|------|
| 1.22.13       | 2022-08-12           | 2022-08-17  |      |
| 1.22.12       | 2022-07-08           | 2022-07-13  |      |
| 1.22.11       | 2022-06-10           | 2022-06-15  |      |
| 1.22.10       | 2022-05-20           | 2022-05-24  |      |
| 1.22.9        | 2022-04-08           | 2022-04-13  |      |
| 1.22.8        | 2022-03-11           | 2022-03-16  |      |
| 1.22.7        | 2022-02-11           | 2022-02-16  |      |
| 1.22.6        | 2022-01-14           | 2022-01-19  |      |
| 1.22.5        | 2021-12-10           | 2021-12-15  |      |
| 1.22.4        | 2021-11-12           | 2021-11-17  |      |
| 1.22.3        | 2021-10-22           | 2021-10-27  |      |
| 1.22.2        | 2021-09-10           | 2021-09-15  |      |
| 1.22.1        | 2021-08-16           | 2021-08-19  |      |

## Non-Active Branch History

These releases are no longer supported.

| Minor Version | Final Patch Release | EOL Date   | Note                                                                   |
| ------------- | ------------------- | ---------- | ---------------------------------------------------------------------- |
| 1.21          | 1.21.14             | 2022-06-28 |                                                                        |
| 1.20          | 1.20.15             | 2022-02-28 |                                                                        |
| 1.19          | 1.19.16             | 2021-10-28 |                                                                        |
| 1.18          | 1.18.20             | 2021-06-18 | Created to resolve regression introduced in 1.18.19                    |
| 1.18          | 1.18.19             | 2021-05-12 | [Regression](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs) |
| 1.17          | 1.17.17             | 2021-01-13 |                                                                        |
| 1.16          | 1.16.15             | 2020-09-02 |                                                                        |
| 1.15          | 1.15.12             | 2020-05-06 |                                                                        |
| 1.14          | 1.14.10             | 2019-12-11 |                                                                        |
| 1.13          | 1.13.12             | 2019-10-15 |                                                                        |
| 1.12          | 1.12.10             | 2019-07-08 |                                                                        |
| 1.11          | 1.11.10             | 2019-05-01 |                                                                        |
| 1.10          | 1.10.13             | 2019-02-13 |                                                                        |
| 1.9           | 1.9.11              | 2018-09-29 |                                                                        |
| 1.8           | 1.8.15              | 2018-07-12 |                                                                        |
| 1.7           | 1.7.16              | 2018-04-04 |                                                                        |
| 1.6           | 1.6.13              | 2017-11-23 |                                                                        |
| 1.5           | 1.5.8               | 2017-10-01 |                                                                        |
| 1.4           | 1.4.12              | 2017-04-21 |                                                                        |
| 1.3           | 1.3.10              | 2016-11-01 |                                                                        |
| 1.2           | 1.2.7               | 2016-10-23 |                                                                        |

[cherry-picks]: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[release process description]: /releases/release
[yearly-support]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md

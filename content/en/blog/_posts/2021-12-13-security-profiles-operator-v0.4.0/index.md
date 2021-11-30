---
layout: blog
title: "What's new in Security Profiles Operator v0.4.0"
date: 2021-12-13
slug: security-profiles-operator
---

**Authors:** Jakub Hrozek, Juan Antonio Osorio, Paulo Gomes, Sascha Grunert

---

The [Security Profiles Operator](https://sigs.k8s.io/security-profiles-operator)
is an out-of-tree Kubernetes enhancement to make the management of
[seccomp](https://en.wikipedia.org/wiki/Seccomp),
[SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) and
[AppArmor](https://en.wikipedia.org/wiki/AppArmor) profiles easier and more
convenient. We're happy to announce that we recently [released
v0.4.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.4.0)
of the operator, which contains a ton of new features, fixes and usability
improvements.

## What's new

<!--
Current release notes as list of things to cover:

## Changes by Kind

### API Change

- A v1alpha2 version of the SelinuxProfile object has been introduced. This
  removes the raw CIL from the object itself and instead adds a simple policy
  language to ease the writing and parsing experience.

  Alongside, a RawSelinuxProfile object was also introduced. This contains a wrapped
  and raw representation of the policy. This was intended for folks to be able to take
  their existing policies into use as soon as possible. However, on validations are done here. (#675, @JAORMX)

- Add CRD type to represent AppArmor profiles. (#643, @pjbgf)
- Change seccomp profile type `Architectures` to `[]Arch` from `[]*Arch` (#671, @saschagrunert)
- Graduate seccomp profile API from `v1alpha1` to `v1beta1` (#674, @saschagrunert)

### Feature

- Add arm64 support for retrieving the correct syscall names within the log enricher. (#539, @saschagrunert)
- Add retry functionality to log enricher if container ID is still empty during pod creation. (#491, @saschagrunert)
- Added CLI flag `-V` and environment variable parsing `SPO_VERBOSITY` to set the logging verbosity. (#657, @saschagrunert)
- Added `metrics-token` secret to the operator namespace for metrics client retrieval. (#457, @saschagrunert)
- Added `metrics` service endpoint to the operator namespace, which now serves the `security_profiles_operator_seccomp_profile` metric. (#422, @saschagrunert)
- Added `seccomp_profile_error_total` metrics. (#461, @saschagrunert)
- Added `verbosity` option to spod configuration. Currently supports `0` (the default) and `1` for enhanced verbosity. (#665, @saschagrunert)
- Added automatic ServiceMonitor deployment if the CRD is available within the cluster. (#458, @saschagrunert)
- Added container ID caching to log enricher for performance reasons. (#509, @saschagrunert)
- Added libseccomp version output to `version` subcommand output. (#524, @saschagrunert)
- Added liveness and startup probe to operator daemon set to streamline the operator stratup. (#430, @saschagrunert)
- Added log enricher metrics `security_profiles_operator_seccomp_profile_audit_total` and `security_profiles_operator_selinux_profile_audit_total`. (#492, @saschagrunert)
- Added logging to non-root-enabler (#486, @saschagrunert)
- Added name=spod label to metrics service. (#456, @saschagrunert)
- Added single TLS certificate for serving metrics. See `installation-usage.md` for more details. (#451, @saschagrunert)
- Added support for recording profiles by using the log enricher. (#513, @saschagrunert)
- Added syslog support for log enricher. (#531, @saschagrunert)
- Added the seccomp profile architecture to the `bpf` and `log` recorder. (#670, @saschagrunert)
- Automatically mount /dev/kmsg for log enricher usage if running with CRI-O and an allowed `io.kubernetes.cri-o.Devices` annotation. (#479, @saschagrunert)
- Deploying kube-rbac-proxy sidecar in SPOD for exposing metrics via the new `metrics-spod` and `metrics-controller-runtime` services. (#424, @saschagrunert)
- SPO's ProfileRecording CRD ProfileRecording which allows the admin to
  record workloads and create security policies was extended to allow
  recording SELinux profiles as well. In order to record a SELinux profile
  for a workload, set ProfileRecording.Spec.Kind to SelinuxProfile. (#592, @jhrozek)
- Switched to unix domain sockets for the GRPC servers. (#631, @saschagrunert)
- This patch re-adds the no_bpf build tag triggered by the BPF_ENABLED=0 tag
  environment variable if set to 0. A developer can then build SPO without the
  built-in BPF support by running:
  BPF_ENABLED=0 make
  This is useful to build SPO in environments with older dependencies
  that don't allow building the in-tree BPF-based recorder. (#690, @jhrozek)
- Update example base profiles to their recent runtime versions. (#543, @saschagrunert)
- `spod` can load and unload AppArmor profiles into clusters host servers.
  `spod` now runs as `root` and `privileged` when apparmor is enabled. (#680, @pjbgf)

### Documentation

- Added documentation about how to record profiles by using the log enricher. (#521, @saschagrunert)
- Added documentation how to use the automatically deployed `ServiceMonitor` with OpenShift as example platform. (#460, @saschagrunert)
- Added log enricher documentation to installation-usage.md. (#498, @saschagrunert)
- Added metrics documentation to `installation-usage.md`. (#449, @saschagrunert)
- Added table of contents to installation documentation. (#493, @saschagrunert)
- Changed documentation to reference `main` instead of `master` as default git branch. (#706, @saschagrunert)
- Fixed header links containing source code in `installation-usage.md` (#606, @saschagrunert)

### Bug or Regression

- Do not retry container ID retrieval on container creation failures any more. (#612, @saschagrunert)

### Other (Cleanup or Flake)

- An OpenShift deployment manifest was included in deploy/openshift.yaml (#695, @JAORMX)
- Bumps
  golang.org/x/text to fix advisory GO-2021-0113 (#655, @pjbgf)
- Log enricher now requires running auditd (`/var/log/audit/audit.log`) (#487, @saschagrunert)
- Log libseccomp version on operator startup. (#556, @saschagrunert)
- Removed CPU limits from SPOD and added resource requests/limits to manager and webhook. (#550, @saschagrunert)
- The directory /etc/selinux.d used to be mounted on the hosts in previous SPO versions.
  This is no longer the case, the directory was converted to an emptyDir instead,
  reducing the number of required host mounts. (#698, @jhrozek)
- The securityprofilenodestatus CR now links with the security profile its status
  it represents using label spo.x-k8s.io/profile-id. If the profile name is less
  than 64 characters long, then the label value is the profile name, otherwise it's
  kind-sha1hashofthename.

  This change supports profile names whose names are over 64 characters. (#685, @jhrozek)

- Update cert-manager to v1.5.3 (#577, @saschagrunert)

### Uncategorized

- Add Metrics for SELinux profiles (#470, @mrogers950)
- Added new seccomp profile recorder `bpf`. (#618, @saschagrunert)
-->

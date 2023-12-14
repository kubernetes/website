---
# Removed from Kubernetes
title: RootCAConfigMap
content_type: feature_gate

_build:
  list: never
  render: false
---
Configure the `kube-controller-manager` to publish a
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `kube-root-ca.crt`
to every namespace. This ConfigMap contains a CA bundle used for verifying connections
to the kube-apiserver. See
[Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
for more details.

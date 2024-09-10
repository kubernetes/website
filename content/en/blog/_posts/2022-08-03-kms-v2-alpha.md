---
layout: blog
title: "Kubernetes 1.25: KMS V2 Improvements"
date: 2022-09-09
slug: kms-v2-improvements
author: >
  Anish Ramasekar,
  Rita Zhang,
  Mo Khan,
  Xander Grzywinski (Microsoft)
---

With Kubernetes v1.25, SIG Auth is introducing a new `v2alpha1` version of the Key Management Service (KMS) API. There are a lot of improvements in the works, and we're excited to be able to start down the path of a new and improved KMS!

## What is KMS?
One of the first things to consider when securing a Kubernetes cluster is encrypting persisted API data at rest. KMS provides an interface for a provider to utilize a key stored in an external key service to perform this encryption.

Encryption at rest using KMS v1 has been a feature of Kubernetes since version v1.10, and is currently in beta as of version v1.12.

## What’s new in `v2alpha1`?
While the original v1 implementation has been successful in helping Kubernetes users encrypt etcd data, it did fall short in a few key ways:

1. **Performance:** When starting a cluster, all resources are serially fetched and decrypted to fill the `kube-apiserver` cache. When using a KMS plugin, this can cause slow startup times due to the large number of requests made to the remote vault. In addition, there is the potential to hit API rate limits on external key services depending on how many encrypted resources exist in the cluster.
1. **Key Rotation:** With KMS v1, rotation of a key-encrypting key is a manual and error-prone process. It can be difficult to determine what encryption keys are in-use on a cluster.
1. **Health Check & Status:** Before the KMS v2 API, the `kube-apiserver` was forced to make encrypt and decrypt calls as a proxy to determine if the KMS plugin is healthy. With cloud services these operations usually cost actual money with cloud service. Whatever the cost, those operations on their own do not provide a holistic view of the service's health.
1. **Observability:** Without some kind of trace ID, it's has been difficult to correlate events found in the various logs across `kube-apiserver`, KMS, and KMS plugins.

The KMS v2 enhancement attempts to address all of these shortcomings, though not all planned features are implemented in the initial alpha release. Here are the improvements that arrived in Kubernetes v1.25:

1. Support for KMS plugins that use a key hierarchy to reduce network requests made to the remote vault. To learn more, check out the [design details for how a KMS plugin can leverage key hierarchy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#key-hierachy).
1. Extra metadata is now tracked to allow a KMS plugin to communicate what key it is currently using with the `kube-apiserver`, allowing for rotation without API server restart. Data stored in etcd follows a more standard proto format to allow external tools to observe its state. To learn more, check out the [details for metadata](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#metadata).
1. A dedicated status API is used to communicate the health of the KMS plugin with the API server. To learn more, check out the [details for status API](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#status-api).
1. To improve observability, a new `UID` field is included in `EncryptRequest` and `DecryptRequest` of the v2 API. The UID is generated for each envelope operation. To learn more, check out the [details for observability](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#Observability).

### Sequence Diagram

#### Encrypt Request

<!-- source - https://mermaid.ink/img/pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O)](https://mermaid.live/edit#pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O -->

{{< figure src="/images/blog/2022-09-09-kubernetes-1.25-kms-v2-improvements/kubernetes-1.25-encryption.svg" alt="Sequence diagram for KMSv2 Encrypt" class="diagram-large" >}}

#### Decrypt Request

<!-- source - https://mermaid.ink/img/pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O)](https://mermaid.live/edit#pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O ](https://mermaid.ink/img/pako:eNrVVU2P0zAQ_SsjoyggdXcrEHuIVr3QHlBvgDhFQtN40lhN7GA7C1GU_47jdOuUhi4HkKCn1DPzPkbPcscyxYklLIo6IYVNoIttQRXFCcQ7NBQvYDz4jFrgriTjKh3EtRYV6vadKpUeel-8eX2f0duh_Vj6RN9tKOd57qHODpfLZdz3fRSl0tDXhmRGa4F7jVUqwf1q1FZkokZp4dDsCGthSD-SnilXpi6bvZCXJUdJWmLpWsZiFIHIoVQZlrDdbEFIQCmVRSuUNAtwfiU0Rsg9FII06qxox0ksHZzMdFtb4lME8xPI2A7nqm9Wq5PMBDh5HNCDc2PhYafvVtClzMkuSA-bSlkCKXsIjOvNdpWyBRyo_SK4L46fsFfWOtVovHVQOWzGqQ9kaieI_NzIkbKpUsfhSJ2w20GslmTJ3Ap1593dHOhwoeLk22H2_ZPVK9uRkGFWUOj0q3laxfxanFX4JmwRcMI4lYZmmZyr32CbBCLwBRDPqqlSls5pPXWYndU9lfPH_F4Z91avk5Pk4c8ZzDScibNsGy0nuRyDE4JZlyjkJJeBdSaXYYHwfv2Xw_fLPLh7eYzEzN38b27n9I49m-P1ZYLhpcGKYEcFPgqlBxlWcWxfTTLyfKzX00z9gzE6hUFytmAV6QoFdy9bNxynzD9iIyOnHJvS0aeyd61NzdHShgurNEtydGFaMGys-tjKjCVWN_TUdHydjl39D0CLbdk)](https://mermaid.live/edit#pako:eNrVVU2P0zAQ_SsjoyggdXcrEHuIVr3QHlBvgDhFQtN40lhN7GA7C1GU_47jdOuUhi4HkKCn1DPzPkbPcscyxYklLIo6IYVNoIttQRXFCcQ7NBQvYDz4jFrgriTjKh3EtRYV6vadKpUeel-8eX2f0duh_Vj6RN9tKOd57qHODpfLZdz3fRSl0tDXhmRGa4F7jVUqwf1q1FZkokZp4dDsCGthSD-SnilXpi6bvZCXJUdJWmLpWsZiFIHIoVQZlrDdbEFIQCmVRSuUNAtwfiU0Rsg9FII06qxox0ksHZzMdFtb4lME8xPI2A7nqm9Wq5PMBDh5HNCDc2PhYafvVtClzMkuSA-bSlkCKXsIjOvNdpWyBRyo_SK4L46fsFfWOtVovHVQOWzGqQ9kaieI_NzIkbKpUsfhSJ2w20GslmTJ3Ap1593dHOhwoeLk22H2_ZPVK9uRkGFWUOj0q3laxfxanFX4JmwRcMI4lYZmmZyr32CbBCLwBRDPqqlSls5pPXWYndU9lfPH_F4Z91avk5Pk4c8ZzDScibNsGy0nuRyDE4JZlyjkJJeBdSaXYYHwfv2Xw_fLPLh7eYzEzN38b27n9I49m-P1ZYLhpcGKYEcFPgqlBxlWcWxfTTLyfKzX00z9gzE6hUFytmAV6QoFdy9bNxynzD9iIyOnHJvS0aeyd61NzdHShgurNEtydGFaMGys-tjKjCVWN_TUdHydjl39D0CLbdk -->
{{< figure src="/images/blog/2022-09-09-kubernetes-1.25-kms-v2-improvements/kubernetes-1.25-decryption.svg" alt="Sequence diagram for KMSv2 Decrypt" class="diagram-large" >}}

## What’s next?
For Kubernetes v1.26, we expect to ship another alpha version. As of right now, the alpha API will be ready to be used by KMS plugin authors. We hope to include a reference plugin implementation with the next release, and you'll be able to try out the feature at that time.

You can learn more about KMS v2 by reading [Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/). You can also follow along on the [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/3299-kms-v2-improvements/#readme) to track progress across the coming Kubernetes releases.

## How to get involved
If you are interested in getting involved in the development of this feature or would like to share feedback, please reach out on the [#sig-auth-kms-dev](https://kubernetes.slack.com/archives/C03035EH4VB) channel on Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings), held every-other Wednesday.

## Acknowledgements
This feature has been an effort driven by contributors from several different companies. We would like to extend a huge thank you to everyone that contributed their time and effort to help make this possible.

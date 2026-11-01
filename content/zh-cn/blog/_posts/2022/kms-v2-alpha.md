---
layout: blog
title: "Kubernetes 1.25：KMS V2 改进"
date: 2022-09-09
slug: kms-v2-improvements
author: >
  Anish Ramasekar,
  Rita Zhang,
  Mo Khan,
  Xander Grzywinski (Microsoft)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---

<!--
layout: blog
title: "Kubernetes 1.25: KMS V2 Improvements"
date: 2022-09-09
slug: kms-v2-improvements
author: >
  Anish Ramasekar,
  Rita Zhang,
  Mo Khan,
  Xander Grzywinski (Microsoft)
-->

<!--
With Kubernetes v1.25, SIG Auth is introducing a new `v2alpha1` version of the Key Management Service (KMS) API. There are a lot of improvements in the works, and we're excited to be able to start down the path of a new and improved KMS!
-->
随着 Kubernetes v1.25 发布，SIG Auth 为密钥管理服务（Key Management Service，KMS）API
引入了新的 `v2alpha1` 版本。我们正在推进多项改进，
很高兴能由此开启全新、更完善的 KMS 之路！

<!--
## What is KMS?
One of the first things to consider when securing a Kubernetes cluster is encrypting persisted API data at rest. KMS provides an interface for a provider to utilize a key stored in an external key service to perform this encryption.

Encryption at rest using KMS v1 has been a feature of Kubernetes since version v1.10, and is currently in beta as of version v1.12.
-->
## KMS 是什么？ {#what-is-kms}

保障 Kubernetes 集群安全时，首先要考虑的事项之一就是对持久化的 API 数据进行静态加密。
KMS 提供一种接口，允许驱动使用存储在外部密钥服务中的密钥执行加密。

使用 KMS v1 进行静态加密从 Kubernetes v1.10 起就是一项特性，
自 v1.12 起处于 Beta 阶段。

<!--
## What’s new in `v2alpha1`?
While the original v1 implementation has been successful in helping Kubernetes users encrypt etcd data, it did fall short in a few key ways:
-->
## `v2alpha1` 中有什么新内容？ {#whats-new-in-v2alpha1}

最初的 v1 实现虽然成功帮助 Kubernetes 用户加密了 etcd 数据，
但仍在几个关键方面有所不足：

<!--
1. **Performance:** When starting a cluster, all resources are serially fetched and decrypted to fill the `kube-apiserver` cache. When using a KMS plugin, this can cause slow startup times due to the large number of requests made to the remote vault. In addition, there is the potential to hit API rate limits on external key services depending on how many encrypted resources exist in the cluster.
-->
1. **性能：** 启动集群时会串行获取并解密所有资源，以填充
   `kube-apiserver` 缓存。使用 KMS 插件时，由于会向远程保险库发送大量请求，
   启动过程可能变得缓慢。此外，集群中加密资源较多时，
   还可能触发外部密钥服务的 API 速率限制。

<!--
1. **Key Rotation:** With KMS v1, rotation of a key-encrypting key is a manual and error-prone process. It can be difficult to determine what encryption keys are in-use on a cluster.
-->
2. **密钥轮换：** 使用 KMS v1 时，轮换密钥加密密钥（Key Encryption Key，KEK）
   需手工完成，过程容易出错。此外，也难以判断集群当前正在使用哪些加密密钥。

<!--
1. **Health Check & Status:** Before the KMS v2 API, the `kube-apiserver` was forced to make encrypt and decrypt calls as a proxy to determine if the KMS plugin is healthy. With cloud services these operations usually cost actual money with cloud service. Whatever the cost, those operations on their own do not provide a holistic view of the service's health.
-->
3. **健康检查与状态：** 在 KMS v2 API 出现之前，`kube-apiserver`
   只能以代理方式发起加密、解密调用，以此判断 KMS 插件是否健康。
   使用云服务时，这些操作通常会产生实际费用。
   无论费用高低，这些操作本身都无法全面反映服务的健康状况。

<!--
1. **Observability:** Without some kind of trace ID, it's has been difficult to correlate events found in the various logs across `kube-apiserver`, KMS, and KMS plugins.
-->
4. **可观测性：** 在缺少跟踪 ID 之类标识时，
   很难将 `kube-apiserver`、KMS 与 KMS 插件各自日志中的事件关联起来。

<!--
The KMS v2 enhancement attempts to address all of these shortcomings, though not all planned features are implemented in the initial alpha release. Here are the improvements that arrived in Kubernetes v1.25:
-->
KMS v2 增强特性旨在解决上述所有不足，但并非所有计划中的特性
都会在初始 Alpha 版本中实现。Kubernetes v1.25 带来的改进如下：

<!--
1. Support for KMS plugins that use a key hierarchy to reduce network requests made to the remote vault. To learn more, check out the [design details for how a KMS plugin can leverage key hierarchy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#key-hierachy).
-->
1. 支持使用密钥层次结构（key hierarchy）的 KMS 插件，
   以减少向远程保险库发出的网络请求。要了解更多，请参阅
   [KMS 插件如何利用密钥层次结构的设计细节](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#key-hierachy)。

<!--
1. Extra metadata is now tracked to allow a KMS plugin to communicate what key it is currently using with the `kube-apiserver`, allowing for rotation without API server restart. Data stored in etcd follows a more standard proto format to allow external tools to observe its state. To learn more, check out the [details for metadata](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#metadata).
-->
2. 现在会跟踪额外的元数据，使 KMS 插件能够告知 `kube-apiserver`
   当前正在使用哪个密钥，从而无需重启 API 服务器即可轮换密钥。
   存储在 etcd 中的数据采用更标准的 proto 格式，便于外部工具观测其状态。
   要了解更多，请参阅
   [元数据详细信息](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#metadata)。

<!--
1. A dedicated status API is used to communicate the health of the KMS plugin with the API server. To learn more, check out the [details for status API](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#status-api).
-->
3. 使用专用的状态 API 向 API 服务器反馈 KMS 插件的健康状况。
   要了解更多，请参阅
   [状态 API 详细信息](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#status-api)。

<!--
1. To improve observability, a new `UID` field is included in `EncryptRequest` and `DecryptRequest` of the v2 API. The UID is generated for each envelope operation. To learn more, check out the [details for observability](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#Observability).
-->
4. 为了提高可观测性，v2 API 的 `EncryptRequest` 和 `DecryptRequest`
   中新增了 `UID` 字段。每次信封操作都会生成 UID。
   要了解更多，请参阅
   [可观测性详细信息](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/3299-kms-v2-improvements#Observability)。

<!--
### Sequence Diagram

#### Encrypt Request
-->

### 时序图 {#sequence-diagram}

#### 加密请求 {#encrypt-request}

<!-- source - https://mermaid.ink/img/pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O)](https://mermaid.live/edit#pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O -->

{{< figure src="/images/blog/2022-09-09-kubernetes-1.25-kms-v2-improvements/kubernetes-1.25-encryption.svg" alt="Sequence diagram for KMSv2 Encrypt" class="diagram-large" >}}

<!--
#### Decrypt Request
-->
#### 解密请求 {#decrypt-request}

<!-- source - https://mermaid.ink/img/pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O)](https://mermaid.live/edit#pako:eNrNVD1v2zAQ_SsEC0GLkxgt2kEIvEQeCo8tOgkoTuTJIiyRypFMIwj67yUlxx-w0CLoUg0a7t29e3eP5MCFkcgzniSD0splbEhdjS2mGUtLsJiu2Bz4AaSgbNAGZGBpR6oF6p9MYyjmfvj08YvAzzH9CH3HV3eGq6qaqK6C6_U6HccxSQpt8dmjFpgr2BO0hWbh64CcEqoD7Rg6IW-jB18idMoivSAtwK3tGr9XeoHv1SFpaELKDF5R3W02p9qMBWHUd45RFGndnA-NY94qvWcH7FmtkIBE3c_gRPhGsEyWb3fsl3I1a4yAhu22u-XSC6Hn4lPNTEHYGofXHBd1iwJQ_q3zRY0AUeM7Ki93mQV5zpO-WKPtTHCcPZb0sGFDwYMnNVI8HAXPWMEfz53CmjYFX8Ul_1RyAs_Tsq_5BM5EBQetjQOnAnskCsxB1X1UQxod2ntlHibpdwc83LQ6DRU4x3GeDJugM5D-2eokYcITYThXJdbwogy9w8z8H23M_xcbbg04rVHL5VsWr3XGrDOEt8JAy6Ux45-veIvUgpLh8RpipODTOzUrl1iBb8IYhR5Dqu8kONxKFfrwrIJg6oqDd-ZbrwXPHHl8Szo-QMes8Tffb72O ](https://mermaid.ink/img/pako:eNrVVU2P0zAQ_SsjoyggdXcrEHuIVr3QHlBvgDhFQtN40lhN7GA7C1GU_47jdOuUhi4HkKCn1DPzPkbPcscyxYklLIo6IYVNoIttQRXFCcQ7NBQvYDz4jFrgriTjKh3EtRYV6vadKpUeel-8eX2f0duh_Vj6RN9tKOd57qHODpfLZdz3fRSl0tDXhmRGa4F7jVUqwf1q1FZkokZp4dDsCGthSD-SnilXpi6bvZCXJUdJWmLpWsZiFIHIoVQZlrDdbEFIQCmVRSuUNAtwfiU0Rsg9FII06qxox0ksHZzMdFtb4lME8xPI2A7nqm9Wq5PMBDh5HNCDc2PhYafvVtClzMkuSA-bSlkCKXsIjOvNdpWyBRyo_SK4L46fsFfWOtVovHVQOWzGqQ9kaieI_NzIkbKpUsfhSJ2w20GslmTJ3Ap1593dHOhwoeLk22H2_ZPVK9uRkGFWUOj0q3laxfxanFX4JmwRcMI4lYZmmZyr32CbBCLwBRDPqqlSls5pPXWYndU9lfPH_F4Z91avk5Pk4c8ZzDScibNsGy0nuRyDE4JZlyjkJJeBdSaXYYHwfv2Xw_fLPLh7eYzEzN38b27n9I49m-P1ZYLhpcGKYEcFPgqlBxlWcWxfTTLyfKzX00z9gzE6hUFytmAV6QoFdy9bNxynzD9iIyOnHJvS0aeyd61NzdHShgurNEtydGFaMGys-tjKjCVWN_TUdHydjl39D0CLbdk)](https://mermaid.live/edit#pako:eNrVVU2P0zAQ_SsjoyggdXcrEHuIVr3QHlBvgDhFQtN40lhN7GA7C1GU_47jdOuUhi4HkKCn1DPzPkbPcscyxYklLIo6IYVNoIttQRXFCcQ7NBQvYDz4jFrgriTjKh3EtRYV6vadKpUeel-8eX2f0duh_Vj6RN9tKOd57qHODpfLZdz3fRSl0tDXhmRGa4F7jVUqwf1q1FZkokZp4dDsCGthSD-SnilXpi6bvZCXJUdJWmLpWsZiFIHIoVQZlrDdbEFIQCmVRSuUNAtwfiU0Rsg9FII06qxox0ksHZzMdFtb4lME8xPI2A7nqm9Wq5PMBDh5HNCDc2PhYafvVtClzMkuSA-bSlkCKXsIjOvNdpWyBRyo_SK4L46fsFfWOtVovHVQOWzGqQ9kaieI_NzIkbKpUsfhSJ2w20GslmTJ3Ap1593dHOhwoeLk22H2_ZPVK9uRkGFWUOj0q3laxfxanFX4JmwRcMI4lYZmmZyr32CbBCLwBRDPqqlSls5pPXWYndU9lfPH_F4Z91avk5Pk4c8ZzDScibNsGy0nuRyDE4JZlyjkJJeBdSaXYYHwfv2Xw_fLPLh7eYzEzN38b27n9I49m-P1ZYLhpcGKYEcFPgqlBxlWcWxfTTLyfKzX00z9gzE6hUFytmAV6QoFdy9bNxynzD9iIyOnHJvS0aeyd61NzdHShgurNEtydGFaMGys-tjKjCVWN_TUdHydjl39D0CLbdk -->

{{< figure src="/images/blog/2022-09-09-kubernetes-1.25-kms-v2-improvements/kubernetes-1.25-decryption.svg" alt="Sequence diagram for KMSv2 Decrypt" class="diagram-large" >}}

<!--
## What’s next?
For Kubernetes v1.26, we expect to ship another alpha version. As of right now, the alpha API will be ready to be used by KMS plugin authors. We hope to include a reference plugin implementation with the next release, and you'll be able to try out the feature at that time.

You can learn more about KMS v2 by reading [Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/). You can also follow along on the [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/3299-kms-v2-improvements/#readme) to track progress across the coming Kubernetes releases.
-->
## 接下来是什么？ {#whats-next}

在 Kubernetes v1.26 中，我们预计会发布另一个 Alpha 版本。
就目前而言，该 Alpha API 已可供 KMS 插件作者使用。
我们希望在下个版本中加入参考插件实现，届时你可以试用此特性。

你可以阅读[使用 KMS 驱动进行数据加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)
来进一步了解 KMS v2。你也可以关注
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/3299-kms-v2-improvements/#readme)，
以跟踪后续 Kubernetes 版本中的进展。

<!--
## How to get involved
If you are interested in getting involved in the development of this feature or would like to share feedback, please reach out on the [#sig-auth-kms-dev](https://kubernetes.slack.com/archives/C03035EH4VB) channel on Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings), held every-other Wednesday.
-->
## 如何参与 {#how-to-get-involved}

如果你有兴趣参与此特性的开发，或希望分享反馈，
请通过 Kubernetes Slack 上的
[#sig-auth-kms-dev](https://kubernetes.slack.com/archives/C03035EH4VB) 频道联系我们。

也欢迎你参加每两周一次的
[SIG Auth 会议](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)。
会议于隔周的周三举行。

<!--
## Acknowledgements
This feature has been an effort driven by contributors from several different companies. We would like to extend a huge thank you to everyone that contributed their time and effort to help make this possible.
-->
## 致谢 {#acknowledgements}

此特性由来自多家公司的贡献者共同努力实现。
我们衷心感谢每一位为此付出时间和精力、帮助实现该特性的人。

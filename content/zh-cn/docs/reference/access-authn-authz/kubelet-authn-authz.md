---
title: Kubelet 认证/鉴权
weight: 110
---
<!--
reviewers:
- liggitt
title: Kubelet authentication/authorization
weight: 110
-->

<!--
## Overview
-->
## 概述  {#overview}

<!--
A kubelet's HTTPS endpoint exposes APIs which give access to data of varying sensitivity,
and allow you to perform operations with varying levels of power on the node and within containers.
-->
kubelet 的 HTTPS 端点公开了 API，
这些 API 可以访问敏感度不同的数据，
并允许你在节点上和容器内以不同级别的权限执行操作。

<!--
This document describes how to authenticate and authorize access to the kubelet's HTTPS endpoint.
-->
本文档介绍了如何对 kubelet 的 HTTPS 端点的访问进行认证和鉴权。

<!--
## Kubelet authentication
-->
## Kubelet 身份认证   {#kubelet-authentication}

<!--
By default, requests to the kubelet's HTTPS endpoint that are not rejected by other configured
authentication methods are treated as anonymous requests, and given a username of `system:anonymous`
and a group of `system:unauthenticated`.
-->
默认情况下，未被已配置的其他身份认证方法拒绝的对 kubelet 的 HTTPS 端点的请求会被视为匿名请求，
并被赋予 `system:anonymous` 用户名和 `system:unauthenticated` 组。

<!--
To disable anonymous access and send `401 Unauthorized` responses to unauthenticated requests:
-->
要禁用匿名访问并向未经身份认证的请求发送 `401 Unauthorized` 响应，请执行以下操作：

<!--
* start the kubelet with the `--anonymous-auth=false` flag
-->
* 带 `--anonymous-auth=false` 标志启动 kubelet

<!--
To enable X509 client certificate authentication to the kubelet's HTTPS endpoint:
-->
要对 kubelet 的 HTTPS 端点启用 X509 客户端证书认证：

<!--
* start the kubelet with the `--client-ca-file` flag, providing a CA bundle to verify client certificates with
* start the apiserver with `--kubelet-client-certificate` and `--kubelet-client-key` flags
* see the [apiserver authentication documentation](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) for more details
-->
* 带 `--client-ca-file` 标志启动 kubelet，提供一个 CA 证书包以供验证客户端证书
* 带 `--kubelet-client-certificate` 和 `--kubelet-client-key` 标志启动 API 服务器
* 有关更多详细信息，请参见
  [API 服务器身份验证文档](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certificates)

<!--
To enable API bearer tokens (including service account tokens) to be used to authenticate to the kubelet's HTTPS endpoint:
-->
要启用 API 持有者令牌（包括服务帐户令牌）以对 kubelet 的 HTTPS 端点进行身份验证，请执行以下操作：

<!--
* ensure the `authentication.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authentication-token-webhook` and `--kubeconfig` flags
* the kubelet calls the `TokenReview` API on the configured API server to determine user information from bearer tokens
-->
* 确保在 API 服务器中启用了 `authentication.k8s.io/v1beta1` API 组
* 带 `--authentication-token-webhook` 和 `--kubeconfig` 标志启动 kubelet
* kubelet 调用已配置的 API 服务器上的 `TokenReview` API，以根据持有者令牌确定用户信息

<!--
## Kubelet authorization
-->
## Kubelet 鉴权   {#kubelet-authorization}

<!--
Any request that is successfully authenticated (including an anonymous request) is then authorized. The default authorization mode is `AlwaysAllow`, which allows all requests.
-->
任何成功通过身份验证的请求（包括匿名请求）之后都会被鉴权。
默认的鉴权模式为 `AlwaysAllow`，它允许所有请求。

<!--
There are many possible reasons to subdivide access to the kubelet API:
-->
细分对 kubelet API 的访问权限可能有多种原因：

<!--
* anonymous auth is enabled, but anonymous users' ability to call the kubelet API should be limited
* bearer token auth is enabled, but arbitrary API users' (like service accounts) ability to call the kubelet API should be limited
* client certificate auth is enabled, but only some of the client certificates signed by the configured CA should be allowed to use the kubelet API
-->
* 启用了匿名身份验证，但是应限制匿名用户调用 kubelet API 的能力
* 启用了持有者令牌认证，但应限制任意 API 用户（如服务帐户）调用 kubelet API 的能力
* 启用了客户端证书身份验证，但仅应允许已配置的 CA 签名的某些客户端证书使用 kubelet API

<!--
To subdivide access to the kubelet API, delegate authorization to the API server:
-->
要细分对 kubelet API 的访问权限，请将鉴权委派给 API 服务器：

<!--
* ensure the `authorization.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authorization-mode=Webhook` and the `--kubeconfig` flags
* the kubelet calls the `SubjectAccessReview` API on the configured API server to determine whether each request is authorized
-->
* 确保在 API 服务器中启用了 `authorization.k8s.io/v1beta1` API 组
* 带 `--authorization-mode=Webhook` 和 `--kubeconfig` 标志启动 kubelet
* kubelet 调用已配置的 API 服务器上的 `SubjectAccessReview` API，
  以确定每个请求是否得到鉴权

<!--
The kubelet authorizes API requests using the same [request attributes](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes) approach as the apiserver.
-->
kubelet 使用与 API 服务器相同的
[请求属性](/zh-cn/docs/reference/access-authn-authz/authorization/#review-your-request-attributes)
方法对 API 请求执行鉴权。

<!--
The verb is determined from the incoming request's HTTP verb:
-->
请求的动词根据传入请求的 HTTP 动词确定：

<!--
HTTP verb | request verb
-->
HTTP 动词 | 请求动词
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

<!--
The resource and subresource is determined from the incoming request's path:
-->
资源和子资源是根据传入请求的路径确定的：

<!--
Kubelet API  | resource | subresource
-->
Kubelet API  | 资源 | 子资源
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
**其它所有**  | nodes    | proxy

<!--
The namespace and API group attributes are always an empty string, and
the resource name is always the name of the kubelet's `Node` API object.
-->
名字空间和 API 组属性始终是空字符串，
资源名称始终是 kubelet 的 `Node` API 对象的名称。

<!--
When running in this mode, ensure the user identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the apiserver is authorized for the following attributes:
-->
在此模式下运行时，请确保传递给 API 服务器的由 `--kubelet-client-certificate` 和
`--kubelet-client-key` 标志标识的用户具有以下属性的鉴权：

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

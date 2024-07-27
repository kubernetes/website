---
reviewers:
- liggitt
title: Kubelet authentication/authorization
weight: 110
---


## Overview

A kubelet's HTTPS endpoint exposes APIs which give access to data of varying sensitivity,
and allow you to perform operations with varying levels of power on the node and within containers.

This document describes how to authenticate and authorize access to the kubelet's HTTPS endpoint.

## Kubelet authentication

By default, requests to the kubelet's HTTPS endpoint that are not rejected by other configured
authentication methods are treated as anonymous requests, and given a username of `system:anonymous`
and a group of `system:unauthenticated`.

To disable anonymous access and send `401 Unauthorized` responses to unauthenticated requests:

* start the kubelet with the `--anonymous-auth=false` flag

To enable X509 client certificate authentication to the kubelet's HTTPS endpoint:

* start the kubelet with the `--client-ca-file` flag, providing a CA bundle to verify client certificates with
* start the apiserver with `--kubelet-client-certificate` and `--kubelet-client-key` flags
* see the [apiserver authentication documentation](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) for more details

To enable API bearer tokens (including service account tokens) to be used to authenticate to the kubelet's HTTPS endpoint:

* ensure the `authentication.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authentication-token-webhook` and `--kubeconfig` flags
* the kubelet calls the `TokenReview` API on the configured API server to determine user information from bearer tokens

## Kubelet authorization

Any request that is successfully authenticated (including an anonymous request) is then authorized. The default authorization mode is `AlwaysAllow`, which allows all requests.

There are many possible reasons to subdivide access to the kubelet API:

* anonymous auth is enabled, but anonymous users' ability to call the kubelet API should be limited
* bearer token auth is enabled, but arbitrary API users' (like service accounts) ability to call the kubelet API should be limited
* client certificate auth is enabled, but only some of the client certificates signed by the configured CA should be allowed to use the kubelet API

To subdivide access to the kubelet API, delegate authorization to the API server:

* ensure the `authorization.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authorization-mode=Webhook` and the `--kubeconfig` flags
* the kubelet calls the `SubjectAccessReview` API on the configured API server to determine whether each request is authorized

The kubelet authorizes API requests using the same [request attributes](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes) approach as the apiserver.

The verb is determined from the incoming request's HTTP verb:

HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

The resource and subresource is determined from the incoming request's path:

Kubelet API  | resource | subresource
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
*all others* | nodes    | proxy

The namespace and API group attributes are always an empty string, and
the resource name is always the name of the kubelet's `Node` API object.

When running in this mode, ensure the user identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the apiserver is authorized for the following attributes:

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

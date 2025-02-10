---
title: Image Policy API (v1alpha1)
content_type: tool-reference
package: imagepolicy.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)
  

## `ImageReview`     {#imagepolicy-k8s-io-v1alpha1-ImageReview}
    


<p>ImageReview checks if the set of images in a pod are allowed.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>imagepolicy.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImageReview</code></td></tr>
    
  
<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
   <p>Standard object's metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code> <B>[Required]</B><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec"><code>ImageReviewSpec</code></a>
</td>
<td>
   <p>Spec holds information about the pod being evaluated</p>
</td>
</tr>
<tr><td><code>status</code><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus"><code>ImageReviewStatus</code></a>
</td>
<td>
   <p>Status is filled in by the backend and indicates whether the pod should be allowed.</p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewContainerSpec`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec}
    

**Appears in:**

- [ImageReviewSpec](#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec)


<p>ImageReviewContainerSpec is a description of a container within the pod creation request.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>image</code><br/>
<code>string</code>
</td>
<td>
   <p>This can be in the form image:tag or image@SHA:012345679abcdef.</p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewSpec`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec}
    

**Appears in:**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)


<p>ImageReviewSpec is a description of the pod creation request.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>containers</code><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec"><code>[]ImageReviewContainerSpec</code></a>
</td>
<td>
   <p>Containers is a list of a subset of the information in each container of the Pod being created.</p>
</td>
</tr>
<tr><td><code>annotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>Annotations is a list of key-value pairs extracted from the Pod's annotations.
It only includes keys which match the pattern <code>*.image-policy.k8s.io/*</code>.
It is up to each webhook backend to determine how to interpret these annotations, if at all.</p>
</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
   <p>Namespace is the namespace the pod is being created in.</p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewStatus`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus}
    

**Appears in:**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)


<p>ImageReviewStatus is the result of the review for the pod creation request.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>allowed</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Allowed indicates that all images were allowed to be run.</p>
</td>
</tr>
<tr><td><code>reason</code><br/>
<code>string</code>
</td>
<td>
   <p>Reason should be empty unless Allowed is false in which case it
may contain a short description of what is wrong.  Kubernetes
may truncate excessively long errors when displaying to the user.</p>
</td>
</tr>
<tr><td><code>auditAnnotations</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>AuditAnnotations will be added to the attributes object of the
admission controller request using 'AddAnnotation'.  The keys should
be prefix-less (i.e., the admission controller will add an
appropriate prefix).</p>
</td>
</tr>
</tbody>
</table>
  
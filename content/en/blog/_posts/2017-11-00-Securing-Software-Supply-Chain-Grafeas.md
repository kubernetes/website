---
title: " Securing Software Supply Chain with Grafeas "
date: 2017-11-03
slug: securing-software-supply-chain-grafeas
url: /blog/2017/11/Securing-Software-Supply-Chain-Grafeas
author: >
  Kelsey Hightower (Google),
  Sandra Guo (Google)
---

Kubernetes has evolved to support increasingly complex classes of applications, enabling the development of two major industry trends: hybrid cloud and microservices. With increasing complexity in production environments, customers—especially enterprises—are demanding better ways to manage their software supply chain with more centralized visibility and control over production deployments.  

On October 12th, Google and partners [announced](https://cloudplatform.googleblog.com/2017/10/introducing-grafeas-open-source-api-.html) Grafeas, an open source initiative to define a best practice for auditing and governing the modern software supply chain. With Grafeas (“scribe” in Greek), developers can plug in components of the CI/CD pipeline into a central source of truth for tracking and enforcing policies. Google is also working on [Kritis](https://github.com/Grafeas/Grafeas/blob/master/case-studies/binary-authorization.md) (“judge” in Greek), allowing devOps teams to enforce deploy-time image policy using metadata and attestations stored in Grafeas.  

Grafeas allows build, auditing and compliance tools to exchange comprehensive metadata on container images using a central API. This allows enforcing policies that provide central control over the software supply process.  


[![](https://2.bp.blogspot.com/-TDD4slMA7gg/WfzDeKVLr2I/AAAAAAAAAGw/dhfWOrCMdmogSNhGr5RrA2ovr02K5nn8ACK4BGAYYCw/s400/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.13%2BPM.png)](https://2.bp.blogspot.com/-TDD4slMA7gg/WfzDeKVLr2I/AAAAAAAAAGw/dhfWOrCMdmogSNhGr5RrA2ovr02K5nn8ACK4BGAYYCw/s1600/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.13%2BPM.png)  


## Example application: PaymentProcessor

Let’s consider a simple application, _PaymentProcessor_, that retrieves, processes and updates payment info stored in a database. This application is made up of two containers: a standard ruby container and custom logic.  


Due to the sensitive nature of the payment data, the developers and DevOps team really want to make sure that the code meets certain security and compliance requirements, with detailed records on the provenance of this code. There are CI/CD stages that validate the quality of the PaymentProcessor release, but there is no easy way to centrally view/manage this information:


[![](https://1.bp.blogspot.com/-WeI6zpGd42A/WfzDkkIonFI/AAAAAAAAAG4/wKUaNaXYvaQ-an9p4_9T9J3EQB_zHkRXwCK4BGAYYCw/s1600/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.23%2BPM.png)](https://1.bp.blogspot.com/-WeI6zpGd42A/WfzDkkIonFI/AAAAAAAAAG4/wKUaNaXYvaQ-an9p4_9T9J3EQB_zHkRXwCK4BGAYYCw/s1600/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.23%2BPM.png)  


## Visibility and governance over the PaymentProcessor Code
Grafeas provides an API for customers to centrally manage metadata created by various CI/CD components and enables deploy time policy enforcement through a Kritis implementation.  

[![](https://4.bp.blogspot.com/-SRMfm5z606M/WfzDpHqlz-I/AAAAAAAAAHA/y2suaInhr9E0hU0u78PacBT_kZj2D7DKgCK4BGAYYCw/s1600/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.34%2BPM.png)](https://4.bp.blogspot.com/-SRMfm5z606M/WfzDpHqlz-I/AAAAAAAAAHA/y2suaInhr9E0hU0u78PacBT_kZj2D7DKgCK4BGAYYCw/s1600/Screen%2BShot%2B2017-11-03%2Bat%2B12.28.34%2BPM.png)  


Let’s consider a basic example of how Grafeas can provide deploy time control for the PaymentProcessor app using a demo verification pipeline.  

Assume that a PaymentProcessor container image has been created and pushed to Google Container Registry. This example uses the gcr.io/exampleApp/PaymentProcessor container for testing. You as the QA engineer want to create an attestation certifying this image for production usage. Instead of trusting an image tag like 0.0.1, which can be reused and point to a different container image later, we can trust the image digest to ensure the attestation links to the full image contents.



**1. Set up the environment**


Generate a signing key:  



```
gpg --quick-generate-key --yes qa\_bob@example.com
 ```


Export the image signer's public key:  



```
gpg --armor --export image.signer@example.com \> ${GPG\_KEY\_ID}.pub
 ```


Create the ‘qa’ AttestationAuthority note via the Grafeas API:  



```
curl -X POST \  
  "http://127.0.0.1:8080/v1alpha1/projects/image-signing/notes?noteId=qa" \  
  -d @note.json
 ```


Create the Kubernetes ConfigMap for admissions control and store the QA signer's public key:  



```
kubectl create configmap image-signature-webhook \  
  --from-file ${GPG\_KEY\_ID}.pub

kubectl get configmap image-signature-webhook -o yaml
 ```


Set up an admissions control webhook to require QA signature during deployment.




```
kubectl apply -f kubernetes/image-signature-webhook.yaml
 ```





**2. Attempt to deploy an image without QA attestation**  

Attempt to run the image in paymentProcessor.ymal before it is QA attested:  



```
kubectl apply -f pods/nginx.yaml

apiVersion: v1

kind: Pod

metadata:

  name: payment

spec:

  containers:

    - name: payment

      image: "gcr.io/hightowerlabs/payment@sha256:aba48d60ba4410ec921f9d2e8169236c57660d121f9430dc9758d754eec8f887"
 ```


Create the paymentProcessor pod:  



```
kubectl apply -f pods/paymentProcessor.yaml
 ```


Notice the paymentProcessor pod was not created and the following error was returned:  



```
The  "" is invalid: : No matched signatures for container image: gcr.io/hightowerlabs/payment@sha256:aba48d60ba4410ec921f9d2e8169236c57660d121f9430dc9758d754eec8f887
 ```


**3. Create an image signature**  

Assume the image digest is stored in Image-digest.txt, sign the image digest:  



```
gpg -u qa\_bob@example.com \  
  --armor \  
  --clearsign \  
  --output=signature.gpg \  
  Image-digest.txt
 ```



**4. Upload the signature to the Grafeas API**  

Generate a pgpSignedAttestation occurrence from the signature :




```
cat \> occurrence.json \<\<EOF  
{  
  "resourceUrl": "$(cat image-digest.txt)",  
  "noteName": "projects/image-signing/notes/qa",  
  "attestation": {  
    "pgpSignedAttestation": {  
       "signature": "$(cat signature.gpg)",  
       "contentType": "application/vnd.gcr.image.url.v1",  
       "pgpKeyId": "${GPG\_KEY\_ID}"  
    }  
  }  
}  
EOF
 ```


Upload the attestation through the Grafeas API:




```
curl -X POST \  
  'http://127.0.0.1:8080/v1alpha1/projects/image-signing/occurrences' \  
  -d @occurrence.json
 ```



**5. Verify QA attestation during a production deployment**    

Attempt to run the image in paymentProcessor.ymal now that it has the correct attestation in the Grafeas API:  



```
kubectl apply -f pods/paymentProcessor.yaml

pod "PaymentProcessor" created
 ```


With the attestation added the pod will be created as the execution criteria are met.  

For more detailed information, see this [Grafeas tutorial](https://github.com/kelseyhightower/grafeas-tutorial).



## Summary
The demo above showed how you can integrate your software supply chain with Grafeas and gain visibility and control over your production deployments. However, the demo verification pipeline by itself is not a full Kritis implementation. In addition to basic admission control, Kritis provides additional support for workflow enforcement, multi-authority signing, breakglass deployment and more. You can read the [Kritis whitepaper](https://github.com/Grafeas/Grafeas/blob/master/case-studies/binary-authorization.md) for more details. The team is actively working on a full open-source implementation. We’d love your feedback!  

In addition, a hosted alpha implementation of Kritis, called Binary Authorization, is available on Google Container Engine and will be available for broader consumption soon.  

Google, JFrog, and other partners joined forces to create Grafeas based on our common experiences building secure, large, and complex microservice deployments for internal and enterprise customers. Grafeas is an industry-wide community effort.  

To learn more about Grafeas and contribute to the project:  

- Register for the JFrog-Google webinar [[here](https://leap.jfrog.com/WN2017-ImplementingaSingleSourceofTruthinaHybridCloudWorld_RegistrationPage.html)]
- Try Grafeas now and join the GitHub project: [https://github.com/grafeas](https://github.com/grafeas)
- Try out the Grafeas demo and tutorial: [https://github.com/kelseyhightower/grafeas-tutorial](https://github.com/kelseyhightower/grafeas-tutorial)
- Attend Shopify’s talks at [KubeCon in December](https://kccncna17.sched.com/event/CU83/securing-shopifys-paas-on-gke-i-jonathan-pulsifer-shopify)
- Fill out [[this form](https://docs.google.com/forms/d/e/1FAIpQLSdr8kDTkAkml5f9TW_kzz06C0s0QuV_sWYzHC7NM90F5CZ2bQ/viewform)] if you’re interested in learning more about our upcoming releases or talking to us about integrations
- See [grafeas.io](https://grafeas.io/) for documentation and examples
We hope you join us!  
The Grafeas Team

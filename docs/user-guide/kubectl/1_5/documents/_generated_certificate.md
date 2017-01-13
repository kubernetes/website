------------

# certificate





### Usage

`$ certificate SUBCOMMAND`



------------

## <em>approve</em>



Approve a certificate signing request. 

kubectl certificate approve allows a cluster admin to approve a certificate signing request (CSR). This action tells a certificate signing controller to issue a certificate to the requestor with the attributes requested in the CSR. 

SECURITY NOTICE: Depending on the requested attributes, the issued certificate can potentially grant a requester access to cluster resources or to authenticate as a requested identity. Before approving a CSR, ensure you understand what the signed certificate can do.

### Usage

`$ approve (-f FILENAME | NAME)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to update 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 



------------

## <em>deny</em>



Deny a certificate signing request. 

kubectl certificate deny allows a cluster admin to deny a certificate signing request (CSR). This action tells a certificate signing controller to not to issue a certificate to the requestor.

### Usage

`$ deny (-f FILENAME | NAME)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to update 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 




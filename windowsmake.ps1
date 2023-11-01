# Set the Hugo version
$HUGO_VERSION = (Get-Content -Path .\netlify.toml | Select-String 'HUGO_VERSION' | ForEach-Object { ($_ -split '=')[1].Trim() }).Trim(' "')

# Set the image registry
$IMAGE_REGISTRY = "gcr.io/k8s-staging-sig-docs"

# Run the custom hash script and capture the output
$IMAGE_VERSION = bash scripts/hash-files.sh Dockerfile Makefile | ForEach-Object { $_.Substring(0, 12) }

# Define CONTAINER_IMAGE
$CONTAINER_IMAGE = "$($IMAGE_REGISTRY)/k8s-website-hugo:v$($HUGO_VERSION)-$($IMAGE_VERSION)"

# Define the command to run in the container
$CONTAINER_RUN = "docker run --rm --interactive --tty --volume ${PWD}:/src:ro,Z"
$buildCommand = "$CONTAINER_RUN --cap-drop=ALL --cap-add=AUDIT_WRITE --read-only --mount type=tmpfs,destination=/tmp,tmpfs-mode=01777 -p 1313:1313 $CONTAINER_IMAGE  hugo server --buildFuture --environment development --bind 0.0.0.0 --destination /tmp/hugo --cleanDestinationDir --noBuildLock"

Invoke-Expression $buildCommand


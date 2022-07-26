# Exercise 3.03: Project v1.4

## In order to run this exercise locally I made the next configuration:

### Command used for `Kustomize`:

```
$ kustomize edit add resource manifests/*.yaml

$ kubectl apply -k .

$ kubectl kustomize .
```

### Command for workflow configuration

```
$ gcloud iam service-accounts keys create ./private-key.json \
    --iam-account=github-actions@dwk-gke-356913.iam.gserviceaccount.com

$ gcloud --quiet auth configure-docker
```

### Cluster deployment to GCloud

```
$ kubectl apply -f project-space.yaml

$ kubectl config set-context --current --namespace=project

$ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt

$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```

---

The rest of the manifests and project can be found [here](./project)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

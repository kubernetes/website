
# `Demo: Viper`

## `Usage`

### `Preparing`

```bash
cd viper
go mod download
echo 'MySecret' > secret.file
```

### `Run`

```bash
DEMO_SECRET__USER=user DEMO_SECRET__PASSWD="secret.file" go run main.go
DEMO_SECRET__USER=user DEMO_SECRET__PASSWD="file://secret.file" go run main.go
```

### `Checking`

```bash
ps e --no-headers -ww -p $(pidof main)

or

strings /proc/$(pidof main)/environ
```


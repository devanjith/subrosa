# Subrosa

*A simple, secure REST api for one-time secret sharing.*

---

## Usage

Creating a secret:

```bash
curl --location '<host>' \
--header 'Content-Type: application/json' \
--data '{
    "plaintext": "super secret message",
    "passphrase": "pas$$w0rd"
}'

# { "url": "<host>/G8JRXjO5J0zHMY4Z9mqYN" }
```

Retrieving the secret:

```bash
curl --location '<host>/7DmBmUaDXLc2MOfXvHUWS' \
--header 'Content-Type: application/json' \
--data '{
    "passphrase": "pas$$w0rd"
}'

# { "plaintext": "super secret message" }
```

> NOTE: The secret will be permanently deleted upon retrieval.


## Development

To install dependencies:

```bash
yarn install
```

To host:

```bash
yarn build
node dist/index.js
```

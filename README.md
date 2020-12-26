# showcase-editor
Application add demo products to cloudant.

# env variables required

| Variable | Description |
| --- | --- |
| CLOUDANT_URL | Cloudant URL which is used to connect cloudant DB |
| SSO_LOGIN_URL | SSO URL to login for the user |
| HTTPS | Protocol configuration for creating server |
| SSL_CRT_FILE | PEM encoded SSL certificate |
| SSL_KEY_FILE | PEM encoded private key |
| BLUE_GROUPS_LIST | List of bluegroups related to showcase-editr |
| JWT_COOKIE_NAME | JWT cookie name in client side used to w3 login |
| SESSION_SECRET | Secret to hash the session |
| OIDC_JWT_CERT | Base64 cert from JWK |
| OIDC_CLIENT_ID | Identifier from OIDC identity provider |
| OIDC_CLIENT_SECRET | Secret from OIDC identity provider |
| OIDC_CALLBACK_URL | Callback URL that retrieves the user profile |
| OIDC_DISCOVERY_URL | OIDC discovery endpoint URL |
| OIDC_SCOPE | Scope value for OIDC Strategy |
| OIDC_RESPONSE_TYPE | Response type for OIDC Strategy |

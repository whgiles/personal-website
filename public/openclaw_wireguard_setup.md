# Remote OpenClaw Setup with Private Access over WireGuard

This guide shows how to run OpenClaw on a cloud VM while keeping dashboard access private through a WireGuard VPN.

## Why this setup

OpenClaw can execute powerful actions. Running it on a disposable cloud VM is safer than running it directly on your laptop or home network. If something goes wrong, you can rebuild the VM.

This guide uses a single VM to keep cost low:

- OpenClaw + Nginx run on one server
- WireGuard runs on the same server
- Your laptop connects to that server over VPN
- OpenClaw dashboard is only reachable from VPN IPs

## Prerequisites

- A Linux VM (Ubuntu 22.04+ recommended)
- SSH access with your key
- A domain you can manage in DNS (for example `example.com`)
- OpenClaw installed and running locally on the VM
- Cloud firewall rules:
  - `22/tcp` (SSH)
  - `51820/udp` (WireGuard)
  - `443/tcp` (HTTPS)
  - `80/tcp` (needed for Let's Encrypt HTTP challenge)

If you use UFW on the VM, open the same ports there too.

## Architecture options

### Hub-and-spoke (used in this article)

- One central VM is the WireGuard hub.
- Your laptop is a spoke peer.
- Traffic to OpenClaw travels over the private VPN subnet.

### Two-tier variant (optional)

- VM 1: WireGuard gateway
- VM 2: OpenClaw app server
- Use this when you want stricter network separation.

## OpenClaw baseline check

Install OpenClaw using the official docs: <https://docs.openclaw.ai/start/getting-started>

Before adding VPN/proxy, confirm OpenClaw responds locally on the VM:

```bash
curl -I http://127.0.0.1:18789
```

If this fails, fix OpenClaw first, then continue.

## WireGuard setup

### 1. Install WireGuard on server

```bash
sudo apt update
sudo apt install -y wireguard
```

### 2. Create secure WireGuard directory

```bash
sudo install -d -m 700 /etc/wireguard
```

### 3. Generate server keys

```bash
sudo sh -c 'wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key'
sudo chmod 600 /etc/wireguard/server_private.key
```

Show your server public key (you will need it on the client):

```bash
sudo cat /etc/wireguard/server_public.key
```

### 4. Pick server network interface

Find your public NIC name (often `eth0`, `ens3`, or `ens10`):

```bash
ip route | awk '/default/ {print $5}'
```

Use that value below as `<PUBLIC_NIC>`.

### 5. Create `/etc/wireguard/wg0.conf`

```bash
sudo nano /etc/wireguard/wg0.conf
```

```ini
[Interface]
PrivateKey = <SERVER_PRIVATE_KEY>
Address = 10.0.0.1/24
ListenPort = 51820
SaveConfig = true
PostUp = sysctl -w net.ipv4.ip_forward=1; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o <PUBLIC_NIC> -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o <PUBLIC_NIC> -j MASQUERADE

# Add peers below
```

Get the server private key:

```bash
sudo cat /etc/wireguard/server_private.key
```

Paste that value into `PrivateKey`.

### 6. Create client tunnel on Mac

In the WireGuard macOS app:

1. Click `Add Tunnel`.
2. Choose `Add Empty Tunnel...`.
3. Give it a name.
4. The app generates a keypair automatically.
5. Copy the client public key.

### 7. Add client peer to server config

Edit `/etc/wireguard/wg0.conf` and append:

```ini
[Peer]
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32
```

### 8. Start WireGuard

```bash
sudo wg-quick up wg0
sudo systemctl enable --now wg-quick@wg0
```

### 9. Open firewall for WireGuard

If UFW is enabled:

```bash
sudo ufw allow 51820/udp
```

### 10. Complete client config (Mac)

Use this tunnel config in WireGuard app:

```ini
[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = <SERVER_PUBLIC_IP>:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

`AllowedIPs = 10.0.0.0/24` is split-tunnel mode (recommended here). Only traffic for VPN subnet goes through WireGuard.

### 11. Validate VPN

Turn on the tunnel on your Mac, then test:

```bash
# from Mac
ping 10.0.0.1
```

```bash
# from server
sudo wg show
```

You should see a recent handshake and transfer counters increasing.

## Nginx reverse proxy + HTTPS

OpenClaw is typically bound to localhost (`127.0.0.1`). Nginx will publish it on HTTPS, and we will restrict access to VPN source IPs.

### 1. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Create initial Nginx site

```bash
sudo nano /etc/nginx/sites-available/openclaw
```

```nginx
server {
    listen 80;
    server_name openclaw.<DOMAIN_NAME>;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/openclaw
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Create DNS record

Create an `A` record:

- Host/name: `openclaw`
- Value: `<SERVER_PUBLIC_IP>`

Resulting FQDN should be `openclaw.<DOMAIN_NAME>`.

### 4. Issue TLS certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d openclaw.<DOMAIN_NAME>
```

Choose redirect to HTTPS when prompted.

### 5. Restrict HTTPS access to VPN subnet

After certbot updates config, re-open the site file and add allow/deny inside the TLS server block (`listen 443 ssl ...`):

```nginx
allow 10.0.0.0/24;
deny all;
```

Then reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## OpenClaw allowed origin

Update OpenClaw config so browser origin is trusted:

```bash
nano ~/.openclaw/openclaw.json
```

```json
{
  "gateway": {
    "controlUi": {
      "allowedOrigins": ["https://openclaw.<DOMAIN_NAME>"]
    }
  }
}
```

Restart gateway service:

```bash
systemctl --user restart openclaw-gateway.service
```

If your install uses a system service instead of user service, use `sudo systemctl restart <service-name>`.

## Verification checklist

- VPN on:
  - `ping 10.0.0.1` works
  - `sudo wg show` shows recent handshake
  - `https://openclaw.<DOMAIN_NAME>` loads dashboard
- VPN off:
  - `https://openclaw.<DOMAIN_NAME>` should be blocked by Nginx (`deny all`)

## Notes on port 80

For standard Let's Encrypt HTTP validation, port `80/tcp` must be reachable from the internet for initial issuance and future renewals. If you must close port 80, switch to DNS challenge instead.

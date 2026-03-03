# Google Sign-In & "Access other apps and services" dialog

## "This site wants to – Access other apps and services on this device"

This prompt is from **Google Sign-In** (the "Sign in with Google" button). The browser is asking whether to allow the site to use Google’s sign-in.

- **Tap "Allow"** – Google login will work. This does **not** give the site access to other apps on the device; it only allows using Google identity for login.
- **Tap "Block"** – "Sign in with Google" will not work; email/password login is unaffected.

This dialog is **not** what controls product images. Images are loaded from your backend; fixes for images on phone are described below.

---

## Fix Google Sign-In: "The given origin is not allowed for the given client ID"

Google only allows sign-in from domains you list in the OAuth client. Your **production** site URL must be added there.

## Fix in Google Cloud Console

1. **Open Google Cloud Console**  
   https://console.cloud.google.com/

2. **Select the correct project** (the one that has your OAuth client).

3. **Go to APIs & Services → Credentials**  
   Left menu: **APIs & Services** → **Credentials**.

4. **Open your OAuth 2.0 Client ID**  
   Under "OAuth 2.0 Client IDs", click the client that matches:
   - `948566066402-hvsv2sev08o51skd8kv68s4onuok8m10.apps.googleusercontent.com`  
   (or the one you use in `client/src/main.jsx`).

5. **Add your production origin**  
   In **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `https://dimgrey-alligator-158844.hostingersite.com`  
   (no trailing slash)

   If you use another domain (e.g. custom domain), add that too, e.g.:
   - `https://yourdomain.com`

   Keep existing entries (e.g. `http://localhost:5173` for local dev).

6. **Save**  
   Click **Save** at the bottom.

7. **Wait a few minutes**  
   Changes can take a short time to apply. Then try "Sign in with Google" again on the live site.

## Optional: Authorized redirect URIs

If you use a backend endpoint for Google callback (e.g. `/api/auth/google/callback`), add that full URL under **Authorized redirect URIs** in the same OAuth client. For frontend-only Google One Tap / button, origins are usually enough.

## Product images not showing (desktop or mobile)

Product images are served from your **backend**. The app uses the backend URL from either:

1. **`window.__API_URL__`** in **index.html** (set by default to your Hostinger backend) – used at runtime so images and API work without rebuilding.
2. **VITE_API_URL** at build time (optional).

**What to do:**

1. **Rebuild and redeploy**  
   Run `npm run build` in the **client** folder and deploy the contents of **client/dist** (including the updated **index.html**). The default `window.__API_URL__` in index.html points to `https://whitesmoke-armadillo-865654.hostingersite.com`; change it if your Node API is at a different URL.

2. **Backend CORS**  
   On the Node server (Hostinger), set **CLIENT_URL** to your frontend, e.g. `https://dimgrey-alligator-158844.hostingersite.com`, so the backend allows image and API requests from the site.

---

## Summary

| Issue | Cause | Fix |
|-------|--------|-----|
| "Access other apps" dialog | Google Sign-In | Tap **Allow** for Google login (safe). |
| 403 / "origin is not allowed" | Production URL not in OAuth client | Add `https://dimgrey-alligator-158844.hostingersite.com` to **Authorized JavaScript origins**. |
| Images missing on phone | Wrong image URL or referrer | Rebuild with **VITE_API_URL** set; app now uses backend URL + referrerPolicy for images. |

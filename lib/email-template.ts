import "server-only";

const MAILING_ADDRESS = process.env.MAILING_ADDRESS || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
const DOMAIN_DISPLAY = "www.ruinedrx.com";
const DOMAIN_URL = "https://ruinedrx.com";

export function wrapBroadcastHtml({
  bodyHtml,
  unsubscribeUrl,
}: {
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  const addressLine = MAILING_ADDRESS ? `<br />${MAILING_ADDRESS}` : "";
  const logoBlack = `${SITE_URL}/logo-email-black.png`;
  const logoWhite = `${SITE_URL}/logo-email-white.png`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<style>
  .ruined-logo-dark { display: none; }
  @media (prefers-color-scheme: dark) {
    .ruined-logo-light { display: none !important; }
    .ruined-logo-dark { display: inline-block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f2f2f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5ea;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 24px 20px;">
              <img src="${logoBlack}" width="140" alt="RUINED" class="ruined-logo-light" style="display:inline-block;height:auto;max-width:140px;border:0;" />
              <img src="${logoWhite}" width="140" alt="RUINED" class="ruined-logo-dark" style="height:auto;max-width:140px;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background-color:#8a5cf2;background-image:linear-gradient(90deg,#8a5cf2,#1fc8dd,#f2469e,#f2c14e);">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1a1c20;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid #e5e5ea;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#8b8f96;text-align:center;">
              RUINED — Research-grade compounds, verified to the batch.${addressLine}
              <br /><br />
              <a href="${DOMAIN_URL}" style="color:#8b8f96;">${DOMAIN_DISPLAY}</a>
              <br /><br />
              You're receiving this because you subscribed at ruinedrx.com.
              <a href="${unsubscribeUrl}" style="color:#8b8f96;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

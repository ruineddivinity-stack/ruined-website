import "server-only";

const MAILING_ADDRESS = process.env.MAILING_ADDRESS || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
const DOMAIN_DISPLAY = "www.ruinedrx.com";
const DOMAIN_URL = "https://ruinedrx.com";

export function broadcastBodyToHtml({
  text,
  imageUrl,
}: {
  text: string;
  imageUrl?: string | null;
}): string {
  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:12px;margin:0 0 20px;border:0;" />`
    : "";

  const paragraphs = text
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;">${para.trim().replace(/\n/g, "<br />")}</p>`,
    )
    .join("");

  return imageHtml + paragraphs;
}

export function wrapBroadcastHtml({
  bodyHtml,
  unsubscribeUrl,
}: {
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  const addressLine = MAILING_ADDRESS ? `<br />${MAILING_ADDRESS}` : "";
  const logoWhite = `${SITE_URL}/logo-email-white.png`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
</head>
<body style="margin:0;padding:0;background:#0a0b0d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b0d;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #26292e;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 24px;background-color:#030304;">
              <img src="${logoWhite}" width="190" alt="RUINED" style="display:block;margin:0 auto;height:auto;max-width:190px;border:0;" />
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
            <td style="padding:24px 28px;background-color:#030304;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#8b8f96;text-align:center;">
              RUINED — Research-grade compounds, verified to the batch.${addressLine}
              <br /><br />
              <a href="${DOMAIN_URL}" style="color:#a3eef4;">${DOMAIN_DISPLAY}</a>
              <br /><br />
              You're receiving this because you subscribed at ruinedrx.com.
              <a href="${unsubscribeUrl}" style="color:#a3eef4;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

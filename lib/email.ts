type ContactPayload = {
  firstName: string
  lastName?: string | null
  email: string
  phone?: string | null
  tripType?: string | null
  travelers?: string | null
  budget?: string | null
  message: string
}

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_NOTIFY_TO
  if (!apiKey || !to) return

  const toList = to
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (toList.length === 0) return

  const subject = `Nuevo mensaje de contacto — ${payload.firstName}`
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.5; color:#111">
      <h2 style="margin:0 0 12px">Nuevo mensaje de contacto</h2>
      <p style="margin:0 0 16px">Has recibido un nuevo mensaje desde el formulario de contacto.</p>
      <table style="border-collapse:collapse; width:100%">
        <tbody>
          <tr><td><strong>Nombre</strong></td><td>${escapeHtml(
            payload.firstName
          )} ${payload.lastName ? escapeHtml(payload.lastName) : ""}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(
            payload.email
          )}</td></tr>
          ${
            payload.phone
              ? `<tr><td><strong>Teléfono</strong></td><td>${escapeHtml(
                  payload.phone
                )}</td></tr>`
              : ""
          }
          ${
            payload.tripType
              ? `<tr><td><strong>Tipo viaje</strong></td><td>${escapeHtml(
                  payload.tripType
                )}</td></tr>`
              : ""
          }
          ${
            payload.travelers
              ? `<tr><td><strong>Viajeros</strong></td><td>${escapeHtml(
                  payload.travelers
                )}</td></tr>`
              : ""
          }
          ${
            payload.budget
              ? `<tr><td><strong>Presupuesto</strong></td><td>${escapeHtml(
                  payload.budget
                )}</td></tr>`
              : ""
          }
        </tbody>
      </table>
      <hr style="margin:16px 0; border:none; border-top:1px solid #eee"/>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>
  `

  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Big Five Trails <noreply@bigfivetrails.com>"

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to: toList, subject, html })
  })
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

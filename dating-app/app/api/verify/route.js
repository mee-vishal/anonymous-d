import { getDb } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/mailer";

function htmlPage({ title, message, ok }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: sans-serif;
            background: #14151A;
            color: #F6F1EA;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 24px;
          }
          .card {
            max-width: 420px;
          }
          h1 { color: ${ok ? "#C4536F" : "#e07a7a"}; }
          a { color: #C4536F; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          <p>${message}</p>
          <p><a href="/">Back to home</a></p>
        </div>
      </body>
    </html>
  `;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const headers = { "Content-Type": "text/html" };

  if (!token) {
    return new Response(
      htmlPage({ title: "Invalid link", message: "No token provided.", ok: false }),
      { status: 400, headers }
    );
  }

  try {
    const db = await getDb();
    const signups = db.collection("signups");

    const user = await signups.findOne({ token });

    if (!user) {
      return new Response(
        htmlPage({
          title: "Link not found",
          message: "This verification link is invalid or has expired.",
          ok: false,
        }),
        { status: 404, headers }
      );
    }

    if (!user.verified) {
      await signups.updateOne(
        { _id: user._id },
        { $set: { verified: true, verifiedAt: new Date() } }
      );
      await sendConfirmationEmail({ to: user.email, codeName: user.codeName });
    }

    return new Response(
      htmlPage({
        title: "You're in!",
        message: "We'll be in touch shortly.",
        ok: true,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Verify error:", err);
    return new Response(
      htmlPage({
        title: "Something went wrong",
        message: "Please try again later.",
        ok: false,
      }),
      { status: 500, headers }
    );
  }
}

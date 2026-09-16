import { createClient } from "@supabase/supabase-js";
import { appendFile } from "fs/promises";

export async function POST(request) {
  const { email, password } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
	const rawIp =
	  request.headers.get("x-forwarded-for") ||
	  request.headers.get("x-real-ip") ||
	  "unknown";

	const ip = rawIp.replace(/^::ffff:/, "");
    await appendFile(
      "/var/log/nextjs-auth.log",
      `FAIL_LOGIN IP=${ip} EMAIL=${email}\n`
    );

    return Response.json({ error: error.message }, { status: 401 });
  }

  return Response.json({ user: data.user });
}

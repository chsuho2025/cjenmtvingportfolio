export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    env: process.env.VERCEL_ENV ?? "development",
    builtAt: process.env.BUILD_TIME,
  });
}

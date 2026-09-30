export default function DeployBadge() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const env = process.env.VERCEL_ENV ?? "development";
  const built = process.env.BUILD_TIME
    ? new Date(process.env.BUILD_TIME).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    : "-";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 12,
        fontSize: 11,
        opacity: 0.5,
        fontFamily: "monospace",
        pointerEvents: "none",
      }}
    >
      {env} · {sha} · {built}
    </div>
  );
}

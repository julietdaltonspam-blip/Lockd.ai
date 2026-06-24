import { Lock } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 16, text: "text-lg" },
    md: { icon: 22, text: "text-2xl" },
    lg: { icon: 32, text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <Lock size={s.icon} className="text-purple-400" strokeWidth={2.5} />
      <span className={`font-black tracking-tight ${s.text}`}>
        Lockd.<span style={{ color: "#a855f7" }}>AI</span>
      </span>
    </div>
  );
}

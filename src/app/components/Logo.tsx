export default function Logo() {
  const appName = "Online Deutschkurs mit Eliana";

  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo/logo.png"
        alt="Logo"
        className="h-20  w-auto"
      />
      <span className="text-lg font-semibold text-foreground">{appName}</span>
    </div>
  );
}
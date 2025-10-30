import Logo from "@/assets/logo.svg";
import { Link } from "@tanstack/react-router";

export type HomeLayoutProps = {
  children?: React.ReactNode;
};

export function HomeLayout(props: HomeLayoutProps) {
  return (
    <main className="h-screen w-screen">
      <div className="AnimatedBackground fixed inset-0 -z-10" />
      <div className="z-0 flex flex-col items-center gap-12 p-12">
        <Link to="/">
          <img src={Logo} className="animate-slow-bob w-40 [--bob-amount:8px]" />
        </Link>

        {props.children}

        <p className="text-xs opacity-40">
          By{" "}
          <a
            href="https://jussinevavuori.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Jussi Nevavuori
          </a>{" "}
          <span className="mx-2">·</span>
          ©️ 2025
          <span className="mx-2">·</span>
          Source code available on{" "}
          <a
            href="https://github.com/jussinevavuori/what-the-doodle"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </main>
  );
}

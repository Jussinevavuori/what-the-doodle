export type GameLayoutProps = {
  children?: React.ReactNode;
};

export function GameLayout(props: GameLayoutProps) {
  return (
    <main className="h-screen w-screen">
      <div className="AnimatedBackground fixed inset-0 -z-10" />
      <div className="z-0 flex flex-col items-center gap-12 p-12">{props.children}</div>
    </main>
  );
}

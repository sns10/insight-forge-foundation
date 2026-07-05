interface Props {
  subjectId: string;
}

export function ChaptersPage({ subjectId }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Chapters</h1>
      <p className="text-muted-foreground text-sm">Subject ID: {subjectId}</p>
    </div>
  );
}

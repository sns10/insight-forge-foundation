interface Props {
  chapterId: string;
}

export function ConceptsPage({ chapterId }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Concepts</h1>
      <p className="text-muted-foreground text-sm">Chapter ID: {chapterId}</p>
    </div>
  );
}

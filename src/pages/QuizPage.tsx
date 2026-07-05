interface Props {
  conceptId: string;
}

export function QuizPage({ conceptId }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Quiz</h1>
      <p className="text-muted-foreground text-sm">Concept ID: {conceptId}</p>
    </div>
  );
}

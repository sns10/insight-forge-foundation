import { createFileRoute } from "@tanstack/react-router";
import { QuizPage } from "@/pages/QuizPage";

export const Route = createFileRoute("/_authenticated/quiz/$conceptId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { conceptId } = Route.useParams();
  return <QuizPage conceptId={conceptId} />;
}

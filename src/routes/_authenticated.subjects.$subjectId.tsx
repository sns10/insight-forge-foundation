import { createFileRoute } from "@tanstack/react-router";
import { ChaptersPage } from "@/pages/ChaptersPage";

export const Route = createFileRoute("/_authenticated/subjects/$subjectId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { subjectId } = Route.useParams();
  return <ChaptersPage subjectId={subjectId} />;
}

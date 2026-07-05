import { createFileRoute } from "@tanstack/react-router";
import { ConceptsPage } from "@/pages/ConceptsPage";

export const Route = createFileRoute("/_authenticated/concepts/$chapterId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapterId } = Route.useParams();
  return <ConceptsPage chapterId={chapterId} />;
}

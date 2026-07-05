import { createFileRoute } from "@tanstack/react-router";
import { SubjectsPage } from "@/pages/SubjectsPage";

export const Route = createFileRoute("/_authenticated/subjects/")({
  component: SubjectsPage,
});

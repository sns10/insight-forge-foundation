import { Link } from "@tanstack/react-router";
import { BookOpen, PlayCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, Student</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <PlayCircle className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nothing in progress yet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">
              <Link to="/subjects" className="hover:underline">
                Subjects
              </Link>
            </CardTitle>
            <CardDescription>Browse all available subjects.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Go to subjects to begin.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Recent Activity</CardTitle>
            <CardDescription>Your latest sessions.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">No activity yet.</CardContent>
        </Card>
      </div>
    </div>
  );
}

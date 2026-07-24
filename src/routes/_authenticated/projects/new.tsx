import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/projects/new"!</div>
}

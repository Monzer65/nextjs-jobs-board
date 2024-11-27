export default function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <div>search params key: {searchParams.q}</div>;
}

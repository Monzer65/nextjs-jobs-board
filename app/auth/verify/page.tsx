import VerificationForm from "@/components/VerificationForm";
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <VerificationForm searchParams={searchParams} />
    </div>
  );
}

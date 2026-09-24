import CreateEditAsset from "@/app/shared/assets/create-edit";
import PageHeader from "@/app/shared/page-header";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return { title: `Edit Asset: ${id}` };
}

export default function EditAssetPage({ params }: Props) {
  const { id } = params;

  return (
    <>
      {/* ✅ Page Header */}
      <PageHeader title="Edit Asset" breadcrumb={[]} />

      {/* ✅ Asset Create/Edit Form Component */}
      <CreateEditAsset slug={id} />
    </>
  );
}

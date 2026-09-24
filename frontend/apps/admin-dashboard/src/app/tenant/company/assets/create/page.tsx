import CreateEditAsset from "@/app/shared/assets/create-edit";
import PageHeader from "@/app/shared/page-header";

export default function CreateAssetPage() {
  return (
    <>
      <PageHeader title="Add New Asset" breadcrumb={[]} />

      <CreateEditAsset />
    </>
  );
}

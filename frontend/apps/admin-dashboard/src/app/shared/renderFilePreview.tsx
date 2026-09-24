import SimpleBar from "@core/ui/simplebar";
import Image from "next/image";
import { PiTrashBold } from "react-icons/pi";
import { ActionIcon } from "rizzui";

const RenderFilePreview = (file: File | null) => {
  if (!file) return null;
  const isImage = file.type.startsWith("image/");
  return (
    <SimpleBar className="max-h-[280px]">
      <div className="flex items-center min-h-[58px] rounded-xl border px-3 border-muted dark:border-gray-300">
        <div className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-lg border bg-gray-50 dark:bg-transparent">
          {isImage ? (
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="object-contain"
              fill
            />
          ) : (
            <span className="text-gray-600 font-medium">{file.name}</span>
          )}
        </div>
        <div className="truncate px-2.5 text-sm font-medium">{file.name}</div>
        <ActionIcon
          // onClick={() => handleFileDelete(file.name)}
          size="sm"
          variant="flat"
          color="danger"
          className="ms-auto"
        >
          <PiTrashBold className="w-5 h-5" />
        </ActionIcon>
      </div>
    </SimpleBar>
  );
};

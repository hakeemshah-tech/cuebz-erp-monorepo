// "use client";

// import { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { Tab, ActionIcon, Input, Textarea } from "rizzui";
// import Upload from "@core/ui/upload";
// import brandkitService from "@/services/brandKitService";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import { PiTrashBold } from "react-icons/pi";
// import FormFooter from "@core/components/form-footer";

// export default function BrandKitManagementPage() {
//   const methods = useForm();
//   const { handleSubmit, setValue, watch, reset } = methods;

//   const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     fetchBrandKit();
//   }, []);

//   const fetchBrandKit = async () => {
//     setLoading(true);
//     try {
//       const response = await brandkitService.getBrandKit();
//       if (response?.data) {
//         reset(response.data);
//         setFilePreviews(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching brand kit:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const upsertBrandKit = async (data: any) => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       if (Array.isArray(data[key])) {
//         data[key].forEach((file) => formData.append(key, file));
//       } else if (data[key]) {
//         formData.append(key, data[key]);
//       }
//     });

//     try {
//       await brandkitService.upsertBrandKit(formData);
//       toast.success("Brand Kit saved successfully");
//       fetchBrandKit();
//     } catch (error) {
//       console.error("Error saving brand kit:", error);
//       toast.error("Failed to save brand kit");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (
//     fieldName: string,
//     event: any,
//     isMultiple = false
//   ) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       if (isMultiple) {
//         const updatedFiles = [
//           ...(watch(fieldName) || []),
//           ...Array.from(files),
//         ];
//         setValue(fieldName, updatedFiles);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: updatedFiles,
//         }));
//       } else {
//         setValue(fieldName, files[0]);
//         setFilePreviews((prev) => ({
//           ...prev,
//           [fieldName]: files[0],
//         }));
//       }
//     }
//   };

//   const handleFileDelete = (fieldName: string, index?: number) => {
//     if (index !== undefined) {
//       const updatedFiles = [...(watch(fieldName) || [])];
//       updatedFiles.splice(index, 1);
//       setValue(fieldName, updatedFiles);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: updatedFiles,
//       }));
//     } else {
//       setValue(fieldName, null);
//       setFilePreviews((prev) => ({
//         ...prev,
//         [fieldName]: null,
//       }));
//     }
//   };

//   const renderFilePreview = (file: File | string | null, fieldName: string) => {
//     if (!file) return null;

//     const isUrl = typeof file === "string";
//     let fileUrl: string | undefined;

//     if (isUrl) {
//       fileUrl = file;
//     } else if (file instanceof File || (file as any) instanceof Blob) {
//       fileUrl = URL.createObjectURL(file);
//     } else {
//       return null; // Prevents trying to render an invalid file
//     }

//     return (
//       <div className="mt-2 flex items-center gap-3 border rounded-lg p-2 bg-gray-50">
//         <div
//           className="relative flex items-center justify-center w-14 h-14 rounded-lg overflow-hidden border bg-gray-200 cursor-pointer"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isUrl || file.type?.startsWith("image/") ? (
//             <Image src={fileUrl} alt={fieldName} width={56} height={56} />
//           ) : (
//             <span className="text-gray-600 text-sm">File</span>
//           )}
//         </div>
//         <div
//           className="truncate cursor-pointer text-sm"
//           onClick={() => window.open(fileUrl, "_blank")}
//         >
//           {isUrl ? file.split("/").pop() : file.name}
//         </div>
//         <ActionIcon
//           onClick={() => handleFileDelete(fieldName)}
//           size="sm"
//           variant="flat"
//           color="danger"
//           className="ml-auto"
//         >
//           <PiTrashBold />
//         </ActionIcon>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Brand Kit Management</h1>

//       {loading &&     <div className="flex justify-center items-center py-10">
//   <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
// </div>}

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(upsertBrandKit)} className="space-y-6">
//           <Tab>
//             <Tab.List>
//               <Tab.ListItem>Brand Identity</Tab.ListItem>
//               <Tab.ListItem>Assets</Tab.ListItem>
//               <Tab.ListItem>Guidelines & Story</Tab.ListItem>
//             </Tab.List>
//             <Tab.Panels>
//               {/* Panel 1: Brand Identity */}
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <Input
//                     label="Brand Kit Name"
//                     {...methods.register("name")}
//                     placeholder="Enter brand name"
//                   />
//                   <div>
//                     <Upload
//                       label="Logo"
//                       onChange={(e) => handleFileUpload("logo", e)}
//                       accept="img"
//                     />
//                     {renderFilePreview(filePreviews["logo"], "logo")}
//                   </div>
//                 </div>
//               </Tab.Panel>

//               {/* Panel 2: Assets */}
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {[
//                     "business_card_files",
//                     "letterhead_file",
//                     "company_profile",
//                     "brand_guidelines",
//                     "presentation_templates",
//                     "icon_library",
//                     "sound_effects",
//                     "video_guidelines",
//                   ].map((field) => (
//                     <div key={field}>
//                       <Upload
//                         label={field.replace(/_/g, " ").toUpperCase()}
//                         onChange={(e) => handleFileUpload(field, e)}
//                         accept="imgAndPdf"
//                       />
//                       {renderFilePreview(filePreviews[field], field)}
//                     </div>
//                   ))}
//                 </div>
//               </Tab.Panel>

//               {/* Panel 3: Guidelines & Story */}
//               {/* Panel 3: Guidelines & Story */}
//               <Tab.Panel>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div className="col-span-1 w-full">
//                     <Textarea
//                       label="Brand Voice and Tone"
//                       {...methods.register("brand_voice_and_tone")}
//                       placeholder="Describe the brand voice and tone"
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="col-span-1 w-full">
//                     <Textarea
//                       label="Brand Story"
//                       {...methods.register("brand_story")}
//                       placeholder="Describe the brand story"
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="col-span-1 w-full">
//                     <Textarea
//                       label="Brand Mission"
//                       {...methods.register("brand_mission")}
//                       placeholder="Enter brand mission"
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="col-span-1 w-full">
//                     <Textarea
//                       label="Brand Vision"
//                       {...methods.register("brand_vision")}
//                       placeholder="Enter brand vision"
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="col-span-1 w-full">
//                     <Textarea
//                       label="Brand Values"
//                       {...methods.register("brand_values")}
//                       placeholder="Enter brand values"
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </Tab.Panel>
//             </Tab.Panels>
//           </Tab>

//           <FormFooter
//             isLoading={loading}
//             submitBtnText={loading ? "Saving..." : "Save Brand Kit"}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// }

// ✅ BrandKitManagementPage.tsx (Updated Document Upload View)
// ✅ BrandKitManagementPage.tsx (Improved FileCard Styling)
// "use client";

// import { useEffect, useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { Tab, Input, Textarea } from "rizzui";
// import brandkitService from "@/services/brandKitService";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import { PiTrashBold, PiEyeBold, PiUploadSimple } from "react-icons/pi";
// import FormFooter from "@core/components/form-footer";
// import PageHeader from "@/app/shared/page-header";

// export default function BrandKitManagementPage() {
//   const methods = useForm();
//   const { handleSubmit, setValue, reset } = methods;
//   const [filePreviews, setFilePreviews] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedTab, setSelectedTab] = useState(0);

//   useEffect(() => {
//     fetchBrandKit();
//   }, []);

//   const fetchBrandKit = async () => {
//     setLoading(true);
//     try {
//       const response = await brandkitService.getBrandKit();
//       if (response?.data) {
//         reset(response.data);
//         setFilePreviews(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching brand kit:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const upsertBrandKit = async (data: any) => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       if (Array.isArray(data[key])) {
//         data[key].forEach((file) => formData.append(key, file));
//       } else if (data[key]) {
//         formData.append(key, data[key]);
//       }
//     });

//     try {
//       await brandkitService.upsertBrandKit(formData);
//       toast.success("Brand Kit saved successfully");
//       fetchBrandKit();
//     } catch (error) {
//       console.error("Error saving brand kit:", error);
//       toast.error("Failed to save brand kit");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (fieldName: string, event: any) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setValue(fieldName, file);
//       setFilePreviews((prev) => ({ ...prev, [fieldName]: file }));
//     }
//   };

//   const handleFileDelete = (fieldName: string) => {
//     setValue(fieldName, null);
//     setFilePreviews((prev) => ({ ...prev, [fieldName]: null }));
//   };

//   const renderFileCard = (field: string, label: string) => {
//     const file = filePreviews[field];
//     const isUrl = typeof file === "string";
//     const fileName = isUrl ? file?.split("/").pop() : file?.name;
//     const fileUrl = isUrl
//       ? file
//       : file instanceof Blob
//         ? URL.createObjectURL(file)
//         : null;

//     return (
//       <div className="flex flex-col gap-3 bg-white rounded-[4px] p-4 hover:shadow-md transition shadow-md">
//         <div className="flex justify-between items-start">
//           <h4 className="text-sm font-medium text-gray-800 truncate w-4/5">
//             {label}
//           </h4>
//           <div className="flex gap-2">
//             {fileUrl && (
//               <button
//                 onClick={() => window.open(fileUrl, "_blank")}
//                 title="View"
//               >
//                 <img
//                   src="/download-doc.svg"
//                   alt="Download"
//                   className="w-5 h-5"
//                 />
//                 {/* <PiEyeBold className="w-5 h-5 text-gray-600 hover:text-indigo-600" /> */}
//               </button>
//             )}
//             {file && (
//               <button
//                 onClick={() => handleFileDelete(field)}
//                 title="Delete"
//                 className="cursor-pointer"
//               >
//                 <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
//           <img src="/pdf-icon.svg" alt="pdf" className="w-4 h-4" />
//           {fileName || "No file uploaded"}
//         </div>

//         <input
//           id={`upload-${field}`}
//           type="file"
//           accept="application/pdf,image/*"
//           onChange={(e) => handleFileUpload(field, e)}
//           className="hidden"
//         />
//         <label
//           htmlFor={`upload-${field}`}
//           className="flex items-center gap-1 text-xs text-primary mt-2 cursor-pointer hover:underline"
//         >
//           <PiUploadSimple className="w-4 h-4" /> Upload / Replace File
//         </label>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <PageHeader title="Brand Kit" breadcrumb={[]} />
//       <div className="p-6 mx-auto">
//         {loading && (
//           <div className="flex justify-center items-center py-10">
//             <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
//           </div>
//         )}

//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(upsertBrandKit)} className="space-y-6">
//             <Tab selectedIndex={selectedTab} onChange={setSelectedTab}>
//               <Tab.List
//                 className="flex overflow-hidden w-fit gap-0"
//                 style={{ borderBottom: "4px solid #D1D8DD", width: "100%" }}
//               >
//                 <Tab.ListItem
//                   className={`px-5 py-2 text-sm font-semibold border-t border-l rounded-tl border-[#D1D8DD] ${
//                     selectedTab === 0
//                       ? "bg-[#D1D8DD] text-gray-900"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Brand Identity
//                 </Tab.ListItem>
//                 <Tab.ListItem
//                   className={`px-5 py-2 text-sm font-semibold border-t border-r border-[#D1D8DD] ${
//                     selectedTab === 1
//                       ? "bg-[#D1D8DD] text-gray-900"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Assets
//                 </Tab.ListItem>
//                 <Tab.ListItem
//                   className={`px-5 py-2 text-sm font-semibold border-t border-r border-[#D1D8DD] ${
//                     selectedTab === 2
//                       ? "bg-[#D1D8DD] text-gray-900"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Guidelines & Story
//                 </Tab.ListItem>
//               </Tab.List>

//               <Tab.Panels>
//                 <Tab.Panel>
//                   <div className="flex flex-col gap-6">
//                     <Input
//                       label="Brand Kit Name"
//                       {...methods.register("name")}
//                       placeholder="Enter brand name"
//                       className="w-full sm:w-1/2"
//                     />
//                     <div className="w-full sm:w-1/2">
//                       {renderFileCard("logo", "Logo")}
//                     </div>
//                   </div>
//                 </Tab.Panel>

//                 <Tab.Panel>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {[
//                       "business_card_files",
//                       "letterhead_file",
//                       "company_profile",
//                       "brand_guidelines",
//                       "presentation_templates",
//                       "icon_library",
//                       "sound_effects",
//                       "video_guidelines",
//                     ].map((field) => (
//                       <div key={field}>
//                         {renderFileCard(
//                           field,
//                           field.replace(/_/g, " ").toUpperCase()
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </Tab.Panel>

//                 <Tab.Panel>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <Textarea
//                       label="Brand Voice and Tone"
//                       {...methods.register("brand_voice_and_tone")}
//                       placeholder="Describe the brand voice and tone"
//                       className="w-full"
//                     />
//                     <Textarea
//                       label="Brand Story"
//                       {...methods.register("brand_story")}
//                       placeholder="Describe the brand story"
//                       className="w-full"
//                     />
//                     <Textarea
//                       label="Brand Mission"
//                       {...methods.register("brand_mission")}
//                       placeholder="Enter brand mission"
//                       className="w-full"
//                     />
//                     <Textarea
//                       label="Brand Vision"
//                       {...methods.register("brand_vision")}
//                       placeholder="Enter brand vision"
//                       className="w-full"
//                     />
//                     <Textarea
//                       label="Brand Values"
//                       {...methods.register("brand_values")}
//                       placeholder="Enter brand values"
//                       className="w-full"
//                     />
//                   </div>
//                 </Tab.Panel>
//               </Tab.Panels>
//             </Tab>

//             <FormFooter
//               isLoading={loading}
//               submitBtnText={loading ? "Saving..." : "Save Brand Kit"}
//             />
//           </form>
//         </FormProvider>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Tab, Input, Textarea } from "rizzui";
import brandkitService from "@/services/brandKitService";
import uploadService from "@/services/uploadService";
import { toast } from "react-hot-toast";
import { PiUploadSimple } from "react-icons/pi";
import FormFooter from "@core/components/form-footer";
import PageHeader from "@/app/shared/page-header";

type PreviewMap = Record<string, string | string[] | null>;
type UploadingMap = Record<string, boolean>;

export default function BrandKitManagementPage() {
  const methods = useForm();
  const { handleSubmit, setValue, reset, getValues } = methods;
  const [filePreviews, setFilePreviews] = useState<PreviewMap>({});
  const [uploading, setUploading] = useState<UploadingMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchBrandKit();
  }, []);

  const fetchBrandKit = async () => {
    setLoading(true);
    try {
      const response = await brandkitService.getBrandKit();
      if (response?.data) {
        reset(response.data);
        setFilePreviews(response.data); // keep URLs in previews (strings or arrays)
      }
    } catch (error) {
      console.error("Error fetching brand kit:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- helpers ----------
  const isImageUrl = (url?: string | null) =>
    !!url && /\.(png|jpe?g|webp|gif|svg)$/i.test(url);

  const isValidFile = (file: File) =>
    file.type === "application/pdf" || file.type.startsWith("image/");

  const folderFor = (fieldName: string) =>
    `brandkit/${fieldName.replace(/\s+/g, "_").toLowerCase()}`;

  const setFieldUploading = (field: string, state: boolean) =>
    setUploading((s) => ({ ...s, [field]: state }));

  // ---------- presigned upload (single) ----------
  const uploadSingle = async (fieldName: string, file: File) => {
    if (!isValidFile(file)) {
      toast.error("Please upload an image or PDF file.");
      return;
    }

    const folder = folderFor(fieldName);
    const toastId = toast.loading("File is uploading...");
    setFieldUploading(fieldName, true);

    try {
      const { url } = await uploadService.uploadViaPresignedUrl(file, folder);
      if (!url) throw new Error("Upload API did not return URL");

      setValue(fieldName as any, url);
      setFilePreviews((prev) => ({ ...prev, [fieldName]: url }));
      toast.success("File uploaded!", { id: toastId });
    } catch (e: any) {
      console.error("Upload failed:", e);
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Upload failed. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setFieldUploading(fieldName, false);
    }
  };

  // ---------- presigned upload (multiple) ----------
  const uploadMultiple = async (fieldName: string, files: FileList) => {
    const validFiles = Array.from(files).filter(isValidFile);
    if (validFiles.length === 0) {
      toast.error("Please select images or PDFs.");
      return;
    }

    const folder = folderFor(fieldName);
    const toastId = toast.loading("Uploading files...");
    setFieldUploading(fieldName, true);

    try {
      const uploaded = await Promise.all(
        validFiles.map(async (file) => {
          const { url } = await uploadService.uploadViaPresignedUrl(
            file,
            folder
          );
          return url;
        })
      );

      const newUrls = uploaded.filter(Boolean) as string[];
      const existing = getValues(fieldName) as any;
      const merged = Array.isArray(existing)
        ? [...existing, ...newUrls]
        : newUrls;

      setValue(fieldName as any, merged);
      setFilePreviews((prev) => ({ ...prev, [fieldName]: merged }));
      toast.success("Files uploaded!", { id: toastId });
    } catch (e: any) {
      console.error("Upload failed:", e);
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Upload failed. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setFieldUploading(fieldName, false);
    }
  };

  // ---------- input handlers ----------
  const handleFileInput = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>,
    multiple = false
  ) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      uploadMultiple(fieldName, files);
    } else {
      uploadSingle(fieldName, files[0]);
    }

    // allow reselection of same file
    queueMicrotask(() => {
      try {
        inputEl.value = "";
      } catch {}
    });
  };

  const handleFileDelete = (fieldName: string, index?: number) => {
    setFilePreviews((prev) => {
      const current = prev[fieldName];
      if (Array.isArray(current)) {
        const next = current.filter((_, i) => i !== index);
        setValue(fieldName as any, next);
        return { ...prev, [fieldName]: next };
      } else {
        setValue(fieldName as any, null);
        return { ...prev, [fieldName]: null };
      }
    });
  };

  // ---------- compact icon+name (single) ----------
  const renderSingleCard = (field: string, label: string) => {
    const value = filePreviews[field] as string | null;
    const url = typeof value === "string" ? value : null;
    const name = url ? url.split("/").pop() : "";
    const isImg = isImageUrl(url);
    const isUploading = !!uploading[field];

    return (
      <div className="flex flex-col gap-3 bg-white rounded-[4px] p-4 hover:shadow-md transition shadow-md">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-800 truncate w-4/5">
            {label}
          </h4>
          <div className="flex gap-2">
            {url && (
              <button
                onClick={() => window.open(url, "_blank")}
                title="View"
                disabled={isUploading}
              >
                <img src="/download-doc.svg" alt="View" className="w-5 h-5" />
              </button>
            )}
            {url && (
              <button
                onClick={() => handleFileDelete(field)}
                title="Delete"
                className="cursor-pointer"
                disabled={isUploading}
              >
                <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* compact icon + filename (no large preview) */}
        {url ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 truncate">
            {isImg ? (
              // tiny image thumb
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={label}
                className="w-6 h-6 object-cover rounded"
              />
            ) : (
              <img src="/pdf-icon.svg" alt="file" className="w-4 h-4" />
            )}
            <span className="truncate">{name}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No file uploaded</div>
        )}

        <input
          id={`upload-${field}`}
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileInput(field, e, false)}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor={`upload-${field}`}
          className={`flex items-center gap-1 text-xs mt-1 cursor-pointer ${
            isUploading
              ? "text-gray-400 pointer-events-none"
              : "text-primary hover:underline"
          }`}
        >
          <PiUploadSimple className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload / Replace File"}
        </label>
      </div>
    );
  };

  // ---------- compact icon+name (multiple) ----------
  const renderMultiCard = (field: string, label: string) => {
    const value = filePreviews[field];
    const urls: string[] = Array.isArray(value)
      ? value
      : value
        ? [value as string]
        : [];
    const isUploading = !!uploading[field];

    return (
      <div className="flex flex-col gap-3 bg-white rounded-[4px] p-4 hover:shadow-md transition shadow-md">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-800">{label}</h4>
          <div className="flex items-center gap-2">
            <input
              id={`upload-${field}`}
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={(e) => handleFileInput(field, e, true)}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor={`upload-${field}`}
              className={`flex items-center gap-1 text-xs cursor-pointer ${
                isUploading
                  ? "text-gray-400 pointer-events-none"
                  : "text-primary hover:underline"
              }`}
            >
              <PiUploadSimple className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Add Files"}
            </label>
          </div>
        </div>

        {urls.length === 0 ? (
          <div className="text-sm text-gray-500">No files uploaded</div>
        ) : (
          <div className="space-y-2">
            {urls.map((u, i) => {
              const isImg = isImageUrl(u);
              const name = u.split("/").pop();

              return (
                <div
                  key={u + i}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isImg ? (
                      // tiny image thumb
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u}
                        alt={`${label}-${i}`}
                        className="w-6 h-6 object-cover rounded"
                      />
                    ) : (
                      <img src="/pdf-icon.svg" alt="file" className="w-4 h-4" />
                    )}
                    <span className="truncate text-sm text-gray-700">
                      {name}
                    </span>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => window.open(u, "_blank")}
                      title="View"
                      disabled={isUploading}
                    >
                      <img
                        src="/download-doc.svg"
                        alt="View"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={() => handleFileDelete(field, i)}
                      title="Delete"
                      disabled={isUploading}
                    >
                      <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ---------- submit JSON (no FormData) ----------
  const upsertBrandKit = async (data: any) => {
    setLoading(true);
    try {
      const payload: any = {
        name: data.name ?? undefined,
        brand_voice_and_tone: data.brand_voice_and_tone ?? undefined,
        brand_story: data.brand_story ?? undefined,
        brand_mission: data.brand_mission ?? undefined,
        brand_vision: data.brand_vision ?? undefined,
        brand_values: data.brand_values ?? undefined,

        logo: (filePreviews.logo as string) ?? undefined,
        business_card_files:
          (filePreviews.business_card_files as string) ?? undefined,
        letterhead_file: (filePreviews.letterhead_file as string) ?? undefined,
        company_profile: (filePreviews.company_profile as string) ?? undefined,
        brand_guidelines:
          (filePreviews.brand_guidelines as string) ?? undefined,
        icon_library: (filePreviews.icon_library as string) ?? undefined,
        sound_effects: (filePreviews.sound_effects as string) ?? undefined,
        video_guidelines:
          (filePreviews.video_guidelines as string) ?? undefined,
      };

      const pt = Array.isArray(filePreviews.presentation_templates)
        ? filePreviews.presentation_templates
        : filePreviews.presentation_templates
          ? [filePreviews.presentation_templates as string]
          : [];
      if (pt.length > 0) payload.presentation_templates = pt;

      if (Array.isArray(data.typography) && data.typography.length > 0) {
        payload.typography = data.typography;
      }
      if (Array.isArray(data.color_palette) && data.color_palette.length > 0) {
        payload.color_palette = data.color_palette;
      }

      await brandkitService.upsertBrandKit(payload);
      toast.success("Brand Kit saved successfully");
      await fetchBrandKit();
    } catch (error) {
      console.error("Error saving brand kit:", error);
      toast.error("Failed to save brand kit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Brand Kit" breadcrumb={[]} />
      <div className="p-6 mx-auto">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(upsertBrandKit)} className="space-y-6">
            <Tab selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List
                className="flex overflow-hidden w-fit gap-0"
                style={{ borderBottom: "4px solid #D1D8DD", width: "100%" }}
              >
                <Tab.ListItem
                  className={`px-5 py-2 text-sm font-semibold border-t border-l rounded-tl border-[#D1D8DD] ${
                    selectedTab === 0
                      ? "bg-[#D1D8DD] text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Brand Identity
                </Tab.ListItem>
                <Tab.ListItem
                  className={`px-5 py-2 text-sm font-semibold border-t border-r border-[#D1D8DD] ${
                    selectedTab === 1
                      ? "bg-[#D1D8DD] text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Assets
                </Tab.ListItem>
                <Tab.ListItem
                  className={`px-5 py-2 text-sm font-semibold border-t border-r border-[#D1D8DD] ${
                    selectedTab === 2
                      ? "bg-[#D1D8DD] text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Guidelines & Story
                </Tab.ListItem>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <div className="flex flex-col gap-6">
                    <Input
                      label="Brand Kit Name"
                      {...methods.register("name")}
                      placeholder="Enter brand name"
                      className="w-full sm:w-1/2"
                    />
                    <div className="w-full sm:w-1/2">
                      {renderSingleCard("logo", "Logo")}
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderSingleCard(
                      "business_card_files",
                      "BUSINESS CARD FILES"
                    )}
                    {renderSingleCard("letterhead_file", "LETTERHEAD FILE")}
                    {renderSingleCard("company_profile", "COMPANY PROFILE")}
                    {renderSingleCard("brand_guidelines", "BRAND GUIDELINES")}
                    {renderMultiCard(
                      "presentation_templates",
                      "PRESENTATION TEMPLATES"
                    )}
                    {/* {renderMultiCard("imagery", "IMAGERY")} */}
                    {renderSingleCard("icon_library", "ICON LIBRARY")}
                    {renderSingleCard("sound_effects", "SOUND EFFECTS")}
                    {renderSingleCard("video_guidelines", "VIDEO GUIDELINES")}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6 textarea-forms">
                    <Textarea
                      label="Brand Voice and Tone"
                      {...methods.register("brand_voice_and_tone")}
                      placeholder="Describe the brand voice and tone"
                      className="w-full"
                      rows={2}
                    />
                    <Textarea
                      label="Brand Story"
                      {...methods.register("brand_story")}
                      placeholder="Describe the brand story"
                      className="w-full"
                      rows={2}
                    />
                    <Textarea
                      label="Brand Mission"
                      {...methods.register("brand_mission")}
                      placeholder="Enter brand mission"
                      className="w-full"
                      rows={2}
                    />
                    <Textarea
                      label="Brand Vision"
                      {...methods.register("brand_vision")}
                      placeholder="Enter brand vision"
                      className="w-full"
                      rows={2}
                    />
                    <Textarea
                      label="Brand Values"
                      {...methods.register("brand_values")}
                      placeholder="Enter brand values"
                      className="w-full"
                      rows={2}
                    />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab>

            <FormFooter
              isLoading={loading}
              submitBtnText={loading ? "Saving..." : "Save Brand Kit"}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import credentialsService from "@/services/credientialsSevice";
// import {
//   Accordion,
//   ActionIcon,
//   Button,
//   Input,
//   Modal,
//   Password,
//   Tooltip,
// } from "rizzui";
// import { useForm, FormProvider, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import { FiEdit, FiTrash, FiArrowDown, FiPlus, FiMinus } from "react-icons/fi";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";

// export default function CredentialsManagementPage() {
//   const methods = useForm({
//     defaultValues: {
//       platform: "",
//       accounts: [{ name: "", email: "", password: "" }],
//     },
//   });
//   const { register, handleSubmit, reset, setValue, control } = methods;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "accounts",
//   });

//   const [credentials, setCredentials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [otpRequired, setOtpRequired] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpModalOpen, setOtpModalOpen] = useState(false);

//   // ✅ Fetch Credentials with OTP Verification Handling
//   const fetchCredentials = async () => {
//     setLoading(true);
//     try {
//       const response = await credentialsService.getCredentials();
//       setCredentials(response.data);
//     } catch (error) {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchCredentials = useCallback(
//     debounce(fetchCredentials, 300),
//     []
//   );

//   useEffect(() => {
//     debouncedFetchCredentials();
//     return () => debouncedFetchCredentials.cancel();
//   }, [debouncedFetchCredentials]);

//   const handleOtpSubmit = async () => {
//     try {
//       await credentialsService.verifyOTP(otp);
//       setOtpModalOpen(false);
//       setOtpRequired(false);
//       fetchCredentials();
//     } catch {
//       toast.error("Invalid OTP. Please try again.");
//     }
//   };

//   // ✅ Submit Form (Create / Update)
//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       await credentialsService.upsertCredential({
//         ...data,
//         _id: editingId, // Ensure correct credential is updated
//       });

//       toast.success(
//         editingId
//           ? "Credential updated successfully."
//           : "Credential added successfully."
//       );

//       handleClear();
//       fetchCredentials();
//     } catch {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle clearing form & exiting edit mode
//   const handleClear = () => {
//     reset({
//       platform: "",
//       accounts: [{ name: "", email: "", password: "" }],
//     });
//     setEditingId(null);
//   };

//   // ✅ Handle Edit - Load selected credential into form
//   const handleEdit = (cred: any) => {
//     setEditingId(cred._id);
//     setValue("platform", cred.platform);
//     setValue("accounts", cred.accounts); // ✅ Loads all accounts correctly

//     // Reset the accounts field array so UI updates properly
//     reset({
//       platform: cred.platform,
//       accounts: cred.accounts.map((account: any) => ({
//         name: account.name,
//         email: account.email,
//         password: account.password,
//       })),
//     });

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ✅ Handle Delete Credential
//   const handleDelete = async (platform: string) => {
//     setLoading(true);
//     try {
//       await credentialsService.deleteCredential(platform);
//       toast.success("Credential deleted successfully.");
//       fetchCredentials();
//     } catch {
//       toast.error("Failed to delete credential.");
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-screen-xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Credential Management
//       </h1>

//       {/* OTP Verification Modal */}
//       {otpRequired && (
//         <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
//           <div className="p-6">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Enter OTP to Access
//             </h3>
//             <Input
//               label="One-Time Password"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full"
//             />
//             <Button className="mt-4 w-full" onClick={handleOtpSubmit}>
//               Verify OTP
//             </Button>
//           </div>
//         </Modal>
//       )}

//       {/* Credential Form */}
//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">
//             {editingId ? "Edit Credential" : "Add Credential"}
//           </h3>
//           <Input
//             label="Platform"
//             {...register("platform")}
//             required
//             className="w-full"
//             disabled={!!editingId}
//           />

//           {/* Accounts Section (Multiple Accounts Support) */}
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
//             >
//               <Input
//                 label="Account Name"
//                 {...register(`accounts.${index}.name`)}
//                 required
//                 className="w-full"
//               />
//               <Input
//                 label="Email"
//                 type="email"
//                 {...register(`accounts.${index}.email`)}
//                 required
//                 className="w-full"
//                 autoComplete="off"
//               />
//               <Password
//                 label="Password"
//                 placeholder="Enter your password"
//                 {...register(`accounts.${index}.password`)}
//                 required
//                 className="w-full"
//                 autoComplete="new-password"
//               />
//               {index > 0 && (
//                 <Button
//                   type="button"
//                   className="mt-6 bg-red-500 hover:bg-red-600 text-white"
//                   onClick={() => remove(index)}
//                 >
//                   <FiMinus />
//                 </Button>
//               )}
//             </div>
//           ))}

//           {/* Add More Accounts Button */}
//           <Button
//             type="button"
//             onClick={() => append({ name: "", email: "", password: "" })}
//             className="bg-green-500 hover:bg-green-600 text-white w-full"
//           >
//             <FiPlus className="mr-2" /> Add Another Account
//           </Button>

//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               {editingId ? "Update" : "Save"} Credential
//             </Button>
//             <Button
//               type="button"
//               onClick={handleClear}
//               className="w-full bg-gray-500 hover:bg-gray-600"
//             >
//               Clear
//             </Button>
//           </div>
//         </form>
//       </FormProvider>

//       {/* Credential Accordion List */}
//       <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">
//           Stored Credentials
//         </h3>
//         {credentials.length === 0 ? (
//           <p className="text-center text-gray-500">No credentials found.</p>
//         ) : (
//           credentials.map((cred: any) => (
//             <Accordion
//               key={cred._id}
//               className="border-b last-of-type:border-b-0"
//             >
//               <Accordion.Header>
//                 {({ open }) => (
//                   <div className="flex w-full cursor-pointer items-center justify-between py-5 text-lg font-semibold text-gray-800">
//                     {cred.platform}
//                     <FiArrowDown
//                       className={`h-5 w-5 transform transition-transform duration-300 ${
//                         open ? "rotate-180" : "rotate-0"
//                       }`}
//                     />
//                   </div>
//                 )}
//               </Accordion.Header>
//               <Accordion.Body>
//                 {cred.accounts.map((account: any) => (
//                   <div key={account._id} className="p-4 rounded-lg bg-gray-50">
//                     <p>{account.name}</p>
//                     <p>{account.email}</p>
//                   </div>
//                 ))}
//                 <Button onClick={() => handleEdit(cred)}>Edit</Button>
//               </Accordion.Body>
//             </Accordion>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// ---------------------------------------
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import credentialsService from "@/services/credientialsSevice";
// import {
//   Accordion,
//   ActionIcon,
//   Button,
//   Input,
//   Modal,
//   Password,
//   Tooltip,
// } from "rizzui";
// import { useForm, FormProvider, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import { FiEdit, FiTrash, FiArrowDown, FiPlus, FiMinus } from "react-icons/fi";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";

// export default function CredentialsManagementPage() {
//   const methods = useForm({
//     defaultValues: {
//       platform: "",
//       accounts: [{ name: "", email: "", password: "" }],
//     },
//   });
//   const { register, handleSubmit, reset, setValue, control } = methods;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "accounts",
//   });

//   const [credentials, setCredentials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [otpRequired, setOtpRequired] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpModalOpen, setOtpModalOpen] = useState(false);

//   // ✅ Fetch Credentials with OTP Verification Handling
//   const fetchCredentials = async () => {
//     setLoading(true);
//     try {
//       const response = await credentialsService.getCredentials();
//       setCredentials(response.data);
//     } catch (error) {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchCredentials = useCallback(
//     debounce(fetchCredentials, 300),
//     []
//   );

//   useEffect(() => {
//     debouncedFetchCredentials();
//     return () => debouncedFetchCredentials.cancel();
//   }, [debouncedFetchCredentials]);

//   const handleOtpSubmit = async () => {
//     try {
//       await credentialsService.verifyOTP(otp);
//       setOtpModalOpen(false);
//       setOtpRequired(false);
//       fetchCredentials();
//     } catch {
//       toast.error("Invalid OTP. Please try again.");
//     }
//   };

//   // ✅ Submit Form (Create / Update)
//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       await credentialsService.upsertCredential({
//         ...data,
//         _id: editingId, // Ensure correct credential is updated
//       });

//       toast.success(
//         editingId
//           ? "Credential updated successfully."
//           : "Credential added successfully."
//       );

//       handleClear();
//       fetchCredentials();
//     } catch {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle clearing form & exiting edit mode
//   const handleClear = () => {
//     reset({
//       platform: "",
//       accounts: [{ name: "", email: "", password: "" }],
//     });
//     setEditingId(null);
//   };

//   // ✅ Handle Edit - Load selected credential into form
//   const handleEdit = (cred: any) => {
//     setEditingId(cred._id);
//     setValue("platform", cred.platform);
//     setValue("accounts", cred.accounts);

//     reset({
//       platform: cred.platform,
//       accounts: cred.accounts.map((account: any) => ({
//         name: account.name,
//         email: account.email,
//         password: account.password,
//       })),
//     });

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ✅ Handle Delete Credential
//   const handleDelete = async (platform: string) => {
//     setLoading(true);
//     try {
//       await credentialsService.deleteCredential(platform);
//       toast.success("Credential deleted successfully.");
//       fetchCredentials();
//     } catch {
//       toast.error("Failed to delete credential.");
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-10 max-w-screen-2xl mx-auto w-full">
//       <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
//         Credential Management
//       </h1>

//       {/* OTP Verification Modal */}
//       {otpRequired && (
//         <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
//           <div className="p-6">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               Enter OTP to Access
//             </h3>
//             <Input
//               label="One-Time Password"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full"
//             />
//             <Button className="mt-4 w-full" onClick={handleOtpSubmit}>
//               Verify OTP
//             </Button>
//           </div>
//         </Modal>
//       )}

//       {/* Credential Form */}
//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-6 bg-white p-10 rounded-xl shadow-lg w-full"
//         >
//           <h3 className="text-2xl font-semibold text-gray-800">
//             {editingId ? "Edit Credential" : "Add Credential"}
//           </h3>
//           <Input
//             label="Platform"
//             {...register("platform")}
//             required
//             className="w-full"
//             disabled={!!editingId}
//           />

//           {/* Accounts Section (Multiple Accounts Support) */}
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gray-100 p-4 rounded-lg"
//             >
//               <Input
//                 label="Account Name"
//                 {...register(`accounts.${index}.name`)}
//                 required
//                 className="w-full"
//               />
//               <Input
//                 label="Email"
//                 type="email"
//                 {...register(`accounts.${index}.email`)}
//                 required
//                 className="w-full"
//                 autoComplete="off"
//               />
//               <Password
//                 label="Password"
//                 placeholder="Enter your password"
//                 {...register(`accounts.${index}.password`)}
//                 required
//                 className="w-full"
//                 autoComplete="new-password"
//               />
//               {index > 0 && (
//                 <Button
//                   type="button"
//                   className="mt-6 bg-red-500 hover:bg-red-600 text-white"
//                   onClick={() => remove(index)}
//                 >
//                   <FiMinus />
//                 </Button>
//               )}
//             </div>
//           ))}

//           {/* Add More Accounts Button */}
//           <Button
//             type="button"
//             onClick={() => append({ name: "", email: "", password: "" })}
//             className="bg-green-500 hover:bg-green-600 text-white w-full"
//           >
//             <FiPlus className="mr-2" /> Add Another Account
//           </Button>

//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               {editingId ? "Update" : "Save"} Credential
//             </Button>
//             <Button
//               type="button"
//               onClick={handleClear}
//               className="w-full bg-gray-500 hover:bg-gray-600"
//             >
//               Clear
//             </Button>
//           </div>
//         </form>
//       </FormProvider>

//       {/* Credential Accordion List */}
//       <div className="mt-8 bg-white p-10 rounded-xl shadow-lg">
//         <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//           Stored Credentials
//         </h3>
//         {credentials.length === 0 ? (
//           <p className="text-center text-gray-500">No credentials found.</p>
//         ) : (
//           credentials.map((cred: any) => (
//             <Accordion
//               key={cred._id}
//               className="border-b last-of-type:border-b-0"
//             >
//               <Accordion.Header>
//                 {({ open }) => (
//                   <div className="flex justify-between py-5 text-xl font-semibold">
//                     {cred.platform}
//                     <FiArrowDown
//                       className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
//                     />
//                   </div>
//                 )}
//               </Accordion.Header>
//               <Accordion.Body>
//                 {cred.accounts.map((account: any) => (
//                   <div key={account._id} className="p-4 rounded-lg bg-gray-50">
//                     <p>{account.name}</p>
//                     <p>{account.email}</p>
//                   </div>
//                 ))}
//                 <Button className="mt-2 mb-2" onClick={() => handleEdit(cred)}>
//                   View All Credientials
//                 </Button>
//               </Accordion.Body>
//             </Accordion>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
// value={filters.globalSearch}
// onClear={() =>
//   setFilters((prev: any) => ({ ...prev, globalSearch: "" }))
// }
// onChange={(e) =>
//   setFilters((prev: any) => ({
//     ...prev,
//     globalSearch: e.target.value,
//   }))
// }

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import credentialsService from "@/services/credientialsSevice";
// import { Button, Input, Modal, Password, Tooltip, Drawer } from "rizzui";
// import { useForm, FormProvider, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import { FiEdit, FiTrash, FiPlus, FiMinus } from "react-icons/fi";
// import { debounce } from "lodash";
// import DeletePopover from "@core/components/delete-popover";
// import PageHeader from "@/app/shared/page-header";
// import { PiMagnifyingGlassBold, PiPlusBold } from "react-icons/pi";

// export default function CredentialsManagementPage() {
//   const methods = useForm({
//     defaultValues: {
//       platform: "",
//       accounts: [{ name: "", email: "", password: "" }],
//     },
//   });

//   const { register, handleSubmit, reset, setValue, control } = methods;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "accounts",
//   });

//   const [credentials, setCredentials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [otpRequired, setOtpRequired] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpModalOpen, setOtpModalOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const fetchCredentials = async () => {
//     setLoading(true);
//     try {
//       const response = await credentialsService.getCredentials();
//       setCredentials(response.data);
//     } catch (error) {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchCredentials = useCallback(
//     debounce(fetchCredentials, 300),
//     []
//   );

//   useEffect(() => {
//     debouncedFetchCredentials();
//     return () => debouncedFetchCredentials.cancel();
//   }, [debouncedFetchCredentials]);

//   const handleOtpSubmit = async () => {
//     try {
//       await credentialsService.verifyOTP(otp);
//       setOtpModalOpen(false);
//       setOtpRequired(false);
//       fetchCredentials();
//     } catch {
//       toast.error("Invalid OTP. Please try again.");
//     }
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       await credentialsService.upsertCredential({ ...data, _id: editingId });
//       toast.success(
//         editingId
//           ? "Credential updated successfully."
//           : "Credential added successfully."
//       );
//       handleClear();
//       fetchCredentials();
//     } catch {
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     reset({ platform: "", accounts: [{ name: "", email: "", password: "" }] });
//     setEditingId(null);
//     setDrawerOpen(false);
//   };

//   const handleEdit = (cred) => {
//     setEditingId(cred._id);
//     reset({
//       platform: cred.platform,
//       accounts: cred.accounts.map(({ name, email, password }) => ({
//         name,
//         email,
//         password,
//       })),
//     });
//     setDrawerOpen(true);
//   };

//   const handleDelete = async (platform) => {
//     setLoading(true);
//     try {
//       await credentialsService.deleteCredential(platform);
//       toast.success("Credential deleted successfully.");
//       fetchCredentials();
//     } catch {
//       toast.error("Failed to delete credential.");
//       setOtpRequired(true);
//       setOtpModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-screen-xl mx-auto w-full">
//       <div style={{ marginTop: "-10px" }}>
//         <PageHeader title="Credential Management" breadcrumb={[]}></PageHeader>
//       </div>
//       <div className="p-4">
//         <div className="flex items-center gap-2 mb-6">
//           <Button
//             onClick={() => {
//               handleClear();
//               setDrawerOpen(true);
//             }}
//           >
//             <PiPlusBold className="me-1.5 size-[17px]" />
//             Add Credential
//           </Button>
//           <Input
//             type="search"
//             placeholder="Search by employee name..."
//             inputClassName="h-10"
//             clearable={true}
//             prefix={<PiMagnifyingGlassBold className="size-4" />}
//           />
//         </div>

//         {/* OTP Modal */}
//         {otpRequired && (
//           <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
//             <div className="p-6">
//               <h3 className="text-lg font-semibold mb-4 text-center">
//                 Enter OTP to Access
//               </h3>
//               <Input
//                 label="One-Time Password"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 className="w-full"
//               />
//               <Button className="mt-4 w-full" onClick={handleOtpSubmit}>
//                 Verify OTP
//               </Button>
//             </div>
//           </Modal>
//         )}

//         {/* Drawer for Add/Edit */}
//         <Drawer
//           title={editingId ? "Edit Credential" : "Add Credential"}
//           isOpen={drawerOpen}
//           onClose={() => setDrawerOpen(false)}
//         >
//           <FormProvider {...methods}>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
//               <Input
//                 label="Platform"
//                 {...register("platform")}
//                 required
//                 disabled={!!editingId}
//                 className="w-full"
//               />

//               {fields.map((field, index) => (
//                 <div key={field.id} className="border-b pb-4 mb-4">
//                   <Input
//                     label="Account Name"
//                     {...register(`accounts.${index}.name`)}
//                     required
//                     className="w-full mb-2"
//                   />
//                   <Input
//                     label="Email"
//                     type="email"
//                     {...register(`accounts.${index}.email`)}
//                     required
//                     className="w-full mb-2"
//                   />
//                   <Password
//                     label="Password"
//                     {...register(`accounts.${index}.password`)}
//                     required
//                     className="w-full"
//                   />
//                   {index > 0 && (
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       className="mt-2 text-red-600 border-red-600"
//                       onClick={() => remove(index)}
//                     >
//                       <FiMinus className="mr-2" /> Remove
//                     </Button>
//                   )}
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() => append({ name: "", email: "", password: "" })}
//                 className="text-violet-700 hover:underline text-sm"
//               >
//                 + Add Another Account
//               </button>

//               <div className="flex justify-end gap-3 pt-4">
//                 <Button type="submit" className="bg-violet-700 text-white">
//                   {editingId ? "Update" : "Save"}
//                 </Button>
//                 <Button type="button" variant="outline" onClick={handleClear}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </FormProvider>
//         </Drawer>

//         {/* Table View */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <table className="w-full text-sm text-left">
//             <thead>
//               <tr className="text-xs font-medium text-gray-500 border-b">
//                 <th className="py-2 px-3">Platform</th>
//                 <th className="py-2 px-3">Account Name</th>
//                 <th className="py-2 px-3">Email</th>
//                 <th className="py-2 px-3">Password</th>
//                 <th className="py-2 px-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {credentials.map((cred) => (
//                 <React.Fragment key={cred._id}>
//                   {cred.accounts.map((acc, idx) => (
//                     <tr key={acc._id || idx} className="border-b">
//                       <td className="px-3 py-2 font-semibold text-gray-800">
//                         {idx === 0 ? cred.platform : ""}
//                       </td>
//                       <td className="px-3 py-2">{acc.name}</td>
//                       <td className="px-3 py-2">{acc.email}</td>
//                       <td className="px-3 py-2">********</td>
//                       <td className="px-3 py-2 flex items-center gap-2">
//                         <Tooltip content="Edit">
//                           <button
//                             onClick={() => handleEdit(cred)}
//                             className="text-gray-600 hover:text-blue-600"
//                           >
//                             <FiEdit />
//                           </button>
//                         </Tooltip>
//                         <Tooltip content="Delete">
//                           <DeletePopover
//                             title="Delete Credential"
//                             description="Are you sure you want to delete this credential?"
//                             onConfirm={() => handleDelete(cred.platform)}
//                           >
//                             <button className="text-gray-600 hover:text-red-600">
//                               <FiTrash />
//                             </button>
//                           </DeletePopover>
//                         </Tooltip>
//                       </td>
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// code updated to reflect custom-styled credential table UI
"use client";

import React, { useState, useEffect, useCallback } from "react";
import credentialsService from "@/services/credientialsSevice";
import { Button, Input, Modal, Password, Tooltip, Drawer } from "rizzui";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit, FiTrash, FiPlus, FiMinus, FiCopy } from "react-icons/fi";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import PageHeader from "@/app/shared/page-header";
import { PiMagnifyingGlassBold, PiPlusBold } from "react-icons/pi";
import { MdClose } from "react-icons/md";

export default function CredentialsManagementPage() {
  const methods = useForm({
    defaultValues: {
      platform: "",
      accounts: [{ name: "", email: "", password: "" }],
    },
  });

  const { register, handleSubmit, reset, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "accounts",
  });

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const response = await credentialsService.getCredentials();
      setCredentials(response.data);
    } catch {
      setOtpRequired(true);
      setOtpModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCredentials = useCallback(
    debounce(fetchCredentials, 300),
    []
  );

  useEffect(() => {
    debouncedFetchCredentials();
    return () => debouncedFetchCredentials.cancel();
  }, [debouncedFetchCredentials]);

  const handleOtpSubmit = async () => {
    try {
      await credentialsService.verifyOTP(otp);
      setOtpModalOpen(false);
      setOtpRequired(false);
      fetchCredentials();
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await credentialsService.upsertCredential({ ...data, _id: editingId });
      toast.success(
        editingId
          ? "Credential updated successfully."
          : "Credential added successfully."
      );
      handleClear();
      fetchCredentials();
    } catch {
      setOtpRequired(true);
      setOtpModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset({ platform: "", accounts: [{ name: "", email: "", password: "" }] });
    setEditingId(null);
    setDrawerOpen(false);
  };

  const handleEdit = (cred: any) => {
    setEditingId(cred._id);
    reset({
      platform: cred.platform,
      accounts: cred.accounts.map(({ name, email, password }: any) => ({
        name,
        email,
        password,
      })),
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (platform: any) => {
    setLoading(true);
    try {
      await credentialsService.deleteCredential(platform);
      toast.success("Credential deleted successfully.");
      fetchCredentials();
    } catch {
      toast.error("Failed to delete credential.");
      setOtpRequired(true);
      setOtpModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value: any) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <PageHeader title="Credential Management" breadcrumb={[]} />
      <div className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => {
              handleClear();
              setDrawerOpen(true);
            }}
          >
            <span className="mr-1">Add Credential</span> <PiPlusBold />
          </Button>
          <Input
            type="search"
            placeholder="Search"
            className="placeholder:text-[#657079]"
            inputClassName="h-10 bg-white border-[#657079]"
            clearable
            prefix={<PiMagnifyingGlassBold className="size-4" />}
          />
        </div>

        {otpRequired && (
          <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Enter OTP to Access
              </h3>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full"
              />
              <Button className="mt-4 w-full" onClick={handleOtpSubmit}>
                Verify OTP
              </Button>
            </div>
          </Modal>
        )}

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          containerClassName="w-full sm:!max-w-[calc(100%-980px)] !shadow-2xl z-[999]"
          className="!p-0"
        >
          {/* Full-height column */}
          <div className="flex h-screen flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#e8eaeb]">
              <h3 className="text-base font-semibold">
                {editingId ? "Edit Credential" : "Add Credential"}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <FormProvider {...methods}>
              {/* Form fills remaining drawer height */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex min-h-0 flex-1 flex-col"
              >
                {/* Scrollable content area */}
                <div
                  className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 space-y-6 overscroll-contain"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {/* Platform Field */}
                  <Input
                    label="Platform"
                    {...register("platform")}
                    required
                    className="w-full"
                    inputClassName="rounded-md border-gray-300"
                  />

                  {/* Account Fields */}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border-t first:border-t-0 pt-5 first:pt-0"
                    >
                      {index > 0 && (
                        <div className="flex justify-end -mb-4">
                          <Button
                            size="sm"
                            variant="text"
                            onClick={() => remove(index)}
                          >
                            <img
                              src="/delete.svg"
                              alt="Delete"
                              className="w-6 h-6"
                            />
                          </Button>
                        </div>
                      )}

                      <div className="space-y-4 px-10">
                        <Input
                          label="Account Name"
                          {...register(`accounts.${index}.name`)}
                          required
                          className="w-full"
                          inputClassName="rounded-md border-gray-300"
                        />
                        <Input
                          label="Email"
                          type="email"
                          {...register(`accounts.${index}.email`)}
                          required
                          className="w-full"
                          inputClassName="rounded-md border-gray-300"
                        />
                        <Password
                          label="Password"
                          {...register(`accounts.${index}.password`)}
                          required
                          className="w-full"
                          inputClassName="rounded-md border-gray-300"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Another */}
                  <button
                    type="button"
                    onClick={() =>
                      append({ name: "", email: "", password: "" })
                    }
                    className="text-primary hover:underline text-sm font-semibold"
                  >
                    + Add Another Account
                  </button>

                  {/* Spacer so the last input isn't flush against the footer on short screens */}
                  <div className="h-4" />
                </div>

                {/* Footer (NOT sticky): naturally sits at bottom because of flex layout */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-start gap-3">
                    <Button type="submit" className="bg-primary text-white">
                      Save
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#9AC6C5] text-[#000] hover:bg-[#9AC6C5]"
                      onClick={handleClear}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </Drawer>

        <div className="grid grid-cols-12 text-xs font-medium text-gray-500 px-4 mb-2">
          <div className="col-span-3">Platform</div>
          <div className="col-span-3">Account Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Password</div>
        </div>

        <div className="space-y-4">
          {credentials.map((cred: any) => (
            <div
              key={cred._id}
              className="grid grid-cols-12 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
            >
              <div className="col-span-3 p-4 font-semibold text-gray-900 border-gray-200 flex items-start">
                {cred.platform}
              </div>
              <div className="col-span-9 p-4 space-y-2 w-full">
                {cred.accounts.map((acc: any, idx: any) => (
                  <div
                    key={idx}
                    className={`group grid grid-cols-3 items-center text-sm text-gray-700 relative ${idx > 0 ? "border-t border-gray-200 pt-2 mt-2" : ""}`}
                  >
                    <div>{acc.name}</div>
                    <div>{acc.email}</div>
                    <div className="flex justify-between items-center">
                      <div>
                        ********
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-gray-700"
                          onClick={() => handleCopy(acc.password)}
                        >
                          <img
                            src="/copy.svg"
                            alt="Edit"
                            className="w-5 h-5 cursor-pointer"
                          />
                        </button>
                      </div>

                      {idx === 0 && (
                        <div className="flex gap-3 ml-3">
                          <Tooltip content="Edit">
                            <img
                              onClick={() => handleEdit(cred)}
                              src="/edit.svg"
                              alt="Edit"
                              className="w-5 h-5 cursor-pointer"
                            />

                            {/* <button
                              
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <FiEdit />
                            </button> */}
                          </Tooltip>
                          <Tooltip content="Delete">
                            <DeletePopover
                              title="Delete Credential"
                              description="Are you sure you want to delete this credential?"
                              onDelete={() => handleDelete(cred.platform)}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

{
  /* <Drawer
          title={editingId ? "Edit Credential" : "Add Credential"}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
              <Input
                label="Platform"
                {...register("platform")}
                required
                disabled={!!editingId}
                className="w-full"
              />
              {fields.map((field, index) => (
                <div key={field.id} className="border-b pb-4 mb-4">
                  <Input
                    label="Account Name"
                    {...register(`accounts.${index}.name`)}
                    required
                    className="w-full mb-2"
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register(`accounts.${index}.email`)}
                    required
                    className="w-full mb-2"
                  />
                  <Password
                    label="Password"
                    {...register(`accounts.${index}.password`)}
                    required
                    className="w-full"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-2 text-red-600 border-red-600"
                      onClick={() => remove(index)}
                    >
                      <FiMinus className="mr-2" /> Remove
                    </Button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ name: "", email: "", password: "" })}
                className="text-violet-700 hover:underline text-sm"
              >
                + Add Another Account
              </button>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="bg-violet-700 text-white">
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={handleClear}>
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        </Drawer> */
}

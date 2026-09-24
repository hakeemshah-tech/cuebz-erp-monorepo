// import axiosClient from "./axiosClient";

// const uploadService = {
//   /**
//    * Upload a single file to the server.
//    * @param file - The file to upload
//    * @param folder - Optional folder path (e.g., 'employees/photos')
//    * @returns The uploaded file URL
//    */
//   upload: async (file: File, folder?: string): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     if (folder) formData.append("folder", folder);

//     const response = await axiosClient.post("/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data?.url;
//   },

//   /**
//    * Upload multiple files at once.
//    * @param files - An object of fieldName -> File
//    * @param folder - Optional folder to group uploads
//    * @returns Object mapping field names to their uploaded URLs
//    */
//   uploadMultiple: async (
//     files: Record<string, File>,
//     folder?: string
//   ): Promise<Record<string, string>> => {
//     const uploadPromises = Object.entries(files).map(
//       async ([fieldName, file]) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         if (folder) formData.append("folder", folder);
//         formData.append("fieldName", fieldName); // Optional: track per field

//         const response = await axiosClient.post("/upload", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         return { [fieldName]: response.data?.url };
//       }
//     );

//     const results = await Promise.all(uploadPromises);
//     return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
//   },
// };

// export default uploadService;

// services/uploadService.ts
// import axiosClient from "./axiosClient";

// const uploadService = {
//   upload: async (file: File, folder?: string): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", file, file.name);
//     if (folder) formData.append("folder", folder);

//     // Do NOT set Content-Type manually, Axios will handle the boundary
//     const response = await axiosClient.post("/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     // Your backend returns { file: { url: "..." } }
//     return response.data?.file?.url;
//   },

//   uploadMultiple: async (
//     files: Record<string, File>,
//     folder?: string
//   ): Promise<Record<string, string>> => {
//     const results: Record<string, string> = {};
//     for (const [fieldName, file] of Object.entries(files)) {
//       const formData = new FormData();
//       formData.append("file", file, file.name);
//       if (folder) formData.append("folder", folder);
//       formData.append("fieldName", fieldName);

//       const response = await axiosClient.post("/api/upload", formData);
//       results[fieldName] = response.data?.file?.url; // <-- fix
//     }
//     return results;
//   },
// };

// export default uploadService;

// import axiosClient from "./axiosClient";

import axios from "axios";

type PresignResponse = {
  url: string; // presigned PUT url
  key: string; // s3 object key
  publicUrl: string; // public URL (or use key if bucket is private)
};

const uploadService = {
  // Ask backend for a presigned PUT URL
  async getPresignedUrl(
    filename: string,
    contentType: string,
    folder?: string
  ) {
    const res = await axios.post<PresignResponse>(
      "http://localhost:5000/api/upload/presign",
      {
        filename,
        contentType,
        folder,
      }
    );
    return res.data;
  },

  // Upload a single file via presigned URL
  async uploadViaPresignedUrl(file: File, folder?: string) {
    const { url, key, publicUrl } = await this.getPresignedUrl(
      file.name,
      file.type || "application/octet-stream",
      folder
    );

    // PUT file directly to S3 using the presigned URL
    await axios.put(url, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
      // withCredentials must be false (default) for S3
    });

    // Return the useful bits for your app
    return { key, url: publicUrl };
  },
};

export default uploadService;

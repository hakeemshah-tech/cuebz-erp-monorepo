// // import { CreateProductInput } from '@/validators/create-product.schema';
// import isEmpty from "lodash/isEmpty";

// export function defaultValues(product?: any) {
//   return {
//     // title: product?.title ?? "",
//     // sku: product?.sku ?? "",
//     // type: product?.type ?? "",
//     // categories: product?.categories ?? "",
//     // description: product?.description ?? "",
//     // price: product?.price ?? undefined,
//     // costPrice: product?.costPrice ?? undefined,
//     // retailPrice: product?.retailPrice ?? undefined,
//     // salePrice: product?.salePrice ?? undefined,
//     // inventoryTracking: product?.inventoryTracking ?? "",
//     // currentStock: product?.currentStock ?? "",
//     // lowStock: product?.lowStock ?? "",
//     // productAvailability: product?.productAvailability ?? "",
//     // productImages: product?.productImages ?? undefined,
//     // tradeNumber: product?.tradeNumber ?? "",
//     // manufacturerNumber: product?.manufacturerNumber ?? "",
//     // brand: product?.brand ?? "",
//     // upcEan: product?.upcEan ?? "",
//     // customFields: isEmpty(product?.customFields)
//     //   ? customFields
//     //   : product?.customFields,
//     // freeShipping: product?.freeShipping ?? false,
//     // shippingPrice: product?.shippingPrice ?? undefined,
//     // locationBasedShipping: product?.locationBasedShipping ?? false,
//     // locationShipping: isEmpty(product?.locationShipping)
//     //   ? locationShipping
//     //   : product?.locationShipping,
//     // pageTitle: product?.pageTitle ?? "",
//     // metaDescription: product?.metaDescription ?? "",
//     // metaKeywords: product?.metaKeywords ?? "",
//     // productUrl: product?.productUrl ?? "",
//     // isPurchaseSpecifyDate: product?.isPurchaseSpecifyDate ?? false,
//     // isLimitDate: product?.isLimitDate ?? false,
//     // dateFieldName: product?.dateFieldName ?? "",
//     // productVariants: isEmpty(product?.productVariants)
//     //   ? productVariants
//     //   : product?.productVariants,
//     // tags: product?.tags ?? [],
//   };
// }

// // export const menuItems = [
// //   {
// //     label: 'Summary',
// //     value: 'summary',
// //   },
// //   {
// //     label: 'Images & Gallery',
// //     value: 'images_gallery',
// //   },
// //   {
// //     label: 'Pricing & Inventory',
// //     value: 'pricing_inventory',
// //   },
// //   {
// //     label: 'Product Identifiers & Custom Fields',
// //     value: 'product_identifiers',
// //   },
// //   {
// //     label: 'Shipping & Availability',
// //     value: 'shipping_availability',
// //   },
// //   {
// //     label: 'SEO',
// //     value: 'seo',
// //   },
// //   {
// //     label: 'Variant Options',
// //     value: 'variant_options',
// //   },
// // ];

// // Category option

// // Type option
// // export const typeOption = [
// //   {
// //     value: 'digital product',
// //     label: 'Digital Product',
// //   },
// //   {
// //     value: 'physical product',
// //     label: 'Physical Product',
// //   },
// // ];

// // Variant option
// // export const variantOption = [
// //   {
// //     value: 'single',
// //     label: 'Single',
// //   },
// //   {
// //     value: 'multiple',
// //     label: 'Multiple',
// //   },
// // ];

export function defaultValues(subscription?: any) {
  return {
    name: subscription?.name || "",
    description: subscription?.description || "",
    price: subscription?.price || "",
    interval: subscription?.interval || "month",
    interval_count: subscription?.interval_count || "1",
    trial_duration: 20, // Default to 20
  };
}

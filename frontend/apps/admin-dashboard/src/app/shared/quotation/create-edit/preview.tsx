"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Loader } from "rizzui";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  BlobProvider,
} from "@react-pdf/renderer";
import { PiDownloadBold } from "react-icons/pi";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/authAtom";
import customerService from "@/services/customerService";

export default function PDFPreviewModal({
  data,
  onClose,
}: {
  data: any;
  onClose: () => void;
}) {
  const [pdfData, setPdfData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 🔄 Added Loading State

  const [currentUser] = useAtom(currentUserAtom);

  // Fetch customer details by ID
  const fetchCustomerDetails = async (customerId: string) => {
    if (!customerId) return;
    setLoading(true); // Start loading
    try {
      const response = await customerService.getById(customerId);
      setCustomerDetails(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    if (data) {
      setPdfData(data);
      fetchCustomerDetails(data.customer_id);
    }
  }, [data]);

  const QuotationPDF = ({ data }: { data: any }) => (
    <>
      {loading ? ( // 🔄 Show spinner while loading
        <Loader />
      ) : (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.header}>Quotation</Text>

              {/* Header Section - From & To */}
              <View style={styles.headerContainer}>
                {/* From (Organization) */}
                <View style={styles.fromSection}>
                  <Text style={styles.label}>From:</Text>
                  <Text style={styles.subtitle}>
                    {(currentUser as any)?.selectedOrganization.name}
                  </Text>
                  <Text style={styles.text}>
                    {(currentUser as any)?.selectedOrganization.address || ""}
                  </Text>
                  <Text style={styles.text}>
                    {(currentUser as any)?.selectedOrganization.email || ""}
                  </Text>
                  <Text style={styles.text}>
                    {(currentUser as any)?.selectedOrganization.phone || ""}
                  </Text>
                </View>

                {/* To (Customer) */}
                <View style={styles.toSection}>
                  <Text style={styles.label}>To:</Text>
                  <Text style={styles.subtitle}>
                    {customerDetails?.full_name || "N/A"}
                  </Text>
                  <Text style={styles.text}>
                    {customerDetails?.email || ""}
                  </Text>
                  <Text style={styles.text}>
                    {customerDetails?.phone_number || ""}
                  </Text>
                  <Text style={styles.text}>
                    {`${customerDetails?.address?.street || ""}, ${
                      customerDetails?.address?.city || ""
                    }, ${customerDetails?.address?.state || ""}, ${
                      customerDetails?.address?.country || ""
                    }`}
                  </Text>
                </View>
              </View>

              <View style={[styles.row, { marginTop: "8px" }]}>
                <Text style={styles.label}>Proposal Number:</Text>
                <Text style={styles.value}>{data.proposal_number}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Proposal Date:</Text>
                <Text style={styles.value}>
                  {new Date(data.proposal_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Expiry Date:</Text>
                <Text style={styles.value}>
                  {data.proposal_expiry_date
                    ? new Date(data.proposal_expiry_date).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>General Information</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Proposal Title:</Text>
                <Text style={styles.value}>{data.proposal_title}</Text>
              </View>
              <Text style={[styles.label, { marginBottom: "8px" }]}>
                Proposal Details:
              </Text>
              <Text style={styles.textWrap}>{data.proposal_details}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Quotation Items</Text>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Item</Text>
                <Text style={styles.tableCell}>Description</Text>
                <Text style={styles.tableCell}>Qty</Text>
                <Text style={styles.tableCell}>Unit Price</Text>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              {data.items.map((item: any, index: number) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{item.item_name}</Text>
                  <Text style={styles.tableCell}>{item.description}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>
                    AED{item.unit_price.toFixed(2)}
                  </Text>
                  <Text style={styles.tableCell}>
                    AED{item.total_price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  AED{data.subtotal?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (5%):</Text>
                <Text style={styles.summaryValue}>
                  AED{data.vat?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontSize: 14 }]}>
                  Total:
                </Text>
                <Text style={[styles.summaryValue, { fontSize: 16 }]}>
                  AED{data.total_amount?.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Payment Terms</Text>
              <Text style={styles.value}>{data.payment_terms}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Terms and condition</Text>
              <Text style={styles.value}>{data.termsCondition}</Text>
            </View>
          </Page>
        </Document>
      )}
    </>
  );

  return (
    <Modal isOpen={!!pdfData} onClose={onClose} size="xl">
      <div className="p-6">
        {pdfData && (
          <BlobProvider document={<QuotationPDF data={pdfData} />}>
            {({ url }) => (
              <>
                <PDFViewer className="w-full h-[600px] border rounded-lg shadow-md">
                  <QuotationPDF data={pdfData} />
                </PDFViewer>
                <div className="mt-4 flex justify-end">
                  <a href={url as any} download="quotation.pdf">
                    <Button variant="outline" className="flex items-center">
                      <PiDownloadBold className="mr-2" /> Download PDF
                    </Button>
                  </a>
                </div>
              </>
            )}
          </BlobProvider>
        )}
      </div>
    </Modal>
  );
}

// 📌 **Updated PDF Styles**
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, color: "#333" },

  text: { fontSize: 12, color: "#2c3e50", marginBottom: 2 },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  fromSection: {
    width: "48%",
    padding: 8,
    borderRight: "1px solid #ccc",
  },

  toSection: {
    width: "48%",
    padding: 8,
  },

  section: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid #ddd",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingVertical: 2,
  },

  label: { fontSize: 12, color: "#7f8c8d" },
  value: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },

  textWrap: {
    fontSize: 12,
    color: "#2c3e50",
    flexWrap: "wrap",
    maxWidth: "100%",
    textAlign: "justify",
  },

  tableHeader: {
    backgroundColor: "#ecf0f1",
    fontWeight: "bold",
    padding: 6,
    fontSize: 12,
    color: "#2c3e50",
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
  },

  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 4,
    flexWrap: "wrap",
  },

  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  summaryLabel: { fontSize: 12, color: "#7f8c8d" },
  summaryValue: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
});

// 📄 **Updated Quotation PDF Component (with Improved Subtitles)**

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
    backgroundColor: "white",
    padding: 25,
    fontFamily: "Helvetica",
  },
  container: {
    flexDirection: "row",
    gap: 20,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderCollapse: "collapse",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  row: { flexDirection: "row" },
  header: {
    backgroundColor: "#305494",
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  cell: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
  },
  smallCell: { width: "25%" },
  largeCell: { width: "75%" },
});
const formatDate = (dateString) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = "2024"; // Force the year to 2024

  return `${day} ${month} ${year}`;
};
function formatXml(xml) {
  const PADDING = "  "; // two spaces for indentation
  let formatted = "";
  let pad = 0;

  // Trim leading and trailing whitespace
  xml = xml.trim();

  xml.split(/>\s*</).forEach((node) => {
    // Ignore empty nodes or extra spaces
    node = node.trim();
    if (!node) return; // Skip empty nodes

    // Adjust indentation level based on tags
    if (node.match(/^\/\w/)) pad -= 1;
    formatted += `${PADDING.repeat(Math.max(0, pad))}<${node}>\n`;
    if (node.match(/^<?\w[^>]*[^\/]$/)) pad += 1;
  });
  const result = formatted.trim();
  return result.substring(1, result.length - 1);
}

const BADevDoc = ({ formData }) => {
  return (
    <Document
      style={{ width: "100%", height: "100%" }}
      title={`BA Development ${formData.noDokumen}`}
    >
      <Page style={styles.page}>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Image
            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogokis.6e7dfc79.jpg&w=1080&q=75"
            style={styles.image}
            alt={"Logo KIS"}
          />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            PT. KLIK INDOMARET SUKSES
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {/* Logo */}
          <Image
            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogokis.6e7dfc79.jpg&w=1080&q=75"
            style={styles.image}
          />

          {/* Right-aligned text */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-end", // Align content to the right
              marginBottom: 10,
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              PT. KLIK INDOMARET SUKSES
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              IT Development
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
            // border: "2pt solid black",
            margin: 20,
            marginTop: 10,
          }}
        >
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { width: "100%" }, styles.header]}>
                Deskripsi Project
              </Text>
            </View>

            {/* Second Row */}
            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, { width: "25%" }]}>
                Nama Aplikasi/Database
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.project_name}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>Nama Penguji</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.penguji}
              </Text>
            </View>

            {/* Third Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}>Versi Program</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.version}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>Tanggal Test</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formatDate(formData.tglAwal)}
              </Text>
            </View>

            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, styles.smallCell]}>
                Nama Programer
              </Text>
              <Text style={[styles.cell, styles.largeCell]}>
                {formData.developer}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.smallCell]}>No. PRPK</Text>
              <Text style={[styles.cell, styles.largeCell]}>
                {formData.noPRPK}
              </Text>
            </View>
            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, styles.smallCell]}>PIC PRPK</Text>
              <Text style={[styles.cell, styles.largeCell]}>
                {formData.picPRPK}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.smallCell]}>
                No. Memo CPS/CIA
              </Text>
              <Text style={[styles.cell, styles.largeCell]}>
                {formData.noCPS}
              </Text>
            </View>
            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, styles.smallCell]}>PIC CPS/CIA</Text>
              <Text style={[styles.cell, styles.largeCell]}>
                {formData.picCPS}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
            margin: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Skenario Testing Program {formData.project_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
            // border: "2pt solid black",
            margin: 20,
            marginTop: 10,
          }}
        >
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text
                style={[
                  styles.cell,
                  { width: "100%", textAlign: "center" },
                  styles.header,
                ]}
              >
                INFORMASI TEST
              </Text>
            </View>

            {/* Second Row */}
            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, { width: "25%" }]}>
                Kebutuhan User
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.kebutuhanUser}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                Persyaratan Program
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.persyaratanProgram}
              </Text>
            </View>

            {/* Third Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}>Lokasi/Server</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.lokasi}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>Dependensi</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.dependensi}
              </Text>
            </View>

            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text style={[styles.cell, { width: "25%" }]}>
                Konfigurasi Program
              </Text>
              <Text style={[styles.cell, { width: "75%" }]}>
                {formData.konfigurasi}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={[styles.cell, { width: "100%", textAlign: "center" }]}
              >
                KESIMPULAN HASIL TEST
              </Text>
            </View>
            <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
              <Text
                style={[styles.cell, { width: "100%", textAlign: "center" }]}
              >
                {formData.kesimpulan}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={[styles.cell, { width: "100%", textAlign: "center" }]}
              >
                DETAIL HASIL TEST
              </Text>
            </View>
            <View style={[styles.row, styles.header]}>
              <Text style={[styles.cell, { width: "5%" }]}>No</Text>
              <Text style={[styles.cell, { width: "20%" }]}>Nama Program</Text>
              <Text style={[styles.cell, { width: "35%" }]}>Skenario Test</Text>
              <Text style={[styles.cell, { width: "20%" }]}>
                Hasil yang Diharapkan
              </Text>
              <Text style={[styles.cell, { width: "20%" }]}>Pass/Fail</Text>
            </View>
            {formData.attachments &&
              formData.attachments.map((detail, index) => (
                <View
                  key={index}
                  style={[
                    styles.row,
                    {
                      backgroundColor:
                        (index + 1) % 2 === 0 ? "#e0e4f4" : "white",
                    },
                  ]}
                >
                  <Text style={[styles.cell, { width: "5%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {detail.name}
                  </Text>
                  <Text style={[styles.cell, { width: "35%" }]}>
                    {detail.skenario}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {detail.expected}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {detail.passFail}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BADevDoc;

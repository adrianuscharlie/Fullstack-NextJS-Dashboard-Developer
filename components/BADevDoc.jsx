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
import Logo from "../public/sol.png";
const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
    backgroundColor: "white",
    padding: 25,
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
  },
  tableRow: {
    flexDirection: "row",
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
function formatDate(inputDate) {
  // Split the input date string by '/' and create a new Date object
  const parts = inputDate.split("/");
  const date = new Date(parts[2], parts[1] - 1, parts[0]); // Month is zero-based

  // Format the date
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
}

const BADevDoc = ({ formData }) => {
  console.log(formData.businessAnalyst)
  return (
      <Document
        style={{ width: "100%", height: "100%" }}
        title={`BA Development ${formData.noDokumen}`}
      >
        <Page style={styles.page}>
          <View
          style={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            padding: 20,
            paddingBottom:10,
            gap: 20,
            paddingTop: 30,
            flexGrow: 1,
          }}
        >
          <Image src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogokis.6e7dfc79.jpg&w=1080&q=75" style={styles.image} alt={"Logo KIS"} />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            PT. KLIK INDOMARET SUKSES
          </Text>
        </View>
          <View
            style={{
              flexDirection: "col",
              gap: "5",
              justifyContent: "center",
              alignItems: "center",
              padding: "10",
              marginBottom: 50,
              border: "2pt solid black",
              margin: 20,
              backgroundColor:"gray"
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              BERITA ACARA DEVELOPMENT
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              No. Dokumen : {formData.noDokumen}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "col",
              gap: "5",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
              // border: "2pt solid black",
              margin: 20,
            }}
          >
            <View style={styles.table}>
              {/* Table header */}
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>Nama Proyek</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Partner</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Tanggal</Text>
                </View>
              </View>
              {/* Table rows */}
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{formData.project_name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{formData.partner}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{formData.date}</Text>
                </View>
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
            <View style={styles.table}>
              {/* Table header */}
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text styles={styles.tableHeading}>Informasi</Text>
                </View>
              </View>
              {/* Table rows */}
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "25%" }}>
                  <Text styles={styles.tableHeading}>Program Terkait</Text>
                </View>
                <View style={{ ...styles.tableCell, width: "75%" }}>
                  <Text>{formData.programTerkait}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "25%" }}>
                  <Text styles={styles.tableHeading}>Versi</Text>
                </View>
                <View style={{ ...styles.tableCell, width: "75%" }}>
                  <Text>{formData.version}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "25%" }}>
                  <Text styles={styles.tableHeading}>Jenis Transaksi</Text>
                </View>
                <View style={{ ...styles.tableCell, width: "75%" }}>
                  <Text>{formData.jenisTransaksi}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "25%" }}>
                  <Text styles={styles.tableHeading}>Deskripsi</Text>
                </View>
                <View style={{ ...styles.tableCell, width: "75%" }}>
                  <Text>{formData.deskripsi}</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "col",
              gap: "5",
              justifyContent: "center",
              alignItems: "center",
              padding: "10",
              marginBottom: 50,
              border: "1pt solid black",
              margin: 20,
            }}
          >
            <Text style={styles.text}>
            {formData.message}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "col",
              gap: "5",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
              // border: "2pt solid black",
              margin: 20,
            }}
          >
            <View style={styles.table}>
              {/* Table header */}
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text styles={styles.tableHeading}>Dokumen Terlampir</Text>
                </View>
              </View>
              {/* Table rows */}
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCell, paddingLeft: 40 }}>
                  {formData.dokumen.split("\n").map((doc, index) => (
                    <Text key={index + 1} styles={styles.text}>
                      {index + 1}. {doc}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Page>
        <Page break style={styles.page}>
          <View
            style={{
              // justifyContent: "center",
              // alignItems: "flex-end",
              marginBottom: 50,
              border: "1pt solid black",
              margin: 20,
              fontSize: 12,
              padding: 10,
            }}
          >
            <View
              style={{
                justifyContent: "end",
                alignItems: "flex-end",
                marginBottom: 50,
                margin: 20,
                fontSize: 12,
              }}
            >
              <Text style={{ marginBottom: 100, textAlign: "right" }}>
                Jakarta, {formatDate(formData.date)}
              </Text>
              <Text style={{ textAlign: "right" }}>{formData.developer}</Text>
              <Text>Software Developement</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
                margin: 20,
                fontSize: 12,
              }}
            >
              <Text>Diketahui Oleh</Text>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                textAlign: "justify",
                marginTop: 50,
                margin: 20,
                fontSize: 12,
                flexDirection: "row",
                paddingTop: 60,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  margin: 20,
                  fontSize: 12,
                }}
              >
                <Text>{formData.businessAnalyst}</Text>
                <Text>Business Analyst</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  margin: 20,
                  fontSize: 12,
                }}
              >
                <Text>{formData.manager}</Text>
                <Text>Software Development Manager</Text>
              </View>
            </View>
          </View>
        </Page>

        <Page break style={styles.page}>
          <View
            style={{
              justifyContent: "start",
              alignItems: "start",
              marginBottom: 50,
              border: "1pt solid black",
              margin: 20,
              fontSize: 12,
              padding: 10,
            }}
          >
            <Text>{formData.attachment}</Text>
          </View>
        </Page>
      </Document>
  );
};

export default BADevDoc;

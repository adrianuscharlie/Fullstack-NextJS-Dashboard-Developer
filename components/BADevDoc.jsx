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
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  attachmentTable: {
    display: "table",
    width: "100%",
    fontSize:10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  attachmentRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  cellNo: {
    padding: 5,
    flex: 0.5, // Makes this column narrower
    textAlign: "start",
  },
  cellAttachment: {
    padding: 5,
    flex: 10, // Increases width for this column
    textAlign: "start",

  },
  cellKeterangan: {
    padding: 5,
    flex: 1, // Keeps this column narrower

  },
  imageContainer: {
    justifyContent: "start",
  },
  imageAttachment: {
    marginVertical: 2,
  },
  plainText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  xmlText: {
    fontSize: 10,
    whiteSpace: "pre-line",
    lineHeight: 1.5,
    padding: 5,
  },
  generalText: {

    fontSize: 8,
    whiteSpace: 'pre-wrap', // Preserve whitespace for formatting
    margin: 10,
  },
});

function formatXml(xml) {
  const PADDING = '  '; // two spaces for indentation
  let formatted = '';
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
  const result=formatted.trim()
  return result.substring(1,result.length-1)
}


const BADevDoc = ({ formData }) => {
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
            paddingBottom: 10,
            paddingBottom: 10,
            gap: 20,
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
            marginTop: 0,
            backgroundColor: "gray",
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
            marginBottom: 30,
            // border: "2pt solid black",
            margin: 20,
            marginTop: 10,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Nama Proyek</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Partner</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Tanggal</Text>
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
                <Text>{formData.tglAwal.split("-").reverse().join("-")}</Text>
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
                <Text style={styles.tableHeading}>Informasi</Text>
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
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Kategori Pengembangan / Perubahan</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.kategori}</Text>
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
          <Text style={styles.text}>{formData.message}</Text>
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
                <Text styles={{ fontWeight: "bold" }}>Dokumen Terlampir</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, paddingLeft: 40 }}>
                {formData.attachments.map((doc, index) => (
                  <Text key={index + 1} styles={styles.text}>
                    {index + 1}. {doc.title}
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
              Jakarta, {formData.tglAkhir.split("-").reverse().join("-")}
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

      <Page size="A4" renderTextLayer={false} style={styles.page} >
        <Text style={styles.title}>Lampiran</Text>
        <View style={styles.attachmentTable}>
          <View style={styles.attachmentRow}>
            <Text style={styles.cellNo}>No</Text>
            <Text style={styles.cellAttachment}>Lampiran</Text>
          </View>
          {formData.attachments.map((attachment, index) => (
            <View style={styles.attachmentRow} key={index}>
              <Text style={styles.cellNo}>{index + 1}</Text>
              <View style={styles.cellAttachment}>
                {attachment.images && attachment.images.length > 0 ? (
                  <View style={styles.imageContainer}>
                    <Text style={{ marginBottom: 10 }}>{attachment.title}</Text>
                    {attachment.images.map((image, imgIndex) => (
                      <Image
                        key={imgIndex}
                        style={styles.imageAttachment}
                        src={image}
                      />
                    ))}
                    <Text key={index} style={styles.xmlText}>{formatXml(attachment.description)}</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                      {attachment.title}
                    </Text>
                    <Text key={index} style={styles.xmlText}>{formatXml(attachment.description)}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default BADevDoc;
